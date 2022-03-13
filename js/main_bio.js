// Variables for Name Display
let word = []; 
let letters = [];
let dummyCircles = []; 
//

let Particles = [];
let num = 150;

let mouseV;

function setup() {

	createCanvas(windowWidth, windowHeight);
 	background (0); 
	angleMode(DEGREES);
	setupName();
	setupParticles();

}

function draw(){
 	background (0); 
 	mouseV = createVector(mouseX,mouseY);
 	updateName();
 	updateParticles();
 	}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function onScreen(v){
	return v.x >= 0 && v.x <= windowWidth && v.y >= 0 && v.y <= windowHeight;
}

function behindText(v){
	return v.x >= windowWidth/6 && v.x < windowWidth - windowWidth/6;
}

function setupName(){
	word[0] = 'J';
	word[1] = 'O';
	word[2] = 'E';
	word[3] = 'L';
	word[4] = 'S';
	word[5] = 'C';
	word[6] = 'H';
	word[7] = 'A';
	word[8] = 'E';
	word[9] = 'F';
	word[10] = 'E';
	word[11] = 'R';

// Init "JLetter" Objects
	for (var i = 0; i< word.length; i++){
		letters[i] = new JLetter(word[i]);	
		letters[i].setScale(0.6);
		letters[i].setPosition(windowWidth/1.4+59*i,75);
		dummyCircles.push(createVector(windowWidth/2.5+33*i,40)); // Helping Objects for properly working distance function 
	}

// Position Kalibration For Better Look 
	letters[3].setOffset(-17,0);
	letters[5].setOffset(-5,0);
	letters[6].setOffset(-15,0);
	letters[7].setOffset(-25,0);
	letters[8].setOffset(-28,0);
	letters[9].setOffset(-40,0);
	letters[10].setOffset(-55,0);
	letters[11].setOffset(-75,0);
}

function updateName(){
 		for (let i = 0; i< word.length; i++){
		angleMode(DEGREES);
		push();	
			letters[i].setStrokeColor(300-constrain(dummyCircles[i].dist(mouseV),0,300)+125);
			letters[i].checkDistance2Actor(mouseX,mouseY);
			letters[i].visualize();
		pop();
	}
}

function setupParticles(){
	//  init Particles 
	for(let i = 0; i< num;i++){
		Particles[i] = new Particle();
		if(random(1.0)>= 0.5){
			Particles[i].setPosition(createVector(random(windowWidth/3),random(windowHeight)));
		} else {
			Particles[i].setPosition(createVector(random(windowWidth-windowWidth/3,windowWidth),random(windowHeight)));
		}

		Particles[i].setNoiseMult(1);
	}
}

function updateParticles(){
	angleMode(RADIANS);
	for(let i = 0; i<Particles.length;i++){
		//stroke(650-dist(Particles[i].getPosition().x,Particles[i].getPosition().y,mouseV.x,mouseV.y));
		Particles[i].update(Particles);
		if(!onScreen(Particles[i].getPosition()) || behindText(Particles[i].getPosition())){ 	
			Particles[i].setPosition(createVector(random(windowWidth),random(windowHeight)));		
		}
		if(mouseV.dist(Particles[i].getPosition()) < 120){
			Particles.forEach(element =>{
			let dis = Particles[i].getPosition().dist(element.getPosition()); 
      		if(dis>20 && dis<105) {      			
					stroke(225-mouseV.dist(Particles[i].getPosition()));
					Particles[i].drawLines(element.getPosition()); // ToDo - Limit Number Of Connections per Particle 4 Performance
      			} 
			})
		} 
	}
}
