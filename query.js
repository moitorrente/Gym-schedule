const sheetId = '1b6r8Kg3xfvgRF4VhrIwMZpRD5ae-NjiGWsVdco4EDhI';
const base = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?`;
const sheetName = 'Log';
const query = encodeURIComponent('Select *')
const url = `${base}&sheet=${sheetName}&tq=${query}`;
let all = [];

document.getElementById('fetch').addEventListener('click', () => {
    init();
    console.log(data)

})
const data = []
const output = document.querySelector('.output')

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
                    th.innerText = column;
                    tr.appendChild(th);
                }
            })
            output.appendChild(tr);

            //extract row data:
            jsonData.table.rows.forEach((rowData) => {
                const row = {};
                colz.forEach((ele, ind) => {
                    row[ele] = (rowData.c[ind] != null) ? rowData.c[ind].f != null ? rowData.c[ind].f : rowData.c[ind].v : '';
                })
                data.push(row);
            })
            all.push(data)
            processRows(data);
        }).then((x) => localStorage.setItem('historic', JSON.stringify(data))
        )
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

//------------------------------------
let myAlert = document.querySelector('.toast');
let bsAlert = new bootstrap.Toast(myAlert);

document.getElementById('liveToastBtn').onclick = () => { bsAlert.show() }

const stringToDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(year, month - 1, day);
};
