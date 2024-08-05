import '../styles/manageEmployees.css';

let manageEmployeesView = '<div class="manageEmployeesContainer"></div>';

const postEmployee = `
  <div class="postEmployee">
    <h3 class="postEmployee-h3">Administración de Empleados</h3>
    <p class="postEmployee-p">Puede agregar nuevos empleados o quitarlos, además de cambiar su nombre y contraseña.</p>
    <button type="button" class="postEmployee-btn">
      <img src="../../public/assets/icons/person-fill-add.svg">
      Agregar <br> Empleado
    </button>
  </div>
`;

const modal = `
  <div class="modal fade" id="postEmployee" tabindex="-1" aria-labelledby="postEmployeeLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="postEmployeeLabel">Registrar empleado</h1>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
           <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form id="formPOSTEmployee">
            <label for="username">Nombre</label>
            <input type="text" id="username" name="Nombre" class="input" required>

            <label for="password">Constraseña</label>
            <input type="password" id="password" name="Contrasena" class="input" required>

            <label for="rol">Rol</label>
            <input type="text" id="rol" class="input" name="Rol" value="Empleado" readonly>

            <div class="modal-footer">
              <button class="btn btn-danger btnCancel" data-bs-dismiss="modal">Cancelar</button>
              <button type="submit" class="btn btn-success btnPost">Registrar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
`;

const rows = (data) => {

  let row = '';

  data.forEach((user, index) => {
    
    if (index > 0) {
      
      row += `
        <tr key=${user.Id}>
          <td scope="row">${user.Id}</td>
          <td>${user.Nombre}</td>
          <td>${user.Contrasena}</td>
          <td>${user.Rol}</td>
          <td>
            <button class="table-btns modify">
              <i class="bi bi-pencil-fill" key=${user.Id}></i>
            </button>
            <button class="table-btns delete">
              <i class="bi bi-trash-fill"></i>
            </button>
          </td>
        </tr>
      `;

    }

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
        return '<p class="empty">No hay empleados registrados.</p>'
      }
    };
  } catch (error) {
    console.log(error);
  }

};

export { postEmployee, modal, usersData, manageEmployeesView };