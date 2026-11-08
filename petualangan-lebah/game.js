/* =====================================================================
   PETUALANGAN LEBAH - MISI PENYERBUKAN   (game.js)
   Suara dikelola di file  voice.js  (bisa kamu ubah sendiri).
   ===================================================================== */
const D={
 "lbl": {
  "ks": {
   "src": "assets/labels/ks.png",
   "w": 442,
   "h": 107
  },
  "mb": {
   "src": "assets/labels/mb.png",
   "w": 609,
   "h": 119
  },
  "kp": {
   "src": "assets/labels/kp.png",
   "w": 496,
   "h": 108
  },
  "ss": {
   "src": "assets/labels/ss.png",
   "w": 449,
   "h": 103
  }
 },
 "peach": "#f9ce7b",
 "tray": [
  {
   "key": "hewan",
   "x": 163,
   "y": 767,
   "w": 326,
   "h": 243,
   "src": "assets/tray/hewan.jpg"
  },
  {
   "key": "angin",
   "x": 563,
   "y": 791,
   "w": 319,
   "h": 238,
   "src": "assets/tray/angin.jpg"
  },
  {
   "key": "manusia",
   "x": 969,
   "y": 798,
   "w": 299,
   "h": 223,
   "src": "assets/tray/manusia.jpg"
  },
  {
   "key": "air",
   "x": 1355,
   "y": 822,
   "w": 314,
   "h": 176,
   "src": "assets/tray/air.jpg"
  }
 ],
 "words": [
  [
   613,
   820,
   228,
   39
  ],
  [
   942,
   825,
   101,
   30
  ],
  [
   1143,
   820,
   135,
   30
  ]
 ],
 "img": {
  "1": "assets/images/1.jpg",
  "2": "assets/images/2.jpg",
  "3": "assets/images/3.jpg",
  "4": "assets/images/4.jpg",
  "5": "assets/images/5.jpg",
  "6": "assets/images/6.jpg",
  "7": "assets/images/7.jpg",
  "8": "assets/images/8.jpg",
  "9": "assets/images/9.jpg",
  "10": "assets/images/10.jpg",
  "11": "assets/images/11.jpg",
  "12": "assets/images/12.jpg",
  "13": "assets/images/13.jpg",
  "14": "assets/images/14.jpg",
  "15": "assets/images/15.jpg"
 }
};
const IMG=D.img,$=s=>document.querySelector(s),st=$('#stage'),ui=$('#ui'),bg=$('#bg');
const MAX=17; /* total skor maksimal */
let S=1,cur=1,score={},best=0;
try{best=+localStorage.getItem('lebah_best')||0}catch(e){}
function fit(){const r=$('#wrap').getBoundingClientRect();S=Math.min(r.width/1920,r.height/1080);st.style.transform=`translate(${(r.width-1920*S)/2}px,${(r.height-1080*S)/2}px) scale(${S})`}
addEventListener('resize',fit);fit();
$('#fs').onclick=()=>{try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(e){}};
Object.values(IMG).forEach(s=>{const i=new Image();i.src=s});

/* ===== suara ===== */
let AC,curAudio=null;
function tone(f,d,t='sine',v=.15,at=0){try{AC=AC||new(window.AudioContext||window.webkitAudioContext)();const o=AC.createOscillator(),g=AC.createGain(),T=AC.currentTime+at;o.type=t;o.frequency.value=f;g.gain.setValueAtTime(v,T);g.gain.exponentialRampToValueAtTime(.001,T+d);o.connect(g);g.connect(AC.destination);o.start(T);o.stop(T+d)}catch(e){}}
const sfx={ok(){[523,659,784,1047].forEach((f,i)=>tone(f,.25,'triangle',.18,i*.1))},no(){tone(220,.3,'sawtooth',.1);tone(160,.4,'sawtooth',.1,.15)},tap(){tone(660,.08,'square',.05)}};
function stopVoice(){try{speechSynthesis.cancel()}catch(e){}if(curAudio){curAudio.onerror=null;curAudio.pause();curAudio=null}}
function tts(t){try{const u=new SpeechSynthesisUtterance(t);u.lang=VOICE_SETTINGS.bahasa;u.rate=VOICE_SETTINGS.kecepatan;const v=speechSynthesis.getVoices().find(v=>v.lang.replace('_','-').toLowerCase().startsWith(VOICE_SETTINGS.bahasa.slice(0,2)));if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}}
function vtext(key,vars){let t=(VOICE[key]||{}).text||'';for(const k in vars||{})t=t.replace('{'+k+'}',vars[k]);return t}
function voice(key,vars){if(!VOICE_SETTINGS.suaraAktif||!VOICE[key])return;stopVoice();const text=vtext(key,vars),f=VOICE[key].file;
 if(!f){tts(text);return}
 const a=new Audio('assets/audio/'+f);curAudio=a;let used=0;const fb=()=>{if(!used&&curAudio===a){used=1;curAudio=null;tts(text)}};a.onerror=fb;a.play().catch(fb)}

