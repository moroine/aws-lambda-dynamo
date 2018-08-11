const parseBody = (body) => {
  let data = null;

  try {
    data = JSON.parse(body);

    if (data === null || typeof data !== 'object') {
      return {
        success: false,
        result: {
          error: 'Body should be an object',
        },
      };
    }
  } catch (e) {
    return {
      success: false,
      result: {
        error: 'Body should be a valid JSON object',
      },
    };
  }

  return {
    success: true,
    result: data,
  };
};

export default parseBody;
