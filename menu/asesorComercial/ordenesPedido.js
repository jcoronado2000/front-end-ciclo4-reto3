
/**
 * Ejecucion inicial
 */

/**
 * Inventario Productos
 */
/**
 * endPoint de inventario
 */
const endPointProducto = "http://localhost:8080/api/supplements";
const endPointUser = "http://localhost:8080/api/user";
const endPointOrder = "http://localhost:8080/api/order";
//const endPointProducto = "http://150.230.88.187:8080/api/supplements" 
let userJson = sessionStorage.getItem("user");
let userJs;
// carga de datos
let arrayObjetos = [];
// OrdenesAgregadas
let arrayOrdenesLista = [];
// CantidadesOrdenes
let cantidadOrdenesLista = [];
let idReference;
let ventaTotal = 0;
/**
 * Validar Datos Vacion Para Registro
 */
function validarCamposVaciosPedidos() {

    let fecha = $("#fechaOrden").val();
    let producto = $("#retornarSelectProducto").val();
    let cantidad = $("#cantidadProducto").val();
    let productos = {};
    let quantities = {};

    if (fecha == "" || producto == "" || cantidad == "") {
        swal("info", "Hay campos vacios", "warning");
    } else {
        for (let index = 0; index < arrayOrdenesLista.length; index++) {
            productos[arrayOrdenesLista[index].reference] = (arrayOrdenesLista[index]);
            quantities[arrayOrdenesLista[index].reference] = (cantidadOrdenesLista[index].amount);
        }
        functionGuardarRegistro(productos, quantities);
    }
}
/**
 * Registrar Producto
 */
function functionGuardarRegistro(productos, quantities) {

    $.ajax({
        method: "POST",
        url: endPointOrder + "/new",
        data: jsonOders(productos, quantities),
        dataType: "jsonOders",
        contentType: "application/json",
        complete: function (response) {
            let respustaJsonCreado = response.responseText;
            let idRespues = JSON.parse(respustaJsonCreado);
            if (response.status == 201) {
                swal("Registro exitoso", "Numero de orden " + idRespues.id, "success")
                    .then((value) => {
                        window.location.reload();
                    });
            } else {
                swal("Error", "Error al insertar datos " + response.status, "warning");
            }
        }

    })

}
function jsonOders(products, quantities) {

    let date = new Date($("#fechaOrden").val());
    let result = date.toISOString();
    dataProduct = {
        registerDay: result,
        status: "PENDIENTE",
        salesMan: userJs,
        products,
        quantities
    }
    console.log(JSON.stringify(dataProduct));
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
            arrayObjetos.push(data);
        }
    });
}
function retornarDataMongoOrder() {
    $.ajax({
        method: "GET",
        url: endPointOrder + "/all",
        success: function (data) {
            retornarDataTableOrder(data);
        }
    });
}
function retornarDataTable(respuesta) {
    let cadena = "";

    respuesta.forEach(element => {
        cadena += `<option value='${element.reference}'>${element.brand}</option>`;
    });

    $("#retornarSelectProducto").html(cadena);
}
function retornarDataTableOrder(respuesta) {
    let tablaListaOrdenes = "";

    respuesta.forEach(element => {
        tablaListaOrdenes += `<tr><th>${element.id}</th><th>${element.registerDay}</th><th>${element.status}</th></tr>`
    });

    $("#retornarTablaCliente").html(tablaListaOrdenes);

}
/**
 * 
 * Eliminar dataDeLaOrden
 */
function eliminarOrden(idReferenceEliminar) {
    for (let index = 0; index < cantidadOrdenesLista.length; index++) {
        if (cantidadOrdenesLista[index].reference == idReferenceEliminar) {
            cantidadOrdenesLista.splice(index, 1);
            visualizarPedido();
        }
        if (arrayOrdenesLista[index].reference == idReferenceEliminar) {
            arrayOrdenesLista.splice(index, 1);
        }
    }

}
$("#cerrarSesion").click(function () {
    sessionStorage.removeItem("user");
    window.location.href = "../../index.html";
})

