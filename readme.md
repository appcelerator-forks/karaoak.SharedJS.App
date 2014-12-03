# SharedJS Mobile Titanium Alloy App
Appcelerator Titanium 3.4+ Alloy 1.5+ on-device app.
	
###Setup insctructions
Apart from the npm dependencies, this project has a dependancy on the [SharedJS.Core](https://github.com/karaoak/SharedJS.Core) shared JS codebase project to be symlinked inside the app/lib/core directory of this project.

So setting up this project would require the following:

	$ npm install
	$ cd app/lib
	$ ln -s [hybrid-core]/src core (typically: $ ln -s ../../../core/src core)


###Build instructions
Either use the Ti CLI or the repository grunt tasks to build the app per platform.


### Documentation
Please find a list of the main SDKs and modules used in this project:

* [Titanium documentation](http://docs.appcelerator.com/titanium/latest/)
* [Alloy Framework](http://docs.appcelerator.com/titanium/latest/#!/guide/Alloy_Framework)
* [Andoid SDK](http://developer.android.com/sdk/index.html)






