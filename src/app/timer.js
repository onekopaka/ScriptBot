if(!Util) throw "util.js must be included first!";

Util.Timer = function() {
	var obj = this;
	var timer = null;
	try {
		timer = new Packages.javax.swing.Timer(1000,
			new java.awt.event.ActionListener({
				actionPerformed: function(event) {
					if(obj.onTimerFired) obj.onTimerFired();
				}
			}));
	} catch(e) {
		// Our fall back is that the variable timer is null.
	}

	this.__defineGetter__("interval", function() {
		if(timer) {
			return (timer.getDelay()/1000);
		}
		return (1);
	});
	this.__defineSetter__("interval", function(value) {
		if(timer && !isNaN(Number(value))) {
			timer.setDelay(Number(value)*1000);
			timer.setInitialDelay(timer.getDelay());
		}
		return (value);
	});

	this.__defineGetter__("ticking", function() {
		if(timer) {
			return (Util.isTrue(timer.isRunning()))? true : false;
		}
		return (0);
	});
	this.__defineSetter__("ticking", function(value) {
		if(typeof value === "boolean" || value instanceof Boolean) {
			if(timer) {
				if(Util.isTrue(timer.isRunning())) {
					timer.stop();
				} else {
					timer.start();
				}
			}
		}
		return (value);
	});
}