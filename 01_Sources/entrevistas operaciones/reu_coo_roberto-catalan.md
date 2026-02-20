Notas Reunion COO - Roberto Catalan + IDEMAX
Guía de la fuente
Este documento resume una reunión estratégica sobre el ecosistema de TIMining, destacando su capacidad para ofrecer una plataforma agnóstica al hardware que integra datos de diversas fuentes para optimizar la operación minera. La propuesta de valor se centra en cerrar la brecha geométrica, permitiendo a las empresas visualizar en tiempo real si la ejecución en terreno respeta la planificación espacial, todo ello mediante algoritmos que infieren estados operativos sin intervención humana. El texto también reconoce desafíos técnicos actuales, como la fragmentación de su stack tecnológico y la alta dependencia de procesos manuales, lo que impulsa la necesidad de transitar hacia un sistema más automatizado y unificado. Finalmente, se subraya la importancia de la personalización consultiva, adaptando las reglas de negocio de sus productos centrales, Aware y Orquestra, a las particularidades geográficas y métodos de extracción de cada cliente.











Notas Reunion COO - Roberto Catalan + IDEMAX
Thu, 22 Jan 26
Visión general del producto IDEMAX
- TIMining tiene entre 6 y 8 productos de software para minería, no 9 como se pensó al principio.
- Productos centrales: Aware y Orquestra
- Aware: plataforma más amplia de monitoreo operacional, usada en salas de control 24/7 con múltiples pantallas, integrando datos en tiempo real de la operación.
- Orquestra: herramienta más especializada de planificación, enfocada en secuencias operacionales específicas (planificación de extracción, secuencia de equipos, cumplimiento de planes).
- El resto de los productos cubre problemas puntuales de tecnología y operación, como:
- Módulos geotécnicos
- Módulos de planificación tipo “delta” (desviaciones, escenarios, ajustes de plan)
- Otros componentes especializados que atacan dolores muy concretos en la faena.
- Proyecto Team Agent / Google Gemini:
- En etapa de alfa temprana, trabajando en modo de co‑creación con un cliente.
- No es todavía un producto público ni masivo.
- Está siendo probado por algunos usuarios en un entorno muy controlado.
- Riesgo alto porque en minería no hay margen para errores o “alucinaciones” de IA: una decisión mal tomada puede tener impacto en seguridad, continuidad operacional y millones de dólares.
Propuesta de valor central vs. competencia
- La mayoría de los competidores vende hardware junto con software muy ligado a ese hardware:
- Cada sensor o equipo entrega un set de datos limitado.
- Los sistemas suelen operar de forma aislada: hay múltiples “islas” de información.
- TIMining se posiciona distinto:
- Es agnóstico al hardware y a los proveedores (OEM).
- Puede integrar datos de muchos sensores, equipos y sistemas, sin importar de qué marca o proveedor sean.
- Diferenciador clave: capacidad de hacer “match” entre la geometría del plan y lo que realmente pasa en el terreno:
- Conecta datos geométricos/topográficos (plan de mina, polígonos, modelos de terreno) con el posicionamiento y actividad real de los vehículos (camiones, palas, equipos autónomos).
- Permite ver en tiempo casi real si la operación está respetando el plan o se está desviando espacialmente.
- Algoritmos que infieren estados de los vehículos sin depender del input humano:
- En los sistemas tradicionales, los operadores marcan el estado del camión con un botón (trabajando / no trabajando, cargando, descargando, detenido, etc.).
- TIMining, solo con datos (posiciones, velocidades, patrones de movimiento, tiempos, etc.), puede inferir si un camión está realmente trabajando aunque el humano no haya presionado el botón.
- Esto reduce la dependencia del factor humano y mejora la calidad de los datos operacionales.
- No se requiere hardware propietario adicional: la propuesta se basa en algoritmos y análisis inteligente de datos existentes.
Fragmentación del stack tecnológico
- El entorno tecnológico actual es bastante heterogéneo, lo que complica la integración:
- Componentes en C++ (parte del “core” más antiguo o de alto desempeño).
- Visualizaciones en Unity (con inspiración y referencias de videojuegos para la experiencia 3D / look & feel).
- Servicios backend en Go y Python.
- Interfaces y componentes web para interacción de usuarios.
- Reportes generados in‑house y enviados por correo electrónico, fuera de un flujo integrado.
- No existe todavía un sistema unificado de autenticación que abarque todo el portafolio.
- Esta mezcla tecnológica genera fricciones a la hora de integrar productos y datos:
- Para conectar, por ejemplo, Orquestra con sistemas web, hoy se recurre a bajar bases de datos y hacer cruces manuales.
- El equipo de Roberto (y su equipo) termina invirtiendo bastante tiempo en:
- Extraer datos de distintos sistemas.
- Preprocesarlos.
- Armar reportes y análisis para el cliente de forma manual.
- Todo esto reemplaza lo que idealmente debería hacerse vía APIs, conectores y flujos automatizados.
- Se describe el estado deseado como un “plug and play” que aún no se cumple: hoy el esfuerzo humano todavía es clave para que los sistemas “conversen”.
Casos de uso críticos y perfiles de usuario
- Perfiles principales de usuario identificados (al menos 4 “proto‑perfiles”):
- Definen las metas de extracción diarias y semanales.
- Deciden qué zonas de la mina se atacan cada día, en qué secuencia y con qué equipos.
- Deben asegurar que el plan respalda la vida útil del yacimiento (no solo el corto plazo).
- Desafío central: “Geometry Gap” (Brecha Geométrica):
- El minero en terreno típicamente ve “camioncitos y palas” en su sistema de flota, pero no ve el contexto geológico ni el plan espacial detallado.
- No tiene a la vista si está extrayendo desde el polígono o bloque correcto, ni el impacto de desviarse en ese momento.
- Falta la visualización integrada de:
- Dónde se suponía que debía excavar (según el modelo geológico y el plan).
- Dónde está realmente excavando (según la posición en tiempo real de equipos).
- Como consecuencia:
- Las desviaciones respecto al plan se descubren tarde (a veces semanas después).
- El costo de haber extraído en la zona equivocada puede ser de millones de dólares.
- Hay tensiones entre incentivos de corto plazo (cumplir un bono hoy) y valor de largo plazo de la mina.
- Caso de uso concreto: monitoreo de velocidad en una curva (ejemplo reciente):
- Aware detectó una caída sistemática de velocidad de ~20 km/h a 8 km/h en un tramo de curva específico.
- Esto activó la curiosidad del equipo y los llevó a revisar otro sistema (software de autonomía de Komatsu Front Runner).
- Descubrieron que la ruta de los camiones autónomos estaba mal dibujada en ese sistema.
- Corregir ese error implicó recuperar rendimiento perdido (más toneladas movidas al día) sin cambiar flota ni hardware.
- Este ejemplo muestra el valor de integrar datos y visualizar patrones; sin Aware, el problema habría pasado desapercibido por más tiempo.
Modelo de negocio y enfoque de customización
- Cada faena minera es un “mundo” distinto, por lo que se requiere mucha customización:
- El tiempo estándar de instalación es aproximadamente 1 mes para dejar todo conectado a nivel básico (accesos, protocolos, datos iniciales).
- Luego viene un período largo de ajustes y customizaciones:
- Ejemplo concreto: durante todo 2025 ya está comprometido trabajo de customización con un cliente, agregando funcionalidades y ajustes sobre Aware.
- Las razones de tanta variabilidad:
- Distintos métodos de extracción (rajo abierto, subterráneo, strip mining, etc.).
- Diferentes regulaciones locales y restricciones de seguridad.
- Estructuras organizacionales y flujos de decisión muy diferentes entre empresas y países.
- Incentivos de negocio y reglas internas que cambian el uso de la herramienta.
- Enfoque consultivo como parte central de la propuesta:
- Antes de configurar el sistema, se analiza el método de extracción, la secuencia de procesos y los roles concretos en esa faena.
- Se conversa con clientes para entender sus dolores prioritarios (ej. velocidad, conciliación plan‑real, seguridad, tiempos de detención, etc.).
- A partir de ese diagnóstico, se definen reglas de negocio, parámetros y alertas específicas para esa mina.
- Se mantiene la misma interfaz “de arriba” para todos (misma UX base), pero “debajo del agua” las reglas, umbrales y lógicas cambian según la faena.
- Variaciones geográficas y de método que TIMining ya enfrenta:
- **Chile**:
- Predominan los rajos abiertos, con rampas y bancos.
- Operaciones donde se trabaja en varias fases y zonas en paralelo.
- **Colombia (ej. Cerrejón)**:
- Rajo abierto de escala enorme, cientos de km².
- El software debe adaptarse a operaciones muy dispersas espacialmente.
- **Brasil (MRN, minería de carbón tipo “strip mining”)**:
- El mineral (carbón) viene en “lonjas” o capas.
- Se remueve primero una capa de estéril (tierra), luego se extrae el carbón, y después se rellena de nuevo.
- El método de extracción y el flujo de trabajo son distintos a los de Chile.
- **Minería subterránea**:
- Tiene lógica y geometría muy diferente; hoy por hoy, no es el foco principal de TIMining, que se centra más en rajos abiertos y operaciones a cielo abierto.
Próximos pasos
- Se agendó una demo técnica de seguimiento para el martes 27 de enero a las 10:30.
- El equipo de Roberto mostrará en secuencia todos los productos de software de TIMining, no solo Aware.
- Habrá un foco especial en Aware:
- Cómo se ve en salas de control 24/7.
- Ejemplos de customizaciones concretas para distintos clientes y faenas.
- También se revisarán capacidades y limitaciones actuales de integración:
- Qué módulos ya conversan bien entre sí.
- Dónde hay todavía trabajo manual y fricciones.
- Esta instancia servirá para:
- Aterrizar mejor casos de uso prioritarios.
- Entender en más detalle la arquitectura técnica.
- Detectar oportunidades para diseñar una experiencia de “plataforma” más unificada (single pane of glass, diseño de sistema, etc.).