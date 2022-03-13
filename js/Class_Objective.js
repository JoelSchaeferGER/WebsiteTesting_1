//Inherits from "JObject.js"

class Objective extends JObject {
  constructor(){
   super()   
    this.isTarget= false;
    }

    setIsTarget(_BoolValue){
      this.isTarget = _BoolValue;
    }

    getIsTarget(){
      return this.isTarget;
    }

    visualize(){
    rect(this.pos.x,this.pos.y,40,40);
    }


  }