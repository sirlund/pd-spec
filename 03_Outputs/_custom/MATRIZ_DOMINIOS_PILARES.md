# Matriz Dominios × Pilares — TIMining CORE

> **Versión:** 1.1 (2026-02-26)
> **Origen:** Cruce de 8 casos de uso (Touchpoint 1) + IG-24 (asimetría) + resolución jerarquía dominios
> **Propósito:** Guía de diseño — qué pilar priorizar en cada dominio operativo

## Decisión Estructural: Alineación Estratégica como Envolvente

**Problema:** ¿Son los 4 dominios pares, o hay jerarquía?

**Evidencia del Touchpoint (Carlos, CTO):**
- Sobre dominios: "De esos cuatro, ese último [Alineación Estratégica] está por encima de los demás" — Carlos priorizó AE como el dominio rector.
- Sobre pilares: "Lo más importante por lejos era que le mande la alerta al que tiene que accionar" — Carlos priorizó Omni Sense, pero en contexto del Caso #2 (no como declaración general).
- Recurrente: el foco siempre debe ser "el negocio" — traducir operaciones a plata, EBITDA.

**Evidencia sesión interna 24-feb:**
- Nico (línea 369): "Omni Sense podría ser el principal — en la reunión salió muy fuerte el tema de WhatsApp"
- Nico (línea 393): "El dominio de la alineación estratégica... ese último está por encima de los demás"
- Nico (línea 407): "Si es que era como tú lo pones todo al mismo nivel, para mí ese es por encima. Y, si no, era Omni Sense."
- Ale (línea 388): Corrige — Carlos dijo Omni Sense respecto al caso #2, no como jerarquía general.

