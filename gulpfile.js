var gulp = require('gulp');
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var shell = require('gulp-shell');
var strip = require('gulp-strip-comments');
var download = require("gulp-download-stream");

var buildDir = process.env.BUILD_DIR || '';
var javaSrc = process.env.JAVA_SRC  || 'aurora';
var name = process.env.CODEGEN_NAME || 'AuroraCodegen';
var targetDir = process.env.TARGET_DIR || 'myClient';
var swaggerDefPort = process.env.SWAGGER_DEF_PORT || '3000';
var swagger_ip = process.env.SWAGGER_DEF_IP || 'swaggerdeflink';


gulp.task('possibleLinks', function() {
  download({
    file: 'possibleLinks.json',
    url: 'http://' + swagger_ip + ':' + swaggerDefPort + '/possibleLinks'
  })
  .pipe(gulp.dest('/src/'+ buildDir + '/'));

});

/**
 *
 */
gulp.task('build', ['possibleLinks'], function () {
    gulp.src('')
        .pipe(shell([
                'cd /src/' + buildDir + '/' + javaSrc + ' && mvn package'
        ]));
});

/**
 * generates the javascript files from given mustache template
 */
gulp.task('generate', ['build'], function () {
     gulp.src('')
        .pipe(shell([
                'java -cp /src/' +buildDir + '/' + javaSrc + '/target/' + name + '-swagger-codegen-1.0.0.jar:/opt/swagger-codegen/modules/swagger-codegen-cli/target/swagger-codegen-cli.jar io.swagger.codegen.SwaggerCodegen generate -l ' + name + ' -i http://' + swagger_ip + ':' + swaggerDefPort + '/swagger/ -o /src/' + buildDir + '/' + targetDir

        ]))
        .pipe(shell([
            'cd /src/' + buildDir + ' && ./beautifyAndCopy.sh'
        ]));
});

gulp.task('buildAndGenerate', ['build', 'generate']);


gulp.task('default', ['buildAndGenerate'], function() {

});
