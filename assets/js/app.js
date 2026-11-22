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

  function phasePill(y) {
    const p = phase(y);
    if (p.key === 'upcoming') return `<span class="pill live">개최 예정</span>`;
    if (p.key === 'live') return `<span class="pill live">진행 중</span>`;
    return `<span class="pill muted">행사 종료</span>`;
  }

  const ddayText = (p) => (p.key === 'upcoming' ? (p.days === 0 ? 'D-DAY' : `D-${p.days}`) : p.key === 'live' ? 'NOW' : '');

  const allTalks = (y) => y.days.flatMap((d) => d.talks);
  const filledTalks = (y) => allTalks(y).filter((t) => t.title || t.ko);
  const allLightning = (y) => y.days.flatMap((d) => d.lightning || []);

  function wordmark(year, cls = '') {
    const yr = year
      ? `<text x="249" y="36" text-anchor="end" fill="currentColor" stroke="none" font-family="Pretendard Variable, Pretendard, sans-serif" font-weight="800" font-size="20" letter-spacing="-0.5">${year}</text>`
      : '';
    return `<svg class="${cls}" viewBox="0 0 258 88" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="square" role="img" aria-label="MCUS${year ? ' ' + year : ''}">
      <path pathLength="1" d="M8 80V8H108"/>
      <path pathLength="1" d="M37 8V58"/>
      <path pathLength="1" d="M68 8V80H213V44H176V8H252"/>
      <path pathLength="1" d="M124 8V80"/>
      <path pathLength="1" d="M161 8V80"/>
      ${yr}
    </svg>`;
  }

  // 포스터의 네트워크(plexus) 모티프 — 시드가 같으면 항상 같은 모양
  function plexus(seed = 7, w = 800, h = 600, n = 46) {
    let s = seed;
    const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
    const pts = Array.from({ length: n }, () => {
      const x = w * (1 - Math.pow(rand(), 1.6));
      const y = h * Math.pow(rand(), 1.4);
      return [x, y, 1 + rand() * 3.2];
    });
    const max = Math.min(w, h) * 0.26;
    let lines = '';
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
        if (d < max) lines += `<line x1="${pts[i][0].toFixed(1)}" y1="${pts[i][1].toFixed(1)}" x2="${pts[j][0].toFixed(1)}" y2="${pts[j][1].toFixed(1)}" opacity="${(1 - d / max).toFixed(2)}"/>`;
      }
    }
    const dots = pts.map(([x, y, r]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}"/>`).join('');
    return `<svg class="plexus" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMaxYMin slice" aria-hidden="true">${lines}${dots}</svg>`;
  }

  const icon = {
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    subway: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M9 21l-2-4M15 21l2-4"/><circle cx="9" cy="14" r=".5"/><circle cx="15" cy="14" r=".5"/></svg>',
    bus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="15" rx="2"/><path d="M4 11h16M7 18v3M17 18v3"/><circle cx="8" cy="14.5" r=".5"/><circle cx="16" cy="14.5" r=".5"/></svg>',
  };

  /* ---------- header & footer ---------- */

  function renderHeader(current) {
    const links = yearsDesc
      .map((yr) => {
        const y = M.years[yr];
        const dot = phase(y).key !== 'done' ? '<span class="nav-new" aria-hidden="true"></span>' : '';
        return `<a href="${yr}.html"${current === yr ? ' aria-current="page"' : ''}><span class="nav-long">MCUS </span>${yr}${dot}</a>`;
      })
      .join('');
    document.getElementById('site-header').innerHTML = `
      <div class="wrap">
        <a class="brand" href="index.html" aria-label="MCUS 홈">
          ${wordmark()}
          <span>학부생을 위한<br>수학 학술회</span>
        </a>
        <nav class="site-nav" aria-label="주요 메뉴">
          <a href="index.html"${current === 'home' ? ' aria-current="page"' : ''}>소개</a>
          ${links}
        </nav>
      </div>`;
  }

  function renderFooter() {
    const c = M.contact;
    document.getElementById('site-footer').innerHTML = `
      <div class="wrap">
        <div>
          ${wordmark()}
          <p>Mathematics Conference for Undergraduate Students<br>성균관대학교 수학과 학술동아리 MIMIC</p>
        </div>
        <div>
          <h4>Conferences</h4>
          <ul>${yearsDesc.map((yr) => `<li><a href="${yr}.html">MCUS ${yr}</a></li>`).join('')}</ul>
        </div>
        <div>
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:${esc(c.email)}">${esc(c.email)}</a></li>
            <li><a href="${esc(c.website)}" target="_blank" rel="noopener">MIMIC 홈페이지</a></li>
            <li><a href="${esc(c.instagram)}" target="_blank" rel="noopener">Instagram ${esc(c.instagramHandle)}</a></li>
            <li><a href="${esc(c.youtube)}" target="_blank" rel="noopener">YouTube</a></li>
          </ul>
        </div>
        <div class="copy">
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

  /* ---------- home ---------- */

  function renderHome() {
    const p = phase(latest);
    document.querySelectorAll('[data-plexus]').forEach((el) => el.insertAdjacentHTML('afterbegin', plexus(Number(el.dataset.plexus) || 7)));

    // next-up card
    const nextEl = document.getElementById('next-card');
    if (nextEl) {
      nextEl.innerHTML = `
        <div class="row">
          <span class="pill">${p.key === 'done' ? '가장 최근 행사' : '다가오는 학술회'}</span>
          <span class="dday">${ddayText(p)}</span>
        </div>
        <h3>${esc(latest.titleKo)}</h3>
        <div class="big">MCUS ${latest.year}</div>
        <dl>
          <div><dt>일시</dt><dd>${esc(latest.dateLabel)}</dd></div>
          <div><dt>장소</dt><dd>${esc(latest.venueShort)}</dd></div>
          <div><dt>주최</dt><dd>${esc(latest.host)}</dd></div>
        </dl>
        <a class="btn" href="${latest.year}.html">MCUS ${latest.year} 자세히 보기 <span class="arrow">→</span></a>`;
    }

    // milestones
    const msEl = document.getElementById('milestones');
    if (msEl) {
      const ms = latest.milestones || [];
      const reg = latest.registration;
      const regLine = reg.open && reg.formUrl
        ? `<a class="btn btn-accent" href="${esc(reg.formUrl)}" target="_blank" rel="noopener">참가 신청하기 <span class="arrow">→</span></a>`
        : `<span class="btn" aria-disabled="true">${esc(reg.closedLabel)}</span>`;
      msEl.innerHTML = `
        <h3>MCUS ${latest.year} 주요 일정</h3>
        <ol>${ms
          .map((m, i) => `<li class="${i === ms.length - 1 ? 'final' : ''}"><span>${esc(m.label)}</span><span class="when${m.date ? '' : ' tba'}">${m.date ? esc(m.date) : '추후 안내'}</span></li>`)
          .join('')}</ol>
        <div style="margin-top:18px">${regLine}</div>`;
      if (!ms.length) msEl.hidden = true;
    }

    // news
    const newsEl = document.getElementById('news');
    if (newsEl) {
      newsEl.innerHTML = `
        <h3>최신 소식</h3>
        <ul>${M.news
          .slice(0, 4)
          .map((n) => `<li><a href="${esc(n.link)}"><time datetime="${esc(n.date)}">${esc(n.date.replace(/-/g, '.'))}</time><span><strong>${esc(n.title)}</strong><p>${esc(n.body)}</p></span></a></li>`)
          .join('')}</ul>`;
    }

    // stats
    const held = yearsDesc.filter((yr) => phase(M.years[yr]).key === 'done').map((yr) => M.years[yr]);
    const talks = held.reduce((n, y) => n + filledTalks(y).length, 0);
    const lightning = held.reduce((n, y) => n + allLightning(y).length, 0);
    const organizers = new Set(held.flatMap((y) => y.organizers.map((o) => o[0]))).size;
    const statsEl = document.getElementById('stats');
    if (statsEl) {
      statsEl.innerHTML = [
        [held.length, '회 개최', '지금까지 열린 MCUS'],
        [talks, '편', '기조 · 초청 · 학생 강연'],
        [lightning, '편', '학부생 Lightning Talk'],
        [organizers, '명', '운영에 함께한 학생'],
      ]
        .map(([v, u, k]) => `<div class="stat reveal"><div class="v">${v}<small>${u}</small></div><div class="k">${k}</div></div>`)
        .join('');
    }

    // fields
    const fieldsEl = document.getElementById('fields');
    if (fieldsEl) {
      const counts = {};
      held.forEach((y) => filledTalks(y).forEach((t) => (t.tags || []).forEach((tag) => (counts[tag] = (counts[tag] || 0) + 1))));
      fieldsEl.innerHTML = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([k, n]) => `<span class="chip">${esc(M.fields[k] || k)}<span class="count">${n}</span></span>`)
        .join('');
    }

    // editions
    const edEl = document.getElementById('editions');
    if (edEl) {
      edEl.innerHTML = yearsDesc
        .map((yr) => {
          const y = M.years[yr];
          const img = y.gallery && y.gallery[0];
          const nTalks = filledTalks(y).length;
          return `
          <a class="card edition reveal" href="${yr}.html">
            <div class="thumb">${img ? `<img src="${esc(img.src)}" alt="${esc(img.alt)}" loading="lazy">` : plexus(yr, 640, 360, 34) + wordmark(yr, 'mark')}</div>
            <div class="body">
              <div class="yr"><b>MCUS ${yr}</b>${phasePill(y)}</div>
              <div class="meta">${esc(y.dateLabel)}</div>
              <div class="meta">${esc(y.venueShort)}</div>
              <div class="facts">
                <span><b>${y.days.length}</b>일</span>
                ${nTalks ? `<span><b>${nTalks}</b> 강연</span><span><b>${allLightning(y).length}</b> Lightning</span>` : '<span>연사 추후 공개</span>'}
              </div>
            </div>
          </a>`;
        })
        .join('');
    }
  }

  /* ---------- year pages ---------- */
  // 연도마다 세 페이지: {yr}.html(개요) · {yr}-talks.html(연사 · 초록) · {yr}-info.html(참가 · 장소)

  const yearViews = [
    ['overview', '개요', (yr) => `${yr}.html`],
    ['talks', '연사 · 초록', (yr) => `${yr}-talks.html`],
    ['info', '참가 · 장소 안내', (yr) => `${yr}-info.html`],
  ];
  const talksUrl = (yr, id) => `${yr}-talks.html${id ? '#' + id : ''}`;

  // 각 강연에 day/순서/시간 정보를 붙인 목록
  function talkEntries(y) {
    const out = [];
    y.days.forEach((d, di) => {
      d.talks.forEach((t, ti) => {
        const slot = d.schedule.find((s) => s.talk === ti + 1);
        out.push({ t, d, di, ti, id: `d${di + 1}-t${ti + 1}`, time: slot ? slot.time : '', filled: Boolean(t.title || t.ko) });
      });
    });
    return out;
  }

  const initials = (t) => esc((t.en || t.ko || '?').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase());

  function avatar(t, cls = 'avatar') {
    return t.photo
      ? `<img class="${cls}" src="${esc(t.photo)}" alt="${esc(t.ko)}" loading="lazy">`
      : `<span class="${cls} mono" aria-hidden="true">${initials(t)}</span>`;
  }

  const kindBadge = (t) =>
    t.kind === 'plenary' ? '<span class="badge-plenary">기조강연</span>' : t.kind === 'invited' ? '<span class="badge-invited">초청강연</span>' : '';

  function yearHero(y, p, compactTitle) {
    const yr = y.year;
    if (compactTitle) {
      return `
      <header class="hero-dark year-hero compact">
        ${plexus(yr)}
        <div class="wrap">
          <div>
            <div class="top"><a class="eyebrow" href="${yr}.html">MCUS ${yr}</a>${phasePill(y)}</div>
            <h1>${esc(compactTitle)}</h1>
            <p class="en-title">${esc(y.titleKo)} · ${esc(y.dateLabel)}</p>
          </div>
        </div>
      </header>`;
    }
    const reg = y.registration;
    const regBtn =
      reg.open && reg.formUrl
        ? `<a class="btn btn-primary" href="${esc(reg.formUrl)}" target="_blank" rel="noopener">참가 신청하기 <span class="arrow">→</span></a>`
        : p.key === 'done' ? '' : `<span class="btn" aria-disabled="true">${esc(reg.closedLabel)}</span>`;
    return `
      <header class="hero-dark year-hero">
        ${plexus(yr)}
        <div class="wrap">
          <div>
            <div class="top"><span class="eyebrow">MCUS ${yr}</span>${phasePill(y)}</div>
            ${wordmark(yr, 'mark')}
            <h1>${esc(y.titleKo)}</h1>
            <p class="en-title">${esc(y.titleEn)}</p>
            <dl class="poster-facts">
              <div><dt>일시</dt><dd>${esc(y.dateLabel)}</dd></div>
              <div><dt>장소</dt><dd>${esc(y.venueShort)}</dd></div>
              <div><dt>주최</dt><dd>${esc(y.host)}</dd></div>
            </dl>
            <div class="hero-actions">
              ${regBtn}
              <a class="btn ${regBtn ? 'btn-ghost' : 'btn-primary'}" href="${talksUrl(yr)}">연사 · 초록 보기 <span class="arrow">→</span></a>
              <a class="btn btn-ghost" href="#schedule">일정 보기</a>
            </div>
          </div>
          ${p.key !== 'done' ? `<div class="side"><div class="dday-big">${ddayText(p)}</div><small>${esc(y.start.replace(/-/g, '.'))} 개막</small></div>` : ''}
        </div>
      </header>`;
  }

  function yearTabs(yr, view) {
    return `
      <nav class="subnav year-tabs" aria-label="MCUS ${yr} 메뉴"><div class="wrap">
        ${yearViews.map(([key, label, url]) => `<a href="${url(yr)}"${key === view ? ' class="active" aria-current="page"' : ''}>${label}</a>`).join('')}
      </div></nav>`;
  }

  function yearPager(yr, view) {
    const idx = yearsDesc.indexOf(yr);
    const newer = yearsDesc[idx - 1];
    const older = yearsDesc[idx + 1];
    const url = (y2) => (yearViews.find((v) => v[0] === view) || yearViews[0])[2](y2);
    return `
      <section class="section"><div class="wrap year-pager">
        ${older ? `<a class="card" href="${url(older)}"><small>← 이전 학술회</small><b>MCUS ${older}</b></a>` : ''}
        ${newer ? `<a class="card next" href="${url(newer)}"><small>다음 학술회 →</small><b>MCUS ${newer}</b></a>` : ''}
      </div></section>`;
  }

  function renderYear(yr, view) {
    const y = M.years[yr];
    if (!y) return;
    const p = phase(y);
    const app = document.getElementById('app');
    const viewLabel = (yearViews.find((v) => v[0] === view) || yearViews[0])[1];
    document.title = view === 'overview' ? `MCUS ${yr} · ${y.titleKo}` : `${viewLabel} · MCUS ${yr}`;

    let html = yearHero(y, p, view === 'overview' ? '' : viewLabel) + yearTabs(yr, view);
    if (view === 'talks') html += renderTalksView(y);
    else if (view === 'info') html += renderInfoView(y);
    else html += renderOverviewView(y);
    html += yearPager(yr, view);

    app.innerHTML = html;
    setupYearInteractions(y, view);
  }

  /* 개요 페이지 */
  function renderOverviewView(y) {
    const yr = y.year;
    const entries = talkEntries(y).filter((e) => e.filled);
    const nTalks = entries.length;
    const nLightning = allLightning(y).length;
    const plenary = entries.filter((e) => e.t.kind === 'plenary');
    const others = entries.filter((e) => e.t.kind !== 'plenary');
    const nInvited = entries.filter((e) => e.t.kind === 'invited').length;

    let html = `
      <section class="section" id="overview"><div class="wrap">
        <div class="section-head"><span class="eyebrow">Overview</span><h2>개요</h2></div>
        <div class="overview">
          <dl class="card facts-table reveal">
            ${y.overview
              .map((r, i) => `<div class="${i === 0 ? 'lead' : ''}"><dt>${esc(r.label)}</dt><dd>${or(r.value, '추후 안내')}${r.note ? `<span class="note">* ${esc(r.note)}</span>` : ''}</dd></div>`)
              .join('')}
          </dl>
          <div class="card at-a-glance reveal">
            <div><div class="n">${y.days.length}<small>일</small></div><div class="k">${esc(y.dateLabel)}</div></div>
            <div><div class="n">${nTalks || '<span class="tba">TBA</span>'}<small>${nTalks ? '강연' : ''}</small></div><div class="k">${nTalks ? [plenary.length && `기조강연 ${plenary.length}`, nInvited && `초청강연 ${nInvited}`].filter(Boolean).join(' · ') || '학생 · 연구자 강연' : '강연 라인업 추후 공개'}</div></div>
            <div><div class="n">${nLightning || '<span class="tba">TBA</span>'}<small>${nLightning ? 'Lightning Talks' : ''}</small></div><div class="k">${nLightning ? '짧고 가볍게 나누는 학부생 발표' : 'Lightning Talk 연사 모집 예정'}</div></div>
          </div>
        </div>
      </div></section>`;

    const overviewHtml = html;

    /* 연사 */
    html = `
      <section class="section soft" id="speakers"><div class="wrap">
        <div class="section-head head-row">
          <div><span class="eyebrow">Speakers</span><h2>연사</h2></div>
          ${nTalks ? `<a class="btn btn-ghost" href="${talksUrl(yr)}">전체 초록 보기 <span class="arrow">→</span></a>` : ''}
        </div>`;
    if (!nTalks) {
      html += '<div class="notice">기조강연 · 초청강연 연사는 추후 공개됩니다.</div>';
    } else {
      if (plenary.length) {
        html += `
        <h3 class="sub-head">기조강연 <small>Plenary</small></h3>
        <div class="plenary-cards">
          ${plenary
            .map(
              (e) => `
            <a class="card sp-feature reveal" href="${talksUrl(yr, e.id)}">
              ${avatar(e.t, 'portrait')}
              <div class="body">
                <span class="badge-plenary">기조강연</span>
                <b class="name">${esc(e.t.ko)}<span>${esc(e.t.en)}</span></b>
                ${e.t.affil ? `<span class="aff">${esc(e.t.affil)}</span>` : ''}
                ${e.t.field ? `<span class="field">Research field · ${esc(e.t.field)}</span>` : ''}
                <span class="talk-title">${esc(e.t.title)}</span>
                <span class="go">초록 보기 →</span>
              </div>
            </a>`
            )
            .join('')}
        </div>`;
      }
      if (others.length) {
        html += `
        <h3 class="sub-head">${nInvited === others.length ? '초청강연 <small>Invited</small>' : '강연 <small>Talks</small>'}</h3>
        <div class="sp-grid">
          ${others
            .map(
              (e) => `
            <a class="card sp-item reveal" href="${talksUrl(yr, e.id)}">
              <span class="when">DAY ${e.di + 1} · ${esc(e.time)}</span>
              <b class="name">${esc(e.t.ko)}<span>${esc(e.t.en)}</span></b>
              ${e.t.affil ? `<span class="aff">${esc(e.t.affil)}</span>` : ''}
              <span class="talk-title">${esc(e.t.title)}</span>
            </a>`
            )
            .join('')}
        </div>`;
      }
      if (nLightning) {
        html += `
        <h3 class="sub-head">Lightning Talk <small>학부생 발표</small></h3>
        <div class="lt-grid">
          ${y.days
            .flatMap((d, di) => (d.lightning || []).map((l, li) => `<a class="lt-item" href="${talksUrl(yr, `d${di + 1}-l${li + 1}`)}"><b>${esc(l.name)}</b><span>${esc(l.title)}</span></a>`))
            .join('')}
        </div>`;
      }
    }
    html += '</div></section>';

    const speakersHtml = html;

    /* 일정 */
    html = `
      <section class="section" id="schedule"><div class="wrap">
        <div class="section-head"><span class="eyebrow">Timetable</span><h2>일정</h2><p>강연을 누르면 연사 소개와 초록을 볼 수 있습니다.</p></div>
        <div class="days" style="--days:${Math.min(y.days.length, 3)}">
          ${y.days
            .map(
              (d, di) => `
            <article class="card day reveal">
              <div class="day-head">
                <h3><span>DAY ${di + 1}</span>${esc(d.label)}</h3>
                <div class="chairs">Chair · ${d.chairs && d.chairs.length ? esc(d.chairs.join(', ')) : '<em class="tba">추후 공개</em>'}</div>
              </div>
              <ol class="slots">
                ${d.schedule
                  .map((s) => {
                    if (s.talk) {
                      const t = d.talks[s.talk - 1] || {};
                      return `<li class="slot"><time>${esc(s.time)}</time><a href="${talksUrl(yr, `d${di + 1}-t${s.talk}`)}"><span class="who"><em>Talk ${s.talk}</em>${t.ko ? esc(t.ko) : '<span class="tba">TBA</span>'}${t.kind === 'plenary' ? '<span class="badge-plenary">기조강연</span>' : ''}</span>${t.title ? `<span class="what">${esc(t.title)}</span>` : ''}</a></li>`;
                    }
                    if (s.kind === 'lightning' && (d.lightning || []).length) {
                      return `<li class="slot lightning"><time>${esc(s.time)}</time><a href="${talksUrl(yr, `d${di + 1}-l1`)}"><span>${esc(s.label)}</span><span class="what">${d.lightning.map((l) => esc(l.name)).join(' · ')}</span></a></li>`;
                    }
                    return `<li class="slot ${esc(s.kind || 'break')}"><time>${esc(s.time)}</time><span>${esc(s.label)}</span></li>`;
                  })
                  .join('')}
              </ol>
            </article>`
            )
            .join('')}
        </div>
      </div></section>`;

    const scheduleHtml = html;
    html = '';

    /* 갤러리 */
    if (y.gallery && y.gallery.length) {
      html += `
      <section class="section soft" id="gallery"><div class="wrap">
        <div class="section-head"><span class="eyebrow">Gallery</span><h2>갤러리</h2></div>
        <div class="gallery">
          ${y.gallery.map((g) => `<button type="button" data-src="${esc(g.src)}" data-alt="${esc(g.alt)}"><img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy"></button>`).join('')}
        </div>
        <dialog class="lightbox" id="lightbox"><form method="dialog"><button aria-label="닫기">×</button></form><img alt=""><p></p></dialog>
      </div></section>`;
    }

    /* 조직위원회 */
    html += `
      <section class="section" id="organizers"><div class="wrap">
        <div class="section-head"><span class="eyebrow">Organizing Committee</span><h2>조직위원회</h2><p>${esc(y.host)}</p></div>
        ${
          y.organizers.length
            ? `<div class="people">${y.organizers.map(([ko, en]) => `<div class="person reveal"><b>${esc(ko)}</b><span>${esc(en)}</span></div>`).join('')}</div>`
            : '<div class="notice">조직위원 명단은 추후 공개됩니다.</div>'
        }
      </div></section>`;
    // 지난 행사는 연사를 맨 앞에, 예정된 행사는 개요를 맨 앞에
    return phase(y).key === 'done'
      ? speakersHtml + scheduleHtml + overviewHtml + html
      : overviewHtml + speakersHtml + scheduleHtml + html;
  }

  /* 연사 · 초록 페이지 */
  function talkDetail(y, e) {
    const t = e.t;
    return `
      <div class="detail-meta">
        <span>DAY ${e.di + 1} · ${esc(e.d.label)}${e.time ? ` · ${esc(e.time)}` : ''}</span>
        <span class="no">TALK ${e.ti + 1}</span>
      </div>
      <div class="detail-badges">${kindBadge(t)}${(t.tags || []).map((tag) => `<span class="chip">${esc(M.fields[tag] || tag)}</span>`).join('')}</div>
      <h2>${or(t.title)}</h2>
      <div class="speaker-block">
        ${avatar(t)}
        <div>
          <b class="name">${or(t.ko, 'TBA')}${t.en ? `<span>${esc(t.en)}</span>` : ''}</b>
          ${t.affil ? `<span class="aff">${esc(t.affil)}</span>` : ''}
          ${t.field ? `<span class="field">Research field · ${esc(t.field)}</span>` : ''}
        </div>
      </div>
      <h3 class="abs-label">Abstract</h3>
      <div class="abstract">${t.abstract ? paras(t.abstract) : '<p class="tba">초록 추후 공개</p>'}</div>`;
  }

  function lightningDetail(d, di, li) {
    const l = d.lightning[li];
    const slot = d.schedule.find((s) => s.kind === 'lightning');
    return `
      <div class="detail-meta">
        <span>DAY ${di + 1} · ${esc(d.label)}${slot ? ` · ${esc(slot.time)}` : ''}</span>
        <span class="no">LIGHTNING ${li + 1}</span>
      </div>
      <div class="detail-badges"><span class="badge-lightning">⚡ Lightning Talk</span></div>
      <h2>${esc(l.title)}</h2>
      <div class="speaker-block">
        <span class="avatar mono" aria-hidden="true">⚡</span>
        <div><b class="name">${esc(l.name)}</b><span class="aff">학부생 Lightning Talk</span></div>
      </div>
      <p class="lt-note">Lightning Talk은 학부생이 관심 있는 주제를 짧게 소개하는 발표로, 별도의 초록이 없습니다.</p>`;
  }

  function renderTalksView(y) {
    const entries = talkEntries(y);
    const filled = entries.filter((e) => e.filled);
    if (!filled.length) {
      return `
      <section class="section"><div class="wrap">
        <div class="notice">연사와 초록은 확정되는 대로 이곳에 공개됩니다.</div>
      </div></section>`;
    }
    const tagsHere = [...new Set(filled.flatMap((e) => e.t.tags || []))];
    const filterBar =
      tagsHere.length > 1
        ? `<div class="filter-bar" role="group" aria-label="분야별 보기">
            <button class="chip" type="button" data-tag="" aria-pressed="true">전체<span class="count">${filled.length}</span></button>
            ${tagsHere
              .map((tag) => `<button class="chip" type="button" data-tag="${esc(tag)}" aria-pressed="false">${esc(M.fields[tag] || tag)}<span class="count">${filled.filter((e) => (e.t.tags || []).includes(tag)).length}</span></button>`)
              .join('')}
          </div>`
        : '';

    const index = y.days
      .map((d, di) => {
        const items = entries
          .filter((e) => e.di === di && e.filled)
          .map(
            (e) => `
            <li><button type="button" class="ti" data-id="${e.id}" data-tags="${esc((e.t.tags || []).join(' '))}">
              <span class="ti-top"><span class="ti-time">${esc(e.time.split('–')[0].trim())}</span>${e.t.kind === 'plenary' ? '<span class="badge-plenary">기조</span>' : ''}</span>
              <b>${esc(e.t.ko)}</b>
              <span class="ti-title">${esc(e.t.title)}</span>
            </button></li>`
          )
          .join('');
        const lts = (d.lightning || [])
          .map((l, li) => `<li><button type="button" class="ti lt" data-id="d${di + 1}-l${li + 1}" data-tags=""><b>⚡ ${esc(l.name)}</b><span class="ti-title">${esc(l.title)}</span></button></li>`)
          .join('');
        return `<div class="ti-day"><h3><span>DAY ${di + 1}</span>${esc(d.label)}</h3><ul>${items}${lts}</ul></div>`;
      })
      .join('');

    return `
      <section class="section talks-section"><div class="wrap">
        <div class="reader-bar">
          ${filterBar}
          <div class="seg" role="group" aria-label="보기 방식">
            <button type="button" data-mode="one" aria-pressed="true">한 편씩 보기</button>
            <button type="button" data-mode="all" aria-pressed="false">전체 펼쳐보기</button>
          </div>
        </div>
        <div class="reader" data-mode="one">
          <aside class="talk-index" aria-label="강연 목록">${index}</aside>
          <article class="card talk-detail" id="talk-detail" aria-live="polite"></article>
          <div class="all-talks">
            ${y.days
              .map(
                (d, di) => `
              <div class="abs-day">
                <h3><span>DAY ${di + 1}</span>${esc(d.label)}</h3>
                <div class="talks">
                  ${entries
                    .filter((e) => e.di === di && e.filled)
                    .map((e) => `<article class="card talk-detail full${e.t.kind === 'plenary' ? ' is-plenary' : ''}" id="full-${e.id}" data-tags="${esc((e.t.tags || []).join(' '))}">${talkDetail(y, e)}</article>`)
                    .join('')}
                  ${(d.lightning || []).length ? `<div class="lightning-box"><h4>Lightning Talk</h4><ul>${d.lightning.map((l) => `<li><b>${esc(l.name)}</b><span>${esc(l.title)}</span></li>`).join('')}</ul></div>` : ''}
                </div>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </div></section>`;
  }

  /* 참가 · 장소 페이지 */
  function renderInfoView(y) {
    const reg = y.registration;
    const regBtn =
      reg.open && reg.formUrl
        ? `<a class="btn btn-accent" href="${esc(reg.formUrl)}" target="_blank" rel="noopener">참가 신청하기 <span class="arrow">→</span></a>`
        : `<span class="btn" aria-disabled="true">${esc(reg.closedLabel)}</span>`;
    const v = y.venue;
    return `
      <section class="section" id="registration"><div class="wrap">
        <div class="section-head"><span class="eyebrow">Registration</span><h2>참가 신청</h2></div>
        <div class="card reg-status reveal">
          <div>
            <strong>${reg.open ? '참가 신청을 받고 있습니다' : esc(reg.closedLabel)}</strong>
            <p>문의 · <a href="mailto:${esc(M.contact.email)}">${esc(M.contact.email)}</a>${y.kakao ? ` · <a href="${esc(y.kakao)}" target="_blank" rel="noopener">카카오톡 오픈채팅</a>` : ''}</p>
          </div>
          ${regBtn}
        </div>
        <div class="reg-blocks">
          ${reg.blocks
            .map(
              (b) => `
            <div class="card reg-block reveal">
              <h3>${esc(b.title)}</h3>
              <dl>${b.rows.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${or(val, '추후 안내')}</dd></div>`).join('')}</dl>
              ${b.note ? `<p class="note">${esc(b.note)}</p>` : ''}
            </div>`
            )
            .join('')}
        </div>
      </div></section>
      <section class="section soft" id="venue"><div class="wrap">
        <div class="section-head"><span class="eyebrow">Venue</span><h2>장소 안내</h2></div>
        <div class="venue">
          <div class="card reveal">
            <h3>${esc(v.campus)}${v.building ? ` · ${esc(v.building)}` : ''}</h3>
            <p class="addr">${esc(v.address)}</p>
            <dl class="rooms">${v.rooms.map(([k, val]) => `<div><dt>${esc(k)}</dt><dd>${or(val, '추후 안내')}</dd></div>`).join('')}</dl>
            <div class="map-links">
              <a class="chip" href="${esc(M.campusMap)}" target="_blank" rel="noopener">캠퍼스 맵 ↗</a>
              <a class="chip" href="https://map.naver.com/p/search/${encodeURIComponent('성균관대학교 자연과학캠퍼스')}" target="_blank" rel="noopener">네이버 지도 ↗</a>
              <a class="chip" href="https://map.kakao.com/?q=${encodeURIComponent('성균관대학교 자연과학캠퍼스')}" target="_blank" rel="noopener">카카오맵 ↗</a>
            </div>
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

  function setupYearInteractions(y, view) {
    // lightbox
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

    // 탭이 화면 밖에 있으면 현재 탭이 보이도록
    const activeTab = document.querySelector('.year-tabs a.active');
    if (activeTab) activeTab.scrollIntoView({ block: 'nearest', inline: 'nearest' });

    if (view === 'talks') setupReader(y);
  }

  function setupReader(y) {
    const reader = document.querySelector('.reader');
    if (!reader) return;
    const detail = document.getElementById('talk-detail');
    const items = [...document.querySelectorAll('.talk-index .ti')];
    const entries = Object.fromEntries(talkEntries(y).filter((e) => e.filled).map((e) => [e.id, e]));
    const narrow = window.matchMedia('(max-width: 900px)');

    const visibleItems = () => items.filter((b) => !b.closest('li').hidden);

    function show(id, { scroll = false } = {}) {
      let html = '';
      if (entries[id]) html = talkDetail(y, entries[id]);
      else {
        const m = /^d(\d+)-l(\d+)$/.exec(id || '');
        const d = m && y.days[m[1] - 1];
        if (d && d.lightning && d.lightning[m[2] - 1]) html = lightningDetail(d, m[1] - 1, m[2] - 1);
      }
      if (!html) return false;
      const vis = visibleItems();
      const pos = vis.findIndex((b) => b.dataset.id === id);
      const prev = vis[pos - 1];
      const next = vis[pos + 1];
      const label = (b) => b.querySelector('b').textContent;
      detail.innerHTML =
        html +
        `<nav class="detail-pager">
          ${prev ? `<button type="button" data-go="${prev.dataset.id}"><small>← 이전</small>${esc(label(prev))}</button>` : '<span></span>'}
          ${next ? `<button type="button" class="next" data-go="${next.dataset.id}"><small>다음 →</small>${esc(label(next))}</button>` : '<span></span>'}
        </nav>`;
      detail.classList.toggle('is-plenary', Boolean(entries[id] && entries[id].t.kind === 'plenary'));
      items.forEach((b) => b.setAttribute('aria-current', String(b.dataset.id === id)));
      const cur = items.find((b) => b.dataset.id === id);
      if (cur) cur.scrollIntoView({ block: 'nearest' });
      if (history.replaceState) history.replaceState(null, '', '#' + id);
      if (scroll) detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    }

    detail.addEventListener('click', (e) => {
      const b = e.target.closest('[data-go]');
      if (b) show(b.dataset.go, { scroll: true });
    });
    items.forEach((b) => b.addEventListener('click', () => show(b.dataset.id, { scroll: narrow.matches })));

    // 보기 방식
    const segBtns = document.querySelectorAll('.seg button');
    const setMode = (mode) => {
      reader.dataset.mode = mode;
      segBtns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    };
    segBtns.forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));

    // 분야 필터
    const filterBtns = document.querySelectorAll('.filter-bar .chip');
    filterBtns.forEach((b) =>
      b.addEventListener('click', () => {
        const tag = b.dataset.tag;
        filterBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
        const match = (el) => !tag || el.dataset.tags.split(' ').includes(tag);
        items.forEach((it) => { it.closest('li').hidden = !match(it); });
        document.querySelectorAll('.talk-index .ti-day').forEach((dd) => { dd.hidden = !dd.querySelector('li:not([hidden])'); });
        document.querySelectorAll('.all-talks .talk-detail').forEach((c) => { c.hidden = !match(c); });
        document.querySelectorAll('.all-talks .lightning-box').forEach((c) => { c.hidden = Boolean(tag); });
        document.querySelectorAll('.all-talks .abs-day').forEach((dd) => { dd.hidden = !dd.querySelector('.talk-detail:not([hidden]), .lightning-box:not([hidden])'); });
        const cur = items.find((it) => it.getAttribute('aria-current') === 'true');
        const first = visibleItems()[0];
        if (cur && cur.closest('li').hidden && first) show(first.dataset.id);
        else if (cur) show(cur.dataset.id);
      })
    );

    const fromHash = location.hash.slice(1);
    if (!show(fromHash)) show(items[0].dataset.id);
    else if (fromHash && narrow.matches) setTimeout(() => detail.scrollIntoView({ block: 'start' }), 0);
    window.addEventListener('hashchange', () => show(location.hash.slice(1), { scroll: true }));
  }

  /* ---------- reveal ---------- */

  function setupReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
      { rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((e) => io.observe(e));
  }

  /* ---------- boot ---------- */

  const page = body.dataset.page;
  const yr = Number(body.dataset.year);
  renderHeader(page === 'home' ? 'home' : yr);
  if (page === 'home') renderHome();
  else renderYear(yr, body.dataset.view || 'overview');
  renderFooter();
  setupReveal();
})();
