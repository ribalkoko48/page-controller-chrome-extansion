const inputEl = document.getElementById('browserInput');

chrome.storage.local.get(['phone'], function (result) {
    console.log('popup open with phone: ' + result.phone);
    inputEl.value = result.phone;
});

inputEl.addEventListener('input', ({target: {value}}) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        const messageObj = {text: value};

        chrome.tabs.sendMessage(tabs[0].id, messageObj)
    })

    chrome.storage.local.set({phone: value}, function () {
        console.log('popup change with phone: ' + value);
    });
});