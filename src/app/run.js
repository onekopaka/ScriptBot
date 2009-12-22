importClass(java.lang.System);

/**
 * A collection of items related to helping with input/output, as well as loading other script files.
 *
 * @author AMcBain, 2008
 * @since 2.0.1
 * @namespace
 */
var IO = {

	/**
	 * The line separator used by the system.
	 * @string
	 */
	lineBreak: System.getProperty("line.separator") || "\n",

	/**
	 * The path separator used by the system.
	 * @type string
	 */
	separator: System.getProperty("path.separator") || ":",

	/**
	 * Forward or backward slash depending on which OS the bot is being run.
	 * @type string
	 */
	slash: System.getProperty("file.separator") || "/",

	/**
	 * The path to the folder where the shell or bat file to start the bot was run.
	 * @type string
	 */
	path: System.getProperty("user.dir") || "./",

	/**
	 * Includes the given script file into the current runtime. An optional parameter describes whether the path is relative or absolute.
	 * @param {string} path The path to the file.
	 * @param {string} [relative] <code>true</code> if the path is relative to {@link #path}, <code>false</code> if the path is absolute.
	 */
	include: function(path, relative) {
		var error = false;
		if(relative || (relative === undefined)) {
			var fpath = this.path + path;
			if((new java.io.File(fpath)).exists()) {
				load(fpath);
			} else {
				error = fpath;
			}
		} else {
			if((new java.io.File(path)).exists()) {
				load(path);
			} else {
				error = path;
			}
		}
		if(error) {
			var err = new Error("IO.include: File does not exist!");
			err.lineNumber = 0;
			err.fileName = error;
			throw err;
		}
	}
}

if(IO.path.lastIndexOf(IO.slash) !== IO.path.length) {
	IO.path += IO.slash;
}

IO.include("app/io.js");
IO.include("app/JSON.js");
IO.include("app/util.js");
IO.include("app/timer.js");
IO.include("app/scriptbot.js");
IO.include("app/main.js");
