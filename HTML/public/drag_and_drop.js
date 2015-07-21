var dragFile = true;

function allowDrop(ev) {
    ev.preventDefault();
}

var drag = function(e) {
    console.debug("Start drag");
    e.dataTransfer.setData("text", e.target.parentNode.id);
    e.dataTransfer.setData("mouseX", e.pageX - e.target.parentNode.offsetLeft);
    e.dataTransfer.setData("mouseY", e.pageY - e.target.parentNode.offsetTop);
    console.debug( e.pageX - e.target.offsetLeft);
    dragFile = false;
}

function drop(ev) {
    if(dragFile){
        FileSelectHandler(ev);
        return;
    }
    ev.preventDefault();
    console.debug("Token dropped");
    var data = ev.dataTransfer.getData("text");
    dragFile = true;
    var dom = document.getElementById(data);
    dom.style.position = "absolute";
    
    var left = ev.pageX - ev.dataTransfer.getData("mouseX");
    var top = ev.pageY - ev.dataTransfer.getData("mouseY");
    dom.style.left = left;
    dom.style.top = top;
   
    var hash = {"f": "update", "id": data, "attr":{".style.left":left, ".style.top":top, ".style.position":"absolute"}};
    connection.send(JSON.stringify(hash));
}