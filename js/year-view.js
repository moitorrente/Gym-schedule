import getAllFromIndexedDB from './db.js';

function createYearView(days, year) {
    const view = document.getElementById(`year-view-${year}`);
    const today = year >= new Date().getFullYear() ? dayOfYear(new Date()) : dayOfYear(new Date(stringToDate(`31/12/${year}`)));
    const goneDays = getGoneDaysInYear(days, year);

    view.innerHTML = '';
    for (let i = 0; i < today; i++) {
        const day = document.createElement('span');
        const color = goneDays.includes(i + 1) ? 'b-blue' : 'b-light-blue';
        day.classList.add("d-inline-block", "rounded-square", "p-s", color);
        view.appendChild(day)
    }
}

function stringToDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date([month, day, year].join('/'));
};

function dayOfYear(day) {
    const date = new Date(day);
    return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
}

function getGoneDaysInYear(days, year) {
    let gone = [];
    days.forEach(day => {
        const date = stringToDate(day);
        if (date.getFullYear() == year) gone.push(dayOfYear(date));
    });
    return [...new Set(gone)];
}

getContext();
function getContext() {
    getAllFromIndexedDB('db-primary', 'Log').then(function (response) {
        const dates = [...new Set(response.map(el => el.Fecha))];
        createYearView(dates, 2022);
        createYearView(dates, 2023);
    }).catch(function (error) {
        alert(error.message);
    });
}