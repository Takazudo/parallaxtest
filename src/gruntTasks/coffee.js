/**
 * coffee
 * CoffeeScript: http://coffeescript.org/
 */
module.exports = function(grunt){
  
  var log = grunt.log;

  // Nodejs libs.
  var proc = require('child_process');

  grunt.registerMultiTask('coffee', 'compile CoffeeScripts', function() {
    var done = this.async();
    var src = this.file.src;
    var dest = this.file.dest;
    var command = 'coffee --compile --output ' + dest + ' ' + src;
    var out = proc.exec(command, function(err, sout, serr){
      if(err || sout || serr){
        proc.exec("growlnotify -t 'COFFEE COMPILE ERROR!' -m '" + serr + "'");
        log.writeln('Scripts in ' + src + ' were failed to compile to ' + dest + '.');
        done(false);
      }else{
        log.writeln('Scripts in ' + src + ' were compiled to ' + dest + '.');
        done(true);
      }
    });
  });

};
