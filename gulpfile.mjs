/*!!! plz use this syntax!!!!!!!!

 async function makeSoup() {
  const pot = boilPot();
  chopCarrots();
  chopOnions();
  await pot;
  await boilPot();

  addCarrots();
  await letPotKeepBoiling(5);
  addOnions();
  await letPotKeepBoiling(10);
  console.log(“your pot ready!”);
}
*/


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
