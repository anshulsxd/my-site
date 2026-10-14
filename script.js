(function(){
var $=function(s,c){return(c||document).querySelector(s)},$$=function(s,c){return Array.from((c||document).querySelectorAll(s))};
var rm=matchMedia('(prefers-reduced-motion:reduce)').matches,fine=matchMedia('(hover:hover)').matches;
var root=document.documentElement,body=document.body;

// loader
var pct=$('#pct'),bar=$('#bar'),L=$('#loader');
function boot(){L.classList.add('done');body.classList.remove('ld');scr($('#name'))}
if(rm){boot()}else{var v=0,iv=setInterval(function(){v+=Math.random()*9+3;if(v>=100){v=100;clearInterval(iv);setTimeout(boot,250)}pct.textContent=Math.floor(v)+'%';bar.style.width=v+'%'},60)}

// accent
var cols=['#9db4ff','#f0b27a','#8fd6a9','#c4a1ff'],ci=0;
function acc(i){ci=i;root.style.setProperty('--a',cols[i])}
$$('.dots button').forEach(function(b){b.onclick=function(){acc(+b.dataset.c)}});

// glow + progress + cursor
var mx=0,my=0,rx=0,ry=0;
addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY;root.style.setProperty('--mx',mx+'px');root.style.setProperty('--my',my+'px')});
addEventListener('scroll',function(){var h=root.scrollHeight-innerHeight;$('#prog').style.width=(h>0?scrollY/h*100:0)+'%'},{passive:true});
if(fine&&!rm){
  body.classList.add('cu');var d=$('.cd'),r=$('.cr');
  (function f(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;d.style.transform='translate('+mx+'px,'+my+'px)';r.style.transform='translate('+rx+'px,'+ry+'px)';requestAnimationFrame(f)})();
  document.addEventListener('mouseover',function(e){r.classList.toggle('h',!!e.target.closest('a,button,input,textarea,.card,li'))});
}

// scramble
var ch='!<>-_\\/[]{}=+*^?#01';
function scr(el,txt){
  txt=txt||el.dataset.scr;if(rm){el.textContent=txt;return}
  var f=0;clearInterval(el._t);
  el._t=setInterval(function(){
    el.textContent=txt.split('').map(function(c,i){return c===' '?' ':(i<f/2?c:ch[Math.random()*ch.length|0])}).join('');
    if(++f>txt.length*2+2){clearInterval(el._t);el.textContent=txt}
  },30);
}
// role typer
var roles=['student developer','python tinkerer','coding enthusiast','bug hunter'],ri=0,cc=0,del=false,rl=$('#role');
(function tick(){
  var w=roles[ri];cc+=del?-1:1;rl.textContent=w.slice(0,cc);var t=del?35:75;
  if(!del&&cc===w.length){del=true;t=1600}else if(del&&cc===0){del=false;ri=(ri+1)%roles.length;t=300}
  setTimeout(tick,rm?9999:t);
})();

// marquee clone
var mt=$('#mqt');mt.innerHTML+=mt.innerHTML;

// network background
var cv=$('#bg'),cx=cv.getContext('2d'),W,H,pts=[];
function rs(){W=cv.width=innerWidth;H=cv.height=innerHeight;pts=[];for(var i=0;i<Math.min(70,W*H/20000);i++)pts.push({x:Math.random()*W,y:Math.random()*H,vx:Math.random()-.5,vy:Math.random()-.5})}
addEventListener('resize',rs);rs();
(function dr(){
  cx.clearRect(0,0,W,H);var a=getComputedStyle(root).getPropertyValue('--a').trim();
  pts.forEach(function(p,i){
    if(!rm){p.x+=p.vx*.4;p.y+=p.vy*.4;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1}
    cx.fillStyle='rgba(190,194,204,.5)';cx.fillRect(p.x,p.y,2,2);
    for(var j=i+1;j<pts.length;j++){var q=pts[j],d=Math.hypot(p.x-q.x,p.y-q.y);if(d<120){cx.strokeStyle='rgba(150,154,165,'+(1-d/120)*.2+')';cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(q.x,q.y);cx.stroke()}}
    var dm=Math.hypot(p.x-mx,p.y-my);if(dm<160){cx.strokeStyle=a;cx.globalAlpha=(1-dm/160)*.6;cx.beginPath();cx.moveTo(p.x,p.y);cx.lineTo(mx,my);cx.stroke();cx.globalAlpha=1}
  });
  if(!rm)requestAnimationFrame(dr);
})();

