import gulp from 'gulp';
import fileinclude from 'gulp-file-include';


async function htmlPartialsInclude() {
}
  
async function catalogDomsBuild() {
}


gulp.task('build', async function() {
	console.log('gulp build started');
	await htmlPartialsInclude();
	await catalogDomsBuild();
	console.log('done');
  });

  
  
