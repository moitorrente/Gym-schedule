const forceReload = () => {
    navigator.serviceWorker
        .getRegistrations()
        .then((registrations) =>
            Promise.all(registrations.map((r) => r.unregister())),
        )
        .then(() => window.location.reload());
}


document.getElementById('force-update').onclick = () => forceReload();