const alumnos = [];

const formulario = document.getElementById("formulario");
const contenedorAlumnos = document.getElementById("alumnos");
const contenedorBusqueda = document.getElementById("resultadoBusqueda");    
const contenedorMejores = document.getElementById("mejoresAlumnos");
const menuEliminar = document.getElementById("eliminarUltimo");
const menuOrdenar = document.getElementById("ordenarAsc");

class Alumno {
    constructor({ dni, apellido, nombre, t1n1, t1n2, t1n3, t2n1, t2n2, t2n3, t3n1, t3n2, t3n3, promedio1, promedio2, promedio3, promediog }) {
        this.dni = dni;
        this.apellido = apellido;
        this.nombre = nombre;
        this.t1n1 = t1n1;
        this.t1n2 = t1n2;
        this.t1n3 = t1n3;
        this.t2n1 = t2n1;
        this.t2n2 = t2n2;
        this.t2n3 = t2n3;
        this.t3n1 = t3n1;
        this.t3n2 = t3n2;
        this.t3n3 = t3n3;
        this.promedio1 = promedio1;
        this.promedio2 = promedio2;
        this.promedio3 = promedio3;
        this.promediog = promediog;
    }
}

function validarDNI(input) {
    // Obtener el valor del input
    var dni = input.value;
    // Expresión regular para verificar que el valor tenga exactamente 8 dígitos
    var regex = /^\d{8}$/;
    var maxLength = 8;
    // Verificar si el valor cumple con la expresión regular
    if (!regex.test(dni)) {
        // Si no cumple, eliminar el último carácter ingresado
        input.value = dni.slice(0, 8);
        // Si no cumple con la longitud muestra el span
    } else if (dni.length < maxLength) {
        document.getElementById("errorDNI").style.display = "inline";
        // Si la longitud es correcta oculta el span
    } else {
        document.getElementById("errorDNI").style.display = "none";
    }
}

function validarApellidoNombre(input) {
    // Obtener el valor del input
    var valor = input.value;
    // Expresión regular para verificar el formato del apellido
    var regex = /^[A-Za-z][A-Za-z\s]*$/;
    // Verificar si el valor cumple con la expresión regular y no comienza con espacios en blanco
    if (!regex.test(valor) || /^\s/.test(valor)) {
        // Si no cumple, eliminar los caracteres no permitidos y los espacios iniciales
        input.value = valor.replace(/^\s+/, '').replace(/[^A-Za-z\s]/g, '');
    }
}

function validarNota(input) {
    // Obtener el valor del input
    var nota = input.value;
    // Expresión regular para permitir solo números decimales
    var regex = /^\d*\.?\d*$/;
    // Verificar si el valor cumple con la expresión regular
    if (!regex.test(nota)) {
        // Si no cumple, eliminar los caracteres no permitidos
        input.value = nota.replace(/[^\d.]/g, '');
    }
}

function moveToNextInput(event, currentInput) {
    // Si se presiona la tecla enter
    if (event.key === "Enter") {
        // Previene la recarga de la pagina
        event.preventDefault();
        // Guarda en el array todos los inputs
        var inputs = Array.from(document.querySelectorAll('input:not([type="submit"])'));
        var index = inputs.indexOf(currentInput);
        if (index !== -1 && index < inputs.length - 1) {
            // Avanza de input al presionar enter
            inputs[index + 1].focus();
            //Si el input es t3n3 pasa el foco al boton
        } else if (currentInput.id === "t3n3") {
            document.querySelector('button[id="registrar"]').focus();
        } else if (currentInput.id === "apellidoBusqueda") {
            document.querySelector('button[id="buscar"]').focus();
        }
    }
}

