const G=[["beranda","🏠","Beranda"],["belajar","📖","Belajar"],["latihan","✍️","Latihan"],["tes","🎯","Tes"],["alat","🧰","Alat"]];
const TG={home:"beranda",card:"belajar",srs:"belajar",audio:"belajar",list:"belajar",dict:"belajar",quiz:"latihan",lafal:"latihan",note:"latihan",test:"tes",prog:"tes",acct:"alat",admin:"alat",mist:"latihan",my:"alat",tpl:"alat"};
const gtab={beranda:"home",belajar:"card",latihan:"quiz",tes:"test",alat:"my"};
function navUI(){const g=TG[tab]||"belajar";gtab[g]=tab;
 $("#gnav").innerHTML=G.map(x=>`<button class="${x[0]===g?"on":""}" data-g="${x[0]}" aria-label="${x[2]}"><span aria-hidden="true">${x[1]}</span>${x[2]}</button>`).join("");
 let n=0;document.querySelectorAll(".tabs button").forEach(b=>{const t=b.dataset.tab,v=TG[t]===g&&(t==="admin"?ROLE==="admin":(ROLE==="admin"||!CFG.off.includes(t)));b.hidden=!v;if(v)n++;b.classList.toggle("on",b.dataset.tab===tab)});
 $(".tabs").style.display=n>1?"":"none";
 const a=g==="alat"?"":"none";document.querySelectorAll(".bk").forEach(x=>x.style.display=a);$("#reset").style.display=a;sideNav();$("#home").hidden=tab!=="home";$("#view").hidden=tab==="home";{const rb=$("#rolebadge");if(rb)rb.hidden=ROLE!=="admin"}}
$("#gnav").addEventListener("click",e=>{const b=e.target.closest("[data-g]");if(b){tab=gtab[b.dataset.g];render();window.scrollTo(0,0)}});
function barsSVG(vals,labs){const W=320,H=130,m=8,mx=Math.max(1,...vals),bw=(W-m)/vals.length;
 return `<svg viewBox="0 0 ${W} ${H+26}" class="chart" role="img" aria-label="Grafik batang">${vals.map((v,i)=>{const h=Math.round(v/mx*(H-22)),x=m+i*bw+bw*.15,c=x+bw*.35;return `<rect x="${x}" y="${H-h}" width="${bw*.7}" height="${Math.max(h,v?2:0)}" rx="3" style="fill:var(--pri)"/><text x="${c}" y="${H-h-4}" text-anchor="middle" font-size="10" fill="currentColor">${v||""}</text><text x="${c}" y="${H+14}" text-anchor="middle" font-size="9" fill="currentColor" opacity=".7">${labs[i]}</text>`}).join("")}<line x1="${m}" y1="${H}" x2="${W}" y2="${H}" stroke="currentColor" opacity=".25"/></svg>`}
function lineSVG(h){const W=320,H=120,n=h.length,X=i=>n<2?W/2:24+i*(W-48)/(n-1),Y=v=>H-v/100*(H-16);
 return `<svg viewBox="0 0 ${W} ${H+36}" class="chart" role="img" aria-label="Tren skor tes level"><line x1="16" y1="${H}" x2="${W-10}" y2="${H}" stroke="currentColor" opacity=".25"/>${n>1?`<path d="${h.map((p,i)=>(i?"L":"M")+X(i)+" "+Y(p.tot)).join(" ")}" fill="none" style="stroke:var(--pri)" stroke-width="2.5"/>`:""}${h.map((p,i)=>`<circle cx="${X(i)}" cy="${Y(p.tot)}" r="4.5" style="fill:var(--pri)"/><text x="${X(i)}" y="${Y(p.tot)-9}" text-anchor="middle" font-size="11" fill="currentColor">${p.tot}%</text><text x="${X(i)}" y="${H+14}" text-anchor="middle" font-size="10" fill="currentColor" opacity=".8">${esc(String(p.est))}</text><text x="${X(i)}" y="${H+27}" text-anchor="middle" font-size="9" fill="currentColor" opacity=".55">${esc(String(p.d).slice(5))}</text>`).join("")}</svg>`}
function radarSVG(vals,labs){const cx=150,cy=108,R=68,n=vals.length,P=(i,r)=>[cx+r*Math.sin(2*Math.PI*i/n),cy-r*Math.cos(2*Math.PI*i/n)],ring=f=>vals.map((_,i)=>P(i,R*f).join(",")).join(" ");
 return `<svg viewBox="0 0 300 220" class="chart" role="img" aria-label="Peta kemampuan">${[.33,.66,1].map(f=>`<polygon points="${ring(f)}" fill="none" stroke="currentColor" opacity=".2"/>`).join("")}${vals.map((_,i)=>{const q=P(i,R);return `<line x1="${cx}" y1="${cy}" x2="${q[0]}" y2="${q[1]}" stroke="currentColor" opacity=".2"/>`}).join("")}<polygon points="${vals.map((v,i)=>P(i,R*v/100).join(",")).join(" ")}" style="fill:var(--pri);fill-opacity:.25;stroke:var(--pri)" stroke-width="2"/>${labs.map((l,i)=>{const q=P(i,R+18);return `<text x="${q[0]}" y="${q[1]+4}" text-anchor="middle" font-size="12" fill="currentColor">${l} ${vals[i]}%</text>`}).join("")}</svg>`}
