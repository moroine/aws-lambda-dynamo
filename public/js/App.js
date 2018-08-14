class App {
    constructor() {
        this.page = null;

        this.$login = $('#login');
        this.$loginForm = $('#login-form');

        this.$loading = $('#loading');

        this.$app = $('#app');
        this.$navRes = $("#nav-resources");
        this.$navAdmin = $("#nav-admin");

        this.$pageRes = $('#resource-page');
        this.$pageAdmin = $('#admin-page');

        this.$createResBtn = $('#create-resource-btn');
        this.$createUserBtn = $('#create-user-btn');

        toastr.options.closeButton = true;
        toastr.options.closeDuration = 300;
        toastr.options.closeEasing = 'swing';

        this.$navRes.on('click', () => {
            this.showHome();
        });
        this.$navAdmin.on('click', () => {
            this.showAdmin();
        });

        this.$loginForm.submit((event) => {
            event.preventDefault();
            const data = {};
            this.$loginForm.serializeArray().forEach((d) => {
                data[d.name] = d.value;
            });

            this.showLoading();
            login(data)
                .then(() => {
                    this.hideLoading();
                    this.hideLogin();
                    this.showHome();
                })
                .catch((e) => {
                    console.error(e);
                    toastr.error(e.message);
                    this.hideLoading();
                });
        });
    }

    showLoading() {
        this.$loading.removeClass('d-none');
    }

    hideLoading() {
        this.$loading.addClass('d-none');
    }

    start() {
        this.$login.modal({
            backdrop: false,
            keyboard: false,
        });
        this.showLogin();
    }

    showLogin() {
        this.$login.modal('show');
        this.page = 'login';
        this.$app.addClass('d-none');
    }

    hideLogin() {
        this.$login.modal('hide');
        this.page = 'login';
        this.$app.removeClass('d-none');
    }

    showHome() {
        this.page = 'home';
        this.$navRes.parent().addClass('active');
        this.$navAdmin.parent().removeClass('active');
        this.$pageAdmin.addClass('d-none');
        this.$pageRes.removeClass('d-none');
        this.$createUserBtn.addClass('d-none');
        this.$createResBtn.removeClass('d-none');

        resources.update();
    }

    showAdmin() {
        if (!credentials.isAdmin) {
            toastr.error('You are not admin');
            return;
        }

        this.page = 'admin';
        this.$navAdmin.parent().addClass('active');
        this.$navRes.parent().removeClass('active');
        this.$pageAdmin.removeClass('d-none');
        this.$pageRes.addClass('d-none');
        this.$createResBtn.addClass('d-none');
        this.$createUserBtn.removeClass('d-none');

        admin.update();
    }
}