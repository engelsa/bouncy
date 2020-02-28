var pos_x=window.innerWidth/2;
var pos_y=window.innerHeight/2;

var firing=false;

document.onmousemove=function(event) {
	pos_x=event.clientX;
	pos_y=event.clientY;
};

function parse_input_vector(position) {
	var movement_vector=[0,0];

	movement_vector[0]=pos_x-position[0];
	movement_vector[1]=pos_y-position[1];

	var magnitude=Math.min(Math.max(find_magnitude(movement_vector)-30,0),1)*Math.min((find_magnitude(movement_vector)-30)/120,1);

	movement_vector=find_unit(movement_vector);
	movement_vector[0]*=magnitude;
	movement_vector[1]*=magnitude;
	return movement_vector;
}

document.body.addEventListener("mousedown",function() {
	firing=true;
});

document.body.addEventListener("mouseup",function() {
	firing=false;
});