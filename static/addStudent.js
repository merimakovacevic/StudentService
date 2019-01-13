var poruke=document.getElementById('poruka');
var validacija=new Validacija(poruke);

function doLogin(){
    
	var ime=document.getElementById('ime');
    validacija.ime(ime);
    var index=document.getElementById('index');
    validacija.index(index);
}

function csvJSON(csv){
    var lines=csv.split("\n");
    var result = [];
    var headers=lines[0].split(",");
  
    for(var i=1;i<lines.length - 1;i++){
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
    }
    
    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}

let students = []
function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    // use the 1st file from the list
    f = files[0];

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function(theFile) {
    return function(e) {
        students = JSON.parse(csvJSON(e.target.result))
    };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsText(f);
}

document.getElementById('csv').addEventListener('change', handleFileSelect, false);


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

function studentiMulti() {
    var e = document.getElementById("sGodine2");
    var godina = e.options[e.selectedIndex].value;

    var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 
    xmlhttp.open("POST", "/student-multi");
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xmlhttp.send(JSON.stringify({ "godina": godina, "studenti": students }));
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            window.location.reload();
        }
    }
}

listGodine();