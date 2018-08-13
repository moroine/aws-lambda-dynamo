const forbidden = (callback) => {
  callback(null, {
    statusCode: 403,
    body: JSON.stringify({ error: 'Forbidden' }),
  });
};

export default forbidden;
