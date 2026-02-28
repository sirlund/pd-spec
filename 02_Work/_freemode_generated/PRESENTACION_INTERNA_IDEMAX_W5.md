# Presentación Interna IDEMAX — Semana 5
> Audiencia: Ale, Cami, Nico
> Objetivo: Alinear al equipo sobre decisiones post-Touchpoint 1 antes de armar la v2 para TIMining
> Fecha: 2026-02-27

---

## Slide 1 — Contexto: Qué pasó esta semana

**Desde el Touchpoint 1 (19-feb) hicimos:**

1. Sesión interna IDEMAX (24-feb) — destilar feedback de Carlos y Philip
2. 4 entrevistas usuarios/clientes (canvas) — Felipe Reyes, Juan Pablo Palma, Cristián Rozas, Joaquín (interno TIMining)
3. Análisis cruzado con Gemini como fuente complementaria
4. Iteración del framework: 3 decisiones estructurales + 1 capa nueva

**Resultado:** MATRIZ Dominios × Pilares v1.2 — el documento que guía la v2 de la presentación a TIMining.

**Lo que aprendimos de las entrevistas:** Los operadores validan los problemas que detectamos (confianza en datos, costos, adopción difícil) pero NO van a levantar la mirada estratégica del CEO/CTO. La matriz está cerrada desde arriba — las entrevistas la llenan desde abajo.

---

## Slide 2 — Decisión #1: Alineación Estratégica es envolvente

**El problema:** ¿Los 4 dominios son pares?

**Lo que dijo Carlos:** "De esos cuatro, ese último [Alineación Estratégica] está por encima de los demás."

**Lo que confirmó Felipe Reyes [IG-25]:** Sin que le dijéramos los dominios, los validó y enfatizó: "todo se puede transferir y hablar el lenguaje de dinero."

**Lo que agregaron las entrevistas [IG-27]:** La demanda de "ver plata, no toneladas" no viene solo de ejecutivos — Felipe y Juan Pablo la piden desde operaciones. AE se confirma bottom-up.

**Resolución:**

```
┌─────────────────────────────────────────────┐
│      ALINEACIÓN ESTRATÉGICA (envolvente)    │
│      "Todo se traduce a valor de negocio"   │
│                                             │
│  ┌───────────┐ ┌──────────┐ ┌───────────┐  │
│  │ A: Crisis  │ │B: Antici-│ │C: Asisten-│  │
│  │  Quiet UI  │ │  pación  │ │   cia     │  │
│  │   líder    │ │Time Sight│ │Omni Sense │  │
│  │            │ │  líder   │ │  líder    │  │
│  └───────────┘ └──────────┘ └───────────┘  │
│                                             │
│  Pilar transversal prioritario: Omni Sense  │
├─────────────────────────────────────────────┤
│  CONFIANZA EN DATOS (prerrequisito) [IG-28] │
│  Si el dato no cuadra → vuelven a radio/Excel│
└─────────────────────────────────────────────┘
```

- AE = el *para qué* (todo se traduce a valor de negocio)
- Omni Sense = el *por dónde* (si no estás en WhatsApp, no existes)
- Confianza = el *piso* (si falla, nada funciona)

---

## Slide 3 — La Matriz de Intensidad

No es 4×4. Cada dominio tiene pilares líderes y secundarios [IG-24].

|  | Quiet UI | Clear Path | Time Sight | Omni Sense |
|---|:---:|:---:|:---:|:---:|
| **A · Crisis** | ●●● | ●●● | ●●● | ●● |
| **B · Anticipación** | ●○ | ●● | ●●● | ●○ |
| **C · Asistencia** | ●○ | ●● | ●○ | ●●● |

**AE (envolvente):** Time Sight ●●● + Omni Sense ●●●

**Lectura rápida:**
- Crisis es el dominio showcase (3 pilares fuertes, el único donde todo opera a máxima intensidad)
- Quiet UI × Asistencia es la celda más vacía — confirma la asimetría
- Omni Sense es líder o co-líder en 2 de 4 dominios

---

## Slide 4 — Lectura por Pilar

**Quiet UI** — pico en Crisis, valle en Asistencia. Máxima expresión: consola acromática que solo ilumina la anomalía. Mínima: en Asistencia el usuario busca activamente al sistema, no necesita "silencio."

**Clear Path** — transversal pero nunca lidera solo. Siempre presente en la etapa R (Recomendación) del D→A→R. Su valor es sistémico: sin Clear Path, los otros tres son datos sin prescripción.

**Time Sight** — el pilar más consistente. Presente con fuerza en 3 de 4 dominios. Solo se debilita en Asistencia.

**Omni Sense** — líder emergente post-Touchpoint. Carlos: "lo que más usan en la mina es WhatsApp." Canal ≠ complemento — el medio es parte de la inteligencia.

---

## Slide 5 — Decisión #2: "Cumplir el Plan" → Mejoramiento Continuo

**Lo que dijo Carlos:**
> "Muchas veces el plan minero sí lo cumplen, no es que estén desviados. Lo que queremos es que tenga un mejor plan minero — una planificación permanente."

**Resolución — dos niveles de valor:**

