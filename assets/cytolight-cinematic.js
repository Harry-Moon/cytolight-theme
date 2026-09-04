(function () {
  'use strict';

  function init(root) {
    if (!root || root.dataset.cyInit === 'true') return;
    root.dataset.cyInit = 'true';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cinemas = Array.prototype.map.call(root.querySelectorAll('[data-cy-cinema]'), function (el) {
      var spectrum = el.querySelector('.cy-spectrum');
      return {
        el: el,
        targetProgress: 0,
        currentProgress: 0,
        hasMeasured: false,
        // Les libelles de longueur d'onde, quand la scene en porte une liste.
        // Le faisceau de couleur, lui, est entierement en CSS : il ne se
        // recolore pas, il glisse (voir .cy-cinema__beam).
        waves: spectrum ? Array.prototype.slice.call(spectrum.children) : [],
        currentWave: -1
      };
    });
    var raf = 0;
    var lastFrameTime = 0;

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function responsiveEase(value) {
      return 1 - Math.pow(1 - value, 3);
    }

    function smoothstep(value) {
      return value * value * (3 - 2 * value);
    }

    // Zoom finishes early (by ~45% of scroll through the pinned section),
    // eased out so it settles smoothly instead of drifting linearly.
    function zoomStep(value) {
      var t = clamp(value / 0.45, 0, 1);
      return responsiveEase(t);
    }

    // Red light glow only starts once the zoom has essentially finished,
    // then ramps in smoothly (no more instant jump between fixed steps).
    function lightStep(value) {
      var t = clamp((value - 0.45) / 0.45, 0, 1);
      return smoothstep(t);
    }

    function viewportHeight() {
      // window.innerHeight shifts as mobile browser chrome (address bar)
      // collapses/expands mid-scroll, which desyncs the progress calc from
      // the CSS 100svh the sections are actually laid out with and shows up
      // as a visible jump. visualViewport tracks the real visible height.
      return window.visualViewport ? window.visualViewport.height : window.innerHeight;
    }

    function measureCinema(scene) {
      if (!scene || !scene.el || reduceMotion) return;
      var rect = scene.el.getBoundingClientRect();
      var travel = Math.max(1, rect.height - viewportHeight());
      scene.targetProgress = clamp((0 - rect.top) / travel, 0, 1);
    }

    function renderCinema(now) {
      raf = 0;
      if (!cinemas.length || reduceMotion) return;
      var delta = lastFrameTime ? Math.min(48, now - lastFrameTime) : 16;
      lastFrameTime = now;
      var follow = 1 - Math.pow(0.001, delta / 180);
      var shouldContinue = false;
      cinemas.forEach(function (scene) {
        measureCinema(scene);
        if (!scene.hasMeasured) {
          scene.currentProgress = scene.targetProgress;
          scene.hasMeasured = true;
        }
        scene.currentProgress += (scene.targetProgress - scene.currentProgress) * follow;
        if (Math.abs(scene.targetProgress - scene.currentProgress) < 0.0007) {
          scene.currentProgress = scene.targetProgress;
        }
        scene.el.style.setProperty('--cy-p', scene.currentProgress.toFixed(4));
        scene.el.style.setProperty('--cy-pe', responsiveEase(scene.currentProgress).toFixed(4));
        scene.el.style.setProperty('--cy-zoom', zoomStep(scene.currentProgress).toFixed(4));
        scene.el.style.setProperty('--cy-light-step', lightStep(scene.currentProgress).toFixed(2));
        // Le neon suit le scroll : la longueur d'onde en cours passe au plein,
        // celles deja franchies restent en veilleuse, et la lumiere posee sur
        // l'image prend la couleur de la brique courante.
        //
        // Tout cela ne s'ecrit qu'aux changements d'indice — sept fois sur
        // toute la course, pas une fois par image. C'est ce qui permet a la
        // couleur d'etre une transition CSS sans repeindre le calque a chaque
        // frame.
        if (scene.waves.length > 1) {
          var index = Math.round(clamp(scene.currentProgress, 0, 1) * (scene.waves.length - 1));
          if (index !== scene.currentWave) {
            scene.waves.forEach(function (wave, i) {
              wave.classList.toggle('is-lit', i < index);
              wave.classList.toggle('is-current', i === index);
            });
            // La teinte est lue sur la brique elle-meme (le trait de couleur
            // de son ::before) plutot que recopiee dans le script : les sept
            // valeurs restent ecrites une seule fois, dans le CSS.
            var lit = window.getComputedStyle(scene.waves[index], '::before').backgroundColor;
            if (lit) scene.el.style.setProperty('--cy-wave-now', lit);
            scene.currentWave = index;
          }
        }
        if (scene.currentProgress !== scene.targetProgress) {
          shouldContinue = true;
        }
      });
      if (shouldContinue) requestFrame();
    }

    function requestFrame() {
      if (!raf) raf = window.requestAnimationFrame(renderCinema);
    }

    if (cinemas.length && !reduceMotion) {
      window.addEventListener('scroll', requestFrame, { passive: true });
      window.addEventListener('resize', requestFrame, { passive: true });
      if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', requestFrame, { passive: true });
      }
      requestFrame();
    }

    root.querySelectorAll('[data-cy-rail]').forEach(function (rail) {
      var track = rail.querySelector('[data-cy-track]');
      var prev = rail.querySelector('[data-cy-prev]');
      var next = rail.querySelector('[data-cy-next]');
      if (!track) return;
      function amount() { return Math.max(280, Math.round(track.clientWidth * 0.82)); }
      prev && prev.addEventListener('click', function () { track.scrollBy({ left: -amount(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
      next && next.addEventListener('click', function () { track.scrollBy({ left: amount(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    });

    function animateCount(el) {
      var target = parseFloat(el.dataset.countTo);
      var suffix = el.dataset.suffix || '';
      if (!isFinite(target)) return;
      if (reduceMotion) {
        el.textContent = target.toLocaleString('en-US') + suffix;
        return;
      }
      var duration = 1100;
      var start = null;
      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min(1, (timestamp - start) / duration);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            var counter = entry.target.querySelector('[data-count-to]');
            if (counter) animateCount(counter);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.16 });
      root.querySelectorAll('.cy-reveal').forEach(function (el) { observer.observe(el); });
    } else {
      root.querySelectorAll('.cy-reveal').forEach(function (el) {
        el.classList.add('is-visible');
        var counter = el.querySelector('[data-count-to]');
        if (counter) animateCount(counter);
      });
    }
  }

  function initAll() {
    document.querySelectorAll('[data-cytolight-home]').forEach(init);
  }

  document.addEventListener('DOMContentLoaded', initAll);
  document.addEventListener('shopify:section:load', function (event) { init(event.target.querySelector('[data-cytolight-home]')); });
})();

/* ===== SHADER BACKGROUND: "7 longueurs d'onde" section =====
 * Meme shader WebGL que .cl-shader-canvas sur la fiche produit
 * (sections/main-product.liquid) : lignes rouges animees derriere le texte.
 */
(function () {
  function start(canvas) {
    if (!canvas || canvas.dataset.cyShaderInit === 'true') return;
    canvas.dataset.cyShaderInit = 'true';

    // Meme lignes rouges animees que sur la fiche produit : trop couteuses
    // en GPU pour valoir la peine en vue mobile, ou la section passe deja
    // en une colonne (voir .cy-wl-inner a 900px dans cytolight-cinematic.css).
    if (window.matchMedia('(max-width: 900px)').matches) { canvas.style.display = 'none'; return; }

    var gl = canvas.getContext('webgl');
    if (!gl) { canvas.style.display = 'none'; return; }

    var vsSource = [
      'attribute vec4 aVertexPosition;',
      'void main(){gl_Position=aVertexPosition;}'
    ].join('\n');

    var fsSource = [
      'precision highp float;',
      'uniform vec2 iResolution;',
      'uniform float iTime;',
      'const float overallSpeed=0.2;',
      'const float gridSmoothWidth=0.015;',
      'const float axisWidth=0.05;',
      'const float majorLineWidth=0.025;',
      'const float minorLineWidth=0.0125;',
      'const float majorLineFrequency=5.0;',
      'const float minorLineFrequency=1.0;',
      'const float scale=5.0;',
      'const vec4 lineColor=vec4(0.82,0.05,0.18,1.0);',
      'const float minLineWidth=0.01;',
      'const float maxLineWidth=0.2;',
      'const float lineSpeed=1.0*overallSpeed;',
      'const float lineAmplitude=1.0;',
      'const float lineFrequency=0.2;',
      'const float warpSpeed=0.2*overallSpeed;',
      'const float warpFrequency=0.5;',
      'const float warpAmplitude=1.0;',
      'const float offsetFrequency=0.5;',
      'const float offsetSpeed=1.33*overallSpeed;',
      'const float minOffsetSpread=0.6;',
      'const float maxOffsetSpread=2.0;',
      'const int linesPerGroup=16;',
      '#define drawCircle(pos,radius,coord) smoothstep(radius+gridSmoothWidth,radius,length(coord-(pos)))',
      '#define drawSmoothLine(pos,halfWidth,t) smoothstep(halfWidth,0.0,abs(pos-(t)))',
      '#define drawCrispLine(pos,halfWidth,t) smoothstep(halfWidth+gridSmoothWidth,halfWidth,abs(pos-(t)))',
      '#define drawPeriodicLine(freq,width,t) drawCrispLine(freq/2.0,width,abs(mod(t,freq)-(freq)/2.0))',
      'float random(float t){return(cos(t)+cos(t*1.3+1.3)+cos(t*1.4+1.4))/3.0;}',
      'float getPlasmaY(float x,float hf,float off){return random(x*lineFrequency+iTime*lineSpeed)*hf*lineAmplitude+off;}',
      'void main(){',
      '  vec2 uv=gl_FragCoord.xy/iResolution.xy;',
      '  vec2 space=(gl_FragCoord.xy-iResolution.xy/2.0)/iResolution.x*2.0*scale;',
      '  float hf=1.0-(cos(uv.x*6.28)*0.5+0.5);',
      '  float vf=1.0-(cos(uv.y*6.28)*0.5+0.5);',
      '  space.y+=random(space.x*warpFrequency+iTime*warpSpeed)*warpAmplitude*(0.5+hf);',
      '  space.x+=random(space.y*warpFrequency+iTime*warpSpeed+2.0)*warpAmplitude*hf;',
      '  vec4 lines=vec4(0.0);',
      '  for(int l=0;l<16;l++){',
      '    float nli=float(l)/float(linesPerGroup);',
      '    float ot=iTime*offsetSpeed;',
      '    float op=float(l)+space.x*offsetFrequency;',
      '    float rand=random(op+ot)*0.5+0.5;',
      '    float hw=mix(minLineWidth,maxLineWidth,rand*hf)/2.0;',
      '    float off=random(op+ot*(1.0+nli))*mix(minOffsetSpread,maxOffsetSpread,hf);',
      '    float lp=getPlasmaY(space.x,hf,off);',
      '    float line=drawSmoothLine(lp,hw,space.y)/2.0+drawCrispLine(lp,hw*0.15,space.y);',
      '    float cx=mod(float(l)+iTime*lineSpeed,25.0)-12.0;',
      '    vec2 cp=vec2(cx,getPlasmaY(cx,hf,off));',
      '    line+=drawCircle(cp,0.01,space)*4.0;',
      '    lines+=line*lineColor*rand;',
      '  }',
      '  vec4 col=mix(vec4(0.05,0.03,0.04,1.0),vec4(0.16,0.03,0.06,1.0),uv.x);',
      '  col*=vf;',
      '  col.a=1.0;',
      '  col+=lines;',
      '  gl_FragColor=col;',
      '}'
    ].join('\n');

    function compileShader(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null; }
      return s;
    }
    var vs = compileShader(gl.VERTEX_SHADER, vsSource);
    var fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) { canvas.style.display = 'none'; return; }
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.style.display = 'none'; return; }

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    var aPos = gl.getAttribLocation(prog, 'aVertexPosition');
    var uRes = gl.getUniformLocation(prog, 'iResolution');
    var uTime = gl.getUniformLocation(prog, 'iTime');

    function resize() {
      var rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    window.addEventListener('resize', resize);
    resize();

    var t0 = Date.now();
    var rafId;
    function draw() {
      var t = (Date.now() - t0) / 1000;
      gl.useProgram(prog);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aPos);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(draw);
    }
    draw();

    /* Pause quand la section sort de l'ecran, pour economiser le GPU. */
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { if (!rafId) draw(); }
          else { cancelAnimationFrame(rafId); rafId = null; }
        });
      }, { threshold: 0 }).observe(canvas.parentElement);
    }
  }

  function startAll() {
    document.querySelectorAll('#cy-wl-shader-bg').forEach(start);
  }

  document.addEventListener('DOMContentLoaded', startAll);
  document.addEventListener('shopify:section:load', function (event) {
    var canvas = event.target.querySelector('#cy-wl-shader-bg');
    if (canvas) start(canvas);
  });
})();
