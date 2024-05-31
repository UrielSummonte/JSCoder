const alumnos = [];

const formulario = document.getElementById("formulario");
const contenedorAlumnos = document.getElementById("alumnos");
const contenedorBusqueda = document.getElementById("resultadoBusqueda");
const contenedorMejores = document.getElementById("mejoresAlumnos");
const menuEliminar = document.getElementById("eliminarUltimo");
const menuOrdenar = document.getElementById("ordenarAsc");
const recuperarListado = document.getElementById("recuperar");
let estaCargado = false;

class Alumno {
  constructor({
    dni,
    apellido,
    nombre,
    t1n1,
    t1n2,
    t1n3,
    t2n1,
    t2n2,
    t2n3,
    t3n1,
    t3n2,
    t3n3,
    promedio1,
    promedio2,
    promedio3,
    promediog,
  }) {
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
  try {
    var dni = input.value;
    var regex = /^\d{8}$/;
    var maxLength = 8;
    if (!regex.test(dni)) {
      input.value = dni.slice(0, 8);
    } else if ((dni.length = maxLength)) {
      document.getElementById("errorDNI").style.display = "none";
    }
  } catch (error) {
    console.log("Hubo un error en la funcion validar dni", error);
  }
}

function validarApellidoNombre(input) {
  try {
    var valor = input.value;
    var regex = /^[A-Za-z][A-Za-z\s]*$/;
    if (!regex.test(valor) || /^\s/.test(valor)) {
      input.value = valor.replace(/^\s+/, "").replace(/[^A-Za-z\s]/g, "");
    }
  } catch (error) {
    console.log(
      "Hubo en error en la funcion que valida el nombre o apellido",
      error
    );
  }
}

function validarNota(input) {
  try {
    var nota = input.value;
    var regex = /^\d*\.?\d*$/;
    if (!regex.test(nota)) {
      input.value = nota.replace(/[^\d.]/g, "");
    }
  } catch (error) {
    console.log("Hubo un erro en la funcion que valida la nota", error);
  }
}

function moveToNextInput(event, currentInput) {
  try {
    if (event.key === "Enter") {
      event.preventDefault();
      var inputs = Array.from(
        document.querySelectorAll('input:not([type="submit"])')
      );
      var index = inputs.indexOf(currentInput);
      if (index !== -1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      } else if (currentInput.id === "t3n3") {
        document.querySelector('button[id="registrar"]').focus();
      } else if (currentInput.id === "apellidoBusqueda") {
        document.querySelector('button[id="buscar"]').focus();
      }
    }
  } catch (error) {
    console.log(
      "Hubo un error en la funcion que mueve el curso al presionar enter",
      error
    );
  }
}

function validarFormulario() {
  try {
    var dni = document.getElementById("dni");
    var maxLength = 8;
    if (dni.value.length !== maxLength) {
      document.getElementById("errorDNI").style.display = "inline";
    } else {
      document.getElementById("errorDNI").style.display = "none";
      cargarAlumno();
      mejorAlumno(alumnos);
    }
  } catch (error) {
    console.log("Hubo un error en la funcion que valida el formulario", error);
  }
}

formulario.addEventListener("submit", (event) => {
  event.preventDefault();
  validarFormulario();
});

formBuscar.addEventListener("submit", (event) => {
  event.preventDefault();
  buscarAlumno(alumnos);
  formBuscar.reset();
});

menuEliminar.addEventListener("click", (event) => {
  event.preventDefault();
  messEliminarAlumno();
});

menuOrdenar.addEventListener("click", (event) => {
  event.preventDefault();
  ordenarListado(alumnos);
});

recuperarListado.addEventListener("click", (event) => {
  event.preventDefault();
  recuperarAlumnos();
});

function persistenciaAlumnos(alumnos) {
  try {
    const alumnosJSON = JSON.stringify(alumnos);
    localStorage.setItem("alumnos", alumnosJSON);
  } catch (error) {
    console.log("Hubo un error en la funcin de persistencia", error);
  }
}

function messAlumnoCargado() {
  Swal.fire({
    position: "center",
    icon: "success",
    title: '<span style="font-size: 20px;">Alumno cargado correctamente</span>',
    width: 300,
    showConfirmButton: false,
    timer: 1400,
    customClass: {
      icon: "swal2-icon-custom",
    },
  });
}

function messAlumnoNoEncontrado() {
  Swal.fire({
    position: "top-end",
    icon: "info",
    title: '<span style="font-size: 20px;">Alumno no encontrado</span>',
    html: '<span style="font-size: 16px;">El alumno no está en el listado</span>',
    width: 300,
    showConfirmButton: false,
    timer: 1400,
    customClass: {
      icon: "swal2-icon-custom",
    },
  });
}

function messEliminarAlumno() {
  if (alumnos.length != 0) {
    Swal.fire({
      title:
        '<span style="font-size: 20px;">¿Estás seguro que deseas eliminar el último alumno?</span>',
      html: '<span style="font-size: 16px;">No podrás revertir esta acción</span>',
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar alumno!",
      customClass: {
        icon: "swal2-icon-custom",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarUltimoAlumno(alumnos);
      }
    });
  } else {
    Swal.fire({
      title: '<span style="font-size: 20px;">Imposible eliminar</span>',
      html: '<span style="font-size: 16px;">El lsitado está vacio y no se puede eliminar</span>',
      icon: "error",
      width: 300,
      showConfirmButton: false,
      timer: 1400,
      customClass: {
        icon: "swal2-icon-custom",
      },
    });
  }
}

function messListadoVacio() {
  Swal.fire({
    position: "center",
    icon: "warning",
    title: '<span style="font-size: 20px;">Carga no Realizada</span>',
    html: '<span style="font-size: 16px;">El listado está vacio o ya ha sido cargado</span>',
    width: 300,
    showConfirmButton: false,
    timer: 1400,
    customClass: {
      icon: "swal2-icon-custom",
    },
  });
}

function messOrdenFallido() {
  Swal.fire({
    position: "center",
    icon: "warning",
    title: '<span style="font-size: 20px;">Ordenamiento no Realizado</span>',
    html: '<span style="font-size: 16px;">El listado está vacio y no puede ordenarse</span>',
    width: 300,
    showConfirmButton: false,
    timer: 1400,
    customClass: {
      icon: "swal2-icon-custom",
    },
  });
}

function messListadoCargado() {
  Swal.fire({
    position: "center",
    icon: "info",
    title: '<span style="font-size: 20px;">Carga Realizada</span>',
    html: '<span style="font-size: 16px;">El listado ha sido cargado</span>',
    width: 300,
    showConfirmButton: false,
    timer: 1400,
    customClass: {
      icon: "swal2-icon-custom",
    },
  });
}

function focusInput() {
  const inputElement = document.getElementById("dni");
  inputElement.focus();
}

function cargarAlumno() {
  try {
    const dni = document.getElementById("dni").value;
    const ape = document.getElementById("apellido").value.trim().toUpperCase();
    const nom = document.getElementById("nombre").value.trim().toUpperCase();
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
    });
    alumnos.push(alumno);
    persistenciaAlumnos(alumnos);
    messAlumnoCargado();
    const elementoAlumno = generarAlumno(alumno);
    contenedorAlumnos.appendChild(elementoAlumno);
    formulario.reset();
    focusInput();
  } catch (error) {
    console.log(
      "Hubo un error en la funcion que carga los datos del alumno",
      error
    );
  }
}

