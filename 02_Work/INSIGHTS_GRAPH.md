# Insights Graph

Atomic verified insights extracted from sources. Each insight has a unique `[IG-XX]` ID, a status, and a traceable source reference.

## Status Legend

- **PENDING** — Extracted but not yet verified or cross-referenced.
- **VERIFIED** — Confirmed through cross-referencing or user validation.
- **MERGED** — Combined with another insight during conflict resolution.
- **INVALIDATED** — Contradicted by stronger evidence; no longer active.

---

<!-- New insights are appended below by /analyze -->

## Modelo de Negocio

### [IG-SYNTH-01] Motor de torneos reutilizable — el engine no cambia, el contenido sí
**Convergence:** 5/9 fuentes
**Category:** business (current)
**Voice:** stakeholder, document
**Authority:** direct-quote, fact
**Last-updated:** 2026-03-04

> **Narrativa:** La plataforma no es un juego único sino una infraestructura multi-torneo. El motor de juego (Next.js + Supabase) es reutilizable al 100% entre eventos; lo que cambia por torneo es el contenido (preguntas, temática) y el branding (colores, tipografía, imagen). Esto hace que los torneos piloto adicionales no generen costo adicional de desarrollo, desbloqueando una estrategia de múltiples pilotos a bajo costo marginal.

**Evidence trail:**
- [PDF]: "El motor de juego (Next.js + Supabase) es 100% reutilizable entre torneos. Lo que cambia por evento es el contenido y el branding"
- [PDF]: "Los 3+ torneos piloto no generan costo adicional de desarrollo"
- [Transcript]: "el juego cambia en cuanto al contenido. Pero no a la mecánica" (Juan Ibáñez)
- [Transcript]: "La mecánica siempre es igual, los botones siempre están en el mismo lugar"
- [Pre-análisis 01]: modelo de negocio basado en validación de torneos con plataforma flexible

Status: VERIFIED
Ref: Propuesta Plataforma de Validación Trivia.pdf · cotizacion/_transcript_reunion_feb06.md · preanalisis/01_contexto_y_vision.md

---

### [IG-SYNTH-02] Estrategia "Proof by Results" — evidencia real para inversores
**Convergence:** 4/9 fuentes
**Category:** business (aspirational)
**Voice:** stakeholder
**Authority:** direct-quote, vision
**Last-updated:** 2026-03-04

> **Narrativa:** La estrategia de fundraising no es un pitch con proyecciones, sino llegar al inversor con resultados reales del primer torneo: tickets vendidos, retención D1/D7, costo de adquisición. El cliente financia la inversión inicial (MDP + campaña del primer torneo) y la recupera al vender al inversor. El MDP no es el producto final sino el instrumento de validación.

**Evidence trail:**
- [Transcript]: "Con $X en campaña digital logramos vender Y tickets con Z% de retención — imagínate si me pasáis una campaña de diez [millones]" (Juan Ibáñez)
- [Transcript]: "La inversión del MDP más la campaña del primer torneo chiquitito es mía, yo después la recupero cuando le vendo al inversor"
- [PDF]: "con $X en campaña digital logramos vender Y tickets con Z% de retención"
- [Email brief]: "Costeo del proyecto para presentar a inversores"
- [Field notes]: cliente ha estado en reuniones preparando documentación para conseguir financiamiento

Status: VERIFIED
Ref: cotizacion/_transcript_reunion_feb06.md · Propuesta Plataforma de Validación Trivia.pdf · cotizacion/00_requerimiento_original.md · cotizacion/_FIELD_NOTES.md

---

### [IG-SYNTH-03] Modelo simultáneo de torneo (bloque de tiempo fijo)
**Convergence:** 3/9 fuentes
**Category:** business (current)
**Voice:** stakeholder, researcher
**Authority:** direct-quote, observation
**Last-updated:** 2026-03-04

> **Narrativa:** El modelo de torneo elegido es "bloque simultáneo": el torneo parte a una hora fija, dura un período predefinido (ej. 6 horas) y todos los participantes juegan al mismo tiempo. Este modelo crea urgencia, incentiva la participación completa y evita el gaming de las reglas (cherry-picking de horarios). La decisión fue confirmada por el cliente en la reunión y validada por field notes posteriores.

