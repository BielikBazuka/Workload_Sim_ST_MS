import { useState, useEffect } from 'react'
import css from './styles.js'
import { useAppState } from './hooks/useAppState.js'
import ConfigView from './components/ConfigView.jsx'
import SimView from './components/SimView.jsx'

export default function App() {
  const [tab, setTab]             = useState('config')
  const [simResult, setSimResult] = useState(null)
  const [animKey, setAnimKey]     = useState(0)
  const [time, setTime]           = useState(new Date().toTimeString().slice(0,8))
  const state = useAppState()

  useEffect(()=>{ const t=setInterval(()=>setTime(new Date().toTimeString().slice(0,8)),1000); return()=>clearInterval(t) },[])

  const handleRun = () => {
    setSimResult(state.runSimulation())
    setTab('simulation')
    setAnimKey(k=>k+1)
  }

  return (
    <>
      <style>{css}</style>
      <div className="layout">
        <div className="sidebar">
          <div className="sb-logo">
            <div className="sb-brand">ASML</div>
            <div className="sb-sub">Picking Simulation</div>
          </div>
          <nav className="sb-nav">
            <div className="sb-section">Modules</div>
            {[{id:'config',icon:'⚙',label:'Configuration'},{id:'simulation',icon:'▶',label:'Simulation'}].map(item=>(
              <div key={item.id} className={`sb-item ${tab===item.id?'active':''}`} onClick={()=>setTab(item.id)}>
                <span className="sb-icon">{item.icon}</span><span>{item.label}</span>
              </div>
            ))}
          </nav>
          <div className="sb-footer"><div>PickFlow v1.0</div><div style={{color:'rgba(255,255,255,.5)',fontFamily:'var(--mono)',fontSize:11}}>{time}</div></div>
        </div>
        <div className="main">
          <div className="topbar">
            <div className="topbar-title">{tab==='config'?'Configuration':'Simulation Results'}</div>
            <div className="topbar-right">
              <div className="pill pill-ok"><div className="pill-dot"/>System Online</div>
              <div className="topbar-time">{time}</div>
            </div>
          </div>
          <div className="content">
            {tab==='config' && <ConfigView {...state} onRun={handleRun}/>}
            {tab==='simulation' && simResult && <SimView key={animKey} result={simResult} storageTypes={state.storageTypes} capacity={state.capacity} baseline={state.baseline} storageColorMap={state.storageColorMap} machineTypes={state.machineTypes} machineColorMap={state.machineColorMap} machineStarts={state.machineStarts} picksPerBuild={state.picksPerBuild}/>}
            {tab==='simulation' && !simResult && (
              <div style={{textAlign:'center',padding:'80px 0',color:'var(--text-d)'}}>
                <div style={{fontSize:36,marginBottom:12}}>▶</div>
                <div style={{fontWeight:500}}>Configure parameters and run the simulation</div>
                <button className="btn btn-primary" style={{marginTop:16}} onClick={()=>setTab('config')}>Go to Configuration</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
