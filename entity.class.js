class Entity{
	constructor(id, type){
		this.id = id;
		this.type = type;

		this.canvas = null;
		this.context = null;

		this.x = 0;
		this.y = 0;
	}

	init(canvas){
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
	}

	render(){
		/*this.context.fillStyle = "#FF0000";
		this.context.fillRect(this.x, this.y, 150, 75);*/
	}
}