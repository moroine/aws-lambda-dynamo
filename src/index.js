/* eslint-disable import/prefer-default-export */

const helloWorld = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Hello World !',
    }),
  });
};

export {
  helloWorld,
};
