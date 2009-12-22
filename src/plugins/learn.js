/*
Title: Scriptbot Learning script
Version: 1.6.1.2009.12.20
Author: Joshua Merrell <joshuamerrell@gmail.com>
Contributors: Darren VanBuren <onekopaka@gmail.com>
Licensed under GPL.
*/
core.unregisterPlugin("learn");
var brain = {};
var tempBrain = {};


if(IO.objectExists("brain")) 
	{
	brain = IO.readObject("brain");
	}

core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {

	var msg = args[args.length-1];

	//take input with <variable> is <key>

	if(msg !== null && msg.length > 0 && msg.search(" is ") > -1 && msg.search("what is") <0 && args[1] != config.name)
	{

		tempBrain[0] = msg.substring(0,msg.indexOf(" is")).toLowerCase();
		tempBrain[1] = msg.substring(msg.indexOf("is ")+3, msg.length).toLowerCase();
		if(brain[tempBrain[0]].indexOf("+islocked") > 1 && args[1] != "Eggbertx")
		{
			if(perms[args[1]] !=1)
				{
				bot.sendMessage(args[0], "You don't have the permissions to edit "+tempbrain[0]);
				}
		}
		else
			{
			brain[tempBrain[0]] = tempBrain[1];
			IO.writeObject("brain", brain);
			//bot.sendMessage(args[0], "brain[tempBrain[0]] = " +brain[tempBrain[0]]); //for debugging 
			//bot.sendMessage(args[0], "brain[tempBrain[1]] = " +brain[tempBrain[1]]); //for debugging
			var tempDescription = tempBrain[1]
			tempDescription = tempDescription.replace("+islocked", "");
			bot.sendMessage(args[0], "I now know that " + tempBrain[0] + " is " + tempDescription);
			
			}
	
		}


	if(msg !== null && msg.length > 0 && msg.search("what is") > -1 && args[1] != config.name)
		{
		try
			{
			var lookup = msg.substring(msg.indexOf("is ")+3, msg.length).toLowerCase();
			lookup = lookup.replace(/[.?!]$/,"");
			var description = brain[lookup].replace("+islocked", "");
			bot.sendMessage(args[0], args[1] + ": " + lookup + " is " + description);
			
			}
		catch(e)
			{
			bot.sendMessage(args[0], "I have no idea what " +lookup+ " is");
			}
		}

	return true;
}, "learn");

core.registerPluginInfo("learn", function(bot, event, args, priv) {
	bot.sendMessage(args[0], bot.prefix + "Used to write variables to brain");
});

