import calendarRender from './calendarRender.js';
import calendario from "./calendario.js";
import menu from "./menuAdmin.js";
import { modalElement } from "./modal.js";
import { logout } from './logout.js';
import { postEmployee, modal, usersData, manageEmployeesView } from './manageEmployees.js';

const indexView = async (user) => {

    const urlActive = window.location.hash;

    app.innerHTML = '';
    app.innerHTML += menu(user);
    
    switch (urlActive) {
        case '#admin-calendar':
            
            app.innerHTML += calendario;
            app.innerHTML += modalElement;
            
            calendarRender();
            
            break;
        
        case '#cash-register':

            break;

        case '#share-calendar':

            break;
        
        case '#manage-employees':

            // Agregamos al div.app el contendor donde se va a desplegar toda la vista para administrar empleados
            app.innerHTML += manageEmployeesView;

            // Obtenemos el contenedor agregado, para luego agregar dentro de él, el resto de componentes.
            let manageEmployeesContainer = document.querySelector('.manageEmployeesContainer');

            // Agregamos el componente para registrar un empleado.
            manageEmployeesContainer.insertAdjacentHTML('beforeend', postEmployee);

            // Hacemos la carga de datos de la tabla con los registros de la base de datos.
            const tableEmployees = await usersData();

            // Cuando la tabla tenga los datos de los registros de la base de datos, la agregamos a la vista.
            if (tableEmployees) {
                manageEmployeesContainer.insertAdjacentHTML('beforeend', tableEmployees);
            };

            // Agregamos la modal para manipular las distintas acciones sobre los empleados, a la vista.
            manageEmployeesContainer.insertAdjacentHTML('beforeend', modal);
            
            // Obtenemos el boton para crear un registro.
            const $btnPostEmployee = document.querySelector('.postEmployee-btn');

            // Seteamos atributos en el boton para conectarlo a la modal.
            $btnPostEmployee.setAttribute('data-bs-toggle', 'modal');
            $btnPostEmployee.setAttribute('data-bs-target', '#postEmployee');

            // Inicializamos la modal
            const $modal = new bootstrap.Modal(document.getElementById('postEmployee'));

            // Al boton para registrar un empleado le damos el evento click.
            $btnPostEmployee.addEventListener('click', () => {

                // Configurar la modal para registrar un empleado.
                document.querySelector('#postEmployeeLabel').textContent = 'Registrar empleado';
                document.querySelector('.btnPost').textContent = 'Registrar';

                // Configuramos el formulario para registrar un empleado.
                const $formPostEmployee = document.querySelector('#formPOSTEmployee');
                $formPostEmployee.setAttribute('data-mode', 'create');

                // Removemos el atributo del usuario que se va a actualizar, dado que estamos en modo de hacer un post, no un put.
                $formPostEmployee.removeAttribute('data-id');

            });

            // Obtenemos el formulario de la modal para darle eventos.
            const $formPostEmployee = document.querySelector('#formPOSTEmployee');

            // Obtenemos el footer de la modal para luego agregarle el mensaje sobre el resultado del envio del formulario.
            const $modalFooter = document.querySelector('.modal-footer');

            // Creamos la etiqueta donde se va a almacenar el resultado del envio del formulario.
            const span = document.createElement('span');
            span.innerHTML = 'Error al crear el usuario.';
            span.style.textAlign = 'center'
            span.style.width = '100%';
            span.style.marginTop = '1rem';
            span.style.marginBottom = '0rem';
            span.style.paddingBottom = '0rem';

            // Obtenemos el boton para cancelar la accion sobre el registro.
            const $btnCancel = document.querySelector('.btnCancel');

            // Le damos eventos al boton de cancelar de la modal.
            $btnCancel.addEventListener('click', (e) => {
                // Quitamos evento por defecto (detectaba un submit)
                e.preventDefault();

                // Reseteamos contraseña puesta en otro actualizar.
                $formPostEmployee.Contrasena.value = '';               

                // Cerramos la modal.
                const bootstrapModal = bootstrap.Modal.getInstance($modal._element);
                bootstrapModal.hide();
            });

            // Manejamos el evento submit del formulario.
            $formPostEmployee.addEventListener('submit', (e) => {

                // Desactivamos el refresco por defecto del evento submit de los formularios.
                e.preventDefault();
        
                // Obtenemos el modo en el que está el formulario.
                const mode = $formPostEmployee.getAttribute('data-mode');

                // Obtenemos el id del usuario que se va a actualizar.
                const id = $formPostEmployee.getAttribute('data-id');

                // Tomamos los valores ingresados por el usuario para hacer un post.
                const username = $formPostEmployee.Nombre.value;
                const password = $formPostEmployee.Contrasena.value;
                const role = $formPostEmployee.Rol.value;
        
                // Creamos un objeto de ese usaurio.
                const user = {
                    "Nombre": username,
                    "Contrasena": password,
                    "Rol": role
                };
        
                // Configuramos variables para hacer una request a post.
                let url = 'http://localhost:3001/register';
                let method = 'POST';
        
                // Preguntamos si el modo es update para hacer una correcta request.
                if (mode === 'update') {
                    url = `http://localhost:3001/users/${id}`;
                    method = 'PUT';
                };
        
                // Hacemos la request.
                fetch(url, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(user)
                })
                .then(response => response.json())
                .then(data => {

                    // Si hubo algun error, lo mostramos en el span.
                    if (data.error !== undefined) {
                        span.innerHTML = `${data.error}` || 'Usuario o contraseña inválidos.';
                        span.style.color = 'red';
                    } else {
                        // Si entra acá significa que no hubo ningun error.

                        // Configuramos el mensaje del resultado del submit para caso positivo, dado que entró a este else.
                        span.innerHTML = mode === 'create' ? '¡Usuario creado correctamente!' : '¡Usuario actualizado correctamente!';
                        span.style.color = 'green';
            
                        // Configuramos el tiempo de presentación del span y la salida de la modal a través de una instancia de la clase modal de bootstrap.
                        setTimeout(() => {
                            const bootstrapModal = bootstrap.Modal.getInstance($modal._element);
                            bootstrapModal.hide();
                            window.location.reload();
                        }, 1500);

                    };
            
                    // Agregamos el elemento con el mensaje al footer de la modal.
                    $modalFooter.appendChild(span);
        
                })
                .catch((e) => {
                    // Error 500.
                    console.log('Error del servidor:', e);
                });
        
            });

            // Obtenemos todos los botones para modificar un registro.
            const $btnsPut = document.querySelectorAll('.modify i');

            // A cada botón le damos el evento click.
            $btnsPut.forEach(btn => {

                btn.addEventListener('click', async (e) => {

                    // Obtenemos la key del boton, el cual coincide con el id del registro.
                    const key = e.currentTarget.getAttribute('key');

                    // Hacemos una request para modificar el user con el id que coincida con la key del boton apretado
                    const response = await fetch(`http://localhost:3001/users/${key}`);
                    const data = await response.json();

                    // Configuramos mensajes de la modal.
                    document.querySelector('#postEmployeeLabel').textContent = 'Actualizar empleado';
                    document.querySelector('.btnPost').textContent = 'Actualizar';

                    // Obtenemos el form de la modal
                    const $putFormModal = document.querySelector('#formPOSTEmployee');

                    // Seteamos atributos para que la modal pase a modo create
                    $putFormModal.setAttribute('data-mode', 'update');
                    $putFormModal.setAttribute('data-id', key);

                    // Reseteamos contraseña posiblemente existente.
                    $putFormModal.Contrasena.value = ''; 

                    // Cargamos los inputs con los valores del user a modificar.
                    $putFormModal.Nombre.value = data.Nombre;
                    $putFormModal.Contrasena.placeholder = 'Contraseña';
                    $putFormModal.Rol.value = data.Rol;

                    // Mostramos la modal.
                    $modal.show();

                });

            });

            // Obtenemos todos los botones del delete
            const $btnsDelete = document.querySelectorAll('.delete i');

            // A cada boton le damos el evento click.
            $btnsDelete.forEach(btn => {
                btn.addEventListener('click', async (e) => {

                    
                    // Obtenemos la key
                    const key = e.currentTarget.closest('tr').getAttribute('key');
                    console.log(key)

                    // Hacemos una request para obtener información del registro a eliminar.
                    const response = await fetch(`http://localhost:3001/users/${key}`);
                    const data = await response.json();

                    // Confirmamos la eliminación del registro.
                    const $confirm = confirm(`¿Estás seguro que quieres eliminar al empleado ${data.Nombre}?`);

                    // Si la confirmación es true, eliminamos el registro.
                    if ($confirm) {
                        const response = await fetch(`http://localhost:3001/users/${key}`, {
                            method: 'DELETE'
                        });

                        if (response.ok) {
                            // Una vez eliminado el registro, recargamos la página.
                            window.location.reload();
                        } else {
                            alert('Error al eliminar el usuario.');
                        };
                    };
                });
            });

            break;

        case '#generate-table':

            break;
    
        default:

            app.innerHTML += calendario;
            app.innerHTML += modalElement;
            
            calendarRender();

            break;

    };

    const $btnLogout = document.querySelector('#logout');
    $btnLogout.addEventListener('click', logout);

};

export default indexView;