var Server = IgeClass.extend({
	classId: 'Server',
	Server: true,
    map: [],

	init: function (options) {
		var self = this;

		// Add the networking component
		ige.addComponent(IgeNetIoComponent)
			// Start the network server
			.network.start(2000, function () {
				// Networking has started so start the game engine
				ige.start(function (success) {
					// Check if the engine started successfully
					if (success) {
						ige.network.on('connect', function () {});
						ige.network.on('disconnect', function () {});

						// Add the network stream component
						ige.network.addComponent(IgeStreamComponent)
							.stream.sendInterval(30) // Send a stream update once every 30 milliseconds
							.stream.start(); // Start the stream

						// Accept incoming network connections
						ige.network.acceptConnections(true);

						// Load the base scene data
						ige.addGraph('IgeBaseScene');
                        
                       
                        
                        var map = [];
                        var offset = -200;
                        for (var x = 0; x < 15; x++) {
                            map[x] = [];
                            for (var y = 0; y < 15; y++) {
                                var f = new FieldEntity(x, y, "Field")
                                    .id('field' + x.toString() + "," + y.toString())
                                    .streamMode(1)
                                    .mount(ige.$('baseScene'));
                                if (x % 2 == 0) {
                                    f.translate().y(y * 128 + offset);
                                } else {
                                    f.translate().y(y * 128 - 64 + offset);
                                }
                                f.translate().x(x * 115 + offset)
                                map[x][y] = f;
                            }
                        }
                        //map[7][7].changeSrc("stadt.png");
					}
				});
			});
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Server; }