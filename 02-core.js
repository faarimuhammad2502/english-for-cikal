const KEY="english-guru-cikal",MK=KEY+"-meta";
let known={},meta={xp:0,streak:0,last:""};
try{known=JSON.parse(localStorage.getItem(KEY)||"{}")||{}}catch(e){}
try{Object.assign(meta,JSON.parse(localStorage.getItem(MK)||"{}"))}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(known));localStorage.setItem(MK,JSON.stringify(meta))}catch(e){}};
const day=d=>d.toISOString().slice(0,10);
function xp(n){const t=day(new Date());if(meta.last!==t){meta.streak=meta.last===day(new Date(Date.now()-864e5))?meta.streak+1:1;meta.last=t}meta.xp+=n;save();hdr()}
const $=s=>document.querySelector(s),view=$("#view"),sel=$("#cat");
let tab="card",lvl="Semua",cat="Semua",idx=0,flip=false,quiz=null,qm=0,q="";
const LV=["Semua","A1","A2","B1","B2","C1","C2"],lvOf=w=>w.cat.slice(0,2);
const pool=()=>ALL.filter(w=>(lvl==="Semua"||lvOf(w)===lvl)&&(cat==="Semua"||w.cat===cat));
const shuf=a=>a.map(x=>[Math.random(),x]).sort((p,q)=>p[0]-q[0]).map(x=>x[1]);
function say(t){try{const u=new SpeechSynthesisUtterance(t);u.lang="en-US";u.rate=.85;speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
function toast(t){const e=$("#toast");e.textContent=t;e.classList.remove("show");void e.offsetWidth;e.classList.add("show")}
function confetti(){if(matchMedia("(prefers-reduced-motion:reduce)").matches)return;const c=["#ff8fb8","#d6336c","#ffd166","#ffb3cf","#b5179e"];for(let i=0;i<46;i++){const e=document.createElement("i");e.className="cf";e.style.cssText=`left:${Math.random()*100}vw;background:${c[i%5]};--d:${1.6+Math.random()*1.4}s;--r:${Math.random()*720-360}deg;animation-delay:${Math.random()*.4}s`;document.body.appendChild(e);setTimeout(()=>e.remove(),3600)}}
const pct=f=>{const p=ALL.filter(f);return p.length?Math.round(p.filter(w=>known[w.en]).length/p.length*100):0};
function hdr(){
 const n=ALL.filter(w=>known[w.en]).length,r=n/ALL.length;
 $("#sprout").textContent=r<.1?"🌱":r<.35?"🌿":r<.7?"🪴":"🌳";
 $("#sub").textContent=`${ALL.length} kata tersedia, target 1000. Kurikulum Cambridge, dari A1 menuju C2.`;
 {const t=dstr(0),c=Object.values(srs).filter(v=>v.d<=t).length;$('[data-tab="srs"]').textContent="Ulang"+(c?" · "+c:"")}
 {const pc=Math.round(r*100),td=meta.td&&meta.td.d===dstr(0)?meta.td.w.length:0,g=meta.goal||10;$("#stats").innerHTML=`<div class="c2 rc"><div class="ring" style="--p:${pc}"><b>${pc}%</b></div><div><small>Progres</small><br><strong>${n}/${ALL.length}</strong><br><span>kata dikuasai</span></div></div><div class="c2"><small>Streak</small><strong>🔥 ${meta.streak}</strong><span>hari berturut</span></div><div class="c2"><small>Poin</small><strong>⭐ ${meta.xp}</strong><span>XP terkumpul</span></div><div class="c2"><small>Target hari ini</small><strong>${td}/${g}</strong><div class="bar" style="margin-top:6px"><i style="width:${Math.min(100,td/g*100)}%"></i></div><span>kata dipelajari</span></div>`}
 $("#lv").innerHTML=LV.map(l=>`<button class="chip ${l===lvl?"on":""}" data-lv="${l}">${l}<small>${pct(w=>l==="Semua"||lvOf(w)===l)}%</small></button>`).join("");
}
function fillCats(){const cs=["Semua",...Object.keys(RAW).filter(c=>lvl==="Semua"||c.startsWith(lvl)).sort((a,b)=>LV.indexOf(a.slice(0,2))-LV.indexOf(b.slice(0,2)))];sel.innerHTML=cs.map(c=>`<option>${c}</option>`).join("");if(!cs.includes(cat))cat="Semua";sel.value=cat}
function progress(){const p=pool(),n=p.filter(w=>known[w.en]).length;return `<div class="bar"><i style="width:${p.length?n/p.length*100:0}%"></i></div><div class="meta"><span>Hafal: ${n} dari ${p.length}</span></div>`}
function render(){if(ROLE!=="admin"&&(tab==="admin"||CFG.off.includes(tab)))tab=Object.keys(TG).find(t=>t!=="admin"&&!CFG.off.includes(t))||"card";audioStop(true);lfStop();navUI();hdr();$(".row").style.display=$("#lv").style.display=tab==="tpl"||tab==="dict"||tab==="test"||tab==="my"||tab==="note"||tab==="prog"||tab==="admin"?"none":"";tab==="card"?card():tab==="srs"?rv():tab==="quiz"?qz():tab==="list"?list():tab==="dict"?dict():tab==="test"?tst():tab==="my"?my():tab==="audio"?audio():tab==="note"?note():tab==="lafal"?lafal():tab==="prog"?prog():tab==="admin"?adminP():tpl()}
function card(){
 const p=pool();if(idx>=p.length)idx=0;const w=p[idx];
 view.innerHTML=`<div id="prog">${progress()}</div><div class="scene in" data-a="flip" role="button" tabindex="0" aria-label="Balik kartu"><div class="card ${flip?"flipped":""}">
 <div class="face front"><div class="tag">${w.cat}</div><div class="en${w.en.length>20?" long":""}">${w.en}</div><button class="say" data-a="say">🔊 Dengarkan</button><div class="hint">Ketuk kartu untuk melihat arti</div></div>
 <div class="face back"><div class="tag">${w.cat}</div><div class="id">${w.id}</div>${w.ex?`<div class="ex">${w.ex}</div><button class="say" data-a="sayex">🔊 Dengar kalimat</button>`:""}</div></div></div>
 <div class="acts"><button class="btn" data-a="again">Masih lupa</button><button class="btn ok" data-a="know">Sudah hafal</button></div>
 <div class="nav"><button class="btn" data-a="cprev">◀ Sebelumnya</button><span class="navc">Kartu ${idx+1} / ${p.length}</span><button class="btn" data-a="cnext">Berikutnya ▶</button></div><input class="range" type="range" min="1" max="${p.length}" value="${idx+1}" data-r="1" aria-label="Geser untuk memilih kartu"><div class="meta"><span>${known[w.en]?"✅ Sudah kamu hafal":"Geser slider, seret kartu, atau pakai tombol panah"}</span></div><div class="pg"><button class="btn" data-a="gprev" aria-label="40 kata sebelumnya">◀</button><span>Kata ${Math.floor(idx/40)*40+1} sampai ${Math.min(Math.floor(idx/40)*40+40,p.length)} dari ${p.length} (ketuk untuk membuka)</span><button class="btn" data-a="gnext" aria-label="40 kata berikutnya">▶</button></div><div class="wg mini">${p.slice(Math.floor(idx/40)*40,Math.floor(idx/40)*40+40).map((x,j)=>{const g=Math.floor(idx/40)*40+j;return `<button class="wb ${g===idx?"cur":""} ${known[x.en]?"kn":""}" data-a="jump" data-i="${g}"><b>${x.en}</b><span>${x.id}</span></button>`}).join("")}</div>`;
}
function startQuiz(){quiz={qs:shuf(pool()).slice(0,10).map(w=>({w,o:shuf([w,...shuf(ALL.filter(x=>x.en!==w.en&&x.id!==w.id)).slice(0,3)])})),i:0,s:0,ans:null,miss:[]}}
function qz(){
 if(qm>=2)return pz();
 if(!quiz)startQuiz();
 const T=quiz.qs.length,seg=segH();
 if(quiz.i>=T){
  const f=quiz.s===T;
  view.innerHTML=seg+`<div class="score">${quiz.s}/${T}</div><p class="center sub">${f?"Sempurna! Tunasmu makin tinggi.":quiz.s>=T*.7?"Bagus! Ulangi untuk nilai penuh.":"Ulangi kartunya dulu, lalu coba lagi."}</p>${quiz.miss.length?`<p class="meta" style="margin-top:16px">Perlu diulang:</p><div class="list">${quiz.miss.map(w=>`<div class="li"><div class="w"><b>${w.en}</b><span>${w.id}</span></div></div>`).join("")}</div>`:""}<div class="center"><button class="btn pri" data-a="restart">Main lagi</button></div>`;
  if(f)confetti();return;
 }
 const k=quiz.qs[quiz.i],lab=o=>qm?o.en:o.id,d=quiz.ans!==null;
 view.innerHTML=seg+`<div class="bar"><i style="width:${quiz.i/T*100}%"></i></div><div class="meta"><span>Soal ${quiz.i+1} dari ${T}</span><span>Skor ${quiz.s}</span></div>
 ${qm?`<div class="q">Dengarkan, lalu pilih kata yang benar.</div><div class="center" style="margin-bottom:14px"><button class="say big" data-a="say">🔊 Putar suara</button></div>`:`<div class="q">Apa arti "${k.w.en}"? <button class="say" data-a="say" aria-label="Dengarkan">🔊</button></div>`}
 <div class="opts">${k.o.map((o,j)=>{const r=d&&o.en===k.w.en;return `<button class="opt ${r?"right":d&&j===quiz.ans?"wrong":""}" data-a="pick" data-k="${j}" ${d?"disabled":""}>${lab(o)}</button>`}).join("")}</div>
 ${d?`<div class="fb">${k.w.en} = ${k.w.id}</div><div class="acts"><button class="btn" data-a="say">🔊 Dengar lagi</button><button class="btn pri" data-a="next">Lanjut</button></div>`:""}`;
 if(qm&&!d)say(k.w.en);
}
function items(){const t=q.toLowerCase();$("#items").innerHTML=pool().filter(w=>!t||w.en.toLowerCase().includes(t)||w.id.toLowerCase().includes(t)).map(w=>`<div class="li"><input type="checkbox" data-a="chk" data-w="${w.en}" ${known[w.en]?"checked":""} aria-label="Hafal ${w.en}"><div class="w"><b>${w.en}</b><span>${w.id}</span></div><button data-a="sayw" data-w="${w.en}" aria-label="Dengarkan ${w.en}">🔊</button></div>`).join("")||"<p class='sub'>Tidak ada kata yang cocok.</p>"}
function list(){view.innerHTML=`<div id="prog">${progress()}</div><input class="search" id="q" placeholder="Cari kata atau arti..." aria-label="Cari"><div class="list wg" id="items"></div>`;$("#q").value=q;items()}
const go=d=>{const p=pool();idx=(idx+d+p.length)%p.length;flip=false;card()};
