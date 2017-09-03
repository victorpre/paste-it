const gulp = require('gulp');
const util = require('gulp-util');

require('./gulpTasks/app.js');
require('./gulpTasks/deps.js');
require('./gulpTasks/server.js');

gulp.task('default', function() {
  if(util.env.production) {
    gulp.start('deps', 'app');
  } else {
    gulp.start('deps', 'app', 'server');
  }

});
