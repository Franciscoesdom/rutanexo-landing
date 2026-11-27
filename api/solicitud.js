// Función de Vercel: recibe una solicitud de demo y la guarda en la tabla `solicitudes` de Supabase.
// La clave secreta vive en las variables de entorno de Vercel, nunca en el navegador.
//   SUPABASE_URL         p. ej. https://xxxx.supabase.co
//   SUPABASE_SECRET_KEY  clave secreta (o service_role) del proyecto

const LIMITES = { nombre: 80, empresa: 100, correo: 120, origen: 60, destino: 60 };

function texto(valor, maximo) {
  return typeof valor === "string" ? valor.trim().slice(0, maximo) : "";
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Método no permitido." });
  }

  const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    return res.status(503).json({ error: "El guardado de solicitudes todavía no está configurado." });
  }

  const cuerpo = req.body && typeof req.body === "object" ? req.body : {};

  // Campo trampa: los bots lo llenan, las personas no lo ven. Se responde "ok" sin guardar.
  if (texto(cuerpo.sitio, 200)) return res.status(200).json({ ok: true });

  const solicitud = {};
  for (const [campo, maximo] of Object.entries(LIMITES)) solicitud[campo] = texto(cuerpo[campo], maximo);

  if (!solicitud.nombre || !solicitud.empresa) {
    return res.status(400).json({ error: "Falta el nombre o la empresa." });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(solicitud.correo)) {
    return res.status(400).json({ error: "El correo no es válido." });
  }
  if (!solicitud.origen || !solicitud.destino || solicitud.origen === solicitud.destino) {
    return res.status(400).json({ error: "La ruta necesita un origen y un destino distintos." });
  }

  const encabezados = {
    apikey: SUPABASE_SECRET_KEY,
    "Content-Type": "application/json",
    Prefer: "return=minimal",
  };
  // Las claves service_role antiguas son JWT y también van como Authorization.
  if (SUPABASE_SECRET_KEY.startsWith("eyJ")) encabezados.Authorization = `Bearer ${SUPABASE_SECRET_KEY}`;

  try {
    const respuesta = await fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/solicitudes`, {
      method: "POST",
      headers: encabezados,
      body: JSON.stringify(solicitud),
    });
    if (!respuesta.ok) {
      const detalle = await respuesta.text();
      console.error("Supabase respondió", respuesta.status, detalle);
      // El código de Supabase (p. ej. 401 o PGRST205) ayuda a diagnosticar y no expone la clave.
      const codigo = (detalle.match(/"code"\s*:\s*"([^"]+)"/) || [])[1] || "";
      return res.status(502).json({ error: "No pudimos guardar tu solicitud.", codigo: `${respuesta.status} ${codigo}`.trim() });
    }
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.error("Error al conectar con Supabase:", error);
    return res.status(502).json({ error: "No pudimos guardar tu solicitud." });
  }
};
