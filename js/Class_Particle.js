class Particle extends Objective{
	constructor(){
    super()

	
    this.vel = createVector(0,0);
    this.acc = createVector(0,0);
    this.maxForce = 0.3;
    this.maxSpeed = 0.5;
    this.noiseScale = 0.02; 
    this.noiseMult = 1; 
    
}

	update(_allParticles){
		point(this.pos.x,this.pos.y);

		this.computeForces();
		this.move();
		
	} // Update End 

	setNoiseMult(_Mult){
		this.noiseMult = _Mult;
	}

	getNoiseMult(){
		return this.noiseMult;
	}

	computeNoiseForce(){
		angleMode(RADIANS);
		let n = noise(this.pos.x*this.noiseScale,this.pos.y*this.noiseScale);
		let a = TAU * n ;
		return createVector(cos(a)* this.noiseMult,sin(a)* this.noiseMult);
	}

	computeForces(){
		this.applyForce(this.computeNoiseForce());
	}

	
	applyForce(_Force){
		this.acc.add(_Force);
	}

	move(){
		this.acc.mult(this.maxForce);
    	this.vel.add(this.acc);
    	this.vel.limit(this.maxSpeed);
    	this.pos.add(this.vel);


	}

	drawLines(_target){
		push();
        strokeWeight(0.1);
        line(this.pos.x,this.pos.y,_target.x,_target.y);
      	pop();
	} // Draw Lines End


}