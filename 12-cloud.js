const CLOUD_MARK=1;
let sb=null;
try{if(window.SB_CFG&&SB_CFG.url&&SB_CFG.key&&window.supabase&&supabase.createClient)sb=supabase.createClient(SB_CFG.url,SB_CFG.key,{auth:{persistSession:true,autoRefreshToken:true,storageKey:"english-guru-cikal-sb"}})}catch(e){}
const CLOUD=!!sb;
const SYNC={uid:"",busy:false,snap:"",last:null,notePushed:null,started:false,err:"",email:"",pendingRole:"",enrollId:""};
const SKEYS=()=>({known:KEY,meta:MK,srs:KEY+"-srs",tpl:KEY+"-tpl",tests:KEY+"-tests",mine:KEY+"-mine",lafal:KEY+"-lafal",mb:KEY+"-mb",plan:KEY+"-plan"});
function collect(){const o={},K=SKEYS();for(const n in K){try{const v=localStorage.getItem(K[n]);if(v!==null)o[n]=JSON.parse(v)}catch(e){}}return o}
function summaryOf(){const t=dstr(0),last=TH[TH.length-1],lv=Object.values(LH).filter(x=>typeof x==="number");
 return{known:ALL.filter(w=>known[w.en]).length,total:ALL.length,xp:meta.xp||0,streak:meta.streak||0,goal:meta.goal||10,today:(meta.td&&meta.td.d===t)?meta.td.w.length:0,due:Object.values(srs).filter(v=>v.d<=t).length,mine:MY.length,miss_n:Object.keys(MB).length,top_miss:mistList().slice(0,5).map(x=>({k:(x.t==="w"?x.k.slice(2):x.q.q).slice(0,50),n:x.n})),week:[...Array(7)].map((_,i)=>(meta.h||{})[dstr(i-6)]||0),plan:planStat(),test:last?{est:last.est,tot:last.tot,d:last.d}:null,lafal:lv.length?Math.round(lv.reduce((a,b)=>a+b,0)/lv.length):null}}
function mergeData(L,R){const o={};L=L||{};R=R||{};
 o.known=Object.assign({},R.known||{},L.known||{});
 const ls=L.srs||{},rs=R.srs||{},sm={};new Set([...Object.keys(ls),...Object.keys(rs)]).forEach(k=>{const a=ls[k],b=rs[k];sm[k]=!a?b:!b?a:(String(a.d)>=String(b.d)?a:b)});o.srs=sm;
 const lm=L.meta||{},rm=R.meta||{},m=Object.assign({},rm,lm);m.xp=Math.max(lm.xp||0,rm.xp||0);
 if((rm.last||"")>(lm.last||"")){m.last=rm.last;m.streak=rm.streak}else{m.last=lm.last;m.streak=lm.streak}
 m.h=Object.assign({},rm.h||{});for(const d in (lm.h||{}))m.h[d]=Math.max(m.h[d]||0,lm.h[d]);
 const a=lm.td,b=rm.td;m.td=!a?b:!b?a:(a.d>b.d?a:b.d>a.d?b:{d:a.d,w:[...new Set([...(a.w||[]),...(b.w||[])])],ok:a.ok||b.ok});
 if(m.td===undefined)delete m.td;m.pc=mergePc(lm.pc,rm.pc);if(m.pc===undefined)delete m.pc;o.meta=m;
 o.mb=mergeMB(L.mb,R.mb);o.plan=mergePlan(L.plan,R.plan);
 const tk=new Set();o.tests=[...(L.tests||[]),...(R.tests||[])].filter(x=>{const k=x.d+"|"+x.tot+"|"+x.est;if(tk.has(k))return false;tk.add(k);return true}).sort((p,q)=>String(p.d).localeCompare(String(q.d))).slice(-10);
 const mk=new Set();o.mine=[...(L.mine||[]),...(R.mine||[])].filter(x=>{const k=String(x.en).toLowerCase();if(mk.has(k))return false;mk.add(k);return true});
 const lf=Object.assign({},R.lafal||{});for(const k in (L.lafal||{}))lf[k]=Math.max(lf[k]||0,L.lafal[k]);o.lafal=lf;
 o.tpl=Object.assign({},R.tpl||{},L.tpl||{});return o}
