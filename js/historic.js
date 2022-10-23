import getFile from './data.js';
const notCheckedSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-square" viewBox="0 0 16 16">
<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
</svg>`;

const checkedSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-check-square" viewBox="0 0 16 16">
<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
<path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
</svg>`;

const sheetId = '1b6r8Kg3xfvgRF4VhrIwMZpRD5ae-NjiGWsVdco4EDhI';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'Log';
const query = encodeURIComponent('Select *')
const url = `${base}&sheet=${sheetName}&tq=${query}`;

const loadExerciseListBtn = document.getElementById('load-exercise-list-btn');
loadExerciseListBtn.onclick = async () => {
    let res = await getFile('exercises.json');
    if (res.ok) {
        localStorage.setItem('listaEjercicios', JSON.stringify({ date: new Date().toLocaleString('es-ES'), data: res.data }));
        getContext();
    } else {
        alert(`Error: ${res.error}`);
    }
}

const loading = document.getElementById('loading')

const lastDescription = document.getElementById('last-description');
const lastDate = document.getElementById('last-date');
const lastCheck = document.getElementById('last-check');
const lastExerciseDescription = document.getElementById('last-exercises-description');
const lastExerciseDate = document.getElementById('last-exercises-date');
const lastExerciseCheck = document.getElementById('last-exercises-check');

document.getElementById('delete-all').onclick = () => {
    localStorage.removeItem('historic');
    localStorage.removeItem('listaEjercicios');
    getContext();
}

document.getElementById('delete-last').onclick = () => {
    localStorage.removeItem('historic');
    getContext();
}
document.getElementById('get-historic').onclick = () => {
    loading.classList.remove('d-none');
    init();
    getContext();
}
document.getElementById('delete-last-exercise').onclick = () => {
    localStorage.removeItem('listaEjercicios');
    getContext();
}

document.getElementById('fetch').addEventListener('click', async () => {
    loading.classList.remove('d-none');
    init();
    let res = await getFile('exercises.json');
    if (res.ok) {
        localStorage.setItem('listaEjercicios', JSON.stringify({ date: new Date().toLocaleString('es-ES'), data: res.data }));
        getContext();
    } else {
        alert(`Error: ${res.error}`);
    }
})
const data = []
getContext();

function init() {
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));

            const colz = [];
            const tr = document.createElement('tr');
            //Extract column labels
            jsonData.table.cols.forEach((heading) => {
                if (heading.label) {
                    let column = heading.label;
                    colz.push(column);
                }
            })

            //extract row data:
            jsonData.table.rows.forEach((rowData) => {
                const row = {};
                colz.forEach((ele, ind) => {
                    row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].f != null ? rowData.c[ind].f : rowData.c[ind].v : '';
                })
                data.push(row);
            })
        }).then(() => {
            loading.classList.add('d-none');
            localStorage.setItem('historic', JSON.stringify({ date: new Date().toLocaleString('es-ES'), data: data }));
            bsOkToast.show();
            getContext();
        }
        ).catch(error => {
            loading.classList.add('d-none')
            bsKoToast.show();
            console.log(error)
        });
}

function getContext() {
    const historic = JSON.parse(localStorage.getItem('historic'));
    if (historic) {
        updateLastCard(historic.date);
    } else {
        updateLastCard()
    }

    const litaEjercicios = JSON.parse(localStorage.getItem('listaEjercicios'));
    if (litaEjercicios) {
        updateLastExerciseCard(litaEjercicios.date);
    } else {
        updateLastExerciseCard()
    }
    createMonth(new Date());

}

function updateLastCard(date) {
    if (date) {
        lastDescription.innerHTML = 'Histórico';
        lastDate.innerHTML = `Último: ${date}`;
        lastCheck.innerHTML = checkedSVG;
    } else {
        lastDescription.innerHTML = 'No hay histórico cargado';
        lastDate.innerHTML = 'Solicita los datos';
        lastCheck.innerHTML = notCheckedSVG;
    }
}
function updateLastExerciseCard(date) {

    if (date) {
        lastExerciseDescription.innerHTML = 'Lista de ejercicios';
        lastExerciseDate.innerHTML = `Último: ${date}`;
        lastExerciseCheck.innerHTML = checkedSVG;
    } else {
        lastExerciseDescription.innerHTML = 'No hay lista de ejercicios';
        lastExerciseDate.innerHTML = 'Solicita los ejercicios';
        lastExerciseCheck.innerHTML = notCheckedSVG;
    }
}



//------------------------------------
let okToast = document.getElementById('okToast');
let koToast = document.getElementById('koToast');
let bsOkToast = new bootstrap.Toast(okToast);
let bsKoToast = new bootstrap.Toast(koToast);

