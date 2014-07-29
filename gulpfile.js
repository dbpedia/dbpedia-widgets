var gulp = require('gulp');
var plugins = require("gulp-load-plugins")({lazy:false});

gulp.task('copyDisplayConfigurations', function () {
    //copy all the display configurations for types
    gulp.src(['./app/assets/configurations/**/*.json'], { base: './app' })
        .pipe(gulp.dest('./build'));
});

gulp.task('scripts', function(){
    //combine all js files of the app
    gulp.src(['!./app/**/*_test.js','./app/**/*.js'])
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.concat('app.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('templates',function(){
    //combine all template files of the app into a js file
    gulp.src(['!./app/index.html',
        './app/**/*.html'])
        .pipe(plugins.angularTemplatecache('templates.js',{standalone:true}))
        .pipe(gulp.dest('./build'));
});

gulp.task('css', function(){
    gulp.src('./app/**/*.css')
        .pipe(plugins.concat('app.css'))
        .pipe(gulp.dest('./build'));
});

gulp.task('vendorJS', function(){
    //concatenate vendor JS files
    gulp.src([
            '!./bower_components/jquery/src/**/*.js',
            './bower_components/jquery/dist/jquery.js',
            '!./bower_components/**/*.min.js',
            //'./bower_components/**/*.js'
            './bower_components/angular/*.js',
            './bower_components/angular-route/*.js',
            './bower_components/dbpedia-autosuggest/**/*.js',
            './bower_components/angular-mocks/*.js'
        ])
        .pipe(plugins.concat('lib.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('vendorCSS', function(){
    //concatenate vendor CSS files
    gulp.src(['!./bower_components/**/*.min.css',
        './bower_components/**/*.css'])
        .pipe(plugins.concat('lib.css'))
        .pipe(gulp.dest('./build'));
});

gulp.task('copy-index', function() {
    gulp.src('./app/index.html')    
        .pipe(gulp.dest('./build'));
});

gulp.task('watch',function(){
    gulp.watch([
        'build/**/*.html',        
        'build/**/*.js',
        'build/**/*.css'        
    ], function(event) {
        return gulp.src(event.path)
            .pipe(plugins.connect.reload());
    });
    gulp.watch(['./app/**/*.js','!./app/**/*test.js'],['scripts']);
    gulp.watch(['!./app/index.html','./app/**/*.html'],['templates']);
    gulp.watch('./app/**/*.css',['css']);
    gulp.watch('./app/index.html',['copy-index']);

});

gulp.task('connect', plugins.connect.server({
    root: ['build'],
    port: 9000,
    livereload: true
}));

var spawn = require('child_process').spawn;
gulp.task('proxy', function () {
    var stderr = '';
    var stdout = '';
    
    var cmd = spawn("python",["server.py"], { cwd: process.cwd() + "/proxy" });
    cmd.stdout.setEncoding('utf8');
    cmd.stdout.on('data', function (data) {
        stdout += data;
        console.log(data);
    });

    cmd.stderr.setEncoding('utf8');
    cmd.stderr.on('data', function (data) {
        stderr += data;
        console.log(data);
    });
});


var sass = require('gulp-sass');

var paths = ['app/sass', 'app/components/sass']
                .concat(require('node-bourbon').includePaths)
                .concat(require('node-neat').includePaths);

var options = {
    // includePaths: require('node-bourbon').with('other/path', 'another/path')
    // - or -
    includePaths: paths
};
gulp.task('sass', function () {
    gulp.src('app/**/*.scss')
        .pipe(sass(options))
        .pipe(gulp.dest('build'));
});

gulp.task('default',['connect','proxy','scripts','templates','sass','css','copy-index','vendorJS','vendorCSS', 'copyDisplayConfigurations', 'watch']);
