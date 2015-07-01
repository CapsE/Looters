class Field{  
    img;
    
    constructor(public x, public y, public src : string){
        this.img = document.createElement("img");
        this.img.style.width = "110px";
        this.img.style.height = "100px";
        this.img.style.position = "absolute";
        this.img.id = "field_" + x.toString() + "/" + y.toString();
        
        if(x%2 == 0){         
            this.img.style.top = (y * 104 + offset).toString() + "px";
        }else{    
            this.img.style.top = (y * 104 - 50 + offset).toString() + "px";
        }
        
        this.img.style.left = (x * 90 + offset).toString() + "px";

        this.img.src = src;
        document.getElementById("map").appendChild(this.img);
    }

    changeBg(color){
       this.img.style.backgroundColor = color;
    }
    
    changeSrc(src){
        this.img.src = src;
    }

};

var map = [];
var offset = 200;
var connection;
var idCount = 0;

function init(){    
    for(var x = 0; x < 15; x++){
        map[x] = [];
        for(var y = 0; y < 15; y++){
            map[x][y] = new Field(x,y, "field.png");
            //var colors = ["wald.png", "wiese.png", "berg.png"];
            //var c = colors[Math.floor((Math.random() * 3) + 0)];
            //map[x][y].changeSrc(c);
        } 
    }
    map[7][7].changeSrc("stadt.png");
    connection = new WebSocket('ws:' + self.location.hostname + ':4242');
    
    // When the connection is open, send some data to the server
    connection.onopen = function () {
      connection.send(JSON.stringify({"msg":"#moinmoin"}));
    };

    // Log errors
    connection.onerror = function (error) {
      console.log('WebSocket Error ' + error);
    };

    // Log messages from the server
    connection.onmessage = function (e) {
        console.log('Server: ' + e.data);
        var json = JSON.parse(e.data);
        parse(json);
    };
}

function parse(msg){
    switch(msg["f"]){
    case "idCount":
        idCount = msg["count"];
        break;
    case "changeSrc":
        map[msg["x"]][msg["y"]].changeSrc(msg["src"]);
        break;
    }
}
