const sheetId = '1b6r8Kg3xfvgRF4VhrIwMZpRD5ae-NjiGWsVdco4EDhI';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'Log';
const query = encodeURIComponent('Select *')
const url = `${base}&sheet=${sheetName}&tq=${query}`;

const loading = document.getElementById('loading')

const lastDescription = document.getElementById('last-description');
const lastDate = document.getElementById('last-date');
const lastCheck = document.getElementById('last-check');
document.getElementById('delete-last').onclick = () => {
    localStorage.removeItem('historic');
    getContext();
}

document.getElementById('fetch').addEventListener('click', () => {
    loading.classList.remove('d-none');
    init();
})
const data = []
const output = document.querySelector('.output');
getContext();

//document.addEventListener('DOMContentLoaded', init)

function init() {
    fetch(url)
        .then(res => res.text())
        .then(rep => {
            //Remove additional text and extract only JSON:
            const jsonData = JSON.parse(rep.substring(47).slice(0, -2));
            console.log(jsonData)

            const colz = [];
            const tr = document.createElement('tr');
            //Extract column labels
            jsonData.table.cols.forEach((heading) => {
                if (heading.label) {
                    let column = heading.label;
                    colz.push(column);
                    const th = document.createElement('th');
                    // th.innerText = column;
                    // tr.appendChild(th);
                }
            })
            // output.appendChild(tr);

            //extract row data:
            jsonData.table.rows.forEach((rowData) => {
                const row = {};
                colz.forEach((ele, ind) => {
                    row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].f != null ? rowData.c[ind].f : rowData.c[ind].v : '';
                })
                data.push(row);
            })
            //processRows(data);
        }).then(() => {
            loading.classList.add('d-none');
            localStorage.setItem('historic', JSON.stringify({ date: new Date().toLocaleString('es-ES'), data: data }));
            bsOkToast.show();
            const historic = JSON.parse(localStorage.getItem('historic'));
            updateLastCard(historic.date);
        }
        ).catch(error => {
            loading.classList.add('d-none')
            bsKoToast.show();
            console.log(error)
        });
}

function processRows(json) {
    json.forEach((row) => {

        const tr = document.createElement('tr');
        const keys = Object.keys(row);

        keys.forEach((key) => {
            const td = document.createElement('td');
            td.textContent = row[key];
            tr.appendChild(td);
        })
        output.appendChild(tr);
    })
}

function getContext() {
    const historic = JSON.parse(localStorage.getItem('historic'));
    if (historic) {
        updateLastCard(historic.date)
    } else {
        updateLastCard()
    }

}

function updateLastCard(date) {
    if (date) {
        lastDescription.innerHTML = 'Datos cargados';
        lastDate.innerHTML = `Último: ${date}`;
        lastCheck.checked = true;
    } else {
        lastDescription.innerHTML = 'No hay datos cargados';
        lastDate.innerHTML = 'Solicita los datos';
        lastCheck.checked = false;
    }
}



//------------------------------------
let okToast = document.getElementById('okToast');
let koToast = document.getElementById('koToast');
let bsOkToast = new bootstrap.Toast(okToast);
let bsKoToast = new bootstrap.Toast(koToast);

const stringToDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
};
