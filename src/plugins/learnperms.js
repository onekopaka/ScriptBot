/*
Title: Scriptbot Lock script for learn.js
Version: 1.5.0.2009.12.23
Author: Joshua Merrell <joshuamerrell@gmail.com>
*/
core.unregisterPlugin("lock");
var brain = {};
var tempBrain = {};
if(IO.objectExists("brain")) 
{
	brain = IO.readObject("brain");
}
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {

	var msg = args[args.length-1];
	if(msg.search("lock") > -1 && msg.search("lock") < 1)
		{
		try
			{		
			var lookup = msg.substring(msg.indexOf("lock ")+5, msg.length).toLowerCase();
			lookup = lookup.replace(/[.?!]$/,"");
			var description = brain[lookup].replace("+isLocked", "");
				
			if(perms[args[1]] !=1)
				{
					bot.sendMessage(args[0], "You don't have the permissions to lock " +lookup);
				}
			
			else
				{
					brain[lookup] = description+"+isLocked";
					IO.writeObject("brain", brain);
					bot.sendMessage(args[0], lookup+ " is locked.");
				}
			}

		catch(e)
			{
				bot.sendMessage(args[0], "I have no idea what " +lookup+ " is");
			}
	}

	else if(msg.search("unlock") > -1)
	{
		try
		{		
			var lookup = msg.substring(msg.indexOf("unlock ")+7, msg.length).toLowerCase();
			lookup = lookup.replace(/[.?!]$/,"");
			var description = brain[lookup].replace("+isLocked", "");
			
			if(perms[args[1]] !=1)
			{
				bot.sendMessage(args[0], "You don't have the permissions to unlock " +lookup);
			}
			else
			{
				brain[lookup] = description;
				IO.writeObject("brain", brain);
				bot.sendMessage(args[0], lookup+ " is unlocked.");
			}
		}

		catch(e)
		{
			bot.sendMessage(args[0], "I have no idea what " +lookup+ " is");
		}
	}
	return true;
}, "lock");
core.registerPluginInfo("lock", function(bot, event, args, priv) {
	bot.sendMessage(args[0], bot.prefix + "Locks and unlocks variables in the brain object");
});


