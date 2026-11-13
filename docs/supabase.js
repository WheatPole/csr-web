import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://wjhbtxlpejfahukzihfu.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ta1BRz8YbH0A5g3nOyQ5zw_e_ALNd81'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// formatting_list - main_only, multiple_functions
export async function random_problem(category_list, formatting_list, generated) {
    const { data, error } = await supabase.functions.invoke('random_problem', {
        body: { categories: category_list, formatting: formatting_list, gen: generated },
    });
    console.log("Returned:",data,error);
    return data;
}
