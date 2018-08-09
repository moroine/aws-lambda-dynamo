const listResource = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: 'List resource',
    }),
  });
};

export default listResource;
