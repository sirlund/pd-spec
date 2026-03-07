# Historial de Comunicaciones: Nicolás Lundin - Juan Ibáñez

**Contexto:** Negociación de alcance técnico y coordinación de reunión.

---

### 1. Requerimiento Inicial y Cotización
**De:** Juan Ibáñez  
**Fecha:** Mon, Feb 2  
**Claves:**
- Solicitud de cotización para App + Sitio (Inscripción, Login, Trivia).
- MVP: Trivia clásica (V/F, opciones), Feedback dopamínico (Sparkles, sonidos, barra de progreso), Gestión de acceso (tiempo limitado), Ranking.
- **Requerimiento Crítico:** Motor de ML para Rubber Banding e ilusión de agencia.
- Propósito: Presentar a inversores.

*(Ver detalle completo en `docs/00_requerimiento_original.md`)*

---

### 2. Propuesta de Pivote Estratégico (MVP Data-Ready)
**De:** Nicolás Lundin <hola@nlund.in>  
**Fecha:** Mon, Feb 2, 1:03 PM  
**Propuesta:**
- Reconocimiento de falta de datos históricos para ML ("Cold Start").
- **Propuesta Fase 1:** Heurística Avanzada (reglas lógicas) en lugar de Red Neuronal.
- **Propuesta Fase 2:** Arquitectura "Data-Ready" para capturar datos y entrenar IA futura.
- Consultas sobre contenido (clasificación) e infraestructura.

---

### 3. Aceptación de Pivote y Definiciones
**De:** Juan Ibáñez  
**Fecha:** Tue, Feb 3, 12:13 PM  
**Respuesta:**
- **Validación:** "Me parece muy bien tu propuesta para el tema del cold start".
- **Requerimiento Admin:** El panel debe incluir herramientas para clasificar preguntas.
- **Requerimiento Dinámico:** El sistema debe reclasificar preguntas automáticamente (ej: pasar de fácil a difícil según player cluster).
- **Infraestructura:** Solicita propuesta de arquitectura ("hosting elástico").

---

### 4. Confirmación Técnica y Propuesta Formal
**De:** Nicolás Lundin <hola@nlund.in>  
**Fecha:** Tue, Feb 3, 10:53 PM  
**Confirmación:**
- Resolución de reclasificación dinámica mediante "Estadística Heurística" (tasas de acierto en tiempo real) en Fase 1.
- Diseño de arquitectura elástica (Serverless).
- Solicitud de reunión.

---

### 5. Coordinación de Reunión
**De:** Juan Ibáñez / Nicolás Lundin  
**Fecha:** Wed, Feb 4  
**Acuerdo:**
- Reunión agendada para el **Viernes a las 10:00 AM** (Google Meet) para revisar propuesta formal y presupuesto.
