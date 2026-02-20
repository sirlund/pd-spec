# Research Brief
> Auto-generado por /analyze el 2026-02-20 (incremental)
> Basado en 36 insights de 58 fuentes (1332 claims)

## Lo que está roto

**Los usuarios abandonan la herramienta porque no la entienden.** Los tiempos de actualización de datos son confusos — GPS en tiempo casi real, mapas de calor con 3 horas de desfase, indicadores cada 30 minutos, topografía cada 15 minutos — y nadie les explica por qué ven datos "viejos" [IG-SYNTH-03]. Se perdió un cliente porque las métricas de extracción estaban a 24 horas cuando los mineros evalúan por turno. El resultado es claro: "llegamos, capacitamos, se entusiasman, pero luego no le entienden, adiós."

**Orchestra tiene un 30% de uso real.** Los ingenieros de mina no tienen tiempo para aprender una herramienta compleja porque "trabajan en mina, constantemente reagendan" [IG-SYNTH-11]. La capacitación inicial no alcanza para una interfaz con múltiples capas. La nomenclatura misma del producto requiere un experto para entender.

**El "Auto de Homero Simpson" amenaza al producto.** Cada cliente pide funcionalidades, se implementan sin validar uso real, y el producto resultante no funciona bien para nadie [IG-SYNTH-02]. Todo 2025 fue dedicado a customización para un solo cliente. El riesgo es existencial: un producto con demasiadas funcionalidades que nadie usa bien.

**Los sistemas internos no se hablan entre sí.** El stack tecnológico está fragmentado (C++, Unity, Go, Python, web) sin autenticación unificada [IG-SYNTH-13]. Para conectar Orchestra con sistemas web se recurre a descargar bases de datos y hacer cruces manuales. El estado "plug and play" prometido no se cumple.

**Las decisiones críticas ocurren fuera del software.** Una cantidad "impresionante" de decisiones operacionales se toman por WhatsApp y radio — y no quedan registradas [IG-SYNTH-23]. Un jefe de turno redirige camiones y mitiga 30% más de impacto al plan, pero ese conocimiento se pierde en el cambio de turno. CORE debe ser el hub donde estas decisiones quedan registradas.

**Los incentivos no estimulan la optimización.** Los bonos premian cumplir el plan conservador (100 unidades), no explotar el potencial real (150 unidades) [IG-13]. Esto genera un desalineamiento entre lo que el software puede mostrar y lo que los usuarios tienen incentivo de hacer.

## Lo que podría ser mejor

**De dashboards a copiloto operacional.** La visión más ambiciosa de TIMining es pasar de pantallas que el usuario debe interpretar a un sistema proactivo que anticipa problemas y sugiere soluciones [IG-SYNTH-04]. El workshop imaginó un sistema que cada X minutos corre simulaciones y envía sugerencias rankeadas — "de problemas a soluciones en minutos, no horas."

**Democratizar la inteligencia.** Hoy se necesitan expertos en SQL para entender qué pasa en la mina. Con TIM Agent (alianza con Google Gemini), cualquier supervisor podría preguntar en lenguaje natural y obtener respuestas ancladas en datos reales, sin alucinaciones [IG-SYNTH-08]. La meta es pasar de usuarios expertos a 100+ usuarios activos por sitio.

**Gestión por excepción.** Los usuarios no quieren más datos. Quieren que la mina "les hable cuando los necesita" [IG-SYNTH-07]. Si hay 50 camiones bien, no mostrarlos — mostrar los 5 que generan problema. Las alertas deben ser legibles en menos de 5 segundos ("Glanceable Intelligence").

**Automatización progresiva, no revolución.** El CTO define un camino gradual: 60+ reglas de negocio validan las recomendaciones de IA (grounding anti-alucinación), el humano aprueba o rechaza, y solo tras meses de concordancia el sistema actúa directamente sobre máquinas [IG-SYNTH-22]. "No puedo sacar al humano" y "estamos conversando para desviar camiones automáticamente" coexisten como restricción y aspiración.

**Un CFO invisible.** Hoy una persona invierte 30 minutos en generar reportes manuales para un CFO que nunca usa TIMining [IG-10]. El perfil financiero — 4 KPIs traducidos a lenguaje de negocio, en teléfono, antes de una reunión — no está cubierto por ninguna persona definida actualmente.

**Repricing basado en valor.** Aware se vende a USD 300k/año pero genera USD 6M+ en valor capturado por faena [IG-SYNTH-16b]. Hay una oportunidad de realinear el precio (target CORE: USD 450k) con el valor real entregado, pasando de "licencia de software" a "valor empresarial."

