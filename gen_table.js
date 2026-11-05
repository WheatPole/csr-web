function createCharacterTable() {
    const container = document.querySelector("#tableContainer");

    const table = document.createElement("table");
    table.classList.add("table-input");

    const tbody = document.createElement("tbody");

    for (let i = 0; i < 6; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < 20; j++) {
            const cell = document.createElement("td");

            const input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;
            input.setAttribute("value", " ");
            input.classList.add("input-box");
            input.classList.add("bold");
            
            input.dataset.row = i;
            input.dataset.col = j;

            input.autocomplete = "off";
            input.spellcheck = false;

            input.setAttribute("aria-label", `Row ${i + 1}, column ${j + 1}`);

            cell.appendChild(input);
            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    container.replaceChildren(table);
}

createCharacterTable();

const container = document.querySelector("#tableContainer");

function clamp(val, min, max) {
    return val >= max ? max : val <= min ? min : val;
}

container.addEventListener("focusin", (event) => {
    if (event.target.matches(".input-box")) {
        event.target.select();
    }
});

container.addEventListener("click", (event) => {
    if (event.target.matches(".input-box")) {
        event.target.select();
    }
});

container.addEventListener("mousedown", (event) => {
    if (!event.target.matches(".input-box"))
        return;

    event.preventDefault();

    event.target.focus();
    event.target.select();
});


function moveCell(input, dcol, drow) {
    const table = document.querySelector(".table-input");
    const maxCols = table.rows[0].cells.length;
    const maxRows = table.rows.length;

    var col = clamp(Number(input.dataset.col) + dcol, 0, maxCols - 1);
    var row = clamp(Number(input.dataset.row) + drow, 0, maxRows - 1);

    const nextInput = container.querySelector(
        `.input-box[data-row="${row}"][data-col="${col}"]`
    );
    if (nextInput) {
        nextInput.focus();
        nextInput.select();
    }
}

container.addEventListener("keydown", (event) => {
    if (!event.target.matches(".input-box"))
        return;
 
    // for deletion
    if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();

        event.target.value = " ";
        moveCell(event.target, -1, 0);

        return;
    }

    const dirs = {
        ArrowLeft: [-1, 0],
        ArrowUp: [0, -1],
        ArrowRight: [1, 0],
        ArrowDown: [0, 1]
    };

    const dir = dirs[event.key];
    if (!dir)
        return;

    event.preventDefault();

    moveCell(event.target, dir[0], dir[1]);
});


container.addEventListener("input", (event) => {
    const input = event.target;

    if (!input.matches(".input-box"))
        return;
    
    if (event.inputType.startsWith("insert")) {
        if (input.value.length > 0)
            moveCell(input, 1, 0);
    }
});