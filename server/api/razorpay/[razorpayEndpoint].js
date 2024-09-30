import Razorpay from "razorpay";
import crypto from "crypto";
import _ from "lodash";
import { createClient } from "@supabase/supabase-js";
// import { useRuntimeConfig } from "#app";

// import pixel from '~/lib/pixel.js';  // Adjust the path as necessary

const dev = process.env.NODE_ENV === "development";
const runtimeConfig = useRuntimeConfig();
const app_name = runtimeConfig.public.APP_NAME;

const razorpay = new Razorpay({
  key_id: dev
    ? runtimeConfig.public.RAZORPAY_TEST_KEY_ID
    : runtimeConfig.public.RAZORPAY_KEY_ID,
  key_secret: dev
    ? runtimeConfig.RAZORPAY_TEST_KEY_SECRET
    : runtimeConfig.RAZORPAY_KEY_SECRET,
});

function createAuth(key) {
  const supabaseUrl = runtimeConfig.public.SUPABASE_URL;
  const supabaseKey = runtimeConfig.public.SUPABASE_KEY;
  if (key.jwt) {
    return createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: `Bearer ${key.jwt}` } },
    });
  } else if (key.signature) {
    //signature has already been verified
    //use service key
    return createClient(supabaseUrl, runtimeConfig.SUPABASE_SERVICE_KEY);
  } else {
    console.error("no jwt or signature found");
    return null;
  }
}

// Validate Webhook Signature
// const validateWebhookSignature = (req, res) => {
//   const secret = process.env.WEBHOOK_SECRET;
//   const hmac = crypto.createHmac("sha256", secret);
//   const signature = req.headers["x-razorpay-signature"];
//   const generatedSignature = hmac.update(req.rawBody).digest("hex");

//   if (signature === generatedSignature) {
//     return true;
//   }
//   return false;
// };

