var Syncable = (function () {
    function Syncable(className, syncList) {
        this.className = className;
        this.syncList = syncList;
        this.syncList = syncList;
        this.className = className;
    }
    Syncable.prototype.to_json = function () {
        var j = {};
        j["classname"] = this.className;
        for (var key in this.syncList) {
            var name = this.syncList[key];
            j[name] = eval(name);
        }
        return JSON.stringify(j);
    };

    Syncable.prototype.from_json = function (json) {
        json = JSON.parse(json);
        console.debug(json);
        for (var key in this.syncList) {
            var name = this.syncList[key];
            console.debug(name + " = " + json[name.toString()]);
            eval(name + " = \"" + json[name.toString()] + "\"");
        }
    };
    return Syncable;
})();
