/* MCUS site renderer — 내용은 assets/js/data/*.js 에서 수정하세요. */
(function () {
  'use strict';

  const M = window.MCUS;
  const body = document.body;
  const yearsDesc = Object.keys(M.years).map(Number).sort((a, b) => b - a);
  const latest = M.years[yearsDesc[0]];

  /* ---------- helpers ---------- */

  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const or = (v, fallback = '추후 공개') => (v ? esc(v) : `<em class="tba">${fallback}</em>`);

  const paras = (s) => esc(s).split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');

  function parseDate(s) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function phase(y) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = parseDate(y.start);
    const end = parseDate(y.end);
    if (today < start) return { key: 'upcoming', days: Math.round((start - today) / 86400000) };
    if (today <= end) return { key: 'live', days: 0 };
    return { key: 'done', days: 0 };
  }

  const ddayText = (p) => (p.key === 'upcoming' ? (p.days === 0 ? 'D-DAY' : `D-${p.days}`) : p.key === 'live' ? 'NOW' : '');

  const isFilled = (t) => Boolean(t.title || t.ko);
  const filledTalks = (y) => y.days.flatMap((d) => d.talks).filter(isFilled);
  const allLightning = (y) => y.days.flatMap((d) => d.lightning || []);

  // 각 강연에 day · 순서 · 시간 정보를 붙인 목록
  function talkEntries(y) {
    const out = [];
    y.days.forEach((d, di) => {
      d.talks.forEach((t, ti) => {
        const slot = d.schedule.find((s) => s.talk === ti + 1);
        out.push({ t, d, di, ti, id: `d${di + 1}-t${ti + 1}`, time: slot ? slot.time : '' });
      });
    });
    return out;
  }

  // 목록에서는 기조강연만 표시 (초청강연은 연사 소개에 표기)
  const kindBadge = (t) => (t.kind === 'plenary' ? '<span class="badge plenary">기조강연</span>' : '');

  function wordmark(year, cls = '') {
    const yr = year
      ? `<text x="249" y="36" text-anchor="end" fill="currentColor" stroke="none" font-family="Pretendard Variable, Pretendard, sans-serif" font-weight="800" font-size="20" letter-spacing="-0.5">${year}</text>`
      : '';
    return `<svg class="${cls}" viewBox="0 0 258 88" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="square" role="img" aria-label="MCUS${year ? ' ' + year : ''}">
      <path pathLength="1" d="M8 80V8H108"/><path pathLength="1" d="M37 8V58"/><path pathLength="1" d="M68 8V80H213V44H176V8H252"/><path pathLength="1" d="M124 8V80"/><path pathLength="1" d="M161 8V80"/>
      ${yr}
    </svg>`;
  }

  // 첫 화면 배경: 오른쪽 위 · 왼쪽 아래 모서리에서 퍼져 나가며 그려지는 네트워크 (기존 사이트의 모티프)
  function network(seed = 7, withLeft = true) {
    let r = seed;
    const rand = () => ((r = (r * 16807) % 2147483647) / 2147483647);
    const W = 1600;
    const H = 720;
    const cluster = (ax, ay, n, reach, dirX, dirY) => {
      const pts = Array.from({ length: n }, () => {
        const a = (Math.PI / 2) * rand();
        const d = reach * Math.sqrt(rand());
        return { x: ax + dirX * Math.cos(a) * d, y: ay + dirY * Math.sin(a) * d, big: rand() < 0.14 };
      });
      pts.forEach((pt) => { pt.t = Math.hypot(pt.x - ax, pt.y - ay) / reach; });
      const edges = new Set();
      pts.forEach((pt, i) => {
        pts
          .map((q, j) => [j, Math.hypot(q.x - pt.x, q.y - pt.y)])
          .filter(([j]) => j !== i)
          .sort((a, b) => a[1] - b[1])
          .slice(0, 3)
          .forEach(([j, dist]) => { if (dist < reach * 0.42) edges.add(i < j ? `${i}-${j}` : `${j}-${i}`); });
      });
      const delay = (t) => (0.2 + t * 1.6).toFixed(2);
      const lines = [...edges].map((k) => {
        const [i, j] = k.split('-').map(Number);
        const a = pts[i];
        const b = pts[j];
        const [p0, p1] = a.t <= b.t ? [a, b] : [b, a];
        return `<line pathLength="1" x1="${p0.x.toFixed(1)}" y1="${p0.y.toFixed(1)}" x2="${p1.x.toFixed(1)}" y2="${p1.y.toFixed(1)}" style="--d:${delay(p0.t)}s"/>`;
      });
      const dots = pts.map((pt) => `<circle class="${pt.big ? 'big' : ''}" cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="${pt.big ? 9 : (2 + rand() * 3).toFixed(1)}" style="--d:${(Number(delay(pt.t)) + 0.35).toFixed(2)}s"/>`);
      return `<g>${lines.join('')}${dots.join('')}</g>`;
    };
    return `<svg class="net" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${cluster(W + 20, -20, 30, 760, -1, 1)}${withLeft ? cluster(-20, H + 20, 18, 520, 1, -1) : ''}</svg>`;
  }

  const svg = (d, w = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const icon = {
    pin: svg('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    subway: svg('<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l-2-4M15 21l2-4"/>'),
    bus: svg('<rect x="4" y="3" width="16" height="15" rx="2"/><path d="M4 11h16M7 18v3M17 18v3"/>'),
    down: svg('<path d="M6 9l6 6 6-6"/>', 2.2),
    right: svg('<path d="M9 6l6 6-6 6"/>', 2.2),
    left: svg('<path d="M15 6l-6 6 6 6"/>', 2.2),
  };

  /* ---------- header & footer ---------- */

  // 열린 드롭다운은 바깥을 누르면 닫힘
  function closeOnOutside(dd) {
    document.addEventListener('click', (e) => { if (!dd.contains(e.target)) dd.open = false; });
  }

  // 소개 페이지 상단: 소개 · 학술회 ▾ (2027 · 2026 · 2025)
  function renderMainHeader() {
    const el = document.getElementById('site-header');
    el.innerHTML = `
      <div class="wrap bar">
        <a class="brand" href="index.html" aria-label="MCUS 소개">${wordmark()}<span>학부생을 위한<br>수학 학술회</span></a>
        <nav class="site-nav" aria-label="주요 메뉴">
          <a href="index.html" aria-current="page">소개</a>
          <details class="drop">
            <summary>학술회 ${icon.down}</summary>
            <div class="menu">
              ${yearsDesc
                .map((yr) => {
                  const y = M.years[yr];
                  const up = phase(y).key !== 'done';
                  return `<a href="${yr}.html"><b>MCUS ${yr}</b>${up ? '<span class="tag">개최 예정</span>' : ''}<small>${esc(y.dateLabel)}</small></a>`;
                })
                .join('')}
            </div>
          </details>
        </nav>
      </div>`;
    closeOnOutside(el.querySelector('.drop'));
  }

  // 연도 페이지: 맨 위 얇은 띠(소개로 · 다른 연도) + 그 해만의 상단 메뉴
  function renderYearHeader(y, routes) {
    const el = document.getElementById('site-header');
    el.insertAdjacentHTML('beforebegin', `
      <div class="topstrip">
        <div class="wrap">
          <a class="back" href="index.html">${icon.left}<span>MCUS 소개</span></a>
          <nav aria-label="연도별 학술회">
            ${yearsDesc.map((yr) => `<a href="${yr}.html"${yr === y.year ? ' aria-current="page"' : ''}>MCUS ${yr}</a>`).join('')}
          </nav>
        </div>
      </div>`);
    el.classList.add('has-year');
    el.innerHTML = `
      <div class="wrap bar">
        <div class="year-brand">
          <a href="index.html" aria-label="MCUS 소개">${wordmark()}</a>
          <a href="#home"><b>MCUS ${y.year}</b></a>
        </div>
        <nav class="site-nav" aria-label="MCUS ${y.year} 메뉴">
          ${routes.map(([key, label]) => `<a href="#${key}" data-route="${key}">${label}</a>`).join('')}
        </nav>
      </div>`;
  }

  function renderFooter() {
    const c = M.contact;
    document.getElementById('site-footer').innerHTML = `
      <div class="wrap">
        <div class="top">
          <div class="brandline">
            ${wordmark()}
            <p>Mathematics Conference for Undergraduate Students<br>성균관대학교 수학과 학술동아리 MIMIC</p>
          </div>
          <div>
            <h4>Conferences</h4>
            <ul>${yearsDesc.map((yr) => `<li><a href="${yr}.html">MCUS ${yr}</a></li>`).join('')}<li><a href="index.html">MCUS 소개</a></li></ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:${esc(c.email)}">E-mail : ${esc(c.email)}</a></li>
              <li><a href="${esc(c.website)}" target="_blank" rel="noopener">MIMIC 홈페이지</a></li>
              <li><a href="${esc(c.instagram)}" target="_blank" rel="noopener">Instagram ${esc(c.instagramHandle)}</a></li>
              <li><a href="${esc(c.youtube)}" target="_blank" rel="noopener">YouTube</a></li>
            </ul>
          </div>
        </div>
        <div class="bottom">
          <div class="left">
            <span>© ${new Date().getFullYear()} MIMIC, Sungkyunkwan University</span>
            <button class="theme-toggle" type="button" id="theme-toggle"></button>
          </div>
          <div class="logos">
            <img src="assets/img/mimic-logo.png" alt="MIMIC">
            <img src="assets/img/skku-math-logo.png" alt="성균관대학교 수학과">
          </div>
        </div>
      </div>`;
    setupTheme();
  }

  function setupTheme() {
    const btn = document.getElementById('theme-toggle');
    const order = ['auto', 'light', 'dark'];
    const label = { auto: '테마: 자동', light: '테마: 라이트', dark: '테마: 다크' };
    let mode = 'auto';
    try { mode = localStorage.getItem('mcus-theme') || 'auto'; } catch (e) { /* storage unavailable */ }
    const apply = () => {
      if (mode === 'auto') document.documentElement.removeAttribute('data-theme');
      else document.documentElement.setAttribute('data-theme', mode);
      btn.textContent = label[mode];
    };
    apply();
    btn.addEventListener('click', () => {
      mode = order[(order.indexOf(mode) + 1) % order.length];
      try { localStorage.setItem('mcus-theme', mode); } catch (e) { /* storage unavailable */ }
      apply();
    });
  }

  /* ---------- main page (index) ---------- */

  // 맨 위 '다가오는 학술회' — 가장 최근 연도 데이터로 자동 구성
  function renderHome() {
    const el = document.getElementById('upcoming');
    if (!el) return;
    const y = latest;
    const p = phase(y);
    const label = p.key === 'done' ? 'Latest Event' : 'Upcoming Event';
    const desc = (y.overview.find((r) => r.label === 'MCUS란?') || {}).value || '';
    const facts = [
      ['일시', y.dateLabel],
      ['장소', y.venueShort],
      ...y.overview.filter((r) => /대상/.test(r.label) && r.value).map((r) => [r.label.replace('주요 ', ''), r.value]),
      ['주최', y.host],
    ];
    let i = 0;
    const rise = () => `class="rise" style="--i:${i++}"`;
    el.innerHTML = network(11, false) + `
      <div class="wrap up-grid">
        <div>
          <span class="up-label rise" style="--i:${i++}">${label}</span>
          ${wordmark(y.year, 'up-mark draw')}
          <h1 ${rise()}>${esc(y.titleKo)}</h1>
          <p class="en rise" style="--i:${i++}">${esc(y.titleEn)}</p>
          ${desc ? `<p class="desc rise" style="--i:${i++}">${esc(desc)}</p>` : ''}
          <dl class="up-facts">${facts.map(([k, v]) => `<div ${rise()}><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
          <div class="up-actions rise" style="--i:${i++}">
            <a class="btn btn-royal" href="${y.year}.html">MCUS ${y.year} 페이지로 <span class="arrow">→</span></a>
            ${y.registration.open && y.registration.formUrl ? `<a class="btn btn-ghost" href="${esc(y.registration.formUrl)}" target="_blank" rel="noopener">참가 신청하기</a>` : ''}
          </div>
        </div>
        ${p.key !== 'done' ? `<div class="up-dday rise" style="--i:3"><b data-count="${p.days}">${ddayText(p)}</b><span>${esc(y.start.replace(/-/g, '. '))} 개막</span></div>` : ''}
      </div>`;

    // D-day 숫자가 0부터 올라가는 효과 (움직임 줄이기 설정이면 생략)
    const num = el.querySelector('[data-count]');
    const target = num ? Number(num.dataset.count) : 0;
    if (num && target > 0 && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t0 = performance.now() + 500;
      const dur = 1400;
      const tick = (now) => {
        const k = Math.min(1, Math.max(0, (now - t0) / dur));
        num.textContent = `D-${Math.round(target * (1 - Math.pow(1 - k, 3)))}`;
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick); // 애니메이션이 돌지 않으면 원래 숫자가 그대로 남음
    }
  }

  /* ==========================================================
     연도 페이지 — 한 파일 안에서 #home, #schedule, #abstract … 로 이동
     ========================================================== */

  function yearRoutes(y) {
    return [
      ['home', '홈', 'Home'],
      ['schedule', '일정', 'Timetable'],
      ['abstract', '초록', 'Abstract'],
      ['registration', '참가 신청', 'Registration'],
      ['venue', '장소 안내', 'Venue'],
      ...(y.gallery && y.gallery.length ? [['gallery', '갤러리', 'Gallery']] : []),
    ];
  }

  function renderYear(yr) {
    const y = M.years[yr];
    if (!y) return;
    const routes = yearRoutes(y);
    const app = document.getElementById('app');
    renderYearHeader(y, routes);

    const views = { home: viewHome, schedule: viewSchedule, abstract: viewAbstract, registration: viewRegistration, venue: viewVenue, gallery: viewGallery };

    function route() {
      let [key, arg] = decodeURIComponent(location.hash.slice(1)).split('/');
      // 예전 링크(#d1-t2) 호환
      if (/^d\d+-(t|lt)\d*$/.test(key || '')) { arg = key; key = 'abstract'; }
      const r = routes.find((x) => x[0] === key) || routes[0];
      const [rk, label, en] = r;

      document.querySelectorAll('.site-nav [data-route]').forEach((a) => a.toggleAttribute('aria-current', a.dataset.route === rk));
      const cur = document.querySelector('.site-nav [aria-current]');
      if (cur) cur.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      document.title = rk === 'home' ? `MCUS ${yr} · ${y.titleKo}` : `${label} · MCUS ${yr}`;

      const head = rk === 'home' ? '' : `<header class="subhero"><div class="wrap"><p>${en}</p><h1>${label}</h1></div></header>`;
      app.innerHTML = head + views[rk](y);
      setupView(y, rk, arg);
      setupReveal();
    }

    window.addEventListener('hashchange', route);
    route();
  }

  /* 홈 — 첫 화면 · 한눈에 보기 · 기조 강연자 · 개요와 프로그램 · 갤러리 · Organizers */
  function viewHome(y) {
    const p = phase(y);
    const entries = talkEntries(y).filter((e) => isFilled(e.t));
    const plenary = entries.filter((e) => e.t.kind === 'plenary');
    const nL = allLightning(y).length;
    const reg = y.registration;
    const regOpen = reg.open && reg.formUrl;

    const glance = [
      ['기간', `${y.days.length}일`, y.dateLabel.replace(/^\d{4}\. /, '')],
      ['강연', entries.length ? `${entries.length}편` : 'TBA', plenary.length ? `기조강연 ${plenary.length}편 포함` : entries.length ? '학생 · 연구자 강연' : '연사 추후 공개'],
      ['Lightning Talk', nL ? `${nL}편` : 'TBA', nL ? '학부생 짧은 발표' : '연사 모집 예정'],
      ['장소', y.venue.building || '추후 안내', y.venue.campus.replace(' (수원)', '')],
    ];

    const hero = `
      <section class="yhero net-hero">
        ${network(y.year)}
        <div class="wrap">
          ${p.key !== 'done' ? `<span class="pill live">개최 예정 · ${ddayText(p)}</span>` : ''}
          ${wordmark(y.year, 'yhero-mark draw')}
          <h1>${esc(y.titleKo)}</h1>
          <p class="en">${esc(y.titleEn)}</p>
          <p class="when">${esc(y.dateLabel)}<span class="sep">|</span>${esc(y.venueShort)}</p>
          <div class="yhero-actions">
            ${regOpen ? `<a class="btn btn-royal" href="${esc(reg.formUrl)}" target="_blank" rel="noopener">참가 신청하기 <span class="arrow">→</span></a>` : ''}
            <a class="btn ${regOpen ? 'btn-ghost' : 'btn-royal'}" href="#schedule">일정 보기</a>
            <a class="btn btn-ghost" href="#abstract">초록 보기</a>
          </div>
        </div>
      </section>
      <div class="wrap"><div class="glance-bar reveal">
        ${glance.map(([k, v, sub]) => `<div><span class="k">${k}</span><b>${esc(v)}</b><small>${esc(sub)}</small></div>`).join('')}
      </div></div>`;

    const speakers = `
      <div class="sec-title"><h2>기조 강연자</h2><span>Plenary Speakers</span></div>
      ${
        plenary.length
          ? `<div class="pcards">${plenary
              .map(
                (e) => `
            <a class="pcard reveal" href="#abstract/${e.id}">
              <div class="pc-photo">${e.t.photo ? `<img src="${esc(e.t.photo)}" alt="${esc(e.t.ko)}" loading="lazy">` : `<span>${esc(e.t.ko.slice(0, 1))}</span>`}</div>
              <div class="pc-body">
                <b>${esc(e.t.ko)}</b><span class="en">${esc(e.t.en)}</span>
                ${e.t.affil ? `<span class="aff">${esc(e.t.affil)}</span>` : ''}
                ${e.t.field ? `<p class="rf"><strong>Research field</strong>${esc(e.t.field)}</p>` : ''}
                <span class="ptalk">${esc(e.t.title)}</span>
                <span class="go">초록 보기 →</span>
              </div>
            </a>`
              )
              .join('')}</div>`
          : '<div class="pempty">기조 강연자는 추후 공개됩니다.</div>'
      }`;

    const program = `
      <div class="sec-title"><h2>개요</h2><span>Overview</span></div>
      <div class="ov-grid">
        <div class="reveal">${overviewCard(y)}</div>
        <div class="prog card reveal">
          <h3>프로그램</h3>
          ${y.days
            .map((d, di) => {
              const n = d.talks.length;
              const filled = d.talks.filter(isFilled).length;
              const lt = (d.lightning || []).length;
              const first = d.schedule[0].time.split('–')[0].trim();
              const ends = d.schedule.map((x) => (x.time.split('–')[1] || '').trim()).filter(Boolean);
              const last = ends[ends.length - 1] || '';
              const parts = [`강연 ${n}편${filled ? '' : ' (연사 추후 공개)'}`, lt ? `Lightning Talk ${lt}편` : '', d.schedule.some((x) => x.kind === 'social') ? 'Banquet' : ''].filter(Boolean);
              return `<a class="prog-day" href="#schedule"><span class="d">DAY ${di + 1}</span><span class="m"><b>${esc(d.label)}</b><small>${esc(first)}${last ? ` – ${esc(last)}` : ''} · ${parts.join(' · ')}</small></span>${icon.right}</a>`;
            })
            .join('')}
          <div class="prog-links">
            <a class="btn btn-royal" href="#schedule">전체 일정</a>
            <a class="btn btn-ghost" href="#abstract">초록 보기</a>
          </div>
        </div>
      </div>`;

    const gallery = y.gallery && y.gallery.length
      ? `
      <div class="sec-title row"><div><h2>갤러리</h2><span>Gallery</span></div><a class="more" href="#gallery">전체 보기 →</a></div>
      <div class="gal-strip">${y.gallery.slice(0, 3).map((g) => `<a class="reveal" href="#gallery"><img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy"></a>`).join('')}</div>`
      : '';

    // 지난 행사는 연사를 먼저, 예정된 행사는 개요를 먼저
    const blocks = (p.key === 'done' ? [speakers, program, gallery] : [program, speakers, gallery]).filter(Boolean);
    blocks.push(organizersRow(y));
    return hero + blocks.map((b, i) => `<section class="section${i % 2 ? ' soft' : ''}"><div class="wrap">${b}</div></section>`).join('');
  }

  function overviewCard(y) {
    return `
      <div class="ov-card">
        <dl>
          ${y.overview.map((r) => `<div><dt>${esc(r.label)}</dt><dd>${or(r.value, '추후 안내')}${r.note ? `<span class="note">* ${esc(r.note)}</span>` : ''}</dd></div>`).join('')}
        </dl>
      </div>`;
  }

  function organizersRow(y) {
    return `
      <div class="org-row">
        <h2>Organizers<small>${esc(y.host)}</small></h2>
        ${
          y.organizers.length
            ? `<ul>${y.organizers.map(([ko, en]) => `<li>${esc(ko)} <span>(${esc(en)})</span></li>`).join('')}</ul>`
            : '<p class="tba">조직위원 명단은 추후 공개됩니다.</p>'
        }
      </div>`;
  }

  /* 일정 — 기존 사이트의 표 형식, 강연을 누르면 초록으로 */
  function viewSchedule(y) {
    return `
      <section class="section"><div class="wrap">
        <div class="tt-grid" style="--days:${Math.min(y.days.length, 3)}">
          ${y.days
            .map(
              (d, di) => `
            <div class="tt-day reveal">
              <h2>${esc(d.label)}</h2>
              <p class="chair">Chair - ${d.chairs && d.chairs.length ? esc(d.chairs.join(', ')) : '<em class="tba">추후 공개</em>'}</p>
              <ol>
                ${d.schedule
                  .map((s) => {
                    if (s.talk) {
                      const t = d.talks[s.talk - 1] || {};
                      const inner = `<time>${esc(s.time)}</time><span class="what">Talk ${s.talk} (${t.ko ? esc(t.ko) : '<span class="tba">추후 공개</span>'})${kindBadge(t)}${t.title ? `<small>${esc(t.title)}</small>` : ''}</span>`;
                      return isFilled(t)
                        ? `<li class="tt-row"><a href="#abstract/d${di + 1}-t${s.talk}">${inner}<span class="chev">${icon.right}</span></a></li>`
                        : `<li class="tt-row"><div>${inner}<span></span></div></li>`;
                    }
                    if (s.kind === 'lightning' && (d.lightning || []).length) {
                      return `<li class="tt-row"><a href="#abstract/d${di + 1}-lt"><time>${esc(s.time)}</time><span class="what">${esc(s.label)}<small>${d.lightning.map((l) => esc(l.name)).join(' · ')}</small></span><span class="chev">${icon.right}</span></a></li>`;
                    }
                    return `<li class="tt-row${s.kind === 'break' ? ' break' : ''}"><div><time>${esc(s.time)}</time><span class="what">${esc(s.label)}</span><span></span></div></li>`;
                  })
                  .join('')}
              </ol>
            </div>`
            )
            .join('')}
        </div>
        <p class="tt-hint">강연을 누르면 연사 소개와 초록을 볼 수 있습니다.</p>
      </div></section>`;
  }

  /* 초록 — 시간 순서대로, 누르면 펼쳐지는 목록 */
  function viewAbstract(y) {
    const any = filledTalks(y).length > 0;
    const days = y.days
      .map((d, di) => {
        const rows = d.schedule
          .map((s) => {
            if (s.talk) {
              const t = d.talks[s.talk - 1] || {};
              const id = `d${di + 1}-t${s.talk}`;
              if (!isFilled(t)) {
                return `<div class="acc-row tbd" id="${id}"><span class="acc-time">${esc(s.time)}</span><span class="acc-head"><b>Talk ${s.talk} : 추후 공개</b></span><span></span></div>`;
              }
              return `
                <details class="acc-item" id="${id}">
                  <summary>
                    <span class="acc-time">${esc(s.time)}</span>
                    <span class="acc-head"><b>Talk ${s.talk} : ${esc(t.ko)}${t.en ? ` <span class="en">(${esc(t.en)})</span>` : ''}</b>${kindBadge(t)}<span class="t">${or(t.title)}</span></span>
                    <span class="acc-chev">${icon.down}</span>
                  </summary>
                  <div class="acc-body">
                    <div class="spk">
                      ${t.photo ? `<img src="${esc(t.photo)}" alt="${esc(t.ko)}" loading="lazy">` : ''}
                      <div class="who">
                        <b>${esc(t.ko)}${t.en ? ` (${esc(t.en)})` : ''}${t.kind ? ` <span class="badge ${t.kind}">${t.kind === 'plenary' ? '기조강연' : '초청강연'}</span>` : ''}</b>
                        ${t.affil ? `<span class="aff">${esc(t.affil)}</span>` : ''}
                        ${t.field ? `<span class="rf"><strong>Research field</strong>${esc(t.field)}</span>` : ''}
                      </div>
                    </div>
                    <div class="abstract">${t.abstract ? paras(t.abstract) : '<p class="tba">초록 추후 공개</p>'}</div>
                  </div>
                </details>`;
            }
            if (s.kind === 'lightning') {
              const lt = d.lightning || [];
              if (!lt.length) return `<div class="acc-row tbd" id="d${di + 1}-lt"><span class="acc-time">${esc(s.time)}</span><span class="acc-head"><b>Lightning Talk</b><span class="t">연사 추후 공개</span></span><span></span></div>`;
              return `
                <details class="acc-item" id="d${di + 1}-lt">
                  <summary>
                    <span class="acc-time">${esc(s.time)}</span>
                    <span class="acc-head"><b>Lightning Talk</b><span class="t">${lt.map((l) => esc(l.name)).join(' · ')}</span></span>
                    <span class="acc-chev">${icon.down}</span>
                  </summary>
                  <div class="acc-body">
                    <ul class="lt-list">${lt.map((l) => `<li><b>${esc(l.name)}</b><span>${esc(l.title)}</span></li>`).join('')}</ul>
                  </div>
                </details>`;
            }
            return `<div class="acc-row break"><span class="acc-time">${esc(s.time)}</span><span class="acc-head">${esc(s.label)}</span><span></span></div>`;
          })
          .join('');
        return `
          <div class="abs-day">
            <div class="dayband"><div class="wrap"><h2>${esc(d.label)}<small>Chair - ${d.chairs && d.chairs.length ? esc(d.chairs.join(', ')) : '추후 공개'}</small></h2></div></div>
            <div class="wrap"><div class="acc">${rows}</div></div>
          </div>`;
      })
      .join('');
    return `
      ${any ? '<div class="wrap abs-tools"><button class="text-btn" type="button" data-toggle-all>모두 펼치기</button></div>' : '<div class="wrap abs-tools"></div>'}
      ${days}
      <div class="section tight"></div>`;
  }

  /* 참가 신청 */
  function viewRegistration(y) {
    const reg = y.registration;
    const btn = reg.open && reg.formUrl
      ? `<a class="btn btn-royal" href="${esc(reg.formUrl)}" target="_blank" rel="noopener">참가 신청서 작성하기 <span class="arrow">→</span></a>`
      : `<span class="btn" aria-disabled="true">${esc(reg.closedLabel)}</span>`;
    return `
      <section class="section"><div class="wrap">
        <div class="card reg-status reveal">
          <div>
            <strong>${reg.open ? '참가 신청을 받고 있습니다' : esc(reg.closedLabel)}</strong>
            <p>문의 · <a href="mailto:${esc(M.contact.email)}">${esc(M.contact.email)}</a>${y.kakao ? ` · <a href="${esc(y.kakao)}" target="_blank" rel="noopener">MCUS 오픈채팅</a>` : ''}</p>
          </div>
          ${btn}
        </div>
        <div class="reg-blocks">
          ${reg.blocks
            .map(
              (b) => `
            <div class="card reg-block reveal">
              <h3>${esc(b.title)}</h3>
              <dl>${b.rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${or(v, '추후 안내')}</dd></div>`).join('')}</dl>
              ${b.note ? `<p class="note">${esc(b.note)}</p>` : ''}
            </div>`
            )
            .join('')}
        </div>
      </div></section>`;
  }

  /* 장소 안내 */
  function viewVenue(y) {
    const v = y.venue;
    const q = encodeURIComponent('성균관대학교 자연과학캠퍼스');
    return `
      <section class="section"><div class="wrap venue">
        <div class="card reveal">
          <h3>${esc(v.campus)}${v.building ? ` · ${esc(v.building)}` : ''}</h3>
          <p class="addr">${esc(v.address)}</p>
          <dl class="rooms">${v.rooms.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${or(val, '추후 안내')}</dd></div>`).join('')}</dl>
          <div class="map-links">
            <a class="chip" href="${esc(M.campusMap)}" target="_blank" rel="noopener">캠퍼스 맵 ↗</a>
            <a class="chip" href="https://map.naver.com/p/search/${q}" target="_blank" rel="noopener">네이버 지도 ↗</a>
            <a class="chip" href="https://map.kakao.com/?q=${q}" target="_blank" rel="noopener">카카오맵 ↗</a>
          </div>
        </div>
        <div class="card reveal">
          <h3 style="margin-bottom:16px">찾아오시는 길</h3>
          <div class="directions">
            ${M.directions.map((dd) => `<div><span class="ico">${icon[dd.kind] || icon.pin}</span><span><b>${esc(dd.label)}</b><p>${esc(dd.text).replace(/\n/g, '<br>')}</p></span></div>`).join('')}
          </div>
        </div>
      </div></section>`;
  }

  /* 갤러리 */
  function viewGallery(y) {
    return `
      <section class="section"><div class="wrap">
        <div class="gallery">
          ${y.gallery.map((g) => `<button type="button" data-src="${esc(g.src)}" data-alt="${esc(g.alt)}"><img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy"></button>`).join('')}
        </div>
        <dialog class="lightbox" id="lightbox"><form method="dialog"><button aria-label="닫기">×</button></form><img alt=""><p></p></dialog>
      </div></section>`;
  }

  /* 화면별 동작 */
  function setupView(y, rk, arg) {
    // 초록: 모두 펼치기 / 접기
    const toggleAll = document.querySelector('[data-toggle-all]');
    if (toggleAll) {
      const items = [...document.querySelectorAll('.acc-item')];
      const sync = () => { toggleAll.textContent = items.every((d) => d.open) ? '모두 접기' : '모두 펼치기'; };
      toggleAll.addEventListener('click', () => {
        const open = !items.every((d) => d.open);
        items.forEach((d) => { d.open = open; });
        sync();
      });
      items.forEach((d) => d.addEventListener('toggle', sync));
    }

    // 갤러리 확대
    const dlg = document.getElementById('lightbox');
    if (dlg && typeof dlg.showModal === 'function') {
      document.querySelectorAll('.gallery button').forEach((b) =>
        b.addEventListener('click', () => {
          dlg.querySelector('img').src = b.dataset.src;
          dlg.querySelector('img').alt = b.dataset.alt;
          dlg.querySelector('p').textContent = b.dataset.alt;
          dlg.showModal();
        })
      );
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    }

    // #abstract/d1-t2 → 해당 강연을 펼치고 그 위치로
    const target = arg && document.getElementById(arg);
    if (target) {
      if (target.tagName === 'DETAILS') target.open = true;
      requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    } else {
      window.scrollTo(0, 0);
    }
  }

  /* ---------- reveal ---------- */

  function setupReveal() {
    const els = document.querySelectorAll('.reveal:not(.in)');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((e) => io.observe(e));
  }

  /* ---------- boot ---------- */

  if (body.dataset.page === 'home') {
    renderMainHeader();
    renderHome();
  } else {
    renderYear(Number(body.dataset.year));
  }
  renderFooter();
  setupReveal();
})();
