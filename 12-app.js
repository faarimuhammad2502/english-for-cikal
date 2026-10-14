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
function enter(){$("#login").hidden=true;document.body.classList.remove("lock");$("#who").textContent="Halo, Michelle"}
function lock(){$("#login").hidden=false;document.body.classList.add("lock");$("#pw").value="";$("#lerr").textContent=""}
$("#sp").addEventListener("change",e=>{$("#pw").type=e.target.checked?"text":"password"});
$("#lf").addEventListener("submit",async e=>{e.preventDefault();let ok=false;
 try{ok=(await sha($("#nm").value.trim().toLowerCase()+"|"+$("#pw").value.trim().toLowerCase()))===HASH}catch(x){$("#lerr").textContent="Browser ini belum mendukung login.";return}
 if(ok){try{localStorage.setItem(KEY+"-auth","1")}catch(x){}enter()}
 else{$("#lerr").textContent="Nama atau password salah. Coba lagi.";const c=$("#lcard");c.classList.remove("shake");void c.offsetWidth;c.classList.add("shake")}});
$("#logout").addEventListener("click",()=>{try{localStorage.removeItem(KEY+"-auth")}catch(x){}lock()});
let authed=false;try{authed=localStorage.getItem(KEY+"-auth")==="1"}catch(e){}
authed?enter():lock();
fillCats();render();

