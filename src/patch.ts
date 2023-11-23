import DOMException from 'domexception';

if (!('DOMException' in globalThis)) {
  Object.defineProperty(globalThis, 'DOMException', {
    value: DOMException
  });
}
