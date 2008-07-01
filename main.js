try {
	importClass(java.lang.System);
	importClass(Packages.org.jibble.pircbot.PircBot);
	importClass(java.lang.Thread);
	importClass(java.lang.Runnable);
	importClass(java.util.ArrayList);
	importPackage(java.net);
} catch (e) {
	print(e + "\n");
	throw "Runtime Exception: One of the necessary classes could not be imported.";
}

// Help
print("*NIX    - press ^C to force the program to end");
print("Windows - press ^C, then type 'y' then hit 'enter' to force end");
print("All     - say '$quit' in a channel the bot is in\n");

// Begin bot code
function MyBot() {
	// Total number of channels we are on, and what they are.
	var channels = new Array();
	var list = new ArrayList();

	// Prep for defining commands.
	var plugins = null;
	var pluginsHelp = null;

	// Set the users name, login string, and other miscellany.
	this.init = function() {
		this.setName("ScriptBot");
		this.setLogin("ScriptBot");
		this.setFinger("Shouldn't you have a glove on?");
		this.setVersion("ScriptBot trunk - http://oks.verymad.net/ScriptBot/");
		this.setAutoNickChange(true);

		// Set the server to connect to.
			var host = "irc.mozilla.org";

		// Attempt to connect.
		try {
			print("Attempting to join server " + host);
			this.connect(host);
			this.joinChannel("#bots");
			channels.push("#bots");
			print("Connection to " + host + " was successful.\n");
		} catch (e) {
			// Catch Connection Errors
			print(e + "\n");
			print("Couldn't connect to " + host + ".");
			throw "Couldn't connect. Try again.";
		};
	};

	// Define built in commands.
	var commands = {
		disconnect: function(bot, channel, sender, message) {
			bot.exit();
		},

		quit: function(bot, channel, sender, message) {
			bot.exit();
		},

		join: function(bot, channel, sender, message) {
			print("Asked to join: '" + message + "' by '" + sender + "'");
			try {
				// Try to join first:
				bot.joinChannel(message);
				// only add this to our channels list if we actually joined:
				channels.push(message);
			} catch(e) {
				// This is only if the channel contains strange characters.
				print("Joining '" + message + "' failed. Maybe '" + message + "' isn't a real channel.");
				bot.sendMessage(channel, sender + ": WTF? I couldn't join the channel '" + message + "'. Are you sure it is a real channel?");
			}
		},

		leave: function(bot, channel, sender, message) {
			// This can't fail. No sense to try and catch error.
			print("Asked to leave: '" + channel + "' by '" + sender + "'");
			bot.partChannel(channel);
			channels.splice(channels.indexOf(channel), 1);

			// If that was the last channel we were on, exit from server.
			if(!channels.length) {
				bot.exit();
			}
		},

		channels: function(bot, channel, sender, message) {
			if(channels.length > 1) {
				// Make last ", " a ", and " for good English.
				var list = channels.slice(0, -1).join(", ");
				list = list + ', and ' + channels[channels.length - 1];
				// Send out the list.
				bot.sendMessage(channel, sender + ": I am currenly a member of " + list + ".");
			} else {
				// Send out the list.
				bot.sendMessage(channel, sender + ": I am only a member of " + channels[0] + ".");
			}
		},

		eval: function(bot, channel, sender, message) {
			// New thread for this evaluation.
			var thread = new Thread(new Runnable({
				run: function() {
					if(message.indexOf("bot.") < 0) {

						// Allows print() to work inside evals ...
						function _print(value) {
							bot.sendMessage(channel, sender + ": " + value);
						}

						// In case we get a syntax error. Doesn't account
						// for commands that are intentionally malicious.
						try {
							// Start time.
							var time = System.currentTimeMillis();

							// Convert to JS string primitive. Evaluate it.
							var msg = eval(message.replace(/print\(/g, "_print(").substr(0));

							// Calculate execution time in seconds.
							print("Eval: time = " +
							((System.currentTimeMillis() - time) / 1000) +" seconds");

							// If there is no result, don't bother printing anything.
							if(msg !== undefined) {
								bot.sendMessage(channel, sender + ": " + msg);
							}
						} catch(e) {
							// Print error on channel and console.
							print(e);
							bot.sendMessage(channel, e);
						}
					} else {
						bot.sendMessage(channel, sender + ": WTF are you trying? You're not allowed to do that!");
					}
					list.remove(thread);
				}
			}));
			thread.start();
			list.add(thread);
		},

		kill: function(bot, channel, sender, message) {
			// fails. miserably.
			if(message.equals("all")) {
				for(var i = 0; i < list.size(); i++) {
					list.get(i).interrupt();
				}
				list.clear();
			}
		},
		
		weather: function(bot, channel, sender, message) {
			// EXPERIMENTAL!!!
			// ONLY GETS METAR REPORT. NO DECODING.
			/* Broken XMLHttpRequest version
			reportxhr = new XMLHttpRequest();
			reportxhr.open(GET, "ftp://tgftp.nws.noaa.gov/data/observations/metar/stations/" + message + ".txt", true);
			bot.sendMessage(channel, sender + ": " + reportxhr.responseText);*/
			/* Java & JavaScript blend, too much java.*/
			var metarreport = new URL("http://weather.noaa.gov/pub/data/observations/metar/stations/" + message + ".txt");
			/**
			*100% broken!
			* //Just here.
			*var metarrreporconnection = metarreport.openConnection();
			* //actually get the report
			*metarreportstream = new InputStreamReader(metarreport.getInputStream());
			*/
			//send said report
			bot.sendMessage(channel, sender + ": " + metarreport);
		},
		unload: function(bot, channel, sender, message) {

			// Remove the plugin if it exists.
			if(plugins !== null) {
				if(plugins[message] !== undefined) {
					delete plugins[message];
					delete pluginsHelp[message];
					bot.sendMessage(channel, sender + ": Plugin '"+message+"' unloaded successfully.");
				} else {
					bot.sendMessage(channel, sender + ": I do not have any loaded plugins with that name.");
				}
			} else {
				bot.sendMessage(channel, sender + ": I currently have no plugins to unload.");
			}
		},

		commands: function(bot, channel, sender, message) {

			// Get the names of all the built-in commands.
			var cmdStr = "Commands: ";
			for(var i in commands) {
				cmdStr += i + ", ";
			}
			cmdStr = cmdStr.substr(0, cmdStr.lastIndexOf(",")) + ".";

			// Get all the names of the plugins.
			var plgnStr = "Plugins: ";
			if(plugins !== null) {
				for(var i in plugins) {
					plgnStr += i + ", ";
				}
				plgnStr = plgnStr.substr(0, plgnStr.lastIndexOf(",")) + ".";
			} else {
				plgnStr = "I currently have no plugins loaded.";
			}

			bot.sendMessage(channel, sender + ": " +cmdStr);
			bot.sendMessage(channel, sender + ": " + plgnStr);
		},

		classicrock: function(bot, channel, sender, message) {
			
			//Check if we have the quotes already loaded, if not, load 'em up! Rawhide!!!
			if(classicrockquotes == undefined) {
				var classicrockquotes = [];
				// Money - Pink Floyd - Dark Side of the Moon
				classicrockquotes.push("I don't know, I was really drunk at the time.");
				classicrockquotes.push("Money, it's a hit. But don't give me that do goody good bullshit.");
				// Us and Them - Pink Floyd - Dark Side of the Moon
				classicrockquotes.push("You know they're gonna kill ya. So, like... if you give 'em a quick short, sharp shock, they don't do it again. Dig it? I mean he got off lightly, 'cos I could've given him a thrashing - I only hit him once! It was only a difference of right and wrong in it... I mean good manners don't cost nothing do they? 'Ey!");
				// Stairway to Heaven - Led Zepplin - Led Zepplin IV
				classicrockquotes.push("There's a lady who's sure all that glitters is gold, and she's buying a Stairway to Heaven.");
				// Hotel California - Eagles - Hotel California
				classicrockquotes.push("They stab it with their steely knifes, but they just can't kill the beast!");
				classicrockquotes.push("You can check out anytime you like, but you can never leave!");
			};
			var quote = classicrockquotes[Math.floor(Math.random()*classicrockquotes.length)];
			
			bot.sendMessage(channel, sender + ": '" + quote + "'");
		},
		
		help: function(bot, channel, sender, message) {

			// Search built-in commands for a match.
			var help = commandsHelp[message];

			// Only if it wasn't processed by a built-in command.
			if(plugins !== null && pluginsHelp !== null && help === undefined) {
				help = pluginsHelp[message];
			}

			// If there was no plugin/command specified, send back entry for help.
			if(message == "") {
				help = commandsHelp["help"];
			}

			// If there was an entry, display it. Otherwise tell them we didn't find anything.
			if(help !== undefined) {
				bot.sendMessage(channel, sender + ": " + help.toString());
			} else {
				bot.sendMessage(channel, sender + ": I'm sorry, I didn't find any help on that topic.");
			}
		},
		
		hello: function(bot, channel, sender, message) {
			
			bot.sendMessage(channel, "Hello " + sender + ", I am " + bot.getNick() + ", monitor of this installation. I am written in Javascript, and interpreted by Rhino, a Mozilla implementation of Javascript in Java. To list commands, simply say '$commands' or '" + bot.getNick() + ": commands', and I will list all of my commands.");
		}
	};
	// Help entries for built-in commands.
	var commandsHelp = {
		disconnect: "'disconnect' causes the bot to leave the server.",
		quit: "Please see the entry for 'disconnect.'",
		join: "'join <channel>' tells the bot to join <channel>. All channels must have proper '#'.",
		leave: "'leave' tells the bot to leave the current channel.",
		channels: "'channels' lists all the channels which the bot is currently a member of.",
		eval: "'eval <code>' evaluates <code> and returns the result. Use 'print(value)' to return intermediate results.",
		kill: "If passed the argument 'all', kill will terminate any still running evaluations.",
		unload: "'unload <name>' unloads a plugin called <name>. To prevent any more security holes than there already are, there is no 'load' command.",
		commands: "'commands' lists all currently recognized commands and plugins.",
		help: "'help <name>' lists the help entry for <name>, if any. For a list of commands, 'commands' does the trick.",
		load: "Currently, there is no load function. Expect this once we are able to import external JavaScript files.",
		weather: "Weather is the first thing to be implemented. We're working on it.",
		classicrock: "Sends you some famous classic rock quotes.",
		hello: "Self explanatory."
	};

	this.onMessage = function(channel, sender, login, hostname, message) {
		var key = "$";
		// Convert the java string to a js string to get replace taking a RegExp.
		// Err, why is there no trim() method on js strings? This is pretty horrible.
		message = String(message).replace(/^\s*(.*?)\s*$/, '$1');

		// TODO: tweak the exact whitespace and punctuation rules used here.
		if(message[0] === key) {
			// Accept both '$doit' and '$ doit'.
			message = message.substring(1).replace(/ ?/, '');
		} else {
			// Respond to "ournick: blah", "ournick, blah", and "ournick blah".
			var nickRe = new RegExp('^' + this.getNick() + '[,:]? ');
			if(message.match(nickRe)) {
				message = message.replace(nickRe, '');
			} else {
				// We are not being addressed. Bail.
				return;
			}
		}

		// Now chomp off the command name:
		var index = message.indexOf(' ');
		var token;
		if(index === -1) {
			token = message;
			message = '';
		} else {
			token = message.slice(0, index);
			message = message.slice(index + 1);
		}

		// Search built-in commands for a match.
		var cmd = commands[token];
		var err = "Command";

		// Search plugins if there are no built in commands with the requested name.
		if(cmd === undefined) {
			cmd = plugins[token];
			err = "Plugin";
		}

		// If there was a command with that name, pass it stuff. Otherwise report not found.
		if(cmd !== undefined) {
			// Safety.
			try {
				// Execute (convert Java Strings to JS strings)
				cmd(this, channel + "", sender + "", message + "");
			} catch(e) {
				// Log error in both places.
				this.sendMessage(channel, err + " failed. (error)");
				print(err + " '" + token + "': " + e);
			}
		} else {
			this.sendMessage(channel, sender + ": I'm sorry, I don't recognize that command.");
		}
	};

	// Disconnect from the server and close the program.
	this.exit = function() {
		print("Shutting down."); // Log

		this.disconnect();
		System.exit(0);
	};

	// Allow users to set their own commands.
	this.setCommands = function(value) {
		plugins = value;
	};

	// Allow users to set their own command's help entries.
	this.setCommandsHelp = function(value) {
		pluginsHelp = value;
	};
}

// Create a new PircBot instance and start it up.
var bot = new PircBot(new MyBot());

// Connecting to the server sometimes fails.
try {
	bot.init();
} catch(e) {
	print("Connection to " + host + "failed. Program terminated.");
	System.exit(0); // Just in case.
}

/**
 * User defined stuff. This is where you can set bot properties or other items
 * without changing the source above. Neat!
 */

function rps(bot, channel, message, sender) {
	var choice = Math.floor(Math.random()*3);
	message = message.valueOf();
	var win = true;
	var hand = "";
	switch(choice) {
		case 0:
			hand = "rock";
			if(message == "paper")
				win = false;
			break;
		case 1:
			hand = "paper";
			if(message == "scissors")
				win = false;
			break;
		case 2:
			hand = "scissors";
			if(message == "rock")
				win = false;
	}
	if(message == hand) {
		bot.sendMessage(channel, sender + ": " + hand + ". We tied.");
	} else if(win) {
		bot.sendMessage(channel, sender + ": " + hand + ". Ha, ha! I win. =-)");
	} else {
		bot.sendMessage(channel, sender + ": " + hand + ". Oh no! I lose. =-(");
	}
}

// Add our own user-defined commands. :)
bot.setCommands({
	time: function(bot, channel, sender, message) {
		bot.sendMessage(channel, sender + ": " + new Date());
	},

	echo: function(bot, channel, sender, message) {
		bot.sendMessage(channel, sender + ": " + message);
	},

	slap: function(bot, channel, sender, message) {
		bot.sendAction(channel, "slaps " + message + " upside the head.");
	},
	say: function(bot, channel, sender, message) {
		var msg = message.split("\\s+to\\s+");
		if(msg.length > 1) {
			msg[1] = msg[1].replace("me", sender);
			bot.sendMessage(channel, msg[0] + ", "	+ msg[1]);
		} else {
			bot.sendMessage(channel, msg[0]);
		}
	},
	die: function(bot, channel, sender, message) {
		bot.sendMessage(channel, sender + ": You wish!");
	},
	rock: function(bot, channel, sender, message) {
		rps(bot, channel, "rock", sender);
	},
	paper: function(bot, channel, sender, message) {
		rps(bot, channel, "paper", sender);
	},
	scissors: function(bot, channel, sender, message) {
		rps(bot, channel, "scissors", sender);
	}
});
// Add our help entries.
bot.setCommandsHelp({
	time: "'time' returns the current time based on the bot's current timezone.",
	echo: "Call 'echo <stuff>' and the bot repeats <stuff> back to you.",
	slap: "Don't you just feel like slapping someone today?",
	bot: "Syntax 'say <stuff> to <nick>'",
	die: "Kill you? Okay. *bang*",
	rock: "Chooses 'rock' in a game of rock-paper-scissors.",
	paper: "Chooses 'paper' in a game of rock-paper-scissors.",
	scissors: "Chooses 'scissors' in a game of rock-paper-scissors."
});
