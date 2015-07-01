var pressedKeys = [];

function keyDown(e){
    if(isPressed(e.keyCode)){
       return null;
    }
    pressedKeys.push(e.keyCode);
    if(e.keyCode == 17){
        console.debug("Strg down");
        ToggleEditMode(true);
    }
}

function keyUp(e){
    if(e.keyCode == 17){
         console.debug("Strg up");
        ToggleEditMode(false);
    }
    releaseKey(e.keyCode);
}

function isPressed(keyCode){
    for(var i = 0; i < pressedKeys.length; i++){
        if(keyCode == pressedKeys[i]){
            return true;
        }
    }
    return false;
}

function releaseKey(keyCode){
    var i = pressedKeys.indexOf(keyCode);
    if(i > -1){
        pressedKeys.splice(i,1);
    }
}