**Evidence trail:**
- [Transcript]: "el torneo parte, no sé, el treinta y uno de marzo a la tres de la tarde y termina a las nueve de la noche. Seis horas, y están todos jugando al mismo tiempo" (Juan Ibáñez)
- [PDF]: Decisión pendiente 1 — opción (b) bloque simultáneo "cambia la arquitectura"
- [Field notes]: "Cliente decide modelo de torneo: bloque simultáneo — 'nos parece la decisión correcta'" (Confidence: medium)
- [Transcript]: "si queréis ganar, tenés que jugar las seis horas seguidas, porque tenéis más opciones de ganar" (Juan Ibáñez)

Status: VERIFIED
Ref: cotizacion/_transcript_reunion_feb06.md · Propuesta Plataforma de Validación Trivia.pdf · cotizacion/_FIELD_NOTES.md

---

### [IG-SYNTH-04] Sistema de ligas con perfilado progresivo — competencia justa por nivel
**Convergence:** 2/9 fuentes
**Category:** business (aspirational)
**Voice:** stakeholder
**Authority:** direct-quote, hypothesis

> **Narrativa:** Los participantes se clasifican en ligas según su nivel de conocimiento (experto vs casual). La liga se asigna durante el proceso de compra/pre-torneo mediante una encuesta inicial y se refina durante el modo entrenamiento. Una vez asignada, la liga no puede bajar (sí puede subir), garantizando fair play. Cada liga compite por premios específicos además del premio mayor global.

**Evidence trail:**
- [Transcript]: "nivel experto, nivel casual — eso solo techo y piso" (Juan Ibáñez)
- [Transcript]: "cada liga debería tener como una recompensa en el mundo real particular que es distinta" (Juan Ibáñez)
- [Transcript]: "La liga es asignada por el sistema y no puede bajar una vez asignada — puede subir" (Nicolás Lundin)
- [Transcript]: "cuando tú compraste el ticket, contestaste preguntas que me ayudan a perfilarte como jugador" (Juan Ibáñez)
- [Email brief]: sistema cerrado con ventanas de tiempo y cuenta regresiva (implica estructura controlada)

Status: PENDING
Ref: cotizacion/_transcript_reunion_feb06.md · cotizacion/00_requerimiento_original.md

---

### [IG-SYNTH-05] Marco legal — trivia como juego de habilidad (no azar)
**Convergence:** 2/9 fuentes
**Category:** constraint (current)
**Voice:** stakeholder
**Authority:** direct-quote, observation

> **Narrativa:** En Chile, la trivia califica como "juego de habilidad" porque el resultado depende del desempeño del jugador (conocimiento + velocidad), no del azar. Esto la diferencia legalmente de rifas y sorteos, que son ilegales. Esta clasificación es el fundamento jurídico que hace viable el modelo de negocio de tickets de participación con premios reales.

**Evidence trail:**
- [Transcript]: "Esto es habilidad, porque es conocimiento. Todos los juegos de conocimiento son de habilidad, porque la mecánica para definir el ganador depende del desempeño del propio jugador" (Juan Ibáñez)
- [Transcript]: "Yo podría rifar el premio, pero rifar no es legal"
- [PDF]: "la trivia se clasifica como juego de habilidad (no azar), diferenciada legalmente de rifas y sorteos"

Status: PENDING
Ref: cotizacion/_transcript_reunion_feb06.md · Propuesta Plataforma de Validación Trivia.pdf

---

### [IG-SYNTH-06] Estrategia de credibilidad — influencers + narrativa post-torneo real
**Convergence:** 2/9 fuentes
**Category:** business (aspirational)
**Voice:** stakeholder
**Authority:** direct-quote, vision

> **Narrativa:** La credibilidad inicial se construye en dos capas: influencers de nicho relevantes (no influencers genéricos) que respalden el torneo, y la narrativa post-evento una vez que el ganador recibe el premio prometido. El primer torneo es el más difícil; si el ganador real recibe el premio y se documenta públicamente, la credibilidad de la marca queda establecida para los siguientes torneos.

**Evidence trail:**
- [Transcript]: "El primero es el más difícil, porque primero me tengo que ganar la credibilidad. ¿Y cómo me gano la credibilidad? Bueno, con influencer creíble" (Juan Ibáñez)
- [Transcript]: "hacemos el primer torneo en grande, Nicolás se fue al Tour De Francia con dos amigos — armé una serie contigo, con tu viaje, y tengo toda esa narrativa durante los próximos meses"

Status: PENDING
Ref: cotizacion/_transcript_reunion_feb06.md

---

## Tecnología y Arquitectura

