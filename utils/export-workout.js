import getFile from '../js/data.js';

let WORKOUTS = await getFile('workouts.json');
WORKOUTS = WORKOUTS.data;

document.getElementById('workout-mesociclo-modal').oninput = () => generateWorkoutText();
document.getElementById('workout-type-modal').oninput = () => generateWorkoutText();
document.getElementById('workout-modalidad-modal').oninput = () => generateWorkoutText();
document.getElementById('copy-workout-full').onclick = () => {
    generateWorkoutText(WORKOUTS);
    copyText();
}
generateWorkoutText();
function generateWorkoutText(full) {
    const container = document.getElementById('download-text-hidden');
    const workout = JSON.parse(localStorage.getItem('ejercicios'));
    const json =
    {
        "entrenamiento": `${document.getElementById('workout-type-modal').value}`,
        "mesociclo": `${document.getElementById('workout-mesociclo-modal').value}`,
        "tipo": `${document.getElementById('workout-modalidad-modal').value}`,
        "version": "2",
        "active": "true",
        "ejercicios": workout
    }
    if (full) {
        full.push(json);
        container.value = JSON.stringify(full, null, 2);
    } else {
        container.value = JSON.stringify(json, null, 2);
    }
    document.getElementById('download-text').value = JSON.stringify(json, null, 2);
}
document.getElementById('copy-workout').onclick = copyText;

function copyText() {
    // Get the text field
    const copyText = document.getElementById("download-text-hidden");

    // Select the text field
    copyText.select();
    copyText.setSelectionRange(0, 99999); // For mobile devices

    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value);
}