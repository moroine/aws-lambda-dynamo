class Resources {
    constructor() {
        this.$selfTable = $("#self-resources-table");
        this.$modalTable = $("#modal-resources-table");
        this.$createModal = $('#create-resource');
        this.$listModal = $('#resource-list-modal');
        this.$createForm = $('#resource-form');
        this.$createResBtn = $('#create-resource-btn');

        this.$createResBtn.on('click', () => {
            this.showCreateModal();
        });

        this.$createForm.submit((event) => {
            event.preventDefault();
            const data = {};
            this.$createForm.serializeArray().forEach((d) => {
                data[d.name] = d.value;
            });

            app.showLoading();
            createResource(data)
                .catch((e) => {
                    console.error(e);
                    toastr.error(e.message);
                })
                .then(() => {
                    app.hideLoading();
                    this.hideCreateModal();
                    this.update();
                    this.$createForm[0].reset();
                });
        });

        $('body').on('click', '.resource-remove', (e) => {
            e.preventDefault();
            const {resourceId, userId} = $(e.target).data();

            app.showLoading();
            deleteResource(resourceId, userId)
                .then(() => {
                    this.update();
                    app.hideLoading();
                    this.hideResourcesModal();
                })
                .catch((e) => {
                    console.error(e);
                    toastr.error(e.message);
                    app.hideLoading();
                });
        })
    }

    start() {
        this.$createModal.modal({
            show: false,
            backdrop: false,
            keyboard: false,
        });
        this.$listModal.modal({
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

    update() {
        app.showLoading();
        getUserResources()
            .then((data) => {
                this.$selfTable.html(this.formatResourcesTable(data));
                app.hideLoading();
            })
            .catch((e) => {
                console.error(e);
                toastr.error(e.message);
                app.hideLoading();
            });
    }

    formatResourcesTable(data, userId = credentials.userId) {
        const html = [];

        data.forEach(({id, resourceName}) => {
            html.push(`
                    <tr>
                        <td scope="col">${id}</td>
                        <td scope="col">${resourceName}</td>
                        <td scope="col">
                            <button 
                                type="button" 
                                class="btn btn-danger resource-remove" 
                                data-user-id="${userId}" 
                                data-resource-id="${id}"
                            >
                            Remove
                            </button>
                        </td> 
                    </tr>
                `);
        });

        return html.join('');
    }

    hideResourcesModal() {
      this.$listModal.modal('hide');
    }

    showResourcesModal(userId) {
        app.showLoading();
        getUserResources(userId)
            .then((data) => {
                this.$modalTable.html(this.formatResourcesTable(data, userId));
                app.hideLoading();
                this.$listModal.modal('show');
            })
            .catch((e) => {
                console.error(e);
                toastr.error(e.message);
                app.hideLoading();
            });
    }
}
