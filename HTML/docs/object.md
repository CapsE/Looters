Objekte Erstellen
=================

Objekte werden im JSON-Format deklariert orientieren sich dabei aber stark an normalen HTML-Elementen. Jedes Objekt erhält beim erstellen einen Control-Container der es dem Nutzer ermöglicht es wieder zu entfernen. Um den Container anzuzeigen muss die STRG-Taste gedrückt gehalten werden während man mit der Maus über dem Objekt ist. Folgende Werte können für Objekte gesetzt werden.

###domType [String] (default = "img")
Gibt an welcher HTML-Tag genutzt werden soll. Meist ist nur ein simples Bild gewünscht aber auch "input", "div" oder "p" und alle anderen HTML-Tags sind möglich.

###attr [JSON]
Ein JSON im JSON. Gibt an welche Attribute für das zu erstellende Element gesetzt werden sollen. Die Schlüssel dieses JSON beginnen alle mit einem "."
####Beispiel
```javascript
{".src":"picture.png",
".style.width":"200px",
".style.height":"200px"}
```
Wie das Beispiel zeigt können alle Attribute des HTML-Tags und sein Style gesetzt werden.

###domAttr [JSON]
Ein JSON im JSON. Gibt an welche Attribute für den Control-Container gelten sollen. Siehe attr

###domFunc [JSON]
Setzt die Funktionen des HTML-Tags z.B. onlick oder ondrag.
####Beispiel
```javascript
var oc = function(){
    console.debug("Clicked");
}

"domFunc":{".onclick":oc, ".ondragstart":drag}};
```

Wie das Beispiel zeigt ist es ratsam die Functionen, die verwendet werden sollen vorher als Variable zu definieren.

Gesamt Beispiel
---------------
```javascript
var oc = function(){
    console.debug("Clicked");
}
var newDom = {
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
    "domFunc":{".onclick":oc, ".ondragstart":drag}
};
```