function reloadState(){
 try{known=JSON.parse(localStorage.getItem(KEY)||"{}")||{}}catch(e){known={}}
 try{meta=Object.assign({xp:0,streak:0,last:""},JSON.parse(localStorage.getItem(MK)||"{}"))}catch(e){}
 try{srs=JSON.parse(localStorage.getItem(KEY+"-srs")||"{}")||{}}catch(e){srs={}}
 try{Object.assign(F,JSON.parse(localStorage.getItem(KEY+"-tpl")||"{}"))}catch(e){}
 try{TH=JSON.parse(localStorage.getItem(KEY+"-tests")||"[]")||[]}catch(e){TH=[]}
 try{LH=JSON.parse(localStorage.getItem(KEY+"-lafal")||"{}")||{}}catch(e){LH={}}
 try{NOTE=localStorage.getItem(KEY+"-note")||""}catch(e){}
 try{loadMine(JSON.parse(localStorage.getItem(KEY+"-mine")||"[]"))}catch(e){loadMine([])}
 loadMB();fillCats();rq=null;quiz=null;px=null;ts=null;board();render()}
function applyData(d){const K=SKEYS();for(const n in K){if(d[n]!==undefined){try{localStorage.setItem(K[n],JSON.stringify(d[n]))}catch(e){}}}}
function syncUI(st){const el=$("#syncst");if(!el)return;const t=SYNC.last?SYNC.last.toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"}).replace(".",":"):"";
 el.textContent=st==="ok"?`☁️ Tersinkron ${t}`:st==="sync"?"☁️ Menyinkronkan...":st==="off"?"📴 Offline: data aman di perangkat":st==="err"?"⚠️ Sinkron gagal"+(SYNC.err?" ("+String(SYNC.err).slice(0,40)+")":"")+", dicoba lagi":""}
async function push(force){
 if(!sb||!SYNC.uid||SYNC.busy)return;
 const d=collect(),snap=JSON.stringify(d)+"|"+NOTE;
 if(!force&&snap===SYNC.snap)return;
 SYNC.busy=true;syncUI("sync");
 try{
  const now=new Date().toISOString();
  const r=await sb.from("progress").upsert({user_id:SYNC.uid,data:d,summary:summaryOf(),updated_at:now},{onConflict:"user_id"});
  if(r.error)throw r.error;
  if(NOTE!==SYNC.notePushed){const n=await sb.from("notes").upsert({user_id:SYNC.uid,body:NOTE,updated_at:now},{onConflict:"user_id"});if(n.error)throw n.error;SYNC.notePushed=NOTE;try{localStorage.setItem(KEY+"-note-pushed",NOTE)}catch(e){}}
  SYNC.snap=snap;SYNC.last=new Date();SYNC.err="";syncUI("ok")
 }catch(e){SYNC.err=e&&(e.code||e.message)||"";syncUI(navigator.onLine?"err":"off")}
 SYNC.busy=false}
async function pullMerge(){
 const r=await sb.from("progress").select("data,updated_at").eq("user_id",SYNC.uid).maybeSingle();
 if(r.error)throw r.error;
 const local=collect(),remote=r.data&&r.data.data&&Object.keys(r.data.data).length?r.data.data:null;
 applyData(remote?mergeData(local,remote):local);
 const nr=await sb.from("notes").select("body").eq("user_id",SYNC.uid).maybeSingle();
 if(nr.error)throw nr.error;
 let pushed=null;try{pushed=localStorage.getItem(KEY+"-note-pushed")}catch(e){}
 const cur=localStorage.getItem(KEY+"-note")||"",rb=nr.data?nr.data.body||"":"";
 let next=cur;
 if(nr.data&&rb!==cur){if(!cur.trim()||cur===pushed)next=rb;else if(rb.trim()&&rb!==pushed)next=cur+"\n\n--- versi dari perangkat lain ---\n"+rb}
 if(next!==cur){try{localStorage.setItem(KEY+"-note",next)}catch(e){}}
 SYNC.notePushed=nr.data?rb:null;
 reloadState();await push(true)}
