/* =========================================
   script.js — منطق التفاعل
   ========================================= */

// إخفاء شاشة التحميل بعد اكتمال الصفحة
window.addEventListener('load', () => {
  const loader = document.getElementById('pageLoader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 400);
  }
});

// =========================================
// إظهار القسم المطلوب
// =========================================
function showSection(id) {
  // إخفاء جميع الأقسام
  document.querySelectorAll('section').forEach(sec => {
    sec.classList.remove('active');
  });

  // إظهار القسم المحدد
  const target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    // تمرير ناعم لأعلى القسم مع هامش بسبب النافيجيشن الثابت
    setTimeout(() => {
      const navH = document.getElementById('mainNav')?.offsetHeight || 60;
      const top = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    }, 60);
  }

  // تحديث الرابط النشط في النافيجيشن
  document.querySelectorAll('nav a[data-section]').forEach(link => {
    link.classList.toggle('active-link', link.dataset.section === id);
  });

  // تحديث شريط التقدم (مثال بسيط)
  updateProgress(id);
}

// =========================================
// شريط التقدم في النافيجيشن
// =========================================
const sectionOrder = ['home', 'instructions', 'term1', 'term2', 'fulltext', 'audio-lectures', 'video-lectures', 'exams'];

function updateProgress(activeId) {
  const bar = document.getElementById('navProgress');
  if (!bar) return;
  const idx = sectionOrder.indexOf(activeId);
  const pct = idx >= 0 ? Math.round(((idx + 1) / sectionOrder.length) * 100) : 0;
  bar.style.width = pct + '%';
}

// =========================================
// زر العودة للأعلى
// =========================================
const backBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (backBtn) {
    backBtn.classList.toggle('visible', window.scrollY > 320);
  }
});

// =========================================
// منع التنقل للروابط #
// =========================================
document.addEventListener('click', e => {
  const a = e.target.closest('a[href="#"]');
  if (a) e.preventDefault();
});

// =========================================
// إغلاق القائمة المنسدلة عند الضغط خارجها
// =========================================
document.addEventListener('click', e => {
  if (!e.target.closest('.dropdown')) {
    document.querySelectorAll('.dropdown-menu').forEach(m => {
      m.style.display = '';
    });
  }
});

// =========================================
// تلميح للمحاضرات قريباً (منع النقر)
// =========================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.lecture-btn.coming-soon').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      showToast('⏳ هذه المحاضرة ستُضاف قريباً، تابعنا!');
    });
  });
});

