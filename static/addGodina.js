var poruke=document.getElementById('poruka');
var validacija=new Validacija(poruke);

function doLogin(event){
    var okej = true;

	var godina=document.getElementById('naziv');
    // okej = okej && validacija.godina(godina);
    var rep = document.getElementById('rvjezbe');
    // okej = okej && validacija.repozitorij(rep, /wt[p|P]rojekat1[0-9][0-9][0-9][0-9]/);
    var rep2 = document.getElementById('rspiral');
    // okej = okej && validacija.repozitorij(rep2, /wt[p|P]rojekat1[0-9][0-9][0-9][0-9]/);

    if (!okej) {
        event.preventDefault();
    }

    console.log(godina, rep, rep2)
}