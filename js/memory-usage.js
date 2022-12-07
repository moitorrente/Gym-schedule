document.getElementById('delete-localStorage').onclick = () => {
    localStorage.clear();
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
    return result;
}

function getkB(str) {
    return parseFloat((str.length * 2 / 1024)).toFixed(2);
}


getContext();

function getContext() {
    const lsSize = localStorageSize();
    document.getElementById('localStorage-memory-usage').innerHTML = `${lsSize} KB`;
    document.getElementById('localStorage-memory-keys').innerHTML = '';
    const dataLocalStorage = storageKeys(localStorage);
    dataLocalStorage.keys.forEach((x, i) => {
        document.getElementById('localStorage-memory-keys').append(createMemoryLabel(dataLocalStorage.keys[i], dataLocalStorage.size[i]));
    });

    document.getElementById('sessionStorage-memory-usage').innerHTML = `${sessionStorgeSize()} KB`;
    document.getElementById('sessionStorage-memory-keys').innerHTML = '';
    const dataSessionStorage = storageKeys(sessionStorage);
    dataSessionStorage.keys.forEach((x, i) => {
        document.getElementById('sessionStorage-memory-keys').append(createMemoryLabel(dataSessionStorage.keys[i], dataSessionStorage.size[i]))
    });
}

function createMemoryLabel(text, size, color) {
    const d = document.createElement('div');
    d.classList.add('text-muted', 'fs-7', 'd-flex');
    const dText = document.createElement('div');
    dText.classList.add('flex-grow-1');
    const dSize = document.createElement('div');
    dSize.innerHTML = `${size} KB`
    d.innerHTML = text;

    d.append(dText);
    d.append(dSize);
    return d;
}