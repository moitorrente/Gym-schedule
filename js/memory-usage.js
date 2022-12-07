document.getElementById('delete-localStorage').onclick = () => {
    localStorage.clear();
    sessionStorage.clear();
    getContext();
}


function localStorageSize() {
    let _lsTotal = 0, _xLen, _x;
    for (_x in localStorage) {
        if (!localStorage.hasOwnProperty(_x)) continue;
        _xLen = (localStorage[_x].length + _x.length) * 2;
        _lsTotal += _xLen;
    }
    //Devuelve en kB
    return (_lsTotal / 1024).toFixed(2);
}

function sessionStorgeSize() {
    let _lsTotal = 0, _xLen, _x;
    for (_x in sessionStorage) {
        if (!sessionStorage.hasOwnProperty(_x)) continue;
        _xLen = (sessionStorage[_x].length + _x.length) * 2;
        _lsTotal += _xLen;
    }
    //Devuelve en kB
    return (_lsTotal / 1024).toFixed(2);
}

function storageKeys(ob) {
    const data = Object.entries(ob).map(x => x[1]);
    const keys = Object.entries(ob).map(x => x[0]);
    const result = {
        keys: keys,
        size: keys.map((x, i) => parseFloat(getkB(keys[i])) + parseFloat(getkB(data[i])))
    }
    const storageMap = new Map();
    result.keys.forEach((key, i) => storageMap.set(result.keys[i], result.size[i].toFixed(2)));
    const orderedMap = new Map([...storageMap].sort((a, b) => (parseFloat(a[1]) > parseFloat(b[1]) ? -1 : 1)));
    return orderedMap;
}

function getkB(str) {
    return parseFloat((str.length * 2 / 1024)).toFixed(2);
}


getContext();
function getContext() {
    const lsSize = localStorageSize();
    const ssSize = sessionStorgeSize();
    document.getElementById('localStorage-memory-usage').innerHTML = `${lsSize} KB`;
    document.getElementById('localStorage-memory-keys').innerHTML = '';
    const dataLocalStorage = storageKeys(localStorage);
    document.getElementById('localStorage-bar').innerHTML = '';
    let colors = ['b-blue', 'b-fuchsia', 'b-dark-yellow', 'b-teal', 'b-red', 'b-light-green'];
    let i = 0;
    dataLocalStorage.forEach((value, key) => {
        document.getElementById('localStorage-memory-keys').append(createMemoryLabel(key, value, colors[i]));
        const d = document.createElement('div');
        d.classList.add('progress-bar', colors[i]);
        d.role = 'progressbar';
        d.style.width = `${(value / lsSize * 100).toFixed(2)}%`;
        i++;
        if(i > colors.length) i = 0;
        const bar = `<div class="progress-bar" role="progressbar" aria-label="Segment one" style="width: ${(value / lsSize * 100).toFixed(2)}%"
        aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>`;
        document.getElementById('localStorage-bar').append(d);
    });

    document.getElementById('sessionStorage-memory-usage').innerHTML = `${sessionStorgeSize()} KB`;
    document.getElementById('sessionStorage-memory-keys').innerHTML = '';
    const dataSessionStorage = storageKeys(sessionStorage);
    document.getElementById('sessionStorage-bar').innerHTML = '';
    i = 0;
    dataSessionStorage.forEach((value, key) => {
        document.getElementById('sessionStorage-memory-keys').append(createMemoryLabel(key, value, colors[i]));
        const d = document.createElement('div');
        d.classList.add('progress-bar', colors[i]);
        d.role = 'progressbar';
        d.style.width = `${(value / ssSize * 100).toFixed(2)}%`;
        i++;
        if(i > colors.length) i = 0;
        const bar = `<div class="progress-bar" role="progressbar" aria-label="Segment one" style="width: ${(value / lsSize * 100).toFixed(2)}%"
        aria-valuenow="15" aria-valuemin="0" aria-valuemax="100"></div>`;
        document.getElementById('sessionStorage-bar').append(d);
    });
}

function createMemoryLabel(text, size, color) {
    const d = document.createElement('div');
    d.classList.add('text-muted', 'fs-7', 'd-flex', 'gap-2');
    const dText = document.createElement('div');
    dText.classList.add('flex-grow-1');
    const dSize = document.createElement('div');
    dSize.innerHTML = `${size} KB`
    d.innerHTML = `<span class="d-flex align-self-center ${color} rounded-circle p-1" style="width: .5rem; height: .5rem"></span>${text}`;

    d.append(dText);
    d.append(dSize);
    return d;
}