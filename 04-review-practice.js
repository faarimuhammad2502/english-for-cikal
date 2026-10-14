let srs={},rq=null;
try{srs=JSON.parse(localStorage.getItem(KEY+"-srs")||"{}")||{}}catch(e){}
const saveS=()=>{try{localStorage.setItem(KEY+"-srs",JSON.stringify(srs))}catch(e){}};
const INT=[0,1,3,7,14,30];
const dstr=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
Object.keys(known).forEach(k=>{if(!srs[k])srs[k]={b:2,d:dstr(3)}});saveS();
const dueList=()=>{const t=dstr(0);return pool().filter(w=>srs[w.en]&&srs[w.en].d<=t)};
const newLeft=()=>!meta.nd||meta.nd.d!==dstr(0)?10:Math.max(0,10-meta.nd.n);
const newList=()=>shuf(pool().filter(w=>!srs[w.en])).slice(0,newLeft());
const lbl=n=>INT[n]===1?"besok":INT[n]+" hari";
function rbtn(){const w=rq.q[rq.i],b0=srs[w.en]?srs[w.en].b:0;
 return `<div class="acts3"><button class="btn bad" data-a="rate" data-r="0">Lupa<small>${lbl(1)}</small></button><button class="btn" data-a="rate" data-r="1">Ragu<small>${lbl(Math.max(b0,1))}</small></button><button class="btn ok" data-a="rate" data-r="2">Ingat<small>${lbl(rq.lap.has(w.en)?1:Math.min(5,Math.max(b0,1)+1))}</small></button></div>`}
function rate(r){const w=rq.q[rq.i],b0=srs[w.en]?srs[w.en].b:0;
 let nb=r===0?1:r===1?Math.max(b0,1):Math.min(5,Math.max(b0,1)+1);
 if(r===0){rq.lap.add(w.en);rq.lapse++;rq.q.push(w)}else if(rq.lap.has(w.en))nb=1;
 srs[w.en]={b:nb,d:dstr(INT[nb])};
 if(nb>=2)known[w.en]=1;else delete known[w.en];
 saveS();tick(w.en);xp(r===2?3:1);rq.i++;rq.flip=false;rv()}
