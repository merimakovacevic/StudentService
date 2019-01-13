function listVjezbe() {
    let divSadrzaj = document.getElementById('sVjezbe')
    divSadrzaj.innerHTML = "";

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
        }
    };
    request.open("GET", "/godine", true);
    request.send();
}

function listZadaci() {
    let divSadrzaj = document.getElementById('sZadatak')
    let divSadrzajList = document.getElementById('listZadaci')
    divSadrzaj.innerHTML = "";
    divSadrzajList.innerHTML = ""

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState == 4 && request.status == 200) {
            var zadaci = JSON.parse(request.responseText);
            var html = "";
            var htmlList = "";
            for (var zadatak of zadaci) {
                html +=  `
                    <option value="${zadatak['id']}">${zadatak['naziv']}</option>
                `;
                htmlList +=  `
                    <li>${zadatak['naziv']}</li>
                `;
            }
            divSadrzaj.innerHTML = html;
            divSadrzajList.innerHTML = htmlList;
        }
    };
    request.open("GET", "/zadatak", true);
    request.send();
}

listVjezbe();
listGodine();
listZadaci();