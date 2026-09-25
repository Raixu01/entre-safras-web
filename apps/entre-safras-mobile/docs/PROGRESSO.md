# Progresso de implementação

24/09/2026 · aplicativo **0.1.0**, regras **0.1**, schema **1**.

Entregue uma candidata técnica jogável. M1–M3 implementados e verificados automaticamente. M4 depende de QA físico e da investigação de reabertura offline no Safari. M5 depende de participantes e hospedagem. Não é uma declaração de validação humana ou publicação.

| Tarefa / marco | Estado | Entregas, critérios e evidência | Próximo passo |
|---|---|---|---|
| T01 / M1 | concluída | CONTRATO, UX, matriz; rastreabilidade integral do catálogo e precedência registrada | Manter contrato se houver nova versão |
| T02 / M1 | concluída | Vite/TS estrito/Zod/PWA/Vitest/Playwright/ESLint, lockfile e Node LTS; instalação limpa e checks executados | Ativar CI quando houver repositório GitHub |
| T03 / M1 | concluída | Catálogo, tipos de fases/ações/comandos, PRNG e seletor público; testes aprovados | Manter versão do shuffle |
| T04 / M2 | concluída | Motor atômico, parcelas das contas, fixtures e finais; trajeto esperado confirmado | Preservar regressão ao evoluir regras |
| T05 / M2 | concluída | Snapshot, replay de validação, cópia anterior, quota, import/export, abas; testes aprovados | Testar persistência nos aparelhos reais |
| T06 / M3 | concluída | Layout nas quatro dimensões, ≥48 px, 200% texto, foco e teclado; capturas em dois motores | Complementar com teclado virtual físico em T11 |
| T07 / M3 | concluída | Cinco safras, troca de papéis, revisão, faixas e resultado; E2E Chromium/WebKit | Avaliar fluxo com jogadores |
| T08 / M3 | concluída | Tutorial isolado, guia, histórico, discussão, backup/relatório e repetição | Avaliar compreensão no playtest |
| T09 / M4 | em execução | PWA/cache, offline Chromium e atualização de dois builds aprovados; offline WebKit pendente | Investigar reabertura no Safari real |
| T10 / M4 | em execução | Arte completa, contraste calculado, foco/semântica/reduced-motion; leitura assistiva ainda não verificada | Executar VoiceOver/TalkBack |
| T11 / M4 | em execução | QA automatizado, regressão, capturas e tamanho medido; emulação não é aparelho real | Android/Chrome e iPhone/Safari físicos, instalado e latência |
| T12 / M5 | bloqueada | Protocolo e comparação de estratégias entregues; aguardando playtest | Reunir 3 grupos de 3 e uma dupla |
| T13 / M5 | bloqueada | Build e pacote prontos; guia de publicação/suporte/rollback | Definir projeto Cloudflare e destino HTTPS; publicar e verificar |

Critérios individualizados: [MATRIZ-REQUISITOS.md](MATRIZ-REQUISITOS.md). Ambiente e comandos: [QA-MOBILE.md](QA-MOBILE.md). Decisões: [CONTRATO.md](CONTRATO.md), [STACK.md](STACK.md), [UX-MOBILE.md](UX-MOBILE.md).

Decisões reversíveis: funções de tela em `src/main.ts`, componentes em `src/ui/components.ts`; separação do motor e storage preservada. Arte nativa SVG evita dependência externa. Não coletar apelidos é permitido, pois são opcionais. Tutorial conhecido usa chave própria. Aplicativo servido na raiz, conforme escopo do manifest.

Correções verificadas durante execução: comparação de JSON independente da ordem das propriedades; foco explícito nos botões para Safari/WebKit; renderizações de status não desmontam o disparador de diálogo; navegação inferior pode quebrar linha com texto ampliado; metadados de compatibilidade verificados antes da atualização. Instalação limpa inicialmente encontrou arquivo nativo bloqueado por um servidor de teste órfão; os processos deste projeto foram identificados/encerrados, e npm ci foi repetido com sucesso no Node LTS local.

Não houve alteração de balanceamento nem modificação dos documentos/protótipos de origem. Próxima tarefa externa prioritária: **T11 em aparelhos reais, incluindo o caso offline de T09**, seguida por T12 e publicação de T13.

## Registro de encerramento solicitado pelo usuário

Trabalho interrompido a pedido do usuário após a entrega da candidata técnica. Nenhuma publicação foi realizada.

- Código: `apps/entre-safras-mobile/`.
- Build estático: `apps/entre-safras-mobile/dist/`.
- Pacote distribuível: `output/entre-safras/entre-safras-mobile-0.1.0.zip` (63.976 bytes).
- Preview local verificado com HTTP 200 em http://localhost:4173; servidor estava ativo ao registrar. Esse endereço não é uma publicação pública.
- Verificação final: instalação limpa com Node 22.22.0, lint, tipos, 30 testes de domínio/persistência, build e 25 testes E2E aprovados; 1 cenário offline WebKit marcado pendente. A reexecução final do E2E terminou com código 0 e relatório HTML atualizado.
- Atualização entre dois builds reais aprovada; nenhuma recarga automática, falha de gravação bloqueia atualização, salvamento preservado.
- Catálogo original preservado byte a byte. Nenhuma mudança nas regras econômicas.
- Documentação: CONTRATO, STACK, UX-MOBILE, MATRIZ-REQUISITOS, QA-MOBILE, ASSETS, PLAYTEST, PUBLICACAO, NOTAS-DE-VERSAO e README.
- Pendências: reabertura offline Safari/WebKit, Android/iPhone reais, VoiceOver/TalkBack, latência em aparelho, quatro sessões humanas e destino/credenciais de hospedagem.

Para retomar: ler este registro e QA-MOBILE.md; não refazer implementação concluída. Priorizar T09/T11 em aparelhos reais, depois T12 e T13. Não marcar o planejamento inteiro como concluído enquanto essas evidências faltarem.
