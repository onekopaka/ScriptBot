/*
Title: Scriptbot Learning script
Version: 2.0.2.2009.12.24
Author: Joshua Merrell <joshuamerrell@gmail.com>
Contributors: Darren VanBuren <onekopaka@gmail.com>, Nareshkumar Rao A/L A Achutha Rao <inaresh.online@gmail.com>
Changes: Fixed a small bug with writing vars
*/
core.unregisterPlugin("learn");
var brain = {};
var tempBrain = {};
var perms = {};
perms = IO.readObject("perms");
if(IO.objectExists("brain")) 
{
	brain = IO.readObject("brain");
}
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	function writevar()
	{
		brain[tempBrain[0]] = tempBrain[1];
		IO.writeObject("brain", brain);
		var tempDescription = tempBrain[1];
		tempDescription = tempDescription.replace("+islocked", "");
		bot.sendMessage(args[0], "I now know that " + tempBrain[0] + " is " + tempDescription);
	}

	var msg = args[args.length-1];
	tempBrain[0] = msg.substring(0,msg.indexOf(" is")).toLowerCase();
	tempBrain[1] = msg.substring(msg.indexOf("is ")+3, msg.length);

	if(msg.search(" is ") > -1 && msg.indexOf("what is") <0 && msg.indexOf("who is ") <0 && args[1] != config.name)
	{
		if(brain[tempBrain[0]] == undefined)
		{
			writevar();
		}
		else if(brain[tempBrain[0]] != undefined && brain[tempBrain[0]].indexOf("+isLocked") < 0) //if its not locked
		{
			writevar();
		}

		else if(brain[tempBrain[0]] && brain[tempBrain[0]].indexOf("+isLocked") > 1) //if its there and locked
		{
			if(perms[args[1]] == undefined) //perms not accepted
			{
				bot.sendMessage(args[0], "You don't have the permissions to edit "+tempBrain[0]);
			}
			else if(perms[args[1]] == 0)
			{
				bot.sendMessage(args[0], "You don't have the permissions to edit "+tempBrain[0]);
			}
			else if(perms[args[1]] == 1)   // if there are perms
			{
				writevar();
			}
		}
	}
	else if(msg.indexOf("what is ") > -1)
	{
		try
		{
			var lookup = msg.substring(msg.indexOf("is ")+3, msg.length);
			lookup = lookup.replace(/[.?!]$/,"");
			var description = brain[lookup.toLowerCase()];
			description = description.replace("+isLocked", "")
			bot.sendMessage(args[0], args[1] + ": " + lookup + " is " + description);
		}
		catch(e)
		{
			bot.sendMessage(args[0], "I have no idea what " +lookup+ " is");
		}
	}

	else if(msg.indexOf("who is ") > -1)
	{
		try
		{
			var lookup = msg.substring(msg.indexOf("is ")+3, msg.length);
			lookup = lookup.replace(/[.?!]$/,"");
			var description = brain[lookup.toLowerCase()];
			description = description.replace("+isLocked", "");
			bot.sendMessage(args[0], args[1] + ": " + lookup + " is " + description);
		}
		catch(e)
		{
			bot.sendMessage(args[0], "I have no idea who " +lookup+ " is");
		}
	}
	return true;
}, "learn");

core.registerPluginInfo("learn", function(bot, event, args, priv) {
	bot.sendMessage(args[0], bot.prefix + "Used to write variables to brain, Usage: <prefix><var> is <key> to write to brain.js. <prefix>what/who is <var> to read from brain.js");
});

