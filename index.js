const express = require('express');
const bodyParser = require('body-parser');
var url = require('url');
const app = express();
const port = 8080;

const Zadatak = require('./schemas/zadatak')
const Student = require('./schemas/student')
const Godina = require('./schemas/godina')
const Vjezba = require('./schemas/vjezba')
const sequelize = require('./connection')

const BitBucket = require('./bitBucket')

// biblioteka za funkcije sa fajlovima
const fs = require('fs');

// biblioteka za funkcije sa pathovima (za path.join funkciju je koristimo)
const path = require('path');

// biblioteka koja se koristi za rad sa uploadovanim fajlovima
var multer  = require('multer');

const uploadPath = 'uploads'
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

// DB
Godina.hasMany(Student, { as: 'godine', foreignKey: 'id_godina' })

//Druga
const GodinaVjezba=Godina.belongsToMany(Vjezba,{as:'vjezbe',through:'godina_vjezba',foreignKey:'idgodina'});
Vjezba.belongsToMany(Godina,{as:'godine',through:'godina_vjezba',foreignKey:'idvjezba'});
//Treca
const VjezbaZadatak=Vjezba.belongsToMany(Zadatak,{as:'zadaci',through:'vjezba_zadatak',foreignKey:'idvjezba'});
Zadatak.belongsToMany(Vjezba,{as:'vjezbe',through:'vjezba_zadatak',foreignKey:'idzadatak'});

sequelize.sync().then(() => console.log("Models create OK"));


// END DB

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('files'));

// ZADATAK 1
app.use(express.static('static'));

// da bi se mogli citati podaci koji su submittani sa formi
app.use(express.urlencoded());

// ZADATAK 2
app.post('/zadatak', upload.single('postavka'), (req, res) => {

    req.body.postavka = `http://${req.host}:${port}/${uploadPath}/${req.file.originalname}`;
    console.log(req.body)
    Zadatak.create(req.body).then(data => {
        res.redirect('/addZadatak.html');
    }).catch(err => {
        res.redirect('/greska.html');
    })
})

// Send array zadataka like objects { id, name, ... }
app.post('/vjezba/:id/zadatak', (req, res) => {
    Vjezba.findByPk(req.params.id).then(vjezba => {
        vjezba.addZadaci(req.body.sZadatak).then(() => {
            res.redirect("/addVjezba.html");
        }).catch(err => {
            console.log(err);
            res.redirect('/greska.html');
        })
    }).catch(err => {
        console.log(err);
        res.redirect('/greska.html');
    });
});

// ZADATAK 3 //ovo bi trebalo za 7 zad da ide na ovu putanju
app.get('/zadatak', (req, res) => {
    var punaPutanja = path.join(process.cwd(), 'files', req.query['naziv'] + '.pdf');
    res.sendFile(punaPutanja);
});

// ZADATAK 4
app.post('/godine', (req, res) => {
    Godina.create(req.body).then(data => {
        // res.json(data); // or send data back
        res.redirect('/addGodina.html');
    }).catch(err => {
        res.redirect('/greska.html');
    });
});

// ZADATAK 5
app.get('/godine', (req, res) => {
    Godina.findAll().then((data) => {
        res.json(data);
    })
});

function createVjezbaGodina(vjezbaId, godinaId, res) {
    console.log('HERE', vjezbaId, godinaId)
    Vjezba.findByPk(vjezbaId).then(vjezba => {
        vjezba.addGodine(godinaId).then(_ => {
            res.redirect('/addVjezba.html');
        }).catch(err => {
            console.log("Greska pri dodavanju godina");
            console.log(err);
            res.redirect('/greska.html');
        })
    }).catch(err => {
        console.log("Greska pri nalazenju vjezbe");
        console.log(err);
        res.redirect('/greska.html');
    });
}

app.post('/addVjezba', (req, res) => {
    console.log("Add vjezba");
    Vjezba.findOne({ where: { naziv: req.body.naziv } }).then(data => {
        console.log("BODYYYY");
        console.log(req.body);
        if (data === null) {
            Vjezba.create(req.body).then(createdVjezba => {
                createVjezbaGodina(createdVjezba.dataValues.id, req.body.godina, res)
            }).catch(err => {
                console.log(err);
                res.redirect('/greska.html');
            })
        } else {
            createVjezbaGodina(data.dataValues.id, req.body.godina, res)
        }

    }).catch(err => {
        console.log(err);
        res.redirect('/greska.html');
    })
});

