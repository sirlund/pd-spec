# Reunión Camila — 17 feb 2026

> Notas internas Idemax. No es fuente para /extract.
> Participantes: Nlundin, Cbonilla, Hmunoz, AGuzzoni

## Decisiones y Próximos Pasos

- Nicolás traspasará casos de uso, pilares de diseño y mockups a presentación principal
  - Incluir referentes visuales por cada etapa del flujo (detección, análisis, recomendación)
  - Agregar 2 casos de uso nuevos: optimización del plan minero y reportería CFO
- Reunión de revisión mañana en la tarde (30 minutos, remoto)
  - Validar presentación antes del workshop del jueves
  - Ajustes finales si es necesario
- Workshop jueves presencial (10:00-12:00) en TIMining
  - Asistirán Nicolás y Camila (Ale no estará)
  - Presentar casos de uso con pilares aplicados y mockups
- Estrategia post-aprobación: desarrollar manual UX con reglas específicas
  - Definir qué significa cada pilar en términos concretos
  - Establecer guidelines para validación con usuarios reales

## Diseño UI/UX y Referentes Visuales

- Estructura de referentes por flujo de trabajo:
  - Detección: consola cromática con glow externo para alertas (referencia SpaceX)
  - Análisis: proyección temporal de impactos (45 minutos hasta bloqueo chancador)
  - Recomendación: opciones ranqueadas con impacto de tonelaje cuantificado
- Principios de diseño identificados:
  - Clear path: máximo 3 recomendaciones, no más de ciertos clics
  - Quiet UI: interfaz limpia con colores solo para anomalías
  - Time sight: visualización de futuro y proyecciones
  - Priorización numérica esencial vs. solo paleta de colores
- Mockups generados con IA muestran:
  - Dashboard de sala de control con detección automática
  - Análisis de cuellos de botella con proyección temporal
  - Sistema de recomendaciones con opciones A, B, C ranqueadas

## Aprendizajes Estratégicos TIMining/Core

- Gap crítico: decisiones se toman fuera del software
  - Comunicaciones por radio no quedan registradas en sistema
  - Pérdida de conocimiento entre jefes de turno
  - Software debe convertirse en hub central de toma de decisiones
- Urgente vs importante como capacidad clave del sistema
  - Ejemplo: Pedro arregla el camino (output previsible), Juan manda camiones por otro camino y mitiga 30% más (impacto al plan)
  - El software debe ayudar a priorizar lo importante de cara al plan, no solo lo urgente visible
- Evolución estratégica en 3 fases:
  1. Cumplimiento del plan (estado actual)
  2. Optimización del plan en tiempo real (visión futura)
  3. Anticipación proactiva basada en aprendizaje histórico
- Realidad vs. plan como gamechanger:
  - Plan conservador de 100 unidades vs. realidad de 50, pero potencial de 150
  - Incentivos mal alineados (bonos por cumplimiento, no por optimización)
  - Oportunidad de repricing: de $300K a $450K anuales si se demuestra valor
- Transición de 7 productos fragmentados a plataforma core unificada
  - Cada producto actual sirve perfiles diferentes
  - Necesidad de interfaces dinámicas que se adapten al usuario
  - Riesgo de fragmentación tecnológica actual
- Adopción dual necesaria: bottom-up (>100 usuarios activos post-piloto) + top-down (decisión la toma BHP en Canadá, no la mina local)

## Riesgos, Brechas y Preguntas Abiertas

- Validación con usuarios finales crítica pero pendiente:
  - No hay entrevistas programadas con jefes de turno reales
  - Riesgo de diseñar basado solo en percepción interna
  - Propuesta: entrevistar ex-empleados que ahora trabajan en clientes
- KPIs y métricas de impacto no definidos:
  - ¿Cómo medir cumplimiento del plan minero?
  - ¿Cómo demostrar valor generado vs. precio cobrado?
  - Falta correlación entre valor agregado y pricing
- Aspectos técnicos sin resolver:
  - Bloqueantes para migración a core platform
  - Posible reestructuración de backend necesaria
  - Estándares de accesibilidad no considerados
  - Conectividad en terreno (tablets, teléfonos en mina)
- Confusión temporal en sistema actual:
  - Datos con diferentes delays (15, 30, 45 minutos)
  - Usuarios no entienden qué está actualizado vs. histórico
- Dependencia de venta consultiva como síntoma:
  - 6 meses de consultoría por proyecto indica producto complejo
  - Usuarios no adoptan herramientas por dificultad de uso

## Insights del Workshop y Análisis

- 23 insights extraídos de documentos y presentaciones TIMining
  - Ranqueados por relevancia y fuentes
  - Geometry gap y efecto Suiza validados como diferenciales
  - Dashboard a copiloto y gestión por excepción confirmados
- Perfiles de usuario con necesidades diferentes:
  - 4-5 densidades de uso radicalmente distintas
  - Interfaz estática actual no se adapta a contextos
  - Oportunidad de detección automática de rol/ubicación
- Problema de adherencia al plan como métrica central
  - Fragmentación de herramientas (7 productos)
  - Falta de integración entre módulos
  - Suite no percibida como tal por usuarios finales

## Visión Futura y Northstar

- Sistema omnisciente que analiza situación completa cada X minutos
  - Percibe todo, escala solo lo relevante
  - Simulaciones buscan óptimo global, no local
  - Evolución hacia machine-to-machine communication
- Aprendizaje continuo del sistema:
  - Jefe de turno experto rechaza opciones A, B, C y elige D
  - Sistema aprende y eventualmente sugiere opción D como primera
  - Democratización del conocimiento experto
- Anticipación basada en múltiples factores:
  - Histórico de equipos y mantenciones
  - Condiciones climáticas (fenómeno del Niño)
  - Patrones estacionales y operacionales
- Incentivos alineados con optimización:
  - Reconocimiento individual por performance
  - Visibilidad de logros para jefatura
  - Bonificaciones por superar plan, no solo cumplirlo

## Recomendaciones de Continuidad

- Sistema de diseño AI-first: no Figma tradicional sino agentes que crean productos respetando pilares
- Manual UX como entregable: reglas concretas por pilar para que TIMining pueda diseñar sin depender de consultoría permanente
- Cortar el flujo de retroalimentación interna: no preguntarle a Erika (que trabaja con usuarios) sino al usuario real

## Acuerdos Logísticos

- Nicolás (hoy):
  - Traspasar casos de uso actualizados a presentación
  - Incorporar referentes visuales por etapa de flujo
  - Agregar casos de optimización de plan y reportería CFO
  - Resolver visualización de referentes en mockups
- Mañana tarde (ambos):
  - Reunión de revisión 30 minutos
  - Validar presentación completa
  - Ajustes finales pre-workshop
- Jueves workshop:
  - Presentación conjunta de casos de uso
  - Validación de pilares de diseño con equipo TIMining
  - Definir continuidad hacia manual UX
- Post-workshop:
  - Desarrollo de guidelines específicas por pilar
  - Planificación de entrevistas con usuarios finales
  - Definición de métricas de impacto y KPIs




---

TRANSCRIPT COMPLETO

Meeting Title: Punto de contacto revisor TIMining (presencial)
Date: Feb 17
Meeting participants: ALEJANDRO GUZZONI, Nlundin, Hmunoz, Cbonilla, Munoz Hugo

Transcript:

[SPEAKER: Nicolás Lundin]: Este es un gran referente de una de las maneras de cómo se podría mostrar, pero el gran desafío que tiene TIMining en todo esto no es solamente la paleta de colores o la prioridad de ser numérico. Eso, por supuesto, va a ser una de las maneras, pero también tiene que empezar a tener este cerebro interno. De hecho, por lo que está comentando, el problema es que el referente que está acá, en el caso uno, aplicaría o sería un referente para la detección —como alerta al usuario— pero no en análisis de impacto o en la recomendación. Quizás debemos tener uno por cada punto. Podríamos tener un referente para cada parte del flujo. Tenemos un montón de referentes, y yo creo que tal vez se repiten, pero del mismo pool que tenemos sí quedaría, y si no los complementamos.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Ya. Justo eso.

[SPEAKER: Nicolás Lundin]: Y lo otro es que el flujo de hoy en día —por supuesto que el tema de la detección sería un gran salto con la manera de visualizarlo— pero ellos algo de dirección tienen, la tienen pésimamente hecha, la tienen multicolor, no hay priorización, todo eso, pero algo tienen. Lo que tienen muy poco es recomendaciones.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Exacto.

[SPEAKER: Nicolás Lundin]: Entonces donde estamos más al de él, a mí me vas en el camino allá, en dejarte el médico de cabecera que te prescribe.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí.

[SPEAKER: Nicolás Lundin]: En ese caso, veamos, déjame ver cómo lo hacemos para que no quede sobrecargado.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí, o tal vez lo necesario.

[SPEAKER: Nicolás Lundin]: Claro. Si vamos a poner el referente, si esto no va, el contexto y el flujo se juntan. El contexto y el flujo se juntan. Entonces visualmente, quizás así, tres columnas. Y el referente al lado del flujo. Análisis y el cuadrante de abajo con referente arriba.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Ya, sí. Algo así.

[SPEAKER: Nicolás Lundin]: Claro, quedaría en el fondo limpio igual, porque si no empieza a ser confuso. Ya, déjame ver cómo lo reorganizo. Vamos al siguiente caso. Dame un segundo. Siguiente caso es... Ah, ya. Y lo que habíamos hablado con Ale es que después de cada caso, hacer una lámina donde íbamos a poner un mockup y en qué parte del flujo representa ese mockup. Y lo hacemos con IA, igual que lo hicieron en el ejercicio de Philip —que hizo los mockups del futuro. Esto está listo, mira. Entonces, en el caso de que haya equipo crítico, ¿dónde? En la recomendación, en la sala de control, el sistema detectó, analizó, nos muestra tres opciones ranqueadas, un impacto de tonelaje. Obviamente está muy maqueteada la imagen, pero se entiende perfectamente la idea: tengo un montón de pantallas en la sala de control.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Exacto.