function prog(){
 const t=dstr(0),h=Object.assign({},meta.h||{});if(meta.td&&meta.td.d===t)h[t]=meta.td.w.length;
 const days=[...Array(14)].map((_,i)=>dstr(i-13)),vals=days.map(d=>h[d]||0),active=Object.keys(h).filter(k=>h[k]>0).length,tot14=vals.reduce((a,b)=>a+b,0);
 const kn=ALL.filter(w=>known[w.en]).length,sv=Object.values(srs);
 const fc=[...Array(7)].map((_,i)=>sv.filter(v=>i===0?v.d<=t:v.d===dstr(i)).length),fl=[...Array(7)].map((_,i)=>i===0?"hari ini":dstr(i).slice(8));
 const last=[...TH].reverse().find(x=>x.ps),lv=Object.values(LH).filter(x=>typeof x==="number"),la=lv.length?Math.round(lv.reduce((a,b)=>a+b,0)/lv.length):0;
 const SK=["Kosakata","Tata bahasa","Membaca","Menyimak","Lafal"],sk=last?[last.ps.v,last.ps.g,last.ps.r,last.ps.l,la]:[0,0,0,0,la];
 const wk=last?sk.indexOf(Math.min(...sk)):-1,st=last?sk.indexOf(Math.max(...sk)):-1;
 view.innerHTML=`<div class="sum"><div class="c2"><small>Kata dikuasai</small><strong>${kn}</strong><span>dari ${ALL.length}</span></div><div class="c2"><small>Hari aktif</small><strong>${active}</strong><span>${tot14} kata dalam 14 hari</span></div><div class="c2"><small>Streak</small><strong>🔥 ${meta.streak}</strong><span>hari berturut</span></div><div class="c2"><small>Total poin</small><strong>⭐ ${meta.xp}</strong><span>XP</span></div></div>
 <div class="tcard"><h4>Aktivitas 14 hari terakhir</h4>${barsSVG(vals,days.map(d=>d.slice(8)))}<p class="sub">Angka di atas batang adalah jumlah kata berbeda yang dipelajari per hari. Riwayat harian mulai tercatat sejak fitur ini ada.</p></div>
 <div class="tcard"><h4>Peta kemampuan</h4>${radarSVG(sk,SK)}<p class="sub">${last?`Dari tes level ${esc(String(last.d))}${la?" dan rata-rata skor lafal":""}. ${wk>=0?`Terkuat: <b>${SK[st]}</b>. Perlu ditingkatkan: <b>${SK[wk]}</b>.`:""}`:"Kerjakan Tes Level (menu Tes) untuk mengisi peta ini. Skor lafal terisi dari tab Lafal."}</p></div>
 <div class="tcard"><h4>Tren Tes Level</h4>${TH.length?lineSVG(TH.slice(-8)):`<p class="sub">Belum ada tes. Kerjakan Tes Level, lalu ulangi tiap dua minggu untuk melihat kemajuannya.</p>`}</div>
 <div class="tcard"><h4>Penguasaan per level</h4>${LV.slice(1).map(l=>{const a=ALL.filter(w=>lvOf(w)===l),k=a.filter(w=>known[w.en]).length;return tbar(`${l} · ${k}/${a.length}`,a.length?Math.round(k/a.length*100):0)}).join("")}</div>
 <div class="tcard"><h4>Ulangan 7 hari ke depan</h4>${barsSVG(fc,fl)}<p class="sub">Jumlah kata yang dijadwalkan muncul di tab Ulang. Hari ini sudah termasuk yang tertunda.</p></div>`}
let dip=null;
function pwaS(){let t="";const ios=/iphone|ipad|ipod/i.test(navigator.userAgent);
 try{if(matchMedia("(display-mode: standalone)").matches)t+="Sudah berjalan sebagai aplikasi. "}catch(e){}
 t+=("serviceWorker" in navigator&&navigator.serviceWorker.controller)?"Mode offline aktif: web bisa dibuka tanpa internet. ":"Mode offline aktif setelah web dibuka sekali dengan internet, hanya di versi yang dipasang di GitHub atau Vercel. ";
 const m=$("#pwam");if(m)m.textContent=t}
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();dip=e;$("#pwabtn").hidden=false});
window.addEventListener("appinstalled",()=>{$("#pwabtn").hidden=true;pwaS()});
$("#pwabtn").addEventListener("click",async()=>{if(!dip)return;dip.prompt();try{await dip.userChoice}catch(x){}dip=null;$("#pwabtn").hidden=true});
if("serviceWorker" in navigator)navigator.serviceWorker.addEventListener("controllerchange",pwaS);
pwaS();
function clk(){const el=$("#clock");if(!el)return;const n=new Date();let t="";
 try{t=n.toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})+" · "+n.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false,timeZoneName:"short"}).replace(/\./g,":")}catch(e){t=n.toString()}
 el.textContent=t}
