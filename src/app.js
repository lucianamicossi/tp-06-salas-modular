const path = require("path");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");

const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");

function crearApp({ controlador, routerReservas, config }) {
  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));

  app.use(expressLayouts);
  app.set("layout", "layouts/main");

  app.use(morgan(config.logFormat));

  app.use(identificarSolicitud);
  app.use(medirDuracion);

  app.use(express.static(path.join(__dirname, "..", "public")));

  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get("/", controlador.inicio);
  app.get("/estado", controlador.estado);

  app.use("/reservas", routerReservas);

  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });

  return app;
}

module.exports = {
  crearApp,
};
