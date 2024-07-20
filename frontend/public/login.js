const mensajeError = document.getElementsByClassName("error")[0];

const $ = el => document.getElementById(el);

const loginForm = $('login-form')

loginForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const Nombre = $('user').value;
  const Contrasena = $('password').value;
  console.log(typeof username)
  await fetch('http://localhost:3001/login', {
    method:"POST",
    headers: {
      "Content-Type":"application/json",
    },
    body: JSON.stringify({Nombre, Contrasena})
  })
  .then(res => {
    if (res.ok) {
      window.location.href = '/'
      console.log("sesion iniciada correctamente, entrando...")
    } else {
      return mensajeError.classList.toggle("escondido", false)
    }
  }).catch(error=>{console.error(error)})
})