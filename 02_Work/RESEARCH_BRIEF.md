# Research Brief
> Auto-generado por /analyze el 2026-02-16
> Basado en 10 insights de 3 fuentes

## Lo que está roto

LCorp tiene un problema de usabilidad que impacta directamente la operación [IG-SYNTH-01]. La navegación es caótica: menús con demasiadas opciones, funciones escondidas, y flujos con pasos innecesarios. No hay consistencia visual entre secciones — cada parte de la app parece diseñada por separado. La generación de PDFs e informes (función crítica del negocio) está rota: un programador junior trabajó 3 meses sin lograr que funcione. No hay acceso mobile, lo que impide resolver urgencias fuera de la oficina.

A nivel técnico, la app está en Angular 17 y necesita migrar para usar librerías modernas [IG-SYNTH-08]. La documentación de proyecto es pésima (aunque el código tiene comentarios), lo que hace que la IA genere soluciones genéricas [IG-SYNTH-09].

El cuello de botella humano es el desarrollador senior (Felipe), que se resiste a adoptar herramientas de IA [IG-SYNTH-10]. David lleva presionando desde diciembre sin resultado. Todo el conocimiento técnico está concentrado en una persona — riesgo operativo serio.

## Lo que podría ser mejor

David quiere pasar de "digitación manual" a "revisión/aprobación" [IG-SYNTH-02]. La pieza clave es integrar Fintoc para leer cartolas bancarias automáticamente, detectar patrones (RUT, montos), y proponer comprobantes. El humano solo valida.

Los clientes con holdings necesitan ver todas sus empresas en un solo panel [IG-SYNTH-03]: último comprobante, último balance, cuentas por cobrar, estado de cierre. Hoy requiere generar reportes individuales.

El objetivo de fondo: si un contador atiende 10 clientes en vez de 5, David crece sin contratar más gente ni arrendar oficina más grande [IG-SYNTH-04].

## Lo que funciona bien

La arquitectura tiene una fortaleza clave: front y back en repositorios separados (headless) [IG-SYNTH-07]. Permite experimentar con nuevos fronts, apps mobile, o microservicios sin tocar el core.

David tiene ventaja competitiva difícil de replicar [IG-SYNTH-06]: entiende contabilidad chilena (normativa SII, prácticas locales) y tecnología. La IA actual no puede replicar ese conocimiento — se equivoca con normativa de otros países. Ese "bilingüismo" contable-tecnológico es su foso.

LCorp ya funciona como ERP contable [IG-SYNTH-05], con 3 tipos de clientes diferenciados y posicionamiento claro como entry-level para pymes.

## Tensiones clave

Discrepancia entre percepción de David ("app al 80-90%") y la evidencia de deuda técnica y UX acumulada [CF-01]. Sin auditoría, no hay forma de cuantificar el estado real.

Tensión sobre documentación [CF-02]: código con muchos comentarios pero documentación de proyecto "pésima". Necesita verificación con acceso al repo.

KPIs propuestos (5→10 clientes/contador) son hipótesis del consultor, no métricas validadas [CF-03].

"Contabilidad electrónica / certificación SII" es el dolor máximo de David pero no se ha definido qué funcionalidades de la app están involucradas [CF-04].

## Brechas de evidencia

La brecha más crítica: **ausencia de investigación con usuarios reales**. Todos los insights de user-need vienen de David (stakeholder/dueño), no de los contadores que usan la app diariamente.

- No hay documentación técnica verificada — claims de arquitectura son verbales
- No hay datos cuantitativos de negocio (cantidad de clientes, revenue, tiempos por tarea)
- No hay análisis competitivo formal más allá de menciones anecdóticas

**Para llenar brechas:**
- 3-5 entrevistas con contadores internos + observación de uso
- Acceso al repo para revisión técnica con Felipe
- Dashboard de métricas o entrevista de negocio con David
- Benchmark de 3-5 soluciones contables chilenas
