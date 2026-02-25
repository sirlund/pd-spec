# EXTRACTIONS.md — Extracciones Brutas de Fuentes

> Archivo generado por `/extract`. Contiene claims sin procesar de cada fuente en `01_Sources/`.
> Ejecutar `/analyze` para procesar estas extracciones en insights atómicos.

---

## [entrevistas operaciones/analisis reu con operaciones.md]
- Type: meeting_analysis
- Date: 2026-01 (sin fecha exacta)
- Participants: Equipo Operaciones TIMining
- Extracted: 2026-02-16T15:00

### Raw Claims
1. "Seis productos en dos dominios: Operaciones y Planificación (Aware, Orchestra, Delta) y Geotecnia/Geología (SIC, Tangram, ARIS)"
2. "Aware + Orchestra se venden juntos como solución integrada"
3. "Aware muestra la operación en tiempo real pero solo no puede cuantificar impacto"
4. "Orchestra entrega análisis histórico para justificar el ROI"
5. "Los productos geotécnicos legacy (SIC, Tangram, ARIS) tienen base de clientes estable y leal a pesar de interfaces más antiguas"
6. "Tiempos de actualización confusos para usuarios: camiones en tiempo casi real vía GPS, mapas de calor promedio 3 horas con desfase 30 min, indicadores cada 30 min, topografía cada 15 min"
7. "La capacitación inicial no alcanza para una interfaz con múltiples capas"
8. "Los usuarios abandonan la herramienta cuando no entienden el timing de los datos"
9. "Se perdió un cliente por métricas de extracción a 24 horas que no hacían sentido — los mineros miran por turno"
10. "Los clientes piden muchas funcionalidades, pero luego les cuesta usarlas bien"
11. "Orchestra tiene dos módulos: Análisis histórico + simulador de eventos discretos"
12. "Orchestra requiere fuerte componente consultivo: usuarios no tienen tiempo para curva de aprendizaje compleja"
13. "TIMining dedica 30–36 horas por caso de renovación para armar casos de estudio"
14. "En 2022: ~600 horas en dos proyectos de consultoría completos"
15. "Proyectos de planificación anual evalúan 20+ escenarios en horizontes de 3 años"
16. "El simulador no se ha adaptado bien a camiones autónomos ni uso de múltiples rutas"
17. "Se necesitan usuarios expertos para usar 'trucos' y workarounds complejos en el simulador"
18. "~16 minas usan Orchestra vs ~6–7 que usan Aware"
19. "Delta: herramienta rápida de conciliación topográfica, resultados en menos de 1 minuto"
20. "Delta tiene tres módulos: Compliance, Mesh Builder, Batches"
21. "CODELCO, Grupo México, Equinox Gold usan Delta en todas sus operaciones a nivel corporativo"
22. "Delta estandariza la conciliación entre distintos softwares de planificación de mina"
23. "Delta suele ser la puerta de entrada para vender otros productos"
24. "SIC: evaluación de cumplimiento banco por banco (ancho de berma, ángulo, parámetros de seguridad)"
25. "SIC tiene base de datos histórica con trazabilidad de todos los ajustes"
26. "Alta autonomía del usuario en SIC comparado con Orchestra"
27. "Tangram predice bloques de roca que pueden caer mediante análisis estructural con 'discos'"
28. "Tangram calcula factor de seguridad y probabilidad de falla con modelos iterativos"
29. "Tangram se integra con topografías de planificación para identificar inestabilidades futuras"
30. "Usuarios Tangram: ingenieros geotécnicos, 2–3 veces por semana mínimo; crítico para prevenir accidentes"
31. "ARIS consolida 30+ tipos de instrumentos de monitoreo en una sola plataforma"
32. "Tipos de instrumento ARIS: estaciones meteo, piezómetros, inclinómetros, radares, prismas"
33. "ARIS genera alertas automáticas cuando lecturas exceden rangos de tolerancia"
34. "Plataforma ARIS considerada visualmente desactualizada frente a competidores"
35. "ARIS hoy se mantiene pero no se impulsa comercialmente; base de usuarios leal"
36. "Fuerte nivel de customización por cliente genera complejidad"
37. "Funcionalidades activadas/desactivadas según tipo de mina (cobre vs bauxita vs carbón)"
38. "Riesgo de 'auto de Homero Simpson': demasiadas funcionalidades pedidas por clientes generan producto difícil de usar"
39. "Necesidad de mejor validación de requerimientos: entender uso real antes de implementar features"
40. "TIMining nació en geotecnia y hoy se expande hacia software de operaciones"

## [entrevistas operaciones/reu_coo_roberto-catalan.md]
- Type: coo_meeting_transcript
- Date: 2026-01-22
- Participants: Roberto Catalán (COO), Equipo IDEMAX
- Extracted: 2026-02-16T15:00

### Raw Claims
1. "TIMining tiene entre 6 y 8 productos de software para minería"
2. "Productos centrales: Aware y Orquestra"
3. "Aware: plataforma de monitoreo operacional, usada en salas de control 24/7 con múltiples pantallas, integrando datos en tiempo real"
4. "Orquestra: herramienta de planificación, enfocada en secuencias operacionales específicas"
5. "Proyecto Team Agent / Google Gemini: en etapa de alfa temprana, co-creación con un cliente"
6. "Riesgo alto en IA minera: no hay margen para errores o 'alucinaciones', impacto en seguridad y millones de dólares"
7. "Competidores venden hardware junto con software ligado a ese hardware; sistemas operan como 'islas' de información"
8. "TIMining es agnóstico al hardware y proveedores (OEM), puede integrar datos de múltiples sensores/equipos"
9. "Diferenciador clave: capacidad de hacer 'match' entre geometría del plan y lo que pasa en terreno en tiempo casi real"
10. "Algoritmos que infieren estados de vehículos sin depender del input humano (posiciones, velocidades, patrones)"
11. "No se requiere hardware propietario adicional: propuesta basada en algoritmos y datos existentes"
12. "Stack tecnológico fragmentado: C++, Unity, Go, Python, web; sin sistema unificado de autenticación"
13. "Para conectar Orquestra con sistemas web, se recurre a bajar bases de datos y hacer cruces manuales"
14. "Estado deseado 'plug and play' aún no se cumple; esfuerzo humano clave para que sistemas 'conversen'"
15. "Al menos 4 proto-perfiles de usuario identificados"
16. "'Geometry Gap': minero en terreno no ve contexto geológico ni plan espacial detallado"
17. "Desviaciones se descubren tarde (a veces semanas después); costo de millones de dólares"
18. "Tensión entre incentivos de corto plazo (cumplir bono hoy) y valor de largo plazo de la mina"
19. "Caso Aware: detectó caída de velocidad ~20 km/h a 8 km/h en curva; descubrieron ruta mal dibujada en Komatsu Front Runner"
20. "Tiempo estándar de instalación: ~1 mes para nivel básico; luego período largo de ajustes y customizaciones"
21. "Todo 2025 comprometido en customización con un cliente"
22. "Variabilidad por: métodos de extracción, regulaciones, estructuras organizacionales, incentivos de negocio"
23. "UX base igual para todos; reglas, umbrales y lógicas cambian según faena 'debajo del agua'"
24. "Chile: rajos abiertos; Colombia (Cerrejón): rajo enorme cientos km²; Brasil (MRN): strip mining carbón; subterránea no es foco"

## [entrevistas operaciones/notas_entrevista_COO_(segunda entrevista).md]
- Type: coo_meeting_notes
- Date: 2026-01-22
- Participants: Roberto Catalán (COO), Equipo IDEMAX
- Note: Contenido idéntico a reu_coo_roberto-catalan.md (hash: 837ad4b)
- Extracted: 2026-02-16T15:00

### Raw Claims
1. "TIMining tiene entre 6 y 8 productos de software para minería"
2. "Productos centrales: Aware y Orquestra"
3. "Aware: plataforma de monitoreo operacional, usada en salas de control 24/7 con múltiples pantallas"
4. "Orquestra: herramienta de planificación, enfocada en secuencias operacionales específicas"
5. "Proyecto Team Agent / Google Gemini: en etapa alfa temprana, co-creación con un cliente, entorno controlado"
6. "En minería no hay margen para errores o 'alucinaciones' de IA: impacto en seguridad, continuidad operacional y millones de dólares"
7. "Competidores venden hardware con software ligado; múltiples 'islas' de información"
8. "TIMining agnóstico al hardware y proveedores OEM; integra datos de múltiples sensores y equipos"
9. "Diferenciador: 'match' entre geometría del plan y terreno real en tiempo casi real"
10. "Algoritmos infieren estados de vehículos sin input humano: posiciones, velocidades, patrones de movimiento"
11. "No requiere hardware propietario: propuesta basada en algoritmos y datos existentes"
12. "Stack tecnológico fragmentado: C++, Unity, Go, Python, web; no hay autenticación unificada"
13. "Conexión Orquestra-web: hoy mediante descarga de bases de datos y cruces manuales"
14. "Estado 'plug and play' aún no se cumple; esfuerzo humano para que sistemas conversen"
15. "4 proto-perfiles de usuario identificados"
16. "'Geometry Gap': minero en terreno no ve contexto geológico ni plan espacial"
17. "Desviaciones del plan se descubren semanas después; costo de millones de dólares"
18. "Tensión incentivos corto plazo (bono hoy) vs valor largo plazo de la mina"
19. "Caso Aware: caída velocidad ~20 a 8 km/h en curva → ruta mal dibujada en Komatsu Front Runner → recuperar rendimiento sin cambiar flota"
20. "Instalación básica: ~1 mes; luego ajustes y customizaciones prolongados"
21. "2025 comprometido en customización con un cliente"
22. "Variabilidad: métodos de extracción, regulaciones, estructuras organizacionales, incentivos"
23. "UX base igual; reglas, umbrales y lógicas cambian por faena"
24. "Chile: rajos abiertos; Colombia (Cerrejón): rajo enorme cientos km²; Brasil (MRN): strip mining carbón; subterránea: no es foco"

## [entrevistas operaciones/reunion_operaciones (27-01-2026).md]
- Type: operations_meeting_transcript
- Date: 2026-01-27
- Participants: Alejandro Guzzoni, Roberto Catalán, Erika Barrezueta, Humberto Díaz, Cbonilla, Hmunoz, Nlundin
- Extracted: 2026-02-16T15:00

### Raw Claims
1. "Aware es bastante customizado a las necesidades de diferentes tipos de minería: cobre, carbón, bauxita"
2. "Tiempos de actualización confusos para usuarios: camiones GPS en tiempo casi real, indicadores cada 30 min, mapas de calor promedio 3h con desfase 30 min, topografía cada 15 min"
3. "Usuarios abandonan cuando no entienden: 'llegamos, capacitamos, se entusiasman, pero luego no le entienden, adiós'"
4. "Se perdió un cliente porque métricas de extracción estaban a 24 horas — mineros evalúan por turno"
5. "Se añaden capas sin validar utilidad: 'se integran muchas, pero no entendemos el accionable que el usuario le puede dar'"
6. "Aware genera topografía cada 15 minutos con algoritmo propio usando datos GPS de las palas — no es solo un visualizador"
7. "Antes se monitoreaba vía WhatsApp con grupos de jefes de guardia y supervisores; transición a alertas automáticas"
8. "Caso de uso jefe de turno: revisar velocidad planificada vs real, identificar sectores en rojo, llamar a operadores"
9. "Mover un equipo grande y luego regresar a rematar zona incompleta genera retrabajo costosísimo"
10. "Orchestra se conecta al mismo sistema de gestión de flota que Aware pero lee datos históricos"
11. "Reportes de Orchestra 'no son los más amigables' comparados con plataformas BI"
12. "Ventaja Orchestra: visualización georreferenciada y trabajo complejo de datos de mina que normalmente requiere scripting y acceso"
13. "Datos de FMS no son de fácil acceso para planificación; operación 'limpia' errores, lo que genera mala planificación sobre datos erróneos"
14. "Usuarios buenos en módulo analítica, pero tener buenos usuarios en simulación es 'más difícil'"
15. "El simulador no se ha actualizado para camiones autónomos que se paran en cualquier momento y usan múltiples rutas"
16. "Barrera de entrada para usuarios: el tiempo — 'trabajan en mina, constantemente reagendan'"
17. "Fuerte venta consultiva y postventa: 'en el fondo son las manos del cerebro ustedes'"
18. "30-36 horas por caso de renovación; ~20 casos realizados; 2 consultorías en 2022 = ~600 horas"
19. "Plantillas de simulación se pueden reciclar entre minas, pero ejecución del proyecto desde cero"
20. "Cada cliente tiene criterios diferentes de qué es 'pérdida', lo que obliga a customizar visualizaciones"
21. "Delta: calculadora de conciliación espacial de topografías; resultados en menos de 1 minuto"
22. "Delta: tres módulos — Compliance, Mesh Builder, Batches"
23. "Delta a nivel corporativo en CODELCO, Grupo México, Equinox Gold — estandariza conciliación entre softwares de planificación"
24. "Delta agnóstico: no requiere limpiar topografía a detalle, hace diferencia directa rápidamente"
25. "Delta como puerta de entrada: 'todos los viejos quieren conciliación en tiempo real, ahí los enamoramos para ver Aware'"
26. "Aware y Orchestra dependen mutuamente: 'Aware identifica, Orchestra cuantifica; sin Orchestra no puedes justificar la compra'"
27. "Centinela compró 5 licencias de Orchestra y dejó Aware — lo llamaban 'el gemelo que no es gemelo'"
28. "Tangram predice bloques de roca que pueden caer; calcula factor de seguridad y probabilidad de falla con iteraciones"
29. "SIC: conciliación geométrica y geotécnica de bancos; una mina tiene 208,042 metros y 2,544 celdas de tronadura cargadas"
30. "SIC: alta autonomía del usuario; datos no manipulables una vez cargados"
31. "ARIS integra 30+ tipos de instrumentos; genera alertas por desplazamientos anómalos"
32. "ARIS es plataforma más antigua, no en foco de ventas; 'sería genial integrar en Aware pero no sé cómo sin complejizar'"
33. "TIMining empezó siendo geotecnia; más clientes geotécnicos (fieles a Tangram, SIC, ARIS) que operaciones"
34. "Customización incluye features visibles nuevos por cliente (ej. fajas para bauxita en Brasil)"
35. "Actualizaciones de software rompen configuraciones específicas de clientes: 'se olvidan de las configuraciones seteadas y pum, se tiraron abajo el mapa'"
36. "Erika: 'no tenemos que implementar solo porque el cliente lo dijo; debemos entender para qué lo va a usar'"
37. "Riesgo 'auto de Homero Simpson': funcionalidades acumuladas generan producto que no funciona bien para ningún cliente"
38. "Ingenieros geotécnicos usan SIC con frecuencia semanal o diaria según operación; conciliación no se actualiza sola, requiere carga manual"
39. "Industria conservadora: riesgos geotécnicos y herramientas asociadas son estables; operación cambia más que geotecnia"
40. "Aware como interfaz de capas: misma interfaz para todos los usuarios, se iluminan/apagan capas; no hay diferenciación por perfil de usuario"

## [entrevistas iniciales stakeholders/Entrevista PM AWARE.png]
- Type: image_interview_map
- Date: desconocida
- Participants: Carolina Retamal (PM AWARE)
- Extracted: 2026-02-16T15:00

### Raw Claims
1. "AWARE: llevar esto a formato 3D para entender mejor; hoy Aware es una app para mineros y sus problemas de día a día"
2. "Valor de AWARE: mejorar la operación, mejorar diferencias entre planificación y lo real"
3. "Diferenciador 1: diseño de interfaz es diferenciador"
4. "Diferenciador 2: info en tiempo real"
5. "Diferenciador 3: fácil de usar, de acceso libre a la organización"
6. "Fortaleza: fidelidad del modelo"
7. "Fortaleza: calidad del dato y check list"
8. "Problema principal: calidad del dato y manipulación del dato"
9. "Problema: complejidad de servidores"
10. "Problema: falta de cuantificación de impacto"
11. "Competencia: exámenes vivos y actualizados"
12. "Brecha: capturar el rol en nuestro ecosistema interacción y 'sticky'"
13. "Referentes UX: buscar referentes de design systems, ClickUp (todo en un mismo lugar), videojuegos, mapas Google, Power BI para datos"
14. "Argumento de venta: AWARE es más datos en tiempo real (light, solo ilumina); Orchestra es análisis profundo"
15. "Comparaciones gráficas de características y funcionalidades como herramienta de venta"
16. "Futuro 2026: que exija algo nuevo que ahora no puede hacer"
17. "Competencia de centros remotos: aprendizaje simple, facilidad de uso y acceso libre"

## [entrevistas iniciales stakeholders/Entrevista PM Orchestra.png]
- Type: image_interview_map
- Date: desconocida
- Participants: Ernesto Pérez (PM ORCHESTRA)
- Extracted: 2026-02-16T15:00

### Raw Claims
1. "Orchestra: impulsar productividad de la flota (cielo abierto), análisis y simulación de cuellos de botella"
2. "Dos módulos: 1. Análisis 2. Simulación"
3. "Valor: cuantificación de desviaciones y pérdidas; mejorar condiciones para optimización de faena"
4. "Diferenciador: ayudar/mejorar condiciones para optimización de faena"
5. "Usuarios: servicio de mina — extracción de data, uso de data expos"
6. "Simulación: usuario debe ser experto; análisis de data profunda de datos pasados"
7. "Fortaleza: servicio de mina, extracción de data del paso dependiente del cliente"
8. "Problema: 30% uso de usuarios"
9. "Problema: simulador muy sofisticado y solo vale para usuarios expertos"
10. "Problema: brechas técnicas no generalizables en tiempo real; complejidad, usuario no tiene tiempo para familiarizarse"
11. "Data accesible: pre-factibilidad a arquitectura"
12. "Futuro 2026: empowerment simulador interactivo/perfiles (técnicos y arquitectura 3 meses), paso a producción prototipos (4 meses)"
13. "Busca: user-driven pull from operational (don't push from corporate)"
14. "Nomenclatura requiere un experto para entender"
15. "Ideas finales: productividad/desviación y corrección, análisis de datos profundos y pasados, análisis y simulación, co-piloto operacional"

## [entrevistas iniciales stakeholders/Entrevista_Ana.png]
- Type: image_interview_map
- Date: desconocida
- Participants: Ana (Gerente Comunicaciones)
- Extracted: 2026-02-16T15:00

### Raw Claims
1. "TIMining: una compañía (not startup) con cierta madurez, resuelve problemas en industria minera, es operacional de cumplimiento del plan minero"
2. "Board confía en lo que resuelve, pero 'en la realidad no sé si el cliente lo percibe'"
3. "Valor: inversionistas y board con cierta proyección; expertise técnico centralizado (hoy mucho en Carlo)"
4. "Interacción humana es valor clave: 'el que nos resuelve'"
5. "UX y complejidad: el equipo que vela que se cumpla el plan minero"
6. "Fortaleza: cerebro del proceso de la mina; lo que determina el CORE y crea valor en el proceso mina"
7. "Problema: comunicación y atributos es mal visto — brecha de atributos, flexibilidad con pérdida de foco"
8. "Transición a plataforma: permite traducir lo técnico y complicado a algo más fácil para el cliente"
9. "Problema: 'no podemos estar prevalido de los deseos del cliente'; no somos capaces de convencer cuando es estratégico"
10. "'Se puede decir NO?' — desafío de saber decir no a clientes, balancear customización vs producto core"
11. "Gap principal: Back vs Front — gap entre producto y storytelling; cómo comunicamos (gente super técnica que comunica)"
12. "Futuro: canvas de lo que resuelve; touch-point forma en principios muy limpia y genuina"
13. "Referentes: Pinterest, 'ciencias con un toque de data', mensajes para distintas audiencias"
14. "Futuro 2030: posicionada como minera más prestigiosa de LATAM"
15. "Expectativa: cómo desafiamos a Carlo; multimodal (la propuesta recordó ese todo de la información a la mina)"
16. "Expertise técnico muy concentrado en Carlo (CEO/CTO)"
17. "'Somos lo opuesto' — identidad diferenciadora"

## [entrevistas iniciales stakeholders/Entrevista Roberto COO.png]
- Type: image_interview_map
- Date: desconocida
- Participants: Roberto Catalán (COO, Comercial, Operación, Servicios mineros, Mejora continua) — 8 años en TIMining
- Extracted: 2026-02-16T15:00

### Raw Claims
1. "TIMining: integrador de datos en forma minera; AWARE: sistema monitoreo en tiempo real"
2. "Valor: las decisiones que toman hoy la toma bien la data base con información"
3. "Como somos agnósticos, dependemos del proveedor de datos; como somos agnósticos podemos leer todo"
4. "Diferenciador: INTEGRADORES — no hay nadie que integre y enriquezca los datos"
5. "TIMining enriquece y manipula los datos; predicción de futuro"
6. "Usuarios principales: despacho y planning"
7. "Los que planifican: 'SET COMUN Lineamientos Son NO NATIVOS DIGITALES'"
8. "Fortaleza: producir soluciones para diferentes tipo de minería"
9. "'ASEGURAMOS QUE EL CLIENTE RENUEVE' como propuesta de valor"
10. "Problema: CICLO DE VENTA 2 AÑOS / más 6 meses instalación"
11. "Problema: burocracia de acceso al dato"
12. "'Smart' no como lo entendemos nosotros; no lo usan como plataforma"
13. "Brecha: los softwares no conversan entre sí"
14. "Oportunidad: usar TIMining para reportabilidad"
15. "Brechas de conocimiento en usuarios"
16. "'No doy abasto a solicitudes de customización'; hay 'capas' de integración y data"
17. "La customización es real, desde el dato; módulos abiertos para ayudar a otro cliente"
18. "Módulo de Alertas como prioridad futura"
19. "Referentes: buscar Cerebro cotidiano que concretice todo en un gráfico claro; Antigravity como referente, customizas"
20. "Futuro: reportes dinámicos; 'que seamos tu copiloto para perfiles más especializados'"
21. "'Me encantaría emitir reportes más especializados'; que tengamos perfiles"
22. "Ideas finales: customización, LockIn, perfilamiento ejecutivo, medición de impacto, agilidad y tiempos de respuesta, data y alertas"

## [Workshop 1/transcript.md]
- Type: workshop_transcript
- Date: 2026-01-29
- Participants: Philippe (CEO), Carlos (CTO), Alejandro Guzzoni, Cbonilla, Hmunoz, Nlundin, equipo TIMining
- Extracted: 2026-02-16T15:00

