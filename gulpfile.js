const gulp = require('gulp');
const mocha = require('gulp-mocha');
const mocha_options = {
  reporter: 'Spec', // nyan,Spec,List
  globals: ["_", "jquery"],
  require: [], //Require custom modules before tests are run

};
gulp.task('default', () =>
  gulp.
  src('test/**/*.spec.js', {read: false}).
  pipe(mocha(mocha_options)).on('error', console.error)
);