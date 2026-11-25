(() => {
  'use strict';
  const superbase_key = "sb_publishable_VcLVCWZHxOhkiEV-FGBcPA_CnaT638q" ;
  const superbase_url = "https://vxfvopqkalgibryjganr.supabase.co/rest/v1/" ;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mobile menu (three-line button) ---------- */
  const topbar = $('#topbar');
  const menuBtn = $('#menuBtn');
  const navLinks = $('#navLinks');
  const isMenuOpen = () => navLinks.classList.contains('open');

  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    menuBtn.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'ปิดเมนู' : 'เปิดเมนู');
  }

  menuBtn.addEventListener('click', () => setMenu(!isMenuOpen()));
  $$('a', navLinks).forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', e => {
    if (isMenuOpen() && !topbar.contains(e.target)) setMenu(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  matchMedia('(min-width: 761px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- navbar shadow and scroll progress ---------- */
  const progress = $('.progress');
  function onScroll() {
    topbar.classList.toggle('scrolled', scrollY > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- highlight the section in view ---------- */
  const links = $$('a', navLinks);
  const sectionIO = new IntersectionObserver(entries => {
    entries.forEach(en => {
      const link = links.find(a => a.getAttribute('href') === `#${en.target.id}`);
      if (link) link.classList.toggle('active', en.isIntersecting);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => sectionIO.observe(s));

  /* ---------- scroll animations: items rise in, siblings stagger ---------- */
  const animated = $$('section h2, .goals li, .policy, .member, .join-form, footer .wrap');
  animated.forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => animated.includes(c));
    el.classList.add('anim');
    el.style.setProperty('--d', `${(siblings.indexOf(el) % 4) * 0.1}s`);
  });
  const animIO = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  animated.forEach(el => animIO.observe(el));

  /* ---------- glow that follows the cursor (mouse only, not touch) ---------- */
  if (matchMedia('(hover: hover)').matches && !reduceMotion) {
    addEventListener('pointermove', e => {
      const card = e.target.closest?.('.goals li, .policy, .member');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  /* ---------- footer year ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- join form (runs only when the page has #joinForm) ---------- */
  const form = $('#joinForm');
  if (!form) return;
  const msg = $('#formMsg');
  const agreeBox = form.elements.namedItem('agree');
  const agreeErr = $('[data-for="agree"]', form);
  const rules = {
    fullname: v => v.trim().length >= 2 || 'กรุณากรอกชื่อ-นามสกุล',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'กรุณากรอกอีเมลให้ถูกต้อง',
    phone: v => /^0\d{8,9}$/.test(v.replace(/[\s-]/g, '')) || 'กรุณากรอกเบอร์โทร 9-10 หลัก ขึ้นต้นด้วย 0',
    province: v => v.trim().length > 0 || 'กรุณากรอกจังหวัดที่อยู่อาศัย',
  };

  function checkField(name) {
    const input = form.elements.namedItem(name);
    const result = rules[name](input.value);
    const valid = result === true;
    $(`[data-for="${name}"]`, form).textContent = valid ? '' : result;
    input.classList.toggle('invalid', !valid);
    input.setAttribute('aria-invalid', String(!valid));
    return valid;
  }

  Object.keys(rules).forEach(name => {
    form.elements.namedItem(name).addEventListener('blur', () => checkField(name));
  });

  agreeBox.addEventListener('change', () => {
    if (agreeBox.checked) agreeErr.textContent = '';
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fieldsOk = Object.keys(rules).map(checkField).every(Boolean);
    const agreed = agreeBox.checked;
    agreeErr.textContent = agreed ? '' : 'กรุณายอมรับข้อบังคับของพรรคก่อนส่งใบสมัคร';

    if (!fieldsOk || !agreed) {
      msg.textContent = 'กรุณาแก้ไขช่องที่มีข้อความแจ้งเตือนก่อนส่งใบสมัคร';
      msg.className = 'form-msg error';
      return;
    }

    // Replace this part with a real send (Google Forms, Formspree, or your own server)
    msg.textContent = 'ส่งใบสมัครเรียบร้อยแล้ว ทางพรรคจะติดต่อกลับทางอีเมลหรือโทรศัพท์';
    msg.className = 'form-msg success';
    form.reset();
    $$('.err', form).forEach(el => { el.textContent = ''; });
    $$('input', form).forEach(input => {
      input.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
    });
  });
})();