### [IG-SYNTH-07] Cold Start Problem → Heurística como puente hacia ML real
**Convergence:** 6/9 fuentes
**Category:** technical (current)
**Voice:** stakeholder, document
**Authority:** direct-quote, fact, observation

> **Narrativa:** El cliente solicitó "algoritmos de aprendizaje automático" desde el día 1 para rubber banding e ilusión de agencia. El diagnóstico técnico determinó que sin datos históricos de jugadas, una red neuronal sufre cold start y no funciona efectivamente. La solución: "inteligencia heurística" — reglas estadísticas condicionales que emulan el comportamiento de ML usando tasas de acierto en tiempo real. El motor captura datos durante la Fase 1, lo que permite entrenar IA real en Fase 2. El cliente validó explícitamente el pivote.

**Evidence trail:**
- [Email brief]: "Algoritmos de aprendizaje automático" requeridos para ilusión de agencia y rubber banding
- [Emails]: "Me parece muy bien tu propuesta para el tema del cold start" (Juan Ibáñez)
- [Pre-análisis 01]: "Solicitud de IA/ML en MVP es inviable por Cold Start — sin datos históricos"
- [Pre-análisis 04]: "Inteligencia heurística = reglas estadísticas condicionales que emulan comportamiento de ML"
- [PDF]: "Inteligencia heurística: motor de ajuste de dificultad adaptativo sin ML, con arquitectura Data-Ready para IA real en Fase 2"
- [Transcript]: "Cold start confirmado: sin datos históricos no se puede hacer ML real desde el inicio"

Status: PENDING
Ref: cotizacion/00_requerimiento_original.md · cotizacion/05_hilo_correos_cliente.md · preanalisis/01_contexto_y_vision.md · preanalisis/04_decisiones_y_fronteras.md · Propuesta Plataforma de Validación Trivia.pdf · cotizacion/_transcript_reunion_feb06.md

---

### [IG-SYNTH-08] Stack tecnológico confirmado — Next.js + Supabase + Rive
**Convergence:** 4/9 fuentes
**Category:** technical (current)
**Voice:** document, stakeholder
**Authority:** fact, observation

> **Narrativa:** El stack definitivo es: Next.js como frontend PWA, Supabase (PostgreSQL + Edge Functions) como backend, y Rive para animaciones interactivas. Este stack fue confirmado en la propuesta formal (reemplazando Flutter del pre-análisis inicial) y ratificado en la reunión del 6 de febrero. Rive es el diferenciador de experiencia: permite animaciones reactivas de calidad videojuego en web, ya usado por Spotify y Dropbox.

**Evidence trail:**
- [PDF]: "Infraestructura: arquitectura escalable en Next.js + Supabase"
- [PDF]: "Motor de juego: lógica de trivia con scoring por tiempo continuo y feedback visual interactivo (Rive)"
- [Transcript]: "Rive es una aplicación que permite hacer animación — lo ha ocupado Spotify Wrap en el 2025, lo ha ocupado en Dropbox"
- [Pre-análisis 02]: Backend: Supabase, Base de datos: PostgreSQL, Lógica: Edge Functions (escalabilidad elástica)
- [Pre-análisis 02]: "Animaciones: Rive (animaciones interactivas ligeras)"

Status: PENDING
Ref: Propuesta Plataforma de Validación Trivia.pdf · cotizacion/_transcript_reunion_feb06.md · preanalisis/02_definiciones_tecnicas.md

---

### [IG-SYNTH-09] PWA sobre app nativa — decisión de plataforma
**Convergence:** 2/9 fuentes
**Category:** technical (current)
**Voice:** stakeholder, document
**Authority:** direct-quote, observation

> **Narrativa:** La decisión de plataforma pivotó de app nativa multiplataforma (Flutter) a Progressive Web App (PWA). Las razones: menor costo de mantenimiento, código único para todas las plataformas, deploy sin review cycles de tiendas, y para el tipo de mecánica de trivia la diferencia de experiencia vs app nativa es mínima. El cliente requirió que el usuario no sienta la diferencia: la PWA se instala con ícono en pantalla y corre en full screen.

**Evidence trail:**
- [PDF]: "Plataforma es PWA (Progressive Web App) optimizada para móviles, sin fricción de tiendas de aplicaciones"
- [Transcript]: "el usuario no sienta la diferencia — que sienta que es una app" (Juan Ibáñez)
- [Transcript]: "un setenta por ciento va a ser vibe coding, con Claude Code" — PWA reduce overhead técnico
- [Transcript]: Nicolás explica trade-offs Flutter vs PWA y recomienda web app

