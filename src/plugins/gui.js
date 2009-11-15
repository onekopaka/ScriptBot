/**************************************************
* A console for ScriptBot. It is extensible from  *
* inside its interface, meaning you don't need to *
* hack the code to add new features.              *
* Experiences with this may range anywhere from   *
* somewhat useful to the worst thing you've ever  *
* used.                                           *
*                                                 *
* Author: Jan B., license: CC-BY-SA               *
**************************************************/

function Console() {
	var $this = this;

	var frame = new Packages.javax.swing.JFrame("ScriptBot GUI");
	frame.setMinimumSize(new java.awt.Dimension(420, 300));

	if(config.console && (config.console.toLowerCase() === "exitonclose" || config.console.toLowerCase() === "exit_on_close" || config.console.toLowerCase() === "exit on close")) {
		frame.setDefaultCloseOperation(Packages.javax.swing.JFrame.EXIT_ON_CLOSE);
	}

	var panel = frame.getContentPane();
	panel.setLayout(new java.awt.BorderLayout(0,5));

	var area = new javax.swing.JTextArea();
	area.setFont(new java.awt.Font("MONOSPACED", java.awt.Font.PLAIN, area.getFont().getSize()));
	area.setWrapStyleWord(true);
	area.setEditable(false);
	area.setLineWrap(true);

	var scroll = new Packages.javax.swing.JScrollPane(area);
	var scrollbar = scroll.getVerticalScrollBar();
	panel.add(scroll, java.awt.BorderLayout.CENTER);

	var process = false;
	var current = "";
	var history = [];
	var level = -1;

	var input = new javax.swing.JTextField();
	input.addKeyListener(new java.awt.event.KeyAdapter() {
		keyPressed: function(event) {
			var keyCode = event.getKeyCode();
			process = true;

			if(keyCode === event.VK_UP) {
				if(level < history.length - 1) {
					++level;
				}
			} else if(keyCode === event.VK_DOWN) {
				if(level > -2) {
					level--;
				}
			} else if(keyCode === event.VK_HOME) {
				level = -1;
			} else if(keyCode === event.VK_END) {
				level = history.length - 1;
			} else {
				level = -1;
				process = false;
			}

			if(process) {
				if(level === -2) {
					input.setText("");
				} else if(level === -1 ) {
					input.setText(current);
				} else {
					input.setText(history[history.length - (level + 1)]);
				}
			}
		},
		keyReleased: function(event) {
			if(!process) {
				current = input.getText();
			}
		}
	});
	input.addActionListener(new java.awt.event.ActionListener() {
		actionPerformed: function(event) {
			var text = input.getText();
			var cmd = "";
			history.push(text);
			current = "";
			input.setText("");

			if(!Util.isTrue(text.isEmpty())) {

				if(text.startsWith("//")) {
					text = text.substring(0);
				} else if(text.startsWith("/")) {
					var space = text.indexOf(" ");
					if(space > 0) {
						cmd = text.substring(1, space);
						text = text.substring(space + 1);
					} else {
						cmd = text.substring(1);
						text = "";
					}
				}
				$this.handleLine(cmd + "", (text + "").replace(/^\s+/,""));

			}
		}
	});
	panel.add(input, java.awt.BorderLayout.SOUTH);

	frame.pack();
	frame.setLocationRelativeTo(null);
	frame.setVisible(true);
	input.requestFocus();

	this.print = function(text) {
		area.append(text + "\n");
		scrollbar.setValue(scrollbar.getMaximum());
	};

	this.log = function(text) {
		var date = new Date();
		var month = date.getMonth()+1;
		month = (month < 10)? "0" + month : month;
		var day = date.getDate();
		date = (date < 10)? "0" + date : date;
		var year = date.getFullYear()+"";
		year = year.substring(2);
		this.print(month + "/" + day + "/" + year + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + "." + date.getMilliseconds() + ":" + text);
	};

	var aliases = {};
	if(IO.objectExists("console")) {
		aliases = IO.readObject("console");
	}

	this.handleLine = function(cmd, text) {
		try {
			switch(cmd) {
			case "log":
				$this.log(eval(text));
				break;
			case "raw":
				core.getBot().sendRawLineViaQueue(text);
				break;
			case "alias":
				var space = text.indexOf(" ");
				if(space < 1) {
					this.print("Alias: not enoug arguments. 2 required");
					break;
				}
				var name = text.substring(0, space);
				text = text.substring(space + 1);
				aliases[name] = text;
				this.print("Alias '" + name + "' added");
				IO.writeObject("console", aliases);
				break;
			case "say":
				var space = text.indexOf(" ");
				var channel = text.substring(0, space);
				text = text.substring(space + 1);
				core.getBot().sendMessage(channel, text);
				this.print(channel + ": " + text);
				break;
			case "sayme":
				var space = text.indexOf(" ");
				var channel = text.substring(0, space);
				text = text.substring(space + 1);
				core.getBot().sendAction(channel, text);
				this.print(channel + ": " + core.getBot().getNick() + " " + text);
				break;
			case "hide":
				frame.dispose();
				break;
			case "nick":
				var name = core.getBot().getNick();
				core.getBot().sendRawLineViaQueue("NICK " + text);
				this.print("* " + name + " will be known as " + text + " shortly");
				break;
			case "list":
				var list = "Aliases: ";
				for(var i in aliases) {
					list += i + " ";
				}
				this.print(list);
				break;
			case "tell":
				var space = text.indexOf(" ");
				var channel = text.substring(0, space);
				var message = text.substring(space + 1);
				var login = core.getBot().getLogin();
				var sender = core.getBot().getNick();
				var hostname = core.getBot().getInetAddress().toString();
				core.getBot().onMessage(channel, sender, login, hostname, message);
				break;
			case "help":
				this.print("-------------------------------------------------------");
				this.print("--     Use UP/DOWN to move through input history     --");
				this.print("-- Use HOME and END to go the first and last entries --");
				this.print("--           /raw to send raw IRC commands           --");
				this.print("--           /log to log the given command           --");
				this.print("--  /tell sends a msg-event like in a normal channel --");
				this.print("--      /say to say a message in a given channel     --");
				this.print("--    /sayme to send an action in a given channel    --");
				this.print("--        /nick to change the bot's nickname         --");
				this.print("--            /alias to add new / commands           --");
				this.print("--             // escapes the first slash            --");
				this.print("-------------------------------------------------------");
				this.log("");
				break;
			default:
				var found = false;
				for(var c in aliases) {
					if(c === cmd) {
						var args = [];
						while(text.length > 0) {
							if(text.charAt(0) === "\"") {
								if(text.indexOf("\" ") > 0) {
									args.push(text.substring(0, text.indexOf("\" ") + 1));
									text = text.substring(text.indexOf("\" ") + 2);
								} else {
									args.push(text);
									text = "";
								}
							} else if(text.charAt(0) === "'") {
								if(text.indexOf("\' ") > 0) {
									args.push(text.substring(0, text.indexOf("' ") + 1));
									text = text.substring(text.indexOf("' ") + 2);
								} else {
									args.push(text);
									text = "";
								}
							} else {
								if(text.indexOf(" ") >= 0) {
									args.push(text.substring(0, text.indexOf(" ")));
									text = text.substring(text.indexOf(" ") + 1);
								} else {
									args.push(text);
									text = "";
								}
							}
						}
						var command = aliases[cmd];
						var index = -1;
						var i = 1;
						do {
							index = command.indexOf("$" + i);
							if(index >= 0) {
								command = command.replace(new RegExp("\\$" + i, "g"), args[i - 1]);
							}
							i++;
						} while(index >= 0);
						text = command;
						found = true;
						break;
					}
				}
				if(cmd === "" || found) {
					$this.print("=> " + eval(text));
				} else {
					$this.print("Command '" + cmd + "' not found");
				}
			}
		} catch(e) {
			$this.print("Error: " + e.message);
		}
	};

	this.handleLine("help");
}

var console = new Console();

