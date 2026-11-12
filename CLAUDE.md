# RutaNexo – instrucciones para el asistente de IA

Antes de ayudar con cualquier tarea del curso, lee `guia_AAT.md` (guía del curso Applied Algorithmic Thinking). Manda sobre cómo ayudar: las decisiones, los veredictos y la bitácora son del estudiante.

## El proyecto
- **RutaNexo Logística**: plataforma mexicana que conecta a empresas que necesitan mover mercancía con transportistas independientes verificados, sin intermediarios.
- Autor: Francisco Espinoza Domínguez.
- Deploy: https://rutanexo-landing.vercel.app (Vercel despliega solo cada push a `main`).

## Stack
- Un solo `index.html` con HTML, CSS y JavaScript, sin frameworks ni build.
- Tipografía Inter desde Google Fonts. Paleta en las variables CSS de `:root` (`--azul-*`, `--naranja`, etc.): úsalas, no inventes colores.

## Reglas de trabajo
- Cambia solo lo necesario: no regeneres el archivo completo ni toques secciones que no se pidieron.
- Si una propuesta se sale de la especificación del estudiante (otra fuente de datos, funciones extra, otro criterio de éxito), avísale antes de hacerla para que decida y lo registre.
- Ninguna API key ni contraseña va en el código del navegador ni en el chat: van en variables de entorno de Vercel.
- `PROMPT_LOG.md` es la bitácora del estudiante: no escribas en ella entradas, decisiones ni outputs que él no haya vivido.
- Mensajes de commit que expliquen la decisión, no solo "update" o "fix".
