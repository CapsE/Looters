QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test( "Cookie Tests", function( assert ) {
    setCookie("Test", "Test", 360);
    assert.equal( getCookie("Test"), "Test", "Cookie created and loaded" );
    checkUserCookie();
    assert.ok( true, "Can check Userdata" );
});

QUnit.test( "Socket Test", function( assert ) {
    init();
    assert.ok( connection != null, "Created Object" );
    assert.ok( connection.send != null, "Socket can Send" );
});

QUnit.test( "Parse: Login Test", function( assert ) {
    var msg = {"f":"login", "success":"true", "name":"CapsE"};
    parse(msg);
    assert.ok(USER != null, "Loged in" );
    
    msg["success"] = "register";
    parse(msg);
    assert.ok(USER != null, "Registered User" );
    
    msg["success"] = "fail";
    parse(msg);
    assert.ok( true, "Wrong Password" );
});

QUnit.test( "Parse: Sync Test", function( assert ) {
    var oc = function(){
        console.debug("Clicked");
    }
    var newDom = {
        "id":"testId",
        "domType":"img",
        "attr":{".src":"http://vignette1.wikia.nocookie.net/battleforge/images/2/2a/Honor_Token.png/revision/latest?cb=20121121184922",
                ".style.cursor":"move",
                ".draggable":true,
                ".style.width":100,
                ".style.height":100
               },
        "domAttr":{
            ".style.zIndex":100
        },
        "domFunc":{".onclick":oc, ".ondragstart":drag}};
    newDom["f"] = "sync";
    parse(newDom);
    assert.ok(document.getElementById("testId_main") != null, "Object created");
    assert.ok(document.getElementById("testId") != null, "ObjectHolder created");
    
    newDom["f"] = "update";
    newDom["attr"][".style.left"] = "300px";
    parse(newDom);
    assert.equal(document.getElementById("testId").style.left, "300px", "Updated Object");
    
    var h = {"f":"delete", "id":"testId"};
    parse(h);
    assert.ok(document.getElementById("testId") == null, "Deleted Object");
});