async function pullCfg(){
 const r=await sb.from("app_settings").select("value").eq("key","config").maybeSingle();
 if(r.error||!r.data||!r.data.value)return;
 const v=r.data.value;CFG.off=Array.isArray(v.off)?v.off.filter(x=>typeof x==="string"):[];CFG.ann=typeof v.ann==="string"?v.ann.slice(0,300):"";
 try{localStorage.setItem(CFGK,JSON.stringify(CFG))}catch(e){}
 navUI();if(tab==="home")home()}
async function cloudCfgPush(){
 try{const r=await sb.from("app_settings").upsert({key:"config",value:{off:CFG.off,ann:CFG.ann||""},updated_at:new Date().toISOString()},{onConflict:"key"});return!r.error}catch(e){return false}}
async function cloudStart(session){
 if(SYNC.started)return;SYNC.started=true;SYNC.uid=session.user.id;SYNC.email=session.user.email||"";syncUI("sync");
 try{
  const pr=await sb.from("profiles").select("role").eq("id",SYNC.uid).maybeSingle();
  if(pr.data){const want=pr.data.role==="admin"?"admin":"1";let cur="";try{cur=localStorage.getItem(AUTHK)||""}catch(e){}if(cur!==want){try{localStorage.setItem(AUTHK,want)}catch(e){}location.reload();return}}
  await pullCfg();await pullMerge();flushReports();
 }catch(e){SYNC.err=e&&(e.code||e.message)||"";syncUI(navigator.onLine?"err":"off")}
 setInterval(()=>{push(false);flushReports()},8000);setInterval(()=>{pullCfg().catch(()=>{})},300000);
 document.addEventListener("visibilitychange",()=>{if(document.hidden)push(false)});
 window.addEventListener("online",()=>{push(true);flushReports()})}
function cloudBoot(av){
 if(!av)return;
 sb.auth.getSession().then(({data})=>{
  if(!data||!data.session){if(navigator.onLine){try{localStorage.removeItem(AUTHK)}catch(e){}location.reload()}return}
  cloudStart(data.session)}).catch(()=>{})}
async function cloudLogin(){
 const email=$("#nm").value.trim().toLowerCase(),password=$("#pw").value;
 const r=await sb.auth.signInWithPassword({email,password});
 if(r.error){const e=r.error,code=e.code||"",st=e.status||0,m=e.message||"";
  const kind=(code==="invalid_credentials"||/invalid login credentials/i.test(m))?"bad":(code==="email_not_confirmed"||/not confirmed/i.test(m))?"unconfirmed":(/api key|apikey/i.test(m)||st===401)?"key":(st===0||/fetch|network|load failed/i.test(m))?"net":"other";
  const er=new Error(kind);er.detail=(code||"-")+" ("+(st||"?")+")"+(kind==="bad"?"":": "+m);throw er}
 const pr=await sb.from("profiles").select("role").eq("id",r.data.user.id).maybeSingle();
 if(pr.error||!pr.data){try{await sb.auth.signOut()}catch(e){}
  if(pr.error){const e=pr.error,c=e.code||"",m=e.message||"";const er=new Error((/permission denied/i.test(m)||c==="42501")?"perm":(/relation|schema cache|PGRST205|PGRST106/i.test(m+c)?"notable":"dbfail"));er.detail=(c||"-")+" ("+(pr.status||"?")+"): "+m;throw er}
  throw new Error("noprofile")}
 try{localStorage.setItem("english-guru-cikal-last-email",email)}catch(e){}
 const role=pr.data.role==="admin"?"admin":"user";
 const a=await sb.auth.mfa.getAuthenticatorAssuranceLevel();
 if(a.data&&a.data.nextLevel==="aal2"&&a.data.currentLevel!=="aal2"){SYNC.pendingRole=role;throw new Error("mfa")}
 return role}
