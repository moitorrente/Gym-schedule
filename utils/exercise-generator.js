const input = document.getElementById('input');
const output = document.getElementById('output');

document.getElementById('run').onclick = () => {
    const objArr = text2objectArray(input.value);
    let options = objArr.map(obj => object2option(obj)).join('');
    //output.value = options;
    output.value = output.value = JSON.stringify(objArr, null, 4);;
}

function text2objectArray(text) {
    const lines = text.split('\n').map(line => line.split('\t'));
    const header = [...lines.splice(0, 1)[0]];
    const obj = lines.map(line =>
        line.reduce((acc, b, i) => {
            acc[header[i]] = b;
            return acc;
        }, {})
    );
    return obj;
}

function object2option(obj) {
    const option = document.createElement('option');
    option.value = obj.id;
    option.innerHTML = obj.ejercicio;
    option.dataset.tipo = obj.tipo;

    return option.outerHTML + '\n';
}

document.getElementById('copy').onclick = copyText;

function copyText() {
    // Get the text field
    var copyText = document.getElementById("output");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
}

document.getElementById('delete').onclick = () => {
    document.getElementById('input').value = '';
    document.getElementById('output').value = '';
}
