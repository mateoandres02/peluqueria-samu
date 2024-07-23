import '/src/styles/login.css';

const loginView = `
    <div class="main-container">
        <div class="form-container">
            <h1>Iniciar Sesión</h1>
            <hr>
            <p>Ingresa tus credenciales para acceder al área de administración de la peluquería.</p>
            <form id="login-form">
                <label for='username' class="sr-only">Usuario</label>
                <input type='text' name="username" id="username" placeholder="Nombre de Usuario" required>
                
                <label for='password' class="sr-only">Contraseña</label>
                <input type='password' name="password" id="password" placeholder="Contraseña" required>
                
                <hr class="line-form">
                
                <button type="submit">Iniciar sesión</button>
                
                <p class="error escondido">Error al iniciar sesión</p>
            </form>
        </div>
    </div>
`;

export default loginView;