**Resolución:** Son capas distintas, no competidoras.

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
│  ("si no estás en WhatsApp, no existes")    │
└─────────────────────────────────────────────┘
```

- **Alineación Estratégica** = dominio rector (el *para qué* — todo debe traducirse a valor de negocio)
- **Omni Sense** = pilar más urgente (el *por dónde* — si no estás en WhatsApp, no existes)
- Los 3 dominios operativos (Crisis, Anticipación, Asistencia) viven dentro de la pregunta "¿cómo vamos contra plan?"

**Presentación viernes:** No declarar jerarquía de pilares explícitamente. La matriz de intensidad muestra que Omni Sense es líder/co-líder en 2 de 4 dominios — Carlos saca la conclusión solo.

---

## Insight de Asimetría

> "Frente a un dominio, hay pilares que son más enfáticos — no es 4×4. Quiet UI en respuesta a crisis es evidente, pero Quiet UI con asistencia inteligente no pega mucho." — Ale, sesión interna [IG-24]

La presentación del Touchpoint 1 (slide 13) asignó un **pilar líder** por dominio. Esta matriz profundiza: muestra la **intensidad real** de cada pilar en cada dominio, basada en los 8 casos de uso presentados y validados.

## Matriz de Intensidad

Escala: ●●● Líder · ●● Presente · ●○ Secundario · — Ausente

**Dominio envolvente: Alineación Estratégica** — presente en todo, traduce a valor de negocio (KPIs, EBITDA, plan vs. realidad). Pilares predominantes: Time Sight (●●●) + Omni Sense (●●●). Casos: #6, #7, #8.

**Dominios operativos:**

|  | Quiet UI | Clear Path | Time Sight | Omni Sense |
|---|:---:|:---:|:---:|:---:|
| **A · Respuesta a Crisis** | ●●● | ●●● | ●●● | ●● |
| **B · Anticipación Operativa** | ●○ | ●● | ●●● | ●○ |
| **C · Asistencia Inteligente** | ●○ | ●● | ●○ | ●●● |

### Lectura por dominio

**Alineación Estratégica (envolvente) — el *para qué***
No es un dominio operativo más — es la capa que da sentido a los otros tres. Todo lo que CORE hace debe traducirse a valor de negocio. Casos #6 (plan vs. realidad), #7 (optimización) y #8 (reportería CFO) viven aquí. Time Sight y Omni Sense co-lideran: uno mide la brecha, el otro la entrega al ejecutivo sin que la busque.

**A · Respuesta a Crisis — el más completo (3 pilares fuertes)**
El patrón D→A→R atraviesa directamente tres pilares: Quiet UI (Detección — el silencio se rompe), Time Sight (Análisis — cadena causal), Clear Path (Recomendación — opciones rankeadas). Omni Sense participa como canal de entrega (alerta en celular antes de que el despachador levante la radio). Es el único dominio donde los 4 pilares están activos con fuerza. **Es el dominio showcase del sistema.**

**B · Anticipación Operativa — focalizado en tiempo**
Time Sight lidera: el sistema anticipa antes de que el problema se materialice. Clear Path da la recomendación. Quiet UI y Omni Sense son secundarios — el umbral de alerta (QUI) y el canal de briefing (OS) existen pero no definen la experiencia.

**C · Asistencia Inteligente — focalizado en canal**
Omni Sense domina: el canal ES la experiencia (WhatsApp, voz, manos libres). Clear Path guía la acción. Time Sight y Quiet UI son mínimos — aquí no hay anomalía que detectar ni profundidad temporal que explorar. **Esta es la celda más vacía de Quiet UI**, confirmando IG-24.

### Lectura por pilar

**🔇 Quiet UI — pico en Crisis, valle en Asistencia**
- Máxima expresión: pantalla acromática que solo ilumina la anomalía (Caso #1 IROC)
- Mínima expresión: Asistencia Inteligente no necesita "silencio" — el usuario activamente busca al sistema
- En Alineación: dashboard ejecutivo con KPIs limpios, sin ruido operacional

**🔗 Clear Path — transversal pero nunca lidera solo**
- Siempre presente en la etapa R (Recomendación) del patrón D→A→R
- Nunca es el pilar que define un dominio por sí solo
- Su fuerza está en la combinación: Clear Path + Time Sight (la recomendación se fundamenta en análisis temporal)

**🔄 Time Sight — el pilar más consistente**
- Presente con fuerza en 3 de 4 dominios (A, B, D)
- Líder en Anticipación (donde es el core) y en Alineación (plan vs. realidad)
- Solo se debilita en Asistencia, donde el contexto temporal es complementario, no central

**📡 Omni Sense — líder emergente post-Touchpoint [IG-23]**
- Líder en Asistencia (manos libres, WhatsApp) y co-líder en Alineación (reportería ejecutiva)
- Carlos (CTO) lo identificó como el pilar más importante: "lo que más usan en la mina es WhatsApp"
- Canal ≠ complemento: el medio es parte de la inteligencia (slide 06: "el canal correcto es parte del silencio")

## Mapeo de Casos por Celda

| Caso | Dominio | Pilares activos (por etapa D→A→R) |
|---|---|---|
| #1 Caída equipo crítico | A: Crisis | D: Quiet UI · A: Time Sight · R: Clear Path · Canal: Omni Sense |
| #2 Riesgo espacial/seguridad | A+C: Crisis + Asistencia | Omni Sense (fusión sensorial) · Quiet UI · Clear Path |
| #3 Cuello de botella | B: Anticipación | Time Sight (predicción) · Clear Path (reasignación) |
| #4 Briefing inteligente | C: Asistencia | Omni Sense (WhatsApp) · Clear Path (acción) |
| #5 Copiloto en terreno | C: Asistencia | Omni Sense (voz, foto, manos libres) |
| #6 Plan vs realidad | D: Alineación | Time Sight (brecha continua) · Clear Path (decisión) |
| #7 Optimización plan minero | D: Alineación | Time Sight (tendencia estructural) |
| #8 Reportería ejecutiva | D: Alineación | Omni Sense (CFO recibe) · Quiet UI (KPIs limpios) |

## Diagrama: Intensidad del Sistema

```
 ┌─ ALINEACIÓN ESTRATÉGICA (envolvente) ─────────────────────────────────────┐
 │  "Todo se traduce a valor de negocio"                                     │
 │  Time Sight ━━━━━━━━━ (plan vs real)    Omni Sense ━━━━━━━━━ (reportería) │
 │  Quiet UI ─────────── (dashboard)       Clear Path ─────────── (ejecutivo)│
 │  Casos: #6 Plan vs Real · #7 Optimización · #8 Reportería CFO            │
 ├───────────────────────────────────────────────────────────────────────────-┤
 │  DOMINIOS OPERATIVOS                                                      │
 │                                                                           │
 │               Quiet UI    Clear Path   Time Sight   Omni Sense            │
 │              ─────────   ──────────   ──────────   ──────────             │
 │  A · Crisis  ━━━━━━━━━   ━━━━━━━━━   ━━━━━━━━━   ─────────              │
 │               líder(D)    D→A→R (R)    D→A→R (A)     canal               │
 │                                                                           │
 │  B · Antici  ╌╌╌╌╌╌╌╌╌   ─────────   ━━━━━━━━━   ╌╌╌╌╌╌╌╌╌             │
 │               umbral      R stage       líder       briefing              │
 │                                                                           │
 │  C · Asist   ╌╌╌╌╌╌╌╌╌   ─────────                ━━━━━━━━━             │
 │                            acción                    líder                │
 └───────────────────────────────────────────────────────────────────────────┘

 ━━━ Líder (●●●)   ─── Presente (●●)   ╌╌╌ Secundario (●○)   [vacío] Ausente
