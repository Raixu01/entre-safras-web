# Matriz de requisitos e evidências

App 0.1.0 / regras 0.1 / schema 1. “Aprovado” abaixo significa a evidência delimitada, não validação humana ou publicação.

| Requisito e tarefa | Critério | Evidência / situação |
|---|---|---|
| T01 contrato | Todos os números/condições rastreados; precedência; dez fluxos e fases | CONTRATO.md contém JSON Pointers de todas as propriedades; UX-MOBILE.md define os dez fluxos. Aprovado documental. |
| T02 stack | Versões exatas, lockfile, instalação limpa, lint, tipos, build | STACK.md; package-lock.json; npm ci no Node 22.22.0 e comandos finais aprovados. Sem repositório GitHub configurado: CI não aplicável nesta entrega. |
| T03 catálogo e comandos | Dez eventos únicos, mesma seed, ações tipadas, rejeição de fase, futuro oculto | tests/domain/engine.test.ts, catalog.ts, engine.ts. Aprovado automatizado. |
| T04 exemplo | Cobertura/Mutirão/Assistência + Seca = 9/12/5, R4 | Fixture exemplo_visual e primeira linha de tests/fixtures/reference.ts. Aprovado. |
| T04 cinco safras | Valores independentes e vitória | Fixture transcrita do design, teste de domínio e E2E completo nos dois motores. Aprovado. |
| T04 restrições | Coop parcial/integral, bônus posterior, duplicação, alvo, saldo e compras | Testes específicos de domínio; cooperativa/alvo também E2E. Aprovado. |
| T04 limites e fim | Perda zero, teto final, desgaste, caixa, R, quinta safra | Testes de domínio; derrotas reais do motor importadas em E2E e motivos apresentados. Aprovado. |
| T04 atomicidade | Repetição/revisão/fase inválida não aplica efeito | Testes de domínio, retomada e toque duplo no E2E. Aprovado. |
| T05 persistência | Retoma planejamento/evento/balanço/fim; cópia anterior | Round-trip de todas as fases; E2E recarrega evento e fim, planejamento e balanço; corrupção recupera anterior. Aprovado. |
| T05 falhas | Quota/permissão mantém sessão; JSON inválido não substitui | Testes de adapter, E2E de quota e importação inválida. Aprovado. |
| T05 backup | Limite, versões, números, IDs/cursor/histórico; dados alheios preservados | Zod + reconstrução integral; testes de adulteração, 1 MB e clear. Aprovado. |
| T05 abas | Bloquear sessão antiga sem mesclar | Store e E2E com segunda aba. Limite: sem lock transacional simultâneo. Aprovado dentro desse contrato. |
| T06 mobile | Quatro dimensões; ≥48 px; sem hover/arraste; fonte 200%; foco | Capturas Chromium/WebKit; E2E mede controles/overflow e retorno de foco; teclado Enter/Escape. Aprovado emulação. |
| T06 safe areas | Não encobrir a última operação; orientação preserva estado | CSS safe-area/padding, navegação inferior e teste de rotação. Teclado virtual/aparelho real pendentes. |
| T07 fluxo | Três papéis, revisão, bloqueio de plano ilegal, fim | E2E completo, 3/3, revisão, custos e resultado. Aprovado emulação. |
| T07 seletores | Faixa incerta sem revelar próximo evento; UI igual ao motor | revenueRange testa independência da próxima carta; E2E confere caixas por safra. Aprovado. |
| T08 tutorial/guia | Tutorial separado, custo/duração/alvo, histórico reconstruível | E2E confirma save normal inalterado; ajuda usa catálogo; contas em Settlement. Aprovado. |
| T08 exportar/repetir | Relatório sem futuro; replay com outro gameId e recursos novos | publicState e testes; repetir sequência na UI. Aprovado. |
| T09 PWA | Manifest/ícones/assets locais/cache; sem rede por turno | Build Workbox, dist e testes offline Chromium; cinco safras concluídas offline. Aprovado Chromium. |
| T09 atualização | Dois builds, sem reload automático, save antes da ativação | scripts/update-qa.mjs e docs/update-qa.json. Aprovado Chromium; quota bloqueia e save é idêntico. |
| T09 Safari offline | Fechar/reabrir sem rede | Erro interno no WebKit 26.6/Windows; cenário marcado fixme. Pendente investigação/validação Safari real. |
| T10 arte | 3 retratos, vila, 3 marcadores, 6 eventos, 8 símbolos | ASSETS.md, public/art, scripts/assets.py. Aprovado. |
| T10 acessibilidade | Contraste, foco, controles, cor não exclusiva, reduced-motion | metricas.json; E2E foco/zoom/tamanho; texto nos indicadores. Leitor de tela real pendente. |
| T11 QA | Fluxos críticos, regressão, orçamento de tamanho | QA-MOBILE.md, testes, capturas, metricas.json. Aprovado nas verificações automatizadas registradas. |
| T11 aparelhos | Android/Chrome e iPhone/Safari reais, instalado, teclado, bloquear tela | Pendente: nenhum aparelho físico disponível. Emulação não substitui. |
| T11 latência | Até 100 ms no aparelho de referência | Pendente definir/medir aparelho físico. Tamanho do build já medido abaixo do orçamento. |
| T12 playtest | 3 grupos de 3 + 1 dupla, metas tempo/compreensão | Protocolo pronto em PLAYTEST.md; aguardando participantes. Sem resultados humanos. |
| T12 estratégias | Comparar políticas nas mesmas seeds, sem rebalancear em silêncio | 300 partidas em analise-estrategias.json; regras 0.1 preservadas. Aprovado como análise complementar. |
| T13 entrega | Build, suporte, publicação, rollback | README, PUBLICACAO.md, NOTAS-DE-VERSAO.md, dist e ZIP. Build pronto. |
| T13 HTTPS real | Instalar, concluir, offline, save, sem 404 em destino | Pendente conta/projeto/destino Cloudflare e verificação publicada. Nenhuma URL pública criada. |
