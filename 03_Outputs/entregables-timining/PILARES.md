# Pilares Fundamentales de Diseño — TIMining CORE

> Documento de trabajo. Versión en desarrollo para revisión martes 18 feb.
> Fuentes: Estrategia Maestra v3.4, PD-Spec Insights Graph (54 fuentes), Workshop 01.

---

## Criterios de naming

Patrón establecido por **Quiet UI** (el único nombre aprobado):
- 2 palabras en inglés
- Evocativo, no corporativo
- Tensión o contradicción implícita
- Memorable y vendible

---

## Pilar 1: Quiet UI

**Gestión por excepción.**

La interfaz permanece en silencio mientras la operación está en equilibrio. El color, el sonido y la notificación son recursos escasos reservados para la anomalía. Un turno sin alertas es un turno exitoso — y la pantalla debe reflejarlo.

En la práctica, esto invierte la lógica de los dashboards actuales: en vez de mostrar todo y esperar que el operador encuentre lo relevante, el sistema filtra el 95% del ruido y solo escala lo que requiere intervención humana. El operador no monitorea — el sistema monitorea por él.

**Evidencia:**
- [IG-SYNTH-07] Gestión por Excepción — 8/54 fuentes. Operadores piden explícitamente que el sistema filtre ruido y solo muestre lo que requiere su atención.
- [IG-SYNTH-03] Sobrecarga Cognitiva — 11/54 fuentes. "Llenarlos de números sin sentido" es el dolor #1 del workshop. Múltiples operadores describen la experiencia actual como "data dumping".
- [IG-SYNTH-15] Experiencia de Uso Actual Deficiente — 9/54 fuentes. Las interfaces actuales de Aware generan rechazo activo entre usuarios operativos.

**Benchmark:** CrowdStrike (Achromatic Design — consola intencionalmente "aburrida", escala de grises, color solo para amenazas activas), Motive (filtra 99% de alertas falsas con Edge AI).

**Status:** APROBADO

---

## Pilar 2: Clear Path

**Cada pantalla termina en una acción.**

Un gráfico que no prescribe una decisión es ruido visual. Clear Path transforma la plataforma de un "kiosco de datos" a un médico operacional: detecta el problema, analiza el contexto, y recomienda la acción — en ese orden. El patrón D→A→R (Detección → Análisis → Recomendación) estructura toda interacción del sistema.

"Path" porque el sistema no te deja perdido en un laberinto de datos — te muestra el camino desde el problema hasta la acción. En una operación minera donde cada minuto de indecisión cuesta tonelaje, el camino claro es el camino rentable. No hay gráfico sin recomendación, no hay alerta sin siguiente paso.

**Evidencia:**
- [IG-SYNTH-06] Patrón D→A→R — **25/54 fuentes**, la mayor convergencia del proyecto. Aparece en workshops, entrevistas con operadores, antecedentes técnicos y documentos de visión futura. Es el patrón más transversal.
- [IG-SYNTH-05] Valor = "mover piedras" — 10/54 fuentes. El software solo tiene valor si produce acción concreta en la operación. Cada minuto mirando un dashboard sin actuar es un minuto perdido.
- [IG-SYNTH-02] "Auto de Homero Simpson" — 9/54 fuentes. El riesgo de construir funcionalidad que el usuario no pidió ni necesita. Clear Path obliga a justificar cada elemento de UI con una acción asociada.

**Benchmark:** SentinelOne Purple AI (triaje automático de alertas → recomendación de acción a velocidad de máquina), Vercel v0 (Generative UI — la intención se convierte en interfaz ejecutable), Datadog Bits AI (recomendaciones proactivas de corrección).

**Status:** PROPUESTO

---

## Pilar 3: Time Sight

**Pasado, presente y futuro en una sola mirada.**

La operación minera no vive en el presente. Una falla de hoy tiene raíces en decisiones de ayer y consecuencias que impactan la semana que viene. Time Sight es la capacidad del sistema de navegar fluidamente entre tres horizontes temporales: reconstruir qué pasó y por qué (Hindsight), mostrar el estado real del sistema ahora (Insight), y proyectar qué va a pasar si no se actúa (Foresight).

"Sight" contiene literalmente los tres conceptos: hind**sight**, in**sight**, fore**sight**. El nombre dice exactamente lo que es — visión a través del tiempo. La misma interfaz, la misma pantalla, tres profundidades temporales. El operador no cambia de aplicación para entender causalidad; ajusta el horizonte de su mirada.

**Evidencia:**
- [IG-SYNTH-08] Necesidad de Foresight — 6/54 fuentes. Operadores quieren un "abanico de escenarios posibles" para tomar decisiones con menor incertidumbre.
- [IG-SYNTH-11] "Qué pasó, por qué, qué hacer" — 7/54 fuentes. La causalidad (no solo la correlación) es una necesidad central. Los operadores necesitan entender la cadena de eventos, no solo ver el resultado.
- El patrón temporal aparece en 3 de los 4 dominios operativos: Crisis (¿por qué cayó la pala? ¿qué impacto tendrá?), Continuidad (¿va a bloquearse el chancador en 45 min?), Visión Estratégica (cierre mensual, proyecciones de recuperación).

**Benchmark:** Tesla Fleet (Time Scrubbing — rebobinar incidentes para entender causalidad física exacta), SentinelOne Storylines (reconstrucción forense narrativa de un incidente de seguridad), Chronosphere (políticas de retención temporal ajustables durante incidentes).

