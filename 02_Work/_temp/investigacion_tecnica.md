# Investigación Técnica — Pendientes Reunión 18 Mar

> Generado: 2026-03-18. Para revisar y decidir qué se incluye en V3 final.

## 1. Pasarelas de pago → MercadoPago recomendado

- Reembolso masivo sin costo extra vía API (crítico: devolver plata si no se alcanza mínimo)
- Comisión: 2.89-3.19%
- Buena API, SDKs Node, sandbox
- Stripe descartado (requiere empresa US)
- Flow cobra $202+IVA por cada reembolso
- Khipu: solo transferencia, reembolso limitado a horas
- **Pendiente**: preguntarle a Esteban sobre experiencia con MercadoPago API y reembolsos

## 2. Magic Link → Built-in en Supabase, más fácil que login

- `signInWithOtp()` nativo de Supabase
- ~5-6h implementar (vs ~8-10h email/password) — resta horas, no suma
- Gotcha: SMTP default tiene límite 3 emails/hora → custom SMTP obligatorio (Resend/SendGrid, 30 min setup)
- Se puede tener ambos (magic link + password) en paralelo
- Pre-crear usuarios en Supabase al momento de compra del ticket (`shouldCreateUser: false`)
- **Veredicto**: ir con magic link desde MVP

## 3. Scraping RRSS → No vale la pena

- APIs de Instagram/TikTok NO exponen intereses, follows, likes (cerrado desde 2018)
- Solo dan: nombre, foto, bio, posts propios (inútil para perfilamiento)
- Implementar social login: 40-80h para dato de baja calidad
- Ley 21.719 (protección datos Chile) entra en vigencia dic 2026

**Alternativas recomendadas:**
- Encuesta al comprar: "elige 3 temas que te interesan" (2-4h)
- Perfilamiento por historial de compras (4-8h)
- Ambas dan mejor dato, más barato, sin riesgo legal

**Recomendación a Barri**: preguntarle directamente al usuario, no espiar sus redes.

## 4. WhatsApp Bot → Escalonado

**Fase 0 (MVP, $0, 0h dev):**
- Canal de WhatsApp manual por torneo
- Link de invitación en email de confirmación
- Publicación manual (recordatorio, link, resultados)

**Fase 1 (post-validación, ~15h dev, ~$5-50/torneo):**
- Meta Cloud API directa (sin intermediarios tipo Twilio)
- 3 templates: confirmación, recordatorio, resultados
- Opt-in checkbox en checkout
- Supabase Edge Functions
- No se pueden crear grupos automáticamente vía API

## Impacto en propuesta V3

| Investigación | ¿Cambia horas? | ¿Cambia presupuesto? |
|---|---|---|
| MercadoPago | No | No |
| Magic link | Resta ~3h | No (ya en las 60h) |
| Scraping → encuesta | +2-4h si se incluye | Marginal, puede ir en T2 |
| WhatsApp Fase 0 | 0h | $0 |
| WhatsApp Fase 1 | +15h | Cotizar aparte post-MVP |
