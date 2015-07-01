function TOKEN(src){
    
    var newDom = {
    "id":getId(),
    "domType":"img",
    "attr":{".src":src,
            ".style.cursor":"move",
            ".draggable":true,
            ".style.width":"100px",
            ".style.height":"100px"
           },
    "domAttr":{
        ".style.zIndex":100
    },
    "domFunc":{".ondragstart":drag}};
    
    return newDom;
}