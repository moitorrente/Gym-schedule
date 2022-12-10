import getFile from './data.js';
getVersion();
async function getVersion() {
    const localVersion = await getFile('version.json');
    document.getElementById('version-text').innerHTML = localVersion.data.version;
}

async function forceReload() {
    (await caches.keys()).forEach(c => caches.delete(c))
    navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
            Promise.all(registrations.map((r) => r.unregister())),
        )
        .then(() => {
            window.location.reload(true);
        });
}

document.getElementById('force-update').onclick = () => forceReload();
document.getElementById('change-theme').onclick = () => setActiveStyleSheet();

window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    let title = localStorage.getItem("theme");
    if (title) setActiveStyleSheet(title);
});
function setActiveStyleSheet(intitle) {
    /* Grab a list of all alternate style sheets */
    let title = localStorage.getItem("theme");
    console.log(title)

    if(title == 'dark'){
        title = 'light';
    } else{
        title = 'dark';
    }
    if(intitle) title = intitle;

    let css = `link[rel="alternate stylesheet"]`;
    let stylesheets = document.querySelectorAll(css);
    /* Walk all alternate style sheets and disable them */
    stylesheets.forEach(sheet => sheet.disabled = true);
    /* Select style sheet we want to "turn on" */
    let selector = `link[title="${title}"]`;
    let stylesheet = document.querySelector(selector);
    /* Enable the style sheet */
    stylesheet.disabled = false;
    localStorage.setItem("theme", title);
}