function calcularPromedio(n1, n2, n3) {
  try {
    let aux = n1 + n2 + n3;
    let promedio = 0;
    promedio = parseFloat((aux / 3).toFixed(1));
    return promedio;
  } catch (error) {
    console.log("Hubo un error en la funcion que calcula el promedio", error);
  }
}

function generarAlumno(alumno) {
  const div = document.createElement("div");
  div.innerHTML = `
        <div class="card" style="width: 18rem;">
            <img src="assets/img/estudiante.jpg" class="card-img-top w-50 h-50 mx-auto" alt="...">
            <div class="card-body card-body-alum">
                <h5 class="card-title titulo-listado">${alumno.apellido} ${alumno.nombre}</h5>
                <p class="card-text texto-tarjeta"> D.N.I.: ${alumno.dni}</p>
                <p class="card-text texto-tarjeta"> Notas 1º trimestre: ${alumno.t1n1} - ${alumno.t1n2} - ${alumno.t1n3}</p>
                <p class="card-text texto-tarjeta">Promedio 1º Timestre: ${alumno.promedio1}</p>
                <p class="card-text texto-tarjeta"> Notas 2º trimestre: ${alumno.t2n1} - ${alumno.t2n2} - ${alumno.t2n3}</p>
                <p class="card-text texto-tarjeta">Promedio 2º Timestre: ${alumno.promedio2}</p>
                <p class="card-text texto-tarjeta"> Notas 3º trimestre: ${alumno.t3n1} - ${alumno.t3n2} - ${alumno.t3n3}</p>
                <p class="card-text texto-tarjeta">Promedio 3º Timestre: ${alumno.promedio3}</p>
                <p class="card-text texto-tarjeta">Promedio General: ${alumno.promediog}</p>
            </div>
        </div>
    `;
  div.classList.add("card", "contenedor", "listado");

  return div;
}

