// ==========================================
// PASO 3: Referencias a los elementos del DOM
// ==========================================
const formGasto = document.querySelector('#form-gasto');
const inputDescripcion = document.querySelector('#descripcion');
const inputValor = document.querySelector('#valor');
const selectCategoria = document.querySelector('#categoria');

const errorDescripcion = document.querySelector('#error-descripcion');
const errorValor = document.querySelector('#error-valor');
const errorCategoria = document.querySelector('#error-categoria');

const selectFiltro = document.querySelector('#filtro-categoria');
const tablaGastos = document.querySelector('#tabla-gastos');
const contenedorTotal = document.querySelector('#contenedor-total');
const spanTotal = document.querySelector('#total-gastado');

// ==========================================
// PASO 4 y PASO 9: Estado, localStorage y render()
// ==========================================
const PRESUPUESTO_MAXIMO = 500000;

// Leer gastos desde localStorage o iniciar con arreglo vacío (Sección 8 de la guía)
let gastos = JSON.parse(localStorage.getItem('gastos')) ?? [];

// Guardar el arreglo actual en localStorage convertido a texto JSON
function guardar() {
  localStorage.setItem('gastos', JSON.stringify(gastos));
}

function render() {
  tablaGastos.replaceChildren();

  const categoriaElegida = selectFiltro.value;
  const gastosVisibles = gastos.filter((gasto) => {
    if (categoriaElegida === 'Todas') return true;
    return gasto.categoria === categoriaElegida;
  });

  gastosVisibles.forEach((gasto) => {
    const fila = document.createElement('tr');
    fila.dataset.id = gasto.id;

    const tdDescripcion = document.createElement('td');
    tdDescripcion.textContent = gasto.descripcion;

    const tdCategoria = document.createElement('td');
    tdCategoria.textContent = gasto.categoria;

    const tdValor = document.createElement('td');
    tdValor.textContent = `$${gasto.valor.toLocaleString('es-CO')}`;

    const tdAccion = document.createElement('td');
    const btnEliminar = document.createElement('button');
    btnEliminar.textContent = 'Eliminar';
    btnEliminar.classList.add('btn-eliminar');
    tdAccion.append(btnEliminar);

    fila.append(tdDescripcion, tdCategoria, tdValor, tdAccion);
    tablaGastos.append(fila);
  });

  // PASO 7: Calcular el total visible y evaluar la alerta de presupuesto
  let sumaVisible = 0;
  gastosVisibles.forEach((gasto) => {
    sumaVisible += gasto.valor;
  });
  spanTotal.textContent = `$${sumaVisible.toLocaleString('es-CO')}`;

  let totalGeneral = 0;
  gastos.forEach((gasto) => {
    totalGeneral += gasto.valor;
  });

  contenedorTotal.classList.toggle('alerta-presupuesto', totalGeneral > PRESUPUESTO_MAXIMO);
}

// ==========================================
// PASO 5: Evento submit, validación y registro
// ==========================================
formGasto.addEventListener('submit', (e) => {
  e.preventDefault();

  const descripcion = inputDescripcion.value.trim();
  const valorTexto = inputValor.value.trim();
  const valorNumero = Number(valorTexto);
  const categoria = selectCategoria.value;

  errorDescripcion.textContent = '';
  errorValor.textContent = '';
  errorCategoria.textContent = '';

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

  if (hayErrores) {
    return;
  }

  const nuevoGasto = {
    id: Date.now(),
    descripcion: descripcion,
    valor: valorNumero,
    categoria: categoria
  };

  gastos.push(nuevoGasto);
  guardar(); // Guarda en localStorage
  formGasto.reset();
  render();
});

// ==========================================
// PASO 6: Eliminar gastos (delegación de eventos)
// ==========================================
tablaGastos.addEventListener('click', (e) => {
  if (e.target.matches('.btn-eliminar')) {
    const fila = e.target.closest('tr');
    if (!fila) return;

    const idGasto = Number(fila.dataset.id);
    gastos = gastos.filter((gasto) => gasto.id !== idGasto);

    guardar(); // Actualiza localStorage después de borrar
    render();
  }
});

// ==========================================
// PASO 8: Filtro por categoría
// ==========================================
selectFiltro.addEventListener('change', () => {
  render();
});

// Dibujar la tabla al cargar la página con lo que haya en localStorage
render();