# **Propuesta de Servicios: Plataforma de Validación Trivia**

**Preparado por:** Nicolás Lundin  
**Fecha:** Febrero 2026  
**Cliente:** Marcelo "Barri" Ibañez  
**Alcance:** Desarrollo de Plataforma PWA, Identidad de Marca y Ejecución de Pilotos.

## **1\. Resumen Ejecutivo**

El objetivo del proyecto es validar un modelo de negocio basado en torneos de trivia para comunidades de nicho. Para lograr métricas concluyentes ante inversores, la estrategia consiste en ejecutar una **Serie de Pilotos (Mínimo 3\)** con distintas temáticas y premios, gestionados desde una plataforma flexible.

Esta propuesta detalla la construcción del motor tecnológico, la identidad de marca y la estrategia de validación necesaria para el lanzamiento.

## **2\. Antecedentes**

La propuesta anterior planteaba un torneo piloto único con configuración hard-coded. Después de nuestra última conversación, acordamos dos cambios importantes:

1. **No un evento sino mínimo tres.** No se puede validar el modelo con un solo torneo. Necesitamos al menos 3 eventos con distintas temáticas y premios para comparar qué funciona mejor y llegar al inversor con datos reales.  
2. **Admin simple en vez de hard-coded.** Para poder iterar entre eventos sin tocar código cada vez, el piloto incluirá un panel básico de administración: set de preguntas, imagen de portada, imágenes como alternativas de las respuesta en preguntas, clips de audios para responder a preguntas y theme básico (colores y tipografía).

El resto de la propuesta se mantiene: misma banda de inversión para desarrollo, mismo stack, mismo enfoque. Se suma un ítem nuevo de Diseño e Identidad de Marca.

## **3\. Estrategia de Validación**

El objetivo no es "lanzar un torneo y ver qué pasa" sino **ejecutar una serie controlada de pilotos** que genere datos comparables:

* **Torneo 1:** Primera temática. Calibrar la experiencia, medir retención y feedback.  
* **Torneo 2:** Segunda temática distinta. Comparar engagement entre comunidades.  
* **Torneo 3:** Ajustar variables (premios, pricing, comunicación) basado en datos de los primeros dos.

**KPIs que medimos:** ~~Retención D1/D7~~, tiempo promedio por sesión, tickets vendidos vs. costo de adquisición. Estas son las métricas que miran los inversores.

### **Fase 1 — Preventa y registro** 

\-Tickets vendidos  
\-Tasa de conversión landing → compra  
\-Tasa de abandono en checkout (porcentaje de usuarios que, tras añadir productos al carrito e iniciar el proceso de pago (checkout) en un e-commerce, lo abandonan sin finalizar la compra)  
\-CAC real

### **Fase 2 — Día del torneo**

\-Show-up rate (inscritos que se conectan)  
\-Tasa de finalización del torneo  
\-Tiempo de respuesta por pregunta de cada jugador  
\-Número de aciertos por cada jugador  
\-Número de errores por cada jugador  
\-% de aciertos de cada jugador por nivel de dificultad de preguntas (fáciles, medias, difíciles)  
\-Tasa de abandono durante el torneo  
\-Errores técnicos reportados 

### **Fase 3 — Post torneo**

\-Tasa de intención de repetir (Social / mail)  
\-Reclamos o disputas sobre el resultado (Social / mail)  
\-Menciones orgánicas en redes post torneo (Social)

### **Fase 4 — Rendimiento técnico de la plataforma**

\- Tiempo de carga inicial de la app (PWA)  
\- Latencia entre pregunta y respuesta registrada (ping: Se calcula desde que la pregunta aparece en la pantalla del usuario, este interactúa, y el servidor recibe dicha respuesta.Menos de 50 ms bueno, menos de 20 ms ya es excelente)  
\-Uptime durante el torneo (el tiempo que la plataforma está funcionando correctamente sin caerse. 99% de uptime durante un torneo de 45 minutos significa que la plataforma puede fallar máximo 5 segundos durante esa hora. Todo lo que supere eso es inaceptable para un torneo en vivo).  
\-Usuarios simultáneos sin degradación (La arquitectura en Supabase debe estar diseñada para manejar picos de tráfico simultáneo, no solo tráfico promedio).  
\-Errores de pago / transacciones fallidas (¿Stripe?)  
\-Tiempo de resolución de incidente crítico (implica estar disponible y conectado en tiempo real, con acceso al servidor, listo para intervenir en minutos).  
\-Compatibilidad de dispositivos (iOS / Android / desktop)