app.post('/godina-vjezba', (req, res) => {
    GodinaVjezba.create({
        id_godina: req.body.godina,
        id_vjezba: req.body.vjezba
    }).then(data => {
        // res.json(data);
        res.redirect('/addVjezba.html')
    }).catch(err => {
        res.redirect('/greska.html');
    })
})

app.get('/vjezbe', (req, res) => {
    Vjezba.findAll().then((data) => {
        res.json(data);
    })
});

// Zadatak 7
var js2xmlparser = require("js2xmlparser");

app.get('/zadaci', (req, res) => {
    let sviZadaci = [];
    Zadatak.findAll({'include': 'vjezbe'}).then(data => {
        sviZadaci = data;
        if (req.query['bez'] !== undefined) {
            sviZadaci = data.filter((zadatak) => {
                for (let godina of zadatak.vjezbe) {
                    if (godina.id == req.query['bez']) {
                        return false;
                    }
                }
                return true;
            })
        }
        sviZadaci = sviZadaci.map(zadatak => {
            return {
                postavka: zadatak.postavka,
                naziv: zadatak.naziv,
                id: zadatak.id
            }
        });

        // acceptsMalim je niz svih u accepts headeru, pretvorene u mala slova
        var acceptsMalim = req.accepts().map(elementNizaAccepts => {
            console.log(elementNizaAccepts)
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

    // prije je ovaj ostatak koda bio ovdje, ali ovdje sviZadaci = [] jer se onaj
    //   dio u then dijelu noije jos izvrsio. dio u then dijelu se izvrsi tek kada se
    //   ova funkcija zavrsi
});

app.post('/student', (req, res) => {
    Student.create(req.body).then((data) => {
        res.redirect('/addStudent.html');
    }).catch(err => {
        res.redirect('/greska.html');
    })
})

// Zadatak 3.a
app.post('/student-multi', (req, res) => {
    const godina = req.body.godina;
    const studenti = req.body.studenti;
    console.log(godina, studenti)

    let numberOfAddedStudents = 0;
    let numberOfAssignedStudents = 0;

    studenti.map(student => {
        student.id_godina = godina
    })
    // NOT WORKING DUE TO LACK OF UPDATE PARAM WHICH IS MISSING
    // Student.bulkCreate(studenti, {
    //     fields: ['imePrezime', 'index', 'id_godina'] ,
    //     updateOnDuplicate: true 
    // }).then(data => {
    //     data.forEach(student => {
    //         console.log(student)
    //         console.log(student.isNewRecord)
    //         student.isNewRecord == false ? numberOfAssignedStudents++ : numberOfAddedStudents++;
    //     })
    //     res.json({
    //         added: numberOfAddedStudents,
    //         assigned: numberOfAssignedStudents
    //     })
    // })

    studenti.forEach((student, index, array) => {
        Student.findOne({ where: { index: student.index } }).then((data) => {
            if (data) {
                Student.update(student, { where: { index: student.index } }).then((data) => {
                }).catch(err => {
                    console.log('ERROR')
                })
                numberOfAssignedStudents++
            } else {
                Student.create(student).then((data) => {
                }).catch(err => {
                    console.log('ERROR')
                })
                numberOfAddedStudents++
            }

            if (index === array.length - 1) {
                console.log()
                res.json({
                    M: numberOfAssignedStudents,
                    N: numberOfAddedStudents
                })
            }
        })
    })

})

app.get('/student', (req, res) => {
    Student.findAll().then(data => {
        res.json(data)
    })
})

app.get('/bb', (req, res) => {
    const bb = new BitBucket();

    res.json({
        url: bb.url
    });
    // bb.ucitaj(1, 2, (data) => {
    //     res.json({
    //         status: data
    //     })
    // })
})

app.get('/auth?', (req, res) => {

    axios({
        method: 'POST',
        auth: {
            'user': 'client_id',
            'pass': 'secret'
        }
    })
    req.query.code

    for (var propName in query) {
        if (query.hasOwnProperty(propName)) {
            console.log(propName, query[propName]);
        }
    }

    res.json({
        test: true
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));