'use strict'
var path = require('path')
var gulp = require('gulp')
var eslint = require('gulp-eslint')
var excludeGitignore = require('gulp-exclude-gitignore')
var mocha = require('gulp-mocha')
var istanbul = require('gulp-istanbul')
var plumber = require('gulp-plumber')
var coveralls = require('@kollavarsham/gulp-coveralls')
var babel = require('gulp-babel')
var del = require('del')
var isparta = require('isparta')

// Initialize the babel transpiler so ES2015 files gets compiled
// when they're loaded
require('babel-core/register')

gulp.task('static', function staticTask() {
  return gulp
    .src('**/*.js')
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('pre-test', function pretestTask() {
  return gulp
    .src('lib/**/*.js')
    .pipe(
      istanbul({
        includeUntested: true,
        instrumenter: isparta.Instrumenter,
      })
    )
    .pipe(istanbul.hookRequire())
})

gulp.task(
  'test',
  gulp.series('pre-test', function testTask(cb) {
    var mochaErr

    gulp
      .src('test/**/*.js')
      .pipe(plumber())
      .pipe(mocha({ reporter: 'spec' }))
      .on('error', function(err) {
        mochaErr = err
      })
      .pipe(istanbul.writeReports())
      .on('end', function() {
        cb(mochaErr)
      })
  })
)

gulp.task(
  'coveralls',
  gulp.series('test', function coverallsTask() {
    if (!process.env.CI) {
      return Promise.resolve()
    }

    return gulp
      .src(path.join(__dirname, 'coverage/lcov.info'))
      .pipe(coveralls())
  })
)

gulp.task('clean', function() {
  return del('dist')
})

gulp.task(
  'babel',
  gulp.series('clean', function babelTask() {
    return gulp
      .src('lib/**/*.js')
      .pipe(babel())
      .pipe(gulp.dest('dist'))
  })
)

gulp.task('prepublishOnly', gulp.series('babel'))
gulp.task('default', gulp.series('static', 'test', 'coveralls'))
