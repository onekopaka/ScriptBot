importClass(java.lang.System);

/**
 * A collection of items related to helping with input/output, as well as loading other script files.
 *
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
		if(relative || (relative === undefined)) {
			load(this.path + path);
		} else {
			load(path);
		}
	}
}

if(IO.path.lastIndexOf(IO.slash) !== IO.path.length) {
	IO.path += IO.slash;
}

IO.include("app/io.js");
IO.include("app/util.js");
IO.include("app/timer.js");
IO.include("app/scriptbot.js");
IO.include("app/main.js");