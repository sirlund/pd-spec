# Ideation — Sync con Hugo (2026-02-23)

> Síntesis estructurada de una sesión de 2 horas entre Nico y Hugo (UX, Two Brains / Acid Labs).
> Nico hizo demo de PD-Spec v4.18+ con el dataset de TIMining (72 fuentes, 1200+ claims, 23 insights).

---

## A. Product Features (PD-Spec Engine)

### 1. LLM en el Frontend — Acciones desde el Dashboard

**Idea:** Integrar una API de LLM directamente en la Live Research App para que los usuarios puedan aprobar insights, resolver conflictos, hacer preguntas y ejecutar acciones sin salir del navegador.

**Evidencia:**
- Nico: *"La única paja que tiene este sistema todavía es que no puedes hacer ninguna acción real acá... todas esas se traducen en generar un prompt"*
- Nico: *"Ese flujo está, lo tengo ahí mapeado de que es un flujo roto"*
- Hugo: *"Le metería un LLM, eso sí"*
- Hugo: *"Creamos un token y lo consumimos de ahí"*

**Homer's Car:** PASS — dolor real, evidenciado en uso diario. Es el gap más grande entre MVP y producto usable por terceros.

**→ BL-80**

---

### 2. Google Drive Integration

**Idea:** Conectar Google Drive como fuente en vez de manejo local de archivos. Que el usuario vea su Drive en la app en vez de copiar archivos a `01_Sources/`.

**Evidencia:**
- Hugo: *"¿Y si podéis conectarle un drive mejor?"*
- Nico: *"Sí, está en el backlog... en vez de ir acá y hacer clic acá y abrir acá, es ver la Drive"*
- Hugo: *"Ahí no tendría que subir archivo, pero subí al drive"*

**Homer's Car:** PASS — fricción real en onboarding. Drive es donde la mayoría de los equipos ya tienen su documentación.

**→ BL-81**

---

### 3. BYOK (Bring Your Own Key)

**Idea:** Modelo donde los usuarios traen su propia API key (Claude, Gemini, GPT) para usar el LLM dentro de la app, o pagan por tokens a través de la plataforma.

**Evidencia:**
- Nico: *"Tú traes tu propia API key y ocupas tu LLM adentro"*
- Hugo: *"Creamos un API key... le metí un token y lo consumimos de ahí"*
- Nico: *"O tú traes tu propia API también. Pones tu API key"*

**Homer's Car:** PASS — prerequisito para SaaS y adopción por terceros. Se absorbe como parte de BL-80 (LLM integration).

**→ Absorbido en BL-80**

---

### 4. Notion MCP — Conectar Notion como fuente

**Idea:** Usar el MCP de Notion para traer documentación de equipos que trabajan en Notion.

**Evidencia:**
- Nico: *"Si un equipo trabaja en Notion, usamos el MSP de Notion y traer cosas de Notion"*

**Homer's Car:** DEFER — especulación de mercado, sin problema evidenciado. Necesita un segundo caso de uso real.

---

### 5. Figma/FigJam MCP — Traer research de Figma

**Idea:** Usar MCP de Figma para traer personas, sesiones de FigJam, notas de research.

**Evidencia:**
- Nico: *"Si alguien tiene documentación en Figma, también, MSP de Figma"*
- Hugo mencionó que su equipo usa Figma extensivamente

**Homer's Car:** DEFER — mismo caso que Notion. Sin problema evidenciado aún.

---

### 6. AI Output Audit — Verificación cruzada de herramientas

**Idea:** Modo de auditoría donde PD-Spec recibe outputs de otro AI tool (Gemini, ChatGPT) y los verifica contra fuentes primarias. Detecta hallucinations, inventos, inflaciones.

**Evidencia:**
- Nico demostró el análisis que hizo Claude de los outputs de Gemini para TIMining:
  - *"¿Dónde Gemini está inflado y no es verificable? Inventó. La gobernanza de datos automáticas, esto lo inventó totalmente"*
  - *"Todas las ideas que tiraba Gemini, Claude las hacía pico. No, esa wea no se puede hacer. No, esa hueva está sobresimplificada"*
