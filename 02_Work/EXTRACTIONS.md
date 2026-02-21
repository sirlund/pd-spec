# Extractions

Raw claims extracted from sources by `/extract`. Input for `/analyze`.

<!-- Updated automatically by /extract -->

## [ai-reports/competitive-landscape.md] ⚠️ AI-GENERATED
- Type: analysis
- Date: 2026-02-15
- Participants: Gemini 2.0
- Extracted: 2026-02-21T11:00

### Raw Claims
1. "El mercado global de software de tecnología minera se estima en $4.2B con CAGR de 8.3% hasta 2030" [AI-SOURCE]
2. "Hexagon Mining (HxGN MineOperate) es líder de mercado en fleet management con ~35% market share en operaciones open-pit" [AI-SOURCE]
3. "Hexagon: UX desactualizado, requiere 40+ horas de entrenamiento para operadores" [AI-SOURCE]
4. "Hexagon pricing: modelo de licencia enterprise, $500K-$2M por despliegue por sitio" [AI-SOURCE]
5. "Wenco: despliegue modular, funciona con flotas mixtas, sin capacidades AI/ML" [AI-SOURCE]
6. "Wenco pricing: modelo suscripción, ~$150K-$400K anual" [AI-SOURCE]
7. "Maptek (Vulcan + BlastLogic): dominante en modelamiento geológico, productos en silos, pobre integración operacional en tiempo real" [AI-SOURCE]
8. "Maptek pricing: licencia por puesto, $30K-$80K por seat" [AI-SOURCE]
9. "Ningún competidor ofrece actualizaciones de topografía cada 15 minutos como diferenciador central" [AI-SOURCE]
10. "El tiempo de entrenamiento de operadores podría reducirse a <4 horas con diseño intuitivo" [AI-SOURCE]
11. "Ningún competidor actual ofrece recomendaciones proactivas con IA" [AI-SOURCE]
12. "El enfoque vendor-agnostic de TIMining es único en el mercado" [AI-SOURCE]
13. "La estrategia de adquisiciones de Hexagon podría cerrar la brecha rápidamente" [AI-SOURCE]
14. "Las empresas mineras son aversos al riesgo y prefieren soluciones probadas sobre innovadoras" [AI-SOURCE]
15. "Los requisitos de compliance regulatorio varían significativamente por región" [AI-SOURCE]

---

## [entrevistas operaciones/analisis reu con operaciones.md]
- Type: technical_analysis
- Date: 2026-01-27
- Participants: equipo operaciones TIMining
- Extracted: 2026-02-21T11:00

### Raw Claims
1. "TIMining tiene entre 6 y 8 productos de software para minería: Aware, Orchestra, Delta, SIC, Tangram, ARIS"
2. "Aware: plataforma de monitoreo operacional, usada en salas de control 24/7 con múltiples pantallas, integrando datos en tiempo real"
3. "Orchestra: herramienta de planificación, enfocada en secuencias operacionales — requiere fuerte componente consultivo"
4. "Los tiempos de actualización de datos en Aware son confusos para los usuarios: GPS casi real, mapas calor 3h promedio con desfase 30min, indicadores cada 30min, topografía cada 15min"
5. "Se perdió un cliente por métricas de extracción a 24 horas que no hacían sentido — los mineros miran por turno"
6. "Los clientes piden muchas funcionalidades, pero luego les cuesta usarlas bien — problemas de adopción"
7. "Orchestra requiere 30-36 horas por caso de renovación para armar casos de estudio; en 2022, ~600 horas en dos proyectos de consultoría completos"
8. "~16 minas usan Orchestra vs ~6-7 que usan Aware"
9. "Delta: conciliación topográfica rápida — CODELCO, Grupo México, Equinox Gold lo usan en todas sus operaciones; puerta de entrada para vender otros productos"
10. "SIC: evaluación de cumplimiento banco por banco (ancho de berma, ángulo, parámetros de seguridad) — alta autonomía del usuario"
11. "Tangram: predice bloques de roca que pueden caer mediante análisis estructural — crítico para prevenir accidentes"
12. "ARIS: consolida 30+ tipos de instrumentos de monitoreo en una sola plataforma — visualmente desactualizada pero base de usuarios leal"
13. "La capacitación inicial de Aware no alcanza para una interfaz con múltiples capas — usuarios abandonan cuando no entienden el timing de los datos"
14. "Fuerte nivel de customización por cliente genera complejidad — riesgo de romper configuraciones con actualizaciones"
15. "Riesgo de 'auto de Homero Simpson': demasiadas funcionalidades pedidas por clientes generan un producto difícil de usar"
16. "Necesidad de mejor validación de requerimientos: entender el uso real antes de implementar features"
17. "Proyectos de planificación anual en Orchestra evalúan 20+ escenarios en horizontes de 3 años"
18. "El simulador de Orchestra no se ha adaptado bien a camiones autónomos, múltiples rutas — requiere usuarios expertos para workarounds"
19. "TIMining nació en geotecnia y se expande hacia software de operaciones"

---

## [entrevistas operaciones/notas_entrevista_COO_(segunda entrevista).md]
- Type: interview_notes
- Date: 2026-01-22
- Participants: Roberto Catalán (COO), equipo Idemax
- Extracted: 2026-02-21T11:00

