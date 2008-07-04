importClass(java.lang.System);

/**
 * A collection of items related to helping with input/output, as well as loading other script files.
 *
 * @namespace
 */
var IO = {
	separator: System.getProperty("path.separator") || ":",
	slash: System.getProperty("file.separator") || "/",
	path: System.getProperty("user.dir") || "./",
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