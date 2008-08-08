/**
 * Gets contents of the specified URL. An optional parameter determines the format of the returned data.
 *
 * @since 2.0.1
 * @param {string} url The url/location to be fetched.
 * @param {boolean} [asLines] <code>true</code> returns the contents as a \n (new line) separated string, <code>false</code> to return the contents as an array of lines.
 * @returns A string or an Array containing the contents of the requested URL.
 */
IO.fetchURL = function(url, asLines) {
	try {

		var link = new java.net.URL(url);
		var conn = link.openConnection();
		var reader = new java.io.BufferedReader(new java.io.InputStreamReader(conn.getInputStream()));
		var input = "";

		var line = "";
		var lines = [];

		while((input = reader.readLine()) != null) {
			if(asLines) {
				lines.push(input+"");
			} else {
				line += input + "\n";
			}
		}

		try {
			reader.close();
		} catch(e) {
			// Uhh ... what am I supposed to do with it?
		}

		return ((asLines)? lines : line);
	} catch(e) {
		throw (new Error(e+""));
	}
};

/**
 * Reads in the specified file. Optionally returns the contents as a string or an array of lines.
 *
 * @since 2.0.1
 * @param {string} path The path to the file.
 * @param {boolean} asLines <code>true</code> if the output should be returned as an array, <code>false</code> if as a string.
 * @returns <code>true</code> if the output should be returned as an array, <code>false</code> if as a string.
 */
IO.readFile = function(path, asLines) {
	var error = null;

	// Store the file temporarily.
	var lines = [];
	var out = "";
	var line = "";

	// Create a new file reader.
	var input = null;

	try {
		input = new java.io.BufferedReader(new java.io.FileReader(new java.io.File(filename)));

		do {
			// Read in the line from the file. 
			line = input.readLine();

			if(line != null) {
				// Add the line to our list.
				if(asLines) {
					lines.push(line);
				} else {
					out += line + "\n";
				}
			}
		} while(line != null);
	} catch (e) {
		print("There was an error reading the file.");
		error = e.toString() + "";
	} finally {
		try {
			// Try to close the file. It's a good idea and practice.
			input.close();
		} catch (E) {
			// We couldn't even close the file!?
			print("Cannot close file. There is no file to close.");
		}
	}

	if(error !== null) {
		throw (new Error(error));
	}

	return ((asLines)? lines : out);
};

/**
 * Writes the given contents to the specified path.
 *
 * @since 2.0.1
 * @param {string} path Path to the file to be written.
 * @param {string} contents The contents of the file to be written.
 * @param {boolean} [append] Whether to append the given contents instead of overwriting.
 */
IO.writeFile = function(path, contents, append) {
	var contents = contents;
	if(!(contents instanceof Array)) {
		contents = [contents];
	}

	// Append file contents?
	var apnd = (append)? true : false; // Make it a real boolean for Java.

	var out = null;
	var error = null;
	try {
		out = new java.io.PrintWriter(new java.io.BufferedWriter(new java.io.FileWriter(path, apnd)));
		//Write summary file. 
		for (var i = 0; i < contents.length; i++) {
			out.println(contents[i]);
		}
	} catch(e) {
		print("There was an error writing the file");
		error = e.toString() + "";
	} finally {
		try {
			out.close();
		} catch (E) {
			print("Cannot close file. There is no file to close.");
		}
	}

	if(error !== null) {
		throw (new Error(error));
	}
};

/**
 * Returns an object previously saved via {@link #writeObject}.
 *
 * @since 2.0.1
 * @returns an instance of the saved object if present; null if otherwise.
 * @type Object
 */
IO.readObject = function(name) {
	IO.include(IO.path + "plugins/data/" + name + ".js");
	var object = null;

	try {
		object = IOreadObjectLoadObect();
	} catch(e) {
		// We know.
	}

	return (object);
};

/**
 * The value of a "tab" in the data written by writeObject.
 *
 * @since 2.0.1
 * @default "   " (3 spaces)
 * @type string
 */
IO.tab = "   ";

/**
 * Writes the given object out to a file such that it can be read in via {@link #readObject}.
 * Similar to a "pretty printer" which formats an object so as to be easily viewed in the output window.
 *
 * @since 2.0.1
 * @param {string} name The name of the object to be saved, to be used when read back in.
 * @param {object} object The object to be saved.
 * @param {number} [depth] The recursive depth at which to stop writing out properites; Default is 10.
 * @param {number} [level] Used only by the algorithm itself.
 * @param {string} [tabin] Used only by the algorithm itself.
 */
