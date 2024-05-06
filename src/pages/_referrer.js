import "https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js"
import "https://www.gstatic.com/firebasejs/8.0.0/firebase-database.js"
// import "https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js"

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

let disableAnimation = document.querySelector('#disable')

disableAnimation.addEventListener('click', () => {
  document.querySelector('#loader').styles.display = 'none'
})

function cannot() {
  document.querySelector('#missingperms').style.display = 'block'
  document.querySelector('#sucess').style.display = 'none'
  document.querySelector('#error').style.display = 'none'
  // document.body.classList.add('greens-screen-animation')
  document.querySelector('#maincontent').style.display = 'none'
}
const urlParams = new URLSearchParams(window.location.search)
let email = urlParams.get('e')
console.log(email)
let what = urlParams.get('do')
console.log(what)
let ts = urlParams.get('ts')
console.log(ts)
let id = urlParams.get('id')
console.log(id)
if (email == '' || email == null) {
  cannot()
}
if (ts == '' || email == null) {
  cannot()
}
if (id == '' || email == null) {
  cannot()
}
if (what == '' || email == null) {
  cannot()
}
async function twofactor() {
  let id = urlParams.get('id')
  let inputtedcode = document.querySelector('#num').value
  console.log(inputtedcode)
  document.getElementById('maincontent').style.display = 'none'
  document.getElementById('sucess').style.display = 'none'
  document.getElementById('error').style.display = 'none'
  document.getElementById('verify').style.display = 'block'
  firebase.database().ref(`2fa/${inputtedcode}`).once('value')
    .then(snapshot => {
      const data = snapshot.val();
      if (data) {
        const { id, email, status } = data;
        console.log(id)
        if (status == 'unused') {
          database.ref('2fa/' + inputtedcode).update({ 
            status: 'used'
          }) 
          document.getElementById('maincontent').style.display = 'none'
          document.getElementById('verify').style.display = 'none'
          document.getElementById('error').style.display = 'none'
          document.getElementById('sucess').style.display = 'block'
          document.body.classList.add('green-screen-animation')
          let queryString = window.location.search.substring(1);
          console.log(queryString);
          setTimeout(() => {
            window.location.replace('https://oauth.prestonkwei.com/account?'+queryString)
          }, 4000)
        } else {
          document.getElementById('maincontent').style.display = 'none'
          document.getElementById('sucess').style.display = 'none'
          document.getElementById('verify').style.display = 'none'
          document.getElementById('error').style.display = 'block'
          document.body.classList.add('red-screen-animation');
          setTimeout(() => {
            window.location.replace('https://oauth.prestonkwei.com/')
          }, 4000)
        }
      } else {
        // Can't find auth token
        document.getElementById('maincontent').style.display = 'none'
        document.getElementById('sucess').style.display = 'none'
        document.getElementById('verify').style.display = 'none'
        document.getElementById('error').style.display = 'block'
        document.body.classList.add('red-screen-animation');
        setTimeout(() => {
          window.location.replace('https://oauth.prestonkwei.com/')
        }, 5000)
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error)
    })
  
}

if (email == null || email == '') {
  cannot()
}
async function generateCode() {
  let code = '';
  const numbers = '0123456789';
  while (code.length < 6) {
      const digit = numbers[Math.floor(Math.random() * numbers.length)];
      if (!code.includes(digit)) {
          code += digit;
      }
  }
  let d = new Date()
  let ts = d.toString()
  

  await database.ref('2fa/' + code).update({ 
    code: code,
    email: email,
    status: 'unused',
    ts: ts
  }) 
  return code
}

let sendEmail = email.replace(/,/g, '.').replace(/_/g, '@')
let code = generateCode()
const data = new FormData()
data.set('sendto', sendEmail)
data.set('subject','Here\'s the login code you requested')
data.set('html',`<style>.main {border: 2px solid black;}<div id='main'><h1>Hello!</h1><p>A new login has been detected in your account. <div id='sub'>Please enter code: ${await code}</p><p>If you didn't request this code...</p><p>Change your password IMMEDIATELY. Somebody has your password, but don\'t worry, they do not have access to your account. We blocked their access.</div></div>`)
data.set('content', `Hello! A new login has been detected in your account. Please enter code: ${await code}`)
fetch("/email", {
  method: "POST",
  body:data,
}).catch(()=>{})

document.querySelector('#num').addEventListener('input', () => {
  if (document.querySelector('#num').value.length == 6) {
    twofactor()
  }
})