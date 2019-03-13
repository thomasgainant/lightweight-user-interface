chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({devMode: false}, function() {
	  
	});
});