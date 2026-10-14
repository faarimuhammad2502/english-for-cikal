const GR=[
["A2","She ___ to work by bus every day.","go;goes;going;gone",1],
["A2","We ___ football yesterday.","play;plays;played;playing",2],
["A2","There aren't ___ chairs in the room.","some;any;a;much",1],
["A2","My brother is taller ___ me.","than;then;as;that",0],
["B1","If it rains tomorrow, we ___ at home.","stay;will stay;would stay;stayed",1],
["B1","I have lived here ___ 2019.","for;since;from;during",1],
["B1","She asked me where I ___.","live;lived;lives;living",1],
["B1","This is the book ___ I told you about.","who;what;which;whose",2],
["B2","I wish I ___ more time to prepare yesterday.","have;had;had had;would have",2],
["B2","By next June, she ___ here for ten years.","will work;will have worked;works;has worked",1],
["B2","He suggested ___ the meeting until Monday.","to postpone;postponing;postpone;postponed",1],
["B2","Not only ___ late, but he also forgot the documents.","he arrived;did he arrive;he did arrive;arrived he",1],
["C1","Had I known about the delay, I ___ earlier.","would leave;would have left;will leave;had left",1],
["C1","The report, ___ conclusions were controversial, was published last week.","which;whose;that;whom",1],
["C1","Much as I admire her work, I ___ with her approach.","disagree;disagreeing;to disagree;disagreed",0],
["C1","It is high time the school ___ its policy on homework.","reviews;reviewed;will review;is reviewing",1],
["C2","Seldom ___ such a thoughtful response from a student.","I have received;have I received;I received;did I received",1],
["C2","___ the circumstances, the team performed admirably.","Given;Giving;To give;Gave",0],
["C2","She would sooner resign ___ compromise her principles.","than;to;from;that",0],
["C2","The proposal was rejected on the ___ that it lacked funding.","grounds;grounding;grounded;grounder",0]];
const PS=["Last week our school organised a science fair. Students worked in groups to build simple machines, and parents were invited to see the results. Although some projects did not work at first, the students kept trying. At the end, the teacher said that learning from mistakes was more important than winning a prize.",
"Many schools are now rethinking homework. Research suggests that too much homework can increase stress without improving results, especially for younger children. Some teachers therefore set fewer but more meaningful tasks, such as short projects linked to real life. Critics argue, however, that this approach may widen the gap between students who receive support at home and those who do not.",
"Although feedback is widely regarded as central to learning, its impact varies considerably. Studies indicate that comments focused on the task are more effective than those praising the learner as a person, since the latter can inadvertently undermine motivation when progress stalls. Nevertheless, even well-crafted feedback is of limited value unless students are given time and opportunity to act upon it."];
const RD=[
["B1",0,"What did parents do at the science fair?","They helped build the machines;They visited to see the results;They won prizes;They judged the projects",1],
["B1",0,"What was the teacher's main message?","Learning from mistakes matters more than winning;Winning is the most important thing;Parents should help more;Machines are too difficult",0],
["B2",1,"What does research suggest about homework?","It always improves results;Too much can raise stress without better results;Young children need more of it;Stress helps students learn",1],
["B2",1,"What concern do critics have?","The tasks become too easy;It may increase inequality between students;It reduces teachers' workload;It removes projects from lessons",1],
["C1",2,"Why can praising the learner as a person be a problem?","It is too detailed;It may reduce motivation when progress slows;It focuses on the task;It is rarely given",1],
["C1",2,"What does the writer imply in the final sentence?","Feedback should be short;Feedback only works if students can act on it;Feedback is unnecessary;Teachers give too much feedback",1]];
const LS=[
["A2","The meeting starts at half past nine, so please do not be late.","When does the meeting start?","At nine o'clock;At half past nine;At half past ten;At ten o'clock",1],
["B1","I'm afraid the teacher is away today, so a substitute will take your class and collect your homework tomorrow.","Who will teach the class today?","The principal;A substitute teacher;The parents;The students",1],
["B1","Please remember that the school trip form must be returned by Friday, otherwise your child cannot join.","What happens if the form is late?","The child cannot join;The trip is cancelled;The child pays extra;Nothing happens",0],
["B2","We were going to hold the parent meeting on Tuesday, but because several teachers are on a training course, we have moved it to Thursday evening.","Why was the meeting moved?","It was raining;Teachers are at a training course;Parents asked for it;The room was unavailable",1],
["B2","Although the results were encouraging overall, the data show that reading scores in the youngest group have barely improved since last term.","What is true about the youngest group?","Scores improved greatly;Scores have hardly changed;Scores dropped;There is no data",1],
["C1","Rather than imposing a single solution, the coordinator proposed that each team trial its own approach for a month and then compare outcomes.","What did the coordinator propose?","One solution for everyone;Each team tries its own approach then compares;Postponing the project;Hiring a consultant",1]];
const SEC={v:"Kosakata",g:"Tata bahasa",r:"Membaca",l:"Menyimak"},TL=["A2","B1","B2","C1","C2"];
let ts=null,TH=[];
try{TH=JSON.parse(localStorage.getItem(KEY+"-tests")||"[]")||[]}catch(e){}
function buildTest(){const qs=[];
 TL.forEach(l=>{shuf(ALL.filter(w=>lvOf(w)===l&&!isS(w)&&!w.my)).slice(0,2).forEach(w=>{const o=shuf([w.id,...shuf(ALL.filter(x=>x.id!==w.id&&!isS(x)&&!x.my)).slice(0,3).map(x=>x.id)]);qs.push({l,s:"v",q:`Apa arti "${w.en}"?`,o,a:o.indexOf(w.id)})})});
 GR.forEach(g=>qs.push({l:g[0],s:"g",q:g[1],o:g[2].split(";"),a:g[3]}));
 RD.forEach(r=>qs.push({l:r[0],s:"r",q:r[2],o:r[3].split(";"),a:r[4],p:PS[r[1]]}));
 LS.forEach(x=>qs.push({l:x[0],s:"l",q:x[2],o:x[3].split(";"),a:x[4],au:x[1]}));
 return qs}
