const SUPABASE_URL = 'https://wjhbtxlpejfahukzihfu.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ta1BRz8YbH0A5g3nOyQ5zw_e_ALNd81'
//const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

const esm_url = "https://esm.sh/@supabase/supabase-js@2";

let supabaseClient = null;
let createClientFn = null;


async function loadSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  if (!createClientFn) {
    try {
        const mod = await import(esm_url);
        createClientFn = mod.createClient;
    }
    catch (err) {
        return err?.message;
    }
  }

  supabaseClient = createClientFn(SUPABASE_URL, SUPABASE_KEY);
  return null;
}

// formatting_list - main_only, multiple_functions
export async function random_problem(category_list, formatting_list, generated) {

    if (!supabaseClient) {
        const res = await loadSupabaseClient();
        if (res) {
            return {data: null, error: res};
        }
    }
    try {
        const { data, error } = await supabaseClient.functions.invoke('random_problem', {
            body: { categories: category_list, formatting: formatting_list, gen: generated },
        });
        console.log("Returned:",data,error);
        return { data, error };
    }
    catch (err) {
        return { data:null, error:err };
    }
}
