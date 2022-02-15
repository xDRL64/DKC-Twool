
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 'ROM' ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;

		// empty workspace (to empty html child elements)
		workspace.elem.textContent = "rom";

		// current workspace object
		let o = {};

		// code ...

		let romRef = {
			//Ship Mast:
			//DF:D537 ~ E0:2195 (0x5D20) - Tiles (Level)
			//D0:0000 - C0:0000 = 10:0000 ram? to rom
			tileset : [
				{ name:'ship mast tileset',
					address: 0x1FD537, size: 0x5D20, compressed: true
				}
			]
		};

		let ROM = srcFilePanel.rom.fileData.get_data()[0];

		// rom data part to app
		let name = romRef.tileset.name;
		let address = romRef.tileset.address;
		let size = romRef.tileset.size;
		let compressed = romRef.tileset.compressed;
		let data = ROM.slice(address, address+size);
		let decDat;
		if(compressed) decDat = app.decompressor(data);

		let slot = srcFilePanel.tileset;
		// app to srcFile internal
		slot.fileData = data;
		slot.decompressed = decDat;
		slot.name = [];
		slot.fileIndex.disabled = false;

		// app to srcFile Panel


		// update
		o.update = function(trigger){

		};

		// close
		o.close = function(){
			// app.mode[ /**/put its mode id/**/ ].save = something;
			// delete something (eventlistener, requestanimationframe, setinveterval, etc..)
		};

		// connect current workspace object (export core methods)
		workspace.current = o;

	};

})();
