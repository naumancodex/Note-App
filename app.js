// ============================================================
// DOM ELEMENTS
// ============================================================

const body = document.querySelector("body");

// Theme
const themeBtn = document.querySelector(".toggle");
const themeIcon = document.querySelector("#iconMoon");
const themeFont = document.querySelector("#themeFont");

// Empty state
const emptyPage = document.querySelector(".empty");

// Add note form
const addNote = document.querySelector(".addNote");
const formCover = document.querySelector(".page-cover");
const pageTitle = document.querySelector(".pageTitle");
const closeForm = document.querySelector(".closeBtn");
const form = document.querySelector(".note-form");
const emptyAddBtn = document.querySelector("#emptyAddBtn");

// Note counts
const countAll = document.querySelector("#countAll");
const countWork = document.querySelector("#countWork");
const countPersonal = document.querySelector("#countPersonal");
const countIdeas = document.querySelector("#countIdeas");
const noteCount = document.querySelector(".note-count");

// Filters
const allNotesFilter = document.querySelector("#allNotesFilter");
const workFilter = document.querySelector("#workFilter");
const personalFilter = document.querySelector("#personalFilter");
const ideasFilter = document.querySelector("#ideasFilter");

// Search
const searchInput = document.querySelector("#searchInput");

// Notes container
const cards = document.querySelector("#cards");

// Note viewer
const noteViewer = document.querySelector("#noteViewer");
const viewerEmpty = noteViewer.querySelector(".viewer-empty");

// Form inputs
const title = document.querySelector("#title");
const content = document.querySelector("#content");
const category = document.querySelector("#category");

// Form errors
const titleErr = document.querySelector("#titleErr");
const contentErr = document.querySelector("#contentErr");
const categoryErr = document.querySelector("#categoryErr");

// Progress / download simulation
const downloadCover = document.querySelector(".download-cover");
const progressFill = document.querySelector(".progress-bar");
const progressPercent = document.querySelector(".progress-percent");
const progressStatus = document.querySelector(".progress-statefont");

//DELETE
const deleteCover = document.querySelector("#deleteCover");
const cancelDelete = document.querySelector("#cancelDelete");
const confirmDelete = document.querySelector("#confirmDelete");

// ============================================================
// REGEX VALIDATION
// ============================================================

