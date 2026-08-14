/**
 * HorizontalScrollSection.tsx
 *
 * 프로젝트의 핵심 컴포넌트: 세로 스크롤을 가로 카드 이동으로 변환하는 섹션.
 *
 * 구조:
 *   [container (tall pinning area)]
 *     [sticky wrapper (viewport height, pinned)]
 *       [scrollContainer (overflow-x: scroll, scrollbar hidden)]
 *         [track → CardGroup(header+cards) × N]
 *
 * scrollLeft 기반 구현을 선택한 이유:
 * - CSS position: sticky(left 방향)가 실제 스크롤 컨테이너에서만 동작함.
 * - 이를 통해 각 그룹의 타이틀이 가로 스크롤 중에도 좌측 padding 라인에
 *   자연스럽게 고정됨 (과제 핵심 요구사항).
 * - translateX 방식에서는 sticky가 동작하지 않아 JS로 별도 계산이 필요했음.
 */

import { cardGroups } from '../../data/cardData';
import useHorizontalScroll from '../../hooks/useHorizontalScroll';
import useMediaQuery from '../../hooks/useMediaQuery';
import CardGroup from '../CardGroup/CardGroup';
import styles from './HorizontalScrollSection.module.css';

function HorizontalScrollSection() {
  /**
   * PC 여부를 미디어 쿼리로 판별하는 이유:
   * - 가로 스크롤 "동작"을 활성화/비활성화해야 하므로 JS 분기가 필수.
   * - CSS만으로는 스크롤 이벤트 리스너 등록/해제가 불가능.
   */
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  const {
    containerRef,
    stickyRef,
    scrollContainerRef,
  } = useHorizontalScroll(isDesktop);

  return (
    <section className={styles.section}>
      {/**
       * container: "핀 고정 영역"
       * - height가 useHorizontalScroll 훅에 의해 동적으로 설정됨.
       * - 이 높이가 세로 스크롤로 이동해야 하는 거리를 결정.
       */}
      <div className={styles.container} ref={containerRef}>
        {/**
         * stickyWrapper: 뷰포트에 고정되는 래퍼
         * - position: sticky + top: 0으로 뷰포트 상단에 고정.
         * - height: 100vh로 전체 화면을 채움.
         */}
        <div className={styles.stickyWrapper} ref={stickyRef}>
          {/**
           * scrollContainer: 실제 가로 스크롤이 발생하는 요소.
           * - overflow-x: scroll (스크롤바는 CSS로 숨김)
           * - JS가 scrollLeft를 제어하여 세로→가로 변환 구현.
           * - 이 요소에 overflow-x: scroll이 있어야 자식의
           *   position: sticky(left)가 정상 동작함.
           */}
          <div className={styles.scrollContainer} ref={scrollContainerRef}>
            <div className={styles.track}>
              {cardGroups.map((group) => (
                <CardGroup key={group.id} group={group} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HorizontalScrollSection;