### Raw Claims
1. "Objetivo del workshop: diseñar la arquitectura UX/UI de la nueva plataforma multimodal TIMining CORE"
2. "2024 fue año de modularizar algoritmo; 2025 año de integrar IA y alarmas"
3. "Capacidades potentes (forecasting, topografía en línea) existen pero están 'desordenadas' o dependen de implementaciones manuales"
4. "Metáfora del iceberg: interfaz actual es solo la punta; objetivo es liberar el valor sumergido (datos, integraciones) a través de nueva UX"
5. "TIMining tiene capacidad de vender 'en verde' (pre-venta) porque ciclo de implementación es lento y permite desarrollo paralelo"
6. "Falta el 'diagrama de la casa piloto': tienen las piezas (baño, silla) pero no la arquitectura coherente"
7. "Meta comercial: nuevo producto debe justificar precio de USD 450k (vs Aware actual)"
8. "Tecnología en tres capas: (1) integración datos real-time, (2) inteligencia (topografía, sensores virtuales), (3) UX/UI"
9. "'Efecto Suiza': TIMining como integrador neutral porque es agnóstico al hardware"
10. "Problema raíz: ayudar a la mina a cumplir su plan minero (= plan de negocio del dueño)"
11. "Desconexión: el dueño quiere cumplir plan de negocio; el jefe de turno solo quiere cumplir su turno y evitar problemas inmediatos"
12. "El plan minero se pierde en todos los turnos, no una vez al año; sin sistema no se detecta cuándo/dónde"
13. "Hipótesis: esto debería ser importante para CFO, pero TIMining no habla con CFOs"
14. "TIMining debe pasar de 'kiosco de dulces' (darle al cliente lo que pide) a 'médico' (diagnosticar problema real)"
15. "Industria lenta y conservadora, ciclos de venta de 1+ año; punto de partida debe ser razonablemente bueno"
16. "Valor en números que cliente no tiene, no en replicar lo que ya tiene"
17. "Multimodalidad: hoy valor se entrega por Aware, reportes, alertas, chat/agente, radio mina"
18. "Decisión estratégica: solución flexible multimodal vs converger todo en Aware"
19. "Experiencia incluye desde la compra: si instalación es complicada, es parte de mala UX"
20. "Desafío de pricing: no hay claridad modelo negocio entre producto base, configuración, customización, consultoría"
21. "Escenario cambio de turno ('Sofía'): recibe resumen proactivo 15 min antes con problemas y recomendaciones"
22. "Escenario falla equipo: sistema estima impacto en cumplimiento del plan, sugiere reasignación de recursos"
23. "Escenario seguridad: consulta por voz/radio al agente IA, validación contra normativa"
24. "Escenario reunión gerencia: detección automática brechas, priorización de incidentes por impacto"
25. "Concepto 'Skynet': cada X minutos analiza situación, corre N simulaciones, envía sugerencias, genera replanificación; de personas a máquinas"
26. "Valor no está en el software sino en la 'paz mental' del usuario: saber que está tomando la decisión correcta"
27. "Del dashboard al agente: paso de pantallas con gráficos a asistencia proactiva (recomendaciones, alertas predictivas)"
28. "Gestión por excepción: si hay 50 camiones bien, no mostrarlos; mostrar los 5 que generan problema"
29. "Plataforma debe explicar qué pasó (análisis causa), qué está pasando (monitoreo) y qué pasará si no se actúa (simulación impacto)"

## [Workshop 1/analisis_workshop.md]
- Type: workshop_analysis
- Date: 2026-01-29
- Participants: Equipo TIMining + facilitadores UX
- Extracted: 2026-02-16T15:00

### Raw Claims
1. "Workshop marcó inicio formal del diseño de arquitectura UX/UI de la nueva plataforma multimodal TIMining Core"
2. "Objetivo: lanzar concepto 'en verde' para Q2 (segundo trimestre)"
3. "2024 modularización del algoritmo; 2025 integración IA y alarmas; capacidades potentes pero 'desordenadas'"
4. "Metáfora iceberg: UI actual es punta; objetivo liberar valor sumergido (datos, integraciones) con nueva UX"
5. "TIMining puede vender 'en verde' (pre-venta) por confianza del cliente; falta 'diagrama casa piloto'"
6. "Ambición comercial: ticket más alto (USD 450k vs actual)"
7. "Problema raíz: ayudar a mina a cumplir Plan Minero (Plan de Negocio)"
8. "Desconexión: dueño quiere cumplir plan negocio; jefe turno quiere cumplir su turno; CFO es usuario 'invisible'"
9. "CFO: dinero no se pierde al final del año sino en cada turno mal gestionado"
10. "TIMining debe pasar de 'kiosco dulces' a 'médico' (diagnosticar problema real)"
11. "Escenario cambio turno ('Sofía'): resumen proactivo, recomendación asignación, texto para charla inicio turno"
12. "Escenario falla equipo: sistema estima impacto cumplimiento plan, sugiere reasignación, advierte riesgos seguridad"
13. "Escenario seguridad: interacción voz/radio, validación contra normativa legal y procedimientos faena"
14. "Escenario reunión gerencia: detección automática brechas, priorización incidentes por impacto producción"
15. "Nuevo concepto de valor: 'Paz Mental' — usuario quiere saber que toma decisión correcta"
16. "Del dashboard al agente: de pantallas con gráficos a asistencia proactiva"
17. "Integración pasado-presente-futuro: qué pasó (causa), qué pasa (monitoreo), qué pasará (simulación)"
18. "Gestión por excepción: filtrar ruido, mostrar solo lo que genera problema"

## [Workshop 1/_FIELD_NOTES.md]
- Type: field_notes
- Date: 2026-02-15
- Extracted: 2026-02-16T15:00

### Raw Claims
1. "El CTO Carlos está muy confiado de que el diseño de los productos de TIMining están muy por sobre la vara de otros softwares de minería (y puede que tenga razón) pero eso no significa que no tengan problemas graves de UX" (Confidence: high)
# Extracciones de Imagenes - Workshop 1

## [Workshop 1/workshop-laminas-11.02.43 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 4: Caso de uso Gerencia CIO / Operaciones"
2. "El usuario principal es el Gerente CIO / Ing. Principal CIO o Gerente Mina"
3. "El escenario ocurre en una reunion diaria entre CIO y Operaciones a las 8 AM"
4. "La situacion de estres es un escenario de crisis"
5. "La plataforma TIMining debe detectar brechas respecto al plan minero"
6. "La plataforma TIMining debe detectar incidentes relevantes del turno"
7. "El analisis en la plataforma TIMining debe generar causa-raiz de los incidentes"
8. "El analisis debe permitir priorizacion objetiva de los incidentes (centrarse en lo importante)"
9. "La recomendacion de la plataforma TIMining debe incluir plan de accion para mitigar impactos negativos"
10. "La recomendacion debe facilitar aprendizaje"
11. "Se valora como atributo la integracion de informacion (texto tachado sugiere cambio)"
12. "Se valora la simplificacion y reduccion de los tiempos de analisis"
13. "La plataforma debe ser una herramienta de Mejora Continua"

## [Workshop 1/workshop-laminas-11.02.51 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 5: Caso de uso Perforacion y Tronadura (PyT)"
2. "El usuario es SENIOR / JEFE PyT"
3. "El escenario ocurre al inicio de turno en una oficina"
4. "Situacion de estres: Patron NO esta listo para perforar"
5. "Situacion de estres: Hay poco material tronado disponible"
6. "La plataforma TIMining debe detectar equipos de servicio en mantenimiento no programado"
7. "La plataforma TIMining debe detectar que el plan de perforacion indica que la actividad es critica"
8. "El analisis debe responder: Existen equipos disponibles que se puedan reasignar?"
9. "El analisis debe responder: Como afecta aguas abajo? Hay material tronado disponible?"
10. "El analisis debe verificar si existe holgura en el plan"
11. "La recomendacion debe disponibilizar planes de accion"
12. "La recomendacion: De ser posible, ajustar planes aguas abajo para que no sea critico"
13. "Debe indicar sino, alertar a quienes se ven afectados"
14. "Debe ofrecer alternativas y comunicacion"
15. "Los atributos valorados son: Plan (Ruta critica), Estado de los equipos (Datos), Secuencia de actividades"
16. "Fuente de datos: Material tronado"

## [Workshop 1/workshop-laminas-11.02.57 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 6: Caso de uso Gestion de Alerta de Seguridad"
2. "Los usuarios son: Supervisor de monitoreo, Jefe de turno, Planificador corto plazo"
3. "El escenario ocurre en la sala de monitoreo cuando se detecta un riesgo que tiene que sacar la pala"
4. "La situacion de estres es un Riesgo Geotecnico"
5. "La decision de crisis es: Sacan la pala, esperan? Ajustan el plan?"
6. "La plataforma TIMining detecta: El supervisor de monitoreo detecta la alerta"
7. "La plataforma evalua el impacto inmediato de este evento (con Jefe de Turno)"
8. "Se pide una evaluacion del impacto al plan (Planificador)"
9. "El analisis en TIMining incluye: Analisis de escenarios de diferentes tiempos de indisponibilidad de las zonas afectadas"
10. "La recomendacion de TIMining: Definir zonas de restriccion"
11. "Recomendacion: Redefinir el plan para el despacho"
12. "Recomendacion: Ajustar el plan de corto plazo"

## [Workshop 1/workshop-laminas-11.03.01 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 7: Caso de uso Ajuste Tactico (Imprevisto)"
2. "El usuario es el Gerente de Mina y su equipo de supervisores"
3. "El escenario ocurre en la sala de reuniones para definir un ajuste tactico: mover equipos"
4. "La situacion de estres es: Fallo un equipo principal o se activo una zona geotecnica"
5. "La plataforma TIMining detecta: Envia una Alerta al supervisor que corresponda"
6. "El supervisor chequea en [pantalla/campo?] la situacion"
7. "Si tiene dudas pregunta a TIM [posiblemente TIMining]"
8. "Pide la evaluacion del impacto a fin del turno o la semana"
9. "Si el impacto es importante avisa al Gerente de Mina"
10. "El analisis en la plataforma: Se procesa en conjunto el impacto"
11. "Se buscan alternativas"
12. "Se evaluan las alternativas y su mitigacion"
13. "Se identifican los riesgos de la nueva accion"
14. "Requiere ajustar el plan?"
15. "La recomendacion: Se entrega un set de alternativas, con el impacto medido en el plan"
16. "Opcionalmente se recomienda ajustar el plan semanal o mensual segun corresponde"
17. "Se recomienda monitorear algunas variables criticas para chequear el avance de los ajustes"

## [Workshop 1/workshop-laminas-11.03.06 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 8: Caso de uso Despachador (Respuesta Rapida)"
2. "El usuario es el Despachador"
3. "El escenario ocurre en IROC o Sala de Control"
4. "La situacion de estres es un problema operacional que requiere respuesta rapida"
5. "La plataforma TIMining detecta problematica y levanta alerta, por ejemplo: Caida de Pala no planificada"
6. "El analisis de TIMining muestra impacto en tonelaje, tiempos, etc. por caida de pala"
7. "La recomendacion: Plataforma entrega Recomendacion"
8. "Reasignacion de equipos en base al analisis para evitar el impacto"
9. "Comunicacion mediante teams, correo, dentro Plataforma u otro"
10. "Atributo: Le entrega una Alerta"

## [Workshop 1/workshop-laminas-11.03.10 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 9: Caso de uso Jefe/Ingeniero Operaciones (Velocidades)"
2. "Los usuarios son: Jefe Ing Operaciones, Planificador o Despachador"
3. "El escenario ocurre en: Terreno o IROC, Oficina, Sala Control"
4. "La situacion de estres es: Incumplimiento en Plan Velocidades"
5. "Reunion diaria donde se revisa el incumplimiento (nota manuscrita sugiere frecuencia 'diaria' posiblemente 'semanal')"
6. "La plataforma TIMining debe: Levantar Alerta en zonas de Baja Velocidad o fuera de plan de manera automatica"
7. "El analisis debe: Analizar impacto en tiempo tonelaje o camiones de estas rutas/areas"
8. "Cuanto pierden y analizar una posible sugerencia y que provoca esta baja velocidad"
9. "La recomendacion: Entregar causas de esta baja, que sectores son y que debe hacer para solucionarlo"

## [Workshop 1/workshop-laminas-11.03.15 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 10: Caso de uso Jefe de Turno (Procedimientos/Seguridad)"
2. "El usuario es el Jefe de turno"
3. "El escenario ocurre en terreno"
4. "La situacion de estres: Estoy cumpliendo procedimientos de trabajo?"
5. "La plataforma TIMining detecta: A traves de radio consulta directa al agente"
6. "La plataforma TIMining detecta: Fotos"
7. "El analisis de TIMining: Procedimientos de trabajo - 'Experto de prevencion de Riesgos'"
8. "El analisis incluye: Semagemin. Legal."
9. "La recomendacion: Esa/Verificar? Cual es el estandar, estoy cumpliendo?"
10. "Recomendacion: Como estandarizo / Regularizo condicion?"
11. "Atributo: Responsabilidad Legal!"

## [Workshop 1/workshop-laminas-11.03.20 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 11: Caso de uso Despachador (Saturacion Radio)"
2. "El usuario es el Despachador"
3. "El escenario ocurre en Sala control"
4. "La situacion de estres: Saturacion de la radio - perdida de info"
5. "La plataforma TIMining detecta mediante: Escucha de radio"
6. "La plataforma TIMining detecta mediante: Reconocimiento de Voces"
7. "El campo de analisis de la plataforma esta vacio o con texto muy tenue/borrado"
8. "La recomendacion de TIMining: Lista de solicitudes"
9. "Recomendacion: Priorizacion de actividades"

## [Workshop 1/workshop-laminas-11.03.23 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 12: Caso de uso Jefe de Turno (Tronadura)"
2. "El usuario es Jefe de turno"
3. "El escenario ocurre en Mina - terreno"
4. "La situacion de estres: Tronadura - Loros - Correcto despeje"
5. "La plataforma TIMining detecta: Por Horario"
6. "La plataforma TIMining detecta: Via radio"
7. "El analisis incluye: GPS equipos"
8. "El analisis incluye: Malla a tronar"
9. "La recomendacion: Asegurar que despeje y posicionamiento de loros es el correcto"

## [Workshop 1/workshop-laminas-11.03.27 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 13: Caso de uso Despachador (Falla Mecanica)"
2. "El usuario es el Despachador"
3. "El escenario ocurre en Sala de control"
4. "La situacion de estres: Falla mecanica que requiere traspaso de informacion y estimacion rapida de tiempos/turnos"
5. "La plataforma TIMining detecta: A traves de radio"
6. "La plataforma TIMining detecta: A traves de estado en FMS"
7. "El analisis de TIMining: Comparar situaciones similares en el pasado"
8. "La recomendacion: Entrega falla mecanica con claridad para coordinacion con mantencion"
9. "Recomendacion: Como enfrentar la averia"

## [Workshop 1/workshop-laminas-11.03.31 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 14: Caso de uso Supervisor de Turno (Variabilidad/Pala)"
2. "Titulo manuscrito arriba: Control de variabilidad de procesos"
3. "El usuario es Supervisor de turno"
4. "El escenario ocurre durante su turno de noche en la frente de carguio de mineral"
5. "La situacion de estres: La pala cae en mantencion y no tienen claridad cuanto tiempo estara indisponible"
6. "La plataforma TIMining detecta: La alerta le llega a su celular escrita y por voz"
7. "El analisis de TIMining: Que opciones tiene - Detener parte de la flota camiones"
8. "Opcion de analisis: Cambiar puntos de vaciado aumentando el transporte/tiempo de viaje"
9. "Opcion de analisis: Enviar un cargador al punto de carguio"
10. "La recomendacion: El sistema sugiere las 3 mejores opciones para mitigar las perdidas operacionales"
11. "Atributo: Capta la atencion del supervisor en forma oportuna"
12. "Atributo: Se da todo el contexto operacional, tanto geo(?), de seguridad y el escenario si no se hace nada"
13. "Atributo: Lista de opciones con metrica de impacto, con la mejor opcion rankeada"

## [Workshop 1/workshop-laminas-11.03.36 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 15: Caso de uso Jefe de Turno (Caida de Pala)"
2. "Los usuarios son: Jefe de Turno y Operaciones"
3. "El escenario ocurre en Terreno (hay una palabra tachada al lado, ilegible)"
4. "La situacion de estres: CAIDA DE PALA EN ALIMENTACION (Wip/Mina?)"
5. "Requiere movimiento de frente de otra pala"
6. "La plataforma TIMining detecta: Estado de la pala"
7. "La plataforma TIMining detecta: Entorno afectado"
8. "El analisis de TIMining: Re-asignacion de recursos de la pala que se cae"
9. "El analisis incluye: Riesgos asociados a mover la pala y recursos que debe movilizar (Seguridad, cables, aereos, camiones, etc.)"
10. "La recomendacion: Donde reasignar"
11. "Recomendacion: Donde tener cuidado (seguridad)"
12. "Recomendacion: Riesgos operacionales"
13. "Recomendacion: Actividades clave (Habilitadoras)"

## [Workshop 1/workshop-laminas-11.03.41 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 16: Caso de uso Planificador Corto Plazo (Mantenciones)"
2. "Los usuarios son: Planificador Corto, JOP (Probablemente Jefe Operaciones)"
3. "El escenario ocurre en Terreno"
4. "La situacion de estres: Incumplimiento de Mantenciones"
5. "La plataforma TIMining detecta: Retrasos - Adelantos en mantenciones planificadas"
6. "El analisis de TIMining: Estimacion de impacto y actividades comprometidas (Retraso servicios - perfo - carguio)"
7. "El analisis debe: Estimar cumplimiento del plan"
8. "La recomendacion: Asignacion de recursos para cuidar u optimizar x KPI critico del momento (De moda?)"

## [Workshop 1/workshop-laminas-11.03.52 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 17: Machine 2 Machine (Diagrama)"
2. "Esta lamina no tiene contenido en los casilleros, solo un titulo y un esquema"
3. "El titulo principal es: MACHINE 2 MACHINE - Sist. INTEGRACION"
4. "Incluye un dibujo de nodo/red que sugiere integracion de sistemas"

## [Workshop 1/workshop-laminas-11.03.59 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 18: Caso de uso Supervisor Centro Integrado (Asistente IA)"
2. "El usuario es el Supervisor del centro integrado"
3. "El escenario ocurre en el IROC"
4. "La situacion de estres: Tiene reunion de coordinacion del turno y dado que fue de estadia llena de reuniones y contestando correos, no esta preparada para la reunion"
5. "No tiene claro como van contra plan, donde estan los problemas principales y como solucionarlos, que indicar a los demas de cual es el plan"
6. "La plataforma TIMining detecta: Le llega un mensaje a su WhatsApp con un 'Sofia, tienes reunion en 15 min. Asi vamos contra plan en cada fase xxxx'"
7. "Los problemas de la TIMining estan en las siguientes areas"
8. "La tronadura estuvo bajo plan un 20%, lo que generara un deficit en la extraccion del turno que viene"
9. "El turno termino con 5 camiones estacionados sin carga, lo que genero encolamiento en pala los proximos 60 minutos"
10. "Hubo 2 situaciones de riesgo que es importante corregir: 2 colegas entraron en zona de riesgo (VERTICAL / VEHICULAR?)"
11. "El analisis de TIMining: Quieres que te genere algunas recomendaciones para tu reunion?"
12. "La plataforma debe correr simulaciones y analizar cuales son los operadores donde hay que tener foco"
13. "Generar un texto en WhatsApp o su interfaz LLMS"
14. "Agregar una imagen en 2D de la malla de tronadura con mensajes (call outs) de los temas focales"
15. "Recomendar un texto con las indicaciones principales"
16. "Recomendacion: Luego de la reunion le llegan mensajes a Sofia proactivos diciendo si sus indicaciones van ok o no"

## [Workshop 1/workshop-laminas-11.04.04 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 19: Caso de uso Gerente Mina (Equipos Autonomos)"
2. "El usuario es el Gerente Mina"
3. "El escenario ocurre en reunion diaria de status inter-areas"
4. "La situacion de estres: Equipos autonomos se pararon mucho durante fin de semana"
5. "La plataforma TIMining detecta: No cumplimiento plan"
6. "La plataforma detecta: Baja importante en la velocidad promedio"
7. "El analisis de TIMining: Entender periodo de tiempo"
8. "Analisis: Analisis de posicion y velocidad de camiones"
9. "Analisis: Deteccion de las anomalias"
10. "Analisis: Buscar los por que"
11. "La recomendacion: Reposicionamiento de antenas"
12. "Recomendacion: Mantenimiento de camiones"
13. "Recomendacion: Revision de caminos o accesos"
14. "Recomendacion: Asignacion diferenciada"

## [Workshop 1/workshop-laminas-11.04.10 AM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 20: Concepto 'Skynet' (Hoja suelta) - flujo conceptual, no sigue formato de casillas"
2. "Encabezado: Asumiendo que tengo acceso a todos los datos"
3. "Rol: Dueno mina"
4. "Flujo: Cada X minutos analizar la situacion general de la mina"
5. "Flujo: Realizar N simulaciones buscando mejoras el optimo global"
6. "Flujo: Enviar sugerencias al despacho, a planificacion, a otros roles/areas"
7. "Flujo: Generar una replanificacion (Pasar de sugerencias/recomendacion a 'haz esto')"
8. "Prioridad de replanificacion: 1ro A personas"
9. "Prioridad de replanificacion: 2do A maquinas"

## [Workshop 1/laminas-caso-uso-1.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 1: Caso de uso Gerente Minas (Cierre Mensual)"
2. "El usuario es Gerente Minas"
3. "El escenario ocurre en la reunion de cierre de mes"
4. "La situacion de estres: Se cumple el mineral y el lastre pero la Adherencia / recuperacion de la planta es mala (100%)"
5. "La plataforma TIMining detecta: La planta genera reporte que la recuperacion esta capriola"
6. "El analisis de TIMining: Las mezclas de mineral no son las correctas"
7. "La recomendacion: La matriz de carguio transporte fallo, el mineral de los frentes no son reales"
8. "Se recomienda dinamicos ajustes de flotas / activos"
9. "Atributo: Categorizacion de mineral en frentes de carguio"
10. "Atributo: Tracking del mineral y anticiparse a lo que va al chancado"
11. "Lamina 2: Caso de uso Planificador Corto Plazo"
12. "El usuario es Planificador corto plazo"
13. "El escenario ocurre en: Sala planificar / terreno en fases operativas"
14. "La situacion de estres: No hay vehiculos disponibles"
15. "Material a extraer no es lo previsto"
16. "Situacion de mantenimiento no programado"
17. "La plataforma TIMining detecta: Por sistema a par evaluacion in-situ"
18. "El analisis de TIMining: Entender la situacion"
19. "Analisis: Tener los datos y ciertas hipotesis para seguir avanzando minimizando costo corto o mediano plazo"
20. "La recomendacion: Con simulaciones podriamos proponer alternativas para suplir, mitigar o corregir la situacion"

## [Workshop 1/laminas-caso-uso-2.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Lamina 3: Caso de uso Jefe/Ingeniero Chancado"
2. "Archivo referenciado: IMG_20260202_133317.jpg"
3. "El usuario es Ing / Jefe de Chancado"
4. "El escenario ocurre en oficina planta"
5. "La situacion de estres: Bloqueo de camiones x 45 min en el chancador"
6. "La plataforma TIMining detecta: Plataforma AVISA anticipadamente de este fenomeno (x sistema de alertas de PI System)"
7. "El analisis de TIMining: Muestra los camiones que van al chancado y si existe posibilidad de reaccionar o stockear? si es algo mayor"
8. "La recomendacion: Recomienda redistribuir"
9. "Recomendacion: Detencion de chancador"
10. "Recomendacion: Continuidad operativa (saturar)"

## [Workshop 1/analisis(keep)-4.57.30 PM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Documento de analisis titulado: 'Lo que sabemos que si necesita el usuario (si o si)'"
2. "Seccion 1: Agrupacion Tematica y Clusters Estrategicos - Se identifican clusters tematicos de funcionalidades esenciales"
3. "Cluster: Inteligencia Operacional Proactiva y Prescriptiva - Series historicas que impulsan alertas automaticas para anticiparse a cosas"
4. "Se mencionan alertas criticas en tiempo real, claras, rapidas y simples"
5. "Contrarreloj: Generar recomendaciones en los equipos"
6. "Entender el impacto de los problemas para priorizarlos"
7. "Cluster: Experiencia de Usuario Simplificada y de Alto Impacto"
8. "Las maquinas se dan vueltas por donde no deberian"
9. "Los resultados de plan vs real"
10. "Que puedo verificar en el equipo y en el computador"
11. "Que su asistente le diga que es lo mas relevante necesito yo saber"
12. "Cluster: Estabilidad Integral y Alineacion con el Plan"
13. "Gestionar un plan unico coherente (Mining Trucks) - Pyt - Cyt - Chancado"
14. "Cluster: Seguridad y Gestion de Riesgos"
15. "Seccion 2: Relato Estrategico por Cluster"
16. "TIMining es transformarse en el centro operativo de la mina, no solo recolectar datos sino convertir la informacion en tiempo real y predictivo de estrategias"
17. "Su valor radica en la capacidad de anticipar problemas en minutos, lo que permite redefinir actividades en tiempo real y optimizar el plan"
18. "La seguridad es una prioridad inminente. TIMining integra la gestion del riesgo y la proteccion del ecosistema minero"
19. "TIMining puede digitalizar el cumplimiento de estandares de seguridad y normativa, funcionando como un sistema de alerta temprana"
20. "Seccion 3: Atributos Diferenciadores con Foco en CX / UX / UI"
21. "Actualizacion de Estado en Tiempo Real: capacidad de generar alertas automaticas basadas en datos historicos con un enfoque predictivo"
22. "Analisis de Causa Raiz Asistido por IA: que reduzca el tiempo de diagnostico y cuya recomendacion sea la que el usuario necesita"
23. "Experiencia del usuario: Permitir al usuario facilitar el acceso rapido a informacion relevante"
24. "Recomendaciones de Feedback: Respuestas accionables y respuestas"

