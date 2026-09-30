function crearServicioReservas(datosIniciales = []) {
  const reservas = [...datosIniciales];

  function listar() {
    return reservas;
  }

  function buscarPorId(id) {
    const idNumero = Number(id);

    return reservas.find((reserva) => reserva.id === idNumero);
  }

  function contar() {
    return reservas.length;
  }

  function crear(datos) {
    const siguienteId =
      reservas.length === 0
        ? 1
        : Math.max(...reservas.map((reserva) => reserva.id)) + 1;

    const nuevaReserva = {
      id: siguienteId,
      ...datos,
    };

    reservas.push(nuevaReserva);

    return nuevaReserva;
  }

  return {
    listar,
    buscarPorId,
    contar,
    crear,
  };
}

module.exports = {
  crearServicioReservas,
};
