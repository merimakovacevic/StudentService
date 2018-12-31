var poruke=document.getElementById('poruka');
var validacija=new Validacija(poruke);

function doLogin(){
	var username=document.getElementById('username');
	var password=document.getElementById('password');
	validacija.ime(username);
	validacija.password(password);
}