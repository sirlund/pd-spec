# Source Extractions

Raw claims extracted from source files by /extract. Each claim is a verbatim quote or factual statement — no interpretation.

This file is the input for /analyze. Do not edit manually.

---

## [reu_inicial(meeting-notes).md]
- Type: meeting_notes
- Date: 2026-02-04
- Participants: Nicolás (consultor UX), David (LC Consultores)
- Extracted: 2026-02-16T18:00

### Raw Claims

**Equipo y personas**
1. "Felipe (senior) es clave técnicamente pero está resistente a adoptar IA (Cursor, copilots)"
2. "La resistencia de Felipe genera fricción y ralentiza que la app pase del 80-90% a algo cerrable"
3. "Existe miedo de Felipe a que la IA exponga brechas o lo vuelva prescindible"
4. "David está entre alinear a Felipe y que se suba al carro, o eventualmente reemplazarlo si no se adapta"
5. "El programador junior será despedido al volver de vacaciones"
6. "Problemas del junior: poca proactividad, mal rendimiento (3 meses con PDFs que quedaron malos), diagnósticos errados (culpar caché/logs en vez de backups), expectativas de sueldo desconectadas de su aporte"
7. "David ya usa IA intensivamente (Cursor, Gemini) y ha creado varias herramientas"
8. "David demostró que con IA puede resolver problemas que el junior no pudo (tema backups/disco)"
9. "Objetivo de David: no depender de una sola persona — si Felipe no está, poder mantener y evolucionar el sistema"
10. "Esteban (hermano de David) es posible apoyo backend experto, trabaja en Falabella, especialidad en backend"

**Estrategia IA y desarrollo**
11. "David quiere integrar IA dentro del flujo de desarrollo: Cursor conectado al repo con reglas claras"
12. "Usos de IA previstos: diagnóstico y resolución de bugs, migraciones técnicas (Angular 17→20), refactors y estandarización de código y UI"
13. "La app está en Angular 17 y hay librerías que exigen versiones más nuevas"
14. "La actualización secuencial (17→18→19→20) con IA podría acortarse de meses a semanas"
15. "El código está muy comentado, con la idea de que la IA pueda entender bien contexto, estructuras y reglas de negocio"

**Producto y arquitectura**
16. "LCorp es un ERP contable que funciona como plataforma interna para el estudio contable y en menor medida para algunos clientes"
17. "Uso de la app: aproximadamente 90% interno, 10% externo"
18. "Tipos de clientes: (1) Grandes empresas con SAP — David lee datos, analiza y entrega informes. (2) Medianas con otros ERPs (Softplan, Kame, Nubox) — trabaja encima de esos sistemas. (3) Clientes donde David define el software y se van a LCorp (sobre todo holdings con varias empresas)"
19. "Front y back están en repositorios separados, el back es conceptualmente headless"
20. "La separación headless abre la puerta a: otro front web (React), app móvil (Flutter), microservicios conectados"
21. "Fintoc es plan, no está integrado todavía"
22. "Meta de Fintoc: leer cartolas bancarias con más detalle que Excel — detectar RUT, glosa, montos — proponer asientos contables automáticos"
23. "Visión de automatización: que la contabilidad pase de digitación manual a revisión/aprobación"
24. "Ideas futuras: sistema de administración de inversiones, sistema de cotizaciones, ecosistema de módulos administrativos que conversan entre sí con el ERP contable como núcleo"

**UX/UI**
25. "Problemas de navegación: menús poco claros, demasiadas opciones, funciones difíciles de encontrar"
26. "Pantallas cargadas, flujos con demasiados pasos, especialmente en procesos críticos"
27. "Estilos diferentes entre secciones, componentes visuales sin estándar"
28. "Necesidades: estandarizar diseño (menús, componentes, patrones)"
29. "Necesidades: repensar flujos con foco en los jobs reales de los usuarios (cierre contable, conciliación, informes)"
30. "Gap mobile: hoy no se pueden hacer tareas críticas (como ingresar facturas) desde el teléfono"
31. "Necesidad de dashboard para holdings: vista consolidada para dueños con varias empresas (estado de cierre, por cobrar, etc.)"
32. "Enfoque UX propuesto: investigación con contadores y analistas internos (90% del uso) y clientes externos clave (holdings)"
33. "Crear un sistema de diseño: tipos de componentes, colores, íconos, espaciados, estados"
34. "Usar IA como equipo de diseño embebido: agentes que modifiquen vistas respetando reglas de diseño"

