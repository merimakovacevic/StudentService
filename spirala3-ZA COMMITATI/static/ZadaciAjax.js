var ZadaciAjax = (function () {
    var konstruktor = function (callbackFn) {
        return {
            dajXML: function () {
                this.doCall('application/xml');
            },
            dajCSV: function () {
                this.doCall('text/csv');
            },
            dajJSON: function () {
                this.doCall('application/json');
            },

            doCall: function(type) {
                if (this.trenutniHttpPoziv != undefined) {
                    callbackFn({greska: "Već ste uputili zahtjev"});
                    return;
                }

                var request =  new XMLHttpRequest();
                this.trenutniHttpPoziv = request;

                // () =>   da bi "this" ostalo isto kao u prethodnoj funkciji
                request.onreadystatechange = () => {
                    if (request.readyState == 4) {
                        this.trenutniHttpPoziv = undefined;

                        if (request.status == 200) {
                            callbackFn(request.response);
                        }
                    }

                }
                request.open("GET", "/zadaci", true);
                request.setRequestHeader('Accept', type);
                request.timeout = 2000;
                request.send();

            },

            trenutniHttpPoziv: undefined,
        }
    }
    return konstruktor;
}());
