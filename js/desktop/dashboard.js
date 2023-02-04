import getFile from '../data.js';
getVersion();
async function getVersion() {
    const localVersion = await getFile('version.json');
    document.getElementById('version-text').innerHTML = `v${localVersion.data.version}`;
}

const toggleSidebar = document.getElementById('toggle-sidebar');
toggleSidebar.onclick = () => document.getElementById('sidebar').classList.toggle('d-none')