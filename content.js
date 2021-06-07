const userData_url = 'http://localhost:4002/api/path';
const ccmPortal_authPage_url = 'file:///C:/Users/ribal/OneDrive/Desktop/ssmPortal%20HTML/ccmPortalAuthPage.html';
const ccmPortal_mainPage_url = "http://localhost:4002/service-packages";

// css селекторы для элементов
const ssmPortal_mainPage_identification_selector = '[formcontrolname="identification"]';
const ssmPortal_mainPage_numberHistorySearch_selector = '[formcontrolname="numberHistorySearch"] input';
const ssmPortal_mainPage_accountNumber_selector = '[formcontrolname="accountNumber"]';
const ssmPortal_mainPage_agreementNumber_selector = '[formcontrolname="agreementNumber"]';
const ssmPortal_mainPage_inn_selector = '[formcontrolname="inn"]';
const ssmPortal_mainPage_kpp_selector = '[formcontrolname="kpp"]';
const ssmPortal_mainPage_name_selector = '[formcontrolname="name"]';
const ssmPortal_mainPage_ogrn_selector = '[formcontrolname="ogrn"]';
const ssmPortal_mainPage_birthDate_selector = '[formcontrolname="birthDate"]';
const ssmPortal_mainPage_identitySeries_selector = '[formcontrolname="identitySeries"]';
const ssmPortal_mainPage_identityNumber_selector = '[formcontrolname="identityNumber"]';

const waitElement = (selector) => new Promise((resolve) => {
    let waitTime = 5000;
    const element = document.querySelector(selector);

    const checkExist = setInterval(function () {
        if (waitTime <= 0) {
            clearInterval(checkExist);
            resolve(null);
        }
        if (waitTime > 0 && element) {
            clearInterval(checkExist);
            resolve(element);
        }
        waitTime -= 100;
    }, 100);
});

const clear_mainPage_form = () => {
    document.querySelector(ssmPortal_mainPage_identification_selector).value = '';
    document.querySelector(ssmPortal_mainPage_numberHistorySearch_selector).checked = false;
    document.querySelector(ssmPortal_mainPage_accountNumber_selector).value = '';
    document.querySelector(ssmPortal_mainPage_agreementNumber_selector).value = '';
    document.querySelector(ssmPortal_mainPage_inn_selector).value = '';
    document.querySelector(ssmPortal_mainPage_kpp_selector).value = '';
    document.querySelector(ssmPortal_mainPage_name_selector).value = '';
    document.querySelector(ssmPortal_mainPage_ogrn_selector).value = '';
    document.querySelector(ssmPortal_mainPage_birthDate_selector).value = '';
    document.querySelector(ssmPortal_mainPage_identitySeries_selector).value = '';
    document.querySelector(ssmPortal_mainPage_identityNumber_selector).value = '';
}

chrome.runtime.onMessage.addListener(async (message) => {
    const ccmPortalPhoneEl = await waitElement(ssmPortal_mainPage_identification_selector);

    if (ccmPortalPhoneEl) {
        clear_mainPage_form();
        ccmPortalPhoneEl.value = message.text;
    }
});

// страничка авторизации в ссм портале
if (window.location.href === ccmPortal_authPage_url) {
    fetch(userData_url)
        .then((response) => {
            return response.ok
                ? response.json()
                : [{ login: '', password: '' }];
        })
        .then((data) => {
            document.getElementById('login').value = data.login;
            document.getElementById('pwd').value = data.password;
            document.getElementById('enterBtn').click();
        });
}

// главная страничка ссм портала
if (window.location.href === ccmPortal_mainPage_url) {
    const contentWorker = async () => {
        const phoneEl = await waitElement(ssmPortal_mainPage_identification_selector);

        if (phoneEl) {
            chrome.storage.local.get(['phone'], function (result) {
                phoneEl.value = result.phone;
            });

            phoneEl.addEventListener('input', function (e) {
                chrome.storage.local.set({phone: e.target.value});
            });
        }
    };

    contentWorker();


    // прослушка, если номер поменялся в неактивной вкладке
    setInterval(() => {
        const phoneEl = document.querySelector(ssmPortal_mainPage_identification_selector);

        if (phoneEl && chrome?.storage?.local) {
            chrome.storage.local.get(['phone'], function (result) {
                if (phoneEl.value !== result.phone) {
                    clear_mainPage_form();
                    phoneEl.value = result.phone;
                }
            });
        }

    }, 1000);

}





