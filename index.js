var { ToggleButton } = require("sdk/ui/button/toggle");
var { Hotkey } = require("sdk/hotkeys");
var panels = require("sdk/panel");
var self = require("sdk/self");
var tabs = require("sdk/tabs");

var button = ToggleButton({
	id: "commander",
	label: "Commander",
	icon: {
		"16": "./icon-16.png"
	},
	onChange: handleChange
});

var panel = panels.Panel({
	width: 180,
	height: 180,
	contentURL: self.data.url("panel.html"),
	contentScriptFile: self.data.url("panel.js"),
	onHide: handleHide
});

// Toggles 
function handleChange(state) {

	// If showing the panel then also send a message with tabs data
	// to the content script
	if (state.checked) {
		panel.show({
			position: button
		});

		// Make JSON of tabs
		var tabJSON = createTabJSON(tabs);
		panel.port.emit("tabs", tabJSON);

	} else {
		// This else button was added to allow closing with the same key command
		// ** WORKAROUND **

		// --> Should i make the button checked state false?
		panel.hide();
	}
}

function handleHide() {
	button.state('window', {checked: false});
	panel.hide();
}

var toggleHotKey = Hotkey({
	combo: "accel-y",
	onPress: function() {
		button.click();
	}
});

var hideHotKey = Hotkey({
	combo: "accel-shift-y",
	onPress: function() {
		handleHide();
	}
});

// Creates an array of JSON serializable data about the tab
// [{"tabID": "", "tabTitle": "", "tabURL": ""}]
function createTabJSON (tabs) {
	var tabJSON = Array();
	var str = String();
	var returnJSON = String();

	for (let tab of tabs) {
		str = '{';

		// Adding tabID
		str += '"tabID" : "' + tab.id + '"' + ',';
		// Adding tabTitle
		str += '"tabTitle" : "' + tab.title + '"' + ',';
		// Adding tabURL
		str += '"tabURL" : "' + tab.url + '"';

		str += '}';
		console.log("str : " + str);
		tabJSON.push(str);
	}
	console.log("tabJSON : [" + tabJSON + "]");
	returnJSON = '{ "tabs" : "[' + tabJSON + ']"}';
	console.log(returnJSON);
	return JSON.parse(returnJSON);

}