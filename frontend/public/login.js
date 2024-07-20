const mensajeError = document.getElementsByClassName("error")[0];

const $ = el => document.getElementById(el);

const loginForm = $('login-form')

loginForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const username = $('user').value;
  const password = $('password').value;

  await fetch('/login', {
    method:"POST",
    headers: {
      "Content-Type":"application/json",
    },
    body: JSON.stringify({username, password})
  })
  .then(res => {
    if (res.ok) {
      window.location.href = '/turns'
      console.log("sesion iniciada correctamente, entrando...")
    } else {
      return mensajeError.classList.toggle("escondido", false)
    }
  })
})