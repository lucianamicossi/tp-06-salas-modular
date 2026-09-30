function crearControladorReservas(servicio, opciones) {
  const { salasPermitidas, turnosPermitidos } = opciones;

  function inicio(req, res) {
    res.render("inicio", {
      titulo: "Inicio",
    });
  }

  function estado(req, res) {
    res.json({
      servicio: "activo",
      reservas: servicio.contar(),
      solicitudId: res.locals.solicitudId,
    });
  }

  function listar(req, res) {
    res.render("reservas/lista", {
      titulo: "Reservas",
      reservas: servicio.listar(),
    });
  }

  function mostrarFormulario(req, res) {
    res.render("reservas/nueva", {
      titulo: "Nueva reserva",
      datos: {
        estudiante: "",
        email: "",
        sala: "",
        fecha: "",
        turno: "",
        personas: "",
      },
      salasPermitidas,
      turnosPermitidos,
    });
  }

  function detalle(req, res) {
    const reserva = servicio.buscarPorId(req.params.id);

    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        titulo: "Reserva no encontrada",
        mensaje: "La reserva solicitada no existe.",
      });
    }

    res.render("reservas/detalle", {
      titulo: "Detalle de reserva",
      reserva,
    });
  }

  function crear(req, res) {
    servicio.crear(req.reservaValidada);

    res.redirect("/reservas");
  }

  return {
    inicio,
    estado,
    listar,
    mostrarFormulario,
    detalle,
    crear,
  };
}

module.exports = {
  crearControladorReservas,
};
