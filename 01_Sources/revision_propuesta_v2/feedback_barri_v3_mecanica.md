# Feedback Barri sobre Propuesta V3 — Mecánica final + Comentarios anti-cheat

> Source type: client feedback (Google Docs comments + document authored by client)
> Date: ~Late March 2026
> Author: Marcelo "Barri" Ibáñez (client)
> Context: Annotations on V3.0 shared via Google Docs, plus client-authored "Mecánica del Torneo Soñao — MVP" document

---

## ANEXO A REVISAR (client annotations on V3.0):

### 1. AGREGAR SITIO DE MARCA SÍ O SÍ: SOÑAO.COM

### 2. AGREGAR PRUEBA DE CARGA 10K / 20K JUGADORES

### 3. AGREGAR SOPORTE EN VIVO DURANTE EL TORNEO

### 4. Comentarios anti-cheat

**Layer 1 — By design (client agrees, adds constraint):**
Orden distinto al interior de cada bloque, pero el orden de los bloques es el mismo. Por temas legales de igualdad de condiciones.

**Layer 2 — By data (client concern):**
A menos que podamos demostrar TÉCNICAMENTE que lo hizo un bot, no podríamos descartar a un jugador sin esa demostración técnica. ¿Es posible demostrar eso?

**Layer 3 — Videocall verification (client concern):**
Veo difícil legalmente quitarle un premio a alguien por este mecanismo, ya que puede alegar que se puso nervioso durante el llamado o cualquier otra excusa. Debo darle una vuelta con equipo legal.

**Scoring por oleadas — RECHAZADO por cliente:**
> ESTO NO. Si bien cumple la función de dificultar enormemente la colusión de respuestas, genera estos problemas:
> - El ritmo de juego es mucho más rápido, obligándonos a tener muchas más preguntas en el banco. Necesitamos esos segundos o microsegundos, de ver cuál es la correcta y el puntaje.
> - Frustración: El usuario puede sentir que el juego es injusto si no entiende por qué sacó X puntaje.
> - Menor retención emocional: Se pierde el momento de "¡SÍ!" tras una pregunta difícil.
> - Curva de aprendizaje nula: No hay feedback.

**Bloques temáticos — Aprobado:**
> Es una idea hermosa. ¿Esto impacta la cantidad de trabajo de diseño visual?

---

## Mecánica del Torneo Soñao — MVP (client-authored document)

### Descripción general
El torneo dura 45 minutos en formato de ritmo propio (self-paced). El tiempo máximo para responder una pregunta es de 30 segundos. Cada jugador tiene su propio flujo independiente de tiempo. El servidor registra únicamente cuatro variables por respuesta: cuándo respondió, si fue correcta o incorrecta, y cuánto tiempo tardó. No hay sincronización en tiempo real entre jugadores, lo que hace la arquitectura simple y robusta.

### Funcionamiento
Todos los participantes empiezan al mismo tiempo. Cada jugador avanza a su propio ritmo. El que responde más rápido y correctamente llega a más preguntas en el tiempo disponible. Al terminar los 45 minutos, el sistema congela el estado de todos los jugadores y calcula el ranking final. El ganador es quien más sabe y más rápido responde.
Si un jugador no responde dentro de 30 segundos, la pregunta avanza automáticamente como incorrecta. Esto limita el banco de preguntas necesario sin romper el modelo y agrega tensión visual mediante un contador regresivo.

### Estructura de preguntas
Las preguntas se dividen en cuatro categorías: tres niveles de dificultad (fácil, media y difícil) y pregunta social (preguntas de opinión sin respuesta correcta predefinida).
Se usa una estructura en bloques de cinco preguntas, cada uno compuesto por dos fáciles, una media, una difícil y una media (F, F, M, D, M). El orden interno de cada bloque se aleatoriza en cada repetición, con una única restricción: nunca pueden quedar dos preguntas de dificultad media consecutivas en la unión entre bloques. Cada dos bloques se intercala una pregunta social, lo que significa que aparece aproximadamente cada diez preguntas a lo largo del torneo.

### Preguntas sociales
Las preguntas sociales son preguntas de opinión sin respuesta correcta predefinida — por ejemplo, "¿cuál es el mejor álbum de Metallica?" o "¿Master of Puppets o The Black Album?". Pueden tener dos formatos: texto libre, donde el jugador escribe su respuesta, u opciones predefinidas, donde el jugador elige entre alternativas fijas. En ambos casos, la respuesta correcta no existe de antemano — la determina la mayoría de los participantes al finalizar el torneo.