- Hugo: *"Sí, me mostraste la otra vez, hizo como una evaluación del resultado de Gemini versus lo que detectaba él"*

**Homer's Car:** PASS — caso de uso demostrado con TIMining. Diferenciador competitivo fuerte ("nosotros no alucinamos, y además te decimos dónde otros alucinaron").

**→ BL-82**

---

### 7. Multi-LLM Comparison — Proyecto paralelo en Gemini vs Claude

**Idea:** Hacer el mismo proyecto de cero en Gemini 3.1 y comparar resultados con Claude.

**Evidencia:**
- Nico: *"Podría probar esto mismo, como hacer un proyecto de cero en Gemini 3.1. Y ver a qué llega"*

**Homer's Car:** DEFER — experimento de validación, no feature de producto.

---

## B. Product Vision (PD-Build / Ecosystem)

### 8. PD-Build — Design System como JSON Tokens

**Idea:** Sistema de diseño machine-readable (JSON tokens) que sea platform-agnostic (React, iOS, Vue, lo que sea). No componentes de Figma, sino reglas de diseño en lenguaje de máquina.

**Evidencia:**
- Nico: *"En vez de tener componentes tienes JSONs. El JSON del componente de botón. Agnóstico a dónde lo vaya a construir"*
- Nico: *"Sistema de diseño es un curso punto md, un cloud punto md, un sistema como este que le da reglas y arma la web"*
- Hugo: *"El sistema de diseño nació para cubrir una cosa que la IA ya resolvió"*

**Homer's Car:** PARK — Nico mismo relativizó: *"lo voté, es como idea"* y *"cualquiera lo puede hacer"*. Sin segundo caso de uso. Es visión a largo plazo, no necesidad actual.

---

### 9. Builder Integration — PD-Spec → Builder/v0

**Idea:** Que los outputs de PD-Spec (design rules, tokens) alimenten Builder, Bolt o v0 para implementación directa.

**Evidencia:**
- Hugo: *"Ocupamos builder... conectémosle la mente que está afuera"*
- Hugo: *"Lo que queremos es conectar el cerebro, que es lo que tiene este argentino"*
- Nico: *"Podría ser un prototipo, podría ser que te conectas a la base real de código y generes PRs"*

**Homer's Car:** PARK — depende de PD-Build. Sin evidencia de demanda real más allá de la conversación. Interesante pero prematuro.

---

### 10. Traceability Funnel — Visualización ruido → insights → principios

**Idea:** Gráfico tipo funnel que muestre desde las fuentes (ruido) hasta los principios de diseño (señal), pasando por claims e insights.

**Evidencia:**
- Nico: *"Un gráfico que te va mostrando hacia la izquierda todas las fuentes, como todo el ruido, y va cerrando hasta que llegás a los principios de diseño"*
- Hugo: *"Sí, pues, sí, sí, sí, sí"* — validación directa

**Homer's Car:** PASS — conecta con `/visualize` existente. Formaliza algo que ya está en el roadmap mental. Podría absorberse como un target de `/visualize`.

**→ Nota para /visualize roadmap**

---

## C. Go-to-Market / Strategy

### 11. SaaS / Hosted Version

**Idea:** Publicar la app (no solo localhost) con login, pagos, file upload, multi-tenant.

**Evidencia:**
- Hugo: *"¿Y esto es un localhost? ¿Lo podrías publicar? ¿Subí un y lo subí arriba?"*
- Nico: *"Le tendría que publicar... en una semana, dos semanas está"*
- Nico: *"Puede tener un login, puedo pagar, puedo cobrar un fee"*

**Homer's Car:** PASS — demanda directa. Prerequisito para cualquier go-to-market.

**→ BL-83**

---

### 12. Consulting Team Positioning

**Idea:** Posicionar PD-Spec como herramienta para equipos de consultoría UX/producto.

**Evidencia:**
- Hugo: *"Sí, pues, totalmente aplicable a consultoría"*
- Hugo: *"Esta agua la veo cien por cien LATAM"*
- Nico: *"Podría ser un producto para que equipos de producto de diferentes tipos de empresas lo adoptan"*

**Homer's Car:** PASS — validado por persona del target. No es un BL, es una dirección estratégica.

