# RutaNexo Logística – Landing page, cotizador y solicitudes

RutaNexo Logística es una plataforma mexicana que conecta a empresas que necesitan mover mercancía con transportistas independientes, sin intermediarios.

- Sitio en línea: https://rutanexo-landing.vercel.app
- Autor: Francisco Espinoza Domínguez (Licenciatura en Innovación y Negocios, Universidad de la Libertad)
- Publicación: GitHub + Vercel (cada commit se despliega solo)

## Funciones

1. **Cotizador de flete** (`#cotizador`): el cliente elige ciudad de origen, destino y peso; la app calcula la distancia real por carretera con OSRM, elige el vehículo según el peso y muestra km × tarifa = costo estimado.
2. **Solicitud de demo** (`#solicitud`): el formulario guarda nombre, empresa, correo y ruta en una base de datos de Supabase a través de una función de Vercel.

## Qué hay en este repositorio

| Archivo | Para qué sirve |
|---|---|
| `index.html` | El sitio completo: landing page, cotizador de flete y formulario de solicitud de demo |
| `api/solicitud.js` | Función de Vercel que valida cada solicitud de demo y la guarda en Supabase |
| `supabase/solicitudes.sql` | Script para crear la tabla `solicitudes` en Supabase |
| `PROMPT_LOG.md` | Bitácora de prompts y decisiones del Assignment 2 |
| `CLAUDE.md` | Instrucciones del proyecto para el asistente de IA |

## Decisiones de diseño vs. sugerencias del IS

(IS = el sistema inteligente: el asistente de IA con el que construí el proyecto.) Cada entrada dice qué propuso el IS, qué decidí y por qué.

### 1. Tarjeta 3 de la landing: de texto genérico a un diferenciador real (mockup)

- **Qué propuso el IS:** una tarjeta llamada "Tecnología de punta", con un texto que podría ir en cualquier empresa.
- **Qué decidí:** rechazarla. Decía algo que cualquier competidor también diría y no explicaba por qué RutaNexo es distinta.
- **Qué hice:** la reescribí como "Sin intermediarios": la empresa conecta directo con el transportista, evita comisiones y paga solo por el flete real. Después ajusté el título a "Sin una persona en medio", más cercano a como habla el cliente. Cuando el IS me propuso cambiar también las otras 6 menciones de "sin intermediarios" del sitio, lo rechacé: solo quería cambiar el título de esa tarjeta.
- **Commits:** `fix: tarjeta 3 con diferenciador real` y `fix: tarjeta 3 con el título "Sin una persona en medio"`.

### 2. Cotizador: de dónde sale el precio y cuánto cobrar por km (funcionalidad)

- **Qué propuso el IS:** que una API no da el precio de un flete, solo la distancia, así que el precio tenía que ser km × una tarifa definida por mí. Cuando le pedí "la tarifa más baja del mercado", respondió que no existe una tarifa oficial y me dio rangos de sitios comerciales por vehículo (camioneta $14–30, rabón $20–55, torton $28–75, tráiler $36–48 por km), advirtiendo que el mínimo del tráiler queda debajo del costo de operar un tractocamión ($44–50/km).
- **Qué decidí:** revisar la propuesta. No usé la tarifa más baja, sino el **punto medio de cada rango** ($22, $37.50, $51.50 y $42/km), para ser competitivo sin quitarle ganancia al transportista. El peso elige el vehículo más pequeño que carga la mercancía.
- **Un error mío que corregí:** en mi caso de prueba usé $42 para el rabón; el IS señaló que $42 era el punto medio del tráiler. Corregí el cálculo a 1,455 km × $37.50 = $54,562.50.
- **Cómo lo validé:** Acapulco → Culiacán, 7 t. Mi referencia (Google Maps) era 1,455 km con una tolerancia de ±10 %. OSRM da 1,426 km, una diferencia de 2 %, dentro de lo que acepté. El ±10 % es mi tolerancia, no un error de la API, y por eso el sitio dice que es un **estimado** (no incluye casetas ni maniobras).
- **Commit:** `feat: cotizador de flete con distancia real (OSRM) y vehículo según peso`.

