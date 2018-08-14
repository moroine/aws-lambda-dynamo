const forbidden = (callback) => {
  // TODO: test me
  callback(null, {
    statusCode: 403,
    body: JSON.stringify({ error: 'Forbidden' }),
  });
};

export default forbidden;
