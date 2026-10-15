let NOTE="",bedit=false,ncat="",bopen=null;
try{NOTE=localStorage.getItem(KEY+"-note")||""}catch(e){}
const MSG0="Semangat terus belajar Bahasa Inggrisnya ya, Michelle! Kamu guru yang hebat, dan sedikit demi sedikit setiap hari akan membawamu ke level berikutnya.";
function tick(en){const t=dstr(0);if(!meta.td||meta.td.d!==t)meta.td={d:t,w:[],ok:0};if(!meta.td.w.includes(en))meta.td.w.push(en);meta.h=meta.h||{};meta.h[t]=meta.td.w.length;{const ks=Object.keys(meta.h).sort();while(ks.length>90)delete meta.h[ks.shift()]}
 if(!meta.td.ok&&meta.td.w.length>=(meta.goal||10)){meta.td.ok=1;meta.xp+=15;toast("Target harian tercapai! +15 XP");confetti()}}
function board(){const el=$("#board");if(!el)return;
 const ev=meta.ev,days=ev&&ev.d?Math.round((new Date(ev.d+"T00:00:00")-new Date(dstr(0)+"T00:00:00"))/864e5):null;
 let today="";try{today=new Date().toLocaleDateString("id-ID",{weekday:"long",day:"numeric",month:"long",year:"numeric"})}catch(e){today=dstr(0)}
 el.innerHTML=bedit?`<h4>Ubah papan semangat</h4><label class="bl">Pesan untuk Michelle</label><textarea class="search" id="bmsg" rows="3" maxlength="240"></textarea><label class="bl">Hari penting (contoh: Mid-term review)</label><input class="search" id="bev" maxlength="40" placeholder="Nama acara"><input class="search" id="bevd" type="date" style="margin-top:8px" aria-label="Tanggal acara"><div class="acts"><button class="btn" data-a="bcancel">Batal</button><button class="btn ok" data-a="bsave">Simpan</button></div>`:`<details class="bdet" ${(bopen===null?innerWidth>=900:bopen)?"open":""}><summary>💬 Papan semangat</summary><p class="bmsg">${esc(meta.msg||MSG0)}</p>${ev&&ev.n?`<div class="bev"><b>${esc(ev.n)}</b><span>${days===null?"":days>0?days+" hari lagi":days===0?"Hari ini!":"Sudah lewat"}</span></div>`:""}<div class="meta" style="margin:12px 0 6px"><span>Target harian</span></div><div class="seg">${[5,10,15,20].map(n=>`<button class="${(meta.goal||10)===n?"on":""}" data-a="goal" data-v="${n}">${n}</button>`).join("")}</div><button class="reset" data-a="bedit" style="margin-top:8px">Ubah pesan dan hari penting</button></details>`;
 {const dt=el.querySelector("details");if(dt)dt.addEventListener("toggle",()=>{bopen=dt.open})}
 if(bedit){$("#bmsg").value=meta.msg||MSG0;$("#bev").value=(meta.ev&&meta.ev.n)||"";$("#bevd").value=(meta.ev&&meta.ev.d)||""}}
$("#board").addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;const a=b.dataset.a;
 if(a==="goal"){meta.goal=+b.dataset.v;save();board();hdr()}
 else if(a==="bedit"){bedit=true;board()}
 else if(a==="bcancel"){bedit=false;board()}
 else if(a==="bsave"){meta.msg=cl($("#bmsg").value,240);const d=$("#bevd").value;meta.ev={n:cl($("#bev").value,40),d:/^\d{4}-\d{2}-\d{2}$/.test(d)?d:""};save();bedit=false;board()}});
