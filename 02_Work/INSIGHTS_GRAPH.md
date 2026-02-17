# Insights Graph

Atomic verified insights extracted from sources. Each insight has a unique `[IG-XX]` ID, a status, and a traceable source reference.

## Status Legend

- **PENDING** — Extracted but not yet verified or cross-referenced.
- **VERIFIED** — Confirmed through cross-referencing or user validation.
- **MERGED** — Combined with another insight during conflict resolution.
- **INVALIDATED** — Contradicted by stronger evidence; no longer active.

---

## Experiencia de Usuario

### [IG-SYNTH-01] "El Caos del Menú" — Deuda de UX paraliza la eficiencia operativa
**Consolidates:** S1-25,26,27,30,9 · S2-37,38,39,40,41,44,45,9 · S3-9
**Convergence:** 3/3 sources
**Category:** user-need (current)
**Voice:** stakeholder (David), researcher (Nicolás)
**Authority:** direct-quote, observation
Status: PENDING

> **Narrative:** La app tiene menús desordenados, inconsistencia visual entre secciones, flujos con demasiados pasos, y la generación de PDFs está rota (el junior trabajó 3 meses sin resultado). No hay sistema de diseño ni patrones unificados. David lo identifica como barrera directa para la eficiencia de sus contadores.

**Evidence trail:**
- transcript: "Tengo menús de botones que no sabes cómo llegar hasta ahí"
- transcript: "Tengo interfaces que no están unificadas en diseño en relación a una otra"
- transcript: "La visualización de los PDFs está toda mala, el programador junior trabajó tres meses y no funcionó"
- transcript: "El orden de la secuencia de los menús y dónde tienen que estar las funciones es un caos"
- meeting-notes: "Pantallas cargadas, flujos con demasiados pasos, especialmente en procesos críticos"
- meeting-notes: "Gap mobile: hoy no se pueden hacer tareas críticas desde el teléfono"

Ref: reu_inicial(meeting-notes).md, transcript_reunion_inicial(Feb 4).md, propuesta-trabajo-notas.md

---

### [IG-SYNTH-02] "Cuadratura Automática" — De digitación manual a revisión/aprobación
**Consolidates:** S1-21,22,23 · S2-47,48,49 · S3-2,18,19
**Convergence:** 3/3 sources
**Category:** user-need (aspirational)
**Voice:** stakeholder (David), researcher (Nicolás)
**Authority:** vision, hypothesis

> **Narrative:** La visión central de automatización es integrar Fintoc para leer cartolas bancarias vía web scraping, detectar RUT/montos, y proponer comprobantes automáticamente. El modelo es human-in-the-loop: el sistema propone, el humano valida. Aplica a cuadratura, asientos contables, y conciliación de notas de crédito. Fintoc aún no está integrado.

**Evidence trail:**
- transcript: "Lo único que tendría que hacer es detectar el RUT, el monto y empezar a proponerme comprobantes"
- transcript: "Fintoc te permite meterte por token a la aplicación del banco y hacer web scraping de la cartola"
- transcript: "La información del JSON de la cartola es más que la que puedo exportar con PDF o Excel"
- propuesta: "El sistema propone, el humano valida — no es un agente autónomo"

Ref: reu_inicial(meeting-notes).md, transcript_reunion_inicial(Feb 4).md, propuesta-trabajo-notas.md

---

### [IG-SYNTH-03] "Dashboard de Holdings" — Vista consolidada multi-empresa
**Consolidates:** S1-31 · S2-50,51,52 · S3-3,13
**Convergence:** 3/3 sources
**Category:** user-need (aspirational)
**Voice:** stakeholder (David)
**Authority:** direct-quote

> **Narrative:** David necesita un panel que muestre el estado de todas las empresas de un holding en simultáneo: último comprobante, último balance, cuentas por cobrar, estado de cierre contable. Caso real: cliente con 5 empresas (fábrica de aceite, inmobiliaria, transporte) que hoy descarga 5 reportes separados.

**Evidence trail:**
- transcript: "Me interesaría poder ver un dashboard de todas mis empresas en simultáneo y el estado de cierre contable"
- transcript: "Cuándo fue la fecha del último comprobante, cuál fue el último balance, cuánto tengo por cobrar"
- transcript: "Tengo un cliente dueño de un holding con fábrica de aceite, inmobiliaria, empresa de transporte"
- propuesta: "KPI de autonomía del cliente holding: medir cuántas veces pide reporte vs. cuántas lo saca solo"

