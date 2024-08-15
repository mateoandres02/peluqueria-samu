/* empty css                  */(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))o(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&o(s)}).observe(document,{childList:!0,subtree:!0});function i(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(a){if(a.ep)return;a.ep=!0;const n=i(a);fetch(a.href,n)}})();var H={code:"es",week:{dow:1,doy:4},buttonText:{prev:"Ant",next:"Sig",today:"Hoy",year:"Año",month:"Mes",week:"Semana",day:"Día",list:"Agenda"},buttonHints:{prev:"$0 antes",next:"$0 siguiente",today(e){return e==="Día"?"Hoy":(e==="Semana"?"Esta":"Este")+" "+e.toLocaleLowerCase()}},viewHint(e){return"Vista "+(e==="Semana"?"de la":"del")+" "+e.toLocaleLowerCase()},weekText:"Sm",weekTextLong:"Semana",allDayText:"Todo el día",moreLinkText:"más",moreLinkHint(e){return`Mostrar ${e} eventos más`},noEventsText:"No hay eventos para mostrar",navLinkHint:"Ir al $0",closeHint:"Cerrar",timeHint:"La hora",eventHint:"Evento"};function T(e){const[t,i]=e.split("T"),[,o,a]=t.split("-"),[n,s]=i.split(":"),r=`${o}-${a}`,l=`${n}:${s}`;return{dayWithoutYear:r,timeWithoutSeconds:l,completeDate:e}}const y=`
  <div class="modal fade" id="dateClickModal" tabindex="-1" aria-labelledby="dateClickModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="dateClickModalLabel">Registrar cliente</h1>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <form id="eventForm" >
            <label for="input-name">Nombre</label>
            <input type="text" name="inputName" id="input-name" class="input" required pattern="^[a-zA-Z\\s]{1,25}$">

            <label for="input-number">Teléfono</label>
            <input type="number" name="inputNumber" id="input-number" class="input" required pattern="^\\+?\\d{1,15}$">

            <label for="eventDate">Fecha</label>
            <input type="text" name="eventDate" id="eventDate" class="input" readonly>

            <label for="event-datetime">Horario</label>
            <input type="datetime" name="dateTime" id="event-datetime" class="input" placeholder="hh:mm" readonly>

            <div class="modal-footer">
              <button type="submit" id="saveTurn" class="btn btn-success">Guardar</button>
              <button id="closeModal" class="btn btn-danger btnCancel" data-bs-dismiss="modal">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
`,I=`
  <div class="modal fade" id="dateClickModalTurnContent" tabindex="-1" aria-labelledby="dateClickModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="dateClickModalLabel">Informacion de Turno</h1>
          <button type="button" class="closeModal" data-bs-dismiss="modal" aria-label="Close">
            <i class="bi bi-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <h2 id="infoName">Nombre y Apellido: <span id="spanName"></span> </h2>
          <h2 id="infoTel">Teléfono: <span id="spanTel"></span></h2>
          <h2 id="infoDay">Día: <span id="spanDay"></span></h2>
          <h2 id="infoStartTime">Inicio de Turno: <span id="spanStartTime"></span></h2>
          <h2 id="infoEndTime">Fin de Turno: <span id="spanEndTime"></span></h2>
          <div class="modal-footer modal-footer-calendar">
            <a id="contactWsp" class="btn btn-success" href="" target="_blank">
              <i class="bi bi-whatsapp"></i>
            </a>
            <button id="deleteTurn" class="btn btn-danger btnCancel" data-bs-dismiss="modal">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
`;function q(e){const t=document,i=new bootstrap.Modal(t.getElementById("dateClickModalTurnContent"));t.getElementById("infoName"),t.getElementById("infoTel"),t.getElementById("infoDay"),t.getElementById("infoStartTime"),t.getElementById("infoEndTime");const o=t.getElementById("spanName"),a=t.getElementById("spanTel"),n=t.getElementById("spanDay"),s=t.getElementById("spanStartTime"),r=t.getElementById("spanEndTime"),{dayWithoutYear:l,timeWithoutSeconds:m}=T(e.event.startStr),{timeWithoutSeconds:d}=T(e.event.endStr),p=e.event._def.title,u=e.event._def.extendedProps.telefono,c=l,b=m,g=d;o.innerHTML="",a.innerHTML="",n.innerHTML="",s.innerHTML="",r.innerHTML="",o.innerHTML+=`${p}`,a.innerHTML+=`${u}`,n.innerHTML+=`${c}`,s.innerHTML+=`${b}`,r.innerHTML+=`${g}`,i.show();const $=document.getElementById("deleteTurn"),f=document.getElementById("contactWsp");$.addEventListener("click",async E=>{E.preventDefault(),alert("sad")}),f.addEventListener("click",async E=>{E.preventDefault();const A=`Hola ${p} espero que te encuentres muy bien!, tenes un turno agendado para el dia ${c}, a las ${b}`,w=`https://api.whatsapp.com/send?phone=${u}&text=${encodeURIComponent(A)}`;f.href=w,window.open(w,"_blank")})}function D(e,t,i){const o=document,a=new bootstrap.Modal(o.getElementById("dateClickModal")),n=o.getElementById("eventDate"),s=o.getElementById("event-datetime"),{dayWithoutYear:r,timeWithoutSeconds:l,completeDate:m}=T(e.dateStr),d=o.getElementById("eventForm");d.inputName.value="",d.inputNumber.value="",n.value=r,s.value=l,a.show(),document.querySelector(".btnCancel").addEventListener("click",u=>{u.preventDefault(),bootstrap.Modal.getInstance(a._element).hide()}),N(d,m,i,a)}async function N(e,t,i,o){const a=document.querySelector(".modal-footer"),n=document.createElement("span");n.innerHTML="Error al crear el turno.",n.style.textAlign="center",n.style.width="100%",n.style.marginTop="1rem",n.style.marginBottom="0rem",n.style.paddingBottom="0rem",document.getElementById("input-name").addEventListener("input",function(s){const r=s.target;/^[a-zA-Z\s]{1,25}$/.test(r.value)?r.setCustomValidity(""):r.setCustomValidity("solo letras y espacios hasta 25 caracteres.")}),document.getElementById("input-number").addEventListener("input",function(s){const r=s.target;/^\+?\d{1,15}$/.test(r.value)?r.setCustomValidity(""):r.setCustomValidity("Solo numeros hasta 15 digitos.")}),e.addEventListener("submit",async s=>{s.preventDefault();const r=document.getElementById("input-name"),l=document.getElementById("input-number"),m=e.inputName.value.trim(),d=e.inputNumber.value.trim(),p=i.user.Id,u=t;r.checkValidity()&&l.checkValidity()?console.log("Formulario válido. Enviando datos..."):(r.reportValidity(),l.reportValidity());const c={Nombre:m,Telefono:d,Date:u,NroUsuario:p},b="https://peluqueria-invasion-backend.vercel.app/turns",g={method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)};(await fetch(b,g)).ok?(n.innerHTML="Turno creado correctamente",n.style.color="green",setTimeout(()=>{bootstrap.Modal.getInstance(o._element).hide(),window.location.reload()},1500)):n.style.color="red",a.appendChild(n)})}const x=document;let C=document.body;const B=async e=>await(await fetch(`https://peluqueria-invasion-backend.vercel.app/turns/${e.user.Id}`)).json(),P=e=>{const[t,i]=e.split("T"),[o,a]=i.split(":");let n=o,s="";a==="00"?s="30":a==="30"&&(n=parseInt(n)+1,s="00"),n===9&&(n="09");const r=`${n}:${s}`;return`${t}T${r}`};async function v(e,t){const o=(await B(t)).map(s=>{const r=P(s.turns.Date);return{id:s.turns.Id,title:s.turns.Nombre,start:s.turns.Date,end:r,extendedProps:{telefono:s.turns.Telefono}}});let a=x.getElementById("calendar"),n=new FullCalendar.Calendar(a,{initialView:"timeGridWeek",timeZone:"America/Argentina/Cordoba",slotLabelFormat:{hour:"numeric",minute:"2-digit",omitZeroMinute:!1},slotLabelInterval:"00:30:00",slotDuration:"00:30:00",slotMinTime:"08:00:00",editable:!0,dayMaxEventRows:!0,views:{timeGrid:{dayMaxEventRows:6},dayGrid:{dayMaxEventRows:3}},allDaySlot:!1,headerToolbar:{left:"dayGridMonth,timeGridWeek,timeGridDay,myCustomButton",center:"title",right:"prev,next"},events:o,eventClick:function(s){C.insertAdjacentHTML("beforeend",I),q(s),document.querySelector(".modal").addEventListener("hidden.bs.modal",function(){this.remove()})},customButtons:{myCustomButton:{text:"boton personalizado",click:function(){alert("funcionalidad del boton personalizado")}}},dateClick:function(s){L(),C.insertAdjacentHTML("beforeend",e),D(s,n,t),document.querySelector(".modal").addEventListener("hidden.bs.modal",function(){this.remove()})},selectable:!1,locale:H});n.render()}const h='<div class="contenedorCalendario" id="calendar"></div>',R=e=>`
        <aside class="sidebar">
            <div class="sidebar-nav">
                <div class="btnHamburger">
                    <button class="hamburger hamburger--collapse" type="button">
                        <span class="hamburger-box">
                            <span class="hamburger-inner"></span>
                        </span>
                    </button>
                </div>
                <div class="profile">
                    <img src="../../public/assets/icons/profile.svg" alt="Profile Icon" class="profile-icon">
                    <span class="profile-name">${e}</span>
                </div>
            </div>
            <nav class="menu">
                <ul>
                    <li>
                        <a href="#admin-calendar">
                            <img src="../../public/assets/icons/calendar.svg" alt="Administrar calendario" class="icon">Administrar Calendario
                        </a>
                    </li>
                    <li>
                        <a href="#cash-register">
                            <img src="../../public/assets/icons/cash-register.svg" alt="Ver caja" class="icon">
                            Seguimiento de caja
                        </a>
                    </li>
                    <li>
                        <a href="#share-calendar">
                            <img src="../../public/assets/icons/share.svg" alt="Compartir calendario" class="icon">
                            Compartir calendario
                        </a>
                    </li>
                    <li>
                        <a href="#manage-employees">
                            <img src="../../public/assets/icons/edit-user.svg" alt="Administrar empleados" class="icon">
                            Administrar empleados
                        </a>
                    </li>
                    <li>
                        <a href="#generate-table">
                            <img src="../../public/assets/icons/table.svg" alt="Generar tabla" class="icon">
                            Generar Tabla Turnos
                        </a>
                    </li>
                </ul>
                <div class="button-logout-container">
                    <button id="logout">
                        Cerrar Sesion
                    </button>
                </div>
            </nav>
        </aside>
    `,O=()=>{const e=document.querySelector(".btnHamburger button");e.removeEventListener("click",M),e.addEventListener("click",M)},M=e=>{e.currentTarget.classList.toggle("is-active")},S=async()=>{try{(await fetch("https://peluqueria-invasion-backend.vercel.app/logout",{method:"POST",credentials:"include"})).ok&&(history.replaceState(null,"","/login.html"),history.pushState(null,"","/login.html"),window.location.href="/login.html")}catch(e){console.error(e)}};let j='<div class="manageEmployeesContainer"></div>';const V=`
  <div class="postEmployee">
    <h3>Administración de Empleados</h3>
    <p class="postEmployee-p">Puede agregar nuevos empleados o quitarlos, además de cambiar su nombre y contraseña.</p>
    <button type="button" class="postEmployee-btn">
      <img src="../../public/assets/icons/person-fill-add.svg">
      Agregar <br> Empleado
    </button>
  </div>
`,W=`
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
            <label for="username">Usuario</label>
            <input type="text" id="username" name="Nombre" class="input" required>

            <label for="password">Constraseña</label>
            <input type="password" id="password" name="Contrasena" class="input" required>

            <label for="rol">Rol</label>
            <input type="text" id="rol" class="input" name="Rol" value="Empleado" readonly>
            
            <div class="modal-footer">
              <button type="submit" class="btn btn-success btnPost">Registrar</button>
              <button class="btn btn-danger btnCancel" data-bs-dismiss="modal">Cancelar</button>
            </div>

          </form>
        </div>
      </div>
    </div>
  </div>
`,F=e=>{let t="";return e.forEach((i,o)=>{o>0&&(t+=`
        <tr key=${i.Id}>
          <td scope="row">${i.Id}</td>
          <td>${i.Nombre}</td>
          <td>${i.Contrasena}</td>
          <td>${i.Rol}</td>
          <td>
            <button class="table-btns modify">
              <i class="bi bi-pencil-fill" key=${i.Id}></i>
            </button>
            <button class="table-btns delete">
              <i class="bi bi-trash-fill"></i>
            </button>
          </td>
        </tr>
      `)}),t},G=async()=>{try{const e=await fetch("https://peluqueria-invasion-backend.vercel.app/users");if(!e.ok)alert("Hubo algun error en obtener los usuarios.");else{const t=await e.json();return t.length>1?`
          <div class="table-container">
            <table class="table-light">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">USUARIO</th>
                  <th scope="col">CONTRASEÑA</th>
                  <th scope="col">ROL</th>
                  <th scope="col">ACCIONES</th>
                </tr>
              </thead>
              <tbody>
                ${F(t)}
              </tbody>
            </table>
          </div>
        `:'<p class="empty">No hay empleados registrados.</p>'}}catch(e){console.log(e)}},U=e=>{e.addEventListener("click",()=>{document.querySelector("#postEmployeeLabel").textContent="Registrar empleado",document.querySelector(".btnPost").textContent="Registrar";const t=document.querySelector("#formPOSTEmployee");t.setAttribute("data-mode","create"),t.removeAttribute("data-id")})},_=(e,t,i)=>{const o=document.createElement("span");o.innerHTML="Error al crear el usuario.",o.style.textAlign="center",o.style.width="100%",o.style.marginTop="1rem",o.style.marginBottom="0rem",o.style.paddingBottom="0rem",e.addEventListener("submit",a=>{a.preventDefault();const n=e.getAttribute("data-mode"),s=e.getAttribute("data-id"),r=e.Nombre.value,l=e.Contrasena.value,m=e.Rol.value,d={Nombre:r,Contrasena:l,Rol:m};let p="https://peluqueria-invasion-backend.vercel.app/register",u="POST";n==="update"&&(p=`https://peluqueria-invasion-backend.vercel.app/users/${s}`,u="PUT"),fetch(p,{method:u,headers:{"Content-Type":"application/json"},body:JSON.stringify(d)}).then(c=>c.json()).then(c=>{c.error!==void 0?(o.innerHTML=`${c.error}`||"Usuario o contraseña inválidos.",o.style.color="red"):(o.innerHTML=n==="create"?"¡Usuario creado correctamente!":"¡Usuario actualizado correctamente!",o.style.color="green",setTimeout(()=>{bootstrap.Modal.getInstance(t._element).hide(),window.location.reload()},1500)),i.appendChild(o)}).catch(c=>{console.log("Error del servidor:",c)})})},z=(e,t,i)=>{e.addEventListener("click",o=>{o.preventDefault(),t.Contrasena.value="",t.Nombre.value="",bootstrap.Modal.getInstance(i._element).hide()})},Z=(e,t)=>{e.forEach(i=>{i.addEventListener("click",async o=>{const a=o.currentTarget.getAttribute("key"),s=await(await fetch(`https://peluqueria-invasion-backend.vercel.app/users/${a}`)).json();document.querySelector("#postEmployeeLabel").textContent="Actualizar empleado",document.querySelector(".btnPost").textContent="Actualizar";const r=document.querySelector("#formPOSTEmployee");r.setAttribute("data-mode","update"),r.setAttribute("data-id",a),r.Contrasena.value="",r.Nombre.value=s.Nombre,r.Contrasena.placeholder="Contraseña",r.Rol.value=s.Rol,t.show()})})},Y=e=>{e.forEach(t=>{t.addEventListener("click",async i=>{const o=i.currentTarget.closest("tr").getAttribute("key"),n=await(await fetch(`https://peluqueria-invasion-backend.vercel.app/users/${o}`)).json();if(console.log(n),confirm(`¿Estás seguro que quieres eliminar al empleado ${n.Nombre}?`)){const r=await fetch(`https://peluqueria-invasion-backend.vercel.app/users/${o}`,{method:"DELETE"});console.log(r),r.ok?window.location.reload():alert("Error al eliminar el usuario.")}})})},J=async e=>{const t=e.user.Nombre,i=window.location.hash;switch(app.innerHTML="",app.innerHTML+=R(t),i){case"#admin-calendar":app.innerHTML+=h,v(y,e);break;case"#cash-register":break;case"#share-calendar":break;case"#manage-employees":app.innerHTML+=j;let a=document.querySelector(".manageEmployeesContainer");a.insertAdjacentHTML("beforeend",V);const n=await G();n&&a.insertAdjacentHTML("beforeend",n),a.insertAdjacentHTML("beforeend",W);const s=document.querySelector(".postEmployee-btn");s.setAttribute("data-bs-toggle","modal"),s.setAttribute("data-bs-target","#postEmployee");const r=new bootstrap.Modal(document.getElementById("postEmployee"));U(s);const l=document.querySelector("#formPOSTEmployee"),m=document.querySelector(".modal-footer");_(l,r,m);const d=document.querySelector(".btnCancel");z(d,l,r);const p=document.querySelectorAll(".modify i");Z(p,r);const u=document.querySelectorAll(".delete i");Y(u);break;case"#generate-table":break;default:app.innerHTML+=h,v(y,e);break}O(),document.querySelector("#logout").addEventListener("click",S)},K=e=>`
        <aside class="sidebar">
            <div class="sidebar-nav">
                <div class="btnHamburger">
                    <button class="hamburger hamburger--collapse" type="button">
                        <span class="hamburger-box">
                            <span class="hamburger-inner"></span>
                        </span>
                    </button>
                </div>
                <div class="profile">
                    <img src="../../public/assets/icons/profile.svg" alt="Profile Icon" class="profile-icon">
                    <span class="profile-name">${e}</span>
                </div>
            </div>
            <nav class="menu">
                <ul>
                    <li>
                        <a href="#admin-calendar">
                            <img src="../../public/assets/icons/calendar.svg" alt="Administrar calendario" class="icon">
                            Administrar Calendario
                        </a>
                    </li>
                    <li>
                        <a href="#share-calendar">
                            <img src="../../public/assets/icons/share.svg" alt="Compartir calendario" class="icon">
                            Compartir calendario
                        </a>
                    </li>
                    <li>
                        <a href="#generate-table">
                            <img src="../../public/assets/icons/table.svg" alt="Generar tabla" class="icon">
                            Generar Tabla Turnos
                        </a>
                    </li>
                </ul>
                <div class="button-logout-container">
                    <button id="logout">
                        Cerrar Sesion
                    </button>
                </div>
            </nav>
        </aside>
    `,Q=()=>{const e=document.querySelector(".btnHamburger button");e.removeEventListener("click",k),e.addEventListener("click",k)},k=e=>{e.currentTarget.classList.toggle("is-active")},X=async e=>{const t=e.user.Nombre,i=window.location.hash;switch(app.innerHTML="",app.innerHTML+=K(t),i){case"#admin-calendar":app.innerHTML+=h,v(y,e);break;case"#share-calendar":break;case"#generate-table":break;default:app.innerHTML+=h,v(y,e);break}Q(),document.querySelector("#logout").addEventListener("click",S)};async function L(){try{const e=await fetch("https://peluqueria-invasion-backend.vercel.app/verify-token",{credentials:"include"});if(!e.ok||e.status===401)window.location.href="/login.html";else{const t=await e.json();t.user.Rol==="Empleado"?X(t):t.user.Rol==="Admin"&&J(t)}}catch{window.location.href="/login.html"}}document.addEventListener("DOMContentLoaded",()=>{L()});window.addEventListener("popstate",()=>{L()});
