/**
 * Creates a default ScriptBotCore. To connect to IRC, see {@link #initialize}.
 *
 * @class
 * ScriptBotCore is intended to be a very basic core for a bot built via JavaScript.
 * The bot core provides simple system for managing plugins, and very few features.
 * This core is intended to be extended by the plugins, rather than having the features
 * directly tacked onto the bot.
 * <br><br>
 * If new features are added directly to the bot (because the "expense" of making them
 * plugins would not be worth it) any plugins that recieve information from this feature
 * should receive a JS object (not a Java object), even if it requires taking extra
 * steps to convert.
 *
 * @version 2.0.1
 * @author AMcBain, 2008
 * @constructor
 */
function ScriptBotCore() {

	/**
	 * A private variable containing a reference to the enclosing object.
	 *
	 * @private
	 * @type ScriptBotCore
	 */
	var obj = this;

	/**
	 * A private version of ScriptBotCore#ERROR.
	 *
	 * @ignore
	 * @private
	 * @type string
	 */
	const ERROR = "error";

	/**
	 * A public constant (read only) representing an error "source" in log messages.
	 *
	 * @type string
	 */
	this.ERROR = "*";
	this.__defineGetter__("ERROR", function() {
		return (ERROR);
	});

	/**
	 * A private version of ScriptBotCore#SERVER.
	 *
	 * @ignore
	 * @private
	 * @type string
	 */
	const SERVER = "*";

	/**
	 * A public constant (read only) representing the server in log messages.
	 *
	 * @type string
	 */
	this.SERVER = "*";
	this.__defineGetter__("SERVER", function() {
		return (SERVER);
	});


	/**
	 * Is PircBot based logging enabled?
	 *
	 * @private
	 * @type boolean
	 */
	var scriptLoggingEnabled = true;

	/**
	 * Sets whether or not to enabled this bot's own logging. Default is true.
	 * <br><br>
	 * For enabling or disabling PircBot based logging see {@link #setVerbose}.
	 *
	 * @since 2.0.1
	 * @see #setVerbose
	 * @param {boolean} value Whether or not to enable PircBot's logging.
	 */
	this.setScriptLoggingEnabled = function(value) {
		scriptLoggingEnabled = value;
	};

	/**
	 * Is PircBot based logging enabled?
	 *
	 * @private
	 * @type boolean
	 */
	var pircBotLoggingEnabled = false;

	/**
	 * Sets whether or not to enabled PircBot's included logging. Since this bot overwrites
	 * the function log, it must also keep track of logging-enabled status. Default is false.
	 * <br><br>
	 * For enabling or disabling ScriptBot based logging see {@link #setScriptLoggingEnabled}.
	 *
	 * @see #setScriptLoggingEnabled
	 * @param {boolean} value Whether or not to enable PircBot's logging.
	 */
	this.setVerbose = function(value) {
		pircBotLoggingEnabled = value;
	};

	/**
	 * Logs the given message to the console, optionally displaying the source of the message.
	 *
	 * @since 2.0.1
	 * @param {string} msg The message to be logged.
	 * @param {string} [source] Optionally, the source of the item logging this message.
	 * @param {boolean} [extraLine] Optionally print an extra new line after this log message.
	 */
	this.log = function(msg, source, extraLine) {
		if(source !== undefined) {
			if(scriptLoggingEnabled) {
				if(source === "") {
					print(msg + ((extraLine)? "\n" : ""));
				} else {
					print("[" + source + "]: " + msg + ((extraLine)? "\n" : ""));
				}
			}
		} else if(pircBotLoggingEnabled) {
			print(msg);
		}
	};

	// Internal shortcut. See ScriptBotCore#log for details.
	/**
	 * @ignore
	 */
	function log(msg, source, extraLine) {
		obj.log(msg, source, extraLine);
	}

	/**
	 * A private variable containing the current password of the bot.
	 *
	 * @private
	 * @type string
	 */
	var password = "";

	/**
	 * Sets the password to be used when this bot attempts to join a server.
	 *
	 * @param {string} value The new password for this bot.
	 */
	this.setPassword = function(value) {
		password = value;
	};

	/**
	 * Connects the bot with the specified name to the specified IRC server, and joins a
	 * default channel, if given. A password may also be supplied for registered nicks.
	 *
	 * @since 2.0.1
	 * @param {string} nick The nick used when the bot attempts to join IRC.
	 * @param {string} ircServer The server to which this bot will attempt to connect.
	 * @param {string} ircChannel The default channel to join after this bot successfully connects to IRC.
	 * @param {string} [password] Optionally the password for the given nick, if it is registered with services.
	 */
	this.initialize = function(nick, ircServer, ircChannel) {

		// Set the bot's nick, and login, and "real name."
		this.setName(nick);
		this.setLogin(nick);
		this.setVersion("@see http://oks.verymad.net/viewvc/ScriptBot/trunk/ for the latest source");

		// Hey, you've got to have a sense of humor.
		this.setFinger("I'm a bot. How could you possibly get any enjoyment out of poking me?");

		// Make sure that if our nick is in use, we can still connect.
		this.setAutoNickChange(true);

		try {
			// Log attempt.
			log("Attempting to join '" + ircServer + "'", SERVER);

			// Attempt to connect to the server.
			if(password === "") {
				this.connect(ircServer);
			} else {
				this.connect(ircServer, 6667, password);
			}

			log("Connection was successful.", SERVER, true);

			// After we connect, join the default channel.
			if(ircChannel) {
				this.joinChannel(ircChannel);
			}
		} catch (e) {
			// Display connection errors
			log("Couldn't connect to specified server.", ERROR);
			throw (new Error("IRC connection attempt failed with this message: " + e.getMessage()));
		};
	};

	// Disconnect from the server and close the program.
	/**
	 * Causes this bot instance to disconnect from the server immediately.
	 */
	this.exit = function() {
		log("Shutting down.");

		this.disconnect();
		System.exit(0);
	};


	/**
	 * A map of all currently registered unrestricted plugins.
	 *
	 * @private
	 * @type Object
	 */
	var unrestrictedHandlers = {};

	/**
	 * A map of all currently registered restricted plugins.
	 *
	 * @private
	 * @type Object
	 */
	var restrictedHandlers = {};

	/**
	 * A map of all currently registered restricted plugins.
	 *
	 * @private
	 * @type Object
	 */
	var informationHandlers = {};

	/**
	 * A function to be called if the information event was not handled.
	 *
	 * @private
	 * @default null
	 * @type Function
	 */
	var informationHandlers = null;

	/**
	 * Returns a list of all the names of the registered information handlers. This
	 * can be used as a general guide to the plugins installed in this bot. However,
	 * it is possible certain plugins did not register an information handler, in
	 * which case they cannot be returned by this function.
	 *
	 * @since 2.0.1
	 * @see #registerPluginInfo
	 * @returns A list of registered plugin information handlers' names.
	 * @type Array
	 */
	this.getPluginInformation = function() {
		var info = [];
		for(var i in informationHandlers) info.push(i);
		return (info);
	};

	/**
	 * Registers a restricted plugin for the speicifed event. Restricted plugins
	 * do not recieve the whole IRC line sent for some events, and may only be
	 * called if the the IRC line was intended for the bot.
	 *
	 * @since 2.0.1
	 * @see #unregisterPlugin
	 * @see #registerUrestrictedPlugin
	 * @see #registerPluginInfo
	 * @param {string} event The name of the event for which this handler is being registered.
	 * @param {Function} handler The function to be called when this event is fired.
	 * @param {string} [id] An optional id to be assigned to this plugin.
	 */
	this.registerPlugin = function(event, handler, id) {
		if(Event[event] === undefined) throw ("ScriptBotCore::registerPlugin - Invalid event type!");
		if(!(handler instanceof Function)) return;

		handler.id = id;
		if(restrictedHandlers[event] === undefined) restrictedHandlers[event] = [];
		restrictedHandlers[event].push(handler);
	};

	/**
	 * Registers an unrestricted plugin for the speicifed event. Restricted plugins
	 * do not recieve the whole IRC line sent for some events, and may only be
	 * called if the the IRC line was intended for the bot. Unrestricted plugins
	 * are called every time this event is fired and are sent the whole line.
	 *
	 * @since 2.0.1
	 * @see #unregisterPlugin
	 * @see #registerPlugin
	 * @see #registerPluginInfo
	 * @param {string} event The name of the event for which this handler is being registered.
	 * @param {Function} handler The function to be called when this event is fired.
	 * @param {string} [id] An optional id to be assigned to this plugin.
	 */
	this.registerUnrestrictedPlugin = function(event, handler, id) {
		if(Event[event] === undefined) throw ("ScriptBotCore::regsiterUnrestrictedPlugin - Invalid event type!");
		if(!(handler instanceof Function)) return;

		handler.id = id;
		if(unrestrictedHandlers[event] === undefined) unrestrictedHandlers[event] = [];
		unrestrictedHandlers[event].push(handler);
	};

	/**
	 * Registers a restricted plugin which is called if/when no other plugins handle
	 * the specified event. Only one plugin of this type can be registered per event.
	 *
	 * @since 2.0.1
	 * @see #unregisterUnhandledEventPlugin
	 * @param {string} event The name of the event for which this handler is being registered.
	 * @param {Function} handler The function to be called when this event is fired.
	 */
	this.registerUnhandledEventPlugin = function(event, handler) {
		if(Event[event] === undefined) throw ("ScriptBotCore::regsiterUnrestrictedPlugin - Invalid event type!");
		if(!(handler instanceof Function)) return;

		if(!restrictedHandlers[event]) restrictedHandlers[event] = [];
		restrictedHandlers[event]["unhandled"] = handler;
	};

	/**
	 * Registers a handler to be called when a user asks for information on a plugin or
	 * command to which a plugin may respond. Commands are case-sensitive.
	 *
	 * @since 2.0.1
	 * @see #registerPlugin
	 * @see #registerUrestrictedPlugin
	 * @param {string} plugin The name of the plugin for which this handler is being registered.
	 * @param {Function} handler The function to be called when this event is fired.
	 * @param {string} [id] An optional id to be assigned to this plugin.
	 */
	this.registerPluginInfo = function(plugin, handler, id) {
		if(Util.isUndefined(plugin) || Util.isUndefined(plugin)) return;
		if(!(handler instanceof Function)) return;

		handler.id = id;
		informationHandlers[plugin] = handler;
	};

	/**
	 * Registers a handler to be called when a no information handlers were called
	 * for a given information request.
	 *
	 * @since 2.0.1
	 * @see #registerPluginInfo
	 * @param {Function} handler The function to be called when this event is fired.
	 */
	this.registerUnhandledPluginInfo = function(handler) {
		if(!(handler instanceof Function)) return;

		unhandledInfoHandler = handler;
	};

	/**
	 * Unregisters a handler so it is no longer called on events. This removes all instances of
	 * the plugin it can find, and if an id is provided instead, all plugins and information
	 * entries with that id. Optionally, an array or string can be provided to aid in removal
	 * of information entries assotiated with this plugin, however this is ignored if an id is
	 * provided for the first argument. This entire process can be costly.
	 *
	 * @since 2.0.1
	 * @see #unregisterPluginByEvent
	 * @param {string/Function} plugin The handler or id of the plugin being removed.
	 * @param {string/Array} [info] An optional string or array specifying which information entries to also remove.
	 * @returns <code>true</code> if anything was unregsitered, <code>false</code> otherwise.
	 * @type boolean
	 */
	this.unregisterPlugin = function(plugin, info) {
		if(Util.isUndefined(plugin)) return;

		var somethingRemoved = false;

		// "remove" all associated plugins from unrestricted-handlers.
		for(var i in unrestrictedHandlers) {

			var keep = [];
			var event = unrestrictedHandlers[i];
			for(var i = 0; i < event.lenth; i++) {

				// Keep all good handlers (not the ones for which we're looking).
				if(!(event[i] == id || event[i].id == id)) {
					keep.push(event[i]);
				} else {
					somethingRemoved = true;
				}
			}

			// Truly remove items we got rid of above.
			unrestrictedHandlers[i] = keep;
		}

		// "remove" all associated plugins from restricted-handlers.
		for(var i in restrictedHandlers) {

			var keep = [];
			var event = restrictedHandlers[i];
			for(var i = 0; i < event.lenth; i++) {

				// Keep all good handlers (not the ones for which we're looking).
				if(!(event[i] == id || event[i].id == id)) {
					keep.push(event[i]);
				} else {
					somethingRemoved = true;
				}
			}

			// Truly remove items we got rid of above.
			keep["unhandled"] =  restrictedHandlers[i]["unhandled"];
			restrictedHandlers[i] = keep;
		}

		// If they provided a function instead of an id, process the info parameter.
		if(plugin instanceof Function) {

			// Convert non-arrays into arrays.
			if(!(info instanceof Array)) info = [info];

			// Remove all items in the array.
			for(var i = 0; i < info.length; i++) {
				if(informationHandlers[info[i]] !== undefined) somethingRemoved = true;
				delete informationHandlers[info[i]];
			}
		} else {
			var keep = [];

			// Remove all help entries with the specifiec id.
			for(var i in informationHandlers) {
				if(informationHandlers[i].id != plugin) {
					keep.push(informationHandlers[i]);
				} else {
					somethingRemoved = true;
				}
			}

			informationHandlers = keep;
		}

		return (somethingRemoved);
	};

	/**
	 * Unregisters a handler so it is no longer called for the specified event. This does not
	 * remove any associated help entries. Nothing is removed if no id or function is specified
	 * or they do not match an valid registered entries. This is less costly than
	 * {@link #unregisterPlugin}.
	 *
	 * @since 2.0.1
	 * @see #unregisterPlugin
	 * @param {string} plugin The name or id of the plugin being removed.
	 * @param {string/Function} id An function or id by which to determine what to remove.
	 * @param {boolean} Whether or not the plugin to be removed is unrestricted.
	 * @returns <code>true</code> if anything was unregsitered, <code>false</code> otherwise.
	 * @type boolean
	 */
	this.unregisterPluginByEvent = function(event, id, unrestricted) {
		if(Event[event] === undefined) throw ("ScriptBotCore::unregisterPluginByEvent - Invalid event type!");
		if(Util.isUndefined(event) || Util.isUndefined(id)) return;

		var keep = [];
		var somethingRemoved = false;

		// "remove" all associated plugins.
		var list = (Util.isTrue(unrestricted))? unrestrictedHandlers[event] : restrictedHandlers[event];
		if(list) {
			for(var i = 0; i < list.length; i++) {

				// Keep all good handlers (not the ones for which we're looking).
				if(!(list[i] == id || list[i].id == id)) {
					keep.push(list[i]);
				} else {
					somethingRemoved = true;
				}
			}
		}

		// Truly remove items we got rid of above.
		if(Util.isTrue(unrestricted)) {
			unrestrictedHandlers[event] = keep;
		} else if(restrictedHandlers[event]) {
			keep["unhandled"] = restrictedHandlers[event]["unhandled"];
			restrictedHandlers[event] = keep;
		}

		return (somethingRemoved);
	};

	/**
	 * Removes the unhandled-event listener called for the specified event.
	 *
	 * @since 2.0.1
	 * @see #registerUnhandledEventPlugin
	 * @param {string} event The name of the event for which this handler is being removed.
	 */
	this.unregisterUnhandledEventPlugin = function(event) {
		if(Event[event] === undefined) throw ("ScriptBotCore::unregisterUnhandledEventPlugin - Invalid event type!");
		if(Util.isUndefined(event)) return;

		delete restrictedHandlers[event]["unhandled"];
	};

	/**
	 * Unregisters a help entry so that it is no longer called.
	 *
	 * @since 2.0.1
	 * @see #registerPluginInfo
	 * @param {string} plugin The name or id of the plugin information being removed.
	 * @param {boolean} id <code>true</code> if the first parameter is an id, <code>false</code> otherwise.
	 * @returns <code>true</code> if anything was unregsitered, <code>false</code> otherwise.
	 * @type boolean
	 */
	this.unregisterPluginInfo = function(plugin, id) {
		if(Util.isUndefined(plugin)) return;

		var somethingRemoved = false;

		// Handle ids.
		if(Util.isTrue(id)) {
			var keep = [];

			// Remove all help entries with the specifiec id.
			for(var i in informationHandlers) {
				if(informationHandlers[i].id !== plugin) {
					keep.push(informationHandlers[i]);
				} else {
					somethingRemoved = true;
				}
			}

			informationHandlers = keep;
		} else {
			if(informationHandlers[plugin] !== undefined) somethingRemoved = true;
			delete informationHandler[plugin];
		}

		return (somethingRemoved);
	};


	/**
	 * Unregisters the function called when nothing handles an information request.
	 *
	 * @since 2.0.1
	 * @see #registerUnhandledPluginInfo
	 */
	this.unregisterUnhandledPluginInfo = function() {
		unhandledPluginHandler = null;
	};

	/**
	 * Fires the given event (type) with the following arguments (in an array).
	 *
	 * @since 2.0.1
	 * @param {string} type The name of the event.
	 * @param {Array} args The array parameters.
	 */
	this.fireEvent = function(type, args) {
		try {
			// Find all listeners registered for the event (if any)
			var functs = unrestrictedHandlers[type];
			if(functs !== undefined && functs.length > 0) {
				for(var i in functs) {
					// Re-fire the event, pass an empty array if no arguments.
					functs[i](this, type+"", args || []);
				}
			}

			// Has the event been handled?
			var handled = false;

			// Find all listeners registered for the event (if any)
			var functs = restrictedHandlers[type];
			if(functs !== undefined && functs.length > 0) {
				for(var i in functs) {
					if(i !== "unhandled") {
						// Re-fire the event, pass an empty array if no arguments.
						var value = functs[i](this, type+"", args || []);
						// Has the event been handled?
						if(!handled && value) handled = true;
					}
				}
			}

			// Call the unhandled event listener.
			if(!handled && functs !== undefined && functs["unhandled"]) functs["unhandled"](this, type+"", args || []);
		} catch(e) {
			if(e.lineNumber) {
				print(e.lineNumber + ":" + e);
			} else {
				print(e);
			}
		}
	};


	/**
	 * This is the main prefix to which the bot responds.
	 *
	 * @public
	 * @default "@"
	 * @type string
	 */
	var prefix = "@";
	this.__defineSetter__("prefix", function(value) {
		prefix = value;
		return (value);
	});
	this.__defineGetter__("prefix", function() {
		return (prefix);
	});


	/**
	 * An internal function to specially handle onMessage events.
	 *
	 * @since 2.0.1
	 * @param {string} type The name of the event.
	 * @param {Array} args The array parameters.
	 * @param {boolean} priv Whether this is a private message or not.
	 */
	this.fireMessageEvent = function(type, args, priv) {
		try {
			// Handle only message events.
			if(type == Event.MESSAGE || type == Event.PRIVATE_MESSAGE) {

				// Find all listeners registered for the event (if any)
				var functs = unrestrictedHandlers[type];
				if(functs !== undefined && functs.length > 0) {
					for(var i in functs) {
						// Re-fire the event, pass an empty array if no arguments.
						functs[i](this, type+"", args || []);
					}
				}

				// Convert our name to the prefix.
				if(args[args.length-1].indexOf(this.getNick()) === 0) {
					args[args.length-1] = args[args.length-1].replace(new RegExp("^" + this.getNick() + "\\W?\\s?"), obj.prefix);
				}

				// Process restricted items.
				if(args[args.length-1].indexOf(prefix) === 0) {

					// Remove prefix.
					args[args.length-1] = args[args.length-1].replace(new RegExp("^\\" + prefix), "");

					// Catch help/info commands.
					if(args[args.length-1].match(/^help\s*/) || args[args.length-1].match(/^info\s*/)) {
						args[args.length-1] = args[args.length-1].replace(/^help\s*/,"").replace(/^info\s*/,"");

						// Send to handler, if there is one.
						var handler = informationHandlers[args[args.length-1].split(/\s+/g)[0]];
						if(handler) {
							handler(this, type+"", args, priv);
						} else {
							var handled = false;
							if(!unhandledInfoHandler) {
								handled = handler(this, type+"", args, priv);
							}

							// Do the default action if they don't handle it.
							if(!handled) {
								var cmd = args[args.length-1].substring(0, Math.min(args[args.length-1].length, 20));
								if(args[args.length-1].length > 10) cmd += "...";
								this.sendMessage(args[0], "I could not find any information on '" + cmd + "', " + args[1]);
							}
								
						}
					} else {
						var handled = false;

						// Find all listeners registered for the event (if any)
						var functs = restrictedHandlers[type];
						if(functs !== undefined && functs.length > 0) {
							for(var i in functs) {
								if(i !== "unhandled") {
									// Re-fire the event, pass an empty array if no arguments.
									var value = functs[i](this, type+"", args || []);
									// Has the event been handled?
									if(!handled && value) handled = true;
								}
							}
						}

						// Call the unhandled event listener.
						if(!handled && functs !== undefined && functs["unhandled"]) functs["unhandled"](this, type+"", args || []);
					}
				}				
			}
		} catch(e) {
			if(e.lineNumber) {
				print(e.lineNumber + ":" + e);
			} else {
				print(e);
			}
		}
	}


	this.onAction = function(sender, login, hostname, target, action) {
		this.fireEvent(Event.ACTION, [sender+"", login+"", hostname+"", target+"", action+""]);
	}
	this.onChannelInfo = function(channel, userCount, topic) {
		this.fireEvent(Event.CHANNEL_INFO, [channel+"", userCount, topic+""]);
	}
	this.onConnect = function() {
		this.fireEvent(Event.CONNECT, []);
	}
	this.onDeop = function(channel, sourceNick, sourceLogin, sourceHostname, recipient) {
		this.fireEvent(Event.DEOP, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+"", recipient+""]);
	}
	this.onDeVoice = function(channel, sourceNick, sourceLogin, sourceHostname, recipient) {
		this.fireEvent(Event.DE_VOICE, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+"", recipient+""]);
	}
	this.onDisconnect = function() {
		this.fireEvent(Event.DISCONNECT, []);
	}
	this.onFinger = function(sourceNick, sourceLogin, sourceHostname, target) {
		//super.onFinger(sourceNick, sourceLogin, sourceHostname, target); // Doesn't work.
		this.fireEvent(Event.FINGER, [sourceNick+"", sourceLogin+"", sourceHostname+"", target+""]);
	}
	this.onInvite = function(targetNick, sourceNick, sourceLogin, sourceHostname, channel) {
		this.fireEvent(Event.INVITE, [targetNick+"", sourceNick+"", sourceLogin+"", sourceHostname+"", channel+""]);
	}
	this.onJoin = function(channel, sender, login, hostname) {
		this.fireEvent(Event.JOIN, [channel+"", sender+"", login+"", hostname+""]);
	}
	this.onKick = function(channel, kickerNick, kickerLogin, kickerHostname, recipientNick, reason) {
		this.fireEvent(Event.KICK, [channel+"", kickerNick+"", kickerLogin+"", kickerHostname+"", recipientNick+""]);
	}
	this.onMessage = function(channel, sender, login, hostname, message) {
		this.fireMessageEvent(Event.MESSAGE, [channel+"", sender+"", login+"", hostname+"", message+""], false);
	}
	this.onMode = function(channel, sourceNick, sourceLogin, sourceHostname, mode) {
		this.fireEvent(Event.MODE, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+"", mode+""]);
	}
	this.onNickChange = function(oldNick, login, hostname, newNick) {
		this.fireEvent(Event.NICK_CHANGE, [oldNick+"", login+"", hostname+"", newNick+""]);
	}
	this.onNotice = function(sourceNick, sourceLogin, sourceHostname, target, notice) {
		this.fireEvent(Event.NOTICE, [sourceNick+"", sourceLogin+"", sourceHostname+"", notice+""]);
	}
	this.onOp = function(channel, sourceNick, sourceLogin, sourceHostname, recipient) {
		this.fireEvent(Event.OP, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+"", recipient+""]);
	}
	this.onPart = function(channel, sender, login, hostname) {
		this.fireEvent(Event.PART, [channel+"", sender+"", login+"", hostname+""]);
	}
