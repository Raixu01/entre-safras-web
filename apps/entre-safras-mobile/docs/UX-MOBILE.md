# Fluxos e decisões mobile

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
