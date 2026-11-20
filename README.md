# MCUS — 학부생을 위한 수학 학술회

Mathematics Conference for Undergraduate Students (MCUS) 통합 웹사이트입니다.
주최: 성균관대학교 수학과 학술동아리 MIMIC · 성균관대학교 수학과

## 페이지 구성

| 파일 | 내용 |
| --- | --- |
| `index.html` | 메인 — 최신 정보(가장 최근 연도 자동 표시), MCUS의 의의, 역대 학술회, 주최 소개 |
| `2027.html` | MCUS 2027 (개최 예정) |
| `2026.html` | MCUS 2026 |
| `2025.html` | MCUS 2025 |

각 연도 페이지는 개요 · 일정 · 초록 · 참가 신청 · 장소 안내 · 갤러리 · 조직위원회 섹션으로 구성됩니다.

## 내용 수정하기

레이아웃 코드는 건드리지 않고 **데이터 파일만 고치면** 됩니다.

```
assets/js/data/
├── site.js    # 공통: 연락처, 메인 '최신 소식', 오시는 길, 분야 태그 이름
├── 2025.js
├── 2026.js
└── 2027.js    # 2026과 같은 구조의 초안 — 빈 값('')은 '추후 공개'로 표시
```

- **연사 추가**: `days[].talks[]` 의 `ko`(한글 이름), `en`(영문 이름), `title`, `abstract`, `tags` 를 채웁니다.
  초록 문단을 나누려면 `\n\n` 을 넣으세요.
- **분야 태그**: `tags: ['topology', 'combinatorics']` 처럼 `site.js` 의 `fields` 키를 사용합니다.
- **일정표**: `schedule` 의 `{ time, talk: n }` 은 같은 날 `talks` 의 n번째 강연을 가리킵니다.
  휴식·식사는 `{ time, label, kind: 'break' }`, Lightning Talk은 `kind: 'lightning'`, 만찬은 `kind: 'social'`.
- **참가 신청 열기**: `registration.open` 을 `true` 로, `formUrl` 에 구글 폼 주소를 넣으면 신청 버튼이 활성화됩니다.
- **메인 페이지 주요 일정**: `2027.js` 의 `milestones` 를 채우세요.
- **최신 소식**: `site.js` 의 `news` 맨 위에 항목을 추가합니다.
- **갤러리**: 사진을 `assets/img/` 에 넣고 `gallery` 배열에 `{ src, alt }` 로 추가합니다.
- **개최 예정 / 행사 종료** 표시와 D-day는 `start`, `end` 날짜로 자동 계산됩니다.

## 새 연도 추가 (예: 2028)

1. `assets/js/data/2027.js` 를 복사해 `2028.js` 로 만들고 내용을 수정
2. `2027.html` 을 복사해 `2028.html` 로 만들고, `data-year="2028"` 및 제목 수정
3. 모든 HTML 파일 하단에 `<script src="assets/js/data/2028.js"></script>` 추가
4. 연도별 색상은 `assets/css/style.css` 의 `[data-year='2028']` 에 지정 (없으면 기본 초록)

메뉴, 메인 페이지의 '다가오는 학술회' 카드, 역대 학술회 목록은 자동으로 갱신됩니다.

## 미리보기 & 배포

- 미리보기: `index.html` 을 브라우저로 열면 됩니다. (빌드 과정 없음)
- 배포: GitHub 저장소 Settings → Pages → Branch `main` / `root` 선택 시
  `https://ssuyeoncho.github.io/MCUS/` 에서 공개됩니다.
