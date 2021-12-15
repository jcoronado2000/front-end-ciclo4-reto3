/**
 * Inventario Productos
 */
/**
 * endPoint de inventario
 */
//const endPointProducto = "http://localhost:8080/api/supplements";
const endPointProducto = "http://150.230.88.187:8080/api/supplements" 
/**
 * Registrar Producto
 */
function validarCamposVaciosProductos() {

    let referencia = $("#exampleReferenciaProducto").val();
    let brand = $("#exampleNombreProducto").val();
    let objetivo = $("#exampleObjetivoProducto").val();
    let categoria = $("#exampleCategoriaProducto").val();
    let descripcion = $("#exampleDescripcionProducto").val();
    let disponibilidad = $("#exampleDisponibilidadProdcuto").val();
    let precio = $("#examplePrecioProducto").val();
    let stock = $("#exampleSockProducto").val();
    let foto = $("#exampleFotoProducto").val();



    if (referencia == "" || brand == "" || objetivo == "" || categoria == "" || descripcion == "" || disponibilidad == "" || precio == "" || stock == "" || foto == "") {
        swal("info", "Hay campos vacios", "warning");
    } else {
        functionGuardarRegistro();
    }
}

function functionGuardarRegistro() {

    $.ajax({
        method: "POST",
        url: endPointProducto + "/new",
        data: jsonProductos(),
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
function jsonProductos() {

    dataProduct = {
        reference: $("#exampleReferenciaProducto").val(),
        brand: $("#exampleNombreProducto").val(),
        category: $("#exampleCategoriaProducto").val(),
        objetivo: $("#exampleObjetivoProducto").val(),
        description: $("#exampleDescripcionProducto").val(),
        availability: $("#exampleDisponibilidadProdcuto").val(),
        price: $("#examplePrecioProducto").val(),
        quantity: $("#exampleSockProducto").val(),
        photography: $("#exampleFotoProducto").val()
    }

    return JSON.stringify(dataProduct);

}
/**
 * Retornar Data Table
 */

function retornarDataMongo() {
    $.ajax({
        method: "GET",
        url: endPointProducto + "/all",
        success: function (data) {
            retornarDataTable(data);
        }
    });
}
function retornarDataTable(respuesta) {
    let cadena = "";

    console.log(respuesta)

    respuesta.forEach(element => {
        cadena += "<tr><th>" + element.reference + "</th><td>" + element.brand + "</td><td>" + element.category + "</td><td>" + element.objetivo + "</td><td>" + element.description + "</td><td>" + element.availability + "</td><td>" + element.price + "</td><td>" + element.quantity + "</td><td><button  class='btn btn-outline my-2 my-sm-0' data-toggle='modal' data-target='#verFoto' onclick=\"retornaImageb(\'" + element.photography + "')\">Foto</button></td><td>"
        cadena += "<button type='button' class='btn btn-success' data-toggle='modal' data-target='#exampleActualizar' style='width: auto; margin-left: 16px' onclick=\"retorDataModal( \'" + element.reference + "',\'" + element.brand + "',\'" + element.category + "',\'" + element.objetivo + "',\'" + element.description + "',\'" + element.availability + "',\'" + element.price + "',\'" + element.quantity + "',\'" + element.photography + "')\" >Update</button></td></tr>"
    });

    $("#retornarTablaProducto").html(cadena);
}
function retornaImageb(url) {
    console.log(url);
    $("#imagenModal").attr("src", url);
}
/**
 * Actualizar producto
 */
function retorDataModal(reference, brand, category, object, description, availability, price, quantity, photography) {
    console.log(reference, brand, category, object, description, availability, price, quantity, photography)

    $("#updateReferenciaProducto").val(reference)
    $("#updateNombreProducto").val(brand)
    $("#updateCategoriaProducto").val(category)
    $("#updateObjetivoProducto").val(object)
    $("#updateDescripcionProducto").val(description)
    $("#updateDisponibilidadProdcuto").val(availability)
    $("#updatePrecioProducto").val(price)
    $("#updateSockProducto").val(quantity)
    $("#updateFotoProducto").val(photography)
}
function jsonUpdateProduct() {

    productData = {

        reference: $("#updateReferenciaProducto").val(),
        brand: $("#updateNombreProducto").val(),
        category: $("#updateCategoriaProducto").val(),
        objetivo: $("#updateObjetivoProducto").val(),
        description: $("#updateDescripcionProducto").val(),
        availability: $("#updateDisponibilidadProdcuto").val(),
        price: $("#updatePrecioProducto").val(),
        quantity: $("#updateSockProducto").val(),
        photography: $("#updateFotoProducto").val()

    }

    console.log("Hola mundo " + JSON.stringify(productData));

    return JSON.stringify(productData);
}
function updateProductData() {
    $.ajax({
        method: "PUT",
        url: endPointProducto + "/update",
        data: jsonUpdateProduct(),
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
/**
 * Eliminar Producto
 */
function deleteProduct() {
    let reference = $("#eliminarReference").val();
    $.ajax({
        method: "DELETE",
        url: endPointProducto + "/" + reference,
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
 * Ejecucion inicial
 */
$(document).ready(function () {
    let userJson = sessionStorage.getItem("user");
    if (userJson == null) {
        window.location.href = "index.html";
    }
    let userJs = JSON.parse(userJson);
    if (userJs.type == "ADM") {
        $("#idUserCargo").html("Administrador Sistema");
        $("#idUserLogin").html(userJs.name);
        retornarDataMongo();
    }

    $("#cerrarSesion").click(function () {
        sessionStorage.removeItem("user");
        window.location.href = "index.html";
    })

})


