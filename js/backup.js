const alumnos = [];

class Alumno {
    constructor({ dni, apellido, nombre, trim1, trim2, trim3, promedio1, promedio2, promedio3, promediog }) {
        this.dni = dni;
        this.apellido = apellido;
        this.nombre = nombre;
        this.trim1 = trim1;
        this.trim2 = trim2;
        this.trim3 = trim3;
        this.promedio1 = promedio1;
        this.promedio2 = promedio2;
        this.promedio3 = promedio3;
        this.promediog = promediog;
    }

    datosAlumno() {
        console.info(`Datos del Alumno:\nApellido: "${this.apellido}"\nNombres: "${this.nombre}"\nD.N.I.: "${this.dni}"\nNotas Trimestre 1: "${this.trim1.join(", ")}"\nPromedio Trimestre 1: "${this.promedio1}"\nNotas Trimestre 2: "${this.trim2.join(", ")}"\nPromedio Trimestre 2: "${this.promedio2}"\nNotas Trimestre 3: "${this.trim3.join(", ")}"\nPromedio Trimestre 3: "${this.promedio3}"\nPromedio General: "${this.promediog}"`)
    }

    datosMAlumno() {
        console.info(`Datos del/los Alumno/s con mejor/es promedio/s:\nApellido: "${this.apellido}"\nNombres: "${this.nombre}"\nD.N.I.: "${this.dni}"\nPromedio General: "${this.promediog}"`)
    }
}

//Funcion que analiza la cadena ingresada y verifica que no este vacia, que ingrese solo letras y controla un maximo de caracteres permitidos
function solicitarTexto(texto, long) {
    let valor;
    do {
        valor = prompt(`Ingrese un ${texto}`);
        if (!valor) {
            alert(`Por favor ingrese un ${texto} válido`);
        } else if (!/^[a-zA-Z ]+$/.test(valor)) {
            alert("Por favor ingrese solo letras");
        } else if (valor.length > long) {
            alert(`El máximo de caracteres soportados es ${long}`)
        }
    } while (!valor || !/^[a-zA-Z ]+$/.test(valor) || valor.length > long);
    return valor;
}

//Funcion que permite ingresar un numero y controla que no este vacio, que solo sean numeros y que tenga una longitud de 8 caracteres
function solicitarDNI() {
    let valor;
    do {
        valor = prompt(`Ingrese el D.N.I. sin puntos ni espacios`);
        if (!valor) {
            alert(`Por favor ingrese un D.N.I. válido`);
        } else if (!/^[0-9]+$/.test(valor)) {
            alert("Por favor ingrese solo números");
        } else if (valor.length !== 8) {
            alert(`El número ingresado debe tener 8 caracteres`)
        }
    } while (!valor || !/^[0-9]+$/.test(valor) || valor.length !== 8);
    return valor;
}

//Funcion que permite ingresar 3 notas y las guarda en un arreglo. Controla que no este vacio, que solo sea un numero entero o un numero con un punto y un decimal y que este entre 0 y 10
function solicitarNotas(trimestre) {
    let notas = [];
    for (let i = 0; i < 3; i++) {
        let nota;
        do {
            nota = prompt(`Ingrese la nota ${i + 1} del ${trimestre}`);
            if (nota === null || nota.trim() === "") {
                alert("Ingrese una nota válida");
            } else if (!/^\d+(\.\d)?$/.test(nota)) {
                alert("Por favor ingrese solo números con un lugar decimal opcional");
            } else if (nota.indexOf('.') !== -1 && nota[nota.indexOf('.') + 1] === undefined) {
                alert("Por favor ingrese un dígito después del punto");
            } else if (nota.split(".").length - 1 > 1) {
                alert("Solo puede escribir un punto decimal");
            } else if (isNaN(parseFloat(nota)) || parseFloat(nota) < 0 || parseFloat(nota) > 10) {
                alert("Ingrese una nota entre 0 y 10");
            }
        } while (nota === null || nota.trim() === "" || isNaN(parseFloat(nota)) || parseFloat(nota) < 0 || nota.split(".").length - 1 > 1 || parseFloat(nota) > 10 || (nota.indexOf('.') !== -1 && nota[nota.indexOf('.') + 1] === undefined));
        notas.push(parseFloat(nota));
    }
    return notas;
}

//Funcion que recibe un arreglo de notas y calcula su promedio
function calcularPromedio(arreglo) {
    let aux = 0;
    let promedio = 0;
    for (let i = 0; i < arreglo.length; i++) {
        aux = aux + arreglo[i];
    }
    promedio = parseFloat((aux / arreglo.length).toFixed(1));

    return promedio;
}

