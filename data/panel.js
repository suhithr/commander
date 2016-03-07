function listTabs(tabs) {

	var tabList = "<ul>";
	for (let tab of tabs) {
		tab = JSON.stringify(tab);
		console.log(tab.keys);
		tabList += "<li>" + tab["tabTitle"] + "</li>";
	}
	tabList += "</ul>";

	document.getElementById("tab-list").innerHTML = tabList;
}

// Listen for message "show" from panel
// Then execute script
self.port.on("tabs", function(tabJSON) {
	console.log("To be made JSON : " + String(tabJSON["tabs"]));
	var tabs = JSON.parse(tabJSON["tabs"]);
	for (let tab of tabs) {
		console.log("tab :" + tab);
	}
	listTabs(tabs);
});