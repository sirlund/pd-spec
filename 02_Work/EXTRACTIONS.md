# Source Extractions

Raw claims extracted from source files by /extract. Each claim is a verbatim quote or factual statement — no interpretation.

This file is the input for /analyze. Do not edit manually.

---

<!-- Extractions are appended below by /extract -->

## [cotizacion/00_requerimiento_original.md]
- Type: email / client brief
- Date: 2026-02-02
- Participants: Juan Marcelo Ibáñez (client), Nicolás Lundin (consultant)
- Extracted: 2026-03-04T12:00

### Raw Claims
1. "Necesito cotizar el desarrollo de una app y un sitio que alojen procesos de inscripción, loggeo y un juego de trivia"
2. "Debe correr en smartphones, tablets y laptops"
3. "Te agradezco la confidencialidad en el proceso"
4. MVP mecánica: pregunta escrita + 3 o 4 alternativas por pregunta
5. MVP mecánica: preguntas de V o F (con o sin swipe)
6. Mecánicas no-MVP: imagen + alternativas, audio progresivo (hidden sound), drag and drop (ordenar eventos históricos), matching (unir columnas), pin drop (localizar en mapa), sustitución de glifos (crucigrama), rueda de la fortuna, eliminación por descarte, imagen revelada (zoom in), trivia social (crowd-based con porcentajes)
7. Feedback dopamínico MVP: destello (sparkle), sonido agudo (recompensa), barra de progreso visual, información de coins
8. Feedback dopamínico opcional: comodines, loot boxes, power ups, boosters
9. Economía no-MVP: apuestas de coins (wagering), microtransacciones (tiempo, comodines, lootboxes)
10. MVP social: tabla de clasificación de puntajes en tiempo real
11. Gestión de acceso MVP: sistema cerrado (solo cuentas loggeadas), ventanas de tiempo (X horas totales distribuidas en N días), cuenta regresiva
12. Panel de administración: definición de features por pregunta, clasificación humana (subcategoría temática, grado de dificultad cognitiva, grado de engagement emocional)
13. Motor dinámico: orden de preguntas personalizado por perfil, modificación según comportamiento (racha aciertos/errores)
14. "Algoritmos de aprendizaje automático" requeridos explícitamente para: ilusión de agencia, rubber banding (mantener competición estrecha), potenciar engagement
15. Analytics (User Behavior) para predecir patrones
16. Scoring: mezcla de correctas, dificultad ponderada, rapidez, racha, comodines, tie breakers
17. Acciones para nuevos usuarios: compra (distinta a microtransacciones), inscripción, respuesta de cuestionario, modo entrenamiento (freemium/bases de perfil)
18. "Adquisición del código, lo que implica propiedad absoluta y única del mismo por parte del contratante"
19. "Costeo del proyecto para presentar a inversores"
20. Formato presupuesto: banda presupuestaria (piso - límite superior)

## [cotizacion/05_hilo_correos_cliente.md]
- Type: email thread / negotiation
- Date: 2026-02-02 to 2026-02-04
- Participants: Juan Ibáñez (client), Nicolás Lundin (consultant)
- Extracted: 2026-03-04T12:00

### Raw Claims
1. Requerimiento crítico del cliente: motor de ML para rubber banding e ilusión de agencia
2. Propósito declarado: presentar a inversores
3. Nicolás diagnosticó falta de datos históricos para ML ("Cold Start")
4. Propuesta de pivote: Fase 1 con heurística avanzada (reglas lógicas) en lugar de red neuronal
5. Propuesta: arquitectura "Data-Ready" para capturar datos y entrenar IA futura en Fase 2
6. Cliente validó propuesta de pivote: "Me parece muy bien tu propuesta para el tema del cold start"
7. Requerimiento admin: panel debe incluir herramientas para clasificar preguntas
8. Requerimiento dinámico: sistema debe reclasificar preguntas automáticamente (ej: pasar de fácil a difícil según player cluster)
9. Cliente solicita propuesta de arquitectura ("hosting elástico")
10. Resolución técnica: reclasificación dinámica mediante "estadística heurística" (tasas de acierto en tiempo real) en Fase 1
11. Diseño de arquitectura elástica (serverless)
12. Reunión agendada para viernes 10:00 AM (Google Meet) para revisar propuesta formal y presupuesto

## [preanalisis/01_contexto_y_vision.md]
- Type: analysis / pre-sale notes
- Date: 2026-02
- Participants: Nicolás Lundin (consultant)
- Extracted: 2026-03-04T12:00

