import getAllFromIndexedDB from './db.js';

let fullscreenEvent;

document.querySelectorAll('.bi-arrows-fullscreen').forEach(el => el.onclick = () => {
    document.getElementById('years').requestFullscreen().then(() => {
        screen.orientation.lock('landscape').then(() => {
            document.getElementById(`year-2022`).style.width = 'fit-content';
            document.getElementById(`year-2023`).style.width = 'fit-content';
            document.getElementById(`year-2024`).style.width = 'fit-content';
        }).catch(err => console.log(err));


    });
});

window.addEventListener("orientationchange", (event) => {
    if (fullscreenEvent) {
        document.removeEventListener(fullscreenEvent);
        fullscreenEvent = null;
    } else {
        fullscreenEvent = document.onclick = (event) => {
            if (document.fullscreenElement) {
                document.exitFullscreen()
                    .then(() => {
                        document.getElementById(`year-2022`).style.width = '';
                        document.getElementById(`year-2023`).style.width = '';
                        document.getElementById(`year-2024`).style.width = '';
                    })
                    .catch((err) => console.error(err));
            }
        }
    }
});

function createYearView(days, year) {
    const view = document.getElementById(`year-view-${year}`);
    //Para que el año actual solo pinte hasta la fecha de consulta
    const today = year >= new Date().getFullYear() ? dayOfYear(new Date()) : dayOfYear(new Date(stringToDate(`31/12/${year}`)));
    const daysInYear = dayOfYear(new Date(stringToDate(`31/12/${year}`)));
    const goneDays = getGoneDaysInYear(days, year);
    const streak = calculateStreak(goneDays);
    console.log(days)
    console.log(goneDays)

    view.innerHTML = '';
    for (let i = 0; i < today; i++) {
        const day = document.createElement('span');
        const color = goneDays.includes(i + 1) ? 'b-blue' : 'b-light-blue';
        const set = goneDays.includes(i + 1) ? true : false;
        day.classList.add("d-inline-block", "rounded-square", "p-s", color);
        day.dataset.number = i + 1;
        day.dataset.set = set;
        view.appendChild(day);
    }

    for (let i = today; i < daysInYear; i++) {
        const day = document.createElement('span');
        day.classList.add("d-inline-block", "rounded-square", "p-s", 'b-light-green');
        day.dataset.number = i + 1;
        view.appendChild(day);
    }

    document.querySelector(`.dias-${year}`).innerHTML = goneDays.length;
    document.querySelector(`.asistencia-${year}`).innerHTML = `${Math.floor((goneDays.length / today * 100))}%`;
    document.querySelector(`.racha-${year}`).innerHTML = streak.length;
    document.querySelector(`.racha-${year}`).onclick = (e) => {
        const calendarDays = document.querySelectorAll(`#year-view-${year} .rounded-square`);
        hilite(streak, calendarDays, e.target);
    }
}

function stringToDate(dateString) {
    const [day, month, year] = dateString.split('/');
    return new Date([month, day, year].join('/'));
};

function dayOfYear(day) {
    const date = new Date(day)
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = (date - start) + ((start.getTimezoneOffset() - date.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
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
        createYearView(dates, 2024);

    }).catch(function (error) {
        alert(error.message);
    });
}

function calculateStreak(days) {
    if (days.length === 0) return 0;
    let prev = 0;
    let chunks = [];
    days.forEach(day => {
        if (day - prev != 1) chunks.push([]);
        chunks[chunks.length - 1].push(day);

        prev = day;
    });

    chunks.sort((a, b) => b.length - a.length);
    return chunks[0];
}

function hilite(streakDays, calendarDays, div) {
    streakDays.forEach(streakDay => {
        calendarDays.forEach(calendarDay => {
            if (calendarDay.dataset.number == streakDay) {
                if (calendarDay.classList.contains('b-blue') || calendarDay.classList.contains('b-light-blue')) {
                    calendarDay.classList.remove('b-blue', 'b-light-blue');
                    calendarDay.classList.add('b-dark-green');
                    div.classList.add('t-dark-green')
                } else {
                    const color = calendarDay.dataset.set ? 'b-blue' : 'b-light-blue';
                    calendarDay.classList.remove('b-dark-green');
                    div.classList.remove('t-dark-green')

                    calendarDay.classList.add(color);
                }
            }
        })
    })
}