Ref: reu_inicial(meeting-notes).md, transcript_reunion_inicial(Feb 4).md, propuesta-trabajo-notas.md

---

## Negocio y Mercado

### [IG-SYNTH-04] "Escalar sin Contratar" — Automatización como multiplicador de capacidad
**Consolidates:** S1-37 · S2-46,55,56 · S3-1,4,14
**Convergence:** 3/3 sources
**Category:** business (aspirational)
**Voice:** stakeholder (David), researcher (Nicolás)
**Authority:** direct-quote, hypothesis

> **Narrative:** El objetivo estratégico de David es escalar la cartera de clientes sin crecer en headcount. Está en el límite: mejoró tiempos de proceso pero necesita mayor automatización. Si un contador atiende 10 clientes en vez de 5, David escala sin oficina más grande ni más contadores. El KPI de tiempo de cierre contable (horas-hombre por ciclo) es la métrica clave.

**Evidence trail:**
- transcript: "Disminuir la cantidad de tiempo en el proceso me permite tener menor horas de recurso humano, tener más clientes"
- transcript: "Estoy en el límite donde puedo tener mayor automatización de procesos"
- transcript: "El desafío de este año para mí era botar contadores"
- propuesta: "KPI de capacidad de carga: si hoy un contador atiende 5, la meta es 10"

Ref: reu_inicial(meeting-notes).md, transcript_reunion_inicial(Feb 4).md, propuesta-trabajo-notas.md

---

### [IG-SYNTH-05] "ERP Contable de Nicho" — Herramienta interna con potencial de mercado
**Consolidates:** S1-16,17,18 · S2-22,23,24,25,26,27,28,29,30,31,32,33,34
**Convergence:** 2/3 sources
**Category:** business (current)
**Voice:** stakeholder (David)
**Authority:** direct-quote, fact

> **Narrative:** LCorp es un ERP contable de uso 90% interno. Atiende 3 tipos de clientes: (1) grandes con SAP donde David analiza datos, (2) medianas con ERPs propios (Softplan, Kame, Nubox) donde trabaja encima, (3) clientes que entran directo a LCorp (holdings). Es entry-level para pymes con "la cagada en la contabilidad". Para comercializarlo, David tendría que atender contadores, no solo sus propios clientes.

**Evidence trail:**
- transcript: "Esta es una aplicación hecha para resolverme el problema a mí"
- transcript: "Cuando llega un cliente que tiene la cagada en la contabilidad, lo paso a mi sistema"
- transcript: "90% de la aplicación es interna, 10% externo"
- transcript: "Las pymes no necesitan un SAP, están ocupando un 5% de sus funcionalidades"

Ref: reu_inicial(meeting-notes).md, transcript_reunion_inicial(Feb 4).md

---

### [IG-SYNTH-06] "La Ventaja del Bilingüe" — Know-how contable chileno + tecnología
**Consolidates:** S2-53,54,58,59 · S3-17
**Convergence:** 2/3 sources
**Category:** business (current)
**Voice:** stakeholder (David), researcher (Nicolás)
**Authority:** direct-quote, observation

> **Narrative:** La ventaja competitiva está en la intersección de dos mundos que no se hablan: los tecnólogos no entienden contabilidad chilena, los contadores no son tecnológicos. La IA actual se equivoca con normativa chilena (mezcla con Colombia). Traspasar el know-how a documentación podría alimentar un agente contable preciso. El miedo: que alguien más lo logre primero.

**Evidence trail:**
- transcript: "El mundo de la contabilidad es una paja para la gente del mundo tecnológico — y el mundo contable que entiende el problema no es muy tecnológico"
- transcript: "Si la IA te genera una aplicación contable, se va a equivocar — mezcla cosas de Chile con Colombia"
- transcript: "Mi miedo constante es que alguien venga con una aplicación que estandarice la generación automática de comprobantes"

Ref: transcript_reunion_inicial(Feb 4).md, propuesta-trabajo-notas.md

---

## Tecnología y Arquitectura

### [IG-SYNTH-07] "Headless como Habilitador" — Arquitectura separada abre puertas
**Consolidates:** S1-19,20 · S2-21 · S3-8
**Convergence:** 3/3 sources
**Category:** technical (current)
**Voice:** stakeholder (David)
**Authority:** fact