### Raw Claims
1. "TIMining es agnóstico al hardware y a los proveedores (OEM) — puede integrar datos de muchos sensores y sistemas sin importar marca"
2. "Diferenciador clave: capacidad de hacer 'match' entre la geometría del plan y lo que realmente pasa en el terreno"
3. "Algoritmos infieren estados de vehículos sin depender del input humano — en sistemas tradicionales, operadores marcan estado con botón"
4. "No se requiere hardware propietario adicional — propuesta basada en algoritmos y análisis inteligente de datos existentes"
5. "Stack tecnológico fragmentado: componentes en C++, visualizaciones en Unity, backend en Go y Python, interfaces web, reportes por email"
6. "No existe sistema unificado de autenticación que abarque todo el portafolio"
7. "Para conectar Orchestra con sistemas web se recurre a bajar bases de datos y hacer cruces manuales"
8. "Estado deseado es 'plug and play' — hoy el esfuerzo humano es clave para que los sistemas conversen"
9. "'Geometry Gap': el minero ve camioncitos y palas pero no ve el contexto geológico ni el plan espacial detallado"
10. "Las desviaciones respecto al plan se descubren tarde (a veces semanas después) — costo de extraer en zona equivocada puede ser millones de dólares"
11. "Hay tensiones entre incentivos de corto plazo (cumplir bono hoy) y valor de largo plazo de la mina"
12. "Aware detectó caída sistemática de velocidad 20→8 km/h en curva, descubrieron que la ruta de camiones autónomos Komatsu Front Runner estaba mal dibujada"
13. "Tiempo estándar de instalación: ~1 mes conexión básica, luego período largo de ajustes y customizaciones"
14. "Misma UX base para todos, pero 'debajo del agua' las reglas, umbrales y lógicas cambian según la faena"
15. "Enfoque consultivo: analizar método de extracción, secuencia de procesos y roles concretos antes de configurar"
16. "Variaciones geográficas: Chile (rajos abiertos), Colombia/Cerrejón (rajo enorme cientos km²), Brasil/MRN (strip mining), subterránea (no foco principal)"
17. "Al menos 4 proto-perfiles de usuario identificados — definen metas de extracción diarias/semanales"
18. "Falta visualización integrada de dónde se suponía que debía excavar vs dónde está realmente excavando"

---

## [entrevistas operaciones/reu_coo_roberto-catalan.md]
- Type: interview_notes
- Date: 2026-01-22
- Participants: Roberto Catalán (COO), equipo Idemax
- Extracted: 2026-02-21T11:00

### Raw Claims
1. "TIMining es agnóstico al hardware y a los proveedores (OEM) — puede integrar datos de muchos sensores y sistemas sin importar marca"
2. "Diferenciador clave: capacidad de hacer 'match' entre la geometría del plan y lo que realmente pasa en el terreno"
3. "Algoritmos infieren estados de vehículos sin depender del input humano — en sistemas tradicionales, operadores marcan estado con botón"
4. "No se requiere hardware propietario adicional — propuesta basada en algoritmos y análisis inteligente de datos existentes"
5. "Stack tecnológico fragmentado: componentes en C++, visualizaciones en Unity, backend en Go y Python, interfaces web, reportes por email"
6. "No existe sistema unificado de autenticación que abarque todo el portafolio"
7. "Para conectar Orchestra con sistemas web se recurre a bajar bases de datos y hacer cruces manuales"
8. "Estado deseado es 'plug and play' — hoy el esfuerzo humano es clave para que los sistemas conversen"
9. "'Geometry Gap': el minero ve camioncitos y palas pero no ve el contexto geológico ni el plan espacial detallado"
10. "Las desviaciones respecto al plan se descubren tarde (a veces semanas después) — costo de extraer en zona equivocada puede ser millones de dólares"
11. "Hay tensiones entre incentivos de corto plazo (cumplir bono hoy) y valor de largo plazo de la mina"
12. "Aware detectó caída sistemática de velocidad 20→8 km/h en curva, descubrieron que la ruta de camiones autónomos Komatsu Front Runner estaba mal dibujada"
13. "Tiempo estándar de instalación: ~1 mes conexión básica, luego período largo de ajustes y customizaciones"
14. "Misma UX base para todos, pero 'debajo del agua' las reglas, umbrales y lógicas cambian según la faena"
15. "Enfoque consultivo: analizar método de extracción, secuencia de procesos y roles concretos antes de configurar"
16. "Variaciones geográficas: Chile (rajos abiertos), Colombia/Cerrejón (rajo enorme cientos km²), Brasil/MRN (strip mining), subterránea (no foco principal)"
17. "Al menos 4 proto-perfiles de usuario identificados — definen metas de extracción diarias/semanales"
18. "Falta visualización integrada de dónde se suponía que debía excavar vs dónde está realmente excavando"

---

## [Propuesta ruta/_FIELD_NOTES.md]
- Type: field_notes
- Date: 2026-02-16
- Extracted: 2026-02-21T11:00

### Raw Claims
1. "Etapa 2 incompleta — entrando a Etapa 3 (Lineamientos de diseño) sin haber completado validación con usuarios finales. Todas las perspectivas de usuario son indirectas (stakeholders internos), no de mineros, despachadores o jefes de turno reales. Riesgo de repetir patrón 'Auto de Homero Simpson' a nivel de estrategia UX." (Confidence: high)

---

## [Workshop 1/_FIELD_NOTES.md]
- Type: field_notes
- Date: 2026-02-15
- Extracted: 2026-02-21T11:00

### Raw Claims
1. "El CTO Carlos está muy confiado de que el diseño de TIMining está muy por sobre la vara de otros softwares de minería — pero eso no significa que no tengan problemas graves de UX." (Confidence: high)
2. "Concepto 'iPhone-like' acuñado por un stakeholder en el workshop para justificar vender la suite a 450k USD — se refería a algo sofisticado y fácil de usar." (Confidence: high)

---

## [Workshop 1/analisis_workshop.md]
- Type: workshop_analysis
- Date: 2026-01-29
- Participants: equipo TIMining + facilitadores UX (Idemax)
- Extracted: 2026-02-21T11:00

