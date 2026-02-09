import '@testing-library/jest-dom';

jest.mock('@/utils/constants', () => ({
  VITE_API_BASE_URL: 'https://api.test.com',
}));

jest.mock('@/lib/apiClient');

if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    *,
    *::before,
    *::after {
      -webkit-transition: none !important;
      -moz-transition: none !important;
      -ms-transition: none !important;
      -o-transition: none !important;
      transition: none !important;
      -webkit-animation: none !important;
      -moz-animation: none !important;
      -ms-animation: none !important;
      -o-animation: none !important;
      animation: none !important;
    }
  `;
  document.head.appendChild(style);
}

// jsdom does not implement scrollTo: we mock it to avoid console noise
Object.defineProperty(window, 'scrollTo', {
  value: jest.fn(),
  writable: true,
});

// Silence ONLY expected messages in tests (simulated errors and act warnings)
let consoleErrorSpy: jest.SpyInstance | null = null;
const realConsoleErrorFn: (...args: unknown[]) => void =
  console.error as unknown as (...args: unknown[]) => void;

beforeAll(() => {
  consoleErrorSpy = jest
    .spyOn(console, 'error')
    .mockImplementation((...args: unknown[]) => {
      const first = args[0];
      const msg = typeof first === 'string' ? first : String(first ?? '');

      if (
        /Not implemented: window\.scrollTo/.test(msg) ||
        /An update to .* inside a test was not wrapped in act/.test(msg) ||
        /Validation error:/.test(msg) ||
        /Error (downloading template|validating file|importing professors|downloading error report):/.test(
          msg
        )
      ) {
        return;
      }

      realConsoleErrorFn(...args);
    });
});

afterAll(() => {
  try {
    consoleErrorSpy?.mockRestore?.();
  } catch (_err) {
    void _err;
  } finally {
    consoleErrorSpy = null;
  }
});
