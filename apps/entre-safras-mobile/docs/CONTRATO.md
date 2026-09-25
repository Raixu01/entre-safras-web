# Contrato mobile — Entre Safras

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
| `/schemaVersion` | 1 |
| `/rulesVersion` | "0.1" |
| `/title` | "Dinâmicas Agrárias: Entre Safras" |
| `/language` | "pt-BR" |
| `/status` | "proposta para implementação e playtest; não é motor executável" |
| `/currency/name` | "moedas" |
| `/currency/integerOnly` | true |
| `/currency/realMoneyEquivalent` | false |
| `/currency/maximum` | null |
| `/scope/agentCount` | 3 |
| `/scope/recommendedHumans` | 3 |
| `/scope/minimumHumans` | 2 |
| `/scope/maximumHumans` | 5 |
| `/scope/soloMode` | "ensaio" |
| `/scope/rounds` | 5 |
| `/scope/actionsPerRolePerRound` | 1 |
| `/scope/sharedScreen` | true |
| `/scope/remoteSynchronizedMultiplayer` | false |
| `/roles/0/id` | "lia" |
| `/roles/0/name` | "Lia" |
| `/roles/0/role` | "farmer" |
| `/roles/0/initialCash` | 12 |
| `/roles/0/theme` | "horta e sementes" |
| `/roles/0/initialInstallations` | [] |
| `/roles/1/id` | "bento" |
| `/roles/1/name` | "Bento" |
| `/roles/1/role` | "farmer" |
| `/roles/1/initialCash` | 12 |
| `/roles/1/theme` | "roça e pomar" |
| `/roles/1/initialInstallations` | [] |
| `/roles/2/id` | "rosa" |
| `/roles/2/name` | "Rosa" |
| `/roles/2/role` | "government" |
| `/roles/2/initialCash` | 6 |
| `/roles/2/theme` | "gestão pública" |
| `/parameters/initialResilience` | 4 |
| `/parameters/minimumResilience` | 0 |
| `/parameters/maximumResilience` | 6 |
| `/parameters/plantingCostPerFarmer` | 3 |
| `/parameters/baseHarvestPerFarmer` | 6 |
| `/parameters/governmentGrantPerRound` | 3 |
| `/parameters/grantAlsoInFirstRound` | true |
| `/parameters/noPreventionWear` | 1 |
| `/parameters/communityProtectionDivisor` | 3 |
| `/parameters/communityProtectionAppliesTo/0` | "drought" |
| `/parameters/communityProtectionAppliesTo/1` | "flood" |
| `/parameters/communityProtectionUses` | "resilience_at_start_of_round" |
| `/parameters/cooperativeHarvestBonusPerFarmer` | 1 |
| `/parameters/cooperativeBonusBegins` | "round_after_construction" |
| `/parameters/cooperativeResilienceGainAtConstruction` | 1 |
| `/parameters/cooperativeCountsAsPrevention` | false |
| `/parameters/finalMinimumFarmerCash` | 3 |
| `/parameters/finalMinimumResilience` | 3 |
| `/parameters/finalCooperativeRequired` | true |
| `/parameters/earlyDefeatIfAnyFarmerCashBelow` | 3 |
| `/parameters/earlyDefeatIfResilienceEquals` | 0 |
| `/parameters/terminationCheckedAt` | "after_all_round_settlement_effects" |
| `/basicCommands/0/id` | "reserve" |
| `/basicCommands/0/name` | "Reservar" |
| `/basicCommands/0/cost` | 0 |
| `/basicCommands/0/role` | "any" |
| `/basicCommands/0/effect` | "none" |
| `/basicCommands/0/countsAsCard` | false |
| `/basicCommands/0/countsAsPrevention` | false |
| `/actions/0/id` | "A1" |
| `/actions/0/name` | "Cobertura do solo" |
| `/actions/0/role` | "farmer" |
| `/actions/0/cost` | 3 |
| `/actions/0/target` | "self" |
| `/actions/0/duration` | "permanent" |
| `/actions/0/maximumPerFarmer` | 1 |
| `/actions/0/installation` | "soil_cover" |
| `/actions/0/lossProtection/drought` | 2 |
| `/actions/0/protectionBegins` | "current_round" |
| `/actions/0/resilienceGainOnInstall` | 1 |
| `/actions/0/countsAsPreventionOnInstall` | true |
| `/actions/0/description` | "Protege 2 contra seca. Ganha 1 de resiliência só na instalação." |
| `/actions/1/id` | "A2" |
| `/actions/1/name` | "Diversificação" |
| `/actions/1/role` | "farmer" |
| `/actions/1/cost` | 3 |
| `/actions/1/target` | "self" |
| `/actions/1/duration` | "permanent" |
| `/actions/1/maximumPerFarmer` | 1 |
| `/actions/1/installation` | "diversification" |
| `/actions/1/lossProtection/pests` | 3 |
| `/actions/1/protectionBegins` | "current_round" |
| `/actions/1/resilienceGainOnInstall` | 1 |
| `/actions/1/countsAsPreventionOnInstall` | true |
| `/actions/1/description` | "Protege 3 contra pragas. Ganha 1 de resiliência só na instalação." |
| `/actions/2/id` | "A3" |
| `/actions/2/name` | "Mutirão de colheita" |
| `/actions/2/role` | "farmer" |
| `/actions/2/cost` | 2 |
| `/actions/2/target` | "self" |
| `/actions/2/duration` | "current_round" |
| `/actions/2/grossHarvestBonus` | 4 |
| `/actions/2/repeatableAcrossRounds` | true |
| `/actions/2/countsAsPrevention` | false |
| `/actions/2/description` | "Acrescenta 4 à colheita bruta nesta safra." |
| `/actions/3/id` | "A4" |
| `/actions/3/name` | "Cooperativa" |
| `/actions/3/role` | "farmer" |
| `/actions/3/cost` | 2 |
| `/actions/3/target` | "community" |
| `/actions/3/duration` | "project" |
| `/actions/3/requires` | "both_farmers_A4_and_government_G4_same_round" |
| `/actions/3/uniquePerGame` | true |
| `/actions/3/partialContributionsAllowed` | false |
| `/actions/3/countsAsPrevention` | false |
| `/actions/3/description` | "Contribua 2 para o projeto de 6. Exige a ação dos três papéis." |
| `/actions/4/id` | "G1" |
| `/actions/4/name` | "Assistência técnica" |
| `/actions/4/role` | "government" |
| `/actions/4/cost` | 4 |
| `/actions/4/target` | "community" |
| `/actions/4/duration` | "current_round" |
| `/actions/4/resilienceGain` | 1 |
| `/actions/4/countsAsPrevention` | true |
| `/actions/4/repeatableAcrossRounds` | true |
| `/actions/4/description` | "Acrescenta 1 à resiliência e evita desgaste nesta safra." |
| `/actions/5/id` | "G2" |
| `/actions/5/name` | "Seguro da safra" |
| `/actions/5/role` | "government" |
| `/actions/5/cost` | 3 |
| `/actions/5/target` | "both_farmers" |
| `/actions/5/duration` | "current_round" |
| `/actions/5/lossProtectionPerFarmer/drought` | 3 |
| `/actions/5/lossProtectionPerFarmer/flood` | 3 |
| `/actions/5/protectsResilience` | false |
| `/actions/5/countsAsPrevention` | false |
| `/actions/5/repeatableAcrossRounds` | true |
| `/actions/5/description` | "Protege até 3 da perda de cada família por seca ou enchente. Não protege resiliência." |
| `/actions/6/id` | "G3" |
| `/actions/6/name` | "Compras públicas" |
| `/actions/6/role` | "government" |
| `/actions/6/cost` | 4 |
| `/actions/6/target` | "one_farmer" |
| `/actions/6/duration` | "instant" |
| `/actions/6/transferAmount` | 4 |
| `/actions/6/transferSource` | "government" |
| `/actions/6/transferDestination` | "selected_farmer" |
| `/actions/6/spendableByRecipient` | "after_current_plan_cost_validation" |
| `/actions/6/countsAsPrevention` | false |
| `/actions/6/repeatableAcrossRounds` | true |
| `/actions/6/description` | "Transfere 4 do governo para uma família. Não financia a ação atual dessa família." |
| `/actions/7/id` | "G4" |
| `/actions/7/name` | "Cooperativa" |
| `/actions/7/role` | "government" |
| `/actions/7/cost` | 2 |
| `/actions/7/target` | "community" |
| `/actions/7/duration` | "project" |
| `/actions/7/requires` | "both_farmers_A4_and_government_G4_same_round" |
| `/actions/7/uniquePerGame` | true |
| `/actions/7/partialContributionsAllowed` | false |
| `/actions/7/countsAsPrevention` | false |
| `/actions/7/description` | "Contribua 2 para o projeto de 6. Exige a ação dos três papéis." |
| `/eventTypes/0/id` | "drought" |
| `/eventTypes/0/name` | "Seca" |
| `/eventTypes/0/copies` | 2 |
| `/eventTypes/0/grossLossPerFarmer` | 6 |
| `/eventTypes/0/harvestBonusPerFarmer` | 0 |
| `/eventTypes/0/resilienceDelta` | -2 |
| `/eventTypes/1/id` | "flood" |
| `/eventTypes/1/name` | "Enchente" |
| `/eventTypes/1/copies` | 2 |
| `/eventTypes/1/grossLossPerFarmer` | 4 |
| `/eventTypes/1/harvestBonusPerFarmer` | 0 |
| `/eventTypes/1/resilienceDelta` | -1 |
| `/eventTypes/2/id` | "pests" |
| `/eventTypes/2/name` | "Pragas" |
| `/eventTypes/2/copies` | 2 |
| `/eventTypes/2/grossLossPerFarmer` | 5 |
| `/eventTypes/2/harvestBonusPerFarmer` | 0 |
| `/eventTypes/2/resilienceDelta` | -1 |
| `/eventTypes/3/id` | "favorable" |
| `/eventTypes/3/name` | "Clima favorável" |
| `/eventTypes/3/copies` | 2 |
| `/eventTypes/3/grossLossPerFarmer` | 0 |
| `/eventTypes/3/harvestBonusPerFarmer` | 2 |
| `/eventTypes/3/resilienceDelta` | 0 |
| `/eventTypes/4/id` | "fair" |
| `/eventTypes/4/name` | "Feira regional" |
| `/eventTypes/4/copies` | 1 |
| `/eventTypes/4/grossLossPerFarmer` | 0 |
| `/eventTypes/4/harvestBonusPerFarmer` | 3 |
| `/eventTypes/4/resilienceDelta` | 0 |
| `/eventTypes/5/id` | "regular" |
| `/eventTypes/5/name` | "Safra regular" |
| `/eventTypes/5/copies` | 1 |
| `/eventTypes/5/grossLossPerFarmer` | 0 |
| `/eventTypes/5/harvestBonusPerFarmer` | 0 |
| `/eventTypes/5/resilienceDelta` | 0 |
| `/eventCopies/0/id` | "drought-1" |
| `/eventCopies/0/type` | "drought" |
| `/eventCopies/1/id` | "drought-2" |
| `/eventCopies/1/type` | "drought" |
| `/eventCopies/2/id` | "flood-1" |
| `/eventCopies/2/type` | "flood" |
| `/eventCopies/3/id` | "flood-2" |
| `/eventCopies/3/type` | "flood" |
| `/eventCopies/4/id` | "pests-1" |
| `/eventCopies/4/type` | "pests" |
| `/eventCopies/5/id` | "pests-2" |
| `/eventCopies/5/type` | "pests" |
| `/eventCopies/6/id` | "favorable-1" |
| `/eventCopies/6/type` | "favorable" |
| `/eventCopies/7/id` | "favorable-2" |
| `/eventCopies/7/type` | "favorable" |
| `/eventCopies/8/id` | "fair-1" |
| `/eventCopies/8/type` | "fair" |
| `/eventCopies/9/id` | "regular-1" |
| `/eventCopies/9/type` | "regular" |
| `/deckRules/shuffleOnce` | true |
| `/deckRules/drawWithoutReplacement` | true |
| `/deckRules/drawPerRound` | 1 |
| `/deckRules/roundsDrawn` | 5 |
| `/deckRules/remainingTypeCountsVisible` | true |
| `/deckRules/futureOrderVisible` | false |
| `/deckRules/storeFullOrderForReplay` | true |
| `/deckRules/eventProbabilitiesAreEmpirical` | false |
| `/settlementRules/allPlanCostsValidatedBeforeAnyPlanEffect` | true |
| `/settlementRules/allowDebt` | false |
| `/settlementRules/plantingAndGrantAppliedOnce` | true |
| `/settlementRules/resolutionAtomicAndIdempotent` | true |
| `/settlementRules/directEventCashLoss` | false |
| `/settlementRules/allLossProtectionsAdditive` | true |
| `/settlementRules/effectiveLossMinimum` | 0 |
| `/settlementRules/harvestRevenueMinimum` | 0 |
| `/settlementRules/excessProtectionCreatesRevenue` | false |
| `/settlementRules/resilienceClampedOnceAtEnd` | true |
| `/settlementRules/preventionThisRound/0` | "new_soil_cover" |
| `/settlementRules/preventionThisRound/1` | "new_diversification" |
| `/settlementRules/preventionThisRound/2` | "government_assistance" |
| `/settlementRules/oneActionCannotTargetMultipleRounds` | true |
| `/settlementRules/freeTransfersAllowed` | false |
| `/settlementRules/undoAfterEventAllowed` | false |
| `/settlementRules/individualScoreOrVictory` | false |
| `/physicalInventory/farmerActionTypes` | 4 |
| `/physicalInventory/farmerCatalogCopies` | 2 |
| `/physicalInventory/governmentActions` | 4 |
| `/physicalInventory/reusableActionCards` | 12 |
| `/physicalInventory/eventCards` | 10 |
| `/physicalInventory/totalCards` | 22 |
| `/physicalInventory/roleBoards` | 3 |
| `/referenceFixtures/0/name` | "reserva_seca" |
| `/referenceFixtures/0/round` | 1 |
| `/referenceFixtures/0/actions/lia` | "reserve" |
| `/referenceFixtures/0/actions/bento` | "reserve" |
| `/referenceFixtures/0/actions/rosa` | "reserve" |
| `/referenceFixtures/0/event` | "drought" |
| `/referenceFixtures/0/expected/cash/0` | 10 |
| `/referenceFixtures/0/expected/cash/1` | 10 |
| `/referenceFixtures/0/expected/cash/2` | 9 |
| `/referenceFixtures/0/expected/resilience` | 1 |
| `/referenceFixtures/1/name` | "reserva_enchente" |
| `/referenceFixtures/1/round` | 1 |
| `/referenceFixtures/1/actions/lia` | "reserve" |
| `/referenceFixtures/1/actions/bento` | "reserve" |
| `/referenceFixtures/1/actions/rosa` | "reserve" |
| `/referenceFixtures/1/event` | "flood" |
| `/referenceFixtures/1/expected/cash/0` | 12 |
| `/referenceFixtures/1/expected/cash/1` | 12 |
| `/referenceFixtures/1/expected/cash/2` | 9 |
| `/referenceFixtures/1/expected/resilience` | 2 |
| `/referenceFixtures/2/name` | "coberturas_assistencia_seca" |
| `/referenceFixtures/2/round` | 1 |
| `/referenceFixtures/2/actions/lia` | "A1" |
| `/referenceFixtures/2/actions/bento` | "A1" |
| `/referenceFixtures/2/actions/rosa` | "G1" |
| `/referenceFixtures/2/event` | "drought" |
| `/referenceFixtures/2/expected/cash/0` | 9 |
| `/referenceFixtures/2/expected/cash/1` | 9 |
| `/referenceFixtures/2/expected/cash/2` | 5 |
| `/referenceFixtures/2/expected/resilience` | 5 |
| `/referenceFixtures/3/name` | "cooperativa_clima_favoravel" |
| `/referenceFixtures/3/round` | 1 |
| `/referenceFixtures/3/actions/lia` | "A4" |
| `/referenceFixtures/3/actions/bento` | "A4" |
| `/referenceFixtures/3/actions/rosa` | "G4" |
| `/referenceFixtures/3/event` | "favorable" |
| `/referenceFixtures/3/expected/cash/0` | 15 |
| `/referenceFixtures/3/expected/cash/1` | 15 |
| `/referenceFixtures/3/expected/cash/2` | 7 |
| `/referenceFixtures/3/expected/resilience` | 4 |
| `/referenceFixtures/4/name` | "exemplo_visual" |
| `/referenceFixtures/4/round` | 1 |
| `/referenceFixtures/4/actions/lia` | "A1" |
| `/referenceFixtures/4/actions/bento` | "A3" |
| `/referenceFixtures/4/actions/rosa` | "G1" |
| `/referenceFixtures/4/event` | "drought" |
| `/referenceFixtures/4/expected/cash/0` | 9 |
| `/referenceFixtures/4/expected/cash/1` | 12 |
| `/referenceFixtures/4/expected/cash/2` | 5 |
| `/referenceFixtures/4/expected/resilience` | 4 |
| `/referenceJourney/0/round` | 1 |
| `/referenceJourney/0/actions/0` | "A1" |
| `/referenceJourney/0/actions/1` | "A3" |
| `/referenceJourney/0/actions/2` | "G1" |
| `/referenceJourney/0/event` | "drought" |
| `/referenceJourney/0/cash/0` | 9 |
| `/referenceJourney/0/cash/1` | 12 |
| `/referenceJourney/0/cash/2` | 5 |
| `/referenceJourney/0/resilience` | 4 |
| `/referenceJourney/1/round` | 2 |
| `/referenceJourney/1/actions/0` | "A2" |
| `/referenceJourney/1/actions/1` | "A1" |
| `/referenceJourney/1/actions/2` | "G1" |
| `/referenceJourney/1/event` | "pests" |
| `/referenceJourney/1/cash/0` | 7 |
| `/referenceJourney/1/cash/1` | 7 |
| `/referenceJourney/1/cash/2` | 4 |
| `/referenceJourney/1/resilience` | 6 |
| `/referenceJourney/2/round` | 3 |
| `/referenceJourney/2/actions/0` | "A4" |
| `/referenceJourney/2/actions/1` | "A4" |
| `/referenceJourney/2/actions/2` | "G4" |
| `/referenceJourney/2/event` | "regular" |
| `/referenceJourney/2/cash/0` | 8 |
| `/referenceJourney/2/cash/1` | 8 |
| `/referenceJourney/2/cash/2` | 5 |
| `/referenceJourney/2/resilience` | 6 |
| `/referenceJourney/3/round` | 4 |
| `/referenceJourney/3/actions/0` | "A3" |
| `/referenceJourney/3/actions/1` | "A2" |
| `/referenceJourney/3/actions/2` | "G2" |
| `/referenceJourney/3/event` | "flood" |
| `/referenceJourney/3/cash/0` | 14 |
| `/referenceJourney/3/cash/1` | 9 |
| `/referenceJourney/3/cash/2` | 5 |
| `/referenceJourney/3/resilience` | 6 |
| `/referenceJourney/4/round` | 5 |
| `/referenceJourney/4/actions/0` | "reserve" |
| `/referenceJourney/4/actions/1` | "A3" |
| `/referenceJourney/4/actions/2` | "reserve" |
| `/referenceJourney/4/event` | "favorable" |
| `/referenceJourney/4/cash/0` | 20 |
| `/referenceJourney/4/cash/1` | 17 |
| `/referenceJourney/4/cash/2` | 8 |
| `/referenceJourney/4/resilience` | 5 |
| `/validationStatus/humanPlaytestsOfThisVersion` | 0 |
| `/validationStatus/empiricalValidation` | false |
| `/validationStatus/balancedGameClaim` | false |
| `/validationStatus/note` | "Exemplos calculados e auditoria de regras não substituem testes de compreensão e negociação com pessoas." |
