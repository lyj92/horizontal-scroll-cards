/**
 * Card.tsx
 *
 * 개별 카드 컴포넌트.
 *
 * 모든 카드가 동일한 레이아웃을 공유하는 이유:
 * - "산업별 도입 사례"와 "기업 소식" 모두 [이미지 상단 + 텍스트 하단] 구조.
 * - 시각적 차이는 이미지 콘텐츠 자체(일러스트 vs 실사)에서 오며,
 *   카드의 DOM 구조나 CSS는 동일하게 유지.
 * - 단일 구조로 통일하면 새로운 섹션/카드 추가 시 데이터만 넣으면 되므로 확장이 용이.
 */

import type { CardData } from '../../types';
import styles from './Card.module.css';

interface CardProps {
  /** 카드 데이터 객체 */
  data: CardData;
}

function Card({ data }: CardProps) {
  const { title, category, imageUrl } = data;

  return (
    <article className={styles.card}>
      {/**
       * 이미지 래퍼: 이미지 영역의 비율과 overflow를 제어.
       * overflow: hidden + border-radius로 이미지 모서리를 둥글게 처리.
       */}
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={imageUrl}
          alt={title}
          /**
           * loading="lazy"를 사용하는 이유:
           * - 가로 스크롤 특성상 카드가 뷰포트 밖에 있을 때가 많으므로,
           *   초기 로딩 시 보이지 않는 이미지까지 다운로드하면 불필요한 네트워크 비용 발생.
           * - 브라우저가 카드가 뷰포트에 가까워질 때 자동으로 로드하므로 UX에 영향 없음.
           */
          loading="lazy"
        />
      </div>

      {/**
       * 텍스트 영역: 이미지 아래에 배치.
       * 카테고리 라벨 + 제목으로 구성.
       * 배경은 흰색(카드 배경), 텍스트는 검은색 계열.
       */}
      <div className={styles.textContent}>
        <span className={styles.category}>{category}</span>
        <h3 className={styles.title}>{title}</h3>
      </div>
    </article>
  );
}

export default Card;
