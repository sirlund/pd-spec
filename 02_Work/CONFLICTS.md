# Conflicts Log

Contradictions detected between insights. Each conflict has a unique `[CF-XX]` ID and must be resolved through `/synthesis` before the system map can be updated.

## Status Legend

- **PENDING** — Detected but not yet resolved.
- **FLAGGED** — Escalated for stakeholder discussion.
- **RESOLVED** — User has provided a resolution direction.

---

## [CF-01] Aware puede funcionar independiente vs Aware necesita Orchestra FLAGGED

**Tensión:** Centinela compró 5 licencias de Orchestra y dejaron Aware diciendo que "no es gemelo" ([IG-34]), pero históricamente Aware y Orchestra se vendían por separado. Sin embargo, la evidencia muestra que Aware sin Orchestra no puede justificar su valor al no poder cuantificar impacto ([IG-02]).

**Referencias:**
- [IG-02]: Aware y Orchestra se venden juntos porque Aware no puede cuantificar impacto solo
- [IG-34]: Aware antes se vendía sin Orchestra pero no puede justificar valor sin analítica

**Implicación:** ¿Debe Aware venderse siempre con Orchestra obligatoriamente, o hay casos donde Aware standalone tiene sentido?

**Resolución:** Escalado a Sales + Product para definir bundles obligatorios vs opcionales.

---

## [CF-02] Customización es valor vs Customización es riesgo FLAGGED

**Tensión:** Por un lado, cada faena requiere customización debido a distintos métodos de extracción, regulaciones y estructuras organizacionales ([IG-23], [IG-22]). Por otro lado, la customización genera complejidad, riesgo de romper configuraciones con actualizaciones ([IG-37]), y el "auto de Homero Simpson" donde se implementan funcionalidades que no se usan ([IG-08], [IG-39]).

**Referencias:**
- [IG-22]: Cada faena requiere 1 mes instalación + largo período de customización
- [IG-23]: Variabilidad por métodos de extracción, regulaciones, incentivos
- [IG-36]: Customización por cliente genera complejidad
- [IG-37]: Riesgo de romper configuraciones con actualizaciones
- [IG-08], [IG-39]: Clientes piden features que luego no usan

**Implicación:** ¿Cómo balancear la necesidad de customización con la estabilidad del producto y la experiencia coherente?

**Resolución:** Escalado a CEO + CTO para definir trade-off customización-estabilidad y límites de configuración por tier.

---

## [CF-03] Orchestra es difícil de usar vs Orchestra tiene buenos usuarios RESOLVED

**Tensión:** Por un lado, Orchestra requiere fuerte componente consultivo y los usuarios no tienen tiempo para curva de aprendizaje compleja ([IG-09]). El simulador es complejo y requiere usuarios expertos con "trucos" y workarounds ([IG-11]). Por otro lado, usuarios de SIC (módulo de análisis de Orchestra) llegan a ser muy buenos en el módulo de analítica ([IG-12] menciona "alta autonomía").

**Referencias:**
- [IG-09]: Orchestra requiere fuerte componente consultivo, usuarios no tienen tiempo para curva aprendizaje
- [IG-11]: Simulador requiere usuarios expertos con trucos y workarounds
- [IG-12]: Usuarios de SIC tienen alta autonomía comparado con Orchestra

**Resolución:** Orchestra es una herramienta que probablemente sea descontinuada o reemplazada por agente IA. La tensión se disuelve con la transición a Project TIM (Phase 7 2026).

---

## [CF-04] TIMining tiene ventaja competitiva vs Amenaza de competidores grandes RESOLVED

**Tensión:** TIMining está en océano azul con tecnología única de integración agnóstica ([IG-13], [IG-14], [IG-15]) y diferenciadores claros. Sin embargo, los competidores grandes también están apuntando al mismo océano ([IG-46]).

**Referencias:**
- [IG-13]: TIMining es agnóstico al hardware y proveedores
- [IG-14]: Diferenciador clave es match entre geometría del plan y realidad
- [IG-15]: Algoritmos infieren estados sin input humano
- [IG-46]: Competidores grandes (pascos) también apuntan al océano azul

**Resolución:** Esto es más una amenaza externa y un motivo para acelerar la innovación de TIMining. No es un conflicto interno sino una urgencia estratégica.

---

## [CF-05] Interfaces son mejores que la industria vs Interfaces tienen problemas de adopción RESOLVED

**Tensión:** Las interfaces de TIMining están en el top comparadas con la industria minera. Sin embargo, hay múltiples problemas de adopción: usuarios abandonan Aware por no entender tiempos de actualización ([IG-06]), se perdió un cliente por métricas confusas ([IG-07]), y los productos geotécnicos son visualmente desactualizados pero tienen usuarios leales ([IG-03]).

**Referencias:**
- [IG-03]: Productos geotécnicos tienen interfaces antiguas pero base leal
- [IG-06]: Usuarios abandonan Aware por no entender timing de datos
- [IG-07]: Se perdió cliente por métricas a 24 horas que no hacían sentido

**Resolución:** El software de minería tiene pésima UI/UX. La vara está baja y no debería ser un consuelo. Con poco se puede mejorar mucho la experiencia, pero el equipo lo ve como una montaña de esfuerzo por desconocimiento.

---

## [CF-06] Valor en números nuevos vs Necesidad de validar números existentes RESOLVED

**Tensión:** El verdadero valor de TIMining está en los números que el cliente no tiene, no en replicar lo que ya tiene ([IG-50]). Sin embargo, la práctica muestra que cuesta que le crean a los números de TIMining cuando el usuario está acostumbrado a sus propios números.

**Referencias:**
- [IG-50]: Valor está en números que cliente no tiene

**Resolución:** Mostrar los números que no ven, no gastar tiempo en igualar con los suyos. Estrategia de "valor nuevo" sobre "validación de lo existente".