const pc=a=>a[1]?Math.round(a[0]/a[1]*100):0;
const tbar=(n,v)=>`<div class="tb"><span>${n}</span><div class="bar"><i style="width:${v}%"></i></div><b>${v}%</b></div>`;
function hist(){return TH.length?`<div class="tcard"><h4>Riwayat tes</h4><div class="list">${TH.slice(-5).reverse().map(h=>`<div class="li"><div class="w"><b>${esc(String(h.d))}</b><span>Perkiraan ${esc(String(h.est))} · skor ${esc(String(h.tot))}%</span></div></div>`).join("")}</div></div>`:""}
function finish(){
 const pl={},ps={v:[0,0],g:[0,0],r:[0,0],l:[0,0]};TL.forEach(l=>pl[l]=[0,0]);let ok=0;
 ts.qs.forEach((q,n)=>{const c=ts.ans[n]===q.a?1:0;ok+=c;pl[q.l][0]+=c;pl[q.l][1]++;ps[q.s][0]+=c;ps[q.s][1]++});
 let est="A1";for(const l of TL){if(pl[l][1]&&pl[l][0]/pl[l][1]>=.6)est=l;else break}
 ts.res={est,pl,ps,tot:Math.round(ok/ts.qs.length*100)};
 TH.push({d:dstr(0),est,tot:ts.res.tot,ps:{v:pc(ps.v),g:pc(ps.g),r:pc(ps.r),l:pc(ps.l)}});TH=TH.slice(-10);
 try{localStorage.setItem(KEY+"-tests",JSON.stringify(TH))}catch(e){}
 xp(30)}