[SPEAKER: Nicolás Lundin]: ¿Y qué pega? Pega Quiet UI más Clear Path. Sea, tengo una consola cromática, y el color solo es la anomalía y la caída pulsa en rojo. Te está explicando un poquito el cómo funciona. Entonces aquí se caía la pala, es que te muestra las opciones.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Claro, me dice, estas son mis opciones y me las...

[SPEAKER: Nicolás Lundin]: Y acá el referente visual. Entonces aquí podríamos, ¿complementaría eso con alguna? Yo creo que el análisis no sé si es tan necesario, pero sobre todo la recomendación. ¿Como qué cosas te recomiendan de manera limpia, priorizada, algo más fácil? Yo creo que por ahora están mencionados los referentes, pero no queda tan claro cómo pegan acá. Entonces, en vez de hablar de dicen "consola aburrida por diseño, bla, bla, bla", ir con un poquito más detalle. Por ejemplo, la pantalla brilla, el glow externo del monitor te indica que hay un problema y llama tu atención. Como en SpaceX.

El segundo caso, vamos pasando. Acá ya hay un referente, ese es otro referente. El detonante, en realidad ya los vimos, y este es la visualización. De nuevo, sigue con el Quiet UI. Igual aquí la IA hizo unas locuras, pero esta no lo hace hoy. Tiene alertas. Yo tengo entendido que Aware hoy, hace muy poquito, el 2025, lanzaron notificaciones o alertas. Pero no en el mapa, ¿cachás? Porque el mapa está con todos los colores.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí.

[SPEAKER: Nicolás Lundin]: En cambio, Core, no. Claro, eso para esta presentación. Acá harías una discusión como mantener un perfil [unintelligible — contexto garbled por STT] como, oye, me encanta, funciona en los dos idiomas, un poco. Igual siento nada.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Igual, es muy loco porque es muy... como que le preguntas a Gemini en otro proyecto, te va decir "no, de Maxcorp como un elemento."

[SPEAKER: Nicolás Lundin]: Sí. Ya, bueno. Ya, ¿dónde? Porque... De nuevo, si te fijas, tenemos la detección, el DAR, la idea con Ale era que estos mockups iban a ir anclados a un momento del flujo. Este está en la detección. El anterior estaba en la recomendación, ¿cachás? Y, bueno, de nuevo, los pilares que toca, el momento, y el referente. Después, cuello de botella. ¿Qué pasó? Proyección de bloqueo, patio sin reparar, velocidad cayendo, bla, bla. Y aquí ya este es el momento del análisis.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Detección, análisis, recomendación, ¿va siempre? Porque es parte de un dominio que aplica todo.

[SPEAKER: Nicolás Lundin]: Sí, de hecho, uno de los hallazgos decía que el patrón DAR es uno de los más pesados de la visión. Es que yo le puse un nombre muy raro a ese proyecto personal. Entonces, ese patrón de detección, análisis y recomendación está superpotente y muy repetido en todos lados. Así que es algo que sí o sí es parte de la visión. De hecho, tal vez, si está tan potente, deberíamos... Perdón, me pasé. Di la vuelta. Tal vez la decisión estratégica debería mencionar algo del DAR.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí.

[SPEAKER: Nicolás Lundin]: Voy a darle una vuelta. Siento que de todas maneras caben en el salto de modelo, porque ahí estoy diciendo "tengo el problema, prescribe acciones". Tal vez se pueden hacer específicas. Sí, porque ahí está, bien, lo menciona y habla de problemas reales y prescribe.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Claro.

[SPEAKER: Nicolás Lundin]: Sí, en el fondo son dos de tres. El análisis, ya. Entonces, este es el tipo en la oficina y está ahí viendo que se cayó una pala y que eso va a generar un problema en el plan, y en cuarenta y cinco minutos se bloquea el chancador, y puedo analizar qué va a pasar. Por eso también, los pilares, el Time Sight con el Clear Path, es como: ok, me muestra futuro, qué es lo que va a pasar, cuarenta y cinco minutos más el chancador se va a parar, entonces tengo que tomar acción ahora.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: ¿Puede haber algún...?

[SPEAKER: Nicolás Lundin]: Bueno, lo que no estamos seguros... Lo que pasó, probablemente, es que el transcript del workshop —tú ves que cuando hay mucha gente hablando, el STT se marea. No es lo mismo en una reunión por Meet, donde están claramente identificados cada uno de los speakers. Versus una sala donde todo el mundo habla al mismo tiempo, puede que haya un poquito de ruido. Pero la idea principal está. Él, caso de inteligencia para la reunión de comunicación de quince minutos, sin tiempo para preparar, entrando al turno con el móvil en una pre-reunión.

Ahí está la... [incomplete — pensamiento cortado en la descripción del caso de uso]

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: ¿Detecta que...? Sí, ¿qué significa este caso?

[SPEAKER: Nicolás Lundin]: Briefing inteligente. [incomplete — contexto garbled por STT, concepto no recuperable]

Es la idea de que eres jefe de turno, y en lugar de tener que estar como una hora entendiendo qué pasó las doce horas anteriores, esto lo que hace es ponerte al día y decirte qué es lo que debías atacar en la entrada de tu turno, en tu briefing inicial del turno, para mitigar problemas del turno anterior y cosas así.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Oye, había algo que ellos mencionaban al top, que no sé si aplica al caso anterior, que tenía que ver como [unintelligible — frase garbled, no recuperable], tiene que ser muy bueno.

[SPEAKER: Nicolás Lundin]: Tiene un robotito ahí. Me da risa. Como inventa cosas. Tiene que ser muy bueno en ser el cerebro que discierne entre lo urgente versus lo importante. Entonces, muchas veces el operario efectivamente logra detectar las alertas que pueden afectarle, que van en el camión, porque en verdad el camino va a estar cortado. Pero lo que ellos decían es que muchas veces hay un problema puntual —el camino está parado y efectivamente va a llegar el impacto— pero que no sea el mayor problema de cara al plan minero, ¿sabes? Entonces, en cuál de estos casos de uso queda muy evidente que tengo que cumplir con las dos cosas —hay cosas urgentes que tengo que abordar— pero ojo que la energía del cerebro no puede estar tanto en eso si hay un problema mucho mayor, que quizás no es tan evidente.

El camino está parado, pero quizás el problema más grande es... Es que es que el problema que debe pasar en la mina mucho es que depende de quién estaba en ese momento. Si hubo un problema en el camino y el jefe de turno era Juan, y Juan es como muy bueno para no ponerse a arreglar el detalle sino a ver el big picture, ¿cachás?, y a tomar decisiones a más alto nivel, tal vez toma menos decisiones que impactan mejor el plan dinero. Pero si está Pedrito, Pedrito tiende más a decir "no, hay que arreglar el camino al tiro", que tal vez es una buena —está bien, sí, hay que arreglar el camino— pero lo que mitigaría más no es arreglar el camino, sería mandar a los camiones que den la vuelta por el otro camino, y eso al final del turno te va a mitigar un treinta por ciento más. Y eso es lo que ellos no ven en el momento.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Exacto.

[SPEAKER: Nicolás Lundin]: Es que hay alguien que toma la decisión de... Igual tiene que ver con cómo el cerebro funciona. Porque es mucho más fácil atacar tareas que tienen un output previsible, que tareas que no tienes tan claro cuál es el output.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Porque es mucho más fácil responder a esto que planteamos, pero igual se ha entregado en el problema chiquitito y no en el importante de cara al plan.

[SPEAKER: Nicolás Lundin]: Yo, escuchando lo que hablábamos incluso post workshop la otra vez, pensaba todo el rato que el gran problema que veo es que no se toman las decisiones en el software de TIMining, se toman las decisiones fuera. Y no queda documentado eso. Según Carlos, eso se puede documentar igual, porque ellos igual ven que hay que mover la pala, y si yo no hago clic en el botón que dice "mover pala", que va a mandar una notificación al operador, le mando un mensaje por radio diciéndole "mueve la pala", y la pala se mueve. El algoritmo que está detectando el movimiento en la mina detecta que efectivamente se movió, y podríamos deducir que tomaron una decisión en base a lo que el software dice. ¿Cachás?

Pero, ¿qué tendría que pasar para que las decisiones se empiecen a tomar en el software? Que el software sea la fuente, que esté recopilando lo que está pasando. Exacto. Entonces, cuando yo le digo en el software, no, no muevas la pala, no elijo Opción C, yo yo te voy a dar una opción D —lo que yo digo, "déjala ahí"— queda logueado que en el turno 368, el jefe de turno Juan tomó esta decisión, y que esa decisión impactó de esta manera en el negocio. Y eso no está ahora.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Existe, sí.

[SPEAKER: Nicolás Lundin]: Entonces, tal vez va un poco allá: si quieren ser realmente el cerebro de la mina, no pueden llevar una contabilidad vieja aparte, porque si no nunca van a ser tan relevantes. ¿Cómo quieren hacer eso? Y eso sí generaría como un cacho de que tengo que volver a imputar en la plataforma algo que no... Ahora, ¿para qué?

