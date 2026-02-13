# Conflicts Log

Contradictions detected between insights. Each conflict has a unique `[CF-XX]` ID and must be resolved through `/synthesis` before the system map can be updated.

## Status Legend

- **PENDING** — Detected but not yet resolved.
- **RESOLVED** — User has provided a resolution direction.

---

<!-- New conflicts are appended below by /analyze -->

### [2026-02-12] Análisis inicial

- **[CF-01]** (PENDING · research) **Tiempo real vs. Liquidación legacy.** Brief promete experiencia social viral en tiempo real [IG-01, IG-02, IG-06], pero API OldGuard impone liquidación T+2 días [IG-15, IG-16]. Feeds en tiempo real son imposibles con la infraestructura actual.
  - *Acción:* Necesita más investigación — Evaluar patrones de UX para feeds con datos retrasados (T+2). Casos de éxito con estados "pendiente".

- **[CF-02]** (PENDING · flagged) **Nativo vs. Híbrido.** Brief exige "100% nativo iOS/Android" [IG-04], pero restricciones técnicas fuerzan wrapper React/Cordova por timeline [IG-17].
  - *Acción:* Escalar para discusión — CEO + CTO: aceptar Cordova para MVP o retrasar lanzamiento por app nativa. Definir milestone de migración post-PMF.

- **[CF-03]** (PENDING · flagged) **Privacidad vs. Social.** Propuesta de valor central son feeds públicos de transacciones [IG-02], pero entrevistas muestran fuerte resistencia a compartir datos financieros públicamente [IG-08].
  - *Acción:* Escalar para discusión — Product + UX Lead: redefinir "social" como opt-in vs broadcast. Privacy-by-default como principio de diseño.

- **[CF-04]** (PENDING · research) **Suscripción $5 cuestionada.** Brief fija $5/mes [IG-05], pero usuarios dicen $0 [IG-11] o $2-3 máx [IG-14], y benchmark muestra que suscripción + social no funciona en el mercado [IG-23].
  - *Acción:* Necesita más investigación — Benchmarks freemium en fintech, tasas de conversión, ARPU de competidores, análisis de elasticidad de precio.

- **[CF-05]** (PENDING · flagged) **Solo móvil vs. Necesidad de escritorio.** Brief dice 100% móvil [IG-04] y Taylor valida [IG-13], pero Alex necesita laptop para gestión financiera compleja [IG-10]. Señales mixtas sobre viabilidad del enfoque exclusivamente móvil.
  - *Acción:* Escalar para discusión — Product: definir alcance de "gestión financiera" en la app. Si NeoWallet evita spreadsheets complejos, mobile-only puede funcionar.

- **[CF-06]** (PENDING · flagged) **IA agresiva: ¿feature o anti-feature?** Brief propone IA que "roast" [IG-03], Alex rechaza coaching intrusivo [IG-09], pero Jordan lo ve como viral y atractivo [IG-24]. Señales contradictorias sobre el tono de la IA.
  - *Acción:* Escalar para discusión — Product + UX: IA configurable (modo agresivo opt-in vs silencioso por defecto). Dos personalidades como feature.
