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
let homeSectionNoteCardPenAndCheckEl = document.getElementById("homeSectionNoteCardPenAndCheck"+id)
let homeSectionNoteCardPenEl = document.getElementById("homeSectionNoteCardPen" + id)
let homeSectionNoteCardCheckEl = document.getElementById("homeSectionNoteCardCheck" +id)
let homeSectionNoteCardDeleteEl = document.getElementById("homeSectionNoteCardDelete"+id)
let homeSectionNoteCardTimeEl = document.getElementById("homeSectionNoteCardTime" + id)
    if (homeSectionNoteCardIconEl.classList.contains("fa-chevron-down")) {
        homeSectionNoteCardTimeEl.classList.remove("d-none")
        homeSectionNoteCardIconEl.classList.remove("fa-chevron-down")
        homeSectionNoteCardIconEl.classList.add("fa-angle-up")
        homeSectionNoteCardNoteEl.classList.remove("d-none")
        homeSectionNoteCardPenAndCheckEl.classList.remove("d-none")
        homeSectionNoteCardDeleteEl.classList.remove("d-none")
        homeSectionNoteCardPenEl.onclick = function() {
            homeSectionNoteCardPenEl.classList.add("d-none")
            homeSectionNoteCardCheckEl.classList.remove("d-none")
                homeSectionNoteCardNoteInputEl.classList.remove("d-none")
                homeSectionNoteCardNoteEl.classList.add("d-none")
                homeSectionNoteCardNoteInputEl.value = homeSectionNoteCardNoteEl.textContent
        }
            
            homeSectionNoteCardCheckEl.onclick = function(){
                homeSectionNoteCardPenEl.classList.remove("d-none")
            homeSectionNoteCardCheckEl.classList.add("d-none")
                homeSectionNoteCardNoteInputEl.classList.add("d-none")
                homeSectionNoteCardNoteEl.classList.remove("d-none")
                homeSectionNoteCardNoteEl.innerHTML = homeSectionNoteCardNoteInputEl.value
            }

        } else {
            homeSectionNoteCardTimeEl.classList.add("d-none")
        homeSectionNoteCardIconEl.classList.add("fa-chevron-down")
        homeSectionNoteCardIconEl.classList.remove("fa-angle-up")
        homeSectionNoteCardNoteEl.classList.add("d-none")
        homeSectionNoteCardPenAndCheckEl.classList.add("d-none")
        homeSectionNoteCardDeleteEl.classList.add("d-none")
        homeSectionNoteCardNoteInputEl.classList.add("d-none")
    }


}
        
        