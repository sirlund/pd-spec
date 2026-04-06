# UX: Bloques temáticos + Scoring por oleadas + Anti-cheat

> Generado: 2026-03-19. Para iterar con Barri en próxima sesión.

## Concepto

El torneo no se siente como "responder 440 preguntas" sino como "recorrer mundos dentro del universo de la temática". Cada bloque (5 preguntas F-F-M-D-M) tiene un tema propio, y el puntaje se revela por bloque, no por pregunta.

## Scoring por oleadas

- El jugador NO ve feedback correcto/incorrecto por pregunta
- Cada 5 preguntas (1 bloque) se muestra el puntaje acumulado del bloque
- El detalle pregunta por pregunta se revela al final del torneo → más drama
- Pregunta social cada 2 bloques como respiro

### Beneficio anti-cheat
- Scout no puede comunicar cuál respuesta es correcta (solo sabe total del bloque)
- Hace la colaboración entre cuentas prácticamente inútil
- Si se combina con orden aleatorio por usuario, la protección es doble

### Beneficio UX
- Mini picos de tensión cada 5 preguntas
- El jugador siente progreso sin spoilearse
- Más justo: nadie ajusta estrategia con ventaja en tiempo real

## Bloques temáticos (ejemplo Metallica)

- Bloque 1: "La Era Garage" (Kill 'Em All, Ride the Lightning)
- Bloque 2: "Los Clásicos" (Master of Puppets, ...And Justice for All)
- Bloque 3: "El Álbum Negro"
- Bloque 4: "La Controversia" (Load, ReLoad, St. Anger)
- Bloque 5: "La Nueva Era" (Death Magnetic en adelante)
- Bloque 6: "Live & Legacy" (conciertos, premios, cultura fan)

## Mensajes UI (narrador)

| Momento | Ejemplo de mensaje |
|---|---|
| Inicio de bloque | "Entramos a La Era Garage. ¿Qué tanto sabes de los inicios?" |
| Mitad de bloque | "Vas bien, quedan 3 preguntas de este bloque" |
| Fin de bloque + reveal puntos | "Bloque completado. +23 puntos" |
| Si va bien | "La familia Metallica estaría orgullosa" |
| Si va regular | "Vamos, concentrate, tú sabes de esto" |
| Transición | "Prepárate. Entramos a Los Clásicos..." |
| Pregunta social | "Momento de la familia. ¿Qué decide la comunidad?" |

## Impacto en desarrollo

- Bloques temáticos + mensajes: 0h extra (es contenido y copy, no código — el motor ya soporta bloques)
- Scoring por oleadas en vez de por pregunta: ~1-2h (simplifica la UI, no la complica)
- Orden aleatorio por usuario: +3h (recomendado como capa anti-cheat adicional)

---

## Análisis de amenazas: las verdades incómodas

### Verdad 1: No se puede prevenir el uso de AI en un browser
Cualquiera con un teléfono al lado puede: screenshot → GPT-4 Vision → respuesta correcta en 3-5 segundos. No importa si se renderiza como canvas, imagen o texto. Apuntar la cámara del teléfono a la pantalla pasa por encima de cualquier protección client-side. Incluso con preguntas de audio, existen pipelines de transcripción automática.

### Verdad 2: No se puede prevenir la colaboración presencial
5 amigos en un living. Uno juega, los otros 4 googlean en paralelo. Comportamiento 100% humano, indetectable por software. No existe defensa técnica contra esto sin proctoring con webcam, lo cual mata la experiencia.

### Verdad 3: El bonus de tiempo premia al cheater
Con AI: respuesta correcta en 3 segundos = +5 base + 27 bonus = 32 puntos. Un humano honesto que se toma 15 segundos = +5 base + 15 bonus = 20 puntos. El cheater gana 60% más puntos por pregunta. El bonus de tiempo amplifica la ventaja de quien hace trampa.

### Verdad 4: El exploit "scout + champion" es devastador
Si el feedback es inmediato (correcto/incorrecto por pregunta), dos cuentas pueden colaborar:
- Cuenta A (scout) responde primero y ve el feedback
- Le comunica a cuenta B (champion) cuál es la correcta
- B responde con certeza y rápido
- Funciona porque: mismas preguntas en mismo orden + feedback inmediato + self-paced

**El scoring por oleadas (ver arriba) neutraliza este exploit** al no revelar qué respuesta fue correcta.

## Vectores de ataque detallados

### Con AI (el más peligroso)
- Extensión de browser que lee pregunta del DOM → la manda a LLM → responde en ~3-5s
- Sin extensión: screenshot → pegar en ChatGPT → respuesta en 5 segundos (dentro de los 30s)
- Con audio: transcribir → buscar → responder. Más lento pero viable
- **Defensa principal**: mix de tipos de pregunta + verificación del ganador

### Colaborativo
- Grupo de amigos googlea en paralelo mientras uno juega
- Compartir pantalla por Discord/Zoom con un experto
- **Defensa principal**: no hay defensa técnica pura. La verificación del ganador y preguntas hiperlocales son la mejor barrera.

### Cuentas múltiples
- Comprar tickets con distintos RUT/emails, jugar los 3, quedarse con el mejor
- Un "ringer" juega con la cuenta de otro
- **Defensa principal**: 1 cuenta por RUT + device fingerprint + verificación de identidad del ganador

### Técnico
- Inspeccionar network tab para ver respuestas correctas en el payload
- Modificar timestamps del cliente para simular respuestas más rápidas
- Bot automatizado que juega sin browser
- **Defensa principal**: server-authoritative (nunca enviar respuestas, timestamps server-side, rechazar respuestas < 2 segundos)

### Fuga de preguntas
- Alguien con acceso a la base de datos extrae todas las preguntas y respuestas antes del torneo
- **Defensa principal**: acceso restringido a la DB, cargar preguntas lo más cerca posible del torneo

## Resistencia a AI por tipo de pregunta

| Tipo de pregunta | Resistencia a AI | Ejemplo |
|---|---|---|
| Texto puro | Baja — GPT responde en 2s | "¿Quién es el baterista de Metallica?" |
| Imagen de concierto/evento | Media — Vision models pueden pero necesitan más tooling | "¿En qué ciudad fue este concierto?" |
| Audio (clip de canción) | Alta — requiere pipeline de audio + transcripción | "¿Qué canción es esta?" |
| Hiperlocal / nicho comunitario | Alta — no está en Google ni en GPT | "¿Cómo le dicen los fans chilenos a Enter Sandman?" |
| Visual con modificación | Alta — requiere conocimiento + atención visual | "¿Qué está mal en esta portada de álbum?" |
| Social (comunidad decide) | Inmune — no hay respuesta pre-computable | "¿Cuál es el mejor álbum de Metallica?" |

**Recomendación**: si el 40% de las preguntas son de resistencia media-alta, el cheater pierde ventaja significativa. Esto es trabajo de contenido (Barri), no de desarrollo.

## Verificación del ganador: la defensa más efectiva

Antes de entregar el premio: videollamada donde se le pide al ganador que responda de memoria 5 preguntas random del torneo que supuestamente respondió bien. Si usó AI o bot, no se las va a saber.

**Por qué funciona:**
- Un cheater puede automatizar las respuestas, pero no puede memorizar 440 preguntas que nunca leyó realmente
- Cuesta $0 de desarrollo — es un proceso manual de 10 minutos
- Se anuncia en los T&C antes de la compra del ticket
- El efecto disuasivo es enorme: "si gano haciendo trampa, me van a pillar"
- Probablemente previene el 90% de los intentos solo por el hecho de existir

**Implementación**: agregar en T&C: "Los ganadores deberán verificar su identidad y conocimiento en una breve videollamada antes de recibir el premio. El organizador se reserva el derecho de descalificar a participantes que no superen esta verificación."

---

## Anti-cheat Stack completo (resumen)

| # | Medida | Horas | Tipo |
|---|---|---|---|
| 1 | Verificación del ganador (videollamada) | 0h | Proceso |
| 2 | T&C: derecho a descalificar + verificación anunciada | 0h | Legal |
| 3 | Server-authoritative (respuestas nunca en el cliente) | 0h (ya en motor) | Arquitectura |
| 4 | 1 cuenta por RUT | 0h (ya en registro) | Arquitectura |
| 5 | Scoring por oleadas (no feedback por pregunta) | 0h (simplifica) | Diseño |
| 6 | Orden aleatorio por usuario | +3h | Dev |
| 7 | Auditoría estadística top 10 | +3h | Dev |
| 8 | Device fingerprint básico | +1h | Dev |
| 9 | Mix de tipos de pregunta (texto, imagen, audio, hiperlocal) | 0h | Contenido (Barri) |
| | **Total extra sobre las 60h** | **+7h** | |

## Qué NO hacer para MVP (y por qué)

| Defensa | Por qué no vale la pena |
|---|---|
| Renderizar preguntas como canvas anti-OCR | GPT-4V lee screenshots sin problema. Apuntar el teléfono a la pantalla pasa por encima de cualquier protección de DOM. Esfuerzo alto, efectividad casi nula. |
| Detectar DevTools abierto | Se pasa por encima con extensiones de Chrome que no usan DevTools. Un cheater mínimamente técnico no necesita DevTools. |
| Behavioral biometrics (patrones de mouse/touch) | Complejidad de desarrollo enorme. Los cheaters sofisticados pueden imitar patrones humanos fácilmente con scripts que agregan varianza artificial. Muchos falsos positivos con usuarios legítimos. |
| Disable copy-paste de texto | Basta con apuntar el teléfono a la pantalla y dictar la pregunta. No previene nada, solo molesta al usuario legítimo. |
| Anti-bot / headless browser detection | Los bots modernos (Playwright, Puppeteer con stealth plugins) son prácticamente indetectables. Carrera armamentista que no se puede ganar en un MVP. |
| Proctoring con webcam | Mata completamente la experiencia de juego. Nadie quiere prender la cámara para jugar una trivia. Apropiado para exámenes universitarios, no para entretenimiento. |
| DRM / screen capture prevention | No funciona en web estándar. Requiere tecnologías propietarias (Widevine, etc.) que no aplican a este contexto. |
| CAPTCHA durante el juego | Rompe el flow completamente. Imaginar: estás en racha, pregunta 15, aparece "selecciona los semáforos". Inaceptable para la experiencia. |
| Tiempo mínimo forzado por pregunta | Penaliza al jugador legítimo que sabe la respuesta rápido. Si alguien es fan hardcore de Metallica y responde en 4 segundos porque genuinamente lo sabe, no debería ser castigado. Mejor detectar estadísticamente post-hoc que bloquear en tiempo real. |

## Conclusión

El torneo no va a ser inhackeable — eso es imposible en web. La estrategia correcta es hacer que para ganar haciendo trampa se necesite: (a) superar las barreras técnicas (server-authoritative, orden aleatorio, sin feedback inmediato), (b) tener suerte con las preguntas que resisten AI (imagen, audio, hiperlocal), y (c) pasar una verificación en vivo (videollamada). La combinación de las tres capas hace que el esfuerzo de hacer trampa no justifique el riesgo de ser descalificado.
