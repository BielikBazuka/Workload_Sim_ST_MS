import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { MONTHS } from '../constants.js'
import { daysInMonth, monthDayStart, dayLabel } from '../simulation.js'
import { exportExcel, exportCSVDaily, exportCSVMonthly, exportCSVBacklog } from '../export.js'

const dayActual  = (d,sts) => sts.reduce((a,s)=>a+(d.actual[s]||0),0)
const dayCarried = (d,sts) => sts.reduce((a,s)=>a+(d.carried[s]||0),0)

function Kpi({label,value,sub,color}){
  return <div className="kpi" style={{borderTopColor:color||'var(--blue)'}}>
    <div className="kpi-lbl">{label}</div>
    <div className="kpi-val" style={{color:color||'var(--text)'}}>{value}</div>
    <div className="kpi-sub">{sub}</div>
  </div>
}

function Tooltip({tooltip}){
  if(!tooltip) return null
  return <div className="tooltip" style={{left:tooltip.x+14,top:tooltip.y-8}}>
    <div className="tt-title">{tooltip.title}</div>
    {tooltip.rows.map((r,i)=><div key={i} className="tt-row">
      <span className="tt-k">{r[0]}</span>
      <span className={`tt-v ${r[2]==='warn'?'tt-warn':r[2]==='ok'?'tt-ok':''}`}>{r[1]}</span>
    </div>)}
  </div>
}