## [Workshop 1/analisis(start)-4.58.21 PM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Documento de analisis titulado: 'Lo que el usuario no sabe que necesita'"
2. "Cluster: Asistencia Inteligente y Simplificacion Operacional"
3. "Se identifica que el usuario no sabe que necesita un 'copiloto' que le diga 'oye esto es importante, que haces?'"
4. "Se necesita una simplificacion intuitiva automatica sin ruido operacional"
5. "Cluster: Control y Visibilidad del Desempeno en Tiempo Real"
6. "Se necesita un desplegamiento del desempeno en tiempo real que no sea un dashboard complejo sino algo que se pueda mirar en un vistazo"
7. "Comparar Plan vs. Realidad de forma automatica"
8. "Cluster: Colaboracion Fluida y Comunicacion Efectiva"
9. "Se necesita un Hub de Comunicacion Integrado: una plataforma que centralice todo: correo, notificaciones, estados de equipos"
10. "Intermediacion Inteligente: la IA facilite la comunicacion entre roles, traduzca alertas y mensajes"
11. "Flujos de Trabajo Colaborativos: que centralice las comunicaciones, replique logicas y procesos"
12. "Cluster: Valor Cuantificable y Confianza en los Datos"
13. "Es importante cuantificar el 'valor que estoy dejando pasar' y el valor que estoy generando"
14. "Mayor Inteligencia de los KPI: tener informacion, empezar la cadena de valor"
15. "Valor Monetario de las Mejoras: Atribuirle plata a una mejora"
16. "Seccion 3: Atributos Diferenciadores con Foco en CX/UX/UI"
17. "Asistente Inteligente y Simplificacion Operacional"
18. "Explicitacion 'Asistente Operativo': Habilitacion del asistente virtual para entregar experiencia automatizada, recomendaciones y acceso a cuadro de Flujo de Operaciones"
19. "Explicacion de Causa y Efecto: Herramienta visuales y narrativos que desglosen 'que paso', 'por que paso' y 'que deberiamos hacer'"
20. "Control y Visibilidad del Desempeno en Tiempo Real: modos visuales que varien segun roles"
21. "Simulador de Escenarios: un modulo visual/digital que les permita simular y visualizar en forma facil"
22. "Actualizacion de Datos en Vivo: una seccion que muestre 'ahora mismo'"
23. "Comparativo Plan vs. Realidad: Dashboard interactivo entre plan original y avances reales"
24. "Alertas de Comunicacion Inteligentes: notificaciones, esquemas de logicas para comunicar"

## [Workshop 1/analisis(stop)-5.06.38 PM.png]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Documento de analisis titulado: 'Lo que no necesita el usuario (no agrega valor)'"
2. "Cluster: Sobrecarga de Informacion y Falta de Relevancia"
3. "Se identifica que NO se necesita: DEMASIADA INFORMACION QUE NO UTILIZAN (NO ES ALGO ACCIONABLE)"
4. "NO: Recibir informacion generica e irrelevante que no tiene impacto en grafico real"
5. "NO: Reportar Informacion - Generar confusion"
6. "NO: Integrar datos sin entender el Problema y enviar valores con datos al usuario"
7. "Cluster: Complejidad, Friccion y Falta de Proximidad"
8. "NO: Customizar demasiado"
9. "NO: Friccion: Lograr que el usuario encuentre algo que necesita y lo vea en un plug and play"
10. "NO: Que aplaste que lo complejo y logre su uso"
11. "NO: WEB PRINTING"
12. "NO: Que el usuario necesite NO formularios, un 'Super Hero?'"
13. "NO: Que lleguemos con una solucion cuando el problema ya esta resuelto"
14. "Cluster: Estrategia de Producto y Claridad de Valor"
15. "Los clientes estan mal pensados: las experiencias solo algunas son compartidas"
16. "Poco claridad de que es suyo y que no. Que pueden pedir"
17. "Persona piensa beneficio que iluminar, no que me den herramientas"
18. "Seccion 2: Relato Estrategico por Cluster"
19. "La plataforma deberia evitar la sobrecarga de informacion, demasiados datos no equivale a buenas decisiones"
20. "Complejidad, Friccion: No se necesitan mas pantallas ni mas problemas; la solucion deberia simplificar"
21. "No se deberia necesitar un manual, capacitaciones excesivas, certificaciones - la plataforma debe ser intuitiva"
22. "Seccion 3: Atributos Diferenciadores con Foco en CX/UX/UI"
23. "Personalizacion Adaptativa: la interfaz se ajuste automaticamente en base a rol"
24. "Ejecucion Operativa 'Cero Fricciones': por Proyectos - la consistencia y alertas directas, clasificadas"
25. "Comunicacion Transparente de Valor: Y que comunique de manera natural de forma clara el valor"
26. "Enfoque en 'Minimum Viable Productivity' (MVP): Prioriza las funcionalidades minimas necesarias que generan el mayor impacto"
27. "Capacitacion In-App Contextual: Ofrece tutoriales y guias que sean contextuales"
28. "Soporte Integrado y Directo: Facilita el acceso a ayuda"

## [Workshop 1/IMG_9679.HEIC]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Foto de pizarra blanca con post-its organizados en tres filas horizontales separadas por lineas"
2. "Encabezado superior de fila: 'Lo que no necesita el usuario (no agrega valor)'"
3. "Categorias visibles en la seccion inferior: DEPURACION, ADHERENCIA/ENTENDIMIENTO, VISUALIZACION"
4. "Post-it rosa (DEPURACION): 'La visualizacion 3D de la mina'"
5. "Post-it rosa: 'Graficas o reportes que nos piden por la pala solucion mas compleja'"
6. "Post-it naranja: 'Dejar de hacer desarrollos y capacidades, monto genialida'"
7. "Post-it verde (VISUALIZACION): 'Desbordar de informacion que no utiliza'"
8. "Post-it rosa: Se menciona concepto de 'significar?' en relacion a hacer/desprioritizar"
9. "Post-it amarillo: Texto parcialmente visible sobre 'mas dashboards'"
10. "Post-it naranja: 'Tiempo debida de la experiencia que explicaria y por esfuerzo para alinear'"
11. "Post-it verde turquesa: Texto sobre 'Problemas' y elementos actuales"
12. "Post-it rosa: 'Mostrar los mismos KPIs que todos los dashboards' - se identifica como innecesario"
13. "Post-it turquesa: 'Capacitaciones' mencionado como algo que actualmente hay lazos/demoras"
14. "Post-it rosa: 'Gastar/perder tiempo'"
15. "Post-it naranja: 'Una experiencia que lo dude/si no'"

## [Workshop 1/IMG_9680.HEIC]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Foto de pizarra blanca con post-its - vista mas amplia que incluye la seccion superior e inferior"
2. "Encabezado de la fila superior: 'Lo que el usuario no sabe que necesita'"
3. "Seccion inferior visible: 'Lo que no necesita el usuario (no agrega valor)'"
4. "Post-it rosa (fila superior): 'Un/una ASISTENTE no visualizacion, mas alertas'"
5. "Post-it verde: 'algo que me avise la manga/planificacion mayor impacto'"
6. "Post-it naranja: 'Algo que genere algo muy rapido para el control'"
7. "Post-it rosa: 'Sabermos posibles errores (sin time anda)'"
8. "Post-it amarillo: texto sobre 'entender elementos historicos'"
9. "Post-it verde: 'Que elementos actuales hay del plan'"
10. "Post-it rosa: 'Gastar reduccion de rutas mejor hay predictivo'"
11. "Post-it turquesa: 'Problemas de cumplimiento'"
12. "Post-it naranja: 'Calidad mayor'/'Calidad mejor'"
13. "Post-it rosa: 'Llegar a donde datos problemas' - navegar a los datos para entender problemas"
14. "Post-it rosa: 'Reducir' seguido de 'consultas/pasos'"
15. "Post-it rosa: 'Enfoque de mining explotacion entendimiento Tiempo'"
16. "Post-it amarillo: 'Dumping' - visible como concepto"

## [Workshop 1/IMG_9681.HEIC]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Foto de pizarra blanca con post-its - vista de la seccion central y superior"
2. "Encabezado visible: 'Lo que el usuario no sabe que necesita'"
3. "Post-it rosa: 'Des planificacion de alumnos/usuarios'"
4. "Post-it amarillo: 'Descontextualizacion de su mundo'"
5. "Post-it verde: 'Contar una historia larga/reducida y que genere en contexto/interrelacion'"
6. "Post-it rosa: 'Algo real/especifico y cuantificable que tenga mayor impacto?'"
7. "Post-it naranja: 'Que te lo pida el servicio todo hay relevancia'"
8. "Post-it turquesa: 'Cuales son las prioridades'"
9. "Post-it rosa: 'Reducir el' seguido de texto parcial"
10. "Post-it naranja: Texto sobre 'Problemas y sin entender y' con referencia a 'salir bien'"
11. "Post-it amarillo: 'Mas paneles/mas datos'"
12. "Post-it rosa: 'Llegar a donde chequear problemas'"
13. "Post-it verde: menciona 'Transferencia de' algun concepto"
14. "Post-it rosa: 'Trazabilidad de algo'"

## [Workshop 1/IMG_9682.HEIC]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Foto de pizarra blanca - detalle de la seccion inferior izquierda"
2. "Categorias visibles: DEPURACION, ADHERENCIA/ENTENDIMIENTO"
3. "Post-it rosa grande: 'Mostrar los mismos KPIs que todos los dashboards'"
4. "Post-it turquesa: 'Capacitaciones'"
5. "Post-it rosa: 'HP - esos planes que motivan mas del 16% que no hace nada'"
6. "Post-it verde: 'La visualizacion 3D de la mina'"
7. "Post-it naranja: 'Graficas o reportes que nos piden por pala solicitar mas compleja'"
8. "Post-it amarillo: Texto parcial visible sobre 'experiencia y...'"
9. "Post-it rosa: 'Gastar / perder tiempo'"
10. "Post-it naranja: 'Una experiencia que lo dude'"
11. "Post-it rosa: Referencia a 'hacer, desprioritizar o' con relacion a significar"
12. "Post-it amarillo: Texto sobre 'las mejores es el asunto/es independiente'"
13. "Post-it verde: 'Reportar informacion = barra/llego a la confusion para poder solucionar problemas'"

## [Workshop 1/IMG_9683.HEIC]
- Type: image_workshop_photo
- Date: 2026-01-29
- Extracted: 2026-02-16T15:10

### Raw Claims
1. "Foto de pizarra blanca - detalle de la seccion inferior derecha"
2. "Categoria visible: VISUALIZACION"
3. "Post-it rosa: 'Una experiencia, que lo dude el tiempo'"
4. "Post-it naranja: 'Tiempo debida de la experiencia y que explicara y por esfuerzo para alinear'"
5. "Post-it verde: 'Dialogar sobre Problemas y sin entender y sin datos salir bien'"
6. "Post-it naranja: 'Desbordar de informacion que no utiliza' - marcado como algo que NO agrega valor"
7. "Post-it rosa: 'Mas paneles/mas datos'"
8. "Post-it amarillo: 'No ser intuitivos / el simple/la solucion que es intencion?'"
9. "Post-it naranja: 'Reportarse tal y en la forma de presentar la data'"
10. "Post-it rosa: 'Para esta sala es y esta es la herramienta y que la para nada?'"
11. "Post-it verde: 'Mucho para solo para datos'"
12. "Post-it amarillo: 'Las mejores, las mejores que para nada'"
13. "Post-it rosa: 'Ver datos de tecnologia, los resultados, ver, aun que tecnologia para nada'"
14. "Post-it turquesa: 'Reponerse tal hay consigo'"
15. "Post-it naranja: Texto sobre 'Dumping' como concepto visible"
16. "Post-it rosa: 'Porque los del otro lado se lo han visto / para que'"

## [Workshop 1/Casos de Uso Workshop 01.docx]
- Type: workshop_use_cases
- Date: 2026-01-29
- Participants: Equipo TIMining (Workshop 01)
- Extracted: 2026-02-16T16:00

### Raw Claims
1. "Lámina 1 — Gerente Minas (Cierre Mensual): se cumple mineral y lastre pero la Adherencia/recuperación de la planta es mala (100%)"
2. "Lámina 1 — Detección: La planta genera reporte que la recuperación está cayendo"
3. "Lámina 1 — Análisis: Las mezclas de mineral no son las correctas"
4. "Lámina 1 — Recomendación: La matriz de carguío transporte falló, el mineral de los frentes no son reales; se recomienda ajustes dinámicos de flotas/activos"
5. "Lámina 1 — Atributo: Categorización de mineral en frentes de carguío y tracking del mineral anticipándose a lo que va al chancado"
6. "Lámina 2 — Planificador Corto Plazo: No hay vehículos disponibles, material a extraer no era lo previsto, situación de mantenimiento no programado"
7. "Lámina 2 — Detección: Por sistema o por visualización in-situ"
8. "Lámina 2 — Análisis: Entender la situación, tener datos y ciertas hipótesis para seguir avanzando minimizando costo corto o mediano plazo"
9. "Lámina 2 — Recomendación: Con simulaciones proponer alternativas para suplir, mitigar o solucionar el problema"
10. "Lámina 3 — Jefe/Ingeniero Chancado: Bloqueo de camiones x 45 min en el chancador"
11. "Lámina 3 — Detección: Plataforma AVISA anticipadamente de este fenómeno (x sistema de alertas de PI System)"
12. "Lámina 3 — Análisis: Muestra los camiones que van al chancado y si existe posibilidad de reaccionar o stockear"
13. "Lámina 3 — Recomendación: Redistribuir, detención de chancador, o continuidad operativa (saturar)"
14. "Lámina 4 — Gerencia CIO / Operaciones: Reunión diaria entre CIO y Operaciones 8 AM"
15. "Lámina 4 — Detección: Brechas respecto al plan minero e incidentes relevantes del turno"
16. "Lámina 4 — Análisis: Generar causa-raíz análisis y priorización objetiva de los incidentes (centrarse en lo importante)"
17. "Lámina 4 — Recomendación: Plan de acción para mitigar impactos negativos y aprendizaje"
18. "Lámina 4 — Atributo: Integración de información, simplificación y reducción de los tiempos de análisis, herramienta de Mejora Continua"
19. "Lámina 5 — Senior/Jefe PyT: Patios NO están listos para perforar y hay poco material tronado disponible"
20. "Lámina 5 — Detección: Equipos de servicio en mantenimiento no programado y plan de perforación donde la actividad es crítica"
21. "Lámina 5 — Análisis: ¿Existen equipos disponibles reasignables? ¿Cómo afecta aguas abajo? ¿Hay material tronado disponible? ¿Existe holgura?"
22. "Lámina 5 — Recomendación: Disponibilizar planes de acción, ajustar planes aguas abajo, alertar a quienes se ven afectados, comunicar alternativas"
23. "Lámina 5 — Atributo: Plan (Ruta crítica), Estado de los equipos (Datos), Secuencia de actividades, Material tronado"
24. "Lámina 6 — Gestión de Alerta de Seguridad: Riesgo Geotécnico, sacan la pala, ¿esperar? ¿ajustar el plan?"
25. "Lámina 6 — Usuarios: Supervisor de monitoreo, Jefe de turno, Planificador corto plazo"
26. "Lámina 6 — Análisis: Análisis de escenarios de diferentes tiempos de indisponibilidad de las zonas afectadas"
27. "Lámina 6 — Recomendación: Definir zonas de restricción, redefinir el plan para el despacho, ajustar el plan de corto plazo"
28. "Lámina 7 — Ajuste Táctico (Imprevisto): Falló un equipo principal o se activó una zona geotécnica"
29. "Lámina 7 — Usuarios: Gerente de Mina y su equipo de supervisores"
30. "Lámina 7 — Detección: Envía Alerta al supervisor; supervisor chequea situación; si tiene dudas pregunta a TIMining; pide evaluación del impacto a fin del turno o la semana"
31. "Lámina 7 — Análisis: Se procesa impacto en conjunto, se buscan alternativas, se evalúan alternativas y mitigación, se identifican riesgos de la nueva acción"
32. "Lámina 7 — Recomendación: Set de alternativas con impacto medido en el plan; opcionalmente ajustar plan semanal o mensual; monitorear variables críticas"
33. "Lámina 8 — Despachador (Respuesta Rápida): Problema operacional en IROC o Sala de Control que requiere respuesta rápida"
34. "Lámina 8 — Detección: Detecta problemática y levanta alerta, ej. Caída de Pala no planificada"
35. "Lámina 8 — Recomendación: Reasignación de equipos en base al análisis; comunicación mediante teams, correo, dentro Plataforma u otro"
36. "Lámina 9 — Jefe/Ingeniero Operaciones (Velocidades): Incumplimiento en Plan Velocidades, reunión diaria de revisión"
37. "Lámina 9 — Detección: Levantar Alerta en zonas de Baja Velocidad o fuera de plan de manera automática"
38. "Lámina 9 — Análisis: Analizar impacto en tiempo tonelaje o camiones; cuánto pierden y qué provoca la baja velocidad"
39. "Lámina 9 — Recomendación: Entregar causas de la baja, qué sectores son y qué debe hacer para solucionarlo"
40. "Lámina 10 — Jefe de Turno (Procedimientos/Seguridad): ¿Estoy cumpliendo procedimientos de trabajo?"
41. "Lámina 10 — Detección: A través de radio consulta directa al agente y fotos"
42. "Lámina 10 — Análisis: Procedimientos de trabajo, Experto de prevención de Riesgos, Sernageomin Legal"
43. "Lámina 10 — Recomendación: Verificar cuál es el estándar, ¿estoy cumpliendo?, ¿cómo estandarizo/regularizo condición?"
44. "Lámina 10 — Atributo: Responsabilidad Legal"
45. "Lámina 11 — Despachador (Saturación Radio): Saturación de la radio genera pérdida de información en sala de control"
46. "Lámina 11 — Detección: Escucha de radio y Reconocimiento de Voces"
47. "Lámina 11 — Recomendación: Lista de solicitudes y priorización de actividades"
48. "Lámina 12 — Jefe de Turno (Tronadura): Tronadura, Loros, Correcto despeje en mina-terreno"
49. "Lámina 12 — Detección: Por Horario y vía radio"
50. "Lámina 12 — Análisis: GPS equipos y malla a tronar"
51. "Lámina 12 — Recomendación: Asegurar que despeje y posicionamiento de loros es el correcto"
52. "Lámina 13 — Despachador (Falla Mecánica): Falla mecánica requiere traspaso de información y estimación rápida de tiempos/turnos"
53. "Lámina 13 — Detección: A través de radio y estado en FMS"
54. "Lámina 13 — Análisis: Comparar situaciones similares en el pasado"
55. "Lámina 13 — Recomendación: Entrega falla mecánica con claridad para coordinación con mantención; recomienda cómo enfrentar la avería"
56. "Lámina 14 — Supervisor de Turno (Variabilidad/Pala): La pala cae en mantención sin claridad de tiempo de indisponibilidad, turno de noche en frente de carguío"
57. "Lámina 14 — Detección: La alerta le llega a su celular escrita y por voz"
58. "Lámina 14 — Análisis: Opciones — detener parte de la flota, cambiar puntos de vaciado, enviar cargador al punto de carguío"
59. "Lámina 14 — Recomendación: El sistema sugiere las 3 mejores opciones para mitigar pérdidas operacionales"
60. "Lámina 14 — Atributo: Capta la atención del supervisor en forma oportuna; da contexto operacional (geo, seguridad, escenario si no se actúa); lista de opciones con métrica de impacto rankeada"
61. "Lámina 15 — Jefe de Turno (Caída de Pala): Caída de pala en alimentación Wip/Mina, requiere movimiento de frente de otra pala"
62. "Lámina 15 — Análisis: Re-asignación de recursos de la pala que se cae; riesgos asociados a mover la pala y recursos que debe movilizar (Seguridad, cables, aéreos, camiones)"
63. "Lámina 15 — Recomendación: Dónde reasignar, dónde tener cuidado (seguridad), riesgos operacionales, actividades clave habilitadoras"
64. "Lámina 16 — Planificador Corto Plazo (Mantenciones): Incumplimiento de Mantenciones en terreno"
65. "Lámina 16 — Detección: Retrasos o adelantos en mantenciones planificadas"
66. "Lámina 16 — Análisis: Estimación de impacto y actividades comprometidas (retraso servicios, perforación, carguío); estimar cumplimiento del plan"
67. "Lámina 16 — Recomendación: Asignación de recursos para cuidar u optimizar KPI crítico del momento"
68. "Lámina 17 — Machine 2 Machine: Diagrama conceptual de integración de sistemas (MACHINE 2 MACHINE — Sistema de Integración)"
69. "Lámina 18 — Supervisor Centro Integrado (Asistente IA): No está preparada para reunión de coordinación por saturación de reuniones y correos"
70. "Lámina 18 — Detección: Mensaje a WhatsApp 15 min antes de reunión con resumen contra plan por cada fase"
71. "Lámina 18 — Detección: Informa problemas específicos — tronadura bajo plan 20%, 5 camiones estacionados sin carga, 2 situaciones de riesgo de colegas en zona peligrosa"
72. "Lámina 18 — Análisis: '¿Quieres que te genere algunas recomendaciones para tu reunión?'; corre simulaciones y analiza operadores donde hay que tener foco"
73. "Lámina 18 — Análisis: Genera texto en WhatsApp o interfaz LLM/IA; agrega imagen 2D de malla de tronadura con call outs de temas focales"
74. "Lámina 18 — Recomendación: Post-reunión llegan mensajes proactivos diciendo si indicaciones van ok o no"
75. "Lámina 19 — Gerente Mina (Equipos Autónomos): Equipos autónomos se pararon mucho durante fin de semana"
76. "Lámina 19 — Detección: No cumplimiento plan y baja importante en velocidad promedio"
77. "Lámina 19 — Análisis: Entender período, análisis de posición y velocidad de camiones, detección de anomalías, buscar los por qué"
78. "Lámina 19 — Recomendación: Reposicionamiento de antenas, mantenimiento de camiones, revisión de caminos o accesos, asignación diferenciada"
79. "Lámina 20 — Concepto 'Skynet': Asumiendo acceso a todos los datos; cada X minutos analizar situación general de la mina"
80. "Lámina 20 — Flujo: Realizar N simulaciones buscando mejoras al óptimo global; enviar sugerencias al despacho, planificación y otros roles/áreas"
81. "Lámina 20 — Flujo: Generar replanificación (pasar de sugerencias/recomendación a 'haz esto'); primero a personas, luego a máquinas"
82. "Patrón transversal: Las 20 láminas siguen estructura Detección → Análisis → Recomendación, confirmando modelo operativo de la plataforma"
83. "Roles identificados en los casos de uso: Gerente Minas, Planificador Corto Plazo, Jefe/Ingeniero Chancado, Gerencia CIO, Senior/Jefe PyT, Supervisor de monitoreo, Jefe de turno, Despachador, Jefe/Ingeniero Operaciones, Supervisor de Turno, Planificador Corto Plazo, Supervisor Centro Integrado, Gerente Mina"