---

### 13. Piloto con Equipo Real

**Idea:** Hugo clona el repo, testea con un proyecto propio, luego se busca un equipo de consultoría para piloto.

**Evidencia:**
- Nico: *"Hugo, mira, hagamos un piloto con un equipo"*
- Hugo: *"Me puedo conseguir caleta de wea, y vamos a presentar esta wea"*
- Acuerdo: *"Juntémonos en la semana, te paso el repo"*

**Homer's Car:** NEXT ACTION — no necesita BACKLOG, es un paso inmediato.

---

### 14. LATAM Market Focus

**Idea:** Hugo ve oportunidad 100% en el mercado LATAM (Two Brains, Acid Labs, clientes corporativos).

**Evidencia:**
- Hugo: *"Esta agua la veo cien por cien LATAM"*
- Hugo mencionó equipos en LATAM Airlines, Banco BCI como potenciales

**Homer's Car:** SIGNAL — dirección estratégica, no accionable como feature.

---

### 15. Pitch Estratégico — "Argentine Approach"

**Idea:** Crear una presentación estratégica (no técnica) con frontend simple, pasos lineales, y resultados tangibles. Hugo notó que el "argentino" de Two Brains vende bien porque presenta así.

**Evidencia:**
- Hugo: *"Darle como una mirada más estratégica... sin explicar la complejidad"*
- Hugo sobre el argentino: *"Lo que hizo fue armar un front, le puso un logo arriba, y le fue poniendo paso a paso... sin explicar la complejidad de la mierda"*
- Hugo: *"No, no saben qué. Entonces, si va ahí, por eso te digo... como si va ahí donde los ejecutivos"*
- Nico: *"Hay que coger estrategia y vendérselo en su idioma"*

**Homer's Car:** PASS — Hugo ofreció ayuda directa.

**→ docs/PITCH_CONTENT.md**

---

## D. Validaciones de Hugo

| Señal | Cita textual |
|---|---|
| Calidad del producto | *"Terriblemente bueno"* (3+ veces) |
| Visión compartida | *"Este es el sueño"* — sobre consolidar herramientas dispersas |
| Aplicabilidad | *"Sí, pues, totalmente aplicable a consultoría"* |
| Market fit | *"Esta agua la veo cien por cien LATAM"* |
| Compromiso | *"Me puedo conseguir caleta de wea, y vamos a presentar esta wea"* |
| Disposición a testear | Ofreció clonar repo, aportar créditos LLM, testear con proyecto propio |
| Resistencia del mercado | *"Pura gente que no tiene idea, no le ven el valor"* — sobre gerentes que no entienden IA |
| Competitive intel | El "argentino" de Two Brains vende bien con frontend simple + resultados visibles |

---

## E. Próximos Pasos Acordados

1. **Hugo clona el repo** y testea con un proyecto propio
2. **Juntarse en la semana** para setup del worktree
3. **Agregar LLM al frontend** — Hugo ofrece crear API key y aportar créditos
4. **Nico habla con Joe** (Holdo/fintual) al día siguiente
5. **Hugo busca oportunidades** de presentación internamente en Two Brains / Acid Labs

---

## F. Ideas PARKED (Sin segundo caso de uso)

| Idea | Razón de PARK |
|---|---|
| PD-Build (design system JSON tokens) | Nico relativizó la idea. Sin demanda evidenciada. |
| Builder integration (PD-Spec → v0) | Depende de PD-Build. Prematuro. |
| Notion MCP | Especulación de mercado. Necesita caso real. |
| Figma/FigJam MCP | Ídem. |
| Multi-LLM comparison | Experimento, no feature. |

---

## Resumen de Outputs

| Output | Destino |
|---|---|
| BL-80: LLM Integration in Live Research App | `docs/BACKLOG.md` |
| BL-81: Google Drive Integration | `docs/BACKLOG.md` |
| BL-82: AI Output Audit Mode | `docs/BACKLOG.md` |
| BL-83: Hosted/SaaS Architecture | `docs/BACKLOG.md` |
| Pitch content | `docs/PITCH_CONTENT.md` |
| Ideas PARKED | Quedan en este documento como referencia |
