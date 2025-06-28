import { Embedder } from './lib/embedder';

// Автоматическая инициализация для браузера
(function () {
  if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        new Embedder();
      });
    } else {
      new Embedder();
    }
  }
})();

// Экспортируем для возможности ручного использования
export { Embedder };
