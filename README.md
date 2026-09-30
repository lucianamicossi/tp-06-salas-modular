# Trabajo práctico 06 – Salas de estudio modular

## Descripción

Esta aplicación es un sitio web para gestionar reservas de salas de estudio.

Está desarrollada con Node.js, Express y EJS. Las reservas se almacenan temporalmente en memoria, por lo que las nuevas reservas se mantienen mientras el servidor está funcionando y desaparecen cuando se reinicia la aplicación.

El Trabajo práctico 06 parte de la aplicación desarrollada en el Trabajo práctico 05 y tiene como objetivo refactorizar su estructura para separar responsabilidades en módulos, sin incorporar nueva funcionalidad.

La aplicación mantiene las mismas operaciones principales:

* mostrar la página de inicio;
* consultar el estado del servicio;
* listar reservas;
* consultar el detalle de una reserva;
* mostrar el formulario de nueva reserva;
* validar y crear reservas;
* mostrar páginas 404;
* servir archivos estáticos.

## Proyecto de partida y cambios

El proyecto parte del Trabajo práctico 05 – Salas middleware.

En el TP-05 gran parte de la aplicación se encontraba concentrada en menos archivos. En el TP-06 se reorganizó el proyecto para separar las responsabilidades.

La estructura principal quedó:

src/
├── index.js
├── app.js
├── configuracion.js
├── rutas/
│   └── reservas.js
├── controladores/
│   └── reservas.js
├── servicios/
│   └── reservas.js
└── middleware/
    ├── solicitudes.js
    └── reservas.js

### Responsabilidades

`src/index.js` Es el punto de entrada de la aplicación.

Se encarga de:

* leer la configuración;
* crear el servicio de reservas;
* crear el controlador;
* crear el router;
* crear la aplicación;
* iniciar el servidor mediante `app.listen()`.

No contiene las rutas ni realiza directamente la validación de formularios.

`src/app.js` Se encarga de configurar Express y el pipeline general de la aplicación.

Contiene:

* configuración de EJS;
* configuración de layouts;
* Morgan;
* middleware personalizados globales;
* archivos estáticos;
* parsers;
* rutas principales;
* montaje del router de reservas;
* middleware 404 final.

No inicia el servidor y no manipula directamente el arreglo de reservas.

`src/configuracion.js`

Lee y valida las variables de entorno utilizadas por la aplicación.

Valida principalmente el puerto y determina el formato de logs de Morgan según el entorno.

`src/rutas/reservas.js`

Define las rutas relacionadas con reservas utilizando `express.Router()`.

El router no contiene la lógica de negocio. Su responsabilidad es conectar métodos, caminos, middleware y controladores.

`src/controladores/reservas.js`

Se ocupa de recibir las solicitudes y decidir qué respuesta enviar.

Puede:

* renderizar vistas;
* devolver JSON;
* consultar el servicio;
* crear una reserva mediante el servicio;
* redirigir;
* devolver una página 404.

`src/servicios/reservas.js`

Contiene la lógica relacionada con las reservas almacenadas en memoria.

Proporciona operaciones para:

* listar;
* buscar por ID;
* contar;
* crear reservas.

`src/middleware/solicitudes.js`

Contiene los middleware personalizados relacionados con las solicitudes: `identificarSolicitud` `medirDuracion`.

`src/middleware/reservas.js`

Contiene:

* `prepararAreaReservas`;
* `validarReserva`;
* las opciones de salas y turnos permitidos.

## Instalación y Ejecución

Para instalar las dependencias del proyecto se debe ejecutar: npm install

Para iniciar el servidor: npm start

El servidor utiliza el puerto `3000` por defecto.

También se puede utilizar un puerto diferente mediante la variable `PORT`.

## Configuración del entorno

La configuración se encuentra en: src/configuracion.js

El proyecto incluye un archivo: .env.example

El archivo `.env` local no se incluye en el repositorio y su contenido no forma parte de esta documentación.

Si no se define `PORT`, se utiliza el puerto `3000`.

El valor debe ser un número entero entre `1` y `65535`.

Se comprobó un puerto alternativo: $env:PORT="3001"
npm start

