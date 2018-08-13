import { saveResource } from '../../repositories/resourceRepository';
import parseBody from '../helpers/parseBody';
import Resource from '../../model/Resource';

const postResource = (event, context, callback) => {
  const { success, result } = parseBody(event.body);

  if (!success) {
    callback(
      null,
      {
        statusCode: 400,
        body: JSON.stringify({ error: result }),
      },
    );

    return;
  }

  result.userId = event.pathParameters.userId;

  const resource = new Resource(result);

  saveResource(resource, true)
    .then(({ success: successSave, result: resultSave }) => {
      if (successSave) {
        callback(null, { statusCode: 204, body: null });
      } else {
        callback(null, { statusCode: 400, body: JSON.stringify({ error: resultSave }) });
      }
    })
    .catch(() => {
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Internal Server Error',
        }),
      });
    });
};

export default postResource;
