var escapeShell = function(cmd) {
    return cmd.replace(/(["\s'$`\\])/g,'\\$1');
};

var removeSpaces = function(str) {
    return str.replace(/\s/g, '');
};

module.exports = function(grunt) {

    return {
        test: {
            options: {
                stdout: true
            },
            command: function() { return 'echo ' + escapeShell(grunt.context.app_name); }
        },
        jarsign: {
            options: {
                stdout: true
            },
            command: function() { return 'jarsigner -sigalg MD5withRSA -digestalg SHA1 -keystore ' + grunt.context.android.keystore + ' -storepass ' + grunt.context.android.storepass + ' -signedjar _builds/' + escapeShell(grunt.context.app_name) + '.apk _builds/' + escapeShell(grunt.context.app_name) + '.apk ' + grunt.context.android.keyalias; }
        },
        zipalign: {
            options: {
                stdout: true
            },
            command: function() { return '/Applications/android-sdk-macosx/build-tools/20.0.0/zipalign -f -v 4 _builds/' + escapeShell(grunt.context.app_name) + '.apk _builds/' + grunt.apkFilename(grunt.context.app_name); }
        },
        delete_apk_src: {
            options: {
                stdout: true
            },
            command: function() { return 'rm _builds/' + escapeShell(grunt.context.app_name) + '.apk'; }
        },
        android_copy_2_dev_builds_dir: {
            options: {
                stdout: true
            },
            command: function() { return 'cp _builds/' + grunt.apkFilename(grunt.context.app_name) + ' ' + grunt.dirs.dev_builds; }
        },
        android_copy_2_public_builds_dir: {
            options: {
                stdout: true
            },
            command: function() { return 'cp _builds/' + grunt.apkFilename(grunt.context.app_name) + ' ' + grunt.dirs.public_builds; }
        },
        ios_rename_ipa: {
            options: {
                stdout: true
            },
            command: function() { return 'mv _builds/' +  escapeShell(grunt.context.app_name) + '.ipa _builds/' + removeSpaces(grunt.context.app_name) + '.ipa '; }
        },
        ios_copy_2_dev_builds_dir: {
            options: {
                stdout: true
            },
            command: function() { return 'cp _builds/' +  removeSpaces(grunt.context.app_name) + '.ipa ' + grunt.dirs.dev_builds + '/' + grunt.ipaFilename(grunt.context.app_name); }
        },
        ios_copy_2_public_builds_dir: {
            options: {
                stdout: true
            },
            command: function() { return 'cp _builds/' +  removeSpaces(grunt.context.app_name) + '.ipa ' + grunt.dirs.public_builds + '/' + grunt.ipaFilename(grunt.context.app_name); }
        },
        "android_geny": {
            options: {
                stdout: false,
                execOptions: {
                    maxBuffer: 100000000
                }
            },
            command: function() { return 'ti build -p android --device-id "' + grunt.developer.simulators.android[grunt.option("device")] + '"'; }
        }
    };
};