**Status:** PROPUESTO

---

## Pilar 4: Omni Sense

**El sistema percibe, comprende y responde — por el canal correcto.**

La experiencia multimodal de TIMining CORE no es "tener una app en cada plataforma". Es un sistema con múltiples sentidos: ve a través de cámaras y sensores, escucha a través de la radio, habla a través de WhatsApp y alertas, y comprende el contexto para elegir cómo comunicarse contigo. Omni Sense fusiona la presencia en múltiples canales (Radio, WhatsApp, Mobile, IROC) con la inteligencia agéntica para elegir el canal correcto en el momento correcto.

"Sense" tiene triple lectura: los sentidos del sistema (ve, escucha, habla), su capacidad de percibir contexto (sensing — sabe dónde estás, qué necesitas, cuándo interrumpirte), y "hacer sentido" de la operación a través de todos los canales simultáneamente. Un briefing antes de la reunión llega por WhatsApp porque estás caminando al turno. Una alerta crítica llega por radio porque estás en terreno. Un análisis detallado aparece en IROC porque estás en la sala de control. El canal no es accesorio — el canal ES la inteligencia.

**Evidencia:**
- [IG-SYNTH-04] Dashboard → Copiloto — 12/54 fuentes. La evolución de "ir a buscar datos" a "el sistema te busca a ti" es uno de los insights más fuertes del proyecto.
- [IG-SYNTH-19] 4 Lentes Multimodal (Radio/WhatsApp/Mobile/IROC) — 7/54 fuentes. Aspiracional pero directamente alineado con la visión estratégica de TIMining.
- [IG-SYNTH-06] El patrón D→A→R se expresa a través de los canales: la detección puede llegar por radio, el análisis desplegarse en mobile, la recomendación confirmarse por voz.
- Caso Sofía (Dominio 3, Asistencia Agéntica): el sistema envía un briefing por WhatsApp 15 minutos antes de la reunión de coordinación. No espera que Sofía abra el dashboard — la alcanza donde está.

**Contexto estratégico:** TIMining define su identidad como plataforma multimodal. IDEMax está contratado para diseñar esa experiencia. Este pilar es el corazón del encargo.

**Benchmark:** Motive (asistente de voz "Hey Motive" + cámaras + telemática integrada — múltiples sentidos en una plataforma), Discord (canales de voz siempre activos — Push-to-Talk como referente para triage de radio), Samsara Connected Workflows (dashboard holístico que integra múltiples fuentes sensoriales en flujos automatizados).

**Status:** PROPUESTO

---

## Resumen

| # | Nombre | Concepto core | Evidencia principal | Status |
|---|---|---|---|---|
| 1 | **Quiet UI** | Gestión por excepción — silencio como default | IG-SYNTH-07 (8/54), IG-SYNTH-03 (11/54) | APROBADO |
| 2 | **Clear Path** | D→A→R — cada pantalla termina en una acción | IG-SYNTH-06 (25/54), IG-SYNTH-05 (10/54) | PROPUESTO |
| 3 | **Time Sight** | Hindsight/Insight/Foresight — navegación temporal | IG-SYNTH-08 (6/54), IG-SYNTH-11 (7/54) | PROPUESTO |
| 4 | **Omni Sense** | Multimodal agéntica — percibe, comprende, responde | IG-SYNTH-04 (12/54), IG-SYNTH-19 (7/54) | PROPUESTO |

---

## Relaciones entre pilares

Los pilares no operan aislados. Cada uno refuerza a los demás:

- **Quiet UI + Clear Path:** El silencio se rompe solo cuando hay un Clear Path — una acción concreta que tomar. Sin Clear Path, Quiet UI sería solo una pantalla vacía.
- **Clear Path + Time Sight:** La recomendación (Clear Path) se fundamenta en el análisis temporal (Time Sight). "Mueve la flota al punto B" solo tiene sentido si el sistema muestra por qué (hindsight) y qué pasa si no lo haces (foresight).
- **Time Sight + Omni Sense:** El horizonte temporal determina el canal. Una alerta inmediata (insight) va por radio. Un resumen de turno (hindsight) va por WhatsApp. Una proyección semanal (foresight) va al dashboard IROC.
- **Omni Sense + Quiet UI:** El canal correcto es parte del silencio. No mandar una alerta por WhatsApp cuando debería ir por radio ES gestión por excepción aplicada al canal. Omni Sense sin Quiet UI sería spam multicanal.

---

## Sistema sensorial

Los cuatro pilares forman un sistema coherente con una lógica sensorial:

| Pilar | Sentido | Pregunta que responde |
|---|---|---|
| **Quiet UI** | Oído — el silencio y el ruido | ¿Necesito prestar atención? |
| **Clear Path** | Vista — claridad y dirección | ¿Qué debo hacer? |
| **Time Sight** | Profundidad — perspectiva temporal | ¿Por qué pasó y qué viene? |
| **Omni Sense** | Tacto — presencia y canal | ¿Dónde y cómo me llega? |

---

## Notas adicionales

- Benchmark debe organizarse por pilares (no por industria). 2-3 referentes "campeones" por pilar, resto a anexos.
- La fuente Impact puede ser muy pesada para la presentación — explorar alternativas.
- Una sola presentación con secciones modulares.