### Raw Claims
1. Proyecto nombrado "Trivia MDP" (Consultoría Nicolás Lundin)
2. Estado: pre-venta / definición de propuesta para inversores
3. Perfil del cliente: "visionario, busca levantar capital"
4. MVP mecánica según cliente: trivia clásica (pregunta + 3/4 alternativas) y verdadero/falso (swipe)
5. MVP feedback: destellos, sonidos agudos de recompensa, barras de progreso, información de coins
6. MVP acceso: login obligatorio + ventanas de tiempo limitadas (X horas jugables totales)
7. MVP social: ranking de puntajes en tiempo real
8. MVP gestión: panel de administración para calificar preguntas (dificultad, engagement, categoría)
9. Solicitud explícita del cliente de "algoritmos de aprendizaje automático" para rubber banding y ajuste de dificultad dinámico desde el día 1
10. Mecánicas no-MVP: drag & drop, pin drop, audio progresivo, matching, crucigramas, rueda de la fortuna
11. Economía no-MVP: apuestas de coins (wagering) y microtransacciones
12. Power-ups complejos no-MVP: loot boxes, comodines extra
13. Cliente requiere propiedad absoluta del código (IP)
14. Presupuesto ajustado para "presentar a inversores"
15. Diagnóstico: solicitud de IA/ML en MVP es inviable por "Cold Start" (sin datos históricos)
16. Solución MDP: reemplazo de ML por "inteligencia heurística" (reglas estadísticas simples) para Fase 1
17. Visión "Data-Ready": arquitectura preparada para entrenar IA real en Fase 2
18. Foco en retención: prioridad total en "feedback dopamínico" (visuales/sonido)

## [preanalisis/02_definiciones_tecnicas.md]
- Type: technical spec
- Date: 2026-02
- Participants: Nicolás Lundin (consultant)
- Extracted: 2026-03-04T12:00

### Raw Claims
1. Frontend: Flutter (multiplataforma)
2. Animaciones: Rive (animaciones interactivas ligeras)
3. Objetivo UX: experiencia fluida y visualmente rica ("Juice")
4. Backend: Supabase
5. Base de datos: PostgreSQL (data relacional)
6. Lógica: Edge Functions (escalabilidad elástica sin costo fijo alto)
7. Motor heurístico implementado en base de datos/funciones
8. Aceleradores internos: UI Kits y AI (Cursor/Copilot)
9. Meta: reducir carga operativa de ~480h a ~350h

## [preanalisis/03_modelo_negocio.md]
- Type: business model / budget
- Date: 2026-02
- Participants: Nicolás Lundin (consultant)
- Extracted: 2026-03-04T12:00

### Raw Claims
1. Tarifa base: $25 USD/hora (senior)
2. Presupuesto final (rango): $12,000 - $16,000 USD (bruto)
3. Estructura legal: boleta de honorarios (persona natural) + contrato de cesión de IP
4. Boleta exenta de IVA; cliente retiene 15.5% (tasa 2026)
5. Hito 1 (30%): prototipo real en código (Flutter), implementación UI Kit, diseño de sonido inicial
6. Hito 2 (40%): alpha "happy path" funcional, backend conectado (Supabase), motor heurístico implementado
7. Hito 3 (30%): beta final, integración Rive ("juice"), seguridad, deploy
8. Presupuesto permite subcontratar (~$2.5k-$3k) a dev backend/fullstack para seguridad e infraestructura
9. Subcontratación libera horas de product design/frontend

## [preanalisis/04_decisiones_y_fronteras.md]
- Type: decision log / project boundaries
- Date: 2026-02
- Participants: Nicolás Lundin (consultant)
- Extracted: 2026-03-04T12:00

### Raw Claims
1. Decisión: heurística sobre ML para Fase 1 — sin datos históricos, red neuronal sufre "cold start"
2. "Inteligencia heurística" = reglas estadísticas condicionales que emulan comportamiento de ML
3. Cumple objetivo de negocio (ajuste de dificultad dinámico) desde día 1
4. Data recolectada en Fase 1 entrena IA real en Fase 2
5. Cliente aceptó propuesta de pivote (Feb 3): "Me parece muy bien tu propuesta para el tema del cold start"
6. Justificación de precio ($12k-$16k): posicionamiento como "Product Partner", calidad senior a precio competitivo vs agencias (~800 UF)
7. Cobro por hitos reduce riesgo percibido por el cliente
8. Uso de IA (Cursor) reduce ~30% de carga; ahorro es margen del consultor, no descuento al cliente
9. Reserva de ~$3k para dev backend (seguridad/Supabase), permite foco en producto/frontend
10. Boleta de honorarios exenta de IVA; presupuesto es bruto; líquido cubre meta de $25/h con holgura
11. Cuentas de desarrollador (Apple/Google) y servicios cloud (Supabase) pagados directamente por el cliente
12. Presupuesto NO incluye costos de infraestructura recurrente
13. Servicio NO incluye adquisición de usuarios ni pauta publicitaria
14. Garantía: 30 días post-lanzamiento para corrección de bugs sin costo
15. Soporte post-garantía: retainer mensual ($800-$1200 USD/mes) o valor hora estándar
16. Idioma del proyecto: español; entregables y comunicaciones en español, salvo términos técnicos estándar en inglés