clk();setInterval(clk,1000);
let CFG={off:[],ann:""};
try{const c=JSON.parse(localStorage.getItem(CFGK)||"{}");if(c&&Array.isArray(c.off))CFG.off=c.off.filter(x=>typeof x==="string");if(c&&typeof c.ann==="string")CFG.ann=c.ann.slice(0,300)}catch(e){}
const TN={card:"Kartu",srs:"Ulang",quiz:"Latihan",audio:"Audio",lafal:"Lafal",list:"Daftar",dict:"Kamus",test:"Tes Level",prog:"Kemajuan",my:"Kata Saya",note:"Catatan",tpl:"Template"};
function adminP0(){
 if(ROLE!=="admin"){view.innerHTML=`<div class="tcard"><p>Halaman ini hanya untuk admin.</p></div>`;return}
 let keys=[],bytes=0;try{keys=Object.keys(localStorage).filter(k=>k.startsWith(KEY));bytes=keys.reduce((a,k)=>a+(localStorage.getItem(k)||"").length,0)}catch(e){}
 const kn=ALL.filter(w=>known[w.en]).length;
 view.innerHTML=`<div class="tcard"><h3>Panel admin 🛠️</h3><p class="sub">${CLOUD?"Kamu masuk sebagai admin. Pengaturan fitur dan pengumuman berlaku untuk semua pengguna lewat server. Tombol di bagian Alat hanya memengaruhi browser ini.":"Kamu masuk sebagai admin. Panel ini mengatur web di <b>browser dan perangkat ini saja</b>. Semua data tersimpan di browser masing-masing, jadi admin tidak bisa melihat progres di perangkat lain."}</p></div>
 <div class="sum"><div class="c2"><small>Kata dikuasai</small><strong>${kn}</strong><span>dari ${ALL.length}</span></div><div class="c2"><small>Kata sendiri</small><strong>${MY.length}</strong><span>ditambahkan</span></div><div class="c2"><small>Tes level</small><strong>${TH.length}</strong><span>riwayat</span></div><div class="c2"><small>Data tersimpan</small><strong>${Math.round(bytes/1024)} KB</strong><span>${keys.length} kunci</span></div></div>
 <div class="tcard"><h4>Fitur yang ditampilkan untuk pengguna</h4><p class="sub">Matikan tab yang belum dibutuhkan. Admin tetap melihat semuanya.</p><div class="chipsrow">${Object.keys(TN).map(k=>`<label class="chk"><input type="checkbox" data-cf="${k}" ${CFG.off.includes(k)?"":"checked"}> ${TN[k]}</label>`).join("")}</div></div>
 <div class="tcard"><h4>Alat</h4><div class="acts3"><button class="btn" data-a="admbk">Salin cadangan</button><button class="btn" data-a="admlo">Keluar</button><button class="btn bad" data-a="admrs">Hapus semua data</button></div><p class="bkm" id="admm"></p></div>`}
view.addEventListener("change",e=>{const k=e.target.dataset&&e.target.dataset.cf;if(!k)return;CFG.off=CFG.off.filter(x=>x!==k);if(!e.target.checked)CFG.off.push(k);try{localStorage.setItem(CFGK,JSON.stringify(CFG))}catch(x){}toast("Pengaturan disimpan");navUI();if(typeof CLOUD!=="undefined"&&CLOUD&&ROLE==="admin")cloudCfgPush()});
const NAVG=[["",["home"]],["Belajar",["card","srs","audio","list","dict"]],["Latihan",["quiz","mist","lafal","note"]],["Tes",["test","prog"]],["Alat",["my","tpl","acct","admin"]]];
const TI={home:"🏠 Beranda",card:"🃏 Kartu",srs:"🔁 Ulang",audio:"🎧 Audio",list:"📋 Daftar",dict:"📚 Kamus",quiz:"✍️ Latihan",mist:"📕 Kesalahan",lafal:"🎤 Lafal",note:"📝 Catatan",test:"🎯 Tes Level",prog:"📈 Kemajuan",my:"➕ Kata Saya",tpl:"✉️ Template",acct:"👤 Akun",admin:"🛠️ Admin"};
function sideNav(){const el=$("#sidenav");if(!el)return;
 el.innerHTML=NAVG.map(([h,ts])=>{const v=ts.filter(t=>t==="admin"?ROLE==="admin":(t==="home"||ROLE==="admin"||!CFG.off.includes(t)));return v.length?(h?`<div class="ngh">${h}</div>`:"")+v.map(t=>`<button class="nl ${t===tab?"on":""}" data-nav="${t}">${TI[t]}</button>`).join(""):""}).join("")}
const goto=t=>{tab=t;render();window.scrollTo(0,0)};
$("#sidenav").addEventListener("click",e=>{const b=e.target.closest("[data-nav]");if(b)goto(b.dataset.nav)});
$("#home").addEventListener("click",e=>{const b=e.target.closest("[data-go]");if(b)goto(b.dataset.go)});
function greet(){const h=new Date().getHours();return h<11?"Selamat pagi":h<15?"Selamat siang":h<18?"Selamat sore":"Selamat malam"}
function home0(){
 const t=dstr(0),due=Object.values(srs).filter(v=>v.d<=t).length,newn=ALL.filter(w=>!srs[w.en]).length,td=meta.td&&meta.td.d===t?meta.td.w.length:0,g=meta.goal||10,last=TH[TH.length-1];
 $("#greet").textContent=ROLE==="admin"?"Halo, Admin":greet()+", Michelle";
 const bars=LV.slice(1).map(l=>{const a=ALL.filter(w=>lvOf(w)===l),k=a.filter(w=>known[w.en]).length;return tbar(`${l} · ${k}/${a.length}`,a.length?Math.round(k/a.length*100):0)}).join("");
 const tiles=[["card","🃏","Kartu"],["srs","🔁","Ulang"],["quiz","✍️","Latihan"],["audio","🎧","Audio"],["lafal","🎤","Lafal"],["test","🎯","Tes Level"],["note","📝","Catatan"],["prog","📈","Kemajuan"]].filter(x=>ROLE==="admin"||!CFG.off.includes(x[0]));
 $("#homeinfo").innerHTML=`${CFG.ann?`<div class="tcard ann"><b>📢 Pengumuman</b><p>${esc(CFG.ann)}</p></div>`:""}<div class="hgrid">${planCard()}<div class="tcard"><h4>Hari ini</h4><ul class="hl"><li><b>${due}</b> kartu ulangan jatuh tempo</li><li><b>${Math.max(0,g-td)}</b> kata lagi untuk target harian (${td}/${g})</li><li><b>${newn}</b> kata belum pernah dipelajari</li></ul><div class="acts"><button class="btn pri" data-go="srs">Mulai ulang</button><button class="btn" data-go="card">Belajar kartu</button></div></div><div class="tcard"><h4>Tes level terakhir</h4>${last?`<div class="hbig">${esc(String(last.est))}</div><p class="sub">Skor ${esc(String(last.tot))}% pada ${esc(String(last.d))}</p>`:`<p class="sub">Belum ada tes. Kerjakan Tes Level untuk tahu posisimu di skala A1 sampai C2.</p>`}<div class="acts"><button class="btn pri" data-go="test">${last?"Tes lagi":"Mulai tes"}</button><button class="btn" data-go="prog">Lihat kemajuan</button></div></div><div class="tcard lvl"><h4>Penguasaan per level</h4>${bars}</div>${ROLE==="admin"?`<div class="tcard adm"><h4>🛠️ Info admin</h4><p class="sub">${typeof CLOUD!=="undefined"&&CLOUD?"Kamu masuk sebagai admin. Di panel admin kamu bisa melihat progres pengguna, membuat pengumuman, dan mengatur fitur untuk semua orang.":"Kamu masuk sebagai admin. Data akun admin dipisah dari data Michelle, dan pengaturan di sini hanya berlaku di browser ini."}</p><p class="sub" id="repcount"></p><div class="acts"><button class="btn pri" data-go="admin">Buka panel admin</button><button class="btn" data-go="my">Kata Saya</button></div></div>`:""}</div><div class="tcard"><h4>Jalan pintas</h4><div class="qg">${tiles.map(x=>`<button class="qt" data-go="${x[0]}"><span>${x[1]}</span>${x[2]}</button>`).join("")}</div></div>`}
