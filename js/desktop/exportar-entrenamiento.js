const copyBtn = document.getElementById('copy');
const outputText = document.getElementById('output');
const spacesSelected = document.getElementById('number');
const countText = document.getElementById('exercise-count');



document.getElementById('workout-mesociclo').oninput = () => generateWorkoutText();
document.getElementById('workout-type').oninput = () => generateWorkoutText();
document.getElementById('workout-modalidad').oninput = () => generateWorkoutText();
spacesSelected.onchange = () => generateWorkoutText();


generateWorkoutText();
function generateWorkoutText() {
    const workout = JSON.parse(localStorage.getItem('ejercicios'));
    delete workout.active;
    const json =
    {
        "entrenamiento": `${document.getElementById('workout-type').value}`,
        "mesociclo": `${document.getElementById('workout-mesociclo').value}`,
        "tipo": `${document.getElementById('workout-modalidad').value}`,
        "version": "2",
        "active": "true",
        "ejercicios": workout
    }
    countText.innerHTML = workout.length;
    outputText.value = JSON.stringify(json, null, Number(spacesSelected.value));
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