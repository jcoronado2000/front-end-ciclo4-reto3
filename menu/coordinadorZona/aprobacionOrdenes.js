/**
 * Constantes
 */
//const endPointOrder = "http://localhost:8080/api/order";
const endPointOrder = "http://150.230.88.187:8080/api/order"
/**
 * Variables
 */
let userJs;
let arrayListaOrdenes = [];
let updateListaOrdenes = [];
/**
 * Ejecucion inicial
 */
let userJson = sessionStorage.getItem("user");
$('#tablax').DataTable({
    scrollY: 300,
});

if (userJson == null) {
    window.location.href = "../../index.html";
} else {
    userJs = JSON.parse(userJson);
    if(userJs.type == "COORD" ){
        $("#idUserCargo").html("Coordinador de Zona");
        $("#idUserLogin").html(userJs.name);
    }
    obtenerDataOrderZona();
}

$("#cerrarSesion").click(function () {
    sessionStorage.removeItem("user");
    window.location.href = "index.html";
})
/**
* Retornar Datos Tabla Ordenes Por Zona
*/
function obtenerDataOrderZona() {

    $.ajax({
        method: "GET",
        url: `${endPointOrder}/zona/${userJs.zone}`,
        success: function (data) {
            retornarDataTableOrder(data);
            arrayListaOrdenes.push(data);
        }
    });

}
function retornarDataTableOrder(respuesta) {
    let cadena = "";

    respuesta.forEach(element => {
        cadena += `<tr class="seleccionado"><th>${element.id}</th><th>${element.status}</th><th>${element.salesMan.name}</th><th id="escoger"><button type="button" class="btn btn-outline-success" data-toggle="modal" data-target="#exampleModalVer" onclick="cargdarDataModalPedido(${element.id})">Ver</button></th>
        <th>              
            <button type="button" class="btn btn-primary" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Aprobar Orden" style="display: inline-block;" onclick="actualizarOrdenById(${element.id},'Aprobada')">
                <i class="fas fa-arrow-alt-circle-right"></i>
            </button>
            <button type="button" class="btn btn-danger" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Rechazar Orden"  onclick="actualizarOrdenById(${element.id},'Rechazada')">
                <i class="fas fa-trash-alt"></i>
            </button>
        </th>
        </tr>`
    });

    $("#retornarTablaClienteOrderZona").html(cadena);
}
function cargdarDataModalPedido(idPedido) {

    let cadenaDetalle = "";

    for (let index = 0; index < arrayListaOrdenes[0].length; index++) {
        if (arrayListaOrdenes[0][index].id == idPedido) {
            let prueba = [arrayListaOrdenes[0][index]];
            let productos = Object.keys(prueba[0].products);
            let cantidades = Object.keys(prueba[0].quantities);
            for (let index = 0; index < productos.length; index++) {
                cadenaDetalle += `<tr>
                <th>${prueba[0].products[productos[index]].reference}</th>
                <th>${prueba[0].products[productos[index]].brand}</th>
                <th>${prueba[0].products[productos[index]].category}</th>
                <th>${prueba[0].products[productos[index]].availability}</th>
                <th>${prueba[0].products[productos[index]].price}</th>
                <th>${prueba[0].products[productos[index]].quantity}</th>
                <th>${prueba[0].quantities[cantidades[index]]}</th>
                </tr>`
            }
        }
    }
    //console.log(arrayListaOrdenes);
    //console.log(cadenaDetalle);
    $("#verDetallePedido").html(cadenaDetalle);

}
/**
 * 
 * Actualizar datos
 */
function actualizarOrdenById(id,status) {
    let estadoOrden = status;
    for (let index = 0; index < arrayListaOrdenes[0].length; index++) {
        if (arrayListaOrdenes[0][index].id == id) {
            arrayListaOrdenes[0][index].status = estadoOrden;
            updateListaOrdenes.push(arrayListaOrdenes[0][index]);
            updateOrderStatus();
            break;
        }
    }
}

function updateOrderStatus() {
    let jsonOrderUpdate = JSON.stringify(updateListaOrdenes[0]);
    $.ajax({
        method: "PUT",
        url: endPointOrder + "/update",
        data: jsonOrderUpdate,
        dataType: "json",
        contentType: "application/json",
        complete: function (response) {
            if (response.status == 201) {
                swal("Registro exitoso", "", "success");
                obtenerDataOrderZona();
            } else {
                swal("Error", "Error al insertar datos " + response.status, "warning");
            }
        }
    })

    updateListaOrdenes = [];

}
