const gulp = require('gulp');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');

function build() {
  return gulp
    .src('src/**/*.js')
    .pipe(eslint({
      'extends':'eslint:recommended'
    }))
   .pipe(eslint.format())
   .pipe(babel({
     presets: ['es2015']
   }))
   .pipe(gulp.dest('dist'));
}

gulp.task('build', build);