/* ===== helper ===== */
function el(c,x,y,w,h,html='',p=ui){const d=document.createElement('div');d.className=c;Object.assign(d.style,{left:x+'px',top:y+'px',width:w+'px',height:h+'px'});d.innerHTML=html;p.appendChild(d);return d}
function hs(x,y,w,h,fn){const d=el('hs',x,y,w,h);d.onclick=()=>{sfx.tap();fn(d)};return d}
/* kotak teks: ukuran huruf otomatis mengecil supaya tidak keluar dari kotak */
function banner(x,y,w,h,text,fs=36){const d=el('banner',x,y,w,h,'<span>'+text+'</span>');d.style.whiteSpace='nowrap';let f=fs;d.style.fontSize=f+'px';const sp=d.firstChild;while(sp.offsetWidth>w-90&&f>14){f--;d.style.fontSize=f+'px'}return d}
function toast(m,ok){const t=$('#toast');t.textContent=m;t.className=(ok?'ok':'no')+' show';clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),2600)}
function total(){return Object.values(score).reduce((a,b)=>a+b,0)}
function chrome(next){hs(17,27,115,115,()=>go(2));if(next)hs(1794,27,115,115,()=>go(next))}
function arrows(p,n){hs(466,287,70,70,()=>go(p));hs(1373,287,70,70,()=>go(n))}
function spk(x,y,key){const d=el('spk',x,y,74,74,'🔊');d.onclick=()=>{tone(880,.06,'square',.05);voice(key)}}
function panel(h,w,hh){return el('panel',(1920-w)/2,(1080-hh)/2,w,hh,h)}
function go(n){cur=n;stopVoice();ui.innerHTML='';bg.src=IMG[n]||IMG[9];ui.style.animation='none';void ui.offsetWidth;ui.style.animation='';(SC[n]||(()=>{}))()}
function later(key){setTimeout(()=>voice(key),500)}
const stagePt=e=>{const r=st.getBoundingClientRect();return[(e.clientX-r.left)/S,(e.clientY-r.top)/S]};

/* ===== seret & lepas ===== */
function place(d,x,y){d._x=x;d._y=y;d.style.left=x+'px';d.style.top=y+'px'}
function mkChip(html,x,y,w,h,key,cls='chip'){const d=el(cls,x,y,w,h,html);d._x=x;d._y=y;d._hx=x;d._hy=y;d.dataset.k=key;return d}
function makeDrag(d,cb){let sx,sy,ox,oy;
 d.onpointerdown=e=>{if(d.classList.contains('done'))return;d.setPointerCapture(e.pointerId);sx=e.clientX;sy=e.clientY;ox=d._x;oy=d._y;d.classList.add('mv');tone(520,.06,'square',.05)};
 d.onpointermove=e=>{if(d.hasPointerCapture(e.pointerId))place(d,ox+(e.clientX-sx)/S,oy+(e.clientY-sy)/S)};
 d.onpointerup=()=>{if(!d.classList.contains('mv'))return;d.classList.remove('mv');if(!cb(d))place(d,d._hx,d._hy)}}
