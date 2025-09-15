# Template de Experiencia Laboral

## Estructura estándar para experience.json

```json
{
  "id": [número],
  "company": "[Nombre de la empresa]",
  "position": "[Título del puesto]",
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD" | null,
  "current": true | false,
  "description": "[Descripción del contexto del producto/empresa y tu impacto general]",
  "responsibilities": [
    "[Responsabilidad técnica específica 1]",
    "[Responsabilidad técnica específica 2]",
    "[Responsabilidad de gestión/liderazgo]",
    "[Responsabilidad de integración/servicios externos]",
    "[Responsabilidad de optimización/mantenimiento]",
    "[Responsabilidad de documentación/procesos]",
    "[Responsabilidad de estándares/buenas prácticas]"
  ],
  "technologies": ["tech1", "tech2", "tech3", "tech4"],
  "achievements": [
    "[Logro técnico con impacto medible]",
    "[Logro de arquitectura/escalabilidad]",
    "[Logro de integración/implementación exitosa]",
    "[Logro de cumplimiento de estándares/seguridad]"
  ]
}
```

## Pautas de escritura

### Description (Contexto del producto/empresa)

- **Formato:** "[Empresa] es una [tipo de plataforma/producto] que [propósito principal], con [características distintivas]. Mi participación contribuyó a [impacto específico en arquitectura/producto]."
- **Elementos clave:**
  - Qué hace la empresa/producto
  - Sector de la industria (fintech, healthtech, etc.)
  - Valores/enfoques principales (seguridad, escalabilidad, etc.)
  - Tu contribución específica al contexto general

### Responsibilities (Responsabilidades técnicas)

- **Formato:** Comenzar con verbo en gerundio o sustantivo
- **Estructura:** Técnica específica + contexto + propósito
- **Ejemplos:**
  - "Desarrollo de sistema [tipo] para [propósito] con [características técnicas]"
  - "Implementación de [tecnología] para [usuarios/casos de uso] con [beneficios]"
  - "Integración con [servicio] para [funcionalidad] en [contexto]"

### Technologies (Stack técnico)

- **Formato:** Nombres técnicos exactos, en minúsculas
- **Orden sugerido:** Framework principal, lenguaje, base de datos, servicios externos, herramientas
- **Ejemplos:** ["nestjs", "typescript", "postgresql", "prisma", "jwt", "twilio"]

### Achievements (Logros e impacto)

- **Formato:** "[Acción exitosa] + [beneficio/impacto] + [contexto específico]"
- **Enfoque:** Resultados medibles, mejoras técnicas, cumplimiento de estándares
- **Ejemplos:**
  - "Estructuración exitosa de arquitectura [tipo] para [contexto específico]"
  - "Implementación de estándares de [área] para [sector/industria]"
  - "Garantía de cumplimiento de [estándares] en [contexto]"

## Tono y lenguaje consistente

### Verbos técnicos preferidos:

- Desarrollo, Implementación, Integración, Optimización, Mantenimiento
- Estructuración, Garantía, Aseguramiento, Diseño, Gestión

### Conectores profesionales:

- "con especial énfasis en", "garantizando", "asegurando"
- "mediante", "a través de", "para soportar"

### Terminología consistente:

- "sistema multi-tenant" (no "multitenant")
- "APIs RESTful" (no "REST APIs")
- "base de datos" (no "database")
- "servicios externos" (no "third-party services")
- "estándares de seguridad" (no "security standards")
