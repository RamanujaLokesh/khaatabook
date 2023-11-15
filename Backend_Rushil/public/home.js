let lightModeEl = document.getElementById("lightMode")
let darkModeEl = document.getElementById("darkMode")
let contrastModeEl = document.getElementById("contrastMode")
lightModeEl.onclick = function() {
    lightModeEl.classList.add("d-none")
    darkModeEl.classList.remove("d-none")
}
darkModeEl.onclick = function() {
    darkModeEl.classList.add("d-none")
    contrastModeEl.classList.remove("d-none")
}
contrastModeEl.onclick = function() {
    contrastModeEl.classList.add("d-none")
    lightModeEl.classList.remove("d-none")
}

function handler(id){
    let homeSectionNoteCardEl = document.getElementById("homeSectionNoteCard" + id)
let homeSectionNoteCardNoteEl = document.getElementById("homeSectionNoteCardNote" +id)
let homeSectionNoteCardNoteInputEl = document.getElementById("homeSectionNoteCardNoteInput"+id)
let homeSectionNoteCardIconEl = document.getElementById("homeSectionNoteCardIcon"+id)
let homeSectionNoteCardPenEl = document.getElementById("homeSectionNoteCardPen"+id)
let homeSectionNoteCardDeleteEl = document.getElementById("homeSectionNoteCardDelete"+id)
    if (homeSectionNoteCardIconEl.classList.contains("fa-chevron-down")) {
        homeSectionNoteCardIconEl.classList.remove("fa-chevron-down")
        homeSectionNoteCardIconEl.classList.add("fa-angle-up")
        homeSectionNoteCardNoteEl.classList.remove("d-none")
        homeSectionNoteCardPenEl.classList.remove("d-none")
        homeSectionNoteCardDeleteEl.classList.remove("d-none")
        homeSectionNoteCardPenEl.onclick = function() {
            if (homeSectionNoteCardPenEl.classList.contains("fa-pen")) {
                homeSectionNoteCardPenEl.classList.remove("fa-pen")
                homeSectionNoteCardPenEl.classList.add("fa-check")
                homeSectionNoteCardNoteInputEl.classList.remove("d-none")
                homeSectionNoteCardNoteEl.classList.add("d-none")
                homeSectionNoteCardNoteInputEl.value = homeSectionNoteCardNoteEl.textContent
            } else {
                homeSectionNoteCardPenEl.classList.add("fa-pen")
                homeSectionNoteCardPenEl.classList.remove("fa-check")
                homeSectionNoteCardNoteInputEl.classList.add("d-none")
                homeSectionNoteCardNoteEl.classList.remove("d-none")
                homeSectionNoteCardNoteEl.innerHTML = homeSectionNoteCardNoteInputEl.value
            }

        }
    } else {
        homeSectionNoteCardIconEl.classList.add("fa-chevron-down")
        homeSectionNoteCardIconEl.classList.remove("fa-angle-up")
        homeSectionNoteCardNoteEl.classList.add("d-none")
        homeSectionNoteCardPenEl.classList.add("d-none")
        homeSectionNoteCardDeleteEl.classList.add("d-none")
        homeSectionNoteCardNoteInputEl.classList.add("d-none")
    }


}
        
        