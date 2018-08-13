const endpoint = 'http://127.0.0.1:8080';

window.credentials = {
    userId: null,
    token: null,
    isAdmin: null,
};

const handleResponseError = (response) => {
    if (response.status === 403) {
        this.showLogin();
    }

    try {
        const { error } = response.json();
        return Promise.reject(new Error(error || response.statusText));
    } catch (e) {
        return Promise.reject(new Error(response.statusText));
    }
};

window.login = (data) => {
    // TODO: Remove me
    // credentials.userId = '42-dei';
    // credentials.isAdmin = true;
    // return Promise.resolve();

    return fetch(`${endpoint}/login`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    }).then(() => {
        if (!response.ok) {
            return handleResponseError(response);
        }

        const { user, token } = response.json();

        window.credentials.isAdmin = user.isAdmin;
        window.credentials.userId = token.userId;
        window.credentials.token = token.token;
    });
};

window.getUserResources = (userId = window.credentials.userId) => {
    // return Promise.resolve([
    //     { id: 're-1', resourceName: 'name-1' },
    //     { id: 're-2', resourceName: 'name-2' },
    //     { id: 're-3', resourceName: 'name-3' },
    //     { id: 're-4', resourceName: 'name-4' },
    // ])

    return fetch(`${endpoint}/resource/${userId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(() => {
        if (!response.ok) {
            return handleResponseError(response);
        }

        return response.json();
    });
};

window.deleteResource = (resourceId, userId) => {
    // console.log('Delete resource', resourceId, userId);
    // return Promise.resolve();

    return fetch(`${endpoint}/resource/${userId}/${resourceId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(() => {
        if (!response.ok) {
            return handleResponseError(response);
        }

        return response.json();
    });
};

window.createResource = (data) => {
    // console.log('Create resource', data);
    // return Promise.resolve();

    return fetch(`${endpoint}/resource/${userId}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(() => {
        if (!response.ok) {
            return handleResponseError(response);
        }

        return response.json();
    });
};

window.createUser = (data) => {
    // console.log('Create user', data);
    // return Promise.resolve();

    return fetch(`${endpoint}/user`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(() => {
        if (!response.ok) {
            return handleResponseError(response);
        }

        return response.json();
    });
};

window.updateUser = (data) => {
    // console.log('Patch user', data);
    // return Promise.resolve();

    return fetch(`${endpoint}/user/${data.userId}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(() => {
        if (!response.ok) {
            return handleResponseError(response);
        }

        return response.json();
    });
};

window.getUsers = () => {
    // return Promise.resolve([
    //     {
    //         id: 'uid-1',
    //         email: 'me@mail.com',
    //         quota: -1,
    //         isAdmin: true
    //     },
    //     {
    //         id: 'uid-2',
    //         email: 'you@mail.com',
    //         quota: 10,
    //         isAdmin: false
    //     }
    // ]);

    return fetch(`${endpoint}/user`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(() => {
        if (!response.ok) {
            return handleResponseError(response);
        }

        return response.json();
    });
};

window.deleteUser = (userId) => {
    // console.log('Delete user', userId);
    // return Promise.resolve();

    return fetch(`${endpoint}/user/${userId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
    }).then(() => {
        if (!response.ok) {
            return handleResponseError(response);
        }

        return response.json();
    });
};