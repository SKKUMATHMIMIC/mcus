/*
 * 사이트 공통 정보
 * - 연도별 행사 정보는 같은 폴더의 2025.js, 2026.js, 2027.js 에 있습니다.
 * - 새 연도를 추가하려면: 2027.js 를 복사해 2028.js 를 만들고,
 *   index.html / 2028.html 에 <script src="assets/js/data/2028.js"> 를 추가하세요.
 */
window.MCUS = {
  years: {},
  addYear(data) {
    this.years[data.year] = data;
  },

  contact: {
    email: 'skkumathmimic@gmail.com',
    website: 'https://skkumathmimic.github.io/',
    instagram: 'https://instagram.com/skku_math_mimic',
    instagramHandle: '@skku_math_mimic',
    youtube: 'https://www.youtube.com/channel/UCF4w8Niu8UBYFX97l0r4mLQ',
  },

  // 자연과학캠퍼스 오시는 길 (모든 연도 공통)
  directions: [
    { kind: 'subway', label: '지하철 Subway', text: '1호선 성균관대역 하차 후 2번 출구에서 도보 15분' },
    { kind: 'bus', label: '일반 버스 City-bus', text: '62-1, 82-2, 39' },
    { kind: 'bus', label: '시외 버스 Inter-city bus', text: '7800 : 성대입구(학교후문, 율전동사무소앞) → 사당역 → 성균관대(율전동사무소맞은편)\n3003 : 율전성당 → 예술의전당 → 서초역 → 강남역 → 뱅뱅사거리 → 양재역 → 율전성당' },
  ],
  campusMap: 'https://www.skku.edu/skku/about/campusInfo/campusMap.do?campusCd=2',

  // 연도 페이지 홈에 들어가는 학술회 한 줄 소개 (모든 연도 공통)
  about: {
    title: '학부생이 서로의 관심사를 나눌 수 있는 학술회',
    text: '연구자와 학생 연사의 강연을 통해 폭넓은 분야의 수학을 접하고, 학교와 학년, 전공 분야를 넘어 서로의 관심사를 나누는 학부생을 위한 수학 학술회입니다. 처음 접하는 분야라도 큰 흐름을 따라갈 수 있도록, 배경 개념과 맥락을 함께 소개하는 강연을 지향합니다.',
  },
};

// 발표 분야 태그 (각 연도 파일의 talks[].tags 에서 사용)
window.MCUS.fields = {
  topology: '위상수학',
  geometry: '기하학',
  algebra: '대수학, 표현론',
  number: '정수론',
  combinatorics: '조합론',
  analysis: '해석학, PDE',
  probability: '확률, 통계',
  applied: '응용수학, AI',
  physics: '수리물리',
  crypto: '암호학',
};
