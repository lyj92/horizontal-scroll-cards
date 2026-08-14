/**
 * hooks/useMediaQuery.ts
 *
 * CSS 미디어 쿼리 문자열을 받아 현재 일치 여부를 boolean으로 반환하는 훅.
 *
 * 커스텀 훅으로 분리한 이유:
 * - 반응형 분기가 필요한 컴포넌트마다 동일한 matchMedia 로직을 반복 작성하는 대신,
 *   단일 훅으로 재사용성을 높임.
 * - 컴포넌트가 미디어 쿼리 "구현 방법"이 아닌 "결과값(boolean)"에만 집중할 수 있게 함.
 * - 테스트 시 이 훅만 모킹(mock)하면 컴포넌트 단위 테스트가 가능해짐.
 */

import { useState, useEffect } from 'react';

/**
 * 주어진 CSS 미디어 쿼리가 현재 뷰포트에 일치하는지 반환함.
 *
 * @param query - CSS 미디어 쿼리 문자열 (예: '(max-width: 1024px)')
 * @returns 쿼리가 일치하면 true, 아니면 false
 *
 * 사용 예:
 *   const isMobile = useMediaQuery('(max-width: 1024px)');
 */
function useMediaQuery(query: string): boolean {
  /**
   * 초기값을 함수로 계산한 이유:
   * - 서버사이드 렌더링(SSR) 환경에서는 window가 없으므로 false를 기본값으로 둠.
   * - 클라이언트 최초 렌더링 시 이미 올바른 값으로 시작해 깜빡임(flash) 없이 렌더링함.
   * - useState 안의 함수는 초기 렌더링 시 한 번만 실행되므로 성능에 영향 없음.
   */
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    // SSR 환경 안전 처리: window가 없으면 아무것도 하지 않음
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);

    // 초기값 동기화: 훅이 마운트될 때 현재 상태를 정확히 반영
    setMatches(mediaQueryList.matches);

    /**
     * 뷰포트 크기 변경 시 matches를 업데이트하는 핸들러.
     *
     * MediaQueryListEvent를 사용한 이유:
     * - resize 이벤트를 직접 감지하고 matchMedia를 매번 호출하는 방식보다
     *   브라우저가 미디어 쿼리 상태 변경 시점을 직접 알려주므로 더 효율적임.
     * - 불필요한 상태 업데이트를 줄여 리렌더링을 최소화함.
     */
    const handleChange = (event: MediaQueryListEvent): void => {
      setMatches(event.matches);
    };

    /**
     * addEventListener를 사용한 이유:
     * - 구형 API인 addListener는 deprecated 되었으므로 표준 addEventListener를 사용함.
     * - 다만 구형 브라우저 호환을 위해 fallback 처리를 포함함.
     */
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener('change', handleChange);
    } else {
      // Safari 13 이하, IE 등 구형 브라우저 fallback
      mediaQueryList.addListener(handleChange);
    }

    /**
     * 클린업 함수: 컴포넌트 언마운트 또는 query 변경 시 이벤트 리스너를 제거.
     *
     * 클린업이 필수인 이유:
     * - 리스너를 제거하지 않으면 언마운트된 컴포넌트의 setState가 호출되어
     *   메모리 누수(memory leak) 경고가 발생하고, 예기치 않은 동작을 일으킬 수 있음.
     */
    return () => {
      if (mediaQueryList.removeEventListener) {
        mediaQueryList.removeEventListener('change', handleChange);
      } else {
        mediaQueryList.removeListener(handleChange);
      }
    };
  }, [query]); // query가 바뀔 때만 이펙트를 재실행

  return matches;
}

export default useMediaQuery;
