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

const comments = document.getElementById("comments")
const commentEl = document.getElementById("comments-el")
const commentFromEl = document.getElementById("from-el")
const commentToEl = document.getElementById("to-el")
const likesEl = document.getElementById("likes")
const likesBtn = document.getElementById("likes-btn")
const likesCounterEl = document.getElementById("likes-counter")

publishBtnEl.addEventListener("click", function() {    
    let message = {
        endorsement : messageBoxEl.value,
        inputFrom: inputFromEl.value,
        inputTo: inputToEl.value,
        likesCount: 0
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
            let likes = currentCommentValue.likesCount
               
            appendComment(currentComment, comment, commentFrom, commentTo, likes)
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

function appendComment(message, commentText, fromElText, toElText, newLikes ) {
    let mssgID = message[0]
    let mssgValue = message[1]
    let count = mssgValue.likesCount
   
//The createElement allows to design the HTML to post the comments.
    let newCommentEl = document.createElement("li")

    let newTo = document.createElement("h3")
    newTo.id = 'to-el'
    newTo.innerHTML = `To: ${toElText}`

    let newMessage = document.createElement("p")
    newMessage.innerHTML = `${commentText}`

    let newlikesEl = document.createElement("div")
    newlikesEl.id = 'likes'
    newlikesEl.innerHTML = `<button id="likes-btn">💜</button>`
    
    let newLikesCounter = document.createElement("div")
    newLikesCounter.id = 'likes-counter'
    newLikesCounter.innerHTML = `${newLikes}`    

    let newFrom = document.createElement("h3")
    newFrom.id = 'from-el'
    newFrom.innerHTML = `From: ${fromElText}`   
       
    commentEl.append(newCommentEl, newFrom, newlikesEl, newLikesCounter, newMessage,  newTo )     

    newlikesEl.addEventListener("click", function() {        
 // let likeslocationInDB = ref(database, `endorsement/comment/${mssgID}/likesCount`)
 // if(newlikesEl = true) {
    count += 1
    newLikesCounter.innerHTML = count    
 // push(likeslocationInDB, newCountEl)
 // } 
        
    })
    
    //This section of the funtion grabs the comment ID and remove it from the DB 
    newCommentEl.addEventListener("dblclick", function() {
      let messagelocationInDB = ref(database, `endorsement/comment/${mssgID}`)
        remove(messagelocationInDB)   
    
    })  
}
