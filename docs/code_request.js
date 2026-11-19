import { random_problem } from './supabase.js';
import { resetBackground, toggleAnswerCbox, setSheet } from './code_submit.js';

globalThis.problem_id = null;
globalThis.output = null;

function cleanup(code) {
    if (code[0] === '`') {
        code = code.slice(code.indexOf("#"), -4);
    }

    const markers = [
        "/* MAIN CODE */",
        "/* APPENDIX 1 */",
        "/* APPENDIX 2 */"
    ];

    for (const marker of markers) {
        code = code.replaceAll(marker, "");
    }

    const ind = code.search(/[^\n]/);
    code = code.substring(ind);
    return code;
}

async function requestData() {
    const checkboxes = getCheckedCategories();
    const generatedDataset = document.getElementById('dataset-select').value == "generated";

    const ids = Array.from(checkboxes, checkbox => checkbox.id);
    var inputCategories = ids.map(cat => cat.substring(2));
    var format = inputCategories.filter(category =>
        ["main_only", "multiple_functions_for_execution"].includes(category)
    );
    // both deselected
    if (format.length == 0) {
        format = ["main_only", "multiple_functions_for_execution"];
    }
    inputCategories = inputCategories.filter(category =>
        !["main_only", "multiple_functions_for_execution"].includes(category)
    );

    console.log(inputCategories, format);

    const { data, error } = await random_problem(inputCategories, format, generatedDataset);
    console.log("Got",data,error);
    if (data == null)
        return { code: data, categories: error };

    let code = data['data'].code;
    globalThis.output = data['data'].output;
    code = cleanup(code);
    let categories = data["categories"].map(cat => nameFromID(cat["id_text_category"]));

    categories = categories.filter(c => c != null && c != '');

    globalThis.problem_id = data['data'].id;
    return { code, categories };
}

async function onNextBtnClick() {
    // set loading screen text
    document.getElementById('code').disabled = true;
    document.getElementById('code').innerHTML = "Loading...";
    const { code, categories } = await requestData();
    console.log("Got",code, categories);
    
    // remove loading screen text
    document.getElementById('code').disabled = false;
    if (code ==  null) {
        // error stored in categories
        document.getElementById('code').innerHTML = "Error: " + categories;
        return;
    }

    document.getElementById('code').innerHTML = code;
    document.getElementById('categories').innerHTML = categories.join(', ');


    document.getElementById('verifyBtn').disabled = false;

    // set show solution checkbox to false
    const checkbox = document.getElementById('solution');
    checkbox.disabled = true;
    console.log(checkbox.checked);
    if (checkbox.checked) {
        toggleAnswerCbox();
    }

    // reset bg
    resetBackground();

    // reset text
    setSheet(Array.from({ length: 6 }, () => Array(30).fill(' ')));
}


document.getElementById('nextBtn').addEventListener('click', onNextBtnClick);

document.addEventListener('DOMContentLoaded', onNextBtnClick);