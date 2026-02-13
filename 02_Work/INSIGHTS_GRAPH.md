# Insights Graph

Atomic verified insights extracted from sources. Each insight has a unique `[IG-XX]` ID, a status, and a traceable source reference.

## Status Legend

- **PENDING** — Extracted but not yet verified or cross-referenced.
- **VERIFIED** — Confirmed through cross-referencing or user validation.
- **MERGED** — Combined with another insight during conflict resolution.
- **INVALIDATED** — Contradicted by stronger evidence; no longer active.

---

<!-- New insights are appended below by /analyze -->

### [2026-02-12] Análisis inicial de fuentes seed (fintech)

- **[IG-01]** INVALIDATED (business) Visión: experiencia de "social banking" para Gen Z — finanzas multijugador integradas con estatus social. Ref: `seed-brief/project-brief.md`
- **[IG-02]** VERIFIED (business) Feeds públicos de transacciones, ollas compartidas y "squad goals" de ahorro como propuesta de valor central. Ref: `seed-brief/project-brief.md`
- **[IG-03]** VERIFIED (business) Personalidad de IA agresiva que critica el gasto excesivo ("roast"). Ref: `seed-brief/project-brief.md`
- **[IG-04]** VERIFIED (constraint) Solo móvil: 100% iOS/Android nativo, sin app web. Ref: `seed-brief/project-brief.md`
- **[IG-05]** VERIFIED (business) Modelo de negocio: suscripción plana de $5/mes. Gen Z valora transparencia y odia anuncios. Ref: `seed-brief/project-brief.md`
- **[IG-06]** VERIFIED (business) Timeline: MVP en 3 meses con API "Stark" para liquidación instantánea. Ref: `seed-brief/project-brief.md`
- **[IG-07]** VERIFIED (user-need) Apps de finanzas existentes (Mint, YNAB) percibidas como demasiado manuales. Usuarios prefieren verificación pasiva del saldo. Ref: `seed-interviews/interview-01.md`
- **[IG-08]** VERIFIED (user-need) Privacidad financiera: compartir transacciones con amigos se percibe como "creepy". Fuerte resistencia a feeds públicos. Ref: `seed-interviews/interview-01.md`
- **[IG-09]** VERIFIED (user-need) Prefiere IA silenciosa de ahorro automático, rechaza coaching agresivo o humorístico. Ref: `seed-interviews/interview-01.md`
- **[IG-10]** VERIFIED (user-need) Gestión financiera compleja se hace en laptop — pantalla móvil percibida como limitada para spreadsheets. Ref: `seed-interviews/interview-01.md`
- **[IG-11]** VERIFIED (user-need) No pagaría suscripción por app financiera cuando existen alternativas gratuitas (Chime, CashApp). Ref: `seed-interviews/interview-01.md`
- **[IG-12]** VERIFIED (user-need) Leaderboards de ahorro entre amigos como motivación. Quiere gamificación. Ref: `seed-interviews/interview-02.md`
- **[IG-13]** VERIFIED (user-need) Valida enfoque mobile-only: no tiene laptop personal, todo desde el teléfono. Ref: `seed-interviews/interview-02.md`
- **[IG-14]** VERIFIED (user-need) Pagaría $2-3 por features premium, $5 percibido como caro sin beneficios significativos. Ref: `seed-interviews/interview-02.md`
- **[IG-15]** VERIFIED (technical) API "Stark" no aprobada por compliance. Obligatorio usar API SOAP "OldGuard" durante los primeros 12 meses. Ref: `seed-technical/constraints.md`
- **[IG-16]** VERIFIED (technical) OldGuard: liquidación T+2 días. Feeds de transacciones en tiempo real imposibles con esta API. Ref: `seed-technical/constraints.md`
- **[IG-17]** VERIFIED (technical) Implementación será wrapper React/Cordova, no nativa. Se reutiliza portal web existente para cumplir timeline. Ref: `seed-technical/constraints.md`
- **[IG-18]** VERIFIED (technical) PCI-DSS: datos bancarios y de grafo social deben estar en infraestructura completamente separada. Ref: `seed-technical/constraints.md`
- **[IG-19]** VERIFIED (technical) Rate limit OldGuard: 1 llamada/segundo/usuario. Actualizaciones frecuentes del modo "multiplayer" podrían saturar al proveedor. Ref: `seed-technical/constraints.md`
- **[IG-20]** VERIFIED (business) CashFlow Z: modelo freemium, muy social (feeds públicos por defecto), 10M usuarios. Líder de mercado. Ref: `seed-benchmark/competitor-analysis.md`
- **[IG-21]** VERIFIED (business) SaveMate: $10/mes, enfoque en privacidad, perdiendo usuarios ante CashFlow Z. Ref: `seed-benchmark/competitor-analysis.md`
- **[IG-22]** VERIFIED (business) FinTok: con anuncios, consejo financiero en video. Usuarios toleran ads si son entretenidos. Ref: `seed-benchmark/competitor-analysis.md`
- **[IG-23]** VERIFIED (business) Mercado bifurcado: apps gratuitas/sociales ganan volumen, de pago/privacidad son nicho. No existe app exitosa que combine suscripción + features sociales. Ref: `seed-benchmark/competitor-analysis.md`
- **[IG-24]** VERIFIED (user-need) IA que critica gasto suena "viral" — lo descargaría por los memes. Ref: `seed-benchmark/interview-03-jordan.md`
- **[IG-25]** VERIFIED (user-need) No vincularía cuenta bancaria principal por riesgo de seguridad. Solo pondría "dinero de juego". Ref: `seed-benchmark/interview-03-jordan.md`