/*	this.onPart = function(channel, sender, login, hostname, message) {
		this.fireEvent(Event.PART, [channel+"", sender+"", login+"", hostname+"", message+""]);
	}*/
	this.onPing = function(sourceNick, sourceLogin, sourceHostname, target, pingValue) {
		//super.onPing = function(sourceNick, sourceLogin, sourceHostname, target, pingValue); // Doesn't work.
		this.fireEvent(Event.PING, [sourceNick+"", sourceLogin+"", sourceHostname+"", target+"", pingValue+""]);
	}
	this.onPrivateMessage = function(sender, login, hostname, message) {
		this.fireMessageEvent(Event.PRIVATE_MESSAGE, [sender+"", login+"", hostname+"", "@"+message+""], true);
	}
	this.onQuit = function(sourceNick, sourceLogin, sourceHostname, reason) {
		this.fireEvent(Event.QUIT, [sourceNick+"", sourceLogin+"", sourceHostname+"", reason+""]);
	}
	this.onRemoveChannelBan = function(channel, sourceNick, sourceLogin, sourceHostname, hostmask) {
		this.fireEvent(Event.CHANNEL_BAN_REMOVED, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+"", hostmask+""]);
	}
	this.onRemoveChannelKey = function(channel, sourceNick, sourceLogin, sourceHostname, key) {
		this.fireEvent(Event.CHANNEL_KEY_REMOVED, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+"", key+""]);
	}
	this.onRemoveChannelLimit = function(channel, sourceNick, sourceLogin, sourceHostname) {
		this.fireEvent(Event.CHANNEL_LIMIT_REMOVED, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+""]);
	}
	this.onRemoveInviteOnly = function(channel, sourceNick, sourceLogin, sourceHostname) {
		this.fireEvent(Event.INVITE_ONLY_REMOVED, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+""]);
	}
	this.onRemoveModerated = function(channel, sourceNick, sourceLogin, sourceHostname) {
		this.fireEvent(Event.MODERATED_REMOVED, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+""]);
	}
	this.onRemoveNoExternalMessages = function(channel, sourceNick, sourceLogin, sourceHostname) {
		this.fireEvent(Event.NO_EXTERNAL_MESSAGES_REMOVED, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+""]);
	}
	this.onRemovePrivate = function(channel, sourceNick, sourceLogin, sourceHostname) {
		this.fireEvent(Event.PRIVATE_REMOVED, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+""]);
	}
	this.onRemoveSecret = function(channel, sourceNick, sourceLogin, sourceHostname) {
		this.fireEvent(Event.SECRET_REMOVED, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+""]);
	}
	this.onRemoveTopicProtection = function(channel, sourceNick, sourceLogin, sourceHostname) {
		this.fireEvent(Event.TOPIC_PROTECTION_REMOVED, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+""]);
	}
	this.onServerResponse = function(code, response) {
		this.fireEvent(Event.SERVER_RESPONCE, [code+"", response+""]);
	}
	this.onSetChannelBan = function(channel, sourceNick, sourceLogin, sourceHostname, hostmask) {
		this.fireEvent(Event.SET_CHANNEL_BAN, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+""]);
	}
	this.onSetChannelKey = function(channel, sourceNick, sourceLogin, sourceHostname, key) {
		this.fireEvent(Event.SET_CHANNEL_KEY, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+"", key+""]);
	}
	this.onSetChannelLimit = function(channel, sourceNick, sourceLogin, sourceHostname, limit) {
		this.fireEvent(Event.SET_CHANNEL_LIMIT, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+"", limit]);
	}
	this.onSetInviteOnly = function(channel, sourceNick, sourceLogin, sourceHostname) {
		this.fireEvent(Event.SET_INVITE_ONLY, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+""]);
	}
	this.onSetModerated = function(channel, sourceNick, sourceLogin, sourceHostname) {
		this.fireEvent(Event.SET_MODERATED, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+""]);
	}
	this.onSetNoExternalMessages = function(channel, sourceNick, sourceLogin, sourceHostname) {
		this.fireEvent(Event.SET_NO_EXTERNAL_MESSAGES, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+""]);
	}
	this.onSetPrivate = function(channel, sourceNick, sourceLogin, sourceHostname) {
		this.fireEvent(Event.SET_PRIVATE, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+""]);
	}
	this.onSetSecret = function(channel, sourceNick, sourceLogin, sourceHostname) {
		this.fireEvent(Event.SET_SECRET, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+""]);
	}
	this.onSetTopicProtection = function(channel, sourceNick, sourceLogin, sourceHostname) {
		this.fireEvent(Event.SET_TOPIC_PROTECTION, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+""]);
	}
	this.onTime = function(sourceNick, sourceLogin, sourceHostname, target) {
		//super.onTime = function(sourceNick+"", sourceLogin+"", sourceHostname+"", target); // Doesn't work.
		this.fireEvent(Event.TIME, [sourceNick+"", sourceLogin+"", sourceHostname+"", target+""]);
	}
	this.onTopic = function(channel, topic, setBy, date, changed) {
		this.fireEvent(Event.TOPIC, [channel+"", topic+"", setBy+"", new Date(date), Util.isTrue(changed)]);
	}
	this.onUnknown = function(line) {
		this.fireEvent(Event.UNKNOWN, [line+""]);
	}
	this.onUserList = function(channel, users) {
		var args = [];
		for(var i = 0; i < users.length; i++) args.push(users[i]);
		this.fireEvent(Event.USER_LIST, [channel+"", args]);
	}
	this.onUserMode = function(targetNick, sourceNick, sourceLogin, sourceHostname, mode) {
		this.fireEvent(Event.USER_MODE, [sourceNick+"", sourceLogin+"", sourceHostname+"", mode+""]);
	}
	this.onVersion = function(sourceNick, sourceLogin, sourceHostname, target) {
		//super.onVersion(sourceNick, sourceLogin, sourceHostname, target); // Doesn't work.
		this.fireEvent(Event.VERSION, [sourceNick+"", sourceLogin+"", sourceHostname+"", target+""]);
	}
	this.onVoice = function(channel, sourceNick, sourceLogin, sourceHostname, recipient) {
		this.fireEvent(Event.VOICE, [channel+"", sourceNick+"", sourceLogin+"", sourceHostname+"", recipient+""]);
	}

}

