/**
 * types/index.ts
 *
 * 프로젝트 전역 타입 정의 모음.
 *
 * 타입을 별도 파일로 분리한 이유:
 * - 컴포넌트와 데이터 레이어 간의 계약(contract)을 명시적으로 정의하기 위함.
 * - 여러 컴포넌트/훅이 동일한 타입을 공유할 때 단일 진실 공급원(single source of truth)
 *   역할을 하여 타입 불일치 버그를 컴파일 타임에 방지함.
 * - TypeScript strict 모드에서 `any` 없이 안전한 코드를 작성하기 위한 기반.
 */

/**
 * 카드 데이터의 시각적 변형(variant) 타입.
 *
 * union type을 사용한 이유:
 * - boolean(isGradient) 대신 named variant를 사용하면 향후 'light', 'image' 등
 *   새로운 스타일이 추가될 때 확장이 용이함.
 * - 컴포넌트에서 switch/if 분기 시 자동완성과 타입 체크가 가능해 실수를 방지함.
 */
export type CardVariant = 'gradient' | 'dark';

/**
 * 개별 카드 데이터 인터페이스.
 *
 * 선택적 필드(gradientColors)를 분리한 이유:
 * - `dark` 변형 카드는 그라디언트가 필요 없으므로 undefined로 두는 것이 의미론적으로 정확함.
 * - 필수 필드와 선택 필드를 명확히 구분해 데이터 생성 시 실수를 줄임.
 */
export interface CardData {
  /** 카드 고유 식별자 (React key prop 및 추후 API 연동 시 사용) */
  id: string;
  /** 카드 상단에 표시되는 카테고리 레이블 */
  category: string;
  /** 카드 메인 제목 */
  title: string;
  /** 카드 배경 이미지 URL */
  imageUrl: string;
  /** 카드 시각적 스타일 변형 */
  variant: CardVariant;
  /**
   * gradient 변형에만 사용되는 배경 그라디언트 색상 쌍.
   * Tuple 타입 [string, string]을 사용한 이유:
   * - 정확히 2개의 색상(시작, 끝)만 허용함을 타입으로 강제함.
   * - 배열(string[])보다 더 정확한 형태를 표현할 수 있음.
   */
  gradientColors?: [string, string];
}

/**
 * 카드 그룹 데이터 인터페이스 (예: "산업별 도입 사례", "기업 소식").
 *
 * 카드를 그룹으로 묶은 이유:
 * - 하나의 가로 스크롤 섹션 안에 성격이 다른 콘텐츠 묶음이 순차적으로 등장하는
 *   UI 패턴을 데이터 구조 레벨에서 표현하기 위함.
 * - 그룹 단위로 타이틀/서브타이틀/더보기 링크를 독립적으로 관리할 수 있음.
 */
export interface CardGroupData {
  /** 그룹 고유 식별자 */
  id: string;
  /** 그룹 섹션 제목 (예: "산업별 도입 사례") */
  title: string;
  /** 그룹 서브타이틀 (예: "sindoh와 함께 만드는 비즈니스 혁신") */
  subtitle: string;
  /** "더보기" 버튼/링크의 이동 경로 */
  moreLink: string;
  /** 이 그룹에 속하는 카드 목록 */
  cards: CardData[];
}