function generarAlumnoEncontrado(alumno) {
  try {
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="card" style="width: 12rem;">
            <img src="assets/img/estudiante.jpg" class="card-img-top w-25 h-25 mx-auto" alt="...">
            <div class="card-body card-body-search">
                <h5 class="card-title titulo-alumno-encontrado">${alumno.apellido} ${alumno.nombre}</h5>
                <p class="card-text texto-alumno-encontrado"> D.N.I.: ${alumno.dni}</p>
                <p class="card-text texto-alumno-encontrado">Promedio General: ${alumno.promediog}</p>
            </div>
        </div>
    `;
    div.classList.add("card", "encontrado");

    return div;
  } catch (error) {
    console.log(
      "Hubo un error en la funcion que genera el alumno encontrado",
      error
    );
  }
}

function generarAlumnosTop(alumno) {
  try {
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="card" style="width: 12rem;">
            <img src="assets/img/estudiante.jpg" class="card-img-top w-25 h-25 mx-auto" alt="...">
            <div class="card-body card-body-top">
                <h5 class="card-title titulo-alumno-top">${alumno.apellido} ${alumno.nombre}</h5>
                <p class="card-text texto-alumno-top"> D.N.I.: ${alumno.dni}</p>
                <p class="card-text texto-alumno-top">Promedio General: ${alumno.promediog}</p>
            </div>
        </div>
    `;
    div.classList.add("card", "mejores");

    return div;
  } catch (error) {
    console.log(
      "Hubo un error en la funcion que genera los mejore alumnos",
      error
    );
  }
}

function limpiarBusqueda() {
  try {
    const div = document.querySelectorAll("#resultadoBusqueda .encontrado");
    if (div != null) {
      div.forEach((elemento) => elemento.remove());
    }
  } catch (error) {
    console.error("Hubo un error en la funcion que limpia la busqueda", error);
  }
}

function limpiarMejores() {
  try {
    const div = document.querySelectorAll("#mejoresAlumnos .mejores");
    if (div != null) {
      div.forEach((elemento) => elemento.remove());
    }
  } catch (error) {
    console.error(
      "Hubo un error en la funcion que limpia los mejores alumnos",
      error
    );
  }
}

function limpiarListado() {
  try {
    const div = document.querySelectorAll("#alumnos .listado");
    if (div != null) {
      div.forEach((elemento) => elemento.remove());
    }
  } catch (error) {
    console.error(
      "Hubo un error en la funcion que limpia el listado de alumnos",
      error
    );
  }
}

