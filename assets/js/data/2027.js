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
        title: '라이트닝 토크 연사 모집',
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
        { time: '09:00 –', label: '등록', kind: 'break' },
        { time: '09:40 – 10:20', talk: 1 },
        { time: '10:30 – 11:20', talk: 2 },
        { time: '11:30 – 13:00', label: '점심 식사', kind: 'break' },
        { time: '13:00 – 13:50', talk: 3 },
        { time: '14:00 – 14:40', talk: 4 },
        { time: '14:50 – 15:30', talk: 5 },
        { time: '15:40 – 16:20', label: '티타임', kind: 'break' },
        { time: '16:20 – 17:00', talk: 6 },
        { time: '17:10 – 17:50', talk: 7 },
      ],
      talks: [
        { ko: '김민국', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
        {
          ko: '민현기', en: 'Hyunki Min',
          affil: 'KAIST', kind: 'plenary',
          field: 'Contact topology (Low-dimensional topology)',
          photo: 'assets/img/speakers/2027-hyunki-min.jpg',
          title: 'Introduction to contact topology',
          tags: ['topology', 'geometry'],
          abstract: 'Contact topology is the study of special planes in 3-dimensional spaces. While classical topology treats spaces like flexible rubber, equipping a 3-dimensional space with a contact structure reveals an elegant balance between geometric rigidity and flexibility. In this talk, I will introduce the fundamental ideas of contact topology, and visualize what a contact structure looks like and explore how everyday knots transform into Legendrian knots when constrained by these planes. Along the way, we will see the connections between contact topology and other areas of low-dimensional topology.\n\n접촉 위상수학은 3차원 공간 안에 놓인 특별한 평면들을 연구하는 학문입니다. 고전적인 위상수학이 공간을 유연한 고무처럼 다룬다면, 3차원 공간 위의 접촉구조는 기하학적 단단함과 유연성 사이의 우아한 균형을 보여줍니다. 본 강연에서는 접촉 위상수학의 핵심 아이디어를 소개하고, 접촉구조가 실제로 어떻게 생겼는지 시각적으로 살펴보며, 일반적인 매듭이 이 평면들의 제약을 받을 때 어떻게 르장드르 매듭으로 변모하는지 알아봅니다. 이와 더불어 접촉위상수학과 저차원 위상수학의 다른 분야들 사이의 연관성도 함께 살펴볼 것입니다.',
        },
        {
          ko: '지홍창', en: 'Hong Chang Ji',
          affil: 'Sungkyunkwan University', kind: 'plenary',
          field: 'Probability theory (Random matrices, Free probability)',
          photo: 'assets/img/speakers/2027-hongchang-ji.jpg',
          title: 'Random matrices: From heavy nuclei to machine learning',
          tags: ['probability', 'applied'],
          abstract: 'In the 1950s, Wigner modeled the energy levels of heavy nuclei by the eigenvalues of large random symmetric matrices. As the matrix size grows, the limiting behavior of these eigenvalues distribution is largely insensitive to the distribution of the matrix; this phenomenon, called universality, applies on all feasible scales, even at the scale of individual eigenvalues. The same spacing statistics of random matrices are conjectured to appear in “sufficiently chaotic” systems, such as chaotic billiards and zeros of the Riemann zeta function. We will review the development of mathematical results on eigenvalues of random symmetric matrices that culminated in spectral universality, along with their implications. We then discuss how these ideas apply to principal component analysis and to neural networks, where training creates outlier eigenvalues in weight matrices and loss Hessians.',
        },
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
        { time: '11:30 – 13:00', label: '점심 식사', kind: 'break' },
        { time: '13:00 – 13:50', talk: 3 },
        { time: '14:00 – 14:40', talk: 4 },
        { time: '14:50 – 15:30', talk: 5 },
        { time: '15:40 – 16:20', label: '포스터 세션', kind: 'poster', note: '반도체관, 화학관 사이 공터' },
        { time: '16:30 – 17:10', label: '포스터 세션', kind: 'poster', note: '반도체관, 화학관 사이 공터' },
        { time: '17:20 – 18:00', talk: 6 },
        { time: '18:10 – 18:30', label: '라이트닝 토크', kind: 'lightning' },
        { time: '18:30 –', label: '만찬', kind: 'social', note: '종료 시간 미정' },
      ],
      talks: [
        { ko: '황다현', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
        {
          ko: '이석형', en: 'Seok Hyeong Lee',
          affil: '', kind: 'plenary', // 현재 소속 확인 필요 (Ph.D. Princeton University, 2022)
          field: 'Number theory',
          title: '', tags: [], abstract: '',
        },
        {
          ko: '배상현', en: 'Sanghyeon Bae',
          affil: 'Ajou University', kind: 'plenary', // 경영학과 (Department of Business Administration)
          photo: 'assets/img/speakers/2027-sanghyeon-bae.jpg',
          field: 'Financial Planning, Large-scale Optimization, Machine Learning, Multistage Stochastic Programming',
          title: 'Decision making under uncertainty - From Stochastic Programming to SDDP',
          tags: ['applied', 'probability'],
          abstract: 'Many planning problems require a sequence of decisions as uncertain information becomes available over time. This talk introduces stochastic programming as a framework for modeling such problems. We then discuss the curse of dimensionality that arises in multistage problems as the number of state variables grows. To address this computational challenge, we introduce stochastic dual dynamic programming (SDDP), which combines scenario sampling with cutting-plane approximations of future costs. The talk concludes with a brief look at applications in energy systems and portfolio optimization.',
        },
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
        { time: '09:50 – 10:20', label: '라이트닝 토크', kind: 'lightning' },
        { time: '10:30 – 11:20', talk: 2 },
        { time: '11:30 – 13:00', label: '점심 식사', kind: 'break' },
        { time: '13:00 – 13:50', talk: 3 },
        { time: '14:00 – 14:40', talk: 4 },
        { time: '14:50 – 15:30', talk: 5 },
        { time: '15:40 – 16:20', label: '티타임', kind: 'break' },
        { time: '16:20 – 17:00', talk: 6 },
        { time: '17:10 – 17:50', talk: 7 },
      ],
      talks: [
        { ko: '안희성', en: '', affil: '', kind: 'invited', title: '', tags: [], abstract: '' },
        {
          ko: '김민수', en: 'Minsoo Kim',
          affil: 'KIAS (Korea Institute for Advanced Study)', kind: 'plenary', // Research Fellow
          photo: 'assets/img/speakers/2027-minsoo-kim.jpg',
          title: 'From Moving Earth to Aligning Proteins',
          tags: ['analysis', 'applied'],
          abstract: '수학은 복잡한 현실의 문제를 추상화하고, 그 안에 숨어 있는 구조를 발견하는 강력한 도구입니다. 때로는 잘 알려진 수학적 문제의 가정을 조금 바꾸는 것만으로도 전혀 다른 분야의 문제를 해결하는 새로운 방법을 얻을 수 있습니다.\n\n최적수송(Optimal Transport)은 한 곳에 쌓인 흙을 다른 곳으로 옮기는 데 필요한 비용을 최소화하는 문제에서 출발합니다. 이 단순한 질문은 수송량과 비용을 수학적으로 표현하는 최적화 문제로 발전했으며, 오늘날 확률론, 기하학, 기계학습 등 다양한 분야에서 활용되고 있습니다. 특히 질량이 보존되어야 한다는 고전적인 가정을 완화하면, 보다 유연한 대응 관계를 찾는 Unbalanced Optimal Transport로 확장할 수 있습니다.\n\n본 강연에서는 최적수송의 기본적인 수학적 아이디어와 쌍대성(Duality)을 간략히 살펴보고, 질량보존이라는 가정을 완화하는 것이 어떤 새로운 가능성을 열어 주는지 이야기하고자 합니다. 이어서 이러한 수학적 관점이 생물학의 단백질 서열 정렬(Protein Sequence Alignment) 문제에 어떻게 적용될 수 있는지 소개합니다. 특히 최적수송에서 얻어지는 대응 관계와 쌍대변수를 활용하여 서로 다른 단백질 서열 사이의 유사성을 찾아내는 연구 사례를 살펴보겠습니다.\n\n이를 통해 수학의 응용이 단순히 기존의 공식을 다른 분야에 적용하는 데 그치는 것이 아니라, 문제를 새로운 관점에서 바라보고 수학적 가정을 재해석하는 과정에서 시작될 수 있음을 함께 생각해 보고자 합니다.',
        },
        {
          ko: '이호빈', en: 'Hobin Lee',
          affil: 'Seoul National University', kind: 'plenary',
          field: 'Nonlinear Partial Differential Equations', // 비선형편미분방정식
          title: 'Time-asymptotic behavior towards viscous shocks for compressible Navier-Stokes equations',
          tags: ['analysis', 'physics'],
          abstract: 'We investigate the well-posedness of the compressible Navier–Stokes equations with two different constant states prescribed as far-field conditions. In particular, we consider how classical solutions behave as time tends to infinity. Their time-asymptotic behavior is related to the associated Riemann problem for the compressible Euler equations. There are several types of Riemann solutions. Among these, we focus on shock waves.',
        },
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
      ['포스터 세션, 휴게 공간', '반도체관, 화학관 사이 공터'],
    ],
  },

  organizers: [],

  gallery: [],
});
