import getAllFromIndexedDB from './db.js';


document.querySelectorAll('.bi-arrows-fullscreen').forEach(el => el.onclick = () => {
    document.getElementById(`year-${el.dataset.year}`).requestFullscreen().then(() => {
        screen.orientation.lock('landscape').then(res => console.log(res)).catch(err => console.log(err));
        document.onclick = (event) => {
            if (document.fullscreenElement) {
                document.exitFullscreen()
                    .then(() => console.log("Document Exited from Full screen mode"))
                    .catch((err) => console.error(err))
            } else {
                document.documentElement.requestFullscreen();
            }
        }
    });
});

function createYearView(days, year) {
    const view = document.getElementById(`year-view-${year}`);
    const today = year >= new Date().getFullYear() ? dayOfYear(new Date()) : dayOfYear(new Date(stringToDate(`31/12/${year}`)));
    const goneDays = getGoneDaysInYear(days, year);

    view.innerHTML = '';
    for (let i = 0; i < today; i++) {
        const day = document.createElement('span');
        const color = goneDays.includes(i + 1) ? 'b-blue' : 'b-light-blue';
        day.classList.add("d-inline-block", "rounded-square", "p-s", color);
        view.appendChild(day);
    }

    document.querySelector(`.dias-${year}`).innerHTML = goneDays.length;
    console.log(Math.floor((goneDays.length / today * 100)))
    document.querySelector(`.asistencia-${year}`).innerHTML = `${Math.floor((goneDays.length / today * 100))}%`;

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