**Meta final:** Llegar al inversor con números reales de 3 pilotos: *"con $X en campaña digital logramos vender Y tickets con Z% de retención."*

## **4\. Alcance de los Servicios**

### **Ítem 1: Desarrollo Tecnológico (Motor PWA \+ Admin)**

Construcción de una Progressive Web App (PWA) optimizada para móviles, sin fricción de tiendas de aplicaciones.

* **Motor de Juego:** Lógica de trivia con scoring por tiempo continuo y feedback visual interactivo (Rive).   
    
  La mecánica del juego es la siguiente:

### **Descripción general**

El torneo dura 45 minutos en formato de ritmo propio (self-paced). El tiempo máximo para responder una pregunta es de 30 segundos. Cada jugador tiene su propio flujo independiente de tiempo. El servidor registra únicamente cinco variables por respuesta: cuándo respondió, si fue correcta o incorrecta, cuánto tiempo tardó, % de acierto según tipo de pregunta. No hay sincronización en tiempo real entre jugadores, lo que hace la arquitectura simple y robusta.

---

### **Funcionamiento**

Todos los participantes empiezan al mismo tiempo. Cada jugador avanza a su propio ritmo. El que responde más rápido y correctamente llega a más preguntas en el tiempo disponible. Al terminar los 45 minutos, el sistema congela el estado de todos los jugadores y calcula el ranking final. El ganador es quien más sabe y más rápido responde.

Si un jugador no responde dentro de 30 segundos, la pregunta avanza automáticamente como incorrecta. Esto limita el banco de preguntas necesario sin romper el modelo y agrega tensión visual mediante un contador regresivo.

---

**Estructura de preguntas**

Las preguntas se dividen en cuatro categorías: tres niveles de dificultad (fácil, media y difícil) y **pregunta social (preguntas de opinión sin respuesta correcta predefinida).**

Se usa una estructura en bloques de cinco preguntas, cada uno compuesto por dos fáciles, una media, una difícil y una media (F, F, M, D, M). El orden interno de cada bloque se aleatoriza en cada repetición, con una única restricción: nunca pueden quedar dos preguntas de dificultad media consecutivas en la unión entre bloques. Cada dos bloques se intercala una pregunta social, lo que significa que aparece aproximadamente cada diez preguntas a lo largo del torneo.

**Las preguntas sociales son preguntas de opinión sin respuesta correcta predefinida** — por ejemplo, "¿cuál es el mejor álbum de Metallica?" o "¿Master of Puppets o The Black Album?". Pueden tener dos formatos: texto libre, donde el jugador escribe su respuesta, u opciones predefinidas, donde el jugador elige entre alternativas fijas. En ambos casos, la respuesta correcta no existe de antemano — la determina la mayoría de los participantes al finalizar el torneo. En ambos casos el grupo o opción más numerosa determina la respuesta mayoritaria, y quienes la eligieron suman los puntos correspondientes. 

Para las preguntas de texto libre, el sistema envía todas las respuestas a un modelo de lenguaje vía API — por ejemplo Claude o GPT-4 — con instrucciones de agrupar respuestas por significado equivalente, resolviendo variantes de escritura, idioma y sinónimos. Este proceso ocurre una sola vez al cerrar el torneo, no en tiempo real, con un costo estimado de $0.10 a $0.50 USD por torneo independiente del número de participantes. El resultado se revela junto con el ranking final, lo que agrega una capa adicional de tensión en el momento del cierre.

Para las preguntas de opciones predefinidas, el sistema calcula directamente la opción más elegida por conteo simple. 

Todos los jugadores enfrentan la misma secuencia de preguntas. La dificultad es impredecible en su orden pero transparente en su proporción. La percepción de justicia es alta porque todos jugaron exactamente lo mismo.

