var Client = IgeClass.extend({
	classId: 'Client',

	init: function () {
		//ige.timeScale(0.1);
		ige.showStats(1);

		// Load our textures
		var self = this;

		// Enable networking
		ige.addComponent(IgeNetIoComponent);

		// Create the HTML canvas
		ige.createFrontBuffer(true);

		// Load the textures we want to use
		this.textures = {
			ship: new IgeTexture('./assets/PlayerTexture.js'),
            field: new IgeTexture('./assets/Field.png')
		};

		ige.on('texturesLoaded', function () {
			// Ask the engine to start
			ige.start(function (success) {
				// Check if the engine started successfully
				if (success) {
					// Start the networking (you can do this elsewhere if it
					// makes sense to connect to the server later on rather
					// than before the scene etc are created... maybe you want
					// a splash screen or a menu first? Then connect after you've
					// got a username or something?
					ige.network.start('http://localhost:2000', function () {
						// Setup the network stream handler
						ige.network.addComponent(IgeStreamComponent)
							.stream.renderLatency(80) // Render the simulation 160 milliseconds in the past
							// Create a listener that will fire whenever an entity
							// is created because of the incoming stream data
							.stream.on('entityCreated', function (entity) {
								self.log('Stream entity created with ID: ' + entity.id());

							});
						
						// Load the base scene data
						ige.addGraph('IgeBaseScene');
                        ige.$('vp1').translate().x(-1000);
					});
				}
			});
		});
        
        ige.input.on('keyDown',function(event,keycode) {
            if(ige.input.state(ige.input.key.a)) {
                ige.$('vp1').translateBy(10,0,0);
            }
            if(ige.input.state(ige.input.key.d)) {
                ige.$('vp1').translateBy(-10,0,0);
            }
            if(ige.input.state(ige.input.key.w)) {
                ige.$('vp1').translateBy(0,10,0);
            }
            if(ige.input.state(ige.input.key.s)) {
                ige.$('vp1').translateBy(0,-10,0);
            }
            ige.$('vp1').updateTransform()
        });
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = Client; }