```

## Diagrama: Cadena Funcional (slide 06)

```
 ┌─────────────┐  se rompe solo   ┌─────────────┐  se fundamenta en  ┌─────────────┐  horizonte temporal  ┌─────────────┐
 │  Quiet UI   │  si hay Clear    │ Clear Path   │  análisis          │ Time Sight   │  determina          │ Omni Sense   │
 │  ¿Necesito  │ ──────Path────>  │ ¿Qué debo    │ ───temporal────>   │ ¿Por qué     │ ────canal────>      │ ¿Dónde y     │
 │   prestar   │                  │   hacer?     │                    │  pasó y qué  │                     │  cómo me     │
 │  atención?  │ <───canal────    │              │                    │   viene?     │                     │   llega?     │
 └─────────────┘  correcto =      └──────────────┘                    └──────────────┘                     └──────────────┘
                  gestión por                                                                   │
                  excepción                                                                     │
        ^                                                                                       │
        └───────────────────────────────────────────────────────────────────────────────────────┘
```

## Implicaciones para Diseño

1. **No diseñar los 16 cruces con igual profundidad.** Los cruces ●●● merecen casos de uso detallados y prototipos. Los ●○ merecen un pattern general, no un flujo dedicado.

2. **Crisis es el dominio showcase.** Es el único donde los 4 pilares operan a máxima intensidad. Si un solo caso demuestra el sistema completo, es el Caso #1 (Caída de equipo crítico).

3. **Omni Sense necesita protagonismo.** Post-Touchpoint [IG-23], Carlos priorizó este pilar. La matriz confirma que es líder o co-líder en 2 de 4 dominios y tiene presencia en los 4. La presentación actual lo trata como "cuarto pilar" — debería elevarse.

4. **Clear Path es el pegamento, no el protagonista.** Transversal, siempre presente en la etapa R, pero nunca define un dominio solo. Su valor es sistémico: sin Clear Path, los otros tres pilares son datos sin prescripción.

5. **Los moodboards del viernes deberían priorizar:**
   - Quiet UI × Crisis (consola acromática, referente CrowdStrike)
   - Time Sight × Anticipación (predicción, referente Chronosphere)
   - Omni Sense × Asistencia (WhatsApp/voz, referentes Samsara + Discord)
   - Time Sight + Omni Sense × Alineación (reportería ejecutiva, referentes Tesla Fleet + Datadog)

---

## Decisión: Narrativa "Mejoramiento Continuo" (reemplaza "Cumplir el Plan")

**Problema:** La narrativa actual posiciona a TIMining como herramienta para "garantizar el cumplimiento del plan minero". Carlos corrigió esto en el Touchpoint.

**Evidencia:**

Ale (sesión interna, línea 260):
> "Otro comentario que nos hizo Carlos es que, en vez de hablar de cumplir el plan minero, era hablar de esta herramienta operacional para un mejoramiento continuo. [...] el punto de Carlos era como, oye, muchas veces el plan minero sí lo cumplen, no es que estén desviados. De hecho, a veces hasta un poco el plan. Entonces no es tan desafiante cumplirlo, y por lo tanto, lo que nosotros queremos hacer es que tenga un mejor plan minero, o una planificación permanente para que cada vez tenga un resultado mejor."

Nico (sesión interna, línea 263):
> "Carlos se mandó un speech bien potente respecto a eso, de qué es un plan minero, cómo se planifica, qué es lo probabilístico."

**Resolución:**

| Antes | Después |
|---|---|
| "Cumplir el plan minero" | "Mejoramiento continuo del plan" |
| Garantía de cumplimiento | Planificación permanente |
| Meta fija → adherencia | Meta adaptativa → optimización |
| TIMining verifica | TIMining mejora |

**Impacto en framework:**
- El Dominio D (Alineación Estratégica) cambia de "¿Cómo vamos contra plan?" a "¿Cómo mejoramos el plan?"
- Los Casos #6 y #7 necesitan ajuste narrativo: no es detectar desviación del plan, es detectar oportunidades de mejora
- [IG-22] (plan compliance vs. optimization) ya captura esta tensión — esto la resuelve a favor de optimization
- Afecta directamente a [DP-02] (Copiloto) y [DP-04] (Time Scrubbing)

---

## Decisión: Erradicar "Paz Mental"

**Problema:** "Paz mental" fue el nombre original del mantra operativo de TIMining CORE. Philip (CEO) y Carlos (CTO) lo cuestionaron en el Touchpoint. En la sesión interna se confirmó que debe eliminarse.

**Evidencia del Touchpoint (Carlos/Philip):**

Carlos cuestionó el nombre directamente:
> "Paz mental, más bien, es este un mundo... sin tiempo para avanzar. No sé si es mental, porque si yo tuviera todo el tiempo para poder pensar..."
> "Tal vez paz mental está un poco más centrado en la operación, en lo táctico, que a alto nivel. Tal vez podemos hacer un ajuste ahí."

Philip (en contexto de no contaminar entrevistas con usuarios):
> "En una entrevista con un usuario final o con un cliente, yo no le puedo ir a hacer un inception de paz mental, en que él solo me diga, necesito paz mental. Para validar que necesita paz mental y no otra cosa."

**Evidencia sesión interna 24-feb:**

Nico (línea 217):
> "Acuérdense que paz mental está como invalidado por Philip y por Carlos."

Ale (línea 260):
> "Está la paz mental que hablamos [en la slide 12 — hay que cambiarlo]."

**Resolución: Reemplazar por conceptos accionables.**

| "Paz mental" (abstracto) | Reemplazo (accionable) |
|---|---|
| Tranquilidad operativa | "Ayúdame a tomar la mejor decisión porque no tengo tiempo" |
| Certeza | "Simplificame" — reducción de carga cognitiva |
| Confianza | "El sistema lo hace por mí" — delegación operacional |

**El concepto subyacente es válido.** Lo que falla es el nombre:
- Demasiado abstracto para validar con usuarios
- Suena a marketing, no a herramienta
- Carlos y Philip lo rechazaron explícitamente

**Impacto en framework:**
- Eliminar "paz mental" de STRATEGIC_VISION.md (visión, criterios internos)
- Reemplazar con el mantra que sí validaron: "De dashboard a copiloto — el sistema detecta, analiza y recomienda"
- Los 6 criterios internos en STRATEGIC_VISION.md incluyen "Paz Mental" — reemplazar por "Delegación Operacional" o "Carga Cognitiva Cero"
- Afecta slides 05 y 12 de la presentación

---

## Trazabilidad

| Ref | Descripción |
|---|---|
| [IG-24] | Relación pilar-dominio es asimétrica — no es 4×4 |
| [IG-23] | Omni Sense como pilar prioritario (WhatsApp dominante) |
| [IG-16] | Pilares como sistema encadenado (cadena funcional) |
| [IG-17] | Pilares con distinción arquitectural (presentación vs contenido) |
| [IG-18] | 4 dominios operativos con pilar líder |
| [IG-03] | WhatsApp canal principal de decisiones operacionales |
| [IG-SYNTH-07] | Gestión por excepción (Glanceable Intelligence) |
| [IG-SYNTH-06] | Patrón D→A→R validado por usuarios |
| [IG-22] | Plan compliance vs. optimization — resuelto a favor de optimization |
| CF-12 | "Paz mental" como nombre — cuestionado por Philip y Carlos |
