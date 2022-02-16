
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

		// Ship Mast references:
		let shipmast = {
			// FD:14F0 - Topsail Trouble, Kreepy Krow
			// FD:1610 - Mainbrace Mayhem, Krow's Nest
			// F0:0000 - C0:0000 = 30:0000 ram? to rom
			palette : [
				{ name:'Mainbrace Mayhem, Krow\'s Nest palette',
					address: 0x3D1610, size: 0x100, compressed: false
				},
				{ name:'Topsail Trouble, Kreepy Krow palette',
					address: 0x3D14F0, size: 0x100, compressed: false
				},
			],
			// DF:D537 ~ E0:2195 (0x5D20) - Tiles (Level)
			// D0:0000 - C0:0000 = 10:0000 ram? to rom
			tileset : [
				{ name:'ship mast tileset',
					address: 0x1FD537, size: 0x5D20, compressed: true
				}
			],
			// pirate flag 0x3A5FC1 30tiles*8animframes*32byteOneTile = 0x1E00
			// rain DATA_F36EE8 16tiles*8animframes*32byteOneTile = 0x1000
			// F0:0000 - C0:0000 = 30:0000 ram? to rom
			animation : [
				{ name : 'ship mast flag animated tileset',
					address: 0x3A5FC1, size: 0x1E00, compressed: false,
					vram: {destIndex: 1, tileCount: 30, frameCount: 8}
					// iFile iVRDest tLen fLen
				},
				{ name : 'ship mast rain animated tileset',
					address: 0x336EE8, size: 0x1000, compressed: false,
					vram: {destIndex: 752, tileCount:16, frameCount: 8}
				}
			],
			// bg rain DATA_F641C1
			// F0:0000 - C0:0000 = 30:0000 ram? to rom
			bganimation : [
				{ name : 'ship mast rain animated bg tileset',
					address: 0x3641C1, size: 0x4000, compressed: false,
					vram: null
				}
			],
			// E5:E0C8 ~ E5:F52D (0x2540) - Tilemap (8x8)
			// E0:0000 - C0:0000 = 20:0000 ram? to rom
			mapchip : [
				{ name:'ship mast mapchip',
					address: 0x25E0C8, size: 0x2540, compressed: true
				}
			]
		};

		let ROM = srcFilePanel.rom.fileData[0];
		let lvlRef = shipmast;


		// app to srcFile Panel


		for(let dataType in lvlRef){

			let dataRefs = lvlRef[dataType];

			let len = dataRefs.length;
			let last, ref, name, address, size, compressed, data, romRef, vramRef, dataFile, slot;
			for(let i=0; i<len; i++){
				last = (i === len-1);

				ref = dataRefs[i];
				name = ref.name;
				address = ref.address;
				size = ref.size;
				compressed = ref.compressed;
				data = ROM.slice(address, address+size);

				romRef = {address:address, size:size};
				vramRef = ref.vram;
				
				dataFile = {name:name, data:data, useDec:compressed, romRef:romRef, vramRef:vramRef};
				slot = srcFilePanel[dataType];
				slot.set_oneDataFile(dataFile, last);

				// todo : to move in an update method (build all from srcFilePanel once everything is loaded)
				// TEST FEATURE : animated data type : parameters input update
				if(vramRef){
					let obj = {d:vramRef.destIndex, t:vramRef.tileCount, f:vramRef.frameCount};
					slot.parameters.value += JSON.stringify(obj) + (last ? '' : ', ');
				}
				if(vramRef === null){ // important nullish type
					slot.parameters.value += 'null' + (last ? '' : ', ');
				}
				// END TEST FEATURE
			}

		}


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
