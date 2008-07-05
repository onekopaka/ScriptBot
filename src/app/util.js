/**
 * A collection of useful functions to handle various things or convert Java objects to JS equivalents.
 *
 * @namespace
 */
var Util = {

	/**
	 * Checks to see if a Java object is a Java boolean with the value "true",
	 * and returns a JavaScript boolean literal.Only guaranteed to work
	 * correctly for Java Boolean objects.
	 *
	 * @param {java.lang.Boolean} value The object to be checked.
	 * @returns a JavaScript boolean literal.
	 * @type boolean
	 */
	isTrue: function(value) {
		return (value+"" === "true");
	},

	/**
	 * Checks to see if a Java object represents the JavaScript value
	 * of undefined and returns a JavaScript boolean literal.Only
	 * guaranteed to work correctly for Java undefined objects.
	 *
	 * @param {Object} value The object to be checked.
	 * @returns a JavaScript boolean literal.
	 * @type boolean
	 */
	isUndefined: function(value) {
		return (value+"" === "undefined");
	},

	/**
	 * Converts a Java String-Object to a JavaScript string literal.
	 *
	 * @param {java.lang.String} value The object to be converted.
	 * @returns a JavaScript string literal.
	 * @type string
	 */
	toJsString: function(value) {
		return (value+"");
	},

	/**
	 * Verifies the submitted message is intended for the specified target.
	 *
	 * @param {string} target The target to be checked for.
	 * @param {string} message The message to be checked.
	 * @returns <code>true</code> if the message for the target, <code>false</code> otherwise.
	 */
	verifyTarget: function(target, message) {
		return ((message+"").match(new RegExp("^" + target + "\\W?\\s?")) != null);
	}
}