Para las preguntas de texto libre, el sistema envía todas las respuestas a un modelo de lenguaje vía API — por ejemplo Claude o GPT-4 — con instrucciones de agrupar respuestas por significado equivalente, resolviendo variantes de escritura, idioma y sinónimos. Para las preguntas de opciones predefinidas, el sistema calcula directamente la opción más elegida por conteo simple. En ambos casos el grupo o opción más numerosa determina la respuesta mayoritaria, y quienes la eligieron suman los puntos correspondientes. Este proceso ocurre una sola vez al cerrar el torneo, no en tiempo real, con un costo estimado de $0.10 a $0.50 USD por torneo independiente del número de participantes. El resultado se revela junto con el ranking final, lo que agrega una capa adicional de tensión en el momento del cierre.

### Experiencia de usuario en preguntas sociales
Las preguntas sociales requieren un tratamiento visual y comunicacional diferenciado para evitar conflicto cognitivo. A diferencia de las preguntas de conocimiento, no entregan feedback inmediato de correcto o incorrecto — la respuesta correcta se determina al finalizar el torneo.

1. Diseño visual diferenciado: la pregunta social tiene una apariencia distinta al resto — color, ícono y etiqueta propios que la identifican claramente antes de que el jugador la lea.
2. Etiqueta personalizada por comunidad: en vez de una etiqueta genérica, cada torneo usa el nombre propio de su comunidad. Para el torneo de Metallica la etiqueta es "¿Qué decide la familia Metallica?". Para un torneo de Taylor Swift sería "¿Qué deciden las Swifties?".
3. Micro-copy explicativo: debajo del enunciado aparece una línea corta que dice "La comunidad decide la respuesta correcta al final del torneo".
4. Acuse de recibo de respuesta: al responder, el sistema muestra inmediatamente "Tu respuesta fue registrada. Sabrás qué decidió la familia Metallica al final del torneo."

Requerimiento técnico: implementar un componente visual diferenciado para preguntas sociales con estados propios — pantalla de pregunta, acuse de recibo y revelación final — independientes del flujo estándar de correcto/incorrecto. La etiqueta de comunidad es un parámetro configurable por torneo.

### Scoring graduado
En vez del modelo binario (correcto/incorrecto), cada alternativa tiene un puntaje asignado según su dificultad. Esto agrega profundidad estratégica, premia conocimiento parcial y hace los empates extremadamente raros.

- Fáciles: 25 puntos
- Media: 50 puntos
- Difíciles: 100 puntos
- Sociales: 150 puntos

### Bonus de tiempo
Los segundos restantes al responder se convierten en puntos bonus, pero solo cuando la respuesta es correcta (cada segundo que sobró es un punto: Ejemplo: si respondí en 10 segundos, obtengo +20).

### Penalización por error
Solo para desempate.

### Cascada de desempate
1. Gana quien tuvo mayor número de aciertos; si persiste el empate
2. Gana quien acumuló menor tiempo total en sus respuestas correctas; si persiste
3. Gana quien tuvo mayor porcentaje de aciertos en preguntas difíciles; si persiste
4. Gana quien tuvo mayor porcentaje de aciertos en preguntas de dificultad media; si persiste
5. Gana quien tuvo mayor porcentaje de aciertos en preguntas fáciles; si persiste
6. Gana quien tuvo menos errores.
7. Si después de aplicar todos los criterios anteriores el empate persiste, los jugadores empatados disputarán un torneo de desempate en formato de eliminación directa, al estilo HQ Trivia, donde una respuesta incorrecta significa quedar fuera.
(*) Todos estos criterios son informados con anticipación, por lo que el jugador puede tomar decisiones estratégicas conociendo las reglas completas.

### Resumen de parámetros confirmados

| Parámetro | Valor |
|---|---|
| Duración del torneo | 45 minutos |
| Tiempo máximo por pregunta | 30 segundos |
| Banco de preguntas mínimo | 700 preguntas |
| Patrón de bloques | F-F-M-D-M + las Sociales intercaladas cada dos bloques |
| Distribución de dificultad | 40% fáciles / 30% medias / 20% difíciles / 10% sociales |
| Penalización por error | Solo para desempate |

### Pantalla del jugador

| Elemento | Descripción |
|---|---|
| Pregunta + opciones | Centro de pantalla |
| Mis puntos acumulados | Actualización inmediata tras cada respuesta |
| Indicador correcto / incorrecto | Inmediato tras cada respuesta |
| Barra de progreso 45 min | Avanza continuamente |
| Contador regresivo 30 seg | Reinicia con cada pregunta |

### Banco de preguntas
702 preguntas mínimo (30% sobre el máximo que un jugador rápido puede responder en 45 minutos, asumiendo 5 segundos promedio por pregunta). Distribución: 40% fáciles + 211 medias + 140 difíciles + 70 sociales (281 + 211 + 140 + 70 = 702).

### Requerimiento técnico: preguntas sociales
Integrar una llamada a API de modelo de lenguaje (Claude o GPT-4) al cierre de cada torneo para normalización y agrupación semántica de respuestas sociales en formato texto libre. Las preguntas de opción predefinida no requieren este procesamiento. Tiempo de desarrollo estimado: 1-2 días incluyendo pruebas. Costo operativo: menos de $1 USD por torneo.
