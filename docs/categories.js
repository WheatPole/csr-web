const category_list = [
    {
        id: 'multi_file',
        name: 'Multi-file'
    },
    {
        id: 'tree_structure',
        name: 'Tree structure'
    },
    {
        id: 'linked_nodes',
        name: 'Linked nodes'
    },
    {
        id: 'macros',
        name: 'Macros'
    },
    {
        id: 'pointers',
        name: 'Pointers'
    },
    {
        id: 'structs',
        name: 'Structs'
    },
    {
        id: 'unions',
        name: 'Unions'
    },
    {
        id: 'famous_algorithm_implementations',
        name: 'Famous algorithms'
    },
    {
        id: 'recursion',
        name: 'Recursion'
    },
    {
        id: 'string_manipulation',
        name: 'String manipulation'
    },
    {
        id: 'ascii_art',
        name: 'ASCII art'
    },
    {
        id: 'file_reading',
        name: 'File reading'
    },
    {
        id: 'matrices',
        name: 'Matrices'
    },
    {
        id: 'enums',
        name: 'Enums'
    },
    {
        id: 'bitfields',
        name: 'Bitfields'
    },
    {
        id: 'bitwise_operators',
        name: 'Bitwise operators'
    },
    {
        id: 'hex_and_octal',
        name: 'Hex and octal'
    },
    {
        id: 'function_pointers',
        name: 'Function pointers'
    },
    {
        id: 'goto_statements',
        name: 'Goto'
    },
    {
        id: 'digraphs',
        name: 'Digraphs'
    },
    {
        id: 'infinite_arguments',
        name: 'Infinite arguments'
    }
];

const format_list = [
    {
        id: 'multiple_functions_for_execution',
        name: 'Multiple functions'
    },
    {
        id: 'main_only',
        name: 'Main only'
    }
]


const categoryContainer = document.getElementById('category-dialog');

function createCategoryCheckbox() {
    const catContainer = document.getElementById("category-list");

    category_list.forEach(category => {
        //const item = document.createElement("li");
        const id = category.id;
        const name = category.name;
        const checkbox = document.createElement("cat-item");
        checkbox.innerHTML = `<div id="d_${id}"><label for="c_${id}" class="txt l">${name} </label>
                <input type="checkbox" id="c_${id}" name="${id}_chbox" class="r" checked></div>
        `;
        catContainer.appendChild(checkbox);
        //list.appendChild(item);
    });
    
    const formatContainer = document.querySelector("#format-list");

    format_list.forEach(category => {
        //const item = document.createElement("li");
        const id = category.id;
        const name = category.name;
        const checkbox = document.createElement("cat-item");
        checkbox.innerHTML = `<div id="d_${id}"><label for="c_${id}" class="txt l">${name} </label>
                <input type="checkbox" id="c_${id}" name="${id}_chbox" class="r" checked></div>
        `;
        formatContainer.appendChild(checkbox);
        //list.appendChild(item);
    });
}

function setAll(checkboxes, value) {
    checkboxes.forEach(c => {
        c.checked = value;
    });
}

function toggleAll() {
    const checkboxes = categoryContainer.querySelectorAll('input[type="checkbox"]:not(#include-disabled)');
    const checked = categoryContainer.querySelectorAll('input[type="checkbox"]:checked:not(#include-disabled)');
    if (checked.length > 0) {
        setAll(checked, false);
    }
    else {
        setAll(checkboxes, true);
    }
}

function nameFromID(id) {
    let p = null;
    category_list.forEach(c => {
        if (c.id == id) {
            p = c.name;
        }
    });

    format_list.forEach(c => {
        if (c.id == id) {
            p = c.name;
        }
    });
    return p;
} 

function getCheckedCategories() {
    const checked = categoryContainer.querySelectorAll('input[type="checkbox"]:checked:not(#include-disabled)');
    return checked;
}

createCategoryCheckbox();

categoryContainer.addEventListener('click', () => categoryContainer.close());

const myDiv = document.getElementById('inner');
myDiv.addEventListener('click', (event) => event.stopPropagation());