// =========================================
// إشعار Toast بسيط
// =========================================
function showToast(msg) {
  // إزالة أي Toast موجود
  document.querySelectorAll('.toast-msg').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = 'toast-msg';
  toast.textContent = msg;
  toast.style.cssText = `
    position: fixed;
    bottom: 90px;
    left: 50%;
    transform: translateX(-50%);
    background: #1a2535;
    color: #fff;
    padding: 12px 24px;
    border-radius: 30px;
    font-family: 'Cairo', sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    z-index: 9000;
    opacity: 0;
    transition: opacity 0.3s;
    white-space: nowrap;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => { toast.style.opacity = '1'; });
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 2800);
}

// تهيئة المشهد الأول
document.addEventListener('DOMContentLoaded', () => {
  updateProgress('home');
});

/* =========================================
   مشغّل الصوت الموحّد (Podcast Player)
   — يعمل تلقائياً إن وُجدت عناصر المشغّل في الصفحة
   ========================================= */
(function initAudioPlayer(){
  const audio = document.getElementById('podcastAudio');
  const wrap  = document.getElementById('podcastPlayerWrap');
  if (!audio || !wrap) return; // هذه الصفحة لا تحتوي مشغّل صوت

  const title   = document.getElementById('nowPlayingTitle');
  const fill    = document.getElementById('progressFill');
  const cur     = document.getElementById('timeCurrent');
  const tot     = document.getElementById('timeTotal');
  const btnPlay = document.getElementById('btnPlay');
  const wave    = document.getElementById('waveAnim');
  let activeBtn = null;

  function fmt(s){
    const m = Math.floor(s/60);
    const sc = Math.floor(s%60);
    return m+':'+(sc<10?'0':'')+sc;
  }

  window.playAudio = function(src, name){
    if (activeBtn) activeBtn.classList.remove('playing');
    const btns = document.querySelectorAll('.audio-btn');
    btns.forEach(b => { if (b.getAttribute('onclick') && b.getAttribute('onclick').includes(src)) activeBtn = b; });
    if (activeBtn) activeBtn.classList.add('playing');

    audio.src = src;
    if (title) title.textContent = name;
    wrap.style.display = 'block';
    wrap.scrollIntoView({ behavior:'smooth', block:'start' });
    audio.play().catch(() => {});
    if (btnPlay) btnPlay.textContent = '⏸';
    if (wave) wave.style.opacity = '1';
  };

  audio.addEventListener('error', () => {
    wrap.style.display = 'none';
    if (activeBtn) { activeBtn.classList.remove('playing'); activeBtn = null; }
    if (wave) wave.style.opacity = '0';
    if (typeof showToast === 'function') showToast('🎧 لم يُضَف الملف الصوتي لهذا الأسبوع بعد');
  });

  if (btnPlay) {
    btnPlay.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        btnPlay.textContent = '⏸';
        if (wave) wave.style.opacity = '1';
      } else {
        audio.pause();
        btnPlay.textContent = '▶';
        if (wave) wave.style.opacity = '0';
      }
    });
  }

  document.getElementById('btnSkipBack')?.addEventListener('click', () => { audio.currentTime = Math.max(0, audio.currentTime-10); });
  document.getElementById('btnSkipFwd')?.addEventListener('click', () => { audio.currentTime = Math.min(audio.duration||0, audio.currentTime+10); });

  audio.addEventListener('timeupdate', () => {
    if (!isNaN(audio.duration) && audio.duration > 0) {
      if (fill) fill.style.width = (audio.currentTime/audio.duration*100)+'%';
      if (cur) cur.textContent = fmt(audio.currentTime);
    }
  });
  audio.addEventListener('loadedmetadata', () => { if (tot) tot.textContent = fmt(audio.duration); });
  audio.addEventListener('ended', () => {
    if (btnPlay) btnPlay.textContent = '▶';
    if (wave) wave.style.opacity = '0';
  });

  document.getElementById('progressOuter')?.addEventListener('click', function(e){
    const rect = this.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (!isNaN(audio.duration)) audio.currentTime = ratio * audio.duration;
  });

  document.getElementById('volumeSlider')?.addEventListener('input', function(){ audio.volume = this.value; });

  document.getElementById('closePlayer')?.addEventListener('click', () => {
    audio.pause();
    if (btnPlay) btnPlay.textContent = '▶';
    if (wave) wave.style.opacity = '0';
    wrap.style.display = 'none';
    if (activeBtn) { activeBtn.classList.remove('playing'); activeBtn = null; }
  });
})();

/* =========================================
   مشغّل الفيديو الموحّد (Video Player)
   — يعمل تلقائياً إن وُجدت عناصر المشغّل في الصفحة
   ========================================= */
(function initVideoPlayer(){
  const video = document.getElementById('mainVideo');
  const wrap  = document.getElementById('videoPlayerWrap');
  if (!video || !wrap) return; // هذه الصفحة لا تحتوي مشغّل فيديو

  const nowTitle = document.getElementById('videoNowTitle');
  const dlBtn    = document.getElementById('vDownloadBtn');
  let activeVBtn = null;

  window.playVideo = function(src, name, num){
    if (activeVBtn) activeVBtn.classList.remove('v-playing');
    const btns = document.querySelectorAll('.video-btn.available');
    btns.forEach(b => { if (b.getAttribute('onclick') && b.getAttribute('onclick').includes(src)) activeVBtn = b; });
    if (activeVBtn) activeVBtn.classList.add('v-playing');

    video.src = src;
    if (nowTitle) nowTitle.textContent = num + ' — ' + name;
    if (dlBtn) { dlBtn.href = src; dlBtn.setAttribute('download', name + '.mp4'); }
    wrap.style.display = 'block';
    wrap.scrollIntoView({ behavior:'smooth', block:'start' });
    video.play().catch(() => {});
  };

  video.addEventListener('error', () => {
    wrap.style.display = 'none';
    if (activeVBtn) { activeVBtn.classList.remove('v-playing'); activeVBtn = null; }
    if (typeof showToast === 'function') showToast('🎥 لم يُضَف ملف الفيديو لهذا الأسبوع بعد');
  });

  document.getElementById('videoCloseBtn')?.addEventListener('click', () => {
    video.pause();
    video.src = '';
    wrap.style.display = 'none';
    if (activeVBtn) { activeVBtn.classList.remove('v-playing'); activeVBtn = null; }
  });
  document.getElementById('vBtnSkipBack')?.addEventListener('click', () => { video.currentTime = Math.max(0, video.currentTime-10); });
  document.getElementById('vBtnSkipFwd')?.addEventListener('click', () => { video.currentTime = Math.min(video.duration||0, video.currentTime+10); });
  document.getElementById('vSpeedSelect')?.addEventListener('change', function(){ video.playbackRate = parseFloat(this.value); });
})();