/**
 * Creates a default BotAdatper.
 *
 * @class
 * This is an adapter object to work around Rhino not letting programmers have optional arguments on functions.
 * Rhino requires that all arguments be sent. This object, being all JS, and not a interface-object is not
 * subject to those requirements. This class <b>does not</b> implement all features of the class it is adapting.
 *
 * @version 2.0.1
 * @author AMcBain, 2008
 * @constructor
 * @param {ScriptBotCore} robot The ScriptBotCore being passed.
 */
function ScriptBotCoreAdapter(robot) {
	var bot = robot;

	/**
	 * @see ScriptBotCore#prefix
	 */
	this.prefix = "@";
	this.__defineSetter__("prefix", function(value) {
		bot.prefix = value;
		return (value);
	});
	this.__defineGetter__("prefix", function() {
		return (bot.prefix);
	});

	/**
	 * @see ScriptBotCore#setScriptLoggingEnabled
	 */
	this.setScriptLoggingEnabled = function(value) {
		return (bot.setScriptLoggingEnabled(value));
	};

	/**
	 * @see ScriptBotCore#setVerbose
	 */
	this.setVerbose = function(value) {
		return (bot.setVerbose(value));
	};

	/**
	 * @see ScriptBotCore#setPassword
	 */
	this.setPassword = function(value) {
		return (bot.setPassword(value));
	};

	/**
	 * @see ScriptBotCore#initialize
	 */
	this.initialize = function(nick, ircServer, ircChannel) {
		return (bot.initialize(nick, ircServer, ircChannel));
	};

	/**
	 * Returns the real ScriptBotCore instance.
	 *
	 * @returns The real ScriptBotCore instance.
	 * @type ScriptBotCore
	 */
	this.getBot = function() {
		return (bot);
	};

	/**
	 * @see ScriptBotCore#registerPlugin
	 */
	this.registerPlugin = function(event, handler, id) {
		return (bot.registerPlugin(event, handler, id));
	};

	/**
	 * @see ScriptBotCore#registerUnrestrictedPlugin
	 */
	this.registerUnrestrictedPlugin = function(event, handler, id) {
		return (bot.registerUnrestrictedPlugin(event, handler, id));
	};

	/**
	 * @see ScriptBotCore#registerUnhandledEventPlugin
	 */
	this.registerUnhandledEventPlugin = function(event, handler) {
		return (bot.registerUnhandledEventPlugin(event, handler));
	};

	/**
	 * @see ScriptBotCore#registerPluginInfo
	 */
	this.registerPluginInfo = function(plugin, handler, id) {
		return (bot.registerPluginInfo(plugin, handler, id));
	};

	/**
	 * @see ScriptBotCore#unregisterPlugin
	 */
	this.unregisterPlugin = function(plugin, info) {
		return (bot.unregisterPlugin(plugin, info));
	};

	/**
	 * @see ScriptBotCore#registerPlugin
	 */
	this.unregisterPluginByEvent = function(event, id, unrestricted) {
		return (bot.unregisterPluginByEvent(event, id, unrestricted));
	};

	/**
	 * @see ScriptBotCore#unregisterUnhandledEventPlugin
	 */
	this.unregisterUnhandledEventPlugin = function(event) {
		return (bot.unregisterUnhandledEventPlugin(event));
	};

	/**
	 * @see ScriptBotCore#unregisterPluginInfo
	 */
	this.unregisterPluginInfo = function(plugin, id) {
		return (bot.unregisterPlugin(plugin, id));
	};
}

