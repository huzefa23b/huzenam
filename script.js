const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
window.addEventListener("load",()=>setTimeout(()=>$("#loader").style.display="none",1700));

const canvas=$("#stars"),ctx=canvas.getContext("2d"); let stars=[];
function resize(){canvas.width=innerWidth;canvas.height=innerHeight;stars=Array.from({length:Math.min(180,Math.floor(innerWidth/7))},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.4+.2,v:Math.random()*.35+.05,a:Math.random()}))}
resize(); addEventListener("resize",resize);
function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);stars.forEach(s=>{s.y-=s.v;if(s.y<0)s.y=canvas.height;s.a+=.01;ctx.globalAlpha=.25+Math.abs(Math.sin(s.a))*.6;ctx.fillStyle="#fff";ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()});requestAnimationFrame(draw)}draw();

addEventListener("mousemove",e=>{$(".cursor-glow").style.left=e.clientX+"px";$(".cursor-glow").style.top=e.clientY+"px"});

$$("[data-scroll]").forEach(b=>b.onclick=()=>$(b.dataset.scroll).scrollIntoView({behavior:"smooth"}));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
$$(".reveal").forEach(e=>io.observe(e));

function toast(t){const x=$("#toast");x.textContent=t;x.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>x.classList.remove("show"),2500)}
$$(".star").forEach(s=>s.onclick=()=>{$("#modalText").textContent=s.dataset.msg;$("#modal").classList.add("open")});
$("#closeModal").onclick=()=>$("#modal").classList.remove("open");
$("#modal").onclick=e=>{if(e.target.id==="modal")$("#modal").classList.remove("open")};

let hold=0,timer=null;
const start=()=>{if(timer)return;$("#holdText").textContent="KEEP HOLDING ♥";timer=setInterval(()=>{hold+=1.8;$("#progress").style.strokeDashoffset=327-(327*hold/100);if(hold>=100){clearInterval(timer);timer=null;hold=0;$("#holdText").textContent="YOU DID IT ♥";heartRain();toast("Heart unlocked. ♥")} },40)};
const end=()=>{if(timer){clearInterval(timer);timer=null} if(hold<100){hold=Math.max(0,hold-4);$("#progress").style.strokeDashoffset=327-(327*hold/100)}};
$("#holdHeart").addEventListener("mousedown",start);$("#holdHeart").addEventListener("touchstart",e=>{e.preventDefault();start()});
["mouseup","mouseleave","touchend"].forEach(ev=>$("#holdHeart").addEventListener(ev,end));

function heartRain(){for(let i=0;i<55;i++){const h=document.createElement("div");h.textContent=Math.random()>.2?"♥":"✦";h.style.cssText=`position:fixed;z-index:70;left:${Math.random()*100}vw;top:-30px;color:${Math.random()>.5?"#ff5da9":"#b98cff"};font-size:${12+Math.random()*26}px;pointer-events:none;transition:transform ${2+Math.random()*2}s linear,opacity 3s`;document.body.appendChild(h);requestAnimationFrame(()=>{h.style.transform=`translateY(${innerHeight+80}px) rotate(${Math.random()*720-360}deg)`;h.style.opacity=0});setTimeout(()=>h.remove(),4500)}}

$("#surpriseBtn").onclick=()=>{$("#secretReveal").classList.add("show");heartRain();toast("Secret unlocked for Namira ♥")};
$("#topBtn").onclick=()=>scrollTo({top:0,behavior:"smooth"});

let audioCtx=null,osc=null,gain=null,playing=false;
$("#musicBtn").onclick=()=>{if(!audioCtx){audioCtx=new (window.AudioContext||window.webkitAudioContext)();osc=audioCtx.createOscillator();gain=audioCtx.createGain();osc.type="sine";osc.frequency.value=196;gain.gain.value=.0001;osc.connect(gain).connect(audioCtx.destination);osc.start()}
if(!playing){audioCtx.resume();gain.gain.exponentialRampToValueAtTime(.035,audioCtx.currentTime+.8);playing=true;$("#musicBtn").textContent="Ⅱ";toast("Ambient mode ON ♫")}else{gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.5);playing=false;$("#musicBtn").textContent="♫";toast("Ambient mode OFF")}};
let typed="";addEventListener("keydown",e=>{typed=(typed+e.key.toLowerCase()).slice(-6);if(typed==="namira"){heartRain();toast("Secret code accepted. ♥")}});