$("#retornarSelectProducto").change(function () {
    let variableId = $("#retornarSelectProducto").val();
    for (let i = 0; i < arrayObjetos[0].length; i++) {
        if (arrayObjetos[0][i].reference == variableId) {
            let precioProduct = arrayObjetos[0][i].price;
            $("#precioProducto").val(precioProduct);
            if (ventaTotal == 0) {
                $("#TotalOrden").val(precioProduct);
            }
            break;
        }
    }
})
$("#agregarProduct").click(function () {
    let cantidad = parseInt($("#cantidadProducto").val());
    let precio = parseInt($("#precioProducto").val());
    if (ventaTotal == 0) {
        ventaTotal = cantidad * precio;
        idReference = $("#retornarSelectProducto").val();
        for (let i = 0; i < arrayObjetos[0].length; i++) {
            if (arrayObjetos[0][i].reference == idReference) {
                arrayOrdenesLista.push(arrayObjetos[0][i]);
                let producto = arrayObjetos[0][i].brand
                guardarDataJsonOrdenTabla(idReference, producto, cantidad, precio, ventaTotal);
                break;
            }
        }
    } else {
        ventaTotal = ventaTotal + (cantidad * precio);
        idReference = $("#retornarSelectProducto").val();
        for (let i = 0; i < arrayObjetos[0].length; i++) {
            if (arrayObjetos[0][i].reference == idReference) {
                let banderaAgregarProductoJson = false;
                for (let index = 0; index < arrayOrdenesLista.length; index++) {
                    if (arrayOrdenesLista[index].reference == idReference) {
                        let producto = arrayObjetos[0][index].brand
                        guardarDataJsonOrdenTabla(idReference, producto, cantidad, precio, (precio * cantidad));
                        banderaAgregarProductoJson = false;
                        break;
                    } else {
                        banderaAgregarProductoJson = true;
                    }
                }
                if (banderaAgregarProductoJson == true) {
                    arrayOrdenesLista.push(arrayObjetos[0][i]);
                    let producto = arrayObjetos[0][i].brand
                    guardarDataJsonOrdenTabla(idReference, producto, cantidad, precio, (precio * cantidad));
                    break;
                }
            }
        }
    }
    $("#TotalOrden").val(ventaTotal);
    //console.log(arrayOrdenesLista);
})
function visualizarPedido() {

    let tablaVisualizar = "";
    let totalVentasConsumidas = 0;
    let fecha = new Date();


    cantidadOrdenesLista.forEach(element => {
        tablaVisualizar += `<tr><th>${element.reference}</th><th>${element.brand}</th><th>${element.amount}</th><th>${element.price}</th><th>${element.totalSale}</th><th><button type="button" onclick='eliminarOrden("${element.reference}")' class="btn btn-danger">x</button></th></tr>`;
        totalVentasConsumidas += element.totalSale
    });
    $("#fechaActual").text(`Fecha:  ${fecha.toLocaleDateString()}`);
    $("#totalDescriminado").text(`Total ${totalVentasConsumidas}`);
    $("#retornarDataAgregada").html(tablaVisualizar);
    $("#TotalOrden").val(totalVentasConsumidas);
    ventaTotal = totalVentasConsumidas;
    //console.log(cantidadOrdenesLista);
    //console.log(arrayOrdenesLista);
}
function guardarDataJsonOrdenTabla(idReference, producto, cantidad, precio, ventaTotal) {
    let banderaAgregacion = true;
    let dataJson = {
        reference: idReference,
        brand: producto,
        amount: cantidad,
        price: precio,
        totalSale: ventaTotal
    }
    if (cantidadOrdenesLista.length == 0) {
        cantidadOrdenesLista.push(dataJson);
    } else {
        for (let index = 0; index < cantidadOrdenesLista.length; index++) {
            if (cantidadOrdenesLista[index].reference == idReference) {
                banderaAgregacion = false;
                cantidadOrdenesLista[index].amount += cantidad;
                cantidadOrdenesLista[index].totalSale += ventaTotal;
                break;
            }
        }
        if (banderaAgregacion) {
            cantidadOrdenesLista.push(dataJson);
        }
    }
    //console.log(cantidadOrdenesLista.length);
    //console.log(cantidadOrdenesLista);
}

/**
 * Ejecucion Inicial
 */
if (userJson == null) {
    window.location.href = "../../index.html";
} else {
    retornarDataMongo();
    retornarDataMongoOrder();
    userJs = JSON.parse(userJson);
    $("#idUserLogin").html(userJs.name);
}