function buscarAlumno(alumnos) {
  try {
    let busqueda = document
      .getElementById("apellidoBusqueda")
      .value.trim()
      .toUpperCase();
    const alumnosEncontrados = [];
    let encontrado = false;
    for (let i = 0; i < alumnos.length; i++) {
      if (alumnos[i].apellido === busqueda) {
        encontrado = true;
        alumnosEncontrados.push(alumnos[i]);
        console.log(alumnosEncontrados);
      }
    }
    if (encontrado) {
      limpiarBusqueda();
      alumnosEncontrados.forEach((elemento) => {
        const alumnoBusqueda = generarAlumnoEncontrado(elemento);
        contenedorBusqueda.appendChild(alumnoBusqueda);
      });
      mostrarBusqueda();
    } else {
      messAlumnoNoEncontrado();
    }
  } catch (error) {
    console.log("Hubo un error en la funcion de busqueda de alumno", error);
  }
}

function mostrarBusqueda() {
  try {
    setTimeout(function () {
      limpiarBusqueda();
    }, 3000);
  } catch (error) {
    console.log("Hubo un error en la funcion de mostrar la busqueda", error);
  }
}

function mayoPromediog(alumnos) {
  try {
    let mejorPuntaje = alumnos[0].promediog;
    for (let i = 0; i < alumnos.length; i++) {
      if (alumnos[i].promediog > mejorPuntaje) {
        mejorPuntaje = alumnos[i].promediog;
      }
    }
    return mejorPuntaje;
  } catch (error) {
    console.log(
      "Hubo un erro en la funcion que calcula el mayor promedio",
      error
    );
  }
}

function mejorAlumno(alumnos) {
  try {
    let mejoresAlumnos = [];
    for (let i = 0; i < alumnos.length; i++) {
      if (alumnos[i].promediog === mayoPromediog(alumnos)) {
        mejoresAlumnos.push(alumnos[i]);
      }
    }
    limpiarMejores();
    mejoresAlumnos.forEach((elemento) => {
      const alumnosTop = generarAlumnosTop(elemento);
      contenedorMejores.appendChild(alumnosTop);
    });
  } catch (error) {
    console.log(
      "Hubo un erro en la funcion que calcula los mejores alumnos",
      error
    );
  }
}

function eliminarUltimoAlumno(alumnos) {
  try {
    alumnos.pop();
    limpiarListado();
    persistenciaAlumnos(alumnos);
    alumnos.forEach((elemento) => {
      const alumno = generarAlumno(elemento);
      contenedorAlumnos.appendChild(alumno);
    });
    mejorAlumno(alumnos);
    Swal.fire({
      title: '<span style="font-size: 20px;">Eliminado</span>',
      html: '<span style="font-size: 16px;">El alumno ha sido borrado</span>',
      icon: "success",
      width: 300,
      showConfirmButton: false,
      timer: 1400,
      customClass: {
        icon: "swal2-icon-custom",
      },
    });
  } catch (error) {
    console.log(
      "Hubo un error en la funcion que elimina el ultimo alumno",
      error
    );
  }
}

function ordenarListado(alumnos) {
  try {
    if (alumnos.length === 0) {
      messOrdenFallido();
    } else {
      let listadoOrdenado = alumnos.sort((a, b) =>
        a.apellido.localeCompare(b.apellido)
      );
      limpiarListado();
      listadoOrdenado.forEach((elemento) => {
        const alumno = generarAlumno(elemento);
        contenedorAlumnos.appendChild(alumno);
      });
      mejorAlumno(alumnos);
    }
  } catch (error) {
    console.log(
      "Hubo un erro en la funcion que ordena el listado de alumnos",
      error
    );
  }
}

function recuperarAlumnos() {
  try {
    const alumnosRecuperadosJSON = localStorage.getItem("alumnos");
    if (alumnosRecuperadosJSON && !estaCargado) {
      const alumnosRecuperados = JSON.parse(alumnosRecuperadosJSON);
      alumnosRecuperados.forEach((elemento) => {
        alumnos.push(elemento);
      });
      limpiarListado();
      alumnos.forEach((elemento) => {
        const alumno = generarAlumno(elemento);
        contenedorAlumnos.appendChild(alumno);
      });
      mejorAlumno(alumnos);
      messListadoCargado();
      estaCargado = true;
    } else {
      messListadoVacio();
    }
  } catch (error) {
    console.log("Hubo un error en la función de recuperar alumnos", error);
  }
}
