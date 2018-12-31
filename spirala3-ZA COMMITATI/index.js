const express = require('express');
const app = express();
const port = 8080;

// biblioteka za funkcije sa fajlovima
const fs = require('fs');

// biblioteka za funkcije sa pathovima (za path.join funkciju je koristimo)
const path = require('path');

// biblioteka koja se koristi za rad sa uploadovanim fajlovima
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });


app.use(express.static('files'));

// ZADATAK 1
app.use(express.static('static'));

// da bi se mogli citati podaci koji su submittani sa formi
app.use(express.urlencoded());

// ZADATAK 2
app.post('/addZadatak', upload.single('postavka'), (req, res) => {
    console.log(req.file);
    if (req.file == null || req.file.mimetype !== 'application/pdf') {
        res.redirect('/greska.html');
    } else {
        var nazivJsonFajla = path.join(process.cwd(), 'files', req.body['naziv'] + 'Zad.json');
        var nazivPdfFajla = path.join(process.cwd(), 'files', req.body['naziv'] + '.pdf');
        if (fs.existsSync(nazivJsonFajla) || fs.existsSync(nazivPdfFajla)) {
            res.redirect('/greska.html');
        } else {
            var objekat = {
                naziv: req.body['naziv'],
                postavka: 'http://localhost:8080/' + req.body['naziv'] + '.pdf'
            };
            fs.writeFileSync(nazivJsonFajla, JSON.stringify(objekat));
            fs.copyFileSync(req.file.path, nazivPdfFajla);
            res.send(objekat);
        }
    }

    // obrisati privremeni fajl (koji napravi multer) ukoliko smo ga uploadovali
    if (req.file) {
        fs.unlinkSync(req.file.path);
    }
});

// ZADATAK 3
app.get('/zadatak', (req, res) => {
    var punaPutanja = path.join(process.cwd(), 'files', req.query['naziv'] + '.pdf');
    res.sendFile(punaPutanja);
});

// ZADATAK 4
function ImaLiGodinaUCsv(godinaZaTestirati) {
    try {
        var redovi = fs.readFileSync('godine.csv').toString();
        for (var red of redovi.split('\n')) {
            // posljednji red je obicno prazan
            if (red.length > 0) {
                // uzeti prvu rijec odvojenu zarezom, to nam je godina
                var godinaURedu = red.split(',')[0];
                if (godinaURedu === godinaZaTestirati) {
                    return true;
                }
            }
        }
        return false;
    } catch(err) {
        return false;
    }
}

app.post('/addGodina', (req, res) => {
    console.log(req.body);

    if (!ImaLiGodinaUCsv(req.body['nazivGod'])) {
        var red = req.body['nazivGod'] + ',' + req.body['nazivRepVje'] + ',' + req.body['nazivRepSpi'];
        fs.appendFileSync('godine.csv', red + '\n');
    
        res.redirect('/addGodina.html');
    } else {
        res.redirect('/greska.html');
    }
});

// ZADATAK 5
app.get('/godine', (req, res) => {
    var ret = [];
    try {
        var redovi = fs.readFileSync('godine.csv').toString();
        for (var red of redovi.split('\n')) {
            // posljednji red je obicno prazan
            if (red.length > 0) {
                let rastavljeno = red.split(',');
                ret.push({
                    nazivGod: rastavljeno[0],
                    nazivRepVje: rastavljeno[1],
                    nazivRepSpi: rastavljeno[2]
                });
            }
        }
    } catch(err) {
    }
    res.send(ret);
});

// Zadatak 7
var js2xmlparser = require("js2xmlparser");

app.get('/zadaci', (req, res) => {

    var filesDir = path.join(process.cwd(), 'files');
    var sviZadaci = [];
    for (filename of fs.readdirSync(filesDir)) {
        if (filename.endsWith('Zad.json')) {
            var fullPath = path.join(process.cwd(), 'files', filename);
            var fileContent = fs.readFileSync(fullPath);
            sviZadaci.push(JSON.parse(fileContent));
        }
    }

    // acceptsMalim je niz svih u accepts headeru, pretvorene u mala slova
    var acceptsMalim = req.accepts().map(elementNizaAccepts => {
        return elementNizaAccepts.toLowerCase();
    });

    // Ako imamo application/json u ovom arrayu
    if (acceptsMalim.indexOf('application/json') != -1) {
        res.send(sviZadaci);
        return;
    }

    // Ako imamo application/xml u ovom arrayu
    if (acceptsMalim.indexOf('application/xml') != -1) {
        for (let zadatak of sviZadaci) {
            zadatak['='] = 'zadatak';
        }
        res.type('application/xml');
        res.send(js2xmlparser.parse("zadaci", sviZadaci));
        return;
    }

    // Ako imamo text/csv u ovom arrayu
    if (acceptsMalim.indexOf('text/csv') != -1) {
        var csv = "";
        for (let zadatak of sviZadaci) {
            csv += zadatak['naziv'] + ',' + zadatak['postavka'] + '\n';
        }
        res.type('text/csv');
        res.send(csv);
        return;
    }

    res.redirect('/greska.html');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));