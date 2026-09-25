# Inventário de arte

Autoria: ilustrações geométricas originais criadas neste projeto por Codex, sem fotos, fontes, sprites ou imagens de terceiros. Fonte reproduzível: `scripts/assets.py`; SVGs nativos e ícones PNG gerados com Pillow. Disponíveis para o usuário junto com o código, sem atribuição externa necessária. As licenças dos pacotes npm permanecem nos respectivos pacotes; não são a licença da arte.

21 SVGs em `public/art/`: retratos Lia/Bento/Rosa (3), Vila das Águas (1), seca/enchente/pragas/clima favorável/feira/safra regular (6), A1–A4/G1–G4 (8), cobertura/diversificação/cooperativa (3). Ícones 192, 512 e maskable 512, fundo opaco, desenho dentro da zona segura central. Todos são locais e entram no precache. Arte decorativa usa alt vazio e aria-hidden; nomes e indicadores permanecem como texto.

Regenerar arte, somente quando necessário: `python scripts/assets.py` (Python + Pillow). Não é necessário Python para jogar ou executar o build normal.