## [Propuesta Plataforma de Validación Trivia.pdf]
- Type: propuesta de servicios / proposal
- Date: 2026-02
- Participants: Nicolás Lundin (consultor), Marcelo "Barri" Ibañez (cliente)
- Extracted: 2026-03-04T12:30

### Raw Claims
1. "El objetivo del proyecto es validar un modelo de negocio basado en torneos de trivia para comunidades de nicho"
2. Estrategia: ejecutar una serie de pilotos (mínimo 3) con distintas temáticas y premios, gestionados desde una plataforma flexible
3. Cambio vs propuesta anterior: no un torneo piloto único sino mínimo tres eventos con distintas temáticas y premios
4. "No se puede validar el modelo con un solo torneo. Necesitamos al menos 3 eventos con distintas temáticas y premios para comparar qué funciona mejor y llegar al inversor con datos reales"
5. Cambio vs propuesta anterior: admin simple en vez de configuración hard-coded — panel básico de administración (set de preguntas, imagen de portada, theme básico: colores y tipografía)
6. Se mantiene misma banda de inversión y mismo enfoque; se suma ítem nuevo de Diseño e Identidad de Marca
7. Torneo 1: primera temática, calibrar experiencia, medir retención y feedback
8. Torneo 2: segunda temática distinta, comparar engagement entre comunidades
9. Torneo 3: ajustar variables (premios, pricing, comunicación) basado en datos de los primeros dos
10. KPIs definidos: retención D1/D7, tiempo promedio por sesión, tickets vendidos vs costo de adquisición
11. "Estas son las métricas que miran los inversores"
12. Meta final: "con $X en campaña digital logramos vender Y tickets con Z% de retención"
13. Plataforma es PWA (Progressive Web App) optimizada para móviles, sin fricción de tiendas de aplicaciones
14. Motor de juego: lógica de trivia con scoring por tiempo continuo y feedback visual interactivo (Rive)
15. Inteligencia heurística: motor de ajuste de dificultad adaptativo sin ML, con arquitectura Data-Ready para IA real en Fase 2
16. Gestión de contenido: panel de administración (CMS simple) que permite crear múltiples torneos, gestionar preguntas y cambiar configuración visual (theming)
17. Landing page: página de preventa de tickets
18. Ranking: sistema de clasificación en tiempo real
19. Infraestructura: arquitectura escalable en Next.js + Supabase
20. Seguridad: integración de pasarela de pagos (Webpay) y validación de integridad de respuestas (anti-cheat)
21. "El motor de juego (Next.js + Supabase) es 100% reutilizable entre torneos. Lo que cambia por evento es el contenido y el branding"
22. "Los 3+ torneos piloto no generan costo adicional de desarrollo"
23. Ítem 2 — Identidad corporativa: diseño de logotipo e isotipo (app icon)
24. Sistema de diseño mínimo (MDS): definición de tokens de diseño (tipografía, paleta cromática, componentes) que alimentan el motor de temas de la app
25. Landing page: diseño y maquetación de la página de venta de tickets
26. Opción Básica: enfoque en validación mecánica y funcional, componentes limpios/utilitarios, animaciones estándar, gestión tabular, assets generados por IA (80h)
27. Opción Pro: enfoque en retención/viralidad/"juice", diseño inmersivo estilo videojuego, animaciones Rive avanzadas y diseño sonoro reactivo, interfaz admin con previsualización visual, assets 100% custom por temática (160h)
28. Modelo de bolsa de horas; cláusula de flexibilidad para ampliación bajo misma tarifa base
29. Tarifa base: $25 USD líquidos/hora; valores brutos incluyen retención BH 15.25%
30. Ítem 1 Opción Básica (80h): $2,000 líquidos / $2,360 brutos; 2-3 semanas
31. Ítem 1 Opción Pro (160h): $4,000 líquidos / $4,720 brutos; 4-5 semanas
32. Ítem 2 Pack Diseño & Branding (40h): $1,180 brutos
33. Ejecución integral (Dev + Diseño): bonificación por eficiencia operativa del 25% sobre horas de Diseño
34. Total bolsa inicial (Pro + Diseño integrado): 200 hh, $5,605 USD brutos (~148 UF)
35. Roadmap: Fase 1 Identidad & Arquitectura (semana 1), Fase 2 Core Game (semana 1-2), Fase 3 Admin + Landing (semana 2-3), Fase 4 Pulido (semana 3-4), Fase 5 QA & Torneo 1 (semana 4-5), Fase 6 Torneos 2 y 3 (semana 5+)
36. Desarrollo liderado por Nicolás con herramientas de IA (Claude Code) + revisión de dev senior en seguridad y pagos
37. Forma de pago: 50% al inicio, 50% contra entrega final y liberación de código
38. Costos directos: infraestructura (Supabase, dominios) a cargo del cliente (~$30 USD/mes)
39. Seguridad: revisión de arquitectura por dev senior incluida, especialmente en módulos de pagos y autenticación
40. Propiedad intelectual: se ceden todos los derechos patrimoniales del código, diseño y marca al cliente una vez finalizado el pago
41. Marco legal: la trivia se clasifica como juego de habilidad (no azar), diferenciada legalmente de rifas y sorteos
42. Decisión pendiente 1: modelo de duración del torneo — (a) horas distribuidas en días ("15 horas en 2 semanas") vs (b) bloque simultáneo ("6 horas, todos al mismo tiempo"); opción (b) cambia la arquitectura
43. Decisión pendiente 2: temática del primer torneo y comunidad target
44. Decisión pendiente 3: punto en la banda de esfuerzo (Básica vs Pro) y decisión sobre Ítem 2 (Diseño)