> **Narrative:** Front y back están en repos GitHub separados. Esto permite experimentar con otro front (React, Flutter), construir dashboards independientes, o conectar microservicios sin tocar el core. David piensa en ecosistema de módulos (inversiones, cotizaciones) que conversan entre sí.

**Evidence trail:**
- transcript: "Completamente separados, son dos proyectos GitHub distintos"
- meeting-notes: "La separación headless abre la puerta a: otro front web, app móvil, microservicios conectados"

Ref: reu_inicial(meeting-notes).md, transcript_reunion_inicial(Feb 4).md, propuesta-trabajo-notas.md

---

### [IG-SYNTH-08] "Deuda Técnica Angular" — Migración pendiente como bloqueo
**Consolidates:** S1-13,14 · S2-18,19,20
**Convergence:** 2/3 sources
**Category:** technical (current)
**Voice:** stakeholder (David)
**Authority:** fact

> **Narrative:** La app está en Angular 17. Librerías requieren versiones más nuevas. Migración es secuencial (17→18→19→20). Sin IA tomaría meses; con IA, David estima semanas. Pero la resistencia de Felipe a adoptar IA hace que no haya empezado. La DB también tiene deuda: requiere limpieza de datos y backups acumulados.

**Evidence trail:**
- transcript: "Estoy en Angular 17, para pasarme al 20 no puedo pasar directo, debo pasarme del 17 al 18, probar..."
- transcript: "Con esta herramienta [IA] en vez de estar meses, puede ser un par de semanas"
- transcript: "La base de datos está comentada y comentada, se necesita una limpieza por comando"

Ref: reu_inicial(meeting-notes).md, transcript_reunion_inicial(Feb 4).md

---

### [IG-SYNTH-09] "IA-Readiness" — Limpiar antes de automatizar
**Consolidates:** S1-15,33,34 · S2-16 · S3-6,7,15
**Convergence:** 3/3 sources
**Category:** technical (aspirational)
**Voice:** stakeholder (David), researcher (Nicolás)
**Authority:** observation, hypothesis

> **Narrative:** Para que la IA funcione bien (Cursor, agentes de diseño), el código y la interfaz necesitan estar limpios. Hoy la documentación de proyecto es "pésima", aunque el código tiene muchos comentarios. Sin sistema de diseño ni reglas claras, la IA genera soluciones genéricas. El prerequisito: estandarizar diseño + documentar arquitectura + definir reglas para agentes.

**Evidence trail:**
- transcript: "Los proyectos están pésimamente documentados"
- meeting-notes: "El código está muy comentado, con la idea de que la IA pueda entender bien"
- propuesta: "Si el código y la interfaz están sucios, la IA alucina y genera soluciones genéricas"
- meeting-notes: "Crear un sistema de diseño: tipos de componentes, colores, íconos, espaciados, estados"

Ref: reu_inicial(meeting-notes).md, transcript_reunion_inicial(Feb 4).md, propuesta-trabajo-notas.md

---

## Restricciones

### [IG-SYNTH-10] "El Factor Felipe" — Resistencia al cambio como cuello de botella
**Consolidates:** S1-1,2,3,4,9 · S2-3,4,5,10,11,14,17 · S3-7,16
**Convergence:** 3/3 sources
**Category:** constraint (current)
**Voice:** stakeholder (David), researcher (Nicolás)
**Authority:** direct-quote, observation

> **Narrative:** El desarrollador senior (Felipe) es el cuello de botella técnico. Es competente y confiable ("hace que mi problema sea su problema"), pero se resiste activamente a adoptar IA. David lleva presionando desde diciembre sin resultado. El miedo de Felipe parece ser que la IA lo vuelva prescindible. David necesita que el conocimiento no dependa de una sola persona — si Felipe se va, que la app siga funcionando.

**Evidence trail:**
- transcript: "Un desarrollador senior que no ha ocupado IA todavía, muy resistente"
- transcript: "Le da miedo darse cuenta que [la IA puede reemplazar parte de su trabajo]"
- transcript: "Implementé IA para el proceso completo en diciembre y estamos en febrero y ninguno de los dos me pescó"
- transcript: "Felipe hace que mi problema sea su problema, me ha generado confianza"
- transcript: "Necesito que ahora con IA, yo sea capaz de repararlo. Si tú no estás, estoy yo"
- propuesta: "Al documentar y estandarizar, la app deja de estar en la cabeza de Felipe"

Ref: reu_inicial(meeting-notes).md, transcript_reunion_inicial(Feb 4).md, propuesta-trabajo-notas.md
