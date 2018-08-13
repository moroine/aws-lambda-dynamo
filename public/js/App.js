class App {
  constructor() {
    this.page = 'login';

    this.$login = $('#login');
    this.$loginForm = $('#login-form');

    this.$loginForm.submit((event) => {
      event.preventDefault();
      const data = {};
      this.$loginForm.serializeArray().forEach((d) => {
        data[d.name] = d.value;
      });

      console.log(data);
    });
  }

  start() {
    this.requestLogin();
  }

  requestLogin() {
    this.$login.modal({
      backdrop: false,
      keyboard: false,
    });
  }
}
