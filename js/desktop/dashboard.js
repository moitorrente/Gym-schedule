import getFile from '../data.js';
getVersion();
async function getVersion() {
    const localVersion = await getFile('version.json');
    document.getElementById('version-text').innerHTML = `v${localVersion.data.version}`;
}