Perdona, eso. Ellos mismos decían hace un momento: "oye, bacán que esto me empieza a anticipar más y todo, por razón." ¿Pero cuánto de esto ya? Solamente porque yo le cargué el plan de minero, y porque históricamente le he cargado los últimos planes, ya debería saber. Además, claro, empecemos, no solamente alértame, analízame y recomiéndame, sino que cosas que ya no debería... No cometamos los mismos errores del pasado. Caer en la misma piedra, porque en verdad esto no está como aprendiendo, no está cargado el cerebro. En vez de que, como te decía, el jefe de turno ya tiene una experiencia que le permite tomar mejores decisiones, pero esa experiencia no se traspasa al otro jefe de turno.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí. ¿Cachás?

[SPEAKER: Nicolás Lundin]: En cambio, si está en el software, si el software es el hub de toma de decisiones, ahí sí se democratiza el conocimiento dentro de la mina. ¿Cachás? ¿Tienen algunas cosas que apunten a eso, de lo que hicimos en la sesión de Keep/Start/Stop?

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí. Que hablar como de algunas cosas como, hoy en día el usuario no sabe que tiene que tomar decisiones con información actualizada, cómo podemos nosotros hacer su CEO o iWork as a service, y si nosotros somos los que monitoreamos remotamente su servicio. Porque hoy en día el cerebro es otro: nosotros pasamos a hacer ese monitoreo remoto subcontratado, porque ahí generaríamos el lock-in.

[SPEAKER: Nicolás Lundin]: Acá había otro punto que también levantaron alto, que era como: oye, esto también podría empezar a desafiar eso. Te ayuda no solamente a cumplir el plan minero, porque todo el rato estamos hablando de minimizar las desviaciones del plan o tratar de ayudar a cumplir el plan, pero oye, ¿qué pasa si vamos un poco allá? Además, optimizamos tu plan. Porque el plan... como cuando uno trata de ganarle a Waze.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Exacto.

[SPEAKER: Nicolás Lundin]: O sea, el plan... esa analogía está buena. Es como que Waze te dice "fuera esta ruta, llegas en quince minutos", y tú lo miras y si te sabes la ruta o cachás más o menos, no. Me voy a ir por esta otra calle que es más cómoda, y llegas en diez. Y eso es lo que no está pasando. O sea, está bien, es muy loco, porque hay un plan minero que dice, digamos, cien —porque es más numérico— y la realidad de la mina es cincuenta. Pero podría ser cien o podría ser ciento cincuenta. Porque el plan, tal vez, era muy conservador.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Obvio.

[SPEAKER: Nicolás Lundin]: O estaba considerando muchas pérdidas, porque saben que esas pérdidas pasan. Los bonos van asociados al cumplimiento del plan, y como quiero poner un plan que no voy a incumplir, porque no me dan el bono. O sea, además, está asociado a incentivos. Entonces, sí debe haber un buen incentivo en ganarle al plan. Es decir, oye, quiero que vaya bien con el plan, pero sí, además pusieras una pala más en todos los turnos que haga esto, lo aumentas un cinco por ciento sobre lo que alcanza. No, yo ahora lo pongo en el sistema completo, si hacemos un caso de uso que tenga que ver con eso. Porque en lo que hay, aparecen muchas de esas cosas como el "real de la plataforma", como un 2.0 que realmente sea un gamechanger, ¿cachés?

No sé si por ahí tú... pero si yo te mando todo lo que tengo ahí de lo que había como, ¿cómo podemos hacer nosotros los que hacemos este monitoreo remoto de su operación? ¿Cómo podemos hacer rápido: en el turno pasado, ¿qué pasó, por qué pasó, y qué se hizo? Te ayuda no solamente a cumplir el plan, sino a optimizarlo, que no conforme con cumplir. TIMining tiene un punto ciego, porque el cliente tiene muchos datos que podrían agregar valor si nosotros los cruzamos, pero hace recomendaciones para mejorar el plan, como nosotros no sabemos que los tienen, falta ese puente. Entonces, también ahí tenían como el punto interesante de cómo podría ser el que une puentes, como el cerebro que articula y va conectando esta red de información que ellos tienen.

Igual, esto de como solamente te ayuda a seguir el plan, sino que te lo mejoró. O sea, tú partiste con el plan y terminaste con algo mejor.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Igual, es como si ya había una visión a futuro más... ¿cachás? Porque primero hay que...

[SPEAKER: Nicolás Lundin]: Pero creo que un darlo acá. Sí, no solamente ir a tapar el hoyo, sino a...

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí, ¿cachás? Pero hay que pasar primero por lograr que el plan minero se cumpla. Eso sería... ya con eso yo creo que les compran la suite entera. Porque si yo te aseguro que si ocupas mi software, y tú estás con un plan minero que decía cien mil millones y está logrando cincuenta mil, va a ganar cincuenta mil millones más, el costo del software ya se pagó quinientas veces, ¿cachás?

[SPEAKER: Nicolás Lundin]: Claro. Y al final es como SAP, otras estas cosas, uno no tiene que estar convenciendo al dinero local de la cuestión, si es que mina X en Chile quiere contratar SAP o no. Esa decisión la tomará BHP en Canadá, y de ahí baja todo. Entonces, ¿qué tiene que pasar para que la decisión de TIMining se tome en otro lado?

Ah, eso te iba a tirar, porque de lo que teníamos, me levanto y quiero revisarlo. Déjame abrir este documento. Cada vez la anterior te voy a mandar, también dice como cuánto problema ya lo sabíamos desde el plan minero, que eso, como cuando dices "el dejo pasado es optimizar el plan". Cuando queremos, un pasito antes, cumplir el plan, bueno, el problema ya lo sabíamos y que podíamos anticipar. Y después otra que era como, desde las reglas del negocio, hoy no está en calzar los incentivos de cada perfil con la data que tienen y las tareas día a día. Entonces, como te imaginas, va a ser el mejor matchmaker en agregarle valor a los usuarios.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí. Hoy en día, TIMining no le agrega valor necesariamente a los que lo usan, le agrega valor al plan minero.

[SPEAKER: Nicolás Lundin]: Mira, te voy a mostrar lo que te había comentado, que es la herramienta que saca los insights. Estos veintitrés insights son como lo que saqué de ochocientas frases que rescató de un montón de data y documentos —leyó los PDFs, leyó las presentaciones de Idemax, ¿cachás? Entonces, las cosas están ordenadas.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: ¿Están ordenados?

[SPEAKER: Nicolás Lundin]: No, no están ordenados. Le voy a ver que los ordené, porque veo que hay uno que el cero seis es el más pesado, veinticinco cincuenta y cuatro fuentes, y el primero es quince cincuenta y cuatro. Ya. Están rankeados, le voy a pedir que los ranquee después. Pero geometry gap, ya, sí. Sí o sí, eso, yo los marqué como verificados, como que sí son cosas que forman parte de la estrategia. ¿Ya? Esto es algo que tratan de hacer una línea ahora, y tal vez no lo cumple cien por ciento por algunos problemas, pero eso... El diferencial estratégico que tienen hoy. ¿Ya? Está el problema del auto de Homer Simpson, que es que cada cliente pide features y simplemente hace un valor de su correo y el producto funciona bien para nadie. Es un riesgo existencial.

La confusión temporal, esto es algo que no tenemos que... Bueno, yo le quería conversar con Carlos, pero como Carlos igual es un poquito especial, no quise porque como que se molesta si le...

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí, ten cuidado. Románticamente. Porque esto lo levantó Erika con su equipo.

[SPEAKER: Nicolás Lundin]: Ya. Que actualmente en Aware tienen quince minutos de gap con la topografía, pero además indicadores que están treinta minutos con gap. O sea, tienen diferentes... Dice que está en tiempo real, pero hay diferentes sensores que están en diferentes puntos del tiempo. O sea, hay cosas que están actualizadas a quince minutos, a treinta minutos, actualizadas a cuarenta y cinco minutos, con un promedio de las tres últimas horas y cosas así. Entonces, el usuario no entiende. Pero si me dijiste que estaba actualizado cada quince minutos y esto dice que está acá, pero yo estoy viendo que ya se fue. ¿Cachás? Entonces, eso es una confusión mental que tienen respecto al tema temporal.

Después está el concepto de dashboard a copiloto, ya superbién, el efecto Suiza, superbién, el DAR, superbién. Gestión por excepción, ok. Concretización del dato. ¿Me lees el efecto César? Que son agnósticos de qué tipo de hardware usan en la mina. Vale. Integradores. Este otro que hay cuatro o cinco perfiles de usuario con diferencias de densidades radicalmente distintas. Y hoy Aware presenta la misma interfaz para todos.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Que tú lo mencionaste hace un momento. Que no hay un... porque los casos de uso ya eso.

[SPEAKER: Nicolás Lundin]: Exacto. Como cada caso de uso también como maestro. Cada uno apunte a... O sea, no sé qué pasa si yo —están llenos de ascensores— entonces, yo vengo a la sala, al iROC y marco que estoy acá, y detecta que estoy acá y soy el jefe de turno, y él automáticamente el dashboard se pone en modo jefe de turno, ¿cachás? O me logueo más manual, pero aun así, eso no existe hoy, ¿cachás? Es estático, no es dinámico de cara al usuario.

De herramientas frecuentadas, que son siete productos separados. Ah, de eso no estamos hablando nada. No, pero sí, porque al final todo esto que estamos hablando podría plasmarse después en cada uno de los productos. Pero como pasamos de siete productos fragmentados a la plataforma core, ¿ya? Lo difícil de eso es que, ok, todos los suites —la suite de Microsoft, la suite de Google, blablablá— el concepto de suite es cuando yo tengo un portafolio de soluciones complementarias entre ellas, que me van agregando valor a mi usuario, Camila Bonilla. Entonces, yo, Camila, tengo un portafolio. Pero en este caso no es Camila que tiene un set de opciones, es que a Nico le sirve Orchestra porque es el ingeniero, a Camila le sirve Aware porque está en la mina. Al otro le sirve el que hace la explosión de... Entonces, suite para TIMining que vende, pero no es suite para el usuario.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí, porque es muy... el usuario no percibe el paraguas.

