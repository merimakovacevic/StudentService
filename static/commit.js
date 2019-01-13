function idRedKolonaStr(red, kolona) {
    return "red-"+red+",kolona-"+kolona;
}

function idRedKolona(red, kolona) {
    return document.getElementById(idRedKolonaStr(red, kolona));
}

var CommitTabela=(function(){

    var konstruktor=function(divElement, brojZadataka){

        var tabela = document.createElement('table');
        tabela.id="tabela";
        var redova = brojZadataka;
        var headerRed = tabela.insertRow();
        headerRed.id="headerRed"; //redovi sa zadacima se indeksiraju od 0, id im je po sablonu red-i

        var zadaci = headerRed.insertCell();
        zadaci.innerHTML = "Zadaci";

        var commiti = headerRed.insertCell();
        commiti.id="commiti";
        commiti.innerHTML = "Commiti";
        // commiti.colSpan = najveciRed.cells.length - 1;

        for (var i=0; i<redova; i++) {
            var red = tabela.insertRow();
            red.id = "red-" + i;
            var kolona = red.insertCell();
            var j=i+1;
            kolona.innerHTML = "Zadatak " + j;
        }

        divElement.appendChild(tabela);

        var brojCommitaPoRedovima=[];
        var najveciRed=[]; //niz koji u sebi sadrži indekse redova koji imaju jednak najveći broj kolona - red sa prvim zadatkom je sa indeksom nula
        for(var i=0; i<redova; i++){
            brojCommitaPoRedovima.push(0); //na početku svi sadrže 0 commita
        }
        
        var racunajNajveciRed=function(){
            var poc=0;
            for(var i=0; i<brojZadataka; i++){
                //var j=i+1; //preskačemo red sa naslovom
                //var nova=document.getElementById('tabela').rows[j].cells.length; 
                var nova=brojCommitaPoRedovima[i];
                if(nova>poc){
                    poc=nova;
                    najveciRed.push(i);
                }
                else if(nova!=0 && nova===poc){
                    najveciRed.push(i);
                }
            }
            return poc;
        }

        var postaviColspanNaslova=function(){
            var col=racunajNajveciRed();
            var com=document.getElementById("commiti");
            com.colSpan=col;
            
            return true;
        }

        return {
            dodajCommit:function(rbZadatka, url){
                if(rbZadatka>(brojZadataka-1)) return -1;
                var link=document.createElement("a");
                link.href=url;
                link.innerHTML=brojCommitaPoRedovima[rbZadatka]+1;

                var redId="red-"+rbZadatka;
                var red=document.getElementById(redId);
                

                if(brojCommitaPoRedovima[rbZadatka]===racunajNajveciRed()){ //ako je red u kojeg dodajemo novi commit red sa najviše commita
                    var celija=red.insertCell(); //dodavanje ćelije u taj red
                    celija.id=redId+",kolona-"+brojCommitaPoRedovima[rbZadatka];
                    celija.appendChild(link);
                    brojCommitaPoRedovima[rbZadatka]++;
                    //zatim petljom kroz ostale redove
                    for(var i=0; i<brojZadataka; i++){
                        if(i!=rbZadatka){
                            if(brojCommitaPoRedovima[i]===brojCommitaPoRedovima[rbZadatka]-1){
                                var idReda="red-"+i;
                                var r=document.getElementById(idReda);
                                var c=r.insertCell();
                                c.id=idReda+",kolona-"+brojCommitaPoRedovima[i];
                            }
                            else if(brojCommitaPoRedovima[i]<brojCommitaPoRedovima[rbZadatka]-1){
                                
                                var cel=brojCommitaPoRedovima[i];
                                var idCelije="red-"+i+",kolona-"+cel;
                                var celija=document.getElementById(idCelije);
                                celija.colSpan=brojCommitaPoRedovima[rbZadatka]-brojCommitaPoRedovima[i];
                            }
                        }
                    }
                }
                else if((racunajNajveciRed()-brojCommitaPoRedovima[rbZadatka])>1){
                    
                    var c=redId+",kolona-"+brojCommitaPoRedovima[rbZadatka]; //pronalazimo celiju kojoj treba pridruziti commit
                    var ce=document.getElementById(c);
                    ce.appendChild(link);
                    ce.colSpan=1;
                    var novace=red.insertCell(); //dodavanje ćelije u taj red
                    brojCommitaPoRedovima[rbZadatka]++;
                    novace.id=redId+",kolona-"+brojCommitaPoRedovima[rbZadatka];
                    
                    
                    
                    novace.colSpan=racunajNajveciRed()-brojCommitaPoRedovima[rbZadatka];
                    
                }
                else{ //ako je razlika između broja commita najvećeg reda i reda u kojeg trenutno dodajemo commit jednaka 1
                    var c=redId+",kolona-"+brojCommitaPoRedovima[rbZadatka];
                    brojCommitaPoRedovima[rbZadatka]++;
                    var ce=document.getElementById(c);
                    ce.appendChild(link);
                }
                

                postaviColspanNaslova();
            },

            //KAKO DA MI DIREKTNO UPUĆUJE NA STRANICU C2 ILI ETF
            editujCommit:function(rbZadatka,rbCommita,url){
                if(rbZadatka>(brojZadataka-1) || rbZadatka<0) return -1;
                if(rbCommita>(brojCommitaPoRedovima[rbZadatka]-1) || rbCommita<0) return -1;
                var link=document.getElementById("red-"+rbZadatka+",kolona-"+rbCommita).lastChild;
                link.href=url;
            },

            obrisiCommit:function(rbZadatka,rbCommita){
                if(rbZadatka>(brojZadataka-1) || rbZadatka<0) return -1;
                if(rbCommita>(brojCommitaPoRedovima[rbZadatka]-1) || rbCommita<0) return -1;
                var kolona = idRedKolona(rbZadatka, rbCommita);
                kolona.remove();
                
                
                for (var i=rbCommita + 1; i<=brojCommitaPoRedovima[rbZadatka]; i++) {
                    var kolonaZaPromijeniti = idRedKolona(rbZadatka, i);

                    if (kolonaZaPromijeniti) {
                        kolonaZaPromijeniti.id = idRedKolonaStr(rbZadatka, i-1);
    
                        // Ako kolona za promijeniti ima nesto u sebi (a)
                        if (kolonaZaPromijeniti.lastElementChild) {
                            kolonaZaPromijeniti.lastElementChild.innerHTML = i;
                        }
                    }
                }
                brojCommitaPoRedovima[rbZadatka]--;
                var mojihCommita = brojCommitaPoRedovima[rbZadatka];

                var najvise = racunajNajveciRed();

                // dodavanje prazne kolone za colspan
                if (mojihCommita < najvise) {
                    var kolonaSaColspan = idRedKolona(rbZadatka, mojihCommita);
                    if (!kolonaSaColspan) {
                        
                        var red = document.getElementById('red-' + rbZadatka);
                        var kolonaSaColspan = red.insertCell();
                        kolonaSaColspan.id = idRedKolonaStr(rbZadatka, mojihCommita);
                        kolonaSaColspan.colSpan = 1;
                    }
                }

                // ispravljanje colspan ostalih kolona
                for (var i=0; i<brojZadataka; i++) {
                    var zadnjaKolona = idRedKolona(i, brojCommitaPoRedovima[i]);
                    if (zadnjaKolona) {
                        var noviColspan = najvise-brojCommitaPoRedovima[i];
                        if (noviColspan === 0) {
                            zadnjaKolona.remove();
                        } else {
                            zadnjaKolona.colSpan = noviColspan;
                        }
                    }
                }

                postaviColspanNaslova();
            }
        }
    }
    return konstruktor;
}());

