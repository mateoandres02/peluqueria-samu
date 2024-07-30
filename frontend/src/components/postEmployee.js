import '../styles/postEmployee.css';

let postEmployeeView = '<div class="container-postEmployee"></div>';

const registerEmployee = `
  <div class="container">
    <h3>Registrar empleado.</h3>
    <button class="postBarberBtn">Registrar empleado</button>
  </div>
`;

const rows = (data) => {

  let row = '';

  data.forEach(user => {
    row += `
      <tr>
        <td>${user.Id}</td>
        <td>${user.Nombre}</td>
        <td>${user.Rol}</td>
        <td>
          <button>Eliminar</button>
          <button>Modificar</button>
        </td>
      </tr>
    `;
  })

  return row;

};

const usersData = async () => {

  try {
    
    const response = await fetch("http://localhost:3001/users");
    
    if (!response.ok) {
      alert('Hubo algun error en obtener los usuarios.');
    } else {
      const data = await response.json();
      
      if (data.length > 1) {
        let tableEmployees = `
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${rows(data)}
              </tbody>
            </table>
          </div>
        `;

        return tableEmployees;

      } else {
        return '<p>No hay empleados registrados.</p>'
      }
    };
  } catch (error) {
    console.log(error);
  }

}

export { registerEmployee, usersData, postEmployeeView };
















// const postEmployeeForm = `
//   <div class="post-container">
//       <h1>Hola barbero</h1>
//       <form id="post-barber" >
//           <label for="username">Nombre del empleado</label>
//           <input type="text" id="username" class="input" required>

//           <label for="password">Contraseña</label>
//           <input type="password" id="password" class="input" required>

//           <label for="rol">Rol</label>
//           <input type="text" id="rol" class="input" value="Empleado" readonly>

//           <div class="form-buttons">
//             <button type="submit" class="btn btn-success">Guardar</button>
//           </div>
//         </form>
//   </div>
// `;