function pxToInt(px) {
    var s = px.substring(0, px.length - 2);
    return parseInt(s);
}

function allowDrop(ev) {
    ev.preventDefault();
}
