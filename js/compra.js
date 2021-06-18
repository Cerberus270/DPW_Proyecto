const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito');
const cantidad = document.querySelector("#cantidad");
const formulario = document.querySelector("#formulario-compra")
let articulosCarrito = [];

cargarListeners();
//console.log(hola.x);

function cargarListeners() {
    //Carga el contenido del Local Storage en el carrito
    document.addEventListener('DOMContentLoaded', () => {
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [];
        carritoHTML();
    });
}


function carritoHTML() {
    vaciarCarrito();
    if (localStorage.getItem('productoUnico')) {
        let articuloCarrito = JSON.parse(localStorage.getItem('productoUnico')) || [];
        console.log(articuloCarrito);
        let quitarUnidad = articuloCarrito.precio.replace('/Unidad', '');
        const row = document.createElement('li');
        row.innerHTML = `
        <li class="list-group-item d-flex justify-content-between lh-sm" id="lista-carrito">
            <div>
            <h6 class="my-0">${articuloCarrito.titulo}</h6>
            </div>
            <span class="text-muted">${quitarUnidad}</span>
            <p>x${articuloCarrito.cantidad}</p>
        </li>
        `;
        contenedorCarrito.appendChild(row);
    } else {
        articulosCarrito.forEach(producto => {
            let quitarUnidad = producto.precio.replace('/Unidad', '');
            const row = document.createElement('li');
            row.innerHTML = `
            <li class="list-group-item d-flex justify-content-between lh-sm" id="lista-carrito">
                <div>
                <h6 class="my-0">${producto.titulo}</h6>
                </div>
                <span class="text-muted">${quitarUnidad}</span>
                <p>x${producto.cantidad}</p>
            </li>`;
            contenedorCarrito.appendChild(row);
        });
        let costoProductos = [];
        if (articulosCarrito.length == 0) {
            cantidad.textContent = 0;
        }
        articulosCarrito.forEach(producto => {
            //console.log(producto.precio);
            let quitarUnidad = producto.precio.replace('/Unidad', '');
            let quitarDolar = quitarUnidad.replace('$', '');
            costoProductos.push(parseFloat(quitarDolar) * producto.cantidad);
        });
        //console.log(costoProductos);
        let sumaProducto = costoProductos.reduce((suma, a) => suma + a, 0);
        const suma = document.createElement('li');
        suma.innerHTML = `
        <li class="list-group-item d-flex justify-content-between">
            <span>Total (USD)</span>
            <strong>${sumaProducto.toFixed(2)}</strong>
        </li>
        `;
        contenedorCarrito.appendChild(suma);
        //totalCarrito.textContent = sumaProducto.toFixed(2);
    }
}

function sincronizarStorage() {
    localStorage.setItem('carrito', JSON.stringify(articulosCarrito));
}

function eliminarStorage() {
    vaciarCarrito();
    articulosCarrito.splice(0, articulosCarrito.length);
    sincronizarStorage();
}

function compraRealizada() {
    if (localStorage.getItem('productoUnico')) {
        if (formulario.checkValidity()) {
            formulario.reset();
            console.log(articulosCarrito.length);
            localStorage.removeItem('productoUnico');
            Swal.fire({
                title: 'Excelente',
                text: 'Compra Realizada Correctamente',
                icon: 'success',
            }).then(function () {
                window.location = "../index.html";
            });
        } else {
            Swal.fire(
                'Error',
                'Revise que ha ingresado todos los datos al formulario',
                'error'
            );
        }
    } else {
        if (formulario.checkValidity()) {
            formulario.reset();
            eliminarStorage();
            console.log(articulosCarrito.length);
            localStorage.removeItem('productoUnico');
            Swal.fire({
                title: 'Excelente',
                text: 'Compra Realizada Correctamente',
                icon: 'success',
            }).then(function () {
                window.location = "../index.html";
            });
        } else {
            Swal.fire(
                'Error',
                'Revise que ha ingresado todos los datos al formulario',
                'error'
            );
        }
    }
}

function regresar(){
    window.location = "../index.html";
}


function vaciarCarrito() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}