function match(k,chips,T,okKeys,fit){let got=0,pts=0;
 chips.forEach(d=>makeDrag(d,()=>{const cx=d._x+d.offsetWidth/2,cy=d._y+d.offsetHeight/2;
  const t=T.find(t=>!t.taken&&cx>t.x-40&&cx<t.x+t.w+40&&cy>t.y-40&&cy<t.y+t.h+40);
  if(!t)return false;
  if(t.key===d.dataset.k){t.taken=1;sfx.ok();if(fit){const w=t.w-14;d.style.width=w+'px';d.style.height=w*d._ar+'px'}
   place(d,t.x+t.w/2-d.offsetWidth/2,t.y+t.h/2-d.offsetHeight/2);d.classList.add('done');if(!d._w)pts++;got++;score[k]=pts;
   const key=got==chips.length?'selesai':okKeys[d.dataset.k];toast(vtext(key),1);voice(key);return true}
  d._w=1;sfx.no();toast(vtext('salah'),0);voice('salah');return false}))}
function quiz(k,rects,right,okKey){let done=0,wrong=0;
 rects.forEach((r,i)=>{const h=hs(r[0],r[1],r[2],r[3],()=>{if(done||h.dataset.x)return;
  if(i===right){done=1;h.classList.add('good');sfx.ok();if(!wrong)score[k]=1;toast(vtext('benar'),1);voice(okKey)}
  else{wrong=1;h.dataset.x=1;h.classList.add('bad');sfx.no();toast(vtext('salah'),0);voice('salah')}})})}

/* ===== layar ===== */
const BEE=`<svg viewBox="0 0 170 150" width="170" height="150"><ellipse cx="60" cy="48" rx="30" ry="44" fill="#d9f2ff" stroke="#7fb9d6" stroke-width="3" opacity=".9" transform="rotate(-25 60 48)"/><ellipse cx="110" cy="48" rx="30" ry="44" fill="#d9f2ff" stroke="#7fb9d6" stroke-width="3" opacity=".9" transform="rotate(25 110 48)"/><ellipse cx="85" cy="92" rx="52" ry="40" fill="#ffd23f" stroke="#3b2410" stroke-width="5"/><path d="M62 58q-12 34 0 68M108 58q12 34 0 68" stroke="#3b2410" stroke-width="13" fill="none"/><circle cx="68" cy="86" r="6" fill="#3b2410"/><circle cx="102" cy="86" r="6" fill="#3b2410"/><path d="M73 102q12 11 24 0" stroke="#3b2410" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M72 54q-6-20-18-24M98 54q6-20 18-24" stroke="#3b2410" stroke-width="4" fill="none"/><circle cx="53" cy="29" r="5" fill="#3b2410"/><circle cx="117" cy="29" r="5" fill="#3b2410"/><g class="pol"><circle cx="58" cy="132" r="9" fill="#ff9f1c" stroke="#b86a00" stroke-width="2"/><circle cx="85" cy="138" r="9" fill="#ff9f1c" stroke="#b86a00" stroke-width="2"/><circle cx="112" cy="132" r="9" fill="#ff9f1c" stroke="#b86a00" stroke-width="2"/></g></svg>`;
const SC={};
SC[1]=()=>{chrome();hs(754,705,420,170,()=>go(2))};
SC[2]=()=>{hs(17,27,115,115,()=>go(1));const Y=[222,406,570,739],X=892,W=764,H=150;
 hs(X,Y[0],W,H,()=>go(3));hs(X,Y[1],W,H,()=>go(7));
 hs(X,Y[2],W,H,()=>{const b=best?`<div class="stars">${'⭐'.repeat(best>=13?3:best>=9?2:1)}</div><p>Skor terbaikmu: <b>${best} / ${MAX}</b></p>`:'<p style="margin-top:60px">Belum ada pencapaian.<br>Ayo main dulu!</p>';
  const p=panel('<h2>🏆 Pencapaian</h2>'+b+'<div class="btn">Tutup</div>',1000,620);p.querySelector('.btn').onclick=()=>p.remove()});
 hs(X,Y[3],W,H,()=>{const p=panel('<h2>❓ Petunjuk</h2><ol><li>Pilih <b>Belajar</b> untuk mempelajari bunga.</li><li>Pilih <b>Bermain</b> untuk latihan &amp; kuis.</li><li>Seret label atau gambar ke tempat yang tepat.</li><li>Tekan tombol 🔊 atau ▶ untuk mendengarkan suara.</li><li>Tekan ⛶ di pojok kiri bawah untuk layar penuh.</li></ol><div class="btn">Tutup</div>',1300,720);p.querySelector('.btn').onclick=()=>p.remove()})};
