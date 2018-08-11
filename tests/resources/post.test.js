import mockConsole from 'jest-mock-console';
import postResource from '../../src/resources/post';
import { docClient, getTableName } from '../../src/resources/db';

jest.mock('../../src/resources/db');

test('Should create a new resource', (done) => {
  const resourceId = 'abc-123';

  const event = {
    body: JSON.stringify({ resourceId }),
  };

  const TableName = 'a-custom-table-name';
  getTableName.mockReturnValue(TableName);

  docClient.put.mockImplementation((params, cb) => {
    expect(params).toEqual({
      TableName,
      Item: {
        id: resourceId,
      },
      ConditionExpression: 'attribute_not_exists(id)',
    });

    cb();
  });

  const responseCb = (err, resp) => {
    expect(err).toBe(null);
    expect(resp).toEqual({ statusCode: 204, body: null });

    done();
  };

  postResource(event, null, responseCb);
});

test('Should return client error id body is not a valid JSON', (done) => {
  const event = {
    body: 'I am totally not a JSON',
  };

  const responseCb = (err, resp) => {
    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        error: 'POST body is not a valid JSON object',
      }),
    });

    done();
  };

  postResource(event, null, responseCb);
});

test('Should return client error id body is null', (done) => {
  const event = {
    body: null,
  };

  const responseCb = (err, resp) => {
    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        error: 'POST body is not a valid JSON object',
      }),
    });

    done();
  };

  postResource(event, null, responseCb);
});

test('Should return client error if missing resourceId', (done) => {
  const event = {
    body: '{}',
  };

  const responseCb = (err, resp) => {
    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        error: 'Missing key resourceId',
      }),
    });

    done();
  };

  postResource(event, null, responseCb);
});

test('Should not create if already exists', (done) => {
  const resourceId = 'abc-123';

  const event = {
    body: JSON.stringify({ resourceId }),
  };

  const TableName = 'a-custom-table-name';
  getTableName.mockReturnValue(TableName);

  docClient.put.mockImplementation((params, cb) => {
    expect(params).toEqual({
      TableName,
      Item: {
        id: resourceId,
      },
      ConditionExpression: 'attribute_not_exists(id)',
    });

    cb({
      name: 'ConditionalCheckFailedException',
    });
  });

  const responseCb = (err, resp) => {
    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 400,
      body: JSON.stringify({
        error: 'Given resource already exists',
      }),
    });

    done();
  };

  postResource(event, null, responseCb);
});

test('Should return Internal Server Error if unexpected error happen', (done) => {
  const resourceId = 'abc-123';

  const event = {
    body: JSON.stringify({ resourceId }),
  };

  const TableName = 'a-custom-table-name';
  getTableName.mockReturnValue(TableName);

  const restoreConsole = mockConsole();
  const error = new Error('Unexpected');

  docClient.put.mockImplementation((params, cb) => {
    expect(params).toEqual({
      TableName,
      Item: {
        id: resourceId,
      },
      ConditionExpression: 'attribute_not_exists(id)',
    });

    cb(error);
  });

  const responseCb = (err, resp) => {
    expect(err).toBe(null);
    expect(resp).toEqual({
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal Server Error',
      }),
    });

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledWith(error);
    restoreConsole();

    done();
  };

  postResource(event, null, responseCb);
});
