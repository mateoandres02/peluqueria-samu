import '../styles/postEmployee.css';

let postEmployeeView = '<div class="containerPostEmployee"></div>';

const registerEmployee = `
  <div class="registerEmployee">
    <h3 class="registerEmployee-h3">Administración de Empleados</h3>
    <p class="registerEmployee-p">Puede agregar nuevos empleados o quitarlos, además de cambiar su nombre y contraseña.</p>
    <button class="registerEmployee-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
      <img src="../../public/assets/icons/person-fill-add.svg">
      Agregar <br> Empleado
    </button>
  </div>
`;

const modalRegisterEmployee = `
  <div class="modal fade" id="postEmployee" tabindex="-1" aria-labelledby="postEmployeeLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="postEmployeeLabel">Registrar empleado</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form id="formPOSTEmployee">
            <label for="username">Nombre</label>
            <input type="text" id="username" class="input" required>

            <label for="password">Constraseña</label>
            <input type="password" id="password" class="input" required>

            <label for="rol">Rol</label>
            <input type="text" id="rol" class="input" value="Empleado" readonly>

            <div class="modal-footer">
              <button id="closeModal" class="btn btn-danger" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-success">Registrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
`;

const rows = (data) => {

  let row = '';

  data.forEach(user => {
    row += `
      <tr>
        <td scope="row">${user.Id}</td>
        <td>${user.Nombre}</td>
        <td>${user.Contrasena}</td>
        <td>${user.Rol}</td>
        <td>
          <button class="table-btns modify">
            <i class="bi bi-pencil-fill"></i>
          </button>
          <button class="table-btns delete">
            <i class="bi bi-trash-fill"></i>
          </button>
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
            <table class="table-light">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">NOMBRE</th>
                  <th scope="col">CONTRASEÑA</th>
                  <th scope="col">ROL</th>
                  <th scope="col">ACCIONES</th>
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

};

export { registerEmployee, modalRegisterEmployee, usersData, postEmployeeView };
















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