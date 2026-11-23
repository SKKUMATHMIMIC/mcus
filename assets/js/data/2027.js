/*
 * MCUS 2027 — 2026과 같은 구조로 만든 초안입니다.
 * - 빈 문자열('')로 둔 항목은 사이트에 '추후 공개'로 표시됩니다.
 * - 연사가 정해지면 talks 의 ko / en / affil(소속) / kind / title / tags / abstract 를 채우세요.
 *   kind: 'plenary' = 기조강연, 'invited' = 초청강연 → '연사' 섹션에 자동으로 분류됩니다.
 * - 참가 신청을 열 때: registration.open 을 true 로, formUrl 에 구글 폼 주소를 넣으세요.
 */
MCUS.addYear({
  year: 2027,
  titleKo: '2027 학부생을 위한 수학 학술회',
  titleEn: '2027 Mathematics Conference for Undergraduate Students',
  start: '2027-01-14',
  end: '2027-01-16',
  dateLabel: '2027. 01. 14. (목) – 01. 16. (토)',
  venueShort: '성균관대학교 자연과학캠퍼스 반도체관 1층 400126',
  host: '성균관대학교 수학과 학술동아리 MIMIC',
  support: '성균관대학교 수학과', // 후원 (재정 지원: 팜플렛, 다과 등)
  kakao: '',

  overview: [
    { label: '개최 일자', value: '2027. 01. 14. (목) – 01. 16. (토)' },
    { label: '개최 장소', value: '성균관대학교 자연과학캠퍼스 (수원) 반도체관 1층 400126' },
    { label: '참가 대상', value: '수학에 관심이 있는 누구나' },
    { label: '참가비', value: '', note: '' },
    { label: '주최', value: '성균관대학교 수학과 학술동아리 MIMIC' },
    { label: '후원', value: '성균관대학교 수학과' },
  ],

  registration: {
    open: false,
    closedLabel: '참가 신청 오픈 예정',
    formUrl: '',
    blocks: [
      {
        title: '참가 신청 안내',
        rows: [
          ['참가 대상', '수학에 관심이 있는 누구나'],
          ['신청 방법', "'MCUS 2027 참가 신청서' 구글 폼 제출"],
          ['신청 기한', ''],
        ],
        note: '최대 인원 초과 시 조기 마감될 수 있습니다.',
      },
      {
        title: 'Lightning Talk 연사 모집',
        rows: [
          ['대상', "'MCUS 2027'에 참여하는 학부생"],
          ['신청 방법', "참가 신청서의 'Lightning Talk 연사자 모집' 항목에서 '참여' 선택 후, skkumathmimic@gmail.com 으로 주제 및 간단한 발표 내용 보내기"],
          ['모집 기한', ''],
        ],
        note: '최대 인원 초과 시 조기 마감될 수 있습니다.',
      },
    ],
  },

  // schedule 의 kind: 'break'(휴식, 등록) / 'lightning' / 'poster' / 'social'(만찬)
  // 끝나는 시간이 없는 항목('09:00 –')은 같은 날 다음 일정 시작까지로 표시됩니다.
  days: [
    {
      date: '2027-01-14',
      label: '1/14 (목)',
      chairs: [],
      schedule: [
        { time: '09:00 –', label: 'Registration', kind: 'break' },
        { time: '09:40 – 10:20', talk: 1 },
        { time: '10:30 – 11:20', talk: 2 },
        { time: '11:30 – 13:00', label: 'Lunch Break', kind: 'break' },
        { time: '13:00 – 13:50', talk: 3 },
        { time: '14:00 – 14:40', talk: 4 },
        { time: '14:50 – 15:30', talk: 5 },
        { time: '15:40 – 16:20', label: 'Tea Time', kind: 'break' },
        { time: '16:20 – 17:00', talk: 6 },
        { time: '17:10 – 17:50', talk: 7 },
      ],
      talks: [
        { ko: '김민국', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
        { ko: '민현기', en: '', affil: '', kind: 'plenary', title: '', tags: [], abstract: '' },
        { ko: '지홍창', en: '', affil: '', kind: 'plenary', title: '', tags: [], abstract: '' },
        { ko: '신준우', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
        { ko: '김경만', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
        { ko: '고호진', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
        { ko: '조영우', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
      ],
      lightning: [],
    },
    {
      date: '2027-01-15',
      label: '1/15 (금)',
      chairs: [],
      schedule: [
        { time: '09:40 – 10:20', talk: 1 },
        { time: '10:30 – 11:20', talk: 2 },
        { time: '11:30 – 13:00', label: 'Lunch Break', kind: 'break' },
        { time: '13:00 – 13:50', talk: 3 },
        { time: '14:00 – 14:40', talk: 4 },
        { time: '14:50 – 15:30', talk: 5 },
        { time: '15:40 – 16:20', label: 'Poster Session', kind: 'poster', note: '반도체관, 화학관 사이 공터' },
        { time: '16:30 – 17:10', label: 'Poster Session', kind: 'poster', note: '반도체관, 화학관 사이 공터' },
        { time: '17:20 – 18:00', talk: 6 },
        { time: '18:10 – 18:30', label: 'Lightning Talk', kind: 'lightning' },
        { time: '18:30 –', label: 'Banquet', kind: 'social', note: '종료 시간 미정' },
      ],
      talks: [
        { ko: '황다현', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
        { ko: '이석형', en: '', affil: '', kind: 'plenary', title: '', tags: [], abstract: '' },
        { ko: '배상현', en: '', affil: '', kind: 'plenary', title: '', tags: [], abstract: '' },
        { ko: '이민서', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
        { ko: '최푸른하늘', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
        { ko: '이은성', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
      ],
      lightning: [],
    },
    {
      date: '2027-01-16',
      label: '1/16 (토)',
      chairs: [],
      schedule: [
        { time: '09:00 – 09:40', talk: 1 },
        { time: '09:50 – 10:20', label: 'Lightning Talk', kind: 'lightning' },
        { time: '10:30 – 11:20', talk: 2 },
        { time: '11:30 – 13:00', label: 'Lunch Break', kind: 'break' },
        { time: '13:00 – 13:50', talk: 3 },
        { time: '14:00 – 14:40', talk: 4 },
        { time: '14:50 – 15:30', talk: 5 },
        { time: '15:40 – 16:20', label: 'Tea Time', kind: 'break' },
        { time: '16:20 – 17:00', talk: 6 },
        { time: '17:10 – 17:50', talk: 7 },
      ],
      talks: [
        { ko: '안희성', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
        { ko: '김민수', en: '', affil: '', kind: 'plenary', title: '', tags: [], abstract: '' },
        { ko: '이호빈', en: '', affil: '', kind: 'plenary', title: '', tags: [], abstract: '' },
        { ko: '양권우', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
        { ko: '송한림', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
        { ko: '이호준', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
        { ko: '이민혁', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
      ],
      lightning: [],
    },
  ],

  venue: {
    campus: '성균관대학교 자연과학캠퍼스 (수원)',
    address: '(16419) 경기도 수원시 장안구 서부로 2066 성균관대학교 자연과학캠퍼스',
    building: '반도체관',
    mapQuery: '성균관대학교 반도체관', // 지도 검색어 (구글 지도, 네이버 지도, 카카오맵)
    buildNo: '240', // 성균관대 캠퍼스 맵 건물 번호 (반도체관)
    rooms: [
      ['행사 진행 장소', '1층 400126'],
      ['포스터 세션', '반도체관, 화학관 사이 공터'],
    ],
  },

  organizers: [],

  gallery: [],
});