const titleRegex =
    /^[A-Za-z0-9][A-Za-z0-9\s.,!?'"()\\-]{2,49}$/;

const contentRegex =
    /^[\s\S]{10,1000}$/;

const categoryRegex =
    /^(personal|work|ideas)$/;


// ============================================================
// APP STATE
// ============================================================

// Current theme
let currTheme = "dark";

// Current selected category
let currentCategory = "all";

// Progress interval
let progressInterval;


// ============================================================
// Mouse Follower
// ============================================================

function circleMouseFollower(){
  window.addEventListener("mousemove",(e)=>{
    document.querySelector(".minicircle").style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    document.querySelector(".minicircle").style.opacity = "1";
  })
  window.addEventListener("mouseout",(e)=>{
    document.querySelector(".minicircle").style.opacity ="0";
  })
}
circleMouseFollower();
// ============================================================
// LOAD NOTES FROM LOCAL STORAGE
// ============================================================

const savedNotes = localStorage.getItem("notes");

let notes;

if (savedNotes === null) {
    notes = [];
} else {
    notes = JSON.parse(savedNotes);
}


// ============================================================
// THEME CHANGER
// ============================================================

themeBtn.addEventListener("click", function () {

    if (currTheme === "dark") {

        currTheme = "light";

        body.classList.add("light");

        themeIcon.className = "fa-solid fa-sun";

        themeFont.textContent = "Light Mode";

    } else {

        currTheme = "dark";

        body.classList.remove("light");

        themeIcon.className = "fa-solid fa-moon";

        themeFont.textContent = "Dark Mode";
    }

});


// ============================================================
// OPEN / CLOSE NOTE FORM
// ============================================================

// Open form
addNote.addEventListener("click", function () {

    formCover.style.display = "flex";

});

emptyAddBtn.addEventListener("click", () => {
    formCover.style.display = "flex";
})

// Close form
closeForm.addEventListener("click", function () {

    formCover.style.display = "none";

});


// ============================================================
// FORM SUBMIT
// ============================================================

form.addEventListener("submit", function (dets) {

    dets.preventDefault();

    let isValid = true;


    // --------------------------------------------------------
    // Validate title
    // --------------------------------------------------------

    if (!titleRegex.test(title.value)) {

        titleErr.style.visibility = "visible";

        isValid = false;

    } else {

        titleErr.style.visibility = "hidden";

    }


    // --------------------------------------------------------
    // Validate content
    // --------------------------------------------------------

    if (!contentRegex.test(content.value)) {

        contentErr.style.visibility = "visible";

        isValid = false;

    } else {

        contentErr.style.visibility = "hidden";

    }


    // --------------------------------------------------------
    // Validate category
    // --------------------------------------------------------

    if (!categoryRegex.test(category.value)) {

        categoryErr.style.visibility = "visible";

        isValid = false;

    } else {

        categoryErr.style.visibility = "hidden";

    }


    // --------------------------------------------------------
    // Create note if everything is valid
    // --------------------------------------------------------

    if (isValid) {

        formCover.style.display = "none";

        downloadingSimulation();


        const note = {

            id: Date.now(),

            title: title.value,

            content: content.value,

            category: category.value,

            createdAt: new Date()
        };


        // Add note to array
        notes.push(note);


        // Save notes
        localStorage.setItem(
            "notes",
            JSON.stringify(notes)
        );


        // Update UI
        updateEmptyState();

        updateCount();

        renderNotes(getFilteredNotes());


        // Reset form
        form.reset();


        // Show form again after simulation
        setTimeout(function () {

            downloadCover.style.display = "none";

            formCover.style.display = "flex";

        }, 2000);

    }

});


// ============================================================
// EMPTY STATE
// ============================================================

function updateEmptyState() {

    if (notes.length === 0) {

        emptyPage.style.display = "flex";

    } else {

        emptyPage.style.display = "none";

    }

}

// ============================================================
// CREATE NOTE CARD
// ============================================================

function createNoteCard(note) {

    // --------------------------------------------------------
    // Card
    // --------------------------------------------------------

    const card = document.createElement("div");

    card.classList.add("card");

    card.dataset.id = note.id;


    // --------------------------------------------------------
    // Pin
    // --------------------------------------------------------

    const pin = document.createElement("i");

    pin.classList.add(
        "fa-solid",
        "fa-thumbtack",
        "card-pin"
    );


    // --------------------------------------------------------
    // Card body
    // --------------------------------------------------------

    const cardBody = document.createElement("div");

    cardBody.classList.add("card-body");


    // --------------------------------------------------------
    // Title
    // --------------------------------------------------------

    const cardTitle = document.createElement("h3");

    cardTitle.textContent = note.title;


    // --------------------------------------------------------
    // Description
    // --------------------------------------------------------

    const description = document.createElement("p");

    description.classList.add("card-description");

    description.textContent = note.content;


    // --------------------------------------------------------
    // Footer
    // --------------------------------------------------------

    const footer = document.createElement("div");

    footer.classList.add("card-footer");


    // --------------------------------------------------------
    // Date
    // --------------------------------------------------------

    const date = document.createElement("span");

    const now = new Date(note.createdAt);

    const formattedDate = now.toLocaleString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit",

        hour12: true

    });

    date.textContent = formattedDate;


    // --------------------------------------------------------
    // Category
    // --------------------------------------------------------

    const categoryBadge = document.createElement("span");

    categoryBadge.classList.add("category-badge");

    categoryBadge.textContent = note.category;


    // --------------------------------------------------------
    // Build card
    // --------------------------------------------------------

    footer.appendChild(date);

    footer.appendChild(categoryBadge);

    cardBody.appendChild(cardTitle);

    cardBody.appendChild(description);

    cardBody.appendChild(footer);

    card.appendChild(pin);

    card.appendChild(cardBody);


    // --------------------------------------------------------
    // Add card to page
    // --------------------------------------------------------

    cards.appendChild(card);

}


// ============================================================
// NOTE VIEWER
// ============================================================

const viewerContentBox = document.createElement("div");

viewerContentBox.classList.add("viewer-content");


const viewerHeader = document.createElement("div");

viewerHeader.classList.add("viewer-header");

// Delete button
const deleteBtn = document.createElement("button");

deleteBtn.classList.add("delete-note-btn");

