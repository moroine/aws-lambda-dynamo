import { helloWorld } from '../src/index';

test('helloWorld should returns "Hello World from CircleCi!"', () => {
  const mockedCallback = jest.fn();

  const expectedResponse = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello World from CircleCi!',
    }),
  };

  helloWorld(null, null, mockedCallback);

  expect(mockedCallback.mock.calls).toHaveLength(1);
  expect(mockedCallback.mock.calls[0]).toHaveLength(2);
  expect(mockedCallback.mock.calls[0][0]).toBe(null);
  expect(mockedCallback.mock.calls[0][1]).toEqual(expectedResponse);
});
