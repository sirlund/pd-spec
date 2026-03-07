# Research Brief — Trivia MDP
> Auto-generado por /analyze · 2026-03-04
> Basado en 18 insights de 9 fuentes

---

## Qué está roto (o limitado hoy)

El problema técnico más importante ya tiene solución acordada, pero representa una tensión real: el cliente solicitó **algoritmos de aprendizaje automático desde el primer día** para crear "ilusión de agencia" en las preguntas. El diagnóstico técnico confirmó que sin datos históricos de jugadas reales, un modelo ML sufre de cold start y no funcionaría. La solución propuesta — una **heurística adaptativa** (reglas estadísticas que emulan ML) — fue aceptada por el cliente, pero la diferencia entre "heurística" y "ML real" no está explícitamente comunicada en el contrato [IG-SYNTH-07, CF-02].

El presupuesto es la segunda tensión activa. El proyecto pasó de $12-16K USD (pre-análisis inicial) a $5.6K (propuesta formal) y ahora a un **MDP mínimo con cotización aún pendiente**. No existe aún un número acordado para iniciar el desarrollo [IG-SYNTH-18, CF-03, CF-06].

Finalmente, la **temática del primer torneo sigue sin decidirse**: Tour de Francia, Fórmula 1, Los Simpsons — el cliente mencionó opciones pero no tomó una decisión. Esto bloquea el diseño del torneo, la estrategia de adquisición y la selección de influencers [CF-04].

---

## Qué podría mejorar

El producto aspira a ser mucho más que una trivia genérica. Las oportunidades más grandes:

- **Sistema de ligas con perfilado progresivo** [IG-SYNTH-04]: clasificar jugadores en expertos vs casuals desde el momento de la compra del ticket, con premios diferenciados por liga. Actualmente es una idea definida pero no diseñada ni cotizada.
- **Panel de administración sin código** [IG-SYNTH-13]: para que el cliente pueda cambiar contenido, branding y configuración de cada torneo sin depender del equipo de desarrollo. Sin este panel, el modelo "motor reutilizable" no funciona a escala.
- **Escalada a ML real en Fase 2** [IG-SYNTH-07]: la heurística de Fase 1 captura datos de jugadas reales. Con esos datos, el entrenamiento de IA real en Fase 2 está técnicamente desbloqueado.
- **Precio del ticket validado con usuarios** [CF-05]: el cliente mencionó "máximo ~$10.000 CLP" como referencia psicológica, pero no hay validación real de willingness-to-pay con la audiencia objetivo.

---

## Qué funciona bien

Hay elementos sólidos sobre los que construir:

- **El modelo de negocio es claro y ejecutable** [IG-SYNTH-01, IG-SYNTH-02]: motor reutilizable → primer torneo como validación → resultados reales para inversores. La lógica es coherente y el cliente la comprende.
- **El stack tecnológico está resuelto** [IG-SYNTH-08]: Next.js + Supabase + Rive. La decisión de PWA sobre app nativa elimina fricción de tiendas y reduce costos de mantenimiento.
- **El marco legal está definido** [IG-SYNTH-05]: la trivia califica como juego de habilidad (no azar) en Chile, lo que hace viable el modelo de tickets de participación con premios reales.
- **Los KPIs para inversores están articulados** [IG-SYNTH-17]: retención D1/D7, tiempo promedio por sesión, tickets vendidos vs costo de adquisición. El MDP debe estar instrumentado para medir estos tres desde el primer torneo.
- **El modelo simultáneo de torneo está decidido** [IG-SYNTH-03]: bloque fijo de horas (ej. 6 horas), todos jugando al mismo tiempo. Esto crea urgencia y elimina cherry-picking de horarios.

---

## Tensiones clave (requieren decisión de stakeholders)

| Conflicto | Naturaleza | Estado |
|---|---|---|
| [CF-01] Flutter vs Next.js | Pivote ya hecho, documentos anteriores inconsistentes | Cerrar formalmente |
| [CF-02] ML día 1 vs heurística | ¿Entiende el cliente que la heurística no es ML real? | Clarificar en contrato |
| [CF-03] Presupuesto ($12K → $5.6K → MDP mínimo) | Cotización MDP mínimo pendiente | Nicolás debe preparar |
| [CF-04] Temática del primer torneo | Sin definir — bloquea diseño y adquisición | Sesión post-NDA con Juan |
| [CF-05] Precio del ticket (~$10K CLP) | No validado con usuarios reales | Modelo financiero + willingness-to-pay |
| [CF-06] Cotización MDP mínimo | Pendiente post-reunión 6 feb | Acción externa (Nicolás) |
| [CF-07] Acuerdo de equity | Oferta informal de Juan, términos sin definir | Conversación separada post-NDA |

---

## Brechas de evidencia

El conocimiento actual viene **exclusivamente de stakeholder (Juan) y consultor (Nicolás)**. Hay tres brechas críticas:

1. **Sin research de usuarios finales** — Todos los insights sobre qué quiere el jugador son supuestos del cliente. No hay entrevistas, encuestas ni tests con la audiencia objetivo. Riesgo: el diseño del torneo refleja las preferencias de Juan, no las del jugador de trivia de nicho.
   *Sugerencia:* 5-8 entrevistas con trivia enthusiasts de las comunidades objetivo (Tour de Francia, F1, etc.)

2. **Sin análisis competitivo** — No hay datos sobre plataformas similares (Quizlet, Trivia Crack, HQ Trivia, Kahoot). El precio del ticket, el modelo de premios y la mecánica de torneo se proponen sin comparación de mercado.
   *Sugerencia:* Benchmark de 3-5 plataformas similares, con análisis de precios y mecánicas.

3. **Sin validación de precio** — $10.000 CLP es la referencia del cliente, no del mercado. La relación precio/prize pool no está modelada.
   *Sugerencia:* Estudio de willingness-to-pay (encuesta rápida con 50+ personas de la audiencia objetivo) antes de definir precio definitivo del ticket.

---

> Este brief es un punto de partida, no un diagnóstico completo. Para resolución de conflictos y definición de propuestas de diseño, continuar con `/spec`.
