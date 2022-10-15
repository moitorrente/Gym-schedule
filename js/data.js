export default async function getFile(file) {
    let loc = window.location.host;
    if (loc == 'moitorrente.github.io') {
        loc = `https://moitorrente.github.io/Gym-schedule/data/${file}`;
    } else {
        loc = `/data/${file}`;
    }
    const response = await fetch(loc);
    if (response.ok) {
        const d = await response.json();
        return { ok: true, data: d };
    } else {
        return { ok: false, error: `${response.status} ${response.statusText}` }
    }
}