async function doLogout(){try{if(sb&&SYNC.uid)await push(true)}catch(e){}try{if(sb)await sb.auth.signOut()}catch(e){}try{localStorage.removeItem(AUTHK)}catch(e){}location.reload()}
if(CLOUD){const nm=$("#nm");nm.type="email";nm.placeholder="email@contoh.com";nm.autocomplete="username";try{nm.value=localStorage.getItem("english-guru-cikal-last-email")||""}catch(e){nm.value=""}const lb=document.querySelector('label[for="nm"]');if(lb)lb.textContent="Email"}
const ago=iso=>{const m=Math.round((Date.now()-new Date(iso).getTime())/60000);if(isNaN(m))return"-";const d=new Date(iso).toLocaleString("id-ID",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});return(m<1?"baru saja":m<60?m+" menit lalu":m<1440?Math.round(m/60)+" jam lalu":Math.round(m/1440)+" hari lalu")+" ("+d+")"};
async function loadUsers(){
 const el=$("#admusers");if(!el||!sb)return;
 const [p,g]=await Promise.all([sb.from("profiles").select("id,display_name,role"),sb.from("progress").select("user_id,summary,updated_at")]);
 if(p.error||g.error){el.innerHTML=`<p class="lerr">Gagal memuat: ${esc((p.error||g.error).message)}</p>`;return}
 const gm={};(g.data||[]).forEach(r=>gm[r.user_id]=r);const N=x=>esc(String(x==null?"-":x));
 el.innerHTML=aggHtml(p.data||[],gm)+`<div class="ulist">${(p.data||[]).map(u=>{const r=gm[u.id],s=(r&&r.summary)||{};return `<div class="urow"><div class="uh"><b>${esc(u.display_name||"(tanpa nama)")}</b><span class="rolebadge${u.role==="admin"?"":" rb-user"}">${esc(u.role)}</span></div>${r?`<div class="ugrid"><span>Kata dikuasai <b>${N(s.known)}/${N(s.total)}</b></span><span>XP <b>${N(s.xp)}</b></span><span>Streak <b>${N(s.streak)}</b></span><span>Target hari ini <b>${N(s.today)}/${N(s.goal)}</b></span><span>Ulangan tertunda <b>${N(s.due)}</b></span><span>Tes terakhir <b>${s.test?N(s.test.est)+" · "+N(s.test.tot)+"%":"belum"}</b></span><span>Lafal <b>${s.lafal==null?"-":N(s.lafal)+"%"}</b></span></div>${insightRow(s)}<div class="sub">Aktif terakhir: ${ago(r.updated_at)}</div>`:`<div class="sub">Belum ada data. Pengguna ini belum pernah masuk.</div>`}${u.id!==SYNC.uid?`<div class="uact"><input class="search pwx" type="password" data-uid="${esc(u.id)}" placeholder="Password baru (min. 10)" autocomplete="new-password"><button class="btn" data-a="admpw" data-uid="${esc(u.id)}">Atur ulang password</button></div>`:""}</div>`}).join("")}</div>`}