let MB={},PLAN=null,ms=null;
function loadMB(){try{MB=JSON.parse(localStorage.getItem(KEY+"-mb")||"{}")||{};if(typeof MB!=="object"||Array.isArray(MB))MB={}}catch(e){MB={}}
 try{PLAN=JSON.parse(localStorage.getItem(KEY+"-plan")||"null");if(PLAN&&!Array.isArray(PLAN.items))PLAN=null}catch(e){PLAN=null}}
loadMB();
const saveMB=()=>{try{localStorage.setItem(KEY+"-mb",JSON.stringify(MB))}catch(e){}};
const savePlan=()=>{try{localStorage.setItem(KEY+"-plan",JSON.stringify(PLAN))}catch(e){}};
const p2=n=>String(n).padStart(2,"0");
const MON=["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
const fmtD=x=>{const m=String(x).match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?(+m[3])+" "+MON[+m[2]-1]:String(x)};
function wkStart(){const d=new Date();d.setDate(d.getDate()-((d.getDay()+6)%7));return d.getFullYear()+"-"+p2(d.getMonth()+1)+"-"+p2(d.getDate())}
const daysSince=d=>Math.round((new Date(dstr(0))-new Date(d))/864e5);
const knownIn=l=>ALL.filter(w=>lvOf(w)===l&&known[w.en]).length;
const hs=t=>{let h=0;for(const c of String(t))h=(h*31+c.charCodeAt(0))|0;return(h>>>0).toString(36)};
function bump(t,n){const w=wkStart();if(!meta.pc||meta.pc.wk!==w)meta.pc={wk:w};meta.pc[t]=(meta.pc[t]||0)+(n||1);save()}
function trimMB(){const ks=Object.keys(MB);if(ks.length<=150)return;ks.sort((a,b)=>MB[a].n-MB[b].n||String(MB[a].d).localeCompare(String(MB[b].d)));ks.slice(0,ks.length-150).forEach(k=>delete MB[k])}
function logMiss(w){if(!w||!w.en)return;const k="w:"+w.en,o=MB[k];MB[k]={t:"w",n:(o?o.n:0)+1,c:0,d:dstr(0)};trimMB();saveMB()}
function mbFromTest(q){
 if(q.s==="v"){const m=String(q.q).match(/^Apa arti "(.*)"\?$/),w=m&&ALL.find(x=>x.en===m[1]);if(w)logMiss(w);return}
 const k="q:"+hs(q.q),o=MB[k];MB[k]={t:"q",n:(o?o.n:0)+1,c:0,d:dstr(0),q:{l:q.l,s:q.s,q:q.q,o:q.o,a:q.a,p:q.p||"",au:q.au||""}};trimMB();saveMB()}
function mergePc(a,b){if(!a)return b;if(!b)return a;if(a.wk!==b.wk)return a.wk>b.wk?a:b;const o={wk:a.wk};new Set([...Object.keys(a),...Object.keys(b)]).forEach(k=>{if(k!=="wk")o[k]=Math.max(a[k]||0,b[k]||0)});return o}
function mergeMB(a,b){a=a||{};b=b||{};const o={};new Set([...Object.keys(a),...Object.keys(b)]).forEach(k=>{const x=a[k],y=b[k];if(!x)o[k]=y;else if(!y)o[k]=x;else{const L=String(x.d)>=String(y.d)?x:y;o[k]=Object.assign({},L,{n:Math.max(x.n||0,y.n||0)})}});return o}
function mergePlan(a,b){if(!a)return b;if(!b)return a;if(a.wk!==b.wk)return a.wk>b.wk?a:b;const o=JSON.parse(JSON.stringify(a));o.items.forEach(x=>{const y=(b.items||[]).find(z=>z.id===x.id);if(y&&y.done)x.done=true});return o}
function makePlan(prev){
 const wk=wkStart(),last=[...TH].reverse().find(x=>x.ps),L6=["A1","A2","B1","B2","C1","C2"],ei=last?L6.indexOf(last.est):-1,tl=L6[Math.min(Math.max(ei+1,1),5)];
 const lv=Object.values(LH).filter(x=>typeof x==="number"),la=lv.length?Math.round(lv.reduce((a,b)=>a+b,0)/lv.length):null;
 const sk=last?{v:last.ps.v,g:last.ps.g,r:last.ps.r,l:last.ps.l}:null,SKN={v:"Kosakata",g:"Tata bahasa",r:"Membaca",l:"Menyimak"};
 const weak=sk?Object.keys(sk).sort((a,b)=>sk[a]-sk[b])[0]:null,I=[];
 if(!last||daysSince(last.d)>=13)I.push({id:"test",txt:last?"Ulangi Tes Level (sudah lebih dari dua minggu)":"Kerjakan Tes Level pertamamu",ctr:"test",target:1,tab:"test"});
 I.push({id:"words",txt:"Kuasai 25 kata baru di level "+tl,ctr:"know:"+tl,target:25,base:knownIn(tl),tab:"card"});
 I.push({id:"days",txt:"Selesaikan ulangan (tab Ulang) di 5 hari berbeda",ctr:"days",target:5,tab:"srs"});
 const W={v:{id:"wv",txt:"Selesaikan 3 sesi Latihan mode Arti atau Ejaan",ctr:"quiz+spell",target:3,tab:"quiz"},g:{id:"wg",txt:"Selesaikan 3 sesi Isi kalimat atau Susun kalimat",ctr:"fill+order",target:3,tab:"quiz"},r:{id:"wr",kind:"manual",txt:"Baca 3 template di tab Template, lalu jelaskan isinya dengan kata-katamu",ctr:"man",target:1,tab:"tpl"},l:{id:"wl",txt:"Selesaikan 3 sesi Latihan mode Dengar",ctr:"listen",target:3,tab:"quiz"}};
 if(weak)I.push(W[weak]);
 if(la===null||la<70)I.push({id:"lafal",txt:"Selesaikan 2 sesi Lafal",ctr:"lafal",target:2,tab:"lafal"});
 if(Object.keys(MB).length>=5)I.push({id:"mist",txt:"Latih buku kesalahan sampai 2 sesi",ctr:"mistake",target:2,tab:"mist"});
 I.push({id:"write",kind:"manual",txt:"Tulis satu catatan atau email singkat dalam bahasa Inggris",ctr:"man",target:1,tab:"note"});
 const items=I.slice(0,7);
 if(prev&&prev.wk===wk)items.forEach(x=>{const o=(prev.items||[]).find(y=>y.id===x.id&&y.ctr===x.ctr);if(o){x.done=o.done;if(o.base!=null)x.base=o.base}});
 const why=last?"Dibuat dari Tes Level "+fmtD(last.d)+": perkiraan "+last.est+(weak?", bagian terlemah "+SKN[weak]+" ("+sk[weak]+"%)":"")+".":"Belum ada Tes Level. Kerjakan dulu supaya rencana minggu depan lebih tepat.";
 return{wk,made:dstr(0),why,items}}
function ensurePlan(){if(!PLAN||PLAN.wk!==wkStart()){PLAN=makePlan(null);savePlan()}}
function ctrVal(it){
 if(it.kind==="manual")return it.done?it.target:0;
 const c=it.ctr||"";
 if(c.indexOf("know:")===0)return Math.max(0,knownIn(c.slice(5))-(it.base||0));
 if(c==="days"){const w=wkStart(),h=meta.h||{};let n=0;for(const d in h)if(d>=w&&h[d]>0)n++;return n}
 const pc=meta.pc&&PLAN&&meta.pc.wk===PLAN.wk?meta.pc:{};return c.split("+").reduce((a,k)=>a+(pc[k]||0),0)}
function planStat(){ensurePlan();const it=PLAN.items;return{done:it.filter(x=>ctrVal(x)>=x.target).length,total:it.length}}
function planCard(){ensurePlan();const P=PLAN,it=P.items,done=it.filter(x=>ctrVal(x)>=x.target).length,pct=Math.round(done/it.length*100);
 return `<div class="tcard full"><h4>🗓️ Rencana belajar minggu ini</h4><p class="sub">${esc(P.why)}</p><div class="bar"><i style="width:${pct}%"></i></div><div class="meta"><span>${done} dari ${it.length} tugas selesai</span><span>Minggu mulai ${esc(fmtD(P.wk))}</span></div><div class="plist">${it.map(x=>{const v=Math.min(ctrVal(x),x.target),ok=v>=x.target;return `<div class="pit${ok?" ok":""}">${x.kind==="manual"?`<input type="checkbox" data-pl="${esc(x.id)}" ${x.done?"checked":""} aria-label="Tandai selesai">`:`<span class="pst">${ok?"✅":"⬜"}</span>`}<div class="pt"><b>${esc(x.txt)}</b>${x.kind==="manual"?"":`<span>${v}/${x.target}</span>`}</div><button class="btn" data-go="${esc(x.tab)}">Buka</button></div>`}).join("")}</div><div class="acts" style="grid-template-columns:1fr"><button class="btn" data-plre="1">Buat ulang rencana</button></div></div>`}
$("#home").addEventListener("change",e=>{const id=e.target.dataset&&e.target.dataset.pl;if(!id||!PLAN)return;const it=PLAN.items.find(x=>x.id===id);if(it){it.done=e.target.checked;savePlan();home()}});
$("#home").addEventListener("click",e=>{if(e.target.closest("[data-plre]")){PLAN=makePlan(PLAN);savePlan();home()}});
function mistList(){return Object.entries(MB).map(([k,v])=>Object.assign({k},v)).sort((a,b)=>b.n-a.n||String(a.d).localeCompare(String(b.d)))}
const SKL={g:"tata bahasa",r:"membaca",l:"menyimak",v:"kosakata"};
function mstart(){const qs=[];
 for(const x of shuf(mistList().slice(0,10))){
  if(x.t==="w"){const w=ALL.find(a=>"w:"+a.en===x.k);if(!w){delete MB[x.k];continue}
   const o=shuf([w,...shuf(ALL.filter(y=>y.en!==w.en&&y.id!==w.id&&isS(y)===isS(w))).slice(0,3)]);qs.push({k:x.k,q:'Apa arti "'+w.en+'"?',o:o.map(y=>y.id),a:o.indexOf(w),w:w.en,m:w.id})}
  else if(x.q)qs.push({k:x.k,q:x.q.q,o:x.q.o,a:x.q.a,p:x.q.p,au:x.q.au})}
 saveMB();ms={qs,i:0,s:0,ans:null,grad:0,cnt:0}}
function mist0(){
 if(ms){
  const T=ms.qs.length;
  if(!T){view.innerHTML=`<div class="tcard"><p>Tidak ada soal yang bisa dilatih.</p><button class="btn" data-a="mend">Kembali</button></div>`;return}
  if(ms.i>=T){if(!ms.cnt){ms.cnt=1;bump("mistake")}
   view.innerHTML=`<div class="tcard center"><div class="score">${ms.s}/${T}</div><p class="sub">${ms.grad?ms.grad+" soal dikuasai dan keluar dari buku kesalahan. ":""}Sisa di buku: ${Object.keys(MB).length}.</p><button class="btn pri" data-a="mend">Kembali ke buku</button></div>`;if(ms.s===T)confetti();return}
  const q=ms.qs[ms.i],d=ms.ans!==null;
  view.innerHTML=`<div class="bar"><i style="width:${ms.i/T*100}%"></i></div><div class="meta"><span>Soal ${ms.i+1} dari ${T}</span><span>Benar ${ms.s}</span></div>${q.p?`<div class="passage">${esc(q.p)}</div>`:""}${q.au?`<div class="center" style="margin:8px 0"><button class="say big" data-a="mplay">🔊 Putar rekaman</button></div>`:""}<div class="q">${esc(q.q)}</div><div class="opts">${q.o.map((o,j)=>`<button class="opt ${d&&j===q.a?"right":d&&j===ms.ans?"wrong":""}" data-a="mpick" data-k="${j}" ${d?"disabled":""}>${esc(o)}</button>`).join("")}</div>${d?`<div class="fb">${ms.ans===q.a?"Benar!":"Jawaban benar: "+esc(q.o[q.a])}${q.m?"<br>"+esc(q.w)+" = "+esc(q.m):""}</div><div class="acts"><button class="btn" data-a="mplay">🔊 Dengar</button><button class="btn pri" data-a="mnext">Lanjut</button></div>`:""}`;return}
 const L=mistList(),nw=L.filter(x=>x.t==="w").length;
 view.innerHTML=`<div class="tcard"><h3>📕 Buku kesalahan</h3><p class="sub">Jawaban yang salah di Latihan dan Tes Level dicatat di sini. Latih ulang sampai benar 3 kali berturut-turut, lalu soalnya otomatis keluar dari buku.</p>${L.length?`<div class="meta"><span>${nw} kata dan kalimat</span><span>${L.length-nw} soal tes</span></div><div class="acts"><button class="btn pri" data-a="mstart">Latih sekarang (${Math.min(10,L.length)} soal)</button><button class="btn bad" data-a="mclear">Kosongkan buku</button></div>`:`<p class="sub" style="margin-top:12px">Belum ada kesalahan tercatat. Kerjakan Latihan atau Tes Level, dan jawaban yang salah akan muncul di sini.</p>`}</div>${L.length?`<div class="tcard"><h4>Daftar (paling sering salah dulu)</h4><div class="list">${L.slice(0,60).map(x=>{const w=x.t==="w"?ALL.find(a=>"w:"+a.en===x.k):null;return `<div class="li"><div class="w"><b>${esc(x.t==="w"?(w?w.en:x.k.slice(2)):String(x.q.q).slice(0,80))}</b><span>${x.t==="w"?esc(w?w.id:""):"Soal tes ("+esc(SKL[x.q.s]||"")+")"}</span></div><b class="weak">${x.n}×</b><span class="sub">${x.c||0}/3</span></div>`}).join("")}</div></div>`:""}`}
function insightRow(s){const wk=Array.isArray(s.week)?s.week:[],mx=Math.max(1,...wk),pl=s.plan,tm=Array.isArray(s.top_miss)?s.top_miss:[];
 return `<div class="ins">${pl?`<span>Rencana minggu ini <b>${esc(String(pl.done))}/${esc(String(pl.total))}</b></span>`:""}<span>Soal salah di buku <b>${esc(String(s.miss_n==null?"-":s.miss_n))}</b></span>${wk.length?`<span class="mini7" title="Kata dipelajari, 7 hari terakhir">${wk.map(v=>`<i style="height:${Math.round(4+v/mx*24)}px" title="${esc(String(v))} kata"></i>`).join("")}</span>`:""}</div>${tm.length?`<div class="sub">Paling sering salah: ${tm.map(x=>esc(String(x.k))+" ("+esc(String(x.n))+"×)").join(", ")}</div>`:""}`}
function aggHtml(users,gm){const m={};users.forEach(u=>{const s=(gm[u.id]&&gm[u.id].summary)||{};(Array.isArray(s.top_miss)?s.top_miss:[]).forEach(x=>{m[x.k]=(m[x.k]||0)+(+x.n||0)})});
 const top=Object.entries(m).sort((a,b)=>b[1]-a[1]).slice(0,8);return top.length?`<div class="urow" style="margin-bottom:10px"><b>Kata tersulit (gabungan semua pengguna)</b><div class="sub">${top.map(([k,n])=>esc(k)+" ("+n+"×)").join(", ")}</div></div>`:""}
let RQ=[],RC=null,REPS=[],REPF="open",FLUSH=false;
const RQK=(window.SB_CFG&&window.SB_CFG.url)?KEY+"-reports":"english-guru-cikal-reports";
try{RQ=JSON.parse(localStorage.getItem(RQK)||"[]")||[];if(!Array.isArray(RQ))RQ=[]}catch(e){RQ=[]}
const saveRQ=()=>{try{localStorage.setItem(RQK,JSON.stringify(RQ.slice(-200)))}catch(e){}};
const RB=a=>`<div class="rptrow"><button class="rpt" data-a="${a}">🚩 Laporkan kesalahan</button></div>`;
function card(){card0();view.insertAdjacentHTML("afterbegin",RB("rptcard"))}
function rv(){rv0();if(rq&&rq.i<rq.q.length)view.insertAdjacentHTML("afterbegin",RB("rptsrs"))}
function qz(){qz0();if(qm<2&&quiz&&quiz.i<quiz.qs.length)view.insertAdjacentHTML("afterbegin",RB("rptq"))}
function pz(){pz0();if(px&&px.i<px.qs.length)view.insertAdjacentHTML("afterbegin",RB("rptq"))}
function mist(){mist0();if(ms&&ms.i<ms.qs.length)view.insertAdjacentHTML("afterbegin",RB("rptq"))}
function home(){home0();if(ROLE==="admin")repCount()}
const wordCtx=(w,where)=>({kind:isS(w)?"kalimat":"kata",ref:w.en,text:w.en+" = "+w.id+(w.ex?" | contoh: "+w.ex:""),where,show:w.en+" = "+w.id+(w.ex?"\n"+w.ex:"")});
function rptCtx(a,b){
 if(a==="rptcard"){const w=pool()[idx];return w&&wordCtx(w,"Kartu")}
 if(a==="rptw"){const w=ALL.find(x=>x.en===b.dataset.w);return w&&wordCtx(w,"Daftar")}
 if(a==="rptt"){const t=TP[+b.dataset.n];return t&&{kind:"templat",ref:t.t,text:"Template email: "+t.t,where:"Template"}}
 if(a==="rptsrs"){const w=rq&&rq.q[rq.i];return w&&wordCtx(w,"Ulang")}
 if(a==="rptq"){
  if(tab==="mist"&&ms){const q=ms.qs[ms.i];return q&&{kind:"soal",ref:String(q.q),text:q.q+" | pilihan: "+q.o.join(" / ")+" | kunci: "+q.o[q.a],where:"Buku kesalahan"}}
  if(qm>=2&&px){const q=px.qs[px.i];return q&&{kind:"kalimat",ref:q.w.en,text:q.w.en+" = "+q.w.id+(qm===2?" | kata dikosongkan: "+q.c+" | pilihan: "+q.o.join(" / "):""),where:["","","Isi kalimat","Susun kalimat","Ejaan"][qm]}}
  if(quiz){const q=quiz.qs[quiz.i];return q&&{kind:"soal",ref:q.w.en,text:q.w.en+" = "+q.w.id+" | pilihan: "+q.o.map(x=>qm===1?x.en:x.id).join(" / "),where:qm===1?"Dengar dan tebak":"Tebak arti"}}}
 return null}
function rptOpen(c){if(!c){toast("Tidak ada yang bisa dilaporkan di sini");return}
 RC=c;{const sh=String(c.show||c.ref);$("#rctx").textContent=sh.length>220?sh.slice(0,220)+"...":sh}$("#rnote").value="";$("#rmsg").textContent="";
 $("#rcat").selectedIndex=c.kind==="soal"?1:0;$("#rptm").hidden=false;$("#rcat").focus()}
function rptClose(){$("#rptm").hidden=true;RC=null}
async function rptSend(){
 const c=RC;if(!c)return;const cat=$("#rcat").value,note=cl($("#rnote").value,300);
 if(RQ.some(x=>x.ref===c.ref&&x.cat===cat&&x.kind===c.kind)){$("#rmsg").textContent="Laporan serupa sudah pernah kamu kirim. Terima kasih!";return}
 RQ.push({kind:c.kind,ref:String(c.ref).slice(0,120),text:String(c.text).slice(0,600),page:String(c.where).slice(0,40),cat,note,at:new Date().toISOString(),by:ROLE,local:!CLOUD,sent:false,st:"open"});
 saveRQ();rptClose();toast(CLOUD&&!navigator.onLine?"Laporan disimpan, dikirim saat online":"Terima kasih, laporan terkirim");
 if(CLOUD)flushReports();if(ROLE==="admin"&&tab==="home")repCount()}
async function flushReports(){
 if(typeof CLOUD==="undefined"||!CLOUD||!SYNC.uid||FLUSH)return;const pend=RQ.filter(x=>!x.sent&&!x.local);if(!pend.length)return;FLUSH=true;
 try{for(const r of pend){const res=await sb.from("reports").insert({user_id:SYNC.uid,kind:r.kind,ref:r.ref,text:r.text,page:r.page,category:r.cat,note:r.note||""});if(res.error)throw res.error;r.sent=true;saveRQ()}}catch(e){}
 FLUSH=false}
$("#rcancel").addEventListener("click",rptClose);$("#rsend").addEventListener("click",rptSend);
$("#rptm").addEventListener("click",e=>{if(e.target.id==="rptm")rptClose()});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!$("#rptm").hidden)rptClose()});
async function repCount(){const el=$("#repcount");if(!el)return;let n=0;
 try{if(CLOUD){const r=await sb.from("reports").select("id",{count:"exact",head:true}).eq("status","open");n=r.count||0}else n=RQ.filter(x=>x.local&&x.st!=="done").length}catch(e){}
 el.textContent=n?"🚩 "+n+" laporan kesalahan menunggu ditinjau.":"Tidak ada laporan terbuka."}