function validarFormulario() {
    // Guardo en dni el valor del input dni
    var dni = document.getElementById("dni");
    var maxLength = 8; // número máximo de dígitos permitidos
    // Verifico si la longitud es distinta de lo permitido
    if (dni.value.length !== maxLength) {
        // Muestra el span errorDNI
        document.getElementById("errorDNI").style.display = "inline";
        // Si esta todo correcto oculta el span, carga el alumno y verifica los mejores alumnos
    } else {
        document.getElementById("errorDNI").style.display = "none";
        cargarAlumno(); // Permitir envío del formulario
        mejorAlumno(alumnos);
    }
}

formulario.addEventListener("submit", (event) => {
    //Evitamos que se recargue la pagina
    event.preventDefault();
    //Valida los datos del formulario
    validarFormulario();
})

formBuscar.addEventListener("submit", (event) => {
    //Evitamos que se recargue la pagina
    event.preventDefault();
    // Busca el alumno y resetea el form buscar
    buscarAlumno(alumnos);
    formBuscar.reset();
})

menuEliminar.addEventListener("click", (event) => {
    //Evitamos que se recargue la pagina
    event.preventDefault();
    // Busca el alumno y resetea el form buscar
    eliminarUltimoAlumno(alumnos);
})

menuOrdenar.addEventListener("click", (event) => {
    //Evitamos que se recargue la pagina
    event.preventDefault();
    // Busca el alumno y resetea el form buscar
    ordenarListado(alumnos);
})

//Funcion que permite la carga de un alumno, asignando a las variables las funciones de cada caso, luego genera un nuevo objeto y lo guarda en el arreglo de alumnos
function cargarAlumno() {
    // Se captura los valores de los inputs y se hacen los calculos correspondientes
    const dni = document.getElementById("dni").value;
    const ape = document.getElementById("apellido").value.toUpperCase();
    const nom = document.getElementById("nombre").value.toUpperCase();
    const t1n1 = parseFloat(document.getElementById("t1n1").value);
    const t1n2 = parseFloat(document.getElementById("t1n2").value);
    const t1n3 = parseFloat(document.getElementById("t1n3").value);
    const t2n1 = parseFloat(document.getElementById("t2n1").value);
    const t2n2 = parseFloat(document.getElementById("t2n2").value);
    const t2n3 = parseFloat(document.getElementById("t2n3").value);
    const t3n1 = parseFloat(document.getElementById("t3n1").value);
    const t3n2 = parseFloat(document.getElementById("t3n2").value);
    const t3n3 = parseFloat(document.getElementById("t3n3").value);
    const prom1 = calcularPromedio(t1n1, t1n2, t1n3);
    const prom2 = calcularPromedio(t2n1, t2n2, t2n3);
    const prom3 = calcularPromedio(t3n1, t3n2, t3n3);
    const promg = calcularPromedio(prom1, prom2, prom3);

    const alumno = new Alumno({
        dni: dni,
        apellido: ape,
        nombre: nom,
        t1n1: t1n1,
        t1n2: t1n2,
        t1n3: t1n3,
        promedio1: prom1,
        t2n1: t2n1,
        t2n2: t2n2,
        t2n3: t2n3,
        promedio2: prom2,
        t3n1: t3n1,
        t3n2: t3n2,
        t3n3: t3n3,
        promedio3: prom3,
        promediog: promg,
    })
    // Se carga el alumno el array de alumnos
    alumnos.push(alumno);
    // Genero el elemento alumno
    const elementoAlumno = generarAlumno(alumno);
    // Agrego en elemento alumno al contenedor
    contenedorAlumnos.appendChild(elementoAlumno);
    // Se limpia el formulario
    formulario.reset();
}

//Funcion que recibe un arreglo de notas y calcula su promedio
function calcularPromedio(n1, n2, n3) {
    let aux = n1 + n2 + n3;
    let promedio = 0;
    promedio = parseFloat((aux / 3).toFixed(1));

    return promedio;
}

