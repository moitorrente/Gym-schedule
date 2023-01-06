window.addEventListener('DOMContentLoaded', (event) => {
    console.log('DOM fully loaded and parsed');
    let title = localStorage.getItem("theme");
    if (title) setActiveStyleSheet(title);
});
function setActiveStyleSheet(title) {
    /* Grab a list of all alternate style sheets */
    let css = `link[rel="alternate stylesheet"]`;
    let stylesheets = document.querySelectorAll(css);
    /* Walk all alternate style sheets and disable them */
    stylesheets.forEach(sheet => sheet.disabled = true);
    /* Select style sheet we want to "turn on" */
    let selector = `link[title="${title}"]`;
    let stylesheet = document.querySelector(selector);
    /* Enable the style sheet */
    stylesheet.disabled = false;
    localStorage.setItem("theme", title);
}