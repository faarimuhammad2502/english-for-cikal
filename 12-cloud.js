const CLOUD_MARK=1;
let sb=null;
try{if(window.SB_CFG&&SB_CFG.url&&SB_CFG.key&&window.supabase&&supabase.createClient)sb=supabase.createClient(SB_CFG.url,SB_CFG.key,{auth:{persistSession:true,autoRefreshToken:true,storageKey:"english-guru-cikal-sb"}})}catch(e){}
const CLOUD=!!sb;
const SYNC={uid:"",busy:false,snap:"",last:null,notePushed:null,started:false,err:""};
const SKEYS=()=>({known:KEY,meta:MK,srs:KEY+"-srs",tpl:KEY+"-tpl",tests:KEY+"-tests",mine:KEY+"-mine",lafal:KEY+"-lafal"});
function collect(){const o={},K=SKEYS();for(const n in K){try{const v=localStorage.getItem(K[n]);if(v!==null)o[n]=JSON.parse(v)}catch(e){}}return o}
function summaryOf(){const t=dstr(0),last=TH[TH.length-1],lv=Object.values(LH).filter(x=>typeof x==="number");
 return{known:ALL.filter(w=>known[w.en]).length,total:ALL.length,xp:meta.xp||0,streak:meta.streak||0,goal:meta.goal||10,today:(meta.td&&meta.td.d===t)?meta.td.w.length:0,due:Object.values(srs).filter(v=>v.d<=t).length,mine:MY.length,test:last?{est:last.est,tot:last.tot,d:last.d}:null,lafal:lv.length?Math.round(lv.reduce((a,b)=>a+b,0)/lv.length):null}}
function mergeData(L,R){const o={};L=L||{};R=R||{};
 o.known=Object.assign({},R.known||{},L.known||{});
 const ls=L.srs||{},rs=R.srs||{},sm={};new Set([...Object.keys(ls),...Object.keys(rs)]).forEach(k=>{const a=ls[k],b=rs[k];sm[k]=!a?b:!b?a:(String(a.d)>=String(b.d)?a:b)});o.srs=sm;
 const lm=L.meta||{},rm=R.meta||{},m=Object.assign({},rm,lm);m.xp=Math.max(lm.xp||0,rm.xp||0);
 if((rm.last||"")>(lm.last||"")){m.last=rm.last;m.streak=rm.streak}else{m.last=lm.last;m.streak=lm.streak}
 m.h=Object.assign({},rm.h||{});for(const d in (lm.h||{}))m.h[d]=Math.max(m.h[d]||0,lm.h[d]);
 const a=lm.td,b=rm.td;m.td=!a?b:!b?a:(a.d>b.d?a:b.d>a.d?b:{d:a.d,w:[...new Set([...(a.w||[]),...(b.w||[])])],ok:a.ok||b.ok});
 if(m.td===undefined)delete m.td;o.meta=m;
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
 fillCats();rq=null;quiz=null;px=null;ts=null;board();render()}
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
 if(SYNC.started)return;SYNC.started=true;SYNC.uid=session.user.id;syncUI("sync");
 try{
  const pr=await sb.from("profiles").select("role").eq("id",SYNC.uid).maybeSingle();
  if(pr.data){const want=pr.data.role==="admin"?"admin":"1";let cur="";try{cur=localStorage.getItem(AUTHK)||""}catch(e){}if(cur!==want){try{localStorage.setItem(AUTHK,want)}catch(e){}location.reload();return}}
  await pullCfg();await pullMerge();
 }catch(e){SYNC.err=e&&(e.code||e.message)||"";syncUI(navigator.onLine?"err":"off")}
 setInterval(()=>push(false),8000);setInterval(()=>{pullCfg().catch(()=>{})},300000);
 document.addEventListener("visibilitychange",()=>{if(document.hidden)push(false)});
 window.addEventListener("online",()=>push(true))}
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
 return pr.data.role==="admin"?"admin":"user"}
async function doLogout(){try{if(sb&&SYNC.uid)await push(true)}catch(e){}try{if(sb)await sb.auth.signOut()}catch(e){}try{localStorage.removeItem(AUTHK)}catch(e){}location.reload()}
if(CLOUD){const nm=$("#nm");nm.type="email";nm.placeholder="email@contoh.com";nm.autocomplete="username";try{nm.value=localStorage.getItem("english-guru-cikal-last-email")||""}catch(e){nm.value=""}const lb=document.querySelector('label[for="nm"]');if(lb)lb.textContent="Email"}
const ago=iso=>{const m=Math.round((Date.now()-new Date(iso).getTime())/60000);if(isNaN(m))return"-";const d=new Date(iso).toLocaleString("id-ID",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"});return(m<1?"baru saja":m<60?m+" menit lalu":m<1440?Math.round(m/60)+" jam lalu":Math.round(m/1440)+" hari lalu")+" ("+d+")"};
async function loadUsers(){
 const el=$("#admusers");if(!el||!sb)return;
 const [p,g]=await Promise.all([sb.from("profiles").select("id,display_name,role"),sb.from("progress").select("user_id,summary,updated_at")]);
 if(p.error||g.error){el.innerHTML=`<p class="lerr">Gagal memuat: ${esc((p.error||g.error).message)}</p>`;return}
 const gm={};(g.data||[]).forEach(r=>gm[r.user_id]=r);const N=x=>esc(String(x==null?"-":x));
 el.innerHTML=`<div class="ulist">${(p.data||[]).map(u=>{const r=gm[u.id],s=(r&&r.summary)||{};return `<div class="urow"><div class="uh"><b>${esc(u.display_name||"(tanpa nama)")}</b><span class="rolebadge${u.role==="admin"?"":" rb-user"}">${esc(u.role)}</span></div>${r?`<div class="ugrid"><span>Kata dikuasai <b>${N(s.known)}/${N(s.total)}</b></span><span>XP <b>${N(s.xp)}</b></span><span>Streak <b>${N(s.streak)}</b></span><span>Target hari ini <b>${N(s.today)}/${N(s.goal)}</b></span><span>Ulangan tertunda <b>${N(s.due)}</b></span><span>Tes terakhir <b>${s.test?N(s.test.est)+" · "+N(s.test.tot)+"%":"belum"}</b></span><span>Lafal <b>${s.lafal==null?"-":N(s.lafal)+"%"}</b></span></div><div class="sub">Aktif terakhir: ${ago(r.updated_at)}</div>`:`<div class="sub">Belum ada data. Pengguna ini belum pernah masuk.</div>`}</div>`}).join("")}</div>`}
function adminP(){adminP0();if(ROLE!=="admin")return;
 view.firstElementChild.insertAdjacentHTML("afterend",`<div class="tcard"><h3>☁️ Pengguna dan progres</h3>${CLOUD?`<p class="sub">Ringkasan dari server. Catatan guru tidak ikut terlihat.</p><div id="admusers"><p class="sub">Memuat...</p></div><button class="btn" data-a="admref" style="margin-top:10px">Muat ulang</button>`:`<p class="sub">Mode lokal: web belum terhubung ke server, jadi daftar pengguna tidak tersedia.</p>`}</div><div class="tcard"><h4>📢 Pengumuman untuk semua pengguna</h4><textarea class="search" id="annx" rows="3" maxlength="300" placeholder="Tulis pengumuman (kosongkan untuk menghapus)"></textarea><button class="btn pri" data-a="annsave" style="margin-top:8px">Simpan pengumuman</button><p class="bkm" id="annm"></p></div>`);
 const a=$("#annx");if(a)a.value=CFG.ann||"";if(CLOUD)loadUsers()}