[SPEAKER: Nicolás Lundin]: Tal vez habría que ver si esa plataforma core es como un solo software que, dependiendo del perfil, le entrega herramientas como módulos. O hay una reestructuración de los módulos, para que para un perfil como jefe de mina, de los siete módulos de core, pueda ocupar cuatro porque le hacen sentido. ¿Cachás? Que es como Google o Adobe, que yo quizás uso dos soluciones de Adobe.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí, igual por... esa es una visión válida, pero si le cruzamos el tema de los agentes, como que se empieza a diluir esa, porque todas esas suites están muriendo ahora. Se las están comiendo la IA. Entonces, Microsoft está en crisis, ¿cachás? Adobe también, la gente ya no ocupa Photoshop, ¿cachás? Pero quizás van a seguir nuevas suites donde hay inteligencia artificial, para manejo de imágenes. Sí, o una sola que hace todo.

[SPEAKER: Nicolás Lundin]: ¿Cachás? Entonces por eso en ese, el Sync 10, tenemos que... Voy a tocar acá. Tenemos que darle una vuelta al paso de siete productos a core. A cobrar. Estrategia. Qué raro que esto tampoco es repetido, o sea, que no sea de las más fuertes. Pero, bueno, eso también tenemos sesgo a su vez de cómo se dio la conversación. El doce, adherencia al plan como métrica central.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Es que no se habló en el workshop, el foco era diferente. El workshop como que se comió un poco porque es mucha data.

[SPEAKER: Nicolás Lundin]: Pero acá en el workshop tiene un foco más concreto de usuario. Lo importante es que acá sabemos de dónde viene, y viene del pitch deck, de la PPT corporativa, y cosas que dijo el CEO. Entonces esto tiene igual que revisarlo porque yo le pedí que le asignara como voz ¿quién lo dijo? Y eso igual también marca la métrica de cómo lo... Voy a darle una vueltecita. Me gusta igual como verlo contigo, porque me ayuda como a depurarlo.

A ver, íbamos en el aprendizaje básicamente: un usuario que está en la mina en terreno y les dicen "oye, tienes pendiente una capacitación de Orchestra", y te vas, capacitación de hora y media, son cinco, y estoy en terreno, tengo que ir al [incomplete — contexto de la frase cortado] además después tengo que mandar un informe y tengo que leer cien mails que tengo pendientes y tengo todos estos pendientes, y encima tengo que hacer un...

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: No. No sé si es parte de ese mismo insight, o del Clear Path...

[SPEAKER: Nicolás Lundin]: Ya, de la mano, pensando en la redacción. Ellos levantaban harto como "oye, hoy en día, el cómo llego a algo, la justa de cómo llegar."

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Hay. Entonces me tengo que acordar que primero me voy a ampliar acá, después acá...

[SPEAKER: Nicolás Lundin]: Ese es un problema grave. Por un lado, es que sea intuitivo, pero por otro lado que sea más... no puede ser ocho clics. Más allá que sea más claro, es que lo intuitivo es como que no necesito que alguien me lo explique, como que lo miro y puedo deducir, eso es una cosa. Pero dice tantas capas de información que igual no todo va a estar a un clic, no puedes hacer eso en un software de este tipo.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: ¿Me das cinco segundos?

[SPEAKER: Nicolás Lundin]: Dale. Cinco minutos, ¿verdad? Como cinco segundos. Sí, obvio, dale. [crosstalk — interrupción y pausa en grabación]

[unintelligible — intrusión en idioma portugués, posible ruido de dispositivo externo: "O pimenta da minha é? Sim."]

[SPEAKER: Nicolás Lundin]: Perfecto. Gabinete. Igual, algo porque parece que un dolor heavy, que sea como una ineficiencia grande que tiene.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí, déjame... déjame agregar acá. No creo. No sé por qué se marcó como que hubiera terminado la... [crosstalk — múltiples voces simultáneas, STT pierde el hilo]

[SPEAKER: Nicolás Lundin]: Ya, no importa. Ya, esta sigue grabando. El... Ya, entonces el número doce, el insight doce, adherencia al plan debería ser más... El stack tecnológico fragmentado, esto es importante, esto hay que conversarlo ahora mismo. Si no se refleja ahí, lo importante es que nosotros tengamos claro que el peso que se está dando es por las instancias que hemos tenido.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí. Entonces, quizá eso tiene un particular, ¿no? Lo que pasa es que este "adherencia al plan como métrica central", si te fijas en la presentación, es parte del objetivo de la visión estratégica, el cumplimiento del plan minero. ¿Cachás?

[SPEAKER: Nicolás Lundin]: Este, sí. Converso. Volviendo a esto, que los revisemos todos y veamos que tenemos un montón de validaciones de lo que hemos levantado. El stack tecnológico, es todo lo que me mencionó Carlos: no hay un framework común, cada producto es su propio mundo. Y también es un riesgo la dependencia de venta consultiva. Erika mencionó que en un proyecto estuvieron seis... Ahora, creo que eso se soluciona o se mitiga. O sea, esto es un síntoma de que hoy en día no estamos mostrándoles "te optimizo el dinero", no estamos mostrando cómo el cumplimiento... O sea, cuando lo que pasa es que ellos para tener a los clientes contentos, cuando los clientes no pueden ocupar bien el producto, les dicen "¿sabes qué?, esta semana necesito un informe" y ellos les hacen el informe. ¿Cachás? ¿Cómo hacen el informe? Usan Orchestra para hacer el informe, pero el usuario no usa Orchestra. Tiene acceso, pero no lo usa, porque es muy complejo. Y toma tiempo. Y es muy difícil de usar.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: No tiene tiempo para hacer eso. Ahí es donde se cruza con el tema de la gente, que tú le podías pedir a gente que te genere un reporte y cosas así.

[SPEAKER: Nicolás Lundin]: Creo que uno interesante es la oportunidad de repricing.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí. Esto yo te estaba preguntando de dónde salió y si sale del design brief. Los trescientos mil al año, el target core de cuatrocientos cincuenta mil es algo que dijo el mismo gallo de ventas. Sí, él estaba ahí, que habló de iPhone y todo.

[SPEAKER: Nicolás Lundin]: Está el tema de la paz mental, el efecto gaviota, la adopción. Esto yo a mí se me había pasado, pero esto se habló. Le pregunté recién de dónde salió. Esto que hablaban acá es que está de viaje. Que para que TIMining cerrara un contrato importante a la vez, bottom-up —porque efectivamente tienen que ir generando valor al usuario— pero también es top-down.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí, ¿y el top-down, qué es lo más alto? Yo creo que es más bottom-up que top-down, claro. Los gerentes no entienden por qué están pagando TIMining. ¿Cachás? Y está en las fuentes que sí, que es bottom-up, que tienen más de cien usuarios activos después de la adopción. Después del piloto.

[SPEAKER: Nicolás Lundin]: La seguridad y gestión geotécnica integrada, esto tiene que ver con un caso de uso que salió por ahí. La interfaz multimodal, ¿ya? Esto tiene que ver con la visión, los archivos que pasó Philip, que son los que hizo con Gemini, que hablaba del reality 3D, tactical 2D, team agent, briefing. Y es una presentación con hartas gráficas. Y eso, entonces, mira, todo esto... Creo que algo que sería bacán, algo que deberíamos reflejar en la presentación, a nivel de insights, o quizás en un caso de uso, es lo que veníamos hablando de cómo cómo optimizar el plan, cómo ganarle al plan, que todavía no está tan reflejado en los casos de uso, ¿cachás?

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: No. ¿Tú sientes que...? Muy enfocados en, o sea, son dos cosas, no digo que esté mal. En "alértame si es que la pala se dañó". Pero no el detalle. Eso me lleva al cumplimiento del plan, y si y si la primera vez puedo, como visión de éxito, hacer cumplimiento del plan, es que ¿cómo un caso de uso refleja eso, ¿cachás?

[SPEAKER: Nicolás Lundin]: Que puedo como: cargo el plan minero y me convierto en este cerebro central, puedo empezar a anticipar cosas que ya sé que van a pasar. Como: yo ya sé que tendrás desviaciones, por lo que he aprendido históricamente y por lo que tú me cargaste, ya sé que tienes un ochenta por ciento de probabilidad de que te fallen dos palas en los próximos tres meses. O incluso también basándome en el hardware que tienes. Sé que estos camiones se supone que cada seis meses van a mantención, pero en la práctica y en estas condiciones, cada cuatro meses se mandan a mantención. Entonces, ¿cómo...? Un caso que tenga que ver con el cumplimiento y, incluso, optimización del plan.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Hay otro factor porque ese caso, Roberto no puede tener cómo... como te hacemos bacanas acá, voy a casi que soy como el más relevante para el negocio, y acá sí que me voy a permitir cobrarte diez por ciento más, porque imagínate la cantidad de plata que te voy a dar más.

[SPEAKER: Nicolás Lundin]: Creo que es como decirles: "mira, esto es lo que sacamos del workshop, estos son los casos de uso aspiracionales de cómo ustedes internamente ven TIMining, y acá está sintetizado, y si se logra esto, está superbién. Pero después de esto, ¿qué viene?" La mapa de presentación. Sí, mira, de hecho salió en la conversa. Déjame mostrarle, porque no llegamos ahí. Pero volvamos a la presentación. Acá, aquí, es el perfil inteligente, el cuarto caso creo. El quinto caso, copiloto en terreno, y es muy parecido al que mandó Philip. No sé si te acordás que había uno.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí, pero sí. Y además, desde lo visual, si como con esta lógica que está planteando por la situación, sería bacán mostrarles un imaginario visual de una optimización del plan.

