/// <reference path="syncable.ts" />
/// <reference path="field.ts" />
/// <reference path="token.ts" />
/// <reference path="general.ts" />

var map = [];
var token = {};
var syncs = {};
var syncStack = [];
var syncCounter = 0;
var offset = 200;
var connection;
var idCount = 0;

var test;

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
        test = new Token(50,50, "Test.png");
        Sync(test);
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
        //connection.send(JSON.stringify({"f":"join", "id":idCount}));
        break;
    case "changeSrc":
        map[msg["x"]][msg["y"]].changeSrc(msg["src"]);
        break;
    case "join":
        var t = new Token(500,500, "player" + msg["id"].toString() + ".png");
        
        token["Player_" + msg["id"].toString()] = t;
        t.setId("Player_" + msg["id"].toString());
        map[7][7].placeOn(t);
        break;
    case "sync":
        var className = msg["className"];
        
        var ins = eval("new " + className + "()");
        ins.from_json(msg);
        token[msg["syncId"]] = ins;
        break;
    case "syncAnswer":
        sync(msg["syncId"]);
        break;
    case "TsetSize":
        token[msg["id"]].setSize(msg["w"], msg["h"]);
        break;
    case "TsetPosition":
        token[msg["id"]].setPosition(msg["x"], msg["y"]);
        break;
    case "TsetField":
        token[msg["id"]].setField(map[msg["fieldIdX"]][msg["fieldIdY"]]);
        break;
    }
}

function sendDom(element){
    var j = {};
    j["type"] = element.img.nodeType;

}

function Sync(s : Syncable){
    syncStack.push(s);
    connection.send(JSON.stringify({"f":"syncReq"}));
}

function sync(id){
    var j = syncStack.pop().to_json();
    j["syncId"] = id;
    connection.send(JSON.stringify(j));
}