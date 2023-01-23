import getAllFromIndexedDB from "./db.js";

const historicContainer = document.getElementById('historic-container')

getAllFromIndexedDB('db-primary', 'Log').then(function (response) {
    const historicMoi = response.filter(x => x.Usuario == 'Moi').sort(function (a, b) { return new Date(convertToDate(b.Fecha)) - new Date(convertToDate(a.Fecha)) });
    const historicAitor = response.filter(x => x.Usuario == 'Aitor').sort(function (a, b) { return new Date(convertToDate(b.Fecha)) - new Date(convertToDate(a.Fecha)) });
    historicContainer.innerHTML = '';

    const groupedMoi = historicMoi.reduce(function (r, a) {
        r[a.Fecha] = r[a.Fecha] || [];
        r[a.Fecha].push(a);
        return r;
    }, Object.create(null));
    const groupedAitor = historicAitor.reduce(function (r, a) {
        r[a.Fecha] = r[a.Fecha] || [];
        r[a.Fecha].push(a);
        return r;
    }, Object.create(null));


    Object.keys(groupedMoi).forEach((x, i) => {
        historicContainer.appendChild(createDiv(x, calculateCarga(groupedAitor[x]), calculateCarga(groupedMoi[x])))
    });

}).catch(function (error) {
    alert(error.message);
});

function convertToDate(dateString) {
    const d = dateString.split("/");
    const dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
    return dat;
}

function calculateCarga(list) {
    return list.reduce((acc, value) => {
        if (value.Carga == '') value.Carga = '0';
        return acc + parseFloat(value.Carga.replace(",", "."));
    }, 0);
}

function createDiv(fecha, cargaAitor, cargaMoi) {
    const d = document.createElement('div');
    d.innerHTML = `
    <div class="py-1">
    <a class="list-group-item bg-white d-flex gap-2 py-0 px-4 gap-4 rounded align-items-center border-0 shadow-sm"
        style="height: 5rem">
        <span class="align-self-center">

            <div class="fs-5 w-50 p-0" id="badge-moi">
                <span class="b-light-green t-dark-green d-flex align-items-center rounded-4 w-100"
                    style="width: 1.4rem!important;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor"
                        class="bi bi-check" viewBox="0 0 16 16">
                        <path
                            d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z">
                        </path>
                    </svg>
                </span>
            </div>
        </span>
        <span class="pt-1 form-checked-content w-100 fs-6" data-id="47" id="start-47">
            <strong style="white-space: nowrap;
            display: block;
            overflow: hidden;">${fecha}</strong>
            <div class="d-flex mt-2 gap-2 fs-7 w-100 align-items-center">
                <small
                    class="b-light-blue text-center align-self-center t-dark-blue border-rounded rounded-5 px-2"
                    style="min-width: 2rem;">Aitor: <strong>${cargaAitor}</strong></small>
                <small
                    class="b-light-green text-center align-self-center t-dark-green border-rounded rounded-5 px-2"
                    style="min-width: 2rem;">Moi: <strong>${cargaMoi}</strong></small>
            </div>
        </span>
    </a>
</div>
    `;
    return d;
}

