const inputText = document.getElementById('input');
const outputText = document.getElementById('output');
const spacesSelected = document.getElementById('number');
const copyBtn = document.getElementById('copy');
const pasteBtn = document.getElementById('paste');
const countText = document.getElementById('exercise-count');
const noVideoCount = document.getElementById('no-video-count')

document.getElementById('delete').onclick = () => {
    inputText.value = '';
    outputText.value = '';
    countText.innerHTML = 0;
    noVideoCount.innerHTML = 0;
}

input.oninput = () => run(inputText, Number(spacesSelected.value));
spacesSelected.onchange = () => run(inputText, Number(spacesSelected.value));

function run(input, spaces) {
    const objArr = text2objectArray(input.value);
    outputText.value = JSON.stringify(objArr, null, spaces);
    countText.innerHTML = objArr.length;
    noVideoCount.innerHTML = objArr.filter(x => x.video == '').length;
    const pesoCount = `Peso: ${objArr.filter(x => x.tipo == 'Peso').length}`;
    const segundosCount = `Segundos: ${objArr.filter(x => x.tipo == 'Segundos').length}`;
    const repeticionesCount = `Repeticiones: ${objArr.filter(x => x.tipo == 'Repeticiones').length}`;

    document.getElementById('container').innerHTML += createDiv(pesoCount);
    document.getElementById('container').innerHTML += createDiv(segundosCount);
    document.getElementById('container').innerHTML += createDiv(repeticionesCount);



}

function createDiv(text) {
    return `<div class="bg-light px-2 rounded-2 mt-2 shadow-sm text-nowrap">${text}</div>`
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

copyBtn.onclick = copyText;
function copyText() {
    outputText.select();
    outputText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(outputText.value);
    copyBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard-check" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
    </svg>
    ¡Copiado!
    `;
    copyBtn.classList.add('b-light-green')
    setTimeout(function () {
        copyBtn.classList.remove('b-light-green')

        copyBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z" />
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z" />
        </svg>
        Copiar
        `;
    }, 1000);
}

pasteBtn.onclick = pasteText;
function pasteText() {
    navigator.clipboard
        .readText()
        .then(
            (clipText) => {
                inputText.value = clipText;
                run(inputText, Number(spacesSelected.value))
            }
        );
}