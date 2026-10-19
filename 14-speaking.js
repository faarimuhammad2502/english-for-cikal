const speakState={messages:[],busy:false,recording:false,recognition:null,level:"A2",scenario:"Everyday conversation",autoSpeak:true};
const speakTopics=["Everyday conversation","At a café","Meeting a new colleague","In the classroom","Talking about hobbies"];
const SpeechInput=window.SpeechRecognition||window.webkitSpeechRecognition;
function speakingStop(){
 if(speakState.recognition){try{speakState.recognition.abort()}catch(e){}speakState.recognition=null}
 speakState.recording=false;
 try{if(window.speechSynthesis)window.speechSynthesis.cancel()}catch(e){}
}
function speaking(){
 const draft=$("#sp-input")?.value||"";
 const levelOptions=["A1","A2","B1","B2","C1"].map(x=>`<option ${speakState.level===x?"selected":""}>${x}</option>`).join("");
 const topicOptions=speakTopics.map(x=>`<option value="${esc(x)}" ${speakState.scenario===x?"selected":""}>${esc(x)}</option>`).join("");
 const chat=speakState.messages.length?speakState.messages.map((m,i)=>`<div class="sp-message ${m.role==="model"?"sp-ai":"sp-user"}"><div class="sp-who">${m.role==="model"?"AI partner":"You"}</div><div class="sp-text">${esc(m.text).replace(/\n/g,"<br>")}</div>${m.role==="model"?`<button class="sp-read" type="button" data-sp="read" data-index="${i}" aria-label="Bacakan balasan">🔊 Bacakan</button>`:""}</div>`).join(""):`<div class="sp-welcome"><div class="sp-orb">💬</div><h4>Hi, Michelle! Ready to practice?</h4><p>Pilih topik dan level, lalu mulai ngobrol. Kamu bisa mengetik atau bicara lewat mikrofon.</p><div class="sp-starters">${["Hi! Can you introduce yourself?","What do you like doing after work?","Tell me about your school."].map(x=>`<button type="button" class="chipw" data-sp="starter" data-text="${esc(x)}">${esc(x)}</button>`).join("")}</div></div>`;
 view.innerHTML=`<div class="tcard sp-head"><div><h3>Speaking dengan AI 💬</h3><p class="sub">Latihan percakapan bahasa Inggris. AI akan mengobrol, lalu memberi koreksi singkat dengan ramah.</p></div><button class="btn" type="button" data-sp="reset" ${speakState.busy?"disabled":""}>Percakapan baru</button></div>
 <div class="tcard sp-settings"><label>Topik<select id="sp-topic" class="search">${topicOptions}</select></label><label>Level<select id="sp-level" class="search">${levelOptions}</select></label><label class="sp-auto"><input id="sp-auto" type="checkbox" ${speakState.autoSpeak?"checked":""}> Bacakan balasan otomatis</label></div>
 <div class="tcard sp-chat" id="sp-chat" aria-live="polite">${chat}</div>
 <form id="sp-form" class="tcard sp-compose"><textarea id="sp-input" class="search" rows="2" maxlength="1000" placeholder="Type or say something in English..." aria-label="Pesan bahasa Inggris" ${speakState.busy?"disabled":""}></textarea><div class="sp-compose-row"><span class="sub" id="sp-status" role="status">${speakState.busy?"AI sedang menyusun balasan...":"Tekan Enter untuk mengirim · Shift+Enter untuk baris baru"}</span><div class="acts"><button class="btn" id="sp-mic" type="button" data-sp="mic" ${!SpeechInput||speakState.busy?"disabled":""}>${speakState.recording?"⏹ Berhenti":"🎤 Bicara"}</button><button class="btn pri" type="submit" ${speakState.busy?"disabled":""}>Kirim</button></div></div></form>
 <p class="sub sp-privacy">Pesan dikirim ke Gemini untuk membuat balasan. Mikrofon memakai pengenalan suara browser. Jangan masukkan nama atau data pribadi murid.</p>`;
 const topic=$("#sp-topic"),lvl=$("#sp-level");
 $("#sp-input").value=draft;
 topic.addEventListener("change",()=>{speakState.scenario=topic.value;if(speakState.messages.length)spStatus("Topik berubah; mulai percakapan baru agar AI memakai topik itu.")});
 lvl.addEventListener("change",()=>{speakState.level=lvl.value;if(speakState.messages.length)spStatus("Level berubah; mulai percakapan baru agar AI memakai level itu.")});
 $("#sp-auto").addEventListener("change",e=>{speakState.autoSpeak=e.target.checked});
}
function spStatus(text,err=false){const el=$("#sp-status");if(el){el.textContent=text;el.classList.toggle("sp-error",err)}}
function spScroll(){const el=$("#sp-chat");if(el)el.scrollTop=el.scrollHeight}
function spSpeech(text){try{if(!window.speechSynthesis)return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang="en-US";u.rate=.92;speechSynthesis.speak(u)}catch(e){}}
async function spSend(text){
 const message=String(text||$("#sp-input")?.value||"").trim();if(!message||speakState.busy)return;
 if(!CLOUD||!sb){spStatus("Speaking AI memerlukan koneksi akun. Muat ulang halaman saat online dan masuk kembali.",true);return}
 speakState.messages.push({role:"user",text:message});speakState.busy=true;const input=$("#sp-input");if(input)input.value="";speaking();spScroll();
 try{
  const sessionResult=await sb.auth.getSession(),session=sessionResult&&sessionResult.data&&sessionResult.data.session;
  if(!session||!session.access_token)throw new Error("Sesi login berakhir. Masuk kembali untuk melanjutkan.");
  const response=await fetch("/api/speaking",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${session.access_token}`},body:JSON.stringify({level:speakState.level,scenario:speakState.scenario,messages:speakState.messages.slice(-12)})});
  let data={};try{data=await response.json()}catch(e){}
  if(!response.ok)throw new Error(data.error||"Belum bisa mendapat balasan. Coba lagi sebentar.");
  if(!data.text)throw new Error("AI belum mengirim balasan. Coba kirim lagi.");
  speakState.messages.push({role:"model",text:data.text});
  speakState.busy=false;speaking();spScroll();if(speakState.autoSpeak)spSpeech(data.text);$("#sp-input")?.focus();
 }catch(e){if(speakState.messages.at(-1)?.role==="user"&&speakState.messages.at(-1).text===message)speakState.messages.pop();speakState.busy=false;speaking();spScroll();spStatus(e.message||"Koneksi bermasalah. Coba lagi.",true);const input=$("#sp-input");if(input){input.value=message;input.focus()}}
}
function spListen(){
 if(!SpeechInput||speakState.busy)return;
 if(speakState.recognition){const draft=$("#sp-input")?.value||"";speakingStop();speaking();$("#sp-input").value=draft;spStatus("Mikrofon berhenti.");return}
 const rec=new SpeechInput();rec.lang="en-US";rec.interimResults=false;rec.continuous=false;speakState.recognition=rec;speakState.recording=true;
 rec.onresult=e=>{const heard=Array.from(e.results).map(r=>r[0].transcript).join(" ").trim(),input=$("#sp-input");if(input){input.value=(input.value?input.value+" ":"")+heard;input.focus()}spStatus("Ucapan masuk. Periksa teksnya, lalu tekan Kirim.")};
 rec.onerror=e=>{const msg=e.error==="not-allowed"?"Izin mikrofon ditolak. Izinkan mikrofon di pengaturan browser.":e.error==="no-speech"?"Belum terdengar suara. Coba bicara lagi.":e.error==="network"?"Pengenalan suara butuh koneksi internet.":"Mikrofon tidak bisa dipakai. Coba lagi.";speakState.recording=false;speakState.recognition=null;speaking();spStatus(msg,true)};
 rec.onend=()=>{if(speakState.recognition===rec){speakState.recording=false;speakState.recognition=null;speaking()}};
 try{const draft=$("#sp-input")?.value||"";rec.start();speaking();$("#sp-input").value=draft;spStatus("Listening... speak in English.")}catch(e){speakState.recording=false;speakState.recognition=null;speaking();spStatus("Mikrofon belum bisa dipakai. Coba lagi.",true)}
}
view.addEventListener("click",e=>{
 const b=e.target.closest("[data-sp]");if(!b)return;
 if(b.dataset.sp==="mic")spListen();
 else if(b.dataset.sp==="reset"){speakingStop();speakState.messages=[];speakState.busy=false;speaking()}
 else if(b.dataset.sp==="read"){const m=speakState.messages[Number(b.dataset.index)];if(m)spSpeech(m.text)}
 else if(b.dataset.sp==="starter"){const input=$("#sp-input");if(input){input.value=b.dataset.text||"";input.focus()}}
});
view.addEventListener("submit",e=>{if(e.target.id!=="sp-form")return;e.preventDefault();spSend()});
view.addEventListener("keydown",e=>{if(e.target.id==="sp-input"&&e.key==="Enter"&&!e.shiftKey){e.preventDefault();spSend()}});
