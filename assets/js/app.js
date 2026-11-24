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

  // 마감일(until)까지 남은 날 — 지났으면 -1 이하
  function daysLeft(s) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((parseDate(s) - today) / 86400000);
  }
  // '2026-11-29' → '11. 29. (일)'
  const mdLabel = (s) => {
    const d = parseDate(s);
    return `${d.getMonth() + 1}. ${d.getDate()}. (${'일월화수목금토'[d.getDay()]})`;
  };
  const dLabel = (n) => (n === 0 ? 'D-DAY' : `D-${n}`);

  // 날짜 탭 — 초록과 (모바일) 일정에서 같이 씀. 고른 날짜는 다른 화면으로 옮겨도 유지
  // 처음에는 학술회 당일이면 그날, 아니면 첫째 날
  const daySel = {};
  function dayIndex(y, arg) {
    const m = /^d(\d+)-/.exec(arg || '');
    if (m && y.days[m[1] - 1]) return (daySel[y.year] = m[1] - 1);
    if (daySel[y.year] != null) return daySel[y.year];
    const t = new Date();
    const iso = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    return Math.max(0, y.days.findIndex((d) => d.date === iso));
  }
  const dayBar = (y, cur) =>
    y.days.length > 1
      ? `<div class="day-anchor"></div><div class="day-bar"><div class="wrap"><div class="day-tabs" role="tablist" aria-label="날짜 선택">${y.days
          .map((d, i) => `<button type="button" role="tab" data-day="${i}" aria-selected="${i === cur}"><span>DAY ${i + 1}</span><b>${esc(d.label)}</b></button>`)
          .join('')}</div></div></div>`
      : '';
  // 날짜별 좌장 (초록 · 모바일 일정)
  const chairLine = (d, inline) => {
    const c = `<span class="chair"><b>Chair</b>${d.chairs && d.chairs.length ? esc(d.chairs.join(', ')) : '추후 공개'}</span>`;
    return inline ? c : `<div class="day-head">${c}</div>`;
  };
  const dayHidden = (y, i, cur) => (y.days.length > 1 && i !== cur ? ' hidden' : '');

  // 마감 전인 신청 블록 중 홈에 알릴 것 (registration.blocks 의 notice)
  const activeNotices = (y) =>
    (y.registration.blocks || []).filter((b) => b.notice && b.until && daysLeft(b.until) >= 0);

  // 홈 알림 띠 — base: 다른 페이지에서 연결할 때 앞에 붙일 주소 (예: '2027.html')
  const noticeBar = (y, base = '') =>
    activeNotices(y)
      .map((b) => {
        const n = daysLeft(b.until);
        return `<a class="notice" href="${base}#registration${b.id ? `/${esc(b.id)}` : ''}">
          <span class="n-tag">모집 중</span>
          <b>${esc(b.notice)}</b>
          <span class="n-due">${esc(mdLabel(b.until))}까지 · ${dLabel(n)}</span>
          <span class="arrow" aria-hidden="true">→</span>
        </a>`;
      })
      .join('');

  // 제목·초록 속 수식 — 데이터에 \( … \) (문장 속) 또는 \[ … \] (별도 줄) 로 쓰면 KaTeX 로 렌더링
  // (JS 문자열 안에서는 역슬래시를 두 번: '\\(L\\)-function at \\(s=1\\)')
  function typeset(el) {
    if (!window.renderMathInElement) return; // KaTeX 를 불러오지 못하면 원문 그대로
    window.renderMathInElement(el, {
      delimiters: [
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false },
      ],
      throwOnError: false,
    });
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
    // 아래쪽은 서서히 사라지게 (.net-layer 마스크) — 첫 화면 아래 끝에서 선이 뚝 잘려 보이지 않도록
    return `<div class="net-layer" aria-hidden="true">${cluster('tr', 800, 820, -20, 30, 760, -1, 1)}${withLeft ? cluster('bl', 560, -20, 580, 18, 520, 1, -1) : ''}</div>`;
  }

  const svg = (d, w = 2) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const icon = {
    cal: svg('<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
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
          <nav class="yr-list" aria-label="연도별 학술회">
            ${yearsDesc.map((yr) => `<a href="${yr}.html"${yr === y.year ? ' aria-current="page"' : ''}>MCUS ${yr}</a>`).join('')}
          </nav>
          <details class="drop yr-pick">
            <summary aria-label="다른 연도 학술회 보기">MCUS ${y.year}${icon.down}</summary>
            <div class="menu">
              ${yearsDesc
                .map((yr) => {
                  const yy = M.years[yr];
                  const up = phase(yy).key !== 'done';
                  return `<a href="${yr}.html"${yr === y.year ? ' aria-current="page"' : ''}><b>MCUS ${yr}</b>${up ? '<span class="tag">개최 예정</span>' : ''}<small>${esc(yy.dateLabel)}</small></a>`;
                })
                .join('')}
            </div>
          </details>
        </div>
      </div>`);
    closeOnOutside(document.querySelector('.yr-pick'));
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
              <li class="f-mail"><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>
              <li><a href="${esc(c.website)}" ${ext}>MIMIC 홈페이지 ↗</a></li>
              <li><a href="${esc(c.instagram)}" ${ext}>Instagram ↗</a></li>
              <li><a href="${esc(c.youtube)}" ${ext}>YouTube ↗</a></li>
            </ul>
          </div>
        </div>
        <div class="f-bottom">
          <span>© ${new Date().getFullYear()} MIMIC, Sungkyunkwan University</span>
        </div>
      </div>`;
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
      ...y.overview.filter((r) => /대상/.test(r.label) && r.value).map((r) => [r.label, r.value]),
      ['주최', y.host],
      ...(y.support ? [['후원', y.support]] : []),
    ];
    let i = 0;
    const rise = () => `class="rise" style="--i:${i++}"`;
    el.innerHTML = network(11, false) + `
      <div class="wrap up-grid">
        <div>
          ${activeNotices(y).length ? `<div class="notices rise" style="--i:${i++}">${noticeBar(y, `${y.year}.html`)}</div>` : ''}
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
      const room = (y.venue.rooms || []).find((r) => /진행/.test(r[0]));
      const stats = y.venue.building ? `자연과학캠퍼스 ${[y.venue.building, room && room[1]].filter(Boolean).join(' ')}` : '성균관대학교 자연과학캠퍼스';
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
      // 참가 신청은 아직 열리지 않았거나 진행 전인 해에만
      ...(phase(y).key === 'done' ? [] : [['registration', '참가 신청', 'Registration']]),
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
      app.innerHTML = head + views[rk](y, arg);
      typeset(app);
      startNet();
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
    // 일시 · 장소는 제목 아래 크게, 나머지(주최 · 후원 · 대상 · 참가비)는 첫 화면 맨 아래 작게
    // 참가 대상 / 참가비 는 한 줄씩 조금 크게, 주최 · 후원은 마지막 한 줄에 작게
    const metaRow = (cls, rows) => {
      const r = rows.filter(([, v]) => v);
      return r.length ? `<div class="${cls}">${r.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</div>` : '';
    };
    const meta =
      metaRow('m-main', [['참가 대상', target.value]]) +
      metaRow('m-main', [['참가비', [fee.value, fee.note].filter(Boolean).join(' · ')]]) +
      metaRow('m-org', [['주최', y.host], ['후원', y.support]]);
    const dateHtml = esc(y.dateLabel).replace(/\((.)\)/g, '<span class="dow">($1)</span>');

    const hero = `
      <section class="yhero net-hero${!activeNotices(y).length && p.key === 'done' ? ' bare' : ''}">
        ${network(7)}
        <div class="wrap">
          ${activeNotices(y).length ? `<div class="notices">${noticeBar(y)}</div>` : ''}
          ${p.key !== 'done' ? `<span class="pill live">개최 예정 ${ddayText(p)}</span>` : ''}
          ${wordmark(y.year, 'yhero-mark draw')}
          <h1>${esc(y.titleKo)}</h1>
          <p class="en">${esc(y.titleEn)}</p>
          <div class="yhero-when">
            <p class="w-date">${dateHtml}</p>
            <p class="w-place">${esc(placeText(y))}</p>
          </div>
          <div class="yhero-actions">
            ${regOpen ? `<a class="btn btn-royal" href="${esc(reg.formUrl)}" target="_blank" rel="noopener">참가 신청하기 <span class="arrow">→</span></a>` : ''}
            <a class="btn ${regOpen ? 'btn-ghost' : 'btn-royal'}" href="#schedule">일정 보기</a>
            <a class="btn btn-ghost" href="#abstract">초록 보기</a>
          </div>
          <dl class="yhero-meta">${meta}</dl>
        </div>
      </section>`;

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
                <p class="ptalk"><span class="when">${esc(e.d.label)} ${esc(e.time)}</span>${e.t.title ? esc(e.t.title) : '<em class="tba">강연 제목 추후 공개</em>'}</p>
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
        <div class="v-card">
          <div>
            <b class="v-place">${esc(placeText(y))}</b>
            ${sub ? `<p class="v-way">${icon.subway}${esc(sub.text.replace(' 하차 후', ','))}</p>` : ''}
          </div>
          <div class="v-links">${mapLinks(y)}</div>
        </div>
      </div>`;

    const gallery = y.gallery && y.gallery.length
      ? `
      <div class="sec-title row"><div><h2>갤러리</h2><span>Gallery</span></div><a class="more" href="#gallery">전체 보기 →</a></div>
      <a class="gal-one reveal" href="#gallery"><img src="${esc(y.gallery[0].src)}" alt="${esc(y.gallery[0].alt)}" loading="lazy"></a>`
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

  /* 일정 — 시간표. 날짜를 나란히 놓고, 각 일정은 시작부터 끝 시간까지 세로로 이어짐 */
  function viewSchedule(y, arg) {
    const toMin = (hm) => { const [h, m] = hm.split(':').map(Number); return h * 60 + (m || 0); };
    const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
    const n = y.days.length;

    // 날짜별 일정: 시작, 끝(분). 끝이 없으면 같은 날 다음 일정 시작까지
    const days = y.days.map((d) => {
      const evs = d.schedule
        .map((s) => {
          const [a, b] = s.time.split('–').map((x) => (x || '').trim());
          return { s, d, from: toMin(a), to: b ? toMin(b) : null };
        })
        .sort((p, q) => p.from - q.from);
      evs.forEach((e, i) => { if (e.to == null && evs[i + 1]) { e.to = evs[i + 1].from; e.soft = true; } });
      return evs;
    });
    const all = days.flat();
    const tail = Math.max(...all.map((e) => e.to ?? e.from)) + 30; // 끝 시간 미정(만찬 등)인 마지막 칸
    all.forEach((e) => { if (e.to == null) { e.to = tail; e.open = true; } });
    const bounds = [...new Set(all.flatMap((e) => [e.from, e.to]))].sort((p, q) => p - q);
    const rowOf = (m) => bounds.indexOf(m);

    // 시간 비례 — 1분 = PPM px. 강연·포스터 등이 있는 구간은 길이에 비례하고,
    // 휴식(점심·커피 브레이크·등록)만 있거나 아무 일정도 없는 구간은 작게 둠
    const PPM = 3;
    const GAP = 6; // 칸 사이 세로 간격 — CSS 의 .tt-table border-spacing 세로값과 같게
    const isBreak = (e) => !e.s.talk && (e.s.kind || 'break') === 'break';
    const fixed = bounds.slice(0, -1).map((b, r) => all.some((e) => !isBreak(e) && e.from <= b && e.to >= bounds[r + 1]));
    // 행 높이에서 간격을 빼 두면, 여러 행에 걸친 칸도 (분 × PPM − GAP) 로 정확히 비례
    const rowStyle = (r) => (fixed[r] ? ` style="height:${(bounds[r + 1] - bounds[r]) * PPM - GAP}px"` : '');

    // 칸 높이에 맞춘 내용 배치 — 글자 높이(px)는 CSS 의 .tt-at / .tt-name / .tt-title 과 맞춤
    const LH = { pad: 26, at: 20, name: 22, title: 19.5 };
    function fit(e, r, span, hasTitle) {
      for (let k = r; k < r + span; k++) if (!fixed[k]) return null; // 비례 구간이 아니면 내용대로
      const avail = (e.to - e.from) * PPM - GAP - LH.pad;
      // 시간을 이름 위 한 줄로 둘 자리가 없거나, 그러면 제목이 한 줄도 안 들어가면 → 시간을 이름 앞에 나란히
      let tight = avail < LH.at + LH.name;
      let lines = Math.floor((avail - (tight ? 0 : LH.at) - LH.name - 3) / LH.title);
      if (hasTitle && lines < 1 && !tight) {
        tight = true;
        lines = Math.floor((avail - LH.name - 3) / LH.title);
      }
      return { avail: Math.floor(avail), tight, lines: Math.max(0, lines) };
    }
    const cellTitle = (e) => {
      if (e.s.talk) { const t = e.d.talks[e.s.talk - 1] || {}; return t.title || ''; }
      if (e.s.kind === 'lightning') return (e.d.lightning || []).map((l) => l.name).join(', ');
      return e.s.note || '';
    };

    const kindOf = (e) => (e.s.talk ? (e.d.talks[e.s.talk - 1] || {}).kind || 'talk' : e.s.kind || 'break');
    const timeText = (e) => `${fmt(e.from)}${e.open ? ' –' : e.soft ? ' –' : ` – ${fmt(e.to)}`}`;

    // 칸 내용: 시간(작게), 이름(크게), 제목/설명(작게). 강연 종류는 칸 색으로 구분
    const cellBody = (e) => {
      const at = `<span class="tt-at">${timeText(e)}</span>`;
      if (e.s.talk) {
        const t = e.d.talks[e.s.talk - 1] || {};
        if (!isFilled(t)) return `${at}<span class="tt-name tbd">연사 추후 공개</span>`;
        const aff = t.affil ? `<small class="tt-aff">${esc(t.affil)}</small>` : '';
        return `${at}<span class="tt-name${aff ? ' has-aff' : ''}">${esc(t.ko)}${aff}</span>${t.title ? `<span class="tt-title">${esc(t.title)}</span>` : ''}`;
      }
      if (e.s.kind === 'lightning') {
        const lt = e.d.lightning || [];
        return `${at}<span class="tt-name">${esc(e.s.label)}</span>${lt.length ? `<span class="tt-title">${lt.map((l) => esc(l.name)).join(', ')}</span>` : ''}`;
      }
      return `${at}<span class="tt-name">${esc(e.s.label)}</span>${e.s.note ? `<span class="tt-title">${esc(e.s.note)}</span>` : ''}`;
    };

    // 표 만들기: 각 칸은 rowspan 으로 시작~끝 시간만큼 이어짐
    const covered = days.map(() => new Set());
    const rows = [];
    for (let r = 0; r < bounds.length - 1; r++) {
      const starts = days.map((evs) => evs.find((e) => rowOf(e.from) === r) || null);
      const anyStart = starts.some(Boolean);
      const th = `<th class="tt-time" scope="row">${anyStart ? `<b>${fmt(bounds[r])}</b>` : ''}</th>`;
      const first = starts.find(Boolean);
      // 모든 날짜에 똑같은 휴식이 같은 시간에 있으면 한 칸으로 합침
      const shared = n > 1 && starts.every((e) => e && !e.s.talk && e.s.kind === 'break' && e.s.label === first.s.label && e.from === first.from && e.to === first.to);
      if (shared) {
        const span = rowOf(first.to) - r;
        days.forEach((_, di) => { for (let k = r; k < r + span; k++) covered[di].add(k); });
        rows.push(`<tr${rowStyle(r)}>${th}<td class="tt-c sep band" colspan="${n}" rowspan="${span}"><span class="tt-name">${esc(first.s.label)}</span><span class="tt-at">${timeText(first)}</span></td></tr>`);
        continue;
      }
      const tds = days.map((evs, di) => {
        if (covered[di].has(r)) return '';
        const e = starts[di];
        if (e) {
          const span = rowOf(e.to) - r;
          for (let k = r; k < r + span; k++) covered[di].add(k);
          const k = kindOf(e);
          const cls = e.s.talk ? k : k === 'break' ? 'sep' : `sep ${k}`;
          const full = cellTitle(e);
          const f = fit(e, r, span, Boolean(full));
          if (!f) return `<td class="tt-c ${esc(cls)}" rowspan="${span}">${cellBody(e)}</td>`;
          const more = `${f.tight ? ' tight' : ''}${f.lines ? '' : ' notitle'}`;
          return `<td class="tt-c ${esc(cls)}${more}" rowspan="${span}" style="--lines:${f.lines}"${full ? ` title="${esc(full)}"` : ''}><div class="tt-in" style="max-height:${f.avail}px">${cellBody(e)}</div></td>`;
        }
        // 빈 시간: 다음 일정이 시작될 때까지 하나로 묶음
        let k = r;
        while (k < bounds.length - 1 && !covered[di].has(k) && !evs.some((x) => rowOf(x.from) === k && k !== r)) k++;
        const span = Math.max(1, k - r);
        for (let q = r; q < r + span; q++) covered[di].add(q);
        return `<td class="tt-empty" rowspan="${span}"></td>`;
      });
      rows.push(`<tr class="${anyStart ? '' : 'tt-gap'}"${rowStyle(r)}>${th}${tds.join('')}</tr>`);
    }

    const head = y.days
      .map((d, di) => `<th scope="col"><span>DAY ${di + 1}</span><b>${esc(d.label)}</b>${d.chairs && d.chairs.length ? `<small>Chair: ${esc(d.chairs.join(', '))}</small>` : ''}</th>`)
      .join('');

    // 범례: 이 해에 실제로 있는 종류만
    const has = (fn) => all.some(fn);
    const legend = [
      has((e) => kindOf(e) === 'plenary') && ['plenary', '기조강연'],
      has((e) => kindOf(e) === 'invited') && ['invited', '초청강연'],
      has((e) => e.s.kind === 'poster') && ['poster', '포스터 세션'],
      has((e) => e.s.kind === 'lightning') && ['lt', '라이트닝 토크'],
      has((e) => e.s.kind === 'social') && ['social', '만찬'],
      ['rest', '휴식'],
    ].filter(Boolean);

    // 모바일: 날짜를 골라 보는 세로 목록 (시간 · 일정). 강연은 누르면 초록으로
    const cur = dayIndex(y, arg);
    const agItem = (e, di) => {
      const k = kindOf(e);
      const end = e.open || e.soft ? '' : `<small>${fmt(e.to)}</small>`;
      const time = `<span class="ag-time"><b>${fmt(e.from)}</b>${end}</span>`;
      if (e.s.talk) {
        const t = e.d.talks[e.s.talk - 1] || {};
        if (!isFilled(t)) return `<li class="ag ${esc(k)}">${time}<div class="ag-card">${kindBadge(t)}<b class="ag-name tbd">연사 추후 공개</b></div></li>`;
        return `<li class="ag ${esc(k)}">${time}<div class="ag-card">${kindBadge(t)}<b class="ag-name">${esc(t.ko)}${t.affil ? `<small>${esc(t.affil)}</small>` : ''}</b>${t.title ? `<span class="ag-title">${esc(t.title)}</span>` : ''}</div></li>`;
      }
      const sub = cellTitle(e);
      const inner = `<b class="ag-name">${esc(e.s.label)}</b>${sub ? `<span class="ag-title">${esc(sub)}</span>` : ''}`;
      if (k === 'lightning' && (e.d.lightning || []).length) return `<li class="ag lightning">${time}<div class="ag-card">${inner}</div></li>`;
      return `<li class="ag ${esc(k)}">${time}<div class="ag-card">${inner}</div></li>`;
    };
    const agenda = `
        <div class="tt-mobile">
          ${dayBar(y, cur)}
          ${days.map((evs, di) => `<div data-daypanel="${di}"${dayHidden(y, di, cur)}>${chairLine(y.days[di])}<ol class="ag-list">${evs.map((e) => agItem(e, di)).join('')}</ol></div>`).join('')}
        </div>`;

    return `
      <section class="section tt"><div class="wrap">
        ${agenda}
        <p class="tt-legend">${legend.map(([c, l]) => `<span><i class="sw ${c}"></i>${l}</span>`).join('')}</p>
        <div class="tt-scroll reveal">
          <table class="tt-table" style="--days:${n}">
            <thead><tr><th class="tt-corner" aria-label="시간"></th>${head}</tr></thead>
            <tbody>${rows.join('')}</tbody>
          </table>
        </div>
        <p class="tt-note">※ 세부 일정은 행사 진행 상황에 따라 일부 변경될 수 있습니다.</p>
      </div></section>`;
  }

  /* 초록 — 시간 순서대로, 누르면 초록이 펼쳐지는 목록 */
  function viewAbstract(y, arg) {
    const cur = dayIndex(y, arg);
    // 강연 번호는 날마다 새로 세지 않고 첫날부터 이어서 (주소 #abstract/d2-t1 은 그대로)
    let base = 0;
    const days = y.days
      .map((d, di) => {
        const off = base;
        base += d.schedule.filter((s) => s.talk).length;
        const rows = d.schedule
          .map((s) => {
            if (s.talk) {
              const t = d.talks[s.talk - 1] || {};
              const id = `d${di + 1}-t${s.talk}`;
              const no = off + s.talk;
              if (!isFilled(t)) {
                return `<div class="acc-row tbd" id="${id}"><span class="acc-time">${esc(s.time)}</span><span class="acc-head"><span class="no">Talk ${no}</span><b>추후 공개</b></span><span></span></div>`;
              }
              return `
                <details class="acc-item" id="${id}">
                  <summary>
                    <span class="acc-time">${esc(s.time)}</span>
                    <span class="acc-head">
                      <span class="no">Talk ${no}${kindBadge(t)}</span>
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
              if (!lt.length) return `<div class="acc-row tbd" id="d${di + 1}-lt"><span class="acc-time">${esc(s.time)}</span><span class="acc-head"><span class="no">라이트닝 토크</span><b>연사 추후 공개</b></span><span></span></div>`;
              return `
                <details class="acc-item" id="d${di + 1}-lt">
                  <summary>
                    <span class="acc-time">${esc(s.time)}</span>
                    <span class="acc-head"><span class="no">라이트닝 토크</span><span class="t">${lt.map((l) => esc(l.name)).join(', ')}</span></span>
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
          <div class="abs-day" data-daypanel="${di}"${dayHidden(y, di, cur)}>
            <div class="wrap">
              <div class="day-head"><h2>${esc(d.label)}</h2>${chairLine(d, true)}</div>
              <div class="acc">${rows}</div>
            </div>
          </div>`;
      })
      .join('');
    return `
      ${dayBar(y, cur)}
      ${days}
      <div class="section tight"></div>`;
  }

  /* 참가 신청 */
  function viewRegistration(y) {
    const reg = y.registration;
    const btn = reg.open && reg.formUrl
      ? `<a class="btn btn-royal" href="${esc(reg.formUrl)}" target="_blank" rel="noopener">참가 신청서 작성하기 <span class="arrow">→</span></a>`
      : `<span class="btn" aria-disabled="true">${esc(reg.closedLabel)}</span>`;
    // 마감 전인 모집(포스터 발표자 모집 등)은 맨 위에, 나머지는 신청 상태 카드 아래에
    const isOpenCall = (b) => b.until && daysLeft(b.until) >= 0;
    const first = reg.blocks.filter(isOpenCall);
    const rest = reg.blocks.filter((b) => !isOpenCall(b));
    return `
      <section class="section"><div class="wrap">
        ${first.length ? `<div class="reg-blocks reg-first">${first.map(regBlock).join('')}</div>` : ''}
        <div class="card reg-status reveal">
          <div>
            <strong>${reg.open ? '참가 신청을 받고 있습니다' : esc(reg.closedLabel)}</strong>
            <p>문의: <a href="mailto:${esc(M.contact.email)}">${esc(M.contact.email)}</a>${y.kakao ? `, <a href="${esc(y.kakao)}" target="_blank" rel="noopener">MCUS 오픈채팅</a>` : ''}</p>
          </div>
          ${btn}
        </div>
        <div class="reg-blocks">
          ${rest.map(regBlock).join('')}
        </div>
      </div></section>`;
  }

  // 신청 블록 하나. 설명(lead)이 있는 블록은 한 줄 전체를 차지하고, 마감일(until)이 있으면 모집 상태를 표시
  function regBlock(b) {
    const n = b.until ? daysLeft(b.until) : null;
    const open = n == null || n >= 0;
    const status = n == null ? '' : open ? `<span class="pill live">모집 중 ${dLabel(n)}</span>` : '<span class="pill muted">모집 마감</span>';
    // 이메일 주소는 눈에 잘 띄도록 굵게
    const dd = (v) => or(v, '추후 안내').replace(/\n/g, '<br>').replace(/[\w.+-]+@[\w-]+(\.[\w-]+)+/g, '<b class="email">$&</b>');
    const dl = `<dl>${b.rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${dd(v)}</dd></div>`).join('')}</dl>`;
    const note = b.note ? `<p class="note">${esc(b.note)}</p>` : '';
    const action = b.action && open ? `<a class="btn btn-royal" href="${esc(b.action.href)}">${esc(b.action.label)} <span class="arrow">→</span></a>` : '';
    if (!b.lead) {
      return `
            <div class="card reg-block reveal"${b.id ? ` id="${esc(b.id)}"` : ''}>
              <h3>${esc(b.title)}${status}</h3>
              ${dl}${note}${action ? `<div class="rb-action">${action}</div>` : ''}
            </div>`;
    }
    return `
            <div class="card reg-block wide reveal"${b.id ? ` id="${esc(b.id)}"` : ''}>
              <div class="rb-text">
                <h3>${esc(b.title)}${status}</h3>
                ${b.lead.map((p) => `<p>${esc(p)}</p>`).join('')}
                ${action ? `<div class="rb-action">${action}</div>` : ''}
              </div>
              <div>${dl}${note}</div>
            </div>`;
  }

  /* 장소 안내 */
  function viewVenue(y) {
    const v = y.venue;
    // 제목에 이미 나오는 행사 진행 장소는 목록에서 빼고 나머지(휴게 공간 등)만
    const main = (v.rooms || []).find((r) => r[1]);
    const others = (v.rooms || []).filter((r) => (main ? r !== main : !/진행/.test(r[0])));
    return `
      <section class="section"><div class="wrap">
        <div class="venue">
        <div class="card reveal">
          <h3>${esc(placeText(y))}</h3>
          <p class="addr">${esc(v.address.replace(/\s*성균관대학교 자연과학캠퍼스\s*$/, ''))}</p>
          ${others.length ? `<dl class="rooms">${others.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${or(val, '추후 안내')}</dd></div>`).join('')}</dl>` : ''}
          <div class="map-links">${mapLinks(y)}</div>
        </div>
        <div class="card reveal">
          <h3 style="margin-bottom:16px">찾아오시는 길</h3>
          <div class="directions">
            ${M.directions.map((dd) => `<div><span class="ico">${icon[dd.kind] || icon.pin}</span><span><b>${esc(dd.label)}</b><p>${esc(dd.text).replace(/\n/g, '<br>')}</p></span></div>`).join('')}
          </div>
        </div>
        </div>
        ${mapEmbed(y, 'wide reveal')}
      </div></section>`;
  }

  // 장소 한 줄: 캠퍼스 건물 강의실 (예: 성균관대학교 자연과학캠퍼스 (수원) 반도체관 1층 400126)
  function placeText(y) {
    const v = y.venue;
    const room = (v.rooms || []).find((r) => r[1]);
    if (!v.building) return `${v.campus.replace(' (', '\u00a0(')} (세부 장소 추후 안내)`;
    // 건물과 강의실은 줄바꿈 없이 한 덩어리로 (줄이 바뀌면 캠퍼스 이름 뒤에서)
    const spot = [v.building, room && room[1]].filter(Boolean).join(' ').replace(/ /g, '\u00a0');
    return `${v.campus.replace(' (', '\u00a0(')} ${spot}`;
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
          ${y.gallery.map((g) => `<figure><img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy"></figure>`).join('')}
        </div>
      </div></section>`;
  }

  /* 화면별 동작 */
  function setupView(y, rk, arg) {

    // 날짜 탭 (초록 · 모바일 일정)
    const tabs = [...document.querySelectorAll('.day-tabs [data-day]')];
    if (tabs.length) {
      const panels = [...document.querySelectorAll('[data-daypanel]')];
      const anchor = document.querySelector('.day-anchor');
      tabs.forEach((b) =>
        b.addEventListener('click', () => {
          const i = Number(b.dataset.day);
          daySel[y.year] = i;
          tabs.forEach((t) => t.setAttribute('aria-selected', String(t === b)));
          panels.forEach((p) => { p.hidden = Number(p.dataset.daypanel) !== i; });
          // 목록 중간까지 내려와 있었다면 새 날짜의 처음으로
          if (anchor && anchor.getBoundingClientRect().top < 0) anchor.scrollIntoView({ block: 'start' });
        })
      );
    }

    // 홈: 기조 강연자 넘겨 보기 (+ 자동 넘김)
    // 다른 화면으로 가면 이전 자동 넘김을 정리
    clearInterval(window.__mcusCarTimer);
    if (window.__mcusCarIO) window.__mcusCarIO.disconnect();
    const car = document.querySelector('[data-carousel]');
    if (car) {
      const track = car.querySelector('.car-track');
      const cards = [...track.children];
      const n = cards.length;
      const btns = [...document.querySelectorAll('[data-car]')];
      const dots = [...document.querySelectorAll('[data-dot]')];

      // 끝없이 이어지게: 카드 전체를 앞뒤에 한 벌씩 복사해 두고,
      // 복사본 구간에 들어가면 (움직임이 끝난 뒤) 같은 모양의 원래 카드 위치로 순간 이동
      const clone = (c) => { const k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); k.inert = true; k.classList.add('clone'); return k; };
      if (n > 1) {
        track.prepend(...cards.map(clone));
        track.append(...cards.map(clone));
      }
      // 간격 계산은 원래 카드로 (복사본이 숨겨져 있을 때도 맞도록)
      const step = () => (cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth);
      const visible = () => Math.max(1, Math.round(track.clientWidth / step()));
      const looping = () => n > 1 && n > visible();
      const pos = () => Math.round(track.scrollLeft / step()); // 복사본 포함 몇 번째 카드가 왼쪽 끝인지
      const jump = (i) => { track.style.scrollBehavior = 'auto'; track.scrollLeft = i * step(); track.style.scrollBehavior = ''; };
      const go = (i) => track.scrollTo({ left: i * step(), behavior: 'smooth' });
      let cur = 0; // 지금 보이는 원래 카드 번호 (0 ~ n-1)

      const update = () => {
        const loop = looping();
        if (car.classList.contains('static') === loop) {
          car.classList.toggle('static', !loop);
          if (loop) jump(n + cur);
        }
        btns.forEach((b) => { b.hidden = !loop; });
        dots.forEach((d) => { d.hidden = !loop; });
        if (!loop) { track.scrollLeft = 0; return; }
        cur = (((pos() - n) % n) + n) % n;
        dots.forEach((d, k) => d.setAttribute('aria-current', String(k === cur)));
      };
      // 움직임이 멈추면 복사본 구간인지 확인해서 원래 카드로 옮김
      const settle = () => {
        if (!looping()) return;
        const i = pos();
        if (i < n) jump(i + n);
        else if (i >= 2 * n) jump(i - n);
        update();
      };
      let settleT;
      track.addEventListener('scroll', () => {
        requestAnimationFrame(update);
        clearTimeout(settleT);
        settleT = setTimeout(settle, 140);
      }, { passive: true });

      btns.forEach((b) => b.addEventListener('click', () => { go(pos() + Number(b.dataset.car)); restart(); }));
      dots.forEach((d) => d.addEventListener('click', () => { go(n + Number(d.dataset.dot)); restart(); }));

      // 자동 넘김: 5초마다 다음 연사 (마지막 다음은 자연스럽게 첫 연사로 이어짐).
      // 마우스를 올리거나 손가락을 대고 있는 동안, 화면 밖에 있을 때, 다른 탭에 있을 때는 멈춤.
      // '동작 줄이기' 설정을 켠 기기에서는 자동으로 넘기지 않음
      const AUTO_MS = 5000;
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const hold = { hover: false, touch: false, focus: false, offscreen: true };
      const next = () => { if (looping()) go(pos() + 1); };
      function restart() {
        clearInterval(window.__mcusCarTimer);
        if (reduce || document.hidden || Object.values(hold).some(Boolean)) return;
        window.__mcusCarTimer = setInterval(next, AUTO_MS);
      }
      const set = (k, v) => { hold[k] = v; restart(); };
      car.addEventListener('mouseenter', () => set('hover', true));
      car.addEventListener('mouseleave', () => set('hover', false));
      car.addEventListener('touchstart', () => set('touch', true), { passive: true });
      car.addEventListener('touchend', () => setTimeout(() => set('touch', false), 1500), { passive: true });
      car.addEventListener('focusin', () => set('focus', true));
      car.addEventListener('focusout', () => set('focus', false));
      if (!window.__mcusCarVis) {
        window.__mcusCarVis = true;
        document.addEventListener('visibilitychange', () => window.__mcusCarRestart && window.__mcusCarRestart());
      }
      window.__mcusCarRestart = restart;
      window.__mcusCarIO = new IntersectionObserver(([en]) => set('offscreen', !en.isIntersecting), { threshold: 0.4 });
      window.__mcusCarIO.observe(car);

      // 화면 크기가 바뀌면 보고 있던 카드를 그대로 유지
      const onResize = () => { update(); if (looping()) jump(n + cur); };
      // 다른 탭으로 갔다 와도 resize 리스너가 쌓이지 않도록 하나만 유지
      if (window.__mcusCarResize) window.removeEventListener('resize', window.__mcusCarResize);
      window.__mcusCarResize = onResize;
      window.addEventListener('resize', onResize);
      update();
      if (looping()) jump(n); // 원래 첫 카드에서 시작
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

  /* ---------- 첫 화면 배경 시작 ---------- */

  // 웹 글꼴이 로드되어 첫 화면 높이가 정해진 뒤에 배경을 그리기 시작 (최대 0.8초 대기)
  function startNet() {
    const heroes = document.querySelectorAll('.net-hero:not(.go)');
    if (!heroes.length) return;
    const ready = document.fonts && document.fonts.ready
      ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 800))])
      : Promise.resolve();
    ready.then(() => requestAnimationFrame(() => heroes.forEach((h) => h.classList.add('go'))));
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
    startNet();
    renderHistory();
  } else {
    renderYear(Number(body.dataset.year));
  }
  renderFooter();
  setupReveal();
})();