### 3. Escalabilidad: qué hacer con el servidor de rutas (escalabilidad)

- **Contexto (diagnóstico de la Sesión 22):** con 10 visitas al mes × 2 cotizaciones, ni a 1,000× (10,000 visitas, 20,000 cotizaciones) se rompe un límite de cantidad: usaría el 2 % de los requests de Vercel Hobby. El cuello de botella real es de arquitectura: Vercel Hobby y el servidor demo de OSRM solo permiten uso no comercial, y OSRM no garantiza estar disponible (*"Do not exceed 1 request per second… no guarantees wrt. uptime"*, verificado en su wiki).
- **Qué propuso el IS:** dos opciones: (a) migrar a OpenRouteService con una clave escondida en Vercel, o (b) mantener OSRM con un servidor de respaldo y un mensaje de error claro.
- **Qué decidí:** la opción (b), porque no requiere crear cuentas ni manejar claves nuevas y resuelve lo más urgente: que el cotizador no falle en silencio. Si el primer servidor no responde en 8 segundos, se intenta `routing.openstreetmap.de`; si ninguno responde, el cliente ve un mensaje claro y la invitación a enviar su solicitud.
- **Lo que verifiqué después:** el IS advirtió, y lo confirmé en la wiki de OSRM, que el respaldo es el mismo servidor de FOSSGIS con otra dirección. Ayuda si falla una dirección, pero no si cae el servidor completo, y sigue siendo de uso no comercial. Lo mantuve como mejora parcial y dejé la migración a un proveedor comercial como pendiente para cuando RutaNexo cobre.
- **Commit:** `feat: guardar solicitudes de demo y respaldo del servidor de rutas`.

### 4. Seguridad: dónde vive la clave de la base de datos (seguridad)

- **Qué propuso el IS:** para la segunda función había dos opciones: agendar la recolección generando un evento de calendario (sin base de datos), o guardar las solicitudes en Supabase.
- **Qué decidí:** guardar las solicitudes, porque es la que realmente le sirve al negocio: sin datos guardados no hay a quién contactar.
- **Decisiones de seguridad tomadas:** la clave secreta de Supabase vive solo en las variables de entorno de Vercel, nunca en el código del navegador ni en el repositorio; el navegador manda los datos a `/api/solicitud`, que vuelve a validar todo (longitudes, correo, ruta) aunque el formulario ya lo haya hecho; la tabla tiene RLS activado sin políticas, así que nadie puede leerla con la clave pública; y hay un campo trampa para bots.
- **Qué agregó el IS fuera de lo que pedí:** el campo de correo (sin él no se puede contactar a nadie), un aviso de privacidad y la trampa para bots. Los acepté porque protegen los datos personales que ahora guarda la app.
- **Commit:** `feat: guardar solicitudes de demo y respaldo del servidor de rutas`.

## Cómo se trabajó

Cada cambio se publica con un commit cuyo mensaje explica la decisión, con prefijos como `feat:`, `fix:` y `docs:`. Dos commits quedaron con mensajes genéricos:

- `Add files via upload`: el primer despliegue de la landing (Assignment 1), subido desde la web de GitHub con el mensaje por defecto.
- `Update PROMPT_LOG.md`: la especificación de 3 campos del cotizador (Assignment 2), escrita desde el editor web de GitHub.

## Pendientes

- Migrar el cálculo de distancias a un proveedor que permita uso comercial y garantice disponibilidad.
- Pasar a Vercel Pro ($20 USD/mes) antes de operar como negocio, porque el plan Hobby es solo para uso no comercial.
- Reemplazar el correo de contacto y los enlaces de redes sociales de ejemplo por los reales.