function adminP(){adminP0();if(ROLE!=="admin")return;setTimeout(()=>{if(view.firstElementChild)view.firstElementChild.insertAdjacentHTML("afterend",reportsCardHtml());loadReports()},0);
 view.firstElementChild.insertAdjacentHTML("afterend",`<div class="tcard"><h3>☁️ Pengguna dan progres</h3>${CLOUD?`<p class="sub">Ringkasan dari server. Catatan guru tidak ikut terlihat.</p><div id="admusers"><p class="sub">Memuat...</p></div><button class="btn" data-a="admref" style="margin-top:10px">Muat ulang</button>`:`<p class="sub">Mode lokal: web belum terhubung ke server, jadi daftar pengguna tidak tersedia.</p>`}</div><div class="tcard"><h4>📢 Pengumuman untuk semua pengguna</h4><textarea class="search" id="annx" rows="3" maxlength="300" placeholder="Tulis pengumuman (kosongkan untuk menghapus)"></textarea><button class="btn pri" data-a="annsave" style="margin-top:8px">Simpan pengumuman</button><p class="bkm" id="annm"></p></div>`);
 const a=$("#annx");if(a)a.value=CFG.ann||"";if(CLOUD)loadUsers()}
const WEAK=["bambuapus","semangatbelajar","password","12345678","qwerty","englishacademy","cikal"];
function pwCheck(p,email){if(p.length<10)return"Minimal 10 karakter.";const l=p.toLowerCase();
 if(!(p.length>=14||(/[A-Za-z]/.test(p)&&/\d/.test(p))))return"Gunakan kombinasi huruf dan angka, atau passphrase minimal 14 karakter.";
 if(WEAK.some(w=>l.includes(w)))return"Password terlalu mudah ditebak. Hindari kata yang umum.";
 const loc=(email==null?SYNC.email:email||"").split("@")[0].toLowerCase(),lt=loc.replace(/[^a-z]/g,"");if((loc.length>=4&&l.includes(loc))||(lt.length>=5&&l.includes(lt)))return"Jangan memakai bagian dari emailmu.";
 if(new Set(p).size<5)return"Password terlalu monoton.";return""}
function showMfa(){$("#lerr").textContent="";$("#lf").hidden=true;$("#fgt").hidden=true;$("#mfa").hidden=false;$("#mfacode").value="";$("#mfacode").focus()}
async function verifyMfa(){const code=$("#mfacode").value.replace(/\D/g,""),er=$("#mfaerr");er.textContent="";if(code.length!==6){er.textContent="Masukkan 6 angka.";return}
 const f=await sb.auth.mfa.listFactors(),t=f.data&&(f.data.totp||[]).find(x=>x.status==="verified");
 if(!t){er.textContent="Faktor 2FA tidak ditemukan.";return}
 const v=await sb.auth.mfa.challengeAndVerify({factorId:t.id,code});
 if(v.error){er.textContent="Kode salah atau kedaluwarsa. Coba lagi.";return}
 try{localStorage.setItem(AUTHK,SYNC.pendingRole==="admin"?"admin":"1")}catch(e){}location.reload()}
