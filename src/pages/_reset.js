import "https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js"
import "https://www.gstatic.com/firebasejs/8.0.0/firebase-database.js"

const firebaseConfig = {
  apiKey: "AIzaSyB-ZYqrpT04a5zOkB5uQYK3lE3CuMhkhC8",
  authDomain: "oauth-page-ad3c2.firebaseapp.com",
  databaseURL: "https://oauth-page-ad3c2-default-rtdb.firebaseio.com",
  projectId: "oauth-page-ad3c2",
  storageBucket: "oauth-page-ad3c2.appspot.com",
  messagingSenderId: "401481049573",
  appId: "1:401481049573:web:f1f9ca852e96d580cf3b0c"
} 
firebase.initializeApp(firebaseConfig) 
let database = firebase.database() 

function uuid() {
  let generated = self.crypto.randomUUID() 
  return generated
}
const urlParams = new URLSearchParams(window.location.search)
let now = urlParams.get('now')
if (now == 'true') {
  document.querySelector('#main').style.display = 'none'
  document.querySelector('#reset-content').style.display = 'block'
  if (urlParams.get('e') == null || urlParams.get('e') == '') {
    alert('Sorry, we encountered an error. Please try again. If this issue persists, please email techhelp@prestonkwei.com.')
    window.location.replace('/reset')
  }
}
let resetform = document.querySelector('#emailinputform').addEventListener('submit', (event) => {
  let email = document.querySelector('#emailresetbox').value
  event.preventDefault()
  console.log('Email Submitted!')
  document.querySelector('#prelim').style.display = 'none'
  document.querySelector('#prelimtitles').style.display = 'none'
  document.querySelector('.loader').style.display = 'block'
  const data = new FormData()
  data.set('sendto', email)
  data.set('subject','Here\'s the link to reset your password')
  data.set('html',`<h1>Hello!</h1><p>We just received a request to reset your password. If you did NOT request this link, please disreguard this email.</p><p>Click this link or copy and paste it into your browser to reset your password: https://emailserver.prestonkwei.com/reset?now=true&id=${uuid()}&e=${email}.</p>`)
  data.set('content', `We just received a request to reset your password. If you did NOT request this link, please disreguard this email.</p><p>Click this link or copy and paste it into your browser to reset your password: https://emailserver.prestonkwei.com/reset?now=true&id=${uuid()}&e=${email}.`) // FALLBACK IN CASE THE HTML FAILS
  fetch("/email", {
    method: "post",
    body:data,
  }).catch(()=>{})
  document.querySelector('.loader').style.display = 'none'
  document.querySelector('#emailcheck').style.display = 'block'
})
async function hashPassword(password) {
  const encoder = new TextEncoder() 
  const data = encoder.encode(password) 
  const hash = await crypto.subtle.digest('SHA-256', data) 
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('') 
}
async function updateDb(pw, email) {
  console.log(pw + email)
  try {
    await database.ref(`users/${email}/`).update({
      pw: pw
    })
    document.querySelector('#reset-content').style.display = 'none'
    document.body.classList.add('green-screen-animation')
    document.querySelector('#sucess').style.display = 'block'
    setTimeout(() => {
      window.location.replace('https://oauth.prestonkwei.com/')
    }, 4000)
  } catch (error) {
    document.querySelector('#reset-content').style.display = 'none'
    document.body.classList.add('red-screen-animation')
    document.querySelector('#error').style.display = 'block'
    setTimeout(() => {
      document.querySelector('#reset-content').style.display = 'block'
      document.body.classList.remove('red-screen-animation')
      document.querySelector('#error').style.display = 'none'
    }, 4000)
  } 
}
document.querySelector('#newreset-form').addEventListener('submit', async (event) => {
  event.preventDefault()
  console.log('Submitted!')
  let urlemail = urlParams.get('e')
  let firebaseemail = urlemail.replace(/\./g, ',').replace(/@/g, '_')
  console.log(firebaseemail)
  console.log(document.querySelector('#newpw').value)
  console.log(document.querySelector('#confirmpw').value)
  if (document.querySelector('#newpw').value != document.querySelector('#confirmpw').value) {
    document.querySelector('#error').innerHTML = 'Passwords don\'t match! Please try again.'
    document.querySelector('#error').style.display = 'block'
    setTimeout(() => {
      document.querySelector('#error').style.display = 'none'
    }, 5000)
  } else {
    console.log('Passwords Match!')
    if (document.querySelector('#newpw').value.length < 8) {
      console.log('Less then 8 characters')
      document.querySelector('#error').innerHTML = 'Passwords must be at least 8 chracters long. Please try again.'
      document.querySelector('#error').style.display = 'block'
      setTimeout(() => {
        document.querySelector('#error').style.display = 'none'
      }, 5000)
    } else {
      let hashed = await hashPassword(document.querySelector('#newpw').value)
      console.log(hashed)
      updateDb(hashed, firebaseemail)
    }
  }
})