# Безкраен Карусел (Infinite Carousel)

Лек, безкраен карусел, управляван изцяло със скрол (включително вертикалния скрол на стандартна мишка). Без стрелки и бутони.

## Функционалности

- **Безкрайно скролиране**: wrap-around на `scrollLeft` без DOM пренареждане (без ремоунт/пререндер при скрол).
- **Управление със скрол**: хоризонтален скрол + мапване на вертикален wheel към хоризонтален.
- **Лениво зареждане**: изображенията се зареждат при пресичане с viewport чрез `IntersectionObserver`.
- **Responsive дизайн** и плавни hover ефекти.

## Версии / Стек

- **Node**: >= 20.11.0 (изискване на проекта)
- **npm**: >= 10.0.0
- **React**: 19.1.1
- **React DOM**: 19.1.1
- **TypeScript**: ~5.8.3
- **Vite**: 7.1.2 + `@vitejs/plugin-react`
- **Vitest**: 3.2.4 (тестове)
- **JSDOM**: 26.1.0 (тестова среда)
- **Sass**: 1.90.0

## Стартиране (Dev)

1) Инсталиране на зависимости
```bash
npm ci
```

2) Стартиране на dev сървъра
```bash
npm run dev
```
Отворете `http://localhost:5173`.

## Билд и Preview

```bash
npm run build
npm run preview
```

## Тестове

- Еднократно пускане:
```bash
npm test
```
- Watch режим:
```bash
npm run test:watch
```
- Покритие:
```bash
npm run test:coverage
```

## Конфигурация

- **Брой снимки**: променете константата `imagesCount` в `src/App.tsx`.
```tsx
// src/App.tsx
const imagesCount = 10;
```

- **Размер на изображенията**: променете `targetWidth/targetHeight` в `src/App.tsx` (по подразбиране `[600, 400]`). Те се подават към `picsum.ts` за генериране на URL.
```tsx
// src/App.tsx
const [targetWidth, targetHeight] = useMemo(() => [600, 400], []);
```

- **Източник на изображенията**: `src/services/picsum.ts` използва Picsum API и генерира адреси на изображенията според избраната ширина/височина.
```ts
// src/services/picsum.ts
function buildPicsumImageUrlById(id: string | number, width: number, height: number): string {
  return `${PICSUM_BASE_URL}/id/${id}/${width}/${height}`;
}
```

- **Разстояние между елементите**: променете SCSS променливата `$carousel-gap`.
```scss
// src/styles/_variables.scss
$carousel-gap: 15px;
```

## Структура на проекта

```
src/
├── components/
│   └── InfiniteCarousel/
│       ├── InfiniteCarousel.tsx    # Компонентът на карусела
│       ├── InfiniteCarousel.scss   # Стилове
│       ├── LazyImage.tsx           # Лениво зареждане на изображения
│       └── index.ts                # Експорти
├── hooks/
│   └── useInfiniteScroll.ts        # Безкрайна скрол логика + wheel поддръжка
├── services/
│   └── picsum.ts                   # Изтегляне на изображения от Picsum
├── styles/
│   └── _variables.scss             # Глобални SCSS променливи
├── types/
│   └── carousel.ts                 # Типове
├── test/
│   └── setup.ts                    # Тестова настройка (IntersectionObserver mock)
├── App.tsx                         # Главен компонент
└── main.tsx                        # Входна точка
```

## Как работи безкрайният скрол накратко

- Хукът `useInfiniteScroll` следи позицията и при достигане на края/началото прехвърля `scrollLeft` към срещуположния ръб (wrap), без да пренарежда DOM — така се избягват ремоунт/пререндери.
- Обработчикът на `wheel` мапва вертикалния `deltaY` към хоризонтално преместване, докато курсорът е върху карусела (с `preventDefault`).

## Troubleshooting

- „vite: command not found“ → пуснете `npm ci` в папката на проекта и опитайте отново `npm run dev`.
- „Cannot find type definition file for 'react'“ → уверете се, че са инсталирани типовете: `npm i -D @types/react @types/react-dom`, след което рестартирайте TS сървъра/IDE.
- Проверете версиите: `node -v` (≥ 20.11), `npm -v` (≥ 10).

## Лиценз

MIT License — свободен за използване и модификация.
