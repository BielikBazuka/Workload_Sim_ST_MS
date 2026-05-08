import * as XLSX from 'xlsx'
import { MONTHS } from './constants.js'
import { daysInMonth, monthDayStart, dayLabel } from './simulation.js'

const dayActual  = (d, sts) => sts.reduce((a,s)=>a+(d.actual[s]||0),0)
const dayCarried = (d, sts) => sts.reduce((a,s)=>a+(d.carried[s]||0),0)

export function exportExcel(simResult, storageTypes, capacity, baseline, machineTypes, machineStarts, picksPerBuild) {
  const wb = XLSX.utils.book_new()

  // Sheet 1: Daily detail
  const daily = [['Day','Date',...storageTypes.map(s=>s+' Machine'),...storageTypes.map(s=>s+' Baseline'),...storageTypes.map(s=>s+' Backlog In'),'Total Actual','Total Carried Out']]
  simResult.forEach((d,i) => daily.push([
    i+1, dayLabel(i),
    ...storageTypes.map(s=>Math.round(d.machinePicks[s]||0)),
    ...storageTypes.map(s=>Math.round(d.baselinePicks[s]||0)),
    ...storageTypes.map(s=>Math.round(d.carriedIn[s]||0)),
    Math.round(dayActual(d,storageTypes)),
    Math.round(dayCarried(d,storageTypes)),
  ]))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(daily), 'Daily Detail')

  // Sheet 2: Monthly summary
  const monthly = [['Month','Starts','Demand','Processed','Peak Backlog','Backlog Days']]
  MONTHS.forEach((m,mi) => {
    const s=monthDayStart(mi), dc=daysInMonth(mi)
    const slice=simResult.slice(s,s+dc)
    monthly.push([
      m,
      machineTypes.reduce((a,t)=>a+((machineStarts[t]||[])[mi]||0),0),
      Math.round(slice.reduce((a,d)=>a+storageTypes.reduce((x,st)=>x+(d.machinePicks[st]||0)+(d.baselinePicks[st]||0),0),0)),
      Math.round(slice.reduce((a,d)=>a+dayActual(d,storageTypes),0)),
      Math.round(Math.max(...slice.map(d=>dayCarried(d,storageTypes)),0)),
      slice.filter(d=>dayCarried(d,storageTypes)>0).length,
    ])
  })
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(monthly), 'Monthly Summary')

  // Sheet 3: Storage utilisation
  const util = [['Day','Date',...storageTypes.flatMap(s=>[s+' Picks',s+' Capacity',s+' %'])]]
  simResult.forEach((d,i) => util.push([i+1,dayLabel(i),...storageTypes.flatMap(s=>[
    Math.round(d.actual[s]||0), capacity[s]||0,
    Math.round(((d.actual[s]||0)/(capacity[s]||1))*100)+'%'
  ])]))
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(util), 'Storage Utilisation')

  // Sheet 4: Config
  const cfg = [
    ['Machine','Storage','Picks/Build'],
    ...machineTypes.flatMap(m=>storageTypes.map(s=>[m,s,(picksPerBuild[m]||{})[s]||0])),
    [],['Storage','Capacity/Day','Baseline/Day'],
    ...storageTypes.map(s=>[s,capacity[s]||0,baseline[s]||0]),
  ]
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(cfg), 'Configuration')

  XLSX.writeFile(wb, 'PickFlow_Results.xlsx')
}

function toCSV(rows) { return rows.map(r=>r.map(v=>String(v).includes(',') ? `"${v}"` : v).join(',')).join('\n') }
function download(content, filename) {
  const a=document.createElement('a')
  a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(content)
  a.download=filename; a.click()
}

export function exportCSVDaily(simResult, storageTypes) {
  const rows=[['Day','Date',...storageTypes.map(s=>s+' Machine'),...storageTypes.map(s=>s+' Baseline'),'Total Actual','Total Carried Out']]
  simResult.forEach((d,i)=>rows.push([i+1,dayLabel(i),...storageTypes.map(s=>Math.round(d.machinePicks[s]||0)),...storageTypes.map(s=>Math.round(d.baselinePicks[s]||0)),Math.round(dayActual(d,storageTypes)),Math.round(dayCarried(d,storageTypes))]))
  download(toCSV(rows),'PickFlow_Daily.csv')
}

export function exportCSVMonthly(simResult, storageTypes, machineTypes, machineStarts) {
  const rows=[['Month','Starts','Demand','Processed','Peak Backlog','Backlog Days']]
  MONTHS.forEach((m,mi)=>{
    const s=monthDayStart(mi),dc=daysInMonth(mi),slice=simResult.slice(s,s+dc)
    rows.push([m,machineTypes.reduce((a,t)=>a+((machineStarts[t]||[])[mi]||0),0),Math.round(slice.reduce((a,d)=>a+storageTypes.reduce((x,st)=>x+(d.machinePicks[st]||0)+(d.baselinePicks[st]||0),0),0)),Math.round(slice.reduce((a,d)=>a+dayActual(d,storageTypes),0)),Math.round(Math.max(...slice.map(d=>dayCarried(d,storageTypes)),0)),slice.filter(d=>dayCarried(d,storageTypes)>0).length])
  })
  download(toCSV(rows),'PickFlow_Monthly.csv')
}

export function exportCSVBacklog(simResult, storageTypes) {
  const rows=[['Day','Date',...storageTypes.map(s=>s+' Backlog'),'Total Backlog']]
  simResult.forEach((d,i)=>rows.push([i+1,dayLabel(i),...storageTypes.map(s=>Math.round(d.carried[s]||0)),Math.round(dayCarried(d,storageTypes))]))
  download(toCSV(rows),'PickFlow_Backlog.csv')
}