## [Workshop 1/KEEP-STOP-START (retro).docx]
- Type: workshop_retrospective
- Date: 2026-01-29
- Participants: Equipo TIMining (Workshop 01)
- Extracted: 2026-02-16T16:00

### Raw Claims
1. "STOP — La Visualización 3D de La Mina no agrega valor"
2. "STOP — Dejar de hacer desarrollos específicos y desarrollarlos de manera genérica"
3. "STOP — Gráficos o reportes que nos piden porque a ellos le piden SIN SOLUCIONAR ALGO"
4. "STOP — MOSTRAR LOS MISMOS KPIS QUE TODOS LOS DASHBOARDS"
5. "STOP — Repetir Información genera confusión"
6. "STOP — Gastar/perder tiempo"
7. "STOP — Capacitaciones muy largas"
8. "STOP — No quiere más problemas (TI, contrato, adherencia); quiere que la solución sea plug and play"
9. "STOP — Una experiencia que le quite tiempo"
10. "STOP — Buscar la solución; que la solución venga a él"
11. "STOP — Que piense que es complejo y baje su uso"
12. "STOP — Recordar cómo llegar a la información que necesito: ¿reporte? ¿web?"
13. "STOP — MÁS PANTALLAS"
14. "STOP — MUCHA DATA SIN SENTIDO"
15. "STOP — Integrar datos sin entender el Problema y evitar saturar con datos al Usuario"
16. "STOP — Que nuestra Solución NO sea un problema"
17. "STOP — Llenarlos de números"
18. "STOP — Ver todos los elementos que ahora se muestran (No todos los usuarios necesitan lo mismo)"
19. "STOP — DESBORDAR DE INFORMACIÓN QUE NO utiliza"
20. "STOP — TIEMPO DEDICADO A REPORTING Y DAR EXPLICACIONES 'PARA ARRIBA'"
21. "STOP — DEPENDIENDO DEL PERFIL: Algo muy complejo"
22. "STOP — Data Dumping"
23. "STOP — Cuando tiene un problema llenar un formulario ¿A Quién llamo?"
24. "STOP — Que tengo que hacer más trabajo"
25. "STOP — Poca claridad de qué se paga y qué no. Qué puede pedir."
26. "STOP — Que lleguemos con una solución cuando el problema pasó de moda"
27. "STOP — Que no veo valor personal"
28. "STOP — Primera etapa necesitamos que funcione, no que se vea hermoso"
29. "KEEP — Ejemplos de otros clientes '¿CÓMO LO USO?' CATÁLOGO"
30. "KEEP — La visualización de la mina esté completa"
31. "KEEP — Agregar un dato para entenderlo con el contexto, simple y rápido"
32. "KEEP — Los resultados de él sean visibles"
33. "KEEP — APOYAR DATOS CON VISUALIZACIONES"
34. "KEEP — HERRAMIENTAS FÁCILES DE USAR Y ROBUSTAS PARA TOMAR MEJORES DECISIONES EN EL DÍA A DÍA"
35. "KEEP — HABILITAR CAPAS SIMPLES QUE APORTAN MUCHO"
36. "KEEP — Un sistema Recomendador y que tome ACCIÓN en temas recurrentes"
37. "KEEP — Tener herramientas más específicas para velocidad/conciliación $ para ayudarlos a tomar decisiones"
38. "KEEP — Sentir que tiene el control operacional"
39. "KEEP — CAPACITACIÓN RESPECTO AL PERFIL DE USUARIO (OJALÁ IN-APP)"
40. "KEEP — Que le facilitemos la vida. Menos Stress."
41. "KEEP — Que pueda tomar decisiones más rápido y mejores"
42. "KEEP — Mejorar su trabajo. Mejor desempeño personal."
43. "KEEP — Ver los elementos que le ayudan a cumplir sus KPIs de sus bonos"
44. "KEEP — ALGUNOS DATOS MUY ÚTILES Y MUY BÁSICOS"
45. "KEEP — Priorizar la seguridad: ¿Fuentes de riesgo? ¿Seguimiento de activos? ¿Existencia de regulaciones?"
46. "KEEP — Orden de prioridad ante contingencias (Radiales, WhatsApp, etc.)"
47. "KEEP — Estrategias operacionales. Cuál es la más eficiente."
48. "KEEP — Claridad del proceso completo (proceso mina): Servicio — PyT — CyT — Chancado"
49. "KEEP — Cumplir su planificación"
50. "KEEP — Ver su plan ojalá completo"
51. "KEEP — Un sistema más Proactivo"
52. "KEEP — Que los vayamos A VER MÁS SEGUIDO (soporte más frecuente)"
53. "KEEP — RECOMENDACIONES"
54. "KEEP — Customización. Necesita recomendaciones no solo alertas."
55. "KEEP — Respuestas Automáticas a sus problemas y sugerencias"
56. "KEEP — Una experiencia más acorde a la rutina diaria"
57. "KEEP — Mejorar el sistema de alertas, sobre todo cómo llegar directo al usuario"
58. "KEEP — Plataforma fácil de entregar y liberar a los usuarios"
59. "KEEP — ENTENDER EL IMPACTO DE LOS PROBLEMAS PARA PRIORIZAR"
60. "KEEP — Soporte más activo"
61. "KEEP — Certeza de que cuidamos sus datos y nos preocupamos por ellos (Ciberseguridad)"
62. "KEEP — 'Escuchar' lo que está pasando en la mina"
63. "KEEP — Encontrar rápido los puntos que requieren intervención"
64. "KEEP — ATENDER PROBLEMAS A TIEMPO"
65. "START — Un asistente virtual 'Para ayudarlo con el DÍA A DÍA'"
66. "START — Que podemos disminuir las reuniones coordinaciones"
67. "START — Disminuir las distracciones/sobrecarga cognitiva"
68. "START — ABANICO DE ESCENARIOS POSIBLES ANTE EVENTUALIDADES"
69. "START — Un Desplanificadómetro en línea: Medir cuánto llevo desviado desde un t0, material perdido que dejé de extraer"
70. "START — Reducir el Ruido de información (Foco en lo esencial)"
71. "START — Estar en los canales de comunicación primarios de la MINA"
72. "START — Monitoreo remoto Subcontratado"
73. "START — SIMPLICIDAD (los mejores ingenieros simplifican)"
74. "START — Copiloto que esté atento a soportar sus decisiones"
75. "START — Hablar del outcome en lugar de output"
76. "START — No pueden tomar decisiones con información no actualizada"
77. "START — La solución es muy barata respecto al valor que genera"
78. "START — RECONOCER SU IMPACTO"
79. "START — Que pueden enfocarse en lo importante y no en lo urgente"
80. "START — Optimización de procesos aunque ya estén cumpliendo planes por diseño → Mejora continua → Excelencia operacional"
81. "START — Mejorar la comunicación entre colaboradores áreas. ¿Un intermediario?"
82. "START — HERRAMIENTAS QUE LES AYUDEN A ENTENDER 'QUÉ PASÓ' Y POR QUÉ... y luego 'QUÉ HACER'"
83. "START — Consciencia del Valor que estoy agregando con respecto a mis decisiones"
84. "START — Algunos datos que no sabe que podría tener"
85. "START — INFORMACIÓN de otros Procesos (silos de información)"
86. "START — No sabe los datos que tiene, ni su calidad de su información"
87. "START — COORDINARSE ENTRE ÁREAS Y SER RÁPIDO EN COMUNICAR EVENTUALIDADES"
88. "START — Cuánto del problema ya lo sabíamos desde el plan minero"
89. "START — Involucrar el Plan minero y sus paralelos para entender 'cómo vamos'"
90. "START — AUDITAR SUS 'FUENTES DE LA VERDAD' Y CORREGIRLAS"
91. "START — Pre-factibilidad → Arquitectura fácil de Justificar al Cliente"
92. "START — Menos dependencia del Cliente. Dependemos mucho del formato del Dato del Cliente o que lo envíe."

## [Antecedentes/31_12_2025_TIMining The Evolution of the Digital Mine v1_Interno.docx]
- Type: strategic_narrative
- Date: 2025-12-31
- Participants: Phillip Whatmore (CEO)
- Extracted: 2026-02-16T16:10

### Raw Claims
1. "TIMining fundada por Carlo Calderon después de años de desarrollo de software independiente; misión inicial: digitalizar la seguridad geotécnica"
2. "Fase 1 (2011–2015): En colaboración con E-Mining se desarrollaron Aris, Tangram y SICT, que siguen siendo estándares de la industria para segmentos geotécnicos en Latinoamérica"
3. "Fase 2 (2015–2017): Reconociendo que los FMS no cumplían expectativas operacionales, TIMining cambió foco al proceso de Load & Haul"
4. "Orchestra nació como motor de simulación de eventos discretos que captura interferencia operacional — colas, congestión, re-ruteo — bajo variabilidad real"
5. "Orchestra permite a mineros testear alternativas operacionales contra confiabilidad del plan, cuantificando valor antes de mover un solo camión"
6. "Fase 3 (2017–2019): Antes de que 'IA' y 'Digital Twin' fueran buzzwords, TIMining envisó una mina que pudiera hablar con sus operadores"
7. "Prototipo visionario 2017: ingeniero usando HoloLens para interactuar con digital twin controlado por máquina, haciendo preguntas en lenguaje natural sobre cumplimiento del plan"
8. "Serie A de USD 4M liderada por Aurus Capital (VC enfocado en minería) para financiar el salto de viabilidad técnica a producto comercial global"
9. "Anglo American Los Bronces se convirtió en socio principal de co-desarrollo para refinar la visión en solución lista para terreno"
10. "Fase 4 (2019–2023): La visión 2017 chocó con muro técnico — no se puede gestionar un plan si no se conoce la topografía actual, que cambia cada minuto"
11. "Breakthrough propietario: Carlo Calderon desarrolló algoritmo único para inferir topografías en tiempo real usando datos GPS de palas"
12. "Aware nació como 'soft sensor' que conecta el mundo sensorial de la operación con el mundo geométrico de la planificación"
13. "Aware logró product-market fit inmediato, expandiéndose a Glencore (Colombia), Petrosea (Indonesia) y Lundin Mining (Canadá)"
14. "La creencia era que Aware tenía product-market-fit claro, listo para venta internacional con modelo SaaS y proceso de implementación tipo 'receta'"
15. "La empresa invirtió fuertemente en expansión internacional con foco en vender primera versión de Aware"
16. "Fase 5 (2023–2025): Escalar reveló que cada mina es un 'copo de nieve' único; en 2024 TIMining hizo giro arquitectónico radical para evitar la 'trampa del bespoke'"
17. "Si todas las solicitudes de clientes se hubieran codificado, resultaría en proyecto monumental de ingeniería de software, poniendo en jaque el modelo SaaS escalable"
18. "La mayor parte del desarrollo de 2024 fue invertida en 'modularizar' los algoritmos de Aware en APIs y motores de cálculo"
19. "Tiempos de implementación reducidos de meses a semanas, permitiendo al equipo operacional configurar soluciones sin ingeniería de software pesada"
20. "Aware pasó de software monolítico de algoritmo único a arquitectura modular, permitiendo tailoring y configuración en semanas"
21. "Valor en acoplar analíticas/simulación de Orchestra con monitoreo en tiempo real de Aware; vendidos como bundles a Pelambres, Codelco Rodimiro Tomic, Ministro Hales y Asarco/Grupo México Ray Mine"
22. "Fase 6 (2025–2026): Solución de alertas implementada permitiendo a operadores tomar medidas en tiempo real ante desviaciones del plan, incluyendo situaciones de riesgo geotécnico"
23. "Nuevos conectores permiten ver online rendimiento de perforación y tronadura vs plan, servicios vs plan, velocidad de extracción por zona en cada fase"
24. "Solución de material tracking control ('origin and destination tracking')"
25. "Aware alcanzó más de 110 usuarios mensuales solo en Codelco RT (gracias a propuesta de licencia ilimitada por sitio)"
26. "Más de USD 10M en ahorros y eficiencias capturados en 3 minas en Chile"
27. "TIM Agent: En partnership con Google Gemini, módulo IA capaz de leer datos en tiempo real y responder queries en lenguaje natural sin alucinaciones"
28. "Agosto 2025: célula de desarrollo independiente interna para testear uso de IA sobre plataforma Aware mejorada"
29. "Inteligencia democratizada: del desktop al dispositivo móvil; cada supervisor recibe alertas anticipadas (ej. predecir inactividad del chancador 15 min antes)"
30. "Cada usuario puede crear dashboards personales, alertas operacionales y análisis cruzado de variables sin abrir computador, directo desde dispositivo móvil"
31. "Fuente de datos democrática con inteligencia minera: permite a todos los ingenieros, supervisores, gerentes y liderazgo acceder a datos que antes solo eran accesibles a usuarios registrados de FMS o Drilling Software"
32. "De vender un 'nice 3D viewer of the mine' a plataforma robusta end-to-end para mejor planificación de corto plazo y eficiencia operacional"
33. "2025 no fue buen año en crecimiento ARR, pero las nuevas conversaciones permitieron cerrar el año con pipeline fuerte; presupuesto 2026 tiene meta de crecimiento ARR >80% YoY"
34. "Fase 7 (2026): Simulaciones Predictivas — IA corriendo simulaciones automáticas usando motor Orchestra; de 'hay un problema' a 'aquí hay tres escenarios para solucionarlo' en minutos"
35. "2026: Expansión a minería subterránea aprovechando arquitectura modular"
36. "2026: Relanzamiento de propuesta de valor con nueva marca y estrategia go-to-market global más agresiva para separar plataforma de alto nivel del producto Aware"
37. "2026: 'Second opinions' para fleet dispatching, material tracking más preciso, optimización para plan minero completo"
38. "Visión 2040: IROC maduro — corporaciones gestionan múltiples minas globales simultáneamente desde centros urbanos; distinción mina-planta desaparece"
39. "Visión 2040: Interacción con datos mineros ocurre exclusivamente a través de lenguaje natural"
40. "Visión 2040: Transiciones de turno soportadas por logs multimedia creados automáticamente, eliminando 'efecto gaviota' (caídas de producción en handovers)"
41. "Visión 2040: Vehículos 100% autónomos; TIMining provee el 'cerebro inteligente' que supervisa la geometría asegurando operación óptima y alineada al plan"
42. "Principio core desde 2011: 'La geometría de la mina es la geometría del negocio'"
43. "Strategic Narrative — Transición exitosa de herramientas de simulación sofisticadas a Mining Operating Platform moderna y escalable"
44. "Unique Value Prop: TIMining es la única empresa que ha resuelto el desafío de Real-Time Topography Inference usando algoritmos propietarios sobre datos GPS de equipos existentes"
45. "Valor primario: reducir variabilidad, mejorar adherencia al plan, habilitar corrección intra-turno"
46. "Valor de ecosistema: 'Capa Unificadora' entre geología, planificación y operaciones — una sola fuente de verdad que muestra no solo qué desviaciones ocurrieron sino el porqué estructurado"
47. "TIMining como integrador neutral en industria caracterizada por vendor lock-in y 'super-suites'; capa intermedia agnóstica que permite flexibilidad"
48. "'Efecto Suiza': OEMs y vendors de software integran rutinariamente con TIMining incluso cuando no integran entre sí"
49. "Modelo de adopción bottom-up: Aware se expande orgánicamente de pilotos a 100+ usuarios activos mensuales por sitio"
50. "Patrones de uso diario muestran alta 'stickiness' — herramientas se embeben en rutinas estándar de cambio de turno"
51. "Adopción tipo Leapfrog: de 'corporate push' a 'operational pull'"
52. "Base de ingresos recurrentes acercándose a USD 5M con márgenes altos y economía de software capital-eficiente"
53. "TIM Agent en partnership con Google Gemini: usuarios interactúan con Digital Twin vía lenguaje natural para recibir alertas predictivas y recomendaciones basadas en escenarios"
54. "Pre-Autonomy Infrastructure: Flotas autónomas requieren modelo de entorno en tiempo real tipo 'LIDAR-like'; TIMining provee ese modelo de mundo en tiempo real"

## [Antecedentes/Narrativa CCB para Mngt Team_ESP.docx]
- Type: strategic_narrative
- Date: 2025 (sin fecha exacta)
- Participants: Carlo Calderón (CTO & CPO)
- Extracted: 2026-02-16T16:15

### Raw Claims
1. "Tesis fundamental: 'La Geometría es el Negocio' — el plan de negocio minero no es una hoja de cálculo financiera; es un volumen geométrico que debe moverse en un tiempo específico"
2. "Paradoja de la industria: la Planificación vive en un mundo estático y perfecto (diseño), mientras la Operación vive en un caos dinámico y ruidoso (sensores, FMS)"
3. "Desde los 90, la industria intentó cerrar la brecha añadiendo más sensores, pero fallaron en lo esencial: no se puede optimizar lo que no se puede ver geométricamente"
4. "TIMining no construyó otro software de gestión; construyó la capacidad de digitalizar la realidad física de la mina en tiempo real"
5. "Ventaja: algoritmos propietarios utilizan el 'ruido' de datos existentes (GPS de palas, camiones, perforadoras) para inferir estado de la mina — 'Soft Sensor'"
6. "Reconstruyen superficie topográfica, avances de perforación, inventarios tronados, geometrías de botaderos cada 15 minutos"
7. "'No simulamos el plan: Vemos la ejecución real. No estimamos: Medimos la adherencia espacial con precisión de metros.'"
8. "Única Fuente de la Verdad para responder la pregunta más cara de la minería: '¿Estamos cumpliendo el plan ahora mismo?'"
9. "IP de inferencia topográfica es barrera de entrada y núcleo del valor tecnológico"
10. "Herencia tecnológica: Aris, Tangram y SICT desarrollaron el 'músculo' para procesar millones de datos ruidosos e inferir geometrías complejas"
11. "Orchestra: siguiente paso crítico — modelar el proceso minero real, simular matemáticamente interacciones, colas y variabilidad del carguío y transporte"
12. "Tres capacidades que rara vez conviven: exactitud de geometría computacional + entendimiento profundo del proceso minero + dinamismo de operación en tiempo real"
13. "Paradoja de la Planificación: el negocio se rige por el Plan (entidad geométrica/volumétrica) pero la operación se gestiona con sensores que entregan tiempos y posiciones, no formas"
14. "Industria intentaba inferir cumplimiento del plan superponiendo datos dinámicos (GPS) sobre mapas estáticos que ya no existían — 'operábamos con muchos datos, pero a ciegas respecto al Plan'"
15. "En 2019 construyeron Aware para dar consciencia situacional a todos los usuarios de la mina"
16. "Contradicción post-lanzamiento de Aware: ¿personalizar para problemas actuales del cliente o mantener casos de uso previamente definidos?"
17. "En 2023, decisión arquitectónica radical: dejaron de crear herramientas aisladas y construyeron Plataforma Modular y Agnóstica"
18. "Integración Universal: se conectan a cualquier FMS (Modular, Hexagon, Wenco) y cualquier software de planificación"
19. "Gemelo Digital Dinámico: no es un visor 3D sino modelo en tiempo real que monitorea y correlaciona variables del dónde (geometría), quién (equipos) y cuándo, comparado con el para qué (planificación)"
20. "Metodología Delta2025: introdujeron concepto de 'Tiempo Actual' en adherencia geométrica, permitiendo corregir rumbo durante el turno, no después"
21. "Motor de detección de anomalías capaz de monitorear cualquier 'soft sensor' construido con lógica de equipos mineros, áreas, volúmenes, rendimientos"
22. "Habilitaron simulación automática: modelo de mina en tiempo real conectado con motor de simulación para proyecciones automáticas durante el turno"
23. "Con integración de LLMs (Google Gemini) sobre Gemelo Digital estructurado (Project TIM): usuarios conectan preguntas directamente con modelo en tiempo real"
24. "Ya no se necesitan expertos en SQL y software de planificación para entender qué está pasando — cualquier supervisor puede preguntar en lenguaje natural"
25. "Evolución: de Describir (Aware) a Predecir y Prescribir (Orchestra + IA)"
26. "Futuro: minería autónoma y remota (IROC o Aware distribuido); robots y centros remotos son ciegos sin modelo actualizado del entorno"
27. "10 Pilares estratégicos: (1) Pivote de herramientas a plataforma, (2) Cerrando la Brecha Geométrica, (3) Integración de Producto y Plataforma, (4) Efecto Suiza, (5) Efecto Leapfrog, (6) Pricing como oportunidad de valor latente, (7) Perfil Financiero SaaS, (8) El Equipo, (9) IP como ventaja injusta, (10) Captura de valor en minería autónoma"
28. "Pilar 6 Pricing: desconexión entre precio actual y valor estratégico; oportunidad de realinear de 'licencia de software' a 'valor empresarial'"
29. "Pilar 5 adopción bottom-up: más de 100 usuarios activos mensuales por faena; stickiness genera tracción interna que acelera acuerdos corporativos"
30. "Altas gerencias también interesadas en trayectoria de desvíos al plan: los desvíos al plan de negocio se generan día a día y difícilmente se pueden recuperar"
31. "Pilar 8 equipo: ADN multidisciplinario forjado resolviendo primero problemas difíciles por separado — rigor geotécnico + dinámica operacional + inferencia desde sensores"
32. "Para comprador estratégico, adquirir TIMining no es comprar software sino asegurar control de la capa de datos de ejecución"

## [Antecedentes/PPT TIMining - General_ENE 2026_Español.pdf]
- Type: presentación corporativa
- Date: 2025-12
- Participants: N/A (documento comercial)
- Extracted: 2026-02-16T17:30

