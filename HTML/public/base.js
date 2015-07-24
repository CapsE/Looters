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

function COUNTER(caption, value){
    var oc = function(e){
        var hash = {"id":e.target.id, "f":"update", "attr":{".value":e.target.value}};
        connection.send(JSON.stringify(hash));
    }
    var counter_caption = {
        "id":getId().toString() + "_caption",
        "attr":{
                ".draggable":false,
                ".style.float":"left",
                ".style.padding":"5px"
               },
        "domFunc":{".onchange":oc},
        "control":false
    };
    
    if(caption){
        counter_caption["domType"] = "div";
        counter_caption["attr"][".innerHTML"] = caption;
    }else{
        counter_caption["domType"] = "input";
    }

    var counter_value = {
        "id":getId().toString() + "_value",
        "domType":"input",
        "attr":{
                ".draggable":false,
                ".style.float":"right"
               },
        "domFunc":{".onchange":oc},
        "control":false
    };
    
    if(value){
        counter_caption["attr"][".value"] = value;
    }

    var parent = {
        "id":getId(),
        "domType":"div",
        "attr":{
               ".style.padding":"5px"
        },
        "children":[counter_caption, counter_value],
        "domFunc":{".ondragstart":drag}
    };
    
    return parent;
}

function MakeDraggable(obj){
    if(!obj["domFunc"]){
        obj["domFunc"] = {};
    }
    if(!obj["attr"]){
        obj["attr"] = {};
    }
    obj["domFunc"][".ondragstart"] = drag;
    obj["attr"][".draggable"] = true;
    return obj;
}