const express = require('express');
const bodyParser = require('body-parser');
var url = require('url');
const app = express();
const port = 8080;

const Zadatak = require('./schemas/zadatak')
const Student = require('./schemas/student')
const Godina = require('./schemas/godina')
const Vjezba = require('./schemas/vjezba')
const GodinaVjezba = require('./schemas/godina_vjezba')
const VjezbaZadatak = require('./schemas/vjezba_zadatak')

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

// Create models in DB
Godina.sync();
Student.sync()
Zadatak.sync();
Vjezba.sync();


Godina.hasMany(Student, { as: 'student', foreignKey: 'id_godina' })

Godina.belongsToMany(Vjezba, {
    as: 'id_godina',
    through: { model: GodinaVjezba, unique: false },
    foreignKey: 'id_godina'
});
Vjezba.belongsToMany(Godina, {
    as: 'id_vjezba',
    through: { model: GodinaVjezba, unique: false },
    foreignKey: 'id_vjezba'
});
GodinaVjezba.sync();

Zadatak.belongsToMany(Vjezba, {
    as: 'id_zadatak',
    through: { model: VjezbaZadatak, unique: false },
    foreignKey: 'id_zadatak'
});
Vjezba.belongsToMany(Zadatak, {
    as: 'id_vjezbaa',
    through: { model: VjezbaZadatak, unique: false },
    foreignKey: 'id_vjezba'
});
VjezbaZadatak.sync();


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
    const vz_create = [];
    req.body.forEach(zadatak => {
        vz_create.push({
            id_vjezba: req.params.id,
            id_zadatak: zadatak.id
        })
    })

    VjezbaZadatak.bulkCreate(vz_create).then(data => {
        res.json({
            message: 'Everything went fine :)'
        })         
    }).catch(err => {
        res.redirect('/greska.html');
    })
});

// ZADATAK 3
app.get('/zadatak', (req, res) => {
    Zadatak.findAll().then(data => {
        res.json(data);
    })
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

function createVjezbaZadatak(vjezba, zadatak, res) {
    console.log('HERE', vjezba, zadatak)
    VjezbaZadatak.create({
        id_vjezba: vjezba,
        id_zadatak: zadatak
    }).then(data => {
        res.redirect('/addVjezba.html');
    }).catch(err => {
        console.log(err)
        res.redirect('/greska.html');
    })
}

app.post('/vjezba-zadatak', (req, res) => {
    console.log(req.body)
    Vjezba.findOne({ where: { naziv: req.body.naziv } }).then(data => {
        if (data === null) {
            Vjezba.create(req.body).then(createdVjezba => {
                createVjezbaZadatak(createdVjezba.dataValues.id, req.body.zadatak, res)
            }).catch(err => {
                res.redirect('/greska.html');
            })
        } else {
            createVjezbaZadatak(data.dataValues.id, req.body.zadatak, res)            
        }

    }).catch(err => {
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
    Zadatak.findAll().then(data => {
        sviZadaci = data;
    })

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