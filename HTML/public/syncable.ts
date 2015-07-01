class Syncable{
    constructor(public className : string, public syncList : string[]){
        this.syncList = syncList;
        this.className = className;
    }
    
    to_json(){
        var j = {};
        j["classname"] = this.className;
        for(var key in this.syncList){
            var name = this.syncList[key];
            j[name] = eval(name);
        }
        j["f"] = "addSync";
        return j;
    }
    
    from_json(json){
        console.debug(json);
        for(var key in this.syncList){
            var name = this.syncList[key];
            console.debug(name + " = " + json[name.toString()]);
            eval(name + " = \"" + json[name.toString()] + "\"");
        }
    }
    
}