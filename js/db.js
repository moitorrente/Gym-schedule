function createIndexedDB() {
    if (!window.indexedDB) {
        alert.log(`Your browser doesn't support IndexedDB`);
        return;
    }

    const request = indexedDB.open('db-primary', 1);
    request.onerror = (event) => {
        alert.error(`Database error: ${event.target.errorCode}`);
    };

    request.onsuccess = (event) => {
        const db = event.target.result;

        insertLog(db, { Fecha: '16/09/2022', Entrenamiento: 'A', Mesociclo: '1', TipoEntrenamiento: 'Carga', Orden: 'A1' })
    };

    request.onupgradeneeded = (event) => {
        let db = event.target.result;

        let store = db.createObjectStore('Log', {
            autoIncrement: true
        });

        // create indexes
        store.createIndex('Fecha', 'Fecha', { unique: false });
        store.createIndex('EjercicioID', 'EjercicioID', { unique: false });
    };
};

function insertLog(db, log) {
    // create a new transaction
    const txn = db.transaction('Log', 'readwrite');

    // get the Contacts object store
    const store = txn.objectStore('Log');
    //
    let query = store.put(log);

    // handle success case
    query.onsuccess = function (event) {
        console.log(event);
    };

    // handle the error case
    query.onerror = function (event) {
        console.log(event.target.errorCode);
    }

    // close the database once the 
    // transaction completes
    txn.oncomplete = function () {
        db.close();
    };
}