Resultado: Servidor disponible en http://localhost:3001

También se comprobó un puerto inválido: $env:PORT="70000"
npm start

Resultado: Error: La variable PORT debe ser un número entero entre 1 y 65535.

Si no se especifica `NODE_ENV`, se utiliza `development`.

En desarrollo Morgan utiliza el formato `dev`.

En producción se configura el formato `combined`.

## Mapa de módulos y dependencias

El punto de entrada es `src/index.js`.

El flujo de creación de la aplicación es:

src/index.js
    │
    ├── configuracion.js
    │
    ├── servicios/reservas.js
    │
    ├── controladores/reservas.js
    │
    ├── rutas/reservas.js
    │
    └── app.js
            │
            ├── Express
            ├── EJS
            ├── express-ejs-layouts
            ├── Morgan
            ├── middleware
            ├── rutas
            └── 404 final

El servicio de reservas se crea una sola vez en `index.js` y luego se comparte con el controlador.

El flujo es:

Datos iniciales
      ↓
crearServicioReservas()
      ↓
Servicio de reservas
      ↓
Controlador
      ↓
Router
      ↓
Aplicación Express

De esta manera, las distintas operaciones utilizan la misma instancia del servicio.

## Pipeline de middleware

El orden general configurado en `src/app.js` es:

Solicitud
   ↓
express-ejs-layouts
   ↓
morgan
   ↓
identificarSolicitud
   ↓
medirDuracion
   ↓
express.static
   ↓
express.urlencoded
   ↓
express.json
   ↓
rutas de la aplicación
   ↓
router de reservas
   ↓
404 final

Los middleware globales de identificación y medición permiten asociar cada solicitud con un identificador y registrar su duración.

El router de reservas agrega además su propio middleware:

/reservas
   ↓
prepararAreaReservas
   ↓
rutas de reservas

En el POST:

POST /reservas
   ↓
prepararAreaReservas
   ↓
validarReserva
   ↓
controlador.crear

Si los datos son inválidos, `validarReserva` termina la solicitud con estado `400` y no ejecuta `next()`.

## Contrato de rutas

| Método         | Ruta               | Resultado esperado                          |
| -------------- | ------------------ | ------------------------------------------- |
| GET            | `/`                | Página de inicio, 200                       |
| GET            | `/estado`          | JSON con estado y cantidad de reservas, 200 |
| GET            | `/reservas`        | Lista de reservas, 200                      |
| GET            | `/reservas/nueva`  | Formulario, 200                             |
| GET            | `/reservas/:id`    | Detalle o 404                               |
| POST           | `/reservas`        | 302 si es válida, 400 si es inválida        |
| GET            | `/css/estilos.css` | Archivo estático, 200                       |
| cualquier otra | —                  | Página 404                                  |

La ruta `/reservas/nueva` se declara antes de `/reservas/:id`.

Esto evita que Express interprete `nueva` como si fuera un ID.

## Diagrama del POST válido

El recorrido de un `POST /reservas` con datos correctos es:

POST /reservas
      ↓
morgan
      ↓
identificarSolicitud
      ↓
medirDuracion
      ↓
express.urlencoded
      ↓
router de reservas
      ↓
prepararAreaReservas
      ↓
validarReserva
      ↓
controlador.crear
      ↓
servicio.crear()
      ↓
302 /reservas
      ↓
finish: ID + estado + duración

Cuando los datos son correctos, `validarReserva` prepara los datos y los guarda temporalmente en: req.reservaValidada

Luego utiliza: next(); para continuar hacia el controlador.

El controlador llama al servicio para crear la reserva y finalmente responde con una redirección: 302 /reservas

El navegador realiza después un nuevo: GET /reservas

Esta es una solicitud diferente y tiene su propio identificador y medición de duración.

## Diagrama del POST inválido

Cuando los datos no cumplen las condiciones de validación:

POST /reservas
      ↓
morgan
      ↓
identificarSolicitud
      ↓
medirDuracion
      ↓
express.urlencoded
      ↓
router de reservas
      ↓
prepararAreaReservas
      ↓
validarReserva
      ↓
400 Bad Request
      ↓
