var poruke=document.getElementById('poruka');
var validacija=new Validacija(poruke);


function doLogin(){
    
	var ime=document.getElementById('ime');
    validacija.ime(ime);
    var index=document.getElementById('index');
    validacija.index(index);
}