require 'json'

class DomElement
    attr_accessor :id, :ownerId, :style
    @@id = 0
    
    def initialize(ownerId, id=nil)
        if !id
            @id = @@id
            @@id += 1
        end
        self.ownerId = ownerId
    end
    
    def addVar name, value
        eval("@#{name} = \"#{value}\"")
    end
    
    def to_json
        names = self.instance_variables
        json = {}
        names.each do |n|
            n = n.to_s
            json[n.sub("@","")] = eval(n)
        end
        return json.to_json
    end
    
    def send ws
        ws.send(self.to_json)
    end
end
