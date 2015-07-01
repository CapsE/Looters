var FieldEntity = IgeEntity.extend({
	classId: 'FieldEntity',
	
	init: function (x,y,texture) {
		IgeEntity.prototype.init.call(this);
        
        if(!ige.isServer){
            this.texture(ige.client.textures.field)
            this.width(148);
            this.height(128);
        }
	}
});

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = FieldEntity; }