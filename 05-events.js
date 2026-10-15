view.addEventListener("click",e=>{if(drag){drag=false;e.stopImmediatePropagation();e.preventDefault()}},true);
let dq="";
const LN={A1:"Pemula",A2:"Dasar",B1:"Menengah",B2:"Menengah atas",C1:"Mahir",C2:"Penguasaan penuh"};
function dict(){view.innerHTML=`<input class="search" id="dq" placeholder="Cari di semua ${ALL.length} kata..." aria-label="Cari"><p class="sub" style="margin-bottom:10px">Semua kosakata dari level paling dasar sampai paling tinggi. Ketuk kotak untuk mendengar pelafalannya.</p><div id="dbody"></div>`;$("#dq").value=dq;dbody()}
function dbody(){const t=dq.toLowerCase();
 $("#dbody").innerHTML=LV.slice(1).map(l=>{
  const tot=ALL.filter(w=>lvOf(w)===l),ws=tot.filter(w=>!t||w.en.toLowerCase().includes(t)||w.id.toLowerCase().includes(t));
  if(!ws.length)return "";
  const kn=tot.filter(w=>known[w.en]).length,cs=[...new Set(ws.map(w=>w.cat))];
  return `<details class="lvs" ${t||l==="A2"?"open":""}><summary><b>Level ${l} · ${LN[l]}</b><span>${tot.length} kata · hafal ${kn}</span></summary>${cs.map(c=>`<h4>${c.slice(5)}</h4><div class="wg mini">${ws.filter(w=>w.cat===c).map(w=>`<button class="wb ${known[w.en]?"kn":""}" data-a="sayw" data-w="${w.en}"><b>${w.en}</b><span>${w.id}</span></button>`).join("")}</div>`).join("")}</details>`}).join("")||"<p class='sub'>Tidak ada kata yang cocok.</p>"}
view.addEventListener("input",e=>{if(e.target.id==="dq"){dq=e.target.value;dbody()}});
