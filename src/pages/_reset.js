function uuid() {
  let generated = self.crypto.randomUUID() 
  return generated
}

let resetform = document.querySelector('#emailinputform').addEventListener('submit', (event) => {
  let email = document.querySelector('#emailresetbox').value
  event.preventDefault()
  console.log('Email Submitted!')
  document.querySelector('#prelim').style.display = 'none'
  document.querySelector('.loader').style.display = 'block'
  const data = new FormData()
  data.set('sendto', email)
  data.set('subject','Here\'s the link to reset your password')
  data.set('html',`<h1>Hello!</h1><p>We just received a request to reset your password. If you did NOT request this link, please disreguard this email.</p><p>Click this link or copy and paste it into your browser to reset your password: https://emailserver.prestonkwei.com/reset?now=true&id=${uuid()}.</p>`)
  data.set('content', `We just received a request to reset your password. If you did NOT request this link, please disreguard this email.</p><p>Click this link or copy and paste it into your browser to reset your password: https://emailserver.prestonkwei.com/reset?now=true&id=${uuid()}.`) // FALLBACK IN CASE THE HTML FAILS
  fetch("/email", {
    method: "post",
    body:data,
  }).catch(()=>{})
  document.querySelector('.loader').style.display = 'none'
  document.querySelector('#emailcheck').style.display = 'block'
})