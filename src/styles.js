const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --blue:#0080c9;--blue-d:#005fa3;--blue-l:#e6f3fb;
  --bg:#f0f4f8;--white:#fff;--panel:#fff;
  --border:#cdd7e3;--border-d:#9ab0c8;
  --text:#1a2533;--text-m:#4a6080;--text-d:#7a95b0;
  --ok:#00875a;--ok-bg:#e3fcef;
  --warn:#de350b;--warn-bg:#ffebe6;
  --amber:#d97706;--amber-bg:#fef3c7;
  --purple:#7c3aed;--purple-bg:#ede9fe;
  --r:6px;--sh:0 1px 3px rgba(0,40,80,.08),0 0 0 1px rgba(0,40,80,.04);
  --sh-lg:0 8px 24px rgba(0,40,80,.12),0 0 0 1px rgba(0,40,80,.06);
  --font:'Inter',sans-serif;--mono:'JetBrains Mono',monospace;
}
body{background:var(--bg);color:var(--text);font-family:var(--font);font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}
.layout{display:flex;min-height:100vh}
.sidebar{width:220px;flex-shrink:0;background:var(--blue-d);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto;z-index:50}
.main{flex:1;min-width:0;overflow:auto}
.sb-logo{padding:22px 18px 16px;border-bottom:1px solid rgba(255,255,255,.1)}
.sb-brand{font-size:20px;font-weight:700;letter-spacing:.5px;color:#fff}
.sb-sub{font-size:9px;font-weight:500;letter-spacing:2.5px;color:rgba(255,255,255,.4);margin-top:4px;text-transform:uppercase}
.sb-nav{padding:8px 0;flex:1}
.sb-section{padding:10px 18px 3px;font-size:9px;font-weight:600;letter-spacing:2px;color:rgba(255,255,255,.3);text-transform:uppercase}
.sb-item{display:flex;align-items:center;gap:9px;padding:9px 18px;cursor:pointer;font-size:13px;font-weight:500;color:rgba(255,255,255,.6);transition:all .15s;border-left:3px solid transparent;user-select:none}
.sb-item:hover{background:rgba(255,255,255,.07);color:#fff}
.sb-item.active{background:rgba(255,255,255,.12);color:#fff;border-left-color:#fff}
.sb-icon{font-size:14px;width:18px;text-align:center;flex-shrink:0}
.sb-footer{padding:14px 18px;border-top:1px solid rgba(255,255,255,.1);font-size:10px;color:rgba(255,255,255,.3);line-height:1.9}
.topbar{background:#fff;border-bottom:1px solid var(--border);padding:0 24px;height:54px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:40;box-shadow:0 1px 3px rgba(0,40,80,.06)}
.topbar-title{font-size:15px;font-weight:600}
.topbar-right{display:flex;align-items:center;gap:12px}
.pill{display:flex;align-items:center;gap:5px;padding:3px 10px;border-radius:12px;font-size:11px;font-weight:500}
.pill-ok{background:var(--ok-bg);color:var(--ok)}
.pill-dot{width:6px;height:6px;border-radius:50%;background:currentColor;animation:blink 2s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.topbar-time{font-family:var(--mono);font-size:11px;color:var(--text-d)}
.content{padding:20px 24px 60px}
.card{background:var(--panel);border:1px solid var(--border);border-radius:var(--r);box-shadow:var(--sh)}
.card-accent{border-top:2px solid var(--blue)}
.card-header{padding:12px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:10px}
.card-title{font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase}
.card-sub{font-size:11px;color:var(--text-d);margin-top:1px}
.card-body{padding:18px}
.sec{margin-bottom:18px}
.sec-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.sec-lbl{font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-m);display:flex;align-items:center;gap:7px}
.sec-lbl::before{content:'';display:inline-block;width:3px;height:13px;background:var(--blue);border-radius:2px}
.kpi-row{display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-bottom:18px}
.kpi{background:var(--panel);border:1px solid var(--border);border-top:3px solid var(--border);border-radius:var(--r);padding:14px 16px;box-shadow:var(--sh)}
.kpi-lbl{font-size:9px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-d);margin-bottom:5px}
.kpi-val{font-size:24px;font-weight:700;line-height:1}
.kpi-sub{font-size:10px;color:var(--text-d);margin-top:3px}
.storage-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.s-row{display:flex;align-items:center;gap:8px;padding:7px 11px;background:var(--bg);border:1px solid var(--border);border-radius:var(--r);transition:border-color .15s}
.s-row:focus-within{border-color:var(--blue)}
.s-dot{width:10px;height:10px;border-radius:2px;flex-shrink:0}
.s-name{flex:1;min-width:0;background:transparent;border:none;outline:none;font-family:var(--font);font-size:13px;font-weight:500;color:var(--text)}
.s-cap{width:72px;text-align:right;background:#fff;border:1px solid var(--border);border-radius:4px;padding:3px 6px;font-family:var(--mono);font-size:12px;outline:none;transition:border-color .15s}
.s-cap:focus{border-color:var(--blue)}
.s-unit{font-size:10px;color:var(--text-d);white-space:nowrap}
.matrix-wrap{overflow-x:auto}
.matrix{width:100%;border-collapse:collapse}
.matrix th{font-size:9px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-d);text-align:left;padding:8px 10px;border-bottom:2px solid var(--border);background:var(--bg);white-space:nowrap}
.matrix th.st-th{text-align:right;border-bottom-color:var(--blue)}
.matrix td{padding:5px 10px;border-bottom:1px solid var(--border);vertical-align:middle}
.matrix tr:last-child td{border-bottom:none}
.matrix tbody tr:hover td{background:var(--blue-l)}
.m-cell{display:flex;align-items:center;gap:8px}
.m-icon{font-size:15px;width:20px;text-align:center}
.m-name{font-size:13px;font-weight:600;background:transparent;border:none;border-bottom:1px solid transparent;outline:none;width:80px;transition:border-color .15s;cursor:text;font-family:var(--font)}
.m-name:focus{border-bottom-color:var(--blue)}
.picks{width:82px;text-align:right;background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:4px 6px;font-family:var(--mono);font-size:12px;outline:none;display:block;transition:border-color .15s,background .15s}
.picks:focus,.picks.filled{background:#fff}
.picks:focus{border-color:var(--blue)}
.total-num{font-family:var(--mono);font-size:12px;font-weight:700;color:var(--blue);text-align:right}
.mini-bar{height:3px;border-radius:2px;margin-top:3px;margin-left:auto}
.bl-inp{width:82px;text-align:right;background:var(--amber-bg);border:1px solid var(--amber);border-radius:4px;padding:4px 6px;font-family:var(--mono);font-size:12px;outline:none;display:block}
.bl-inp:focus{background:#fff}
.starts-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.sc{background:var(--bg);border:1px solid var(--border);border-radius:var(--r);overflow:hidden}
.sc-hdr{padding:8px 12px;display:flex;align-items:center;gap:7px;border-bottom:1px solid var(--border);border-left:3px solid transparent}
.month-row{display:grid;grid-template-columns:repeat(12,1fr);gap:2px;padding:8px 10px}
.m-wrap{display:flex;flex-direction:column;align-items:center;gap:2px}
.m-lbl{font-size:8px;font-weight:600;text-transform:uppercase;color:var(--text-d);letter-spacing:.3px}
.m-inp{width:100%;text-align:center;background:#fff;border:1px solid var(--border);border-radius:3px;padding:3px 1px;font-family:var(--mono);font-size:12px;outline:none;transition:border-color .15s}
.m-inp:focus{border-color:var(--blue);box-shadow:0 0 0 2px var(--blue-l)}
.m-inp.filled{font-weight:600}
.dist-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
.dc{background:var(--bg);border:1px solid var(--border);border-radius:var(--r);overflow:hidden}
.dc-hdr{padding:8px 12px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;border-left:3px solid transparent}
.dist-row{display:flex;align-items:center;gap:7px;padding:4px 12px}
.dist-lbl{font-size:10px;color:var(--text-d);width:50px;flex-shrink:0;font-family:var(--mono)}
.dist-track{flex:1;height:5px;background:var(--border);border-radius:3px;overflow:hidden}
.dist-fill{height:100%;border-radius:3px;transition:width .3s}
.dist-inp{width:50px;text-align:center;background:#fff;border:1px solid var(--border);border-radius:3px;padding:3px;font-family:var(--mono);font-size:11px;outline:none}
.dist-inp:focus{border-color:var(--blue)}
.dist-sum{font-size:11px;font-weight:600;font-family:var(--mono)}
.btn{display:inline-flex;align-items:center;gap:5px;cursor:pointer;font-family:var(--font);font-weight:500;border-radius:4px;transition:all .15s;border:1px solid transparent;font-size:12px;padding:5px 12px}
.btn-primary{background:var(--blue);color:#fff;border-color:var(--blue)}
.btn-primary:hover{background:var(--blue-d)}
.btn-outline{background:transparent;color:var(--blue);border-color:var(--blue)}
.btn-outline:hover{background:var(--blue-l)}
.btn-ghost{background:transparent;color:var(--text-d);border-color:var(--border)}
.btn-ghost:hover{background:var(--bg);color:var(--text)}
.btn-danger{background:transparent;color:var(--warn);border-color:rgba(222,53,11,.3)}
.btn-danger:hover{background:var(--warn-bg)}
.btn-green{background:#059669;color:#fff;border-color:#059669}
.btn-green:hover{background:#047857}
.btn-purple{background:var(--purple);color:#fff;border-color:var(--purple)}
.btn-purple:hover{background:#6d28d9}
.btn-del{background:none;border:none;color:var(--text-d);cursor:pointer;padding:2px 5px;font-size:13px;border-radius:3px;transition:color .15s}
.btn-del:hover{color:var(--warn)}
.run-btn{display:flex;align-items:center;justify-content:center;gap:8px;width:100%;max-width:280px;margin:22px auto;background:var(--blue);color:#fff;font-family:var(--font);font-size:14px;font-weight:600;padding:12px 24px;border:none;border-radius:var(--r);cursor:pointer;box-shadow:0 2px 8px rgba(0,128,201,.3);transition:all .2s}
.run-btn:hover{background:var(--blue-d);box-shadow:0 4px 16px rgba(0,128,201,.4);transform:translateY(-1px)}
.anim-bar{display:flex;align-items:center;gap:10px;padding:10px 18px;border-bottom:1px solid var(--border);background:linear-gradient(90deg,var(--blue-l),var(--bg));flex-wrap:wrap}
.anim-btn{display:flex;align-items:center;gap:5px;padding:6px 14px;border-radius:4px;border:1px solid var(--blue);background:transparent;color:var(--blue);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;font-family:var(--font)}
.anim-btn:hover,.anim-btn.playing{background:var(--blue);color:#fff}
.anim-btn.stop{border-color:var(--warn);color:var(--warn)}
.anim-btn.stop:hover{background:var(--warn);color:#fff}
.speed-sel,.range-sel{font-family:var(--mono);font-size:11px;padding:4px 8px;border:1px solid var(--border);border-radius:4px;background:#fff;outline:none;color:var(--text);cursor:pointer}
.anim-prog{flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden;min-width:80px}
.anim-prog-fill{height:100%;background:var(--blue);border-radius:2px;transition:width .1s linear}
.anim-day{font-family:var(--mono);font-size:11px;color:var(--blue);font-weight:600;min-width:80px}
.pulse{width:8px;height:8px;border-radius:50%;background:var(--blue);animation:animPulse 1s infinite;flex-shrink:0}
@keyframes animPulse{0%,100%{box-shadow:0 0 0 0 rgba(0,128,201,.3)}50%{box-shadow:0 0 0 6px rgba(0,128,201,0)}}
.tl-ctrl{display:flex;align-items:center;gap:12px;padding:11px 18px;border-bottom:1px solid var(--border);background:var(--bg);flex-wrap:wrap}
.ctrl-lbl{font-size:9px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-d)}
.view-btns{display:flex;border:1px solid var(--border);border-radius:4px;overflow:hidden}
.vbtn{font-size:11px;padding:4px 10px;border:none;background:transparent;cursor:pointer;color:var(--text-d);transition:all .15s;font-weight:500}
.vbtn.active{background:var(--blue);color:#fff}
.vbtn:hover:not(.active){background:var(--blue-l);color:var(--blue)}
.month-pills{display:flex;gap:3px;flex-wrap:wrap}
.mpill{font-size:9px;padding:3px 7px;border-radius:10px;border:1px solid var(--border);background:transparent;cursor:pointer;color:var(--text-d);transition:all .15s;font-weight:500}
.mpill.active{background:var(--blue);color:#fff;border-color:var(--blue)}
.mpill:hover:not(.active){border-color:var(--blue);color:var(--blue)}
.day-slider{accent-color:var(--blue);flex:1;min-width:120px;cursor:pointer}
.day-display{font-family:var(--mono);font-size:12px;color:var(--blue);font-weight:500;min-width:80px}
.export-bar{display:flex;align-items:center;gap:8px;padding:10px 18px;border-bottom:1px solid var(--border);background:var(--bg);flex-wrap:wrap}
.export-lbl{font-size:11px;font-weight:500;color:var(--text-m)}
.chart-wrap{padding:14px 18px;overflow:auto;position:relative}
.bar-area{display:flex;align-items:flex-end;gap:1px;position:relative;cursor:crosshair}
.b-wrap{flex:1;display:flex;flex-direction:column;justify-content:flex-end;cursor:pointer;position:relative;min-width:0}
.b-wrap:hover .b-seg{filter:brightness(1.1)}
.b-wrap.sel::after,.b-wrap.cur::after{content:'';position:absolute;inset:0;border-radius:1px;pointer-events:none;z-index:2}
.b-wrap.sel::after{border:1.5px solid rgba(0,128,201,.6)}
.b-wrap.cur::after{border:2px solid var(--blue);box-shadow:0 0 8px rgba(0,128,201,.5);inset:-2px}
.b-seg{width:100%;min-height:1px}
.b-base{width:100%;min-height:1px;background:repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(0,0,0,.15) 2px,rgba(0,0,0,.15) 4px)}
.b-carry{width:100%;min-height:1px;background:repeating-linear-gradient(-45deg,rgba(222,53,11,.8),rgba(222,53,11,.8) 2px,rgba(255,255,255,.3) 2px,rgba(255,255,255,.3) 4px)}
.cap-line{position:absolute;left:0;right:0;border-top:1.5px dashed var(--warn);z-index:3;pointer-events:none}
.cap-lbl{position:absolute;right:0;top:-14px;font-size:9px;font-weight:600;color:var(--warn);font-family:var(--mono)}
.grid-line{position:absolute;left:0;right:0;border-top:1px solid var(--border);pointer-events:none}
.grid-lbl{position:absolute;left:0;top:-9px;font-size:9px;color:var(--text-d);font-family:var(--mono)}
.hm-wrap{overflow:auto;padding:10px 18px 14px}
.hm-grid{display:grid;grid-template-columns:78px repeat(53,13px);gap:2px;align-items:center}
.hm-cell{width:13px;height:13px;border-radius:2px;cursor:pointer;transition:transform .1s}
.hm-cell:hover{transform:scale(1.6);z-index:10;position:relative}
.hm-row-lbl{font-family:var(--mono);font-size:9px;color:var(--text-d);text-align:right;padding-right:6px}
.hm-week-lbl{font-family:var(--mono);font-size:8px;color:var(--text-d);text-align:center}
.legend{display:flex;gap:10px;flex-wrap:wrap;padding:9px 18px;border-top:1px solid var(--border);background:var(--bg)}
.leg-item{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--text-m);font-weight:500}
.leg-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0}
.leg-line{width:14px;height:2px;flex-shrink:0;background:var(--warn)}
.leg-hatch{width:14px;height:8px;border-radius:1px;flex-shrink:0}
.day-detail{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--border)}
.dc-col{padding:14px 18px}
.dc-col+.dc-col{border-left:1px solid var(--border)}
.dc-title{font-size:9px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-d);margin-bottom:10px}
.util-row{display:flex;align-items:center;gap:7px;margin-bottom:7px}
.util-lbl{font-size:11px;font-weight:500;width:74px;flex-shrink:0}
.util-track{flex:1;height:9px;background:var(--border);border-radius:5px;overflow:hidden}
.util-fill{height:100%;border-radius:5px;transition:width .4s}
.util-pct{font-family:var(--mono);font-size:10px;width:32px;text-align:right;font-weight:600}
.util-abs{font-family:var(--mono);font-size:9px;color:var(--text-d);width:96px;text-align:right}
.sum-row{display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid var(--border)}
.sum-row:last-child{border-bottom:none}
.sum-key{font-size:12px;color:var(--text-m)}
.sum-val{font-family:var(--mono);font-size:12px;font-weight:600}
.bl-wrap{padding:10px 18px}
.bl-bars{display:flex;align-items:flex-end;gap:1px;height:72px}
.bl-bar{flex:1;border-radius:1px 1px 0 0;cursor:pointer;min-height:0;transition:opacity .1s}
.m-table-card{background:var(--panel);border:1px solid var(--border);border-radius:var(--r);box-shadow:var(--sh);overflow:hidden}
.m-table{width:100%;border-collapse:collapse}
.m-table th{font-size:9px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-d);text-align:left;padding:8px 13px;border-bottom:2px solid var(--border);background:var(--bg);white-space:nowrap}
.m-table td{padding:7px 13px;border-bottom:1px solid var(--border);font-size:12px}
.m-table tr:last-child td{border-bottom:none}
.m-table tbody tr:hover td{background:var(--blue-l)}
.wl-track{width:100%;height:5px;background:var(--border);border-radius:3px;overflow:hidden;min-width:70px}
.wl-fill{height:100%;border-radius:3px;transition:width .4s}
.badge{display:inline-flex;align-items:center;padding:2px 7px;border-radius:10px;font-size:10px;font-weight:600}
.badge-ok{background:var(--ok-bg);color:var(--ok)}
.badge-warn{background:var(--warn-bg);color:var(--warn)}
.badge-amber{background:var(--amber-bg);color:var(--amber)}
.tooltip{position:fixed;background:#fff;border:1px solid var(--border);border-radius:var(--r);padding:8px 11px;font-size:11px;pointer-events:none;z-index:9999;box-shadow:var(--sh-lg);min-width:170px}
.tt-title{font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--blue);margin-bottom:5px;border-bottom:1px solid var(--border);padding-bottom:4px}
.tt-row{display:flex;justify-content:space-between;gap:12px;margin-top:3px}
.tt-k{color:var(--text-d)}.tt-v{font-family:var(--mono);font-weight:600}
.tt-warn{color:var(--warn)}.tt-ok{color:var(--ok)}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--border-d);border-radius:3px}
@media(max-width:1100px){
  .sidebar{width:48px}
  .sb-brand,.sb-sub,.sb-item span,.sb-footer,.sb-section{display:none}
  .sb-item{justify-content:center;padding:10px 0;border-left:none}
  .kpi-row{grid-template-columns:repeat(3,1fr)}
  .starts-grid,.dist-grid,.storage-grid,.day-detail{grid-template-columns:1fr}
  .dc-col+.dc-col{border-left:none;border-top:1px solid var(--border)}
}
`
export default css
