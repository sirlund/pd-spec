# System Map

The product's logic layer. Every decision here traces back to verified insights in `INSIGHTS_GRAPH.md`.

## Visión de Producto

Herramientas de finanzas multiplayer para Gen Z con diseño privacy-first. El framing "social banking" fue invalidado [IG-01 INVALIDATED], pero los features específicos (ollas compartidas, feeds, squad goals) se mantienen como propuesta de valor [IG-02]. La app debe resolver la tensión entre funcionalidad social y resistencia a compartir datos financieros [IG-08]. [IG-02, IG-07, IG-08]

## Módulos

### Core Banking
Wrapper Cordova/React sobre API SOAP OldGuard. Liquidación T+2 días. Rate limit 1 llamada/segundo/usuario. Decisión sobre Cordova vs nativo pendiente de CEO + CTO (CF-02). [IG-15, IG-16, IG-17, IG-19] — Bloqueado por CF-02.

### Social / Multiplayer
Ollas compartidas, feeds de transacciones (opt-in), squad goals, leaderboards de ahorro entre amigos. Diseño debe asumir opt-in hasta que CF-03 se resuelva. Limitado por datos retrasados T+2 (CF-01). [IG-02, IG-08, IG-12] — Bloqueado por CF-01, CF-03.

### IA Coaching
Tono a definir: agresivo/viral vs silencioso/automático. Usuarios quieren automatización sin interrupciones [IG-09], pero el tono agresivo tiene potencial viral [IG-24]. Propuesta: IA configurable con dos personalidades. [IG-03, IG-09, IG-24] — Bloqueado por CF-06.

### Monetización
$5/mes propuesto en brief [IG-05], cuestionado por toda la evidencia externa: usuarios dicen $0 [IG-11] o $2-3 máx [IG-14], mercado muestra que suscripción + social no funciona [IG-23]. Modelo indefinido hasta completar investigación. [IG-05, IG-11, IG-14, IG-23] — Bloqueado por CF-04.

### Seguridad & Confianza
PCI-DSS requiere infraestructura separada para datos bancarios y grafo social [IG-18]. Usuarios no vincularían cuenta principal por riesgo de seguridad — enfoque "dinero de juego" para onboarding [IG-25]. [IG-18, IG-25]

## Principios de Diseño

1. **Privacy-by-default** — Features sociales son opt-in, nunca broadcast. Usuarios perciben compartir finanzas como "creepy". No exponer transacciones sin consentimiento explícito. [IG-08, IG-25]
2. **Mobile-first (no mobile-only aún)** — Mayoría de usuarios valida móvil [IG-04, IG-13], pero necesidad de escritorio para finanzas complejas existe [IG-10]. Pendiente definición de alcance (CF-05).
3. **Automatización silenciosa** — Usuarios quieren que la app actúe sin interrumpir [IG-07, IG-09]. Coaching agresivo debe ser opcional, no por defecto.
4. **Precio sensible** — Gen Z no paga $5 sin justificación excepcional. Cualquier modelo de monetización debe respetar rango $0-3 o demostrar valor extraordinario. [IG-11, IG-14, IG-23]

## Preguntas Abiertas

### Escaladas (requieren decisión de stakeholders)
- [ ] CF-02: CEO + CTO — ¿Aceptar Cordova para MVP o retrasar lanzamiento por app nativa? Definir milestone de migración post-PMF.
- [ ] CF-03: Product + UX Lead — Redefinir "social" como opt-in vs broadcast. Privacy-by-default como principio de diseño.
- [ ] CF-05: Product — Definir alcance de "gestión financiera" en la app. Si NeoWallet evita spreadsheets complejos, mobile-only funciona.
- [ ] CF-06: Product + UX — IA configurable (modo agresivo opt-in vs silencioso por defecto). Dos personalidades como feature.

### Investigación necesaria
- [ ] CF-01: Patrones de UX para feeds con datos retrasados (T+2). Casos de éxito con estados "pendiente".
- [ ] CF-04: Benchmarks freemium en fintech, tasas de conversión, ARPU de competidores, elasticidad de precio.

### Brechas de evidencia
- [ ] Confianza/seguridad — Solo una fuente menciona barrera de vincular cuenta principal. Entrevistas focalizadas en seguridad percibida.
- [ ] Retención — Sin datos de churn ni retención a largo plazo. Análisis de cohortes de competidores.
- [ ] Regulación fintech — Solo PCI-DSS conocido. Consulta con legal sobre licencias bancarias, KYC/AML.
- [ ] TAM — Sin sizing del mercado objetivo. Análisis TAM/SAM/SOM para finanzas sociales Gen Z.
