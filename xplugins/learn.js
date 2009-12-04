/*
Title: Scriptbot Learning script
Version: 1.1
Changes: It ignores messages from itself now
Author: Joshua Merrell <joshuamerrell@gmail.com>
Contributors: Darren VanBuren <onekopaka@gmail.com>
Licensed under GPL.

KNOWN BUGS: Currently, if there is no entry for a query, it says <query> is undefined instead of I have no idea what <query> is.
*/
core.unregisterPlugin("learn");
var brain = {};
var tempBrain = {};

if(IO.objectExists("brain")) {
			brain = IO.readObject("brain");
		}

core.registerUnrestrictedPlugin(Event.MESSAGE, function(bot, event, args, priv) {

	var msg = args[args.length-1];


	if(msg !== null && msg.length > 0 && msg.search(" is ") > -1 && msg.search("what is") <0 && args[1] != config.name)
	{

		tempBrain[0] = msg.substring(0,msg.indexOf(" is")).toLowerCase();
		tempBrain[1] = msg.substring(msg.indexOf("is ")+3, msg.length).toLowerCase();
		brain[tempBrain[0]] = tempBrain[1];
		//bot.sendMessage(args[0], "brain[0] = " +brain[0]);
		//bot.sendMessage(args[0], "brain[1] = " +brain[1]);
		bot.sendMessage(args[0], "I now know that " + tempBrain[0] + " is " + tempBrain[1]);
		IO.writeObject("brain", brain);

	}
	

	if(msg !== null && msg.length > 0 && msg.search("what is") > -1 && args[1] != config.name)
		{
			var lookup = msg.substring(msg.indexOf("is ")+3, msg.length).toLowerCase();
			if(lookup !== undefined && args[1] != config.name) {
				bot.sendMessage(args[0], args[1] + ": " + lookup + " is " + brain[lookup]);
			} else {
				bot.sendMessage("I have no idea what " + lookup + " is.");
			}
	}


	return true;
}, "learn");