### Raw Claims
1. "2024 fue el año de modularizar el algoritmo; 2025 es el año de integrar IA y alarmas"
2. "Capacidades potentes (forecasting, topografía en línea) pero están 'desordenadas' o dependen de implementaciones manuales"
3. "Metáfora del Iceberg: la interfaz actual es solo la punta de una tecnología profunda — objetivo es liberar el valor sumergido a través de nueva UX"
4. "TIMining tiene capacidad de vender 'en verde' (pre-venta) por la confianza del cliente, pero falta el 'diagrama de la casa piloto' — tienen piezas pero no arquitectura coherente"
5. "El nuevo producto debe verse diferente ('como abrir un iPhone') para justificar precio de ticket más alto (ej. USD 450k)"
6. "Problema raíz: ayudar a la mina a cumplir su Plan Minero (plan de negocio)"
7. "El Jefe de Turno quiere cumplir su turno y evitar problemas inmediatos, ignorando cómo su micro-decisión afecta la última línea del negocio"
8. "El CFO es un usuario 'invisible' que debería interesarse — el dinero no se pierde al final del año sino en cada turno mal gestionado"
9. "TIMining debe pasar de 'kiosco de dulces' (dar feature que pide el cliente) a 'médico' (diagnosticar problema real)"
10. "Stop: consultoría manual donde TIMining hace el trabajo por el cliente ('somos las manos del cerebro')"
11. "Stop: crear dashboards a medida no escalables ('el reporte de la Erika')"
12. "Start: que el sistema pase del diagnóstico a la acción sugerida — 'toma acción en este problema'"
13. "Start: visibilidad jerárquica — que el éxito de un turno sea visible para la gerencia"
14. "Start: reducir dependencia de reuniones de coordinación, que el dato sea el intermediario"
15. "Escenario cambio turno (Sofía): recibe resumen proactivo 15min antes — proactividad, no espera a que busque el dato"
16. "Escenario falla equipo: sistema estima impacto en cumplimiento del plan, no solo avisa que la máquina paró — visión sistémica"
17. "Escenario seguridad: validación inmediata contra normativa por voz/radio o foto — 'Paz mental' de estar cumpliendo la ley"
18. "Escenario gerencia: detección automática de brechas, priorización — 'Hubo 10 incidentes pero estos 2 impactaron la producción'"
19. "Valor no está en el software sino en la 'Paz Mental' — usuario quiere saber que toma la decisión correcta"
20. "Confirmado paso de dashboards con gráficos a modelo de Asistencia Proactiva (recomendaciones, alertas predictivas, resúmenes de turno)"
21. "Plataforma debe integrar Pasado-Presente-Futuro: qué pasó (causa), qué pasa (monitoreo), qué pasará si no se actúa (simulación)"
22. "Gestión por excepción: si hay 50 camiones bien, no mostrarlos — mostrar los 5 que generan problema"
23. "Siguiente etapa: salir a conversar con usuarios reales y armar casos de uso basados en escenarios discutidos"
24. "Foco en Q2: concepto lanzable 'en verde' para segundo trimestre"
25. "IA y multimodalidad no son adornos sino herramientas para reducir carga cognitiva del usuario minero con 'pobreza de tiempo'"

---

## [entrevistas operaciones/reunion_operaciones (27-01-2026).md]
- Type: interview_transcript
- Date: 2026-01-27
- Participants: Alejandro Guzzoni, Roberto Catalán, Erika Barrezueta, Humberto Díaz, Cbonilla, Hmunoz, Nlundin
- Extracted: 2026-02-21T12:00

### Raw Claims
1. "Aware es el producto principal de TIMining — gemelo digital de operaciones mineras, usado en salas de control 24/7"
2. "Aware está bastante customizado a las necesidades de cada tipo de minería: cobre, carbón y bauxita (Brasil)"
3. "Tiempos de actualización confusos: GPS casi real-time, indicadores cada 30 min, mapas de calor promedian últimas 3 horas con desfase de 30 min, topografía cada 15 min"
4. "La topografía generada cada 15 min con GPS de la pala es lo que diferencia a Aware de un simple visualizador — tiene algoritmo propio"
5. "Feedback más frecuente a nivel UX: los usuarios no entienden los tiempos de actualización de cada dato — no hay tooltips ni indicadores de frescura"
6. "Cuando usuarios no entienden la herramienta, dejan de usarla: 'llegamos, capacitamos, se entusiasman, pero luego es como no le entiendo, adiós'"
7. "Diseño original de Aware pretendía ser tan intuitivo que no necesitara capacitación — pero las capas añadidas rompieron esa simplicidad"
8. "Se perdió un cliente porque la métrica de extracción de 24 horas no hacía sentido — los mineros evalúan por turno, no por día"
9. "Los clientes piden features, TIMining los implementa, y luego los clientes no saben para qué usarlos — 'ellos lo piden, nosotros decimos que sí, y luego es como ¿y para qué lo usamos?'"
10. "Visión futura de Aware: predecir situaciones con IA, lanzar alertas antes de que ocurra el problema — ejemplo: 'vas a quedarte 30 min sin material en el chancado'"
11. "Hay módulos que no se integran entre operaciones y geotecnia — riesgos geotécnicos afectan la operación pero están en software separados"
12. "Orquestra tiene módulo de análisis (datos históricos) y módulo simulador (escenarios 'qué pasaría si') — simulador de eventos discretos"
13. "Orquestra se conecta al mismo sistema de gestión de flotas que Aware: mismos datos, uno en tiempo real, otro histórico"
14. "A nivel indicadores globales, Orquestra está alineado con lo que los usuarios verían en un BI — la diferencia es la visualización georreferenciada"
15. "Los datos de los FMS no son de fácil acceso para planificación — Orquestra democratiza el acceso a esos datos y los hace auditables"
16. "El módulo de simulación de Orquestra no se ha actualizado — no maneja bien camiones autónomos ni múltiples rutas, requiere 'artificios' de usuarios expertos"
17. "Consultoría intensiva: dos proyectos el año pasado consumieron ~600 horas; un caso típico de renovación demora 30-36 horas"
18. "La pobreza de tiempo de los usuarios de mina impide que aprendan la herramienta — 'disculpe, tenemos que reagendar porque me han llamado a campo'"
19. "Orquestra en modo consultoría: 'somos las manos del cerebro' — TIMining hace el trabajo analítico que el usuario no tiene tiempo de hacer"
20. "Delta: conciliación topográfica rápida y agnóstica — no requiere limpiar topografías, procesa en menos de 1 minuto"
21. "Delta como puerta de entrada: CODELCO, Grupo México y Equinox Gold lo usan a nivel corporativo en todas sus operaciones"
22. "Corporaciones necesitan Delta porque cada mina usa software diferente (Deswik, Vulcan, Datamine) y los resultados no son comparables"
23. "Aware sin Orquestra no se justifica: 'si no puedes justificar cómo te ayudó, perdiste' — necesitas la analítica para cuantificar el valor"
24. "Sentinela compró 5 licencias de Orquestra y dejó Aware — llamaban a Aware 'el gemelo que no es gemelo'"
25. "Tangram: predice bloques de roca que pueden caer mediante análisis estructural — calcula factor de seguridad y probabilidad de falla"
26. "SIC: evaluación banco por banco (ancho de berma, ángulo, parámetros) — almacena data histórica, permite correlacionar cumplimiento con variables (factor de carga, supervisor, equipo)"
27. "ARIS: integra 30+ tipos de instrumentos de monitoreo en una sola plataforma — visualmente obsoleta pero potente, con sistema de alertas"
28. "ARIS fue la primera plataforma de TIMining — la empresa nació en geotecnia, los productos de operaciones vinieron después"
29. "~16 minas usan Orquestra vs ~6-7 usan Aware — la base de clientes geotécnicos es mayor y más leal"
30. "Customización por cliente genera riesgo: actualizaciones pueden romper configuraciones específicas — 'pum, se tiraron abajo el mapa y todo operaciones corriendo a arreglar'"
31. "Riesgo 'Auto de Homero Simpson': los clientes piden features, TIMining los implementa, y el producto se vuelve un monstruo que no funciona bien para nadie"
32. "Cada feature debería cuestionarse: '¿qué decisión va a poder tomar el usuario con esto?' — no implementar solo porque el cliente lo pidió"

