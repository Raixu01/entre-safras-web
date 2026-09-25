# Stack reproduzível

Node LTS fixado em 22.22.0 (`.node-version` e dependência de desenvolvimento local). Ambiente hospedeiro tinha Node 25.9.0/npm 11.12.1; os scripts npm usam o Node 22.22.0 local após instalação. A instalação inicial registrou aviso de engine do Vitest no Node hospedeiro; a candidata deve ser instalada com Node 22.22.0. TypeScript estrito, ES2022, DOM; build com alvo Safari 16. Nenhuma dependência de CDN em runtime.

| Dependência | Versão exata |
|---|---|
| zod | 4.6.5 |
| node | 22.22.0 |
| typescript | 5.9.3 |
| vite | 8.3.1 |
| vitest | 5.0.1 |
| workbox-window | 7.4.1 |
| eslint | 9.39.5 |
| @eslint/js | 9.39.5 |
| typescript-eslint | 8.70.1 |
| @playwright/test | 1.63.0 |
| @types/node | 22.19.15 |

`package-lock.json` trava transitivas. `npm ci`, `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:e2e`. CI não foi ativada porque este diretório não é um repositório GitHub configurado. Scripts funcionam localmente; copiar para pipeline quando houver repositório.

Fontes oficiais consultadas: [Vite](https://vite.dev/guide/) (Node 20.19+ ou 22.12+), [Zod](https://zod.dev/) (schemas e parse), [Vite PWA](https://vite-pwa-org.netlify.app/guide/) e [prompt de atualização](https://vite-pwa-org.netlify.app/guide/prompt-for-update.html), [Vitest](https://vitest.dev/guide/), [emulação Playwright](https://playwright.dev/docs/emulation), [Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite3-project/). Versões e engines conferidas no registro npm antes de fixar; pacotes instalados são a referência efetiva de tipos/configuração. A página PWA ainda exibe v1.2.0; APIs usadas confirmadas nos tipos do pacote 1.3.0 instalado e no build real.
