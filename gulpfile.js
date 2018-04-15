const del = require('del');
const gulp = require('gulp');
const path = require('path');
const runSequence = require('run-sequence');

const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');
const nodemon = require('gulp-nodemon');

const tsConfigPath = path.resolve(__dirname + '/tsconfig.json');
const tsCompilerOptions = require(tsConfigPath).compilerOptions;
const tsRootDir = path.resolve(__dirname + '/' + tsCompilerOptions.rootDir);

const tsProject = ts.createProject(tsCompilerOptions);

gulp.task('clean', () => {
    return del('dist');
});

gulp.task('copy', () => {
    return gulp.src(['./package.json'], {base: tsRootDir})
        .pipe(gulp.dest('dist'));
});

gulp.task('ts', () => {
    return gulp.src(['src/**/*.ts'], {base: tsRootDir})
        .pipe(sourcemaps.init())
        .pipe(tsProject()).js
        .pipe(sourcemaps.write('.', {includeContent: false, sourceRoot: '.'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', (done) => {
    runSequence('clean', ['copy', 'ts'], done);
});

gulp.task('watch', ['build'], () => {
    gulp.watch(['./package.json'], ['copy']);
    gulp.watch(['src/**/*.ts'], ['ts']);

    return nodemon({
        execMap: {
            js: "node --inspect --harmony"
        },
        script: 'dist/src/index.js',
        watch: 'dist',
        ext: 'js',
        debug: true,
        delay: 1000
    });
});