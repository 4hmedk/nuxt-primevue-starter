import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const runtimeConfig = useRuntimeConfig();
const appName = runtimeConfig.public.APP_NAME;
const lemonSqueezyApiKey = runtimeConfig.LEMONSQUEEZY_API_TEST_KEY_1;
const lemonSqueezyStoreId = runtimeConfig.public.LEMONSQUEEZY_TEST_STORE_ID;
const lemonSqueezyWebhookSecret = runtimeConfig.LEMONSQUEEZY_WEBHOOK_SECRET;

function createSupabaseClient(key) {
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

const sbCreatePlan = async (supabase, userId, type) => {
  try {
    const { data, error } = await supabase
      .from(`${appName}-plans`)
      .insert({
        active: false,
        provider: "lemonsqueezy",
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

const sbUpdatePlan = async (supabase, plan) => {
  try {
    const { data, error } = await supabase
      .from(`${appName}-plans`)
      .update({
        active: plan.active,
        data: plan.data,
      })
      .eq("id", plan.id)
      .select();
    if (error) throw error;
    console.log("updated plan:", data[0]);
    return data[0];
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

const createCheckout = async (event) => {
  const body = await readBody(event);
  const { user_id, jwt, email, full_name } = body;
  const supabase = createSupabaseClient({ jwt: jwt });

  const sbOrder = await sbCreatePlan(supabase, user_id, "order");

  const response = await $fetch("https://api.lemonsqueezy.com/v1/checkouts", {
    method: "POST",
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${lemonSqueezyApiKey}`,
    },
    body: {
      data: {
        type: "checkouts",
        relationships: {
          store: {
            data: {
              type: "stores",
              id: lemonSqueezyStoreId.toString(),
            },
          },
          variant: {
            data: {
              type: "variants",
              id: "537737",
            },
          },
        },
        attributes: {
          product_options: {
            redirect_url: `${runtimeConfig.public.BASE_URL}/app/home`,
          },
          checkout_options: {
            embed: true,
            dark: true,
            logo: false,
            button_color: "#111",
          },
          checkout_data: {
            email: email,
            name: full_name,
            custom: {
              user_id: user_id.toString(),
              row_id: sbOrder.id.toString(),
            },
          },
        },
      },
    },
  }).catch((error) => {
    console.error(error);
    return null;
  });

  console.log(response.data);

  const updatedOrder = await sbUpdatePlan(supabase, {
    id: sbOrder.id,
    active: false,
    data: response.data,
  });
  return { order: updatedOrder };
};

const verifyWebhookSignature = (rawBody, signature) => {
  // console.log(lemonSqueezyWebhookSecret);
  // console.log(rawBody);
  const hmac = crypto.createHmac("sha256", lemonSqueezyWebhookSecret);
  const digest = hmac.update(rawBody).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
};

const handleWebhook = async (event) => {
  const body = await readBody(event);
  const rawBody = await readRawBody(event);
  const signature = event.node.req.headers["x-signature"];

  if (!verifyWebhookSignature(rawBody, signature)) {
    throw createError({ statusCode: 403, statusMessage: "Invalid signature" });
  }

  const { meta, data } = body;
  const customData = meta.custom_data;
  const supabase = createSupabaseClient({ signature: signature }); // Use appropriate authentication method

  switch (meta.event_name) {
    case "order_created":
      await sbUpdatePlan(supabase, {
        id: customData.row_id,
        active: data.attributes.status === "paid",
        data: data,
      });
      break;
    case "order_refunded":
      await sbUpdatePlan(supabase, {
        id: customData.row_id,
        active: false,
        data: data,
      });
      break;
    // Add more cases for other webhook events as needed
  }

  return { message: "Webhook processed successfully" };
};

export default defineEventHandler(async (event) => {
  const endpoint = getRouterParam(event, "lemonsqueezyEndpoint");

  switch (endpoint) {
    case "hello":
      return { hello: "world" };
    case "createCheckout":
      return await createCheckout(event);
    case "webhook":
      return await handleWebhook(event);
    default:
      throw createError({ statusCode: 404, statusMessage: "Route not found" });
  }
});