### Raw Claims
1. "TIMining — Presentación de la compañía, sus soluciones y valor en la minería de rajo abierto. Diciembre 2025"
2. "TIMining es una empresa 100% dedicada a tecnología para la minería, con ~15 años de experiencia, presencia en más de 50 minas y 8 países"
3. "Equipo: 70 personas, 40 ingenieros de minas, 22 desarrolladores de software"
4. "Presencia geográfica: Chile 27 minas, Perú 5, Brasil 4, Colombia 1, México 4, USA/Canadá 4, Australia 5"
5. "330+ usuarios activos en Aware distribuidos en 7 minas y 5 países"
6. "Portafolio de productos: Aware (monitoreo en tiempo real), Orchestra (analítica/simulación), Delta (reconciliación topográfica), Drillit, ARIS, SICT, Tangram"
7. "Propuesta de valor: mejora de 5-10 pp en adherencia geométrica, mejora de 3-5 km/h en velocidad de flota, ahorro del 20% en topografía con drones, mejoras en seguridad"
8. "Arquitectura: Modelar en tiempo real → Visor 3D + Análisis + Simulación; módulos de Topografía, Alertas, Sensores Virtuales, Reportería, Agente IA LLM, acceso API"
9. "Paisaje competitivo: slide muestra proveedores de software por etapa de la cadena de valor minera — TIMining se posiciona en la etapa de ejecución operativa (carguío y transporte)"
10. "Caso 1 — Mina de cobre chilena 100-200 kton Cu/año: captura de valor USD 6MM enero-mayo 2025, +1.8 km/h velocidad de flota, +9% adherencia espacial en Fase F08, 40 usuarios mensuales"
11. "Caso 2 — Mina de cobre chilena 300-400 kton Cu/año: +19% adherencia en Fase 37, 100 usuarios/mes tras 7-8 meses de implementación"
12. "Caso 2: metodología para mejora continua de adherencia geométrica con ciclo de retroalimentación"
13. "Caso 3 — Mina de cobre chilena 300-400 kton Cu/año: >10 pp mejora en adherencia, USD 2.8MM/año en eficiencia, incremento del 5% en cumplimiento de mina, USD 3MM impacto en 2024"
14. "Anexo 1: Ejemplos concretos del aporte de TIMining Aware para el cumplimiento del plan minero"
15. "Anexo 2: Ejemplos de avances en proyecto TIM — Agente Minero en tiempo real con IA (LLM) utilizando interfaz de Google Gemini"
16. "Agente TIM — Velocidades: consulta en lenguaje natural, responde velocidades promedio de camiones según estado de carga (Cargados: 20.07 km/h, Vacíos: 26.17 km/h)"
17. "Agente TIM puede entregar datos horarios detallados de velocidad por estado de carga (tabla con Velocidad Cargado y Vacío por hora, 09:00-17:00)"
18. "Agente TIM puede generar gráficos a partir de datos consultados (Velocidad Promedio de Camiones por Hora con series Cargado/Vacío)"
19. "Agente TIM — Material remanente: agrupa material disponible por fase (F10N: 179,830.83t; F11W: 861,302.10t; F12N: 620,081.53t; F9SE: 362,668.67t; Total: 2,023,883.13t)"
20. "Material remanente incluye clasificación por Mineral, Estéril y Baja Ley por cada fase"
21. "Agente TIM puede generar gráfico de barras apiladas de material remanente por fase y tipo"
22. "Nota sobre material remanente: 'Esta fuente de datos no se encuentra actualizada' — indica problema de actualización de datos"
23. "Agente TIM — Cumplimiento del plan: '39.76% del plan semanal. A este ritmo, terminaremos el 16 de noviembre, ~2 días de retraso sobre la fecha planificada del 14 de noviembre'"
24. "Avance por fase: Fase 11: 35.29%, Fase 12: 62.58%, Fase 9: 37.44%, Fase 10: 0%"
25. "Información sobre avance del plan proviene de la conciliación topográfica"
26. "Agente TIM — Oferta mineral-chancado: tabla de colas por chancador (CH-02: CA95 en cola, CA57 a 10m22s; CH-1: CA59 en cola, CA93 a 1m25s, CA58 a 4m16s, CA91 a 5m54s)"
27. "Datos de oferta incluyen: Camión, Tiempo de Llegada (ETA), Tiempo de espera Chancador, Cola al Llegar, Tiempo de Espera en Cola"
28. "Mapa muestra posición real de camiones (CA95, CA93, CA59, CA57) respecto a chancadores CH-02 y CH-1"
29. "Agente TIM — Predicción de inactividad: usuario solicita alerta si inactividad >3 minutos en próximos 15 minutos en CH-1"
30. "Sistema ejecuta funciones: get_crusher_offer_queue_table, warn_me_if_crusher_idles_too_much, set_my_number"
31. "Alerta por WhatsApp: 'Crusher CH-1 is predicted to idle at least 4.28 minutes in 9.75 minutes'"
32. "Alertas de seguridad geotécnica por WhatsApp: 'truck CA104/CA76/CA54/CA51/CA63/CA96/CA86/CA78/CA59/CA103/CA52 está operando en zona de inestabilidad geotécnica'"
33. "Alertas en palas: flujo de 3 pasos — (1) Monitoreo de colas en palas, (2) Alerta enviada al despacho ('Shovel PA05 has a queue of 3 trucks'), (3) Chequeo con TIMining Aware"
34. "Usuario puede configurar alertas: 'avísame si una pala tiene más de 2 camiones en cola' con duración configurable (ej. 5 horas)"
35. "Colas monitoreadas: BH09: 1 camión (CA103), PA03: 1 (CA108), PA05: 1 (CA66), PA07: 1 (CA86)"
36. "Material remanente en línea — detalle por fase y polígono: F9SE total 1,243,882t; F10N total 183,304t; F11W total 999,928t; F12N total 861,234t; Total General: 3,288,348t"
37. "Columnas de material: Baja Ley, Estéril, Mineral, Total por Fase. Total General: Baja Ley 102,396; Estéril 1,778,369; Mineral 1,407,583"
38. "Control en tiempo real del plan de carguío y transporte: Overall Movement 178.9 kt, Effective 5.9 ktph, Availability 85.7%, Utilization 38.7%"
39. "Time Losses: 23.8h — Unscheduled Maintenance 50.6%, Unscheduled Delay 27.1%, Scheduled Delay 16.9%, Others 5.1%"
40. "Mapa del rajo con equipos: palas PA03, PA07, PA05, PA10, CH-02, CH-1, camiones de agua WT843, WD700, bulldozers, cargadores"
41. "Cumplimiento del plan de perforación: permite entender sectores avanzados y pendientes para plan semanal"
42. "Plan de perforación: indicador de color por pozo para sub/sobre-perforación; tabla AVANCE DE PERFORACIÓN (CONTRA PLAN SEMANAL) con Polígono, Metros perf, Metros plan, m/h"
43. "Seguimiento al plan de extracción: inventario de materiales remanentes (Inventario Tronado) por polígono con Baja Ley (kt), Estéril (kt), Mineral (kt), Total (kt)"
44. "Inventario tronado muestra datos por polígono (TRF11W_3290, TRF12N_3530, TRF12N_3545, TRF12N_3560, TRF12N_3575, TRF12N_3590)"
45. "Seguimiento Plan de Actividades: Asignación Bulldozer con Equipo, Polígono, Inicio Plan, Horas Plan, Horas Reales, % Área Cubierta"
46. "Bulldozer tracking: Bull 01 (A, 04/11/25, 6h plan/8h real, 77%), Bull 02 (B, 05/11/25, 10h/4h, 57%), Bull 03 (C, 03/11/25, 12h/10h, 83%)"
47. "Plan de equipos de servicios: visualizar plan de motoniveladoras en rutas de la mina, monitorear adherencia, control por hora y por rutas"
48. "Asignación Motoniveladora: Moto 01 (C.O, 77%), Moto 02 (C.S, 57%), Moto 03 (Ruta 4, 83%)"
49. "Módulo de Alertas — alerta de pala fuera de plan: envía alerta por WhatsApp al grupo definido cuando equipo de carguío extrae fuera de plan"
50. "Ejemplo WhatsApp: 'Pala PA03 fuera de plan' (2:07, 6:08), 'Pala BH12 fuera de plan' (12:40, 16:41), 'Pala PA07 fuera de plan' (20:41), 'Pala PA05 fuera de plan' (6:55, 12:52, 16:33)"
51. "Inestabilidades geotécnicas: equipo de monitoreo geotécnico selecciona polígonos asociados a activación de inestabilidad, generando monitoreo y alertas cuando equipo entra en esas zonas"
52. "Mapa muestra zonas de inestabilidad activa, polígonos afectados, equipos en zona de riesgo con alerta gatillada"
53. "Posición de equipos livianos (camionetas): incorporar visualización de camionetas en Aware dentro de categoría de equipos de apoyo"
54. "Alerta de zona restringida por tronadura: generar alerta si equipo está dentro de zona restringida"
55. "Seguimiento y control de entrega de banco: estimación automática de cumplimiento de línea de programa con estimación topográfica"
56. "Reglas de entrega de banco: si material menor que parámetro definido, pala cable puede avanzar hasta 50 metros del banco entregado; si necesario pala hidráulica; si solo requiere excavadora menor"
57. "Categorías de entrega de banco pueden verse reflejadas en Aware y se pueden configurar alertas para cumplimiento de protocolos operacionales"
58. "Control y gestión de origen y destino en línea del material: monitoreo del flujo de transporte a stock/chancador, detectando posibles desviaciones operativas"
59. "Material tracking: tabla por Shovel (EX5500_01, EX5500_02, PCB000_03) con destinos (North_Stkp, CR_1, CR_2, East_Dump, South_Dump, Total)"
60. "Sistema de alertas por destino equivocado: si camión entra en zona de influencia de un stock y su destino es incorrecto, aparece alerta 'Wrong Assignment' — ej: HD785_221 con carga Waste 340 ton Fe 0.2%"
61. "Información de stockpiles: tasas de alimentación y contenido medio global de material (IN/OUT/STOCK en toneladas y Fe Grade % por stockpile: North_Stkp, South_Stkp, West_Stkp)"
62. "Indicadores por pala: tabla con Pala, Estado, Rendimiento (t/h), Utilización (%), Disponibilidad (%), Tiempo Inactivo, Tiempo en Cola, Extracción Total (t)"
63. "Ejemplo palas en turno: BH09 (2750 t/h, 36.59%, 100%), PA04 (7407.64 t/h, 54.66%, 100%), PA05 (4867.97 t/h, 59.24%), PA10 (6255.08 t/h, 63.08%), PA11 (7023.26 t/h, 41.55%)"
64. "Palas en mantenimiento/demora: BH12 (Mant Prog, 81.32%), CF10 (Mant Prog, 0%), CF11 (Demora Nprog, 84.40%), PA03 (Demora Nprog, 100%), PA07 (Mant Nprog, 66.08%)"
65. "Fuente de datos de rendimiento y extracción: FMS (Sistema de Gestión de Flota)"
66. "Detalle por hora — pala BH09: tonelaje varía de 595.58t (09:00-10:00) a 2086.47t (15:00-16:00), con caída a 0t en 13:00-14:00"
67. "Aware muestra por pala: Effective Perf (ktph), Overall Movement (kt), Utilization (%), Availability (%), Queue time (min), status últimas 24 horas"
68. "Tonelaje global por hora (todas las palas combinadas): 09:00: 19,627.61t; 10:00: 20,314.08t; 11:00: 20,862.57t; 12:00: 17,731.46t; 13:00: 16,399.50t; 14:00: 15,494.78t; 15:00: 17,817.35t; 16:00: 13,969.95t"
69. "Fuente de datos de extracción: FMS (Sistema de Gestión de Flota)"
70. "Agente TIM cuenta con capacidad de graficar en base a datos de prompts anteriores (memoria conversacional)"
71. "Datos del Agente TIM correlacionan exactamente con datos mostrados en dashboard Aware (Load and Haul) — validación cruzada agente-plataforma"

## [Antecedentes/TIMining_8-Layer_Diagram.pptx]
- Type: diagrama de arquitectura
- Date: N/A
- Participants: N/A
- Extracted: 2026-02-16T17:35

### Raw Claims
1. "Plataforma TIMINING tiene un diagrama de interconexión de 8 capas"
2. "Capa 1 — Data Origination & Integration: conectores neutrales a FMS (Modular, Hexagon, Wenco), suites de planificación, block model, GPS, drill & blast, señales de planta"
3. "Capa 2 — Real-Time Spatial Reconstruction: geometría computacional e inferencia de soft-sensors: superficie del rajo, avance de perforación, inventarios de tronadura, botaderos (algoritmos core de Aware)"
4. "Capa 3 — Operational State Modeling: matemáticas de proceso: dinámica de carguío-transporte, colas, interferencias; modelos de eventos discretos (Orchestra), inputs de Aris/Tangram/SICT"
5. "Capa 4 — Plan Context & Spatial Adherence: intención de diseño vs ejecución: adherencia en tiempo actual Delta2025, reconciliación polígono-vs-superficie, volumetría"
6. "Capa 5 — Eventing, Controls & Governance: QA/QC de datos, normalización, indexación tiempo-espacio, RBAC, audit trails, APIs estandarizadas y backplane de despliegue"
7. "Capa 6 — Situational Awareness & UX: vistas en tiempo real por rol y dashboards (Aware): supervisores, despacho, planificadores, gerentes; móvil y escritorio"
8. "Capa 7 — Analytics, Anomalies & Auto-Projections: monitoreo de soft-sensors, KPIs de desempeño-vs-plan, simulaciones automáticas de horizonte corto con Orchestra"
9. "Capa 8 — AI Copilot & Autonomy Enablement: Proyecto TIM diagnósticos en lenguaje natural, acciones prescriptivas; feeds de geometría listos para autonomía a robots/despacho"
10. "Flujo de datos ascendente (de capa 1 a 8); prescripciones y control descendentes (de capa 8 a 1)"

## [Antecedentes/TIMining_s strategic position in the mining software market_Sept 25.pdf]
- Type: reflexión estratégica CEO
- Date: 2025-09
- Participants: Phillip Whatmore (CEO, TIMining)
- Extracted: 2026-02-16T17:40

### Raw Claims
1. "Líderes de software minero están formando un oligopolio: un puñado de gigantes están comprando silenciosamente a cada actor significativo para crear 'super suites' end-to-end"
2. "Pitch de marketing del oligopolio: conveniencia e integración — 'one vendor, one bill, full coverage'"
3. "Los verdaderos impulsores de estas empresas son aumentar la complejidad tecnológica para clientes y hacer que el costo de cambio sea astronómico"
4. "Estrategia para startups/nicho: 'if the incumbents sell breadth, you must sell unparalleled depth in a specific vertical'"
5. "Mining Software Leaders Market Map muestra a Bentley, Sandvik, Hexagon, Komatsu, Epiroc, WEHI, Chevrolet, ABB, Vela, Caterpillar, Hitachi, IMDEX y otros — mercado valorado en ~$11B"
6. "Funciones del mercado: Exploration & geoscience, Resource modelling/mine design/planning/scheduling, Fleet management/guidance/autonomy, Drill and blast optimization, Safety/collision avoidance/fatigue/ESG, Enterprise/supply chain/asset management"
7. "TIMining ofrece alternativa a la estrategia de super suite: una plataforma mid-layer, agnóstica, de integración de datos"
8. "Plataforma capaz de integrar cualquier fuente de datos de OEMs y otros vendedores, y usar esos datos para modelar en tiempo real el comportamiento de la mina"
9. "El modelo en tiempo real captura cambios constantes en la condición geométrica/geotécnica de la mina y su desempeño contra el plan minero y métricas operacionales"
10. "La estrategia 'mid layer' permite a las mineras evitar quedar atrapadas en contratos caros y vinculantes de largo plazo con los líderes de software minero"
11. "Valor clave adicional del modelado en tiempo real: habilita la aplicación de IA para mejorar el desempeño minero end-to-end"
12. "Analogía: como vehículos autónomos necesitan LIDAR para capturar e interpretar el entorno en tiempo real, la misma capacidad se necesita para lograr una operación minera completamente automatizada"
13. "Para construir un motor de optimización digital end-to-end con toma de decisiones en tiempo real con IA/ML, primero se necesita un modelo preciso y en tiempo real de la mina"
14. "Los modelos en tiempo real existen en procesos plant-to-port por su naturaleza predecible y continua, y porque instalar sensores electrónicos es relativamente fácil"
15. "En la operación minera, que es menos continua y donde ocurren eventos muy frecuentemente causando variabilidad, la tecnología solo ha podido modelar en tiempo real procesos específicos (ej: perforación autónoma, camiones autónomos)"
16. "No hemos encontrado otro actor en el mercado además de TIMining que haya podido construir el modelo en tiempo real de la mina"
17. "Los block models no tienen un sensor digital informando cada segundo cómo su composición y estructura cambia a través del proceso de tronadura, perforación y extracción"
18. "Datos de topografía se recolectan en batch por levantamiento manual (usualmente semanal) o vuelos de drones (un par de veces por semana según presupuesto). Después necesitan procesamiento y conciliación que toma al menos otro día"
19. "Software de planificación (y sus usuarios) están siempre en un juego de catch-up con lo que ocurrió en tiempo real en la operación, dejando una brecha de desempeño que genera pérdida masiva de valor"
20. "El desafío es usar los datos en tiempo real disponibles en la mina generados por equipos de procesos principales: perforadoras, palas y camiones, especialmente información GPS"
21. "TIMining es la única empresa en el mercado que ha desbloqueado este desafío: recolectar datos de equipos e inferir con precisión la topografía en tiempo real usando algoritmos propietarios"
22. "TIMining es probablemente el único proveedor en la industria minera del modelo en tiempo real de la mina necesario para ejecutar un motor de optimización/simulación/recomendación end-to-end con IA"
23. "Esta capacidad única debería ser muy atractiva para OEMs/software incumbentes y para big tech (Google, Microsoft, Amazon, Palantir) que no han podido penetrar el espacio de planificación/operación minera"
24. "Shift de marketing necesario: de 'we sell a simulation tool' a 'we own a simulation for mining'"
25. "TIMining tiene actualmente una fuerte capacidad de simulación de transporte (hauling); en el roadmap está generar un módulo de simulación de extracción para eventualmente crear un motor end-to-end de simulación y recomendación en tiempo real"
26. "Urgencia competitiva: 'necesitamos movernos rápido. Es solo cuestión de tiempo hasta que otro actor desbloquee el desafío del modelado en tiempo real'"
27. "Aceleración necesita pensamiento estratégico: combinación de inyectar recursos/capacidades adicionales en equipo de desarrollo + encontrar formas de acelerar go-to-market, porque un footprint más fuerte es también una gran estrategia de defensa"

## [Antecedentes/Ppt & videos evento Google/[Evento Google] FINAL SCRIPT - V4.docx]
- Type: guión de presentación
- Date: N/A (evento Google)
- Participants: Carlo Calderón (CTO & CPO, TIMining)
- Extracted: 2026-02-16T17:45

### Raw Claims
1. "TIM Insight Engine: primer sistema de agentes mineros basado en IA Generativa de Google que fusiona la realidad de la operación minera con la planificación"
2. "Presentador: Carlo Calderón, fundador, CTO & CPO de TIMining"
3. "Colaboración estratégica con Google: integración de agentes de IA basados en Gemini directamente sobre el modelo digital de TIMining"
4. "Problema: las minas operan en tiempo real (sensores, telemetría, despacho) pero la capacidad humana para procesar esta información ha sido ampliamente superada"
5. "Observar un dato es instantáneo, pero el diagnóstico de un problema puede tardar horas o días. Los desvíos no se detectan ni se corrigen dentro del turno"
6. "Paradoja de la mina digital: minas modernas son fábricas de datos (sensores, FMS, IoT, dashboards) — el dato aparece en milisegundos pero el entendimiento ocurre más lento"
7. "Cuello de botella no es tecnológico, es cognitivo: generación de datos ha superado ampliamente la capacidad humana de análisis"
8. "Desafío: no automatizar para reemplazar al operador, sino potenciar su capacidad cognitiva — transitar hacia 'Inteligencia Aumentada'"
9. "Planificación y operación funcionan como silos desconectados: geometría (plan) en un sistema, datos de operación (realidad) en otro — estos mundos no conversan"
10. "Cuando algo se desvía del plan, no siempre es evidente responder tres preguntas clave: qué se desvió, dónde ocurrió y por qué ocurrió"
11. "Desviación puede tener múltiples causas: problema de equipos, caminos, frentes disponibles, o procesos aguas arriba no visibles desde la operación directa"
12. "No está claro cuándo una actividad pasa a ser parte de la ruta crítica del plan semanal"
13. "Tecnología actual TIMining: captura datos de la mina (plan minero geométrico + telemetría operación + topografía), infiere estado actual, compara geometrías actuales con planificadas"
14. "Motor de alertas permite monitorear datos de sensores y construir sensores virtuales para monitorear avances o calidad de geometrías"
15. "Motor de simulación permite pronosticar cómo terminará el turno"
16. "Con Gemini: usuarios pueden conversar directamente con la información del modelo a través de lenguaje natural"
17. "Oportunidad identificada: agentes especializados en configurar motor de alertas y simulador, sin necesidad de crear archivos de configuración o escenarios manuales"
18. "Desafíos técnicos abordados: (1) asegurar cero alucinaciones, (2) integrar datos en tiempo real, (3) fusionar datos operacionales con geometría, (4) tiempos de respuesta compatibles con la operación"
19. "En minería no podemos permitir alucinaciones — agente está 'anclado' matemáticamente a topografía y telemetría real de la mina como única fuente de verdad"
20. "Visión: pasar de describir lo que está pasando a predecir y recomendar acciones para minimizar desviaciones al plan"
21. "TIMining como 'Orquestador Cognitivo de la Operación Minera del Futuro': orquesta inteligencia operativa mediante sistemas multi-agente autónomos y confiables"
22. "Transformar datos complejos en decisiones seguras y rentables en tiempo real"
23. "Digitalización minera nació de la urgencia y complejidad real de las operaciones más difíciles, no de un laboratorio ni idea abstracta"
24. "Enfoque diferenciador: partir desde la realidad, no desde la teoría — combinar matemática, informática y conocimiento minero para reconstruir la mina desde sus propios datos"

## [Propuesta ruta/TIMining- Lineamientos de experiencia.pptx]
- Type: propuesta de consultoría UX/estrategia
- Date: N/A
- Participants: Idemax (consultora)
- Extracted: 2026-02-16T17:50

### Raw Claims
1. "Idemax: consultora regional de transformación de negocios — estrategia, innovación y conocimiento científico"
2. "Business units de Idemax: Estrategia (orientación en escenarios de cambio), Innovación (gestión para mejorar resultados), Ciencia (conocimiento científico para competitividad)"
3. "Proyecto: Diseño de la experiencia ganadora para plataforma multimodal TIMining"
4. "TIMining con 15 años de experiencia, referente en tecnología para minería de rajo abierto, presente en más de 50 minas en 8 países"
5. "Oportunidad identificada: revisar y diseñar la experiencia ideal para nueva plataforma multimodal de TIMining"
6. "Implica repensar y diseñar la arquitectura modular, usabilidad y UX/UI para maximizar captura de valor, escalar regionalmente y consolidar liderazgo"
7. "4 ejes del acompañamiento estratégico: (1) propuesta de valor unificada/diferenciada, (2) lineamientos UX/UI 'ganadora', (3) arquitectura modular del portafolio, (4) narrativa estratégica para expansión y capital"
8. "Ruta de trabajo en 4 etapas, 10 semanas: Etapa 1 Inmersión (sem 1), Etapa 2 Experiencia clientes (sem 2-3), Etapa 3 Lineamientos diseño (sem 4-9), Etapa 4 Comunicación estratégica (sem 9-10)"
9. "Etapa 1 — Inmersión y racional estratégico: entendimiento funcionalidades (visor 3D, motor de alertas, IA con Google Gemini, simulación what-if, modelamiento en tiempo real, sensores virtuales)"
10. "Etapa 1: 4 entrevistas internas, levantamiento de tendencias, benchmarking de experiencias multi-módulos (ej. SAP, Teams), alineación estratégica de negocio"
11. "Etapa 2 — Experiencia de clientes y casos de uso: 6 entrevistas en profundidad con usuarios clave y stakeholders, hipótesis de creación de valor, perfilamiento de usuarios"
12. "Etapa 2: levantamiento de puntos de contacto críticos, identificación de stakeholders que interactúan con la plataforma en operaciones mineras, historias de usuario/casos de uso"
13. "Etapa 3 — Lineamientos de diseño plataforma multimodal (6 semanas): consolidación estratégica, principios UX, guidelines de navegación/wireframes, parámetros de evaluación UX/UI, rediseño de maquetas de flujos"
14. "Etapa 3: definir estructura modular, interconexión entre módulos y escalabilidad; herramienta para cuantificar coherencia de desarrollos UX/UI"
15. "Etapa 4 — Comunicación estratégica: mensajes clave adaptados a diferentes audiencias (clientes, inversores, equipo interno, socios estratégicos), diseño de presentación ejecutiva"
16. "Etapa 4 entregables: guía de mensajes clave y narrativa estratégica, plantilla PPT ejecutiva, propuesta de imagen de marca (logotipo/isotipo)"
17. "Output esperado: estrategia unificada, experiencia de cliente clara y nítida, coherencia entre definiciones estratégicas y UX del producto"
18. "Convergencia, ordenamiento y articulación clara del portafolio de productos y su multimodalidad, con foco en usabilidad excepcional y maximizar captura de valor"
19. "Narrativa estratégica que comunique innovación en diseño de experiencia y arquitectura modular, impulsando expansión y levantamiento de capital"

## [Referencia de 1. Benchmark.pptx]
- Type: plantilla de benchmark
- Date: N/A
- Participants: N/A (template vacío)
- Extracted: 2026-02-16T17:55

