if(!Util) throw "util.js must be included first!";

/**
 * Creates a default Timer object.
 *
 * @class
 * Timer is a simplified timer object that makes it easier to handle timed tasks without
 * importing an Java classes directly. It offers simple ways to stop, start, and change
 * the function called when the timer is fired. The timer fires at the set interval.
 *
 * @version 0.2.1
 * @author AMcBain, 2008
 * @constructor
 */
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

	/**
	 * The interval of the timer in seconds; the amount of time between each call to {@link #onTimerFired}.
	 *
	 * @default 1
	 * @type number
	 */
	this.interval = 1;
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

	/**
	 * <code>true</code> if the timer is currently active, <code>false</code> otherwise.
	 *
	 * @default false
	 * @type boolean
	 */
	this.ticking = false;
	this.__defineGetter__("ticking", function() {
		if(timer) {
			return (Util.isTrue(timer.isRunning()))? true : false;
		}
		return (false);
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

	/**
	 * The function called when the timer fires (the timer's interval is up).
	 *
	 * @default undefined
	 * @type Function
	 */
	this.onTimerFired = undefined;
}