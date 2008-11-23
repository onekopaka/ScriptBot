// Help
print("");
print("*NIX    - press ^C to force the program to end");
print("Windows - press ^C, then type 'y' to force end");
print("IRC     - use the quit command to close nicely\n");

// Create a new PircBot instance and start it up.
var core = createBot();

// Get the config file contents.
var config = JSON.parse(IO.readFile("config.txt"));
core.password = config.password || "";

// Load any plugins before be join IRC
if(config.plugins) {
	for(var i = 0; i < config.plugins.length; i++) {
		try {
			IO.include("plugins/" + config.plugins[i] + ".js");
		} catch(e) {
			print("'" + config.plugins[i] + "' failed to load with this error:");
			print(e);
		}
	}
}

// Connecting to the server sometimes fails.
try {
	if(!config.name) throw "Cannot connect to IRC, no bot name specified. Check config file.";
	if(!config.server) throw "Cannot connect to IRC, no server specified. Check config file.";
	if(!config.channels) throw "Cannot connect to IRC, no bot name listed. Check config file.";
	if(config.channels.length === 0) throw "Must specify at least one channel to join IRC. Check config file.";
	if(config.prefix) core.prefix = config.prefix;

	// Join IRC.
	core.initialize(config.name, config.server);

	// Join any specified channels.
	var keys = config.keys || [];
	for(var i = 0; i < config.channels.length; i++) {
		core.getBot().joinChannel(config.channels[i], keys[i] || "");
	}
} catch(e) {
	print(e);
	print("Program terminated.");
	System.exit(0); // Just in case.
}


