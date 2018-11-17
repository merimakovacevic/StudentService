var poruke=document.getElementById('poruka');
var validacija=new Validacija(poruke);

function doLogin(event){
    event.preventDefault();
    
	var godina=document.getElementById('naziv');
    validacija.godina(godina);
    var rep=document.getElementById('rvjezbe');
    validacija.repozitorij(rep, /wt[p|P]rojekat1[0-9][0-9][0-9][0-9]/);
    var rep2=document.getElementById('rspiral');
    validacija.repozitorij(rep2, /wt[p|P]rojekat1[0-9][0-9][0-9][0-9]/);
}