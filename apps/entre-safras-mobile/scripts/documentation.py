from pathlib import Path
import json, platform, gzip
root=Path(__file__).resolve().parents[1]
docs=root/'docs'
catalog=json.loads((root/'src/data/catalog.json').read_text(encoding='utf-8-sig'))
def write(name, text): (docs/name).write_text(text.strip()+'\n',encoding='utf-8')
contract='''# Contrato mobile — Entre Safras

App 0.1.0 · regras 0.1 · schema 1 · 24/09/2026.

O planejamento `../../../output/entre-safras/04-planejamento-mobile-gpt-sol.md` prevalece sobre os protótipos e o roteiro 03. Regras numéricas: catálogo 02; interpretação econômica: design 01, §§5–11. Não houve alteração de balanceamento.

Três papéis fixos no mesmo celular, sem autenticação, backend ou dados remotos. Cinco safras; coordenação Lia/Bento/Rosa/Lia/Bento. Formação recomendada de três pessoas; duas dividem papéis, quatro/cinco formam duplas, uma ensaia. O mínimo humano 2 do catálogo descreve grupos; o planejamento permite explicitamente ensaio solo. Inventário físico é histórico, sem aplicação na PWA. Alvo de toque passa de aproximadamente 44 px no design para pelo menos 48 px no plano.

Máquina econômica: setup → planning → event → summary → planning ou finished. Criar e preparar são comandos; renderizar nunca prepara. O evento é resolvido uma única vez antes da apresentação e o resultado fica persistido. Encerramento é calculado na transação completa e apresentado depois do balanço. Comandos usam ID e revisão esperada. Erros não alteram parcialmente o estado.

Motor puro em `src/domain/engine.ts`; catálogo Zod em `src/domain/catalog.ts`; estado e journal em `src/persistence/snapshot.ts`. Mulberry32 com Fisher–Yates descendente, versão mulberry32-fy-v1; seed uint32. Repetição usa a ordem efetiva preservada, outro gameId e os recursos iniciais.

Todos os custos são validados antes de qualquer efeito. R inicial congelada rege proteção coletiva. Instalações novas protegem a safra atual. Cooperativa exige 2 de cada papel, ganha 1 R, não previne desgaste e só rende na safra seguinte. Compras não financiam a ação atual. Proteções somam; perdas e receitas têm mínimo zero; R é limitada uma vez no final. Não há dívida, transferências livres ou vitória individual.

Snapshot completo contém futuro para retomada; relatório público remove seed, shuffleVersion e deck. Importação tem limite de 1 MB, validação de versão/estrutura e reconstrução econômica completa. Duas abas não são sincronizadas: storage event bloqueia a antiga. Isso não oferece exclusão mútua transacional contra gravações simultâneas no mesmo instante.

## Rastreabilidade integral do catálogo

Cada linha abaixo aponta para o JSON Pointer do catálogo 02, cuja cópia local é `src/data/catalog.json`. Regras econômicas são consumidas no motor; metadados de apresentação no catálogo/UI; fixtures nos testes; inventário físico e status empírico são documentação, sem efeitos econômicos. O teste de imutabilidade rejeita alterações recebidas de qualquer propriedade sem mudar a versão.

| Fonte: JSON Pointer | Valor v0.1 |
|---|---|
'''
def flatten(value,path=''):
    if isinstance(value,dict):
        for k,v in value.items(): yield from flatten(v,path+'/'+k)
    elif isinstance(value,list):
        if not value: yield path,'[]'
        for i,v in enumerate(value): yield from flatten(v,path+'/'+str(i))
    else: yield path,json.dumps(value,ensure_ascii=False)
