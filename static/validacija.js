var Validacija=(function(){

	var konstruktor=function(divElementPoruke){
		return{
			pogresni: [],
			dodajPogresan:function(naziv, inputElement) {
				if (this.pogresni.indexOf(naziv) == -1) {
					this.pogresni.push(naziv);
					inputElement.style.backgroundColor = "orangered";
				}
				this.ispisiError();
			},
			obrisiPogresan:function(naziv, inputElement) {
				
				
				if (this.pogresni.indexOf(naziv) != -1) {
					// obrisati naziv iz niza 'this.pogresni'
					this.pogresni.splice(this.pogresni.indexOf(naziv), 1);
					inputElement.style.backgroundColor = null;
					
				}
				this.ispisiError();
			},
			ispisiError:function() {
				if (this.pogresni.length === 0) {
					divElementPoruke.innerHTML = "";
				} else {
					divElementPoruke.innerHTML = "Sljedeća polja nisu validna:" + this.pogresni.join(',') + "!";
				}
			},
			ime:function(inputElement){
				var regIme=/^(([A-Z]'?[A-Za-z]+('[A-Za-z]+)*'?)[\s-]?){0,3}(([A-Z]'?[A-Za-z]+([A-Za-z]+)*'?))$/;
				if(!regIme.test(inputElement.value)){
					this.dodajPogresan('ime', inputElement)
					return false;
				}
				this.obrisiPogresan('ime', inputElement);
				return true;
			},
			password:function(inputElement){
				/*
				var count = 0;
				if (ima malo slovo) {
					count++;
				}
				if (ima veliko slovo) {
					count++
				}
				if (ima broj) {
					count++
				}
				if (count >= 2) {
					OK
				}
				*/
				var regPass1=/[A-Z]/;
				var regPass2=/[a-z]/;
				var regPass3=/[0-9].{2,}/;
				if(!regPass1.test(inputElement.value) || !regPass2.test(inputElement.value) || !regPass3.test(inputElement.value)){
					this.dodajPogresan('password', inputElement);
					return false;
				}
				this.obrisiPogresan('password', inputElement);
				return true;
			},
			godina:function(inputElement){
				var regGodina=/^20[0-9][0-9]\/20[0-9][0-9]$/;

				if(!regGodina.test(inputElement.value)){
					this.dodajPogresan('godina', inputElement);
					return false;
				}
				var godine = inputElement.value.split('/');
				var godina1 = parseInt(godine[0]);
				var godina2 = parseInt(godine[1]);
				if (godina2 - godina1 != 1) {
					this.dodajPogresan('godina', inputElement);
					return false;
				}
				this.obrisiPogresan('godina', inputElement);
				return true;
			},
			repozitorij:function(inputElement, regex){
				if (typeof regex === "string") {
					regex = new RegExp(regex);
				}
				if(!regex.test(inputElement.value)){
					this.dodajPogresan('repozitorij', inputElement);
					return false;
				}
				this.obrisiPogresan('repozitorij', inputElement);
				return true;
			},
			index:function(inputElement){
				var regIndex2=/^\d{5}$/;
				if(!regIndex2.test(inputElement.value)){
					this.dodajPogresan('index', inputElement);
					return false;
				}
				var broj1=parseInt(inputElement.value[0]);
				var broj2=parseInt(inputElement.value[1]);
				var broj=broj1*10+broj2;
				if(broj<14||broj>20){
					this.dodajPogresan('index', inputElement);
					return false;
				}
				this.obrisiPogresan('index', inputElement);
				return true;
			},
			naziv:function(inputElement){
				var regNaziv=/^[A-Za-z][0-9A-Za-z\\\/\-\"\'\!\?\:\;\,]+[0-9a-z]$/;
				if(!regNaziv.test(inputElement.value)){
					this.dodajPogresan('naziv', inputElement);
					return false;
				}
				this.obrisiPogresan('naziv', inputElement);
				return true;
			},
			url:function(inputElement){
				var regUrl=/(http|https|ftp|ssh):\/\/[a-z0-9](\-[a-z0-9])*(\/[a-z0-9](\/[a-z0-9])*)*(\?[a-z0-9](\-[a-z0-9])*=[a-z0-9](\-[a-z0-9])*&[a-z0-9](\-[a-z0-9])*=[a-z0-9](\-[a-z0-9])*)*/;
				if(!regUrl.test(inputElement.value)){
					this.dodajPogresan('url', inputElement);
					return false;
				}
				this.obrisiPogresan('url', inputElement);
				return true;
			}
		}
	}
	return konstruktor;
}());
