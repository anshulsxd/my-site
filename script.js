(function(){
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- typing sequence ----
  var lines = [
    {p:'$ whoami', o:'Anshul Singh', cls:'out'},
    {p:'$ cat role.txt', o:'Student Developer · Python', cls:'out'},
    {p:'$ cat status.txt', o:'building things and breaking them since 2022', cls:'out small'}
  ];
  var body = document.getElementById('typedBody');

  function typeLine(rowEl, text, cb){
    var i = 0;
    if(reduceMotion){ rowEl.textContent = text; cb(); return; }
    var iv = setInterval(function(){
      rowEl.textContent = text.slice(0, i+1);
      i++;
      if(i >= text.length){ clearInterval(iv); cb(); }
    }, 26);
  }

  function runSequence(idx){
    if(idx >= lines.length){
      startRepl();
      return;
    }
    var def = lines[idx];
    var row = document.createElement('div');
    row.className = 'row';
    var promptSpan = document.createElement('span');
    promptSpan.className = 'prompt';
    row.appendChild(promptSpan);
    body.appendChild(row);

    typeLine(promptSpan, def.p, function(){
      var out = document.createElement('div');
      out.className = 'row ' + def.cls;
      body.appendChild(out);
      typeLine(out, def.o, function(){
        setTimeout(function(){ runSequence(idx+1); }, 260);
      });
    });
  }
  runSequence(0);

  // ---- interactive REPL ----
  var commands = {
    help: 'commands: about, projects, contact, whoami, skills, joke, clear',
    whoami: '[name] — student developer, professional overthinker of side projects.',
    about: '→ scrolling to about...',
    projects: '→ scrolling to projects...',
    contact: '→ scrolling to contact...',
    skills: 'python, [framework], [framework], [tool] — and whatever the next project demands.',
    joke: 'why do python devs wear glasses? because they can\'t C.',
    sudo: 'nice try. permission denied (this is a portfolio, not root access).'
  };

  function startRepl(){
    var line = document.createElement('div');
    line.className = 'row repl-line';
    line.innerHTML = '<span class="prompt">$</span> <input type="text" id="replInput" autocomplete="off" spellcheck="false" placeholder="type \'help\'" aria-label="terminal command input">';
    body.appendChild(line);
    var hint = document.createElement('div');
    hint.className = 'repl-hint';
    hint.textContent = 'this terminal actually works — try typing a command';
    body.appendChild(hint);

    var input = document.getElementById('replInput');
    if(!reduceMotion) input.focus({ preventScroll:true });

    input.addEventListener('keydown', function(e){
      if(e.key !== 'Enter') return;
      var val = input.value.trim().toLowerCase();
      if(val === '') return;

      var echoRow = document.createElement('div');
      echoRow.className = 'row';
      echoRow.innerHTML = '<span class="prompt">$</span> ' + val;
      line.before(echoRow);

      if(val === 'clear'){
        Array.from(body.querySelectorAll('.row, .repl-hint')).forEach(function(r){
          if(r !== line) r.remove();
        });
      } else if(commands[val]){
        var outRow = document.createElement('div');
        outRow.className = 'row out small';
        outRow.textContent = commands[val];
        line.before(outRow);
        if(['about','projects','contact'].indexOf(val) !== -1){
          setTimeout(function(){
            document.getElementById(val).scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'});
          }, 350);
        }
      } else {
        var errRow = document.createElement('div');
        errRow.className = 'row out small';
        errRow.textContent = 'command not found: ' + val + ' (try "help")';
        line.before(errRow);
      }
      input.value = '';
      body.scrollTop = body.scrollHeight;
    });
  }

  // ---- nav active state on scroll ----
  var sections = ['home','about','projects','contact'].map(function(id){ return document.getElementById(id); });
  var links = document.querySelectorAll('.nav-links a');
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        links.forEach(function(l){ l.classList.remove('active'); });
        var match = document.querySelector('.nav-links a[data-target="'+entry.target.id+'"]');
        if(match) match.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px' });
  sections.forEach(function(s){ if(s) io.observe(s); });

  // ---- section heading reveal (once, subtle fade) ----
  var heads = document.querySelectorAll('.sec-head');
  var io2 = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io2.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  heads.forEach(function(h){ io2.observe(h); });

  // ---- scroll progress bar ----
  var progressBar = document.getElementById('progressBar');
  function updateProgress(){
    var h = document.documentElement;
    var scrolled = h.scrollTop || document.body.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (scrolled / max) * 100 : 0;
    progressBar.style.width = pct + '%';
  }
  document.addEventListener('scroll', updateProgress, { passive:true });
  updateProgress();

  // ---- custom cursor ----
  if(!reduceMotion && window.matchMedia('(hover:hover)').matches){
    var dot = document.getElementById('curDot');
    var ring = document.getElementById('curRing');
    var rx = 0, ry = 0, dx = 0, dy = 0;
    window.addEventListener('mousemove', function(e){
      dx = e.clientX; dy = e.clientY;
      dot.style.transform = 'translate('+dx+'px,'+dy+'px) translate(-50%,-50%)';
    });
    (function raf(){
      rx += (dx - rx) * 0.18;
      ry += (dy - ry) * 0.18;
      ring.style.transform = 'translate('+rx+'px,'+ry+'px) translate(-50%,-50%)';
      requestAnimationFrame(raf);
    })();
    var hoverables = document.querySelectorAll('a, button, input, .proj-item, .imports span');
    hoverables.forEach(function(el){
      el.addEventListener('mouseenter', function(){ ring.classList.add('hover'); });
      el.addEventListener('mouseleave', function(){ ring.classList.remove('hover'); });
    });
  }

  // ---- tilt on cards ----
  if(!reduceMotion && window.matchMedia('(hover:hover)').matches){
    document.querySelectorAll('.tilt').forEach(function(card){
      card.addEventListener('mousemove', function(e){
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'perspective(600px) rotateX(' + (py * -6) + 'deg) rotateY(' + (px * 6) + 'deg) translateY(-2px)';
      });
      card.addEventListener('mouseleave', function(){
        card.style.transform = '';
      });
    });
  }

  // ---- copy email ----
  var copyBtn = document.getElementById('copyEmailBtn');
  var toast = document.getElementById('toast');
  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function(){ toast.classList.remove('show'); }, 1800);
  }
  if(copyBtn){
    copyBtn.addEventListener('click', function(){
      var emailLink = document.getElementById('emailLink');
      var email = emailLink.getAttribute('href').replace('mailto:', '');
      if(navigator.clipboard){
        navigator.clipboard.writeText(email).then(function(){
          showToast('email copied to clipboard');
        }).catch(function(){
          showToast('couldn\'t copy — email it manually');
        });
      } else {
        showToast('copy not supported here');
      }
    });
  }
})();