### Raw Claims
1. "Plantilla de benchmark de industria de interés con estructura: Resumen (twit de lo que hace, propuesta de valor, problema), Modelo de Negocios (ingresos, activos estratégicos, clientes, mercados), Atributo Diferenciador"
2. "Template prevé 4 referentes de benchmark con imágenes de referencia por cada uno"
3. "Estructura incluye: industria de interés, nombre referente, qué hace, por qué es de valor"

## [Sello de Experiencia TIMINING.pptx]
- Type: estrategia de experiencia de producto
- Date: N/A
- Participants: Idemax (consultora)
- Extracted: 2026-02-16T18:00

### Raw Claims
1. "Objetivo estratégico: diseñar experiencia UX/UI 'ganadora', intuitiva y escalable para posicionar plataforma multimodal como referente de alto valor"
2. "La experiencia tiene que ser una Brújula que guíe la ruta y ayude a tomar decisiones en un entorno cambiante"
3. "STOP — Eliminar grasa operacional: visualización 3D sin propósito (cosmético), desarrollos a medida no genéricos, gráficos que piden sin solucionar, mismos KPIs que todos los dashboards"
4. "STOP: repetir información genera confusión, capacitaciones muy largas (fricción), Data Dumping (números sin sentido), burocracia de reporting 'para arriba'"
5. "STOP: problemas de TI/contratos/adherencia (no es Plug & Play), solución que llega cuando el problema 'pasó de moda'"
6. "KEEP — Fortalecer valor: simplicidad y rapidez (contexto inmediato), visibilidad del éxito (vincular con bonos/incentivos), capas simples de información"
7. "KEEP: control operacional (sentir que tiene el control), seguridad para priorizar riesgos, claridad proceso completo Mina > Planta > Chancado"
8. "KEEP: certeza de datos y ciberseguridad (es mi dato, no voy por doble check), soporte activo y 'escuchar' la mina"
9. "START — Inyectar inteligencia: asistente virtual/copiloto proactivo, medir pérdida en tiempo real, reducir ruido (foco en lo esencial)"
10. "START: omnipresencia en canales primarios (WhatsApp/Radio), Foresight (abanico de escenarios posibles), comunicación de silos PyT-Chancado"
11. "START: Outcome vs Output (consciencia del valor agregado), 'Qué pasó, Por qué y Qué hacer' (causalidad), auditar fuentes de la verdad"
12. "Fricción → Valor: experiencia Plug & Play (minimizar configuración/TI), agente IA proactivo, capacitación in-app contextual (bye bye manuales)"
13. "Sobrecarga → Valor: personalización adaptativa por rol, Glanceable Intelligence (comprensión <5 segundos del estado del sistema), narrativa automatizada con resúmenes ejecutivos"
14. "Estrategia → Valor: arquitectura escalable (evitar trampa del desarrollo a medida), 3D operacional como Digital Twin real (no adorno estético), MVP de productividad"
15. "Control & visibilidad: planificador interactivo con medidor visual en tiempo real del material perdido, simulador de escenarios ('abanico de futuros posibles'), visualización contextual"
16. "Asistencia inteligente: asistente virtual contextual, explicación causa-efecto con narrativas visuales, automatización de tareas ante patrones recurrentes"
17. "Impacto de negocio: panel que cuantifica 'valor agregado' por decisión ($), auditor de datos integrado, hub de colaboración que rompe silos"
18. "Concepto CORE como Sistema Nervioso Central: C=Conciencia (situacional y geométrica), O=Orquestación (cognitiva y multimodal), R=Realidad (aumentada y predictiva), E=Ejecución (agéntica y autónoma)"
19. "Conciencia: 'Fuente de la Verdad' unificada — la mina necesita certeza geométrica, eliminar ceguera operativa"
20. "Orquestación: Integrador Neutro (efecto Suiza), rompiendo silos entre fabricantes y sistemas aislados, sincronizando flujo de decisiones planificación-ejecución"
21. "Realidad: Time Travel Interface — Hindsight (reconstrucción forense pasado), Insight (visibilidad tiempo real), Foresight (alertas por patrones, modelos predictivos)"
22. "Ejecución: de dashboards a inteligencia agéntica, interfaz silenciosa que solo se activa cuando necesario actuar (Gestión por Excepción)"
23. "'Diseñamos para dar paz mental en entornos críticos' — no es solo software, es la evolución biológica de la operación minera"
24. "Dejar de ser un 'visor' pasivo para convertirse en el Sistema Nervioso Central que conecta la intención del negocio con la acción en el terreno"
25. "Complicado vs Complejo: motor de CAEX es complicado (predecible, se gestiona con expertos y protocolos); operación minera es compleja (impredecible, se gestiona con experimentación y observación de patrones)"
26. "Concepto Glanceable Intelligence / Calm Technology para gestionar la complejidad"
27. "Evolución de 'Kiosco de Datos' (autoservicio de gráficos) a médico operacional que diagnostica problemas y prescribe acciones proactivas"
28. "Mantra operativo: valor no reside en el software sino en la 'Paz Mental' del operador. Si no reduce la carga mental, no sirve"
29. "Valor percibido: concepto 'iPhone-like' — minimalismo, tecnología, limpieza, simplicidad. Justificar ticket de USD 450k+"
30. "Ejes de experiencia: (A) Operabilidad orientada a decisión — cada visualización debe tener Call to Action, (B) Quiet UI — gestión por excepción, (C) Inteligencia Ubicua — multimodal donde ocurre el problema, (D) Time Travel Interface"
31. "Patrones de diseño centrados en: Tiempo (bien gastado), Energía (reducir agotamiento), Conocimiento (certeza), Valor (percepción del gasto)"
32. "4 dominios operativos: (1) Asistencia Proactiva (reducir carga cognitiva), (2) Resiliencia y Crisis (minimizar variabilidad negativa), (3) Continuidad Operativa (optimizar flujo), (4) Visibilidad Estratégica (conectar operación con última línea financiera)"
33. "Caso de uso #1: Gestión de caída de equipo crítico — flujo: Detección (alerta multimodal) → Análisis (cálculo pérdida tonelaje) → Simulación (3 escenarios rankeados: A detener flota, B cambiar vaciado, C usar cargador)"
34. "Referente de diseño: SentinelOne Purple AI — plataforma de ciberseguridad agéntica con triaje automático de amenazas"
35. "Perfiles activadores de uso: Ingenieros planificación (adherencia métrica), Gerentes/Superintendentes (pulso del negocio), Jefes turno/Despachadores (alertas tácticas), Ingenieros geotécnicos (monitorear riesgos remotamente), Operadores (alertas destino/riesgos)"
36. "Tecnologías presente y futuro: Plan Compliance, Motor & algoritmo, TIM Insight Engine (IA Generativa), Motor Simulación Continua Automática"
37. "Funcionalidades: Load & Haul Optimization, Origin & Destination, Real-Time Risk Management, Short-Term Planning, AHS Performance, Vendor Control, Drill & Blast"
38. "Estrategia lock-in: dependencia operacional (conectado hasta la médula), valor estratégico entregado (ahorro vs costo), adherencia y adopción (tasa de uso, curva de aprendizaje)"

## [TIMINING_Workshop 01 _ 28 Enero 26.pptx]
- Type: presentación de workshop
- Date: 2026-01-28
- Participants: Idemax, TIMining (Carlo Calderón), stakeholders internos
- Extracted: 2026-02-16T18:10

### Raw Claims
1. "Workshop 01, 28 Enero 2026 — Etapa 1: Diagnóstico e Inmersión, Racional Estratégico"
2. "Análisis previo: 10 entrevistas en profundidad con stakeholders internos para entender producto, brechas y oportunidades"
3. "Trayectoria de desarrollo: de 'Génesis/Partida' a 'Evolución/Crecimiento Temprano' — desafío actual: desorden estratégico, recursos mal dispuestos, gobernanza caótica, pérdida de foco"
4. "Futuro deseado: idea nítida, recursos estratégicamente dispuestos, coherencia, crecimiento, condición de éxito compartida"
5. "Insight — Dolor del Ingeniero: 'Los ingenieros de operaciones constatan que no tienen tiempo para estar mirando una pantalla para monitorear la operación' — no quieren otro dashboard, quieren resolver tareas y ser interrumpidos solo si es crítico"
6. "Insight — JTBD: 'El usuario no usa el software; el usuario contrata a TIMining para resolver problemas específicos de negocio en el turno' — interfaz debe ser tan intuitiva como WhatsApp o Amazon"
7. "Insight — Customización del rol: 'No muestres todo: resalta los 5 camiones fuera del plan, no los 50 que están en la mina' — presentar solo lo que requiere cada perfil"
8. "Insight — Curva de adherencia: 'El producto actual es sofisticado y complejo, genera barrera en uso sostenido y en visibilizar captura de valor' — simplificar lo complejo"
9. "Insight — Suite de productos: 'No tenemos un set común de funcionalidades para estandarizar características básicas' — oportunidad de lock-in en el daily life del usuario"
10. "Insight — Cerebro estratégico operativo: 'Queremos que el cliente mida el impacto del uso de la plataforma, hoy es muy complejo trazarlo' — copiloto operacional + socio estratégico"
11. "Insight — Escalabilidad: 'Hoy queremos un cliente feliz y eso significa que lo que me piden yo se lo desarrollo a la medida' — crear solución estandarizada con capa customizable, salir de la trampa del hecho a medida"
12. "Insight — Pricing: 'Existe desconexión entre precio de licencia y valor entregado (ahorros y optimización)' — cambiar modelo visibilizando valor real, generar adherencia al plan en lugar de cobrar por usuario/software"
13. "Insight — Ventaja comercial: '¿Cómo ser más hábiles en empaquetar capacidades para responder a la necesidad de moda de la mina?' — ordenar capacidades existentes"
14. "Insight — Propuesta de valor: 'Viaje en el tiempo a través de interfaces atomizadas que hoy no permiten moverse del pasado al presente y al futuro' — visualizar (pasado), entender (presente), anticipar (futuro) en un solo lugar"
15. "Ideas de fuerza del workshop: (1) Foresight, (2) Cerebro Estratégico-Operativo, (3) Lock-in, (4) Super-potenciador de la práctica humana, (5) Escalabilidad, (6) Usabilidad, (7) Simplificar lo complejo"
16. "Reglas del negocio: de medir 'toneladas movidas' (productividad ciega) a 'adherencia espacial' (cumplimiento del plan) — 'Democratización de la decisión'"
17. "Oportunidades: Movilidad Extrema (Del Desktop al Bolsillo), Interacción Natural (Cero barreras técnicas), Resolución de Dolores (Bottom-Up)"
18. "Soluciones diferenciadoras: Plan Compliance, Load & Haul Optimization, Origin & Destination, Real-Time Risk Management, Short-Term Planning, AHS Performance, Vendor Control, Drill & Blast"
19. "Paleta UX/UI multimodal: Realidad (3D Digital Twin), Táctico (Widgets/Alertas Push/WhatsApp), Agente/Copiloto (TIM Insight chat NL), Briefing (semáforos), Gamificación (badges/recompensas)"
20. "Tecnologías presente vs futuro: Motor Inferencia Topográfica vs TIM Insight Engine (IA Gen), Motor Simulación eventos discretos vs Simulación Continua Automática"
21. "Captura de valor evolución: Descriptivo/Diagnóstico (alertas qué/dónde) → Prescriptivo/Autónomo (sistema recomienda qué hacer)"
22. "Sello TIMining: 'no es entregar software; es entregar certeza en un entorno de caos' — transformar la mina de fábrica de datos ruidosos a sistema nervioso integrado"
23. "Ventajas experiencia ganadora: (1) Fin de brecha geométrica (certeza no estimación), (2) Inteligencia sin barreras (multimodal, democrática), (3) Libertad operativa (efecto Suiza), (4) Gestión de futuro (reactivo a prescriptivo), (5) Camino a la autonomía"
24. "Benchmarks de referencia: StarCraft II (niebla de guerra/revelación progresiva), Adobe Premiere Pro (navegación temporal), Datadog (gestión por excepción/quiet by default)"
25. "Benchmarks: Garmin G5000 (visión sintética 3D), Samsara (telemetría unificada), Palantir AIP (ontología de datos/grounding), McLaren Atlas (análisis de Delta), Verkada Command (búsqueda por atributos), Unifi Protect (scrubbing alta velocidad)"
26. "Si la plataforma TIMining es el 'Cerebro Estratégico Operativo', ¿cómo se ve, se siente y actúa en un día donde la mina 'habla' con el usuario, anticipa problemas y sugiere soluciones óptimas?"
27. "Integración de stakeholders: unificar Geología, Planificación y Operación en una sola 'Fuente de la Verdad' — planificador ve impacto operativo, despachador ve restricciones del planificador"

## [Visión Futuro _CORE_/Design Brief_ TIMining CORE.docx]
- Type: design brief
- Date: 2026-01
- Participants: Phillip Whatmore (CEO), Gemini (Senior PM/Architect)
- Extracted: 2026-02-16T18:20

### Raw Claims
1. "Design Brief: TIMining CORE — UX/UI Architecture for the Next-Generation Mining Operating Platform, Version 1.0, January 2026"
2. "Problema industria: producción de minerales de minas antiguas con leyes bajas y presión de costos; regulaciones y permisos más difíciles; necesidad urgente de máxima extracción y cumplimiento de vida de mina"
3. "Las minas generan terabytes de datos, muchos en tiempo real, pero integrarlos con precisión es muy complejo — cada proceso tiene proveedores diferentes con datos en formatos distintos, tiempos distintos y fiabilidad dispar"
4. "El rajo abierto permanece como entorno de alta variabilidad dependiente de datos 'ex-post' e intuición humana, en contraste con plantas industriales ricas en sensores y automatizadas"
5. "Existe una 'Geometry Gap': falta de sensores que gatillen alertas sobre cambios en la geometría de la mina (tras tronaduras o extracción) — esto restringe la mejora de planes de corto plazo"
6. "Eventos no planificados diarios son resueltos por jefes de turno o ingenieros basándose en experiencia, no en decisiones basadas en datos con analítica fuerte"
7. "Ingenieros de planificación luchan para entender y modelar la causa raíz de desviaciones, y toman tiempo en incorporar todos los factores relevantes para ajustar planes semanales/mensuales"
8. "CORE es la nueva plataforma en tiempo real de TIMining: aprovecha Real-Time Topography Inference (breakthrough 'Soft Sensor'), simulación Orchestra y Agentic AI de Gemini para crear el primer 'Intelligent Brain' de la mina"
9. "Certeza Geométrica: ningún competidor puede correr simulaciones sobre topografía que se actualiza cada 15 minutos"
10. "Inteligencia Democrática: mover insights del desktop al bolsillo, alcanzando 100+ usuarios activos por sitio mediante licenciamiento ilimitado"
11. "ROI probado: ya demostrado más de $10M en ahorros y ganancias de eficiencia en operaciones Tier-1 como Codelco y Antofagasta Minerals"
12. "CORE debe diferenciarse de Aware actual: Aware incluye integración de datos, modelado en tiempo real, visor 3D, 3-4 alarmas configurables, 1-2 reportes automáticos, 1-2 motores de extracción de datos (API)"
13. "Aware se vende por licencia anual renovable de USD 300k por faena minera con usuarios ilimitados, más fee de implementación de USD 100-200k"
14. "CORE apunta a venderse por al menos USD 450k por faena minera, misma licencia anual renovable y usuarios ilimitados"
15. "Filosofía de diseño: 'Value Triad' con 3 dimensiones MECE — A: 8 Core Client Solutions (What), B: Technology Engines (How), C: Multi-Modal UX/UI Navigation (Where)"
16. "8 Soluciones Core: Plan Compliance, Short-Term Planning, Load & Haul Optimization, Origin & Destination Control, Real-Time Risk Management, Vendor & Contract Control, AHS Performance, Sequence Management"
17. "Efecto Suiza (Neutral Integrator): TIMining integra datos de OEMs competidores (Komatsu, Cat, Modular, Hexagon) y software de planificación (Maptek, Deswik), creando contexto unificado irreplicable"
18. "Real-Time Topography Inference: algoritmo propietario único en el mercado que 'cracked the real-time geometry code' — infiere topografía cada 15 minutos usando GPS de equipos"
19. "Motor de simulación de eventos discretos Orchestra, evolucionando a simulación de extracción y drill & blast"
20. "Project TIM: razonamiento AI/LLM con lenguaje natural en alianza con Google Gemini — reglas y algoritmos propietarios para cero alucinaciones"
21. "Arquitectura de Navegación Multi-Modal con 'Unified Navigation Ribbon' y 4 Lentes: Reality (3D), Tactical (2D Flow), TIM Agent (Conversational), Briefing (Feed)"
22. "Lens 1 REALITY: visor 3D alta fidelidad con 'Time-Travel Slider' y 'Spatial Anchors' estilo Ubisoft"
23. "Lens 2 TACTICAL: mapa vectorial con 'Scenario Ghosting' (plan actual vs plan sugerido por IA) y 'One-Click Spreadsheet' para exportar a Excel"
24. "Lens 3 TIM AGENT: Co-Piloto conversacional con 'Command Bar' persistente, acceso democrático a datos, capacidad de anclar snapshots 3D en el chat"
25. "Lens 4 BRIEFING: feed mobile-first basado en cards con 'Multimedia Shift Logs' (audio/video de 30s auto-stitched) y barras de progreso estilo Amazon"
26. "Elementos UX adicionales: videos/timelapses, reportería descargable, mensajes WhatsApp, Teams/email"
27. "DNA de diseño: Gaming (Ubisoft — badges para adherencia >95%), Logistics (Amazon/DHL — Exception Management), E-Commerce (Shopify — sidebar modular)"
28. "Accesibilidad: alto contraste obligatorio para uso en terreno con sol brillante. Alertas críticas legibles en menos de 5 segundos ('Glanceable Intelligence')"
29. "Visión 2040: IROC maduro donde distinción Mina/Planta desaparece; operaciones gestionadas como un solo digital twin; corporaciones gestionan múltiples minas globales desde hubs urbanos"
30. "Visión 2040: vehículos 100% autónomos donde TIMining actúa como 'cerebro inteligente' de la geometría; humanos dejan de enfocarse en análisis pesado de datos"
31. "Evolución de interfaz 2040: WhatsApp estático → Lenguaje Natural nativo; Visitas físicas → Zonas Virtuales; 3D Viewer → Intelligent Brain; SQL → Inteligencia Democrática"
32. "Pain points por perfil: Ingenieros Operación (no tienen tiempo para pantalla), Supervisores (inteligencia atada al desktop), Planificadores (no pueden cerrar loop diseño-realidad), Despachadores (falta awareness geotécnico)"
33. "Pain points: Corporate/Senior Management (reaccionando a datos de ayer), Equipos Geotécnicos (visitas físicas interrumpen flujo), Gerentes/Liderazgo (silos de datos)"
34. "KPIs cuantificados: Adherencia espacial +5 a +10 pp; Adherencia fase específica +19%; Costos topografía -20%; Remanejo USD 2.8M ahorro; Velocidad flota +3 a +5 km/h"
35. "KPIs: Tiempo ciclo -2.4 min; Throughput +130 cargas camión/día; Precisión producción Cu recuperada de -15% a +7%; Eficiencia flota +5.2 horas camión/día"
36. "Impacto financiero total: USD 10M+ en 3 minas Chile; USD 6M capturado ene-may 2025 en una sola faena"
37. "Widgets de valor: Adherencia (% Delta ej. +9%), Productividad (velocidad km/h y tiempo ciclo), Seguridad (incursiones a zonas de peligro activas, hotspots de congestión)"
38. "Copiloto Digital cambia loop de decisión de Descriptivo a Prescriptivo: (1) Democratización de inteligencia, (2) De problema a solución (3 escenarios), (3) Alertas predictivas"
39. "Pull queries ejemplos: reportes de palas en tabla, tonelaje global por hora, velocidades por estado de carga, oferta mineral chancado, material remanente por fase, gráficos en tiempo real"
40. "Push alerts: incursión zona geotécnica por WhatsApp, predicción inactividad chancador, advertencia cola de palas, compliance de excavación, wrong assignment de material"

## [Visión Futuro _CORE_/GEMINI exercies_TIMining_CORE_The_Operating_Brain_of_the_Digital_Mine.pdf]
- Type: pitch_deck / investor_presentation
- Date: 2026 (sin fecha exacta)
- Participants: TIMining (Carlo Calderón, equipo ejecutivo)
- Extracted: 2026-02-16T18:30

### Raw Claims
1. "TIMining CORE — The Operating Brain of the Digital Mine. From Reality to Plan. In Real-Time."
2. "The Industry Paradox: The Geometry Gap — a persistent disconnect between Plan (Expectation) and Reality (Fact)"
3. "A 5% increase in plan compliance can add $15B in value to the industry annually"
4. "Mining plans are static. Reality is dynamic. The gap costs the industry billions."
5. "2011-2015: Geotechnical Foundation — products Aris (slope stability) and Tangram (blast design). 'We earned the right to automate decision-making by solving the hardest problems first.'"
6. "2015-2019: Logistics Layer — product Orchestra (fleet management analytics)"
7. "2019-2025: Digital Twin — product Aware (real-time mine model)"
8. "2026 Inflection Point: Cracking the Geometry Code — Raw GPS Data (No Drones) → Proprietary Inference Algorithm → Real-Time Digital Twin (updates every 15 minutes)"
9. "TIMining's proprietary inference algorithm converts raw GPS data into real-time digital twin geometry without drones"
10. "Digital twin geometry updates every 15 minutes from GPS data alone"
11. "The 2026 Platform has 4 lenses: (1) REALITY — Digital Twin, (2) TACTICAL — Simulation, (3) AGENT — AI Co-Pilot, (4) BRIEFING — Shift Handover"
12. "Platform governed by Command Ribbon UX — single navigation paradigm across all 4 lenses"
13. "Time-Travel Interface: Hindsight to Foresight — timeline slider showing History/Data and Simulation/Future in a single viewport"
14. "TIM: Gemini-Powered Mining Co-Pilot — 'Democratic Intelligence without hallucinations. Every supervisor now has an analyst in their pocket.'"
15. "TIM uses Google Gemini as its AI foundation for the mining co-pilot agent"
16. "The Seagull Effect: Automated Briefings — Voice Note, Video Reel, KPI Summary to solve shift change context loss"
17. "Shift handover is identified as a critical pain point — 'The Seagull Effect' where incoming shift managers lack context from previous shift"
18. "Closing the Loop (Supervisor workflow): Detection (1.5m deviation detected) → Analysis (bottleneck prediction) → Recommendation (Option A/B presented) → Action (fleet rerouted)"
19. "'From problem to solution in minutes, not hours' — supervisor decision loop timeline"
20. "Global Footprint: 50+ Mines, 8 Countries"
21. "7 mines currently running full Real-Time Digital Model"
22. "Client portfolio includes: Codelco, BHP, Glencore, Anglo American, Teck, Lundin Mining"
23. "Leapfrog Adoption Model: Target 80% YoY Growth"
24. "Bottom-Up Strategy: Land with operations team, expand to planning. High stickiness once embedded."
25. "Target: 100+ Active Users per mine site"
26. "The Switzerland Effect: TIMining CORE as Neutral Integrator between Planning Software (Maptek, Deswik) and Fleet Management Systems (Modular, Caterpillar, Komatsu)"
27. "TIMining se posiciona como capa neutral que integra software de planificación y sistemas de gestión de flota sin competir con ninguno"
28. "Roadmap 2026: Predictive Simulations — 'What-if' scenario engine for operational planning"
29. "Roadmap 2026: Underground Expansion — extending platform capabilities to underground mining"
30. "Roadmap 2026: Advanced Optimization — Ore Control + dispatch 'second opinions' via AI"
31. "Vision 2040: Brain of the Autonomous Mine — multi-mine tactical control from urban hubs"
32. "Vision 2040: Remote operations managed from city-based control centers, not on-site"
33. "Closing thesis: 'The Geometry of the Mine is the Geometry of the Business'"
34. "Three-phase narrative: (1) Mastered the Earth, (2) Connected the Data, (3) Automating the Decisions"
35. "Presentation generated via NotebookLM — indicates use of Google AI tools for investor materials"

