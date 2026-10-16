const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
let LH={};try{LH=JSON.parse(localStorage.getItem(KEY+"-lafal")||"{}")||{}}catch(e){}
const saveLH=()=>{try{localStorage.setItem(KEY+"-lafal",JSON.stringify(LH))}catch(e){}};
const lf={run:0,mode:0,qs:[],i:0,res:[],cur:null,tries:0,best:0,paid:0,on:false,err:"",msg:"",rec:null};
function lev(a,b){const m=a.length,n=b.length,d=Array.from({length:m+1},(_,i)=>[i]);for(let j=1;j<=n;j++)d[0][j]=j;for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)d[i][j]=Math.min(d[i-1][j]+1,d[i][j-1]+1,d[i-1][j-1]+(a[i-1]===b[j-1]?0:1));return d[m][n]}
const sim=(a,b)=>{a=nz(a);b=nz(b);const L=Math.max(a.length,b.length);return L?Math.round((1-lev(a,b)/L)*100):0};
function lfStop(){lf.on=false;try{if(lf.rec)lf.rec.abort()}catch(e){}}
function buildLf(){let p=pool();
 if(lf.mode===1)p=p.filter(isS);else if(lf.mode===0)p=p.filter(w=>!isS(w)&&!w.en.includes(" – "));else p=ALL.filter(w=>LH[w.en]!==undefined&&LH[w.en]<80&&!w.en.includes(" – "));
 lf.qs=shuf(p).slice(0,10);lf.i=0;lf.res=[];lf.cur=null;lf.tries=0;lf.best=0;lf.paid=0;lf.err=""}
function lfScore(alts){const w=lf.qs[lf.i];lf.on=false;
 const sc=Math.max(...alts.map(a=>sim(a,w.en)));lf.tries++;lf.best=Math.max(lf.best,sc);lf.cur={score:sc,heard:alts[0],alts};lf.err="";
 LH[w.en]=Math.max(LH[w.en]||0,sc);saveLH();
 if(sc>=80&&!lf.paid){lf.paid=1;xp(5);toast("Pelafalan jelas! +5 XP")}lafal()}
function listen(){if(!SR)return;const r=new SR();r.lang="en-US";r.interimResults=false;r.maxAlternatives=5;r.continuous=false;lf.rec=r;lf.on=true;lf.err="";
 r.onresult=e=>{lfScore(Array.from(e.results[0],a=>a.transcript))};
 r.onerror=e=>{lf.on=false;lf.err={"not-allowed":"Izin mikrofon ditolak. Izinkan mikrofon di pengaturan browser, lalu coba lagi.","service-not-allowed":"Browser tidak mengizinkan pengenalan suara di halaman ini.","no-speech":"Tidak ada suara terdengar. Coba lagi dengan suara yang lebih jelas.","audio-capture":"Mikrofon tidak ditemukan.","network":"Pengenalan suara butuh koneksi internet."}[e.error]||"Terjadi kendala ("+e.error+"). Coba lagi.";lafal()};
 r.onend=()=>{if(lf.on){lf.on=false;lf.err=lf.err||"Tidak ada suara terdengar. Coba lagi.";lafal()}};
 try{r.start();lafal()}catch(x){lf.on=false;lf.err="Mikrofon belum bisa dipakai. Coba lagi.";lafal()}}
function lfNext(skip){const w=lf.qs[lf.i];lf.res.push({w,score:skip?null:lf.best});lf.i++;lf.cur=null;lf.tries=0;lf.best=0;lf.paid=0;lf.err="";
 if(lf.i>=lf.qs.length&&lf.res.filter(r=>r.score!=null).length>=5){xp(10);bump("lafal");toast("Sesi lafal selesai! +10 XP")}lafal()}
