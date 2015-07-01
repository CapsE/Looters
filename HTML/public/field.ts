class Field{  
    img : any;    
    tokens : Array<Token>;
    
    constructor(public x : number, public y : number, public src : string){
        this.tokens = [];
        this.img = document.createElement("img");
        this.img.style.width = "110px";
        this.img.style.height = "100px";
        this.img.style.position = "absolute";
        this.img.id = "field_" + x.toString() + "/" + y.toString();
        this.img.dataset.idX = x;
        this.img.dataset.idY = y;
        
        if(x%2 == 0){         
            this.img.style.top = (y * 104 + offset).toString() + "px";
        }else{    
            this.img.style.top = (y * 104 - 50 + offset).toString() + "px";
        }
        this.img.style.left = (x * 90 + offset).toString() + "px";

        this.img.src = src;
        
        this.img.ondrop = function(ev){
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            var idX = ev.target.dataset.idX;
            var idY = ev.target.dataset.idY;

            map[idX][idY].placeOn(token[data]);
        };
        
        this.img.ondragover = function(ev){allowDrop(ev)};
        document.getElementById("map").appendChild(this.img);
    }
    
    changeSrc(src){
        this.img.src = src;
    }
    
    placeOn(obj){   
        this.tokens.push(obj);
        var mx = pxToInt(this.img.style.left);
        var my = pxToInt(this.img.style.top);
        var width = pxToInt(this.img.style.width) / this.tokens.length;
        
        for(var i = 0; i < this.tokens.length; i++){
            this.tokens[i].setPosition(mx + i*width, my);
            connection.send(JSON.stringify({"f":"TsetPosition", "id":this.tokens[i].id, "x":mx + i*width, "y":my}));
            this.tokens[i].setSize(width,width);
            connection.send(JSON.stringify({"f":"TsetSize", "id":this.tokens[i].id, "w":width, "h":width}));
            this.tokens[i].setField(this);
            connection.send(JSON.stringify({"f":"TsetField", "id":this.tokens[i].id, "fieldIdX":this.x, "fieldIdY":this.y}));
        }    
        
    }
    
    removeFrom(obj){
        var index = this.tokens.indexOf(obj);
        if(index){
            this.tokens.splice(index, 1);
        }
    }

};