const reportsCardHtml=()=>`<div class="tcard"><h3>🚩 Laporan kesalahan</h3><p class="sub">Laporan tentang terjemahan, soal, atau kunci jawaban yang salah. Salin daftarnya untuk diperbaiki.</p><div id="admrep"><p class="sub">Memuat...</p></div></div>`;
async function loadReports(){
 const el=$("#admrep");if(!el)return;let rows=[];
 if(CLOUD){const [a,b]=await Promise.all([sb.from("reports").select("id,user_id,kind,ref,text,page,category,note,status,created_at").order("created_at",{ascending:false}).limit(300),sb.from("profiles").select("id,display_name")]);
  if(a.error){el.innerHTML=`<p class="lerr">Gagal memuat: ${esc(a.error.message)}</p>`;return}
  const nm={};(b.data||[]).forEach(x=>nm[x.id]=x.display_name);rows=(a.data||[]).map(r=>Object.assign({},r,{who:nm[r.user_id]||"?"}))}
 else rows=RQ.map((r,i)=>r.local?{id:"L"+i,kind:r.kind,ref:r.ref,text:r.text,page:r.page,category:r.cat,note:r.note,status:r.st||"open",created_at:r.at,who:"Perangkat ini"}:null).filter(Boolean);
 REPS=rows;renderReps()}
