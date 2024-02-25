import { deleteAsync } from 'del';
import gulp from 'gulp';
import gulpSass from 'gulp-sass'
import dartSass from 'sass';
import rename from 'gulp-rename'
import cleanCSS from 'gulp-clean-css'
import babel from 'gulp-babel'
import uglify from 'gulp-uglify'
import concat from 'gulp-concat'

const sass = gulpSass(dartSass);

const paths = {
    styles: {
        src: 'src/**/*.scss',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/**/*.js',
        dest: 'dist/js/'
    }
}

export function clean() {
    return deleteAsync(['dist'])
}

export function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS())
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest))
}

export function scripts() {
    return gulp.src(paths.scripts.src, {
        sourcemaps: true
    })
        .pipe(babel())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(paths.scripts.dest))
}

export function watch() {
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
}

export const build = gulp.series(clean, gulp.parallel(styles, scripts), watch)
export default build

