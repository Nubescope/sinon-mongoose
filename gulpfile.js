'use strict'
var gulp = require('gulp')
var eslint = require('gulp-eslint')
var excludeGitignore = require('gulp-exclude-gitignore')
var mocha = require('gulp-mocha')
var istanbul = require('gulp-istanbul')
var plumber = require('gulp-plumber')
var isparta = require('isparta')

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

gulp.task('default', gulp.series('static', 'test'))