Status: PENDING
Ref: Propuesta Plataforma de Validación Trivia.pdf · cotizacion/_transcript_reunion_feb06.md

---

### [IG-SYNTH-10] Seguridad como requisito no negociable (transacciones reales)
**Convergence:** 4/9 fuentes
**Category:** constraint (current)
**Voice:** stakeholder, document
**Authority:** direct-quote, observation

> **Narrativa:** El modelo de negocio involucra dinero real (tickets de pago, premios). Esto convierte la seguridad en un requisito no negociable que el vibe coding por sí solo no puede garantizar. La arquitectura de seguridad tiene dos capas: Transbank maneja los datos de tarjeta (el cliente no toca datos sensibles) y un dev senior/pentester revisa la arquitectura y el código. Renato (pentester conocido) fue identificado como recurso disponible a bajo costo.

**Evidence trail:**
- [Transcript]: "el vibe coding tiene como una de sus debilidades la seguridad — hay que pagar la seguridad aparte" (Juan Ibáñez)
- [Transcript]: "Sería un poco irresponsable decir 'Filo' al pedirle a Claude o al modelo que cubra todo" (Nicolás)
- [PDF]: "Seguridad: revisión de arquitectura por dev senior incluida, especialmente en módulos de pagos y autenticación"
- [PDF]: "Seguridad: integración de pasarela de pagos (Webpay) y validación de integridad de respuestas (anti-cheat)"
- [Pre-análisis 04]: "Reserva de ~$3k para dev backend (seguridad/Supabase)"

Status: PENDING
Ref: cotizacion/_transcript_reunion_feb06.md · Propuesta Plataforma de Validación Trivia.pdf · preanalisis/04_decisiones_y_fronteras.md

---

## Producto y UX

### [IG-SYNTH-11] MDP sobre MVP — slice vertical delicioso, no base horizontal funcional
**Convergence:** 3/9 fuentes
**Category:** design-framework (current)
**Voice:** stakeholder
**Authority:** direct-quote, observation
**Grounded in:** [IG-SYNTH-02] (fundraising requiere evidencia de mercado real, no demo funcional), [IG-SYNTH-12] (feedback dopamínico es el diferenciador del producto)

> **Narrativa:** El concepto MDP (Minimum Delightful Product) reemplaza al MVP tradicional. La diferencia es estructural: el MVP construye toda la base técnica sin pulir la experiencia; el MDP hace un "slice" vertical — funcionalidad mínima pero completa, con diseño, animaciones y UX de calidad. Para este proyecto, el MDP es: monocampaña, 2 tipos de preguntas, construido para ser reutilizable. "No tiene que ser perfecto, pero tiene que ser delicioso."

**Evidence trail:**
- [Transcript]: "el MDP vendría siendo como algo que no solamente es funcional, sino que es como rico — que es una buena [experiencia]" (Nicolás)
- [Transcript]: "siete lógicas de preguntas distintas no valida el modelo de negocio — dos tipos bien implementados bastan" (Juan Ibáñez)
- [Pre-análisis 01]: "Foco en retención: prioridad total en 'feedback dopamínico' (visuales/sonido)"
- [PDF]: "Opción Pro: enfoque en retención/viralidad/'juice', diseño inmersivo estilo videojuego"

Status: PENDING
Ref: cotizacion/_transcript_reunion_feb06.md · preanalisis/01_contexto_y_vision.md · Propuesta Plataforma de Validación Trivia.pdf

---

### [IG-SYNTH-12] Feedback dopamínico como pilar de retención — el "juice"
**Convergence:** 3/9 fuentes
**Category:** design-framework (current)
**Voice:** stakeholder, document
**Authority:** direct-quote, observation
**Grounded in:** [IG-SYNTH-01] (la plataforma necesita retener usuarios entre torneos), [IG-SYNTH-02] (retención D1/D7 es KPI clave para inversores)

> **Narrativa:** El "juice" — destellos (sparkle), sonidos agudos de recompensa, barras de progreso visuales, información de coins/puntos — no es decoración sino el mecanismo principal de retención. La retención D1/D7 es uno de los KPIs que los inversores monitorizan. El diseño inmersivo es lo que diferencia este torneo de una trivia genérica online.

