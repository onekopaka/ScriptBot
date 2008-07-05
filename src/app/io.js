/**
 * Gets contents of the specified URL. An optional parameter determines the format of the returned data.
 *
 * @param {string} url The url/location to be fetched.
 * @param {boolean} [asLines] <code>true</code> returns the contents as a \n (new line) separated string, <code>false</code> to return the contents as an array of lines.
 * @returns A string or an Array containing the contents of the requested URL.
 */
IO.fetchURL = function(url, asLines) {
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
};