/**
 * Inventario Productos
 */
/**
 * endPoint de inventario
 */
 const endPointProducto = "http://localhost:8080/api/supplements";
 const endPointUser = "http://localhost:8080/api/user";
 //const endPointProducto = "http://150.230.88.187:8080/api/supplements" 
 /**
  * Registrar Producto
  */
 function validarCamposVaciosPedidos() {
 
     let fecha = $("#fechaOrden").val();
     let producto = $("#retornarSelectProducto").val();
     let cantidad = $("#cantidadProducto").val();
 
 
     if (fecha == "" || producto == "" || cantidad == "") {
         swal("info", "Hay campos vacios", "warning");
     } else {
 
         obtenerDataProductoSelccionado(producto, cantidad);
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
 function obtenerDataProductoSelccionado(producto, cantidad) {
 
     //let userJs = JSON.parse(userJson);
     let userJson = sessionStorage.getItem("user");
     let userJs = JSON.parse(userJson);
 
     $.ajax({
         method: "GET",
         url: `${endPointProducto}/${producto}`,
         success: function (data) {
             jsonOders(data, userJs,producto,cantidad);
         }
     });
 
 }
 function jsonOders(data, jsonUser,producto,cantidad) {
 
     let idPro = data.reference;
 
     dataProduct = {
         registerDay: $("#fechaOrden").val(),
         status: "PENDIENTE",
         salesMan: jsonUser
             /*id: jsonUser.id,
             identification: jsonUser.identification,
             name: jsonUser.name,
             birthtDay: jsonUser.birthtDay,
             monthBirthtDay: jsonUser.monthBirthtDay,
             address: jsonUser.address,
             cellPhone: jsonUser.cellPhone,
             email: jsonUser.email,
             password: jsonUser.password,
             zone: jsonUser.zone,
             type: jsonUser.type*/
         ,
         products: {
             producto : {
                 data
             }
         }
         /*products: {
             idPro : {
                 reference: data.reference,
                 brand: data.brand,
                 category: data.category,
                 objetivo: data.objetivo,
                 description: data.description,
                 availability: data.availability,
                 price: data.price,
                 quantity: data.quantity,
                 photography: data.photography
             }
         }¨*/,
         quantities: {
             idPro : cantidad
         }
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
         }
     });
 }
 function retornarDataTable(respuesta) {
     let cadena = "";
 
     console.log(respuesta)
 
     respuesta.forEach(element => {
         cadena += `<option value='${element.reference}'>${element.brand}</option>`;
     });
 
     $("#retornarSelectProducto").html(cadena);
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
     } else {
         retornarDataMongo();
         let userJs = JSON.parse(userJson);
         $("#idUserLogin").html(userJs.name);
     }
 
     $("#cerrarSesion").click(function () {
         sessionStorage.removeItem("user");
         window.location.href = "index.html";
     })
 
 })
 
 
 