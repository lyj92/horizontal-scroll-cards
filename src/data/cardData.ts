/**
 * data/cardData.ts
 *
 * 가로 스크롤 카드 섹션에 표시될 더미 데이터.
 *
 * 데이터를 별도 파일로 분리한 이유:
 * - 컴포넌트 파일이 렌더링 로직에만 집중할 수 있도록 관심사를 분리(Separation of Concerns)함.
 * - 추후 API 연동 시 이 파일만 교체하면 되므로 유지보수가 용이함.
 * - 테스트 코드에서 이 데이터를 독립적으로 import 해 검증할 수 있음.
 *
 * 이미지 URL에 picsum.photos를 사용한 이유:
 * - 외부 의존 없이 일관된 더미 이미지를 빠르게 제공하는 서비스.
 * - seed 파라미터로 항상 동일한 이미지가 반환되어 UI가 안정적으로 보임.
 */

import type { CardGroupData } from '../types';

/**
 * 카드 그룹 데이터 배열.
 * 배열의 순서가 곧 가로 스크롤 시 등장하는 순서를 결정함.
 */
export const cardGroups: CardGroupData[] = [
  // ─────────────────────────────────────────────
  // 그룹 1: 산업별 도입 사례
  // gradient 변형을 사용해 각 카드마다 고유한 색감을 부여,
  // 콘텐츠의 다양성을 시각적으로 강조함.
  // ─────────────────────────────────────────────
  {
    id: 'group-cases',
    title: '산업별 도입 사례',
    subtitle: 'sindoh와 함께 만드는 비즈니스 혁신',
    moreLink: '#',
    cards: [
      {
        id: 'case-1',
        category: '산업별 도입 사례',
        title: '복합기로 안전을 지키는 방법',
        imageUrl: 'https://picsum.photos/seed/case1/600/400',
        variant: 'gradient',
        gradientColors: ['#7B61FF', '#9B8FFF'],
      },
      {
        id: 'case-2',
        category: '산업별 도입 사례',
        title: '금융권이 종이 문서에 민감한 이유',
        imageUrl: 'https://picsum.photos/seed/case2/600/400',
        variant: 'gradient',
        gradientColors: ['#2DB77B', '#5DD4A0'],
      },
      {
        id: 'case-3',
        category: '산업별 도입 사례',
        title: '종이 한 장의 가격이 23조 시장을 바꾸다',
        imageUrl: 'https://picsum.photos/seed/case3/600/400',
        variant: 'gradient',
        gradientColors: ['#FF8A3D', '#FFB347'],
      },
      {
        id: 'case-4',
        category: '산업별 도입 사례',
        title: '병원 업무 효율을 높이는 스마트 문서 관리',
        imageUrl: 'https://picsum.photos/seed/case4/600/400',
        variant: 'gradient',
        gradientColors: ['#4A90D9', '#74B9FF'],
      },
      {
        id: 'case-5',
        category: '산업별 도입 사례',
        title: '제조 현장의 디지털 전환, 어디서부터 시작할까',
        imageUrl: 'https://picsum.photos/seed/case5/600/400',
        variant: 'gradient',
        gradientColors: ['#E17055', '#FAB1A0'],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 그룹 2: 기업 소식
  // dark 변형을 사용해 뉴스/공식 정보라는 무게감을 전달함.
  // gradient 없이 이미지에 어두운 오버레이를 올려 텍스트 가독성을 확보.
  // ─────────────────────────────────────────────
  {
    id: 'group-news',
    title: '기업 소식',
    subtitle: '새로운 가치를 만드는 신도리코 이야기',
    moreLink: '#',
    cards: [
      {
        id: 'news-1',
        category: '기업 소식',
        title: "신도리코, '하늘이법' 시행 앞두고 학교 맞춤 비식별화 CCTV 사업 본격화",
        imageUrl: 'https://picsum.photos/seed/news1/600/400',
        variant: 'dark',
      },
      {
        id: 'news-2',
        category: '기업 소식',
        title: '새로운 변화의 시작 2026 파트너 컨퍼런스 & New CI 공식 론칭',
        imageUrl: 'https://picsum.photos/seed/news2/600/400',
        variant: 'dark',
      },
      {
        id: 'news-3',
        category: '기업 소식',
        title: '신도리코가 제안하는 스마트 오피스 솔루션',
        imageUrl: 'https://picsum.photos/seed/news3/600/400',
        variant: 'dark',
      },
      {
        id: 'news-4',
        category: '기업 소식',
        title: '글로벌 시장 진출 가속화, 동남아 파트너십 체결',
        imageUrl: 'https://picsum.photos/seed/news4/600/400',
        variant: 'dark',
      },
      {
        id: 'news-5',
        category: '기업 소식',
        title: 'ESG 경영 보고서 발간, 탄소중립 로드맵 공개',
        imageUrl: 'https://picsum.photos/seed/news5/600/400',
        variant: 'dark',
      },
    ],
  },
];
