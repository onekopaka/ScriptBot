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