function showRecovery(){$("#login").hidden=false;document.body.classList.add("lock");$("#lcard").hidden=true;$("#rcard").hidden=false;$("#np1").focus()}
if(CLOUD){
 $("#fgt").hidden=false;
 $("#mfabtn").addEventListener("click",verifyMfa);
 $("#mfacode").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();verifyMfa()}});
 $("#fgt").addEventListener("click",async()=>{const email=$("#nm").value.trim().toLowerCase(),el=$("#lerr");if(!email){el.textContent="Isi email dulu di kolom Email.";return}
  el.style.color="";el.textContent="Mengirim...";let r={};try{r=await sb.auth.resetPasswordForEmail(email,{redirectTo:location.origin+location.pathname})}catch(e){}
  el.textContent=(r.error&&r.error.status===429)?"Terlalu sering meminta. Tunggu beberapa menit lalu coba lagi.":"Jika email terdaftar, tautan pengaturan ulang password akan dikirim. Cek juga folder spam."});
 sb.auth.onAuthStateChange(ev=>{if(ev==="PASSWORD_RECOVERY")showRecovery()});
 $("#rf").addEventListener("submit",async e=>{e.preventDefault();const a=$("#np1").value,b=$("#np2").value,er=$("#rerr");
  if(a!==b){er.textContent="Kedua password harus sama.";return}
  const m=pwCheck(a,"");if(m){er.textContent=m;return}
  const r=await sb.auth.updateUser({password:a});if(r.error){er.textContent="Gagal menyimpan: "+r.error.message;return}
  try{await sb.auth.signOut()}catch(x){}try{localStorage.removeItem(AUTHK);sessionStorage.setItem("english-pw-changed","1")}catch(x){}
  history.replaceState(null,"",location.pathname);location.reload()});
 try{if(sessionStorage.getItem("english-pw-changed")){sessionStorage.removeItem("english-pw-changed");window.__pwMsg=1}}catch(e){}
}
function acct(){
 if(!CLOUD){view.innerHTML=`<div class="tcard"><h3>👤 Akun</h3><p class="sub">Fitur akun (ganti password, 2FA) tersedia setelah web terhubung ke Supabase.</p></div>`;return}
 view.innerHTML=`<div class="tcard"><h3>👤 Akun</h3><p class="sub">Masuk sebagai <b>${esc(SYNC.email||"-")}</b> (${ROLE==="admin"?"admin":"pengguna"}).</p><div class="acts"><button class="btn" data-a="aclo">Keluar</button><button class="btn" data-a="acout">Keluar dari semua perangkat</button></div></div>
 <div class="tcard"><h4>🔑 Ganti password</h4><p class="sub">Minimal 10 karakter dengan kombinasi huruf dan angka, atau passphrase 14 karakter ke atas.</p><input class="search" id="pw1" type="password" autocomplete="new-password" placeholder="Password baru"><input class="search" id="pw2" type="password" autocomplete="new-password" placeholder="Ulangi password baru" style="margin-top:8px"><button class="btn pri" data-a="acpw" style="margin-top:10px">Ganti password</button><p class="bkm" id="pwm" role="status"></p></div>
 <div class="tcard"><h4>🛡️ Verifikasi dua langkah (2FA)</h4><div id="mfaarea"><p class="sub">Memuat...</p></div></div>`;
 mfaStatus()}
async function mfaStatus(){const el=$("#mfaarea");if(!el)return;
 const f=await sb.auth.mfa.listFactors(),t=f.data&&(f.data.totp||[]).find(x=>x.status==="verified");
 el.innerHTML=t?`<p>✅ 2FA <b>aktif</b>. Saat masuk, kamu diminta kode dari aplikasi autentikator.</p><button class="btn bad" data-a="mfaoff" data-id="${esc(t.id)}">Nonaktifkan 2FA</button><p class="bkm" id="mfam"></p>`:`<p class="sub">${ROLE==="admin"?"Sangat disarankan untuk akun admin, karena admin bisa melihat progres semua pengguna. ":"Opsional, menambah keamanan akun. "}Gunakan aplikasi seperti Google Authenticator atau Authy.</p><button class="btn pri" data-a="mfaon">Aktifkan 2FA</button><div id="mfaenr"></div><p class="bkm" id="mfam"></p>`}
async function mfaEnroll(){const m=$("#mfam");m.textContent="";
 const r=await sb.auth.mfa.enroll({factorType:"totp",friendlyName:"Authenticator-"+Date.now().toString(36)});
 if(r.error){m.textContent="Gagal: "+r.error.message+" (pastikan MFA TOTP aktif di pengaturan Supabase)";return}
 SYNC.enrollId=r.data.id;
 $("#mfaenr").innerHTML=`<p class="sub" style="margin-top:12px">1. Pindai kode QR ini dengan aplikasi autentikator.</p><img id="mfaqr" class="qr" alt="Kode QR 2FA"><p class="sub">Atau ketik kunci ini secara manual: <code>${esc(r.data.totp.secret)}</code></p><p class="sub">2. Masukkan kode 6 angka yang tampil di aplikasi.</p><input class="search" id="mfaenc" inputmode="numeric" maxlength="6" placeholder="000000" autocomplete="one-time-code"><button class="btn pri" data-a="mfaver" style="margin-top:8px">Aktifkan</button>`;
 $("#mfaqr").src=r.data.totp.qr_code}
