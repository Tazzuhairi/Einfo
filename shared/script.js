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
