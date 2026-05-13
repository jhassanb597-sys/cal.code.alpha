const display = document.getElementById('display');

function appendValue(value) {
    // Prevent multiple dots....
    if (value === '.') {
        const parts = display.value.split(/[\+\-\*\/]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes('.')) return;
    }

    // Prevent multiple operators....
    const operators = ['+', '-', '*', '/'];
    const last = display.value.slice(-1);
    if (operators.includes(value) && operators.includes(last)) {
        display.value = display.value.slice(0, -1);
    }

    // Replace placeholder 0 on first entry....
    if (display.value === '0' && !operators.includes(value) && value !== '.') {
        display.value = '';
    }

    display.value += value;
    autoFontSize();
}

function clearDisplay() {
    display.value = '';
    display.style.fontSize = '48px';
}

function partialClear() {
    display.value = display.value.slice(0, -1);
    if (display.value === '') display.style.fontSize = '48px';
}

function calculate() {
    if (display.value === '') return;
    try {
        const result = Function('"use strict"; return (' + display.value + ')')();
        // Handle division by zero....
        if (!isFinite(result)) {
            display.value = 'Error';
            return;
        }
        // Round to avoid floating point....
        display.value = parseFloat(result.toFixed(10)).toString();
        autoFontSize();
    } catch (e) {
        display.value = 'Error';
    }
}

// Shrink font when result is long.....
function autoFontSize() {
    const len = display.value.length;
    if (len > 12)      display.style.fontSize = '22px';
    else if (len > 9)  display.style.fontSize = '30px';
    else if (len > 6)  display.style.fontSize = '38px';
    else               display.style.fontSize = '48px';
}

// Keyboard support....
document.addEventListener('keydown', function(e) {
    if (e.key >= '0' && e.key <= '9') appendValue(e.key);
    else if (e.key === '+') appendValue('+');
    else if (e.key === '-') appendValue('-');
    else if (e.key === '*') appendValue('*');
    else if (e.key === '/') { e.preventDefault(); appendValue('/'); }
    else if (e.key === '.') appendValue('.');
    else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Backspace') partialClear();
    else if (e.key === 'Escape') clearDisplay();
});