# Research Brief
> Actualizado por /analyze incremental el 2026-02-26
> Basado en 47 insights de 60 fuentes (1451 claims) — incluye sesión interna IDEMAX 24-feb (debrief Touchpoint, validación Felipe Reyes, priorización pilares)
> 3 insights PENDING: IG-23 (Omni Sense prioritario), IG-24 (relación pilar-dominio asimétrica), IG-25 (validación externa Felipe Reyes). Los 3 son [INTERNAL] — requieren corroboración primaria.

## Lo que está roto

**El Jefe de Turno en terreno no puede interactuar con el sistema.** Manos en volante, radio saturada con 3 solicitudes simultáneas, normativa Sernageomin en PDF en la oficina a 20 minutos de distancia. El software actual requiere pantalla y teclado — el usuario en berma no puede consultar, priorizar ni responder en paralelo [IG-21]. "No necesita un manual — necesita una respuesta directa, manos libres."

**Los usuarios abandonan la herramienta porque no la entienden.** Los tiempos de actualización de datos son confusos — GPS en tiempo casi real, mapas de calor con 3 horas de desfase, indicadores cada 30 minutos, topografía cada 15 minutos — y nadie les explica por qué ven datos "viejos" [IG-SYNTH-03]. Se perdió un cliente porque las métricas de extracción estaban a 24 horas cuando los mineros evalúan por turno. El resultado es claro: "llegamos, capacitamos, se entusiasman, pero luego no le entienden, adiós."

**Orchestra tiene un 30% de uso real.** Los ingenieros de mina no tienen tiempo para aprender una herramienta compleja porque "trabajan en mina, constantemente reagendan" [IG-SYNTH-11]. La capacitación inicial no alcanza para una interfaz con múltiples capas. La nomenclatura misma del producto requiere un experto para entender.

**El "Auto de Homero Simpson" amenaza al producto.** Cada cliente pide funcionalidades, se implementan sin validar uso real, y el producto resultante no funciona bien para nadie [IG-SYNTH-02]. Todo 2025 fue dedicado a customización para un solo cliente. El riesgo es existencial: un producto con demasiadas funcionalidades que nadie usa bien.

**Los sistemas internos no se hablan entre sí.** El stack tecnológico está fragmentado (C++, Unity, Go, Python, web) sin autenticación unificada [IG-SYNTH-13]. Para conectar Orchestra con sistemas web se recurre a descargar bases de datos y hacer cruces manuales. El estado "plug and play" prometido no se cumple.

## Lo que podría ser mejor

**De dashboards a copiloto operacional.** La visión más ambiciosa de TIMining es pasar de pantallas que el usuario debe interpretar a un sistema proactivo que anticipa problemas y sugiere soluciones [IG-SYNTH-04]. El workshop imaginó un sistema que cada X minutos corre simulaciones y envía sugerencias rankeadas — "de problemas a soluciones en minutos, no horas."

**Democratizar la inteligencia.** Hoy se necesitan expertos en SQL para entender qué pasa en la mina. Con TIM Agent (alianza con Google Gemini), cualquier supervisor podría preguntar en lenguaje natural y obtener respuestas ancladas en datos reales, sin alucinaciones [IG-SYNTH-08]. La meta es pasar de usuarios expertos a 100+ usuarios activos por sitio.

**Gestión por excepción.** Los usuarios no quieren más datos. Quieren que la mina "les hable cuando los necesita" [IG-SYNTH-07]. Si hay 50 camiones bien, no mostrarlos — mostrar los 5 que generan problema. Las alertas deben ser legibles en menos de 5 segundos ("Glanceable Intelligence").

**Repricing basado en valor.** Aware se vende a USD 300k/año pero genera USD 6M+ en valor capturado por faena [IG-SYNTH-16b]. Hay una oportunidad de realinear el precio (target CORE: USD 450k) con el valor real entregado, pasando de "licencia de software" a "valor empresarial."

## Lo que funciona bien

**La "Geometry Gap" es real y TIMining la resuelve.** El algoritmo propietario de inferencia topográfica en tiempo real — actualizando la geometría cada 15 minutos usando solo datos GPS, sin drones — es un diferenciador técnico validado sin competidor conocido [IG-SYNTH-01]. Los resultados son concretos: +9-19% adherencia espacial, USD 10M+ en ahorros en 3 minas [IG-SYNTH-12].

**El "Efecto Suiza" es un posicionamiento fuerte.** En una industria donde los líderes forman un oligopolio de "super suites" con lock-in, TIMining funciona como integrador neutral — OEMs competidores integran rutinariamente con TIMining incluso cuando no integran entre sí [IG-SYNTH-05].

**La adopción bottom-up genera stickiness.** Los patrones de uso diario muestran que Aware se embebe en rutinas de cambio de turno, generando tracción interna que acelera acuerdos corporativos [IG-SYNTH-17]. Más de 100 usuarios activos mensuales en un solo sitio Codelco.

**El patrón Detección→Análisis→Recomendación está validado.** Las 20 láminas del workshop siguen una estructura idéntica confirmada por los propios usuarios [IG-SYNTH-06]. Este patrón es el esqueleto natural de CORE.

