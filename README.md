# 가로 스크롤 카드 섹션 (Horizontal Scroll Card Section)

세로 스크롤(마우스 휠)을 가로 스크롤로 변환하여 카드 리스트를 보여주는 인터랙티브 섹션입니다.

## 실행 방법

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:5173)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과물 미리보기
npm run preview
```

## 배포 링크

> https://github.com/lyj92/horizontal-scroll-cards

## 기술 스택

| 구분       | 기술                | 선택 이유                                                            |
| ---------- | ------------------- | -------------------------------------------------------------------- |
| 프레임워크 | React 19            | 컴포넌트 기반 UI 구성, 커스텀 훅을 통한 로직 분리                    |
| 언어       | TypeScript (strict) | 컴파일 타임 타입 체크로 런타임 오류 사전 방지                        |
| 빌드 도구  | Vite 8              | 빠른 HMR, 간결한 설정, 최적화된 프로덕션 빌드                        |
| 스타일링   | CSS Modules         | 컴포넌트 스코프 스타일, 런타임 오버헤드 제로, 별도 라이브러리 불필요 |
| 린트       | Oxlint              | 빠른 실행 속도의 경량 린터                                           |

**외부 라이브러리 없이** 순수 React + CSS로 구현하여 번들 크기를 최소화했습니다.

## 프로젝트 구조

```
src/
├── App.tsx                          # 페이지 구조 조합 (컴포지션 루트)
├── main.tsx                         # 앱 진입점
├── index.css                        # 전역 스타일, CSS 변수, 리셋
├── types/
│   └── index.ts                     # 전역 타입 정의 (CardData, CardGroupData)
├── data/
│   └── cardData.ts                  # 카드 데이터 (API 연동 시 이 파일만 교체)
├── hooks/
│   ├── useHorizontalScroll.ts       # 세로→가로 스크롤 변환 핵심 로직
│   └── useMediaQuery.ts             # 반응형 분기를 위한 미디어 쿼리 훅
└── components/
    ├── HorizontalScrollSection/     # 가로 스크롤 섹션 (컨테이너 + sticky 래퍼)
    ├── CardGroup/                   # 카드 그룹 (sticky 헤더 + 카드 목록)
    ├── Card/                        # 개별 카드 (이미지 + 텍스트)
    └── DummySection/                # 더미 섹션 (위/아래 스페이서)
```

## 핵심 구현 설명

### 1. 세로 스크롤 → 가로 스크롤 변환

**sticky-container + scrollLeft 패턴**을 채택했습니다.

```
[container - 높이가 매우 큼 (세로 스크롤 공간 확보)]
  [stickyWrapper - position: sticky로 뷰포트에 고정]
    [scrollContainer - overflow-x: scroll, JS가 scrollLeft 제어]
      [track - CardGroup들이 가로로 나열]