**Banco de preguntas:** 702 preguntas mínimo (30% sobre el máximo que un jugador rápido puede responder en 45 minutos, asumiendo 5 segundos promedio por pregunta). Distribución: 40% fáciles, 30% medias, 20% difíciles, 10% sociales. Con 702 preguntas: 281 fáciles \+ 211 medias \+ 140 difíciles \+ 70 sociales.

**Requerimiento técnico para el desarrollador:** integrar una llamada a API de modelo de lenguaje (Claude o GPT-4) al cierre de cada torneo para normalización y agrupación semántica de respuestas sociales en formato texto libre. Las preguntas de opción predefinida no requieren este procesamiento. Tiempo de desarrollo estimado: 1-2 días incluyendo pruebas. Costo operativo: menos de $1 USD por torneo.

**Experiencia de usuario en preguntas sociales**

Las preguntas sociales requieren un tratamiento visual y comunicacional diferenciado para evitar conflicto cognitivo. A diferencia de las preguntas de conocimiento, no entregan feedback inmediato de correcto o incorrecto — la respuesta correcta se determina al finalizar el torneo. Para que esto no rompa el flow del jugador, se aplican tres elementos de forma simultánea.

Primero, diseño visual diferenciado: la pregunta social tiene una apariencia distinta al resto — color, ícono y etiqueta propios que la identifican claramente antes de que el jugador la lea.

Segundo, etiqueta personalizada por comunidad: en vez de una etiqueta genérica, cada torneo usa el nombre propio de su comunidad. Para el torneo de Metallica la etiqueta es **"¿Qué decide la familia Metallica?"**. Para un torneo de Taylor Swift sería **"¿Qué deciden las Swifties?"**. Esta etiqueta es un parámetro configurable por torneo — el admin deberìa permitir definirla una vez por evento y se aplica a todas las preguntas sociales de ese torneo.

Tercero, micro-copy explicativo: debajo del enunciado aparece una línea corta que dice "La comunidad decide la respuesta correcta al final del torneo", eliminando cualquier ambigüedad sobre cómo funciona.

Cuarto, acuse de recibo de respuesta: al responder, el sistema muestra inmediatamente "Tu respuesta fue registrada. Sabrás qué decidió la ***familia Metallica*** al final del torneo." Esto cumple la misma función que el verde o rojo de las preguntas normales — no le dice si acertó, pero le confirma que su respuesta llegó, fue guardada correctamente y será considerada en el resultado final. Sin este mensaje el jugador podría interpretar el silencio como un error del sistema.

**Requerimiento técnico para el desarrollador:** implementar un componente visual diferenciado para preguntas sociales con estados propios — pantalla de pregunta, acuse de recibo y revelación final — independientes del flujo estándar de correcto/incorrecto. La etiqueta de comunidad es un parámetro configurable por torneo.

---

### **Resumen de parámetros confirmados**

| Parámetro | Valor |
| ----- | ----- |
| Duración del torneo | 45 minutos |
| Tiempo máximo por pregunta Bonus por responder antes  | 30 segundos \+X punto por segundos restantes |
| Banco de preguntas mínimo | 700 preguntas |
| Patrón de bloques | F-F-M-D-M \+ las Sociales intercaladas cada dos bloques |
| Distribución de dificultad |  40% fáciles / 30% medias / 20% difíciles / 10% sociales.  |
| Penalización por error  | Solo para desempate   |

---

**Pantalla del jugador:**

| Elemento | Descripción |
| ----- | ----- |
| Pregunta \+ opciones | Centro de pantalla |
| Mis puntos acumulados | Actualización inmediata tras cada respuesta |
| Indicador correcto / incorrecto | Inmediato tras cada respuesta |
| Barra de progreso 45 min | Avanza continuamente |
| Contador regresivo 30 seg | Reinicia con cada pregunta |

#### **Fórmula de puntuación** 

**¿CASTIGAR ERRORES?**

### **Criterio de desempate**

### Si dos o más jugadores terminan con el mismo puntaje, se aplica la siguiente cascada de criterios en orden: 

### 

### 1.- Gana quien tuvo mayor número de aciertos; si persiste el empate

### 2.- Gana quien tuvo mayor porcentaje de aciertos en preguntas difíciles; si persiste

### 3.- Gana quien acumuló menor tiempo total en sus respuestas correctas; si persiste

