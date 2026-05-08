import { useState, useMemo } from 'react'
import { DEFAULT_MACHINE_TYPES,DEFAULT_STORAGE_TYPES,DEFAULT_PICKS_PER_BUILD,DEFAULT_WORK_DIST,DEFAULT_CAPACITY,DEFAULT_BASELINE,MACHINE_PALETTE,MACHINE_ICONS,STORAGE_PALETTE } from '../constants.js'
import { buildDemand, simulate } from '../simulation.js'

export const machineColor = i => MACHINE_PALETTE[i%MACHINE_PALETTE.length]
export const storageColor = i => STORAGE_PALETTE[i%STORAGE_PALETTE.length]
export const machineIcon  = i => MACHINE_ICONS[i%MACHINE_ICONS.length]

export function useAppState() {
  const [machineTypes, setMachineTypes] = useState([...DEFAULT_MACHINE_TYPES])
  const [storageTypes, setStorageTypes] = useState([...DEFAULT_STORAGE_TYPES])
  const [machineStarts, setMachineStarts] = useState(()=>Object.fromEntries(DEFAULT_MACHINE_TYPES.map(t=>[t,Array(12).fill(0)])))
  const [workDist, setWorkDist]           = useState(()=>JSON.parse(JSON.stringify(DEFAULT_WORK_DIST)))
  const [picksPerBuild, setPicksPerBuild] = useState(()=>JSON.parse(JSON.stringify(DEFAULT_PICKS_PER_BUILD)))
  const [capacity, setCapacityMap]        = useState(()=>JSON.parse(JSON.stringify(DEFAULT_CAPACITY)))
  const [baseline, setBaselineMap]        = useState(()=>JSON.parse(JSON.stringify(DEFAULT_BASELINE)))

  const machineColorMap = useMemo(()=>Object.fromEntries(machineTypes.map((t,i)=>[t,machineColor(i)])),[machineTypes])
  const storageColorMap = useMemo(()=>Object.fromEntries(storageTypes.map((s,i)=>[s,storageColor(i)])),[storageTypes])

  const renameMachine = (o,n)=>{ if(!n||n===o) return
    setMachineTypes(p=>p.map(t=>t===o?n:t))
    setMachineStarts(p=>{const x={...p};x[n]=x[o]||Array(12).fill(0);delete x[o];return x})
    setWorkDist(p=>{const x={...p};x[n]=x[o]||[1];delete x[o];return x})
    setPicksPerBuild(p=>{const x={...p};x[n]=x[o]||{};delete x[o];return x})
  }
  const addMachine = ()=>{ const n=`MACH${machineTypes.length+1}`
    setMachineTypes(p=>[...p,n]); setMachineStarts(p=>({...p,[n]:Array(12).fill(0)}))
    setWorkDist(p=>({...p,[n]:[0.40,0.35,0.25]}))
    setPicksPerBuild(p=>({...p,[n]:Object.fromEntries(storageTypes.map(s=>[s,0]))}))
  }
  const removeMachine = n=>{ if(machineTypes.length<=1) return
    setMachineTypes(p=>p.filter(t=>t!==n))
    setMachineStarts(p=>{const x={...p};delete x[n];return x})
    setWorkDist(p=>{const x={...p};delete x[n];return x})
    setPicksPerBuild(p=>{const x={...p};delete x[n];return x})
  }
  const updateStart = (type,mi,val)=>setMachineStarts(p=>({...p,[type]:p[type].map((x,i)=>i===mi?Math.max(0,parseInt(val)||0):x)}))
  const updateDist  = (type,idx,val)=>setWorkDist(p=>({...p,[type]:p[type].map((x,i)=>i===idx?Math.min(1,Math.max(0,parseFloat(val)||0)):x)}))
  const addDistMonth   = type=>setWorkDist(p=>({...p,[type]:[...p[type],0]}))
  const remDistMonth   = type=>setWorkDist(p=>({...p,[type]:p[type].slice(0,-1)}))
  const updatePicks = (m,s,val)=>setPicksPerBuild(p=>({...p,[m]:{...p[m],[s]:Math.max(0,parseInt(val)||0)}}))

  const renameStorage = (o,n)=>{ if(!n||n===o) return
    setStorageTypes(p=>p.map(s=>s===o?n:s))
    setCapacityMap(p=>{const x={...p};x[n]=x[o]||500;delete x[o];return x})
    setBaselineMap(p=>{const x={...p};x[n]=x[o]||0;delete x[o];return x})
    setPicksPerBuild(p=>{const x={};for(const m in p){x[m]={...p[m]};x[m][n]=x[m][o]||0;delete x[m][o]}return x})
  }
  const addStorage = ()=>{ const n=`ST${storageTypes.length+1}`
    setStorageTypes(p=>[...p,n]); setCapacityMap(p=>({...p,[n]:500})); setBaselineMap(p=>({...p,[n]:0}))
    setPicksPerBuild(p=>{const x={};for(const m in p) x[m]={...p[m],[n]:0};return x})
  }
  const removeStorage = n=>{ if(storageTypes.length<=1) return
    setStorageTypes(p=>p.filter(s=>s!==n))
    setCapacityMap(p=>{const x={...p};delete x[n];return x})
    setBaselineMap(p=>{const x={...p};delete x[n];return x})
    setPicksPerBuild(p=>{const x={};for(const m in p){x[m]={...p[m]};delete x[m][n]}return x})
  }
  const setCap      = (s,val)=>setCapacityMap(p=>({...p,[s]:Math.max(0,parseInt(val)||0)}))
  const setBaseline = (s,val)=>setBaselineMap(p=>({...p,[s]:Math.max(0,parseInt(val)||0)}))

  const runSimulation = ()=>{ const demand=buildDemand(machineTypes,machineStarts,picksPerBuild,workDist,storageTypes); return simulate(demand,capacity,baseline,storageTypes) }

  return { machineTypes,storageTypes,machineStarts,workDist,picksPerBuild,capacity,baseline,machineColorMap,storageColorMap,
    renameMachine,addMachine,removeMachine,updateStart,updateDist,addDistMonth,remDistMonth,updatePicks,
    renameStorage,addStorage,removeStorage,setCap,setBaseline,runSimulation }
}
