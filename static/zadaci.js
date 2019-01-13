var poruke=document.getElementById('poruke');
var validacija=new Validacija(poruke);

function doLogin(event){
    event.preventDefault();
	var ime=document.getElementsByClassName('polje')[0];
    validacija.ime(ime);
}