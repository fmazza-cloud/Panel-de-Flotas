# Panel de Flotas · E-Fleets

Herramienta de gestión comercial y operativa del Canal de Flotas de la Red EuroTaller,
construida como puente hasta que esté terminado el software de gestión definitivo.

Administra cuentas de flota, la composición de vehículos de cada una, el tarifario
estandarizado de servicios, la proyección de facturación anual, la red de talleres y
la emisión de presupuestos en PDF.

---

## Cómo se usa

El panel es **un único archivo HTML autocontenido**. No necesita servidor, ni instalación,
ni conexión a internet.

```
Abrir index.html en Chrome o Edge
```

Los datos se guardan en el navegador (`localStorage`). Cuando se publica como artefacto de
Claude, además se sincronizan contra una base persistente. El botón **Descargar respaldo**
de la barra superior baja un JSON con todo el estado.

---

## Estructura del repositorio

```
index.html                    Aplicación compilada. Es lo que se abre y se distribuye.

src/
  shell.html                  Armazón HTML: carga de React, Tailwind y Babel.
  runtime.js                  Capa de almacenamiento y descarga de archivos.
  iconos.jsx                  Íconos SVG, sin dependencias externas.
  panel.jsx                   Todo el código de la aplicación.

datos/
  tabla-vehiculos.js          11.353 vehículos de la Tabla de Vehículos de ETMAN.
  red-talleres.js             85 talleres de la Red EuroTaller.
  codigos-asignados.js        Vinculación modelo del panel → código ETMAN.

vendor/
  jspdf.umd.min.js            Generación de PDF. MIT.
  xlsx.full.min.js            Generación de Excel. Apache 2.0.

build/
  build.py                    Arma index.html a partir de las piezas anteriores.
  generar-datos.py            Regenera datos/ desde los Excel originales.

docs/
  Cruce_Panel_TablaVehiculos.xlsx   Planilla de revisión del cruce de códigos.
```

---

## Compilar

`index.html` es generado, no se edita a mano. Para modificar el panel se toca `src/panel.jsx`
y se vuelve a compilar:

```bash
python3 build/build.py
```

No requiere dependencias. El script reemplaza las marcas `/*@@...@@*/` de `src/panel.jsx`
por el contenido de `datos/` y ensambla todo dentro de `src/shell.html`.

### Actualizar los datos

Cuando ETMAN publique una nueva Tabla de Vehículos o cambie la agenda de talleres:

```bash
pip install pandas openpyxl
python3 build/generar-datos.py fuentes/Tabla_Vehiculos.xlsx fuentes/Agenda_Eurotaller_2026.xlsx
python3 build/build.py
```

Los Excel originales van en `fuentes/`, que está excluida del control de versiones.

---

## Migraciones de datos

El estado guardado lleva un número de versión en `config.v`. Al abrir el panel, las
migraciones pendientes se aplican en orden y el resultado se persiste. Esto permite
corregir o incorporar datos sin que nadie pierda lo que venía cargando.

| Versión | Qué hace |
|---------|----------|
| 2 | Da de alta las cuentas Testigos de Jehová, South Post y Always |
| 3 | Carga las 136 unidades de Testigos de Jehová |
| 4 | Corrige Captur, Partner, Hiace Wagon y Cruze |
| 5 | Vincula los modelos con sus códigos de la Tabla de Vehículos |
| 6 | Acota la Sprinter 416 a los dos códigos de furgón |
| 7 | Corrige las cilindradas de las Sprinter según la tabla |

Para agregar una migración se suma un bloque `if (!(d.config.v >= N))` en la rutina de carga
y se incrementa la versión de la semilla.

---

## Vinculación con la Tabla de Vehículos

Cada modelo del panel guarda una lista de **códigos ETMAN**. La relación es de uno a varios:
una Ranger XL 2.0 existe como 4x2 y como 4x4, con códigos distintos, pero comparte tarifario.

### Metodología para dar de alta un modelo nuevo

1. En la pestaña **Flota**, botón *Agregar modelo*.
2. En la columna **Códigos ETMAN** de la fila nueva, hacer clic en *vincular*.
3. Buscar por marca, modelo, cilindrada o código.
4. Usar **+ completar**: agrega el código y además rellena marca, modelo, motor y años
   desde la tabla, solo en los campos vacíos.
5. Completar a mano lo que la tabla no tiene: versión comercial, cantidad de unidades y
   kilometraje anual.

El código nunca se escribe a mano. Ningún modelo debería quedar sin vincular.

---

## Criterio de cruce de códigos

Usado para vincular los 23 modelos iniciales, documentado en `docs/`:

1. Marca y modelo deben coincidir, normalizando `CHEVROLET → CHEVROLET - GENERAL MOTORS`,
   `MERCEDES-BENZ → MERCEDES BENZ`, `S10 → S-10` y los sufijos de generación.
2. La cilindrada debe coincidir exactamente.
3. El combustible debe coincidir.
4. Los años deben solaparse. Un rango abierto se toma hasta el año en curso.
5. Transmisión: si el panel dice AT se exige AT; si dice MT se acepta MT o versión sin
   informar, porque en la tabla el silencio equivale a MT.
6. Los tokens de la versión suman puntaje pero no descartan.

---

## Pendientes

- Kilometraje anual y distribución geográfica de las flotas de AVIS y Testigos de Jehová.
- Precios del tarifario, hoy en cero.
- Matriz de capacidad técnica de los talleres, empezando por AMBA.
- Motorización de la Peugeot Partner Patagónica, único modelo sin código vinculado.
- Lógica de asignación de taller cruzando capacidad técnica contra cercanía.

---

## Nota sobre datos sensibles

`datos/red-talleres.js` contiene nombres, teléfonos y correos de los titulares de los 85
talleres de la red, y `datos/tabla-vehiculos.js` es información interna de ETMAN.
**Este repositorio no debería ser público.**