### 4.- Gana quien tuvo menos errores. 

### 5.- Si después de aplicar todos los criterios anteriores el empate persiste, los jugadores empatados disputarán un torneo de desempate en formato de eliminación directa, al estilo HQ Trivia, donde una respuesta incorrecta significa quedar fuera.

### (\*) Todos estos criterios son informados con anticipación, por lo que el jugador puede tomar decisiones estratégicas conociendo las reglas completas.

### **La cascada completa:**

|  |  |  |
| ----- | ----- | :---- |
| 1 | Mayor número de aciertos | Premia volumen de conocimiento |
| 2 | Mayor porcentaje de aciertos en difíciles | Premia profundidad de conocimiento |
| 3 | Menor tiempo total en respuestas correctas | Premia eficiencia |
| 4 | Menos errores | Diferenciador residual, informado con anticipación |
| 5 | Torneo HQ entre empatados | Resolución dramática en vivo |

* **Inteligencia Heurística:** Motor de ajuste de dificultad adaptativo sin ML~~, con arquitectura Data-Ready para IA real en Fase 2\.~~  
* **Gestión de Contenido:** Panel de Administración (CMS Simple) que permite crear múltiples torneos, gestionar preguntas y cambiar la configuración visual (Theming).  
* **Landing Page:** Página de preventa de tickets \+ toma de datos del usuario (creación de cuenta) \+ aceptación de cookies para scrapearles legalmente las rr.ss \+ **explicación de mecánica del torneo (Muy im portante para elim inar barera: “esto es una estafa”)** y fechas \+ T\&C. Necesitamos tres versiones para iterar tres precios de tickets diferentes. Es exactamente el mismo landing, solo cambia el valor del ticket.  
* Mini Quiz de 12 preguntas con el objetivo de eliminar barrera: esto es muy difìcil, solo para hardcore fans. ¿O a travès del quiz te explicamos còmo funciona el torneo?  
* ACCOPUNTABILITY: trans parencia de resultados  
* **~~Ranking:~~** ~~Sistema de clasificación en tiempo real.~~ Solo vemos el ranking final una vez finalizado el torneo, como se explica en la mecánica   del juego. Hay que darle un mini arco dramático en su despliegue.  
* **Infraestructura:** Arquitectura escalable en Next.js \+ Supabase.  
* **Seguridad:** Integración de pasarela de pagos (Webpay) y validación de integridad de respuestas (Anti-cheat).

**Motor Reutilizable:** El motor de juego (Next.js \+ Supabase) es 100% reutilizable entre torneos. Lo que cambia por evento es el contenido y el branding, que se administra desde el panel simple. Los 3+ torneos piloto no generan costo adicional de desarrollo.

### **Ítem 2: Diseño de Producto & Identidad de Marca**

Creación de los activos visuales necesarios para la comercialización y la experiencia de usuario.

* **Identidad Corporativa:** Diseño de Logotipo e Isotipo (App Icon).  
* **Sistema de Diseño Mínimo (MDS):** Definición de tokens de diseño (tipografía, paleta cromática, componentes) que alimentan el motor de temas de la app.  
* **Landing Page:** Diseño y maquetación de la página de venta de tickets.

## **5\. Niveles de Ejecución (Desarrollo)**

Para el Ítem 1, presentamos dos escenarios basados en la profundidad de la experiencia:

|  | Opción Básica | Opción Pro |
| :---- | :---- | :---- |
| **Enfoque** | Validación mecánica y funcional | Retención, viralidad y "Juice" |
| **Interfaz (UI)** | Componentes limpios y utilitarios | Diseño inmersivo estilo videojuego |
| **Feedback** | Animaciones estándar | Animaciones Rive avanzadas y diseño sonoro reactivo |
| **Admin Panel** | Gestión tabular de datos | Interfaz de gestión con previsualización visual |
| **Assets** | Generados por IA | 100% custom por temática |

## **6\. Presupuesto y Honorarios (Modelo de Bolsa)**

El servicio se estructura bajo la modalidad de **Bolsa de Horas**. Los valores corresponden a la estimación de horas necesarias para completar el alcance definido.

