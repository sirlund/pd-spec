# Log de Decisiones y Fronteras del Proyecto

## Log de Decisiones Clave (Memoria)

**Q: ¿ML o Heurística? (Análisis Profundo)**
A: **Heurística.**
El cliente solicitó explícitamente *"algoritmos de aprendizaje automático"* para lograr *Rubber Banding* y *User Behavior Analytics*.
**Resolución:** Se decide **NO** implementar ML en la Fase 1.
*   **Justificación Técnica:** Sin datos históricos de partidas, una red neuronal sufre de "Cold Start" (no tiene qué aprender). Implementarla ahora sería vender una caja negra vacía.
*   **Estrategia:** Implementaremos "Inteligencia Heurística" (reglas estadísticas condicionales) que emulan el comportamiento del ML. Esto cumple el objetivo de negocio (ajuste de dificultad dinámico) desde el día 1, mientras se recolecta la data para entrenar una IA real en la Fase 2.
*   **Validación:** El cliente ACEPTÓ esta propuesta el Feb 3 ("Me parece muy bien tu propuesta para el tema del cold start").
*   **Valor:** Protegemos la inversión del cliente evitando costos de I+D prematuros.

**Q: ¿Cómo justificar el precio ($12k-$16k)?**
A: Posicionamiento como "Product Partner". Calidad senior a precio competitivo vs. Agencias (que cobrarían ~800 UF). El cobro por hitos reduce el riesgo percibido por el cliente.

**Q: ¿Es factible bajar horas con IA?**
A: **Sí.** Se usarán UI Kits y herramientas como Cursor (~30% menos carga). Este ahorro constituye margen para el consultor, no un descuento para el cliente.

**Q: ¿Necesito ayuda técnica?**
A: **Sí.** Se reservan ~$3k para un Dev Backend (seguridad/Supabase), permitiendo foco en Producto/Frontend.

**Q: ¿Tema Impuestos/Boleta?**
A: Boleta de Honorarios (exenta de IVA). El presupuesto es BRUTO. El líquido resultante cubre la meta de $25/h con holgura.

---

## Fronteras y Exclusiones (Blindaje)

### Costos de Terceros
- Las cuentas de desarrollador (Apple/Google) y servicios cloud (Supabase) son pagados **directamente por el cliente**.
- El presupuesto **NO** incluye costos de infraestructura recurrente.

### Marketing
- El servicio incluye desarrollo del producto.
- **NO** incluye adquisición de usuarios ni inversión en pauta publicitaria.

### Garantía vs Soporte
1.  **Garantía:** 30 días post-lanzamiento para corrección de bugs de código sin costo.
2.  **Soporte:** Post-garantía. Cualquier hora de ingeniería o monitoreo se cobra bajo esquema de Retainer mensual (Sugerido: $800-$1200 USD/mes) o valor hora estándar.

### Idioma y Comunicación
- **Idioma del Proyecto:** Español.
- Todos los entregables, documentación, presentaciones y comunicaciones deben estar en **Español**, salvo términos técnicos estándar en inglés (e.g., "Rubber Banding", "Cold Start", "Stack").