## Lo que funciona bien

**La "Geometry Gap" es real y TIMining la resuelve.** El algoritmo propietario de inferencia topográfica en tiempo real — actualizando la geometría cada 15 minutos usando solo datos GPS, sin drones — es un diferenciador técnico validado sin competidor conocido [IG-SYNTH-01]. Los resultados son concretos: +9-19% adherencia espacial, USD 10M+ en ahorros en 3 minas [IG-SYNTH-12].

**El "Efecto Suiza" es un posicionamiento fuerte.** En una industria donde los líderes forman un oligopolio de "super suites" con lock-in, TIMining funciona como integrador neutral — OEMs competidores integran rutinariamente con TIMining incluso cuando no integran entre sí [IG-SYNTH-05].

**La adopción bottom-up genera stickiness.** Los patrones de uso diario muestran que Aware se embebe en rutinas de cambio de turno, generando tracción interna que acelera acuerdos corporativos [IG-SYNTH-17]. Más de 100 usuarios activos mensuales en un solo sitio Codelco.

**El patrón Detección→Análisis→Recomendación está validado.** Las 20 láminas del workshop siguen una estructura idéntica confirmada por los propios usuarios [IG-SYNTH-06]. Este patrón es el esqueleto natural de CORE.

## Tensiones clave

**Customización vs escalabilidad** [CF-05] — No hay definición formal de dónde termina la "configuración" (cambiar umbrales) y empieza la "customización" (desarrollar features nuevos). El mismo COO usa el término para ambas cosas. Mientras no se resuelva, el riesgo del "Auto de Homero Simpson" persiste.

**3D: ¿agrega valor o no?** [CF-02] — En el mismo workshop, el equipo dijo STOP "3D no agrega valor" y KEEP "visualización de la mina completa." Mientras tanto, el design brief define el visor 3D como uno de los 4 lentes del producto. Hay desacuerdo no resuelto.

**Confianza del CTO vs realidad de uso** [CF-03] — El CTO está confiado en que el diseño está por encima de la competencia. La evidencia muestra 30% de uso en Orchestra, abandono por confusión y pérdida de clientes. Ambas perspectivas pueden coexistir, pero necesitan un benchmark externo para objetivar.

**CORE vs Aware: ¿qué es exactamente CORE?** [CF-06] — No hay definición explícita de si CORE reemplaza, envuelve o renombra Aware. El design brief pide diferenciación, pero las capacidades se superponen casi completamente.

**Minería subterránea: ¿foco o no?** [CF-04] — El COO dice "no es foco" (enero 2026) pero el roadmap la incluye como expansión 2026. Puede ser diferencia entre ventas (hoy) y producto (futuro), pero necesita clarificación.

**"Paz Mental": ¿principio interno o etiqueta para clientes?** [CF-12] — El CEO redefine la necesidad subyacente como falta de tiempo, no ansiedad ("no es tanto paz mental, más bien estos tipos no tienen tiempo"). El CTO rechaza el concepto para uso externo ("si les digo que les doy paz mental quedamos como chantas"). Coinciden en que no es para clientes, pero por razones distintas. Internamente sigue activo como principio de diseño.

## Brechas de evidencia

1. **Sin voz directa del usuario final** [CF-07] — Todo lo que sabemos sobre usuarios viene de stakeholders internos. Las necesidades de mineros, despachadores y jefes de turno son inferidas, no observadas. Tres fuentes recientes refuerzan esta brecha: plan de 5-7 entrevistas remotas (Touchpoint), propuesta de entrevistar ex-empleados (reunion_camila), y observación de etapa 2 incompleta (field notes). **Prioridad: crítica.**

2. **Sin datos financieros detallados** [CF-08] — Las decisiones de pricing y modelo de negocio se basan en cifras anecdóticas, no en unit economics. **Prioridad: alta.**

3. **Sin benchmark competitivo externo** [CF-09] — Los claims de unicidad y diferenciación son autorreferenciales. **Prioridad: media.**

4. **Sin validación técnica de factibilidad CORE** [CF-11] — La arquitectura de 8 capas y la visión multimodal no tienen input del equipo de desarrollo sobre viabilidad o timeline. **Prioridad: alta.**

5. **Sin datos de accesibilidad** [CF-10] — Los requisitos de uso en terreno (sol, guantes, polvo, radio) no están documentados formalmente. **Prioridad: media.**