/**
 * Holds all the event keys, which can be used for registering a plugin.
 *
 * @author AMcBain, 2008
 * @since 2.0.1
 * @namespace
 */
var Event = {
	/** Fired on action events. */
	ACTION: "ACTION",
	/** Fired on connection events. */
	CONNECT: "CONNECT",
	/** Fired when someone is deoped. */
	DEOP: "DEOP",
	/** Fired when someone is devoiced. */
	DE_VOICE: "DE_VOICE",
	/** Fired when the bot is disconnected. */
	DISCONNECT: "DISCONNECT",
	/** Fired when someone sends a CTCP FINGER to the bot. */
	FINGER: "FINGER",
	/** Fired when the bot is invited to a channel. */
	INVITE: "INVITE",
	/** Fired when someone joins a channel. */
	JOIN: "JOIN",
	/** Fired when someone is kicked. */
	KICK: "KICK",
	/** Fired when someone says something on a channel. */
	MESSAGE: "MESSAGE",
	/** Fired when a channel mode is changed. */
	MODE: "MODE",
	/** Fired when someone changes their nick. */
	NICK_CHANGE: "NICK_CHANGE",
	/** Fired when someone sends a notice to the bot. */
	NOTICE: "NOTICE",
	/** Fired when someone is opped. */
	OP: "OP",
	/** Fired when someone parts a channel. */
	PART: "PART",
	/** Fired when someone pings the bot. */
	PING: "PING",
	/** Fired when someone sends a private message to the bot. */
	PRIVATE_MESSAGE: "PRIVATE_MESSAGE",
	/** Fired when someone disconnects from the server. */
	QUIT: "QUIT",
	/** Fired when a channel ban is removed. */
	CHANNEL_BAN_REMOVED: "CHANNEL_BAN_REMOVED",
	/** Fired when a channel key is removed. */
	CHANNEL_KEY_REMOVED: "CHANNEL_KEY_REMOVED",
	/** Fired when channel information is received. */
	CHANNEL_INFO: "CHANNEL_INFO",
	/** Fired when a channel limit is removed. */
	CHANNEL_LIMIT_REMOVED: "CHANNEL_LIMIT_REMOVED",
	/** Fired when a channel is made invitation only. */
	INVITE_ONLY_REMOVED: "INVITE_ONLY_REMOVED",
	/** Fired when a channel removes moderation mode. */
	MODERATED_REMOVED: "MODERATED_REMOVED",
	/** Fired when a channel removes no-external-messages mode. */
	NO_EXTERNAL_MESSAGES_REMOVED: "NO_EXTERNAL_MESSAGES_REMOVED",
	/** Fired when a channel is no longer private. */
	PRIVATE_REMOVED: "PRIVATE_REMOVED",
	/** Fired when a channel is no longer secret. */
	SECRET_REMOVED: "SECRET_REMOVED",
	/** Fired when a channel removes topic protection. */
	TOPIC_PROTECTION_REMOVED: "TOPIC_PROTECTION_REMOVED",
	/** Fired when the bot receives a server response line. */
	SERVER_RESPONSE: "SERVER_RESPONSE",
	/** Fired when a channel bans someone. */
	SET_CHANNEL_BAN: "SET_CHANNEL_BAN",
	/** Fired when a channel sets a channel key. */
	SET_CHANNEL_KEY: "SET_CHANNEL_KEY",
	/** Fired when a channel limit is set. */
	SET_CHANNEL_LIMIT: "SET_CHANNEL_LIMIT",
	/** Fired when a channel is made invitation only. */
	SET_INVITE_ONLY: "SET_INVITE_ONLY",
	/** Fired when a channel is made moderater only. */
	SET_MODERATED: "SET_MODERATED",
	/** Fired when a channel no longer accepts external messages. */
	SET_NO_EXTERNAL_MESSAGES: "SET_NO_EXTERNAL_MESSAGES",
	/** Fired when a channel is made private. */
	SET_PRIVATE: "SET_PRIVATE",
	/** Fired when a channel is made secret. */
	SET_SECRET: "SET_SECRET",
	/** Fired when a channel sets topic protection. */
	SET_TOPIC_PROTECTION: "SET_TOPIC_PROTECTION",
	/** Fired when the bot receives a CTCP TIME command. */
	TIME: "TIME",
	/** Fired when the bot receives a channels topic. */
	TOPIC: "TOPIC",
	/** Fired when an unknown line is received. */
	UNKNOWN: "UNKNOWN",
	/** Fired when the bot receives a channel's user-list. */
	USER_LIST: "USER_LIST",
	/** Fired when a user mode is set. */
	USER_MODE: "USER_MODE",
	/** Fired when the bot receives a CTCP TIME commmand. */
	VERSION: "VERSION",
	/** Fired when someone is given voice. */
	VOICE: "VOICE"
}

/**
 * Creates and returns a new ScriptBot instance.
 * 
 * @since 2.0.1
 * @returns A new bot instance.
 * @type ScriptBotCore
 */
function createBot() {
	return (new ScriptBotCoreAdapter(new Packages.org.jibble.pircbot.PircBot(new ScriptBotCore())));
}

