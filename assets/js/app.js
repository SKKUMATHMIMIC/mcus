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

  // 강연 종류 배지 — 기조강연(채움) / 초청강연(테두리)
  const KIND = { plenary: '기조강연', invited: '초청강연' };
  const kindBadge = (t) => (KIND[t.kind] ? `<span class="badge ${t.kind}">${KIND[t.kind]}</span>` : '');
  // 연사 한 줄: 이름 (영문) · 소속
  const whoLine = (t) =>
    `<span class="who"><b>${esc(t.ko)}</b>${t.en ? ` <span class="en">${esc(t.en)}</span>` : ''}${t.affil ? `<span class="aff">${esc(t.affil)}</span>` : ''}</span>`;

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
    // 모서리 한 곳에서 퍼져 나가는 점과 선 묶음 (S×S 크기의 SVG 하나)
    const cluster = (cls, S, ax, ay, n, reach, dirX, dirY) => {
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
      // 선 길이를 직접 계산해 dasharray 로 사용 (pathLength 를 지원하지 않는 브라우저에서도 매끄럽게)
      const lines = [...edges].map((k) => {
        const [i, j] = k.split('-').map(Number);
        const [p0, p1] = pts[i].t <= pts[j].t ? [pts[i], pts[j]] : [pts[j], pts[i]];
        const len = Math.hypot(p1.x - p0.x, p1.y - p0.y).toFixed(1);
        return `<line x1="${p0.x.toFixed(1)}" y1="${p0.y.toFixed(1)}" x2="${p1.x.toFixed(1)}" y2="${p1.y.toFixed(1)}" style="--l:${len};--d:${delay(p0.t)}s"/>`;
      });
      const dots = pts.map((pt) => `<circle class="${pt.big ? 'big' : ''}" cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="${pt.big ? 9 : (2 + rand() * 3).toFixed(1)}" style="--d:${(Number(delay(pt.t)) + 0.45).toFixed(2)}s"/>`);
      return `<svg class="net ${cls}" viewBox="0 0 ${S} ${S}" aria-hidden="true">${lines.join('')}${dots.join('')}</svg>`;
    };
    // 크기는 화면 너비로만 정해져서, 글꼴이 늦게 로드돼 높이가 바뀌어도 그림이 움직이지 않음
    return cluster('tr', 800, 820, -20, 30, 760, -1, 1) + (withLeft ? cluster('bl', 560, -20, 580, 18, 520, 1, -1) : '');
  }

  const svg = (d, w = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const icon = {
    pin: svg('<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    subway: svg('<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l-2-4M15 21l2-4"/>'),
    bus: svg('<rect x="4" y="3" width="16" height="15" rx="2"/><path d="M4 11h16M7 18v3M17 18v3"/>'),
    down: svg('<path d="M6 9l6 6 6-6"/>', 2.2),
    right: svg('<path d="M9 6l6 6-6 6"/>', 2.2),
    left: svg('<path d="M15 6l-6 6 6 6"/>', 2.2),
    building: svg('<path d="M4 21V6l8-3 8 3v15M4 21h16M9 21v-5h6v5M8 9h.01M12 9h.01M16 9h.01M8 12.5h.01M12 12.5h.01M16 12.5h.01"/>'),
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
    const ext = 'target="_blank" rel="noopener"';
    document.getElementById('site-footer').innerHTML = `
      <div class="wrap">
        <div class="f-main">
          <div class="f-brand">
            <a class="f-mark" href="index.html" aria-label="MCUS 소개">${wordmark()}</a>
            <p>학부생을 위한 수학 학술회<span>Mathematics Conference for Undergraduate Students</span></p>
            <div class="f-orgs">
              <a href="${esc(c.website)}" ${ext}><small>주최</small><img src="assets/img/mimic-logo-clear.png" alt="성균관대학교 수학과 학술동아리 MIMIC"></a>
              ${latest.support ? `<div><small>후원</small><img src="assets/img/skku-math-logo-clear.png" alt="${esc(latest.support)}"></div>` : ''}
            </div>
          </div>
          <nav class="f-col" aria-label="학술회">
            <h4>학술회</h4>
            <ul>
              <li><a href="index.html">MCUS 소개</a></li>
              ${yearsDesc.map((yr) => `<li><a href="${yr}.html">MCUS ${yr}</a>${phase(M.years[yr]).key === 'done' ? '' : '<span class="f-tag">개최 예정</span>'}</li>`).join('')}
            </ul>
          </nav>
          <div class="f-col">
            <h4>문의</h4>
            <ul>
              <li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>
              <li><a href="${esc(c.website)}" ${ext}>MIMIC 홈페이지 ↗</a></li>
              <li><a href="${esc(c.instagram)}" ${ext}>Instagram ↗</a></li>
              <li><a href="${esc(c.youtube)}" ${ext}>YouTube ↗</a></li>
            </ul>
          </div>
        </div>
        <div class="f-bottom">
          <span>© ${new Date().getFullYear()} MIMIC, Sungkyunkwan University</span>
          <button class="theme-toggle" type="button" id="theme-toggle"></button>
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
    const facts = [
      ['일시', y.dateLabel],
      ['장소', y.venueShort],
      ...y.overview.filter((r) => /대상/.test(r.label) && r.value).map((r) => [r.label.replace('주요 ', ''), r.value]),
      ['주최', y.host],
      ...(y.support ? [['후원', y.support]] : []),
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

  // 소개 페이지 '역대 학술회' — 연도 데이터로 자동 구성
  function renderHistory() {
    const el = document.getElementById('history');
    if (!el) return;
    const asc = [...yearsDesc].reverse();
    const cards = yearsDesc.map((yr) => {
      const y = M.years[yr];
      const p = phase(y);
      const stats = y.venue.building ? `자연과학캠퍼스 ${y.venue.building}` : '성균관대학교 자연과학캠퍼스';
      const tag = p.key === 'done' ? '' : `<span class="pill live">${p.key === 'live' ? '진행 중' : '개최 예정'}</span>`;
      return `<a class="hist-card reveal" href="${yr}.html">
        <span class="h-ord">제${asc.indexOf(yr) + 1}회</span>${tag}
        ${wordmark(yr, 'h-mark')}
        <span class="h-date">${esc(y.dateLabel)}</span>
        <span class="h-stats">${esc(stats)}</span>
        <span class="h-go">페이지 보기 <span class="arrow">→</span></span>
      </a>`;
    }).join('');
    el.innerHTML = `<div class="wrap">
      <div class="sec-title reveal"><h2>역대 학술회</h2><span>Conferences</span></div>
      <div class="hist-grid">${cards}</div>
    </div>`;
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

  // 개요 표(overview)에서 항목 찾기 — label 에 해당 단어가 들어간 행
  const ovRow = (y, re) => (y.overview || []).find((r) => re.test(r.label)) || {};

  /* 홈 — 첫 화면(개요 정보 포함), 학술회 소개, 기조 강연자, 장소 안내, 갤러리, Organizers */
  function viewHome(y) {
    const p = phase(y);
    const entries = talkEntries(y).filter((e) => isFilled(e.t));
    const plenary = entries.filter((e) => e.t.kind === 'plenary');
    const reg = y.registration;
    const regOpen = reg.open && reg.formUrl;

    const target = ovRow(y, /대상/);
    const fee = ovRow(y, /참가비/);
    const facts = [
      ['일시', y.dateLabel.replace(/^\d{4}\. /, ''), `${y.days.length}일간`],
      ['장소', placeHTML(y), esc(y.venue.campus), true],
      ['대상', target.value || '추후 안내', target.note || ''],
      ['참가비', fee.value || '추후 안내', fee.note || ''],
    ];

    const hero = `
      <section class="yhero net-hero">
        ${network(y.year)}
        <div class="wrap">
          ${p.key !== 'done' ? `<span class="pill live">개최 예정 ${ddayText(p)}</span>` : ''}
          ${wordmark(y.year, 'yhero-mark draw')}
          <h1>${esc(y.titleKo)}</h1>
          <p class="en">${esc(y.titleEn)}</p>
          <p class="host-line"><span>주최 <span class="sep">|</span> ${esc(y.host)}</span>${y.support ? `<span>후원 <span class="sep">|</span> ${esc(y.support)}</span>` : ''}</p>
          <div class="yhero-actions">
            ${regOpen ? `<a class="btn btn-royal" href="${esc(reg.formUrl)}" target="_blank" rel="noopener">참가 신청하기 <span class="arrow">→</span></a>` : ''}
            <a class="btn ${regOpen ? 'btn-ghost' : 'btn-royal'}" href="#schedule">일정 보기</a>
            <a class="btn btn-ghost" href="#abstract">초록 보기</a>
          </div>
        </div>
      </section>
      <div class="wrap"><dl class="glance-bar reveal">
        ${facts.map(([k, v, sub, html]) => `<div><dt>${k}</dt><dd><b>${html ? v : esc(v)}</b>${sub ? `<small>${html ? sub : esc(sub)}</small>` : ''}</dd></div>`).join('')}
      </dl></div>`;

    const speakers = `
      <div class="sec-title row"><div><h2>기조 강연자</h2><span>Plenary Speakers</span></div>${
        plenary.length > 1 ? `<div class="car-nav"><button type="button" class="car-btn" data-car="-1" aria-label="이전 연사">${icon.left}</button><button type="button" class="car-btn" data-car="1" aria-label="다음 연사">${icon.right}</button></div>` : ''
      }</div>
      ${
        plenary.length
          ? `<div class="car" data-carousel><div class="car-track">${plenary
              .map(
                (e) => `
            <article class="pcard">
              <div class="pc-photo">${e.t.photo ? `<img src="${esc(e.t.photo)}" alt="${esc(e.t.ko)}" loading="lazy">` : `<span>${esc(e.t.ko.slice(0, 1))}</span>`}</div>
              <div class="pc-body">
                <b>${esc(e.t.ko)}</b><span class="en">${esc(e.t.en)}</span>
                ${e.t.affil ? `<span class="aff">${esc(e.t.affil)}</span>` : ''}
                ${e.t.field ? `<p class="rf"><strong>Research field</strong>${esc(e.t.field)}</p>` : ''}
                <p class="ptalk"><span class="when">${esc(e.d.label)} ${esc(e.time)}</span>${esc(e.t.title)}</p>
              </div>
            </article>`
              )
              .join('')}</div></div>
            ${plenary.length > 1 ? `<div class="car-dots">${plenary.map((_, i) => `<button type="button" data-dot="${i}" aria-label="${i + 1}번째 연사"></button>`).join('')}</div>` : ''}`
          : '<div class="pempty">기조 강연자는 추후 공개됩니다.</div>'
      }`;

    // 학술회가 추구하는 바 (site.js 의 about, 모든 연도 공통)
    const ab = M.about || {};
    const intro = ab.title
      ? `<div class="y-intro reveal">
          <span class="eyebrow">About MCUS</span>
          <h2>${esc(ab.title)}</h2>
          <p>${esc(ab.text)}</p>
          <a class="more" href="index.html#about">MCUS 소개 더 보기 →</a>
        </div>`
      : '';

    // 장소 안내 (핵심만) — 자세한 내용은 #venue
    const sub = (M.directions || []).find((d) => d.kind === 'subway');
    const venue = `
      <div class="sec-title row"><div><h2>장소 안내</h2><span>Venue</span></div><a class="more" href="#venue">자세히 보기 →</a></div>
      <div class="v-home reveal">
        ${mapEmbed(y)}
        <div class="v-card">
          <span class="v-campus">${esc(y.venue.campus)}</span>
          <b class="v-place">${placeHTML(y)}</b>
          ${sub ? `<p class="v-way">${icon.subway}${esc(sub.text.replace(' 하차 후', ','))}</p>` : ''}
          <div class="v-links">${mapLinks(y)}</div>
        </div>
      </div>`;

    const gallery = y.gallery && y.gallery.length
      ? `
      <div class="sec-title row"><div><h2>갤러리</h2><span>Gallery</span></div><a class="more" href="#gallery">전체 보기 →</a></div>
      <div class="gal-strip">${y.gallery.slice(0, 3).map((g) => `<a class="reveal" href="#gallery"><img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy"></a>`).join('')}</div>`
      : '';

    const blocks = [intro, speakers, venue, gallery].filter(Boolean);
    blocks.push(organizersRow(y));
    return hero + blocks.map((b, i) => `<section class="section${i % 2 ? ' soft' : ''}"><div class="wrap">${b}</div></section>`).join('');
  }

  function organizersRow(y) {
    return `
      <div class="org-row">
        <h2>Organizers<small>주최 ${esc(y.host)}${y.support ? `<br>후원 ${esc(y.support)}` : ''}</small></h2>
        ${
          y.organizers.length
            ? `<ul>${y.organizers.map(([ko, en]) => `<li>${esc(ko)} <span>(${esc(en)})</span></li>`).join('')}</ul>`
            : '<p class="tba">조직위원 명단은 추후 공개됩니다.</p>'
        }
      </div>`;
  }

  /* 일정 — 시간표. 날짜를 나란히 놓고, 같은 시간대는 같은 줄에. 연사 이름과 주제만 */
  function viewSchedule(y) {
    const startOf = (t) => t.split('–')[0].trim();
    const toMin = (hm) => { const [h, m] = hm.split(':').map(Number); return h * 60 + (m || 0); };
    const starts = [...new Set(y.days.flatMap((d) => d.schedule.map((s) => startOf(s.time))))].sort((a, b) => toMin(a) - toMin(b));
    const n = y.days.length;

    const cell = (c, d, ref) => {
      if (!c) return '<td class="tt-empty"></td>';
      const at = c.time !== ref.time ? `<span class="tt-at">${esc(c.time)}</span>` : '';
      if (c.talk) {
        const t = d.talks[c.talk - 1] || {};
        if (!isFilled(t)) return `<td class="tt-c tbd">${at}<span class="tt-name">연사 추후 공개</span></td>`;
        // 색으로 구분하고, 글자 표시는 기조강연만
        const tag = t.kind === 'plenary' ? `<span class="tt-tag">${KIND.plenary}</span>` : '';
        return `<td class="tt-c ${esc(t.kind || '')}">${at}${tag}<span class="tt-name">${esc(t.ko)}</span>${t.title ? `<span class="tt-title">${esc(t.title)}</span>` : ''}</td>`;
      }
      if (c.kind === 'lightning') {
        const lt = d.lightning || [];
        return `<td class="tt-c lt">${at}<span class="tt-tag">Lightning Talk</span><span class="tt-title">${lt.length ? lt.map((l) => esc(l.name)).join(', ') : '연사 모집 예정'}</span></td>`;
      }
      return `<td class="tt-c sep ${esc(c.kind || '')}">${at}<span class="tt-name">${esc(c.label)}</span></td>`;
    };

    const rows = starts.map((st) => {
      const cells = y.days.map((d) => d.schedule.find((s) => startOf(s.time) === st) || null);
      const ref = cells.find(Boolean);
      const [from, to] = ref.time.split('–').map((x) => (x || '').trim());
      const th = `<th class="tt-time" scope="row"><b>${esc(from)}</b>${to ? `<span>${esc(to)}</span>` : ''}</th>`;
      // 모든 날짜에 같은 휴식이 있으면 한 줄로 합침
      const shared = n > 1 && cells.every((c) => c && !c.talk && c.kind === 'break' && c.label === ref.label && c.time === ref.time);
      if (shared) return `<tr class="tt-band">${th}<td colspan="${n}">${esc(ref.label)}</td></tr>`;
      return `<tr>${th}${cells.map((c, di) => cell(c, y.days[di], ref)).join('')}</tr>`;
    });

    const head = y.days
      .map((d, di) => `<th scope="col"><span>DAY ${di + 1}</span><b>${esc(d.label)}</b>${d.chairs && d.chairs.length ? `<small>Chair: ${esc(d.chairs.join(', '))}</small>` : ''}</th>`)
      .join('');

    return `
      <section class="section tt"><div class="wrap">
        <p class="tt-legend"><span class="sw plenary"></span>기조강연<span class="sw invited"></span>초청강연</p>
        <div class="tt-scroll reveal">
          <table class="tt-table" style="--days:${n}">
            <thead><tr><th class="tt-corner" aria-label="시간"></th>${head}</tr></thead>
            <tbody>${rows.join('')}</tbody>
          </table>
        </div>
      </div></section>`;
  }

  /* 초록 — 시간 순서대로, 누르면 초록이 펼쳐지는 목록 */
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
                return `<div class="acc-row tbd" id="${id}"><span class="acc-time">${esc(s.time)}</span><span class="acc-head"><span class="no">Talk ${s.talk}</span><b>추후 공개</b></span><span></span></div>`;
              }
              return `
                <details class="acc-item" id="${id}">
                  <summary>
                    <span class="acc-time">${esc(s.time)}</span>
                    <span class="acc-head">
                      <span class="no">Talk ${s.talk}${kindBadge(t)}</span>
                      <span class="t">${or(t.title)}</span>
                      ${whoLine(t)}
                    </span>
                    <span class="acc-chev">${icon.down}</span>
                  </summary>
                  <div class="acc-body"><div class="abstract">${t.abstract ? paras(t.abstract) : '<p class="tba">초록 추후 공개</p>'}</div></div>
                </details>`;
            }
            if (s.kind === 'lightning') {
              const lt = d.lightning || [];
              if (!lt.length) return `<div class="acc-row tbd" id="d${di + 1}-lt"><span class="acc-time">${esc(s.time)}</span><span class="acc-head"><span class="no">Lightning Talk</span><b>연사 추후 공개</b></span><span></span></div>`;
              return `
                <details class="acc-item" id="d${di + 1}-lt">
                  <summary>
                    <span class="acc-time">${esc(s.time)}</span>
                    <span class="acc-head"><span class="no">Lightning Talk</span><span class="t">${lt.map((l) => esc(l.name)).join(', ')}</span></span>
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
            <p>문의: <a href="mailto:${esc(M.contact.email)}">${esc(M.contact.email)}</a>${y.kakao ? `, <a href="${esc(y.kakao)}" target="_blank" rel="noopener">MCUS 오픈채팅</a>` : ''}</p>
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
    return `
      <section class="section"><div class="wrap">
        ${mapEmbed(y, 'wide reveal')}
        <div class="venue">
        <div class="card reveal">
          <span class="v-campus">${esc(v.campus)}</span>
          <h3>${placeHTML(y)}</h3>
          <p class="addr">${esc(v.address)}</p>
          <dl class="rooms">${v.rooms.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${or(val, '추후 안내')}</dd></div>`).join('')}</dl>
          <div class="map-links">${mapLinks(y)}</div>
        </div>
        <div class="card reveal">
          <h3 style="margin-bottom:16px">찾아오시는 길</h3>
          <div class="directions">
            ${M.directions.map((dd) => `<div><span class="ico">${icon[dd.kind] || icon.pin}</span><span><b>${esc(dd.label)}</b><p>${esc(dd.text).replace(/\n/g, '<br>')}</p></span></div>`).join('')}
          </div>
        </div>
        </div>
      </div></section>`;
  }

  // 장소 한 줄: 건물 + 강의실 번호(칩으로 강조). 건물이 정해지지 않았으면 안내 문구
  function placeHTML(y) {
    const v = y.venue;
    const room = (v.rooms || []).find((r) => r[1]);
    if (!v.building) return '세부 장소 추후 안내';
    return `${esc(v.building)}${room ? ` <span class="room">${esc(room[1])}</span>` : ''}`;
  }

  // 지도 바로가기 — 건물이 정해졌으면 건물로, 아니면 캠퍼스로
  function mapLinks(y) {
    const v = y.venue;
    const q = encodeURIComponent(v.mapQuery || '성균관대학교 자연과학캠퍼스');
    const campus = `${M.campusMap}${v.buildNo ? `&buildNo=${encodeURIComponent(v.buildNo)}` : ''}`;
    const ext = 'target="_blank" rel="noopener"';
    return `<a class="chip" href="${esc(campus)}" ${ext}>캠퍼스 맵 ↗</a><a class="chip" href="https://map.naver.com/p/search/${q}" ${ext}>네이버 지도 ↗</a><a class="chip" href="https://map.kakao.com/?q=${q}" ${ext}>카카오맵 ↗</a>`;
  }

  // 구글 지도 (API 키 없이 쓰는 embed). venue.mapQuery 가 없으면 캠퍼스 전체
  function mapEmbed(y, cls = '') {
    const q = y.venue.mapQuery || '성균관대학교 자연과학캠퍼스';
    const zoom = y.venue.mapQuery ? 17 : 16;
    return `<div class="map-embed ${cls}"><iframe src="https://www.google.com/maps?q=${encodeURIComponent(q)}&z=${zoom}&hl=ko&output=embed" title="${esc(q)} 지도" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div>`;
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

    // 홈: 기조 강연자 넘겨 보기
    const car = document.querySelector('[data-carousel]');
    if (car) {
      const track = car.querySelector('.car-track');
      const cards = [...track.children];
      const btns = [...document.querySelectorAll('[data-car]')];
      const dots = [...document.querySelectorAll('[data-dot]')];
      const step = () => (cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth);
      const update = () => {
        const max = track.scrollWidth - track.clientWidth;
        const scrollable = max > 4;
        btns.forEach((b) => { b.hidden = !scrollable; });
        const visible = Math.max(1, Math.round(track.clientWidth / step()));
        dots.forEach((d, k) => { d.hidden = !scrollable || k > cards.length - visible; });
        if (!scrollable) return;
        btns[0].disabled = track.scrollLeft <= 4;
        btns[1].disabled = track.scrollLeft >= max - 4;
        const i = Math.round(track.scrollLeft / step());
        dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
      };
      btns.forEach((b) => b.addEventListener('click', () => track.scrollBy({ left: Number(b.dataset.car) * step(), behavior: 'smooth' })));
      dots.forEach((d) => d.addEventListener('click', () => track.scrollTo({ left: Number(d.dataset.dot) * step(), behavior: 'smooth' })));
      track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
      // 다른 탭으로 갔다 와도 resize 리스너가 쌓이지 않도록 하나만 유지
      if (window.__mcusCarResize) window.removeEventListener('resize', window.__mcusCarResize);
      window.__mcusCarResize = update;
      window.addEventListener('resize', update);
      update();
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
    renderHistory();
  } else {
    renderYear(Number(body.dataset.year));
  }
  renderFooter();
  setupReveal();
})();