[SPEAKER: Nicolás Lundin]: Sí. Pero cómo lo... Ya, habría que darle una vuelta cómo se hace. ¿Cuál podría ser ese caso? Es que hay uno que es en el fondo un poco lo que está diciendo, como: oye, ¿qué pasa si tomas este camino? Vas a optimizar un cinco por ciento haciendo tal cosa. Me acordé de ¿han usado Fintool?

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: No.

[SPEAKER: Nicolás Lundin]: Fintool, cuando tú inviertes, tenía una funcionalidad que te decía: "mira, si inviertes quinientas lucas hoy, le metes cien lucas mensuales, y inviertes a diez años" —te tiraba como un gráfico así— y era un delta, y te decía el mínimo, el esperado, el promedio y el máximo. Ese máximo es el que va arriba, sería como por sobre el plan. Esto es siguiendo el plan, y esto es donde está ahora. Ir como con algo así. Y es muy parecido a eso, pero agregaría una dimensión. ¿Cachás? Porque este es el actual: es como "este es tu plan" y "esta es tu realidad", o sea, tu plan está en azul y te muestran la desviación. Tu desviación está ahí en rojo, negativa, ¿no?

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Exacto.

[SPEAKER: Nicolás Lundin]: Pero ¿qué pasa si yo te digo que no solo puedes quedar en cero, sino que puedes quedar con números positivos? ¿Cachás?

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Claro. Va a pasar.

[SPEAKER: Nicolás Lundin]: Que ahí tomaría el tema de optimizar, el tema de: oye, si ya me cargaste el plan, y dado por lo histórico, dado porque ya sé la atención que tuviste. Y también puede recoger incluso el tema de que para agregar valor, para ver que estas plataformas se hagan relevantes en los usuarios, tiene que pasar dos cosas. Uno, que me permita visualmente cumplir el plan. Dos, que le permita a cada usuario generar valor. Y ahí va un tema de incentivo. Entonces, te acordé que decía, bueno, esta plataforma debería como... no sé si premiar al jefe de turno así, como cuando uno muestra cómo el empoderamiento al mes... como esto debería...

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: ¿Cómo voy con mi KPI? ¿Cómo me evalúan? Que le permiten como mostrarse bacán al jefe de turno, que cuando llegue para pedir que le paguen un bono extra, al final todos se mueven por bonos.

[SPEAKER: Nicolás Lundin]: Opa, gracias a dios. Y este podría mostrar, podría tener algo de eso también, que visibilice los logros del usuario. Sí, que eso no debería ser como poner a pelear a los empleados. No. Que es algo interno, es como "yo voy y como yo sé que me van a evaluar."

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Es como: mira, acá te estoy mostrando lo que se espera de ti, ¿cachás? Que tengas al menos cumplimiento del plan. Y si pasas el cumplimiento del plan y lo dejas en números verdes, bien. En rojo, mal. En verde, ya, ahí está.

[SPEAKER: Nicolás Lundin]: No, y quizás hay ahí extra, ok. Lista de cara a tu jefatura, no a tus compañeros. Sí, sí, definitivamente. En lo que se levantó mucho fue el reconocimiento del turno, de que los usuarios puedan venderse internamente gracias a esta visibilidad. TIMining necesita más reconocimiento de la jefatura sobre todo si lo que dio fue más adherencia y poner al servicio más información para tomar decisiones.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí.

[SPEAKER: Nicolás Lundin]: Y hay otra cosa que no estamos considerando, que estamos hablando de que Core es superinteligente y me da cosas, y casi como que yo no tengo que pensar. Pero también podría entrenarse.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Obvio.

[SPEAKER: Nicolás Lundin]: Y si hay un jefe de turno que es muy experto y tiene mucha experiencia, ve las tres recomendaciones y dice: "¿qué tonto este bueno?, ninguno ni A ni B ni C, tenemos que hacer D." Y Core puede ir asimilando esta información, y al cabo de un año, en vez de empezar a darte A, B, C, te dice la opción D como número uno, porque para ese caso sabe que funciona mejor.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Exacto, o sea, no es que Core tiene la solución, sino que sí tiene una solución, pero también está escuchando y aprendiendo de la mina. ¿Cachás? Y eso es lo que importa.

[SPEAKER: Nicolás Lundin]: Tiene que estar ese concepto. Quedar igual en los casos de uso, por si hay cosas a complementar a cada uno. Tal vez llevar todos los atributos que aparecían cuando ellos iban haciendo un caso de uso: que la plataforma tiene que captar la atención del usuario, operario, y debe ser atractivo y hábil en su output. Tiene que ver también con lo atractivo visualmente y la alerta. Información oportuna y certera, puedo estar seguro que estoy cumpliendo todo eso, lo tengo totalmente contenido.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí. Confianza, tengo la información que falta.

[SPEAKER: Nicolás Lundin]: Exacto. Por Aware. Facilitada, me muestra de manera digerida y simple la información que necesito para reportes.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Ajá. La reportería es un tema que no sé si lo tenemos contenido, pero que también es una pega aparte, y que muchas veces va...

[SPEAKER: Nicolás Lundin]: Sí. Tal vez hay que darle una vuelta con el tema del análisis, una visualización que mostraba ahí como una reportería, pero así como concepto más de análisis de datos, ¿cachás?, y que es como esto. Y esto podría transformarse eventualmente en algún tipo de reportería, no sé.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: No, y que la reportería salía como análisis posterior, ¿o no? Que le sirve al usuario que ellos quieren llegar todo el rato, que es el jefe de mina o el CFO, como a un gallo que está en la oficina y con esto hace su reunión.

[SPEAKER: Nicolás Lundin]: Ya. Sí, vamos a tener que agregar un caso de uso, tal vez, que hable de reportería a CFO.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Exacto. Ya. Estaba escaso ese caso de uso de CFO. Estaba en el anexo de la presentación.

[SPEAKER: Nicolás Lundin]: Después: "él agrega la información que llegue a tiempo real, porque ya no me funciona" —ya lo tenemos con el briefing. Acompañamiento, que mi sistema se hace de todo, me guía la toma de decisiones, me ilumina y me deja tomar decisiones. Ahí como en el copiloto, en algún lado. En mi semáforo de impacto, un cuantificador permanente, me autoriza mis tareas, acciones de impacto autorizadas para poder tomar decisiones. Es como un personal trainer, me exige impacto, me muestra mi movimiento, me pide siempre más optimizar, me da la recomendación de qué acción tomar, me busca, me evalúa, posible... Como que alguien que está siempre llevándote al siguiente nivel a mejorar. Evalúa el impacto de cada decisión, identifica nuevas acciones, etcétera. Es como un ONEMI, me anticipa, alerta basado no solamente en el usuario directo, sino en todo lo que podía impactar. No solamente me da recomendaciones, sino que me informa de cuál es mi siguiente tarea.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Ya. Es un poco...

[SPEAKER: Nicolás Lundin]: Pero el tema de la anticipación, además de que puede ser basada en cómo funciona la mina o cómo se comportan estos equipos, también puede tener que ver con época del año.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí. Clima.

[SPEAKER: Nicolás Lundin]: Sí. No sé si se viene, como, este año viene el fenómeno del Niño, y ahí vienen unas lluvias fuertes y pueden haber inundaciones en la mina, anticipamos. También eso importa. Tenemos que tenerlo en consideración. Esto es lo que tiene que decir, porque había un caso que era como el Northstar. Entonces, esto lo pusimos así. Los seis casos anteriores son el camino y esto es el destino. Cada x minutos, el sistema analiza la situación completa de la mina sin intervención humana. Omnisciente y proactivo. Percibe todo, escala solo lo relevante. Simulaciones buscan el óptimo global, no el mejor local, sino la mejor para toda la operación. Time Sight, Foresight. Y después, haz esto, pasa eso, gerencia primero a personas, pero a futuro a máquinas.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí. Esto lo dijo Carlos, que es machine-to-machine. ¿Cómo se necesita más mi RPA, o cuándo?

[SPEAKER: Nicolás Lundin]: Exacto. O sea, básicamente... Porque está todo orientado al operario: "oye, mandé cuatro palas a mantención, pero no me preguntaste." No, pero es que cargaron las palas a mantención. Tiene que ser que quizás tienes una fase de configuración donde le dices: "ya, si la pala está a diez días de mantención, enviarla obligatoriamente", y el sistema lo cumple. Te pregunta porque tú le pusiste ese arreglo al principio. Te dice: "oye, habías puesto esta regla, la cumplí. Ahora sí va a irse." ¿Cachás? Ya. Entonces esto más lo que estábamos hablando de cómo no solo llenas el plan minero, sino que lo haces más uno.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí.

[SPEAKER: Nicolás Lundin]: Y esto es lo que te iba a mostrar, que es donde estamos, porque esto igual está importante que lo conversemos. Esto es en base al plan, la hoja de ruta de Idemax. La presentación de hoja de ruta de Idemax. Ya. Nosotros ya estamos en la etapa tres, que es de la semana cuatro en adelante, ¿ya?

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: ¿Así han pasado como cuatro semanas? Sí. Creo que sí, justito. Tres. Tres y media.

[SPEAKER: Nicolás Lundin]: Ya pasamos a la etapa dos, donde hay casos de uso y usuario. Pero hay un problema acá, que está parcial, porque no hay entrevistas con usuarios, ¿ya? Entonces está como en... ¿Ya? No estoy diciendo, o sea, idealmente, obviamente, entrevistas como serie es lo mejor. Si no hay entrevistas con usuarios, por último, qué sé yo, una...

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: No, hay algunas igual. ¿Sí? ¿Tiene los operadorcitos ahí? Ya.

