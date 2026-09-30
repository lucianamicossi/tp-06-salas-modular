const salasPermitidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"];

const turnosPermitidos = ["Mañana", "Tarde", "Noche"];

function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas";

  next();
}

function validarReserva(req, res, next) {
  req.body = req.body || {};

  const estudiante = String(req.body.estudiante || "").trim();
  const email = String(req.body.email || "").trim();
  const sala = String(req.body.sala || "").trim();
  const fecha = String(req.body.fecha || "").trim();
  const turno = String(req.body.turno || "").trim();

  const personasTexto = String(req.body.personas ?? "").trim();
  const personas = Number(personasTexto);

  const datosFormulario = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas: personasTexto,
  };

  const errores = [];

  if (!estudiante) {
    errores.push("El estudiante es obligatorio.");
  }

  if (!email) {
    errores.push("El email es obligatorio.");
  } else if (!email.includes("@")) {
    errores.push("El email debe contener @.");
  }

  if (!sala) {
    errores.push("La sala es obligatoria.");
  } else if (!salasPermitidas.includes(sala)) {
    errores.push("La sala seleccionada no es válida.");
  }

  if (!fecha) {
    errores.push("La fecha es obligatoria.");
  }

  if (!turno) {
    errores.push("El turno es obligatorio.");
  } else if (!turnosPermitidos.includes(turno)) {
    errores.push("El turno seleccionado no es válido.");
  }

  if (!personasTexto) {
    errores.push("La cantidad de personas es obligatoria.");
  } else if (!Number.isInteger(personas) || personas < 1 || personas > 6) {
    errores.push(
      "La cantidad de personas debe ser un número entero entre 1 y 6.",
    );
  }

  if (errores.length > 0) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva",
      error: errores.join(" "),
      errores,
      datos: datosFormulario,
      salasPermitidas,
      turnosPermitidos,
    });
  }

  req.reservaValidada = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas,
  };

  next();
}

module.exports = {
  prepararAreaReservas,
  validarReserva,
  salasPermitidas,
  turnosPermitidos,
};