function generarAlumno(alumno) {
    const div = document.createElement("div");
    //Se crea el div a insertar
    div.innerHTML = `
        <div class="card" style="width: 18rem;">
            <img src="../assets/img/estudiante.jpg" class="card-img-top w-50 h-50 mx-auto" alt="...">
            <div class="card-body">
                <h5 class="card-title">${alumno.apellido} ${alumno.nombre}</h5>
                <p class="card-text"> D.N.I.: ${alumno.dni}</p>
                <p class="card-text"> Notas 1º trimestre: ${alumno.t1n1} - ${alumno.t1n2} - ${alumno.t1n3}</p>
                <p class="card-text">Promedio 1º Timestre: ${alumno.promedio1}</p>
                <p class="card-text"> Notas 2º trimestre: ${alumno.t2n1} - ${alumno.t2n2} - ${alumno.t2n3}</p>
                <p class="card-text">Promedio 2º Timestre: ${alumno.promedio2}</p>
                <p class="card-text"> Notas 3º trimestre: ${alumno.t3n1} - ${alumno.t3n2} - ${alumno.t3n3}</p>
                <p class="card-text">Promedio 3º Timestre: ${alumno.promedio3}</p>
                <p class="card-text">Promedio General: ${alumno.promediog}</p>
            </div>
        </div>
    `;
    //Se agregan las clases del div creado
    div.classList.add("card", "listado");

    return div;
}

function generarAlumnoEncontrado(alumno) {
    const div = document.createElement("div");
    // Se crea el div a insertar
    div.innerHTML = `
        <div class="card" style="width: 12rem;">
            <img src="../assets/img/estudiante.jpg" class="card-img-top w-25 h-25 mx-auto" alt="...">
            <div class="card-body">
                <h5 class="card-title titulo-alumno-encontrado">${alumno.apellido} ${alumno.nombre}</h5>
                <p class="card-text texto-alumno-encontrado"> D.N.I.: ${alumno.dni}</p>
                <p class="card-text texto-alumno-encontrado">Promedio General: ${alumno.promediog}</p>
            </div>
        </div>
    `;
    //Se agregan las clases del div creado
    div.classList.add("card", "encontrado");

    return div;
}

function generarAlumnosTop(alumno) {
    const div = document.createElement("div");
    // Se crea el div a insertar
    div.innerHTML = `
        <div class="card" style="width: 12rem;">
            <img src="../assets/img/estudiante.jpg" class="card-img-top w-25 h-25 mx-auto" alt="...">
            <div class="card-body">
                <h5 class="card-title titulo-alumno-encontrado">${alumno.apellido} ${alumno.nombre}</h5>
                <p class="card-text texto-alumno-encontrado"> D.N.I.: ${alumno.dni}</p>
                <p class="card-text texto-alumno-encontrado">Promedio General: ${alumno.promediog}</p>
            </div>
        </div>

    `;
    //Se agregan las clases del div creado
    div.classList.add("card", "mejores");

    return div;
}

// Funcion que remueve el contenido de una busqueda exitosa
function limpiarBusqueda() {
    // Se captura la clase card dentro del id y se lo remueve
    const div = document.querySelectorAll("#resultadoBusqueda .encontrado");
    if (div != null) {
        div.forEach((elemento) => elemento.remove());   
    }
}

// Funcion que remueve el contenido de una los mejores alumnos
function limpiarMejores() {
    // Se captura la clase card dentro del id y se lo remueve
    const div = document.querySelectorAll("#mejoresAlumnos .mejores");
    if (div != null) {
        div.forEach((elemento) => elemento.remove());   
    }
}

// Funcion que remueve el contenido del listado de alumnos
function limpiarListado() {
    // Se captura la clase card dentro del id y se lo remueve
    const div = document.querySelectorAll("#alumnos .listado");
    if (div != null) {
        div.forEach((elemento) => elemento.remove());   
    }
}