[SPEAKER: Nicolás Lundin]: Creo que igual es un punto importante. Es para validar todas estas ideas, ¿cachás? No. Obviamente los casos como ya, entonces, volvamos a tener una entrevista interna con el que tiene contacto directo con el usuario como... Pero igual hay un punto seguro que estamos viendo como... Ahora, ¿cómo entrevistamos a un jefe de turno? Peludo igual, ¿no? Que ella proponía, que era partir por los que eran más fácil de acceder, que es a los ex-empleados que ahora trabajan en clientes.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Igual están un poquito secados, ¿no? Están un poquito secados.

[SPEAKER: Nicolás Lundin]: Secados, pero tienen un pie en la otra área. Ya.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí, pero igual, eso es mejor que nada.

[SPEAKER: Nicolás Lundin]: Eso es mejor que nada, pero la idea sería, si nuestros grandes usuarios es un CFO, un jefe de mina, un jefe de turno, yo estoy empujando eso. Ya, sí, está. Pero es un riesgo a mitigar, ¿ya? Y estamos acá, porque ya estamos con los pilares definidos, estamos con bueno, tirando líneas, y yo creo que Ale no te la locura que se mandó Gemini. No te la mostró, no sé. Se los mandé en el chat, creo que sí. No sé. No se los mandé solo a Ale, porque era muy... Pero espérate. Más cantidad. Es que Gemini es así: "oye, sí, está superbuena. ¿Te hago un prototipo de esto?" Yo: "a ver, llévale, en base a los benchmark y todo." Y los pilares de diseño que había hecho —que no son lo que estamos viendo ahora, es la versión de Gemini de la semana antepasada— espérate, dónde lo dejé. Tengo demasiadas carpetas. Dame un segundo, lo encuentro tiro. Acá está: TIMining Core Prototypes. ¿Tengo que correr algo para que funcione? Creo que sí. Dame un segundo.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: [incomplete — comentario inaudible mientras Nicolás busca el archivo]

[SPEAKER: Nicolás Lundin]: Ay. Yeah. Me dio el taller, es lo que había que hacer, eso nomás. Muy fácil. Oye, Nico, o sea, por lo que hemos estado conversando, uno, que esto... Acá hay un camión. Acá hay tu camión. Te da info de los elementos del mapa, te muestra uno que está con un desvío. Autorizar desvío. Mantener para actualizar. Bueno. Y esto lo hizo, yo no se lo pedí, lo hizo solo en base a montón de información que tenía en el contexto de todas las cosas que le pasé. Y acá tiene como una para ver más o menos cómo es lo que está pasando, y una proyección de una hora en adelante aquí. Básicamente, esta es como una idea de cómo se va a desviar a futuro.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Buenísimo. Está bueno.

[SPEAKER: Nicolás Lundin]: Es que estos calles son muy, como desde el, ¿cómo lo vendemos?, estas cosas han sido como más high en... Oye, es que incluso desde que estamos vendiendo esto como consultores: es muy distinto diseñar para el noventa y cinco por ciento de clientes o de productos, que hablan a un mismo usuario en general, versus TIMining, donde que tenemos que hablar a múltiples usuarios con múltiples necesidades desde la misma plataforma. Entonces, como esto se empieza a complejizar en la medida que ahora le agrego un segundo... Sorry, un segundo.

Entonces, tú puedes correr con estas vistas por usuario, ¿cachás? Es que creo que en realidad no es que tengan múltiples usuarios. O sea, tienen montón de usuarios, sí. Pero las necesidades están agrupadas igual. Yo... hay una necesidad de control de la mina, de gestión táctica. Hay una necesidad de gestión estratégica, de cómo van los reportes, ¿cachás?, y eso puede ser diferentes gerencias en el otro puede ser diferente, puede ser un jefe de turno, pero también puede ser autorizando, tiene que llegar a un tipo de usuario.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Gerente de... perdón, jefe de turno.

[SPEAKER: Nicolás Lundin]: Que otro día, si se le llega otro tipo... No, o sea, claro, claro, definitivamente. O sea, esto estaba pensado definitivamente en el jefe de turno. Pero eso se podría manejar, y no necesariamente esto es solo, o sea, esto es en el dashboard, en el iROC. Definitivamente, esto es ahí. No es como que soy un gerente y me meto a una plataforma a ver esto, no tiene ningún sentido. Pero el gerente se mete y ve analytics, que acá no existe, pero se mete a analytics y ve como "tanto en el último turno, cómo va versus el plan, los últimos turnos del mes cómo fueron, ¿cómo...?" ¿Cachás? Un poquito como el big picture.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Oye, Nico, ya, pero la raspa, pero mira, ahora...

[SPEAKER: Nicolás Lundin]: Ya, cerramos esto. Toda la información, listo esta área. Uno, tenemos que traspasar todo esto a la presentación. Actualizar la presentación que tenemos.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí. Ahí como tú te diste la información, sabes dónde está, traspasas, como me haces algo de datos, yo te doy apoyo en traspaso.

[SPEAKER: Nicolás Lundin]: Ya. Bien. Ser rápidamente fácil, porque tú igual tienes como una estructura parecida. Es la misma estructura, es pasar el texto de los casos unificados y resolver el tema de los referentes que hablamos recién. Claro. Cómo los mostramos mejor. Entonces voy a trabajar. Pero los referentes serían en la diapositiva de caso. Mira, volvamos a la diapositiva. Serían dos cosas: en la diapositiva de caso, hacer lo que no hicimos de tener referentes para cada una de las etapas.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí, por columna, por cada...

[SPEAKER: Nicolás Lundin]: Simplemente las o en el caso, en verdad, lo importante es mostrar el de dos y la medicina, o sea, ¿no?

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí.

[SPEAKER: Nicolás Lundin]: Y, además, en la siguiente, para cada uno de estos casos, los referentes. ¿Cierto? Sea, perdón, no. Esta, y además en la anterior la siguiente, que es el mockup. Claro, el mockup va después. O sea, primero te presento como el caso, que tiene que estar mejor relatado, el contexto y el flujo, y por cada punto del flujo hay un pilar aplicado con referente. ¿Cachás? Entonces en la detección, referente A, en el análisis, pilar, ¿cachás?, y así. Eso, por cada pilar de la experiencia ya tenemos tipo de referente.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí. Y podemos poner, no sé, tal vez un par de las lentes, pero que sea visual. Es que no va a caber poner imágenes acá, pero tal vez podríamos ir por aquí, no sé.

[SPEAKER: Nicolás Lundin]: Déjame ver cómo lo hago, ¿ya? Pero yo esto lo pasaría a la presentación, lo mostramos desde la presentación, porque después no la van a venir, está...

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí, sí, sí, lo lo pasamos, sí.

[SPEAKER: Nicolás Lundin]: Ya, para mí era más fácil hacerlo así, porque ya tenía la presentación armada de antes.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Ok. ¿Ya? Entonces, ¿tú podrías repasar esta presentación?

[SPEAKER: Nicolás Lundin]: Sí. Yo me hago cargo del traspasar los casos, los pilares de diseño, y los mockups con los referentes, y el benchmark. El benchmark. Y faltaría agregar el otro caso que hablamos de cómo mejoramos el plan minero. Y reportería. Y también reportería, no sé si lo podemos meter nosotros entonces.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Es que ya existía porque es el CFO. Sí, se habló en el workshop. Yo me acuerdo que se habló en el workshop que había...

[SPEAKER: Nicolás Lundin]: Ya, pero el CFO ve en una reunión "oye, vamos bien." Y lo levantaron como nuevo. Pues, entonces, además de los casos que tienes acá, serían dos más: el del CFO, que existe y que hay que meterle el mockup de la reportería. Y el del mejoramiento del plan, optimizar el plan.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Ya, dale, yo me encargo de eso.

[SPEAKER: Nicolás Lundin]: Y en realidad esta segunda pantalla está buena, la del mockup, pero creo que igual podría ser un poco mejor. Voy a darle una vuelta. Tal vez los referentes van acá en la segunda pantalla, no sé, voy a revisar. Eso, darte información. Pero creo que va como lo que tenía, no sé.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí. Ah, y luego lo voy a... Perdona, el... ¿Te gustaría hacerlo por ahí? ¿Lo metería ahí? Ah, no, si esto esto, ni siquiera quería mostrárselo a nadie, y sin querer se lo mostré.

[SPEAKER: Nicolás Lundin]: Pero, ah, ya, bueno, era como interno. Es que siento que es muy pronto mostrarles algo así, como que habría que...

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: No, yo creo que, o sea, si esto te permite a ti seguir de ahí, eso es bacán.

[SPEAKER: Nicolás Lundin]: Pero el compromiso de cara a nuestro cliente con ellos, más que tenerles un prototipo de la nueva plataforma, es más bien hacer mockups de wireframe de cómo se podría visualizar el tema en Core. Ya no necesariamente en Crowdstrike o en no sé qué. A partir del jueves, si el jueves les hace sentido, eso es lo que estamos diciendo: los cuatro pilares en el caso aplicado, bla, bla, debería empezar a bajarlo en ya. ¿Cómo se vería? ¿Cómo se verían esos principios de diseño? No necesariamente que es la plataforma, es cómo se vería.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Es que igual es como un poquito prototipo, pero no necesariamente un prototipo interactivo. Sí, puede ser más estático. Y más estático puede ser como pistas parciales de distintas cosas, ¿cachás?

[SPEAKER: Nicolás Lundin]: Sí.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: O pueden ser prototipos de cosas puntuales.

