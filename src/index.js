const { leerConfiguracion } = require("./configuracion");
const { crearApp } = require("./app");
const { crearServicioReservas } = require("./servicios/reservas");
const { crearControladorReservas } = require("./controladores/reservas");
const { crearRouterReservas } = require("./rutas/reservas");
const { salasPermitidas, turnosPermitidos } = require("./middleware/reservas");

const reservasIniciales = [
  {
    id: 1,
    estudiante: "Lucía Pérez",
    email: "lucia@gmail.com",
    sala: "Sala Norte",
    fecha: "2026-09-24",
    turno: "Mañana",
    personas: 2,
  },
  {
    id: 2,
    estudiante: "Martín Gómez",
    email: "martin@gmail.com",
    sala: "Sala Sur",
    fecha: "2026-09-25",
    turno: "Tarde",
    personas: 4,
  },
  {
    id: 3,
    estudiante: "Sofía López",
    email: "sofia@gmail.com",
    sala: "Sala Multimedia",
    fecha: "2026-09-26",
    turno: "Noche",
    personas: 3,
  },
  {
    id: 4,
    estudiante: "Diego Fernández",
    email: "diego@gmail.com",
    sala: "Sala Norte",
    fecha: "2026-09-27",
    turno: "Tarde",
    personas: 5,
  },
];

const config = leerConfiguracion();

const servicio = crearServicioReservas(reservasIniciales);

const controlador = crearControladorReservas(servicio, {
  salasPermitidas,
  turnosPermitidos,
});

const routerReservas = crearRouterReservas(controlador);

const app = crearApp({
  controlador,
  routerReservas,
  config,
});

app.listen(config.port, () => {
  console.log(`Servidor disponible en http://localhost:${config.port}`);
});
