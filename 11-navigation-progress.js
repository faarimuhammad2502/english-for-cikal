const G=[["belajar","📖","Belajar"],["latihan","✍️","Latihan"],["tes","🎯","Tes"],["alat","🧰","Alat"]];
const TG={card:"belajar",srs:"belajar",audio:"belajar",list:"belajar",dict:"belajar",quiz:"latihan",lafal:"latihan",note:"latihan",test:"tes",prog:"tes",admin:"alat",my:"alat",tpl:"alat"};
const gtab={belajar:"card",latihan:"quiz",tes:"test",alat:"my"};
function navUI(){const g=TG[tab]||"belajar";gtab[g]=tab;
 $("#gnav").innerHTML=G.map(x=>`<button class="${x[0]===g?"on":""}" data-g="${x[0]}" aria-label="${x[2]}"><span aria-hidden="true">${x[1]}</span>${x[2]}</button>`).join("");
 let n=0;document.querySelectorAll(".tabs button").forEach(b=>{const t=b.dataset.tab,v=TG[t]===g&&(t==="admin"?ROLE==="admin":(ROLE==="admin"||!CFG.off.includes(t)));b.hidden=!v;if(v)n++;b.classList.toggle("on",b.dataset.tab===tab)});
 $(".tabs").style.display=n>1?"":"none";
 const a=g==="alat"?"":"none";document.querySelectorAll(".bk").forEach(x=>x.style.display=a);$("#reset").style.display=a}
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
let CFG={off:[]};
try{const c=JSON.parse(localStorage.getItem(KEY+"-cfg")||"{}");if(c&&Array.isArray(c.off))CFG.off=c.off.filter(x=>typeof x==="string")}catch(e){}
const TN={card:"Kartu",srs:"Ulang",quiz:"Latihan",audio:"Audio",lafal:"Lafal",list:"Daftar",dict:"Kamus",test:"Tes Level",prog:"Kemajuan",my:"Kata Saya",note:"Catatan",tpl:"Template"};
function adminP(){
 if(ROLE!=="admin"){view.innerHTML=`<div class="tcard"><p>Halaman ini hanya untuk admin.</p></div>`;return}
 let keys=[],bytes=0;try{keys=Object.keys(localStorage).filter(k=>k.startsWith(KEY));bytes=keys.reduce((a,k)=>a+(localStorage.getItem(k)||"").length,0)}catch(e){}
 const kn=ALL.filter(w=>known[w.en]).length;
 view.innerHTML=`<div class="tcard"><h3>Panel admin 🛠️</h3><p class="sub">Kamu masuk sebagai admin. Panel ini mengatur web di <b>browser dan perangkat ini saja</b>. Semua data dan pengaturan tersimpan di browser masing-masing, jadi admin tidak bisa melihat atau mengubah progres di HP Michelle dari sini.</p></div>
 <div class="sum"><div class="c2"><small>Kata dikuasai</small><strong>${kn}</strong><span>dari ${ALL.length}</span></div><div class="c2"><small>Kata sendiri</small><strong>${MY.length}</strong><span>ditambahkan</span></div><div class="c2"><small>Tes level</small><strong>${TH.length}</strong><span>riwayat</span></div><div class="c2"><small>Data tersimpan</small><strong>${Math.round(bytes/1024)} KB</strong><span>${keys.length} kunci</span></div></div>
 <div class="tcard"><h4>Fitur yang ditampilkan untuk pengguna</h4><p class="sub">Matikan tab yang belum dibutuhkan. Admin tetap melihat semuanya.</p><div class="chipsrow">${Object.keys(TN).map(k=>`<label class="chk"><input type="checkbox" data-cf="${k}" ${CFG.off.includes(k)?"":"checked"}> ${TN[k]}</label>`).join("")}</div></div>
 <div class="tcard"><h4>Alat</h4><div class="acts3"><button class="btn" data-a="admbk">Salin cadangan</button><button class="btn" data-a="admlo">Keluar</button><button class="btn bad" data-a="admrs">Hapus semua data</button></div><p class="bkm" id="admm"></p></div>`}
view.addEventListener("change",e=>{const k=e.target.dataset&&e.target.dataset.cf;if(!k)return;CFG.off=CFG.off.filter(x=>x!==k);if(!e.target.checked)CFG.off.push(k);try{localStorage.setItem(KEY+"-cfg",JSON.stringify(CFG))}catch(x){}toast("Pengaturan disimpan");navUI()});
