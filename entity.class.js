class Entity{
	constructor(id, type){
		this.id = id;
		this.type = type;

		this.canvas = null;
		this.context = null;

		this.position = new Vector();//Global if parent == null, local if parent != null
		this.parent = null;

		this.dimension = new Vector();

		this.content = "";
	}

	create(canvas){
		this.canvas = canvas;
		this.context = this.canvas.getContext("2d");
	}

	render(){
		let globalPosition = this.getGlobalPosition();

		switch(this.type){
			case "square":
				this.context.fillStyle = "#FF9999";
				this.context.fillRect(globalPosition.x - (this.dimension.x/2.0), globalPosition.y - (this.dimension.y/2.0), this.dimension.x, this.dimension.y);
			break;
		}
	}

	getGlobalPosition(){
		if(this.parent != null){
			let parentPosition = this.parnet.getGlobalPosition();
			return parentPosition.add(this.position);
		}
		return this.position;
	}
}