board();
const NT=[["Catatan IEP",`Student (initials): 
Date: 
Goal: 
Current level: 
Progress this week: Today, the student was able to 
Support provided: I used 
Next steps: We will continue to `],
["Rencana pelajaran",`Learning goal: By the end of the lesson, students will be able to 
Success criteria: 
Starter activity: 
Main activity: 
Differentiation: 
Assessment for learning: 
Plenary: `],
["Pesan ke orang tua",`Dear Mr./Mrs. ,

I would like to update you on the progress of your child. 

A suggested next step is to 

Please let me know if you have any questions.

Kind regards,
`],
["Catatan observasi",`Observation date: 
Context: 
What I observed: 
Possible reasons: 
Strategies to try: 
Follow-up: `]];
const SS=["By the end of the lesson, students will be able to","I have noticed that","With support, the student was able to","A suggested next step is to","I would recommend that","Progress has been steady in","Despite some challenges,","We will continue to monitor","The strategy that worked best was","Please let me know if you have any questions."];
const CHK=[[/\b(\w+)\s+\1\b/i,"kata terulang berurutan"],[/\b(informations|advices|childs|peoples|equipments|furnitures|feedbacks|homeworks)\b/i,"kata ini tidak dipakai dalam bentuk jamak seperti itu"],[/\bmore (better|easier|faster|bigger|cheaper)\b/i,"jangan pakai more bersama bentuk -er"],[/\b(he|she|it)\s+(don't|do not)\b/i,"setelah he, she, it pakai doesn't"],[/\b(he|she)\s+(go|have|do|work|teach|need|want|like)\b/i,"setelah he atau she, kata kerja butuh -s atau -es (goes, has, does)"],[/\b(did|didn't|did not)\s+(went|saw|ate|came|made|took|gave|had|wrote)\b/i,"setelah did, pakai bentuk dasar kata kerja"],[/\b(students|children|teachers|they|we)\s+(was|has)\b/i,"subjek jamak memakai were atau have"],[/(^|[\s(])i(?=[\s,.'!?]|$)/,"huruf I (saya) harus kapital"],[/(^|[.!?]\s+)([a-z][a-z\']*)/,"awal kalimat harus huruf kapital"],[/ {2,}/,"ada spasi ganda"],[/,[A-Za-z]/,"beri spasi setelah koma"],[/[a-z]\.[A-Z]/,"beri spasi setelah titik"]];
function nsave(){try{localStorage.setItem(KEY+"-note",NOTE)}catch(e){}const l=$("#nsv");if(l)l.textContent="Tersimpan otomatis"}
function nupd(){const t=NOTE,w=t.match(/[A-Za-z']+/g)||[],sn=(t.match(/[^.!?]+[.!?]+/g)||[]).length||(t.trim()?1:0);
 const nm=" "+t.toLowerCase().replace(/[^a-z0-9']+/g," ")+" ",used=new Set();
 ALL.forEach(x=>{if(isS(x))return;const k=x.en.toLowerCase().replace(/[^a-z0-9']+/g," ").trim();if(k&&nm.includes(" "+k+" "))used.add(x.en)});
 $("#nst").textContent=`${w.length} kata · ${sn} kalimat · ${used.size} kosakata web ini terpakai`;
 const f=t.trim()?CHK.map(c=>{const m=t.match(c[0]);return m?`<li><b>${esc(((m[2]||m[0]).trim()||"spasi"))}</b> : ${c[1]}</li>`:""}).filter(Boolean):[];
 $("#nchk").innerHTML=!t.trim()?`<p class="sub">Mulai menulis, nanti hasil pemeriksaan muncul di sini.</p>`:f.length?`<ul>${f.join("")}</ul><p class="sub">Pemeriksaan ini sederhana dan hanya menangkap kesalahan umum.</p>`:`<p class="sub">Tidak ada kesalahan umum yang terdeteksi. Untuk koreksi lebih lengkap, pakai tombol Salin + minta koreksi.</p>`;
 $("#nchips").innerHTML=ALL.filter(x=>x.cat===ncat&&!isS(x)).map(x=>`<button class="chipw ${used.has(x.en)?"on":""}" data-a="nw" data-w="${x.en}" title="${x.id}">${x.en}</button>`).join("")}
function note(){
 const cs=[...new Set(ALL.filter(w=>/SEN|Pedagogi|Penilaian|Umpan balik|Pengelolaan|Mengajar|Pembelajaran|Kolokasi/.test(w.cat)&&!isS(w)).map(w=>w.cat))];
 if(!cs.includes(ncat))ncat=cs[0]||"";
 view.innerHTML=`<div class="tcard"><h3>Asisten catatan guru</h3><p class="sub">Latihan menulis catatan IEP, rencana pelajaran, dan pesan ke orang tua dalam bahasa Inggris profesional. Gunakan inisial atau nama samaran, jangan menulis data pribadi murid yang asli.</p><div class="meta" style="margin-top:12px"><span>Mulai dari kerangka</span></div><div class="chipsrow">${NT.map((t,i)=>`<button class="chipw" data-a="ntpl" data-i="${i}">${t[0]}</button>`).join("")}</div><textarea id="ntx" class="search" rows="12" placeholder="Tulis catatanmu dalam bahasa Inggris..." style="margin-top:12px"></textarea><div class="meta"><span id="nst"></span><span id="nsv">Tersimpan otomatis</span></div><div class="acts3"><button class="btn" data-a="ncopy">Salin</button><button class="btn" data-a="nask">Salin + minta koreksi</button><button class="btn" data-a="ndl">Unduh .txt</button></div><div class="center"><button class="reset" data-a="nclr">Kosongkan</button></div></div><div class="tcard"><h4>Pemeriksaan cepat</h4><div id="nchk"></div></div><div class="tcard"><h4>Pembuka kalimat (ketuk untuk menyisipkan)</h4><div class="chipsrow">${SS.map((t,i)=>`<button class="chipw" data-a="nss" data-i="${i}">${t}</button>`).join("")}</div></div><div class="tcard"><h4>Kosakata untuk ditulis (hijau = sudah terpakai)</h4><select id="ncat" aria-label="Tema kosakata">${cs.map(c=>`<option ${c===ncat?"selected":""}>${c}</option>`).join("")}</select><div id="nchips" class="chipsrow" style="margin-top:10px"></div></div>`;
 $("#ntx").value=NOTE;nupd()}
function ins(txt){const a=$("#ntx"),s0=a.selectionStart==null?a.value.length:a.selectionStart,e0=a.selectionEnd==null?a.value.length:a.selectionEnd;a.value=a.value.slice(0,s0)+txt+a.value.slice(e0);const p=s0+txt.length;a.focus();try{a.setSelectionRange(p,p)}catch(e){}NOTE=a.value;nsave();nupd()}
view.addEventListener("input",e=>{if(e.target.id==="ntx"){NOTE=e.target.value;nsave();nupd()}});
view.addEventListener("change",e=>{if(e.target.id==="ncat"){ncat=e.target.value;nupd()}});
