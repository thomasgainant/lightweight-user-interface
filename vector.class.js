class Vector{
	constructor(x, y, z){
		this.x = x;
		if(this.x == null){
			this.x = 0;
		}

		this.y = y;
		if(this.y == null){
			this.y = 0;
		}

		this.z = z;
		if(this.z == null){
			this.z = 0;
		}
	}

	add(vector){
		this.x += vector.x;
		this.y += vector.y;
		this.z += vector.z;
	}
}