## [cotizacion/_transcript_reunion_feb06.md]
- Type: reunión / meeting transcript
- Date: 2026-02-06
- Participants: Nicolás Lundin (consultor), Juan Marcelo Ibáñez (cliente, alias "Marcelo Barri")
- Preprocessed: yes (Passes A+B+C — speakers normalizados, fonética corregida, frases reparadas)
- Extracted: 2026-03-04T15:00

### Raw Claims

**Modelo de negocio**
1. El modelo son torneos de trivia para comunidades de nicho — se vende el derecho a participar (ticket), no la app en sí
2. "Lo que vende es el derecho a participar en el torneo" — análogo a un concierto o torneo físico
3. Cada torneo tiene una temática, un proceso comercial, se juega una vez y "muere" — el contenido cambia, la mecánica permanece
4. El modelo es superescalable: Chile primero como MVP, luego Latam y venta a empresas
5. Juan busca validar que "la gente está dispuesta a participar en torneos" antes de escalar — eso es lo que necesita para levantar capital
6. Precio promedio ticket: máximo ~$10.000 CLP — tiene que ver con la relación con el costo del premio mayor (credibilidad)
7. Estrategia de credibilidad inicial: influencers creíbles + narrativa post-torneo real (ganador recibe el premio prometido, se documenta)
8. "El primero es el más difícil, porque primero me tengo que ganar la credibilidad" (Juan Ibáñez)
9. Premio MVP: objeto de culto/nicho, no un viaje espectacular — suficiente para validar sin sobregirar la inversión

**Pivote de alcance vs propuesta anterior**
10. Decisión clave: PWA (Progressive Web App) en vez de app nativa (iOS/Android) — menor costo, libertad de deployment sin revisión de tiendas
11. Juan exige: "el usuario no sienta la diferencia — que sienta que es una app"; PWA cumple esto (ícono en pantalla, full screen)
12. Costos de licencias de tiendas nativas: ~$100 USD anuales por plataforma — relativamente bajo, pero el problema es la rigidez de los review cycles
13. El scope de la cotización anterior (múltiples plataformas, Flutter) ya no aplica — se redirige a PWA monocampaña
14. Alrededor de 2 meses y medio para desarrollo total — estimación Nicolás

**MDP vs MVP**
15. MDP = Minimum Delightful Product: no solo funcional sino "rico" — incluye diseño, animaciones, UX pulida
16. Analogía pirámide: el MVP tradicional construye la base completa; el MDP hace un "slice" vertical (funcionalidad mínima pero completa y deliciosa)
17. MDP para este proyecto: monocampaña, máximo 2 tipos de preguntas, construido para ser reutilizable en torneos futuros
18. "Necesito desarrollar primero el MDP" — Juan descarta features del brief original como prescindibles para validación
19. Juan: "siete lógicas de preguntas distintas no valida el modelo de negocio — dos tipos bien implementados bastan"