// Supabase helper functions using `serverSupabaseClient`
const sb_create_plan = async (supabase, userId, type) => {
  try {
    const { data, error } = await supabase
      .from(`${app_name}-plans`)
      .insert({
        active: false,
        provider: "razorpay",
        type,
        data: null,
        refund: null,
        user_id: userId,
      })
      .select();
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

const sb_update_plan = async (supabase, plan) => {
  try {
    const { data, error } = await supabase
      .from(`${app_name}-plans`)
      .update({
        active: plan.active,
        data: plan.data,
      })
      .eq("id", plan.id)
      .select();
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error(error.message);
    return null;
  }
};
// Example function to create a subscription
export const createSubscription = async (event, supabase) => {
  const body = await readBody(event);
  const { user_id, jwt, plan_id, start_at } = body;

  const sb_subscription = await sb_create_plan(
    supabase,
    user_id,
    "subscription"
  );

  const params = {
    plan_id,
    total_count: 12,
    quantity: 1,
    customer_notify: 1,
    start_at,
    notes: {
      user_id,
      row_id: sb_subscription.id,
    },
  };

  try {
    const response = await razorpay.subscriptions.create(params);
    const updatedSubscription = await sb_update_plan(supabase, user_id, {
      active: false,
      data: response,
      id: sb_subscription.id,
    });
    return { subscription: updatedSubscription };
  } catch (error) {
    console.error(error);
    return { error };
  }
};

export async function updateSubscription(event, supabase) {
  const body = await readBody(event);
  const { subscription, jwt } = body;

  try {
    const rp_subscription = await razorpay.subscriptions.fetch(
      subscription.data.id
    );
    subscription.data = rp_subscription;
    subscription.active = ["authenticated", "active"].includes(
      rp_subscription.status
    );

    await sb_update_plan(supabase, subscription.user_id, subscription);
    return { subscription };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

/**
 * Creates a new order in Razorpay and saves it in the Supabase DB
 * @param {import('http').IncomingMessage} event - The incoming HTTP request
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - The Supabase client
 * @returns {Promise<{ order: { id: string, data: any, active: boolean } } | { error: any }>} - The created order or an error
 */
export async function createOrder(event, supabase) {
  const body = await readBody(event);
  const { user_id, jwt, duration } = body;
  const sb_order = await sb_create_plan(supabase, user_id, "order");
  console.log(sb_order);
  const expires_at = new Date(sb_order.created_at);
  expires_at.setMonth(expires_at.getMonth() + duration);

  const amount = 10000; //duration === 6 ? 6 * 59900 : duration * 49900;

  const params = {
    amount,
    currency: "INR",
    // receipt: `receipt_${user_id}`,
    notes: {
      user_id,
      row_id: sb_order.id,
      duration,
      expires_at,
      app_name: useRuntimeConfig().public.APP_NAME,
    },
  };

  try {
    const response = await razorpay.orders.create(params);
    const new_sb_order = await sb_update_plan(supabase, {
      active: false,
      data: response,
      id: sb_order.id,
    });
    console.log(new_sb_order);
    const res = event.node.res;
    res.statusCode = 200;
    return { order: new_sb_order };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

/**
 * Gets Razorpay order object from Razorpay API for frontend use and also updates it on supabase
 * @param {import('http').IncomingMessage} event - The incoming HTTP request
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase - The Supabase client
 * @returns {Promise<{ order: any } | { error: any }>} - The verified order or an error
 */
export async function verifyOrder(event, supabase) {
  const body = await readBody(event);
  const { rp_order_id, sb_order_id } = body;
  console.log(sb_order_id);
  let sb_order = {};

  try {
    const rp_order = await razorpay.orders.fetch(rp_order_id);
    sb_order.data = rp_order;
    sb_order.active = ["paid", "attempted"].includes(rp_order.status);
    sb_order.id = sb_order_id;
    console.log(sb_order);
    await sb_update_plan(supabase, sb_order);

    return { order: sb_order };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function webhookUpdateSubscription(event) {
  const body = await readBody(event);
  const rp_subscription = _.cloneDeep(body.payload.subscription.entity);
  rp_subscription.notes.src = "webhook";

  try {
    const supabase = serverSupabaseServiceRole(event);
    const active = ["authenticated", "active"].includes(rp_subscription.status);
    const subscription = await sb_update_plan(
      supabase,
      rp_subscription.notes.user_id,
      {
        data: rp_subscription,
        id: rp_subscription.notes.row_id,
        active,
      }
    );
    return { message: "success", subscription };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function webhookUpdateOrder(event) {
  const body = await readBody(event);
  const rp_order = _.cloneDeep(body.payload.order.entity);
  rp_order.notes.src = "webhook";

  try {
    const supabase = serverSupabaseServiceRole(event);
    const active = ["paid", "attempted"].includes(rp_order.status);
    const order = await sb_update_plan(supabase, rp_order.notes.user_id, {
      data: rp_order,
      id: rp_order.notes.row_id,
      active,
    });
    return { message: "success", order };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function createRefundHandler(event, supabase) {
  const body = await readBody(event);
  const { order, jwt } = body;

  try {
    const payments = await razorpay.orders.fetchPayments(order.data.id);
    const payment = payments.items.find((p) => p.status === "captured");

    if (!payment) {
      return { error: "No payment found" };
    }

    const diff_days = Math.round(
      (Date.now() - payment.created_at * 1000) / (1000 * 3600 * 24)
    );
    if (diff_days > 10) {
      return { error: "Payment not eligible for refund" };
    }

    try {
      const refund = await razorpay.payments.refund(payment.id);
      const new_order = await sb_update_plan(supabase, order.user_id, {
        ...order,
        active: false,
        refund,
      });

      return { refund: new_order };
    } catch (error) {
      console.error(error);
      return { error: "Error refunding the order." };
    }
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export async function webhookUpdateRefund(event) {
  const body = await readBody(event);
  const rp_payment = body.payload.payment.entity;
  const rp_refund = body.payload.refund.entity;

  try {
    const supabase = serverSupabaseServiceRole(event);
    const order = await sb_update_plan(supabase, rp_payment.notes.user_id, {
      id: rp_payment.notes.row_id,
      active: rp_refund.status === "processed",
      refund: rp_refund,
    });
    return { message: "success", order };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

export default defineEventHandler(async (event) => {
  const req = event.node.req;
  const res = event.node.res;
  const body = await readBody(event); // equivalent of `req.body`
  console.log(`${req.method}: ${req.url}`);
  const runtimeConfig = useRuntimeConfig();
  const supabase = createAuth({ jwt: body.jwt });

  const intent = getRouterParam(event, "razorpayEndpoint");
  if (req.method === "POST") {
    switch (intent) {
      // case "/api/payment/createSubscription":
      //   return await createSubscription(event, supabase);
      // case "/api/payment/updateSubscription":
      //   return await updateSubscription(event, supabase);
      case "createOrder":
        console.log("creating order....");
        return await createOrder(event, supabase);

      case "verifyOrder":
        return await verifyOrder(event, supabase);
      // case "/api/payment/webhookUpdateSubscription":
      //   if (validateWebhookSignature(req, res)) {
      //     return await webhookUpdateSubscription(event);
      //   }
      //   res.statusCode = 403;
      //   res.end("Invalid signature");
      //   break;
      // case "/api/payment/webhookUpdateOrder":
      //   if (validateWebhookSignature(req, res)) {
      //     return await webhookUpdateOrder(event);
      //   }
      //   res.statusCode = 403;
      //   res.end("Invalid signature");
      //   break;
      // case "/api/payment/createRefund":
      //   return await createRefund(event, supabase);
      // case "/api/payment/webhookUpdateRefund":
      //   if (validateWebhookSignature(req, res)) {
      //     return await webhookUpdateRefund(event);
      //   }
      //   res.statusCode = 403;
      //   res.end("Invalid signature");
      //   break;
      default:
        res.statusCode = 404;
        res.end("Route not found");
        break;
    }
  } else {
    res.statusCode = 405;
    res.end("Method not allowed");
  }
});
