# Napkin Runbook — GM Móveis (Next.js + Supabase)

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 20 items per category.
- Each item includes date + "Do instead".

## Mobile & Responsividade (Alta Prioridade)
1. **[2026-03-25] Espaçamentos grandes sem breakpoint mobile**
   Do instead: Sempre usar `py-16 md:py-32`, `py-20 md:py-40`, `pt-28 md:pt-48` — nunca só `py-32` ou `py-40`.

2. **[2026-03-25] Títulos grandes sem escala mobile**
   Do instead: Escala progressiva: `text-4xl md:text-5xl lg:text-6xl` — nunca começar em `text-5xl` ou maior sem breakpoint menor.

3. **[2026-03-25] Carousel arrows no ProjectCard**
   Do instead: `hidden md:block` nas setas — mobile usa swipe nativo, setas só no desktop com hover.

4. **[2026-03-25] Logo da Navbar h-24 sem responsividade**
   Do instead: `h-14 md:h-24` — logo menor no mobile.

## Stack & Arquitetura
1. **[2026-03-25] Dados vêm do Supabase com fallback para mockProjects**
   Do instead: Ao editar `data/mock.ts` ou o schema do Supabase, atualizar ambos os lados.

2. **[2026-03-25] ProjectCard e projetos/[id] compartilham `parseImageUrls` e `isVideo`**
   Do instead: Essas funções estão exportadas em `ProjectCard.tsx` e importadas na página de detalhe.

## Padrões de Design
1. **[2026-03-25] Paleta: primary (creme), secondary (escuro), accent (dourado/terroso)**
   Do instead: Consultar `tailwind.config` para tokens de cor antes de adicionar cores novas.
