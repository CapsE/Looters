/*
    public
    syncs: Ein Hash mit Hashes. Enthält alle synchronisierten Elemente als Hash gespeichert hinter einem Zeitstempel als Key
    connection: Die Websocket Connection
    
    init(): Startet den Websocket
    parse(String): Bearbeitet ankommende Socket-Nachrichten
    CreateDom(Hash): Erzeugt ein DOM-Element aus einem Hash
    UpdateDom(Hash): Verändert ein DOM-Element mit einem Hash
    Sync(Hash): Sendet das Hash an alle Clients und ruft dort CreateDom auf
    FileSelectHandler(event): Behandelt gedroppte Files
    controlDelete(): Löscht das geklickte Element
    ToggleEditMode(): Blendet die Control Elemente beim Mouseover ein.
*/

var syncs = {};
var connection;

function init() {    
    //document.getElementById("main").addEventListener("drop", FileSelectHandler, false);
   
    var address = self.location.hostname;
    if(!address){
        address = "127.0.0.1";
    }
    connection = new WebSocket('ws:' + address + ':4242');

    // When the connection is open, send some data to the server
    connection.onopen = function () {
        connection.send(JSON.stringify({ "msg": "#moinmoin" }));
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
    
   checkUserCookie();
    
}

function parse(msg) {
    switch (msg["f"]) {

        case "sync":
            syncs[msg["id"]] = msg;
            CreateDom(msg);
            break;
            
        case "update":
            UpdateDom(msg);
            break;
            
        case "delete":
            var e = document.getElementById(msg["id"]);
            e.parentElement.removeChild(e);
            break;
        case "login":
            
            if(msg["success"] == "true"){
                //Logged in
                document.getElementById("login").innerHTML = "<h1>Welcome " + msg["name"] + "</h1>";
                USER = msg["name"];
                setCookie("user", msg["name"], 360);
                setTimeout(function(){ document.getElementById("loginHolder").style.display = "none"; }, 2000);
            }else if(msg["success"] == "register"){
                //Registriert
                document.getElementById("login").innerHTML = "<h1>User created</h1>";
                USER = msg["name"];
                setCookie("user", msg["name"], 360);
                setTimeout(function(){ document.getElementById("loginHolder").style.display = "none"; }, 2000);
            }else{
                //Falsches PW
                document.getElementById("login").innerHTML += "<h3>Wrong password</h3>";
            }
            break;
    }
}

function CreateDom(msg){
    var newDom;
    var control = document.getElementById("control").cloneNode(true);
    if(msg["domType"]){
        newDom = document.createElement(msg["domType"]);
    }else{
        newDom = document.createElement("img");
    }
    
    //Set Attributes of the new Dom-Element
    if(msg["domAttr"]){
        var attr = msg["domAttr"];
        var keys = Object.keys(attr);
        for(var i = 0; i < keys.length; i++){
            try{
                var s = "control" + keys[i] + " = " + attr[keys[i]];
                eval(s);
            }catch(err){
                var s = "control" + keys[i] + " = \"" + attr[keys[i]] + "\"";
                eval(s);
            }

        }
    }
    
    if(msg["attr"]){
        var attr = msg["attr"];
        var keys = Object.keys(attr);
        for(var i = 0; i < keys.length; i++){
            try{
                var s = "newDom" + keys[i] + " = " + attr[keys[i]];
                eval(s);
            }catch(err){
                var s = "newDom" + keys[i] + " = \"" + attr[keys[i]] + "\"";
                eval(s);
            }

        }
    }

    //Convert Functions back from strings
    if(msg["domFunc"]){
        var funcs = Object.keys(msg["domFunc"]);
        for(var i = 0;  i < funcs.length; i++){
            eval("var f = " + msg["domFunc"][funcs[i]]);
            var s = "newDom" + funcs[i] + " = f";
            eval(s);
        }
    }
    
    control.appendChild(newDom);
    //Get an ID if none is given
    if(msg["id"]){
        control.id = msg["id"];
        newDom.id = msg["id"] + "_main";
    }else{
        control.id = getId();
        newDom.id = control.id + "_main";
    }
    
    //Create Control by Default
    if(msg["control"] != false){
        msg["control"] = true;
    }
    
    if(msg["parent"]){
        console.debug("Partent: " + msg["parent"]);
        if(msg["control"]){
            document.getElementById(msg["parent"]).appendChild(control);
        }else{
            document.getElementById(msg["parent"]).appendChild(newDom);
        }
    }else{
        if(msg["control"]){
            document.getElementById("main").appendChild(control);
        }else{
            document.getElementById("main").appendChild(newDom);
        }
    }
    
    //Create Child-Objects
    if(msg["children"]){
        var children = msg["children"];
        for(var i=0; i < children.length; i++){
            children[i]["parent"] = newDom.id;
            CreateDom(children[i]);
        }
    }
    return control;
}

function UpdateDom(msg){
    var newDom = document.getElementById(msg["id"]);
    
    //Set Attributes of the new Dom-Element
    if(msg["attr"]){
        var attr = msg["attr"];
        var keys = Object.keys(attr);
        for(var i = 0; i < keys.length; i++){
            try{
                var s = "newDom" + keys[i] + " = " + attr[keys[i]];
                eval(s);
            }catch(err){
                console.debug(newDom);
                var s = "newDom" + keys[i] + " = \"" + attr[keys[i]] + "\"";
                eval(s);
            }

        }
    }
    
    //Convert Functions back from strings
    if(msg["domFunc"]){
        var funcs = Object.keys(msg["domFunc"]);
        for(var i = 0;  i < funcs.length; i++){
            eval("var f = " + msg["domFunc"][funcs[i]]);
            var s = "newDom" + funcs[i] + " = f";
            eval(s);
        }
    }
    
    if(msg["children"]){
        var children = msg["children"];
        for(var i=0; i < children.length; i++){
            UpdateDom(children[i]);
        }
    }
}

//Sync the given parameters with the server.
function Sync(obj){
    if(!obj["id"]){
        obj["id"] = getId();
    }
    //Convert Functions to strings for transportation
    /*if(obj["domFunc"]){
        var funcs = Object.keys(obj["domFunc"]);
        for(var i = 0;  i < funcs.length; i++){
            obj["domFunc"][funcs[i]] = obj["domFunc"][funcs[i]].toString();
        }
    }
    */
    prepareFunctions(obj);

    obj["f"] = "sync";
    syncs[obj["id"]] = obj;
    connection.send(JSON.stringify(obj));
}

//Convert Functions to strings for transportation
function prepareFunctions(obj){
    if(obj["domFunc"]){
        var funcs = Object.keys(obj["domFunc"]);
        for(var i = 0;  i < funcs.length; i++){
            obj["domFunc"][funcs[i]] = obj["domFunc"][funcs[i]].toString();
        }
    }
    if(obj["children"]){
        for(var i = 0; i < obj["children"].length; i++){
            prepareFunctions(obj["children"][i]);
        }
    }
}

//Handle dropped Files
function FileSelectHandler(e){
    e.preventDefault();

    // fetch FileList object
    var files = e.target.files || e.dataTransfer.files;
    console.debug(files);

    // process all File objects
    for (var i = 0, file; file = files[i]; i++) {
            var extension = file.name.split(".").pop();
            if( extension == "json"){
                var newDom;
                var reader = new FileReader();
                reader.onload = function(e) {
                    // get file content and Execute it
                    var text = e.target.result;
                    eval(text);
                    if(newDom){
                        CreateDom(newDom);
                    }
                }
                reader.readAsText(file);
            }else if(extension == "png" || extension == "jpg" || extension == "svg"){
                
                var newDom = TOKEN("/loading.gif");
                CreateDom(newDom);
                Sync(newDom);
                sendFileToServer(file, newDom["id"]);
            }

    }
}

function sendFileToServer(file, id){
    var uploadURL = "http://" + window.location.hostname + ":4242/upload"; //Upload URL
    var formData = new FormData();
    formData.append('file', file);
    
    //var extraData ={"user":USER}; //Extra Data.
    formData.append('user',USER);
    var jqXHR=$.ajax({
        url: uploadURL,
        type: "POST",
        contentType:false,
        processData: false,
        cache: false,
        data: formData,
        success: function(data){
            document.getElementById(id + "_main").src = "/uploads/" + USER + "/" + file.name;
            var hash = {"f": "update", "id": id, "attr":{".src": "/uploads/" + USER + "/" + file.name}};
            connection.send(JSON.stringify(hash));
            //$("#status1").append("File upload Done<br>");           
        }
    }); 
 
}

function handleDragOver(evt) {

    evt.preventDefault();

}

//Delete an added Object
function controlDelete(){
    var control = event.target.parentElement;
    if(control.id){
        connection.send(JSON.stringify({"f":"delete", "id":control.id}));
    }
    control.parentElement.removeChild(control);                    
}

//Get a new ID for syncing
var lastId = 0;
function getId(){
    var d = new Date().getTime();
    if(d == lastId){
        d+=1;
    }
    lastId = d;
    return d;
}

function ToggleEditMode(state){
    if(state){
        var x = document.getElementsByClassName("control");
        var l = x.length
        for(var i = 0; i < l; i++){
            x[0].className = "control_edit";
        }
    }else{
        var x = document.getElementsByClassName("control_edit");
        var l = x.length
        for(var i = 0; i < l; i++){
            x[0].className = "control";
        }
    }
    
}
