export default function getAllFromIndexedDB(database, table) {
    const indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;

    if (!indexedDB) {
        alert.log(`Your browser doesn't support IndexedDB`);
        return;
    }
    return new Promise(
        function (resolve, reject) {
            const request = indexedDB.open(database, 1);
            request.onerror = (event) => {
                reject(Error(`Database error: ${event.target.errorCode}`))
            }
            request.onsuccess = (event) => {
                const db = event.target.result;
                let res;
                const txn = db.transaction([table], 'readonly');
                const store = txn.objectStore(table);
                const query = store.getAll();
                query.onsuccess = e => {
                    res = e.target.result;
                }
                txn.oncomplete = function () {
                    db.close();
                    resolve(res)
                };
            }
        }
    )
}

// getAllFromIndexedDB('db-primary', 'Log') 