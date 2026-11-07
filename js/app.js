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

// ==========================================
// PASO 4: Estado de la aplicación y render()
// ==========================================
const PRESUPUESTO_MAXIMO = 500000;

// Arreglo de objetos { id, descripcion, valor, categoria }
// (En el paso 9 lo conectaremos con localStorage)
let gastos = [];

function render() {
  // 1. Vaciar el <tbody> antes de volver a dibujarlo (Sección 5 de la guía)
  tablaGastos.replaceChildren();

  // 2. Filtrar los gastos según la categoría seleccionada (Requisito 6)
  const categoriaElegida = selectFiltro.value;
  const gastosVisibles = gastos.filter((gasto) => {
    if (categoriaElegida === 'Todas') return true;
    return gasto.categoria === categoriaElegida;
  });

  // 3. Crear una fila <tr> por cada gasto visible (Requisito 3 y Sección 5 de la guía)
  gastosVisibles.forEach((gasto) => {
    const fila = document.createElement('tr');
    fila.dataset.id = gasto.id; // Guardamos el id en data-id para poder eliminarlo luego

    const tdDescripcion = document.createElement('td');
    tdDescripcion.textContent = gasto.descripcion; // Siempre textContent, nunca innerHTML

    const tdCategoria = document.createElement('td');
    tdCategoria.textContent = gasto.categoria;

    const tdValor = document.createElement('td');
    // Formato en pesos colombianos (Sección 5, pág. 4 de la guía)
    tdValor.textContent = `$${gasto.valor.toLocaleString('es-CO')}`;

    const tdAccion = document.createElement('td');
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.classList.add('btn-eliminar');
    tdAccion.append(btnEliminar);

    // Insertar las celdas en la fila y la fila en la tabla
    fila.append(tdDescripcion, tdCategoria, tdValor, tdAccion);
    tablaGastos.append(fila);
  });

  // 4. Calcular y mostrar el total de los gastos visibles (Requisitos 5 y 6)
  let sumaVisible = 0;
  gastosVisibles.forEach((gasto) => {
    sumaVisible += gasto.valor;
  });
  spanTotal.textContent = `$${sumaVisible.toLocaleString('es-CO')}`;

  // 5. Alerta de presupuesto: evaluar si el TOTAL GENERAL supera $500.000 (Requisito 7)
  let totalGeneral = 0;
  gastos.forEach((gasto) => {
    totalGeneral += gasto.valor;
  });

  // classList.toggle(clase, condición) agrega la clase si es true y la quita si es false (Sección 4 y 9)
  contenedorTotal.classList.toggle('alerta-presupuesto', totalGeneral > PRESUPUESTO_MAXIMO);
}

// Llamada inicial para mostrar la tabla y el total en $0 al abrir la página
render();

// ==========================================
// PASO 5: Evento submit, validación y registro
// ==========================================
formGasto.addEventListener('submit', (e) => {
  // 1. Evitar que el formulario recargue la página (Sección 7 de la guía)
  e.preventDefault();

  // 2. Leer los valores de los campos (.trim() quita espacios sobrantes)
  const descripcion = inputDescripcion.value.trim();
  const valorTexto = inputValor.value.trim();
  const valorNumero = Number(valorTexto);
  const categoria = selectCategoria.value;

  // 3. Limpiar mensajes de error anteriores antes de volver a validar
  errorDescripcion.textContent = '';
  errorValor.textContent = '';
  errorCategoria.textContent = '';

  // 4. Verificar cada campo (Requisito 2: mostrar error debajo del campo correspondiente)
  let hayErrores = false;

  if (descripcion === '') {
    errorDescripcion.textContent = 'Ingresa la descripción del gasto.';
    hayErrores = true;
  }

  if (valorTexto === '' || isNaN(valorNumero) || valorNumero <= 0) {
    errorValor.textContent = 'Ingresa un valor válido mayor que cero.';
    hayErrores = true;
  }

  if (categoria === '') {
    errorCategoria.textContent = 'Selecciona una categoría.';
    hayErrores = true;
  }

  // Si hubo algún error, detenemos la función aquí con return (Sección 7 de la guía)
  if (hayErrores) {
    return;
  }

  // 5. Si todo está correcto, guardamos el nuevo gasto en el arreglo (Sección 9 de la guía)
  const nuevoGasto = {
    id: Date.now(), // Genera un identificador único con la fecha/hora actual en milisegundos
    descripcion: descripcion,
    valor: valorNumero,
    categoria: categoria
  };

  gastos.push(nuevoGasto);

  // 6. Limpiar el formulario y actualizar la pantalla
  formGasto.reset();
  render();
});