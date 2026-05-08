import { MONTHS } from '../constants.js'
import { machineIcon, storageColor } from '../hooks/useAppState.js'

export default function ConfigView({ machineTypes,storageTypes,machineStarts,workDist,picksPerBuild,capacity,baseline,machineColorMap,storageColorMap,updateStart,updateDist,addDistMonth,remDistMonth,updatePicks,setCap,setBaseline,renameMachine,addMachine,removeMachine,renameStorage,addStorage,removeStorage,onRun }) {
  const totalPPB = m => storageTypes.reduce((s,st)=>s+((picksPerBuild[m]||{})[st]||0),0)
  const maxPPB = Math.max(...machineTypes.map(totalPPB),1)

  return (
    <div>
      {/* Storage */}
      <div className="sec">
        <div className="sec-hdr">
          <div className="sec-lbl">Storage Types &amp; Daily Capacity</div>
          <button className="btn btn-outline" onClick={addStorage}>+ Add Storage</button>
        </div>
        <div className="card card-accent"><div className="card-body">
          <div className="storage-grid">
            {storageTypes.map((s,si)=>(
              <div key={s} className="s-row">
                <div className="s-dot" style={{background:storageColorMap[s]}}/>
                <input className="s-name" defaultValue={s} onBlur={e=>renameStorage(s,e.target.value.trim())} onKeyDown={e=>e.key==='Enter'&&e.target.blur()}/>
                <input className="s-cap" type="number" min="0" value={capacity[s]||0} onChange={e=>setCap(s,e.target.value)}/>
                <span className="s-unit">picks/day</span>
                {storageTypes.length>1&&<button className="btn-del" onClick={()=>removeStorage(s)}>✕</button>}
              </div>
            ))}
          </div>
        </div></div>
      </div>

      {/* Matrix */}
      <div className="sec">
        <div className="sec-hdr">
          <div className="sec-lbl">Picks per Machine Build — by Storage</div>
          <button className="btn btn-outline" onClick={addMachine}>+ Add Machine</button>
        </div>
        <div className="card card-accent">
          <div className="matrix-wrap">
            <table className="matrix">
              <thead><tr>
                <th style={{minWidth:150,paddingLeft:18}}>Machine Type</th>
                {storageTypes.map((s,si)=>(
                  <th key={s} className="st-th" style={{color:storageColorMap[s]}}>
                    {s}<div style={{fontWeight:400,fontSize:9,color:'var(--text-d)',marginTop:1,textTransform:'none',letterSpacing:0}}>picks/build</div>
                  </th>
                ))}
                <th style={{textAlign:'right',minWidth:100,paddingRight:18}}>Total/Build</th>
                <th style={{width:28}}/>
              </tr></thead>
              <tbody>
                {machineTypes.map((m,mi)=>{
                  const col=machineColorMap[m], total=totalPPB(m), pct=total/maxPPB
                  return (
                    <tr key={m}>
                      <td style={{paddingLeft:18}}>
                        <div className="m-cell">
                          <span className="m-icon" style={{color:col}}>{machineIcon(mi)}</span>
                          <input className="m-name" style={{color:col}} defaultValue={m} onBlur={e=>renameMachine(m,e.target.value.trim())} onKeyDown={e=>e.key==='Enter'&&e.target.blur()}/>
                        </div>
                      </td>
                      {storageTypes.map((s,si)=>{
                        const v=(picksPerBuild[m]||{})[s]||0
                        return <td key={s} style={{textAlign:'right'}}>
                          <input className={`picks ${v>0?'filled':''}`} type="number" min="0" value={v}
                            style={{borderColor:v>0?storageColorMap[s]+'80':undefined}}
                            onChange={e=>updatePicks(m,s,e.target.value)}/>
                        </td>
                      })}
                      <td style={{paddingRight:18}}>
                        <div className="total-num">{total.toLocaleString()}</div>
                        <div className="mini-bar" style={{width:`${pct*100}%`,background:col}}/>
                      </td>
                      <td>{machineTypes.length>1&&<button className="btn-del" onClick={()=>removeMachine(m)}>✕</button>}</td>
                    </tr>
                  )
                })}
                {/* Baseline row */}
                <tr style={{background:'var(--amber-bg)'}}>
                  <td style={{paddingLeft:18}}>
                    <div className="m-cell">
                      <span className="m-icon" style={{color:'var(--amber)'}}>⊕</span>
                      <span style={{fontSize:12,fontWeight:600,color:'var(--amber)'}}>Non-Machine Tasks</span>
                    </div>
                    <div style={{fontSize:10,color:'var(--text-d)',paddingLeft:28,marginTop:1}}>Fixed daily picks (baseline)</div>
                  </td>
                  {storageTypes.map(s=>(
                    <td key={s} style={{textAlign:'right'}}>
                      <input className="bl-inp" type="number" min="0" value={baseline[s]||0} onChange={e=>setBaseline(s,e.target.value)}/>
                    </td>
                  ))}
                  <td style={{paddingRight:18}}>
                    <div style={{fontFamily:'var(--mono)',fontSize:12,fontWeight:700,color:'var(--amber)',textAlign:'right'}}>{storageTypes.reduce((a,s)=>a+(baseline[s]||0),0).toLocaleString()}</div>
                    <div style={{fontSize:9,color:'var(--text-d)',textAlign:'right'}}>picks/day</div>
                  </td>
                  <td/>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Starts */}
      <div className="sec">
        <div className="sec-hdr"><div className="sec-lbl">Production Starts per Month</div></div>
        <div className="starts-grid">
          {machineTypes.map((type,mi)=>{
            const col=machineColorMap[type], total=(machineStarts[type]||[]).reduce((a,b)=>a+b,0)
            return (
              <div key={type} className="sc">
                <div className="sc-hdr" style={{borderLeftColor:col}}>
                  <span style={{color:col,fontSize:13}}>{machineIcon(mi)}</span>
                  <span style={{fontWeight:600,fontSize:12,color:col}}>{type}</span>
                  <span style={{marginLeft:'auto',fontSize:11,color:'var(--text-d)'}}>{total} starts</span>
                </div>
                <div className="month-row">
                  {MONTHS.map((m,i)=>{
                    const v=(machineStarts[type]||[])[i]||0
                    return <div key={m} className="m-wrap">
                      <div className="m-lbl">{m}</div>
                      <input className={`m-inp ${v>0?'filled':''}`} type="number" min="0" value={v}
                        style={{borderColor:v>0?col+'90':undefined}}
                        onChange={e=>updateStart(type,i,e.target.value)}/>
                    </div>
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Distribution */}
      <div className="sec">
        <div className="sec-hdr"><div className="sec-lbl">Work Distribution per Machine Type</div></div>
        <div className="dist-grid">
          {machineTypes.map((type,mi)=>{
            const col=machineColorMap[type], dist=workDist[type]||[]
            const sum=dist.reduce((a,b)=>a+b,0), ok=Math.abs(sum-1)<0.01
            return (
              <div key={type} className="dc">
                <div className="dc-hdr" style={{borderLeftColor:col}}>
                  <span style={{color:col,fontSize:13}}>{machineIcon(mi)}</span>
                  <span style={{fontWeight:600,fontSize:12,color:col}}>{type}</span>
                  <span className="dist-sum" style={{color:ok?'var(--ok)':'var(--warn)',marginLeft:'auto'}}>Σ={(sum*100).toFixed(0)}% {ok?'✓':'⚠'}</span>
                </div>
                {dist.map((v,idx)=>(
                  <div key={idx} className="dist-row">
                    <div className="dist-lbl">M+{idx+1}</div>
                    <div className="dist-track"><div className="dist-fill" style={{width:`${v*100}%`,background:col}}/></div>
                    <input className="dist-inp" type="number" step="0.05" min="0" max="1" value={v} onChange={e=>updateDist(type,idx,e.target.value)}/>
                  </div>
                ))}
                <div style={{display:'flex',gap:6,padding:'6px 12px 9px'}}>
                  {dist.length<8&&<button className="btn btn-ghost" style={{fontSize:10,padding:'3px 7px'}} onClick={()=>addDistMonth(type)}>+ Month</button>}
                  {dist.length>1&&<button className="btn btn-danger" style={{fontSize:10,padding:'3px 7px'}} onClick={()=>remDistMonth(type)}>− Month</button>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <button className="run-btn" onClick={onRun}>▶ Run Simulation</button>
    </div>
  )
}
