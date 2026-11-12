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

    const max_width = 20;
    const max_height = 6;

    const { char_sheet, problem_id } = await req.json();

    if (!char_sheet) {
      return json({ error: "Sheet is required" }, 400);
    }

    const arr_sheet = char_sheet;

    if (arr_sheet.length != max_height) {
      return json({ error: "Bad sheet size" }, 400);
    }
    if (!problem_id) {
      return json({ error: "Problem ID is required" }, 400);
    }

    const { data, error } = await ctx.supabase.from('problems')
      .select('output')
      .eq('id', problem_id);

    if (error) {
      return json({ error: error.message }, 500);
    }

    if (!data || data.length === 0 || !data[0].output) {
      return json({ error: "Query returned no results" }, 400);
    }

    const str = data[0].output;
    let arr = str.split("\n");

    arr = arr.map((s: string) => {
      s = s.replace(/[^\x20-\x7E]/g, ' ');
      if (s.length < max_width) {
        s = s.padEnd(max_width, ' ');
      }
      else if (s.length > max_width) {
        s = s.substring(0, max_width);
      }
      return s;
    });

    if (arr.length > max_height) {
      arr = arr.slice(0, max_height);
    }
    else if (arr.length < max_height) {
      while (arr.length < max_height) {
        arr.push(' '.repeat(max_width));
      }
    }

    const result = Array.from({ length: max_height }, () => Array(max_width).fill(false));

    for (var i = 0; i < arr_sheet.length; i++) {
      for (var j = 0; j < arr_sheet[i].length && j < max_width; j++) {
        result[i][j] = (arr_sheet[i][j] == arr[i][j]);
      }
    }

    return json({ success: true, data: { result, arr} });
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/validate_answer' \
    --header 'apiKey: sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH' \
    --data '{"name":"Functions"}'

*/
