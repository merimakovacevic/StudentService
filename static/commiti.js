

tabela = null;

function kreiranjeTabele() {
    event.preventDefault();
    var mojDiv=document.getElementById("tabela-holder");
    tabela=new CommitTabela(mojDiv, document.getElementById('brojRedova').value);
    event.target.style.display = "none";
    document.getElementById("prikazi-sa-tabelom").style.display = null;
}

function obrisiTabelu() {
    document.getElementById("tabela-holder").innerHTML = "";
    document.getElementById("kreiranje-tabele").style.display = null;
    document.getElementById("prikazi-sa-tabelom").style.display = "none";
}

function dodajCommitUTabelu(event) {
    event.preventDefault();
    // event.target = forma koja je submittala

    // event.target.elements.brZadatka -> citav element za brZadatka (moze se proslijediti u validacija.js)

    if (tabela.dodajCommit(parseInt(event.target.elements.brZadatka.value), event.target.elements.url.value) == -1) {
        document.getElementById('poruka-dodavanja').innerHTML = "Greska pri dodavanju commita";
    } else {
        document.getElementById('poruka-dodavanja').innerHTML = "";
    }
}

function editujCommitUTabeli(event) {
    event.preventDefault();
    if (tabela.editujCommit(parseInt(event.target.elements.brZadatka.value),
                            parseInt(event.target.elements.brKolone.value),
                            event.target.elements.url.value) == -1) {
        document.getElementById('poruka-editovanja').innerHTML = "Greska pri editovanju commita";
    } else {
        document.getElementById('poruka-editovanja').innerHTML = "";
    }
}

function obrisiCommitUTabeli(event) {
    event.preventDefault();
    if (tabela.obrisiCommit(parseInt(event.target.elements.brZadatka.value),
                            parseInt(event.target.elements.brKolone.value)) == -1) {
        document.getElementById('poruka-brisanja').innerHTML = "Greska pri brisanju commita";
    } else {
        document.getElementById('poruka-brisanja').innerHTML = "";
    }
}