| Nivel | Casos | Narrativa |
|---|---|---|
| **Mejoramiento continuo** | 1-6 | Decisión correcta, turno a turno — no para "cumplir" ciegamente, sino para mejorar continuamente |
| **Reconfiguración estratégica** | 7-8 | Detectar cuándo el plan subyacente es incorrecto y ajustarlo antes de que el costo sea irrecuperable |

**Impacto:**
- Dominio D cambia de "¿Cómo vamos contra plan?" a "¿Cómo mejoramos el plan?"
- Afecta directamente las narrativas de casos #6, #7, #8 en la presentación v2

---

## Slide 6 — Decisión #3: "Paz Mental" → "Tiempo Cero"

**Carlos (Touchpoint):**
> "Paz mental, más bien, es este un mundo... sin tiempo para avanzar."

**Philip:**
> "Yo no le puedo ir a hacer un inception de paz mental a un usuario final."

**Nico (sesión interna):**
> "Acuérdense que paz mental está como invalidado por Philip y por Carlos."

**Resolución: Tiempo Cero** — el tiempo entre dato y decisión debe ser cero.

| "Paz mental" (abstracto) | "Tiempo Cero" (accionable) |
|---|---|
| Tranquilidad operativa | Dato → decisión sin demora |
| Certeza | "No tengo tiempo para pensar" |
| Confianza | El sistema ya pensó por ti |

> *El sistema comprime el camino de dato a acción: detecta, analiza y recomienda antes de que el operador levante la radio.*

**Pendiente:** Propagar "Tiempo Cero" a STRATEGIC_VISION.md (actualmente dice "Reducción de Carga Cognitiva"). Actualizar slides 05 y 12 de la presentación v2.

---

## Slide 7 — Capa nueva: Confianza en Datos [IG-28]

**De las entrevistas salió un prerrequisito que no teníamos:**

Juan Pablo Palma: "Confianza en los datos como tema crítico — si los datos no son confiables, las decisiones tampoco."

Felipe Reyes: "Hoy no aporta" — cuando los datos no cuadran con lo que ven en terreno.

**Esto no es un pilar ni un dominio.** Es el piso sobre el que se para todo. Si el operador no confía en el dato, vuelve a la radio y al Excel. Toda la matriz colapsa.

**Implicancia para diseño:** El sistema debe *demostrar* que sus datos son correctos antes de pedir que actúen. No basta con mostrar — hay que generar credibilidad (ej: mostrar fuente del dato, timestamp, comparación con medición manual).

---

## Slide 8 — Entrevistas: Lo que entró y lo que no

**6 insights nuevos (PENDING):**

| ID | Qué dice | Mueve la matriz? |
|---|---|---|
| IG-26 | P&T como dolor operativo no mapeado | Pregunta abierta |
| IG-27 | "Quiero ver plata, no toneladas" — desde operaciones | Sí → refuerza AE |
| IG-28 | Confianza en datos como gate de adopción | Sí → capa nueva |
| IG-29 | Madurez digital determina impacto | No (AI-only, frágil) |
| IG-30 | Control ambiental no cubierto | No (single-source) |
| IG-31 | Aware como auditoría de datos | No (AI-only, negocio) |

**Lo que las entrevistas con operadores NO van a hacer:** Levantar mirada estratégica. La matriz se construyó desde Carlos y Philip — y ahí se queda. Las entrevistas validan desde abajo, llenan las celdas, pero no reestructuran.

**Nota para el equipo:** Las entrevistas las hace el equipo interno de Idemax. Nosotros podemos levantar observaciones posteriores o proponer hacer un par más, pero no controlamos el proceso.

---

## Slide 9 — Propuesta: Qué va en la v2 para TIMining

**Concepto:** Follow-up, no redo. "Lo que refinamos con su feedback."

| Bloque | v1 (Touchpoint 1) | v2 (Follow-up) |
|---|---|---|
| Pilares | 4 cards genéricos | + cadena funcional + Omni Sense elevado |
| "Paz Mental" | Slides 05/12 | → "Tiempo Cero" |
| Benchmark | 1 slide por pilar | **Bench cruzado pilar×dominio** — Quiet UI en Crisis ≠ Quiet UI en Asistencia |
| Dominios | 4 pares (slide 13) | AE envolvente + 3 operativos |
| Casos #6-8 | Narrativa "cumplir plan" | → "mejoramiento continuo" / "reconfiguración estratégica" |
| Mockups | Vizzes genéricas | **Moodboards concretos** por pilar×dominio showcase |
| Confianza | No existía | **Slide nuevo** — prerrequisito de adopción |

**La pedida principal de Idemax:** Profundizar el bench para que cada pilar tenga profundidad conceptual en cada dominio donde opera. Quiet UI no es solo achromatic design — es gestión por excepción, es "el silencio se rompe solo cuando hay que actuar."

**Lo que falta para la v2:**
1. Definir qué benchmarks cruzados pilar×dominio incluir (propuesta Nico)
2. Moodboards A/B/C por pilar showcase (equipo IDEMAX)
3. Mockups más concretos — Carlo marcó que los actuales se ven "genéricos"

**Timeline:** Presentación v2 a TIMining la próxima semana.
