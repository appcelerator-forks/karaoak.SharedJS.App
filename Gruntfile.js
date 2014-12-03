module.exports = function(grunt) {
    var _ = grunt.util._,
        path = require('path');

    grunt.ipaFilename = function(str) {
        return String(str).replace(/\s/g, '') + '_v' + grunt.context.version_number + '.' + grunt.generic.version_code + '.ipa';
    };

    grunt.apkFilename = function(str) {
        return str.replace(/ /g,"_").toLowerCase() + '_vc' + grunt.generic.version_code + '_vn' + grunt.context.version_number + '.apk';
    };

    require("time-grunt")(grunt);
    // Loads task options from `_grunts/` and loads tasks defined in `package.json`
    var config = _.extend({},
        require('load-grunt-config')(grunt, {
            jitGrunt: true, //https://github.com/shootaroo/jit-grunt
            configPath: path.join(process.cwd(), '_grunt'),
            init: true,
            data: {
                dirs: {
                    'builds': '_builds',
                    'config': '_config'
                },
                context: {},
                developer: {}
            }
        })
    );

    config.env = process.env;

    var readConfig = function(overwrite) {
        overwrite = overwrite || false;

        if(overwrite && (grunt.option('app') || grunt.option('p'))) storeOptions();
        var options = grunt.file.readJSON('_builds/build.options.json');
        if(options) {
            if(options.app) grunt.option('app', options.app);
            if(options.p) grunt.option('p', options.p);
        }

        grunt.generic = grunt.file.readJSON('_config/_generic.json');
        grunt.generic.version_code = options.versionCode; //version_code in generic.json has become redundant.

        if (grunt.option('app')) {
            grunt.context = grunt.file.readJSON('_config/' + grunt.option('app') + '.json');
        }
        if (grunt.option('developer')) {
            grunt.developer = grunt.file.readJSON('_config/developers/' + grunt.option('developer') + '.json');
        } else {
            grunt.developer = grunt.file.readJSON('_config/_developer.default.json');
        }

        var dirs = {
            'builds': '_builds',
            'config': '_config',
            'dev_builds': grunt.developer.deploy.dev_builds_dir + grunt.option('p') + ((grunt.option('p') == 'ios') ? '/files' : ''),
            'public_builds': grunt.developer.deploy.public_builds_dir + grunt.option('p') + ((grunt.option('p') == 'ios') ? '/files' : '')
        };
        grunt.dirs = dirs;

    };

    var storeOptions = function() {
        var options = {};
        options.app = (grunt.option('app')) ? grunt.option('app') : 'match';
        options.p = (grunt.option('p')) ? grunt.option('p') : 'ios';
        grunt.file.write('_builds/build.options.json', JSON.stringify(options), {force: true});
    };

    var setModules = function(tiapp, modules) {
        _.each(modules.ios, function(m) {
            tiapp.setModule(m, { platform: 'iphone'});
        });
        _.each(modules.android, function(m) {
            tiapp.setModule(m, { platform: 'android'});
        });
    };

    grunt.registerTask('updateTiappXml', 'Update template generated tiapp.xml', function() {
        var tiapp = require('tiapp.xml').load('./tiapp.xml');

        setModules(tiapp, grunt.generic.modules);
        setModules(tiapp, grunt.context.modules);

        var ts = Math.round((new Date()).getTime() / 1000);

        var options = grunt.file.readJSON('_builds/build.options.json');
        options.versionCode = ts;
        grunt.file.write('_builds/build.options.json', JSON.stringify(options), {force: true});

        tiapp.setProperty('build.timestamp', ts, 'string');

        var versions = tiapp.version.split('.');
        versions[3] = ts.toString();
        tiapp.version = versions.join('.');

        var androids = tiapp.doc.documentElement.getElementsByTagName('android');

        if (androids.length === 1) {
            var manifests = androids.item(0).getElementsByTagName('manifest');

            if (manifests.length === 1) {
                var manifest = manifests.item(0);

                manifest.setAttribute('android:versionName', versions.slice(0, 3).join('.'));
                manifest.setAttribute('android:versionCode', ts);
            }
        }

        tiapp.write();
    });

    // Grunt main custom tasks...

    grunt.registerTask('tasktest', 'Task tester', function() {
        readConfig();
        grunt.task.run('shell:android_copy_2_dev_builds_dir');
    });

    grunt.registerTask('wipe', 'Clean build directories', function() {
        readConfig();
        grunt.task.run('titanium:clean');
    });

    grunt.registerTask('tiapp', 'Update Ti:tiapp.xml and manifest, Alloy:config.json', function() {
        readConfig(true);
        //grunt.task.run('template');
        grunt.task.run('updateTiappXml');
        grunt.task.run('titanium:clean');

    });

    grunt.registerTask('sim', 'Build app for testing in iOS simulator', function() {
        // ti info -p ios
        readConfig();
        grunt.task.run('titanium:ios_sim');
    });

    grunt.registerTask('geny', 'Build app for Genymotion', function() {
        // ti info -p android
        readConfig();
        grunt.task.run('shell:android_geny');
    });

    grunt.registerTask('test', 'Build app for testing', function() {
        readConfig();
        if (grunt.option('p') == "android") {
            grunt.task.run('titanium:test_android');
        } else {
            grunt.task.run('titanium:ios_device');
        }
    });

    grunt.registerTask('adhoc', 'Build adhoc release package', function() {
        readConfig();
        grunt.option('p', 'ios');
        grunt.task.run('titanium:ios_dist_adhoc');
        grunt.task.run('shell:ios_rename_ipa');

        grunt.task.run('shell:ios_copy_2_dev_builds_dir');
        grunt.task.run('shell:ios_copy_2_public_builds_dir');

        //grunt.task.run('ftp:ios_upload');

    });

    grunt.registerTask('release', 'Build app release package', function() {
        readConfig();
        if (grunt.option('p') == "android") {
            grunt.task.run('titanium:android_dist_playstore');
            grunt.task.run('shell:jarsign');
            grunt.task.run('shell:zipalign');

            grunt.task.run('shell:android_copy_2_dev_builds_dir');
            grunt.task.run('shell:android_copy_2_public_builds_dir');

            grunt.task.run('ftp:android_upload');
            grunt.task.run('shell:delete_apk_src');

        } else {
            grunt.option('p', 'ios');
            grunt.task.run('titanium:ios_dist_appstore');
        }
    });

    grunt.registerTask('test_ftp', 'Test FTP uploading', function() {
        //shim
        grunt.option('app', 'match');
        grunt.option('p', 'android');

        readConfig();
        grunt.task.run('ftp:android_upload');
    });

};