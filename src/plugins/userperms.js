/*
Title: Scriptbot user permissions script
Version: 1.4.0.2009.12.20
Author: Joshua Merrell <joshuamerrell@gmail.com>
Licensed under GPL.
*/

core.unregisterPlugin("userperms");
var perms = {};

if(IO.objectExists("perms")) 
	{
	perms = IO.readObject("perms");
	}
else
	{
	IO.writeObject("perms", perms);
	}

core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1];

	//give perms
	if(msg.search("giveperms ") > -1 && args[1] != config.name)
		{

		if(perms[args[1]] !=1)
			{
			bot.sendMessage(args[0], "You don't have the permissions to edit user permissions");
			}

		else
			{
			username = msg.substring(msg.indexOf("giveperms ")+10, msg.length);
			perms[username] = 1;
			IO.writeObject("perms", perms);
			bot.sendMessage(args[0], "The user " +username + " has been given permissions.");
			}
		}
	//no perms for username!!
	else if(msg.search("removeperms ") > -1 && args[1] != config.name)
		{
		if(perms[args[1]] !=1)
			{
			bot.sendMessage(args[0], "You don't have the permissions to edit user permissions");
			}

		else
			{
			username = msg.substring(msg.indexOf("giveperms ")+10, msg.length);
			perms[username] = 0;
			IO.writeObject("perms", perms);
			bot.sendMessage(args[0], username+ "'s permissions were removed.");
			}
		}

	//show perms
	if(msg.search("showperms") > -1)
		{
		try
			{
			username = msg.substring(msg.indexOf("showperms ")+10, msg.length);

			if(perms[args[1]] !=1)
				{
				bot.sendMessage(args[0], "The user " +username+ " has permissions.");
				}
			}
		catch(e)
			{
			bot.sendMessage(args[0], "The specified user does not exist or does not have permissions");
			}
		}

	return true;
}, "userperms");

core.registerPluginInfo("troutsaver", function(bot, event, args, priv) {
	bot.sendMessage(args[0], bot.prefix + "Restricts some users from edtiing the brain.js object");
});