**Evidence trail:**
- [Email brief]: "Feedback dopamínico MVP: destello (sparkle), sonido agudo (recompensa), barra de progreso visual, información de coins"
- [Pre-análisis 01]: "Foco en retención: prioridad total en 'feedback dopamínico' (visuales/sonido)"
- [PDF]: "Opción Pro: diseño sonoro reactivo, animaciones Rive avanzadas"
- [PDF]: KPIs definidos: "retención D1/D7, tiempo promedio por sesión"

Status: PENDING
Ref: cotizacion/00_requerimiento_original.md · preanalisis/01_contexto_y_vision.md · Propuesta Plataforma de Validación Trivia.pdf

---

### [IG-SYNTH-13] Panel de administración de contenido — plataforma administrable sin dev
**Convergence:** 4/9 fuentes
**Category:** user-need (aspirational)
**Voice:** stakeholder
**Authority:** direct-quote, observation

> **Narrativa:** El cliente requiere poder configurar torneos completos sin tocar código: cargar preguntas, definir dificultad y engagement de cada pregunta, cambiar el branding visual (colores, tipografía, imagen de portada) y gestionar múltiples torneos desde un CMS simple. Sin este panel, cada torneo nuevo requiere trabajo de desarrollo, rompiendo la escalabilidad del modelo.

**Evidence trail:**
- [Transcript]: "Lo que necesito es que la plataforma me permita personalizarlo de tal manera que quede listo el juego" (Juan Ibáñez)
- [Transcript]: "es superimportante que sea administrable, porque le voy a tener que ir cambiando el contenido constantemente" (Juan Ibáñez)
- [Email brief]: "Panel de administración: definición de features por pregunta, clasificación humana (subcategoría temática, dificultad cognitiva, engagement emocional)"
- [PDF]: "Gestión de contenido: panel de administración (CMS simple) que permite crear múltiples torneos, gestionar preguntas y cambiar configuración visual (theming)"
- [Emails]: "Requerimiento admin: panel debe incluir herramientas para clasificar preguntas"

Status: PENDING
Ref: cotizacion/_transcript_reunion_feb06.md · cotizacion/00_requerimiento_original.md · Propuesta Plataforma de Validación Trivia.pdf · cotizacion/05_hilo_correos_cliente.md

---

### [IG-SYNTH-14] Estrategia de validación en 3 fases — desirability → alpha → beta
**Convergence:** 2/9 fuentes
**Category:** business (aspirational)
**Voice:** stakeholder, document
**Authority:** direct-quote, observation

> **Narrativa:** El proceso de validación tiene 3 fases progresivas: Fase 1 (prototipo interactivo con Rive, pre-código) para validar desirability con comunidades nicho reales; Fase 2 (alpha cerrado, friends & family) para validar estabilidad técnica y retención básica; Fase 3 (primer torneo real, beta) para medir los KPIs de inversores (retención D1/D7, tickets vendidos, costo de adquisición).

**Evidence trail:**
- [Transcript]: "La primera fase es prototipo, que incluso te puede servir de inversión. La segunda, el alfa cerrado, from friends and family. Y luego, el beta."
- [PDF]: "Torneo 1: calibrar experiencia, medir retención y feedback. Torneo 2: comparar engagement. Torneo 3: ajustar variables basado en datos"
- [PDF]: "KPIs definidos: retención D1/D7, tiempo promedio por sesión, tickets vendidos vs costo de adquisición"

Status: PENDING
Ref: cotizacion/_transcript_reunion_feb06.md · Propuesta Plataforma de Validación Trivia.pdf

---

### [IG-SYNTH-15] Scoring multidimensional — velocidad + ligas + premios diferenciados
**Convergence:** 3/9 fuentes
**Category:** technical (aspirational)
**Voice:** stakeholder, document
**Authority:** direct-quote, observation

> **Narrativa:** El sistema de puntuación combina velocidad (a mayor velocidad, más preguntas contestadas en el bloque de tiempo) con clasificación por ligas. El score final es función de preguntas correctas, velocidad y dificultad ponderada. Los premios son diferenciados: hay un premio mayor global y premios específicos por liga, lo que maximiza el incentivo de participación a todos los niveles de conocimiento.

**Evidence trail:**
- [Email brief]: "Scoring: mezcla de correctas, dificultad ponderada, rapidez, racha, comodines, tie breakers"
- [Transcript]: "a mayor velocidad de respuesta, más preguntas contestadas = mayor puntaje" (Juan Ibáñez)
- [Transcript]: "hay un premio que es a toda la raja que se lo gana el que le gana todo, el primer lugar. También hay premios por niveles" (Juan Ibáñez)
- [PDF]: "Motor de juego: lógica de trivia con scoring por tiempo continuo y feedback visual interactivo"

