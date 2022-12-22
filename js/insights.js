const dateFrom = document.getElementById('date-from');
const dateTo = document.getElementById('date-to');
let dateFromValue = false;
let dateToValue = 9999999999999;
dateFrom.onchange = () => {
    if (dateFrom.value == '') {
        dateFromValue = false;
    } else {
        dateFromValue = new Date(dateFrom.value);
    }
    getContext();
}
dateTo.onchange = () => {
    if (dateTo.value == '') {
        dateToValue = 9999999999999;
    } else {
        dateToValue = new Date(dateTo.value);
    }
    getContext();
}

function getAllFromIndexedDB() {
    const indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;

    if (!indexedDB) {
        alert.log(`Your browser doesn't support IndexedDB`);
        return;
    }
    return new Promise(
        function (resolve, reject) {
            const request = indexedDB.open('db-primary', 1);
            request.onerror = (event) => {
                reject(Error(`Database error: ${event.target.errorCode}`))
            }
            request.onsuccess = (event) => {
                const db = event.target.result;
                let res;;
                const txn = db.transaction(['Log'], 'readonly');
                const store = txn.objectStore('Log');
                const query = store.getAll();
                query.onsuccess = e => {
                    res = e.target.result;
                }
                txn.oncomplete = function () {
                    db.close();
                    resolve(res)
                };
            }
        }
    )
}

let historic;
let dates;
let unixDates;
getContext();
async function getContext() {
    getAllFromIndexedDB().then(function (reponse) {
        historic = reponse;
        dates = [...new Set(historic.map(x => x.Fecha))];
        let filteredDates = dates.map(x => convertToDate(x));
        filteredDates = filteredDates.filter(date => date >= dateFromValue && date <= dateToValue);
        filteredDates = filteredDates.map(date => {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`
        });

        if (filteredDates) {
            filteredDates = filteredDates.sort(function (a, b) { return new Date(convertToDate(a)) - new Date(convertToDate(b)) });
            document.getElementById('trained-days').innerHTML = filteredDates.length;
            document.getElementById('first-training').innerHTML = filteredDates[0];
            document.getElementById('last-training').innerHTML = filteredDates[filteredDates.length - 1];
            unixDates = filteredDates.map(date => convertToUnix(convertToDate(date)));

            let daysOfWeek = filteredDates.map(date => {
                let d = convertToDate(date).getDay();
                if (d === 0) d = 7;
                return d;
            });

            daysOfWeek = daysOfWeek.reduce((cnt, cur) => (cnt[cur] = cnt[cur] + 1 || 1, cnt), {});
            daysOfWeek = Object.values(daysOfWeek);

            const dataset = createDataset('# Veces', daysOfWeek);
            data = {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [dataset]
            }
            generateChart(data);

        } else {
            document.getElementById('trained-days').innerHTML = 'N/D';
        }
    }).catch(function (error) {
        alert(error.message);
    });
}

function convertToUnix(date) {
    return Math.floor(new Date(date).getTime() / 1000)
}


function convertToDate(dateString) {
    const d = dateString.split("/");
    const dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return dat;
}

function createDataset(text, data) {
    const dataset = {
        label: text,
        data: data,
        backgroundColor: '#1e40af',
        borderRadius: 5

        // borderWidth: 1
    }
    return dataset;
}
let myChart;
function generateChart(data) {

    const ctx = document.getElementById('dayDistributionChart');

    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options:
        {
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }

            },
            plugins: {
                legend:
                {
                    display: false
                }
            }
        }

    });
}