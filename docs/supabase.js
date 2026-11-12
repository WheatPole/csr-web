import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://wjhbtxlpejfahukzihfu.supabase.co'
const SUPABASE_KEY = 'sb_publishable_ta1BRz8YbH0A5g3nOyQ5zw_e_ALNd81'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export async function random_problem(category_list, generated) {
    // todo: do data validation here
    const { data, error } = await supabase.functions.invoke('random_problem', {
        body: { categories: category_list, gen: generated },
    });
    console.log("Returned:",data,error);
    return data;
}

export async function validate_answer(char_sheet, p_id) {
    const { data, error } = await supabase.functions.invoke('validate_answer', {
        body: { char_sheet: char_sheet, problem_id: p_id },
    });
    console.log("Returned:",data,error);
    return data;
}