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

function localStorageKeys() {
    const data = Object.entries(localStorage).map(x => x[1]);
    const keys = Object.entries(localStorage).map(x => x[0]);
    console.log(keys.map((x, i) => parseFloat(getkB(keys[i])) + parseFloat(getkB(data[i]))))
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
    document.getElementById('memory-usage').innerHTML = `${localStorageSize()} KB`;
    document.getElementById('memory-keys').innerHTML = '';
    const data = localStorageKeys();
    data.keys.forEach((x, i) => {
        document.getElementById('memory-keys').append(createMemoryLabel(data.keys[i], data.size[i]))
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