---

## [sesiones-idemax/reunion_camila_2026-02-17.md]
- Type: internal_notes
- Date: 2026-02-17
- Participants: Nlundin, Cbonilla, Hmunoz, AGuzzoni
- Extracted: 2026-02-21T12:00

### Raw Claims
1. "Este archivo se auto-declara como 'No es fuente para /extract' — notas internas Idemax, procesado por mandato de completitud"
2. "Principios de diseño identificados: Clear Path (máximo 3 recomendaciones, pocos clics), Quiet UI (colores solo para anomalías), TimeSight (visualización pasado-presente-futuro)"
3. "Gap crítico: las decisiones se toman fuera del software — comunicaciones por radio no quedan registradas, pérdida de conocimiento entre turnos"
4. "El software debe convertirse en hub central de toma de decisiones — no complemento, sino plataforma donde ocurren las decisiones"
5. "Evolución estratégica en 3 fases: (1) cumplimiento del plan, (2) optimización del plan en tiempo real, (3) anticipación proactiva basada en aprendizaje histórico"
6. "Incentivos mal alineados: bonos por cumplimiento del plan conservador, no por optimización — plan de 100, realidad de 50, potencial de 150"
7. "Oportunidad de repricing: de $300K a $450K anuales si se demuestra valor generado vs precio"
8. "Transición de 7 productos fragmentados a plataforma Core unificada — cada producto sirve perfiles diferentes, necesidad de interfaces dinámicas"
9. "Adopción dual necesaria: bottom-up (>100 usuarios activos post-piloto) + top-down (decisión la toma BHP en Canadá, no la mina local)"
10. "Validación con usuarios finales pendiente y crítica — no hay entrevistas programadas con jefes de turno reales, riesgo de diseñar basado solo en percepción interna"
11. "KPIs no definidos: ¿cómo medir cumplimiento del plan? ¿Cómo demostrar valor generado vs precio cobrado?"
12. "Bloqueantes técnicos para migración a core platform no resueltos — posible reestructuración de backend necesaria"
13. "Sistema omnisciente futuro: analiza cada X minutos, percibe todo, escala solo lo relevante, busca óptimo global"
14. "Aprendizaje del sistema: jefe de turno experto rechaza opciones A, B, C y elige D — sistema aprende y eventualmente sugiere D primero"
15. "Confusión temporal: datos con diferentes delays (15, 30, 45 min) — usuarios no distinguen actualizado vs histórico"
16. "6 meses de consultoría por proyecto indica producto demasiado complejo — dependencia de venta consultiva como síntoma"
17. "Propuesta: entrevistar ex-empleados que ahora trabajan en clientes para validación indirecta"
18. "Anticipación basada en múltiples factores: histórico de equipos, condiciones climáticas (fenómeno del Niño), patrones estacionales"
19. "Sistema de diseño AI-first propuesto: agentes que crean productos respetando pilares, no Figma tradicional"

---

## [sesiones-idemax/session-align-con-camila(wed18feb).md]
- Type: planning_session
- Date: 2026-02-18
- Participants: Nlundin, Cbonilla
- Preprocessed: yes
- Extracted: 2026-02-21T12:00

### Raw Claims
1. "Patrón DAR (Detección, Análisis, Recomendación) aplicado transversalmente a todos los casos de uso — siempre rojo-amarillo-azul como patrón visual"
2. "8 casos de uso organizados en dominios: 6 base (cumplir el plan) + 2 extra (optimizar el plan, cuando Core ya existe)"
3. "Casos base: incidente de turno, anticipación operativa, asistencia en terreno, briefing inteligente (cambio turno), copiloto en terreno, plan vs realidad"
4. "Casos extra: optimización del plan minero (reunión mensual estratégica) y reportería ejecutiva CFO"
5. "Skynet/NorthStar: cada X minutos el sistema analiza la situación completa, realiza simulaciones de óptimo global, emite recomendaciones — primero a personas, luego a máquinas"
6. "Urgente vs importante como capacidad clave: el sistema debe ayudar a priorizar lo importante (impacto al plan) sobre lo urgente (visible)"
7. "Hub de decisiones: las decisiones deben ocurrir dentro de la plataforma, no fuera — si se hacen por radio, el sistema escucha y registra"
8. "Caso CFO: no necesita acceso a sistemas operacionales, necesita respuesta en su idioma financiero — dashboard automático generado para directorio"
9. "Referentes de IA (SentinelOne, etc.) basados en lo que las empresas dicen ser, no en uso real del software — no hay acceso para verificar"
10. "TimeSight no es solo mirar futuro — es la mirada integrada de pasado, presente y futuro con nivel de certeza"
11. "Keep-Stop-Start del workshop resumido: eliminar grasa operacional (stop), fortalecer valor real (keep), inteligencia proactiva (start)"
12. "Optimización del plan: fase sur rinde bajo plan no por incidente sino porque la roca es más dura que el modelo geológico — decisión estratégica, no táctica"
13. "Workshop 2 planificado como presencial (jueves) — presentar casos de uso con pilares aplicados y mockups"
14. "Post-aprobación: desarrollar manual UX con reglas específicas por pilar, guidelines para validación con usuarios reales"

---

## [Workshop 1/transcript.md]
- Type: workshop_transcript
- Date: 2026-01-29
- Participants: Alejandro Guzzoni, Cbonilla, Hmunoz, Carlos Calderón, Philippe Whatmore, equipo TIMining
- Preprocessed: yes
- Extracted: 2026-02-21T12:00

