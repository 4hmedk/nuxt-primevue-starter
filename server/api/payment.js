import Razorpay from "razorpay";
import crypto from "crypto";
import _ from "lodash";
// import pixel from '~/lib/pixel.js';  // Adjust the path as necessary

const dev = process.env.NODE_ENV === "development";
const app_name = process.env.APP_NAME;

const razorpay = new Razorpay({
  key_id: dev ? process.env.RAZORPAY_TEST_KEY_ID : process.env.RAZORPAY_KEY_ID,
  key_secret: dev
    ? process.env.RAZORPAY_TEST_KEY_SECRET
    : process.env.RAZORPAY_KEY_SECRET,
});

// Validate Webhook Signature
const validateWebhookSignature = (req, res) => {
  const secret = process.env.WEBHOOK_SECRET;
  const hmac = crypto.createHmac("sha256", secret);
  const signature = req.headers["x-razorpay-signature"];
  const generatedSignature = hmac.update(req.rawBody).digest("hex");

  if (signature === generatedSignature) {
    return true;
  }
  return false;
};

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

const sb_update_plan = async (supabase, userId, plan) => {
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
const createSubscription = async (event, supabase) => {
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

async function updateSubscription(event, supabase) {
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

async function createOrder(event, supabase) {
  const body = await readBody(event);
  const { user_id, jwt, duration } = body;

  const sb_order = await sb_create_plan(supabase, user_id, "order");
  const expires_at = new Date(sb_order.created_at);
  expires_at.setMonth(expires_at.getMonth() + duration);

  const amount = duration === 6 ? 6 * 59900 : duration * 49900;

  const params = {
    amount,
    currency: "INR",
    receipt: `receipt_${user_id}`,
    notes: {
      user_id,
      row_id: sb_order.id,
      duration,
      expires_at,
    },
  };

  try {
    const response = await razorpay.orders.create(params);
    const new_sb_order = await sb_update_plan(supabase, user_id, {
      active: false,
      data: response,
      id: sb_order.id,
    });
    return { order: new_sb_order };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

async function verifyOrder(event, supabase) {
  const body = await readBody(event);
  const { order, jwt } = body;

  try {
    const rp_order = await razorpay.orders.fetch(order.data.id);
    order.data = rp_order;
    order.active = ["paid", "attempted"].includes(rp_order.status);

    await sb_update_plan(supabase, order.user_id, order);

    if (rp_order.status === "paid") {
      pixel.createFBConversionEvent(event, rp_order);
    }

    return { order };
  } catch (error) {
    console.error(error);
    return { error };
  }
}

async function webhookUpdateSubscription(event) {
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

async function webhookUpdateOrder(event) {
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

async function createRefundHandler(event, supabase) {
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

async function webhookUpdateRefund(event) {
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
  const supabase = await serverSupabaseClient(event); // Get the Supabase client

  if (req.method === "POST") {
    switch (req.url) {
      case "/api/payment/createSubscription":
        return await createSubscription(event, supabase);
      case "/api/payment/updateSubscription":
        return await updateSubscription(event, supabase);
      case "/api/payment/createOrder":
        return await createOrder(event, supabase);
      case "/api/payment/verifyOrder":
        return await verifyOrder(event, supabase);
      case "/api/payment/webhookUpdateSubscription":
        if (validateWebhookSignature(req, res)) {
          return await webhookUpdateSubscription(event);
        }
        res.statusCode = 403;
        res.end("Invalid signature");
        break;
      case "/api/payment/webhookUpdateOrder":
        if (validateWebhookSignature(req, res)) {
          return await webhookUpdateOrder(event);
        }
        res.statusCode = 403;
        res.end("Invalid signature");
        break;
      case "/api/payment/createRefund":
        return await createRefund(event, supabase);
      case "/api/payment/webhookUpdateRefund":
        if (validateWebhookSignature(req, res)) {
          return await webhookUpdateRefund(event);
        }
        res.statusCode = 403;
        res.end("Invalid signature");
        break;
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