```

- 외부 컨테이너(`container`)에 큰 높이를 부여해 네이티브 세로 스크롤 공간을 확보합니다.
- 내부 `stickyWrapper`가 뷰포트에 고정된 채, JS가 세로 스크롤 양을 `scrollLeft`로 1:1 매핑합니다.
- `scrollLeft` 방식을 선택한 이유: CSS `position: sticky; left`가 실제 스크롤 컨테이너에서만 동작하기 때문입니다. `translateX` 방식에서는 sticky가 작동하지 않아 타이틀 고정이 불가능했습니다.

### 2. 뷰포트 중앙 트리거

섹션이 뷰포트 상단이 아닌 **세로 중앙**에 도달할 때 가로 스크롤이 시작됩니다.

```
sticky top = (viewportHeight - contentHeight) / 2
```

이 값을 sticky의 `top`으로 설정하면, 콘텐츠가 뷰포트 정중앙에 도달하는 순간 고정이 시작됩니다. 고정된 동안 콘텐츠 중심 = 뷰포트 중심이 수학적으로 보장됩니다.

### 3. 섹션 타이틀 좌측 고정 (Sticky Header)

가로 스크롤 중 각 그룹의 타이틀이 좌측 padding 라인에 고정됩니다.

- `position: sticky; left: 0` + `padding-left`로 타이틀 위치를 제어합니다.
- 헤더의 `width: fit-content`로 그룹보다 좁은 너비를 유지해 sticky 이동 공간(`stickyRoom = groupWidth - headerWidth`)을 확보합니다.
- 그룹이 뷰포트를 벗어나면 sticky가 자연스럽게 해제되어 타이틀도 함께 밀려납니다.

### 4. 반응형 대응

| 구분        | PC (1025px↑)   | Tablet/Mobile (1024px↓) |
| ----------- | -------------- | ----------------------- |
| 스크롤      | 세로→가로 변환 | 일반 세로 스크롤        |
| 카드 배치   | 가로 나열      | 세로 나열 (100% 너비)   |
| 콘텐츠 패딩 | 20px           | 10px                    |
| 타이틀      | sticky 고정    | 일반 배치               |

JS(`useMediaQuery`)와 CSS(`@media`) 양쪽에서 분기 처리합니다. JS에서는 스크롤 이벤트 리스너 등록/해제를, CSS에서는 레이아웃 전환을 담당합니다.

### 5. Safari 호환성

`position: sticky`와 `overflow: hidden`을 같은 요소에 적용하면 Safari에서 sticky가 무시되는 버그가 있습니다. 이를 해결하기 위해 `overflow` 처리를 자식 요소(`scrollContainer`)에 위임하고, `stickyWrapper`에서는 overflow를 건드리지 않습니다.

## 성능 최적화

- **requestAnimationFrame**: 스크롤 이벤트 핸들러를 rAF로 쓰로틀링하여 프레임 단위로 제어
- **passive 이벤트**: `{ passive: true }`로 스크롤 이벤트를 등록해 메인 스레드 블로킹 방지
- **lazy loading**: 카드 이미지에 `loading="lazy"`를 적용해 뷰포트 밖 이미지의 불필요한 다운로드 방지
- **CSS Modules**: 런타임 오버헤드 없이 컴포넌트 스코프 스타일링
- **GPU 가속**: hover 효과에 `transform`만 사용해 레이아웃 재계산 없이 GPU에서 처리

## 데이터 확장

섹션이나 카드를 추가하려면 `src/data/cardData.ts`의 배열에 데이터만 추가하면 됩니다. 레이아웃이 자동으로 확장됩니다.

```typescript
// 새 그룹 추가 예시
{
  id: 'group-new',
  title: '새로운 섹션',
  subtitle: '설명 텍스트',
  moreLink: '#',
  cards: [
    {
      id: 'new-1',
      category: '카테고리',
      title: '카드 제목',
      imageUrl: 'https://picsum.photos/seed/new1/600/400',
      variant: 'dark',
    },
    // ... 카드 추가
  ],
}
```

## 아쉬운 점 / 개선하고 싶은 부분

- **스크롤 애니메이션 보간**: 현재 세로 스크롤과 가로 이동이 1:1 선형 매핑인데, easing 함수를 적용하면 더 부드럽고 자연스러운 스크롤 경험을 줄 수 있습니다.
- **키보드/터치 접근성**: 현재 마우스 휠 기반으로만 동작하므로, 키보드 방향키 탐색 및 모바일 터치 스와이프 제스처 지원을 추가하고 싶습니다.
- **스크롤 인디케이터**: 현재 가로 스크롤 진행 상태를 시각적으로 알 수 없으므로, 프로그레스 바나 도트 인디케이터를 추가하면 UX가 개선될 것입니다.
- **Intersection Observer 활용**: 카드가 뷰포트에 진입할 때 fade-in 등의 등장 애니메이션을 적용하면 시각적 완성도가 높아질 것입니다.
- **테스트 코드**: 단위 테스트(커스텀 훅)와 E2E 테스트(스크롤 동작 검증)를 추가하여 안정성을 확보하고 싶습니다.