### Raw Claims
1. "TIMining CORE: tecnología en tres capas — integración de datos (efecto Suiza, fuente de verdad), inteligencia (topografía en línea, sensores virtuales), UX/UI (visualizador 3D, web)"
2. "2024 fue el año de modularizar el algoritmo del gemelo digital; 2025 es IA, alarmas y forecasting"
3. "Capacidad de vender 'en verde' gracias a velocidad de desarrollo — el ciclo de venta e implementación es tan lento que permite desarrollar mientras se implementa"
4. "Falta la 'casa piloto': tienen las piezas (silla, baño) pero no el diagrama arquitectónico coherente de la nueva plataforma"
5. "Meta comercial: producto nuevo debe verse diferente como abrir un iPhone — justificar precio de $450K USD anuales"
6. "Problema raíz: ayudar a la mina a cumplir su plan minero — pero el dueño (para quien el plan es el negocio) no es usuario"
7. "El jefe de turno quiere hacer su pega, no piensa en la última línea del negocio — desalineamiento entre usuario y beneficiario"
8. "CFO como usuario invisible: debería velar por cumplimiento del plan, pero solo se entera una vez al año cuando el planificador actualiza — el dinero se perdió en cada turno"
9. "TIMining debe pasar de 'kiosco de dulces' (dar lo que pide el cliente) a 'médico' (diagnosticar problema real y prescribir)"
10. "'La tecnología no mueve piedras' — pero sí mueve las decisiones que mueven las piedras; si las decisiones se toman con nuestros datos, estamos moviendo piedras"
11. "Iteraciones de producto son lentas en minería: ciclos de venta largos, deploys lentos, industria conservadora con mucha inercia"
12. "Amenaza competitiva: 'somos un botecito adelante, el viento sopla a favor, pero los barcos grandes también lo vieron' — océano azul que todos quieren alcanzar"
13. "Escenario cambio turno (Sofía): 15 min antes, recibe resumen proactivo con problemas, atrasos, recomendaciones — la plataforma co-analiza y genera texto con indicaciones"
14. "Escenario falla equipo: detección de retraso o adelanto en mantención, análisis de impacto en plan, recomendación de reasignación de recursos"
15. "Escenario seguridad: consulta por radio o foto a un agente que valida cumplimiento de normativa en terreno — 'paz mental' de cumplir la ley"
16. "Escenario gerencia: detección de brechas respecto al plan, análisis de causa raíz, priorización de incidentes por impacto real"
17. "Valor reside en 'paz mental': certeza de que la decisión es correcta, que el dato viene a tiempo, que ayuda a cumplir el plan"
18. "Confirmado paso de dashboards a modelo de Asistencia Proactiva — no es el usuario quien busca al sistema, sino el sistema quien encuentra al usuario"
19. "Gestión por excepción: cuando todo se ilumina nada es importante — como supermercado con todo en rojo promoción"
20. "Necesidad de interfaces que se adapten: detección automática de rol/ubicación, canal y formato de información según perfil"
21. "WhatsApp como canal de decisiones: 'impresionante la cantidad de toma de decisiones vía WhatsApp en la operación diaria'"
22. "Motor de reglas de negocio: ~60 reglas operacionales (ifs) para cambio de turno, asignación de equipos — TIMining integra su motor con el del cliente"
23. "Skynet/NorthStar final: cada X minutos sistema analiza, simula, busca óptimo global, replanifica — de sugerencia a instrucción, primero personas luego máquinas"
24. "Pregunta de cierre del workshop: '¿con qué nos vamos?' — no saturar con información, verificar upstream, herramienta que genere paz mental"

---

## [sesiones-idemax/Touchpoint_TIMining-IDEMAX _2026-02-19.md]
- Type: touchpoint_meeting
- Date: 2026-02-19
- Participants: Camila Bonilla, Ana Gómez, Nlundin, Phillip Whatmore, Alejandro Guzzoni, Carlo Calderón
- Preprocessed: yes
- Extracted: 2026-02-21T12:00

### Raw Claims
1. "Seis insights estratégicos clave identificados a partir de 54 fuentes analizadas (archivos, workshop, transcript, reuniones)"
2. "Paz mental como mantra operativo: certeza de que el dato es correcto, viene a tiempo, ayuda a cumplir el plan, protege incentivos"
3. "Salto de modelo: de dashboard a médico operacional — patrón DAR (detección, análisis, recomendación) como framework central"
4. "Valor iPhone-like: experiencia y estética justifican ticket comercial más alto — adherencia e intuitividad como diferenciadores"
5. "Perfiles diferenciados: hoy distintos usuarios necesitan distinta información, pero también diferente formato, canal y densidad"
6. "'Cuando todo es crítico, nada es crítico' — como supermercado con todo en rojo promoción; necesidad de distinguir lo realmente importante"
7. "Validación con usuarios externos crítica y pendiente — 5 a 7 entrevistas de media hora serían suficientes"
8. "De 6-7 productos TIMining a Core: ¿software nuevo que convive con los demás o los absorbe? No se pueden matar los legacy"
9. "Concepto suite: no son productos complementarios para el mismo usuario, sino productos diferentes para usuarios diferentes"
10. "WhatsApp como principal canal de decisiones operacionales — si se pudiera capturar esa data, se recupera el 90% de la información"
11. "Motor de reglas de negocio: ~60 ifs operacionales que integran lógica del cliente con motor de TIMining — 'ese es el superpoder'"
12. "Operadores resisten usar herramientas: 'tienen 400 pantallas' — pobreza de tiempo como barrera principal de adopción"
13. "El operador como usuario clave pero no conquistado: 'si no logramos vender al operador, estamos afuera' — hoy la herramienta la usa planificación para auditar al operador"
14. "Marca y arquitectura: ¿Core es sub-marca de TIMining o marca independiente? Productos legacy necesitan convergencia visual"
15. "Próximo paso definido: validación con usuarios externos, identificar perfiles clave para entrevistas, construir entrevistas efectivas por perfil"
16. "Keep: simplicidad, rapidez, claridad en proceso, control de operación, certeza de datos — sintetizado de post-its del workshop"
17. "Stop: datos que no requieren acción confunden y saturan, capacitaciones extensas que no se retienen, soluciones que llegan cuando el problema ya pasó"
18. "Start: silencio como estado default con alertas para lo importante, gestión instantánea de la información por perfil, sistema que alcanza al usuario (no al revés)"
19. "Etapa 2 (validación) incompleta al entrar en Etapa 3 (lineamientos) — entrevistas con usuario arrastradas como deuda de fase anterior"
20. "Felipe Zoloza identificado como candidato para identificar buenos usuarios para entrevistas de validación"

