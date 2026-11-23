# MCUS — 학부생을 위한 수학 학술회

Mathematics Conference for Undergraduate Students (MCUS) 통합 웹사이트입니다.
주최: 성균관대학교 수학과 학술동아리 MIMIC · 성균관대학교 수학과

## 페이지 구성

| 파일 | 내용 |
| --- | --- |
| `index.html` | 소개 — 다가오는 학술회(자동), MCUS 소개 + 개요 표, 프로그램 구성, 역대 학술회(자동), MIMIC 소개 |
| `2027.html` | MCUS 2027 (개최 예정) |
| `2026.html` | MCUS 2026 |
| `2025.html` | MCUS 2025 |

연도 페이지는 기존 MCUS 사이트와 같은 메뉴로 구성됩니다: **홈 · 개요 · 일정 · 초록 · 참가 신청 · 장소 안내 · 갤러리**
(한 파일 안에서 `2026.html#schedule`, `2026.html#abstract` 처럼 이동합니다.)

- **홈** — 상단 제목, Quick Menus, 개요 카드 + 기조 강연자(넘겨 보기), Organizers
- **일정** — 날짜별 타임테이블. 강연을 누르면 초록 페이지의 해당 강연이 펼쳐집니다.
- **초록** — 시간 순서대로 강연이 나열되고, 누르면 연사 소개와 초록이 펼쳐집니다. '모두 펼치기' 지원.
  `2025.html#abstract/d1-t2` 처럼 링크하면 Day 1의 Talk 2가 펼쳐진 채로 열립니다.

## 내용 수정하기

레이아웃 코드는 건드리지 않고 **데이터 파일만 고치면** 됩니다.

```
assets/js/data/
├── site.js    # 공통: 연락처, 오시는 길, 분야 태그 이름
├── 2025.js
├── 2026.js
└── 2027.js    # 2026과 같은 구조의 초안 — 빈 값('')은 '추후 공개'로 표시
```

- **연사 추가**: `days[].talks[]` 의 `ko`(한글 이름), `en`(영문 이름), `title`, `abstract`, `tags` 를 채웁니다.
  선택 항목: `affil`(소속), `kind`(`'plenary'` 기조강연 / `'invited'` 초청강연), `field`(연구 분야), `photo`(사진 경로, `assets/img/speakers/`)
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
2. `2027.html` 을 복사해 `2028.html` 로 만들고, `data-year="2028"` 및 제목 수정
3. 모든 HTML 파일 하단에 `<script src="assets/js/data/2028.js"></script>` 추가

메뉴와 소개 페이지 상단의 '다가오는 학술회' 링크는 자동으로 갱신됩니다.

## 디자인

- 색 · 구성: 기존 MCUS 사이트(2025·2026)의 상단 배경, Quick Menus 띠, 개요(하늘색) · 기조 강연자(살구색) 카드를 그대로 이어받음 (`assets/css/style.css` 맨 위 `:root` 변수)
- 글꼴: Pretendard — MIMIC 동아리 사이트(skkumathmimic.github.io)와 동일
- 연사의 `kind: 'plenary'` 는 홈의 '기조 강연자'에 사진(`photo`) · 소속 · 연구 분야(`field`)와 함께 표시됩니다.

## 미리보기 & 배포

- 미리보기: `index.html` 을 브라우저로 열면 됩니다. (빌드 과정 없음)
- **CSS · JS를 고친 뒤 배포할 때**: HTML 파일들의 `?v=20261123` 숫자를 새 날짜로 바꿔 주세요.
  바꾸지 않으면 방문자 브라우저가 예전 `style.css` 를 계속 써서 화면이 깨져 보일 수 있습니다.
  (한 번에 바꾸기: `sed -i '' 's/?v=[0-9]*/?v=새날짜/g' *.html`)
- 배포: GitHub 저장소 Settings → Pages → Branch `main` / `root` 선택 시
  `https://ssuyeoncho.github.io/MCUS/` 에서 공개됩니다.
