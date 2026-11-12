import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://wjhbtxlpejfahukzihfu.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ta1BRz8YbH0A5g3nOyQ5zw_e_ALNd81'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function random_problem(category_list) {
    return await supabase.functions.invoke('random-problem', {
        body: { categories: category_list }
    });
}