function lafal(){
 if(!lf.run){
  const M=["Kata","Kalimat","Kata sulit"];
  view.innerHTML=`<div class="tcard"><h3>Tes Pelafalan 🎤</h3><p class="sub" style="margin-bottom:12px">Dengarkan contoh, lalu ucapkan kata atau kalimatnya. Browser akan menebak apa yang kamu ucapkan, dan kemiripannya dengan kata target jadi skor. Satu sesi berisi 10 soal, dan tiap soal boleh dicoba berkali-kali. Level dan tema mengikuti panel filter.</p><div class="seg">${M.map((t,i)=>`<button class="${lf.mode===i?"on":""}" data-a="lmode" data-v="${i}">${t}</button>`).join("")}</div>${lf.msg?`<p class="lerr">${lf.msg}</p>`:""}<div class="center" style="margin-top:14px"><button class="btn pri" data-a="lstart" style="padding:14px 30px">Mulai sesi</button></div><p class="sub" style="margin-top:14px">${SR?"Di Chrome dan Edge, suara diproses oleh layanan pengenalan suara browser dan butuh internet, dan browser akan meminta izin mikrofon.":"Browser ini belum mendukung pengenalan suara, jadi tes memakai mode tiru mandiri: kamu menilai sendiri. Untuk penilaian otomatis, buka web ini di Chrome atau Edge."}</p><p class="sub">Skor menunjukkan seberapa jelas ucapanmu dipahami browser. Ini bukan penilaian aksen, dan hasilnya bisa berbeda antar perangkat.</p></div>`;return}
 const T=lf.qs.length;
 if(lf.i>=T){
  const sc=lf.res.filter(r=>r.score!=null),avg=sc.length?Math.round(sc.reduce((a,r)=>a+r.score,0)/sc.length):0,ok=sc.filter(r=>r.score>=80).length;
  view.innerHTML=`<div class="tcard center"><small>Rata-rata skor</small><div class="score">${avg}%</div><p>${avg>=85?"Pelafalanmu sangat jelas.":avg>=70?"Cukup jelas. Latih kata yang masih lemah.":"Perlu banyak latihan. Dengarkan contoh lalu tirukan pelan-pelan."}</p><p class="sub">${ok} dari ${sc.length} kata sudah jelas (skor 80 ke atas)</p></div><div class="tcard"><h4>Hasil per soal</h4><div class="list">${lf.res.map(r=>`<div class="li"><div class="w"><b>${r.w.en}</b><span>${r.w.id}</span></div><b class="${r.score!=null&&r.score>=80?"good":"weak"}">${r.score==null?"dilewati":r.score+"%"}</b><button data-a="lsayw" data-w="${r.w.en}" aria-label="Dengarkan">🔊</button></div>`).join("")}</div></div><div class="acts"><button class="btn" data-a="lhard">Latih kata sulit</button><button class="btn pri" data-a="lback">Sesi baru</button></div>`;return}
 const w=lf.qs[lf.i],c=lf.cur;
 let fb="";
 if(lf.err)fb=`<p class="lerr">${lf.err}</p>`;
 else if(c&&c.self)fb=`<p class="center sub">${c.score>=80?"Bagus! Lanjut ke soal berikutnya.":"Tidak apa-apa. Dengarkan lagi dan ulangi."}</p>`;
 else if(c){const hw=new Set(nz(c.alts.join(" ")).split(" ")),tw=w.en.split(" ");
  fb=`<div class="tcard center"><div class="sc ${c.score>=80?"good":"weak"}">${c.score}%</div><p>${c.score>=90?"Sangat jelas!":c.score>=80?"Jelas!":c.score>=60?"Hampir tepat. Coba lagi pelan-pelan.":"Belum terbaca. Dengarkan contoh lalu coba lagi."}</p><p class="sub">Browser mendengar: <b>${esc(c.heard)}</b></p>${tw.length>1?`<p>${tw.map(x=>`<span class="${hw.has(nz(x))?"okw":"badw"}">${esc(x)}</span>`).join(" ")}</p>`:""}</div>`}
 view.innerHTML=`<div class="bar"><i style="width:${lf.i/T*100}%"></i></div><div class="meta"><span>Soal ${lf.i+1} dari ${T}</span><span>Percobaan ${lf.tries}</span></div><div class="tcard center"><small>${w.cat}</small><div class="en${w.en.length>20?" long":""}">${w.en}</div><div class="id" style="color:var(--pri)">${w.id}</div><div style="margin-top:12px"><button class="say" data-a="lsay">🔊 Dengarkan contoh</button></div></div><div class="center" style="margin:14px 0">${SR?`<button class="mic ${lf.on?"live":""}" data-a="lmic">${lf.on?"🎤 Mendengarkan... bicara sekarang":c?"🎤 Coba lagi":"🎤 Tekan lalu ucapkan"}</button>`:`<div class="acts"><button class="btn" data-a="lself" data-v="0">Perlu latihan</button><button class="btn ok" data-a="lself" data-v="1">Sudah mirip</button></div>`}</div>${fb}<div class="acts"><button class="btn" data-a="lskip">Lewati</button><button class="btn pri" data-a="lnext" ${c?"":"disabled"}>${lf.i+1===T?"Selesai":"Lanjut"}</button></div>`}
