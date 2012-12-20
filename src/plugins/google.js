/*
Title: Google Search Plugin
Last modified: 4/15/2012
Author: Joshua Merrell
*/

function replaceAll( str, from, to ) {
	var idx;
	try { idx = str.search( from );
	} catch(e) { idx = str.toString().indexOf(from)}
	while ( idx > -1 ) {
		str = str.replace( from, to );
		idx = str.indexOf( from );
	}
	return str;
}

core.unregisterPlugin("google");
core.registerPlugin(Event.MESSAGE, function(bot, event, args, priv) {
	var msg = args[args.length-1];
	var googleURL = "http://www.google.com/search?q=";
	if(msg.indexOf("google ") > -1) {
		var query = msg.substring(7,msg.length);
		query = replaceAll(query, " ","+");
		var results = IO.fetchURL(googleURL+query, false);
		var search_for = "<h3 class=\"r\"><a href=";
		results = results.substring(results.indexOf(search_for)+search_for.length,results.length);
		url=results.substring(1,results.indexOf('"',2));
		results = results.substring(results.indexOf(')">')+3,results.indexOf("</a>")).replace(/(<([^>]+)>)/ig,"");
		bot.sendMessage(args[0], results+" URL: "+url);
		return true;
	}
}, "google");
