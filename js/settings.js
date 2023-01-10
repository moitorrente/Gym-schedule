import getFile from './data.js';
getVersion();
async function getVersion() {
    const localVersion = await getFile('version.json');
    document.getElementById('version-text').innerHTML = `v${localVersion.data.version}`;
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
document.getElementById('dark-theme').onclick = () => setActiveStyleSheet('dark');
document.getElementById('light-theme').onclick = () => setActiveStyleSheet('light');