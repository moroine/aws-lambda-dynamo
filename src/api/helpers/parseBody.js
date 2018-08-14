const parseBody = (body) => {
  let data = null;

  try {
    data = JSON.parse(body);

    if (data === null) {
      return {
        success: false,
        result: 'Body should be a not null object',
      };
    }
  } catch (e) {
    return {
      success: false,
      result: 'Body should be a valid JSON object',
    };
  }

  return {
    success: true,
    result: data,
  };
};

export default parseBody;
