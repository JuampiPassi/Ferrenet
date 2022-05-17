const gulp = require('gulp');
const { src, dest } = gulp;
const del = require('del');
const zip = require('gulp-zip');

process.env.NODE_OPTIONS='--max_old_space_size=3000'

// Vaciar la carpeta 'dist'
gulp.task('clean', del.bind(null, [
	'dist/**',
]));

// Ejecuta 'npm run build' en la carpeta 'cliente'
gulp.task('build-cliente', function (done) {
	// const path = require('path');
	let { exec } = require('child_process');

	try {
		exec('npm i && npm run build', {
			cwd: __dirname,
			maxBuffer: 1024 * 1024 * 10
		}, (err, _stdout, stderr) => {
			if (err) {
				console.error(stderr);
				return done(err);
			}

			done();
		});
	} catch (e) {
		done(e);
	}
});

// Copia los archivos principales de la aplicación
gulp.task('copy-server', () => {
	const SERVER_BUILD_FILES = [
		'server/**/*',
		// '.env_default',
		'package.json',
		'package-lock.json'
	];

	return src(SERVER_BUILD_FILES, { base: '.' })
		.pipe(dest('dist/'));
});

// Copia el build de la web
// gulp.task('copy-cliente', function () {
// 	return src('ui/dist/**', { base: 'ui/dist' })
// 		.pipe(dest('dist/ui/dist/'));
// });
// gulp.task("copy-cliente", function() {
//   return src("app/dist/**", { base: "app/dist" }).pipe(dest("dist/app/dist/"));
// });



// Generar la versión para instalar en el cliente
gulp.task('build', gulp.series(
  'clean',
	'build-cliente',
	'copy-server',
));

gulp.task("package",
  gulp.series(
    "build",
    () => {
      let project = process.env.CI_PROJECT_NAME || "ferrenet";
      let version;
      if (/^v((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)$/.test(process.env.CI_BUILD_REF_NAME))
        version = process.env.CI_BUILD_REF_NAME.slice(1);
      else
        version = process.env.CI_BUILD_REF_NAME || "master";

      return gulp.src('dist/**')
        .pipe(zip(`${project}-${version}.zip`))
        .pipe(dest('./'))
    }
  )
)