const max_width = 20;
const max_height = 6;

// globalThis.output - string of output
// answer sheet - output matrix with filled spaces
var answerSheet = null;
var binarySheet = null;
var sheetCache = null;

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
    //let data = await validate_answer(sheet, id);

    binarySheet = validateAnswer(sheet);
    resetBackground();
    updateBackground(binarySheet);
    checkbox.disabled = false;
}

export function setSheet(sheet) {
    if (!sheet) return;
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
        updateBackground(Array.from({ length: max_height }, () => Array(max_width).fill(true)));
        document.getElementById('verifyBtn').disabled = true;
    }
    // hide answer
    else {
        if (sheetCache) {
            setSheet(sheetCache);
        }
        setSheetLocked(false);
        updateBackground(binarySheet);
        document.getElementById('verifyBtn').disabled = false;
    }
    answerShown = !answerShown;
}

document.getElementById('verifyBtn').addEventListener('click', checkData);

checkbox.addEventListener('change', (event) => {
    toggleAnswer();
});





function validateAnswer(char_sheet) {
    if (!char_sheet) {
        console.log("Sheet is required");
        return null;
    }

    const arr_sheet = char_sheet;

    const str = globalThis.output;
    let arr = str.split("\n");

    arr = arr.map((s) => {
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

    answerSheet = arr;

    return result;
}