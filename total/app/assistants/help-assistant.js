function HelpAssistant() {
}

HelpAssistant.prototype.setup = function() {
	document.getElementsByTagName("body")[0].style.backgroundImage = "url('images/bginfo.png') !important";
	document.getElementsByTagName("body")[0].style.backgroundRepeat = "repeat";
	this.controller.setupWidget(Mojo.Menu.appMenu,{ omitDefaultItems: true },{} );
}

HelpAssistant.prototype.activate = function(event) {
}

HelpAssistant.prototype.cleanup = function(event) {
	document.getElementsByTagName("body")[0].style.backgroundImage = "url('images/back.png') !important";
	document.getElementsByTagName("body")[0].style.backgroundRepeat = "np-repeat";
}