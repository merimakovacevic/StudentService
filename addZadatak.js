var poruke=document.getElementById('poruka');
var validacija=new Validacija(poruke);

function doLogin(){
	var naziv=document.getElementById('naziv');
	validacija.naziv(naziv);
}