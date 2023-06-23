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
