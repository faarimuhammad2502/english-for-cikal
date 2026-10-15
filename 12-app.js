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
const HASH="1a0c625d6115054f3ece36b71c32c2ad071cdb3d0a217aa600e7323e3574c34b";
async function sha(t){const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(t));return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
let ROLE="user";
const AS="ef0bae720308359f465dde3e29228899",AP="d3d1aa456bb9e6035c684955b0af7147c89bb229d78f8156b99b786ff505e7ab";
const hex2u8=h=>Uint8Array.from(h.match(/../g).map(x=>parseInt(x,16)));
async function pbk(pw,salt){const k=await crypto.subtle.importKey("raw",new TextEncoder().encode(pw),"PBKDF2",false,["deriveBits"]);const b=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:hex2u8(salt),iterations:150000},k,256);return[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}
async function doLogin(){const n=$("#nm").value.trim().toLowerCase(),p=$("#pw").value;
 if(n==="michelle")return(await sha(n+"|"+p.trim().toLowerCase()))===HASH?"user":null;
 if(n==="admin")return(await pbk(p,AS))===AP?"admin":null;
 return null}
function enter(r){ROLE=r==="admin"?"admin":"user";$("#login").hidden=true;document.body.classList.remove("lock");$("#who").textContent=ROLE==="admin"?"Admin":"Halo, Michelle";navUI()}
function lock(){ROLE="user";if(tab==="admin")tab="card";$("#login").hidden=false;document.body.classList.add("lock");$("#pw").value="";$("#lerr").textContent=""}
$("#sp").addEventListener("change",e=>{$("#pw").type=e.target.checked?"text":"password"});
$("#lf").addEventListener("submit",async e=>{e.preventDefault();let r=null;
 try{r=await doLogin()}catch(x){$("#lerr").textContent="Browser ini belum mendukung login.";return}
 if(r){try{localStorage.setItem(KEY+"-auth",r==="admin"?"admin":"1")}catch(x){}enter(r);render()}
 else{$("#lerr").textContent="Nama atau password salah. Coba lagi.";const c=$("#lcard");c.classList.remove("shake");void c.offsetWidth;c.classList.add("shake")}});
$("#logout").addEventListener("click",()=>{try{localStorage.removeItem(KEY+"-auth")}catch(x){}lock();render()});
let av="";try{av=localStorage.getItem(KEY+"-auth")||""}catch(e){}
(av==="1"||av==="admin")?enter(av):lock();
fillCats();render();

