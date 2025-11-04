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
      throw new Error(`Failed to fetch events: ${response.status}`);
    const json = await response.json();
    events = json.data; // array of events
    render();
  } catch (error) {
    console.error(error);
    alert("Could not load events. Please try again.");
  }
}

/** Updates state with a single event from the API */
async function getEvent(id) {
  try {
    const response = await fetch(`${API}/${id}`);
    if (!response.ok)
      throw new Error(`Failed to fetch event ${id}: ${response.status}`);
    const json = await response.json();
    selectedEvent = json.data; // single event object
    render();
  } catch (error) {
    console.error(error);
    alert("Could not load that event. Please try again.");
  }
}

/** <li><a href="#selected">{name}</a></li> with click to load details */
function eventListItem(event) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = "#selected";
  a.textContent = event.name;
  a.addEventListener("click", (e) => {
    e.preventDefault();
    getEvent(event.id);
  });
  li.appendChild(a);
  return li;
}

/** A list of names of all events */
function eventList() {
  const ul = document.createElement("ul");
  ul.classList.add("lineup");
  ul.replaceChildren(...events.map(eventListItem));
  return ul;
}

/** Details or empty-state message */
function eventDetails() {
  const section = document.createElement("div");
  if (!selectedEvent) {
    const p = document.createElement("p");
    p.textContent = "Please select an event to learn more.";
    section.appendChild(p);
    return section;
  }

  const { id, name, date, description, location } = selectedEvent;

  const h3 = document.createElement("h3");
  h3.textContent = name;

  const dl = document.createElement("dl");
  const rows = [
    ["ID", id],
    ["Date", date ? new Date(date).toLocaleString() : "—"],
    ["Location", location ?? "—"],
    ["Description", description ?? "—"],
  ];
  for (const [label, value] of rows) {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = String(value);
    dl.append(dt, dd);
  }

  section.append(h3, dl);
  return section;
}

// === Render ===
function render() {
  try {
    const app = document.querySelector("#app");
    app.innerHTML = `
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
    app.querySelector("EventList").replaceWith(eventList());
    app.querySelector("EventDetails").replaceWith(eventDetails());
  } catch (err) {
    console.error("Render failed:", err);
    alert("Something went wrong rendering the page.");
  }
}

// === Init ===
async function init() {
  await getEvents();
  // render() is already called inside getEvents, but calling here is harmless
  render();
}

init();
