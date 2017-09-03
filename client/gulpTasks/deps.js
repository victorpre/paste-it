const gulp = require('gulp')
const uglify = require('gulp-uglify')
const uglifycss = require('gulp-uglifycss')
const concat = require('gulp-concat')

gulp.task('deps', ['deps.js', 'deps.css', 'deps.fonts']);

gulp.task('deps.js', function() {
  var stream =gulp.src([
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/angular/angular.js',
      'node_modules/angular-route/angular-route.min.js',
      'node_modules/angular-animate/angular-animate.min.js',
      'node_modules/angular-toastr/dist/angular-toastr.tpls.min.js',
      'node_modules/materialize-css/dist/js/materialize.min.js'
    ])
  .pipe(uglify())
  .pipe(concat('deps.min.js'))
    .pipe(gulp.dest('public/assets/js'));

  return stream;
})

gulp.task('deps.css', function() {
  gulp.src([
    'node_modules/angular-toastr/dist/angular-toastr.min.css',
    'node_modules/materialize-css/dist/css/materialize.min.css',
  ])
  .pipe(uglifycss({ "uglyComments": true  }))
  .pipe(concat('deps.min.css'))
  .pipe(gulp.dest('public/assets/css'));


});


gulp.task('deps.fonts', function() {
  gulp.src([
    'node_modules/materialize-css/dist/fonts/roboto/*.*'
  ])
    .pipe(gulp.dest('public/assets/fonts/roboto'));
});