**Cláusula de Flexibilidad:** Si durante el desarrollo surgen nuevos requerimientos que excedan la bolsa inicial, se acordará una ampliación de horas bajo la misma tarifa base.

**Tarifa Base:** $25 USD líquidos/hora.  
Los valores son **Brutos** (incluyen Retención de Boleta de Honorarios 15.25%).

### **A. Valor por Ítem Individual**

**Ítem 1: Desarrollo PWA (Banda de Esfuerzo)**

| Concepto | Opción Básica (80h) | Opción Pro (160h) |
| :---- | :---- | :---- |
| **Tiempo de Ejecución** | 2-3 semanas | 4-5 semanas |
| **Inversión Líquida** | $2,000 USD | $4,000 USD |
| **Retención BH (15.25%)** | $360 USD | $720 USD |
| **Total Inversión Bruta** | **$2,360 USD** | **$4,720 USD** |

**Ítem 2: Pack de Diseño & Branding**

| Concepto | Ejecución Completa (40h) |
| :---- | :---- |
| **Inversión Bruta** | **$1,180 USD** |

### **B. Ejecución Integral (End-to-End)**

Al contratar el paquete integral (Desarrollo \+ Diseño), se aplica una **bonificación por eficiencia operativa del 25%** sobre las horas de Diseño.

Ejemplo con Opción Pro (máxima calidad):

| Concepto | Horas Estimadas | Valor Bruto |
| :---- | :---- | :---- |
| Desarrollo PWA (Nivel Pro) | 160 hh | $4,720 USD |
| Pack Diseño & Branding (Tarifa Integrada) | 40 hh | $885 USD |
| **TOTAL BOLSA INICIAL** | **200 hh** | **$5,605 USD** |

*Valor referencial en UF: \~148 UF.*

*La inversión de desarrollo cubre los 3+ torneos piloto — el motor se construye una vez y el admin simple permite reutilizarlo sin costo adicional.*

## **7\. Roadmap de Ejecución**

| Fase | Entregable | Estimado |
| :---- | :---- | :---- |
| **1\. Identidad & Arquitectura** | Logo, UI Kit (MDS), setup Supabase, Transbank | Semana 1 |
| **2\. Core Game** | Motor de trivia PWA, heurística, scoring | Semana 1-2 |
| **3\. Admin \+ Landing** | Panel de gestión, landing de preventa de tickets | Semana 2-3 |
| **4\. Pulido** | Animaciones Rive, diseño sonoro, ranking real-time | Semana 3-4 |
| **5\. QA & Torneo 1** | Auditoría de seguridad (dev senior) \+ primer evento | Semana 4-5 |
| **6\. Torneos 2 y 3** | Iterar contenido vía admin, ejecutar eventos | Semana 5+ |

Desarrollo liderado por Nicolás con herramientas de IA (Claude Code) \+ revisión de dev senior en seguridad y pagos.

## **8\. Condiciones Generales**

* **Forma de Pago:** 50% al inicio del proyecto, 50% contra entrega final y liberación de código.  
* **Costos Directos:** Infraestructura (Supabase, Dominios) a cargo del cliente (\~$30 USD/mes).  
* **Seguridad:** Revisión de arquitectura por Dev Senior incluida, especialmente en módulos de pagos y autenticación.  
* **Propiedad Intelectual:** Se ceden todos los derechos patrimoniales del código, diseño y marca al cliente una vez finalizado el pago.  
* **Marco Legal:** La trivia se clasifica como juego de habilidad (no azar), lo que la diferencia legalmente de rifas y sorteos.

## **9\. Decisiones Pendientes para Arrancar**

Antes de iniciar necesitamos definir:

1. **Modelo de duración del torneo:**  
   * ~~(a) Horas distribuidas en días — *"15 horas en 2 semanas, que tú distribuís a tu gusto."* Más flexibilidad para el jugador.~~  
   * ~~(b) Bloque simultáneo — *"6 horas, todos al mismo tiempo."* Más tensión competitiva. Esto cambia la arquitectura.~~  
2. **Temática del primer torneo** y comunidad target. ¿En qué semana de desarrollo debería tenerse esto definido?  
3. **Punto en la banda de esfuerzo** (Básica vs Pro) y decisión sobre Ítem 2 (Diseño).