SC[3]=()=>{chrome();hs(739,712,416,148,()=>go(4))};
SC[4]=()=>{chrome();arrows(3,5)};
SC[5]=()=>{chrome();arrows(4,6);
 el('vid',520,335,880,495,'<iframe src="https://www.youtube.com/embed/tMnggE3SnUs?rel=0" title="Fungsi bagian bunga" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture;web-share" allowfullscreen style="width:100%;height:100%;border:6px solid #8a5a1e;border-radius:14px;box-sizing:border-box;background:#000"></iframe>');
 el('txt',520,838,880,130,'<div style="text-align:center;font-size:26px;line-height:1.4"><a href="https://youtu.be/tMnggE3SnUs" target="_blank" rel="noopener" style="color:#7a2d00">▶ Video tidak muncul? Buka di YouTube</a><br>Kepala sari: tempat serbuk sari • Kepala putik: menerima serbuk sari • Mahkota bunga: menarik serangga</div>')};
SC[6]=()=>{chrome(7);arrows(5,7)};
SC[7]=()=>{chrome();hs(739,712,416,148,()=>go(8))};
SC[8]=()=>{chrome(9);
 const L=D.lbl,cx=[330,760,1180,1590],order=['mb','ss','ks','kp'],chips=[];
 order.forEach((k,i)=>{const h=66,w=L[k].w*h/L[k].h;chips.push(mkChip(`<img src="${L[k].src}" style="width:100%;height:100%;display:block;pointer-events:none">`,cx[i]-w/2,918,w,h,k))});
 match('s8',chips,[{x:206,y:229,w:420,h:90,key:'ks'},{x:1273,y:184,w:420,h:90,key:'kp'},{x:1279,y:659,w:420,h:90,key:'mb'},{x:186,y:659,w:420,h:90,key:'ss'}],
  {ks:'s8_ks',kp:'s8_kp',mb:'s8_mb',ss:'s8_ss'});later('s8_start')};
SC[9]=()=>{chrome(10);
 const bee=el('bee',815,300,170,150,BEE);let s=0;const fly=(cx,cy,fn)=>{bee.style.left=cx-85+'px';bee.style.top=cy-75+'px';setTimeout(fn,1300)};
 banner(360,938,1200,92,'Klik bunga putih untuk mengambil serbuk sari, lalu klik bunga merah!');
 hs(132,243,335,342,()=>{if(s==1)return;if(s>=2){toast('Lebah sudah membawa serbuk sari!',0);return}s=1;fly(300,414,()=>{s=2;bee.classList.add('ld');tone(700,.15,'triangle',.15);toast(vtext('s9_ambil')+' 🐝',1);voice('s9_ambil')})});
 hs(1403,250,356,343,()=>{if(s<2){toast('Ambil serbuk sari dulu dari bunga putih ya!',0);return}if(s==3)return;s=3;fly(1581,421,()=>{bee.classList.remove('ld');el('spark',1500,290,150,120,'✨');el('spark',1640,380,150,120,'🌸');sfx.ok();score.s9=1;toast(vtext('s9_jatuh')+' 🌸',1);voice('s9_jatuh')})});
 later('s9_start')};
SC[10]=()=>{chrome(11);
 const chips=[],T=[['air',93,367],['hewan',533,356],['angin',972,346],['manusia',1411,346]].map(([key,x,y])=>({key,x,y,w:347,h:347}));
 D.tray.forEach(t=>{el('patch',t.x-3,t.y-3,t.w+6,t.h+6).style.background=D.peach;
  const c=mkChip(`<img src="${t.src}" style="width:100%;height:100%;display:block;pointer-events:none;border-radius:8px">`,t.x,t.y,t.w,t.h,t.key);c._ar=t.h/t.w;chips.push(c)});
 match('s10',chips,T,{air:'s10_air',hewan:'s10_hewan',angin:'s10_angin',manusia:'s10_manusia'},1);later('s10_start')};
SC[11]=()=>{chrome(12);
 quiz('s11',[[490,526,940,64],[490,611,940,64],[490,696,940,64]],1,'q11_benar');later('q11')};
SC[12]=()=>{chrome(13);
 quiz('s12',[[397,570,330,190],[797,570,330,190],[1197,570,330,190]],0,'q12_benar');later('q12')};
