let F={parent:"",student:"",teacher:"",date:""},tr={};
try{Object.assign(F,JSON.parse(localStorage.getItem(KEY+"-tpl")||"{}"))}catch(e){}
const LBL={parent:"Parent's name",student:"Student's name",teacher:"Your name",date:"Date and time"},LBI={parent:"Nama orang tua (mis. Mr. Andi)",student:"Nama murid",teacher:"Nama kamu",date:"Hari, tanggal, jam"};
const TP=[
{t:"Kabar baik tentang perkembangan murid",l:"B2",s:"{student}'s progress this term",e:`Dear {parent},

I hope you are well. I am writing to share some positive news about {student}.

Over the past few weeks, {student} has shown real progress in class. They participate more actively in discussions and complete tasks with growing confidence.

Thank you for your continued support at home. Please do not hesitate to contact me if you have any questions.

Kind regards,
{teacher}`,i:`Yth. {parent},

Semoga Anda sehat. Saya menulis untuk membagikan kabar baik tentang {student}.

Dalam beberapa minggu terakhir, {student} menunjukkan kemajuan nyata di kelas. Ia lebih aktif berdiskusi dan menyelesaikan tugas dengan makin percaya diri.

Terima kasih atas dukungan Anda di rumah. Jangan ragu menghubungi saya jika ada pertanyaan.

Hormat saya,
{teacher}`},
{t:"Menyampaikan kekhawatiran akademik",l:"B2",s:"Supporting {student} in class",e:`Dear {parent},

Thank you for taking the time to read this message. I would like to share a concern about {student}'s recent progress.

{student} has been finding some tasks challenging, and they need more support to meet the learning goals. I believe that, by working together, we can help them improve.

Would you be available for a short meeting? I would be happy to explain our plan in more detail.

Kind regards,
{teacher}`,i:`Yth. {parent},

Terima kasih sudah meluangkan waktu membaca pesan ini. Saya ingin menyampaikan kekhawatiran tentang perkembangan {student} belakangan ini.

{student} merasa beberapa tugas cukup sulit dan butuh dukungan lebih untuk mencapai tujuan pembelajaran. Saya yakin dengan bekerja sama kita bisa membantunya berkembang.

Apakah Anda bersedia bertemu sebentar? Dengan senang hati saya jelaskan rencananya lebih rinci.

Hormat saya,
{teacher}`},
{t:"Undangan pertemuan orang tua",l:"B2",s:"Invitation to a parent-teacher meeting",e:`Dear {parent},

I would like to invite you to a parent-teacher meeting to discuss {student}'s learning and development.

The meeting will take place on {date} and will last about 20 minutes. If this time is not convenient, please let me know and I will arrange another slot.

Thank you, and I look forward to seeing you.

Kind regards,
{teacher}`,i:`Yth. {parent},

Saya ingin mengundang Anda ke pertemuan orang tua dan guru untuk membahas pembelajaran dan perkembangan {student}.

Pertemuan akan diadakan pada {date} dan berlangsung sekitar 20 menit. Jika waktunya kurang cocok, kabari saya dan akan saya atur jadwal lain.

Terima kasih, saya menantikan kehadiran Anda.

Hormat saya,
{teacher}`},
{t:"Menjadwal ulang pertemuan",l:"B2",s:"Request to reschedule our meeting",e:`Dear {parent},

I am sorry to inform you that I need to reschedule our meeting planned for {date}, due to an unexpected school commitment.

Could we find a more convenient time this week? Please let me know which days suit you best. I apologise for any inconvenience this may cause.

Thank you for your understanding.

Kind regards,
{teacher}`,i:`Yth. {parent},

Mohon maaf, saya harus menjadwal ulang pertemuan kita pada {date} karena ada keperluan sekolah yang mendadak.

Bisakah kita cari waktu yang lebih cocok minggu ini? Mohon kabari hari yang paling sesuai untuk Anda. Saya minta maaf atas ketidaknyamanannya.

Terima kasih atas pengertiannya.

Hormat saya,
{teacher}`},
{t:"Menanyakan murid yang tidak hadir",l:"B2",s:"Checking in about {student}",e:`Dear {parent},

I noticed that {student} was absent from school on {date}. I hope everything is alright.

Please let me know if {student} needs extra time to catch up on any missed work. I will share the materials and support them once they are back in class.

Take care, and I wish {student} a speedy recovery.

Kind regards,
{teacher}`,i:`Yth. {parent},

Saya melihat {student} tidak hadir di sekolah pada {date}. Semoga semuanya baik-baik saja.

Kabari saya jika {student} butuh waktu tambahan untuk mengejar tugas yang tertinggal. Saya akan membagikan materinya dan membantu setelah ia kembali ke kelas.

Jaga kesehatan, semoga {student} lekas pulih.

Hormat saya,
{teacher}`},
{t:"Pengingat formulir atau tugas",l:"B2",s:"Friendly reminder",e:`Dear {parent},

This is a friendly reminder that the permission form for the upcoming school trip is due on {date}.

Please return the signed form with {student} at your earliest convenience. If you have any concerns, feel free to contact me.

Thank you for your cooperation.

Kind regards,
{teacher}`,i:`Yth. {parent},

Ini pengingat bahwa formulir izin untuk kegiatan sekolah mendatang harus dikumpulkan pada {date}.

Mohon kirimkan formulir yang sudah ditandatangani bersama {student} secepatnya. Jika ada kekhawatiran, silakan hubungi saya.

Terima kasih atas kerja samanya.

Hormat saya,
{teacher}`},
{t:"Pengumuman acara (guru PIC)",l:"C1",s:"Announcement: upcoming learning exhibition",e:`Dear Parents and Guardians,

As the person in charge of this event, I am pleased to announce our upcoming learning exhibition on {date}.

Students will present the projects they have been working on. We warmly welcome you to attend and celebrate their efforts. Please confirm your attendance by replying to this message by the end of the week.

Thank you for your continued support.

Kind regards,
{teacher}
Person in charge`,i:`Yth. Orang Tua dan Wali Murid,

Sebagai penanggung jawab acara ini, dengan senang hati saya umumkan pameran belajar kami pada {date}.

Murid-murid akan mempresentasikan projek yang mereka kerjakan. Kami mengundang Anda hadir dan merayakan usaha mereka. Mohon konfirmasi kehadiran dengan membalas pesan ini paling lambat akhir minggu.

Terima kasih atas dukungan Anda.

Hormat saya,
{teacher}
Penanggung jawab`},
{t:"Notulen rapat koordinasi (guru PIC)",l:"C1",s:"Minutes of the coordination meeting",e:`Dear team,

Thank you for attending the meeting on {date}. Below is a summary of what we agreed.

1. We will finalise the assessment schedule by the end of this week.
2. Each teacher will update their learning plans before the next meeting.
3. I will follow up with the parents regarding the event.

Please let me know if I have missed anything. The next meeting will be confirmed soon.

Best regards,
{teacher}
Person in charge`,i:`Yth. Tim,

Terima kasih sudah hadir pada rapat tanggal {date}. Berikut ringkasan kesepakatan kita.

1. Kita akan menyelesaikan jadwal penilaian paling lambat akhir minggu ini.
2. Setiap guru memperbarui rencana pembelajarannya sebelum rapat berikutnya.
3. Saya akan menindaklanjuti ke orang tua terkait acara.

Kabari saya jika ada yang terlewat. Rapat berikutnya akan segera dikonfirmasi.

Salam,
{teacher}
Penanggung jawab`}
];
const esc=t=>t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const plain=t=>t.replace(/\{(\w+)\}/g,(m,k)=>F[k]||"["+LBL[k]+"]");
const fill=t=>esc(t).replace(/\{(\w+)\}/g,(m,k)=>F[k]?`<mark>${esc(F[k])}</mark>`:`<mark class="ph">[${LBL[k]}]</mark>`);
function copy(t){const ok=()=>toast("Tersalin ke papan klip");const fb=()=>{const a=document.createElement("textarea");a.value=t;document.body.appendChild(a);a.select();try{document.execCommand("copy");ok()}catch(e){toast("Gagal menyalin")}a.remove()};try{navigator.clipboard.writeText(t).then(ok,fb)}catch(e){fb()}}
function tpl(){
 view.innerHTML=`<p class="sub" style="margin-bottom:10px">Isi data di bawah dan template ikut berubah. Baca keras-keras dan tulis ulang dengan kata-katamu sendiri sebagai latihan.</p><div class="fields">${Object.keys(LBL).map(k=>`<input class="search" data-f="${k}" placeholder="${LBI[k]}" aria-label="${LBI[k]}">`).join("")}</div><div id="tpls"></div>`;
 view.querySelectorAll("[data-f]").forEach(i=>i.value=F[i.dataset.f]);tpls();
}
function tpls(){$("#tpls").innerHTML=TP.map((t,n)=>`<article class="tp"><div class="tph"><span>${t.t}</span><span class="tag2">${t.l}</span></div><div class="subj">Subject: ${fill(t.s)}</div><div class="body">${fill(t.e)}</div>${tr[n]?`<div class="idn">${fill(t.i)}</div>`:""}<div class="acts3"><button class="btn" data-a="copy" data-n="${n}">Salin</button><button class="btn" data-a="tsay" data-n="${n}">🔊 Dengar</button><button class="btn" data-a="ttr" data-n="${n}">${tr[n]?"Tutup arti":"Lihat arti"}</button></div></article>`).join("")}
