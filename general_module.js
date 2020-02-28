var score=0;
var finished=false;

function find_magnitude(vector) {
	return Math.pow(Math.pow(vector[0],2)+Math.pow(vector[1],2),.5);
}

function find_unit(vector) {
	var magnitude=find_magnitude(vector);
	var unit_vector=[vector[0],vector[1]];
	if (magnitude>0) {
		unit_vector[0]/=magnitude;
		unit_vector[1]/=magnitude;
	}
	return unit_vector;
}

function reset_src(object) {
	object.src=object.name+".png";
}

function finish_game() {
	if (!finished) {
		finished=true;
		alert("Score: "+score);
		history.go(0);
	}
}

function cancel_collisions(object,objects) {
	var cancel=false;
	var walls=document.getElementsByName("wall");
	var new_position=[object.current_position[0]+object.movement_vector[0],object.current_position[1]+object.movement_vector[1]];
	var object_x_bound=object.size[0]*(Math.pow(2,.5)-1)/2;
	var object_y_bound=object.size[1]*(Math.pow(2,.5)-1)/2;
	if (object.name!="sentient") {
		for (var x=0;x<walls.length;x++) {
			var wall_bound=walls[x].getBoundingClientRect();
			if (new_position[0]+object.size[0]>wall_bound.left && new_position[0]<wall_bound.right && object.current_position[1]+object.size[1]>wall_bound.top && object.current_position[1]<wall_bound.bottom) {
				if (object.name==="projectile") {
					object.movement_vector[0]*=-1;
					object.bounces++;
					object.src="projectile_"+object.bounces+".png";
				} else {
					object.movement_vector[0]=0;
				}
			}
			if (object.current_position[0]+object.size[0]>wall_bound.left && object.current_position[0]<wall_bound.right && new_position[1]+object.size[1]>wall_bound.top && new_position[1]<wall_bound.bottom) {
				if (object.name==="projectile") {
					object.movement_vector[1]*=-1;
					object.bounces++;
					object.src="projectile_"+object.bounces+".png";
				} else {
					object.movement_vector[1]=0;
				}
			}
		}
	}
	if (object.name!="sentient") {
		if (new_position[0]<object_x_bound || new_position[0]>window.innerWidth-object_x_bound-object.size[0]) {
			object.movement_vector[0]=0;
			cancel=true;
		}
		if (new_position[1]<object_y_bound || new_position[1]>window.innerHeight-object_y_bound-object.size[1]) {
			object.movement_vector[1]=0;
			cancel=true;
		}
	}
	if (object.name==="sentient") {
		var square_bound=document.getElementById("square").getBoundingClientRect();
		if ((new_position[0]+object.size[0]>square_bound.left && new_position[0]<square_bound.right && object.current_position[1]+object.size[1]>square_bound.top && object.current_position[1]<square_bound.bottom) || (object.current_position[0]+object.size[0]>square_bound.left && object.current_position[0]<square_bound.right && new_position[1]+object.size[1]>square_bound.top && new_position[1]<square_bound.bottom)) {
			finish_game();
		}
	}
	if (object.name==="projectile") {
		for (var x=0;x<objects.length;x++) {
			var object_bound=objects[x].getBoundingClientRect();
			var collided_object
			if ((objects[x].name==="square" && object.bounces>0) || objects[x].name==="sentient") {
				if (new_position[0]+object.size[0]>object_bound.left && new_position[0]<object_bound.right && object.current_position[1]+object.size[1]>object_bound.top && object.current_position[1]<object_bound.bottom) {
					cancel=true;
					collided_object=objects[x];
				}
				if (object.current_position[0]+object.size[0]>object_bound.left && object.current_position[0]<object_bound.right && new_position[1]+object.size[1]>object_bound.top && new_position[1]<object_bound.bottom) {
					cancel=true;
					collided_object=objects[x];
				}
				if (collided_object && !object.debounce) {
					object.debounce=true;
					collided_object.health-=object.bounces;
					collided_object.src=collided_object.name+"_hurt.png";
					setTimeout(reset_src,30,collided_object);
					if (collided_object.name!="square") {
						score+=Math.pow(object.bounces,4);
					} else {
						score-=Math.pow(object.bounces,4);
						if (collided_object.health<=0) {
							finish_game();
						}
					}
				}
			}
		}
	}
	return cancel;
}