deleteBtn.innerHTML = `
    <i class="fa-solid fa-trash"></i>
    <span>Delete Note</span>
`;



const viewerCategory = document.createElement("span");

viewerCategory.classList.add("category-badge");


const viewerDate = document.createElement("span");

viewerDate.classList.add("viewer-date");


const viewerMeta = document.createElement("div");

viewerMeta.classList.add("viewer-meta");


const viewerTitle = document.createElement("div");

viewerTitle.classList.add("viewer-title");


const titleText = document.createElement("h2");


// Initially hide viewer content
viewerContentBox.style.display = "none";

viewerHeader.style.display = "none";


// Build viewer
viewerMeta.appendChild(viewerDate);

viewerMeta.appendChild(viewerCategory);

viewerTitle.appendChild(titleText);

viewerTitle.appendChild(viewerMeta);

viewerHeader.appendChild(viewerTitle);
viewerHeader.appendChild(deleteBtn);

noteViewer.appendChild(viewerHeader);

noteViewer.appendChild(viewerContentBox);


// ------------------------------------------------------------
// Card click → show note
// ------------------------------------------------------------

cards.addEventListener("click", function (e) {

    const clickedCard = e.target.closest(".card");

    if (!clickedCard) return;


    // Show viewer
    viewerContentBox.style.display = "block";

    viewerHeader.style.display = "flex";

    viewerEmpty.style.display = "none";


    // Get note ID
    const noteId = clickedCard.dataset.id;


    // Find note
    const selectedNote = notes.find(function (note) {

        return note.id === Number(noteId);

    });
    // Store selected note
    deleteBtn.dataset.id = selectedNote.id;


    // Format date
    const date = new Date(selectedNote.createdAt);

    viewerDate.textContent = date.toLocaleString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric",

        hour: "2-digit",

        minute: "2-digit",

        hour12: true

    });


    // Display note
    titleText.textContent = selectedNote.title;

    viewerContentBox.textContent = selectedNote.content;

    viewerCategory.textContent = selectedNote.category;

});

// ============================================================
// DELETE NOTE
// ============================================================

let noteToDelete = null;


// Open delete popup
deleteBtn.addEventListener("click", function () {

    noteToDelete = Number(deleteBtn.dataset.id);

    deleteCover.style.display = "flex";

});


// Cancel delete
cancelDelete.addEventListener("click", function () {

    deleteCover.style.display = "none";

    noteToDelete = null;

});


// Confirm delete
confirmDelete.addEventListener("click", function () {

    if (!noteToDelete) return;


    // Remove note
    notes = notes.filter(function (note) {

        return note.id !== noteToDelete;

    });


    // Save updated notes
    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );


    // Close popup
    deleteCover.style.display = "none";


    // Clear selected note
    noteToDelete = null;


    // Update UI
    updateEmptyState();

    updateCount();

    renderNotes(getFilteredNotes());


    // Reset viewer
    viewerContentBox.style.display = "none";

    viewerHeader.style.display = "none";

    viewerEmpty.style.display = "flex";

});

// ============================================================
// DOWNLOAD / PROGRESS SIMULATION
// ============================================================

function downloadingSimulation() {

    downloadCover.style.display = "flex";


    let progress = 0;


    progressFill.style.width = "0%";

    progressPercent.textContent = "0%";

    progressStatus.textContent = "Preparing...";


    clearInterval(progressInterval);


    progressInterval = setInterval(function () {

        progress++;


        // Update progress bar
        progressFill.style.width = progress + "%";

        progressPercent.textContent = progress + "%";


        // Update status
        if (progress < 45) {

            progressStatus.textContent =
                "Creating Notes...";

        } else if (progress < 90) {

            progressStatus.textContent =
                "Almost done...";

        } else {

            progressStatus.textContent =
                "Finalizing Notes...";

        }


        // Finish
        if (progress >= 100) {

            clearInterval(progressInterval);

            progressStatus.textContent =
                "Note is ready ✓";

        }

    }, 15);

}


// ============================================================
// UPDATE NOTE COUNTS
// ============================================================

function updateCount() {

    // All notes
    countAll.textContent = notes.length;


    // Work notes
    countWork.textContent = notes.filter(function (note) {

        return note.category === "work";

    }).length;


    // Personal notes
    countPersonal.textContent = notes.filter(function (note) {

        return note.category === "personal";

    }).length;


    // Ideas
    countIdeas.textContent = notes.filter(function (note) {

        return note.category === "ideas";

    }).length;


    // Current panel count
    updateNotePanelCount();

}