function tst(){
 if(!ts){
  view.innerHTML=`<div class="tcard"><h3>Tes Level Bahasa Inggris</h3><p>Format mengikuti gaya ujian Cambridge: kosakata, tata bahasa (<i>Use of English</i>), membaca, dan menyimak. Ada ${buildTest().length} soal pilihan ganda, sekitar 20 sampai 25 menit. Kunci jawaban baru muncul setelah tes selesai, dan rekaman menyimak hanya bisa diputar 2 kali, seperti ujian sungguhan.</p><p class="sub">Catatan: ini tes latihan untuk memandu belajar. Hasilnya perkiraan level, bukan sertifikat CEFR resmi, dan belum menguji menulis dan berbicara.</p><div class="center" style="margin-top:14px"><button class="btn pri" data-a="tstart" style="padding:14px 28px">Mulai tes</button></div></div>`+hist();return}
 const T=ts.qs.length;
 if(ts.i>=T){
  const r=ts.res,e=r.est,nx=e==="A1"?"A2":TL[Math.min(TL.indexOf(e)+1,4)],oi=TL.indexOf(e);
  const goal=oi<2?`Target minimal B2 belum tercapai. Fokus berikutnya: level ${nx}.`:oi===2?"Target minimal B2 tercapai. Lanjutkan ke C1 untuk target ideal.":"Target ideal C1 sudah tercapai. Pertahankan dengan latihan rutin.";
  const wk=Object.keys(r.ps).sort((a,b)=>pc(r.ps[a])-pc(r.ps[b]))[0],tip={v:"ulangi kosakata di tab Ulang dan latih di tab Latihan.",g:"latih Isi kalimat dan Susun kalimat di tab Latihan.",r:"baca template di tab Template dan jelaskan isinya dengan kata-katamu.",l:"dengarkan kata dan kalimat dengan tombol suara, lalu tirukan."}[wk];
  const pv=TH.length>1?TH[TH.length-2]:null,d=pv?r.tot-pv.tot:null;
  view.innerHTML=`<div class="tcard center"><small>Perkiraan level</small><div class="score">${e==="A1"?"A1":e}</div><p>${e==="A1"?"Di bawah A2. Mulai dari tema level A2.":goal}</p>${d!==null?`<p class="sub">Skor ${r.tot}% (${d>=0?"naik":"turun"} ${Math.abs(d)} poin dari tes sebelumnya)</p>`:`<p class="sub">Skor ${r.tot}%</p>`}</div>
  <div class="tcard"><h4>Per bagian</h4>${Object.keys(r.ps).map(k=>tbar(SEC[k],pc(r.ps[k]))).join("")}</div>
  <div class="tcard"><h4>Per level</h4>${TL.map(l=>tbar(l,pc(r.pl[l]))).join("")}</div>
  <div class="tcard"><h4>Saran belajar</h4><p>Bagian terlemah: ${SEC[wk]} (${pc(r.ps[wk])}%). Sarannya, ${tip}</p><div class="center"><button class="btn pri" data-a="tfocus" data-l="${nx}">Pelajari tema level ${nx}</button></div></div>`+hist()+`<div class="center"><button class="btn" data-a="tagain">Ulangi tes</button></div>`;
  return}
 const q=ts.qs[ts.i];
 view.innerHTML=`<div class="bar"><i style="width:${ts.i/T*100}%"></i></div><div class="meta"><span>Bagian: ${SEC[q.s]}</span><span>Soal ${ts.i+1} dari ${T}</span></div>${q.p?`<div class="passage">${q.p}</div>`:""}${q.au?`<div class="center" style="margin:8px 0"><button class="say big" data-a="tplay" ${ts.plays>=2?"disabled":""}>🔊 Putar rekaman (sisa ${2-ts.plays}x)</button></div>`:""}<div class="q">${q.q}</div><div class="opts">${q.o.map((o,j)=>`<button class="opt ${ts.sel===j?"sel":""}" data-a="tpick" data-k="${j}">${o}</button>`).join("")}</div><div class="center" style="margin-top:14px"><button class="btn pri" data-a="tnext" ${ts.sel===null?"disabled":""}>${ts.i+1===T?"Selesai":"Lanjut"}</button></div>`;
}
