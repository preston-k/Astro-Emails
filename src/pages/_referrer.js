import 'https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js';
import 'https://www.gstatic.com/firebasejs/8.0.0/firebase-database.js';
// import 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js'
import { SnackBar } from './snackbar';

const firebaseConfig = {
  apiKey: 'AIzaSyB-ZYqrpT04a5zOkB5uQYK3lE3CuMhkhC8',
  authDomain: 'oauth-page-ad3c2.firebaseapp.com',
  databaseURL: 'https://oauth-page-ad3c2-default-rtdb.firebaseio.com',
  projectId: 'oauth-page-ad3c2',
  storageBucket: 'oauth-page-ad3c2.appspot.com',
  messagingSenderId: '401481049573',
  appId: '1:401481049573:web:f1f9ca852e96d580cf3b0c',
};
firebase.initializeApp(firebaseConfig);
let database = firebase.database();
function readCookie(cookieName) {
  const nameEQ = cookieName + '=';
  const cookiesArray = document.cookie.split(';');
  let cd = null;
  for (let i = 0; i < cookiesArray.length; i++) {
    let cookie = cookiesArray[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      cd = cookie.substring(nameEQ.length, cookie.length);
      break;
    }
  }
  ``;
  return cd;
}
let disableAnimation = document.querySelector('#disable');

disableAnimation.addEventListener('click', () => {
  console.log('Disable Animation')
  document.querySelector('#verify-loader').style.animation = 'none'
  document.querySelector('#verify-loader').style.background = 'lightblue'
  console.log(document.querySelector('#verify-loader'))
});
// check for snackbars here
function cannot() {
  document.querySelector('#missingperms').style.display = 'block';
  document.querySelector('#sucess').style.display = 'none';
  document.querySelector('#error').style.display = 'none';
  // document.body.classList.add('greens-screen-animation')
  document.querySelector('#maincontent').style.display = 'none';
}
const urlParams = new URLSearchParams(window.location.search);
let email = urlParams.get('e');
console.log(email);
let what = urlParams.get('do');
console.log(what);
let ts = urlParams.get('ts');
console.log(ts);
let id = urlParams.get('id');
console.log(id);
if (email == '' || email == null) {
  cannot();
}
if (ts == '' || email == null) {
  cannot();
}
if (id == '' || email == null) {
  cannot();
}
if (what == '' || email == null) {
  cannot();
}
async function twofactor() {
  let id = urlParams.get('id');
  let inputtedcode = document.querySelector('#num').value;
  console.log(inputtedcode);
  document.getElementById('maincontent').style.display = 'none';
  document.getElementById('sucess').style.display = 'none';
  document.getElementById('error').style.display = 'none';
  document.getElementById('verify').style.display = 'block';
  firebase
    .database()
    .ref(`2fa/${inputtedcode}`)
    .once('value')
    .then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        const { id, email, status } = data;
        console.log(id);
        if (status == 'unused') {
          database.ref('2fa/' + inputtedcode).update({
            status: 'used',
          });
          document.getElementById('maincontent').style.display = 'none';
          document.getElementById('verify').style.display = 'none';
          document.getElementById('error').style.display = 'none';
          document.getElementById('sucess').style.display = 'block !important';
          document.body.classList.add('green-screen-animation');
          let queryString = window.location.search.substring(1);
          console.log(queryString);
          setTimeout(() => {
            window.location.replace(
              'https://oauth.prestonkwei.com/account?' +
                queryString +
                '&immediate=authtoken'
            );
          }, 4000);
        } else {
          document.getElementById('maincontent').style.display = 'none';
          document.getElementById('sucess').style.display = 'none';
          document.getElementById('verify').style.display = 'none';
          document.getElementById('error').style.display = 'block !important';
          document.body.classList.add('red-screen-animation');
          setTimeout(() => {
            window.location.replace(
              'https://oauth.prestonkwei.com/login?f2fa=true'
            );
          }, 4000);
        }
      } else {
        // Can't find auth token
        document.getElementById('maincontent').style.display = 'none';
        document.getElementById('sucess').style.display = 'none';
        document.getElementById('verify').style.display = 'none';
        document.getElementById('error').style.display = 'block';
        document.body.classList.add('red-screen-animation');
        setTimeout(() => {
          window.location.replace(
            'https://oauth.prestonkwei.com/login?f2fa=true'
          );
        }, 5000);
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}

if (email == null || email == '') {
  cannot();
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
  let d = new Date();
  let ts = d.toString();

  await database.ref('2fa/' + code).update({
    code: code,
    email: email,
    status: 'unused',
    ts: ts,
  });
  return code;
}

let sendEmail = email.replace(/,/g, '.').replace(/_/g, '@');
let hiddenemail = sendEmail.replace(
  /^(..).*(.)(@.)(.*)(..)(\..*)$/,
  '$1***$2$3$4**$5$6'
);
document.querySelector(
  '#sentto'
).innerHTML = `We just sent an email containing a 6 digit code to ${hiddenemail}. Please enter it below to finish logging into your account!`;

if (sessionStorage.getItem('emailsent') != 'true') {
  let code = generateCode();
  const data = new FormData();
  data.set('sendto', sendEmail);
  data.set('subject', 'Here\'s the login code you requested');
  data.set(
    'html',
    `<style>.main {border: 2px solid black;}<div id='main'></style><h1>Hello!</h1><p>A new login has been detected in your account. To protect your account, please use this code provided below. <div id='sub'>Please enter code: <strong>${await code}</strong></p><p>If you didn't request this code...</p><p>Change your password IMMEDIATELY. Somebody has your password, but don\'t worry, they do not have access to your account. We blocked their access. Reset your password here: https://emailserver.prestonkwei.com/reset</div></div>`
  );
  data.set(
    'content',
    `Hello! A new login has been detected in your account. Please enter code: ${await code}. If you didn't request this code...</p><p>Change your password IMMEDIATELY. Somebody has your password, but don\'t worry, they do not have access to your account. We blocked their access. Reset your password here: https://emailserver.prestonkwei.com/reset`
  );
  fetch('/email', {
    method: 'POST',
    body: data,
  }).catch(() => {});
  let now = new Date();
  let time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
  sessionStorage.clear();
  sessionStorage.setItem('emailsent', 'true');
  sessionStorage.setItem('emailsent-ts', time);
  console.log('Email sent');
  if (urlParams.get('snackbar') == 'sent') {
    SnackBar({
      position: 'tc',
      message: 'Email Sent Sucessfully!',
      status: 'green',
      width: '80vw',
    });
  }
}
document.querySelector('#num').addEventListener('input', () => {
  if (document.querySelector('#num').value.length == 6) {
    twofactor();
  }
});
document.querySelector('#sendnew').addEventListener('click', () => {
  console.log('Send new code');
  let sendtime = sessionStorage.getItem('emailsent-ts');
  let curNow = new Date();
  let curTime =
    curNow.getHours() + ':' + curNow.getMinutes() + ':' + curNow.getSeconds();
  function timeToSeconds(time) {
    let [hours, minutes, seconds] = time.split(':');
    return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
  }

  let timeDifference = Math.abs(
    timeToSeconds(curTime) - timeToSeconds(sendtime)
  );

  if (timeDifference > 60) {
    sessionStorage.clear();
    console.log('More than 60 seconds have passed.');
    window.location.replace(window.location.href + '&snackbar=sent');
  } else {
    console.log(`${60 - timeDifference} seconds more.`);
    SnackBar({
      position: 'tc',
      message: `Please wait ${
        60 - timeDifference
      } seconds before sending another email!`,
      status: 'red',
      width: '80vw',
    });
  }
});
