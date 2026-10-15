let sx=0;
view.addEventListener("touchstart",e=>{sx=e.touches[0].clientX},{passive:true});
view.addEventListener("touchend",e=>{if(tab!=="card")return;const dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>70)go(dx<0?1:-1)});
document.addEventListener("keydown",e=>{if(tab!=="card"||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
 if(e.key===" "||e.key==="Enter"){if(e.target.tagName==="BUTTON")return;e.preventDefault();const s=view.querySelector(".scene");if(s)s.click()}
 else if(e.key==="ArrowRight")go(1);else if(e.key==="ArrowLeft")go(-1)});
$("#lv").addEventListener("click",e=>{const b=e.target.closest("[data-lv]");if(b){lvl=b.dataset.lv;cat="Semua";idx=0;flip=false;quiz=null;px=null;rq=null;lf.run=0;fillCats();render()}});
document.querySelector(".tabs").addEventListener("click",e=>{const b=e.target.closest("[data-tab]");if(b){tab=b.dataset.tab;render()}});
sel.addEventListener("change",()=>{cat=sel.value;idx=0;flip=false;quiz=null;px=null;rq=null;lf.run=0;render()});
$("#reset").addEventListener("click",()=>{if(confirm("Hapus semua progres hafalan?")){known={};srs={};rq=null;save();saveS();render()}});
const HASH="";
async function sha(t){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
let ROLE="user";
const AS="",AP="";
const hex2u8=h=>Uint8Array.from(h.match(/../g).map(x=>parseInt(x,16)));
async function pbk(pw,salt){const k=await crypto.subtle.importKey("raw",new TextEncoder().encode(pw),"PBKDF2",false,["deriveBits"]);const b=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:hex2u8(salt),iterations:150000},k,256);return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
async function doLogin(){const n=$("#nm").value.trim().toLowerCase(),p=$("#pw").value;
 if(n==="michelle")return(await sha(n+"|"+p.trim().toLowerCase()))===HASH?"user":null;
 if(n==="admin")return(await pbk(p,AS))===AP?"admin":null;
 return null}
function enter(r){ROLE=r==="admin"?"admin":"user";$("#login").hidden=true;document.body.classList.remove("lock");$("#who").textContent=ROLE==="admin"?"Admin":"Halo, Michelle";navUI()}
function lock(){ROLE="user";if(tab==="admin")tab="home";$("#login").hidden=false;document.body.classList.add("lock");$("#pw").value="";$("#lerr").textContent=""}
$("#sp").addEventListener("change",e=>{$("#pw").type=e.target.checked?"text":"password"});
$("#lf").addEventListener("submit",async e=>{e.preventDefault();let r=null;
 if(window.SB_CFG&&!CLOUD){$("#lerr").textContent="Layanan login belum termuat. Muat ulang halaman dengan internet aktif.";return}
 try{r=CLOUD?await cloudLogin():await doLogin()}catch(x){$("#lerr").textContent=CLOUD?({bad:"Email atau password salah.",unconfirmed:"Email belum dikonfirmasi di Supabase (Authentication > Users).",key:"Kunci proyek Supabase ditolak. Periksa config.js.",net:"Tidak bisa terhubung ke server. Periksa internet dan coba lagi.",noprofile:"Akun belum terdaftar di aplikasi. Hubungi admin.",perm:"Database menolak akses tabel. Jalankan SQL izin (grant) di Supabase.",notable:"Tabel database belum ada atau belum terbaca. Jalankan supabase-setup.sql.",dbfail:"Server database bermasalah saat membaca profil."}[x.message]||"Login gagal karena kendala server.")+(x.detail?" ["+x.detail+"]":""):"Browser ini belum mendukung login.";if(CLOUD&&x.message==="bad"){const c=$("#lcard");c.classList.remove("shake");void c.offsetWidth;c.classList.add("shake")}return}
 if(r){let ok2=true;try{localStorage.setItem(AUTHK,r==="admin"?"admin":"1")}catch(x){ok2=false}if(ok2)location.reload();else{enter(r);render()}}
 else{$("#lerr").textContent="Nama atau password salah. Coba lagi.";const c=$("#lcard");c.classList.remove("shake");void c.offsetWidth;c.classList.add("shake")}});
$("#logout").addEventListener("click",doLogout);
let av="";try{av=localStorage.getItem(AUTHK)||""}catch(e){}
(av==="1"||av==="admin")?enter(av):lock();
if(CLOUD)cloudBoot(av);
fillCats();render();

