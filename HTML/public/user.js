
function login(){
    var name = document.getElementById("name").value;
    var pw = document.getElementById("password").value;
    var hash = {"f":"login", "name":name, "pw":pw};
    connection.send(JSON.stringify(hash));
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}

var USER = "";
function checkUserCookie(){
   if(getCookie("user")){
        USER = getCookie("user");
        document.getElementById("login").innerHTML = "<h1>Welcome " + USER + "</h1>";
        setTimeout(function(){ document.getElementById("loginHolder").style.display = "none"; }, 2000);
    } 
    console.debug(getCookie("user"));
}


