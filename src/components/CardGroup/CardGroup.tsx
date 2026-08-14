/**
 * CardGroup.tsx
 *
 * 하나의 콘텐츠 그룹을 표시하는 컴포넌트.
 * 상단에 그룹 헤더(타이틀 + 서브타이틀 + 더보기), 하단에 카드 목록.
 *
 * 타이틀에 position: sticky(left)를 적용하는 이유:
 * - 과제 핵심 요구사항: "섹션 타이틀의 좌측 끝은 가로 스크롤이 진행되는 동안에도
 *   항상 좌측 padding 라인에서 벗어나면 안됩니다"
 * - scrollLeft 기반 가로 스크롤에서 CSS sticky(left)가 자연스럽게 동작하여,
 *   카드가 좌우로 스크롤되는 동안 타이틀은 좌측 padding 위치에 고정됨.
 * - 해당 그룹이 뷰포트를 벗어나면 sticky가 해제되며 타이틀도 함께 밀려남.
 *
 * 각 그룹이 충분한 너비를 가지는 이유:
 * - 그룹 내 카드가 몇 개든 자유롭게 확장될 수 있도록 min-width: 100vw.
 * - 과제 요구사항: "섹션 수, 카드 수는 배열/데이터 기반으로 개수가 늘어나도
 *   레이아웃이 깨지지 않아야 합니다"
 */

import type { CardGroupData } from '../../types';
import Card from '../Card/Card';
import styles from './CardGroup.module.css';

interface CardGroupProps {
  /** 카드 그룹 데이터 */
  group: CardGroupData;
}

function CardGroup({ group }: CardGroupProps) {
  return (
    <div className={styles.group}>
      {/**
       * 헤더 영역: position: sticky; left: padding 으로 좌측 고정.
       * 가로 스크롤이 진행되어도 타이틀은 항상 좌측 padding 위치에 머무름.
       * 그룹이 스크롤 영역을 벗어나면 sticky가 해제되어 자연스럽게 밀려남.
       */}
      <div className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.titleArea}>
            <h2 className={styles.title}>{group.title}</h2>
            <p className={styles.subtitle}>{group.subtitle}</p>
          </div>
          <a href={group.moreLink} className={styles.moreLink}>
            더보기
            <span className={styles.arrow}>→</span>
          </a>
        </div>
      </div>

      {/* ─── 카드 목록: 가로로 나열, 스크롤 시 좌측으로 이동 ─── */}
      <div className={styles.cards}>
        {group.cards.map((card) => (
          <Card key={card.id} data={card} />
        ))}
      </div>
    </div>
  );
}

export default CardGroup;
