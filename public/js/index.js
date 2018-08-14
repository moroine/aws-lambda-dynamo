$(document).ready(() => {
  window.loadStack
    .then(() => {
      window.app = new App();
      window.resources = new Resources();
      window.admin = new Admin();

      window.app.start();
      window.resources.start();
      window.admin.start();
    });
});
