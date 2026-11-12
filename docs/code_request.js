import { random_problem } from './supabase.js';

async function requestData() {
    const checkboxes = getCheckedCategories();

    const ids = Array.from(checkboxes, checkbox => checkbox.id);
    const categories = ids.map(cat => cat.substring(2));
    console.log(categories);

    const { data, error } = random_problem(categories);
    console.log(data, error);
}


document.getElementById('nextBtn').addEventListener('click', requestData);