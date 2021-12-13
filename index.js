/**
 * EndPoint
 */

const endPointUser = "http://localhost:8080/api/user";
//const endPointUser = "http://150.230.88.187:8080/api/user"

let email;
let password;

function iniciarSesion() {
    $.ajax({
        method: "GET",
        url: endPointUser + "/" + email + "/" + password,
        success: function (data) {
            if (data.id) {
                swal("Bienvenido", data.name, "success")
                    .then((value) => {
                        let user = {
                            id: data.id,
                            identification: data.identification,
                            name: data.name,
                            birthtDay: data.birthtDay,
                            monthBirthtDay: data.monthBirthtDay,
                            address: data.address,
                            cellPhone: data.cellPhone,
                            email: data.email,
                            password: data.password,
                            zone: data.zone,
                            type: data.type

                        }
                        let userJson = JSON.stringify(user);
                        sessionStorage.setItem("user", userJson);
                        perfilLogin(data.type);
                    });
            } else {
                swal("info", "No existe un usuario", "warning");
            }
            console.log(data);
        }
    });

}


function validarDatos() {

    email = $("#exampleInputEmailInicio").val();
    password = $("#exampleInputPasswordInicio").val();

    if (email == "" || password == "") {
        swal("info", "Hay campos vacios", "warning");
    } else if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
        swal("info", "Email invalido", "warning");
    } else {
        iniciarSesion();
    }


}

function perfilLogin(tipo){
    if(tipo == "COORD" ){
        window.location.href = "menu/coordinadorZona/index.html";
        console.log("Coordinador");
    }else if(tipo == "ASE"){
        window.location.href = "menu/asesorComercial/index.html";
        console.log("asesor");
    }else{
        window.location.href = "administracionUsuarios.html";
        console.log("Admin");
    }
}