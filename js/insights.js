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
        if (dates) {
            dates = dates.sort(function (a, b) { return new Date(convertToDate(a)) - new Date(convertToDate(b)) });
            document.getElementById('trained-days').innerHTML = dates.length;
            document.getElementById('first-training').innerHTML = dates[0];
            document.getElementById('last-training').innerHTML = dates[dates.length - 1];
            unixDates = dates.map(date => convertToUnix(convertToDate(date)));

            let counts = {};
            let daysOfWeek = dates.map(date => convertToDate(date).getDay());
            console.log(daysOfWeek)

            daysOfWeek = daysOfWeek.reduce((cnt, cur) => (cnt[cur] = cnt[cur] + 1 || 1, cnt), {});
            daysOfWeek = Object.values(daysOfWeek);
            daysOfWeek.push(daysOfWeek.shift());
            console.log(Object.values(daysOfWeek))

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


function convertToDate(dateString) {
    const d = dateString.split("/");
    const dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return dat;
}

function convertToUnix(date) {
    return Math.floor(new Date(date).getTime() / 1000)
}

function currentStreak(arr) {

    i = 0,
        result = arr.reduce(function (stack, b) {
            var cur = stack[i],
                a = cur ? cur[cur.length - 1] : 0;

            if (b - a > 86400000) {
                i++;
            }

            if (!stack[i])
                stack[i] = [];

            stack[i].push(b);

            return stack;
        }, []);
    return result;
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
function generateChart(data) {

    const ctx = document.getElementById('dayDistributionChart');
    new Chart(ctx, {
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