contract+='\n'.join(f'| `{p}` | {v.replace("|","/")} |' for p,v in flatten(catalog))
write('CONTRATO.md',contract)
write('UX-MOBILE.md','''# Fluxos e decisões mobile

1. Início: nova partida, continuar apenas save validado, tutorial, ajuda e backup. Confirmação antes de substituir partida em andamento.
2. Equipe: apresenta Lia, Bento e Rosa e a divisão dos papéis; começo único. Não solicita nomes pessoais.
3. Passagem: coordenador alternado; “Estou com o celular” inicia escolha. Não é autenticação.
4. Ação: quatro cartas verticais e Reservar; custo, efeito, duração e bloqueio; Compras exige destinatário.
5. Confirmação: escolha e saldo após custo; alteração remove confirmação somente desse papel.
6. Plano: 0/3 a 3/3, revisão individual, condição da cooperativa, faixa de receitas calculada em todos os eventos restantes, sem olhar o próximo evento.
7. Evento: leitura do resultado atômico já calculado; botão para balanço.
8. Balanço: caixas/R primeiro; contas expansíveis por papel; preparação seguinte somente pelo comando.
9. Resultado: vitória coletiva ou motivos exatos, metas atingidas/faltantes, repetir, exportar e conversar.
10. Ajuda/histórico: navegação auxiliar retorna ao mesmo estado; não altera recursos. Voltar com diálogo aberto fecha primeiro o diálogo; navegação nunca desfaz resolução.

Base 360×640, verificada também em 320×568, 390×844 e 412×915 em Chromium/WebKit emulados. Texto 16 px, controles ≥48 px, zoom não bloqueado; ampliação de fonte 200% sem overflow horizontal nos testes. Safe areas, 100dvh com fallback, reduced-motion, HTML semântico e diálogo nativo com foco restaurado. Fonte do sistema e assets locais.

Erro de ação: explica custo/alvo/instalação; plano incompleto bloqueia revelação. Arquivo inválido: preserva sessão. Falha de escrita: aviso persistente, sessão continua e permite backup. Atualização externa: bloqueia comandos até recarregar. Incompatibilidade de atualização: informa motivo e mantém build atual.

Capturas em `capturas/`; a inspeção visual realizada inclui início 360 px e ações 320 px no WebKit. Validação com leitor de tela real, teclado virtual e dispositivos físicos permanece pendente (QA-MOBILE.md).
''')
pkg=json.loads((root/'package.json').read_text())
write('STACK.md','''# Stack reproduzível

Node LTS fixado em 22.22.0 (`.node-version` e dependência de desenvolvimento local). Ambiente hospedeiro tinha Node 25.9.0/npm 11.12.1; os scripts npm usam o Node 22.22.0 local após instalação. A instalação inicial registrou aviso de engine do Vitest no Node hospedeiro; a candidata deve ser instalada com Node 22.22.0. TypeScript estrito, ES2022, DOM; build com alvo Safari 16. Nenhuma dependência de CDN em runtime.

| Dependência | Versão exata |
|---|---|
'''+ '\n'.join(f'| {k} | {v} |' for k,v in {**pkg['dependencies'],**pkg['devDependencies']}.items())+'''

`package-lock.json` trava transitivas. `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`. CI não foi ativada porque este diretório não é um repositório GitHub configurado. Scripts funcionam localmente; copiar para pipeline quando houver repositório.

Fontes oficiais consultadas: [Vite](https://vite.dev/guide/) (Node 20.19+ ou 22.12+), [Zod](https://zod.dev/) (schemas e parse), [Vite PWA](https://vite-pwa-org.netlify.app/guide/) e [prompt de atualização](https://vite-pwa-org.netlify.app/guide/prompt-for-update.html), [Vitest](https://vitest.dev/guide/), [emulação Playwright](https://playwright.dev/docs/emulation), [Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/). Versões e engines conferidas no registro npm antes de fixar; pacotes instalados são a referência efetiva de tipos/configuração. A página PWA ainda exibe v1.2.0; APIs usadas confirmadas nos tipos do pacote 1.3.0 instalado e no build real.
''')
write('ASSETS.md','''# Inventário de arte

Autoria: ilustrações geométricas originais criadas neste projeto por Codex, sem fotos, fontes, sprites ou imagens de terceiros. Fonte reproduzível: `scripts/assets.py`; SVGs nativos e ícones PNG gerados com Pillow. Disponíveis para o usuário junto com o código, sem atribuição externa necessária. As licenças dos pacotes npm permanecem nos respectivos pacotes; não são a licença da arte.

21 SVGs em `public/art/`: retratos Lia/Bento/Rosa (3), Vila das Águas (1), seca/enchente/pragas/clima favorável/feira/safra regular (6), A1–A4/G1–G4 (8), cobertura/diversificação/cooperativa (3). Ícones 192, 512 e maskable 512, fundo opaco, desenho dentro da zona segura central. Todos são locais e entram no precache. Arte decorativa usa alt vazio e aria-hidden; nomes e indicadores permanecem como texto.

Regenerar arte, somente quando necessário: `python scripts/assets.py` (Python + Pillow). Não é necessário Python para jogar ou executar o build normal.
''')
write('PLAYTEST.md','''# Playtest — aguardando participantes

Estado: **aguardando playtest**. Nenhuma sessão humana foi executada; nenhum resultado de compreensão ou duração foi inventado. Regras mantidas em 0.1.

Protocolo: três sessões independentes de três pessoas, mais uma sessão de duas pessoas dividindo papéis. Usar celular em orientação vertical. Explicar que é uma comunidade fictícia, apresentar tutorial e deixar o grupo conduzir a partida; registrar intervenções sem improvisar regras.

Ficha por sessão: código anônimo; consentimento verbal; data; quantidade de participantes; aparelho/OS/navegador; build; seed/backup ao final; tempo até primeira confirmação; duração total; intervenções; toques errados; dificuldade na passagem; escolhas; desfecho; dúvidas; problemas e gravidade. Não coletar nome pessoal obrigatório.

Após tutorial, cada participante explica R, atraso do bônus da cooperativa e condições de vitória. Meta exploratória: 80% explicam corretamente os três pontos. Tempo pretendido: 20–30 min. Metas não atingidas exigem ajuste e novo teste. Separar tempo de negociação do tempo de uso da interface.

Debate: quem ficou com menos recursos? Qual prevenção teve efeito imediato e qual só depois? Quando construir custou mais? O apoio público correspondeu ao combinado? O que mudar com os mesmos eventos?

Análise complementar automática: `tests/domain/strategies.test.ts` e `analise-estrategias.json` com três políticas legais nas mesmas seeds 0–99. Reserva: 0 vitórias; prevenção com cooperativa na terceira safra: 100; política variada sem cooperativa: 0. Isso sugere investigar a força da estratégia preventiva nos playtests; não comprova equilíbrio, diversão ou cooperação espontânea. Não foi alterado nenhum parâmetro com base apenas nessa simulação.

Se alterar regras: registrar hipótese, valor anterior/novo, versão de catálogo/fixtures e comparação nas mesmas sequências. Não misturar versões na sessão.
''')
write('PUBLICACAO.md','''# Distribuição e suporte

Estado: **build pronto, publicação pendente**. Não há URL pública, conta/projeto Cloudflare ou credenciais definidos nesta sessão. A candidata não foi validada em dispositivos reais nem com grupos de jogadores.

Cloudflare Pages: raiz `apps/entre-safras-mobile`; Node 22.22.0; comando `npm ci && npm run build`; saída `dist`. Fazer deploy na raiz de um domínio/subdomínio: manifest, start_url e scope são `/`. Não publicar numa subpasta sem adaptar base, URLs de assets e manifest. `public/_headers` desativa cache duradouro de HTML/SW e conserva assets com hash. O arquivo compatibility.json declara versões de save aceitas e deve acompanhar cada publicação.

Antes de publicar: guardar o pacote anterior compatível e seu hash. Depois: abrir HTTPS, verificar ausência de 404, manifest/ícones/escopo, terminar partida, instalar quando disponível, confirmar cache e reabrir offline. Essa verificação depende do destino publicado e continua pendente.

Rollback: exportar backup antes; restaurar apenas um build que aceite schema 1/regras 0.1. Não remover dados ou substituir save incompatível. Se uma versão nova mudar schema, manter exportação e uma versão compatível acessível em origem separada; não fazer downgrade silencioso.

Android/Chrome: menu → Instalar aplicativo ou Adicionar à tela inicial. iPhone/Safari: Compartilhar → Adicionar à Tela de Início. Jogar no navegador também funciona. Primeiro acesso exige conexão; esperar “Disponível offline”. Instalação, retorno de outro app e bloqueio de tela precisam ser verificados fisicamente.

Backup: menu Backup → Exportar backup completo. Restauração: selecionar JSON ≤1 MB e confirmar substituição após validação. Relatório exclui a ordem futura; backup inclui. Dados pertencem ao navegador/origem, sem sincronização. Limpar dados pode apagar partidas. Uma cópia válida anterior é recuperada automaticamente quando possível, com aviso da possível perda da última alteração.

Sem salvamento: continuar sessão, exportar backup e verificar quota/permissões. Outra aba: recarregar versão salva antes de jogar. Arquivo incompatível: manter arquivo original e abrir versão compatível; não editar números manualmente. Atualização: apenas por botão, após salvar, consultar compatibility.json e confirmar; falha de gravação bloqueia ativação. Não depende de beforeunload.
''')
write('NOTAS-DE-VERSAO.md','''# 0.1.0 — candidata técnica

Jogo local de cinco safras, três papéis, regras 0.1 sem alterações. Motor determinístico, validação de planos, transações, histórico detalhado e proteção contra comandos repetidos. UI mobile com tutorial isolado, ajuda, relatório, backup validado por replay e recuperação. PWA com cache local e atualização confirmada pelo usuário. SVGs originais e ícones locais.

Limites: offline após fechar/reabrir no WebKit emulado apresentou erro interno no Windows; precisa de investigação no Safari real. QA físico Android/iPhone, leitor de tela, playtests e publicação HTTPS pendentes. Não declarar versão validada com pessoas ou publicada.
''')
print('Documentação técnica e rastreabilidade geradas.')
