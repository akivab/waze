# g-waze — an app for viewing notifications on a map

Visit [g-waze](http://g-waze.appspot.com) for the live demo, and the [test page](http://test-notifications.staging.waze.com) for the Waze staging website.

### On viewing this source code

A few notes:
* This app uses AngularJS and App Engine, and builds off the [angular-seed project](https://github.com/angular/angular-seed).
  * To view the angularjs code, visit the app/ directory.
  * The server code (App Engine) aims to be just a proxy. To view the source, view main.py
* You'll need node.js to run the tests under the tests/ directory.

### Some tricky things with test-notifications!

There are a couple tricky things with the Waze test-notifications server!
* PUT requests need an application/x-www-form-urlencoded content header
* The test-notifications server will crash regularly, so handling error cases is very important.

### Running unit tests

Angular-seed recommend using [jasmine](https://jasmine.github.io/) and
[Karma](http://karma-runner.github.io).

Requires [node.js](http://nodejs.org/), Karma (`sudo npm install -g karma`) and a local
or remote browser.

* start `scripts/test.sh` (on windows: `scripts\test.bat`)
  * a browser will start and connect to the Karma server (Chrome is default browser, others can be captured by loading the same url as the one in Chrome or by changing the `config/karma.conf.js` file)
* to run or re-run tests just change any of your source or test javascript files


## Directory Layout

    app/                --> all of the files to be used in production
      css/              --> css files
        app.css         --> default stylesheet
      img/              --> image files
      index.html        --> app layout file (the main html template file of the app)
      js/               --> javascript files
        app.js          --> application
        controllers.js  --> application controllers
        directives.js   --> application directives
        filters.js      --> custom angular filters
        services.js     --> custom angular services
      partials/             --> angular view partials (partial html templates)
          main-view.html
          popup.html
          popup-edit.html
          popup-info.html
          popup-marker.html
          popup-new.html      

    app.yaml            --> Configuration for AppEngine 

    config/karma.conf.js        --> config file for running unit tests with Karma
    config/karma-e2e.conf.js    --> config file for running e2e tests with Karma

    main.py             --> AppEngine server logic

    scripts/            --> handy shell/js/ruby scripts
      e2e-test.sh       --> runs end-to-end tests with Karma (*nix)
      e2e-test.bat      --> runs end-to-end tests with Karma (windows)
      test.bat          --> autotests unit tests with Karma (windows)
      test.sh           --> autotests unit tests with Karma (*nix)
      web-server.js     --> simple development webserver based on node.js

    test/               --> test source files and libraries
      unit/                     --> unit level specs/tests
        controllersSpec.js      --> specs for controllers
        servicesSpec.js         --> specs for services

## Contact

Akiva Bamberger (akiva.bamberger@gmail.com)
