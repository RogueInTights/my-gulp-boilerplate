'use strict';

/* -------------------- Requirements -------------------- */

// Main requirements:
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const rename = require('gulp-rename');

// Templates requirements:
const jade = require('gulp-jade');

// Styles requirements:
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

// Scripts requirements:
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

// Images requirements:
const imageMin = require('gulp-imagemin');


/* -------------------- Config -------------------- */

const paths = {
    templates: ['dev/**/*.jade', '!dev/**/layout.jade'],
    scripts: 'dev/scripts/*.js',
    styles: 'dev/scss/*.scss',
    images: 'dev/images/*.{png,jpg,jpeg,gif,svg}'
};

const modulesConfig = {
    autoprefixer: ['last 25 versions'],
    babel: { presents: ['es2015'] }
}

/* -------------------- Tasks -------------------- */

// Task for rendering templates:
gulp.task('templates', () => {
    return gulp.src(paths.templates)
        .pipe(jade())
        .pipe(gulp.dest('./app/'))
        .pipe(browserSync.reload({stream: true}));
});

// Task for compile styles:
gulp.task('styles', () => {
    return gulp.src(paths.styles)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(autoprefixer({
            browsers: ['last 25 versions']
        }))
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./app/'))
        .pipe(browserSync.reload({stream: true}));
});

// Task for working with javascript:
gulp.task('scripts', () => {
    return gulp.src(paths.scripts)
        .pipe(babel({
            presents: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./app'))
        .pipe(browserSync.reload({stream: true}));
});

// Default task for tracking files:
gulp.task('default', ['browser-sync'], () => {
    gulp.watch('dev/**/*.jade', ['templates']);
    gulp.watch('dev/**/*.scss', ['styles']);
    gulp.watch('dev/**/*.js', ['scripts']);
});

// Task to reset the browser page when file changes:
gulp.task('browser-sync', () => {
    browserSync.init({
        server: {
            baseDir: "./app"
        }
    });
});