function repGroups(st){const g={};REPS.filter(r=>(st==="done")===(r.status==="done")).forEach(r=>{const k=r.kind+"|"+r.ref+"|"+r.category,o=g[k]||(g[k]={ref:r.ref,kind:r.kind,cat:r.category,text:r.text,page:r.page,ids:[],notes:[],who:new Set(),last:r.created_at});o.ids.push(r.id);if(r.note&&!o.notes.includes(r.note))o.notes.push(r.note);o.who.add(r.who);if(String(r.created_at)>String(o.last))o.last=r.created_at});return Object.values(g).sort((a,b)=>b.ids.length-a.ids.length||String(b.last).localeCompare(String(a.last)))}
function renderReps(){const el=$("#admrep");if(!el)return;const open=repGroups("open"),done=repGroups("done"),cur=REPF==="done"?done:open;
 el.innerHTML=`<div class="seg" style="margin-bottom:10px"><button class="${REPF==="open"?"on":""}" data-a="repf" data-v="open">Terbuka (${open.length})</button><button class="${REPF==="done"?"on":""}" data-a="repf" data-v="done">Selesai (${done.length})</button></div>${cur.length?`<div class="ulist">${cur.map(g=>`<div class="urow"><div class="uh"><b>${esc(g.ref.length>90?g.ref.slice(0,90)+"...":g.ref)}</b>${g.ids.length>1?`<span class="rolebadge rb-user">${g.ids.length}×</span>`:""}</div><div class="sub">${esc(g.cat)} · ${esc(g.page)} · ${esc([...g.who].join(", "))}</div><div class="sub">${esc(g.text)}</div>${g.notes.length?`<div class="sub">Catatan: ${g.notes.slice(0,3).map(esc).join(" | ")}</div>`:""}<button class="btn" style="margin-top:6px;padding:6px 12px" data-a="${REPF==="done"?"repopen":"repdone"}" data-ids="${esc(g.ids.join(","))}">${REPF==="done"?"Buka lagi":"Tandai selesai"}</button></div>`).join("")}</div>`:`<p class="sub">${REPF==="done"?"Belum ada laporan yang selesai.":"Tidak ada laporan terbuka."}</p>`}<div class="acts" style="margin-top:10px"><button class="btn" data-a="repcopy">Salin daftar terbuka</button><button class="btn" data-a="repcsv">Unduh CSV</button></div><p class="bkm" id="repm"></p>`}
