class Admin {
    constructor() {
        this.$userTable = $('#user-table');
        this.$createUserBtn = $('#create-user-btn');
        this.$createModal = $('#create-user');
        this.$createForm = $('#create-user-form');
        this.$editModal = $('#edit-user');
        this.$editForm = $('#edit-user-form');

        $('#app').on('click', '.view-resources', (e) => {
            e.preventDefault();
            const {userId} = $(e.target).data();

            resources.showResourcesModal(userId);
        });

        $('#app').on('click', '.edit-user-btn', (e) => {
            e.preventDefault();
            const { userId, quota, isAdmin } = $(e.target).data();

            this.showEditModal(userId, quota, isAdmin);
        });

        $('body').on('click', '.user-remove', (e) => {
            e.preventDefault();
            const {userId} = $(e.target).data();

            app.showLoading();
            deleteUser(userId)
                .then(() => {
                    this.update();
                    app.hideLoading();
                })
                .catch((e) => {
                    console.error(e);
                    toastr.error(e.message);
                    app.hideLoading();
                });
        });

        this.$createUserBtn.on('click', () => {
            this.showCreateModal();
        });

        this.$editForm.submit((event) => {
            event.preventDefault();
            const data = {};
            this.$editForm.serializeArray().forEach((d) => {
                data[d.name] = d.value;
            });

            data.isAdmin = Boolean(data.isAdmin);

            app.showLoading();
            updateUser(data)
                .catch((e) => {
                    console.error(e);
                    toastr.error(e.message);
                })
                .then(() => {
                    app.hideLoading();
                    this.hideEditModal();
                    this.update();
                    this.$editForm.reset();
                });
        });

        this.$createForm.submit((event) => {
            event.preventDefault();
            const data = {};
            this.$createForm.serializeArray().forEach((d) => {
                data[d.name] = d.value;
            });
            
            data.isAdmin = Boolean(data.isAdmin);

            app.showLoading();
            createUser(data)
                .catch((e) => {
                    console.error(e);
                    toastr.error(e.message);
                })
                .then(() => {
                    app.hideLoading();
                    this.hideCreateModal();
                    this.update();
                    this.$createForm.reset();
                });
        });
    }

    start() {
        this.$createModal.modal({
            show: false,
            backdrop: false,
            keyboard: false,
        });
        this.$editModal.modal({
            show: false,
            backdrop: false,
            keyboard: false,
        });
    }

    showCreateModal() {
        this.$createModal.modal('show');
    }

    hideCreateModal() {
        this.$createModal.modal('hide');
    }

    showEditModal(userId, quota, isAdmin) {
        this.$editModal.modal('show');
        $('#edit-user-id').val(userId);
        $('#edit-user-isAdmin').attr('checked', isAdmin);
        $('#edit-user-quota').val(quota);
    }

    hideEditModal() {
        this.$editModal.modal('hide');
    }

    update() {
        app.showLoading();
        getUsers()
            .then((data) => {
                const html = [];

                data.forEach(({id, email, quota, isAdmin}) => {
                    html.push(`
                    <tr>
                        <td scope="col">${id}</td>
                        <td scope="col">${email}</td>
                        <td scope="col">${quota}</td>
                        <td scope="col">${isAdmin}</td>
                        <td scope="col">
                            <div class="btn-group" role="group">
                                <button 
                                    type="button" 
                                    class="btn btn-success view-resources" 
                                    data-user-id="${id}"
                                >
                                View Resources
                                </button>
                                <button 
                                    type="button" 
                                    class="btn btn-info edit-user-btn" 
                                    data-user-id="${id}"
                                    data-quota="${quota}"
                                    data-is-admin="${isAdmin}"
                                >
                                Edit
                                </button>
                                <button 
                                    type="button" 
                                    class="btn btn-danger user-remove" 
                                    data-user-id="${id}"
                                >
                                Remove
                                </button>
                            </div>
                        </td> 
                    </tr>
                `);
                });

                this.$userTable.html(html.join(''));
                app.hideLoading();
            })
            .catch((e) => {
                console.error(e);
                toastr.error(e.message);
                app.hideLoading();
            });
    }
}