// reveal, counters, skill bars
function count(b){var value=b.dataset.n,n=parseInt(value,10),suffix=value.slice(String(n).length);if(isNaN(n)){b.textContent=value;return}var s=performance.now();(function st(t){var p=Math.min((t-s)/1200,1);b.textContent=Math.round(n*p)+suffix;if(p<1)requestAnimationFrame(st)})(s)}
var io=new IntersectionObserver(function(es){es.forEach(function(e){
  if(!e.isIntersecting)return;var el=e.target;io.unobserve(el);
  el.style.transitionDelay=($$('.rv',el.parentElement).indexOf(el)*90)+'ms';el.classList.add('in');
  if(el.dataset.scr)scr(el);
  $$('[data-n]',el).forEach(count);
  $$('[data-w]',el).forEach(function(i){i.style.setProperty('--w',i.dataset.w+'%')});
  setTimeout(function(){el.style.transitionDelay='0ms'},1000);
})},{threshold:.2});
$$('.rv').forEach(function(el){io.observe(el)});

// project filters
$$('.flt button').forEach(function(b){b.onclick=function(){
  $$('.flt button').forEach(function(x){x.classList.remove('on')});b.classList.add('on');
  $$('[data-t]').forEach(function(c){c.classList.toggle('hide',b.dataset.f!=='all'&&c.dataset.t!==b.dataset.f)});
}});

// tilt + magnetic + ripple
if(fine&&!rm){
  $$('.tilt').forEach(function(c){
    c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      c.style.transform='perspective(700px) rotateX('+(-y*8)+'deg) rotateY('+(x*8)+'deg) translateY(-4px)';
      c.style.setProperty('--cx',(x+.5)*100+'%');c.style.setProperty('--cy',(y+.5)*100+'%')});
    c.addEventListener('mouseleave',function(){c.style.transform=''});
  });
  $$('.mag').forEach(function(b){
    b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.25)+'px '+((e.clientY-r.top-r.height/2)*.35)+'px'});
    b.addEventListener('mouseleave',function(){b.style.translate=''});
  });
}
$$('.btn').forEach(function(b){b.addEventListener('click',function(e){
  var r=b.getBoundingClientRect(),s=document.createElement('span'),d=Math.max(r.width,r.height)/2;
  s.className='rip';s.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px';
  b.appendChild(s);setTimeout(function(){s.remove()},650)})});

// toast + copy + Telegram DM form
var T=$('#toast');
function toast(m){T.textContent=m;T.classList.add('on');setTimeout(function(){T.classList.remove('on')},1800)}
function openDiscord(){window.open('https://discord.com/users/1256208119285940265','_blank','noopener,noreferrer')}
$('#discord').onclick=openDiscord;
$('#cf').onsubmit=function(e){e.preventDefault();
  var message=encodeURIComponent('Hello from '+$('#fn').value+'\n\n'+$('#fm').value);
  window.open('https://t.me/anshulsxd?text='+message,'_blank','noopener,noreferrer');toast('opening Telegram...')};

// command palette
var P=$('#pal'),pi=$('#pi'),pl=$('#pl'),sel=0,shown=[];
function go(id){return function(){var e=document.getElementById(id);if(e)e.scrollIntoView({behavior:rm?'auto':'smooth'})}}
var cmds=[
  ['go to home',go('home')],['go to about',go('about')],['go to projects',go('projects')],['go to journey',go('journey')],['go to contact',go('contact')],
  ['open discord',openDiscord],['open github',function(){window.open($('#gh').href,'_blank')}],
  ['next accent color',function(){acc((ci+1)%cols.length)}]
];
function draw(){
  var q=pi.value.toLowerCase();shown=cmds.filter(function(c){return c[0].indexOf(q)>-1});if(sel>=shown.length)sel=0;
  pl.innerHTML=shown.map(function(c,i){return '<li class="'+(i===sel?'s':'')+'" data-i="'+i+'">'+c[0]+'<span>↵</span></li>'}).join('')||'<li>no results</li>';
}
function op(o){P.classList.toggle('on',o);if(o){pi.value='';sel=0;draw();setTimeout(function(){pi.focus()},50)}}
function run(i){var c=shown[i];if(c){op(false);setTimeout(c[1],150)}}
$('#kbtn').onclick=function(){op(true)};
P.onclick=function(e){if(e.target===P)op(false)};
pl.onclick=function(e){var li=e.target.closest('li');if(li&&li.dataset.i)run(+li.dataset.i)};
pi.oninput=function(){sel=0;draw()};
addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();op(!P.classList.contains('on'));return}
  if(!P.classList.contains('on'))return;
  if(e.key==='Escape')op(false);
  else if(e.key==='ArrowDown'){e.preventDefault();sel=(sel+1)%shown.length;draw()}
  else if(e.key==='ArrowUp'){e.preventDefault();sel=(sel-1+shown.length)%shown.length;draw()}
  else if(e.key==='Enter'){e.preventDefault();run(sel)}
});
})();
