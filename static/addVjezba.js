function listVjezbe() {
    let divSadrzaj = document.getElementById('sVjezbe')
    let divSadrzaj2 = document.getElementById('zadatakVjezbe')
    divSadrzaj.innerHTML = "";
    divSadrzaj2.innerHTML = "";

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var vjezbe = JSON.parse(request.responseText);
            var html = "";
            for (var vjezba of vjezbe) {
                html +=  `
                    <option value="${vjezba['id']}">${vjezba['naziv']}</option>
                `;
            }
            divSadrzaj.innerHTML = html;
            divSadrzaj2.innerHTML = html;
        }
    };
    request.open("GET", "/vjezbe", true);
    request.send();
}

function listGodine() {
    let divSadrzaj = document.getElementById('sGodine')
    let divSadrzaj2 = document.getElementById('sGodine2')
    divSadrzaj.innerHTML = "";
    divSadrzaj2.innerHTML = "";

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var godine = JSON.parse(request.responseText);
            var html = "";
            for (var godina of godine) {
                html +=  `
                    <option value="${godina['id']}">${godina['naziv']}</option>
                `;
            }
            divSadrzaj.innerHTML = html;
            divSadrzaj2.innerHTML = html;
            refreshZadatke();
        }
    };
    request.open("GET", "/godine", true);
    request.send();
}

function refreshZadatke() {
    let divSadrzaj = document.getElementById('listZadaci');
    let trenutnaVjezba = document.getElementById('zadatakVjezbe').value;
    let forma = document.getElementById('fPovezana').action = '/vjezba/' + trenutnaVjezba + '/zadatak';

    console.log(trenutnaVjezba);
    divSadrzaj.innerHTML = "";

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var zadaci = JSON.parse(request.responseText);
            var html = "";
            for (var zadatak of zadaci) {
                html +=  `
                    <option value="${zadatak['id']}">${zadatak['naziv']}</option>
                `;
            }
            divSadrzaj.innerHTML = html;
        }
    };
    request.open("GET", "/zadaci?bez="+trenutnaVjezba , true);
    request.setRequestHeader("accept", "application/json");
    request.send();
}

listVjezbe();
listGodine();