function rv(){
 if(!rq){
  const due=dueList(),nw=newList(),all=Object.values(srs),tm=all.filter(v=>v.d===dstr(1)).length,tot=due.length+nw.length;
  view.innerHTML=`<p class="sub" style="margin-bottom:10px">Kata yang sulit muncul lebih sering, yang sudah lancar muncul makin jarang. Cukup 5 sampai 10 menit per hari.</p>
  <div class="meta"><span>Jumlah kata per kotak (jeda ulangan)</span></div>
  <div class="boxes">${[1,2,3,4,5].map(b=>`<div class="bx"><b>${all.filter(v=>v.b===b).length}</b><small>${INT[b]===1?"1 hari":INT[b]+" hari"}</small></div>`).join("")}</div>
  <div class="meta"><span>Jatuh tempo: ${due.length}</span><span>Baru hari ini: ${nw.length}</span><span>Besok: ${tm}</span></div>
  ${tot?`<div class="center"><button class="btn pri" data-a="rstart" style="padding:14px 28px">Mulai ulang (${tot} kartu)</button></div>`:`<p class="center sub" style="margin-top:18px">Semua selesai untuk hari ini. 🎉<br>Kembali besok untuk ulangan berikutnya.</p>`}`;
  return}
 if(rq.i>=rq.q.length){
  if(!rq.fin){rq.fin=1;xp(20);confetti()}
  view.innerHTML=`<div class="score">${rq.n}</div><p class="center sub">kata selesai diulang, ${rq.lapse} kali lupa. Bonus +20 XP!</p><div class="center" style="margin-top:16px"><button class="btn pri" data-a="rback">Kembali</button></div>`;return}
 const w=rq.q[rq.i],nw=!srs[w.en];
 view.innerHTML=`<div class="bar"><i style="width:${rq.i/rq.q.length*100}%"></i></div><div class="meta"><span>Kartu ${rq.i+1} dari ${rq.q.length}</span><span>${nw?"Kata baru":"Kotak "+srs[w.en].b}</span></div>
 <div class="scene in" data-a="rflip" role="button" tabindex="0" aria-label="Balik kartu"><div class="card ${rq.flip?"flipped":""}">
 <div class="face front"><div class="tag">${w.cat}</div><div class="en${w.en.length>20?" long":""}">${w.en}</div><button class="say" data-a="say">🔊 Dengarkan</button><div class="hint">Ingat artinya, lalu ketuk kartu</div></div>
 <div class="face back"><div class="tag">${w.cat}</div><div class="id">${w.id}</div>${w.ex?`<div class="ex">${w.ex}</div><button class="say" data-a="sayex">🔊 Dengar kalimat</button>`:""}</div></div></div>
 <div id="rate">${rq.flip?rbtn():`<p class="center sub" style="margin-top:14px">Seberapa ingat kamu? Pilihan muncul setelah kartu dibalik.</p>`}</div>`;
}
let px=null;
const segH=()=>`<div class="seg">${["Tebak arti","Dengar &amp; tebak","Isi kalimat","Susun kalimat","Ejaan"].map((t,i)=>`<button class="${qm===i?"on":""}" data-a="qm" data-m="${i}">${t}</button>`).join("")}</div>`;
const isS=w=>/^[A-Z]/.test(w.en)&&/[.?!]$/.test(w.en)&&w.en.split(" ").length>=3;
const bare=t=>t.replace(/[^A-Za-z']/g,"");
function startP(){
 if(qm===4){px={note:0,i:0,s:0,ans:null,miss:[],ord:[],val:"",said:0,qs:shuf(pool().filter(w=>!isS(w)&&!w.en.includes(" – "))).slice(0,10).map(w=>({w}))};return}
 let p=pool().filter(isS),note=0;if(!p.length){p=ALL.filter(isS);note=1}
 const all=ALL.filter(isS),big=w=>{const t=w.en.split(" ");let k=0;t.forEach((x,i)=>{if(bare(x).length>bare(t[k]).length)k=i});return k};
 px={note,i:0,s:0,ans:null,miss:[],ord:[],qs:shuf(p).slice(0,10).map(w=>{const t=w.en.split(" ");
  if(qm===2){const k=big(w),c=bare(t[k]).toLowerCase(),d=[...new Set(shuf(all).map(x=>bare(x.en.split(" ")[big(x)]).toLowerCase()).filter(x=>x!==c&&x.length>3))].slice(0,3);return {w,t,k,c,o:shuf([c,...d])}}
  let b=t.map((x,i)=>i);for(let n=0;n<6;n++){b=shuf(b);if(b.some((x,i)=>x!==i))break}return {w,t,b}})};
}
function pz(){
 if(!px)startP();
 const T=px.qs.length,sg=segH();
 if(px.i>=T){const f=px.s===T;
  view.innerHTML=sg+`<div class="score">${px.s}/${T}</div><p class="center sub">${f?"Sempurna!":"Ulangi untuk memperkuat."}</p>${px.miss.length?`<p class="meta" style="margin-top:16px">Perlu diulang:</p><div class="list">${px.miss.map(w=>`<div class="li"><div class="w"><b>${w.en}</b><span>${w.id}</span></div></div>`).join("")}</div>`:""}<div class="center"><button class="btn pri" data-a="prestart">Main lagi</button></div>`;
  if(f)confetti();return}
 const q=px.qs[px.i],d=px.ans!==null,hd=`<div class="bar"><i style="width:${px.i/T*100}%"></i></div><div class="meta"><span>Soal ${px.i+1} dari ${T}</span><span>Skor ${px.s}</span></div>${px.note?`<p class="sub">Belum ada kalimat di pilihan ini, jadi diambil dari semua tema.</p>`:""}<p class="sub" style="margin-bottom:8px">Arti: ${q.w.id}</p>`;
 if(qm===4){
  view.innerHTML=sg+hd+`<div class="center" style="margin:8px 0"><button class="say big" data-a="say">🔊 Putar suara</button></div><p class="meta" style="justify-content:center">Dengarkan, lalu ketik kata dalam bahasa Inggris:</p><input class="search" id="spv" data-sp="1" placeholder="Ketik di sini" autocomplete="off" autocapitalize="off" spellcheck="false" ${d?"disabled":""}>${d?`<div class="fb">${px.ans?"Benar!":"Ejaan yang benar:"} ${q.w.en}</div><div class="acts"><button class="btn" data-a="say">🔊 Dengar lagi</button><button class="btn pri" data-a="pnext">Lanjut</button></div>`:`<div class="center" style="margin-top:12px"><button class="btn ok" data-a="spchk" style="padding:12px 30px">Periksa</button></div>`}`;
  const iv=$("#spv");if(iv){iv.value=px.val||"";if(!d)iv.focus()}
  if(!d&&!px.said){px.said=1;say(q.w.en)}
 }else if(qm===2){
  const full=q.t.map((x,i)=>i===q.k?`<mark>${x}</mark>`:x).join(" "),blank=q.t.map((x,i)=>i===q.k?x.replace(bare(x),"_____"):x).join(" "),cap=t=>q.k===0?t[0].toUpperCase()+t.slice(1):t;
  view.innerHTML=sg+hd+`<div class="q">${d?full:blank}</div><div class="opts">${q.o.map((o,j)=>`<button class="opt ${d&&o===q.c?"right":d&&j===px.ans?"wrong":""}" data-a="ppick" data-k="${j}" ${d?"disabled":""}>${cap(o)}</button>`).join("")}</div>${d?`<div class="acts"><button class="btn" data-a="say">🔊 Dengar</button><button class="btn pri" data-a="pnext">Lanjut</button></div>`:""}`;
 }else{
  view.innerHTML=sg+hd+`<p class="meta">Ketuk kata untuk menyusun kalimat:</p><div class="slots">${px.ord.map((i,n)=>`<button class="chipw on" data-a="prm" data-n="${n}" ${d?"disabled":""}>${q.t[i]}</button>`).join("")||'<span class="sub">...</span>'}</div><div class="bank">${q.b.filter(i=>!px.ord.includes(i)).map(i=>`<button class="chipw" data-a="padd" data-i="${i}" ${d?"disabled":""}>${q.t[i]}</button>`).join("")}</div>${d?`<div class="fb">${px.ans?"Benar!":"Yang benar:"} ${q.w.en}</div><div class="acts"><button class="btn" data-a="say">🔊 Dengar</button><button class="btn pri" data-a="pnext">Lanjut</button></div>`:`<div class="acts"><button class="btn" data-a="pclr">Ulangi</button><button class="btn ok" data-a="pchk">Periksa</button></div>`}`;
 }
}
