import loginView from './components/login.js';
import menu from './components/menu.js';
import calendario from './components/calendario.js';
import { modalElement } from './components/modal.js';
import calendarRender from './components/calendarRender.js';

const app = document.getElementById('app');

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
};

function renderLogin() {

    app.innerHTML = '';
    app.innerHTML += loginView;

    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        login(username, password);
    });
};

function login(username, password) {
    fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            Nombre: username, 
            Contrasena: password 
        })
    })
    .then(response => response.json())
    .then(data => {
        
        document.cookie = `access_token=${data.token}; path=/; max-age=${20 * 60}`;
        // document.cookie = `access_token=hola; path=/; max-age=${20 * 60}`;

        if (data.user.Rol === 'Admin') {
            // renderAdminView();
            app.innerHTML = '';

            app.innerHTML += menu;
            app.innerHTML += calendario;
            app.innerHTML += modalElement;
        
            calendarRender();

            document.getElementById('logoutBtn').addEventListener('click', () => {
                logout();
            });

        } else if (data.user.Rol === 'Empleado') {
            renderEmployeeView();
        };

    })
    .catch(error => {
        console.error('Error:', error);
    });
};

// function renderAdminView() {

//     app.innerHTML = '';

//     app.innerHTML += menu;
//     app.innerHTML += calendario;
//     app.innerHTML += modalElement;

//     calendarRender();

//     // document.getElementById('logoutButton').addEventListener('click', () => {
//     //     logout();
//     // });

// };

function renderEmployeeView() {

    app.innerHTML = `
        <div class="employee-container">
            <h1>Vista de Empleado</h1>
            <button id="logoutButton">Cerrar Sesión</button>
            <!-- Aquí puedes agregar más componentes o datos específicos del empleado -->
        </div>
    `;

    document.getElementById('logoutButton').addEventListener('click', () => {
        logout();
    });
}

export function logout() {
    fetch('http://localhost:3001/logout', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getCookie('access_token')}`
        }
    })
    .then(response => {
        if (response.ok) {
            document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
            renderLogin();
        } else {
            console.error('Error al cerrar sesión');
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


document.addEventListener("DOMContentLoaded", async () => {
    // Verificar si hay un token de acceso en las cookies
    const token = getCookie('access_token');

    console.log(token)
    
    if (token) {
        // Verificar el rol del usuario y redirigir a la vista correspondiente
        // await fetch('http://localhost:3001/protected', {
        //     method: 'GET',
        //     // headers: {
        //     //     'Authorization': `Bearer ${token}`
        //     // },
        //     credentials: 'include'
        // })
        await fetch('http://localhost:3001/protected', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.ok) {
                console.log('respónse:', response)
                return response.json();
            } else {
                throw new Error('Token inválido');
            }
        })
        .then(data => {
            if (data.user.Rol === 'Admin') {
                // renderAdminView();
                
                app.innerHTML = '';
                
                app.innerHTML += menu;
                app.innerHTML += calendario;
                app.innerHTML += modalElement;
            
                calendarRender();
                
                document.getElementById('logoutBtn').addEventListener('click', () => {
                    logout();
                });
                
            } else if (data.user.Rol === 'Empleado') {
                renderEmployeeView();
            }
        })
        .catch((e) => {
            console.log('error:', e)
            // Si el token no es válido, cargar la vista de login
            renderLogin(); 
        });
    } else {
        // Si no hay token, cargar la vista de login
        renderLogin(); 
    }
});

// import { logout } from './sesion/logout.js';
// import calendarRender from '/src/components/calendarRender.js';
// import calendario from "/src/components/calendario.js";
// import menu from "/src/components/menu.js";
// import { modalElement } from "/src/components/modal.js"

// const d = document;
// const $app = d.querySelector('#app');

// d.addEventListener('DOMContentLoaded', (e) => {
//     $app.innerHTML += menu;
//     $app.innerHTML += calendario;
//     $app.innerHTML += modalElement;
    
//     // Obtenemos el boton para cerrar la sesion y la cerramos.
//     const $logout = document.getElementById('logout');
//     $logout.addEventListener('click', logout);

//     calendarRender();
// });