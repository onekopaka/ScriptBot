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

		System.setProperty("http.agent", "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20120415 Firefox/13.0a2");
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
		input = new java.io.BufferedReader(new java.io.FileReader(new java.io.File(path)));

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
 * Checks if the given file exists.
 *
 * @since 2.0.3
 * @param {string} path The path to the file being checked.
 * @returns <code>true</code> if it exists, <code>false</code> otherwise.
 */
IO.fileExists = function(path) {
	return Util.isTrue((new java.io.File(path)).exists());
};

/**
 * Returns an object previously saved via {@link #writeObject}.
 *
 * @since 2.0.1
 * @param {string} name The name of the object to be read.
 * @param {Function} funct A function used to modify the returned result. Consult JSON documentation.
 * @returns an instance of the saved object if present; null if otherwise.
 * @type Object
 */
IO.readObject = function(name, funct) {
	var object = null;

	try {
		object = JSON.parse(IO.readFile(IO.path + "plugins/data/" + name + ".js"));
	} catch(e) {
		// We know.
	}

	return (object);
};

/**
 * Writes the given object out to a file such that it can be read in via {@link #readObject}.
 * Similar to a "pretty printer" which formats an object so as to be easily viewed in the output window.
 * Note that all primivites will be wrapped in an array for output.
 *
 * @since 2.0.1
 * @param {string} name The name of the object to be saved, to be used when read back in.
 * @param {object} object The object to be saved.
 * @param {Function} [funct] A function used to modify the output. Consult JSON documentation.
 * @param {string} [tabin] Used to specify the indentation used in output.
 */
IO.writeObject = function(name, object, funct, tabin) {

	// Create the data directory if it exists.
	if(!Util.isTrue((new java.io.File(IO.path + "plugins/data/")).exists())) {
		(new java.io.File(IO.path + "plugins/data/")).mkdir();
	}

	// Wrap non-objects, such as primitives.
	if(!(object instanceof Object)) {
		object = [object];
	}

	// Create and write the object.
	var output = "{}";
	try {
		output = JSON.stringify(object);
	} catch(e) {
		// We know.
	}
	IO.writeFile(IO.path + "plugins/data/" + name + ".js", output);
	return (output);
};

/**
 * Checks if the given object file exists.
 *
 * @since 2.0.3
 * @param {string} name The name of the object file being checked.
 * @returns <code>true</code> if it exists, <code>false</code> otherwise.
 */
IO.objectExists = function(name) {
	return Util.isTrue((new java.io.File(IO.path + "plugins/data/" + name + ".js")).exists());

};

/**
 * Lists the files and folders of a directory into an array
 *
 * @since 2.0.3
 * @param {string} path The folder or path to read
 */
IO.listDir = function(path) {
	path = path.replace("..", "");
	try {
		path = IO.path+path;
		var dir = new java.io.File(path);
		var children = dir.list();
		if (children != null) {
			for (i=0; i<children.length; i++) {
				child = new java.io.File(children[i]);
				if(child.isDirectory()) {
					children[i] = children[i]+"/";
				}
			}
		}
		return children;
	} catch(e) {
		print("Error path \""+path+"\" does not exist or cannot be read from");
	}
};
 
/**
 * Creates a directory or directory path
 *
 * @since 2.0.3
 * @param {string} path The folder or path that will be created
 */
IO.mkdir = function(path) {
	path = path.replace("..", "");
	path = IO.path+path;
	try{
		dir = new java.io.File(path);
		dir.mkdirs();
	} catch(e) {
		print("Error, could not create folder/folders at "+path);
	}
};