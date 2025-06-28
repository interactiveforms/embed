# InteractiveForm Embedder

Библиотека для встраивания интерактивных форм и виджетов на ваш сайт.

## Установка

### Через CDN (jsdelivr)

**IIFE/UMD:**

```html
<script src="https://cdn.jsdelivr.net/npm/interactiveform-embedder@latest/dist/index.iife.js"></script>
<!-- или -->
<script src="https://cdn.jsdelivr.net/npm/interactiveform-embedder@latest/dist/index.umd.js"></script>
```

**ESM:**

```html
<script
  type="module"
  src="https://cdn.jsdelivr.net/npm/interactiveform-embedder@latest/dist/index.es.js"
></script>
```

### Через npm

```bash
npm install interactiveform-embedder
```

## Использование

### Автоматическая инициализация (CDN)

После подключения скрипта все элементы с атрибутом `data-if-id` будут автоматически инициализированы:

```html
<div data-if-id="demo" data-if-type="page-body"></div>
```

### Ручная инициализация (npm/ESM)

```ts
import { Embedder } from 'interactiveform-embedder';

const embedder = new Embedder();
// Для повторной инициализации
embedder.reinitialize();
// Для инициализации конкретного элемента
embedder.initializeElement(document.getElementById('my-widget'));
```

## Атрибуты контейнера

- `data-if-id` — идентификатор формы/виджета (обязателен)
- `data-if-type` — тип виджета: `page-body`, `float-button`, `pop-up`
- `data-if-timeout` — (для pop-up) задержка в секундах

## Форматы сборки

- **IIFE** — для прямого подключения через `<script>` (минифицирован)
- **UMD** — универсальный модуль (минифицирован)
- **ESM** — для современных сборщиков и `<script type="module">` (минифицирован)

---

**MIT License**
