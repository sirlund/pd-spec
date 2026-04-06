#!/usr/bin/env python3
"""Generate Propuesta Triviapp V3.1 — Consolidado final (.docx)"""

from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT

doc = Document()

# -- Styles --
style = doc.styles['Normal']
style.font.name = 'Calibri'
style.font.size = Pt(11)
style.font.color.rgb = RGBColor(0x2D, 0x2D, 0x2D)
style.paragraph_format.space_after = Pt(6)
style.paragraph_format.line_spacing = 1.15

for level in range(1, 4):
    h = doc.styles[f'Heading {level}']
    h.font.name = 'Calibri'
    h.font.color.rgb = RGBColor(0x1A, 0x1A, 0x2E)

doc.styles['Heading 1'].font.size = Pt(18)
doc.styles['Heading 2'].font.size = Pt(14)
doc.styles['Heading 3'].font.size = Pt(12)

for section in doc.sections:
    section.top_margin = Cm(2.5)
    section.bottom_margin = Cm(2.5)
    section.left_margin = Cm(2.5)
    section.right_margin = Cm(2.5)


def add_table(headers, rows, bold_last_row=False):
    table = doc.add_table(rows=1 + len(rows), cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.style = 'Light Grid Accent 1'
    for i, h in enumerate(headers):
        cell = table.rows[0].cells[i]
        cell.text = h
        for p in cell.paragraphs:
            for r in p.runs:
                r.bold = True
                r.font.size = Pt(10)
    for ri, row in enumerate(rows):
        is_last = (ri == len(rows) - 1) and bold_last_row
        for ci, val in enumerate(row):
            cell = table.rows[ri + 1].cells[ci]
            cell.text = val
            for p in cell.paragraphs:
                for r in p.runs:
                    r.font.size = Pt(10)
                    if is_last:
                        r.bold = True
    doc.add_paragraph()


def add_note(text):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.italic = True
    run.font.size = Pt(9)
    run.font.color.rgb = RGBColor(0x66, 0x66, 0x66)


# ============================================================
# TITLE
# ============================================================
title = doc.add_heading('Propuesta Triviapp V3.1 — Consolidado Final', level=1)
title.alignment = WD_ALIGN_PARAGRAPH.CENTER

meta = doc.add_paragraph()
meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
meta.add_run('Preparado por: ').bold = True
meta.add_run('Nicolás Lundin\n')
meta.add_run('Cliente: ').bold = True
meta.add_run('Marcelo "Barri" Ibáñez\n')
meta.add_run('Fecha: ').bold = True
meta.add_run('Marzo 2026\n')
meta.add_run('Versión: ').bold = True
meta.add_run('3.1 — Incorpora feedback del cliente sobre mecánica, scoring y anti-cheat')

doc.add_paragraph()

# ============================================================
# 1. CONTEXTO
# ============================================================
doc.add_heading('1. Contexto', level=1)

doc.add_paragraph(
    'Esta propuesta consolida la V3 (Lean) con el feedback del cliente sobre mecánica '
    'del torneo, modelo de scoring y estrategia anti-cheat. Los cambios principales son:'
)

items_cambios = [
    'Modelo de scoring simplificado: puntos por nivel de dificultad (25/50/100/150) en vez de puntaje graduado por alternativa',
    'Feedback inmediato por pregunta (scoring por oleadas descartado)',
    'Cascada de desempate ampliada a 7 criterios + modo HQ eliminación directa',
    'Sitio de marca SOÑAO.COM (cotizado aparte)',
    'Prueba de carga para 10K/20K jugadores simultáneos',
    'Botón de soporte en vivo durante el torneo',
    'Tabla de opciones anti-cheat con notas legales',
]
for item in items_cambios:
    doc.add_paragraph(item, style='List Bullet')

doc.add_page_break()

# ============================================================
# 2. MECANICA DEL TORNEO
# ============================================================
doc.add_heading('2. Mecánica del torneo', level=1)

doc.add_heading('Descripción general', level=2)
doc.add_paragraph(
    'El torneo dura 45 minutos en formato self-paced. Todos los participantes '
    'empiezan al mismo tiempo. Cada jugador avanza a su propio ritmo respondiendo '
    'preguntas con un máximo de 30 segundos por pregunta. El que responde más '
    'rápido y correctamente llega a más preguntas. Al terminar los 45 minutos, '
    'el sistema congela el estado de todos los jugadores y calcula el ranking final.'
)

doc.add_paragraph(
    'El servidor registra cuatro variables por respuesta: cuándo respondió, qué '
    'alternativa eligió, si fue correcta o incorrecta, y cuánto tiempo tardó. '
    'No hay sincronización en tiempo real entre jugadores, lo que mantiene la '
    'arquitectura simple y robusta.'
)

doc.add_heading('Estructura de preguntas', level=2)
doc.add_paragraph(
    'Las preguntas se organizan en bloques de 5, cada uno compuesto por '
    'F-F-M-D-M (2 fáciles, 1 media, 1 difícil, 1 media). Cada dos bloques '
    'se intercala una pregunta social (~1 cada 10 preguntas).'
)

doc.add_paragraph(
    'El orden interno de cada bloque se aleatoriza por jugador, con una restricción: '
    'nunca pueden quedar dos preguntas de dificultad media consecutivas en la unión '
    'entre bloques. El orden de los bloques es el mismo para todos los jugadores '
    'por razones legales de igualdad de condiciones.'
)

add_table(
    ['Parámetro', 'Valor'],
    [
        ['Duración del torneo', '45 minutos'],
        ['Tiempo máximo por pregunta', '30 segundos'],
        ['Banco de preguntas mínimo', '702 preguntas'],
        ['Patrón de bloques', 'F-F-M-D-M + social cada 2 bloques'],
        ['Distribución', '40% fáciles / 30% medias / 20% difíciles / 10% sociales'],
        ['Penalización por error', 'No (solo cuenta para desempate)'],
        ['Feedback', 'Inmediato — correcto/incorrecto + puntos tras cada respuesta'],
    ],
)

add_table(
    ['Distribución del banco (702)', 'Cantidad'],
    [
        ['Fáciles (40%)', '281'],
        ['Medias (30%)', '211'],
        ['Difíciles (20%)', '140'],
        ['Sociales (10%)', '70'],
    ],
)

doc.add_heading('Pantalla del jugador', level=2)
add_table(
    ['Elemento', 'Descripción'],
    [
        ['Pregunta + opciones', 'Centro de pantalla'],
        ['Mis puntos acumulados', 'Actualización inmediata tras cada respuesta'],
        ['Indicador correcto/incorrecto', 'Inmediato tras cada respuesta'],
        ['Barra de progreso 45 min', 'Avanza continuamente'],
        ['Contador regresivo 30 seg', 'Reinicia con cada pregunta'],
    ],
)

doc.add_heading('Timeout', level=2)
doc.add_paragraph(
    'Si un jugador no responde dentro de 30 segundos, la pregunta avanza '
    'automáticamente como incorrecta (0 puntos, sin bonus). Esto limita el '
    'banco necesario y agrega tensión visual mediante el contador regresivo.'
)

doc.add_page_break()

# ============================================================
# 3. SCORING
# ============================================================
doc.add_heading('3. Scoring y desempate', level=1)

doc.add_heading('Scoring por dificultad', level=2)
doc.add_paragraph(
    'Cada pregunta otorga puntos según su nivel de dificultad cuando la respuesta '
    'es correcta. Las respuestas incorrectas suman 0 puntos (sin penalización '
    'en el puntaje — los errores solo cuentan como criterio de desempate).'
)

add_table(
    ['Dificultad', 'Puntos por acierto'],
    [
        ['Fácil', '25 puntos'],
        ['Media', '50 puntos'],
        ['Difícil', '100 puntos'],
        ['Social', '150 puntos'],
    ],
)

doc.add_heading('Bonus de tiempo', level=2)
doc.add_paragraph(
    'Los segundos restantes al responder se convierten en puntos bonus, pero '
    'solo cuando la respuesta es correcta. Cada segundo que sobra es un punto extra.'
)

add_table(
    ['Dificultad', 'Respuesta en 5s', 'En 15s', 'En 25s', 'En 30s (timeout)'],
    [
        ['Fácil (25 pts)', '25 + 25 = 50', '25 + 15 = 40', '25 + 5 = 30', '0 (timeout)'],
        ['Media (50 pts)', '50 + 25 = 75', '50 + 15 = 65', '50 + 5 = 55', '0'],
        ['Difícil (100 pts)', '100 + 25 = 125', '100 + 15 = 115', '100 + 5 = 105', '0'],
        ['Social (150 pts)', '150 + 25 = 175', '150 + 15 = 165', '150 + 5 = 155', '0'],
        ['Incorrecta (cualquiera)', '0', '0', '0', '0'],
    ],
)

doc.add_heading('Cascada de desempate', level=2)
doc.add_paragraph(
    'Con scoring por dificultad + bonus de tiempo los empates son extremadamente '
    'raros, pero si ocurren se aplica la siguiente cascada en orden:'
)

add_table(
    ['#', 'Criterio', 'Qué premia'],
    [
        ['1', 'Mayor número de aciertos', 'Conocimiento'],
        ['2', 'Menor tiempo total en respuestas correctas', 'Velocidad'],
        ['3', 'Mayor % aciertos en preguntas difíciles', 'Dominio profundo'],
        ['4', 'Mayor % aciertos en preguntas medias', 'Solidez'],
        ['5', 'Mayor % aciertos en preguntas fáciles', 'Consistencia'],
        ['6', 'Menos errores totales', 'Precisión'],
        ['7', 'Torneo de desempate — eliminación directa estilo HQ Trivia',
         'Una respuesta incorrecta = eliminado'],
    ],
)

doc.add_paragraph(
    'Todos los criterios se informan al jugador antes del torneo en los términos '
    'y condiciones, permitiendo decisiones estratégicas informadas.'
)

add_note(
    'El criterio #7 (torneo HQ) se activa solo si los 6 criterios anteriores no '
    'resuelven el empate. Requiere gameplay sincrónico entre los empatados.'
)

doc.add_page_break()

# ============================================================
# 4. PREGUNTAS SOCIALES
# ============================================================
doc.add_heading('4. Preguntas sociales', level=1)

doc.add_paragraph(
    'Las preguntas sociales son preguntas de opinión sin respuesta correcta '
    'predefinida — por ejemplo, "¿cuál es el mejor álbum de Metallica?". '
    'La respuesta correcta la determina la mayoría de los participantes al '
    'finalizar el torneo.'
)

doc.add_heading('Formatos', level=2)
items_formatos = [
    'Opciones predefinidas: el jugador elige entre alternativas fijas. La opción más elegida gana por conteo simple.',
    'Texto libre: el jugador escribe su respuesta. Al cierre, un modelo de lenguaje (Claude/GPT-4) agrupa respuestas por significado equivalente, resolviendo variantes de escritura e idioma. Costo: ~$0.10-$0.50 USD por torneo.',
]
for item in items_formatos:
    doc.add_paragraph(item, style='List Bullet')

doc.add_heading('Experiencia de usuario', level=2)
doc.add_paragraph(
    'Las preguntas sociales requieren tratamiento visual diferenciado para evitar '
    'conflicto cognitivo con las preguntas de conocimiento:'
)

items_ux_social = [
    'Diseño visual diferenciado: color, ícono y etiqueta propios que identifican la pregunta social antes de leerla.',
    'Etiqueta personalizada por comunidad: "¿Qué decide la familia Metallica?" / "¿Qué deciden las Swifties?". Configurable por torneo.',
    'Micro-copy explicativo: "La comunidad decide la respuesta correcta al final del torneo".',
    'Acuse de recibo: "Tu respuesta fue registrada. Sabrás qué decidió la familia Metallica al final del torneo." — confirma que la respuesta llegó y será considerada.',
]
for item in items_ux_social:
    doc.add_paragraph(item, style='List Bullet')

doc.add_page_break()

# ============================================================
# 5. ANTI-CHEAT
# ============================================================
doc.add_heading('5. Estrategia anti-cheat', level=1)

doc.add_paragraph(
    'El torneo no va a ser inhackeable — eso es imposible en web. La estrategia '
    'es crear capas de defensa que hagan que el esfuerzo de hacer trampa no '
    'justifique el riesgo de ser descalificado. Las medidas se organizan en dos '
    'grupos: las que no cuestan horas de desarrollo y las opcionales que sí.'
)

doc.add_heading('Capa base: $0 desarrollo', level=2)

add_table(
    ['#', 'Medida', 'Tipo', 'Detalle'],
    [
        ['1', 'Server-authoritative', 'Arquitectura',
         'Las respuestas correctas nunca viajan al cliente. El servidor valida cada respuesta, '
         'registra timestamps server-side, y rechaza respuestas con latencia < 2 segundos.'],
        ['2', 'Preguntas servidas de a una', 'Arquitectura',
         'Cada pregunta se entrega individualmente al responder la anterior. '
         'Nadie puede descargar el banco completo.'],
        ['3', '1 cuenta por RUT', 'Arquitectura',
         'Registro vinculado a RUT único. Previene cuentas múltiples del mismo jugador.'],
        ['4', 'Sesión única concurrente', 'Arquitectura',
         'Login desde otro dispositivo mata la sesión anterior. Un jugador = un dispositivo.'],
        ['5', 'T&C: derecho a descalificar', 'Legal',
         'Los términos y condiciones establecen que el organizador se reserva el derecho '
         'de verificar la identidad y descalificar participantes. Requiere revisión por '
         'abogado civilista.'],
        ['6', 'Verificación del ganador (videollamada)', 'Proceso',
         '10 minutos: se le pide al ganador que responda de memoria preguntas del torneo. '
         'Anunciado en T&C antes de la compra. Efecto disuasivo alto.'],
        ['7', 'Mix de tipos de pregunta', 'Contenido',
         'Texto + imagen + audio + hiperlocal + social. Si 40% de las preguntas resisten AI '
         '(imagen, audio, hiperlocal), el cheater pierde ventaja significativa. '
         'Es trabajo de contenido, no de desarrollo.'],
    ],
)

doc.add_heading('Notas legales del cliente', level=3)
doc.add_paragraph(
    'Verificación por videollamada: el cliente observa que un jugador podría alegar '
    'nerviosismo u otra excusa para no responder bien en la verificación, lo que '
    'dificultaría quitarle el premio legalmente. Se consultará con equipo legal.'
)
doc.add_paragraph(
    'Auditoría estadística: el cliente pregunta si es posible demostrar técnicamente '
    'que un jugador usó bot. Respuesta: se puede demostrar con alta probabilidad '
    '(patrones de respuesta < 2 segundos consistentes, secuencias estadísticamente '
    'imposibles para humanos), pero no con certeza absoluta. El reporte se diseña '
    'para ser robusto como evidencia técnica ante una disputa.'
)

doc.add_heading('Opciones adicionales (desarrollo)', level=2)

add_table(
    ['#', 'Medida', 'Horas', 'Costo CLP', 'Qué hace'],
    [
        ['8', 'Orden aleatorio dentro del bloque', '+3h', '+$82.500',
         'Cada jugador recibe las preguntas de cada bloque en orden distinto. '
         'Los bloques van en el mismo orden para todos (igualdad legal). '
         'Neutraliza parcialmente scout+champion.'],
        ['9', 'Device fingerprint básico', '+1h', '+$27.500',
         'Registra identificador único del dispositivo. Detecta si el mismo '
         'dispositivo juega con múltiples cuentas.'],
        ['10', 'Auditoría estadística top 10', '+3h', '+$82.500',
         'Al cerrar el torneo, antes de anunciar ganador, se analizan los patrones '
         'del top 10: tiempo de respuesta, secuencias, consistencia. Se genera '
         'reporte con evidencia técnica para cada caso sospechoso.'],
        ['', 'Total opciones anti-cheat', '+7h', '+$192.500', ''],
    ],
    bold_last_row=True,
)

add_note(
    'Recomendación: incluir las 3 opciones. El costo es bajo ($192.500) y la '
    'combinación de orden aleatorio + auditoría + fingerprint cubre los vectores '
    'más probables. Sin estas medidas, la capa base depende exclusivamente de '
    'la verificación por videollamada, cuya ejecutabilidad legal está en revisión.'
)

doc.add_heading('Qué NO se incluye (y por qué)', level=2)
add_table(
    ['Defensa descartada', 'Razón'],
    [
        ['Scoring por oleadas (feedback diferido)', 'Rechazado por cliente: pierde el momento "¡SÍ!", genera frustración, '
         'elimina feedback de aprendizaje. Los argumentos UX superan el beneficio anti-cheat.'],
        ['Renderizar preguntas como canvas/imagen', 'GPT-4V lee screenshots. Apuntar el teléfono a la pantalla esquiva cualquier '
         'protección de DOM. Esfuerzo alto, efectividad nula.'],
        ['Detectar DevTools abierto', 'Un cheater mínimamente técnico no necesita DevTools. Se esquiva con extensiones.'],
        ['Behavioral biometrics', 'Complejidad enorme, muchos falsos positivos, fácil de imitar con scripts.'],
        ['Disable copy-paste', 'Basta con apuntar teléfono a la pantalla. Solo molesta al usuario legítimo.'],
        ['Anti-bot / headless detection', 'Bots modernos (Playwright+stealth) son indetectables. Carrera armamentista imposible para MVP.'],
        ['Proctoring con webcam', 'Mata la experiencia de juego. Apropiado para exámenes, no para entretenimiento.'],
        ['CAPTCHA durante el juego', 'Rompe el flow completamente.'],
        ['Tiempo mínimo forzado', 'Penaliza al fan legítimo que sabe la respuesta rápido.'],
    ],
)

doc.add_page_break()

# ============================================================
# 6. QUE INCLUYE LEAN V3.1
# ============================================================
doc.add_heading('6. Qué incluye la propuesta Lean V3.1', level=1)

doc.add_heading('Incluido en Torneo 1', level=2)
items_incluye = [
    'Motor de juego completo: scoring por dificultad, bonus de tiempo, bloques F-F-M-D-M, preguntas sociales con clustering LLM al cierre',
    'Cascada de desempate (7 criterios + modo HQ eliminación directa)',
    'Feedback inmediato por pregunta (correcto/incorrecto + puntos)',
    'Landing dedicada al torneo con módulo de compra de tickets (MercadoPago)',
    'Demo interactiva en landing — 5-6 preguntas que muestran el flujo real',
    'Bloques temáticos con mensajes de narrador por bloque',
    'UX diferenciada para preguntas sociales (diseño visual, etiqueta comunidad, micro-copy, acuse de recibo)',
    'Guiños de audio temáticos (riff de intro, pantalla de resultados)',
    'Animaciones CSS y micro-interactions profesionales',
    'Optimizado para móvil (web responsive, no PWA)',
    'Autenticación por magic link (Supabase built-in)',
    'Friends & family pre-torneo',
    'Anti-cheat capa base (server-authoritative, 1 cuenta/RUT, sesión única, preguntas de a una)',
    'Prueba de carga para 10K/20K jugadores simultáneos',
    'Botón "Reportar problema" in-app durante torneo',
    'Revisión de seguridad dev senior (reducida — menor superficie de ataque)',
]
for item in items_incluye:
    doc.add_paragraph(item, style='List Bullet')

doc.add_heading('Cotizado aparte', level=2)
items_aparte = [
    'SOÑAO.COM — sitio de marca (ver presupuesto)',
    'Opciones anti-cheat adicionales (ver sección 5)',
]
for item in items_aparte:
    doc.add_paragraph(item, style='List Bullet')

doc.add_heading('Diferido post-validación', level=2)
items_difiere = [
    'Panel de administración / CMS',
    'Theming configurable',
    'Sistema de diseño completo (DS)',
    'PWA (service workers, installable)',
    'Rive avanzado',
    'Sound design UI completo',
]
for item in items_difiere:
    doc.add_paragraph(item, style='List Bullet')

doc.add_page_break()

# ============================================================
# 7. PRESUPUESTO
# ============================================================
doc.add_heading('7. Presupuesto', level=1)

doc.add_heading('Torneo 1 — Para arrancar', level=2)

add_table(
    ['Ítem', 'Horas', 'CLP brutos'],
    [
        ['Branding (logo, isotipo, styleguide)', '20h', '$550.000'],
        ['Motor core (scoring, bloques, sociales, LLM, ranking)', '25h', '$687.500'],
        ['Landing + módulo compra tickets (MercadoPago)', '8h', '$220.000'],
        ['Demo interactiva', '6h', '$165.000'],
        ['UI/UX (CSS animations, micro-interactions)', '5h', '$137.500'],
        ['Guiños audio temáticos', '2h', '$55.000'],
        ['Infraestructura + Supabase + magic link', '5h', '$137.500'],
        ['Anti-cheat base + validación server', '2h', '$55.000'],
        ['Revisión dev senior (reducida)', '3h', '$82.500'],
        ['QA + Friends & Family', '4h', '$110.000'],
        ['Desempate HQ (criterio #7 — eliminación directa)', '10h', '$275.000'],
        ['Prueba de carga 10K/20K', '12h', '$330.000'],
        ['Botón soporte en vivo in-app', '3h', '$82.500'],
        ['Total Torneo 1', '105h', '$2.887.500'],
    ],
    bold_last_row=True,
)

add_note(
    'Tarifa: $27.500 CLP/h bruto (incluye retención BH 15,25%). '
    'Forma de pago: 50% inicio, 50% contra entrega, por torneo.'
)

doc.add_heading('Opciones anti-cheat adicionales (recomendadas)', level=2)

add_table(
    ['Opción', 'Horas', 'CLP brutos'],
    [
        ['Orden aleatorio dentro del bloque', '+3h', '+$82.500'],
        ['Device fingerprint básico', '+1h', '+$27.500'],
        ['Auditoría estadística top 10', '+3h', '+$82.500'],
        ['Total opciones anti-cheat', '+7h', '+$192.500'],
    ],
    bold_last_row=True,
)

doc.add_heading('SOÑAO.COM — Sitio de marca', level=2)

add_table(
    ['Ítem', 'Horas', 'CLP brutos'],
    [
        ['One-pager: hero + qué es Soñao + sección torneos + footer', '12h', '$330.000'],
    ],
)

add_note(
    'Responsive, sin CMS. Se actualiza por el desarrollador cuando hay nuevo torneo. '
    'Puede ejecutarse en paralelo con el desarrollo del torneo.'
)

doc.add_heading('Resumen de inversión', level=2)

add_table(
    ['Concepto', 'Horas', 'CLP brutos'],
    [
        ['Torneo 1 (base)', '105h', '$2.887.500'],
        ['+ Anti-cheat opcionales (recomendado)', '+7h', '+$192.500'],
        ['+ SOÑAO.COM', '+12h', '+$330.000'],
        ['Total con todo', '124h', '$3.410.000'],
    ],
    bold_last_row=True,
)

doc.add_heading('3 pilotos completos', level=2)

add_table(
    ['Ítem', 'Horas', 'CLP brutos'],
    [
        ['Torneo 1 (con anti-cheat + SOÑAO.COM)', '124h', '$3.410.000'],
        ['Torneo 2 (clone + ajuste visual)', '14h', '$385.000'],
        ['Torneo 3 (clone + ajuste visual)', '14h', '$385.000'],
        ['Total 3 pilotos', '152h', '$4.180.000'],
    ],
    bold_last_row=True,
)

doc.add_heading('Costos operativos (por cuenta del cliente)', level=2)

add_table(
    ['Concepto', 'Costo estimado'],
    [
        ['Infraestructura Supabase', '~$25-50 USD/mes (puede requerir upgrade para 10K+ conexiones)'],
        ['Dominio soñao.com', '~$12 USD/año'],
        ['LLM preguntas sociales', '~$0.50 USD por torneo'],
        ['Assets fotográficos', '5-8 fotos por torneo ($1-15 USD/imagen en stock)'],
        ['Pasarela de pago (MercadoPago)', 'Comisión por transacción (~3.5% + IVA)'],
    ],
)

add_note(
    'La prueba de carga puede revelar necesidad de upgrade de infraestructura. '
    'El costo adicional de infra corre por cuenta del cliente.'
)

doc.add_page_break()

# ============================================================
# 8. COMPARATIVA CON V3.0
# ============================================================
doc.add_heading('8. Qué cambió respecto a la V3.0', level=1)

add_table(
    ['Aspecto', 'V3.0', 'V3.1'],
    [
        ['Scoring', 'Graduado por alternativa (+5/+1/0/-2)', 'Por dificultad (F=25, M=50, D=100, S=150)'],
        ['Penalización', '-2 pts por trampa', '0 pts (errores solo para desempate)'],
        ['Feedback', 'Scoring por oleadas (propuesto)', 'Inmediato por pregunta'],
        ['Desempate', '3 criterios', '7 criterios + HQ eliminación directa'],
        ['Banco preguntas', '~440', '702 mínimo'],
        ['Anti-cheat', 'Stack conceptual', 'Tabla de opciones con costos y notas legales'],
        ['SOÑAO.COM', 'Diferido', 'Cotizado aparte (12h)'],
        ['Prueba de carga', 'No incluida', '12h incluidas en T1'],
        ['Soporte en vivo', 'No incluido', 'Botón in-app (3h)'],
        ['HQ tiebreaker', 'No incluido', '10h incluidas en T1'],
        ['Para arrancar T1', '80h · $2.200.000', '105h · $2.887.500 (sin opcionales)'],
        ['Con todo', 'N/A', '124h · $3.410.000'],
    ],
)

doc.add_page_break()

# ============================================================
# 9. TIMELINE
# ============================================================
doc.add_heading('9. Timeline estimado', level=1)

add_note('Estimación con margen. Sujeto a disponibilidad de contenido y assets por parte del cliente.')

add_table(
    ['Semana', 'Entregable'],
    [
        ['1', 'Branding: logo, isotipo, styleguide. Setup infraestructura (Supabase, deploy). SOÑAO.COM en paralelo.'],
        ['2-3', 'Motor core: scoring por dificultad, bloques, preguntas sociales, timer, ranking, UX social diferenciada.'],
        ['3-4', 'Landing torneo: preventa, MercadoPago, demo interactiva. Modo HQ tiebreaker.'],
        ['4-5', 'Integración: audio, anti-cheat (base + opcionales), sesión concurrente, botón soporte, revisión dev senior.'],
        ['5-6', 'Prueba de carga 10K/20K + optimización infra + ajustes.'],
        ['6', 'QA + Friends & Family: test controlado, correcciones, planes de contingencia.'],
        ['6+', 'Torneo 1 en vivo.'],
    ],
)

doc.add_paragraph(
    'Torneos 2 y 3 se ejecutan después del primero, con un estimado de '
    '1-2 semanas cada uno para clone, ajuste visual y carga de contenido.'
)

doc.add_page_break()

# ============================================================
# 10. PREREQUISITOS
# ============================================================
doc.add_heading('10. Para arrancar necesitamos', level=1)

items_prereqs = [
    'Temática del primer torneo y comunidad target',
    'Banco de preguntas: 702 preguntas con 4 alternativas, clasificadas por dificultad '
    '(distribución: 40% fáciles, 30% medias, 20% difíciles, 10% sociales)',
    'Assets fotográficos: 5-8 fotos bajo licencia o propias para el torneo',
    'Definición de premio y coordinación con operadora de viajes',
    'Marco legal: términos y condiciones del torneo (abogado civilista), '
    'clasificación como juego de habilidad (no azar), límites de propiedad intelectual',
    'Estructura tributaria definida',
    'Pasarela de pagos: cuenta MercadoPago activa',
    'Dominio soñao.com activo y apuntado',
    'Definición sobre ejecutabilidad legal de verificación por videollamada (equipo legal del cliente)',
]
for item in items_prereqs:
    doc.add_paragraph(item, style='List Bullet')

add_note(
    'El desarrollo puede arrancar en paralelo con algunos de estos puntos, '
    'pero el torneo no puede ejecutarse sin todos resueltos. '
    'El tema del primer torneo se necesita antes de la semana 3 de desarrollo.'
)

doc.add_page_break()

# ============================================================
# 11. CONDICIONES
# ============================================================
doc.add_heading('11. Condiciones generales', level=1)

items_condiciones = [
    'Forma de pago: 50% al inicio, 50% contra entrega, por torneo.',
    'Propiedad intelectual: se ceden todos los derechos patrimoniales del código, '
    'diseño y marca al cliente una vez finalizado el pago.',
    'Costos de infraestructura a cargo del cliente (ver sección 7).',
    'Costo operativo LLM para preguntas sociales: ~$0.50 USD por torneo.',
    'Marco legal: la trivia se clasifica como juego de habilidad (no azar).',
    'Cláusula de flexibilidad: si durante el desarrollo surgen nuevos requerimientos '
    'que excedan la bolsa inicial, se acordará una ampliación de horas bajo la misma tarifa base.',
]
for item in items_condiciones:
    doc.add_paragraph(item, style='List Bullet')

doc.add_page_break()

# ============================================================
# 12. CAMINO A FUTURO
# ============================================================
doc.add_heading('12. Camino a futuro: de Lean a Pro', level=1)

doc.add_paragraph(
    'Si los pilotos validan el modelo y se asegura inversión, la plataforma se '
    'escala a nivel Pro. El upgrade se hace sobre un motor probado en producción '
    'y con datos reales de 3 torneos.'
)

add_table(
    ['Fase', 'Horas', 'CLP brutos'],
    [
        ['Lean V3.1 — 3 pilotos (con todo)', '152h', '$4.180.000'],
        ['Upgrade a Pro (admin, CMS, theming, DS, PWA, Rive, sound design)', '85h', '$2.337.500'],
        ['Total acumulado', '237h', '$6.517.500'],
    ],
    bold_last_row=True,
)

doc.add_heading('Qué incluye el upgrade', level=2)
items_upgrade = [
    'Admin/CMS: panel completo para gestión de preguntas y torneos',
    'Theming configurable (colores, tipografía, dark/light)',
    'Sistema de diseño completo (upgrade desde styleguide)',
    'PWA (service workers, installable, offline)',
    'Rive avanzado (upgrade desde CSS animations)',
    'Sound design UI completo',
    'Integración y QA',
]
for item in items_upgrade:
    doc.add_paragraph(item, style='List Bullet')

doc.add_page_break()

# ============================================================
# 13. RESUMEN EJECUTIVO
# ============================================================
doc.add_heading('13. Resumen ejecutivo', level=1)

add_table(
    ['', 'V3.0 Lean', 'V3.1 Lean (esta propuesta)'],
    [
        ['Para arrancar (T1 base)', '$2.200.000 (80h)', '$2.887.500 (105h)'],
        ['T1 + anti-cheat + SOÑAO.COM', 'N/A', '$3.410.000 (124h)'],
        ['3 pilotos con todo', '$2.970.000 (108h)', '$4.180.000 (152h)'],
        ['Con plataforma Pro completa', '$5.307.500 (193h)', '$6.517.500 (237h)'],
    ],
)

doc.add_paragraph(
    'El incremento de V3.0 a V3.1 ($1.210.000 en 3 pilotos) se explica por: '
    'prueba de carga 10K/20K (+12h), modo HQ de desempate (+10h), sitio SOÑAO.COM (+12h), '
    'soporte in-app (+3h) y anti-cheat adicional (+7h). Todo lo nuevo es funcionalidad '
    'que el cliente solicitó explícitamente.'
)

# ============================================================
# FOOTER
# ============================================================
doc.add_paragraph()
doc.add_paragraph()
p_footer = doc.add_paragraph()
p_footer.add_run(
    'Este documento es un borrador de trabajo para discusión. '
    'Los valores y alcances quedan sujetos a confirmación en reunión.'
).italic = True

# Save
output_path = '/Users/nlundin/Dev/repos/pds--triviapp/03_Outputs/Propuesta_Triviapp_V3_1.docx'
doc.save(output_path)
print(f'Saved to {output_path}')
