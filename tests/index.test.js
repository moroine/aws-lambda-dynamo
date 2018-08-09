import helloWorld from '../src/index';

test('helloWorld should returns "Hello World !"', () => {
  expect(helloWorld()).toBe('Hello World !');
});
