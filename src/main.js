import calendarRender from '/src/components/calendarRender.js';
import calendario from "/src/components/calendario.js";
import menu from "/src/components/menu.js";

const d = document;
const $app = d.querySelector('#app');

d.addEventListener('DOMContentLoaded', (e) => {
    $app.innerHTML += menu;
    $app.innerHTML += calendario;

    calendarRender();
});