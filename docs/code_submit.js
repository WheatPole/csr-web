import { validate_answer } from './supabase.js';

var binarySheet = null;
var sheetCache = null;
var answerSheet = null;
globalThis.answerShown = false;

const checkbox = document.getElementById('solution');

function getSheet() {
    const rows = document.querySelectorAll("#tableContainer tbody tr");

    return Array.from(rows, (row) =>
        Array.from(row.querySelectorAll("input"), (input) => input.value || " ")
    ).map((row) => row.join(""));
}

export function resetBackground() {
    const inputs = document.querySelectorAll("#tableContainer input");

    inputs.forEach((input) => {
        if (input.classList.contains("correct")) {
            input.classList.remove("correct");
        }
        else if (input.classList.contains("wrong")) {
            input.classList.remove("wrong");
        }
    });
}

function updateBackground(correct) {
    const inputs = document.querySelectorAll("#tableContainer input");
    resetBackground();
    inputs.forEach((input) => {
        const row = Number(input.dataset.row);
        const col = Number(input.dataset.col);
        if (correct[row][col]) {
            input.classList.add("correct");
        }
        else {
            input.classList.add("wrong");
        }
    });
}

async function checkData() {
    let id = globalThis.problem_id;
    const sheet = getSheet();
    console.log(id);
    let data = await validate_answer(sheet, id);
    binarySheet = data['data'].result;
    answerSheet = data['data'].arr;
    resetBackground();
    updateBackground(binarySheet);
    checkbox.disabled = false;
}

export function setSheet(sheet) {
    const inputs = document.querySelectorAll("#tableContainer input");
    console.log(sheet);
    inputs.forEach((input) => {
        const row = Number(input.dataset.row);
        const col = Number(input.dataset.col);

        const char = sheet[row][col];

        input.value = char;
    });
}

function setSheetLocked(locked) {
    const inputs = document.querySelectorAll("#tableContainer input");

    inputs.forEach((input) => {
        input.readOnly = locked; 
    });

    document.querySelector("#tableContainer").classList.toggle("locked", locked);
}

export function toggleAnswerCbox() {
    checkbox.checked = !checkbox.checked;
    toggleAnswer();
}

function toggleAnswer() {
    // show answer
    if (!answerShown) {
        sheetCache = getSheet();
        setSheet(answerSheet);
        setSheetLocked(true);
        updateBackground(Array.from({ length: 6 }, () => Array(30).fill(true)));
    }
    // hide answer
    else {
        if (sheetCache) {
            setSheet(sheetCache);
        }
        setSheetLocked(false);
        updateBackground(binarySheet);
    }
    answerShown = !answerShown;
}



document.getElementById('verifyBtn').addEventListener('click', checkData);

checkbox.addEventListener('change', (event) => {
    toggleAnswer();
});