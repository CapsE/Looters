require 'sinatra'
require 'sinatra-websocket'
require 'json'

configure do
  set :bind, '0.0.0.0'
    set :port, '4242'
  set :sessions, true
  set :sockets, []
end

$counter = 0
$syncs = {}
$users = {}

File.readlines('user.db').each do |line|
    name = line.split("|")[0].chomp
    pw = line.split("|")[1].chomp
    $users[name] = pw
end

get '/' do
  if !request.websocket?
    erb :"index"
  else
    request.websocket do |ws|
      ws.onopen do 
        settings.sockets << ws
        $syncs.each_key do |k|
            ws.send $syncs[k].to_json
        end
      end
      
      ws.onmessage do |msg|
        puts "Got msg: #{msg}"
        msg = JSON.parse(msg)
      
        case msg["f"]
        when "sync"
          $syncs[msg["id"]] = msg
          EM.next_tick { settings.sockets.each{|s| 
            if s != ws
              s.send(msg.to_json)
            end 
          } }
        when "update"
          old = $syncs[msg["id"].to_i]
            if old
              msg.each_key do |k|
                  if k == "domAttr" || k == "domFunc" || k == "attr"
                      msg[k].each_key do |l|
                          if !old[k]
                              old[k] = {}
                          end
                          old[k][l] = msg[k][l]
                      end
                  else
                    old[k] = msg[k]
                end
              end
                old["f"] = "sync"
              $syncs[msg["id"].to_i] = old  
            end
          EM.next_tick { settings.sockets.each{|s| 
            if s != ws
              s.send(msg.to_json)
            end 
          } }
        when "delete"
            
            $syncs.delete(msg["id"].to_i)
            EM.next_tick { settings.sockets.each{|s| 
                if s != ws
                  s.send(msg.to_json)
                end 
            } }
        when "login"
            #User existiert?
            if $users[msg["name"]]
                #PW ist richtig?
                if $users[msg["name"]] == msg["pw"]
                    ws.send({"f" => "login", "name" => msg["name"], "success" => "true"}.to_json)
                else
                    ws.send({"f" => "login", "success" => "false"}.to_json)
                end
            else
                $users[msg["name"]] = msg["pw"]
                File.open("./user.db", 'a') { |file| file.write(msg["name"] + "|" + msg["pw"] + "\n") }
                ws.send({"f" => "login", "success" => "register"}.to_json)
            end
        else
          EM.next_tick { settings.sockets.each{|s| s.send(msg.to_json) } }
        end      
      end
      
      ws.onclose do
        warn("websocket closed")
        settings.sockets.delete(ws)
      end
    end
  end
end

post "/upload" do 
  puts params
    if !File.directory?("./public/uploads/"+ params["user"])
       Dir.mkdir("./public/uploads/"+ params["user"])
    end
    File.open('./public/uploads/' + params["user"] + "/" + params['file'][:filename], "wb") do |f|
        f.write(params['file'][:tempfile].read)
    end
  return {"f" => "upload", "state" => "complete"}.to_json
end

get "/test" do
    @test = true
    erb :index
end
