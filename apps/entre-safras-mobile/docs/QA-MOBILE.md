# QA da candidata 0.1.0

Execução em 24/09/2026, Windows 10 Pro, Node local 22.22.0, npm 11.12.1. Chromium **153.0.8010.12** (Playwright build 1243), WebKit **26.6** (build 2359), Playwright 1.63.0. Perfis Pixel 7 e iPhone 13 são **emulação**, não aparelhos físicos.

| Verificação | Resultado observado |
|---|---|
| Instalação limpa `npm ci --no-audit --no-fund` | Aprovada com Node LTS local; 461 pacotes. Primeiro ensaio encontrou EPERM de arquivo nativo em uso; corrigido encerrando os processos órfãos deste projeto, sem apagar arquivos do usuário. |
| `npm run lint` | Aprovado. |
| `npm run typecheck` | Aprovado, TypeScript estrito. |
| `npm test` | 30 testes aprovados em três arquivos. |
| `npm run build` | Aprovado; 33 entradas no precache, aproximadamente 148,73 KiB. |
| `npm run test:e2e` | 25 cenários aprovados; 1 marcado fixme (offline WebKit, descrito abaixo). |
| `npm run test:update` | Aprovado; builds distintos qa-a/qa-b, ativação explícita, quota bloqueia, save preservado byte a byte. Evidência em update-qa.json. |
| `node scripts/metrics.mjs` | JS total dos bundles 40.819 bytes gzip / orçamento 250.000; dist completo 170.532 bytes / orçamento precache 5.000.000. O total dist é uma estimativa conservadora maior que o precache. |
| SHA-256 do catálogo | Cópia local idêntica ao original: 11D638D6885ECB4F50AC9160B287DA9516574F0363280CABE37FCF032138752E. |

Evidências: `tests/domain/`, `tests/persistence/`, `tests/e2e/`, `tests/fixtures/reference.ts`, `capturas/`, `metricas.json`, `update-qa.json`, `analise-estrategias.json`, relatório HTML em `../playwright-report/index.html` após execução. Testes de domínio cobrem exemplos, cinco safras, proteções/limites, transferência, projeto coletivo, encerramento e idempotência; persistência cobre fases, adulteração, limite, versões, recuperação e storage indisponível.

E2E: partida nova, tutorial sem sobrescrever save, revisão, ajuda/Voltar, cinco safras e vitória, custos e caixas por safra, derrota ambiental e financeira, cooperativa incompleta, destinatário, retomada por fase, corrupção, importação inválida, segunda aba, quota, teclado Enter/Escape, Voltar em diálogo, rotação e toque repetido. Fluxo de tutorial monitorado sem pageerror. No Chromium foi possível preparar cache, fechar a página, reabrir offline, iniciar, retomar e concluir uma sequência completa de cinco safras sem conexão.

Layout: capturas em 320×568, 360×640, 390×844 e 412×915 nos dois motores. E2E mede alvos ≥48×48 px e ausência de rolagem horizontal, inclusive com fonte de 32 px (200%). Inspeção visual de início em 360 px e ações em 320 px; arte e texto legíveis. Ajustado foco de diálogos no WebKit e quebra da navegação com texto ampliado. Contrastes calculados: texto/papel 11,31:1; secundário/papel 5,82:1; branco/verde 8,12:1; erro/superfície 5,67:1; foco/superfície 7,84:1. Esses cálculos e testes não substituem avaliação com leitor de tela.

## Limitações e pendências explícitas

- **Offline WebKit:** o cache foi anunciado pronto, mas uma nova página após `context.setOffline(true)` falhou em `page.goto` com “WebKit encountered an internal error”. Reproduzido no WebKit 26.6/Windows. O teste foi marcado fixme com motivo; não contado como aprovado. Não é possível concluir se o comportamento se reproduz no Safari real sem testar o dispositivo. Prioridade alta antes de declarar suporte offline iPhone validado.
- **Aparelhos físicos:** nenhum Android/Chrome ou iPhone/Safari real foi utilizado. Instalação em tela inicial, teclado virtual, alternância entre apps, bloqueio/desbloqueio e retomada no sistema operacional permanecem pendentes.
- **Acessibilidade assistiva:** VoiceOver/TalkBack e leitura da ordem dos anúncios não foram executados. Foco, rótulos, semântica, zoom e contraste tiveram verificações automatizadas/parciais.
- **Latência:** limite de 100 ms por interação não foi medido em aparelho físico de referência. Tamanho de download/cache foi medido; não confundir tamanho com responsividade comprovada em hardware real.
- **Playwright no ambiente gerenciado Windows:** o encerramento automático de um servidor filho ficou preso depois de todos os cenários; o processo de runner foi identificado e encerrado, preservando o preview. Reexecução contra o preview existente gera o relatório final. Para reproduzir nesse ambiente, deixe `npm run preview -- --port 4173` em outro terminal antes de `npm run test:e2e`.
- **Humanos e publicação:** nenhuma sessão com jogadores, nenhum deploy HTTPS ou teste por URL pública. Consulte PLAYTEST e PUBLICACAO.

## Roteiro de verificação física

Para cada aparelho, registrar modelo, OS, navegador, modo normal/instalado, build e data. Abrir HTTPS, concluir tutorial e uma partida; testar toque rápido, zoom, rotação, teclado do importador de arquivo, ajuda/Voltar e leitor de tela. Preparar cache, desligar rede, fechar e reabrir; iniciar e concluir outra partida offline. Sair para outro app e bloquear a tela em planning/event/summary, retomar e conferir caixas e cursor. Exportar/importar backup, atualizar build e verificar continuidade. Medir latência de pelo menos dez ações comuns com método e condição térmica/energia registrados. Classificar cada item aprovado/falhou/não executado, sem substituir ausência de evidência por aprovação.