Status: PENDING
Ref: cotizacion/00_requerimiento_original.md · cotizacion/_transcript_reunion_feb06.md · Propuesta Plataforma de Validación Trivia.pdf

---

## Negocio y Contrato

### [IG-SYNTH-16] Propiedad intelectual — transferencia total al cliente al finalizar el pago
**Convergence:** 4/9 fuentes
**Category:** constraint (current)
**Voice:** stakeholder, document
**Authority:** direct-quote, fact

> **Narrativa:** El contrato establece transferencia total de derechos patrimoniales sobre código, diseño y marca al cliente una vez completado el pago final. Esto incluye la firma de documentos legales de cesión de IP. El cliente mencionó también una posible alternativa: participación futura en el proyecto (equity/share) en lugar de pago completo por el MDP mínimo — esto queda como punto abierto a negociar vía NDA.

**Evidence trail:**
- [Email brief]: "Adquisición del código, lo que implica propiedad absoluta y única del mismo por parte del contratante"
- [Pre-análisis 01]: "Cliente requiere propiedad absoluta del código (IP)"
- [PDF]: "Propiedad intelectual: se ceden todos los derechos patrimoniales del código, diseño y marca al cliente una vez finalizado el pago"
- [Transcript]: "mi compromiso de que, cuando lo venda, obviamente el proyecto es tuyo" (Juan Ibáñez — oferta alternativa)

Status: PENDING
Ref: cotizacion/00_requerimiento_original.md · preanalisis/01_contexto_y_vision.md · Propuesta Plataforma de Validación Trivia.pdf · cotizacion/_transcript_reunion_feb06.md

---

### [IG-SYNTH-17] KPIs de inversión — las 3 métricas que miran los inversores
**Convergence:** 2/9 fuentes
**Category:** business (current)
**Voice:** document, stakeholder
**Authority:** fact, direct-quote

> **Narrativa:** Los KPIs para demostrar viabilidad a inversores están definidos: retención D1/D7, tiempo promedio por sesión, y tickets vendidos vs costo de adquisición. La meta es poder presentar: "Con $X en campaña digital logramos vender Y tickets con Z% de retención." Estas tres métricas son el "lenguaje de los inversores" y el MDP debe estar diseñado para medirlas desde el día 1.

**Evidence trail:**
- [PDF]: "KPIs definidos: retención D1/D7, tiempo promedio por sesión, tickets vendidos vs costo de adquisición"
- [PDF]: "Estas son las métricas que miran los inversores"
- [PDF]: "Meta final: con $X en campaña digital logramos vender Y tickets con Z% de retención"

Status: PENDING
Ref: Propuesta Plataforma de Validación Trivia.pdf · cotizacion/_transcript_reunion_feb06.md

---

### [IG-SYNTH-18] Evolución de alcance y presupuesto — scope creep inverso hacia MDP mínimo
**Convergence:** 3/9 fuentes
**Category:** business (current)
**Voice:** document, stakeholder
**Authority:** fact, observation

> **Narrativa:** El alcance del proyecto evolucionó significativamente: el brief inicial (Feb 2) pedía una app nativa con ML desde día 1, múltiples mecánicas de pregunta, economía de coins y wagering — presupuesto estimado $12-16K USD. La propuesta formal (Feb 2026) redujo esto a PWA multi-torneo con heurística, presupuesto $5.6K. La reunión del 6 de febrero lo redujo aún más: MDP mínimo, 2 tipos de preguntas, cotización nueva pendiente. El cliente busca la inversión mínima para validar el modelo antes de escalar.

**Evidence trail:**
- [Pre-análisis 03]: "Presupuesto final (rango): $12,000 - $16,000 USD (bruto)"
- [PDF]: "Total bolsa inicial (Pro + Diseño integrado): 200 hh, $5,605 USD brutos (~148 UF)"
- [Transcript]: "necesito un costo mucho más bajo — en el fondo, un testeo" (Juan Ibáñez)
- [Transcript]: "siete lógicas de preguntas distintas no valida el modelo — dos tipos bien implementados bastan"
- [PDF]: "Cambio vs propuesta anterior: no un torneo piloto único sino mínimo tres eventos"

Status: PENDING
Ref: preanalisis/03_modelo_negocio.md · Propuesta Plataforma de Validación Trivia.pdf · cotizacion/_transcript_reunion_feb06.md
