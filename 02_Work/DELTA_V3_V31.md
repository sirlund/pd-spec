# Delta V3.0 → V3.1: Cambios y decisiones

> Generado: 2026-03-31
> Fuente: `01_Sources/revision_propuesta_v2/feedback_barri_v3_mecanica.md`
> Decisiones confirmadas por Nicolás en sesión 2026-03-31

---

## Cambios de mecánica

| Aspecto | V3.0 | V3.1 (Barri + confirmado) | Impacto dev |
|---|---|---|---|
| Modelo scoring | Graduado por alternativa (+5/+1/0/-2) | Por dificultad: F=25, M=50, D=100, S=150. Binario correcto/incorrecto | Simplifica motor + contenido |
| Penalización error | -2 pts (trampa) | 0 pts en juego, solo cuenta para desempate | Simplifica |
| Feedback | Oleadas propuestas | **Oleadas RECHAZADO** → feedback inmediato por pregunta | Mantiene engagement, reabre scout+champion |
| Banco preguntas | ~440 | 702 mínimo (30% sobre máximo a 5s/pregunta) | Trabajo contenido Barri, no dev |
| Desempate | 3 criterios | 7 criterios + HQ eliminación directa (#7) | +2h criterios 4-6, +10h HQ mode |
| Orden aleatorio | Completo por usuario | Dentro del bloque, bloques en mismo orden (legal) | Mismas 3h, menor protección anti-cheat |
| Preguntas sociales | Mencionadas | Spec detallada: visual diferenciado, etiqueta comunidad, micro-copy, acuse de recibo, LLM clustering | Ya estaba en horas motor core |

## Requerimientos nuevos

| Requerimiento | Horas | Línea presupuesto | Nota |
|---|---|---|---|
| SOÑAO.COM (sitio marca) | 12h | Separado de T1 | One-pager + sección torneos. Sin CMS |
| Prueba de carga 10K/20K | 12h | Incluido en T1 | Scripts + optimización infra + re-test + documentar capacidad. Costo infra adicional por cuenta de Barri |
| Soporte en vivo (botón in-app) | 3h | Incluido en T1 | Botón "Reportar problema" → notificación al equipo |
| HQ tiebreaker (criterio #7) | 10h | Incluido en T1 | Gameplay sincrónico, eliminación directa, WebSocket |

## Anti-cheat: notas legales de Barri

- **Videollamada verificación**: Barri duda de ejecutabilidad legal ("nervios" como excusa). Va a consultar con abogado.
- **Auditoría estadística**: Barri pregunta si se puede demostrar TÉCNICAMENTE que fue bot. Respuesta: alta probabilidad sí (patrones < 2s consistentes), certeza absoluta no. El reporte se diseña para ser robusto como evidencia.
- **Scoring oleadas**: RECHAZADO definitivamente. No se incluye en V3.1.

## Decisiones de sesión (2026-03-31)

1. ✅ Scoring modelo Barri (por dificultad, binario)
2. ✅ SOÑAO.COM 12h cotizado aparte
3. ✅ Prueba de carga 12h completa + costo infra Barri
4. ✅ Botón soporte in-app 3h
5. ✅ HQ tiebreaker 10h incluido
6. ✅ Anti-cheat tabla con notas legales
