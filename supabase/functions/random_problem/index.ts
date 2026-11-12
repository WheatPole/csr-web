// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // or restrict to "https://wheatpole.github.io"
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: corsHeaders });

const handler = withSupabase(
  { auth: ["publishable", "secret"] },
  async (req, ctx) => {
    if (req.method !== "POST") {
      return json({ error: "Method Not Allowed" }, 405);
    }

    const { categories, gen } = await req.json();

    if (!categories) {
      return json({ error: "Category is required" }, 400);
    }

    const { data, error } = await ctx.supabase.rpc(
      "get_problems_by_categories",
      { category_ids: categories, gen: gen }
    );

    if (error) {
      return json({ error: error.message }, 500);
    }

    if (!data || data.length === 0) {
      return json({ error: "Query returned no results" }, 400);
    }

    let ind = Math.floor(Math.random() * data.length);
    if (ind >= data.length) ind = data.length - 1;
    if (ind < 0) ind = 0;
    const result = data[ind];
    
    const { data: cats, error: error1 } = await ctx.supabase.rpc(
      'get_problem_categories',
      { p_id_problem: result["id"] }
    );

    return json({ success: true, data: result, categories: cats });
  }
);

export default {
  fetch: (req: Request, ...rest: unknown[]) => {
    // Answer preflight before auth ever sees it
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }
    // deno-lint-ignore no-explicit-any
    return (handler as any)(req, ...rest);
  },
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/random_problem' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
    --data '{"categories":['multi_file', 'main_only']}'

*/
