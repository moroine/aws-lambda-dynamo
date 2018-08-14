let endpoint = new URL(window.location.href).searchParams.get('endpoint');
window.loadStack = fetch('/stack.json')
  .then((response) => {
    if (response.ok) {
      return response.json()
        .then(([stack]) => {
          stack.forEach((item) => {
            if (item.OutputKey === 'Api') {
              endpoint = endpoint || item.OutputValue;
            }
          })
        })
    }
  })
  .catch((e) => {
    console.error(e);
  });

window.credentials = {
  userId: null,
  token: null,
  isAdmin: null,
};

const handleResponseError = (response) => {
  if (response.status === 403) {
    app.showLogin();
  }

  try {
    return response.json()
      .catch(() => {
        return Promise.reject(new Error(response.statusText));
      })
      .then(({error}) => {
        return Promise.reject(new Error(error));
      });
  } catch (e) {
    return Promise.reject(new Error(response.statusText));
  }
};

window.login = (data) => {
  return fetch(`${endpoint}/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (!response.ok) {
      return handleResponseError(response);
    }

    return response.json();
  })
    .then(({user, token}) => {
      window.credentials.isAdmin = user.isAdmin;
      window.credentials.userId = token.userId;
      window.credentials.token = token.token;
    });
};

window.getUserResources = (userId = window.credentials.userId) => {
  return fetch(`${endpoint}/resource/${userId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.credentials.token,
      'x-user-id': window.credentials.userId,
    },
  }).then((response) => {
    if (!response.ok) {
      return handleResponseError(response);
    }

    return response.json();
  });
};

window.deleteResource = (resourceId, userId = window.credentials.userId) => {
  return fetch(`${endpoint}/resource/${userId}/${resourceId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.credentials.token,
      'x-user-id': window.credentials.userId,
    },
  }).then((response) => {
    if (!response.ok) {
      return handleResponseError(response);
    }
  });
};

window.createResource = (data, userId = window.credentials.userId) => {
  return fetch(`${endpoint}/resource/${userId}`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.credentials.token,
      'x-user-id': window.credentials.userId,
    },
    body: JSON.stringify(data)
  }).then((response) => {
    if (!response.ok) {
      return handleResponseError(response);
    }
  });
};

window.createUser = (data) => {
  return fetch(`${endpoint}/user`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.credentials.token,
      'x-user-id': window.credentials.userId,
    },
    body: JSON.stringify(data)
  }).then((response) => {
    if (!response.ok) {
      return handleResponseError(response);
    }
  });
};

window.updateUser = (data) => {
  return fetch(`${endpoint}/user/${data.userId}`, {
    method: 'PATCH',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.credentials.token,
      'x-user-id': window.credentials.userId,
    },
    body: JSON.stringify(data)
  }).then((response) => {
    if (!response.ok) {
      return handleResponseError(response);
    }
  });
};

window.getUsers = () => {
  return fetch(`${endpoint}/user`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.credentials.token,
      'x-user-id': window.credentials.userId,
    },
  }).then((response) => {
    if (!response.ok) {
      return handleResponseError(response);
    }

    return response.json();
  });
};

window.deleteUser = (userId) => {
  return fetch(`${endpoint}/user/${userId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + window.credentials.token,
      'x-user-id': window.credentials.userId,
    },
  }).then((response) => {
    if (!response.ok) {
      return handleResponseError(response);
    }
  });
};
