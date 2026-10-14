view.addEventListener("click",e=>{
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
view.addEventListener("click",e=>{if(drag){drag=false;e.stopImmediatePropagation();e.preventDefault()}},true);
let dq="";
const LN={A1:"Pemula (A0-A1)",A2:"Dasar",B1:"Menengah",B2:"Menengah atas",C1:"Mahir",C2:"Penguasaan penuh"};
function dict(){view.innerHTML=`<input class="search" id="dq" placeholder="Cari di semua ${ALL.length} kata..." aria-label="Cari"><p class="sub" style="margin-bottom:10px">Semua kosakata dari level paling dasar sampai paling tinggi. Ketuk kotak untuk mendengar pelafalannya.</p><div id="dbody"></div>`;$("#dq").value=dq;dbody()}
function dbody(){const t=dq.toLowerCase();
 $("#dbody").innerHTML=LV.slice(1).map(l=>{
  const tot=ALL.filter(w=>lvOf(w)===l),ws=tot.filter(w=>!t||w.en.toLowerCase().includes(t)||w.id.toLowerCase().includes(t));
  if(!ws.length)return "";
  const kn=tot.filter(w=>known[w.en]).length,cs=[...new Set(ws.map(w=>w.cat))];
  return `<details class="lvs" ${t||l==="A2"?"open":""}><summary><b>Level ${l} · ${LN[l]}</b><span>${tot.length} kata · hafal ${kn}</span></summary>${cs.map(c=>`<h4>${c.slice(5)}</h4><div class="wg mini">${ws.filter(w=>w.cat===c).map(w=>`<button class="wb ${known[w.en]?"kn":""}" data-a="sayw" data-w="${w.en}"><b>${w.en}</b><span>${w.id}</span></button>`).join("")}</div>`).join("")}</details>`}).join("")||"<p class='sub'>Tidak ada kata yang cocok.</p>"}
view.addEventListener("input",e=>{if(e.target.id==="dq"){dq=e.target.value;dbody()}});
