const getResource = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Get resource',
    }),
  });
};

export default getResource;
