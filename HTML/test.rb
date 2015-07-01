require './Dom'

d = DomElement.new("img")
d.addVar("onclick", "clicked()")
puts d.to_json