---

## [entrevistas iniciales stakeholders/Entrevista PM AWARE.png]
- Type: interview_canvas
- Date: 2026-01
- Participants: Carolina Retamal (PM AWARE)
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Carolina Retamal, PM AWARE: el valor de Aware es 'mejorar la operación' — mejorar diferencias entre planificado y lo real"
2. "Diferenciadores de Aware según PM: diseño de interfaz, información en tiempo real, fácil de usar, acceso libre a la organización"
3. "Fortalezas: 'Estamos vivos y actualizados', robustez del modelo, 'check list'"
4. "Problemas: calidad del dato y manipulación del dato, customizaciones de base de datos no estandarizadas"
5. "Referentes de UX: flujo formativo de aprendizaje simple, videojuegos, Google Maps, Power BI, ClickUp (todo en un mismo lugar), buscar design systems"
6. "Aware vs Orchestra: Aware es más caro, opera en tiempo real; Orchestra es análisis profundo"

---

## [entrevistas iniciales stakeholders/Entrevista PM Orchestra.png]
- Type: interview_canvas
- Date: 2026-01
- Participants: Ernesto Perez (PM ORCHESTRA)
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Ernesto Perez, PM Orchestra: valor es 'dar respuestas a necesidades para gestiones eficientes, decisiones, identificar cuellos de botella'"
2. "Orchestra: productividad de la flota (palas y camiones), dos módulos: 1. Análisis, 2. Simulación"
3. "Diferenciador: cuantificación de las desviaciones y pérdidas — filtro data de mantención"
4. "Usuarios: servicio de mina, extracción de data para planificación, uso de DATA expos"
5. "Problemas: 'no es un software que se use solo, siempre requiere acompañamiento'; desarrollo de prototipo toma 1 mes y medio"
6. "Brecha: simulación requiere un experto capacitado; falta pegar lo visual con los números"
7. "Escena de éxito futuro 2026: 'co-piloto operacional'"

---

## [entrevistas iniciales stakeholders/Entrevista Roberto COO.png]
- Type: interview_canvas
- Date: 2026-01
- Participants: Roberto Catalán (COO), 8 años en TIMining
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Roberto Catalán, COO: TIMining es 'integrador de datos en tiempo-minero, tiempo real'; AWARE = sistema monitoreo en tiempo real"
2. "Valor: decisiones basadas en perfil agnóstico, 'podemos leer todo'; predicción de futuro; integradores que permiten manipular los datos"
3. "Usuarios clave: despacho y planning"
4. "Fortaleza: 'SET CONOCE TIMining/Ecosistema — no somos nativos digitales'; 'ASEGURARNOS QUE EL CLIENTE RENUEVE'"
5. "Ciclo de venta: 2 años / mes 6 de implementación; burocracia de acceso al dato como barrera"
6. "Problema: 'los software no conversan entre sí'; brechas de conocimiento; 'no doy abasto a solicitudes de customización'"
7. "Deseo: módulos abiertos para ayudar al cliente; módulo de alertas; buscar cerebro que concentre todo en un solo lugar"
8. "Escena futuro: flexibilidad y customización, perfiles diferenciados, reportes dinámicos, 'que seamos lo más personalizables'"
9. "Ideas finales: customización, lock-in, perfilamiento ejecutivo, medición de impacto, agilidad y tiempos de respuesta, data y alertas"

---

## [entrevistas iniciales stakeholders/Entrevista_Ana.png]
- Type: interview_canvas
- Date: 2026-01
- Participants: Ana (Gerente Comunicaciones)
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Ana, Gerente Comunicaciones: foco en 'viraje de la voz hacia afuera / industry map'"
2. "Concepto 'Back un Front': separar lo que se muestra al cliente de la complejidad técnica interna"
3. "'Se puede decir NO' — necesidad de establecer límites en customización y requerimientos de clientes"
4. "'Somos lo opuesto' a la competencia — posicionamiento diferenciador de TIMining en el mercado"

---

## [Workshop 1/analisis(keep)-4.57.30 PM.png]
- Type: workshop_analysis_document
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Documento 'Lo que sabemos que SÍ necesita el usuario' — organizado en 5 clusters estratégicos con relato y atributos CX/UX/UI"
2. "Cluster A: Inteligencia Operacional Proactiva y Prescriptiva — extender el impacto de los problemas para priorizar; la herramienta debe decir 'atento, tenaz'"
3. "Cluster B: Experiencia de Usuario Simplificada y de Alto Impacto — dashboards micro, explícitos y bien dirigidos"
4. "Cluster C: Visibilidad Integral y Alineación con el Plan — gestión del proceso completo (planificación, ejecución, control)"
5. "Cluster D: Seguridad y Gestión de Riesgos — comunicación preventiva y proactiva del riesgo"
6. "Atributos diferenciadores: análisis de causa raíz por IA, asistencia proactiva en tiempo real, simulación de escenarios, comparación plan vs realidad"

---

## [Workshop 1/analisis(stop)-5.06.38 PM.png]
- Type: workshop_analysis_document
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Documento 'Lo que NO necesita el usuario (no agrega valor)' — organizado en 3 clusters con relato y atributos CX/UX/UI"
2. "Cluster A: Sobrecarga de Información y Falta de Relevancia — 'sobrecarga de información que no utiliza', 'tiempo dedicado a reportes sin explicaciones para mejorar'"
3. "Cluster B: Complejidad, Fricción y Falta de Proximidad — capacitaciones extensas, solución que llega cuando el problema ya pasó, 'Auto de Homero Simpson'"
4. "Cluster C: Estrategia de Producto y Claridad de Valor — enfoque en 'Minimum Viable Productivity (MVP)', comunicación transparente de valor"
5. "Personalización adaptativa: la interfaz se ajusta automáticamente al rol y perfil del usuario sin requerir configuración manual"
6. "'Visualización inteligente' por proyecto: los módulos y planos se diseñan orientados a cada proyecto específico"

---

