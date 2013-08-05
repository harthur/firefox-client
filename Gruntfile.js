/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: false,
        globals: {
          require: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['test'] //, 'jshint:lib_test']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint']);

  // DEFINE CUSTOM TASKS
  grunt.registerTask('test', ['test-server', 'firefox-run']);

  grunt.registerTask('test-server', 'Run the test server', function() {
    require('./test');
  });
  grunt.registerTask('firefox-run', 'Run Firefox using cfx', function() {
    var done = this.async();
    var rdp_helper_addon_dir = process.env.FIREFOX_ADDON_DIR || "./test/rdp-test-helper-jpext";

    grunt.log.writeln('running firefox ...');
    // And some async stuff.
    var options = this.options();
    var cmdPath = process.env.CFX_BIN || "./addon-sdk/bin/cfx";

    var args = [
      "run",
      "-b", process.env.FIREFOX_BIN || require('which').sync('firefox'),
    ];

    grunt.log.writeln("CMD: "+cmdPath);

    var spawn = grunt.util.spawn({
      cmd: cmdPath,
      args: args,
      opts: {
        cwd: rdp_helper_addon_dir,
        env: {
          MINIMIZE: 1,
          DISPLAY: process.env.DISPLAY,
          PYTHON_PATH: process.env.FIREFOX_ADDON_DIR+"/python-lib:"+process.env.PYTHON_PATH,
          PATH: process.env.FIREFOX_ADDON_DIR+"/bin:"+process.env.PATH,
          RDP_LISTEN_PORT: 6000,
          RDP_CONNECT_TO: "localhost:5001"
        }
      }
    }, function(err, result, code) {
      grunt.log.writeln('"firefox run" done (exit code: '+code+').');
      done();
    });

//    spawn.stdout.on("data", function (data) { console.log("STDOUT", data.toString()) });
//    spawn.stderr.on("data", function (data) { console.log("STDERR", data.toString()) });

    return spawn;
  });
};
