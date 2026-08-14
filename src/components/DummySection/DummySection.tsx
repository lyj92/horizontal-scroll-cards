/**
 * DummySection.tsx
 *
 * 가로 스크롤 카드 섹션 위/아래에 배치되는 더미(스페이서) 섹션.
 *
 * 이 컴포넌트가 필요한 이유:
 * - 가로 스크롤 섹션이 뷰포트 중앙에 도달하는 시점을 자연스럽게 만들기 위해
 *   위아래에 충분한 높이의 콘텐츠가 있어야 함.
 * - 실제 서비스에서는 다른 섹션(히어로, 푸터 등)이 오겠지만,
 *   과제 범위에서는 시각적으로 구분되는 더미 콘텐츠로 대체.
 */

import styles from './DummySection.module.css';

interface DummySectionProps {
  /** 섹션에 표시할 제목 텍스트 */
  title?: string;
  /** 섹션에 표시할 설명 텍스트 */
  description?: string;
}

function DummySection({
  title = '스크롤 해보세요',
  description = '아래로 스크롤하면 가로 스크롤 카드 섹션이 나타납니다.',
}: DummySectionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
      </div>
    </section>
  );
}

export default DummySection;