## [Visión Futuro _CORE_/Timining_Core_El_Sistema_Nervioso_de_la_Minería.pdf]
- Type: product_vision / internal_strategy_deck
- Date: 2026 (sin fecha exacta)
- Participants: TIMining
- Extracted: 2026-02-16T18:35

### Raw Claims
1. "Timining Core: El Sistema Nervioso de la Minería Moderna — De la visualización pasiva a la inteligencia multimodal"
2. "Un enfoque centrado en el usuario para cerrar la brecha entre Planificación y Operación"
3. "La Brecha Histórica: El Plan (Geometría) es estático, largo plazo, modelos de baja resolución — la intención del negocio. La Operación (Sensores) es dinámica, tiempo real, alta variabilidad — la realidad física."
4. "El Problema: La desconexión entre plan y operación impide identificar desviaciones a tiempo"
5. "'Las minas operan en tiempo real, pero los planes no.'"
6. "Timining Core se posiciona como 'La Fuente de la Verdad Dinámica' — un ecosistema digital que fusiona datos operacionales con la geometría de planificación"
7. "Inferencia Topográfica: Cálculo del estado 3D en tiempo real. Procesamiento continuo de nubes de puntos y datos de sensores para actualizar dinámicamente la superficie minera."
8. "Conciliación Automática: Comparación matemática constante entre ejecución y plan. Algoritmos de comparación geométrica que cuantifican desviaciones en volumen, ley y ubicación en tiempo real (V.real vs. V.plan)."
9. "Arquitectura del ecosistema: Datos Operacionales (FMS, IoT) + Geometría de Planificación → Modelo vivo de la Mina → Motor de alertas (→ Supervisor) + Simulador (→ Sala de control)"
10. "La Capa Cognitiva: El Cerebro Orbitando el Núcleo — tres componentes orbitan el modelo digital"
11. "Algoritmos (Sensores Virtuales): Detectan QUÉ pasa. Inferencia de topografía y tracking."
12. "TIM Insight Engine (IA): Entiende POR QUÉ pasa. Agente multiagente y LLMs."
13. "Simulador (Orchestra): Predice QUÉ PASARÁ. Proyección y escenarios 'What-if'."
14. "Cambio de Paradigma: Del Mapa Estático al Sistema Nervioso — Ayer: El Mapa (visualización pasiva, interpretación manual, estático) → Hoy: Timining Synapse (red activa de impulsos, respuestas inteligentes)"
15. "Timining Synapse conecta Cerebro (Plan) con Cuerpo (Mina)"
16. "'Ya no basta con ver la mina; necesitamos que la mina nos hable cuando requiere atención.'"
17. "La Revolución Multimodal: La pantalla ya no es la única interfaz. Tecnología adaptada al usuario."
18. "4 canales de interacción: Voz (Radio IP) para usuario en terreno con manos libres, Chat (TIM Insight) para consultas rápidas y diagnóstico causal, Visual (3D Twin) para conciencia situacional profunda, Push (Alertas) para gestión por excepción"
19. "Interfaz Voz vía Radio IP: protocolo P25, frecuencia 450.0 MHz — pensada para operadores en terreno sin acceso a pantallas"
20. "Chat TIM Insight: ejemplo query 'causa raíz evento #34A' → result: 'fallo sensor B2' — diagnóstico causal automatizado"
21. "Interacción 1 — TIM Insight Engine: Conversando con la Mina. Ejemplo: '¿Por qué la Pala 4 no cumplirá el plan del turno?' → 'La Pala 4 tiene una detención no programada de 45 mins. Rendimiento proyectado: 85%.'"
22. "Democratización del Dato: Interfaz basada en LLM (Gemini) anclada a la realidad física. Cero alucinaciones. Elimina la necesidad de dashboards complejos."
23. "Interacción 2 — Gemelo Digital 3D (Aware): Conciencia Situacional Total con mapas de calor de velocidades, Material Tracking en tiempo real, Topografía inferida cada 15 min"
24. "Interacción 3 — Gestión por Excepción: 'La mina te llama cuando te necesita.' Alerta Crítica ejemplo: Camión CA-233 descargando lastre en Chancador (SENSOR_DATA: CA-233_LOC>CHANCADOR | MATERIAL=LASTRE | VIOLATION=TRUE)"
25. "Tipos de alertas push: Alerta de Destino Incorrecto, Riesgo Geotécnico (personas en zonas rojas), Desviación de Plan (pala fuera de polígono)"
26. "User Journey Pedro (Jefe de Turno): Problema: manos ocupadas, ojos en el camino, sin acceso a pantallas. Solución: Voz / Radio IP. Impacto: decisión tomada en segundos sin fricción visual. Ejemplo: 'TIM, ¿por qué está parada la Pala 4?' → 'Falla hidráulica. Según SAP, operativa en 15 minutos.'"
27. "User Journey María (Gerente Mina): Contexto: remoto, desconectada de la operación minuto a minuto. Solución: Push Notification / WhatsApp. Impacto: control estratégico y gestión de riesgos desde cualquier lugar. Ejemplo alerta: 'Desviación Crítica: Calidad alimentación Chancador bajo límite. Impacto en recuperación proyectado.'"
28. "User Journey Jorge (Controlador): Contexto: alta presión, decisiones complejas. Solución: Desktop 3D + Simulación (Orchestra). Impacto: de la intuición a la certeza matemática. Ejemplo: 'Simular fin de turno moviendo 2 camiones de Fase Norte a Sur' → 'Mover 2 camiones genera colas en Chancador. Recomendación: Mover 1.'"
29. "Impacto en el Negocio: Predictibilidad es Rentabilidad — tres pilares: Adherencia al Plan (60%→95%), Productividad (aumento velocidades promedio y reducción tiempos de cola), Seguridad (monitoreo continuo de zonas de riesgo geotécnico)"
30. "'Timining Core transforma la incertidumbre operativa en resultados predecibles.'"
31. "Roadmap Estratégico: H2 2025 — Conciencia Situacional: Material Tracking Integral, Gestión de Extracción, Alertas Geotécnicas"
32. "Roadmap Estratégico: 2026 — Inteligencia Prescriptiva: Proyecto TIM v1 (Recomendaciones), Simulación continua automática"
33. "Roadmap Estratégico: Futuro — Habilitadores de Autonomía: Sensores virtuales para monitoreo de caminos para flotas autónomas"
34. "Visión 2040: El Bucle Autónomo — Mina Digital (Timining) ↔ IA Autónoma Supervisada ↔ Planta Digital, con flujos de datos bidireccionales, Human & Interaction en el centro, Autonomy Core y Adaptive Learning"
35. "'Estamos construyendo la infraestructura para el futuro autónomo. Timining Core es la base hoy para la autonomía de mañana.'"
36. "Integración TIM con SAP para datos de mantenimiento (ejemplo: tiempo estimado de reparación de Pala consultado desde SAP)"
37. "Presentación generada via NotebookLM — uso de herramientas Google AI para materiales internos de estrategia"

## [Visión Futuro _CORE_/Timining_Core_La_Inteligencia_Operacional.pdf]
- Type: platform_strategy / product_architecture
- Date: 2025 (Estrategia de Plataforma 2025)
- Participants: TIMining
- Extracted: 2026-02-16T18:40

### Raw Claims
1. "Timining Core: El Sistema Nervioso Central de la Operación Minera — De la visualización 3D a la Inteligencia Operacional Multimodal — Estrategia de Plataforma 2025"
2. "Arquitectura multimodal del CORE: salidas a Tablet (Visualización en Campo), Control (Monitoreo Multimodal), Radio (Comunicación Crítica), Móvil (Datos en Tiempo Real). Protocolo: Secure TCP/IP, Latencia: Ultra-Low, Integración: Full"
3. "La Paradoja de la Mina Digital: Datos en Milisegundos, Decisiones en Horas. La Fábrica de Datos genera 5 TB/day en Real-time Stream (1,450,234 ms desde Sensors, FMS, IoT). El Cuello de Botella Cognitivo tarda 04:30:00 hrs en análisis con decisión pendiente."
4. "Insight Clave: Generamos terabytes de datos, pero la capacidad humana para procesarlos y encontrar la causa raíz es limitada."
5. "Planificación (Estático): Vive en geometrías y modelos de bloques. Es la intención. Operación (Dinámico): Vive en series de tiempo y caos. Es la realidad. Estos mundos operan como silos."
6. "'Necesitamos transitar hacia una Inteligencia Aumentada.'"
7. "Timining Core: Un Ecosistema Heliocéntrico. Centro: Timining Core (Gemelo Digital). Anillo interior: Capa Cognitiva (Algoritmos, Motor de Inferencia, Sensores Virtuales). Anillo exterior: Canales de Experiencia — Web (Control), Alertas (Push), App (Ejecutiva), Agente IA (Chat)."
8. "El Cambio de Paradigma: Timining Aware nos dio 'ojos' (visualización 3D). Timining Core nos da un 'cerebro' (entendimiento)."
9. "La Promesa: Entregar la información correcta, en el formato correcto, al usuario correcto. El sistema adapta la salida: Alta resolución para control, alertas para supervisión, lenguaje natural para análisis."
10. "El Motor Matemático: La Fuente Única de Verdad. Tres componentes: (1) Inferencia Topográfica: Generación de superficie basada en densidad GPS (sin drones). (2) Material Tracking: Conciliación espacial automática (Polígonos vs. Trayectorias). (3) Sensores Virtuales: Conversión de coordenadas en métricas de negocio."
11. "Detrás de cada interacción existe un Gemelo Digital Dinámico (TRL 9) que fusiona la planificación con la operación en tiempo real. No es una simulación; es una validación matemática de la realidad."
12. "El Gemelo Digital está en TRL 9 (Technology Readiness Level 9 = sistema probado en entorno operacional real)"
13. "Canal 1 — Control Operacional: Alta Resolución. Usuario: Despachador / Jefe de Sala. Necesidad: Conciencia Situacional Total. Este usuario orquesta el ritmo de la mina minuto a minuto. Requiere máxima granularidad."
14. "Canal 1 features: Monitoreo de Subprocesos (Carguío y Transporte en tiempo real), Heatmaps de Velocidad (Detección visual de cuellos de botella), Actualización segundo a segundo para decisiones tácticas"
15. "Interfaz TIM Insight Engine para Despachador muestra: Performance (399,503t / 384,680t), Availability 72%/97%, métricas de Loading/Hauling detalladas, Tonnage, Availability, HangTime"
16. "Canal 2 — Gestión Proactiva: El Silencio es Oro. Usuario: Supervisor de Terreno / Jefe de Turno. Necesidad: Gestión por Excepción. El usuario está en terreno. No puede mirar pantallas. El sistema vigila silenciosamente y notifica solo cuando es crítico."
17. "Canal 2 Use Cases: Geotecnia (Riesgo de taludes), Compliance (Pala operando fuera de polígono), Seguridad (Interferencia vertical en bancos). Ejemplo: 'Alerta Crítica Geotécnica: Camión CA-98 ingresando a zona de riesgo activo (Fase 4).'"
18. "Canal 3 — Visión Estratégica: El Pulso del Negocio. Usuario: Gerente de Mina / Superintendente. Necesidad: Movilidad y Síntesis. Visión de Semáforo para decisiones de alto nivel: ¿Vamos a cumplir el plan del día? ¿Es la operación segura hoy?"
19. "Executive App muestra dashboard tipo semáforo: Adherencia al Plan 92% (Verde), Producción Turno 145kt (Amarillo), Alertas Seguridad 0 (Verde). Valor: Portabilidad inmediata entre reuniones. Sin reportes estáticos en PDF."
20. "Canal 4 — TIM Insight Engine: Conversando con la Mina. Usuario: Ingeniero de Planificación / Análisis. Necesidad: Profundidad sin Barreras. Democratizar la analítica avanzada."
21. "Canal 4 permite pasar del '¿Qué pasó?' al '¿Por qué pasó?' usando lenguaje natural y configurando el sistema sin saber programar"
22. "Ejemplo TIM Canal 4: '¿Por qué bajó la producción de la Fase 4 en las últimas 2 horas?' → 'Hubo una detención no programada de la Pala P-10 (45 mins) y un aumento en las colas del Chancador.' → 'Configura una alerta si la cola supera los 5 camiones.' → 'Alerta configurada.'"
23. "TIM permite configurar alertas operacionales vía lenguaje natural sin intervención técnica"
24. "Cerrando la Brecha: El Futuro de la Operación Conectada. Sincronización Total: Plan Minero + Realidad Operativa."
25. "'Timining Core no es software, es la validación matemática de la realidad.'"
26. "Evolución en tres fases: Ayer: Visualización (Ver) → Hoy: Ecosistema Multimodal (Entender) → Mañana: Prescripción y Autonomía (Actuar)"
27. "Documento etiquetado como 'Editorial Engineering' — generado via NotebookLM para comunicación interna de estrategia de plataforma"

---

## [sesiones-idemax/reunion_camila_2026-02-17.md] 🏢 INTERNAL
- Type: transcript (Granola format — AI summary + embedded transcript)
- Date: 2026-02-17
- Participants: Niklas Lundin (UX Lead), Camila Bonilla (UX Researcher), Hugo Muñoz, Alejandro Guzzoni
- Authority: internal
- Preprocessed: yes (Pass A: speaker detection; Pass B: phonetics; Pass C: segmentation)
- Extracted: 2026-02-24T10:30

### Raw Claims
1. "Nicolás traspasará casos de uso, pilares de diseño y mockups a presentación principal con referentes visuales por cada etapa del flujo (detección, análisis, recomendación)" [INTERNAL]
2. "Se agregarán 2 casos de uso nuevos: optimización del plan minero y reportería CFO" [INTERNAL]
3. "Workshop jueves presencial 10:00-12:00 en TIMining — asistirán Nicolás y Camila" [INTERNAL]
4. "Estrategia post-aprobación: desarrollar manual UX con reglas específicas por pilar — qué significa cada pilar en términos concretos y guidelines para validación con usuarios reales" [INTERNAL]
5. "Referentes por flujo: Detección = consola cromática con glow externo para alertas (referencia SpaceX); Análisis = proyección temporal de impactos (45 min hasta bloqueo chancador); Recomendación = opciones rankeadas con impacto de tonelaje cuantificado" [INTERNAL]
6. "Principios de diseño identificados: Clear Path (máx 3 recomendaciones, mínimos clics), Quiet UI (colores solo para anomalías), Time Sight (visualización de futuro y proyecciones), priorización numérica esencial vs. solo paleta de colores" [INTERNAL]
7. "Gap crítico: decisiones se toman fuera del software — comunicaciones por radio no quedan registradas en sistema — pérdida de conocimiento entre jefes de turno" [INTERNAL]
8. "Urgente vs. importante como capacidad clave: Pedro arregla el camino (output previsible) vs. Juan manda camiones por otro camino y mitiga 30% más (impacto al plan). El software debe priorizar lo importante de cara al plan, no solo lo urgente visible" [INTERNAL]
9. "Evolución estratégica en 3 fases: 1) Cumplimiento del plan (estado actual), 2) Optimización del plan en tiempo real (visión futura), 3) Anticipación proactiva basada en aprendizaje histórico" [INTERNAL]
10. "Oportunidad de repricing: de $300K a $450K anuales si se demuestra valor generado vs. precio cobrado — no hay correlación actual entre valor agregado y pricing" [INTERNAL]
11. "Transición de 7 productos fragmentados a plataforma core unificada — riesgo de fragmentación tecnológica actual" [INTERNAL]
12. "Adopción dual necesaria: bottom-up (>100 usuarios activos post-piloto) + top-down (decisión la toma BHP en Canadá, no la mina local)" [INTERNAL]
13. "Validación con usuarios finales crítica pero pendiente — no hay entrevistas programadas con jefes de turno reales — riesgo de diseñar basado solo en percepción interna" [INTERNAL]
14. "Propuesta para gap de validación: entrevistar ex-empleados que ahora trabajan en clientes" [INTERNAL]
15. "Confusión temporal en sistema actual: datos con delays de 15, 30, 45 minutos — usuarios no entienden qué está actualizado vs. histórico" [INTERNAL]
16. "6 meses de consultoría por proyecto indica producto complejo — usuarios no adoptan herramientas por dificultad de uso" [INTERNAL]
17. "Sistema omnisciente futuro: analiza situación completa cada X minutos, percibe todo, escala solo lo relevante — evolución hacia machine-to-machine communication" [INTERNAL]
18. "Sistema aprende de decisiones expertas: jefe de turno rechaza opciones A, B, C y elige D → sistema aprende → eventualmente sugiere D como primera opción → democratización del conocimiento experto" [INTERNAL]
19. "Incentivos alineados: reconocimiento individual por performance, visibilidad de logros para jefatura, bonificaciones por superar plan no solo cumplirlo" [INTERNAL]
20. "23 insights extraídos de documentos TIMining — rankeados por relevancia y fuentes — Geometry gap y efecto Suiza validados como diferenciales" [INTERNAL]
21. "4-5 densidades de uso radicalmente distintas entre perfiles — interfaz estática actual no se adapta a contextos — oportunidad de detección automática de rol/ubicación" [INTERNAL]

### Action Items (reference only — not forwarded to /analyze)
- Niklas traspasa casos de uso y pilares a presentación principal antes del workshop
- Reunión de revisión al día siguiente en la tarde (30 min, remoto)
- Workshop presencial jueves 10:00-12:00 en TIMining (Niklas + Camila)
- Desarrollar manual UX post-aprobación con guidelines por pilar


---

## [sesiones-idemax/session-align-con-camila(wed18feb).md] 🏢 INTERNAL
- Type: transcript (Granola format — per-turn speaker labels)
- Date: 2026-02-18
- Participants: Niklas Lundin (UX Lead, Me), Camila Bonilla (UX Researcher, Them)
- Authority: internal
- Preprocessed: yes (Pass A: Me→Niklas/Them→Camila; Pass B: phonetics; Pass C: sentence repair)
- Extracted: 2026-02-24T10:30

### Raw Claims
1. "Camila no tiene acceso a la presentación HTML de Niklas — 'estoy totalmente a ciegas' — el equipo externo no puede colaborar en el documento principal" [INTERNAL]
2. "La presentación HTML genera una 'pared invisible' de colaboración: funciona para presentar pero no para editar en conjunto" [INTERNAL]
3. "Camila solicita que el material esté en formato editable (Google Slides/PowerPoint) para que TIMining pueda compartirlo internamente y el equipo IDEMAX pueda colaborar" [INTERNAL]
4. "Niklas plantea que la presentación HTML se podría convertir a PPT y que el template de HTML permite cambios globales de color con un solo cambio — ventaja de eficiencia" [INTERNAL]
5. "Plan acordado: mostrar workshop desde link HTML, luego traspasar a PowerPoint post-workshop como entregable final" [INTERNAL]
6. "La presentación tiene 8 casos de uso: casos 1-6 (mundo actual donde Core no existe) + casos 7-8 (cuando Core ya existe — nivel 'extra mile')" [INTERNAL]
7. "Caso 7: Optimización del plan minero — decisión estratégica mensual — 'La fase sur lleva 3 semanas rindiendo a bajo plan por problema técnico geológico; Core ayuda a tomar decisión de llevar plan al +8%'" [INTERNAL]
8. "Caso 8: Reportería ejecutiva CFO — 'en reunión de directorio alguien pregunta cómo va la operación, datos en diferentes sistemas, no unificados — bottom line: respuesta en su idioma financiero en su bolsillo'" [INTERNAL]
9. "DAR (Detección-Análisis-Recomendación) como patrón visual transversal: siempre rojo→amarillo→azul, aplicado en cada caso de uso y en la línea inferior de la presentación" [INTERNAL]
10. "TimeSight no es solo mirar al futuro — cubre pasado/presente/futuro: '¿qué pasó atrás? ¿cómo estoy? ¿qué podría pasar?'" [INTERNAL]
11. "Slide 20 (Carlos's NorthStar): cada X minutos el sistema analiza la situación, realiza simulaciones buscando óptimo global, genera replanificación, primero a personas luego a máquina — 'mina 5.0, 2040'" [INTERNAL]
12. "Camila identifica que los insights deben mostrarse con su peso de evidencia (fuentes, veces mencionado) para dar credibilidad — 'la caja negra explicada'" [INTERNAL]
13. "Camila preocupada por referencias internas (número de slides, nombres internos) que se filtraron en la presentación — deben removerse antes del workshop externo" [INTERNAL]
14. "Niklas trabaja con Gemini para generar y editar presentación — el flujo de IA no estructurado consume mucho más tokens — necesita flujo ordenado" [INTERNAL]
15. "Keep/Stop/Start framework del workshop: Keep = eliminar grasa operacional, Stop = dejar de hacer o repensar, Start = inteligencia / lo que el usuario no sabe que necesita" [INTERNAL]
16. "Benchmark de Quiet UI incluye: CrowdStrike (90-95% gris oscuro, se ilumina solo en alerta crítica), SpaceX Dragon (UI funcional bajo presión máxima), Morib logística (filtra 99% de falsas alertas)" [INTERNAL]
17. "Clear Path benchmark: Sentinel One Purple AI (agente IA para DAR), Vercel (guía hacia objetivo), Datadog (módulo AI proactivo que dice 'esto se puede arreglar así')" [INTERNAL]
18. "Camila sobre validación: 'En una entrevista con usuario final no podemos hacer inception de paz mental — necesitamos que él nos lo diga, no contaminarlo con el concepto'" [INTERNAL]
19. "Tres componentes del valor validado: 1) paz mental/tiempo, 2) detecta-analiza-recomienda, 3) experiencia iPhone-like para B2B — simple, intuitivo, adherente" [INTERNAL]
20. "Hub de decisiones: decisiones deben tomarse EN la plataforma, no fuera — si se hace por radio, el sistema debe 'escuchar' la radio y registrar la decisión" [INTERNAL]
21. "Urgente vs. importante como directriz estratégica: a veces el urgente no es lo importante — el jefe de turno debe poder distinguirlos desde la plataforma" [INTERNAL]
22. "Propuesta de valor de TIMining Core: toma visión estratégica + principios + dominios + casos de uso + perfiles — 'con este sello'" [INTERNAL]

### Action Items (reference only — not forwarded to /analyze)
- Niklas: limpiar referencias internas de slides (números, nombres)
- Niklas: agregar insights con peso de evidencia (veces mencionado por fuente) en slide introductoria
- Niklas: mover slide 9 del workshop al inicio de la presentación como recordatorio de contexto
- Niklas: mover Keep/Stop/Start antes del benchmark como enlace entre visión y pilares
- Ambos: traspasar presentación a PowerPoint post-workshop para entregable editable
- Niklas: dar acceso link de presentación a Camila para revisión colaborativa


---

## [Touchpoint 1/Touchpoint_TIMining-IDEMAX _2026-02-19.md]
- Type: touchpoint / milestone review (primera sesión formal IDEMAX + TIMining stakeholders)
- Date: 2026-02-19
- Participants: Philip Whatmore (CEO TIMining), Carlo Calderón (CTO TIMining), Camila Bonilla (IDEMAX), Niklas Lundin (IDEMAX), Ana Gómez (TIMining), Alejandro Guzzoni (IDEMAX)
- Authority: primary
- Preprocessed: yes (Pass A: content-based segmentation 14 transitions; Pass B: phonetics; Pass C: sentence repair)
- Extracted: 2026-02-24T10:30