**Negocio**
35. "Clientes grandes gastan 25-30M CLP mensuales solo en infraestructura y licencias (SAP, Azure)"
36. "Microsoft Copilot es caro y requiere licencias adicionales; Google Workspace básico + Gemini es mucho más barato"
37. "Obsesión 2026 de David: usar IA para automatizar trabajo mecánico contable — hacer más con el mismo equipo, escalar cartera sin crecer en headcount"

**Colaboración y próximos pasos**
38. "Foco inmediato (1-1.5 semanas): alinear con Felipe respecto a IA, integración formal de Cursor en repo, ordenar diseño y navegación en lo más crítico"
39. "Pasos siguientes: investigación UX con usuarios reales, definir guidelines de diseño, documentar arquitectura y reglas del juego"

---

## [transcript_reunion_inicial(Feb 4).md]
- Type: interview
- Date: 2026-02-04
- Participants: Nicolás (consultor UX), David (LC Consultores)
- Extracted: 2026-02-16T18:00

### Raw Claims

**Equipo y dinámica interna**
1. "Desde que entró Cursor a mi vida me puse a fabricar muchas herramientas" — David sobre adopción personal de IA
2. "El programador junior es muy pajero, no es propio y no termina de hacer bien lo que tiene que hacer" — David
3. "Felipe, integra Cursor. No la estaba ocupando" — David pidiendo al senior que use IA
4. "Un desarrollador senior que no ha ocupado IA todavía, muy resistente" — Nicolás sobre Felipe
5. "Le da miedo darse cuenta que [la IA puede reemplazar parte de su trabajo]" — sobre Felipe
6. "El programador junior dijo que el seguro se había llenado por el caché y recomendaba no hacer nada hasta que volviera" — diagnóstico errado del junior
7. "Conecté nuestro código al Cursor y Cursor descubrió que el problema no era el log sino los backups" — David resolviendo con IA
8. "Los backups están usando espacio en el disco de la base de datos y la aplicación tenía backup de hace un año, no es necesario" — causa real del problema
9. "La visualización de los PDFs está toda mala, el programador junior trabajó tres meses y no funcionó" — sobre deuda técnica
10. "Implementé IA para el proceso completo en diciembre y estamos en febrero y ninguno de los dos me pescó" — David sobre resistencia del equipo
11. "Felipe hace que mi problema sea su problema, me ha generado confianza para dejarlo con él" — David sobre confianza en Felipe
12. "El programador junior cree que le pagamos poco, cree que debía estar ganando más" — conflicto salarial
13. "Lo voy a echar la semana siguiente, cuando vuelva de vacaciones" — David sobre el junior
14. "Necesito que ahora con IA, cuando la aplicación tenga algún problema, yo sea capaz de repararlo. Si tú no estás, estoy yo. Si yo no estoy, estás tú" — David sobre autonomía operativa
15. "Tengo clientes que van a estar funcionando un sábado en la noche" — necesidad de disponibilidad
16. "Los proyectos están pésimamente documentados" — David sobre documentación
17. "Felipe tiene un problema de ansiedad con la velocidad de adaptación" — David

**Arquitectura y tecnología**
18. "Estoy en Angular 17, para pasarme al 20 no puedo pasar directo, debo pasarme del 17 al 18, probar, del 18 al 19, probar, del 19 al 20 y probar" — migración secuencial requerida
19. "Con esta herramienta [IA] en vez de estar meses, puede ser un par de semanas" — expectativa de aceleración
20. "La base de datos está comentada y comentada, se necesita una limpieza por comando" — deuda técnica en DB
21. "Front y back están completamente separados, son dos proyectos GitHub distintos" — David confirma headless

