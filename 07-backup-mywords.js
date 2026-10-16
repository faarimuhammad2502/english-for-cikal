const BK=[KEY,MK,KEY+"-srs",KEY+"-tpl",KEY+"-tests",KEY+"-mine",KEY+"-note",KEY+"-lafal",KEY+"-mb",KEY+"-plan"];
function bkOut(){const o={app:"english-guru-cikal",v:1,t:new Date().toISOString(),data:{}};BK.forEach(k=>{try{const v=localStorage.getItem(k);if(v!==null)o.data[k]=v}catch(e){}});return JSON.stringify(o)}
function bkIn(txt){let o;try{o=JSON.parse(txt)}catch(e){return "Teks cadangan tidak valid."}
 if(!o||o.app!=="english-guru-cikal"||!o.data)return "File ini bukan cadangan web ini.";
 BK.forEach(k=>{if(typeof o.data[k]==="string"){try{if(k!==KEY+"-note")JSON.parse(o.data[k]);localStorage.setItem(k,k===KEY+"-note"?o.data[k].slice(0,20000):o.data[k])}catch(e){}}});
 try{known=JSON.parse(localStorage.getItem(KEY)||"{}")||{}}catch(e){known={}}
 try{meta=Object.assign({xp:0,streak:0,last:""},JSON.parse(localStorage.getItem(MK)||"{}"))}catch(e){}
 try{srs=JSON.parse(localStorage.getItem(KEY+"-srs")||"{}")||{}}catch(e){srs={}}
 try{Object.assign(F,JSON.parse(localStorage.getItem(KEY+"-tpl")||"{}"))}catch(e){}
 try{TH=JSON.parse(localStorage.getItem(KEY+"-tests")||"[]")||[]}catch(e){TH=[]}
 try{loadMine(JSON.parse(localStorage.getItem(KEY+"-mine")||"[]"))}catch(e){loadMine([])}
 try{NOTE=localStorage.getItem(KEY+"-note")||""}catch(e){}
 try{LH=JSON.parse(localStorage.getItem(KEY+"-lafal")||"{}")||{}}catch(e){LH={}}
 try{bedit=false;board()}catch(e){}
 loadMB();fillCats();rq=null;quiz=null;px=null;ts=null;render();return ""}
document.querySelector(".bk").addEventListener("click",e=>{const b=e.target.closest("[data-b]");if(!b)return;const k=b.dataset.b,m=$("#bkm");
 if(k==="dl"){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([bkOut()],{type:"application/json"}));a.download="cadangan-english-michelle-"+dstr(0)+".json";document.body.appendChild(a);a.click();a.remove();m.textContent="Jika file tidak terunduh, pakai tombol Salin teks."}
 else if(k==="cp"){copy(bkOut());m.textContent="Teks cadangan disalin. Tempel dan simpan di tempat aman."}
 else if(k==="file"){$("#bkf").click()}
 else if(k==="paste"){const r=bkIn($("#bkt").value.trim());m.textContent=r||"Berhasil dipulihkan.";if(!r)$("#bkt").value=""}});
$("#bkf").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const x=bkIn(String(r.result));$("#bkm").textContent=x||"Berhasil dipulihkan."};r.readAsText(f);e.target.value=""});
let MY=[];
const cl=(t,n)=>String(t||"").replace(/[<>"`\\]/g,"").trim().slice(0,n);
function loadMine(arr){
 MY=(Array.isArray(arr)?arr:[]).filter(m=>m&&typeof m.en==="string"&&typeof m.id==="string"&&TL.includes(m.lv)).map(m=>({en:cl(m.en,60),id:cl(m.id,80),ex:cl(m.ex,200),lv:m.lv})).filter(m=>m.en&&m.id);
 for(let i=ALL.length-1;i>=0;i--)if(ALL[i].my)ALL.splice(i,1);
 Object.keys(RAW).forEach(k=>{if(k.endsWith("· Kata saya"))delete RAW[k]});
 MY.forEach(m=>{const c=m.lv+" · Kata saya";RAW[c]=RAW[c]||"";ALL.push({en:m.en,id:m.id,ex:m.ex,cat:c,my:1})})}
try{loadMine(JSON.parse(localStorage.getItem(KEY+"-mine")||"[]"))}catch(e){loadMine([])}
const saveMine=a=>{try{localStorage.setItem(KEY+"-mine",JSON.stringify(a))}catch(e){}};
function mylist(){$("#mylist").innerHTML=MY.length?`<div class="wg mini">${MY.map((m,i)=>`<div class="wb"><b>${m.en}</b><span>${m.id}</span><small>${m.lv}</small><button class="mydel" data-a="mydel" data-i="${i}" aria-label="Hapus ${m.en}">Hapus</button></div>`).join("")}</div>`:`<p class="sub">Belum ada kata tambahan. Tambahkan kata yang kamu temui di sekolah.</p>`}
function my(){
 view.innerHTML=`<div class="tcard"><h3>Tambah kata sendiri</h3><p class="sub">Tambahkan kata yang kamu temui di sekolah. Kata akan masuk ke kartu, tab Ulang, latihan, dan Kamus.</p><div class="fields" style="margin-top:12px"><input class="search" id="myen" data-my="1" placeholder="Kata atau frasa Inggris" autocomplete="off"><input class="search" id="myid" data-my="1" placeholder="Arti (Bahasa Indonesia)" autocomplete="off"><select id="mylv" aria-label="Level">${TL.map(l=>`<option ${l==="B2"?"selected":""}>${l}</option>`).join("")}</select><input class="search" id="myex" data-my="1" placeholder="Contoh kalimat (boleh kosong)" autocomplete="off"></div><div class="center" style="margin-top:12px"><button class="btn pri" data-a="mysave" style="padding:12px 28px">Simpan kata</button></div><p class="bkm" id="mym" role="status"></p></div><div class="tcard"><h4>Kata saya (${MY.length})</h4><div id="mylist"></div></div>`;mylist()}
function mysave(){
 const m=$("#mym"),en=cl($("#myen").value,60),id=cl($("#myid").value,80),ex=cl($("#myex").value,200),lv=$("#mylv").value;
 if(!en||!id){m.textContent="Isi kata Inggris dan artinya dulu.";return}
 if(ALL.some(w=>w.en.toLowerCase()===en.toLowerCase())){m.textContent="Kata ini sudah ada di kosakata.";return}
 const arr=MY.concat([{en,id,ex,lv}]);saveMine(arr);loadMine(arr);fillCats();hdr();
 ["myen","myid","myex"].forEach(i=>$("#"+i).value="");$("#myen").focus();
 m.textContent=`"${en}" ditambahkan. Kata ini akan muncul sebagai kata baru di tab Ulang.`;mylist();toast("Kata ditambahkan")}
view.addEventListener("keydown",e=>{if(e.key==="Enter"&&e.target.dataset&&e.target.dataset.my){e.preventDefault();mysave()}});
