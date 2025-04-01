import { getBarbers } from './requests.js';


import '../styles/manageEmployees.css';

const manageEmployeesView = '<div class="manageEmployeesContainer containerFunctionalityView"></div>';

const postEmployee = `
  <div class="postEmployee present-container">
    <h2>Administrar empleados</h2>
    <p class="postEmployee-p">Puede agregar nuevos empleados o quitarlos, además de cambiar su nombre y/o contraseña.</p>
    <button type="button" class="postEmployee-btn">
      <img src="/assets/icons/person-fill-add.svg">
      Agregar <br> Empleado
    </button>
  </div>
`;

const modal = `
  <div class="modal fade" id="postEmployee" tabindex="-1" aria-labelledby="postEmployeeLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="postEmployeeLabel">Registrar empleado</h1>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
           <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">

          <form id="formPOSTEmployee">
            <label for="username">Usuario</label>
            <input type="text" id="username" name="Nombre" class="input" required>

            <label for="password">Constraseña</label>
            <input type="password" id="password" name="Contrasena" class="input" required>

            <label for="rol">Rol</label>
            <input type="text" id="rol" class="input" name="Rol" value="Empleado" readonly>
            
            <div class="modal-footer modal-footer-without-padding">
              <button type="submit" class="btn btn-success btnPost">Registrar</button>
              <button class="btn btn-danger btnCancel" data-bs-dismiss="modal">Cancelar</button>
              <div class="loader-container">
                <img src="/assets/tube-spinner.svg" alt="loading" class="loader">
              </div>
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
          <td class="btns-actions">
            <button class="table-btns modify">
              <i class="bi bi-pencil-fill" key=${user.Id}></i>
            </button>
            <button class="table-btns delete">
              <i class="bi bi-trash-fill"></i>
            </button>
          </td>
        </tr>
      `;
    };
  });

  return row;
};

const usersData = async () => {
  try {
    const data = await getBarbers();
      
    if (data.length > 1) {
      let tableEmployees = `
        <div class="table-container table-manageemployees-container">
          <table>
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">USUARIO</th>
                <th scope="col">CONTRASEÑA</th>
                <th scope="col">ROL</th>
                <th scope="col" class="container-btns-actions">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              ${rows(data)}
            </tbody>
          </table>
        </div>
        <div class="table-container-footer"></div>
      `;

        return tableEmployees;

    } else {
      return '<p class="empty">No hay empleados registrados.</p>'
    }
  } catch (error) {
    alert('Error al cargar los empleados.');
  };
};


export { 
  postEmployee, 
  modal, 
  manageEmployeesView,  
  usersData
};
