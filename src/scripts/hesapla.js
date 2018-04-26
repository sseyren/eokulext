import storage from "./utils/storage";

function baslatici(donemTablo){
    if (donemTablo != null) {
        let aktiveButon = document.createElement("button")
        aktiveButon.type = "button"
        aktiveButon.innerText = "Hesaplama Modülünü Etkinleştir"
        let abdiv = document.createElement("div")
        abdiv.style.textAlign = "right"
        aktiveButon.onclick = () => {
            aktiveButon.outerHTML = ""
            donemButon = hesaplayici(donemTablo, abdiv)
        }
        abdiv.appendChild(aktiveButon)
        donemTablo.parentNode.insertBefore(abdiv, donemTablo.parentNode.childNodes[0])
    }
}

baslatici(document.getElementById("tblNotlarIDonem"));
baslatici(document.getElementById("tblNotlarIIDonem"));

function precisionRound(number, precision = 0) {
    var factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
}

function hesaplayici(tablo, abdiv) {
    let tabloB = tablo.getElementsByTagName("tbody")[1]
    let puanIndex = -1, muafIndex = -1, notIndex = -1, boslananlar = []
    let kutular = [], dersSaatler = [], agirlikOrt = true, dersIsimler = []
    for (let i = 1; i < tabloB.children.length; i++) {
        if (tabloB.children[i].children[0].innerText != "") {
            if (i != 1) {
                dersIsimler.push(tabloB.children[i].children[0].innerText)
            }
            let kutularSatir = []
            for (let j = 1; j < tabloB.children[i].children.length; j++) {
                let elem = tabloB.children[i].children[j]
                if (i == 1) {
                    if (elem.innerText == "Puan") {
                        puanIndex = j
                    } else if (elem.innerText == "Muaf") {
                        muafIndex = j
                    } else if (elem.innerText == "Not") {
                        notIndex = j
                    } else if (elem.innerText.indexOf("Ort.") != -1) {
                        boslananlar.push(j)
                    }
                    continue
                }
                let girdi = document.createElement("input")
                if (j == puanIndex + 1 || boslananlar.indexOf(j - 1) != -1 || j == notIndex + 1) {
                    girdi.disabled = true
                }
                girdi.style.width = "40px"
                girdi.style.textAlign = "center"
                if (boslananlar.indexOf(j - 1) == -1) {
                    if (elem.innerText != "-") {
                        if (elem.innerText != "G" && elem.innerText != "K") {
                            girdi.value = elem.innerText
                        } else {
                            girdi.value = 0
                        }
                    }
                }
                if (j != puanIndex + 1 && j != notIndex + 1 && boslananlar.indexOf(j - 1) == -1) {
                    if (j == muafIndex + 1) {
                        girdi.onkeyup = event => {
                            if (event.target.value) {
                                for (let k = 0; k < kutular[i - 2].length; k++) {
                                    if (k != puanIndex && k != muafIndex && boslananlar.indexOf(k) == -1 && k != notIndex) {
                                        kutular[i - 2][k].disabled = true
                                    }
                                }
                                dersSaatler[i - 2].disabled = true
                            } else {
                                for (let k = 0; k < kutular[i - 2].length; k++) {
                                    if (k != puanIndex && k != muafIndex && boslananlar.indexOf(k) == -1 && k != notIndex) {
                                        kutular[i - 2][k].disabled = false
                                    }
                                }
                                if (agirlikOrt) {
                                    dersSaatler[i - 2].disabled = false
                                }
                            }
                        }
                        girdi.onclick = girdi.onkeyup
                    } else {
                        girdi.onkeyup = event => {
                            let girilen = Number(event.target.value)
                            if (isNaN(girilen) || girilen < 0 || girilen > 100) {
                                alert("Hatalı bir girdi girdiniz. Not sadece 100 ile 0 arasındaki sayılardan oluşabilir.")
                            } else {
                                let toplam = satirHesap(i - 2, kutular, puanIndex, muafIndex, notIndex, boslananlar)
                                if (puanIndex != -1) {
                                    kutular[i - 2][puanIndex].value = toplam
                                    if (notIndex != -1) {
                                        let not
                                        if (toplam >= 85) {
                                            not = 5
                                        } else if (toplam >= 70) {
                                            not = 4
                                        } else if (toplam >= 60) {
                                            not = 3
                                        } else if (toplam >= 50) {
                                            not = 2
                                        } else {
                                            not = 1
                                        }
                                        kutular[i - 2][notIndex].value = not
                                    }
                                }
                            }
                        }
                    }
                }
                kutularSatir.push(girdi)
                elem.innerHTML = ""
                elem.appendChild(girdi)
            }
            if (i != 1) {
                kutular.push(kutularSatir)
                let saatGirdi = document.createElement("input")
                saatGirdi.style.textAlign = "center"
                saatGirdi.style.width = "60px"
                saatGirdi.onkeyup = event => {
                    let girilen = event.target.value.trim()
                    if (girilen) {
                        girilen = Number(girilen)
                        if (isNaN(girilen) || girilen < 0) {
                            alert("Hatalı bir girdi girdiniz. Ders saati sadece pozitif tam sayılardan oluşabilir.")
                        }
                    }
                }
                let depoSorgu = storage.get("dersler", alinan => {
                    if (typeof alinan.dersler != "undefined"){
                        let derslerKeys = Object.keys(alinan.dersler)
                        for (let j = 0; j < derslerKeys.length; j++) {
                            if (tabloB.children[i].children[0].innerText == derslerKeys[j]){
                                saatGirdi.value = alinan.dersler[derslerKeys[j]]
                                break
                            }
                        }
                    }
                })
                let saatTablo = document.createElement("td")
                saatTablo.style.backgroundColor = "black"
                saatTablo.appendChild(saatGirdi)
                tabloB.children[i].appendChild(saatTablo)
                dersSaatler.push(saatGirdi)
                kutularSatir[muafIndex].click()
            } else {
                let tabloYazi = document.createElement("td")
                tabloYazi.rowSpan = 2
                tabloYazi.innerText = "Haftalık Ders Saati\n(Lütfen giriniz)"
                tabloB.children[i - 1].appendChild(tabloYazi)
            }
        } else {
            tabloB.removeChild(tabloB.children[i])
        }
    }
    let hesapButon = document.createElement("button")
    hesapButon.type = "button"
    hesapButon.innerText = "Ortalamayı Hesapla"
    hesapButon.style.textAlign = "center"
    hesapButon.style.width = "200px"
    tablo.style.textAlign = "center"
    tablo.appendChild(hesapButon)
    hesapButon.onclick = () => {
        let depoSorgu = storage.get("notlar", alinan => {
            let gecerli
            if (typeof alinan.notlar == "undefined") {
                gecerli = {
                    gecmeNot: 50,
                    takdirNot: 85,
                    tesekkurNot: 70
                }
            } else {
                gecerli = alinan.notlar
            }
            let satirKredi = 0
            let toplamDersSaat = 0
            let mesaj = ""
            let belgeDurum = true
            for (let i = 0; i < kutular.length; i++) {
                if (kutular[i][0].disabled == true) {
                    continue
                }
                let dersSaati
                if (agirlikOrt) {
                    dersSaati = Number(dersSaatler[i].value)
                    if (isNaN(dersSaati) || dersSaati == 0) {
                        mesaj = `"${tabloB.children[i + 2].children[0].innerText}" adlı dersin haftalık ders saati değeri eksik veya yanlış girilmiş.`
                        break
                    }
                } else {
                    dersSaati = 1
                }
                let satirToplam = satirHesap(i, kutular, puanIndex, muafIndex, notIndex, boslananlar)
                satirKredi += satirToplam * dersSaati
                if (isNaN(satirKredi)) {
                    mesaj = `"${tabloB.children[i + 2].children[0].innerText}" adlı dersin girdilerinde hatalı bir not var. Not sadece 100 ile 0 arasındaki sayılardan oluşabilir.`
                    break
                }
                if (satirToplam < gecerli.gecmeNot) {
                    belgeDurum = false
                }
                toplamDersSaat += dersSaati
            }
            if (!mesaj) {
                if (toplamDersSaat == 0) {
                    mesaj = "Tüm derslerden muaf olmanız ilginç..."
                } else {
                    let sonuc = precisionRound(satirKredi / toplamDersSaat, 2)
                    mesaj = `Dönem sonu ortalamanız: ${sonuc}\n`
                    let belgeMesaj = ""
                    if (sonuc >= gecerli.takdirNot) {
                        if (belgeDurum) {
                            belgeMesaj = 'Tebrikler, "Takdir Belgesi" almaya hak kazandınız.'
                        } else {
                            belgeMesaj = 'Ortalamanız "Takdir Belgesi" almanız için yeterli fakat zayıf dersiniz olduğundan dolayı alamıyorsunuz.'
                        }
                    } else if (sonuc >= gecerli.tesekkurNot) {
                        if (belgeDurum) {
                            belgeMesaj = 'Tebrikler, "Teşekkür Belgesi" almaya hak kazandınız.'
                        } else {
                            belgeMesaj = 'Ortalamanız "Teşekkür Belgesi" almanız için yeterli fakat zayıf dersiniz olduğundan dolayı alamıyorsunuz.'
                        }
                    }
                    if (!belgeMesaj) {
                        belgeMesaj = 'Dönemi herhangi bir belge almadan bitiriyorsunuz.'
                    }
                    mesaj += belgeMesaj
                }
            }
            alert(mesaj)
        })
    }
    let checkBox = document.createElement("input")
    checkBox.type = "checkbox"
    checkBox.checked = true
    checkBox.onclick = event => {
        if (event.target.checked) {
            for (let i = 0; i < dersSaatler.length; i++) {
                if (!kutular[i][muafIndex].value.trim()) {
                    dersSaatler[i].disabled = false
                }
            }
            agirlikOrt = true
        } else {
            dersSaatler.forEach(saat => {
                saat.disabled = true
            })
            agirlikOrt = false
        }
    }
    let kayitButon = document.createElement("button")
    kayitButon.type = "button"
    kayitButon.style.marginRight = "20px"
    kayitButon.innerText = "Haftalık Ders Saatlerini Kaydet"
    kayitButon.onclick = event => {
        let dersler = {}
        for (let i = 0; i < dersIsimler.length; i++) {
            dersler[dersIsimler[i]] = dersSaatler[i].value
        }
        storage.set({
            dersler: dersler
        }, () => {
            alert("Kayıt başarılı.")
        })
    }
    abdiv.appendChild(kayitButon)
    abdiv.appendChild(checkBox)
    let cbMetin = document.createElement("span")
    cbMetin.innerText = "Ağırlıklı Ortalama Hesabı"
    abdiv.appendChild(cbMetin)
    return hesapButon
}

function satirHesap(satir, kutular, puanIndex, muafIndex, notIndex, boslananlar) {
    let toplam = 0, adet = 0
    for (let i = 0; i < kutular[satir].length; i++) {
        if (i != puanIndex && i != muafIndex && kutular[satir][i].value.trim() && i != notIndex && boslananlar.indexOf(i) == -1) {
            toplam += Number(kutular[satir][i].value)
            adet++
        }
    }
    return precisionRound(toplam / adet, 2)
}