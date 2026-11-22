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
      <path d="M8 80V8H108"/><path d="M37 8V58"/><path d="M68 8V80H213V44H176V8H252"/><path d="M124 8V80"/><path d="M161 8V80"/>
      ${yr}
    </svg>`;
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

  const yearLinks = (current) =>
    yearsDesc
      .map((yr) => {
        const dot = phase(M.years[yr]).key !== 'done' ? '<span class="nav-new" aria-hidden="true"></span>' : '';
        return `<a href="${yr}.html"${current === yr ? ' aria-current="page"' : ''}><span class="nav-long">MCUS </span>${yr}${dot}</a>`;
      })
      .join('');

  function renderMainHeader() {
    const el = document.getElementById('site-header');
    el.innerHTML = `
      <div class="wrap bar">
        <a class="brand" href="index.html" aria-label="MCUS 홈">${wordmark()}<span>학부생을 위한<br>수학 학술회</span></a>
        <nav class="site-nav" aria-label="주요 메뉴">
          <a href="index.html" aria-current="page">소개</a>
          ${yearLinks()}
        </nav>
      </div>`;
  }

  // 연도 페이지: 로고 · 연도 선택 · 그 해의 메뉴 (기존 사이트 구성)
  function renderYearHeader(y, routes) {
    const el = document.getElementById('site-header');
    el.classList.add('has-year');
    el.innerHTML = `
      <div class="wrap bar">
        <div class="brand-group">
          <a class="brand" href="index.html" aria-label="MCUS 소개로">${wordmark()}</a>
          <details class="yr-switch">
            <summary>MCUS ${y.year} ${icon.down}</summary>
            <div class="menu">
              ${yearsDesc.map((yr) => `<a href="${yr}.html"${yr === y.year ? ' aria-current="page"' : ''}>MCUS ${yr}${phase(M.years[yr]).key !== 'done' ? ' · 개최 예정' : ''}</a>`).join('')}
              <hr>
              <a href="index.html">MCUS 소개</a>
            </div>
          </details>
        </div>
        <nav class="site-nav" aria-label="MCUS ${y.year} 메뉴">
          ${routes.map(([key, label]) => `<a href="#${key}" data-route="${key}">${label}</a>`).join('')}
        </nav>
      </div>`;
    const sw = el.querySelector('.yr-switch');
    document.addEventListener('click', (e) => { if (!sw.contains(e.target)) sw.open = false; });
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

  // 상단에 가장 최근 학술회로 가는 링크 한 줄
  function renderHome() {
    const el = document.getElementById('next-link');
    if (!el) return;
    const p = phase(latest);
    el.href = `${latest.year}.html`;
    el.innerHTML = `<span class="tag">${p.key === 'done' ? '최근 학술회' : '다가오는 학술회'}</span><b>MCUS ${latest.year}</b><span>${esc(latest.dateLabel)}</span>${p.key !== 'done' ? `<span class="dday">${ddayText(p)}</span>` : ''}<span class="arrow">→</span>`;
    el.hidden = false;
  }

  /* ==========================================================
     연도 페이지 — 한 파일 안에서 #home, #schedule, #abstract … 로 이동
     ========================================================== */

  function yearRoutes(y) {
    return [
      ['home', '홈', 'Home'],
      ['overview', '개요', 'Overview'],
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

    const views = { home: viewHome, overview: viewOverview, schedule: viewSchedule, abstract: viewAbstract, registration: viewRegistration, venue: viewVenue, gallery: viewGallery };

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
      app.innerHTML = head + views[rk](y) + pager(y, rk);
      setupView(y, rk, arg);
      setupReveal();
    }

    window.addEventListener('hashchange', route);
    route();
  }

  function pager(y, rk) {
    if (rk !== 'home') return '';
    const idx = yearsDesc.indexOf(y.year);
    const newer = yearsDesc[idx - 1];
    const older = yearsDesc[idx + 1];
    return `
      <section class="section tight"><div class="wrap year-pager">
        ${older ? `<a class="card" href="${older}.html"><small>← 이전 학술회</small><b>MCUS ${older}</b></a>` : ''}
        ${newer ? `<a class="card next" href="${newer}.html"><small>다음 학술회 →</small><b>MCUS ${newer}</b></a>` : ''}
      </div></section>`;
  }

  function regAction(y) {
    const reg = y.registration;
    return reg.open && reg.formUrl ? { href: reg.formUrl, ext: true } : { href: '#registration', ext: false };
  }

  /* 홈 */
  function viewHome(y) {
    const p = phase(y);
    const ra = regAction(y);
    const quick = [
      ['참가 신청', ra.href, ra.ext],
      ...(y.kakao ? [['MCUS 오픈채팅', y.kakao, true]] : []),
      ['일정', '#schedule', false],
      ['초록', '#abstract', false],
      ['장소 안내', '#venue', false],
    ];
    const plenary = talkEntries(y).filter((e) => isFilled(e.t) && e.t.kind === 'plenary');

    const slides = plenary
      .map(
        (e) => `
        <a class="pslide" href="#abstract/${e.id}">
          ${e.t.photo ? `<img src="${esc(e.t.photo)}" alt="${esc(e.t.ko)}">` : `<span class="ph" aria-hidden="true">${esc(e.t.ko.slice(0, 1))}</span>`}
          <div>
            <b>${esc(e.t.ko)} <span>(${esc(e.t.en)})</span></b>
            ${e.t.affil ? `<span class="aff">${esc(e.t.affil)}</span>` : ''}
            ${e.t.field ? `<dl class="rf"><dt>Research field</dt><dd>${esc(e.t.field)}</dd></dl>` : ''}
            <span class="ptalk">${esc(e.t.title)}</span>
            <span class="go">초록 보기 →</span>
          </div>
        </a>`
      )
      .join('');

    return `
      <section class="lhero">
        <div class="wrap">
          ${p.key !== 'done' ? `<span class="pill live">개최 예정 · ${ddayText(p)}</span>` : ''}
          <p class="en">${esc(y.titleEn)}</p>
          <h1>${esc(y.titleKo)}</h1>
          <p class="when">${esc(y.dateLabel)}<span class="sep">|</span>${esc(y.venueShort)}</p>
        </div>
      </section>
      <section class="quick" aria-label="Quick Menus">
        <div class="wrap">
          <h2>Quick Menus</h2>
          <nav>${quick.map(([label, href, ext]) => `<a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`).join('')}</nav>
        </div>
      </section>
      <section class="section"><div class="wrap home-cols">
        <div class="reveal">
          <h2 class="col-title">개요 <span>Overview</span></h2>
          ${overviewCard(y)}
        </div>
        <div class="reveal">
          <h2 class="col-title">기조 강연자 <span>Plenary Speakers</span></h2>
          ${
            plenary.length
              ? `<div class="pslider">
                  <div class="ptrack">${slides}</div>
                  ${
                    plenary.length > 1
                      ? `<div class="pnav">
                          <button class="arrow-btn" type="button" data-dir="-1" aria-label="이전 연사">${icon.left}</button>
                          <div class="pdots">${plenary.map((e, i) => `<button type="button" data-i="${i}" aria-label="${esc(e.t.ko)}"${i === 0 ? ' aria-current="true"' : ''}></button>`).join('')}</div>
                          <button class="arrow-btn" type="button" data-dir="1" aria-label="다음 연사">${icon.right}</button>
                        </div>`
                      : ''
                  }
                </div>`
              : '<div class="pempty">기조 강연자는 추후 공개됩니다.</div>'
          }
        </div>
      </div></section>
      <section class="section soft"><div class="wrap">${organizersRow(y)}</div></section>`;
  }

  function overviewCard(y) {
    return `
      <div class="ov-card">
        ${wordmark(y.year, 'ov-mark')}
        <p class="ov-sub">Mathematics Conference for Undergraduate Students</p>
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

  /* 개요 */
  function viewOverview(y) {
    const entries = talkEntries(y).filter((e) => isFilled(e.t));
    const nP = entries.filter((e) => e.t.kind === 'plenary').length;
    const nI = entries.filter((e) => e.t.kind === 'invited').length;
    const nL = allLightning(y).length;
    return `
      <section class="section"><div class="wrap ov-wide">
        <div class="reveal">${overviewCard(y)}</div>
        <div class="card glance reveal">
          <div><div class="n">${y.days.length}<small>일</small></div><div class="k">${esc(y.dateLabel)}</div></div>
          <div><div class="n">${entries.length || '<span class="tba">TBA</span>'}<small>${entries.length ? '강연' : ''}</small></div><div class="k">${entries.length ? [nP && `기조강연 ${nP}`, nI && `초청강연 ${nI}`].filter(Boolean).join(' · ') || '학생 · 연구자 강연' : '강연 라인업 추후 공개'}</div></div>
          <div><div class="n">${nL || '<span class="tba">TBA</span>'}<small>${nL ? 'Lightning Talks' : ''}</small></div><div class="k">${nL ? '짧고 가볍게 나누는 학부생 발표' : 'Lightning Talk 연사 모집 예정'}</div></div>
        </div>
      </div></section>
      <section class="section soft"><div class="wrap">${organizersRow(y)}</div></section>`;
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
    // 기조 강연자 슬라이더
    const track = document.querySelector('.ptrack');
    if (track) {
      const dots = [...document.querySelectorAll('.pdots button')];
      const go = (i) => track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });
      const curIdx = () => Math.round(track.scrollLeft / track.clientWidth);
      dots.forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.i))));
      document.querySelectorAll('.pnav .arrow-btn').forEach((b) =>
        b.addEventListener('click', () => {
          const n = dots.length;
          go((curIdx() + Number(b.dataset.dir) + n) % n);
        })
      );
      track.addEventListener('scroll', () => {
        const i = curIdx();
        dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
      }, { passive: true });
    }

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
