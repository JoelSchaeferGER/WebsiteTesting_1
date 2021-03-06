// MainPage
// ------------------------------------------------------------------
// Object Variables
let dna1;
let Objectives = [];
let Creatures = [];

// Number of Particles 
let num = 150;

// Variables for Name Display
let word = []; 
let letters = [];
let dummyCircles = []; 

// Vector Variable - Mouse Position 
let mouseV;

// Particle Array
let Particles = [];

// Ease Function Object 
let eas;

// Portal Stuff 
let xoff = 0.0;
let yoff = 0.0;
let portalWeightOffsets = [];
let portalAngleOffsets = [];
let portalElements = 40;
let animSpeed = 0.2;
let hoverOffset = 0;
let midButtonFill = 20; 
let n;
let n2;
let lerpAlpha;
let nSampled;
let isLerpingToNewNoiseSeed = false;
let rotSpeed = 0;
let maxIndexHoverEffect = 2;
let isPortalAnimPlaying = false;
let isPortalActive = true;
let isPortalHovered = false;
let portalHoverAlpha = 0;
let t = 0;
let portalScale = 1;

// ------------------------------------------------------------------


function setup() {
// Init Canvas
	createCanvas(windowWidth, windowHeight);
// Setup Canvas  
 	background (0); 
	angleMode(DEGREES);
	eas = new p5.Ease();
	setupName();
	setupParticles();
	setupPortal();

// Event callback for hovering over Name (not used yet)
	uxNoFill();
	uxNoStroke();
	uxRect(windowWidth/2.5-30, 15, 420, 50).uxEvent('hover', hoverOverName);

//  init DNA (not used yet) // later use: pass into creature/particle classes for individualization of parameters // much later: for creature mating behaviour/evolutionary sim stuff (gene pass functions) 
	dna1 = new Dna(15);
  	dna1.generateGenes();

//  Objectives (not used yet) // later use: simple interacteable elements for creatures (static&dynamic)// for example: source of food, gathering places, ..
  	objective_1 = new Objective();
  	objective_2 = new Objective();
  	Objectives.push(objective_1);
  	Objectives.push(objective_2);
  	objective_1.setPosition(createVector(200,200));

// invisible Event Callback Areas // used for responsive fx inside Portal
	uxCircle(windowWidth/2,windowHeight/2,350,350).uxEvent('hover', unHoverPortal);
	uxCircle(windowWidth/2,windowHeight/2,60,60).uxEvent('hover', hoverPortal);	
	uxCircle(windowWidth/2,windowHeight/2,80,80).uxEvent('hover', unHoverPortalButton);
	uxCircle(windowWidth/2,windowHeight/2,15,15).uxEvent('hover', hoverPortalButton);
	uxCircle(windowWidth/2,windowHeight/2,30,30).uxEvent('click', portalButton);
}

// ------------------------------------------------------------------
// 
function draw() {
	background(0);
 	mouseV = createVector(mouseX,mouseY);
	updatePortal();
	updateName();
	updateParticles();
	updateCreatures(); // not working as intented yet // creatures targets closest particle but immediately target next one, therefore steering behaviour doesn't work // Target Functions net Rework // unintented Destruction of Particles after targeted by creature ( tho there is no particle.destroy function yet)



}

// ------------------------------------------------------------------

