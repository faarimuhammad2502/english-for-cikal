const au={on:false,run:0,i:0,list:[],rate:1,cnt:20,shuf:true,unk:false,cur:null,ph:0};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const nz=t=>String(t).toLowerCase().replace(/[^a-z0-9 ']/g,"").replace(/\s+/g," ").trim();
function spk(t,lang,rate){return new Promise(res=>{try{const u=new SpeechSynthesisUtterance(t);u.lang=lang;u.rate=rate;let d=false;const f=()=>{if(!d){d=true;clearTimeout(tm);res()}};const tm=setTimeout(f,Math.max(3000,t.length*200/rate)+1500);u.onend=f;u.onerror=f;speechSynthesis.speak(u)}catch(e){res()}})}
function audioStop(full){au.run++;au.on=false;try{speechSynthesis.cancel()}catch(e){}if(full){au.list=[];au.i=0;au.cur=null;au.ph=0}}
async function audioRun(){
 const id=++au.run;au.on=true;
 if(!au.list.length||au.i>=au.list.length){let l=pool().slice();if(au.unk)l=l.filter(w=>!known[w.en]);if(au.shuf)l=shuf(l);au.list=l.slice(0,au.cnt);au.i=0}
 if(!au.list.length){au.on=false;toast("Tidak ada kata untuk diputar");audioUI();return}
 const ok=()=>au.run===id;
 while(ok()&&au.i<au.list.length){
  const w=au.list[au.i];au.cur=w;au.ph=0;audioUI();
  await spk(w.en,"en-US",au.rate);if(!ok())break;await sleep(600);if(!ok())break;
  au.ph=1;audioUI();await spk(w.id,"id-ID",au.rate);if(!ok())break;await sleep(600);if(!ok())break;
  if(w.ex){au.ph=2;audioUI();await spk(w.ex,"en-US",au.rate);if(!ok())break;await sleep(800);if(!ok())break}
  au.i++}
 if(ok()){au.on=false;if(au.i>=au.list.length){au.cur=null;xp(10);toast("Sesi audio selesai! +10 XP")}audioUI()}}
function audioUI(){const c=$("#aucard");if(!c)return;const w=au.cur;
 c.innerHTML=w?`<small class="tag3">${au.i+1} / ${au.list.length}</small><div class="en${w.en.length>20?" long":""}">${w.en}</div>${au.ph>=1?`<div class="id" style="color:var(--pri)">${w.id}</div>`:""}${au.ph>=2&&w.ex?`<div class="ex">${w.ex}</div>`:""}`:`<p class="sub">Tekan Mulai. ${pool().length} kata tersedia di pilihan ini.</p>`;
 const b=$("#aubtn");if(b)b.textContent=au.on?"⏸ Jeda":(au.cur&&au.i<au.list.length?"▶ Lanjutkan":"▶ Mulai")}
function audio(){
 view.innerHTML=`<div class="tcard"><h3>Audio hands-free 🎧</h3><p class="sub" style="margin-bottom:12px">Dengarkan kata, arti, dan contoh kalimat otomatis tanpa menekan tombol. Pilih level dan tema di panel filter. Suaranya memakai suara bawaan browser.</p><div class="meta"><span>Kecepatan</span></div><div class="seg">${[[.75,"Pelan"],[1,"Normal"],[1.25,"Cepat"]].map(x=>`<button class="${au.rate===x[0]?"on":""}" data-a="aurate" data-v="${x[0]}">${x[1]}</button>`).join("")}</div><div class="meta"><span>Kata per sesi</span></div><div class="seg">${[10,20,50].map(n=>`<button class="${au.cnt===n?"on":""}" data-a="aucnt" data-v="${n}">${n}</button>`).join("")}</div><label class="chk"><input type="checkbox" id="aushuf" ${au.shuf?"checked":""}> Acak urutan</label><label class="chk"><input type="checkbox" id="auunk" ${au.unk?"checked":""}> Hanya yang belum hafal</label></div><div class="tcard center" id="aucard"></div><div class="acts"><button class="btn ok" data-a="austart" id="aubtn">Mulai</button><button class="btn" data-a="austop">Berhenti dan ulang</button></div>`;audioUI()}
function spchk(){const q=px.qs[px.i];if(!q||px.ans!==null)return;px.val=$("#spv").value;const ok=nz(px.val)===nz(q.w.en);px.ans=ok;if(ok){px.s++;xp(5);toast("Benar! +5 XP")}else{(px.miss.push(q.w),logMiss(q.w));toast("Belum tepat")}pz()}
view.addEventListener("change",e=>{if(e.target.id==="aushuf")au.shuf=e.target.checked;else if(e.target.id==="auunk")au.unk=e.target.checked});
view.addEventListener("input",e=>{if(e.target.dataset&&e.target.dataset.sp)px.val=e.target.value});
view.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.dataset&&e.target.dataset.sp){e.preventDefault();spchk()}});
