/**
 * @typedef Event
 * @property {number} id - ID of the event
 * @property {string} name - Event name
 * @property {string} description - Event description
 * @property {string} date - ISO date string
 * @property {string} location - Where event is happening
 * @property {string[]} guests - Guest list
 */

// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2507-ftb-ct-web-pt-a";
const RESOURCE = "/events";
const API = BASE + COHORT + RESOURCE;

// === State ===
let events = [];
let selectedEvent;

/** Updates state with all events from the API */
async function getEvents() {
  try {
    const response = await fetch(API);
    const result = await response.json();
    events = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with a single event from the API */
async function getEvent(id) {
  try {
    const response = await fetch(API + "/" + id);
    const result = await response.json();
    selectedEvent = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Renders the event list */
function EventList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("lineup");

  const $items = events.map((event) => {
    const $li = document.createElement("li");
    $li.textContent = event.name;
    $li.addEventListener("click", () => getEvent(event.id));

    if (selectedEvent && selectedEvent.id === event.id) {
      $li.style.fontStyle = "italic";
      $li.style.fontWeight = "bold";
    }

    return $li;
  });

  $ul.replaceChildren(...$items);
  return $ul;
}

/** Renders the details of the selected event */
function EventDetails() {
  if (!selectedEvent) {
    const $p = document.createElement("p");
    $p.textContent = "Please select an event to learn more.";
    return $p;
  }

  const $event = document.createElement("section");
  $event.classList.add("event");
  $event.innerHTML = `
    <h3>${selectedEvent.name} #${selectedEvent.id}</h3>
    <p>${selectedEvent.date}</p>
    <p><em>${selectedEvent.location}</em></p>
    <p>${selectedEvent.description}</p>
  `;

  if (selectedEvent.guests && selectedEvent.guests.length > 0) {
    const $ul = document.createElement("ul");
    selectedEvent.guests.forEach((guest) => {
      const $li = document.createElement("li");
      $li.textContent = guest;
      $ul.appendChild($li);
    });
    $event.appendChild($ul);
  }

  return $event;
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <section id="list">
        <h2>Upcoming Parties</h2>
        <div id="eventList"></div>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <div id="eventDetails"></div>
      </section>
    </main>
  `;

  $app.querySelector("#eventList").replaceWith(EventList());
  $app.querySelector("#eventDetails").replaceWith(EventDetails());
}

// === Init ===
async function init() {
  await getEvents();
  render();
}

init();
