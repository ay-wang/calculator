let add = (a, b) => a + b;
let subtract = (a, b) => a - b;
let multiply = (a, b) => a * b;
let divide = (a, b) => a / b;

const operators ={
    "+": add, 
    "-": subtract,
    "×": multiply, 
    "÷": divide
};

// returns result of a <op> b
let operator = (op, a, b) => {
    let res = op(a, b);
    // num digits3
    let sz = Math.ceil(Math.log10(res));
    // want to round such that we show max 10 digits
    let round = 10 - sz;
    let factor = Math.pow(10, round);
    return Math.round(factor * res) / factor;
}

const states = {
    OPERANDA: 0,
    OPERATOR: 1,
    OPERANDB: 2,
    EVAL: 3
};

let display_value = 0, operand = 0;
let decimal = 0;
let display = document.getElementById("calc-disp");
let curr_operator = "";
let calc_state = states.OPERANDA;

// refreshed calculator display with latest value
let update_display = () => {
    if (calc_state == states.OPERATOR) {
        display.innerText = curr_operator;
    } else {
        display.innerText = display_value;
        if (decimal && Number.isInteger(display_value)) {
            display.innerText += ".";
        }
    }
}

// updates display value when new number is pressed
let update_num = (e) => {
    let num = parseInt(e.target.id);

    if (calc_state == states.OPERATOR) {
        // first operand done, get second
        operand = display_value;
        display_value = 0;
        decimal = 0;
        calc_state = states.OPERANDB;
    } else if (calc_state == states.EVAL) {
        // reset calculator 
        operand = 0;
        display_value = 0;
        decimal = 0;
        calc_state = states.OPERANDA;
    }

    if (decimal == 0) {
        display_value = display_value * 10 + num;
    } else {
        display_value += num * Math.pow(10, -decimal);
        ++decimal;
    }
    update_display();
}


let num_buttons = Array.from(document.querySelectorAll(".num-button"));
num_buttons.forEach((num) => {
    num.addEventListener("click", update_num);
});

let op_buttons = Array.from(document.querySelectorAll(".op-button"));
op_buttons.forEach((op) => {
    op.addEventListener("click", (e) => {
        if (calc_state == states.OPERANDB) {
            display_value = operator(operators[curr_operator], operand, display_value);
        }
        curr_operator = e.target.innerText;
        calc_state = states.OPERATOR;
        update_display();
    })
})


let ac_button = document.getElementById("ac");
ac_button.addEventListener("click", (e) => {
    display_value = 0;
    decimal = 0;
    calc_state = states.OPERANDA;
    update_display();
});

let del_button = document.getElementById("del");
del_button.addEventListener("click", (e) => {
    display_value = (display_value - display_value % 10) / 10;
    decimal = Math.max(0, decimal - 1);
    update_display();
});

let decimal_button = document.getElementById("decimal");
decimal_button.addEventListener("click", (e) => {
    if (decimal == 0) {
        decimal = 1;
    }
    update_display();
});


let equals_button = document.getElementById("equals");
equals_button.addEventListener("click", (e) => {
    display_value = operator(operators[curr_operator], operand, display_value);
    calc_state = states.EVAL;
    update_display();
});

