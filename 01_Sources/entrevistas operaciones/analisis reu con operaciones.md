Guía de la fuente
Esta revisión técnica detalla el ecosistema de TIMining, una suite de software minero dividida entre la planificación operativa y el monitoreo geotécnico. Mientras que herramientas como Aware y Orchestra buscan optimizar la eficiencia mediante datos en tiempo real y simulaciones históricas, el conjunto de productos legacy como SIC y Tangram se enfoca en la seguridad estructural y prevención de riesgos. El texto revela un conflicto central entre la alta sofisticación técnica de las plataformas y las barreras de adopción que enfrentan los usuarios debido a la complejidad de las interfaces y la gestión de datos. En última instancia, el documento funciona como un diagnóstico estratégico que subraya la necesidad de equilibrar la personalización excesiva de funciones con una experiencia de usuario más intuitiva y metodológica.











# Reunion con Team Operaciones (revision de productos TImining)
### Visión general del ecosistema de productos Team Mining
- Seis productos demostrados en dos grandes dominios:
- Operaciones y Planificación: Aware, Orchestra, Delta
- Geotecnia y Geología: SIC, Tangram, ARIS
- Aware + Orchestra se venden juntos como solución integrada
- Aware muestra la operación en tiempo real pero solo no puede cuantificar impacto
- Orchestra entrega análisis histórico para justificar el ROI
- Los productos geotécnicos legacy (SIC, Tangram, ARIS) tienen una base de clientes estable y leal a pesar de interfaces más antiguas
### Aware - Tablero de operación minera en tiempo real
- Caso de uso principal: Jefes de turno monitoreando cuellos de botella, curvas lentas, estado de equipos
- Dolor clave: Los tiempos de actualización de datos son confusos para los usuarios
- Camiones se actualizan en tiempo casi real vía GPS
- Mapas de calor: promedio de 3 horas con desfase de 30 minutos
- Indicadores se refrescan cada 30 minutos
- Generación de topografía cada 15 minutos
- Problemas de adopción:
- La capacitación inicial no alcanza para una interfaz con múltiples capas
- Los usuarios abandonan la herramienta cuando no entienden el timing de los datos
- Se perdió un cliente por métricas de extracción a 24 horas que no hacían sentido (los mineros miran por turno)
- Los clientes piden muchas funcionalidades, pero luego les cuesta usarlas bien
### Orchestra - Analítica y simulación para planificación
- Dos módulos: Análisis histórico + simulador de eventos discretos
- Requiere fuerte componente consultivo:
- Los usuarios no tienen tiempo para una curva de aprendizaje compleja
- Team Mining dedica 30–36 horas por caso de renovación para armar casos de estudio
- En 2022: ~600 horas en dos proyectos de consultoría completos
- Proyectos de planificación anual evalúan 20+ escenarios en horizontes de 3 años
- Desafíos del simulador:
- No se ha adaptado bien a camiones autónomos, uso de múltiples rutas, etc.
- Se necesitan usuarios expertos para usar “trucos” y workarounds complejos
- Es muy potente pero requiere bastante conocimiento metodológico
- Base de clientes: ~16 minas usan Orchestra vs ~6–7 que usan Aware
### Delta - Calculadora de conciliación
- Herramienta rápida de conciliación topográfica (resultados en menos de 1 minuto)
- Tres módulos: Compliance, Mesh Builder, Batches
- Estrategia de adopción a nivel corporativo:
- CODELCO, Grupo México, Equinox Gold lo usan en todas sus operaciones
- Estandariza la conciliación entre distintos softwares de planificación de mina
- Suele ser la puerta de entrada para vender otros productos
- Funciona de forma independiente del resto de productos
- Usuarios: Planificadores y geólogos para conciliaciones de período (diario/mensual/anual)
### SIC - Monitoreo de cumplimiento geotécnico
- Evaluación de cumplimiento banco por banco (ancho de berma, ángulo, parámetros de seguridad)
- Base de datos histórica con trazabilidad de todos los ajustes
- Alta autonomía del usuario comparado con Orchestra
- Análisis de perfiles cada 5 metros, comparando diseño vs resultado real
- Visualización 3D para reportes y documentación de cumplimiento
- Usuarios: Ingenieros geotécnicos, con frecuencia semanal o diaria según la operación
### Tangram - Predicción de riesgo estructural
- Predice bloques de roca que pueden caer mediante análisis estructural con “discos”
- Calcula factor de seguridad y probabilidad de falla (modelos iterativos)
- Se integra con topografías de planificación para identificar inestabilidades futuras
- Gestión de riesgo: extraer bloques peligrosos antes de que se caigan de forma natural
- Usuarios: Ingenieros geotécnicos, 2–3 veces por semana como mínimo
- Crítico para prevenir accidentes y daños en equipos
### ARIS - Plataforma integrada de monitoreo (legacy)
- Consolida 30+ tipos de instrumentos de monitoreo en una sola plataforma
- Tipos de instrumento: estaciones meteo, piezómetros, inclinómetros, radares, prismas, etc.
- Alertas automáticas cuando las lecturas exceden rangos de tolerancia
- Análisis histórico para fines regulatorios e investigación de incidentes
- Plataforma considerada visualmente desactualizada frente a competidores
- Hoy se mantiene pero no se impulsa comercialmente; base de usuarios leal
- Foco: Monitoreo de seguridad y sistemas de alerta temprana
### Personalización y desafíos técnicos
- Fuerte nivel de customización por cliente genera complejidad:
- Funcionalidades activadas/desactivadas según tipo de mina (cobre vs bauxita vs carbón)
- Capas personalizadas según necesidades operacionales
- Riesgo de romper configuraciones específicas con actualizaciones de software
- Riesgo de “auto de Homero Simpson”: demasiadas funcionalidades pedidas por clientes generan un producto difícil de usar
- Necesidad de mejor validación de requerimientos: entender el uso real antes de implementar features
- Team Mining nació en geotecnia y hoy se expande más hacia software de operaciones