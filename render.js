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
var error = "";
var loop = null;

function parseRaw(raw){
	var cleanRaw = raw.replace(/\|.+\|/g, "");
	var cleanRaws = cleanRaw.split('#');
	var validation = validateRaw(cleanRaws);
	
	if(validation === true){
		parseHead(cleanRaws[1]);
		parseBody(cleanRaws[2]);
		parseFooter(cleanRaws[3]);
	}
	else{
		error = validation;
	}
}

function validateRaw(cleansRaws){
	if(cleansRaws.length != 5){
		return "Incorrect number of sections";
	}
	else if(cleansRaws[0] != ""){
		return "Incorrect document start, missing sections";
	}
	else if(!cleansRaws[1].startsWith("head")){
		return "Head section misplaced";
	}
	else if(!cleansRaws[2].startsWith("init")){
		return "Init section misplaced";
	}
	else if(!cleansRaws[3].startsWith("loop")){
		return "Loop section misplaced";
	}
	else if(!cleansRaws[4].startsWith("async")){
		return "Footer section misplaced";
	}
	
	return true;
}

function parseHead(head){
	let lines = head.split('\n');
	for(let key in lines){
		parseHeadLine(lines[key], key);
	}
}

function parseHeadLine(line, key){
	let cleanLine = line.trim();
	if(cleanLine == "" || cleanLine == "head"){
	}
	else{
		let validation = validateHeadLine(cleanLine, key);
		if(validation === true){
			let elements = cleanLine.split("=");
			let entityId = elements[0].trim();
			let entityType = elements[1].trim();

			let newEntity = new Entity(entityId, entityType);
			addEntity(newEntity);
		}
		else{
			error = validation;
		}
	}
}

function validateHeadLine(cleanLine, key){
	let elements = cleanLine.split("=");
	if(elements.length != 2){
		return "Misformed head instruction on line "+key+": <em>"+cleanLine+"</em>";
	}
	else if(elements[0].trim() == ""){
		return "Misformed entity id on line "+key+": <em>"+cleanLine+"</em>";
	}
	else if(elements[1].trim() == ""){
		return "Misformed entity type on line "+key+": <em>"+cleanLine+"</em>";
	}

	return true;
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

	for(let key in entities){
		entities[key].init(canvas);
	}

	loop = setInterval(function(){
		canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		for(let key in entities){
			entities[key].render();
		}
	}, 1);
}

parseRaw(raw);
if(error == null || error == ""){
	render();
}
else{
	document.documentElement.innerHTML = ""+error;
}

function addEntity(newEntity){
	entities.push(newEntity);
}

function getEntityById(id){
	let result = null;
	for(let key in entities){
		if(entities[key].id == id){
			result = entities[key];
		}
	}
	return result;
}