render reservas/nueva

En este caso `validarReserva` responde directamente con: 400 Bad Request

Por eso no ejecuta `next()` y la solicitud no llega al controlador de creación.

El formulario vuelve a mostrarse con los errores y conserva los datos ingresados.

## Middleware utilizado

La aplicación utiliza middleware incorporado de Express:

`express.static()`

Permite servir los archivos estáticos ubicados en `public`.

`express.urlencoded()`

Permite interpretar los datos enviados mediante formularios HTML.

`express.json()`

Permite interpretar solicitudes que contienen datos en formato JSON.

### Middleware de terceros

**Morgan**

Se utiliza: morgan(config.logFormat)

Morgan registra las solicitudes HTTP, métodos, rutas, estados y tiempos de respuesta.

**express-ejs-layouts**

Permite utilizar un layout general para las vistas EJS.

### Middleware personalizado

`identificarSolicitud`

Genera un identificador consecutivo para cada solicitud:

BIB-0001
BIB-0002
BIB-0003

El identificador se guarda en: res.locals.solicitudId para poder utilizarlo posteriormente en las vistas y en los registros.

`medirDuracion`

Mide cuánto tarda en finalizar una solicitud.

Utiliza el evento `finish` de la respuesta para calcular la duración y registrar:

* identificador;
* método;
* URL;
* código de estado;
* duración.

`prepararAreaReservas`

Se ejecuta dentro del router de reservas y prepara información común para las vistas: Reservas de salas

`validarReserva`

Comprueba los datos recibidos mediante `POST /reservas`.

Si los datos son válidos, prepara `req.reservaValidada` y ejecuta `next()`.

Si son inválidos, responde con `400` y vuelve a mostrar el formulario.

## Validación

La validación de las reservas se realiza en el servidor mediante el middleware `validarReserva`.

El POST está definido en el router como: router.post("/", validarReserva, controlador.crear);

Esto permite separar responsabilidades:

* `validarReserva` comprueba y prepara los datos;
* el controlador se ocupa de la respuesta HTTP;
* el servicio se ocupa de crear la reserva en memoria.

### Datos que se validan

**Estudiante**

Es obligatorio. Se eliminan espacios al principio y al final mediante `trim()`.

**Email**

Es obligatorio y debe contener `@`.

**Sala**

Es obligatoria y debe ser una de las siguientes:

* Sala Norte
* Sala Sur
* Sala Multimedia

**Fecha**

Es obligatoria.

**Turno**

Es obligatorio y debe ser:

* Mañana
* Tarde
* Noche

**Cantidad de personas**

Es obligatoria y debe ser un número entero entre `1` y `6`.

Si algún dato no cumple las condiciones, el servidor responde con: 400 Bad Request

y vuelve a mostrar el formulario con los errores y los valores ingresados.

## ¿Por qué el servicio no utiliza `req` ni `res`?

El servicio se encuentra en: src/servicios/reservas.js

Su responsabilidad es trabajar con los datos de las reservas.

Por eso no necesita conocer Express ni HTTP.

El servicio no debe decidir si una respuesta es `200`, `302` o `400`, ni debe renderizar vistas.

Sus funciones se concentran en operaciones como:

* listar;
* buscar;
* contar;
* crear.

De esta forma se evita mezclar la lógica de reservas con la lógica HTTP.

## ¿Qué hace el controlador?

El controlador conecta las solicitudes HTTP con el servicio.

Se encuentra en: src/controladores/reservas.js

El controlador:

* recibe `req` y `res`;
* lee parámetros;
* llama al servicio;
* renderiza vistas;
* devuelve JSON;
* redirige;
* responde con 404 cuando corresponde.

El controlador no contiene el arreglo de reservas.

## ¿Por qué el router utiliza caminos relativos?

El router se monta en `app.js` mediante: app.use("/reservas", routerReservas);

Por eso dentro de `rutas/reservas.js` no es necesario repetir `/reservas`.

## Persistencia temporal y límites

Las reservas se almacenan únicamente en memoria.

El único arreglo de reservas pertenece al servicio creado en: src/servicios/reservas.js