**Producto y modelo de negocio**
22. "Somos una empresa de servicios de asesorías de analistas contables y de procesos contables" — definición del negocio
23. "Tengo empresas que son eléctricas que tienen instalado SAP, nosotros revisamos SAP y sacamos análisis contable" — tipo de cliente 1
24. "Otro tipo de clientes tiene medianas empresas con soluciones como Softplan, Kame, Nubox, y nosotros trabajamos sobre esas plataformas" — tipo de cliente 2
25. "Otros clientes dejan que nosotros decidamos el software, y a ellos los metemos en nuestra plataforma LCorp" — tipo de cliente 3
26. "LCorp tiene usuarios que son trabajadores de la oficina y algunos clientes que trabajan conectados desde afuera" — usuarios mixtos
27. "Los clientes que trabajan conectados a mi oficina son por lo general holdings con varias empresas dentro de mi sistema" — patrón de holdings
28. "90% de la aplicación es interna, 10% externo" — ratio de uso
29. "Esta es una aplicación hecha para resolverme el problema a mí" — David sobre naturaleza interna
30. "Cuando quiera vender el software voy a tener que empezar a atender a contadores" — barrera de comercialización
31. "Cuando llega un cliente que tiene la cagada en la contabilidad, lo paso a mi sistema" — LCorp como entry-level
32. "Yo tengo un ERP orientado a la contabilidad" — David define su producto
33. "Las pymes no necesitan un SAP, están ocupando un 5% de sus funcionalidades" — oportunidad de mercado
34. "Un amigo que trabaja en una empresa implementó Odoo y lo quieren arrancar — lo dieron" — evidencia de fracaso de ERPs genéricos
35. "Mis clientes que tienen SAP pagan alrededor de 15 millones de pesos mensuales solo de mantenimiento" — costo referencial SAP
36. "Tengo clientes que se gastan en infraestructura de sistema alrededor de 25 a 30 millones de pesos mensuales" — costo total infraestructura

**UX y dolores de usuario**
37. "Siento que necesito ordenar menú, estandarizar el diseño" — David sobre prioridad UX
38. "Tengo menús de botones que no sabes cómo llegar hasta ahí" — problema de navegación
39. "Tengo secciones con interfaces que debían ser simplificadas" — complejidad innecesaria
40. "Tengo interfaces que no están unificadas en diseño en relación a una otra" — inconsistencia visual
41. "El orden de la secuencia de los menús y dónde tienen que estar las funciones es un caos" — David sobre arquitectura de información
42. "Los diseños de IA que he armado este último tiempo, uso tres de cada cuatro y se han integrado bien al flujo" — David sobre diseño generado por IA
43. "Todo lo que ha salido [de IA], por defecto queda bien adaptado para mobile y ha funcionado perfecto" — responsive por defecto con IA
44. "No puedo hacer tareas desde el teléfono" — gap mobile
45. "Tengo muchas puntas abiertas que no se han cerrado" — deuda funcional

**Automatización y visión**
46. "El desafío de este año para mí era botar contadores" — David sobre automatización
47. "Fintoc te permite meterte por token a la aplicación del banco y hacer web scraping de la cartola" — herramienta identificada
48. "La información del JSON de la cartola es más que la que puedo exportar con PDF o Excel — viene el RUT del que manda, glosa, monto, banco" — ventaja de Fintoc
49. "Lo único que tendría que hacer es detectar el RUT, el monto y empezar a proponerme comprobantes" — flujo de cuadratura automática
50. "Me interesaría poder ver un dashboard de todas mis empresas en simultáneo y el estado de cierre contable" — David sobre dashboard gerencial
51. "Cuándo fue la fecha del último comprobante, cuál fue el último balance, cuánto tengo por cobrar de todas mis empresas" — métricas del dashboard
52. "Tengo un cliente dueño de un holding con fábrica de aceite, inmobiliaria, empresa de transporte — necesita ver un reporte de unificación de sus cuestiones simultáneas" — caso de uso holding
53. "Si la IA te genera una aplicación contable, se va a equivocar — mezcla cosas de Chile con Colombia" — IA no entiende contabilidad chilena
54. "Traspasar el know-how de los contadores y de tu expertise podría alimentar un agente que entienda contabilidad de Chile sin alucinar" — oportunidad de knowledge base

**Escalabilidad y KPIs**
55. "Disminuir la cantidad de tiempo en el proceso me permite tener menor horas de recurso humano, tener más clientes, escalabilidad" — David sobre escalabilidad
56. "Estoy en el límite donde puedo tener mayor automatización de procesos" — David sobre techo actual
57. "Mi dolor máximo es que yo pueda estar sacando contabilidad electrónica, certificándome del SII" — KPI principal de David
58. "Mi miedo constante es que alguien venga con una aplicación que estandarice la generación automática de comprobantes" — amenaza competitiva
59. "El mundo de la contabilidad es una paja para la gente del mundo tecnológico — y el mundo contable que entiende el problema no es muy tecnológico" — ventaja competitiva de David

