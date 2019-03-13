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
cleanRaws = [];

var canvas = null;
var entities = [];
var error = "";
var loop = null;

function parseRaw(raw){
	var cleanRaw = raw.replace(/\~.+\~/g, "");
	cleanRaws = cleanRaw.split('#');
	var validation = validateRaw(cleanRaws);
	
	if(validation === true){
		parseHead(cleanRaws[1]);
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
		parseLine(lines[key], key);
	}
}

function parseInit(init){
	let lines = init.split('\n');
	for(let key in lines){
		parseLine(lines[key], key);
	}
}

function parseLoop(loop){

}

function parseAsync(async){

}

function parseLine(line, key){
	let cleanLine = line.trim();
	if(cleanLine == "" || cleanLine == "head" || cleanLine == "init" || cleanLine == "loop" || cleanLine == "async"){
	}
	else{
		let isDeclarationLine = false;
		let isPropertyLine = false;

		//TODO handles functions and their callbacks
		if(cleanLine.match(/^[A-Za-z0-9]+ \= .+$/) || cleanLine.match(/^[A-Za-z0-9]+\=.+$/) || cleanLine.match(/^[A-Za-z0-9]+ \=.+$/) || cleanLine.match(/^[A-Za-z0-9]+\= .+$/)){
			isDeclarationLine = true;
		}
		else if(cleanLine.match(/[A-Za-z0-9.]+\..+/)){
			isPropertyLine = true;
		}
		else{
			error = "Unparsable line "+key+": <em>"+cleanLine+"</em>";
		}

		if(isDeclarationLine){
			parseDeclarationLine(cleanLine, key);
		}
		else if(isPropertyLine){
			parsePropertyLine(cleanLine, key);
		}
	}
}

function parseDeclarationLine(line, key){
	let validation = validateDeclarationLine(line, key);
	if(validation === true){
		let elements = line.split("=");
		let entityId = elements[0].trim();
		let entityType = elements[1].trim();

		let newEntity = new Entity(entityId, entityType);
		addEntity(newEntity);
	}
	else{
		error = validation;
	}
}

function validateDeclarationLine(line, key){
	let elements = line.split("=");
	if(elements.length != 2){
		return "Misformed head instruction on line "+key+": <em>"+line+"</em>";
	}
	else if(elements[0].trim() == ""){
		return "Misformed entity id on line "+key+": <em>"+line+"</em>";
	}
	else if(elements[1].trim() == ""){
		return "Misformed entity type on line "+key+": <em>"+line+"</em>";
	}

	return true;
}

function parsePropertyLine(line, key){
	let validation = validatePropertyLine(line, key);
	if(validation === true){
		//TODO handle ++, --
		let elements = line.split("=");

		let affected = elements[0].trim();
		let affectation = elements[1].trim();

		let newValue = affectation;
		//TODO handle properties and differentiate from float
		/*if(affectation.indexOf(".") != -1){
			newValue = getPropertyValueFromString(affectation);
		}*/

		let affectedElements = affected.split(".");
		let entityId = affectedElements[0].trim();
		let propertyName = affectedElements[1].trim();

		setPropertyValue(entityId, propertyName, newValue);
	}
	else{
		error = validation;
	}
}

function validatePropertyLine(line, key){
	return true;
}

function getPropertyValue(entityId, propertyName){
	let entity = getEntityById(entityId);
	return entity[propertyName];
}

function getPropertyValueFromString(string){
	let elements = string.split(".");
	return getPropertyValue(elements[0].trim(), elements[1].trim());
}

function setPropertyValue(entityId, propertyName, newValue){
	let entity = getEntityById(entityId);

	//TODO Is Entity?
	//Is Vector?
	if(newValue.match(/\([0-9%-|\.]+\, [0-9%-|\.]+\, [0-9%-|\.]+\)/) || newValue.match(/\([0-9%-|\.]+\,[0-9%-|\.]+\,[0-9%-|\.]+\)/)){
		let elements = newValue.split(",");
		let x = getValue(elements[0].substring(1).trim());
		let y = getValue(elements[1].trim());
		let z = getValue(elements[2].substring(0, elements[2].length - 1).trim());
		newValue = new Vector(x, y, z);
	}
	else{
		
	}

	entity[propertyName] = newValue;
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
		entities[key].create(canvas);
	}

	parseInit(cleanRaws[2]);
	//parseLoop(cleanRaws[3]);
	//parseAsync(cleanRaws[4]);

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

function getValue(strValue){
	if(strValue.endsWith("%-")){
		strValue = strValue.substring(0, strValue.length - 2);
		return canvas.width * (parseFloat(strValue)/100.0);
	}
	else if(strValue.endsWith("%|")){
		strValue = strValue.substring(0, strValue.length - 2);
		return canvas.height * (parseFloat(strValue)/100.0);
	}

	return parseFloat(strValue);
}