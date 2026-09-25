import { it, expect } from 'vitest';
import { writeFileSync } from 'node:fs';
import { action, roles, type ActionId } from '../../src/domain/catalog';
import { choiceError, dispatch, setupGame, type Game } from '../../src/domain/engine';
import { apply, next, resolve } from '../fixtures/helpers';
it('compara políticas legais nas mesmas 100 seeds e procura derrota financeira',()=>{
  const results: {policy:string;seeds:number;wins:number;environment:number;cash:number;incomplete:number}[]=[];
  let cashCase: Game | null = null;
  for(const policy of ['reserva','prevenir','variada']){
    const row={policy,seeds:100,wins:0,environment:0,cash:0,incomplete:0};
    for(let seed=0;seed<100;seed++){
      let s=apply(setupGame(`simulation-${seed}`,seed),{type:'createGame'});
      for(let round=1;round<=5;round++){
        let choices:ActionId[]=['reserve','reserve','reserve'];
        if(policy==='prevenir'){
          if(round===3 && roles.every(r=>s.cash[r]>=2)) choices=['A4','A4','G4'];
          else choices=[round===1?'A1':round===2?'A2':'A3',round===1?'A1':round===2?'A2':'A3','G1'];
        }
        if(policy==='variada') choices=[['A1','A2','A3','reserve'][(seed+round)%4],['A2','A1','A3','reserve'][(seed*7+round)%4],['G1','G2','reserve'][(seed+round)%3]] as ActionId[];
        choices=choices.map((c,i)=>choiceError(s,roles[i],{action:c})?'reserve':c);
        // The cooperative is never partially funded by a policy fallback.
        if(choices.some(c=>c==='A4'||c==='G4')&&choices.some(c=>c!=='A4'&&c!=='G4'))choices=['reserve','reserve','reserve'];
        s=resolve(s,choices);
        const h=s.history.at(-1)!;
        if(h.outcome.length||round===5){if(h.victory)row.wins++;else if(h.outcome.some(x=>x.includes('moedas'))){row.cash++;cashCase??=s;}else if(s.resilience===0)row.environment++;else row.incomplete++;break;}
        s=next(s);
      }
    }
    results.push(row);
  }
  // Additional deterministic legal random plans explore boundary outcomes.
  for(let seed=0;seed<2000&&!cashCase;seed++){
    let s=apply(setupGame(`search-${seed}`,seed),{type:'createGame'});let rng=seed+1;
    for(let round=1;round<=5;round++){
      for(const role of roles){const candidates=(role==='rosa'?['G1','G2','reserve']:['A1','A2','A3','reserve']) as ActionId[];const legal=candidates.filter(a=>!choiceError(s,role,{action:a}));rng=(Math.imul(rng,1664525)+1013904223)>>>0;const c=legal[rng%legal.length];s=apply(s,{type:'selectAction',role,choice:{action:c}});s=apply(s,{type:'confirmRole',role});}
      const result=dispatch(s,{type:'resolveRound',expectedRevision:s.revision,id:`res-${round}`});expect(result.ok).toBe(true);if(!result.ok)break;s=result.state;
      if(s.history.at(-1)!.outcome.length||round===5){if(s.history.at(-1)!.outcome.some(x=>x.includes('moedas')))cashCase=s;break;}s=next(s);
    }
  }
  expect(results.every(r=>r.wins+r.environment+r.cash+r.incomplete===100)).toBe(true);
  writeFileSync('docs/analise-estrategias.json',JSON.stringify({rulesVersion:'0.1',note:'Simulação de políticas; não mede compreensão, diversão ou equilíbrio empírico.',results,cashCase:cashCase?.history.map(h=>({event:h.eventId,choices:Object.fromEntries(roles.map(r=>[r,action(h.choices[r]!.action).name])),cash:h.cash}))},null,2));
  if(cashCase)writeFileSync('tests/fixtures/cash-defeat.json',JSON.stringify(cashCase,null,2));
});
