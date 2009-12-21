/*
Title: Scriptbot Lock script for learn.js
Version: 0.1.0.2009.12.20
Author: Joshua Merrell <joshuamerrell@gmail.com>
Licensed under GPL.
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

	if(msg.search("lock") > -1)
	{
		try {		
			var lookup = msg.substring(msg.indexOf("lock ")+5, msg.length).toLowerCase();
			lookup = lookup.replace(/[.?!]$/,"");
			var description = brain[lookup].replace("+islocked", "");
			bot.sendMessage(args[0], args[1] + ": " + lookup + " is " + description);
	
			if(args[1] != "Eggbertx" || args[1] != "onekopaka_laptop")
				{
				bot.sendMessage(args[0], "You do not have the permissions to lock this variable");
				}
			
			else {
				brain[lookup] = description+"islocked";
				IO.writeObject("brain", brain);
				
				bot.sendMessage(args[0], lookup+ " is locked.");
				
			}
		
		catch(e){
			bot.sendMessage(args[0], "Error: Variable does not exist");
			}
	}


	if(msg.search("unlock") > -1)
	{
		try {
					
			var lookup = msg.substring(msg.indexOf("unlock ")+7, msg.length).toLowerCase();
			lookup = lookup.replace(/[.?!]$/,"");
			var description = brain[lookup].replace("+islocked", "");
			bot.sendMessage(args[0], args[1] + ": " + lookup + " is " + description);
	
			if(args[1] != "Eggbertx" || args[1] != "onekopaka_laptop")
				{
				bot.sendMessage(args[0], "You do not have the permissions to lock this variable");
				}
			
			else {
				brain[lookup] = description;
				IO.writeObject("brain", brain);
				
				bot.sendMessage(args[0], lookup+ " is unlocked.");
				
			}
		
		catch(e){
			bot.sendMessage(args[0], "Error: Variable does not exist");
			}
	}



	return true;
}, "lock");