### Raw Claims
1. "[Niklas] Objetivo de la sesión: mostrar primeras definiciones derivadas de entrevistas internas y workshop — validar con stakeholders — si dedito arriba, siguiente paso es validar con clientes" 
2. "[Camila] Metodología: 54 fuentes analizadas (archivos Philip, archivos Carlos, workshop, post-its, transcripts, reuniones) — 6 insights clave emergieron por repetición con peso de evidencia por fuente"
3. "[Niklas] Próximo paso urgente: entrevistas con usuarios finales — 5-7 entrevistas de 30 minutos con perfiles de mayor uso — 'si no estamos en el cielo tocando tierra'"
4. "[Niklas] Patrón keep: valores funcionales que tienen experiencia y hay que seguir reforzando — simplicidad y rapidez, claridad en proceso, control de operación, certeza de datos"
5. "[Niklas] Patrón stop: muchos datos que se muestran sin requerir acción — confunde y satura — tirar a la basura no, pero repensar cómo se hace"
6. "[Niklas] Patrón stop: capacitaciones extensas — la solución llega cuando el problema ya pasó — no directamente relacionada a acción"
7. "[Niklas] Tercer gap: desconexión mina-planta — información de distintas fuentes — reporting sin valor real — operación y finanzas no se hablan como TIMining podría articular"
8. "[Niklas] 6 insights validados: 1) gestión por excepción (silencio como default), 2) cada pantalla termina en acción, 3) sistema alcanza al usuario (no al revés), 4) medir valor real por decisión para mejorar pricing, 5) [incomplete — continúa], 6) experiencia iPhone-like para B2B"
9. "[Niklas] Mantra operativo TIMining: el valor no reside en la solución técnica sino en generar paz mental — el sistema asegura certeza de datos, anticipa, recomienda"
10. "[Philip] Sobre 'paz mental': el concepto puede ser correcto pero el nombre es muy abstracto — prefiere algo más relacionado con tiempo/eficiencia — 'te facilito el trabajo'"
11. "[Philip] 'Mi cliente no es tecnología — mi cliente es el Excel' — la venta debe centrarse en outcomes y procesos familiares, no en capacidades técnicas"
12. "[Philip] Preocupación por validación: 'No podemos hacer inception de paz mental en entrevista — necesitamos que el usuario lo diga por sí mismo, no contaminarle el concepto'"
13. "[Philip] Oportunidad de pricing: '¿de qué manera vendo algo de $450K?' — necesita demostrar valor concreto medible por decisión tomada"
14. "[Philip] Contexto datos: 'Cuando yo pregunto cuál es la velocidad del camión rápido — Three básicamente — si lo tenéis los datos...' — confianza del 98% cuando los datos están disponibles"
15. "[Philip] Plan minero corto plazo vs. largo: 'Nosotros estamos en corto plazo — plan minero de largo plazo tiene otra ciencia' — TIMining ayuda indirectamente en optimización de corto"
16. "[Philip] GPS decandadas (degradadas): 'Saben que tienen problemas de datos — están decandadas las GPS' — dato calidad como problema reconocido"
17. "[Carlo] 'Doy un paso atrás — el Core es lo que tengo que trabajar' — CTO reconoce Core como plataforma central que debe construirse"
18. "[Carlo] Concepto iceberg: 'nuestra tecnología es mucho más que un visor — integración de datos es valioso — la validez del dato' — diferenciador vs. competidores"
19. "[Carlo] 60 reglas de negocio de ifs: dispatching, cambio de turno, secuencias de salida — lógica operacional propietaria que ya existe en TIMining"
20. "[Carlo] Motor adicional integrado: 'Yo lo integro con un motor adicional' — posibilidad de integrar cálculo de IDEMAX con motores existentes de TIMining"
21. "[Carlo] WhatsApp es el canal más usado para decisiones operacionales en minería (Anglo): 'impresionante la cantidad de toma de decisiones que ocurren día a día en la operación, vía WhatsApp'"
22. "[Carlo] Información crítica de operación vive en WhatsApp, no en el software — TIMining pierde el 90% de la información si no integra ese canal"
23. "[Carlo] Visión: ser agnósticos al canal — 'si una mina usa full WhatsApp, se mete ahí; si usa Discord, también' — plataforma que captura decisiones cualquiera sea el canal"
24. "[Carlo] Tensión de adopción: planificación usa TIMining para auditar a operadores — operadores resisten la herramienta — 'si no logramos vender al operador, estamos acá afuera'"
25. "[Carlo] 'Movimiento en Brasil' amenazando posición de mercado de TIMining — señal de presión competitiva"
26. "[Carlo] Diferenciador técnico real: motores de cálculo + motores de reglas de negocio que validan AI — 'hacen que no alucine' — esto es lo que convierte AI genérica en recomendador confiable"
27. "[Philip/Carlo] Estrategia de pricing modular interna: cada nueva funcionalidad por cliente tiene costo — 'si te meto una nueva cajita, te la desarrollo, pero tiene un precio también' — necesitan establecer esto formalmente"
28. "[Philip] Problema histórico: clientes piden cambios custom (ej. cambiar color de camiones) — TIMining desarrolla sin cobrar extra — nunca formalizaron pricing diferencial"
29. "[Philip] Propuesta 'Un cerebro': no quieren múltiples consultores/guías — prefieren una sola capa inteligente"
30. "[Niklas] Pilar 1 — Quiet UI: silencio como estado default — alertas/colores/sonidos solo para anomalías y decisiones requeridas — clasificar eventos antes de mostrar"
31. "[Niklas] Benchmark Quiet UI: CrowdStrike (90-95% gris oscuro), SpaceX Dragon (UI funcional bajo presión extrema), Morib logística (filtra 99% falsas alertas)"
32. "[Niklas] Pilar 2 — Clear Path: cada pantalla termina en acción — detección→análisis→recomendación — benchmark: Sentinel One Purple AI, Vercel, Datadog"
33. "[Niklas] Pilar 3 — TimeSight: tres capas temporales en misma vista — pasado/presente/futuro — permite al usuario saber qué pasó, cómo va ahora, qué podría pasar"
34. "[Niklas] Pilar 4 — OmniSense: sistema alcanza al usuario según contexto y canal — 'uno no va a buscar al sistema, el sistema te encuentra' — información en canal correcto (radio, WhatsApp, dashboard)"
35. "[Philip/Carlo] Cuestionamiento al benchmark Quiet UI: '¿por qué el problema de saturación de alertas lo resolvería la UI? — ese problema no lo resuelve la UI, lo resuelve el sistema' — respuesta: ambos son necesarios, se complementan"
36. "[Niklas] Conexión pilares: Quiet UI → Clear Path (el silencio se rompe cuando hay un camino claro), Clear Path → TimeSight (anticipa 45 min antes el bloqueo del chancador), TimeSight → OmniSense (canal correcto en horizonte temporal)"
37. "[Niklas] Los pilares son los 'sentidos del sistema': oído (silencio/ruido), vista (claridad/detección), profundidad (perspectiva temporal), tacto (presencia/canal)"
38. "[Philip/Carlo] Validación de insights del workshop: confirman que los 6 insights capturados reflejan lo que se discutió — 'No, claro, esto es Workshop' — alineación"
39. "[Niklas] Propuesta Skynet (NorthStar): cada X minutos el sistema analiza, simula, optimiza globalmente, genera replanificación — primero a personas, luego machine-to-machine — 'mina 5.0, 2040'"
40. "[Camila/Philip] Debate 'paz mental': el término puede generar resistencia — Philip sugiere orientarlo a facilitación de decisiones con mejor información — 'ayudarlo a tomar la mejor decisión'"
41. "[Philip] Para las entrevistas de validación: Philip tiene contactos de usuarios en minas — puede facilitar acceso — 'nosotros tenemos identificados ciertos perfiles que son los que más usan la plataforma'"
42. "[Session outcome] Dedito arriba implícito en pilares y DAR — equipo alineado en continuar a entrevistas con usuarios reales"

## [Touchpoint 1/_FIELD_NOTES.md] 🏢 INTERNAL
- Type: field_notes
- Date: 2026-02-19
- Observer: Nico Lundin (IDEMAX researcher)
- Source: Touchpoint 1/Touchpoint_TIMining-IDEMAX _2026-02-19.md
- Extracted: 2026-02-24T22:30

### Raw Claims
1. "Los 4 pilares de diseño de CORE (Quiet UI, Clear Path, Time Sight, Omni Sense) fueron presentados a Philip (CEO) y Carlo (CTO) en el Touchpoint 19-feb — validados sin objeciones estructurales" (Confidence: high) [INTERNAL]
2. "Carlo cuestionó si Quiet UI es solo diseño de interfaz o también sistema de filtrado — la resolución fue que ambas capas se complementan: UI + sistema" (Confidence: high) [INTERNAL]
3. "Quiet UI: absorber complejidad visual, mostrar solo lo que importa, gestión por excepción, alertas legibles en <5 segundos — requiere dos capas: sistema de filtrado inteligente + interfaz que presenta solo lo relevante" (Confidence: high) [INTERNAL]
4. "Clear Path: reducir fricción cognitiva, flujos lineales sin bifurcaciones innecesarias, cada pantalla tiene una acción principal clara — el patrón D→A→R es la columna vertebral de toda interacción" (Confidence: high) [INTERNAL]
5. "Time Sight: habilitar predicción temporal, dar visibilidad al futuro operacional (qué va a pasar, cuándo, qué hacer al respecto), timelines predictivos, alertas con tiempo estimado de impacto — transforma reacción en anticipación" (Confidence: high) [INTERNAL]
6. "Omni Sense: unificar canales sensoriales — un mismo dato llega en múltiples formas (dashboard, WhatsApp, alerta sonora, email) según contexto del usuario" (Confidence: high) [INTERNAL]
7. "Los 4 pilares forman un sistema encadenado: Quiet UI filtra → Clear Path guía → Time Sight anticipa → Omni Sense distribuye — el output de uno es input del siguiente" (Confidence: high) [INTERNAL]
8. "Quiet UI y Omni Sense son capas de 'cómo se presenta'; Clear Path y Time Sight son capas de 'qué se presenta'" (Confidence: high) [INTERNAL]

---

## [Touchpoint 1/TIMining-CORE-Presentacion-Light_compressed.pdf]
- Type: presentation
- Date: 2026-02-19
- Participants: Niklas (UX Lead IDEMAX), Camila (UX Researcher IDEMAX), Philip (CEO TIMining), Carlo (CTO TIMining)
- Preprocessed: no
- Extracted: 2026-02-25T00:00

### Raw Claims

**Del Workshop — Entendimiento Común (p02)**
1. "KEEP: Simplicidad de la experiencia, Rapidez de respuesta, Claridad del proceso, Control operacional, Certeza de datos, Seguridad primero — estos son los 6 valores que el equipo TIMining quiere preservar"
2. "STOP / SOBRECARGA: data dumping (mostrar todo), KPIs repetidos en múltiples pantallas, visualización 3D cosmética (95% sin acción), alertas que no requieren respuesta"
3. "STOP / FRICCIÓN: configuración larga y costosa por cliente, capacitaciones largas antes de uso, solución que llega tarde (no en el momento del problema)"
4. "STOP / DESCONEXIÓN: silos entre mina, planta y chancado, decisiones tomadas por radio sin registro, reportes que llegan después de que la ventana de acción cerró"
5. "START: silencio como default (solo excepción rompe el silencio), copiloto proactivo (sistema llega al usuario), cada pantalla termina en una acción concreta, sistema te alcanza por WhatsApp / radio / IROC según contexto"
6. "START: medir el valor en USD por decisión — no en tonelaje, no en métricas de ingeniería"

**Insights Clave validados con TIMining (p03)**
7. "PAZ MENTAL: convergencia 25/54 fuentes — el insight de mayor frecuencia en toda la investigación"
8. "GEOMETRY GAP: convergencia 15/54 fuentes — brecha entre plan minero y realidad topográfica"
9. "DE DASHBOARD A COPILOTO: convergencia 12/54 fuentes — el sistema debe venir al usuario, no al revés"
10. "PERFILES DIFERENCIADOS: convergencia 12/54 fuentes — diferentes roles requieren diferentes interfaces"
11. "DEMASIADO RUIDO: convergencia 10/54 fuentes — sobrecarga de información como principal obstáculo de uso"
12. "VALOR 'IPHONE-LIKE': simplicidad + impacto percibido — el producto debe sentirse premium y simple simultáneamente"

**Visión Estratégica (p04)**
13. "'El salto de modelo': de Kiosco (el usuario va al sistema) a Médico Operacional (el sistema viene al paciente con el diagnóstico listo)"
14. "D→A→R (Detección → Análisis → Recomendación) es el patrón único validado en los 8 casos de uso del workshop"
15. "Valor percibido: 'iPhone-like B2B' — simplicidad de consumo + impacto de herramienta industrial. Ticket objetivo USD 450K+"
16. "'Medir valor en USD por decisión' como fundamento del pricing — cada recomendación tiene un delta financiero cuantificable"

**Pilares de Diseño (p05)**
17. "Quiet UI responde la pregunta del operador: '¿Necesito prestar atención?' — si no, silencio total"
18. "Clear Path responde: '¿Qué debo hacer?' — respuesta directa, termina en acción"
19. "Time Sight responde: '¿Por qué pasó y qué viene?' — rebobinar + anticipar"
20. "Omni Sense responde: '¿Dónde y cómo me llega?' — agnóstico al canal, llega donde está el usuario"
21. "Cada pilar está validado por benchmark inter-industria — no son principios internos sino patrones observados en los mejores productos del mundo"

**Sistema Sensorial y Conexión de Pilares (p06)**
22. "Los 4 pilares forman un sistema sensorial: Quiet UI = Oído (filtra el ruido), Clear Path = Vista (focaliza la atención), Time Sight = Profundidad (perspectiva temporal), Omni Sense = Tacto (distribuye por canal adecuado)"
23. "'Los pilares no operan aislados — forman un sistema sensorial. Cada pilar alimenta al siguiente.'"
24. "Conexión inter-pilar formal: Quiet UI filtra lo que no importa → Clear Path muestra qué hacer → Time Sight contextualiza con pasado y futuro → Omni Sense entrega en el canal correcto"

**Benchmark (p07-p12)**
25. "25 referentes únicos de 15 industrias distintas — minería, aviación, salud, finanzas, defensa, movilidad autónoma, ciberseguridad, SaaS, telecomunicaciones"
26. "Quiet UI champions: CrowdStrike Falcon (anomaly-only alerting), SpaceX Dragon HMI (gestión compleja en silencio), Motive (fleet management con excepción visual)"
27. "Clear Path champions: SentinelOne Purple AI (respuesta directa en lenguaje natural), Vercel v0 (texto listo para acción), Datadog Bits AI (recomendación proactiva)"
28. "Time Sight champions: Tesla Fleet (Time Scrubbing — rebobinar incidentes para causalidad exacta), SentinelOne Storylines (reconstrucción forense narrativa), Chronosphere Lens (retención temporal ajustable durante incidentes activos)"
29. "Omni Sense champions: Motive (voz + cámaras + telemática integrada, Edge AI en terreno), Discord (canales de voz activos, Push-to-Talk para triage de radio), Samsara (push proactivo multicanal)"
30. "8 casos de uso mapeados a pilares y referentes D/A/R — cada caso tiene un 'referente por etapa'"

**Arquitectura de Dominios Operativos (p13)**
31. "4 dominios operativos: A=Respuesta a Crisis (6 escenarios), B=Anticipación Operativa (4 escenarios), C=Asistencia Inteligente (5 escenarios), D=Alineación Estratégica (3 casos + 2 síntesis)"
32. "Mapping pilar → dominio: Quiet UI lidera Dominio A, Time Sight lidera Dominio B, Omni Sense lidera Dominio C, multi-pilar lidera Dominio D"

**Caso #1 — Caída de Equipo Crítico (p14-p15)**
33. "Caso #1 (Dominio A, Respuesta a Crisis): Despachador IROC, Supervisor Turno, Jefe Turno. D=sistema detecta KPI flota, A=cruza plan de turno e historial mantenimiento para evaluar riesgo cascada, R=reasignación rankeada con tiempo estimado de impacto"
34. "Pilares Caso #1: Quiet UI (alerta solo cuando importa) + Clear Path (reasignación rankeada, acción directa)"

**Caso #2 — Riesgo Espacial y Seguridad (p16-p17)**
35. "Caso #2 (Dominio A+C): fusión ARIS + GPS + prismas geotécnicos. D=falla de prisma detectada, A=cruza GPS autónomos con estabilidad de terreno, R=alerta zona de riesgo + reasignación automática propuesta"

**Caso #3 — Anticipación de Cuello de Botella (p18-p19)**
36. "Caso #3 (Dominio B): Time Sight como pilar principal para anticipar cuello de botella en chancado antes de que ocurra, no después — anticipación proactiva vs. respuesta reactiva"

**Caso #4 — Briefing Inteligente (p20-p21)**
37. "Caso #4 (Dominio C): sistema alcanza a Sofía (Supervisor IROC) por WhatsApp 15 min antes del turno — el canal correcto para alguien en movimiento"
38. "Briefing proactivo: tronadura -20%, 5 camiones parados, 2 riesgos identificados, priorización objetiva contra plan. 'Llega listo, no el raw data.'"
39. "Omni Sense + Time Sight: el sistema no espera que el supervisor abra la app — llega al canal donde ya está el usuario (WhatsApp, no portal web)"

**Caso #5 — Copiloto en Terreno (p22-p23)**
40. "Caso #5 (Dominio C): Jefe de Turno en berma con radio saturada de 3 solicitudes simultáneas. Normas Sernageomin en PDF en oficina a 20 min. Manos en volante y radio. No hay cómo consultar, priorizar ni responder en paralelo."
41. "'No necesita un manual — necesita una respuesta directa, manos libres.'"
42. "D (Caso #5): consulta por voz + foto. Sistema recibe por el canal disponible (voz, imagen, texto). Radio transcrita automáticamente, solicitudes identificadas y en cola."
43. "A (Caso #5): cruce instantáneo con normativa Sernageomin vigente + prevención de riesgos + procedimientos de faena. 3 solicitudes priorizadas por urgencia con contexto suficiente."
44. "R (Caso #5): 'Cumple' o 'Regulariza así: [pasos concretos]'. Cola ordenada. Problema resuelto = silencio. Sin re-alertar. Manos libres de principio a fin."
45. "Edge AI en terreno: procesamiento local sin depender de conectividad de oficina"

**Caso #6 — Análisis Plan vs Realidad (p24-p25)**
46. "Caso #6 (Dominio D): Gerente de Mina en cierre semanal. Autónomos se detuvieron 14 veces el fin de semana. Respuesta repartida en 4 sistemas: posicionamiento, log antenas, reporte alimentación planta, historial mantención."
47. "'No necesita más datos — necesita la cadena causal completa en una sola vista.'"
48. "D (Caso #6): alerta de brecha continua — no espera al cierre mensual. Gap plan-realidad detectado mientras ocurre. '¿Por qué?' ya respondida antes de que alguien la haga."
49. "Time Scrubbing (Caso #6): rebobinar hasta el momento exacto del primer desvío. Cadena causal: antena descalibrada → posicionamiento incorrecto autónomos → alimentación errática a planta → recuperación baja. Todo en una vista."
50. "R (Caso #6): ajuste cuantificado por intervención. 'Cuánto cuesta no corregirlo esta semana' como métrica de decisión."

**Transición Casos 1-6 / 7-8 / Horizonte (p26)**
51. "Casos 1-6 = CUMPLIR EL PLAN (D-A-R en incidentes de turno + anticipación + asistencia). La base. Sin esto, no hay plataforma."
52. "Casos 7-8 = OPTIMIZAR EL PLAN (D-A-R en decisiones estratégicas). 'CORE ya existe y funciona. La pregunta es: ¿qué más puedo hacer con esto?'"
53. "Horizonte = CEREBRO AUTÓNOMO: CORE como sistema nervioso central de la mina — percibe, decide y actúa sin intervención humana. Machine-to-Machine con equipos, sensores y sistemas."

**Caso #7 — Optimización del Plan Minero (p27-p28)**
54. "Caso #7 (Dominio D): Fase Sur lleva 3 semanas rindiendo bajo plan — no incidentes, sino modelo geológico incorrecto. El plan se hizo hace 3 meses. Nadie lo cuestiona porque es 'el plan'."
55. "'No necesita corregir un turno — necesita reconfigurar el plan.'"
56. "Origen Caso #7: síntesis de evidencia de múltiples fuentes y motor Orchestra — no proviene directamente de láminas del workshop."
57. "D (Caso #7): patrón estructural — Fase Sur rindió bajo plan 18 de 21 últimos turnos. Divergencia cuantificada: dureza de roca 15% sobre proyección del modelo geológico."
58. "A (Caso #7): Orchestra simula 4 configuraciones de secuenciación de fases para próximas 4 semanas. No 'qué hacer hoy' sino 'qué patrón adoptar'. Evaluado contra datos geológicos actualizados — no el plan de hace 3 meses."
59. "R (Caso #7): concentrar 60% extracción en Fase Norte semanas 5-8. Recuperación proyectada +8% vs trayectoria actual. Impacto USD 4.2M en el mes. El plan se actualiza — nueva línea base que todos los turnos heredan."

**Caso #8 — Reportería Ejecutiva (p29-p30)**
60. "Caso #8 (Dominio D): CFO no puede responder '¿cómo va la operación minera?' sin llamar a alguien o abrir software que no entiende. 'La mina puede estar generando millones o destruyéndolos — la persona que reporta al directorio es la última en enterarse.'"
61. "'No necesita acceso a sistemas de operaciones — necesita la respuesta en su bolsillo, en su idioma.'"
62. "Origen Caso #8: Workshop 01 (gap identificado) + Design Brief (Executive App). CFO es 'usuario invisible' — caso aspiracional, no validado con usuario real."
63. "D (Caso #8): notificación automática en teléfono del CFO. 4 KPIs traducidos a dinero. Un solo indicador destacado pide atención. El resto — silencio."
64. "A (Caso #8): un tap → drill-down financiero (qué turno fue el peor, por qué, cuánto costó), comparativa trimestres anteriores, proyección cierre. Legible desde teléfono en reunión."
65. "R (Caso #8): 'Ritmo actual cierra -12%. Con intervención, cierra +3%. Delta: USD 1.8M.' CFO responde sin levantarse de la mesa. 'El software no le pidió que aprendiera minería — aprendió a hablar finanzas.'"

**Horizonte de Evolución (p31)**
66. "'De asistente a sistema nervioso central. La evolución natural del patrón D→A→R.'"
67. "PERCIBE: CORE analiza situación completa cada X minutos — sensores, GPS, clima, despacho, planta — sin intervención humana. El sistema sabe antes que el operador."
68. "DECIDE: corre N simulaciones en paralelo, busca el óptimo global (no el mejor local). 'La experiencia del mejor jefe de turno, corriendo 24/7 sin fatiga.'"
69. "ACTÚA: de sugerencia a instrucción directa — primero a personas, después M2M: CORE habla con dispatch, flota, planta. 'La recomendación se convierte en acción. Sin radio, sin demora.'"
70. "Roadmap evolutivo: HOY (humano decide) → CORTO PLAZO (CORE optimiza y sugiere) → HORIZONTE (CORE ejecuta M2M)"

**Mapa de Definiciones y Siguiente Paso (p32-p33)**
71. "Arquitectura concéntrica validada formalmente: Visión Estratégica → Dominios Operativos → Pilares de Diseño → Patrón D→A→R transversal"
72. "Siguiente paso formal en deck: 'Validar con usuarios reales que los casos y pilares responden a necesidades en terreno'"
73. "Hoja de Ruta 10 semanas: Etapa 1 COMPLETADA (inmersión), Etapa 2 PARCIAL con GAP (falta entrevistas usuarios finales), Etapa 3 EN CURSO (Sem 4 — diseño plataforma), Etapa 4 PENDIENTE (comunicación Sem 9-10)"
74. "Riesgo a mitigar identificado en deck: 'Planificar entrevistas con usuarios finales en mina para cerrar el gap de Etapa 2 antes de avanzar en wireframes definitivos'"
75. "Siguiente paso inmediato en deck: identidad visual CORE (Quiet UI Achromatic) + prototipo 1 caso piloto con flujo D→A→R completo"