async function repSet(ids,done){const L=String(ids).split(",");
 if(CLOUD){const r=await sb.from("reports").update({status:done?"done":"open",resolved_at:done?new Date().toISOString():null}).in("id",L.map(Number));if(r.error){const m=$("#repm");if(m)m.textContent="Gagal: "+r.error.message;return}}
 else L.forEach(x=>{const i=+String(x).slice(1);if(RQ[i])RQ[i].st=done?"done":"open"});
 if(!CLOUD)saveRQ();await loadReports()}
function repCopy(){const g=repGroups("open"),t=g.length?"Laporan kesalahan yang belum ditinjau:\n"+g.map((x,i)=>(i+1)+". ["+x.cat+"] "+x.ref+" ("+x.page+") — "+x.text+(x.notes.length?" — catatan: "+x.notes.join(" | "):"")+(x.ids.length>1?" — dilaporkan "+x.ids.length+"×":"")).join("\n"):"Tidak ada laporan terbuka.";
 copy(t);const m=$("#repm");if(m)m.textContent="Daftar disalin. Tempel ke percakapan untuk diperbaiki."}
function repCsv(){const q=v=>'"'+String(v==null?"":v).replace(/"/g,'""')+'"',h=["id","status","dibuat","pelapor","jenis","ref","halaman","kategori","catatan","teks"],body=REPS.map(r=>[r.id,r.status,r.created_at,r.who,r.kind,r.ref,r.page,r.category,r.note,r.text].map(q).join(",")).join("\n");
 const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+h.join(",")+"\n"+body],{type:"text/csv"}));a.download="laporan-kesalahan-"+dstr(0)+".csv";document.body.appendChild(a);a.click();a.remove()}
