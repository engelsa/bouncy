//alert("hey");

var objects=[];

var square=document.getElementById("square");
var print=document.getElementById("print");

var sentients=document.getElementsByName("sentient");
var projectiles=[];

var turn_speed=30;

var launch_tick=0;
var spawn_tick=0;
var difficulty=1;

var score_label=document.getElementById("score");
score_label.style.zIndex="30";
score_label.style.position="absolute";
var spawn_points=[[0,window.innerHeight/2-25,180],[window.innerWidth/2-25,0,270],[window.innerWidth/2-25,window.innerHeight-50,90],[window.innerWidth-50,window.innerHeight/2-25,0]];

var film=document.getElementById("film");

film.style.position="absolute";
film.style.top="0px";
film.style.left="0px";
film.style.width=window.innerWidth+"px";
film.style.height=window.innerHeight+"px";

objects.push(square);
for (var x=0;x<sentients.length;x++) {
	objects.push(sentients[x]);
}

for (var x=0;x<objects.length;x++) {
	objects[x].style.position="absolute";
	objects[x].style.left="100px";
	objects[x].style.top="100px";
	objects[x].movement_vector=[0,0];
	objects[x].current_position=[500,500];
	objects[x].current_rotation=270;
	objects[x].health=5;
	objects[x].size=[50,50];
	objects[x].style.zIndex="2";
}

square.current_position=[window.innerWidth/2-25,window.innerHeight/2-25];

function make_wall(pos_x,pos_y,size_x,size_y) {
	var wall=document.createElement("img");
	wall.setAttribute("src","wall.png");
	wall.style.position="absolute";
	wall.style.top=pos_y+"px";
	wall.style.left=pos_x+"px";
	wall.style.width=size_x+"px";
	wall.style.height=size_y+"px";
	wall.style.zIndex="0";
	wall.name="wall";
	document.body.appendChild(wall);
}

make_wall(0,0,50,window.innerHeight/2-50);
make_wall(0,window.innerHeight/2+50,50,window.innerHeight/2-50);
make_wall(0,0,window.innerWidth/2-50,50);
make_wall(0,window.innerHeight-50,window.innerWidth/2-50,50);
make_wall(window.innerWidth/2+50,0,window.innerWidth/2-50,50);
make_wall(window.innerWidth/2+50,window.innerHeight-50,window.innerWidth/2-50,50);
make_wall(window.innerWidth-50,0,50,window.innerHeight/2-50)
make_wall(window.innerWidth-50,window.innerHeight/2+50,50,window.innerHeight/2-50)

function set_position(object) {
	if (Math.abs(object.movement_vector[0])+Math.abs(object.movement_vector[1])>0) {
		var desired_rotation=(Math.atan2(-object.movement_vector[1],-object.movement_vector[0]))/Math.PI*180;
	
		if (desired_rotation>object.current_rotation+180) {
			desired_rotation=desired_rotation-360;
		}
		else if (object.current_rotation>desired_rotation+180) {
			object.current_rotation=object.current_rotation-360;
		}
		object.current_rotation=(object.current_rotation+(desired_rotation-object.current_rotation)/turn_speed+360)%360;
		object.style.transform="rotate("+Math.floor(object.current_rotation+90.5)+"deg)";
	}
	cancel_collisions(object,objects);
	object.current_position[0]+=object.movement_vector[0];
	object.current_position[1]+=object.movement_vector[1];
	object.style.left=object.current_position[0]+"px";
	object.style.top=object.current_position[1]+"px";
}


function move_projectile(projectile,pos) {
	var cancel=cancel_collisions(projectile,objects);
	projectile.current_position[0]+=projectile.movement_vector[0];
	projectile.current_position[1]+=projectile.movement_vector[1];
	projectile.style.left=projectile.current_position[0]+"px";
	projectile.style.top=projectile.current_position[1]+"px";
	if (cancel || projectile.bounces>5) {
		projectile.parentNode.removeChild(projectile);
		projectiles.splice(pos,1);
	}
}


function launch() {
	var projectile=document.createElement("img");
	projectile.setAttribute("src","projectile_0.png");
	projectile.style.position="absolute";
	projectile.style.top="100px";
	projectile.style.left="100px";
	projectile.style.width="10px";
	projectile.style.height="10px";
	projectile.style.zIndex="0";
	projectile.name="projectile";
	projectile.size=[10,10];
	projectile.bounces=0;
	projectile.debounce=false;
	projectile.current_position=[square.current_position[0]+square.size[0]/2,square.current_position[1]+square.size[1]/2];
	projectile.movement_vector=[-Math.cos((square.current_rotation)/180*Math.PI)*2,-Math.sin((square.current_rotation)/180*Math.PI)*2];
	projectile.current_rotation=square.current_rotation;
	projectile.style.transform="rotate("+Math.floor(projectile.current_rotation+90.5)+"deg)";
	document.body.appendChild(projectile);
	projectiles.push(projectile);
}

function loop() {
	if (firing && launch_tick>=30) {
		launch_tick=0;
		launch();
	}
	if (spawn_tick>=200/difficulty && sentients.length<=difficulty/5) {
		spawn_tick=0;
		var sentient=document.createElement("img");
		var spawn_point=spawn_points[Math.floor(Math.random()*4)];
		sentient.setAttribute("src","sentient.png");
		sentient.style.position="absolute";
		sentient.style.left="0px";
		sentient.style.top="0px";
		sentient.style.width="50px";
		sentient.style.height="50px";
		sentient.movement_vector=[0,0];
		sentient.current_position=[spawn_point[0],spawn_point[1]];
		sentient.current_rotation=spawn_point[2];
		sentient.size=[50,50];
		sentient.style.zIndex="2";
		sentient.name="sentient";
		sentient.health=5;
		document.body.appendChild(sentient);
		objects.push(sentient);
		sentients.push(sentient);
	}
	square.movement_vector=parse_input_vector([square.current_position[0]+square.size[0]/2,square.current_position[1]+square.size[1]/2]);
	for (var x=0;x<sentients.length;x++) {
		var chase_vector=[square.current_position[0]-sentients[x].current_position[0],square.current_position[1]-sentients[x].current_position[1]];
		sentients[x].movement_vector=find_unit(chase_vector);
		sentients[x].movement_vector[0]*=.5;
		sentients[x].movement_vector[1]*=.5;
	}
	for (var x=0;x<projectiles.length;x++) {
		move_projectile(projectiles[x],x);
	}
	for (var x=0;x<objects.length;x++) {
		if (objects[x].health<=0) {
			objects[x].parentNode.removeChild(objects[x]);
			objects.splice(x,1);
			difficulty++;
		}
		set_position(objects[x]);
	}
	launch_tick++;
	spawn_tick++;
	score_label.innerHTML="Score: "+score;
}


setInterval(loop,4);