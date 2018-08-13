import { deleteResource as deleteResourceFromDb } from '../../repositories/resourceRepository';

const deleteResource = (event, context, callback) => {
  const { userId, resourceId } = event.pathParameters;

  deleteResourceFromDb(userId, resourceId)
    .then(() => {
      callback(null, {
        statusCode: 204,
        body: null,
      });
    })
    .catch(() => {
      callback(null, { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });
    });
};

export default deleteResource;