export default function SimView({result,storageTypes,capacity,baseline,storageColorMap,machineTypes,machineColorMap,machineStarts,picksPerBuild}) {
  const [selectedDay, setSelectedDay] = useState(0)
  const [viewMode, setViewMode]       = useState('bar')
  const [selMonth, setSelMonth]       = useState(null)
  const [tooltip, setTooltip]         = useState(null)
  const [isPlaying, setIsPlaying]     = useState(false)
  const [animDay, setAnimDay]         = useState(-1)
  const [animFrom, setAnimFrom]       = useState(0)
  const [animTo, setAnimTo]           = useState(2)
  const [speed, setSpeed]             = useState(200)
  const animRef = useRef(null)
  const animDayRef = useRef(-1)
  const isPlayingRef = useRef(false)

  const cap = useMemo(()=>storageTypes.reduce((a,s)=>a+(capacity[s]||0),0),[storageTypes,capacity])
  const dailyActual  = useMemo(()=>result.map(d=>dayActual(d,storageTypes)),[result,storageTypes])
  const dailyCarried = useMemo(()=>result.map(d=>dayCarried(d,storageTypes)),[result,storageTypes])
  const peakActual   = useMemo(()=>{ let mx=0,idx=0; dailyActual.forEach((v,i)=>{if(v>mx){mx=v;idx=i}}); return{val:Math.round(mx),day:idx} },[dailyActual])
  const maxBacklog   = useMemo(()=>Math.max(...dailyCarried,0),[dailyCarried])
  const backlogDays  = useMemo(()=>dailyCarried.filter(v=>v>0).length,[dailyCarried])
  const avgActual    = useMemo(()=>Math.round(dailyActual.reduce((a,b)=>a+b,0)/365),[dailyActual])
  const totalStarts  = machineTypes.reduce((a,t)=>a+(machineStarts[t]||[]).reduce((x,y)=>x+y,0),0)

  const animStart = useMemo(()=>monthDayStart(animFrom),[animFrom])
  const animEnd   = useMemo(()=>{ const end=animTo>=11?364:monthDayStart(animTo+1)-1; return Math.min(end,364) },[animTo])

  const viewResult = useMemo(()=>{
    if(selMonth===null) return result
    const s=monthDayStart(selMonth)
    return result.slice(s,s+daysInMonth(selMonth))
  },[result,selMonth])
  const dayOffset = useMemo(()=>selMonth===null?0:monthDayStart(selMonth),[selMonth])
  const maxStack  = useMemo(()=>Math.max(...viewResult.map(d=>storageTypes.reduce((a,s)=>a+(d.machinePicks[s]||0)+(d.baselinePicks[s]||0)+(d.carriedIn[s]||0),0)),cap,1),[viewResult,storageTypes,cap])

  const dayData      = result[selectedDay]||{actual:{},machinePicks:{},baselinePicks:{},carriedIn:{},carried:{},overflow:{}}
  const dayActualT   = storageTypes.reduce((a,s)=>a+(dayData.actual[s]||0),0)
  const dayCarryIn   = storageTypes.reduce((a,s)=>a+(dayData.carriedIn[s]||0),0)
  const dayCarryOut  = storageTypes.reduce((a,s)=>a+(dayData.carried[s]||0),0)
  const dayMachT     = storageTypes.reduce((a,s)=>a+(dayData.machinePicks[s]||0),0)
  const dayBaseT     = storageTypes.reduce((a,s)=>a+(dayData.baselinePicks[s]||0),0)
  const hasOverflow  = storageTypes.some(s=>dayData.overflow[s])

  // Animation
  const stopAnim = useCallback(()=>{
    isPlayingRef.current=false; setIsPlaying(false)
    if(animRef.current) clearTimeout(animRef.current)
  },[])

  const step = useCallback(()=>{
    if(!isPlayingRef.current) return
    const next = animDayRef.current+1
    if(next>animEnd){ isPlayingRef.current=false; setIsPlaying(false); return }
    animDayRef.current=next
    setAnimDay(next); setSelectedDay(next)
    const pct=((next-animStart)/(animEnd-animStart))*100
    animRef.current=setTimeout(step, speed)
  },[animEnd,animStart,speed])

  const startAnim = useCallback(()=>{
    if(animDayRef.current<animStart||animDayRef.current>animEnd) animDayRef.current=animStart
    isPlayingRef.current=true; setIsPlaying(true)
    step()
  },[animStart,animEnd,step])

  const toggleAnim = ()=>{ if(isPlaying) stopAnim(); else startAnim() }

  const resetAnim = ()=>{ stopAnim(); animDayRef.current=animStart; setAnimDay(animStart); setSelectedDay(animStart) }

  useEffect(()=>()=>{ if(animRef.current) clearTimeout(animRef.current) },[])

  const animPct = animDay>=0&&animEnd>animStart ? Math.max(0,Math.min(100,((animDay-animStart)/(animEnd-animStart))*100)) : 0

  const H=200

  return (
    <div>
      <Tooltip tooltip={tooltip}/>

      <div className="kpi-row">
        <Kpi label="Machine Starts" value={totalStarts} sub="across all types"/>
        <Kpi label="Peak Daily Actual" value={peakActual.val.toLocaleString()} sub={`Day ${peakActual.day+1} · cap ${cap.toLocaleString()}`} color={peakActual.val>cap?'var(--warn)':'var(--ok)'}/>
        <Kpi label="Avg Daily Picks" value={avgActual.toLocaleString()} sub="actually processed/day"/>
        <Kpi label="Days with Backlog" value={backlogDays} sub={`of 365 (${Math.round(backlogDays/3.65)}%)`} color={backlogDays>0?'var(--warn)':'var(--ok)'}/>
        <Kpi label="Peak Backlog" value={Math.round(maxBacklog).toLocaleString()} sub="picks carried at once" color={maxBacklog>0?'var(--amber)':'var(--ok)'}/>
      </div>

      <div className="card card-accent" style={{marginBottom:18}}>

        {/* Animation bar */}
        <div className="anim-bar">
          <button className={`anim-btn ${isPlaying?'playing':''}`} onClick={toggleAnim}>{isPlaying?'⏸ Pause':'▶ Play'}</button>
          <button className="anim-btn stop" onClick={resetAnim}>■ Reset</button>
          <select className="speed-sel" value={speed} onChange={e=>setSpeed(parseInt(e.target.value))}>
            <option value={400}>0.5×</option>
            <option value={200}>1×</option>
            <option value={80}>2×</option>
            <option value={30}>5×</option>
            <option value={10}>10×</option>
          </select>
          <span style={{fontSize:11,color:'var(--text-m)'}}>Range:</span>
          <select className="range-sel" value={animFrom} onChange={e=>{ stopAnim(); setAnimFrom(parseInt(e.target.value)) }}>
            {MONTHS.map((m,i)=><option key={m} value={i}>{m}</option>)}
          </select>
          <span style={{fontSize:11,color:'var(--text-d)'}}>→</span>
          <select className="range-sel" value={animTo} onChange={e=>{ stopAnim(); setAnimTo(parseInt(e.target.value)) }}>
            {MONTHS.map((m,i)=><option key={m} value={i}>{m}</option>)}
          </select>
          <div className="anim-prog"><div className="anim-prog-fill" style={{width:`${animPct}%`}}/></div>
          <div className="anim-day">{animDay>=0?dayLabel(animDay):'—'}</div>
          {isPlaying&&<div className="pulse"/>}
        </div>

        {/* Timeline controls */}
        <div className="tl-ctrl">
          <span className="ctrl-lbl">View</span>
          <div className="view-btns">
            <button className={`vbtn ${viewMode==='bar'?'active':''}`} onClick={()=>setViewMode('bar')}>Bar</button>
            <button className={`vbtn ${viewMode==='heat'?'active':''}`} onClick={()=>setViewMode('heat')}>Heat</button>
          </div>
          <span className="ctrl-lbl">Month</span>
          <div className="month-pills">
            <button className={`mpill ${selMonth===null?'active':''}`} onClick={()=>setSelMonth(null)}>All</button>
            {MONTHS.map((m,i)=><button key={m} className={`mpill ${selMonth===i?'active':''}`} onClick={()=>setSelMonth(i)}>{m}</button>)}
          </div>
          <span className="ctrl-lbl" style={{marginLeft:'auto'}}>Day</span>
          <input className="day-slider" type="range" min="0" max="364" value={selectedDay} onChange={e=>{ stopAnim(); setSelectedDay(parseInt(e.target.value)) }}/>
          <span className="day-display">{dayLabel(selectedDay)}</span>
        </div>

        {/* Export bar */}
        <div className="export-bar">
          <span className="export-lbl">Export:</span>
          <button className="btn btn-green" onClick={()=>exportExcel(result,storageTypes,capacity,baseline,machineTypes,machineStarts,picksPerBuild)}>⬇ Excel (.xlsx)</button>
          <button className="btn btn-ghost" onClick={()=>exportCSVDaily(result,storageTypes)}>⬇ CSV Daily</button>
          <button className="btn btn-ghost" onClick={()=>exportCSVMonthly(result,storageTypes,machineTypes,machineStarts)}>⬇ CSV Monthly</button>
          <button className="btn btn-purple" onClick={()=>exportCSVBacklog(result,storageTypes)}>⬇ CSV Backlog</button>
        </div>

        {/* Chart */}
        {viewMode==='bar' ? (
          <div className="chart-wrap">
            <div style={{position:'relative',height:H+4}}>
              {[.25,.5,.75,1].map(f=>(
                <div key={f} className="grid-line" style={{bottom:f*H}}>
                  <span className="grid-lbl">{Math.round(maxStack*f).toLocaleString()}</span>
                </div>
              ))}
              <div className="cap-line" style={{bottom:Math.min(cap/maxStack,1)*H}}>
                <span className="cap-lbl">Cap {cap.toLocaleString()}</span>
              </div>
              <div className="bar-area" style={{position:'absolute',inset:0,height:H}}>
                {viewResult.map((d,i)=>{
                  const abs=dayOffset+i, isSel=abs===selectedDay, isCur=abs===animDay
                  const machT=storageTypes.reduce((a,s)=>a+(d.machinePicks[s]||0),0)
                  const baseT=storageTypes.reduce((a,s)=>a+(d.baselinePicks[s]||0),0)
                  const carryT=storageTypes.reduce((a,s)=>a+(d.carriedIn[s]||0),0)
                  const carryOut=storageTypes.reduce((a,s)=>a+(d.carried[s]||0),0)
                  return (
                    <div key={i} className={`b-wrap ${isSel?'sel':''} ${isCur?'cur':''}`}
                      onClick={()=>{ stopAnim(); setSelectedDay(abs) }}
                      onMouseMove={e=>setTooltip({x:e.clientX,y:e.clientY,title:`Day ${abs+1} — ${dayLabel(abs)}`,rows:[
                        ['Machine picks',Math.round(machT).toLocaleString(),''],
                        ['Baseline picks',Math.round(baseT).toLocaleString(),''],
                        ['Carried in',Math.round(carryT).toLocaleString(),carryT>0?'warn':''],
                        ['Capacity',cap.toLocaleString(),''],
                        ['Carried out',Math.round(carryOut).toLocaleString(),carryOut>0?'warn':'ok'],
                      ]})}
                      onMouseLeave={()=>setTooltip(null)}>
                      {storageTypes.map((s,si)=>{ const v=d.machinePicks[s]||0; if(!v) return null; return <div key={s} className="b-seg" style={{height:(v/maxStack)*H,background:storageColorMap[s],opacity:isSel||isCur?1:.78}}/> })}
                      {baseT>0&&<div className="b-base" style={{height:(baseT/maxStack)*H,backgroundColor:'var(--amber)'}}/>}
                      {carryT>0&&<div className="b-carry" style={{height:(carryT/maxStack)*H}}/>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="hm-wrap">
            <div className="hm-grid">
              <div/>
              {Array.from({length:53},(_,w)=><div key={w} className="hm-week-lbl">{w%4===0?`W${w+1}`:''}</div>)}
              {['M','T','W','T','F','S','S'].map((dn,di)=>(
                <>
                  <div key={`l${di}`} className="hm-row-lbl">{dn}</div>
                  {Array.from({length:53},(_,wi)=>{
                    const idx=wi*7+di
                    if(idx>=365) return <div key={`e${wi}`} style={{width:13,height:13}}/>
                    const act=dailyActual[idx], bl=dailyCarried[idx]||0, pct=act/Math.max(...dailyActual,1)
                    const isSel=idx===selectedDay
                    const bg=bl>0?`rgba(222,53,11,${.15+Math.min(bl/Math.max(...dailyCarried,1),1)*.75})`:`rgba(0,128,201,${.07+pct*.86})`
                    return <div key={`d${wi}`} className="hm-cell" style={{background:bg,border:isSel?'2px solid var(--blue)':'1px solid transparent'}}
                      onClick={()=>{ stopAnim(); setSelectedDay(idx) }}
                      onMouseMove={e=>setTooltip({x:e.clientX,y:e.clientY,title:`Day ${idx+1} — ${dayLabel(idx)}`,rows:[['Processed',Math.round(act).toLocaleString(),''],['Backlog out',Math.round(bl).toLocaleString(),bl>0?'warn':'ok']]})}
                      onMouseLeave={()=>setTooltip(null)}/>
                  })}
                </>
              ))}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="legend">
          {storageTypes.map((s,si)=><div key={s} className="leg-item"><div className="leg-dot" style={{background:storageColorMap[s]}}/>{s}</div>)}
          <div className="leg-item"><div className="leg-hatch" style={{background:'repeating-linear-gradient(45deg,#bbb,#bbb 2px,rgba(0,0,0,.1) 2px,rgba(0,0,0,.1) 4px)'}}/> Baseline</div>
          <div className="leg-item"><div className="leg-hatch" style={{background:'repeating-linear-gradient(-45deg,var(--warn),var(--warn) 2px,rgba(255,255,255,.3) 2px,rgba(255,255,255,.3) 4px)'}}/> Backlog carried</div>
          <div className="leg-item"><div className="leg-line"/> Capacity limit</div>
        </div>

        {/* Day detail */}
        <div className="day-detail">
          <div className="dc-col">
            <div className="dc-title">Storage Utilisation — {dayLabel(selectedDay)}</div>
            {storageTypes.map((s,si)=>{
              const act=dayData.actual[s]||0, cap2=capacity[s]||1, carry=dayData.carried[s]||0
              const pct=Math.min(act/cap2,1), over=dayData.overflow[s]
              return <div key={s} className="util-row">
                <div className="util-lbl" style={{color:over?'var(--warn)':storageColorMap[s]}}>{s}</div>
                <div className="util-track"><div className="util-fill" style={{width:`${pct*100}%`,background:over?'var(--warn)':storageColorMap[s]}}/></div>
                <div className="util-pct" style={{color:over?'var(--warn)':'var(--ok)'}}>{Math.round(pct*100)}%</div>
                <div className="util-abs">{Math.round(act).toLocaleString()} / {cap2.toLocaleString()}{carry>0&&<span style={{color:'var(--amber)',marginLeft:3}}>+{Math.round(carry).toLocaleString()}→</span>}</div>
              </div>
            })}
          </div>
          <div className="dc-col">
            <div className="dc-title">Daily Summary — {dayLabel(selectedDay)}</div>
            {[
              ['Machine picks demanded',Math.round(dayMachT).toLocaleString(),''],
              ['Baseline picks',Math.round(dayBaseT).toLocaleString(),''],
              ['Carried in from yesterday',Math.round(dayCarryIn).toLocaleString(),dayCarryIn>0?'warn':''],
              ['Actually processed',Math.round(dayActualT).toLocaleString(),''],
              ['Carried to tomorrow',Math.round(dayCarryOut).toLocaleString(),dayCarryOut>0?'warn':'ok'],
              ['Total capacity',cap.toLocaleString(),''],
              ['Status',hasOverflow?'⚠ Capacity Exceeded':'✓ Within Capacity',hasOverflow?'warn':'ok'],
            ].map(([k,v,c])=><div key={k} className="sum-row">
              <span className="sum-key">{k}</span>
              <span className="sum-val" style={{color:c==='warn'?'var(--warn)':c==='ok'?'var(--ok)':undefined}}>{v}</span>
            </div>)}
          </div>
        </div>
      </div>

      {/* Backlog */}
      <div className="card card-accent" style={{marginBottom:18}}>
        <div className="card-header">
          <div><div className="card-title">Carry-over Backlog Over Time</div><div className="card-sub">Picks rolled to next day — all storages combined</div></div>
          <span className={`badge ${maxBacklog>0?'badge-warn':'badge-ok'}`}>{maxBacklog>0?`Peak: ${Math.round(maxBacklog).toLocaleString()} picks`:'No backlog'}</span>
        </div>
        <div className="bl-wrap">
          <div className="bl-bars">
            {dailyCarried.map((v,i)=>{
              const h=Math.max((v/Math.max(...dailyCarried,1))*72,v>0?1:0), isSel=i===selectedDay
              return <div key={i} className="bl-bar"
                style={{height:h,background:v>0?'var(--amber)':'var(--border)',opacity:isSel?1:v>0?.7:.3,outline:isSel?'1.5px solid var(--blue)':'none'}}
                onClick={()=>{ stopAnim(); setSelectedDay(i) }}
                onMouseMove={e=>setTooltip({x:e.clientX,y:e.clientY,title:`Day ${i+1} Backlog`,rows:[['Carried out',Math.round(v).toLocaleString(),v>0?'warn':'ok']]})}
                onMouseLeave={()=>setTooltip(null)}/>
            })}
          </div>
        </div>
      </div>

      {/* Monthly table */}
      <div className="m-table-card">
        <div className="card-header"><div className="card-title">Monthly Overview</div></div>
        <div style={{overflowX:'auto'}}>
          <table className="m-table">
            <thead><tr>{['Month','Starts','Demand','Processed','Peak Backlog','Backlog Days','Workload'].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {MONTHS.map((m,mi)=>{
                const s=monthDayStart(mi),dc=daysInMonth(mi),slice=result.slice(s,s+dc),blSlice=dailyCarried.slice(s,s+dc)
                const demand=slice.reduce((a,d)=>a+storageTypes.reduce((x,st)=>x+(d.machinePicks[st]||0)+(d.baselinePicks[st]||0),0),0)
                const processed=slice.reduce((a,d)=>a+dayActual(d,storageTypes),0)
                const peakBl=Math.max(...blSlice,0), blDays=blSlice.filter(v=>v>0).length
                const starts=machineTypes.reduce((a,t)=>a+((machineStarts[t]||[])[mi]||0),0)
                const maxD=Math.max(...MONTHS.map((_,i2)=>{const s2=monthDayStart(i2),sl2=result.slice(s2,s2+daysInMonth(i2));return sl2.reduce((a,d)=>a+storageTypes.reduce((x,st)=>x+(d.machinePicks[st]||0)+(d.baselinePicks[st]||0),0),0)}),1)
                return <tr key={m}>
                  <td style={{fontWeight:600,color:'var(--blue)'}}>{m}</td>
                  <td style={{fontFamily:'var(--mono)',color:starts>0?'var(--text)':'var(--text-d)'}}>{starts}</td>
                  <td style={{fontFamily:'var(--mono)'}}>{Math.round(demand).toLocaleString()}</td>
                  <td style={{fontFamily:'var(--mono)'}}>{Math.round(processed).toLocaleString()}</td>
                  <td><span className={`badge ${peakBl>0?'badge-amber':'badge-ok'}`}>{peakBl>0?Math.round(peakBl).toLocaleString():'—'}</span></td>
                  <td><span className={`badge ${blDays>0?'badge-warn':'badge-ok'}`}>{blDays>0?`${blDays}d`:'None'}</span></td>
                  <td style={{minWidth:100}}><div className="wl-track"><div className="wl-fill" style={{width:`${(demand/maxD)*100}%`,background:blDays>0?'var(--warn)':'var(--blue)'}}/></div></td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