## [Workshop 1/analisis(start)-4.58.21 PM.png]
- Type: workshop_analysis_document
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Documento 'Lo que el usuario NO SABE que necesita' — organizado en 4 clusters con relato y atributos CX/UX/UI"
2. "Cluster A: Asistencia Inteligente y Simplificación Operacional — no solo '¿qué pasó?' sino '¿qué hacer?'; alertas inteligentes que priorizan y recomiendan acciones"
3. "Cluster B: Control y Visibilidad del Desempeño en Tiempo Real — simulación de escenarios, actualización de datos en vivo, comparación plan vs realidad"
4. "Cluster C: Colaboración Fluida y Comunicación Efectiva — hub de comunicación integrado, intermediación inteligente, alertas automáticas, flujos de trabajo colaborativos"
5. "Cluster D: Valor Cuantificable y Confianza en los Datos — 'fuentes de la verdad' y compliance, portabilidad del dato, justificación del valor de la solución"

---

## [Workshop 1/laminas-caso-uso-1.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 1 — Gerente Minas (Cierre Mensual): reunión de cierre, adherencia/recuperación de planta es mala (100%); Detección → planta genera reporte de recuperación baja; Análisis → mezclas de mineral no son las correctas; Recomendación → ajustes de flotas/activos, categorización de mineral"
2. "Caso 2 — Planificador Corto Plazo: sala planificación/terreno en fases operativas, no hay vehículos disponibles, mantención no programada; Detección → por sistema para visualización in-situ; Análisis → entender la situación, tener datos y ciertas hipótesis; Recomendación → simulaciones para proponer alternativas a suplir"

---

## [Workshop 1/laminas-caso-uso-2.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 3 — Jefe/Ingeniero Chancado: oficina planta, bloqueo de camiones x 45 min en chancador; Detección → plataforma AVISA anticipadamente del fenómeno (sistema de alertas PI System); Análisis → muestra camiones que van al chancado y si existe posibilidad de reaccionar; Recomendación → redistribuir, detención de chancador, continuidad operativa (saturar)"

---

## [Workshop 1/workshop-laminas-11.02.43 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 4 — Gerencia CIO/Operaciones: reunión diaria entre CIO y Operaciones (8 AM), brechas respecto al plan minero, incidentes relevantes del turno; Análisis → causa-raíz, priorización objetiva (contrastar urgente vs importante); Recomendación → plan de acción para mitigar impactos, aprendizaje; Atributo → simplificación y reducción de tiempos de análisis, herramienta de Mejora Continua"

---

## [Workshop 1/workshop-laminas-11.02.51 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 5 — Perforación y Tronadura (PYT): planificador corto/JOP, terreno, incumplimiento de mantenciones; Detección → retrasos/adelanto en mantenciones planificadas; Análisis → estimación de impacto y actividades comprometidas (retraso servicios - perfo - carguío), estimar cumplimiento del plan; Recomendación → asignación de recursos para cuidar u optimizar KPI crítico del momento"

---

## [Workshop 1/workshop-laminas-11.02.57 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 6 — Gestión de Alerta de Seguridad: supervisor de monitoreo/jefe de turno/planificador corto plazo, sala de monitoreo detecta riesgo geotécnico; Detección → supervisor detecta la alerta, evalúa impacto inmediato, pide evaluación del impacto al plan; Análisis → escenarios de diferentes tiempos de indisponibilidad de zonas afectadas; Recomendación → definir zonas de restricción, redefinir plan para despacho, ajustar plan de corto plazo"

---

## [Workshop 1/workshop-laminas-11.03.01 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 7 — Ajuste Táctico (Imprevisto): gerente de mina/supervisores, sala de reuniones para definir ajuste táctico/mover equipos; Detección → alerta al supervisor, si tiene dudas pregunta a TIMining; Análisis → se buscan alternativas, se evalúan y mitigan, se identifican riesgos; Recomendación → set de alternativas con impacto medido en el plan, monitorear variables críticas para chequear avance de ajustes"

---

## [Workshop 1/workshop-laminas-11.03.06 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 8 — Despachador (Respuesta Rápida): IROC o Sala de Control, problema operacional que requiere respuesta rápida; Detección → detecta problemática y levanta alerta (ej. caída de pala no planificada); Análisis → impacto en tonelaje, tiempos; Recomendación → reasignación de equipos en base al análisis para evitar impacto, mediante teams/correo/dentro de plataforma"

---

## [Workshop 1/workshop-laminas-11.03.10 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 9 — Jefe/Ingeniero Operaciones (Velocidades): terreno/IROC/oficina/sala control, incumplimiento en plan de velocidades; Detección → levantar alerta en zonas de baja velocidad de manera automática; Análisis → impacto en tiempo/tonelaje de camiones, sugerencia de qué provoca la baja velocidad; Recomendación → causas de la baja, qué sectores son y qué debe hacer para solucionarlo"

---

## [Workshop 1/workshop-laminas-11.03.15 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 10 — Jefe de Turno (Procedimientos/Seguridad): terreno, '¿estoy cumpliendo procedimientos de trabajo?'; Detección → a través de radio consulta directa al agente, fotos; Análisis → procedimientos de trabajo, 'Experto de prevención de Riesgos', normativa legal; Recomendación → verificar cumplimiento, regulatorio/condición; Atributo → responsabilidad legal"

---

## [Workshop 1/workshop-laminas-11.03.20 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 11 — Despachador (Saturación Radio): sala control, saturación de la radio y pérdida de info; Detección → escucha de radio, reconocimiento de voces; Recomendación → lista de solicitudes, priorización de actividades"

---

## [Workshop 1/workshop-laminas-11.03.23 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 12 — Jefe de Turno (Tronadura): mina/terreno, tronadura/loros/correcto despeje; Detección → por horario, vía radio; Análisis → GPS equipos, malla a tronar; Recomendación → asegurar que despeje y posicionamiento de loros es el correcto"

---

## [Workshop 1/workshop-laminas-11.03.27 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 13 — Despachador (Falla Mecánica): sala de control, falla mecánica → traspaso de información y estimación rápida de tiempos/turnos; Detección → a través de radio, a través de estado en FMS; Análisis → comparar situaciones similares en el pasado; Recomendación → entrega falla mecánica con claridad para coordinación con mantención"

---

