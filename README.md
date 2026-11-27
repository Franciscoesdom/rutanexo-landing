# RutaNexo Logística – Landing page y cotizador

RutaNexo Logística es una plataforma mexicana que conecta a empresas que necesitan mover mercancía con transportistas independientes, sin intermediarios.

- Sitio en línea: https://rutanexo-landing.vercel.app
- Autor: Francisco Espinoza Domínguez (Licenciatura en Innovación y Negocios, Universidad de la Libertad)
- Publicación: GitHub + Vercel (cada commit se despliega solo)

## Qué hay en este repositorio

| Archivo | Para qué sirve |
|---|---|
| `index.html` | El sitio completo: landing page, cotizador de flete y formulario de solicitud de demo |
| `api/solicitud.js` | Función de Vercel que valida cada solicitud de demo y la guarda en Supabase |
| `supabase/solicitudes.sql` | Script para crear la tabla `solicitudes` en Supabase |
| `PROMPT_LOG.md` | Bitácora de prompts y decisiones del Assignment 2 |
| `CLAUDE.md` | Instrucciones del proyecto para el asistente de IA |

## Decisiones de diseño vs. sugerencias del IS

(IS = el asistente de inteligencia artificial.) Estas son las decisiones donde no acepté la primera propuesta tal cual.

### 1. Tarjeta 3 de la landing: de texto genérico a un diferenciador real

- **Qué sugirió el IS:** una tarjeta llamada "Tecnología de punta", con un texto que podría ir en cualquier empresa.
- **Qué decidí:** rechazarla. Decía algo que cualquier competidor también diría y no explicaba por qué RutaNexo es distinta.
- **Qué hice:** la reescribí como "Sin intermediarios": la empresa conecta directo con el transportista, evita comisiones y paga solo por el flete real. Después ajusté el título a "Sin una persona en medio", más cercano a como habla el cliente.
- **Commits:** `fix: tarjeta 3 con diferenciador real` y `fix: tarjeta 3 con el título "Sin una persona en medio"`.

### 2. Cotizador: tarifa y margen de error explícitos

- **Qué decidí:** la tarifa por kilómetro es el punto medio entre las empresas más baratas y las más caras, para competir sin quitarle ganancia al transportista.
- **Qué aprendí:** la distancia sale de una API (OSRM) y tiene un margen de error de ±10%. No pude reducirlo, así que lo dejé declarado en lugar de prometer un precio exacto: es una cotización estimada.
- **Cómo lo validé:** con una ruta real, Acapulco a Culiacán (aprox. 1,455 km), comparando el resultado contra el cálculo hecho a mano con la tarifa.
- **Commit:** `feat: cotizador de flete con distancia real (OSRM) y vehículo según peso`.

### 3. Rediseño profesional de la landing

- **Qué decidí:** subir una versión más producida (encabezado fijo, sección "Cómo funciona", tarjetas, bloques para empresas y transportistas, pie de página completo).
- **Commit:** `feat: rediseño profesional de la landing page`.

## Cómo se trabajó

Cada cambio se publica con un commit cuyo mensaje dice qué cambió. El primer commit ("Add files via upload") quedó con el mensaje por defecto de GitHub; desde entonces uso prefijos como `feat:`, `fix:` y `docs:` para que el historial se entienda solo.

## Pendientes

- Reemplazar el correo de contacto y los enlaces de redes sociales de ejemplo por los reales.
- Mejorar la precisión de la distancia para reducir el margen de ±10%.
