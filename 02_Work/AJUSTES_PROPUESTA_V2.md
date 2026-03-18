# Ajustes Propuesta v2 — Working Doc

> Cruce de: Propuesta v2 + Transcript Mar 10 + Transcript Mar 12
> Generado: 2026-03-16
> Propósito: sesión de iteración Nicolás/Barri antes de actualizar propuesta final

---

## A. Cambios confirmados (ya decididos, falta escribirlos en propuesta)

- [ ] **D1/D7 eliminado** — ya tachado, borrar definitivamente
- [ ] **Ranking real-time eliminado** — solo ranking final post-torneo
- [ ] **Audio como formato de pregunta** — clips de audio en CMS. No impacta presupuesto
- [ ] **Imágenes como alternativas de respuesta** — ya mencionado, asegurar que quede explícito
- [ ] **Friends & family obligatorio** — test controlado pre-torneo. Agregar al roadmap
- [ ] **Equipo explícito** — Nicolás (lead) + hermano/backend (Banco Falabella) + Claude Code

## B. Cambios de scope (propuesta dice una cosa, transcripts cambian)

- [ ] **Motor adaptativo → probablemente eliminarlo**
  - Marcelo argumenta: data cross-temática inútil, injusto, opaco, marketing baja la barrera
  - Discusión quedó cortada en T1 — **RESOLVER en sesión**
  - Si se elimina: queda solo heurística estática (bloques predefinidos)
  - Si se mantiene: redactar como "data-ready" sin comprometer entrega MVP

- [ ] **Landing: CMS → template manual**
  - Nicolás cambia landing por torneo (~2-3 días), no Marcelo vía CMS
  - Marcelo confirmó: "me cobrás la hora"
  - Agregar como línea recurrente en presupuesto

- [ ] **Sonido diferido fuera del MVP**
  - Marcelo: "a mí me carga el sonido en trivia"
  - Pero para Metallica tendría sentido (clips musicales como pregunta ≠ sound design UI)
  - **RESOLVER**: ¿eliminar de opción Pro para MVP, o mantener como upgrade posterior?

- [ ] **Mini quiz 12 preguntas → nice-to-have, no MVP**
  - Alternativa más simple: explicar tipos de preguntas en landing (texto, no interactivo)

## C. Líneas nuevas para presupuesto

| Ítem | Estimación | Recurrencia |
|---|---|---|
| Página "about" de Soñado (one-pager scroll) | 15-20h | Una vez |
| Adaptación visual por torneo (colores, tipografía, tema) | 2-3 días (~16-24h) | Por torneo |
| Template landing por torneo | Incluido en adaptación visual | Por torneo |
| A/B testing contenido landing (editable por Marcelo) | Por definir | Una vez (setup) |
| Encuesta post-torneo (perfilamiento audiencia) | Por definir | Una vez (setup) |

**Pregunta clave**: ¿esto cabe en $5,605 o hay que recotizar?

## D. Features técnicos nuevos (no estaban en propuesta)

- [ ] **Anti-cheat: preguntas en lotes pequeños** — servir de a 1 o máximo 5, no todo el banco. Prevenir descarga masiva pre-torneo
- [ ] **Sesión única concurrente** — login desde otro dispositivo mata sesión anterior
- [ ] **Magic link** — autenticación sin usuario/contraseña (investigar UX + seguridad)
- [ ] **Reporte de errores in-app** — botón → ticket → llega al equipo en tiempo real
- [ ] **Requerimientos mínimos comunicados** — antes de compra: navegador, versión, conexión. Fuera de eso = a tu riesgo (T&C)
- [ ] **Contingency plans** — lista de errores posibles + respuesta para cada uno. Si error es culpa plataforma → ventana especial para afectado

## E. Tensiones sin resolver (para discutir en sesión)

1. **Motor adaptativo: ¿sí o no?**
   - Marcelo: eliminarlo. Propuesta: lo incluye. Falta cerrar.

2. **Cookie scraping RRSS vs encuesta post-torneo**
   - Marcelo quiere perfilamiento vía API de RRSS (con consent)
   - Nicolás: usuarios van a rechazar cookies. Encuesta incentivada más efectiva
   - ¿Se incluyen ambos? ¿Solo encuesta para MVP?

3. **Timeline primer torneo**
   - Metallica Las Vegas Oct 31 probable que no alcance (legal, tributario, operadora)
   - Si no es Metallica: ¿cuál? ¿Taylor Swift? ¿Otro?
   - Marcelo necesita Gantt multi-stakeholder: dev + operadora + legal
   - Marcelo pidió explícitamente: "con margen de error, no nos estresemos"

4. **Presupuesto vs scope creep**
   - About page + adaptación visual recurrente + A/B testing + encuesta + contingency
   - ¿Se absorbe en las 200h o se recotiza?

5. **Opción Básica vs Pro: ¿sigue vigente?**
   - Sonido fuera del MVP desdibuja la diferencia Pro
   - ¿Redefinir qué incluye cada opción post-ajustes?

## F. Contexto externo (no es scope dev, pero afecta timeline)

- Inversor tentativo (amigo colegio Marcelo, ~$6M patrimonio, no digital)
- Operadora viaje: Mary, arma paquetes premio. Necesita ganador 1 mes antes del evento
- Abogado PI: en curso. Límites de uso de marca, imágenes, segundos de audio
- Abogado civilista: T&C del torneo (pendiente)
- Tributario: estructura fiscal en investigación
- Miguel Paz / Revenue: referencia fundraising. Requisitos: equipo fijo + MVP con números

---

> **Siguiente paso**: sesión de iteración para resolver E1-E5, confirmar scope, y recotizar si es necesario. Luego actualizar propuesta final.
