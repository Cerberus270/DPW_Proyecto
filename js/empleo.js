function postularEmpleo(){
    const formulario = document.getElementById('formularioTrabajo');
    console.log(formulario);
    if (formulario.checkValidity()) {
        formulario.reset();
        Swal.fire({
            title: 'Excelente',
            text: 'Datos Enviados Correctamente',
            icon: 'success',
        });/*.then(function () {
            window.location = "../index.html";
        });*/
    } else {
        Swal.fire(
            'Error',
            'Revise que ha ingresado todos los datos al formulario',
            'error'
        );
    }
}