// ============================================================
// FILTER BUTTONS
// ============================================================

const filterButtons = [

    allNotesFilter,

    workFilter,

    personalFilter,

    ideasFilter

];


function setActiveFilter(activeButton) {

    filterButtons.forEach(function (button) {

        button.classList.remove("active");

    });


    activeButton.classList.add("active");

}


// ============================================================
// SEARCH EMPTY STATE
// ============================================================

const searchEmpty = document.createElement("div");

searchEmpty.classList.add("search-empty");

searchEmpty.textContent = "No notes found.";

cards.parentElement.appendChild(searchEmpty);

searchEmpty.style.display = "none";


// ============================================================
// SEARCH
// ============================================================

searchInput.addEventListener("input", function () {

    const filteredNotes = getFilteredNotes();

    renderNotes(filteredNotes);

});


// ============================================================
// GET FILTERED NOTES
// ============================================================

function getFilteredNotes() {

    const searchTerm = searchInput.value.toLowerCase();


    return notes.filter(function (note) {


        // Category filter
        const matchesCategory =

            currentCategory === "all" ||

            note.category === currentCategory;


        // Search filter
        const matchesSearch =

            note.title.toLowerCase().includes(searchTerm) ||

            note.content.toLowerCase().includes(searchTerm);


        return matchesCategory && matchesSearch;

    });

}


// ============================================================
// SORT NOTES — NEWEST FIRST
// ============================================================

function sortNewestFirst(notesToSort) {

    return [...notesToSort].sort(function (a, b) {

        return new Date(b.createdAt) -
            new Date(a.createdAt);

    });

}


// ============================================================
// RENDER NOTES
// ============================================================

function renderNotes(notesToRender) {

    // Clear old cards
    cards.innerHTML = "";


    // Sort notes
    const sortedNotes =
        sortNewestFirst(notesToRender);


    // --------------------------------------------------------
    // No notes exist at all
    // --------------------------------------------------------

    if (notes.length === 0) {
        searchEmpty.style.display = "none";
        return;
    }

    // No results found on searching notes
    if (sortedNotes.length === 0) {

        searchEmpty.style.display = "flex";

        return;

    }


    // Results found
    searchEmpty.style.display = "none";


    sortedNotes.forEach(function (note) {

        createNoteCard(note);

    });

}


// ============================================================
// UPDATE NOTE PANEL COUNT
// ============================================================

function updateNotePanelCount() {

    if (currentCategory === "all") {

        noteCount.textContent =
            countAll.textContent;

    }

    else if (currentCategory === "work") {

        noteCount.textContent =
            countWork.textContent;

    }

    else if (currentCategory === "personal") {

        noteCount.textContent =
            countPersonal.textContent;

    }

    else if (currentCategory === "ideas") {

        noteCount.textContent =
            countIdeas.textContent;

    }

}


// ============================================================
// FILTER EVENTS
// ============================================================

// All notes
allNotesFilter.addEventListener("click", function () {

    currentCategory = "all";

    setActiveFilter(allNotesFilter);

    pageTitle.textContent = "All Notes";

    updateNotePanelCount();

    renderNotes(getFilteredNotes());

});


// Work
workFilter.addEventListener("click", function () {

    currentCategory = "work";

    setActiveFilter(workFilter);

    pageTitle.textContent = "Work Notes";

    updateNotePanelCount();

    renderNotes(getFilteredNotes());

});


// Personal
personalFilter.addEventListener("click", function () {

    currentCategory = "personal";

    setActiveFilter(personalFilter);

    pageTitle.textContent = "Personal Notes";

    updateNotePanelCount();

    renderNotes(getFilteredNotes());

});

// Ideas
ideasFilter.addEventListener("click", function () {

    currentCategory = "ideas";

    setActiveFilter(ideasFilter);

    pageTitle.textContent = "Ideas Notes";

    updateNotePanelCount();

    renderNotes(getFilteredNotes());

});


// ============================================================
// INITIAL APP RENDER
// ============================================================
updateEmptyState();

updateCount();

renderNotes(getFilteredNotes());

// ============================================================
// END OF THE APP
// ============================================================