import gulp from 'gulp';

async function func1() {
}

async function func2() {
}

gulp.task('build', async function() {
    console.log('gulp build started');
    await func1();
    await func2();
    console.log('done');
});


const gulp = require('gulp');
const fileinclude = require('gulp-file-include');

function buildPages() {
  return gulp.src(['src/**/*.html'])
    .pipe(fileinclude({
      include: 'header.html',
      base: './'
    }))
    .pipe(gulp.dest('docs'));
}

gulp.task('build', buildPages);

gulp.task('default', ['build']);
