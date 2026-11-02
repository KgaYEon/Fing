// 온보딩 글 내용 — 피그마 그대로
export const PERMISSIONS = [
  { group: '필수', items: [{ icon: 'bluetooth', title: '블루투스', sub: '트래커와 연결해서 서핑 기록을 받아와요' }] },
  {
    group: '선택',
    items: [
      { icon: 'bell', title: '알림', sub: '서핑 기록이 도착하면 바로 알려드려요' },
      { icon: 'location', title: '위치', sub: '가까운 바다의 파도 정보를 보여드려요' },
      { icon: 'picture', title: '사진', sub: '프로필 사진을 변경할 수 있어요' },
    ],
  },
];

// 질문 (onboarding-1 · 2 · 3)
export const QUESTIONS = {
  q1: {
    n: 1,
    title: ['요즘 서핑은', '어떻게 하고 있나요?'],
    sub: '나에게 맞는 기록을 준비할게요',
    options: [
      { value: 'new', title: '아직 해본 적 없어요', sub: '첫 서핑을 준비하고 있어요' },
      { value: 'lesson', title: '강습 받을 때만 타요', sub: '강사와 함께 바다에 나가요' },
      { value: 'solo', title: '강사 없이도 타요', sub: '혼자 또는 친구와 바다에 나가요' },
    ],
  },
  q2: {
    n: 2,
    title: ['지금 나는', '어느 쪽에 가까운가요?'],
    sub: '요즘 내 서핑과 가장 비슷한 걸 골라주세요',
    options: [
      { value: 'white', title: '하얀 파도에서 연습해요', sub: '부서진 파도에서 일어나는 연습을 하고 있어요' },
      { value: 'green', title: '깨지기 전 파도를 노려요', sub: '라인업까지 나가서 파도를 잡아보고 있어요' },
      { value: 'side', title: '옆으로 길게 타보고 있어요', sub: '파도를 잡으면 옆으로 타려고 해요' },
    ],
  },
  q3: {
    n: 3,
    title: ['요즘 가장', '늘리고 싶은 기록을 골라주세요'],
    sub: '고른 기록을 중심으로 지난 나와 비교해 알려드려요',
    options: [
      { value: 'catch', title: '캐치율', sub: '패들한 파도 중 탄 파도의 비율' },
      { value: 'avg', title: '평균 라이딩', sub: '파도 하나를 탄 평균 시간' },
      { value: 'longest', title: '최장 라이딩', sub: '가장 오래 탄 파도의 시간' },
      { value: 'count', title: '파도 수', sub: '시간 당 파도 수' },
    ],
  },
};
export const QUESTION_COUNT = 3;

// 2번 답에 따라 3번의 "추천"이 바뀌어요 (피그마 198:1928 · 198:2134 · 198:2255)
export const RECOMMEND = { white: 'catch', green: 'count', side: 'avg' };
