chrome.tabs.onUpdated.addListener((pageId, titleObject, pageObject) => {
    chrome.storage.local.get(['phone'], function(result) {
        console.log('background. onUpdated with phone: ' + result.phone);
        chrome.tabs.sendMessage(pageId, { text: result.phone })
    });
})