IO.writeObject = function(name, object, depth, level, tabin) {
	var output = "";
	var first = false;
	var tabin = tabin;
	var depth = depth;
	var level = level;
	var primitives = {"string":true,"boolean":true,"number":true,};

	// Set default recursive depth.
	if(!depth) {
		depth = 10;
	}

	// Set default tab in length.
	if(!tabin) {
		tabin = IO.tab + IO.tab;
	}

	// If it is the first level, add function output.
	if(!level) {
		output += "function IOreadObjectLoadObject() {" + IO.lineBreak;
		output += "   return ({" + IO.lineBreak;
		level = 0;
		first = true;
	} else if(object instanceof Object) {
		output += "{" + IO.lineBreak;
	}

	// Handle function objects.
	function doFunction(object) {
		var lines = object.toString().split("\n");
		output += lines[1] + IO.lineBreak;

		// Iterate over the lines.
		for(var j = 2; j < lines.length - 2; j++) {
			output += tabin + lines[j] + IO.lineBreak;
		}

		output += tabin + lines[lines.length - 2] + "," + IO.lineBreak;
	}

	// Escape any rogue characters/sequences.
	// Original source from: http://www.json.org/json2.js, the exact code used here
	// is borrowed from the version shipping with Yahoo! Widget Engine 4.5.1 (http://widgets.yahoo.com)
	// which seems to have been optimized by someone. Both scripts are listed as public domain.
	// This reformated code, is not, it is subject to the license of ScriptBot.
	// See either link for a public domain verison.
	function escapeString(object) {

		// Don't, unless we have stuff to replace/escape.
		if(/[\x00-\x1f\\"]/.test(object)) {
			// Common escapes.
			var escapes = {"\b": "\\b", "\t": "\\t", "\n": "\\n", "\f": "\\f", "\r": "\\r", "\\": "\\\\", "\"": "\\\""};
			return (object.replace(/[\x00-\x1f\\"]/g, function(value) {
				if(escapes[value]) return (escapes[value]);
				var chr = value.charCodeAt();
				return ("\\u00" + Math.floor(chr/16).toString(16) + (chr % 16).toString(16));
			}));
		}
		return (object);
	}

	// Handle array objects.
	function doArray(object, inner) {
		output += ((inner)? IO.tab : "") + "[" + IO.lineBreak;

		// Iterate over the contents.
		for(var j = 0; j < object.length; j++) {

			// Handle primitives/literals.
			if(object[j] instanceof RegExp || primitives[typeof object[j].valueOf()]) {

				// Handle strings separately.
				if(typeof object[j].valueOf() === "string") {
					output += tabin + IO.tab + "\"" + escapeString(object[j].valueOf()) + "\"";
				} else {
					output += tabin + IO.tab + object[j].valueOf();
				}
			} else {
				output += tabin;

				// Handle Arrays and Functions separately.
				if(object[j] instanceof Array) {
					var oldtabin = tabin;
					tabin += IO.tab;
					doArray(object[j], true);
					tabin = oldtabin;
				} else if(object[j] instanceof Function) {
					output += IO.tab;
					var oldtabin = tabin;
					tabin += IO.tab;
					doFunction(object[j]);
					tabin = oldtabin;
				} else if(object[j] instanceof Object) {
					// Recurse on subobjects (rather than handle them all here)
					output += IO.tab + IO.writeObject(name, object[j], depth, ++level, tabin + IO.tab + IO.tab);
				}
			}

			// If it is an array, we don't want any extra commas and newlines. So skip this.
			if(!(object[j] instanceof Array || object[j] instanceof Function)) {

				// Output line-end unless last item.
				if(j < object.length - 1) {
					output += ",";
				}
				output += IO.lineBreak;
			}
		}
		output += tabin + "]," + IO.lineBreak;
	}

	// Loop through the object's properties.
	for(var i in object) {
		if(i !== "prototype") {

			output += tabin + "\"" + escapeString(i) + "\": ";
			var handled = false;

			try {
				// If a primitive, handle differently.
				if(object[i] instanceof RegExp || primitives[typeof object[i].valueOf()]) {

					// Handle strings separately.
					if(typeof object[i].valueOf() === "string") {
						output += "\"" + escapeString(object[i].valueOf()) + "\"";
					} else {
						output += object[i].valueOf();
					}
					output += "," + IO.lineBreak;
					handled = true;
				}
			} catch(e) {
				// We know. Java objects would fail this test.
			}

			// Handle Arrays
			if(level !== depth && object[i] instanceof Array) {
				doArray(object[i]);
				handled = true;
			}

			// Handle them differently. Their "pretty-printer" isn't good enough for us.
			if(!handled && object[i] instanceof Function && object.propertyIsEnumerable(i)) {
				doFunction(object[i]);
				handled = true;
			}

			// Handle everything else.
			if(!handled && level !== depth && object[i] instanceof Object) {
				output += IO.writeObject(name, object[i], depth, ++level, tabin + IO.tab);
			} else if(!handled) {
				var value = object[i].toString() + "";

				// Output objects that evaluate as booleans or numbers directly, and quote everything else.
				if(!isNaN(Number(value)) || value === "true" || value === "false") {
					output += value;
				} else {
					output += "\"" + escapeString(value) + "\"";
				}
				output += "," + IO.lineBreak;
			}
		}
	}

	// Fix last comma.

	output = output.replace(new RegExp("," + IO.lineBreak + "$"), IO.lineBreak);

	// Add the final function bits.
	if(first) {
		output += "   });" + IO.lineBreak;
		output += "}" + IO.lineBreak;

		// Create the data directory if it exists.
		if(!Util.isTrue((new java.io.File(IO.path + "plugins/data/")).exists())) {
			(new java.io.File(IO.path + "plugins/data/")).mkdir();
		}

		IO.writeFile(IO.path + "plugins/data/" + name + ".js", output);
	} else if(object instanceof Object) {
		output += tabin.replace(new RegExp(IO.tab + "$",""), "") + "}" + IO.lineBreak;
	}

	return (output);
};