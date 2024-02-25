import { deleteAsync } from 'del';
import gulp from 'gulp';
import gulpSass from 'gulp-sass'
import imagemin from 'gulp-imagemin';
import dartSass from 'sass';
import rename from 'gulp-rename'
import cleanCSS from 'gulp-clean-css'
import babel from 'gulp-babel'
import uglify from 'gulp-uglify'
import concat from 'gulp-concat'
import sourcemaps from 'gulp-sourcemaps'
import autoprefixer from 'gulp-autoprefixer'
import htmlmin from 'gulp-htmlmin'

const sass = gulpSass(dartSass);

const paths = {
    html: {
        src: 'src/**/*.html',
        dest: 'dist'
    },
    styles: {
        src: 'src/**/*.scss',
        dest: 'dist/css/'
    },
    scripts: {
        src: 'src/**/*.js',
        dest: 'dist/js/'
    },
    images: {
        src: 'src/img/*',
        dest: 'dist/img/'
    }
}

export function clean() {
    return deleteAsync(['dist'])
}

export function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({ cascade: false }))
        .pipe(cleanCSS({ level: 2}))
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
}

export function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(sourcemaps.init())
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.scripts.dest))
}

export function img() {
    return gulp.src(paths.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.images.dest))
}

export function html() {
    return gulp.src(paths.html.src)
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(paths.html.dest))
}

export function watch() {
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
}

export const build = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch)
export default build