//Funcion que recibe un arreglo de alumnos y comprueba si un apellido esta en dicho arreglo
function buscarAlumno(alumnos) {
    // Se captura el apellido a buscar
    let busqueda = document.getElementById("apellidoBusqueda").value.toUpperCase();
    // Se inicia el arreglo de alumnos encontrados
    const alumnosEncontrados = [];
    // Se inicia una bandera como false
    let encontrado = false;

    for (let i = 0; i < alumnos.length; i++) {
        // Si se encuentra el alumno se cambia la bander y se lo inserta en el array alumnos encontrados
        if (alumnos[i].apellido === busqueda) {
            encontrado = true;
            alumnosEncontrados.push(alumnos[i]);
        }
    }
    // Si se encontro un alumno se limpia el contenedro y se recorre el arreglo de alumnos encontrados
    // Para generar la tarjeta e insertarla al contenedor
    if (encontrado) {
        limpiarBusqueda();
        alumnosEncontrados.forEach((elemento) => {
            const alumnoBusqueda = generarAlumnoEncontrado(elemento);
            contenedorBusqueda.appendChild(alumnoBusqueda);
        });
        // Se oculta el span de errorBuscar
        document.getElementById("errorBuscar").style.display = "none"; // Ocultar mensaje de error si la longitud es correcta
        // Si no se encontro un resultado se ejecuta la funcion buscarFallida
        mostrarBusqueda();
    } else {
        buscarFallida();
    }
}

// Funcion que captura el span errorBuscar y lo muestra por dos segundos
function buscarFallida(){
    var span = document.getElementById("errorBuscar");
    span.style.display = "block";
    setTimeout(function(){
        span.style.display = "none";
    }, 2000);
}

// Funcion que captura el span si el array alumnos esta vacio y muestra un mensaje por dos segundos
function accionFallida(){
    var span = document.getElementById("listadoVacio");
    span.style.display = "block";
    setTimeout(function(){
        span.style.display = "none";
    }, 2000);
}

// Funcion que muestra el alumno encontrado por 3 segundos
function mostrarBusqueda(){
    setTimeout(function(){
        limpiarBusqueda();
    }, 3000);
}

// Funcion que calcula el mayor de todos los promedios generales del array de alumnos
function mayoPromediog(alumnos) {
    let mejorPuntaje = alumnos[0].promediog;
    for (let i = 0; i < alumnos.length; i++) {
        if (alumnos[i].promediog > mejorPuntaje) {
            mejorPuntaje = alumnos[i].promediog;
        }
    }
    return mejorPuntaje;
}

// Funcion que encuntra todos los alumnos con el mayor promedio general para mostrar los alumnos top
function mejorAlumno(alumnos) {
    let mejoresAlumnos = [];
    for (let i = 0; i < alumnos.length; i++) {
        if (alumnos[i].promediog === mayoPromediog(alumnos)) {
            // Se guardan en el array mejoresAlumnos todos los alumnos con el promedio general mas alto
            mejoresAlumnos.push(alumnos[i]);
        }
    }
    // Se limpia el contendedor de mejores alumnos
    limpiarMejores();
    // Se recorre el array de mejoresAlumnos, se genera la tarjeta y se la carga al contenedor
    mejoresAlumnos.forEach((elemento) => {
        const alumnosTop = generarAlumnosTop(elemento);
        contenedorMejores.appendChild(alumnosTop);
    });
}

function eliminarUltimoAlumno(alumnos) {
    if (alumnos.length === 0) {
        accionFallida();
    } else {
        alumnos.pop();
        limpiarListado();
        alumnos.forEach((elemento) => {
        // Genero el elemento alumno
        const alumno = generarAlumno(elemento);
        // Agrego en elemento alumno al contenedor
        contenedorAlumnos.appendChild(alumno);
        });
        mejorAlumno(alumnos);
    }
}

function ordenarListado(alumnos){
    if (alumnos.length === 0){
        accionFallida();
    }else{
        let listadoOrdenado = alumnos.sort((a,b) => a.apellido.localeCompare(b.apellido));
        limpiarListado();
        alumnos.forEach((elemento) => {
        // Genero el elemento alumno
        const alumno = generarAlumno(elemento);
        // Agrego en elemento alumno al contenedor
        contenedorAlumnos.appendChild(alumno);
        });
        mejorAlumno(alumnos);
    }   
}