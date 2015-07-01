class Token extends Syncable{
    img;
    field : Field;
    id : string;
    
    constructor(public x? : number, public y? : number, public src? : string){
        super("Token", ["this.img.style.left","this.img.style.top","this.img.style.width","this.img.style.height","this.img.style.display", "this.img.src", "this.x", "this.y"]);
        x = x || 0;
        y = y || 0;
        src = src || "none";
        this.img = document.createElement("img");
        this.img.style.position = "absolute";
        
        this.img.style.left = x.toString() + "px";
        this.img.style.top = y.toString() + "px";

        this.img.src = src;
        this.img.draggable = true;
        
        this.img.addEventListener('dragstart', function(event) {
            var id = event.target.dataset.id;
            token[id].field.removeFrom(this);
            token[id].drag(event);
        }, false);
        
       this.img.ondrop = function(ev){
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            var id = ev.target.dataset.id;

            token[id].field.placeOn(token[data]);
        };
        this.img.ondragover = function(ev){allowDrop(ev)};
        
        document.getElementById("token").appendChild(this.img);      
    }
    
    setId(id : string){
        this.id = id;
        this.img.dataset.id = id;
    }
    
    setSrc(src : string){
        this.img.src = src;
    }
    
    setPosition(x : number, y : number){
        this.img.style.left = x.toString() + "px";
        this.img.style.top = y.toString() + "px";
    }
    
    setSize(w : number, h : number){
        this.img.style.width = w.toString() + "px";
        this.img.style.height = h.toString() + "px";
    }
    
    setField(field : Field){
        this.field = field;
    }
    
    drag(ev){
        ev.dataTransfer.setData("text", this.id);
    }
}