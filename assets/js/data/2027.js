/*
 * MCUS 2027 — 2026과 같은 구조로 만든 초안입니다.
 * - 빈 문자열('')로 둔 항목은 사이트에 '추후 공개'로 표시됩니다.
 * - 연사가 정해지면 talks 의 ko / en / title / tags / abstract 를 채우세요.
 * - 참가 신청을 열 때: registration.open 을 true 로, formUrl 에 구글 폼 주소를 넣으세요.
 */
MCUS.addYear({
  year: 2027,
  titleKo: '2027 학부생을 위한 수학 학술회',
  titleEn: '2027 Mathematics Conference for Undergraduate Students',
  start: '2027-01-14',
  end: '2027-01-16',
  dateLabel: '2027. 01. 14. (목) – 01. 16. (토)',
  venueShort: '성균관대학교 자연과학캠퍼스 (세부 장소 추후 안내)',
  host: '성균관대학교 수학과 학술동아리 MIMIC · 성균관대학교 수학과',
  kakao: '',

  overview: [
    { label: 'MCUS란?', value: '수학 전공 학부생들의 발표와 연구자 강연을 통해 서로의 관심 주제를 나누고 다양한 수학적 관점을 접할 수 있도록 마련한 학부생 대상 학술회' },
    { label: '개최 일자', value: '2027. 01. 14. (목) – 01. 16. (토)' },
    { label: '개최 장소', value: '성균관대학교 자연과학캠퍼스 (수원)', note: '세부 장소 추후 안내' },
    { label: '주요 대상', value: '수학과 학부 3, 4학년' },
    { label: '참가비', value: '', note: '' },
    { label: '주최', value: '성균관대학교 수학과 학술동아리 MIMIC, 성균관대학교 수학과' },
  ],

  // 메인 페이지 '최신 정보'에 표시되는 주요 일정
  milestones: [
    { label: '참가 신청 시작', date: '' },
    { label: 'Lightning Talk 연사 모집 마감', date: '' },
    { label: '참가 신청 마감', date: '' },
    { label: 'MCUS 2027 개최', date: '2027. 01. 14. – 01. 16.' },
  ],

  registration: {
    open: false,
    closedLabel: '참가 신청 오픈 예정',
    formUrl: '',
    blocks: [
      {
        title: '참가 신청 안내',
        rows: [
          ['대상', '수학과 학부 3, 4학년 (주요 대상)'],
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

  days: [
    {
      date: '2027-01-14',
      label: '1/14 (목)',
      chairs: [],
      schedule: [
        { time: '10:00 – 10:30', talk: 1 },
        { time: '10:40 – 11:30', talk: 2 },
        { time: '11:30 – 13:30', label: 'Lunch Break', kind: 'break' },
        { time: '13:30 – 14:00', talk: 3 },
        { time: '14:10 – 14:40', talk: 4 },
        { time: '14:50 – 15:20', talk: 5 },
        { time: '15:20 – 16:00', label: 'Coffee Break', kind: 'break' },
        { time: '16:00 – 16:30', talk: 6 },
        { time: '16:40 – 17:20', talk: 7 },
        { time: '17:20 – 18:00', label: 'Lightning Talk', kind: 'lightning' },
        { time: '18:00 –', label: 'Banquet', kind: 'social' },
      ],
      talks: [
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
      ],
      lightning: [],
    },
    {
      date: '2027-01-15',
      label: '1/15 (금)',
      chairs: [],
      schedule: [
        { time: '10:00 – 10:30', talk: 1 },
        { time: '10:40 – 11:30', talk: 2 },
        { time: '11:30 – 13:30', label: 'Lunch Break', kind: 'break' },
        { time: '13:30 – 14:00', talk: 3 },
        { time: '14:10 – 14:40', talk: 4 },
        { time: '14:50 – 15:20', talk: 5 },
        { time: '15:20 – 16:00', label: 'Coffee Break', kind: 'break' },
        { time: '16:00 – 16:30', talk: 6 },
        { time: '16:40 – 17:20', talk: 7 },
        { time: '17:20 – 18:00', label: 'Lightning Talk', kind: 'lightning' },
      ],
      talks: [
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
      ],
      lightning: [],
    },
    {
      date: '2027-01-16',
      label: '1/16 (토)',
      chairs: [],
      schedule: [
        { time: '10:00 – 10:30', talk: 1 },
        { time: '10:40 – 11:30', talk: 2 },
        { time: '11:30 – 13:30', label: 'Lunch Break', kind: 'break' },
        { time: '13:30 – 14:00', talk: 3 },
        { time: '14:10 – 14:40', talk: 4 },
        { time: '14:50 – 15:20', talk: 5 },
        { time: '15:20 – 16:00', label: 'Coffee Break', kind: 'break' },
        { time: '16:00 – 16:30', talk: 6 },
        { time: '16:40 – 17:20', talk: 7 },
        { time: '17:20 – 18:00', label: 'Lightning Talk', kind: 'lightning' },
      ],
      talks: [
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
        { ko: '', en: '', title: '', tags: [], abstract: '' },
      ],
      lightning: [],
    },
  ],

  venue: {
    campus: '성균관대학교 자연과학캠퍼스 (수원)',
    address: '(16419) 경기도 수원시 장안구 서부로 2066 성균관대학교 자연과학캠퍼스',
    building: '',
    rooms: [
      ['연사 진행 장소', ''],
      ['휴게 공간', ''],
    ],
  },

  organizers: [],

  gallery: [],
});