El servicio se crea una sola vez en `src/index.js`: crearServicioReservas(reservasIniciales)

El arreglo contiene inicialmente cuatro reservas.

Mientras el servidor permanece funcionando, las reservas nuevas se agregan a esa colección y pueden ser consultadas mediante:

GET /reservas
GET /reservas/:id
GET /estado

Cuando se reinicia Node, el arreglo se crea nuevamente con las reservas iniciales.

Por lo tanto, las reservas creadas mediante el formulario desaparecen al reiniciar.

No se utiliza:

* MongoDB;
* Mongoose;
* archivos para guardar reservas;
* una API externa.

La persistencia es deliberadamente temporal porque forma parte del alcance de este trabajo.

## Matriz antes/después

El refactor mantuvo el comportamiento funcional del TP-05. Las rutas principales conservaron sus respuestas y códigos HTTP.

| Funcionalidad                      |     TP-05 |     TP-06 |
| ---------------------------------- | --------: | --------: |
| Rutas principales                  |         ✓ |         ✓ |
| Validación del POST                | 400 / 302 | 400 / 302 |
| Respuestas 404                     |         ✓ |         ✓ |
| Archivos estáticos                 |         ✓ |         ✓ |
| Morgan y middleware personalizados |         ✓ |         ✓ |
| Persistencia temporal en memoria   |         ✓ |         ✓ |

El cambio principal fue **estructural**: las responsabilidades se separaron en configuración, aplicación, router, controladores, servicio y middleware, sin agregar nuevas funcionalidades.

## Pruebas manuales

Se verificaron las principales rutas, validaciones y el comportamiento de la persistencia temporal.

| Prueba                   |           Resultado |
| ------------------------ | ------------------: |
| GET `/`                  |                 200 |
| GET `/estado`            |                 200 |
| GET `/reservas`          |                 200 |
| GET `/reservas/nueva`    |                 200 |
| GET `/reservas/1`        |                 200 |
| GET `/reservas/999`      |                 404 |
| POST vacío               |                 400 |
| Sala inválida            |                 400 |
| Email inválido           |                 400 |
| Personas 0, 7 y 2.5      |                 400 |
| POST válido              |                 302 |
| Nueva reserva en listado |                   ✓ |
| GET `/css/estilos.css`   |                 200 |
| URL inexistente          |                 404 |
| Reinicio del servidor    | vuelve a 4 reservas |

La prueba de persistencia confirmó que una reserva creada durante la ejecución aumenta temporalmente la cantidad de reservas de 4 a 5. Después de reiniciar el servidor, vuelven a quedar las 4 reservas iniciales.

## Morgan y medición de duración

Durante las pruebas se comprobó que Morgan y el middleware `medirDuracion` funcionan conjuntamente.

Se observaron solicitudes con los códigos `200`, `302`, `400` y `404`, por ejemplo:

POST /reservas 400
[BIB-0005] POST /reservas 400 - 56.11 ms

POST /reservas 302
[BIB-0011] POST /reservas 302 - 6.12 ms

GET /reservas 200
[BIB-0012] GET /reservas 200 - 9.03 ms

GET /esto-no-existe 404
[BIB-0015] GET /esto-no-existe 404 - 5.22 ms

Morgan registra la solicitud HTTP y `medirDuracion` agrega el identificador `BIB` y la duración medida por la aplicación.

## Formato y análisis estático

El proyecto utiliza Prettier para el formato del código y ESLint para el análisis estático.

Se ejecutó `npm run format` para aplicar el formato y luego `npm run check`, que verifica el formato y ejecuta ESLint.

## Persistencia temporal y límites

Las reservas se almacenan únicamente en memoria, dentro del servicio `src/servicios/reservas.js`.

Al iniciar la aplicación, `src/index.js` proporciona las cuatro reservas iniciales al servicio. Las nuevas reservas se agregan al mismo arreglo durante la ejecución y pueden consultarse desde el listado, el detalle y `/estado`.

Esta información no se guarda en archivos ni en una base de datos. Por lo tanto, al detener o reiniciar el servidor, las reservas agregadas durante la ejecución se pierden y vuelven a cargarse únicamente las cuatro reservas iniciales.

