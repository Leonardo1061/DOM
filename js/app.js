const formGasto = document.querySelector('#form-gasto');
const inputDescripcion = document.querySelector('#descripcion');
const inputValor = document.querySelector('#valor');
const selectCategoria = document.querySelector('#categoria');

// Elementos <small> para mostrar errores debajo de cada campo
const errorDescripcion = document.querySelector('#error-descripcion');
const errorValor = document.querySelector('#error-valor');
const errorCategoria = document.querySelector('#error-categoria');

// Tabla, filtro y total
const selectFiltro = document.querySelector('#filtro-categoria');
const tablaGastos = document.querySelector('#tabla-gastos');
const contenedorTotal = document.querySelector('#contenedor-total');
const spanTotal = document.querySelector('#total-gastado');