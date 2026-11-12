// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";
import { privateEncrypt } from "node:crypto";

// This endpoint uses 'publishable' | 'secret' access, apiKey is required.
// Use publishable for Client-facing, key-validated endpoints
// Use secret for Server-to-server, internal calls
export default {
  fetch: withSupabase(
    {
      auth: ["publishable", "secret"],
      cors: {
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5000",
          "Access-Control-Allow-Headers":
            "authorization, x-client-info, apikey, content-type, x-retry-count, traceparent, tracestate, baggage",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        }
      }
    },
    async (req, ctx) => {
      if (req.method !== "POST") {
        return Response.json(
          { error: "Method Not Allowed" },
          { status: 405 }
        );
      }

      const { categories } = await req.json();

      console.log("Categories: ", categories);

      if (!categories) {
        return Response.json(
          { error: "Category is required" },
          { status: 400 }
        );
      }

      const { data, error } = await ctx.supabase.rpc(
        "get_problems_by_categories",
        {
          category_ids: categories.array
        }
      );

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        return Response.json(
          { error: "Query returned no results" },
          { status: 400 }
        );
      }

      console.log("Data: ", data);

      return Response.json(
        { success: true, sample: data },
        { status: 200 }
      );
    }
  ),
};

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/random_problem' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
    --data '{"name":"Functions"}'

*/