[SPEAKER: Nicolás Lundin]: A eso me refiero. ¿Cachás? Como exacto. Y cómo te vuelve a decir paz en una instancia. Exacto. Que eso puede, a socializar o llevar de vuelta con ellos, pero también a tener como si les hace sentir los principios de diseño aplicados, al contrato, que pase a eso. Nosotros quedamos con la chance de poder ir a diseñar. Y que pase eso paralelo. De hecho, yo el jueves, justo cuando se tenía ese workshop, me cita Ana a ver si fuera de comunicaciones, si es que le hace sentido esto. ¿Cómo esto también ya se puede empezar a comunicar?

Oye, y el jueves, ¿vas tú, vamos los tres? ¿Cómo es el jueves?

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Yo no tengo idea así.

[SPEAKER: Nicolás Lundin]: Tú puedes ir y vamos los dos. Porque Ale no va a estar. El Ale no va a estar, pero sí, como tú dices que vas a manejar los referentes y todo eso, igual obviamente sería bacán ir ahí. ¿Y es ahí mismo y a qué hora es?

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Presencial. Igual que lo acabes. Sí, sí, ah, que te he citado, me lías. Eso, te lo mando el...

[SPEAKER: Nicolás Lundin]: Sí, mándamelo. Es que Idemax al final como que no lo estoy ocupando mucho porque estoy...

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Ya, pero es como de las nueve a las doce, algo así, ¿no? Desde diez a doce, ya. Tu mail?

[SPEAKER: Nicolás Lundin]: En el nlundin. En el nlundin arroba Gmail. Walkedidemax, pero Gmail.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: De diez a doce. De diez a doce. En TIMining, que te voy a ayudar, y en la labor anámbica te voy a mandar.

[SPEAKER: Nicolás Lundin]: Sí, sí, no, sí, me acuerdo. Sí, no hay problema. Ya, entonces sí me llegó. La voy a aceptar. Nico, ¿tú podrías hoy durante el día dejar traspasada la presentación?

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí. Definitivamente.

[SPEAKER: Nicolás Lundin]: Haga, gracias. Y ahí, si es que necesitaba, dice que iba sacar... Lo dejo y te aviso para que mañana lo revisemos, ¿cuánto lo? Empiezo mañana a dos por... Y yo mañana me interesa tener hoy poder revisarlo y mañana pinponearlo. O sea, hacerme el espacio, decir que es importante.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Ya, sí. Tener sí o sí un mañana en la tarde.

[SPEAKER: Nicolás Lundin]: Vale. Para quedar como superclaro de cara al... ¿la clínica? ¿Ah? Es que me lo hago al tiro. Sí, pero remoto. Sí, remoto, y cortitos. Media hora conversamos, lo revisamos y si falta alguna cosita, la que podamos hacer antes del jueves, lo agregamos.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: ¿Y media? Sí. Ya, pero ¿estás ok con lo que tenemos? Que ir con lo que tenemos, como lo que yo lo que hemos conversando, y creo que nuestra manera ha de ser información. ¿Sí? No hace sentido. Tú, tranquilo, con el...

[SPEAKER: Nicolás Lundin]: Sí, yo... Del WhatsApp. Uno al que vamos a tener ahora, como íbamos con algo más. A Teresa ahora, y esto, ¿va? Porque acá ella viene de vuelta a nuestro punto de vista consultivo, como: "mira, creemos que el camino es basarnos en su potencial, estos cuatro pilares, el coherente en esto, articular estas." Validémoslo con ellos el jueves y, como te digo, la preocupación va por el tema de los usuarios, lo de las entrevistas con usuarios reales. No por levantar más información, sino por validar la que ya está. Obviamente van a haber cosas repetidas y obviamente van a haber cosas que tal vez estén en conflicto con lo que se habló en el workshop, y ahí tal vez tomar alguna decisión. Si entrevistas a cinco usuarios y de tres de cinco te dicen que no es A sino es B, igual es, pesa más que lo que dice el CEO, ¿cachás? El CEO puede tener una visión, pero también, si tus usuarios no están de acuerdo con tu visión, no hay peludo.

Esto mismo, incluso, si se aprueba el jueves, da más pie a decir: "oye, ya, pero ahora esto tenemos que ir a validar." Porque si no, porque si no, estáis en la misma. Y yo creo que TIMining ha tenido un buen olfato, porque tienen experiencia con, tienen gente que trabaja en minería y han hecho hartas cosas bien, pero también han hecho cosas que no están tan bien. Por eso están en el punto que están. Con esta...

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Y por lo mismo, ¿o fragmentación y lo fragmentado, porque diseñan en base a un cliente y porque son muy llevados a las ideas?

[SPEAKER: Nicolás Lundin]: Salvo el primero, y será muy genio y todo, es que eso lo hace en base a su percepción, ¿cachás? Yo he trabajado también con desarrolladores medio genio y tienen hartos sesgos, creen que ellos son el usuario.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí, eso también tiene que ir pintado así. No, no.

[SPEAKER: Nicolás Lundin]: Y quizás sí tienen que soltarlo. Pero lo importante, lo que le hará valor al otro... Es que tal vez tiene razón, pero tienes que validar. Ahora, no hay que validar todo, pero hay que validar algo, ¿cachás? Porque si no, de verdad, puede que hayan tomado requerimientos de clientes de desarrollar herramientas internas en sus productos, que sí resolvían un problema, sí tenía unos problemas ese cliente, pero tal vez ellos implementaron se desvió en el camino, por temas técnicos, por temas de gestión, y porque no hay diseño. O sea, no hay un equipo de diseño.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Bueno, porque lo, todo este opus que nosotros estamos haciendo, debería, a su vez, ser el input del nuevo input de diseño lo que hagan, ¿sí? O sea, todo lo que hagan debería ser quality, y lo que hagan debería ser...

[SPEAKER: Nicolás Lundin]: Lo que, pero por eso es importante la etapa que viene, de cómo la... porque una cosa es que nos digan "bueno, haz mucho, dedito arriba, Clear Path", pero después se pierden al bajar el Clear Path. Entonces, como no hay un criterio común hoy por diseño, cada uno está haciendo el más clip art que creen, pues no es que lo estén complejizando por querer, es porque no saben cómo.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Es que lo que... sí, por eso hay que alineamiento de qué significa un Clear Path.

[SPEAKER: Nicolás Lundin]: Ya. Bueno que lo mencionas, porque yo creo que ya, vi en la consultoría y les damos los lineamientos. Y ok, hasta aquí llegamos, que les vaya bien. Hablé con ellos seis meses después y no implementaron nada. O cada uno entendió su...

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Exacto.

[SPEAKER: Nicolás Lundin]: Entonces, creo que igual hay que dejar tirada la idea, es decir: "ok, todo está superbién, esperarse a ustedes, quieren tomárselo en serio, recomendaciones. Inviertan en un sistema de diseño y que pueda reutilizarse a través de esos productos, ¿cachás? O sea, que los componentes del sistema respiran Quiet UI, ¿cachás? Y no están inventando cosas. Si pueden inventar módulos, pero con las piezas del sistema." Así yéndolo, llevándolo a la futurología... Yo les mencioné, no sé si les mencioné al principio, pero mi expertise es en sistema de diseño. ¿Ya? Yo he trabajado en mis últimas pegas full en sistemas de diseño, a cargo de equipos de diseño, haciendo yo el sistema de diseño, con equipos de desarrollo, con equipo de diseño, ya.

Los sistemas de diseño están un poquito muertos con la IA en estos momentos, porque el sistema de diseño era una sobrecomplejización de un problema que existe realmente: que es cuando yo diseño, hago cosas en estático, después se lo paso a un desarrollador. El desarrollador hace otra cosa, y después tengo que estar validando qué es lo que hizo el desarrollador con la idea original que yo hice. Este modelo era como el puente entre esas dos cosas. Pero con la IA, se abren unas oportunidades para que el sistema de diseño no sea como "necesito un equipo de diseñadores, cinco diseñadores armando el sistema de diseño durante seis meses, para tener sistema de diseño, y que después cada vez que se diseña una pantalla se chequea con el..." ¿Cachás? Y hay que crear componente en Figma, y hay que después pasarlo al desarrollador, hay que implemente el componente... No, ese workflow está muriendo.

Entonces sí se pueden hacer, ¿no?, como diseños líquidos o diseñados para la IA, para que después ellos puedan programar, y cada vez que programen con IA, si es que no lo, yo creo que lo están haciendo, porque si tienen un agente team, es porque ya están programando con ellos en algún punto.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Lo han planteado que tienen interés, o sea, quizás todavía tienen una brecha grande, pero la empresa sale todo el rato.

[SPEAKER: Nicolás Lundin]: Pero tú podrías tener como un set de agentes que te ayudan a crear productos en base a estos pilares, ¿cachás? Y que no se salen de esos pilares. Y no necesitas tener el sistema de diseño en Figma y tener un diseñador como todo el rato documentando qué hace, qué no hace, cuáles son los estados. Eso puede hacerse mucho más... ¿cachás? Pero yo creo que cien por ciento alineado, eso hay que dejarlo anticipado y plasmado. Y además, también por una continuidad que creemos que es necesaria. Pero antes de eso, sí creo que la pega que tenemos que en esta etapa, dejar un peldaño más abajo es: si nosotros, si decimos que, y consensuamos con que los principios de diseño tiene que ver con el Clear Path de no sé qué, ¿cómo se lo bajamos a "oye, un clic como un entendimiento"? ¿Qué es y qué no es? Y quizás un Clear Path no es más de tres recomendaciones, no es más de cuatro...

Estoy inventando, no sé nada.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí, sí, sí. Pero significa dejar reglas claras: "oye, un Clear Path tiene que cumplir con esto y..." Ya. Porque si no, el título por el título...