//Functions
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function mousePressed(){
	newNoiseSeed();
	createParticle();		
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

function createParticle(){
		let newParticle = new Particle();
		newParticle.setPosition(mouseV.add(random(-5,5),random(-5,5)));
		newParticle.setNoiseMult(random(-1,1));
		Particles.push(newParticle);	
}

function setupParticles(){
	//  init Particles 
	for(let i = 0; i< num;i++){
		Particles[i] = new Particle();
		Particles[i].setPosition(createVector(random(windowWidth),random(windowHeight)));
		if(random(1)>0.5){
			Particles[i].setNoiseMult(1);
		} else {
			Particles[i].setNoiseMult(-1);
		}
	}
}

function updateParticles(){
	angleMode(RADIANS);
	for(let i = 0; i<Particles.length;i++){
		stroke(650-dist(Particles[i].getPosition().x,Particles[i].getPosition().y,mouseV.x,mouseV.y));
		Particles[i].update(Particles);
		if(!onScreen(Particles[i].getPosition())){ 
			Particles[i].setNoiseMult(Particles[i].getNoiseMult()*-1);		
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

function createCreature(_Pos) {
	let newCreature = new Creature();
	newCreature.setPosition(_Pos);
	Creatures.push(newCreature);	
}

function updateCreatures(){
	noFill();
  	stroke(255);
	angleMode(DEGREES);

  	for(let i = 0; i<Creatures.length;i++){
  		Creatures[i].computeTarget(Particles); 
  		Creatures[i].aimTarget(); // not sure why Particles get destroyed on aim // no such function as particle.destroy() yet
  		Creatures[i].update();
  		for (let j = 0; j < Particles.length; j++) {
  			if(Creatures[i].getPosition().dist(Particles[j].getPosition()) < 75){ // && no Particle targeted atm 
  			Particles[j].setIsTarget(1);
  			} else {
  			Particles[j].setIsTarget(0);
  			}
  		}
  	} // As Mentioned Before, This and the corresponding Parts in the classes need Rework // multiple things in Targetting aren't working properly 
}

function onScreen(v){
	return v.x >= 0 && v.x <= windowWidth && v.y >= 0 && v.y <= windowHeight;
}

function hoverOverName() {
	
}

function newNoiseSeed(){
	if (!isLerpingToNewNoiseSeed) {
		sampleNoise(); // n -> sampledN
		isLerpingToNewNoiseSeed = true;
		lerpAlpha = 0;
		noiseSeed(random(9999)); // n = newValue
	}
}

function sampleNoise(){
	nSampled = n;
}

function lerpToNewNoiseSeed(_speed){ // gets called in PortalDisplay()
	lerpAlpha += 0.01*_speed;
}


// Portal Stuff // still very messy // later: moving into Portal Class

function setupPortal(){
	// Portal // init of Arrays of Offsets for visual Variation 
	for (var i = 0; i < portalElements; i++) {
		portalWeightOffsets[i] = random(2.0);
		portalAngleOffsets[i] = random(-2,5);
	}
}

function hoverPortalButton(){
	midButtonFill = 255;
}

function unHoverPortalButton(){
	midButtonFill = 20;
}

function hoverPortal(){
	isPortalHovered = true;
}

function unHoverPortal(){
	isPortalHovered = false;
}

function portalButton(){
startPortalAnimation();
}

function startPortalAnimation(){
	isPortalAnimPlaying = true;
}

function updatePortal(){
	if(isPortalActive){
		displayPortal();
		//rotSpeed = lerp(0,5,portalHoverAlpha);
		if(isPortalAnimPlaying){
		playPortalAnimation();
		} else {
		hoverOffset = lerp(0,150,portalHoverAlpha);
		maxIndexHoverEffect = lerp(2,10,portalHoverAlpha/2);
		if(isPortalHovered){
		portalHoverAlpha = constrain(portalHoverAlpha+0.04,0,1);
		} else if (!isPortalHovered){
		portalHoverAlpha = constrain(portalHoverAlpha-0.04,0,1);
		}
		}
	}
}

function playPortalAnimation(){
 t+=0.02*(deltaTime/50);

 if(t<5){
 maxIndexHoverEffect = map(eas.normalizedErf(constrain(t,0,1)),0,1,2,30);
 }


if(maxIndexHoverEffect >= 30 && t < 5){
	animSpeed = map(eas.quadraticIn(constrain(t,1,5)),1,5,0,2.5);
	rotSpeed = map(eas.quadraticIn(map(constrain(t,1,5),1,5,0,1)),0,1,0,22.5);
} else if( t >= 5){
	animSpeed = lerp(animSpeed, 0.1, map(constrain(t,5,7),5,7,0,1));
	rotSpeed = lerp(rotSpeed, 0.1, map(constrain(t,5,7),5,7,0,1));
}

if(frameCount%80==int(random(0,50)) && t>= 5.2){
	newNoiseSeed();
  
}

if(frameCount%10==1 && t>= 4.5){
	//newNoiseSeed();
	maxIndexHoverEffect -= 1;

} 

if (t>6.5 && t <8) {
	portalScale = map(eas.bounceInOut(map(constrain(t,7.5,8),7.5,8,0,1)),0,1,1,3.1);
} else if(t > 8){
		portalScale = map(eas.bounceInOut(map(constrain(t,8,9),8,9,0,1)),0,1,3.1,0.01);

}

if (t>=9){
	
	createCreature(createVector(windowWidth/2,windowHeight/2));
	isPortalActive = false;
}

	
}

function displayPortal(){
	push();
	noStroke();
	angleMode(DEGREES);
	translate(windowWidth/2,windowHeight/2);
	scale(portalScale);

	//scale(map(sin(frameCount*animSpeed*1.2%360),-1,1,0.75,1));
	for (var i = 0; i < 25; i++) {

		fill(-15+i*6);

	  circle(0,0,395-i*8);
	 } 
	pop();

push();
fill(0);
	noStroke();
	angleMode(DEGREES);

	translate(windowWidth/2,windowHeight/2);
	scale(portalScale);

	//scale(map(sin(frameCount*animSpeed*1.2%360),-1,1,0.75,1));

	  circle(windowWidth/2,windowHeight/2,195);

pop(); 
		push();
	angleMode(DEGREES);
	translate(windowWidth/2,windowHeight/2);
	scale(portalScale);

	//scale(map(sin(frameCount*animSpeed*1.2%360),-1,1,0,1));

	noStroke();
	for (var i = 0; i < 20; i++) {
		fill(135-i*9);
	  circle(0,0,195-i*8);

	  }
	pop();



	push();

	angleMode(DEGREES);
	translate(windowWidth/2,windowHeight/2);
	rotate(frameCount*animSpeed*2.2%360);
	scale(map(sin(frameCount*animSpeed*1.2%360),-1,1,3.95,4.15)*portalScale);

	noFill();
	xoff = xoff + 0.02 *(deltaTime/50);
	yoff = yoff + 0.02 *(deltaTime/50);

	n = noise(xoff*0.03,yoff*0.03) * 90;
 

  if(isLerpingToNewNoiseSeed){
  n2 = lerp(nSampled,n,lerpAlpha);
  lerpToNewNoiseSeed(7.5);	
  } else {
  n2 = n;	
  }

  if(lerpAlpha>1){
  	isLerpingToNewNoiseSeed = false;
  }
	

	for (var i = 0; i < portalWeightOffsets.length; i++) {

	  noFill();

		if(i < maxIndexHoverEffect){

		stroke(map(i,0,portalWeightOffsets.length,255,0)-hoverOffset,map(i,0,portalWeightOffsets.length,255,0)-hoverOffset,map(i,0,portalWeightOffsets.length,255,0));
	  } else {
		stroke(map(i,0,portalWeightOffsets.length,255,0));
	  }
		scale(0.98);

		strokeWeight(0.25+i*n2/90/12+portalWeightOffsets[i]);
		
		if(i < maxIndexHoverEffect){
		arc(0,0,5+5*i,5+5*i,n2*i+portalAngleOffsets[i]*10+(frameCount*rotSpeed),n2*i-180+portalAngleOffsets[i]*10+(frameCount*rotSpeed));

		} else {
		arc(0,0,5+5*i,5+5*i,n2*i+portalAngleOffsets[i]*10,n2*i-180+portalAngleOffsets[i]*10);
	 }
				stroke(map(i,0,portalWeightOffsets.length,155,0));

		strokeWeight(0.15+i/100/12+portalWeightOffsets[i]);

		if (i< maxIndexHoverEffect) {
		arc(0,0,7+5*i,7+5*i,n2*i+portalAngleOffsets[i]*10+(frameCount*-rotSpeed),n2*i-160+portalAngleOffsets[i]*10+(frameCount*-rotSpeed));

		} else{
		arc(0,0,7+5*i,7+5*i,n2*i+portalAngleOffsets[i]*10,n2*i-160+portalAngleOffsets[i]*10);
	  }
	}
	pop();

	push();
	translate(windowWidth/2,windowHeight/2);
	scale(portalScale);

	fill(10,10,midButtonFill);
	noStroke();
	circle(0,0,15);
	pop();
}



	
