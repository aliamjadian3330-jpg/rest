document.addEventListener("DOMContentLoaded", () => {

  /* =======================
     TAB SYSTEM
  ======================= */
  const tabs = document.querySelectorAll('.tab-btn');
  const contents = document.querySelectorAll('.tab-content');

  if (tabs.length && contents.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));

        tab.classList.add('active');
        const activeContent = document.getElementById(tab.dataset.tab);
        activeContent?.classList.add('active');
      });
    });
  }


  /* =======================
     SUPPORT PANEL (simple)
  ======================= */
  const toggleBtn = document.querySelector('.support-toggle');
  const supportPanel = document.querySelector('.support-panel');
  const closeBtn = document.querySelector('.close-btn');

  if (toggleBtn && supportPanel && closeBtn) {
    toggleBtn.addEventListener('click', () => {
      supportPanel.style.display =
        supportPanel.style.display === "flex" ? "none" : "flex";
    });

    closeBtn.addEventListener('click', () => {
      supportPanel.style.display = "none";
    });
  }


  /* =======================
     WHY CARDS 3D EFFECT
  ======================= */
  const cards = document.querySelectorAll('.why-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y - rect.height / 2) / (rect.height / 2)) * 10;
      const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 10;

      card.style.setProperty('--rx', `${-rotateX}deg`);
      card.style.setProperty('--ry', `${rotateY}deg`);
      card.style.setProperty('--x', `${(x / rect.width) * 100}%`);
      card.style.setProperty('--y', `${(y / rect.height) * 100}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--x', '50%');
      card.style.setProperty('--y', '50%');
    });
  });


  /* =======================
     TOAST MESSAGE
  ======================= */
  window.showToast = function (message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    let progress = toast.querySelector('.toast-progress');
    if (!progress) {
      progress = document.createElement('div');
      progress.className = 'toast-progress';
      toast.appendChild(progress);
    }

    toast.firstChild.textContent = message;
    toast.classList.add('show');

    progress.style.transition = 'none';
    progress.style.transform = 'scaleX(1)';

    setTimeout(() => {
      progress.style.transition = `transform ${duration}ms linear`;
      progress.style.transform = 'scaleX(0)';
    }, 50);

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };


  /* =======================
     TYPEWRITER EFFECT
  ======================= */
  const typeEl = document.getElementById("typewriter");
  if (typeEl) {
    const texts = [
      "اپلیکیشن ضروری برای همه",
      "خدمات حرفه‌ای ما",
      "طراحی مدرن و سریع",
      "تجربه کاربری پیشرفته"
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const text = texts[textIndex];

      if (!isDeleting) {
        typeEl.textContent = text.slice(0, ++charIndex);
        if (charIndex === text.length)
          setTimeout(() => isDeleting = true, 1200);
      } else {
        typeEl.textContent = text.slice(0, --charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          textIndex = (textIndex + 1) % texts.length;
        }
      }

      setTimeout(typeLoop, isDeleting ? 50 : 90);
    }

    typeLoop();
  }


  /* =======================
     DRAWER MENU
  ======================= */
  const menuToggle = document.getElementById("menuToggle");
  const drawer = document.getElementById("fullDrawer");
  const overlay = document.getElementById("drawerOverlay");
  const drawerClose = document.getElementById("drawerClose");

  if (menuToggle && drawer && overlay && drawerClose) {
    menuToggle.addEventListener("click", () => {
      drawer.classList.toggle("open");
      overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", closeDrawer);
    drawerClose.addEventListener("click", closeDrawer);

    function closeDrawer() {
      drawer.classList.remove("open");
      overlay.classList.remove("active");
    }
  }


  /* =======================
     ADVANCED SUPPORT WIDGET
  ======================= */
  const widget = document.getElementById("supportWidget");
  const widgetToggle = document.getElementById("supportToggle");
  const panel = document.getElementById("supportPanel");
  const widgetClose = document.getElementById("closeBtn");

  if (widget && widgetToggle && panel && widgetClose) {

    setTimeout(() => {
      widgetToggle.classList.add("show");
      panel.style.display = "flex";
    }, 500);

    setTimeout(() => {
      panel.style.display = "none";
      widget.classList.add("minimized");
    }, 5500);

    widgetToggle.addEventListener("click", () => {
      panel.style.display = "flex";
      widget.classList.remove("minimized");
    });

    widgetClose.addEventListener("click", () => {
      panel.style.display = "none";
      widget.classList.add("minimized");
    });
  }

});
// پنهان شدن المان های ثابت

const bottomBar = document.querySelector('.bottom-bar');
const footer = document.querySelector('footer');

// تابع بررسی اسکرول
function checkScroll() {
  const footerTop = footer.getBoundingClientRect().top;
  const windowHeight = window.innerHeight;

  // نوار پایین
  if (footerTop < windowHeight) {
    bottomBar.style.transform = 'translate(-50%, 150%)';
    if (window.chatinaRoot) window.chatinaRoot.style.display = 'none';
  } else {
    bottomBar.style.transform = 'translateX(-50%)';
    if (window.chatinaRoot) window.chatinaRoot.style.display = 'block';
  }
}

// بررسی هنگام اسکرول و تغییر سایز
window.addEventListener('scroll', checkScroll);
window.addEventListener('resize', checkScroll);

// MutationObserver برای Chatina
const observer = new MutationObserver((mutationsList, observer) => {
  const chatinaDiv = document.getElementById('chatina-root');
  if (chatinaDiv) {
    window.chatinaRoot = chatinaDiv; // ذخیره برای دسترسی راحت‌تر
    checkScroll(); // بررسی فوری
    observer.disconnect(); // دیگه نیازی به نظارت نیست
  }
});

observer.observe(document.body, { childList: true, subtree: true });

// بررسی اولیه نوار پایین
checkScroll();
// علرت پیغام تماس 

function openCallAlert(e) {
  e.preventDefault();
  document.getElementById('callAlert').style.display = 'flex';
}

function closeCallAlert() {
  document.getElementById('callAlert').style.display = 'none';
}

function makeCall() {
  window.location.href = 'tel:0902000000';
}



if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/rest/service-worker.js')
    .then(() => console.log('SW registered'))
    .catch(err => console.log('SW error', err));
}

