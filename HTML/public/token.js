var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Token = (function (_super) {
    __extends(Token, _super);
    function Token(x, y, src) {
        _super.call(this, "Token", ["this.img.style.left", "this.img.style.top", "this.img.style.width", "this.img.style.height", "this.img.style.display", "this.img.src", "this.x", "this.y"]);
        this.x = x;
        this.y = y;
        this.src = src;
        this.img = document.createElement("img");
        this.img.style.position = "absolute";

        this.img.style.left = x.toString() + "px";
        this.img.style.top = y.toString() + "px";

        this.img.src = src;
        this.img.draggable = true;

        this.img.addEventListener('dragstart', function (event) {
            var id = event.target.dataset.id;
            token[id].field.removeFrom(this);
            token[id].drag(event);
        }, false);

        this.img.ondrop = function (ev) {
            ev.preventDefault();
            var data = ev.dataTransfer.getData("text");
            var id = ev.target.dataset.id;

            token[id].field.placeOn(token[data]);
        };
        this.img.ondragover = function (ev) {
            allowDrop(ev);
        };

        document.getElementById("token").appendChild(this.img);
    }
    Token.prototype.setId = function (id) {
        this.id = id;
        this.img.dataset.id = id;
    };

    Token.prototype.setSrc = function (src) {
        this.img.src = src;
    };

    Token.prototype.setPosition = function (x, y) {
        this.img.style.left = x.toString() + "px";
        this.img.style.top = y.toString() + "px";
    };

    Token.prototype.setSize = function (w, h) {
        this.img.style.width = w.toString() + "px";
        this.img.style.height = h.toString() + "px";
    };

    Token.prototype.setField = function (field) {
        this.field = field;
    };

    Token.prototype.drag = function (ev) {
        ev.dataTransfer.setData("text", this.id);
    };
    return Token;
})(Syncable);
