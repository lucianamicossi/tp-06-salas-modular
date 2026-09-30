let siguienteSolicitud = 1;

function identificarSolicitud(req, res, next) {
  const solicitudId = `BIB-${String(siguienteSolicitud).padStart(4, "0")}`;

  siguienteSolicitud += 1;

  res.locals.solicitudId = solicitudId;

  next();
}

function medirDuracion(req, res, next) {
  const inicio = process.hrtime.bigint();

  res.on("finish", () => {
    const fin = process.hrtime.bigint();
    const duracionMs = Number(fin - inicio) / 1_000_000;

    console.log(
      `[${res.locals.solicitudId}] ${req.method} ${req.originalUrl} ` +
        `${res.statusCode} - ${duracionMs.toFixed(2)} ms`,
    );
  });

  next();
}

module.exports = {
  identificarSolicitud,
  medirDuracion,
};
