import parseBody from '../../../../src/api/helpers/parseBody';

test('Should parse a valid JSON', () => {
  const json = '{ "name": "a valid JSON" }';

  expect(parseBody(json)).toEqual({
    success: true,
    result: {
      name: 'a valid JSON',
    },
  });
});

test('Should return error for not valid JSON', () => {
  const json = 'not a valid JSON';

  expect(parseBody(json)).toEqual({
    success: false,
    result: 'Body should be a valid JSON object',
  });
});

test('Should return error if null', () => {
  const json = 'null';

  expect(parseBody(json)).toEqual({
    success: false,
    result: 'Body should be a not null object',
  });
});
