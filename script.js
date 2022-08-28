let addBtn = document.querySelector(".add-btn");
let removeBtn = document.querySelector(".remove-btn");
let modalCont = document.querySelector(".modal-cont");
let mainCont = document.querySelector(".main-cont");
let textCont = document.querySelector(".textarea-cont");
let allPriorityColors = document.querySelectorAll(".priority-color");
// let lockElem = document.querySelector(".ticket-lock"); 
let toolBoxColors = document.querySelectorAll(".color");

let colors = ["lightpink", "lightblue", "lightgreen", "black"];
let modalPriorityColor = colors[colors.length - 1];

let addFlag = false;
let removeFlag = false;

let lockClass = "fa-lock";
let unlockClass = "fa-lock-open";

let ticketsArr = [];

for(let i=0;i<toolBoxColors.length;i++){
    toolBoxColors[i].addEventListener("click", (e) => {
        let currentToolBoxColor = toolBoxColors[i].classList[0];

        let filteredTickets = ticketsArr.filter((ticketObj , idx)=>{
            return currentToolBoxColor === ticketObj.ticketColor;
        })

        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }
        filteredTickets.forEach((ticketsObj ,idx) => {
            createTicket(ticketsObj.ticketColor ,ticketsObj.ticketTask, ticketsObj.ticketID);
        })
    })
    toolBoxColors[i].addEventListener("dblclick", (e) => {
        let allTicketsCont = document.querySelectorAll(".ticket-cont");
        for(let i=0;i<allTicketsCont.length;i++){
            allTicketsCont[i].remove();
        }
        ticketsArr.forEach((ticketObj, idx) => {
            createTicket(ticketObj.ticketColor, ticketObj.ticketTask, ticketObj.ticketID)
        })
    })
}

allPriorityColors.forEach((colorElem, idx) => {
    colorElem.addEventListener("click", (e) => {
        allPriorityColors.forEach((priorityColorElem, idx) => {
            priorityColorElem.classList.remove("border");
        })
        colorElem.classList.add("border");
        modalPriorityColor = colorElem.classList[0];
    })
})
addBtn.addEventListener("click", (e) => {
    addFlag = !addFlag;
    if (addFlag) {
        modalCont.style.display = "flex";
    } else {
        modalCont.style.display = "none";
    }
})
// removeBtn.addEventListener("click", (e) => {
//     removeFlag = !removeFlag;
// })
removeBtn.addEventListener("click", (e) => {
    removeFlag = !removeFlag;
    console.log(removeFlag);
})
modalCont.addEventListener("keydown", (e) => {
    let key = e.key;
    if (key === "Shift") {
        createTicket(modalPriorityColor, textCont.value);
        addFlag = false;
        setModalToDefault();
    }
})
function createTicket( ticketColor, ticketTask, ticketID) {
    let id = ticketID || shortid();
    let ticketCont = document.createElement("div");
    ticketCont.setAttribute("class", "ticket-cont");
    ticketCont.innerHTML = `
            <div class="ticket-color ${ticketColor}"></div>
            <div class="ticket-id">#${id}</div>
            <div class="task-area">${ticketTask}</div>
            <div class="ticket-lock">
                <i class="fas fa-lock"></i>
            </div>
    `;
    mainCont.appendChild(ticketCont);
    if(!ticketID) ticketsArr.push({ ticketColor, ticketTask, ticketID:id});
    handleRemoval(ticketCont);
    handleLock(ticketCont);
    handleColor(ticketCont);
}
// function handleRemoval(ticket) {
//     if (removeFlag) ticket.remove();
// }
function handleRemoval(ticket, id) {
    // removeFlag -> true -> remove
    ticket.addEventListener("click", (e) => {
        if (!removeFlag) return;

        let idx = getTikcetIdx(id);

        // DB removal
        ticketsArr.splice(idx, 1);
        let strTicketsArr = JSON.stringify(ticketsArr);
        localStorage.setItem("jira_tickets", strTicketsArr);
        
        ticket.remove(); //UI removal
    })
}
function handleLock(ticket) {
    let ticketLockElem = ticket.querySelector(".ticket-lock");
    let ticketLock = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector(".task-area");
    ticketLock.addEventListener("click", (e) => {
        if (ticketLock.classList.contains(lockClass)) {
            ticketLock.classList.remove(lockClass);
            ticketLock.classList.add(unlockClass);
            ticketTaskArea.setAttribute("contenteditable", "true");
        } else {
            ticketLock.classList.remove(unlockClass);
            ticketLock.classList.add(lockClass);
            ticketTaskArea.setAttribute("contenteditable", "false");
        }
    })
}

function handleColor(ticket) {
    let ticketColor = ticket.querySelector(".ticket-color");
    ticketColor.addEventListener("click", (e) => {

        let currentTicketColor = ticketColor.classList[1];

        let currentTicketIndexColor = colors.findIndex((color) => {
            return currentTicketColor === color;
        })

        currentTicketIndexColor++;
        let newTicketColorIdx = currentTicketIndexColor % colors.length;
        let newTicketColor = colors[newTicketColorIdx];
        ticketColor.classList.remove(currentTicketColor);
        ticketColor.classList.add(newTicketColor);
    })
}
function setModalToDefault(){
    modalCont.style.display = "none";
    textCont.value = "";
    modalPriorityColor = colors[colors.length-1];
    allPriorityColors.forEach((priorityColorElem, idx) => {
        priorityColorElem.classList.remove("border");
    })
    allPriorityColors[allPriorityColors.length-1].classList.add("border");
}
