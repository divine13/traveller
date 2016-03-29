module.exports = function(grunt) {

    //load plugins
	[
	 'grunt-cafe-mocha',
     'grunt-contrib-jshint',
     'grunt-exec',
    ].forEach(function(task) {  //lamba expression
    	grunt.loadNpmTasks(task); 
    });

    grunt.initConfig({
    	cafemocha: {
           all: { src: 'qa/tests-*.js', options: { ui: 'tdd' }, }
        },
        jshint: {
           app: ['meadowlark.js', 'public/js/**/*.js', 'lib/**/*.js'],
           qa: ['Gruntfile.js', 'public/qa/**/*.js', 'qa/**/*.js'],
        },
        exec: {
           linkchecker: { cmd: 'linkchecker http://localhost:3000' } //no internet to download stuff
        },
    }); // End grunt.initConfig
    grunt.registerTask('default', ['cafemocha','jshint',]);
};