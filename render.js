var raw;
if(document.body != null && document.body.innerHTML != null){
	if(document.body.childNodes.length > 0){
		raw = document.body.childNodes[0].innerHTML;
	}
	else{
		raw = document.body.innerHTML;
	}
}
else{	
	raw = document.documentElement.innerHTML;
}

var canvas = null;

var entities = [];

function parseRaw(raw){
	var cleanRaw = raw.replace(/\|.+\|/g, "");
	var cleanRaws = cleanRaw.split('#');
	var validation = validateRaw(cleanRaws);
	
	if(validation === true){
		parseHead(cleanRaws[1]);
		parseBody(cleanRaws[2]);
		parseFooter(cleanRaws[3]);
		render();
	}
	else{
		document.documentElement.innerHTML = ""+validation;
	}
}

function validateRaw(cleansRaws){
	if(cleansRaws.length != 4){
		return "Incorrect number of sections";
	}
	else if(cleansRaws[0] != ""){
		return "Incorrect document start, missing sections";
	}
	else if(!cleansRaws[1].startsWith("head")){
		return "Head section msiplaced";
	}
	else if(!cleansRaws[2].startsWith("body")){
		return "Body section msiplaced";
	}
	else if(!cleansRaws[3].startsWith("footer")){
		return "Footer section msiplaced";
	}
	
	return true;
}

function parseHead(head){

}

function parseBody(body){

}

function parseFooter(footer){

}

function render(){
	var renderHTML = "<html><head></head><body><canvas id=\"lu\"></canvas></body></html>";

	document.documentElement.innerHTML = renderHTML;
	setTimeout(function(){postRender();}, 1);
}

function postRender(){
	canvas = document.querySelector("#lu");
	canvas.height = document.body.offsetHeight;
	canvas.width = document.body.offsetWidth;
}

parseRaw(raw);