import storage from "./utils/storage";
import sabitler from "./sabitler"

baslatici(document.getElementById("tblNotlarIDonem"))
baslatici(document.getElementById("tblNotlarIIDonem"))

function baslatici(donemTablo) {

    if (donemTablo != null) {

        let aktiveButon = document.createElement("button")
        aktiveButon.type = "button"
        aktiveButon.innerText = "Hesaplama Modülünü Etkinleştir"

        let abdiv = document.createElement("div")
        abdiv.style.textAlign = "right"

        aktiveButon.onclick = () => {
            aktiveButon.outerHTML = ""
            hesaplayici(donemTablo, abdiv)
        }

        abdiv.appendChild(aktiveButon)

        donemTablo.parentNode.insertBefore(abdiv, donemTablo.parentNode.childNodes[0])

    }

}

function precisionRound(number, precision = 0) {

    var factor = Math.pow(10, precision)
    return Math.round(number * factor) / factor

}

function hesaplayici(tablo, abdiv) {
    let tabloB = tablo.getElementsByTagName("tbody")[1]

    // let boslananlar: hesaplayıcı ile alakasız sütun indexleri
    let puanIndex = -1, muafIndex = -1, notIndex = -1,
        boslananlar = [], kutular = [], dersSaatler = [], dersIsimler = [],
        agirlikOrt = true

    // Bir satırın ortalamasını hesaplar.
    function satirHesap(satir) {

        let toplam = 0, adet = 0

        for (let i = 0; i < kutular[satir].length; i++) {

            if (i != puanIndex - 1 && i != muafIndex - 1 && kutular[satir][i].value.trim() && i != notIndex - 1 && boslananlar.indexOf(i + 1) == -1) {

                toplam += Number(kutular[satir][i].value)
                adet++

            }

        }

        return precisionRound(toplam / adet, 2)

    }

    // Yukarıda tanımlanan referansların değerleri tespit edilir.
    //   (vay anasını cümleye bak; alt tarafı e-okul eklentisisin sen, bu havalar nedir?)
    let baslikIndex = 1
    for (let j = 1; j < tabloB.children[baslikIndex].children.length; j++) {
        let elem = tabloB.children[baslikIndex].children[j]

        if (elem.innerText == "Puan")
            puanIndex = j + 1

        else if (elem.innerText == "Muaf")
            muafIndex = j + 1

        else if (elem.innerText == "Not")
            notIndex = j + 1

        else if (elem.innerText.indexOf("Ort.") != -1)
            boslananlar.push(j + 1)

    }

    let tabloYazi = document.createElement("td")
    tabloYazi.rowSpan = 2
    tabloYazi.innerText = "Haftalık Ders Saati\n(Lütfen giriniz)"
    tabloB.children[0].appendChild(tabloYazi)

    for (let i = 2; i < tabloB.children.length; i++) {

        if (tabloB.children[i].children[0].innerText.trim() == "") {

            tabloB.removeChild(tabloB.children[i])
            continue

        }

        let kutularSatir = [] // Satırdaki tüm inputlar

        dersIsimler.push(tabloB.children[i].children[0].innerText)

        for (let j = 1; j < tabloB.children[i].children.length; j++) {

            let girdi = document.createElement("input")

            let elem = tabloB.children[i].children[j]

            if (j == puanIndex || boslananlar.indexOf(j) != -1 || j == notIndex)
                girdi.disabled = true

            girdi.style.width = "40px"
            girdi.style.textAlign = "center"

            // Geçerli tablo elemanı eğer hesaplayıcı için gereksiz bir sütun değilse ve
            // muafiyet durumu varsa; elemanın metnini (notu) girdiye koy.
            if (boslananlar.indexOf(j) == -1 && elem.innerText != "-") {

                if (elem.innerText == "G" || elem.innerText == "K")
                    girdi.value = 0
                else
                    girdi.value = elem.innerText

            }

            // Geçerli bir sütun içerisindeysek...
            if (j != puanIndex && j != notIndex && boslananlar.indexOf(j) == -1) {

                // Ders muafiyet sütunundaysak, muafiyet için özel input işlevleri tanımlanır.
                if (j == muafIndex) {

                    girdi.onkeyup = event => {

                        if (event.target.value) {

                            for (let k = 0; k < kutular[i - 2].length; k++) {

                                let ko = k + 1
                                if (ko != puanIndex && ko != muafIndex && boslananlar.indexOf(ko) == -1 && ko != notIndex)
                                    kutular[i - 2][k].disabled = true

                            }

                            dersSaatler[i - 2].disabled = true

                        } else {

                            for (let k = 0; k < kutular[i - 2].length; k++) {

                                let ko = k + 1
                                if (ko != puanIndex && ko != muafIndex && boslananlar.indexOf(ko) == -1 && ko != notIndex)
                                    kutular[i - 2][k].disabled = false

                            }

                            if (agirlikOrt)
                                dersSaatler[i - 2].disabled = false

                        }

                    }

                    girdi.onclick = girdi.onkeyup

                }

                // Ders muafiyet sütununda değilsek, sıradan input işlevleri tanımlanır.
                else {

                    girdi.onkeyup = event => {

                        let girilen = Number(event.target.value)

                        if (isNaN(girilen) || girilen < 0 || girilen > 100)
                            alert("Hatalı bir girdi girdiniz. Not sadece 100 ile 0 arasındaki sayılardan oluşabilir.")

                        else {

                            let toplam = satirHesap(i - 2, kutular, puanIndex, muafIndex, notIndex, boslananlar)

                            if (puanIndex != -1) {

                                kutular[i - 2][puanIndex - 1].value = toplam

                                if (notIndex != -1) {

                                    let not
                                    if (toplam >= 85)
                                        not = 5
                                    else if (toplam >= 70)
                                        not = 4
                                    else if (toplam >= 60)
                                        not = 3
                                    else if (toplam >= 50)
                                        not = 2
                                    else
                                        not = 1

                                    kutular[i - 2][notIndex - 1].value = not

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

        kutular.push(kutularSatir)

        // Haftalık ders saati için girdi alanı ve işlevi oluşturulur.
        let saatGirdi = document.createElement("input")
        saatGirdi.style.textAlign = "center"
        saatGirdi.style.width = "60px"
        saatGirdi.onkeyup = saatGirdiOnKeyUp


        let saatTablo = document.createElement("td")
        saatTablo.style.backgroundColor = "black"
        saatTablo.appendChild(saatGirdi)

        tabloB.children[i].appendChild(saatTablo)

        dersSaatler.push(saatGirdi)

        kutularSatir[muafIndex - 1].click()

    }

    // Kaydedilmiş haftalık ders saatlerini girdilere yerleştirir.
    storage.get("dersler", alinan => {

        if (typeof alinan.dersler != "undefined") {

            Object.keys(alinan.dersler).forEach(dersKey => {

                dersSaatler[dersIsimler.indexOf(dersKey)].value = alinan.dersler[dersKey]

            })

        }

    })

    // Hesaplama butonu...
    let hesapButon = document.createElement("button")
    hesapButon.type = "button"
    hesapButon.innerText = "Ortalamayı Hesapla"
    hesapButon.style.textAlign = "center"
    hesapButon.style.width = "200px"
    hesapButon.onclick = () => {

        storage.get("notlar", alinan => {

            let gecerli = (typeof alinan.notlar == "undefined") ? sabitler.notlar : alinan.notlar

            let satirKredi = 0, toplamDersSaat = 0, mesaj = "", belgeDurum = true

            for (let i = 0; i < kutular.length; i++) {

                if (kutular[i][0].disabled == true) // Bir satırın etkin olup olmadığını bu şekilde tespit etmemeliyiz...
                    continue

                let dersSaati
                if (agirlikOrt) {

                    dersSaati = Number(dersSaatler[i].value)
                    if (isNaN(dersSaati) || dersSaati == 0) {

                        mesaj = `"${dersIsimler[i]}" adlı dersin haftalık ders saati değeri eksik veya yanlış girilmiş.`
                        break

                    }

                } else
                    dersSaati = 1

                let satirToplam = satirHesap(i, kutular, puanIndex, muafIndex, notIndex, boslananlar)

                satirKredi += satirToplam * dersSaati

                if (isNaN(satirKredi)) {

                    mesaj = `"${dersIsimler[i]}" adlı dersin girdilerinde hatalı bir not var. Not sadece 100 ile 0 arasındaki sayılardan oluşabilir.`
                    break

                }

                if (satirToplam < gecerli.gecmeNot)
                    belgeDurum = false

                toplamDersSaat += dersSaati

            }

            if (!mesaj) {

                if (toplamDersSaat == 0)
                    mesaj = "Tüm derslerden muaf olmanız ilginç..."

                else {

                    let sonuc = precisionRound(satirKredi / toplamDersSaat, 2)

                    mesaj = `Dönem sonu ortalamanız: ${sonuc}\n`

                    let belgeMesaj = ""
                    if (sonuc >= gecerli.takdirNot) {

                        if (belgeDurum)
                            belgeMesaj = 'Tebrikler, "Takdir Belgesi" almaya hak kazandınız.'
                        else
                            belgeMesaj = 'Ortalamanız "Takdir Belgesi" almanız için yeterli fakat zayıf dersiniz olduğundan dolayı alamıyorsunuz.'

                    } else if (sonuc >= gecerli.tesekkurNot) {

                        if (belgeDurum)
                            belgeMesaj = 'Tebrikler, "Teşekkür Belgesi" almaya hak kazandınız.'
                        else
                            belgeMesaj = 'Ortalamanız "Teşekkür Belgesi" almanız için yeterli fakat zayıf dersiniz olduğundan dolayı alamıyorsunuz.'

                    }

                    if (!belgeMesaj)
                        belgeMesaj = 'Dönemi herhangi bir belge almadan bitiriyorsunuz.'

                    mesaj += belgeMesaj

                }

            }

            alert(mesaj)

        })

    }

    tablo.style.textAlign = "center"
    tablo.appendChild(hesapButon)

    // Haftalık ders saatleri girdilerini etkin/edilgen hale getiren checkbox ve işlevlerini tanımlar.
    let checkBox = document.createElement("input")
    checkBox.type = "checkbox"
    checkBox.checked = true
    checkBox.onclick = event => {

        if (event.target.checked) {

            for (let i = 0; i < dersSaatler.length; i++) {

                // Eğer o satır muafiyet durumunda değilse o satırın ders saati girdisini etkinleştir.
                if (!kutular[i][muafIndex - 1].value.trim())
                    dersSaatler[i].disabled = false

            }

            agirlikOrt = true

        } else {

            dersSaatler.forEach(saat => {

                saat.disabled = true

            })

            agirlikOrt = false

        }

    }

    // Haftalık ders saatlerini kaydeden buton ve işlevlerini tanımlar.
    let kayitButon = document.createElement("button")
    kayitButon.type = "button"
    kayitButon.style.marginRight = "20px"
    kayitButon.innerText = "Haftalık Ders Saatlerini Kaydet"
    kayitButon.onclick = event => {

        let dersler = {}

        for (let i = 0; i < dersIsimler.length; i++)
            dersler[dersIsimler[i]] = dersSaatler[i].value

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

}

function saatGirdiOnKeyUp(event) {

    let girilen = event.target.value.trim()
    if (girilen) {

        girilen = Number(girilen)
        if (isNaN(girilen) || girilen < 0)
            alert("Hatalı bir girdi girdiniz. Ders saati sadece pozitif tam sayılardan oluşabilir.")

    }

}