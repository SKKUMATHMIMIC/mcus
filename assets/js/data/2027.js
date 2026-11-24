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
  host: '성균관대학교 수학 학술동아리 MIMIC',
  support: '성균관대학교 수학과', // 후원 (재정 지원: 팜플렛, 다과 등)
  kakao: '',

  overview: [
    { label: '개최 일자', value: '2027. 01. 14. (목) – 01. 16. (토)' },
    { label: '개최 장소', value: '성균관대학교 자연과학캠퍼스 (수원) 반도체관 1층 400126' },
    { label: '참가 대상', value: '수학에 관심이 있는 누구나', note: '주로 학부 3, 4학년' },
    { label: '참가비', value: '무료', note: '3일간 중식 및 2일차(1. 15.) 석식(만찬) 제공' },
    { label: '주최', value: '성균관대학교 수학 학술동아리 MIMIC' },
    { label: '후원', value: '성균관대학교 수학과' },
  ],

  registration: {
    open: true,
    closedLabel: '참가 신청 오픈 예정',
    formUrl: 'https://forms.gle/4x1G2KPURGfJxgsc8',
    // blocks 의 선택 항목 (포스터 모집처럼 따로 받는 신청에 사용)
    //   id: 주소 (#registration/poster 로 바로 이동) · lead: 설명 문단
    //   until: 마감일 — 이 날까지 '모집 중' 표시, 지나면 '모집 마감'
    //   notice: 마감 전까지 홈 화면(index, 연도 홈)에 띄울 알림 문구
    //   action: 신청 버튼 { label, href } — 마감 후에는 숨김
    //   main: true 인 블록은 '참가 신청' 블록 — 색을 달리해 표시하고 참가 신청서 버튼이 붙음
    //   note: 한 줄이면 문자열, 여러 줄이면 배열
    blocks: [
      {
        id: 'apply',
        main: true,
        title: '참가 신청',
        until: '2027-01-07',
        lead: ['MCUS 2027에 참가를 원하시는 분은 아래 신청서를 작성해 주시기 바랍니다.'],
        rows: [
          ['신청 기한', '2027. 1. 7. (목)'],
          ['문의', 'skkumathmimic@gmail.com'],
        ],
        note: [
          '숙박은 제공하지 않습니다.',
          '신청 인원이 최대 인원을 초과하면 조기 마감될 수 있습니다.',
        ],
      },
      {
        id: 'poster',
        title: '포스터 발표자 모집',
        notice: '포스터 발표자를 모집합니다',
        until: '2026-12-06',
        lead: [
          '이번 학술회에서는 포스터 세션이 새롭게 진행됩니다. 연구 성과나 공부한 내용을 포스터로 발표하고, 참가자들과 함께 나눌 발표자를 모집합니다.',
          '포스터 세션은 발표자가 자신의 주제를 포스터로 정리해 전시하고, 관심 있는 참가자들에게 직접 설명하며 자유롭게 질의응답과 의견을 나누는 프로그램입니다.',
          '발표 내용에는 큰 제한이 없습니다. 직접 수행한 연구뿐 아니라 수업이나 스터디에서 공부한 내용, 개인적으로 관심을 가지고 탐구한 주제 등 수학과 관련된 다양한 내용을 발표할 수 있습니다. 다른 학회에서 발표했던 포스터를 다시 활용하는 것도 가능합니다.',
          '새로운 연구 성과가 반드시 필요한 것은 아니므로, 다른 사람들과 나누고 싶은 관심 주제가 있다면 부담 없이 참여해 주시기 바랍니다.',
        ],
        rows: [
          ['발표 일시', '2027. 01. 15. (금)\n1부 15:40 – 16:20\n2부 16:30 – 17:10'],
          ['모집 대상', '학부생 및 석사과정생'],
          ['발표 주제', '수학 관련 자유 주제'],
          ['출력 지원', '포스터 출력(A1 사이즈)은 동아리에서 지원할 예정입니다.'],
          ['신청 기한', '2026. 12. 6. (일)'],
          ['신청 방법', 'skkumathmimic@gmail.com 으로 발표 참여 의사 연락'],
        ],
        note: '신청 기한까지는 발표 참여 의사를 알려주시면 되며, 포스터 제출 일정과 준비 사항은 추후 안내드릴 예정입니다.',
      },
      {
        id: 'lightning',
        title: '라이트닝 토크 연사 모집',
        until: '2027-01-07',
        lead: [
          '라이트닝 토크(Lightning Talk)는 학부생 연사가 5분 동안 자신이 공부하거나 연구하고 있는 주제를 짧고 가볍게 소개하는 시간입니다.',
          '수업이나 스터디에서 공부한 내용, 개인적으로 탐구한 주제 등 수학과 관련된 내용이라면 무엇이든 발표할 수 있습니다.',
        ],
        rows: [
          ['발표 일시', '2027. 01. 15. (금) 18:10 – 18:30\n2027. 01. 16. (토) 09:50 – 10:20'],
          ['모집 대상', 'MCUS 2027에 참가하는 학부생'],
          ['주제 예시', 'Various fixed point theorems in mathematics, Banach–Tarski paradox'],
          ['신청 방법', "참가 신청서의 'Lightning Talk 연사 모집' 항목에서 '참여' 선택 후, 발표 주제와 발표 자료를 skkumathmimic@gmail.com 으로 제출"],
          ['제출 기한', '2027. 1. 7. (목)'],
        ],
        note: '최대 인원을 초과하면 조기 마감될 수 있습니다.',
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
        { time: '15:40 – 16:20', label: '커피 브레이크', kind: 'break' },
        { time: '16:20 – 17:00', talk: 6 },
        { time: '17:10 – 17:50', talk: 7 },
      ],
      talks: [
        { ko: '김민국', en: 'Mingook Kim', affil: 'Sungkyunkwan University', kind: 'invited', title: '', tags: [], abstract: '' },
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
        {
          ko: '신준우', en: 'Joon Woo Shin',
          affil: 'Yonsei University', kind: 'invited',
          title: 'Virasoro constraints and Jeffrey-Kirwan localization',
          tags: ['geometry', 'algebra'],
          abstract: 'One of main themes of enumerative geometry is the computation of virtual invariants of moduli spaces. Virasoro constraints tell you when such virtual invariants are equal to zero. In the work of Bojko, Lim and Moreira, Virasoro constraints for moduli spaces of sheaves are understood through Joyce’s vertex algebra. We propose a new interpretation, for the case of moduli space of quiver representations, using Jeffrey-Kirwan localization. Jeffrey-Kirwan localization relates virtual intersection number of a GIT quotient with multidimensional residue of certain meromorphic functions. We show that any reflection invariant logarithmic vector field produces an operator annihilating such residue. We show that Virasoro constraints arise from such vector fields. As an application, we construct analogue of Virasoro constraints for K-theory. This is based on the joint work in progress with Professor Woonam Lim.',
        },
        {
          ko: '김경만', en: 'Kyoungman Kim',
          affil: 'Sungkyunkwan University', kind: 'invited',
          title: 'Neural Operators with Derivative Information: Physics-Informed and Sobolev Training',
          tags: ['analysis', 'applied'],
          abstract: 'In this talk, we introduce neural approaches to solving PDEs, beginning with PINNs and reviewing DeepONet, FNO, and the scalable Operator Transformer. We then discuss two approaches to incorporating derivative information: Physics-Informed Neural Operator, which imposes PDE residual constraints, and Sobolev Training for Operator Learning, which matches solution values and derivatives. We compare their mathematical motivations, training objectives.',
        },
        {
          ko: '고호진', en: 'Hojin Ko',
          affil: 'Sungkyunkwan University', kind: 'invited',
          title: '공간의 칠흑과 시간의 흐릿함 속에서 최적제어/강화학습의 수학적 최적성을 비추다',
          tags: ['applied', 'probability'],
          abstract: '최적제어의 전통적 수치해법은 격자 기반 근사에 크게 의존하며, 이로 인해 고차원에서 차원의 저주에 직면한다. 강화학습과 딥러닝은 격차-free한 정책 학습을 가능하게 하지만, 목적함수의 gradient가 제공하는 정보만으로 격자-based에 준하는 최적성의 수학적 구조를 온전히 복원하기는 어렵다. 이와 동시에 long-horizon 또는 시간비일관적 문제에서는 장기적인 시간 의존성과 미래 효과를 안정적으로 학습하는 것 역시 중요한 난제로 남아 있다. 본 발표에서는 이러한 공간적·시간적 제약을 딥러닝의 다층적 미분 구조를 활용하여 극복하는 접근을 소개한다. 특히 강화학습의 주요 방법론인 Monte-Carlo 기반의 local policy improvement 처럼 고차원 stochastic control에서 필요한 gradient 정보를 직접 추정하고 이를 최적성의 수학적 조건과 연결하는 방법에 초점을 맞춘다. 마지막으로 이러한 방법론이 시간비일관 문제, exact no-action, long-horizon control과 같이 기존의 목적함수 최적화만으로는 원하는 최적성 구조에 도달하기 어려운 문제에서 실제로 어떻게 활용될 수 있는지를 발표자의 연구 사례를 통해 소개한다.',
        },
        {
          ko: '조영우', en: 'Young Woo Cho',
          affil: 'Yonsei University', kind: 'invited',
          title: 'How We Compute the Rank of the Mordell–Weil Group?',
          tags: ['algebra', 'geometry'],
          abstract: 'Understanding the rational solutions of Diophantine equations is a central problem in number theory. For elliptic curves, the Mordell–Weil rank is a fundamental arithmetic invariant that determines whether the set of rational points is finite or infinite.\n\nThe Mordell–Weil theorem states that the group of rational points on an elliptic curve over the rational numbers is finitely generated. However, it does not tell us how to determine its rank.\n\nIn this talk, we explore the theory of descent and its role in understanding the arithmetic of elliptic curves. We discuss the weak Mordell–Weil theorem, the use of height functions in proving finite generation, and how Selmer groups provide upper bounds on the rank. We also illustrate these ideas through an explicit example of rank computation.\n\nFinally, we introduce the Birch–Swinnerton-Dyer conjecture, which predicts a remarkable connection between the Mordell–Weil rank and the behavior of the associated \\(L\\)-function at \\(s=1\\).\n\n디오판토스 방정식의 유리수 해를 이해하는 것은 정수론의 핵심적인 문제 중 하나입니다. 타원곡선의 경우, Mordell–Weil rank는 유리점의 집합이 유한한지 무한한지를 결정하는 중요한 산술적 불변량입니다.\n\nMordell–Weil 정리는 유리수체 위에 정의된 타원곡선의 유리점군이 유한 생성 아벨 군임을 보장합니다. 그러나 이 정리 자체는 주어진 타원곡선의 rank를 어떻게 결정할 수 있는지 알려주지 않습니다.\n\n이번 세미나에서는 descent 이론을 중심으로 타원곡선의 산술적 구조를 탐구합니다. Weak Mordell–Weil 정리와 유한 생성성을 증명하는 데 사용되는 높이 함수(height function)를 살펴보고, Selmer group을 이용하여 rank의 상계를 구하는 방법을 소개합니다. 또한 구체적인 타원곡선의 rank를 계산하는 예시를 통해 이러한 이론이 실제로 어떻게 적용되는지 알아보고자 합니다.\n\n마지막으로 Mordell–Weil rank와 타원곡선에 대응하는 \\(L\\)-함수의 \\(s=1\\)에서의 성질 사이에 놀라운 관계를 예측하는 Birch–Swinnerton-Dyer 추측을 소개합니다.',
        },
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
        { time: '18:30 –', label: '만찬', kind: 'social', note: '장소 추후 안내' },
      ],
      talks: [
        { ko: '황다현', en: 'Dahyeon Hwang', affil: 'Yonsei University', kind: 'invited', title: '', tags: [], abstract: '' },
        {
          ko: '이석형', en: 'Seok Hyeong Lee',
          affil: 'Seoul National University', kind: 'plenary', // QSMS 박사후연구원 (Ph.D. Princeton University, 2022)
          photo: 'assets/img/speakers/2027-seokhyeong-lee.jpg',
          field: 'Number theory',
          title: 'How to count lattices',
          tags: ['number', 'geometry'],
          abstract: 'Lattices are familiar objects in number theory and geometry. They also arise in less obvious places, where counting lattices can tell us something about the algebraic objects they describe. In this talk, I will introduce some classical questions about counting lattices and discuss how mathematicians have approached them. I will also give a sense of why these questions arise in different areas of mathematics and where they lead in current research.',
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
        {
          ko: '이민서', en: '',
          affil: 'POSTECH', kind: 'invited',
          title: 'Topology of Complex Hypersurface Singularities',
          tags: ['topology', 'geometry'],
          abstract: 'By intersecting a complex plane curve with a sufficiently small sphere centered at a singular point, we obtain a knot or link that encodes the local topology of the singularity. Similarly, we can consider higher-dimensional complex hypersurface singularities and their corresponding links. In this talk, we introduce the Milnor fibration, which describes the complement of the corresponding link as a fiber bundle over the circle. We then return to the plane curve case and discuss how Puiseux parametrizations can be used to understand the associated knots.',
        },
        {
          ko: '최푸른하늘', en: 'Pooreunhaneul Choi',
          affil: 'KAIST', kind: 'invited',
          title: 'Beyond Dimensions: An Invitation to Algebraic K-Theory',
          tags: ['algebra', 'geometry'],
          abstract: 'For a field \\(k\\), finite-dimensional \\(k\\)-modules—that is, \\(k\\)-vector spaces—are completely classified by their dimensions. If we replace the field \\(k\\) by a general ring \\(R\\), however, the situation becomes much more complicated: \\(R\\)-modules can no longer be classified by a single numerical invariant, and even the notion of dimension is no longer straightforward.\n\nMotivated by this, we will explore algebraic K-theory, which may be viewed as a far-reaching generalization of the idea of dimension. Starting from projective modules and the Grothendieck group \\(K_0\\), we will see how K-theory naturally connects algebra, algebraic geometry, and number theory.\n\nIf time permits, we will also briefly introduce higher K-theory, initiated by Daniel Quillen, and give a glimpse of some modern perspectives on the subject.\n\n체 \\(k\\)에 대하여 유한차원 \\(k\\)-모듈, 즉 \\(k\\)-벡터공간은 그 차원에 의해 완전히 분류됩니다. 그러나 체 \\(k\\) 대신 일반적인 환 \\(R\\)을 생각하면 상황은 훨씬 복잡해집니다. \\(R\\)-모듈은 더 이상 하나의 수치적 불변량만으로 분류되지 않으며, ‘차원’이라는 개념 자체도 더 이상 자명하게 정의되지 않습니다.\n\n이러한 문제의식에서 출발하여, 이번 강연에서는 차원이라는 개념을 광범위하게 일반화한 것으로 볼 수 있는 대수적 K-이론을 소개하고자 합니다. 사영 모듈과 Grothendieck 군 \\(K_0\\)에서 시작하여, K-이론이 대수학, 대수기하학, 정수론 등 여러 분야와 어떻게 자연스럽게 연결되는지 살펴볼 예정입니다.\n\n시간이 허락한다면 Daniel Quillen으로부터 시작된 higher K-theory와, K-이론을 바라보는 몇 가지 현대적인 관점도 간략히 소개하고자 합니다.',
        },
        {
          ko: '이은성', en: 'Eunsung Lee',
          affil: 'Sungkyunkwan University', kind: 'invited',
          title: 'Topological Applications in Economics: Brouwer and Kakutani Fixed Point Theorems',
          tags: ['topology', 'applied'],
          abstract: 'In this presentation, we examine the Brouwer Fixed Point Theorem and the Kakutani Fixed Point Theorem in topology and explore their applications to General Equilibrium Theory in economics. In particular, we focus on how these fixed point theorems are used to establish the existence of an equilibrium price vector at which supply equals demand in all markets.\n\n본 발표에서는 위상수학의 브라워 고정점 정리(Brouwer Fixed Point Theorem)와 카쿠타니 고정점 정리(Kakutani Fixed Point Theorem)를 살펴보고, 이를 경제학의 일반균형이론(General Equilibrium Theory)에 적용하는 과정을 다룬다. 특히 경제 내 모든 시장에서 수요와 공급이 일치하는 균형가격의 존재성을 증명하는 과정에서 두 고정점 정리가 어떠한 역할을 하는지 살펴본다.',
        },
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
        { time: '15:40 – 16:20', label: '커피 브레이크', kind: 'break' },
        { time: '16:20 – 17:00', talk: 6 },
        { time: '17:10 – 17:50', talk: 7 },
      ],
      talks: [
        {
          ko: '안희성', en: 'Huiseong An',
          affil: 'Sungkyunkwan University', kind: 'invited',
          title: 'Weyl chamber로 보는 SVD',
          tags: ['geometry', 'algebra'],
          abstract: 'SVD는 행렬이 공간을 방향별로 얼마나 늘이는지를 singular value를 통해 기술한다. 이때 singular value의 정렬은 Weyl group의 fundamental domain으로 이해할 수 있다. 본 발표에서는 \\(\\mathrm{GL}(n,\\mathbb{R})\\)에 대응되는 positive Weyl chamber의 한 점이 가역행렬의 singular value 쌍에 대응됨을 관찰한다. 이후 reductive Lie group의 Weyl chamber를 통해 SVD를 \\(KAK\\) decomposition으로 일반화한다. 마지막으로 Weyl chamber 상에서의 기하학적 위치가 행렬의 작용에 대해 어떤 정보를 담고 있는지 다룬다.',
        },
        {
          ko: '김민수', en: 'Minsoo Kim',
          affil: 'KIAS (Korea Institute for Advanced Study)', kind: 'plenary', // Research Fellow
          field: 'Computational Biophysics, AI-driven Protein Structure Prediction & Molecular Simulation', // 계산생물물리학, AI 기반 단백질 구조 예측 및 분자 동역학 시뮬레이션
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
        {
          ko: '양권우', en: 'Kweonwoo Yang',
          affil: 'Sungkyunkwan University', kind: 'invited',
          title: 'A Probabilistic Approach to Solving High-Dimensional PDEs: From BSDEs to the Deep BSDE Method',
          tags: ['analysis', 'probability'],
          abstract: '고차원 편미분방정식(Partial Differential Equation, PDE)의 수치적 해법은 차원이 증가함에 따라 계산 비용이 급격히 증가하는 차원의 저주(Curse of Dimensionality)에 직면한다. 이러한 문제에 접근하는 방법 중 하나는 PDE의 해를 확률과정을 통해 표현하고 이를 수치적으로 근사하는 것이다. 고전적인 Feynman–Kac 공식은 특정 선형 포물형 PDE의 해를 확률과정에 대한 기댓값으로 표현하며, 후방 확률미분방정식(Backward Stochastic Differential Equation, BSDE)은 이러한 확률적 표현을 반선형(semilinear) 포물형 PDE로 확장한다. 그러나 BSDE의 확률적 표현을 얻더라도 고차원에서 미지의 확률과정을 수치적으로 근사하는 데에는 어려움이 남는다. 이를 해결하기 위한 접근으로 신경망을 활용하는 Deep BSDE method가 제안되었다.\n\n본 발표에서는 Itô의 공식을 이용하여 반선형 포물형 PDE의 해로부터 BSDE의 해가 구성되는 과정을 살펴보고, 이를 통해 비선형 Feynman–Kac 표현의 원리를 소개한다. 이어서 이러한 수학적 대응 관계의 수치적 응용으로서 Deep BSDE method를 다룬다. 특히 PDE 해의 기울기와 관련된 확률과정을 신경망으로 근사하고, 종단조건에 기반한 최적화를 통해 주어진 점에서 PDE 해의 값을 수치적으로 구하는 원리를 설명한다. 이를 통해 PDE와 확률과정 사이의 이론적 연결이 고차원 PDE의 수치해법으로 이어지는 과정을 조망하고자 한다.\n\nNumerical methods for high-dimensional partial differential equations (PDEs) often suffer from the curse of dimensionality, as computational costs grow rapidly with increasing spatial dimension. One approach to this challenge is to represent solutions of PDEs using stochastic processes and develop numerical methods based on these representations. The classical Feynman–Kac formula provides a probabilistic representation for certain linear parabolic PDEs, while backward stochastic differential equations (BSDEs) extend this connection to a class of semilinear parabolic PDEs. However, even with such probabilistic representations, numerically approximating the unknown stochastic processes in high dimensions remains challenging. The Deep BSDE method was introduced to address this difficulty by incorporating neural networks into the numerical solution of BSDEs.\n\nIn this talk, we use Itô\'s formula to show how a sufficiently smooth solution of a semilinear parabolic PDE gives rise to a solution of the associated BSDE, illustrating the principle of the nonlinear Feynman–Kac representation. We then introduce the Deep BSDE method as a numerical application of this mathematical connection. In particular, we explain how neural networks approximate the stochastic process associated with the gradient of the PDE solution, and how optimization based on the terminal condition yields a numerical approximation of the PDE solution at a given point. Through this approach, we illustrate how the theoretical connection between PDEs and stochastic processes provides a foundation for numerical methods for high-dimensional PDEs.',
        },
        {
          ko: '송한림', en: 'Hanlim Song',
          affil: 'Sungkyunkwan University', kind: 'invited',
          title: 'Weak Topologies and the Dunford-Pettis Theorem',
          tags: ['analysis', 'topology'],
          abstract: 'When working with infinite dimensional vector spaces, we often meet some difficulties, many of which arise when properties in finite dimensional spaces no longer hold in infinite dimensions. Hence, we sometimes need a detour to make use of these properties. In this talk, we first discuss the differences between finite and infinite dimensional Banach spaces, then introduce the weak and weak-\\(*\\) topologies along with some fundamental results. We connect these concepts to weak compactness, leading to the Dunford-Pettis theorem.',
        },
        {
          ko: '이호준', en: 'Hojun Lee',
          affil: 'Sungkyunkwan University', kind: 'invited',
          title: 'Neural Filtering and Portfolio Policy Learning under Partial Observation',
          tags: ['applied', 'probability'],
          abstract: 'This study uses neural networks to estimate the conditional distribution of latent factors and learn portfolio policies in a partially observed multi-asset market. The conditional distribution of latent factors is represented by equally weighted particles and learned by minimizing a weak Kushner–Stratonovich residual using observations and known model dynamics, without latent-state labels. The estimated distribution is then used to train a portfolio policy that maximizes expected terminal wealth utility. Filtering accuracy and investment performance are evaluated against a Kalman-filter benchmark.',
        },
        {
          ko: '이민혁', en: 'Minhyuk Lee',
          affil: 'Sungkyunkwan University', kind: 'invited',
          title: 'Knots Through Matrices: The Burau Representation',
          tags: ['topology', 'algebra'],
          abstract: 'Braid Group은 여러 가닥의 끈이 서로 얽히는 방식을 대수적으로 표현한 군으로, 모든 매듭을 braid group 원소의 closure로 표현할 수 있어, 매듭이론에서 중요한 역할을 한다. Burau representation은 이러한 braid group의 원소를 Laurent Polynomial을 entry로 가지는 invertible matrix에 대응시키는 group representation이다.\n\n본 발표에서는 먼저 braid group의 정의와 기본적인 성질을 살펴보고, Burau representation을 구성하여 braid의 기하학적 구조가 어떻게 행렬 연산으로 표현되는지 알아본다. 이어서 Burau representation의 위상수학적 배경을 간략히 소개하고, 이를 이용해 매듭의 중요한 불변량인 Alexander polynomial을 얻는 과정을 살펴본다. 마지막으로 서로 다른 braid를 Burau representation으로 구별할 수 있는지에 관한 faithfulness 문제를 소개한다.',
        },
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