**Las decisiones operacionales viven en WhatsApp, no en TIMining.** Carlo (CTO) reveló en el Touchpoint que "impresionante la cantidad de toma de decisiones que ocurren día a día en la operación, vía WhatsApp" — TIMining pierde el 90% de la información si no integra ese canal [IG-03]. La brecha no es de UI sino de canal: el operador ya tomó la decisión y se fue, sin que el sistema la registrara. En la sesión interna post-Touchpoint, el equipo IDEMAX identificó Omni Sense como el pilar más crítico precisamente por esto: si el sistema no está donde el operador ya trabaja, no existe [IG-23].

**La relación pilares-dominios no es una grilla simétrica.** Al mapear los 4 pilares de diseño contra los 4 dominios operativos, el equipo descubrió que no todos los cruces tienen el mismo peso: "Quiet UI en respuesta a crisis es evidente, pero Quiet UI con asistencia inteligente no pega mucho" [IG-24]. Esto implica que el diseño debe priorizar los cruces pilar×dominio de mayor impacto, no intentar cubrir los 16 por igual.

**Primera validación externa parcial: Felipe Reyes.** Sin mostrarle los dominios operativos, Felipe Reyes (profesional minero externo) los validó de forma independiente — "le ven mucho valor a incorporar la mirada espacial, sensorizar el yacimiento, tener cerebro para toma de decisiones" [IG-25]. También enfatizó la necesidad de traducir el valor a lenguaje financiero (costos, EBITDA) para CFOs. Esta es la primera señal externa, pero aún reportada de segunda mano — necesita entrevista directa para confirmar.

**Los operadores pueden resistir la herramienta.** Carlo también reveló que cuando planificación usa TIMining para auditar a operadores, estos resisten activamente [IG-04]. Si el modelo bottom-up requiere que el operador perciba el tool como ayuda propia (no herramienta de control), CORE necesita diseñarse con esta tensión en mente [CF-13].

## Tensiones clave

**"Paz mental" como nombre** [CF-12] — Philip (CEO) cuestionó el nombre en el primer Touchpoint formal: "puede ser correcto pero es muy abstracto — prefiero algo relacionado con tiempo/eficiencia." El concepto es válido, el framing es debatible. Resolver en Etapa 2 con usuarios reales.

**Operadores como auditados vs. como usuarios** [CF-13] — El modelo de adopción bottom-up (IG-SYNTH-17) asume que los operadores adoptan voluntariamente. La realidad revelada por Carlo (CTO) muestra resistencia cuando la herramienta se percibe como control. Resolver con entrevistas de Etapa 2.

**Customización vs escalabilidad** [CF-05] — No hay definición formal de dónde termina la "configuración" (cambiar umbrales) y empieza la "customización" (desarrollar features nuevos). El mismo COO usa el término para ambas cosas. Mientras no se resuelva, el riesgo del "Auto de Homero Simpson" persiste.

**3D: ¿agrega valor o no?** [CF-02] — En el mismo workshop, el equipo dijo STOP "3D no agrega valor" y KEEP "visualización de la mina completa." Mientras tanto, el design brief define el visor 3D como uno de los 4 lentes del producto. Hay desacuerdo no resuelto.

**Confianza del CTO vs realidad de uso** [CF-03] — El CTO está confiado en que el diseño está por encima de la competencia. La evidencia muestra 30% de uso en Orchestra, abandono por confusión y pérdida de clientes. Ambas perspectivas pueden coexistir, pero necesitan un benchmark externo para objetivar.

**CORE vs Aware: ¿qué es exactamente CORE?** [CF-06] — No hay definición explícita de si CORE reemplaza, envuelve o renombra Aware. El design brief pide diferenciación, pero las capacidades se superponen casi completamente.

**Minería subterránea: ¿foco o no?** [CF-04] — El COO dice "no es foco" (enero 2026) pero el roadmap la incluye como expansión 2026. Puede ser diferencia entre ventas (hoy) y producto (futuro), pero necesita clarificación.

## Brechas de evidencia

1. **Sin voz directa del usuario final** [CF-07] — Todo lo que sabemos sobre usuarios viene de stakeholders internos. Las necesidades de mineros, despachadores y jefes de turno son inferidas, no observadas. **Prioridad: crítica. Philip tiene contactos directos y puede facilitar acceso — siguiente paso acordado en Touchpoint.**

2. **Sin datos financieros detallados** [CF-08] — Las decisiones de pricing y modelo de negocio se basan en cifras anecdóticas, no en unit economics. **Prioridad: alta.**

3. **Sin benchmark competitivo externo** [CF-09] — Los claims de unicidad y diferenciación son autorreferenciales. **Prioridad: media.**

4. **Sin validación técnica de factibilidad CORE** [CF-11] — La arquitectura de 8 capas y la visión multimodal no tienen input del equipo de desarrollo sobre viabilidad o timeline. **Prioridad: alta.**

5. **Sin datos de accesibilidad** [CF-10] — Los requisitos de uso en terreno (sol, guantes, polvo, radio) no están documentados formalmente. **Prioridad: media.**