## [Workshop 1/workshop-laminas-11.03.31 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 14 — Supervisor de Turno (Variabilidad/Pala): turno de noche, frente de carguío de mineral, pala cae en mantención sin claridad de duración; Detección → alerta llega a celular escrita y por voz; Análisis → opciones: detener flota, cambiar puntos de vaciado, enviar cargador; Recomendación → el sistema sugiere las 3 mejores opciones para mitigar pérdidas operacionales"
2. "Atributo clave: 'capta la atención del supervisor en forma oportuna', 'da todo el contexto operacional y de seguridad', 'lista de opciones con métrica de impacto, con la mejor opción rankeada'"

---

## [Workshop 1/workshop-laminas-11.03.36 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 15 — Jefe de Turno (Caída de Pala): terreno, caída de pala en alimentación (WIP/mina), requiere movimiento de frente de otra pala; Detección → estado de la pala, entorno afectado; Análisis → re-asignación de recursos de la pala que se cae, riesgos de mover pala y recursos (seguridad, cables, aéreos, camiones); Recomendación → dónde reasignar, tener cuidado de seguridad, riesgos operacionales, actividades clave (habilitadoras)"

---

## [Workshop 1/workshop-laminas-11.03.41 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 16 — Planificador Corto Plazo (Mantenciones): terreno, incumplimiento de mantenciones; Detección → retrasos/adelanto en mantenciones planificadas; Análisis → estimación de impacto y actividades comprometidas (retraso servicios, perfo, carguío), estimar cumplimiento del plan; Recomendación → asignación de recursos para cuidar u optimizar KPI crítico del momento"

---

## [Workshop 1/workshop-laminas-11.03.52 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 17 — Machine 2 Machine (Diagrama): lámina conceptual sin contenido detallado — título 'MACHINE 2 MACHINE — Sist. INTEGRACIÓN — [Dibujo de nodo/red]' — referencia a comunicación máquina-a-máquina como visión futura"

---

## [Workshop 1/workshop-laminas-11.03.59 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 18 — Supervisor Centro Integrado (Asistente IA): en el IROC, reunión de coordinación de turno, no tiene claro cómo va el plan; Detección → le llega un mensaje a su WhatsApp con 'Sofía, tienes reunión en 15 min, así vamos contra plan en cada fase'"
2. "Escenario detallado: tronadura estuvo bajo plan un 20%, generará déficit en extracción; turno terminó con 5 camiones estacionados sin carga, lo que generará encontramiento en pala en próximos 60 min; hubo 2 situaciones de riesgo que requieren corregir"
3. "Análisis: 'nuestra plataforma corre simulaciones y analiza quiénes son los operadores'; genera un texto en terreno o WhatsApp vía LLAMA; agrega imagen 2D de la malla de tronadura con mensajes (call outs) de los temas focales"
4. "Recomendación: luego de la reunión le llegan mensajes a Sofía proactivos diciendo si sus indicaciones van ok o no"

---

## [Workshop 1/workshop-laminas-11.04.04 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 19 — Gerente Mina (Equipos Autónomos): reunión diaria de status inter-áreas, equipos autónomos se pararon mucho durante fin de semana; Detección → no cumplimiento plan, baja en velocidad promedio; Análisis → entender período de tiempo, análisis de posición y velocidad de camiones, detección de anomalías, buscar los por qué; Recomendación → reposicionamiento de antenas, mantenimiento de camiones, revisión de caminos o accesos, asignación diferenciada"

---

## [Workshop 1/workshop-laminas-11.04.10 AM.png]
- Type: workshop_use_cases
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Caso 20 — Concepto 'Skynet' (NorthStar): flujo conceptual — 'Asumiendo: tengo acceso a todos los datos'; Dueño mina → cada X minutos analizar situación general → realizar N simulaciones buscando mejoras del óptimo global → enviar sugerencias al despacho, planificación, otros roles → generar replanificación (de sugerencias/recomendación a 'haz esto') → 1° a personas, 2° a máquinas"

---

## [Workshop 1/IMG_9679.HEIC]
- Type: workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Foto pared de post-its del workshop — sección 'Lo que no necesita el usuario (no agrega valor)': categorías visibles DEPURACIÓN, ADHERENCIA/ENTENDIMIENTO, VISUALIZACIÓN"
2. "Post-its visibles: 'DESPERTAR DE INFORMACIÓN QUE NO SIRVE', 'Mostrar los mismos KPIs que todos los dashboards', 'capacitaciones muy largas', 'gastar/perder tiempo'"

---

## [Workshop 1/IMG_9680.HEIC]
- Type: workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Foto pared de post-its del workshop — vista ampliada de 3 secciones: lo que sí necesita, lo que no necesita, lo que no sabe que necesita"
2. "Post-its visibles incluyen referencias a 'dashboards', 'proactividad', 'simplificación', 'priorización' — organizados por color según categoría"

---

## [Workshop 1/IMG_9681.HEIC]
- Type: workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Foto pared de post-its — sección superior 'Lo que el usuario no sabe que necesita': post-its sobre 'DESCONOCIDO DE LO MISMO', 'LOGRAREMOS DARLE RAZÓN Y QUE GUIADO CONTRALORÍA REVALÚE/MEJORE'"
2. "Visible: pregunta '¿cuáles serían atributos de mayor impacto?' con post-its de respuesta agrupados por prioridad"

---

## [Workshop 1/IMG_9682.HEIC]
- Type: workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Foto post-its sección DEPURACIÓN — 'Lo que no necesita el usuario': post-its legibles: 'La visualización 3D de lo' [truncado], 'Mostrar los mismos KPIs que TODOS LOS DASHBOARDS', 'Capacitaciones', 'Una experiencia que te duela [truncado]'"
2. "Sección ADHERENCIA/ENTENDIMIENTO visible con post-its sobre comprensión del usuario y tiempos de aprendizaje"

---

## [Workshop 1/IMG_9683.HEIC]
- Type: workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-21T12:30

### Raw Claims
1. "Foto post-its sección VISUALIZACIÓN — post-its legibles: 'Tiempo Dedicado a Reportes y una Explicación 7 que para mejorar', 'DESPERTAR DE INFORMACIÓN QUE NO SIRVE'"
2. "Post-its sobre necesidades de visualización: 'Mucho para mis pantallas', 'problemas y su entorno', 'Doctor/Dumping' como conceptos de interfaz"
