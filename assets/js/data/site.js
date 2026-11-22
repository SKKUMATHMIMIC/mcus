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
};

// 발표 분야 태그 (각 연도 파일의 talks[].tags 에서 사용)
window.MCUS.fields = {
  topology: '위상수학',
  geometry: '기하학',
  algebra: '대수학·표현론',
  combinatorics: '조합론',
  analysis: '해석학·PDE',
  probability: '확률·통계',
  applied: '응용수학·AI',
  physics: '수리물리',
  crypto: '암호학',
};
