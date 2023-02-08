import getFile from './data.js';

const notCheckedSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="var(--dark-gray)" class="bi bi-square" viewBox="0 0 16 16">
<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
</svg>`;

const checkedSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="var(--dark-gray)" class="bi bi-check-square" viewBox="0 0 16 16">
<path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
<path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
</svg>`;

const sheetId = '1b6r8Kg3xfvgRF4VhrIwMZpRD5ae-NjiGWsVdco4EDhI';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'Log';
const query = encodeURIComponent('Select *')
const url = `${base}&sheet=${sheetName}&tq=${query}`;

const lastDescription = document.getElementById('last-description');
const lastDate = document.getElementById('last-date');
const lastCheck = document.getElementById('last-check');
const lastExerciseDescription = document.getElementById('last-exercises-description');
const lastExerciseDate = document.getElementById('last-exercises-date');
const lastExerciseCheck = document.getElementById('last-exercises-check');

document.getElementById('delete-all').onclick = () => {
    localStorage.removeItem('listaEjercicios');
    localStorage.removeItem('historic');
    clearIndexedDB();
    getContext();
}

document.getElementById('fetch').addEventListener('click', list);

async function list() {
    document.querySelector('.bi-arrow-clockwise').classList.add('rotating');
    init();
    let res = await getFile('exercises.json');
    if (res.ok) {
        localStorage.setItem('listaEjercicios', JSON.stringify({ date: new Date().toLocaleString('es-ES'), data: res.data }));
        getContext();
    } else {
        alert(`Error: ${res.error}`);
    }
}
getContext();

function init() {
    const data = []

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
                    column = column.charAt(0).toUpperCase() + column.slice(1);
                    if (column == 'Id') column = 'EjercicioID';
                    colz.push(column);
                }
            })
            //extract row data:
            // console.log(jsonData.table.rows)
            jsonData.table.rows.forEach((rowData) => {
                const row = {};
                colz.forEach((ele, ind) => {
                    row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].f != null ? rowData.c[ind].f.replace(',', '.') : rowData.c[ind].v.replace(',', '.') : '';
                    row[ele] = row[ele].replace(',', '.');
                })
                data.push(row);
            })
        }).then(() => {

            localStorage.setItem('historic', JSON.stringify({ date: new Date().toLocaleString('es-ES') }));
            createIndexedDB();
            clearIndexedDB();
            loadIndexedDB(data);


            setTimeout(() => {
                document.querySelector('.bi-arrow-clockwise').classList.remove('rotating');
                bsOkToast.show();
                getContext();
            }, "1000")

        }
        ).catch(error => {
            document.querySelector('.bi-arrow-clockwise').classList.remove('rotating');
            bsKoToast.show();

            console.log(error);
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
    // createMonth(new Date());
    // createYearView();
    // updateCalendar();


}

function updateLastCard(date) {
    if (date) {
        lastDescription.innerHTML = 'Histórico';
        lastDate.innerHTML = `Último: ${date.replace(',', '')}`;
        lastCheck.classList.remove('d-none');
    } else {
        lastDescription.innerHTML = 'No hay histórico cargado';
        lastDate.innerHTML = 'Solicita los datos';
        lastCheck.classList.add('d-none');
    }
}
function updateLastExerciseCard(date) {

    if (date) {
        lastExerciseDescription.innerHTML = 'Lista de ejercicios';
        lastExerciseDate.innerHTML = `Último: ${date.replace(',', '')}`;
        lastExerciseCheck.classList.remove('d-none');
    } else {
        lastExerciseDescription.innerHTML = 'No hay lista de ejercicios';
        lastExerciseDate.innerHTML = 'Solicita los ejercicios';
        lastExerciseCheck.classList.add('d-none');
    }
}

//------------------------------------
let okToast = document.getElementById('okToast');
let koToast = document.getElementById('koToast');
let bsOkToast = new bootstrap.Toast(okToast);
let bsKoToast = new bootstrap.Toast(koToast);
//------------------------------------

function createIndexedDB() {
    const indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;

    if (!indexedDB) {
        alert.log(`Your browser doesn't support IndexedDB`);
        // return;
    }

    const request = indexedDB.open('db-primary', 1);
    request.onerror = (event) => {
        alert.error(`Database error: ${event.target.errorCode}`);
    };

    request.onsuccess = (event) => {
        const db = event.target.result;
    };

    request.onupgradeneeded = (event) => {
        let db = event.target.result;

        let store = db.createObjectStore('Log', {
            autoIncrement: true
        });

        // create indexes
        store.createIndex('Fecha', 'Fecha', { unique: false });
        store.createIndex('EjercicioID', 'EjercicioID', { unique: false });
    };
};

function loadIndexedDB(data) {
    const request = indexedDB.open('db-primary', 1);
    request.onerror = (event) => {
        alert.error(`Database error: ${event.target.errorCode}`)
    }

    request.onsuccess = (event) => {
        const db = event.target.result;
        data.forEach(reg => insertLog(db, reg))
    }
}

function clearIndexedDB() {
    const request = indexedDB.open('db-primary', 1);
    request.onerror = (event) => {
        alert.error(`Database error: ${event.target.errorCode}`)
    }

    request.onsuccess = (event) => {
        const db = event.target.result;
        clearDB(db);
    }
}

function insertLog(db, log) {
    // create a new transaction
    const txn = db.transaction('Log', 'readwrite');

    // get the Contacts object store
    const store = txn.objectStore('Log');
    //
    let query = store.put(log);

    // handle success case
    query.onsuccess = function (event) {

    };

    // handle the error case
    query.onerror = function (event) {
        console.log(event.target.errorCode);
    }

    // close the database once the 
    // transaction completes
    txn.oncomplete = function () {
        db.close();
    };
}

function clearDB(db) {
    const txn = db.transaction('Log', 'readwrite');
    const store = txn.objectStore('Log');
    let query = store.clear();
    query.onsuccess = function (event) {
        console.log('Registros eliminados correctamente');
    }
    query.onerror = function (event) {
        console.log(event.target.errorCode);
    }
    txn.oncomplete = function () {
        db.close();
    };
}