function adjustWidth(input) {
    input.style.width = Math.max(100, input.value.length * 8) + 'px';
}

function solveAndDisplay() {
    const functionInput = document.getElementById("functionInput").value;
    const a = parseFloat(document.getElementById("a").value);
    const b = parseFloat(document.getElementById("b").value);
    const n = parseInt(document.getElementById("n").value);
    const alpha = parseFloat(document.getElementById("alpha").value);
    const decimalPlaces = parseInt(document.getElementById("decimalPlaces").value);

    let functions;
    try {
        // Parse the functions safely
        functions = eval('(' + functionInput + ')');
        if (!Array.isArray(functions)) throw new Error();
    } catch (error) {
        alert("Invalid function input format. Please use { f1, f2, ... } format.");
        return;
    }

    const m = functions.length; // Number of equations
    let t = a;
    let w = Array(m).fill(alpha); // Initialize w1, w2, ..., wm
    const h = (b - a) / n;

    const resultTable = document.getElementById("rkResultTable").getElementsByTagName('tbody')[0];
    const calculationsDiv = document.getElementById("rkCalculationsContent");

    // Clear previous results
    resultTable.innerHTML = '';
    calculationsDiv.innerHTML = '';

    // Output initial condition
    addRow(resultTable, 0, t, w, decimalPlaces);
    calculationsDiv.innerHTML += `<div class="step">Step 0: t = ${t.toFixed(decimalPlaces)}, w = [${w.map(x => x.toFixed(decimalPlaces)).join(', ')}]</div>`;

    for (let i = 1; i <= n; i++) {
        let k1 = new Array(m);
        let k2 = new Array(m);
        let k3 = new Array(m);
        let k4 = new Array(m);

        // Step 5: compute k1
        for (let j = 0; j < m; j++) {
            k1[j] = h * evalFunction(functions[j], t, w);
        }

        // Step 6: compute k2
        let wTemp = w.map((wj, idx) => wj + k1[idx] / 2);
        for (let j = 0; j < m; j++) {
            k2[j] = h * evalFunction(functions[j], t + h/2, wTemp);
        }

        // Step 7: compute k3
        wTemp = w.map((wj, idx) => wj + k2[idx] / 2);
        for (let j = 0; j < m; j++) {
            k3[j] = h * evalFunction(functions[j], t + h/2, wTemp);
        }

        // Step 8: compute k4
        wTemp = w.map((wj, idx) => wj + k3[idx]);
        for (let j = 0; j < m; j++) {
            k4[j] = h * evalFunction(functions[j], t + h, wTemp);
        }

        // Step 9: update wj
        for (let j = 0; j < m; j++) {
            w[j] = w[j] + (k1[j] + 2*k2[j] + 2*k3[j] + k4[j]) / 6;
        }

        // Step 10: Update t
        t = a + i * h;

        // Output results
        addRow(resultTable, i, t, w, decimalPlaces);

        // Detailed Calculations
        calculationsDiv.innerHTML += `
        <div class="step">
            Step ${i}:<br>
            t = ${t.toFixed(decimalPlaces)}<br>
            k1 = [${k1.map(x => x.toFixed(decimalPlaces)).join(', ')}]<br>
            k2 = [${k2.map(x => x.toFixed(decimalPlaces)).join(', ')}]<br>
            k3 = [${k3.map(x => x.toFixed(decimalPlaces)).join(', ')}]<br>
            k4 = [${k4.map(x => x.toFixed(decimalPlaces)).join(', ')}]<br>
            Updated w = [${w.map(x => x.toFixed(decimalPlaces)).join(', ')}]
        </div>
        `;
    }
}

function evalFunction(func, t, w) {
    // Define variables y1, y2, ..., ym dynamically
    for (let i = 0; i < w.length; i++) {
        window['y' + (i+1)] = w[i];
    }
    return eval(func);
}

function addRow(table, step, t, w, decimalPlaces) {
    const row = table.insertRow();
    row.insertCell().innerText = step;
    row.insertCell().innerText = t.toFixed(decimalPlaces);
    for (let j = 0; j < w.length; j++) {
        row.insertCell().innerText = w[j].toFixed(decimalPlaces);
    }
}