//Funcion que recibe un arreglo de alumnos y comprueba si un apellido esta en dicho arreglo
function buscarAlumno(alumnos) {
    let busqueda = prompt("ingrese el apellido a buscar").toLocaleUpperCase();
    let encontrado = false;

    for (let i = 0; i < alumnos.length; i++) {
        if (alumnos[i].apellido === busqueda) {
            encontrado = true;
            break;
        }
    }

    (encontrado)
        ? alert(`El apellido "${busqueda}", está en el listado`)
        : alert(`El apellido "${busqueda}", no está en el listado`);
}

function mayoPromediog(alumnos){
    let mejorPuntaje = alumnos[0].promediog;
    for (let i = 0; i < alumnos.length; i++) {
        if (alumnos[i].promediog > mejorPuntaje.promediog) {
            mejorPuntaje = alumnos[i].promediog;
        }
    }
    return mejorPuntaje;
}

function mejorAlumno(alumnos) {
    let mejoresAlumnos=[];
    for (let i = 0; i < alumnos.length; i++) {
        if (alumnos[i].promediog === mayoPromediog(alumnos)) {
            mejoresAlumnos.push(alumnos[i]);
        }
    }
    mejoresAlumnos.forEach(elemento => new Alumno(elemento).datosMAlumno());
}

//Funcion que permite la carga de un alumno, asignando a las variables las funciones de cada caso, luego genera un nuevo objeto y lo guarda en el arreglo de alumnos
function cargarAlumno() {
    let dni = solicitarDNI();
    let ape = solicitarTexto("Apellido", 15).toUpperCase();
    let nom = solicitarTexto("Nombre", 25).toLocaleUpperCase();
    let trim1 = solicitarNotas("Trimestre 1");
    let trim2 = solicitarNotas("Trimestre 2");
    let trim3 = solicitarNotas("Trimestre 3");
    let prom1 = calcularPromedio(trim1);
    let prom2 = calcularPromedio(trim2);
    let prom3 = calcularPromedio(trim3);
    let promg = ((prom1 + prom2 + prom3) / 3).toFixed(1);

    const alumno = new Alumno({
        dni: dni,
        apellido: ape,
        nombre: nom,
        trim1: trim1,
        promedio1: prom1,
        trim2: trim2,
        promedio2: prom2,
        trim3: trim3,
        promedio3: prom3,
        promediog: promg,
    })

    alumnos.push(alumno);
}

function eliminarUltimoAlumno(alumnos){
    if (alumnos.length === 0){
        alert("El arreglo esta vacio y no se puede eliminar...")
    } else {
        alumnos.pop();
        alert("El último alumno ingresado fué eliminado");
    }    
}

//Funcion que permite listar todos los alumnos cargados por consola
function listarAlumnos(alumnos) {
    if (alumnos.length === 0){
        alert("No hay alumnos por mostrar. El listado esta vacío")
    } else{
        alumnos.forEach(elemento => new Alumno(elemento).datosAlumno());
    }
}


//Funcion que muestra un menu de opciones
function menu() {
    let opcion;
    do {
        opcion = prompt("Menu Alumnos:\n1. Registrar Alumno\n2. Eliminar Ultimo Alumno\n3. Buscar Alumno\n4 Listar Alumnos\n5 Mejor Alumno\n Escribe 's' o 'S' para salir del menu").toLocaleLowerCase();

        switch (opcion) {
            case "1":
                alert("Esta opcion permite la carga de un alumno y 3 notas por trimestre en un total de 3 trimestres");
                cargarAlumno();
                break;
            case "2":
                alert("Esta opción elimina el último alumno ingresado, si el listado no esta vacio");
                eliminarUltimoAlumno(alumnos);
                break;
            case "3":
                alert("Esta opción permite buscar mostrar si un alumno se encuentra el el listado");
                buscarAlumno(alumnos);
                break;
            case "4":
                alert("Esta opción muestra todos los alumnos cargados por consola");
                listarAlumnos(alumnos);
                break;
            case "5":
                alert("Esta opción muestra el o los alumno/s con mejor promedio/s");
                mejorAlumno(alumnos);
                break;
            case "s":
                alert("saliendo del menú...");
                break;
            default:
                (opcion === "s")
                    ? alert("saliendo del menú...")
                    : alert("Opción no válida. Por favo ingrese un número del 1 al 4 o escriba 's' o 'S' para salir");
        }
    } while (opcion !== "s");
}

//Ejecuta el menu de opciones
menu();



