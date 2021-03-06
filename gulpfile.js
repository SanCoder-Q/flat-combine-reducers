require('babel-core/register');

const gulp = require('gulp');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const eslint = require('gulp-eslint');
const istanbul = require('gulp-istanbul');
const spawn = require('child_process').spawn;

function lint() {
  return gulp
    .src(['./gulpfile.js', './src/**/*.js', './test/**/*.js'])
    .pipe(eslint({
      'extends':'eslint:recommended'
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function hookIstanbul() {
  return gulp
    .src([ './src/**/*.js' ])
    .pipe(istanbul({
      instrumenter: require('babel-istanbul').Instrumenter
    }))
    .pipe(istanbul.hookRequire());
}

function test() {
  return gulp
    .src('test/**/*.js')
    .pipe(mocha({reporter: 'spec'}))
    .pipe(istanbul.writeReports({
      reporters: ['lcovonly', 'text', 'text-summary', 'html']
    }))
    .pipe(istanbul.enforceThresholds({
      thresholds: { global: 90 }
    }));
}

function build() {
  return gulp
    .src('src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('dist'));
}

function publish(done) {
  spawn('npm', ['publish'], { stdio: 'inherit' }).on('close', done);
}

gulp.task('lint', lint);

gulp.task('istanbul', hookIstanbul);

gulp.task('test', ['lint', 'istanbul'], test);

gulp.task('build', ['test'], build);

gulp.task('publish', ['build'], publish);
