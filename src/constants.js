export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export const DEFAULT_MACHINE_TYPES = ['XT','NXT','NXE','EXE']
export const MACHINE_PALETTE = ['#0080c9','#059669','#7c3aed','#d97706','#dc2626','#0891b2','#65a30d','#db2777']
export const MACHINE_ICONS   = ['⬡','◈','◆','◉','▲','■','●','★']
export const DEFAULT_STORAGE_TYPES = ['Mecalux','Knapp','FS0','FS2','MR']
export const STORAGE_PALETTE = ['#0080c9','#d97706','#059669','#7c3aed','#dc2626','#0891b2','#65a30d','#db2777']
export const DEFAULT_PICKS_PER_BUILD = {
  XT:  {Mecalux:3200,Knapp:2100,FS0:150,FS2:400, MR:520 },
  NXT: {Mecalux:6000,Knapp:4500,FS0:200,FS2:700, MR:960 },
  NXE: {Mecalux:8200,Knapp:5100,FS0:350,FS2:900, MR:1200},
  EXE: {Mecalux:9800,Knapp:6400,FS0:480,FS2:1100,MR:1500},
}
export const DEFAULT_WORK_DIST = {
  XT:  [0.35,0.30,0.20,0.15],
  NXT: [0.30,0.25,0.20,0.15,0.10],
  NXE: [0.40,0.30,0.20,0.10],
  EXE: [0.25,0.25,0.20,0.15,0.10,0.05],
}
export const DEFAULT_CAPACITY = {Mecalux:2500,Knapp:2000,FS0:300,FS2:500,MR:800}
export const DEFAULT_BASELINE = {Mecalux:120,Knapp:80,FS0:20,FS2:30,MR:40}
