//Variables
const carrito = document.querySelector('#carrito');
//const prueba = document.querySelectorAll(".agregar-carrito");
const listaProductos = document.querySelectorAll('.lista-productos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const totalCarrito = document.querySelector('#total-carrito');
const btnCarrousel = document.querySelector('#botonesCarrousel');
let articulosCarrito = [];
let articuloCompraDirecta = [];
let visitas;

cargarListeners();


function cargarListeners() {
    //Agrega el listener cuando se de click en eliminar un curso
    carrito.addEventListener('click', eliminarCurso);

    //Agrega un listener cuando se de click en vacian carrito
    vaciarCarritoBtn.addEventListener('click', eliminarStorage);

    //Carga el contenido del Local Storage en el carrito
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    });
}

//Cookie de Inicio de Sesion
// function mostrarCarrito() {
//     // let carrito = document.getElementByI("carrito");
//     if (carrito.style.display === "none") {
//         carrito.style.display = "block";
//         console.log(btnCarrousel);
//         // btnCarrousel.style.display = "none";
//         btnCarrousel.style.zIndex = "-1";
//     } else {
//         carrito.style.display = "none";
//         console.log(btnCarrousel);
//         // btnCarrousel.style.display = "block";
//         btnCarrousel.style.zIndex = "1";
//     }
// }

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checarCookie() {
    localStorage.removeItem('productoUnico');
    let evaluar = getCookie("visitante");
    if (evaluar != "") {
    } else {
        setCookie("visitante", "entro");
        sincronizarVisitas();
        saludar();
    }
}
//Fin Cookie Inicio Sesion

function compraDirecta(elemento) {
    const productoT = elemento.parentElement.parentElement.parentElement;
    console.log(productoT);
    leerDatosProductoDirecto(productoT);
}

function agregarProducto2(elemento) {
    const productoT = elemento.parentElement.parentElement;
    leerDatosProducto(productoT);
}

function leerDatosProducto(producto) {
    if (Number.isNaN(producto.querySelector('input').value) || producto.querySelector('input').value.length === 0 || parseInt(producto.querySelector('input').value) < 1) {
        Swal.fire(
            '¡Error!',
            'El valor de cantidad ingresado no es valido',
            'error'
        );
    } else {
        const infoProducto = {
            id: producto.querySelector('.agregar-carrito').getAttribute('data-id'),
            imagen: producto.querySelector('img').src,
            titulo: producto.querySelector('h5').textContent,
            precio: producto.querySelector('h3').textContent,
            cantidad: parseInt(producto.querySelector('input').value)
        }
        if (articulosCarrito.some(producto => producto.id === infoProducto.id)) {
            let posicionCarrito = articulosCarrito.findIndex(producto => producto.id === infoProducto.id);
            let candtidadProducto = articulosCarrito[posicionCarrito].cantidad;
            articulosCarrito[posicionCarrito].cantidad = candtidadProducto + parseInt(producto.querySelector('input').value);
        } else {
            articulosCarrito.push(infoProducto);
        }
        console.log(articulosCarrito);

        carritoHTML();
        Swal.fire(
            '¡Excelente!',
            'Producto Agregado Correctamente',
            'success'
        );
    }
}

function leerDatosProductoDirecto(producto) {
    if (Number.isNaN(producto.querySelector('input').value) || producto.querySelector('input').value.length === 0 || parseInt(producto.querySelector('input').value) < 1) {
        Swal.fire(
            '¡Error!',
            'El valor de cantidad ingresado no es valido',
            'error'
        );
    } else {
        const infoProducto = {
            id: producto.querySelector('.agregar-carrito').getAttribute('data-id'),
            imagen: producto.querySelector('img').src,
            titulo: producto.querySelector('h5').textContent,
            precio: producto.querySelector('h3').textContent,
            cantidad: parseInt(producto.querySelector('input').value)
        }
        localStorage.setItem('productoUnico', JSON.stringify(infoProducto));
    }
}

function eliminarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar-curso')) {
        // e.target.parentElement.parentElement.remove();
        const productoId = e.target.getAttribute('data-id');
        //console.log(productoId);
        articulosCarrito = articulosCarrito.filter(producto => producto.id !== productoId);
        carritoHTML();
    }
}

function carritoHTML() {
    const btnComprar = document.getElementById('btn-comprar');
    if (articulosCarrito.length < 1) {
        vaciarCarrito();
        const row = document.createElement('tr');
        row.innerHTML = `
        <td colspan="5">
            <p class="h3">Agregue un Producto al Carrito</p>
        </td>
        `;
        contenedorCarrito.appendChild(row);
    } else {
        vaciarCarrito();
        btnComprar.removeAttribute("disabled");
        articulosCarrito.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
        <td>  
        <img src="${producto.imagen}" width=100>
        </td>
        <td>${producto.titulo}</td>
        <td>${producto.precio}</td>
        <td>${producto.cantidad} </td>
        <td>
        <a class="btn btn-danger borrar-curso" href="#" data-id="${producto.id}" role="button">X</a>
        </td>
        `;
            contenedorCarrito.appendChild(row);
        });
        let costoProductos = [];
        articulosCarrito.forEach(producto => {
            //console.log(producto.precio);
            let quitarUnidad = producto.precio.replace(' PZA', '');
            let quitarDolar = quitarUnidad.replace('$', '');
            costoProductos.push(parseFloat(quitarDolar) * producto.cantidad);
        });
        //console.log(costoProductos);
        let sumaProducto = costoProductos.reduce((suma, a) => suma + a, 0);
        totalCarrito.textContent = sumaProducto.toFixed(2);
        sincronizarStorage();
    }
}


function vaciarCarrito() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
    totalCarrito.textContent = 0.0;

}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

function eliminarStorage() {
    vaciarCarrito();
    articulosCarrito.splice(0, articulosCarrito.length);
    sincronizarStorage();
    const row = document.createElement('tr');
    row.innerHTML = `
        <td colspan="5">
            <p class="h3">Agregue un Producto al Carrito</p>
        </td>
        `;
    contenedorCarrito.appendChild(row);
    Swal.fire(
        '¡Excelente!',
        'Carrito Vaciado Correctamente',
        'success'
    );
}

function sincronizarVisitas() {
    var anterior = parseInt(localStorage.getItem('visitas'));
    //console.log(anterior);
    if (Number.isNaN(anterior) || anterior === null) {
        localStorage.setItem('visitas', 1);
        visitas = parseInt(localStorage.getItem('visitas'));
    } else {
        localStorage.setItem('visitas', anterior + 1);
        visitas = parseInt(localStorage.getItem('visitas'));
    }
}

function saludar() {
    Swal.fire(
        '¡Bienvenido!',
        'Usted es el cliente #' + visitas,
        'success'
    );
}

function mensajeCarritoVacio(e) {
    if (articulosCarrito.length < 1) {
        e.preventDefault;
        Swal.fire(
            'Error',
            'Tiene que agregar productos en el carrito antes de comprar',
            'warning'
        );
    } else {
        location.replace("html/compra.html");
        // return true;
    }
}

function agregarSoloArray() {

}


// $("#c1b").click(function () {
//     $("#tema1").toggle(1500);
// }, function () {
//     $("#tema1").toggle(1500);
// });

$(".card").hover(function () {
    $(".titulo-categorias", this).show(300);
    $(".texto-categorias", this).show(300);
    $(".hola", this).animate({ opacity: "0.2" });
}, function () {
    $(".titulo-categorias", this).hide(300);
    $(".texto-categorias", this).hide(300);
    $(".hola", this).animate({ opacity: "1" });
});

$("#mostrarCarro").click(function () {
    $("#carrito").toggle("slow");
});