SC[13]=()=>{chrome(14);const A=['Putik','Benang Sari','Mahkota Bunga'],Y=[515,654,792];
 A.forEach((a,i)=>el('txt opt',712,Y[i],515,110,a));
 quiz('s13',Y.map(y=>[815,y,412,110]),1,'q13_benar');
 Y.forEach((y,i)=>{const b=hs(712,y,100,110,()=>voice('q13_'+'abc'[i]));b.style.borderRadius='55px';b.style.zIndex=3});
 later('q13')};
SC[14]=()=>{chrome(15);
 const W=D.words,keys=['bs','pt','nk'],chips=[];
 W.forEach((w,i)=>{const p=el('patch',w[0]-12,w[1]-10,w[2]+24,w[3]+20);Object.assign(p.style,{backgroundImage:`url(${IMG[14]})`,backgroundSize:'1920px 1080px',backgroundPosition:`${-(w[0]-12)}px ${-(w[1]-10-95)}px`});
  chips.push(mkChip(['Benang Sari','Putik','Nektar'][i],w[0]-20,w[1]-14,w[2]+40,w[3]+26,keys[i],'chip tchip'))});
 match('s14',chips,[{x:1232,y:372,w:302,h:81,key:'bs'},{x:1232,y:473,w:302,h:81,key:'pt'},{x:1232,y:574,w:302,h:81,key:'nk'}],
  {bs:'s14_bs',pt:'s14_pt',nk:'s14_nk'});later('s14_start')};
/* Slide 15: tarik garis (gambar kiri -> jawaban kanan) */
SC[15]=()=>{chrome(17);
 banner(500,906,920,56,'Tarik garis dari titik gambar ke titik jawaban yang tepat',26);
 const NS='http://www.w3.org/2000/svg',svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 1920 1080');svg.setAttribute('class','lines');ui.appendChild(svg);
 const Lf=[{key:'sendiri',x:737,y:411},{key:'silang',x:747,y:720}],Rt=[{key:'silang',x:1177,y:415},{key:'sendiri',x:1177,y:720}];
 let n=0,pts=0;
 Lf.forEach(l=>{const z=el('hs dotz',l.x-62,l.y-62,124,124);let ln=null;
  z.onpointerdown=e=>{if(l.done)return;z.setPointerCapture(e.pointerId);tone(520,.06,'square',.05);ln=document.createElementNS(NS,'line');ln.setAttribute('x1',l.x);ln.setAttribute('y1',l.y);ln.setAttribute('x2',l.x);ln.setAttribute('y2',l.y);ln.setAttribute('class','ln');svg.appendChild(ln)};
  z.onpointermove=e=>{if(!ln)return;const[x,y]=stagePt(e);ln.setAttribute('x2',x);ln.setAttribute('y2',y)};
  z.onpointerup=e=>{if(!ln)return;const[x,y]=stagePt(e),r=Rt.find(r=>!r.done&&Math.hypot(r.x-x,r.y-y)<80);
   if(r&&r.key===l.key){l.done=r.done=1;ln.setAttribute('x2',r.x);ln.setAttribute('y2',r.y);ln.setAttribute('class','ln ok');sfx.ok();if(!l._w)pts++;n++;score.s15=pts;
    const k=n==2?'selesai':'s15_'+l.key;toast(vtext(k),1);voice(k)}
   else{l._w=1;const t=ln;t.setAttribute('class','ln bad');setTimeout(()=>t.remove(),450);sfx.no();toast(vtext('salah'),0);voice('salah')}
   ln=null}});
 later('s15_start')};
SC[17]=()=>{bg.src=IMG[1];const t=total(),n=t>=13?3:t>=9?2:1;
 if(t>best){best=t;try{localStorage.setItem('lebah_best',best)}catch(e){}}
 const p=panel(`<h2>🎉 Selamat!</h2><p style="margin:0">Kamu sudah membantu lebah melakukan penyerbukan.</p><div class="stars">${'⭐'.repeat(n)}${'☆'.repeat(3-n)}</div><p style="margin:0">Skormu: <b>${t} / ${MAX}</b></p><div class="btn" id="again">Main Lagi</div><div class="btn" id="menu">Menu</div>`,1100,640);p.style.top='350px';
 p.querySelector('#again').onclick=()=>{score={};go(8)};p.querySelector('#menu').onclick=()=>go(2);sfx.ok();voice('hasil',{skor:t,maks:MAX})};
go(1);