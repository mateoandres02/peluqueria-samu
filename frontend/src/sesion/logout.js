export const logout = async () => {
  await fetch('http://localhost:3001/logout', {
      method:"POST",
  })
  .then(res => {
      if (res.ok) {
          window.location.href = '/login.html'
          console.log("cerrando sesion")
      } else {
          console.log("la respuesta no es ok")
      }
  })
}