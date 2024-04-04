import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-9b7f6-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementInDB = ref(database, "endorsement/comment")

const messageBoxEl = document.getElementById("messagebox-el")
const inputFromEl = document.getElementById("input-from")
const inputToEl = document.getElementById("input-to")
const publishBtnEl = document.getElementById("publish-btn")

const commentEl = document.getElementById("comments-el")
const commentFromEl = document.getElementById("from-el")
const commentToEl = document.getElementById("to-el")
const likesBtn = document.getElementById("likes-btn")
const likesCounterEl = document.getElementById("likes-counter")

publishBtnEl.addEventListener("click", function() {    
    let message = {
        endorsement : messageBoxEl.value,
        inputFrom: inputFromEl.value,
        inputTo: inputToEl.value
    }    
    push(endorsementInDB, message)     
    clearMessageBox()
})
//The onValue method uses the DB snapshot to update all clients based on data changes
onValue(endorsementInDB, function(snapshot) {    
    
    if(snapshot.exists()) {
       let comments = Object.entries(snapshot.val())  
       clearCommentsEl()  
// The for-loop runs through each comment and assigns each comment to the currentComment variable
            for( let i = 0; i < comments.length; i++) {
            let currentComment = comments[i]
            let currentCommentValue = currentComment[1] 
// Reasigning the currentComment variable allows me to use the dot notation to separate the message from the From and To inputs.                      
            let comment = currentCommentValue.endorsement
            let commentFrom = currentCommentValue.inputFrom
            let commentTo = currentCommentValue.inputTo
                
            appendComment(currentComment, comment, commentFrom, commentTo)
          }
    } else {
        commentEl.innerHTML = `<p>No endorsements have been published yet.</p>`
    } 
})

function clearCommentsEl() {
    commentEl.innerHTML = ""
}

function clearMessageBox() {
    messageBoxEl.value = ""
    inputFromEl.value = ""
    inputToEl.value = ""
}

function appendComment(message, commentText, fromElText, toElText ) {
    let mssgID = message[0]
//The createElement allows to design the HTML to post the comments.
    let newCommentEl = document.createElement("div")      
    newCommentEl.innerHTML +=  `   
        <div id="comments-el">             
            <h3 id="to-el">To: ${toElText}</h3>
            <div class="likes">
            <button id="likes-btn">💜</button><div id="likes-counter">3</div> 
            </div>
            <p>${commentText}</p>
            <h3 id="from-el">From: ${fromElText}</h3>                        
        </div>
    ` 
    commentEl.append(newCommentEl)
//This section of the funtion grabs the comment ID and remove it from the DB 
    newCommentEl.addEventListener("dblclick", function() {
      let messagelocationInDB = ref(database, `endorsement/comment/${mssgID}`)
        remove(messagelocationInDB)
    })   
}
