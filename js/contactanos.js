function contactar() {
    const formulario = document.getElementById('form1');
    console.log(formulario);
    if (formulario.checkValidity()) {
        formulario.reset();

        emailjs.send('service_b3epbxl', 'service_b3epbxl', formulario)
            .then(function (response) {
                console.log('SUCCESS!', response.status, response.text);
            }, function (error) {
                console.log('FAILED...', error);
            });

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