**Sistema de ligas y perfilado**
20. Variable de clasificación: nivel de conocimiento — experto vs casual (techo y piso)
21. Cada liga compite por su propio premio en el mundo real (además del premio mayor)
22. La liga es asignada por el sistema y no puede bajar una vez asignada (puede subir) — principio de fair play
23. Perfilado progresivo: encuesta al comprar ticket → modo entrenamiento pre-torneo → asignación definitiva a liga
24. Modo entrenamiento: preguntas de la temática enviadas antes del torneo (por email/canal) — sirven para perfilar Y mantener engagement
25. "Lo que necesito es que la plataforma me permita personalizarlo de tal manera que quede listo el juego" (Juan Ibáñez)

**Mecánica del torneo**
26. Modelo simultáneo preferido: torneo parte a hora fija, dura bloque de tiempo (ej. 6 horas), todos juegan al mismo tiempo
27. Scoring por velocidad: a mayor velocidad de respuesta, más preguntas contestadas = mayor puntaje
28. No se puede repetir la partida — es una sola oportunidad por torneo
29. En el bloque simultáneo, la presencia completa aumenta las chances de ganar — incentivo a jugar las 6 horas
30. Posibilidad de monetización in-game: loot boxes con preguntas extra al azar que aumentan el puntaje — pendiente de definir para MDP

**Tecnología y desarrollo**
31. Stack confirmado: Next.js + Supabase (PWA), Rive para animaciones
32. Rive usado por Spotify, Dropbox, juegos web de Google — referente de calidad para animaciones web
33. Desarrollo: ~70% vibe coding con Claude Code + dev full-stack senior para revisión de seguridad
34. "Sería un poco irresponsable decir 'Filo' al pedirle a Claude o al modelo de seguridad que cubra todo" — se necesita revisión humana experta
35. Seguridad: revisión de código por dev senior + Transbank para procesamiento de pagos (Juan no maneja datos de tarjetas)
36. Renato (pentester conocido) disponible para hacer security review a bajo costo
37. Juan confirma: "el vibe coding tiene como una de sus debilidades la seguridad — hay que pagar la seguridad aparte"

**Cold start / IA**
38. Cold start confirmado: sin datos históricos no se puede hacer ML real desde el inicio
39. Solución: arquitectura Data-Ready — heurística inicial que captura datos para ML futuro
40. Arquetipos de jugador base para heurística: casual (busca dopamina) y competitivo (busca ser el mejor)

**Legal**
41. Trivia clasificada como "juego de habilidad" (no azar) — el ganador depende del desempeño del propio jugador
42. La rifa sería ilegal en Chile; la trivia es legal porque depende del conocimiento — no del azar

**Acuerdo y próximos pasos**
43. Nicolás propone cobrar horas justas para MDP mínimo, con visión de proyecto a largo plazo compartido
44. Juan ofrece compromiso de participación futura en el proyecto cuando lo venda ("cuando lo venda, el proyecto es tuyo")
45. Próximos pasos acordados: NDA → Nicolás presenta 2 opciones de cotización → reunión presencial el lunes

**Estrategia de validación (3 fases)**
46. Fase 1 Deseabilidad: prototipo interactivo (Rive, pre-código) → probar con comunidad nicho real
47. Fase 2 Alpha cerrado (friends & family): links de invitación, gratuito, probar estabilidad técnica y retención
48. Fase 3 Beta / torneo real: medir retención D1/D7, logins, compras de ticket

**Estrategia de fundraising**
49. Juan quiere llegar al inversor con resultados reales: "me gasté $500K CLP en campaña digital y vendí N tickets"
50. La inversión en MDP + primera campaña la pone Juan — la recupera al vender el proyecto al inversor
51. "Con $X en campaña digital logramos vender Y tickets con Z% de retención — imagínate si me pasáis una campaña de diez [millones]" (Juan Ibáñez)

## [cotizacion/_FIELD_NOTES.md]
- Type: field_notes
- Date: 2026-03-04
- Extracted: 2026-03-04T12:45

### Raw Claims
1. Cliente agradece presupuesto: "está muy bueno" (Confidence: medium)
2. Cliente ha estado en reuniones preparando documentación para conseguir financiamiento (Confidence: medium)
3. Cliente decide modelo de torneo: bloque simultáneo ("6 horas, todos al mismo tiempo") — "nos parece la decisión correcta" (Confidence: medium)
4. Cliente pregunta sobre impacto arquitectónico y presupuestario del modelo simultáneo (Confidence: medium)
