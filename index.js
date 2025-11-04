//---State---
// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "2510-CPU-RM-WEB-PT";
const RESOURCE = "/events";
const API = `${BASE}/${COHORT}${RESOURCE}`;

// === State ===
let events = [];
let selectedEvent = null;

/** Updates state with all events from the API */
async function getEvents() {
  try {
    const response = await fetch(API);
    if (!response.ok)
      throw new Error(`Failed to fetch events: ${response.status}`); //throws an error if 404 or 500 error code
    //const result = await response.json();
    const json = await response.json();
    events = json.data;
    render();
  } catch (error) {
    console.error(error);
  }
}

/** Updates state with a single event from the API */
async function getEvent(id) {
  try {
    const response = await fetch(`${API}/${id}`);
    if (!response.ok)
      throw new Error(`Failed to fetch event ${id}: ${response.status}`); //throws an error if 404 or 500 error code
    const json = await response.json();
    //console.log(result, data);
    selectedEvent = json.data;
    render();
  } catch (error) {
    console.error(error);
  }
}

function eventListItem(event) {
  const $li = document.createElement("li");
  $li.innerHTML = `
    <a href="#selected">${event.name}</a>
  `;
  $li.addEventListener("click", () => getEvent(event.id));
  return $li;
}

/** A list of names of all events */
function eventList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("lineup");

  const $events = events.map(eventListItem);
  $ul.replaceChildren(...$events);

  return $ul;
}

function eventDetails() {
  if (!selectedEvents) {
    const $p = document.createElement("p");
    $p.textContent = "Please select an event to learn more.";
    return $p;
  }
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Fullstack Events</h1>
    <main>
      <section>
        <h2>Lineup</h2>
        <EventList></EventList>
      </section>
      <section id="selected">
        <h2>Event Details</h2>
        <EventDetails></EventDetails>
      </section>
    </main>
  `;
  $app.querySelector("EventList").replaceWith(ArtistList());
  $app.querySelector("EventDetails").replaceWith(ArtistDetails());
}

async function init() {
  await getEvents();
  render();
}

init();
