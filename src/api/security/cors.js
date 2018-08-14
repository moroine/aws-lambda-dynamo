
const addCorsHeaders = (headers = {}) => Object.assign(
  {
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-User-Id',
    'Access-Control-Allow-Origin': '*',
  },
  headers,
);

const corsRoute = (event, context, callback) => {
  callback(null, {
    statusCode: 204,
    headers: addCorsHeaders({
      'Cache-Control': 'max-age=3600',
      'Access-Control-Max-Age': '3600',
      Vary: 'Access-Control-Request-Headers,Access-Control-Request-Method',
    }),
  });
};

export {
  corsRoute,
  addCorsHeaders,
};
