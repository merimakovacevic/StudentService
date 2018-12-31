var GodineAjax = (function () {
    var konstruktor = function (divSadrzaj) {
        var ret = {
            osvjezi: function () {
                divSadrzaj.innerHTML = "";
                var request = new XMLHttpRequest();
                request.onreadystatechange = function() {
                    if (request.readyState == 4 && request.status == 200) {
                        // pretvaranje response-a iz stringa u Javascript objekat/array
                        var godine = JSON.parse(request.responseText);
                        var html = "";
                        for (var godina of godine) {
                            html +=  `
                                <div class="godina"> 
                                    <h4>${godina['nazivGod']}</h4>
                                    <div class="p">
                                        <h5>Naziv repozitorija vjezbe: </h5>${godina['nazivRepVje']}<br>
                                        <h5>Naziv repozitorija spirale: </h5>${godina['nazivRepSpi']}<br>
                                    </div>
                                </div>
                            `;
                        }
                        divSadrzaj.innerHTML = html;
                    }
                };
                request.open("GET", "/godine", true);
                request.send();
            }
        };

        // poziva se pri konstruktoru
        ret.osvjezi();
        return ret;
    }
    return konstruktor;
}());