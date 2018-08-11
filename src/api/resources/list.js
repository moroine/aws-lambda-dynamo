import { getUserResources } from '../../repositories/resourceRepository';

const listResource = (event, context, callback) => {
  const { userId } = event.pathParameters;

  getUserResources(userId)
    .then((resources) => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify(resources),
      });
    })
    .catch(() => {
      callback(null, { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error' }) });
    });
};

export default listResource;
