const _apis = [ 'alarms', 'bookmarks', 'browserAction', 'commands', 'contextMenus', 'cookies', 'downloads', 'events', 'extension', 'extensionTypes', 'history', 'i18n', 'idle', 'notifications', 'pageAction', 'runtime', 'storage', 'tabs', 'webNavigation', 'webRequest', 'windows' ]

function _Extension () {
    const _this = this
    _apis.forEach(function (api) {
        _this[api] = null
        try { if (chrome[api]) { _this[api] = chrome[api] } } catch (e) {}
        try { if (window[api]) { _this[api] = window[api] } } catch (e) {}
        try { if (browser[api]) { _this[api] = browser[api] } } catch (e) {}
        try { _this.api = browser.extension[api] } catch (e) {}
    })
    try { if (browser && browser.runtime) { this.runtime = browser.runtime } } catch (e) {}
    try { if (browser && browser.browserAction) { this.browserAction = browser.browserAction } } catch (e) {}
}

const ext = new _Extension();
const storage = (ext.storage.sync ? ext.storage.sync : ext.storage.local);

let varsayilanlar = {
    gecmeNot: 50,
    takdirNot: 85,
    tesekkurNot: 70
}

function ayarlariKaydetForm(e) {
    ayarlariKaydet()
    e.preventDefault();
}

function ayarlariKaydet() {
    let gecmeNot = Number(document.querySelector("#gecmeNot").value)
    let takdirNot = Number(document.querySelector("#takdirNot").value)
    let tesekkurNot = Number(document.querySelector("#tesekkurNot").value)
    if (isNaN(gecmeNot) || gecmeNot < 0 || gecmeNot > 100) {
        alert('"Dersten geçme Notu" kısmında geçersiz bir girdi var. Notlar 0 ile 100 arasındaki sayılardan oluşabilir.')
    } else if (isNaN(takdirNot) || takdirNot < 0 || takdirNot > 100) {
        alert('"Geçme Notu" kısmında geçersiz bir girdi var. Notlar 0 ile 100 arasındaki sayılardan oluşabilir.')
    } else if (isNaN(gecmeNot) || gecmeNot < 0 || gecmeNot > 100) {
        alert('"Geçme Notu" kısmında geçersiz bir girdi var. Notlar 0 ile 100 arasındaki sayılardan oluşabilir.')
    } else {
        storage.set({
            notlar: {
                gecmeNot: gecmeNot,
                takdirNot: takdirNot,
                tesekkurNot: tesekkurNot
            }
        })
    }
}

function ayarlariYukle() {
    storage.get("notlar", alinan => {
        if (typeof alinan.notlar == "undefined") {
            document.querySelector("#gecmeNot").value = varsayilanlar.gecmeNot
            document.querySelector("#takdirNot").value = varsayilanlar.takdirNot
            document.querySelector("#tesekkurNot").value = varsayilanlar.tesekkurNot
        } else {
            document.querySelector("#gecmeNot").value = alinan.notlar.gecmeNot
            document.querySelector("#takdirNot").value = alinan.notlar.takdirNot
            document.querySelector("#tesekkurNot").value = alinan.notlar.tesekkurNot
        }
    })
}

function icerikYuklendi() {
    document.querySelector("#varsayilanButon").onclick = () => {
        document.querySelector("#gecmeNot").value = varsayilanlar.gecmeNot
        document.querySelector("#takdirNot").value = varsayilanlar.takdirNot
        document.querySelector("#tesekkurNot").value = varsayilanlar.tesekkurNot
        ayarlariKaydet()
    }
    document.querySelector("#dersSifirla").onclick = () => {
        storage.remove("dersler", () => {
            alert("Sıfırlama başarılı.")
        })
    }
    ayarlariYukle()
}

document.addEventListener("DOMContentLoaded", icerikYuklendi);
document.querySelector("form").addEventListener("submit", ayarlariKaydet);