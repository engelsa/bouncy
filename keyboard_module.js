var print=document.getElementById("print");
var firing=false;

var keys=[];
for (var x=0;x<222;x++) {
	keys[x]=false;
}

function parse_input_vector() {
	var movement_vector=[0,0];
	var magnitude=0;
	if (keys[33]) {
		movement_vector[0]++;
		movement_vector[1]--;
	}
	if (keys[34]) {
		movement_vector[0]++;
		movement_vector[1]++;
	}
	if (keys[35]) {
		movement_vector[0]--;
		movement_vector[1]++;
	}
	if (keys[36]) {
		movement_vector[0]--;
		movement_vector[1]--;
	}
	if (keys[37]) {
		movement_vector[0]--;
	}
	if (keys[38]) {
		movement_vector[1]--;
	}
	if (keys[39]) {
		movement_vector[0]++;
	}
	if (keys[40]) {
		movement_vector[1]++;
	}
	if (keys[49]) {
		movement_vector[0]--;
		movement_vector[1]++;
	}
	if (keys[50]) {
		movement_vector[1]++;
	}
	if (keys[51]) {
		movement_vector[0]++;
		movement_vector[1]++;
	}
	if (keys[52]) {
		movement_vector[0]--;
	}
	if (keys[54]) {
		movement_vector[0]++;
	}
	if (keys[55]) {
		movement_vector[0]--;
		movement_vector[1]--;
	}
	if (keys[56]) {
		movement_vector[1]--;
	}
	if (keys[57]) {
		movement_vector[0]++;
		movement_vector[1]--;
	}
	if (keys[65]) {
		movement_vector[0]--;
	}
	if (keys[68]) {
		movement_vector[0]++;
	}
	if (keys[83]) {
		movement_vector[1]++;
	}
	if (keys[87]) {
		movement_vector[1]--;
	}
	if (keys[97]) {
		movement_vector[0]--;
		movement_vector[1]++;
	}
	if (keys[98]) {
		movement_vector[1]++;
	}
	if (keys[99]) {
		movement_vector[0]++;
		movement_vector[1]++;
	}
	if (keys[100]) {
		movement_vector[0]--;
	}
	if (keys[102]) {
		movement_vector[0]++;
	}
	if (keys[103]) {
		movement_vector[0]--;
		movement_vector[1]--;
	}
	if (keys[104]) {
		movement_vector[1]--;
	}
	if (keys[105]) {
		movement_vector[0]++;
		movement_vector[1]--;
	}
	movement_vector=find_unit(movement_vector);
	return movement_vector;
}

addEventListener("keydown",function(event) {
	keys[event.keyCode]=true;
	if (event.keyCode===32) {
		firing=true;
	}
});

addEventListener("keyup",function(event) {
	keys[event.keyCode]=false;
	if (event.keyCode===32) {
		firing=false;
	}
});