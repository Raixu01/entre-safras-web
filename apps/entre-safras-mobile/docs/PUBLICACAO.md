# Distribuição e suporte

Estado: **build pronto, publicação pendente**. Não há URL pública, conta/projeto Cloudflare ou credenciais definidos nesta sessão. A candidata não foi validada em dispositivos reais nem com grupos de jogadores.

GitHub Pages: raiz `apps/entre-safras-mobile`; Node 22.22.0; comando `npm ci && npm run build`; saída `dist`. O workflow `.github/workflows/deploy-pages.yml` publica o site após push na branch principal. A versão atual é um site web responsivo, sem manifest ou service worker. O arquivo compatibility.json declara versões de save aceitas e deve acompanhar cada publicação.

Antes de publicar: guardar o pacote anterior compatível e seu hash. Depois: abrir HTTPS, verificar ausência de 404, terminar uma partida e confirmar exportação/importação de backup.

Rollback: exportar backup antes; restaurar apenas um build que aceite schema 1/regras 0.1. Não remover dados ou substituir save incompatível. Se uma versão nova mudar schema, manter exportação e uma versão compatível acessível em origem separada; não fazer downgrade silencioso.

O site é jogado diretamente no navegador. Os dados pertencem à origem do site e não são sincronizados entre dispositivos.

Backup: menu Backup → Exportar backup completo. Restauração: selecionar JSON ≤1 MB e confirmar substituição após validação. Relatório exclui a ordem futura; backup inclui. Dados pertencem ao navegador/origem, sem sincronização. Limpar dados pode apagar partidas. Uma cópia válida anterior é recuperada automaticamente quando possível, com aviso da possível perda da última alteração.

Sem salvamento: continuar sessão, exportar backup e verificar quota/permissões. Outra aba: recarregar versão salva antes de jogar. Arquivo incompatível: manter arquivo original e abrir versão compatível; não editar números manualmente. Atualização: apenas por botão, após salvar, consultar compatibility.json e confirmar; falha de gravação bloqueia ativação. Não depende de beforeunload.
