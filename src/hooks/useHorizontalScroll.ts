/**
 * hooks/useHorizontalScroll.ts
 *
 * 세로 스크롤을 가로 이동으로 변환하는 핵심 커스텀 훅.
 *
 * ─── 구현 방식 선택 근거 ───────────────────────────────────────────────────
 *
 * [채택] sticky-container + scrollLeft 패턴
 * - 원리: 외부 컨테이너에 큰 높이를 부여해 네이티브 스크롤 공간을 확보하고,
 *   내부 sticky 래퍼가 뷰포트 중앙에 고정된 채 scrollLeft만 변경함.
 * - scrollLeft를 사용하는 이유:
 *   1. CSS position: sticky(left 방향)가 자연스럽게 동작함.
 *      → 섹션 타이틀이 가로 스크롤 중 좌측 padding 라인에 고정됨.
 *   2. 브라우저 기본 스크롤 동작을 전혀 방해하지 않음.
 *
 * [채택] 뷰포트 중앙 트리거
 * - 과제 요구사항: "가로 스크롤 액션은 섹션이 뷰포트 상단에 닿는 시점이 아니라,
 *   화면 세로 중앙에 위치하는 시점에 시작되어야 합니다."
 * - 구현: sticky의 top 값을 (뷰포트 높이 - 콘텐츠 높이) / 2 로 동적 계산하여
 *   콘텐츠가 뷰포트 정중앙에 도달할 때 핀 고정이 시작됨.
 * ──────────────────────────────────────────────────────────────────────────
 */

import { useRef, useEffect, useCallback } from 'react';

export interface UseHorizontalScrollReturn {
  /** 핀 고정 컨테이너 ref */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** sticky 래퍼 ref */
  stickyRef: React.RefObject<HTMLDivElement | null>;
  /** 가로 스크롤 컨테이너 ref */
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

function useHorizontalScroll(enabled: boolean): UseHorizontalScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  /**
   * 컨테이너 높이 및 sticky top 값을 계산하고 적용하는 함수.
   *
   * 뷰포트 중앙 트리거 구현의 핵심:
   * - 콘텐츠 높이를 측정하여 sticky top = (뷰포트 높이 - 콘텐츠 높이) / 2 로 설정.
   * - 이렇게 하면 콘텐츠가 자연스럽게 스크롤되다가 뷰포트 정중앙에 도달하는 순간
   *   sticky가 걸리면서 핀 고정이 시작됨.
   * - 고정된 동안 콘텐츠 중심 = 뷰포트 중심이므로 시각적으로 "중앙에 고정" 효과.
   */
  const calculateDimensions = useCallback(() => {
    if (!enabled) return;
    if (!containerRef.current || !scrollContainerRef.current || !stickyRef.current) return;

    const scrollWidth = scrollContainerRef.current.scrollWidth;
    const clientWidth = scrollContainerRef.current.clientWidth;
    const viewportHeight = window.innerHeight;

    /**
     * 콘텐츠 높이: stickyWrapper의 자연 높이 (height: auto 기준).
     * 이 값으로 뷰포트 중앙 오프셋을 계산함.
     */
    const contentHeight = stickyRef.current.offsetHeight;

    /**
     * centerOffset: sticky top 값.
     * 콘텐츠가 뷰포트 정중앙에 위치하도록 하는 오프셋.
     *
     * 수학적 증명:
     * - sticky top = centerOffset → 콘텐츠 상단이 뷰포트 상단으로부터 centerOffset 위치에 고정
     * - 콘텐츠 중심 = centerOffset + contentHeight / 2
     *   = (viewportHeight - contentHeight) / 2 + contentHeight / 2
     *   = viewportHeight / 2
     *   = 뷰포트 정중앙 ✓
     */
    const centerOffset = Math.max(0, (viewportHeight - contentHeight) / 2);
    stickyRef.current.style.top = `${centerOffset}px`;

    /**
     * 컨테이너 높이 계산:
     *   containerHeight = maxScrollLeft + viewportHeight
     *
     * 이 공식이 성립하는 이유:
     * - sticky가 걸린 상태에서 maxScrollLeft만큼 세로 스크롤해야
     *   가로 스크롤이 완전히 끝남.
     * - viewportHeight를 더해야 sticky 래퍼가 컨테이너 안에 머물 수 있는
     *   충분한 공간이 확보됨.
     */
    const maxScrollLeft = scrollWidth - clientWidth;
    const containerHeight = maxScrollLeft + viewportHeight;
    containerRef.current.style.height = `${containerHeight}px`;
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      if (containerRef.current) containerRef.current.style.height = '';
      if (stickyRef.current) stickyRef.current.style.top = '';
      if (scrollContainerRef.current) scrollContainerRef.current.scrollLeft = 0;
      return;
    }

    calculateDimensions();

    const handleScroll = (): void => {
      if (!containerRef.current || !scrollContainerRef.current || !stickyRef.current) return;
      if (rafIdRef.current !== null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        if (!containerRef.current || !scrollContainerRef.current || !stickyRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const scrollWidth = scrollContainerRef.current.scrollWidth;
        const clientWidth = scrollContainerRef.current.clientWidth;

        /**
         * sticky top 값을 읽어 스크롤 진행도 계산에 반영.
         *
         * scrollProgress 계산:
         * - sticky는 containerRect.top <= centerOffset 일 때 걸림.
         * - 걸린 시점에서 scrollProgress = 0 이 되어야 함.
         * - scrollProgress = centerOffset - containerRect.top
         *
         * 예시 (viewportHeight=900, contentHeight=600, centerOffset=150):
         * - containerRect.top = 150 → scrollProgress = 0 (막 걸림, scrollLeft=0)
         * - containerRect.top = 50  → scrollProgress = 100 (scrollLeft=100)
         * - containerRect.top = -350 → scrollProgress = 500 (scrollLeft=500)
         */
        const centerOffset = parseFloat(stickyRef.current.style.top) || 0;
        const scrollProgress = centerOffset - rect.top;
        const maxScrollLeft = scrollWidth - clientWidth;
        const clampedProgress = Math.max(0, Math.min(scrollProgress, maxScrollLeft));

        scrollContainerRef.current.scrollLeft = clampedProgress;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', calculateDimensions);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', calculateDimensions);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [enabled, calculateDimensions]);

  return { containerRef, stickyRef, scrollContainerRef };
}

export default useHorizontalScroll;
