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
const segH=()=>`<div class="seg">${["Arti","Dengar","Isi","Susun","Ejaan"].map((t,i)=>`<button class="${qm===i?"on":""}" data-a="qm" data-m="${i}">${t}</button>`).join("")}</div>`;
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
view.addEventListener("click",async e=>{
 const b=e.target.closest("[data-a]");if(!b)return;const a=b.dataset.a,w=pool()[idx];
 if(a==="flip"){flip=!flip;view.querySelector(".card").classList.toggle("flipped",flip);if(flip)say(w.en)}
 else if(a==="say"){say(tab==="quiz"?(qm>=2?px.qs[px.i]:quiz.qs[quiz.i]).w.en:tab==="srs"?rq.q[rq.i].en:w.en)}
 else if(a==="sayex"){say((tab==="srs"?rq.q[rq.i]:w).ex)}
 else if(a==="again"){go(1)}
 else if(a==="know"){if(!known[w.en]){known[w.en]=1;srs[w.en]={b:2,d:dstr(3)};saveS();tick(w.en);xp(10);toast("+10 XP · Sudah hafal!")}go(1);hdr()}
 else if(a==="qm"){qm=+b.dataset.m;quiz=null;px=null;qz()}
 else if(a==="pick"){const k=quiz.qs[quiz.i],j=+b.dataset.k;quiz.ans=j;if(k.o[j].en===k.w.en){quiz.s++;xp(5);toast("Benar! +5 XP")}else{quiz.miss.push(k.w);toast("Belum tepat")}qz()}
 else if(a==="next"){quiz.i++;quiz.ans=null;qz()}
 else if(a==="restart"){startQuiz();qz()}
 else if(a==="chk"){if(b.checked){known[b.dataset.w]=1;if(!srs[b.dataset.w])srs[b.dataset.w]={b:2,d:dstr(3)}}else{delete known[b.dataset.w];delete srs[b.dataset.w]}saveS();save();hdr();$("#prog").innerHTML=progress()}
 else if(a==="sayw"){say(b.dataset.w)}
 else if(a==="jump"){idx=+b.dataset.i;flip=false;card();view.scrollIntoView({block:"start"})}
 else if(a==="admref"){loadUsers()}
 else if(a==="admpw"){const uid=b.dataset.uid,inp=document.querySelector(`.pwx[data-uid="${uid}"]`),pw=inp?inp.value:"",e=pwCheck(pw,"");if(e){toast(e);return}
  if(!confirm("Atur ulang password pengguna ini? Ia harus masuk dengan password baru."))return;
  const r=await sb.rpc("admin_set_password",{target_id:uid,new_password:pw});
  if(r.error){toast(/does not exist|PGRST202/i.test(r.error.message+(r.error.code||""))?"Jalankan supabase-akun.sql dulu":"Gagal: "+r.error.message);return}
  inp.value="";toast("Password diatur ulang")}
 else if(a==="acpw"){const p1=$("#pw1").value,p2=$("#pw2").value,m=$("#pwm");if(p1!==p2){m.textContent="Kedua password harus sama.";return}const e=pwCheck(p1);if(e){m.textContent=e;return}
  m.textContent="Menyimpan...";const r=await sb.auth.updateUser({password:p1});m.textContent=r.error?"Gagal: "+r.error.message:"Password berhasil diganti.";if(!r.error){$("#pw1").value="";$("#pw2").value=""}}
 else if(a==="acout"){try{await sb.auth.signOut({scope:"global"})}catch(x){}try{localStorage.removeItem(AUTHK)}catch(x){}location.reload()}
 else if(a==="aclo"){doLogout()}
 else if(a==="mfaon"){mfaEnroll()}
 else if(a==="mfaver"){const code=$("#mfaenc").value.replace(/\D/g,"");if(code.length!==6){$("#mfam").textContent="Masukkan 6 angka.";return}
  const v=await sb.auth.mfa.challengeAndVerify({factorId:SYNC.enrollId,code});if(v.error){$("#mfam").textContent="Kode salah. Coba lagi dengan kode terbaru.";return}
  await mfaStatus();$("#mfam").textContent="2FA aktif.";toast("2FA diaktifkan")}
 else if(a==="mfaoff"){if(confirm("Nonaktifkan 2FA?")){const r=await sb.auth.mfa.unenroll({factorId:b.dataset.id});await mfaStatus();$("#mfam").textContent=r.error?"Gagal: "+r.error.message:"2FA dinonaktifkan."}}
 else if(a==="annsave"){CFG.ann=cl($("#annx").value,300);try{localStorage.setItem(CFGK,JSON.stringify(CFG))}catch(x){}const ok=CLOUD?await cloudCfgPush():true;$("#annm").textContent=ok?"Pengumuman disimpan.":"Gagal menyimpan ke server."}
 else if(a==="admbk"){copy(bkOut());$("#admm").textContent="Cadangan disalin ke papan klip."}
 else if(a==="admlo"){doLogout()}
 else if(a==="admrs"){if(confirm("Hapus SEMUA data aplikasi di browser ini? Tindakan ini tidak bisa dibatalkan.")){try{Object.keys(localStorage).filter(k=>k.startsWith(KEY)).forEach(k=>localStorage.removeItem(k))}catch(x){}location.reload()}}
 else if(a==="lmode"){lf.mode=+b.dataset.v;lf.msg="";lafal()}
 else if(a==="lstart"||a==="lhard"){if(a==="lhard")lf.mode=2;buildLf();if(!lf.qs.length){lf.run=0;lf.msg=lf.mode===1?"Belum ada kalimat di pilihan ini. Pilih level Semua atau tema lain.":lf.mode===2?"Belum ada kata sulit. Kerjakan sesi Kata dulu.":"Tidak ada kata di pilihan ini.";lafal();return}lf.msg="";lf.run=1;lafal()}
 else if(a==="lmic"){if(lf.on){lfStop();lafal()}else listen()}
 else if(a==="lsay"){say(lf.qs[lf.i].en)}
 else if(a==="lsayw"){say(b.dataset.w)}
 else if(a==="lself"){const v=+b.dataset.v?100:40;lf.tries++;lf.best=Math.max(lf.best,v);lf.cur={score:v,self:1};if(v>=80){LH[lf.qs[lf.i].en]=100;saveLH();if(!lf.paid){lf.paid=1;xp(5)}}lafal()}
 else if(a==="lskip"){lfStop();lfNext(true)}
 else if(a==="lnext"){lfStop();lfNext(false)}
 else if(a==="lback"){lf.run=0;lf.msg="";lafal()}
 else if(a==="ntpl"){const t=NT[+b.dataset.i][1];NOTE=NOTE.trim()?NOTE.replace(/\s+$/,"")+"\n\n"+t:t;$("#ntx").value=NOTE;nsave();nupd();$("#ntx").focus()}
 else if(a==="nss"){ins(SS[+b.dataset.i]+" ")}
 else if(a==="nw"){ins(b.dataset.w+" ")}
 else if(a==="ncopy"){copy(NOTE)}
 else if(a==="nask"){copy("Please review my English teaching note below. Correct the grammar, suggest more professional wording, and briefly explain each correction in Indonesian.\n\n"+NOTE);toast("Tersalin. Tempel ke Claude.")}
 else if(a==="ndl"){const l=document.createElement("a");l.href=URL.createObjectURL(new Blob([NOTE],{type:"text/plain"}));l.download="catatan-michelle-"+dstr(0)+".txt";document.body.appendChild(l);l.click();l.remove()}
 else if(a==="nclr"){if(confirm("Kosongkan catatan?")){NOTE="";$("#ntx").value="";nsave();nupd()}}
 else if(a==="austart"){if(au.on){audioStop(false);audioUI()}else audioRun()}
 else if(a==="austop"){audioStop(true);audioUI()}
 else if(a==="aurate"){au.rate=+b.dataset.v;audio()}
 else if(a==="aucnt"){au.cnt=+b.dataset.v;audio()}
 else if(a==="spchk"){spchk()}
 else if(a==="mysave"){mysave()}
 else if(a==="mydel"){const i=+b.dataset.i,m=MY[i];if(!m)return;delete known[m.en];delete srs[m.en];save();saveS();const arr=MY.filter((x,j)=>j!==i);saveMine(arr);loadMine(arr);idx=0;flip=false;rq=null;quiz=null;px=null;fillCats();hdr();$("#mylist").innerHTML="";mylist()}
 else if(a==="tstart"){ts={qs:buildTest(),i:0,sel:null,plays:0,ans:[]};tst();window.scrollTo(0,0)}
 else if(a==="tplay"){const q=ts.qs[ts.i];if(ts.plays<2){ts.plays++;say(q.au);tst()}}
 else if(a==="tpick"){ts.sel=+b.dataset.k;tst()}
 else if(a==="tnext"){ts.ans.push(ts.sel);ts.i++;ts.sel=null;ts.plays=0;if(ts.i>=ts.qs.length)finish();tst();window.scrollTo(0,0)}
 else if(a==="tfocus"){lvl=b.dataset.l;cat="Semua";idx=0;flip=false;tab="card";fillCats();render()}
 else if(a==="tagain"){ts=null;tst()}
 else if(a==="cprev"){go(-1)}
 else if(a==="cnext"){go(1)}
 else if(a==="gprev"){const n=pool().length;idx=Math.max(0,(Math.floor(idx/40)-1)*40);flip=false;card()}
 else if(a==="gnext"){const n=pool().length;idx=Math.min(n-1,(Math.floor(idx/40)+1)*40);flip=false;card()}
 else if(a==="ppick"){const q=px.qs[px.i],j=+b.dataset.k;px.ans=j;if(q.o[j]===q.c){px.s++;xp(5);toast("Benar! +5 XP")}else{px.miss.push(q.w);toast("Belum tepat")}pz()}
 else if(a==="padd"){px.ord.push(+b.dataset.i);pz()}
 else if(a==="prm"){px.ord.splice(+b.dataset.n,1);pz()}
 else if(a==="pclr"){px.ord=[];pz()}
 else if(a==="pchk"){const q=px.qs[px.i];if(px.ord.length<q.t.length){toast("Susun semua kata dulu");return}const ok=px.ord.map(i=>q.t[i]).join(" ")===q.w.en;px.ans=ok;if(ok){px.s++;xp(5);toast("Benar! +5 XP")}else px.miss.push(q.w);pz()}
 else if(a==="pnext"){px.i++;px.ans=null;px.ord=[];px.said=0;px.val="";pz()}
 else if(a==="prestart"){startP();pz()}
 else if(a==="rstart"){const t=dstr(0),due=dueList(),nw=newList();if(nw.length)meta.nd={d:t,n:(meta.nd&&meta.nd.d===t?meta.nd.n:0)+nw.length};save();rq={q:shuf(due).concat(nw),i:0,flip:false,lap:new Set(),lapse:0,n:due.length+nw.length};rv()}
 else if(a==="rflip"){const c=view.querySelector(".card"),f=!c.classList.contains("flipped");c.classList.toggle("flipped");if(f){rq.flip=true;$("#rate").innerHTML=rbtn();say(rq.q[rq.i].en)}}
 else if(a==="rate"){rate(+b.dataset.r)}
 else if(a==="rback"){rq=null;rv()}
 else if(a==="copy"){const t=TP[+b.dataset.n];copy("Subject: "+plain(t.s)+"\n\n"+plain(t.e))}
 else if(a==="tsay"){say(plain(TP[+b.dataset.n].e))}
 else if(a==="ttr"){tr[b.dataset.n]=!tr[b.dataset.n];tpls()}
});
view.addEventListener("input",e=>{if(e.target.id==="q"){q=e.target.value;items()}else if(e.target.dataset.f){F[e.target.dataset.f]=e.target.value;try{localStorage.setItem(KEY+"-tpl",JSON.stringify(F))}catch(x){}tpls()}});
view.addEventListener("input",e=>{if(e.target.dataset.r){const c=view.querySelector(".navc");if(c)c.textContent=`Kartu ${e.target.value} / ${e.target.max}`}});
view.addEventListener("change",e=>{if(e.target.dataset.r){idx=+e.target.value-1;flip=false;card()}});
let mx=null,drag=false;
view.addEventListener("mousedown",e=>{mx=e.target.closest(".scene")?e.clientX:null});
view.addEventListener("mouseup",e=>{if(mx===null||tab!=="card"){mx=null;return}const dx=e.clientX-mx;mx=null;if(Math.abs(dx)>80){drag=true;setTimeout(()=>drag=false,80);go(dx<0?1:-1)}});
