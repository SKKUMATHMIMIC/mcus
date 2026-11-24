# MCUS — 학부생을 위한 수학 학술회

Mathematics Conference for Undergraduate Students (MCUS) 통합 웹사이트입니다.
주최: 성균관대학교 수학 학술동아리 MIMIC, 후원: 성균관대학교 수학과

## 페이지 구성

| 주소 | 내용 |
| --- | --- |
| `/` (`index.html`) | 소개 — 다가오는 학술회(자동), MCUS 소개 + 개요 표, 프로그램 구성, 역대 학술회(자동), MIMIC 소개 |
| `/2027/` | MCUS 2027 (개최 예정) |
| `/2026/` | MCUS 2026 |
| `/2025/` | MCUS 2025 |

연도 페이지 메뉴: **홈, 일정, 초록, 참가 신청, 장소 안내, 갤러리** (참가 신청은 개최 전인 해에만, 갤러리는 사진이 있을 때만 표시)
주소는 `/2027/schedule/`, `/2027/abstract/`, `/2027/registration/`, `/2027/venue/`, `/2027/gallery/` 입니다.

- `2027/…/index.html` 파일들은 `tools/pages.py` 가 자동으로 만드는 껍데기입니다. 직접 고치지 마세요.
- 예전 주소(`2027.html#schedule`, `2027.html#abstract/d1-t2`)로 들어와도 새 주소로 자동 이동합니다.

- **홈** — 첫 화면 아래 개요 정보(일시 · 장소 · 대상 · 참가비, `overview` 와 `venue` 에서 자동), 학술회 소개(`site.js` 의 `about`), 기조 강연자(넘겨 보기), 장소 안내(요약), 갤러리, Organizers
- **일정** — 타임테이블(모바일은 날짜 탭 + 목록). 강연마다 연사, 소속, 제목과 기조강연/초청강연 표시. `/2026/schedule/#d2` 로 Day 2를 바로 열 수 있습니다.
- **초록** — 날짜 탭 + 시간 순서대로 강연이 나열되고, 누르면 초록이 펼쳐집니다.
  `/2025/abstract/#d1-t2` 처럼 링크하면 Day 1의 두 번째 강연이 펼쳐진 채로 열립니다.
- **참가 신청** — `/2027/registration/#poster` 처럼 모집 글(`blocks` 의 `id`)로 바로 연결할 수 있습니다.

## 내용 수정하기

레이아웃 코드는 건드리지 않고 **데이터 파일만 고치면** 됩니다.

```
assets/js/data/
├── site.js    # 공통: 연락처, 오시는 길, 분야 태그 이름, 연도 홈의 학술회 소개 문구(about)
├── 2025.js
├── 2026.js
└── 2027.js    # 2026과 같은 구조의 초안 — 빈 값('')은 '추후 공개'로 표시
```

- **연사 추가**: `days[].talks[]` 의 `ko`(한글 이름), `en`(영문 이름), `title`, `abstract`, `tags` 를 채웁니다.
  선택 항목: `affil`(소속), `kind`(`'plenary'` 기조강연 / `'invited'` 초청강연), `field`(분야 — 없으면 `tags` 로 표시), `photo`(사진 경로, `assets/img/speakers/`, 기조강연자만 사용)
  초록 문단을 나누려면 `\n\n` 을 넣으세요.
- **분야 태그**: `tags: ['topology', 'combinatorics']` 처럼 `site.js` 의 `fields` 키를 사용합니다.
- **일정표**: `schedule` 의 `{ time, talk: n }` 은 같은 날 `talks` 의 n번째 강연을 가리킵니다.
  휴식·식사는 `{ time, label, kind: 'break' }`, Lightning Talk은 `kind: 'lightning'`, 만찬은 `kind: 'social'`.
- **참가 신청 열기**: `registration.open` 을 `true` 로, `formUrl` 에 구글 폼 주소를 넣으면 신청 버튼이 활성화됩니다.
- **소개 페이지 문구**: `index.html` 에서 직접 수정합니다.
- **갤러리**: 사진을 `assets/img/` 에 넣고 `gallery` 배열에 `{ src, alt }` 로 추가합니다.
- **개최 예정 / 행사 종료** 표시와 D-day는 `start`, `end` 날짜로 자동 계산됩니다.

## 새 연도 추가 (예: 2028)

1. `assets/js/data/2027.js` 를 복사해 `2028.js` 로 만들고 내용을 수정
2. `index.html` 하단에 `<script src="assets/js/data/2028.js?v=…"></script>` 추가 (다른 연도 줄과 같은 형식)
3. `python3 tools/pages.py` 실행 → `/2028/` 과 그 아래 메뉴 페이지들이 만들어집니다 (다른 연도 페이지에도 2028 이 자동 반영)

메뉴와 소개 페이지 상단의 '다가오는 학술회' 링크는 자동으로 갱신됩니다.

## 디자인

- 색: 기존 MCUS 사이트(2025·2026)의 남색 · 하늘색 · 살구색(기조 강연자 카드)을 이어받음 (`assets/css/style.css` 맨 위 `:root` 변수)
- 글꼴: Pretendard — MIMIC 동아리 사이트(skkumathmimic.github.io)와 동일
- 연사의 `kind: 'plenary'` 는 홈의 '기조 강연자'에 사진(`photo`) · 소속 · 연구 분야(`field`)와 함께 표시됩니다.

## 미리보기 & 배포

- 미리보기: 폴더 주소를 쓰므로 파일을 바로 여는 대신 간단한 서버로 봅니다.
  저장소 폴더에서 `python3 -m http.server` 실행 후 `http://localhost:8000/` 접속.
- **CSS · JS를 고친 뒤 배포할 때**: `index.html` 의 `?v=` 숫자(app.js · style.css · data 파일 줄)를 새 숫자로 바꾸고
  `python3 tools/pages.py` 를 실행하면 연도 페이지들에도 같은 숫자가 들어갑니다.
  바꾸지 않으면 방문자 브라우저가 예전 `style.css` 를 계속 써서 화면이 깨져 보일 수 있습니다.
- 배포: GitHub 저장소 Settings → Pages → Branch `main` / `root` 선택 시
  `https://skkumathmimic.github.io/mcus/` 에서 공개됩니다. (저장소 이름이 주소가 됩니다)