[SPEAKER: Nicolás Lundin]: No, no, no, hace sentido. No creo que me digan "no, Clear Path no." Por supuesto. Es decir, donde se pierden es que cada uno en su cabeza tiene un imaginario de lo que eso significa. Entonces hay que bajarlo antes. Si es que mañana desarrollan un nuevo plugin o un nuevo filtro, o hacen un producto como el prepaid, ¿cachás?

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí.

[SPEAKER: Nicolás Lundin]: Después, por supuesto, yo puedo acompañar a diseñarle de todo, pero sí tenemos que tener como... ¿Qué qué será? Como... Te acordé que en el, cuando te mostré algo ahí más, el acompañamiento que nosotros prometimos era este manual UX. Entonces el delivery que deberíamos dejar tiene que ver con ese manual UX, y tiene que ver un poco con eso, o por esas reglas de cómo se baja cada uno al principio de ese mes. Y eso era algo que poníamos el mismo jueves: empezar a ya trabajar en eso, aunque sea algo que vamos construyendo.

Y yo creo que en ese manual, además de lo que son como recomendaciones para diseñar la experiencia, es también guidelines para que ellos internamente, a futuro, asimilen que no puedan seguir haciendo cosas por intuición, que tienen que igual hacer validación con usuario, independiente de que tengan los pilares, independiente de que tengan un sistema de diseño, igual necesitas estar constantemente haciendo esta retroalimentación con el usuario, y no preguntarle a la persona que trabaja con el usuario, sino preguntarle al usuario real. Por ella, esa persona —Erika— puede tener un entendimiento, pero igual está sesgada. Y tienen que cortar ese flujo, porque se retroalimentan internamente y no van al usuario real. ¿Cachás?

Y el último punto que también he levantado alto es que ellos todo el rato hablan de la situación "responde a eso", de que, oye, en el iROC veo el cumplimiento del plan minero, pero después tú le preguntas: "ya, ¿y cómo pides eso?" Eso no, también está levantado que no hay KPIs claros. Eso, digamos, también hay que tomarlo de alguna manera.

¿Cómo todo esto? O sea, ¿cómo es que yo tengo mi visión estratégica más clara y la cuño mejor. Yo tengo mis principios de diseño más articulados y más claros. Yo tengo mis casos de uso, mucho mejor embebidos con todas mis definiciones. ¿Cómo eso me lleva a tener...? O sea, porque bacán, quizás el cliente te dice "esto está genial", pero todavía no voy a poder cobrar más ni voy a poder abrir nuevos clientes porque no sé cómo decirle que, efectivamente, tiene un impacto en el negocio. Ahí todavía hay algo que no nos estamos haciendo cargo.

Se me olvidó comentarte que esto no lo tengo pasado, pero ¿cuáles son las preguntas abiertas que quedaron del análisis que hizo el robotito? ¿Cuáles son las economics del modelo? ¿Cuál es el CAC? ¿Cachás? ¿Cuáles son los KPIs que están midiendo? Eso es lo que estamos hablando recién acá.

El tema del benchmark UX, bien, pero tenemos competencia, ¿no? Hay un análisis de cómo TIMining se posiciona versus la competencia. ¿Ellos lo tienen como...? En el workshop salió que ellos tienen las preguntas como "¿dónde se sitúan versus la competencia?" lo tienen. Pero no hay ninguna documentación formal dentro.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Lo tienen, y lo que ellos dicen muy tranquilamente es "somos los mejores en diseño." Quizás el otro tiene un peor diseño, pero quizás sí es capaz de cuantificarle el impacto que genera.

[SPEAKER: Nicolás Lundin]: Pero esa es su... De partida, obvio. ¿Cachás? Entonces ya está secado. Ya está secado. Pero además, no todo pasa por diseño, porque quizás los otros están siendo mucho más hábiles en cuanto al impacto al negocio minero.

Otra es la validación directa con usuarios finales de la mina, eso ya lo hablamos. La otra es bloqueantes técnicos para la migración a core. O sea, nosotros podemos decir "oye, para pasar de siete productos a core, esta es la estrategia ganadora, la UX perfecta, blablablá." Pero después está la parte técnica. Tal vez no puedes pasar a core sin antes hacer una reestructuración del backend porque tienes la cagada adentro, no puedes correr core con lo que está ahora pero va a ser lento, va a tender al error. Entonces tal vez hay un tema técnico ahí, que igual si es que no nosotros no es nuestro dominio, pero se lo dejamos igual levantado en el informe. Como "aquí hay que levantar los riesgos y ver un plan de migración."

Y lo otro es que no hay estándares de accesibilidad, porque ya, ok. Estoy en la mina, estoy en terreno, con un tablet o el teléfono, ya, igual ahí hay condiciones. Pero también son gente que trabaja en mina que lleva mucho tiempo, con movimiento de edad. Segmentos de edad que usan lentes, ¿cachás? Y eso no está...

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Exacto, esa capa no está rescatada de ninguna parte.

[SPEAKER: Nicolás Lundin]: Entonces, igual se levanta conectividad. Yo no sé cómo funciona, porque nosotros todos estos, si bien son mockups de imaginario, es todo muy... nadie es como "me llega el pantallazo, WhatsApp."

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí, yo creo que se levantaría bien con usuarios finales de mina. Quizás como loco no tengo WhatsApp, lo único que tengo es un walkie-talkie. Yo tengo entendido que el norte, por el tema de minas, Entel tiene como muchas antenas, y por eso cuando uno va a La Serena, si tenía Entel te anda bien. Esas son condiciones habilitantes, porque si no hay que cambiar cómo se plasman los principios. No sé cuál es la realidad de un tajo abierto en cuanto a conectividad. Tal vez es superbuena, tal vez es precaria. Y quizás solamente el dashboard lo pueden tener en la sala de control que hay WiFi, pero cuando sale en el camión, no, no sé.

[SPEAKER: Nicolás Lundin]: Sí. Pero eso es parte de lo que hay que identificar y entender. Cerramos. Cerramos. Cerramos. Nos vemos mañana en la tarde a revisar la presentación lista. Y cualquier cosa, estemos con canal abierto hoy día o mañana, antes de eso, si es que hay dudas o... Yo fui dejando un par de comentarios en la presentación de las cosas que estoy viendo.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Ya. Dale.

[SPEAKER: Nicolás Lundin]: Voy a hacer un resumen a ver si nos pasa alguna cosita. Pero hay que ver. Lo hablamos mañana. Hay que ver cómo metemos —y quizás es parte de las preguntas como a dejar tirar sobre la mesa— el tema del impacto en el negocio, ¿cachás?, como a la codificación. La medición de impacto de toma de decisiones como modo de cambio. ¿Ahí lo que te está diciendo, que tú también lo tenías en las preguntas no resueltas?

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Ah, ya. ¿Cómo cuáles son las métricas que estoy usando para ver si mi cuestión realmente está...? Si todo es mi premisa, ese cumplimiento del plan de enero, ¿cómo sabes que no te lo estás cumpliendo?, ¿cómo sabes si realmente es o no...? ¿Cómo mides tu valor en el cliente?, porque todo esto es porque quieren más clientes que quieren cobrar más.

[SPEAKER: Nicolás Lundin]: Sí, habían dicho todo es un tema de diseño, de cómo iluminas la alerta. Oye, hay que dar cuenta del valor. Mira, había un insight acá que hablaba de eso, que es el CEO en el documento de oportunidad de repricing. Sí, porque si genera más de seis millones en valor capturado, esos son seis millones de dólares. Un cost de cien mil al año, está totalmente validado. Págame trescientos mil y ahórrate seis millones en un año. ¿No hay una correlación entre el valor que agrego y el precio que cobro?

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí. Pero porque no son capaces de transmitirle eso al usuario, o porque quizás hablan...

[SPEAKER: Nicolás Lundin]: Es que ahí es donde también tienen como desorden, porque quizás se lo venden al jefe de la mina, y quizás tienen que vendérselo al corporativo, no sé, ¿cachás? Y quizás esto les tiene que dar herramientas para venderlo más arriba y cobrar más caro. Lo que hablas tú, porque ahora es muy bottom-up, pero tiene que ser también top-down.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Deambulada, letra A.

[SPEAKER: Nicolás Lundin]: Ya, ¿ya? Pero estamos, sí. Perfecto.

[SPEAKER: otros participantes (Alejandro/Camila/Hugo)]: Sí. Que lo que decían ellos también, como eso, el gran problema ha sido, Carlos como hoy diseñan, tan feature-based en base a cada cliente que, ah, mi cliente Nico me está pidiendo que ahora le cambie los camiones de color, y el equipo entero está trabajando un mes cambiándole los camiones de color y nunca nadie le cobró algo más. Ahora quiere una nueva vista que me diga no sé qué. ¿Cómo este sistema modular permite decir: "oye, si te meto una nueva cajita, bacán, te la desarrollo feliz con estos frameworks, pero tiene un precio también"?

[SPEAKER: Nicolás Lundin]: Eso que estás diciendo no es un problema solo de TIMining, es un problema de cualquier software, y la estrategia basada en negocio es que yo, como equipo de producto, tú eres el que vendió, y me dices "oye, hay que hacer esto." Digo: "ya, ok, pero yo te voy a cobrar. Yo te voy a cobrar las horas de mi equipo, porque voy a dejar de trabajar en bug fixes, de trabajar en performance, para hacer eso." Entonces todo cuesta, no sé, quince mil dólares, esto que le vendiste a tu cliente, lo dejo cobrar, ¿cachás?, internamente. Y esa es una forma, es una estrategia, porque hay que pensar en esas cosas, pues, no son gratis. Y es parte de esa venta consultiva: yo te puedo estar y feliz vamos viendo juntos qué nuevas cosas necesitas, pero que como no lo plantean desde el inicio, ¿no?, después no se te vaya a cobrar, [incomplete — transcripción cortada abruptamente, cierre de reunión no capturado]
