import getAllFromIndexedDB from './db.js';

const yearView = document.getElementById('year-view');
const yearView2022 = document.getElementById('year-view-2022');

function createYearView(days, year, view) {
    let gone = [];
    if (days) {
        days.forEach(day => {
            const date = stringToDate(day);
            if (date.getFullYear() == year) {
                gone.push(dayOfYear(date))
            }
        })
    }
    let today = dayOfYear(new Date());

    if (year < new Date().getFullYear()) {
        today = 365
    }

    gone = [...new Set(gone)];
    view.innerHTML = '';
    for (let i = 0; i < today; i++) {
        const day = document.createElement('span');
        day.classList.add("d-inline-block", "rounded-square", "p-s");
        if (gone.includes(i + 1)) {
            day.classList.add('b-blue');
        } else {
            day.classList.add('b-light-blue');
        }
        view.appendChild(day)
    }
}

function stringToDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date([month, day, year].join('/'));
};


function dayOfYear(day) {
    let date = new Date(day);
    return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
}


getAllFromIndexedDB('db-primary', 'Log').then(function (reponse) {
    const dates = [...new Set(reponse.map(x => x.Fecha))]
    createYearView(dates, 2022, yearView2022);
    createYearView(dates, 2023, yearView);

}).catch(function (error) {
    alert(error.message);
});