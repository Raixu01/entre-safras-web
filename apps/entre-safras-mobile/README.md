# Entre Safras · mobile

Web app cooperativo para três papéis compartilharem um celular ou navegador. Cinco safras, regras 0.1, interface em português, tutorial, histórico e backup local.

**Candidata técnica 0.1.0.** Testes físicos Android/iPhone, playtests e publicação ainda pendentes. Consulte [progresso](docs/PROGRESSO.md) e [QA](docs/QA-MOBILE.md).

Use Node **22.22.0**. Na pasta deste arquivo:

```sh
npm ci
npm run dev
```

Abra o endereço exibido no terminal. Para testar o build web:

```sh
npm run build
npm run preview -- --port 4173
```

Abra `http://localhost:4173`. A versão atual é apenas web e funciona enquanto a página estiver acessível; o jogo salva localmente neste navegador. Veja [publicação e suporte](docs/PUBLICACAO.md).

```sh
npm run lint
npm run typecheck
npm test
npx playwright install chromium webkit
npm run test:e2e
npm run test:update
```

Os testes E2E usam o build existente; execute `npm run build` depois de alterações. `test:update` gera dois builds em `work/`, verifica atualização explícita e preservação do save; não altera `dist/`. Testes não representam validação em aparelhos reais.

Código: `src/domain` (economia), `src/persistence` (backup/replay), `src/app` (store), `src/main.ts` e `src/ui` (telas/componentes/estilos), `src/pwa` (atualização). Catálogo original preservado em `src/data/catalog.json`; documentação de origem em `../../output/entre-safras/`.

O jogo não depende de servidor de dados, cadastro, analytics ou serviços externos. Backup completo contém a sequência futura; relatório público não contém. Guardar uma cópia exportada é responsabilidade do grupo.
