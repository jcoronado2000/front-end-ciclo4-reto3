/**
 * EndPoint
 */

//const endPointUser = "http://localhost:8080/api/user";
const endPointUser = "http://150.230.88.187:8080/api/user"

let id;

function registrarData() {
    console.log(jsonUser())
    $.ajax({
        method: "POST",
        url: endPointUser + "/new",
        data: jsonUser(),
        dataType: "json",
        contentType: "application/json",
        complete: function (response) {
            if (response.status == 201) {
                swal("Good job!", "Registro hecho con exito", "success")
                    .then((value) => {
                        window.location.reload();
                    });
            } else {
                swal("Error", "Error al insertar datos " + response.status, "warning");
            }
        }
    })

}
function jsonUser() {

    let posicion= $("#exampleInputFechaNacimiento").val();
    let indexPosicion= posicion.indexOf("-");
    let mesCumpleanos = posicion.substring(indexPosicion+1,indexPosicion+3);

    userData = {
        identification: $("#exampleInputIdentificacion").val(),
        name: $("#exampleInputNombre").val(),
        birthtDay: $("#exampleInputFechaNacimiento").val(),
        monthBirthtDay : mesCumpleanos,
        address: $("#exampleInputDireccion").val(),
        cellPhone: $("#exampleInputCelular").val(),
        email: $("#exampleInputEmail").val(),
        password: $("#exampleInputPassword").val(),
        zone: $("#exampleInputZona").val(),
        type: $("#exampleInputCargo").val()
    }

    return JSON.stringify(userData);
}

function validarDatos() {

    let identificacion = $("#exampleInputIdentificacion").val();
    let name = $("#exampleInputNombre").val();
    let fecha = $("#exampleInputFechaNacimiento").val();
    let direccion = $("#exampleInputDireccion").val();
    let celular = $("#exampleInputCelular").val();
    let email = $("#exampleInputEmail").val();
    let contrasena = $("#exampleInputPassword").val();
    let zona = $("#exampleInputPassword1").val();
    let Cargo = $("#exampleInputCargo").val();



    if (identificacion == "" || name == "" || direccion == "" || celular == "" || email == "" || contrasena == "" || zona == "" || Cargo == "" || fecha == "") {
        swal("info", "Hay campos vacios", "warning");
    } else if (!/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) {
        swal("info", "Email invalido", "warning");
    } else {
        validarCorreo();
    }


}

function validarCorreo() {

    let email = $("#exampleInputEmail").val();
    console.log("Entra");

    $.ajax({
        method: "GET",
        url: endPointUser + "/emailexist" + "/" + email,
        success: function (data) {
            if (data == true) {
                swal("info", "Correo ya existe", "warning");
                console.log("Estra por IF");
            } else {
                registrarData();
                console.log("Estra por ELSE");
            }
            console.log(data);
        }
    });
}

/**
 * Eliminar User
 */

function eliminarUser() {
    let identificacion = $("#exampleEliminarUser").val();
    $.ajax({
        method: "DELETE",
        url: endPointUser + "/eliminar/" + identificacion,
        success: function (data) {
            console.log(data);
            swal("", `Registro eliminado con exito `, "success")
                .then((value => {
                    location.reload();
                }));
        },
        error: function (data) {
            console.log(data.responseJSON.message);
            swal("", `Hubo un problema al eliminar el registro `, "error");
        }
    })
}
/**
 * Retornar Data Table
 */
function getCliente() {
    $.ajax({
        method: "GET",
        url: endPointUser + "/all",
        success: function (data) {
            dataUsers(data);
        }
    });
}
function dataUsers(respuesta) {

    let cadena = "";

    console.log(respuesta)

    respuesta.forEach(element => {
        cadena += "<tr><th>" + element.identification + "</th><td>" + element.name + "</td><td>" + element.address + "</td><td>" + element.cellPhone + "</td><td>" + element.email + "</td><td>" + element.zone + "</td><td>" + element.type + "</td><td>"
        cadena += "<button type='button' class='btn btn-success' data-toggle='modal' data-target='#updateUser' style='width: auto; margin-left: 16px' onclick=\"dataUpdate( " + element.id + ",\'" +element.identification + "',\'" + element.name + "',\'" + element.birthtDay + "',\'" + element.address + "',\'" + element.cellPhone + "',\'" + element.email + "',\'" + element.zone + "',\'" + element.type + "',\'" + element.password + "')\">Update</button></td></tr>"
    });

    $("#retornarTablaCliente").html(cadena);
}
/**
 * Actualizar Datos User
 */
function dataUpdate(ides,identificacion, name,fecha, direccion, celular, email, zona, cargo, password) {
    id = ides;
    $("#exampleInputIdentificacionRetorna").val(identificacion);
    $("#exampleInputNombreRetorna").val(name);
    $("#exampleInputFechaNacimientoRetorna").val(fecha);
    $("#exampleInputDireccionRetorna").val(direccion);
    $("#exampleInputCelularRetorna").val(celular);
    $("#exampleInputEmailRetorna").val(email);
    $("#exampleInputZonaRetorna").val(zona);
    $("#exampleInputCargoRetorna").val(cargo);
    $("#exampleInputPasswordRetorna").val(password);

}


function updateUserData() {
    $.ajax({
        method: "PUT",
        url: endPointUser + "/update",
        data: jsonUpdateUser(),
        dataType: "json",
        contentType: "application/json",
        complete: function (response) {
            console.log(response)
            if (response.status == 201) {
                swal("Good job!", "Registro actualizado con exito", "success")
                    .then((value => {
                        window.location.reload()
                    }));

            } else {
                swal("Error", "Error al insertar datos " + response.status, "warning");
            }
        }
    })
}

function jsonUpdateUser() {

    let posicion= $("#exampleInputFechaNacimiento").val();
    let indexPosicion= posicion.indexOf("-");
    let mesCumpleanos = posicion.substring(indexPosicion+1,indexPosicion+3);

    useData = {
        id: id,
        identification: $("#exampleInputIdentificacionRetorna").val(),
        name: $("#exampleInputNombreRetorna").val(),
        birthtDay: $("#exampleInputFechaNacimientoRetorna").val(),
        monthBirthtDay:mesCumpleanos,
        address: $("#exampleInputDireccionRetorna").val(),
        cellPhone: $("#exampleInputCelularRetorna").val(),
        email: $("#exampleInputEmailRetorna").val(),
        password: $("#exampleInputPasswordRetorna").val(),
        zone: $("#exampleInputZonaRetorna").val(),
        type: $("#exampleInputCargoRetorna").val()

    }

    console.log("Hola mundo " + JSON.stringify(useData));

    return JSON.stringify(useData);
}
/**
 * Ejecución inicial
 */
$(document).ready(function(){
    let userJson = sessionStorage.getItem("user");
    let userJs = JSON.parse(userJson);
    if(userJson == null){
        window.location.href="index.html";
    }if(userJs){
        getCliente();
        $("#idUserLogin").html(userJs.name);
        $("#idUserCargo").html("Administrador Sistema");
    }

    $("#cerrarSesion").click(function(){
        sessionStorage.removeItem("user");
        window.location.href = "index.html";
    })
    
})
