// import getFile from './data.js';
// checkUpdate();
// async function checkUpdate() {
//     const localVersion = await getFile('version.json');
//     const githubVersion = await getgit('moitorrente', 'Gym-schedule', 'data/version.json');
//     console.log(localVersion.data.version, githubVersion.version,)
//     if (localVersion.data.version != githubVersion.version) {
//         console.log('Hay update')
//     } else {
//         console.log('NO hay update')
//     }
// }

function forceSWupdate() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function (registrations) {
            for (let registration of registrations) {
                registration.update();
            }
            window.location.reload(true)
        })
    }
}


document.getElementById('force-update').onclick = () => forceSWupdate();


// async function getgit(owner, repo, path) {
//     // A function to fetch files from github using the api 

//     let data = await fetch(
//         `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
//     )
//         .then(d => d.json())
//         .then(d =>
//             fetch(
//                 `https://api.github.com/repos/${owner}/${repo}/git/blobs/${d.sha}`
//             )
//         )
//         .then(d => d.json())
//         .then(d => JSON.parse(atob(d.content)));
//     console.log(data)
//     return data;
// }