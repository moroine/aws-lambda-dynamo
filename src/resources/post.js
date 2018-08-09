const postResource = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Post resource',
    }),
  });
};

export default postResource;
