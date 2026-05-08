import { MONTHS } from './constants.js'

export const daysInMonth = (m) => new Date(2025, m + 1, 0).getDate()
export const monthDayStart = (m) => { let s=0; for(let i=0;i<m;i++) s+=daysInMonth(i); return s }
export const dayLabel = (d) => {
  let rem=d
  for(let m=0;m<12;m++){ const dm=daysInMonth(m); if(rem<dm) return MONTHS[m]+' '+(rem+1); rem-=dm }
  return 'Dec 31'
}

export function buildDemand(machineTypes, machineStarts, picksPerBuild, workDist, storageTypes) {
  const demand = Array.from({length:365}, ()=>({}))
  machineTypes.forEach(type => {
    const dist   = workDist[type]      || []
    const starts = machineStarts[type] || Array(12).fill(0)
    const ppb    = picksPerBuild[type] || {}
    MONTHS.forEach((_,mi) => {
      const count = starts[mi]||0; if(!count) return
      dist.forEach((frac,offset) => {
        const tm=mi+offset; if(tm>=12) return
        const dc=daysInMonth(tm), ds=monthDayStart(tm)
        storageTypes.forEach(s => {
          const perDay=(count*(ppb[s]||0)*frac)/dc
          for(let d=0;d<dc;d++){ const di=ds+d; if(di>=365) break; demand[di][s]=(demand[di][s]||0)+perDay }
        })
      })
    })
  })
  return demand
}

export function simulate(demand, capacity, baseline, storageTypes) {
  const result = Array.from({length:365}, ()=>({machinePicks:{},baselinePicks:{},carriedIn:{},actual:{},carried:{},overflow:{}}))
  const backlog = Object.fromEntries(storageTypes.map(s=>[s,0]))
  for(let d=0;d<365;d++){
    const r=result[d]
    storageTypes.forEach(s => {
      const cap=capacity[s]||0, base=baseline[s]||0, machDem=demand[d][s]||0, carryIn=backlog[s]
      r.machinePicks[s]=machDem; r.baselinePicks[s]=base; r.carriedIn[s]=carryIn
      const ab=Math.min(base,cap), c1=Math.max(0,cap-ab)
      const ac=Math.min(carryIn,c1), c2=Math.max(0,c1-ac)
      const am=Math.min(machDem,c2)
      r.actual[s]=ab+ac+am; r.carried[s]=(machDem-am)+(carryIn-ac)
      r.overflow[s]=r.carried[s]>0; backlog[s]=r.carried[s]
    })
  }
  return result
}
