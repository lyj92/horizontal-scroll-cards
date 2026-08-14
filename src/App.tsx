/**
 * App.tsx
 *
 * 애플리케이션 루트 컴포넌트.
 *
 * 이 컴포넌트의 역할:
 * - 페이지 전체 구조를 정의하는 "컴포지션 루트(Composition Root)".
 * - 각 섹션 컴포넌트를 조합하되 비즈니스 로직은 포함하지 않음.
 * - 과제 스펙: [더미 섹션] → [가로 스크롤 카드 섹션] → [더미 섹션]
 */

import DummySection from './components/DummySection/DummySection';
import HorizontalScrollSection from './components/HorizontalScrollSection/HorizontalScrollSection';

function App() {
  return (
    <>
      {/* 상단 더미 섹션: 가로 스크롤 섹션까지 자연스럽게 스크롤할 수 있는 공간 */}
      <DummySection
        title="가로 스크롤 카드 섹션"
        description="아래로 스크롤하면 세로 스크롤이 가로 스크롤로 전환되는 카드 섹션을 경험할 수 있습니다."
      />

      {/* 핵심 섹션: 세로 스크롤 → 가로 카드 이동 → 세로 스크롤 복귀 */}
      <HorizontalScrollSection />

      {/* 하단 더미 섹션: 가로 스크롤 완료 후 세로 스크롤로 복귀됨을 확인하는 공간 */}
      <DummySection
        title="다시 세로 스크롤"
        description="가로 스크롤 카드 섹션을 지나 다시 세로 스크롤로 돌아왔습니다."
      />
    </>
  );
}

export default App;
