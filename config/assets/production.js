'use strict';

/* eslint comma-dangle:[0, "only-multiline"] */

module.exports = {
  client: {
    lib: {
      css: [
        // bower:css
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.css',
        'public/lib/bootstrap/dist/css/bootstrap.min.css',
        //'public/lib/bootstrap/dist/css/bootstrap-theme.min.css',
        'public/bootflat/css/bootflat.min.css',
        'public/site.min.css'
        // endbower
      ],
      js: [
        // bower:js
        'public/lib/angular/angular.min.js',
        'public/lib/angular-animate/angular-animate.min.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'public/lib/angular-messages/angular-messages.min.js',
        'public/lib/angular-mocks/angular-mocks.js',
        'public/lib/angular-resource/angular-resource.min.js',
        'public/lib/angular-ui-notification/dist/angular-ui-notification.min.js',
        'public/lib/angular-ui-router/release/angular-ui-router.min.js',
        'public/lib/ng-file-upload/ng-file-upload.min.js',
        'public/lib/angular-file-upload/dist/angular-file-upload.min.js',
        'public/lib/owasp-password-strength-test/owasp-password-strength-test.js',
        'public/lib/angular-spinner/dist/angular-spinner.min.js',
        'public/lib/angular-translate/angular-translate.js',
        'public/lib/angular-translate-loader-url/angular-translate-loader-url.js',
        'public/lib/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
        'public/lib/js-hypercube-master/js-hypercube.min.js'
        // endbower
      ]
    },
    css: 'public/dist/application*.min.css',
    js: 'public/dist/application*.min.js'
  }
};
