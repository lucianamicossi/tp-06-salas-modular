function leerConfiguracion(env = process.env) {
  const port =
    env.PORT === undefined || env.PORT === "" ? 3000 : Number(env.PORT);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(
      "La variable PORT debe ser un número entero entre 1 y 65535.",
    );
  }

  const nodeEnv = env.NODE_ENV || "development";

  const logFormat = nodeEnv === "production" ? "combined" : "dev";

  return {
    port,
    nodeEnv,
    logFormat,
  };
}

module.exports = {
  leerConfiguracion,
};