**Consultoría y siguiente paso**
60. "El input del dolor real del usuario es lo que necesitamos para que la IA no haga algo genérico" — Nicolás sobre investigación UX
61. "Si antes un contador podía atender 5 clientes, ahora debería poder atender 10" — Nicolás proponiendo KPI
62. "Podríamos meter encuestas entre medio de la plataforma para sacar información" — idea de research in-app
63. "Entréame un diagnóstico y una propuesta y lo conversamos" — David pidiendo propuesta formal
64. "Mi hermano Esteban, desarrollador, su especialidad es backend, está en Falabella" — recurso de contingencia
65. "No necesito que se modifique más, necesito que se quede en guardiana" — David sobre fase de mantenimiento futuro

---

## [propuesta-trabajo-notas.md]
- Type: brief
- Date: 2026-02-05
- Participants: Nicolás (consultor UX), Gemini (asistente IA)
- Extracted: 2026-02-16T18:00

### Raw Claims

**KPIs propuestos**
1. "KPI de capacidad de carga: si hoy un contador atiende 5 clientes, la meta es que con mejoras de flujo pueda atender 10"
2. "KPI de tasa de error en cuadraturas: reducir tiempo de cuadratura manual (RUT/Montos) mediante interfaz de propuestas inteligentes"
3. "KPI de autonomía del cliente holding: medir cuántas veces el cliente pide un reporte vs. cuántas lo saca solo desde dashboard"
4. "KPI de tiempo de cierre contable: reducir horas-hombre por ciclo de cierre mensual"
5. "El dolor máximo de David (contabilidad electrónica, certificación SII) es un KPI distinto al KPI del usuario de la app"

**IA-Readiness**
6. "Si el código y la interfaz están sucios, la IA (Cursor, agentes) alucina y genera soluciones genéricas — limpiar la casa primero es prerequisito"
7. "David probó que Cursor resuelve problemas reales (caso backups), pero necesita reglas claras para que no invente patrones nuevos"

**Auditoría de 3 capas**
8. "Capa técnica: validar separación headless, calidad de código y documentación, performance (logs, backups, caché), viabilidad migración Angular 17→20"
9. "Capa UX/UI: evaluación heurística, consistencia visual, flujo de reporting/PDF"
10. "Capa operacional: inventario de bugs críticos, análisis de casos de uso (pasos actuales vs. pasos ideales)"
11. "Entregable propuesto: LCorp Health Report con semáforo de riesgos, plan de refactorización y mapa de oportunidades IA"

**JTBD aplicado**
12. "Job del contador: cerrar el mes de 10 empresas sin errores para que el jefe no reclame"
13. "Job del cliente holding: saber en 30 segundos si mis 5 empresas están sanas para tomar decisiones de inversión"
14. "Job de David (gerente): escalar cartera de clientes sin contratar más contadores ni arrendar oficina más grande"
15. "El diseño no es pestañas y botones, es atajos para que el trabajo salga más rápido"

**Blindaje de propiedad intelectual**
16. "Al documentar y estandarizar, la app deja de estar en la cabeza de Felipe — si se va, el que venga sabe dónde está parado"
17. "Traspasar know-how contable chileno a documentación que alimente agentes internos"

**Human-in-the-loop**
18. "Para cuadratura automática (Fintoc → propuestas de comprobantes): el sistema propone, el humano valida — no es un agente autónomo"
19. "Aplica a: propuestas de asientos contables, detección de patrones compras/ventas, conciliación notas de crédito"

**Quick wins**
20. "Identificar victorias rápidas en primeros 30 días: simplificar navegación de 1-2 flujos críticos, unificar 1-2 secciones inconsistentes, documentar reglas básicas para Cursor"

**Roadmap faseado**
21. "Fase 1 (Días 1-30): auditoría UX + técnica + operacional, entrevistas con contadores, quick wins, entregable Health Report + backlog"
22. "Fase 2 (Días 31-60): directrices de diseño (sistema de diseño básico), flujos to-be, reglas para agentes IA, prototipos"
23. "Fase 3 (Días 61-90): acompañamiento a desarrollo, documentación funcional y UX, KPIs baseline, roadmap post-90 días"

**Análisis borrador GPT**
24. "Del borrador GPT solo se rescatan 3 conceptos: human-in-the-loop, roadmap faseado, quick wins — el resto es grasa corporativa"
25. "Descartado: jerga corporativa (time-to-value, engagement), métricas genéricas (CSAT/SUS), roles obvios, supuestos defensivos"
