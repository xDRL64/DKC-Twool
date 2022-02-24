
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 10 ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;

		let palSlot = srcFilePanel.palette;

		// code ...
		let _SRC = 0, _DST = 0, _LEN = 0;
		let _SAVEFILE = [...srcFilePanel.palette.fileData[0]];
		srcFilePanel.palette.parameters.value = "a"
		srcFilePanel.palette.parameters.onkeydown = function(e){
			e.preventDefault();
			if(e.code === 'Enter') o.update();
			if(!e.ctrlKey && !e.shiftKey){
				if(e.code === 'ArrowUp'){
					_SRC--;
					if(_SRC<0) _SRC=0;
					o.update();
				}
				if(e.code === 'ArrowDown'){
					_SRC++;
					o.update();
				}
			}
			if(e.ctrlKey){
				if(e.code === 'ArrowUp'){
					_DST--;
					if(_DST<0) _DST=0;
					o.update();
				}
				if(e.code === 'ArrowDown'){
					_DST++;
					o.update();
				}
			}
			if(e.shiftKey){
				if(e.code === 'ArrowUp'){
					_LEN--;
					if(_LEN<0) _LEN=0;
					o.update();
				}
				if(e.code === 'ArrowDown'){
					_LEN++;
					o.update();
				}
			}
			srcFilePanel.palette.parameters.value = `src=${_SRC} dst=${_DST} len=${_LEN}`;
		};
		let offset = 0//p.has('o') ? (parseInt(p.get('o'))||0) : 0;
		let data = {
			ownerRefs : palSlot.get_dataWithOwnerAccess(),
			byteOffset : offset || 0
		};
		let lib = {
			decode2 : app.gfx.fast.decode_palette,
			decode4 : app.gfx.fast.decode_palette,
			decode8 : app.gfx.fast.decode_palette,
			format2 : app.gfx.fast.format_palette,
			format4 : app.gfx.fast.format_palette,
			format8 : app.gfx.fast.format_palette,
	
			writeD2 : app.write.decodedPalette,
			writeD4 : app.write.decodedPalette,
			writeD8 : app.write.decodedPalette,
			writeF2 : app.write.formatedPalette,
			writeF4 : app.write.formatedPalette,
			writeF8 : app.write.formatedPalette,
		};
		PAL = app.component.Palette(data, lib);
		PAL.init();
		PAL.update(['decoded2','decoded4','decoded8']);
		PAL.update(['formated2','formated4','formated8']);

		PAL.update(['decoded2']);
		PAL.type.decoded2[0][0] = 255
		PAL.type.decoded2[0][1] = 0
		PAL.type.decoded2[0][2] = 0
		PAL.type.decoded2[31][0] = 0
		PAL.type.decoded2[31][1] = 255
		PAL.type.decoded2[31][2] = 0
		PAL.sync('decoded2');

		PAL.update(['formated2']);
		PAL.type.formated2[0][1][0] = 255
		PAL.type.formated2[0][1][1] = 255
		PAL.type.formated2[0][1][2] = 0
		PAL.type.formated2[7][2][0] = 0
		PAL.type.formated2[7][2][1] = 255
		PAL.type.formated2[7][2][2] = 255
		PAL.sync('formated2');

		PAL.update(['decoded4']);
		PAL.type.decoded4[2][0] = 0
		PAL.type.decoded4[2][1] = 0
		PAL.type.decoded4[2][2] = 255
		PAL.type.decoded4[127][0] = 255
		PAL.type.decoded4[127][1] = 0
		PAL.type.decoded4[127][2] = 255
		PAL.sync('decoded4');

		PAL.update(['formated4']);
		PAL.type.formated4[0][3][0] = 255
		PAL.type.formated4[0][3][1] = 127
		PAL.type.formated4[0][3][2] = 0
		PAL.type.formated4[7][14][0] = 255
		PAL.type.formated4[7][14][1] = 255
		PAL.type.formated4[7][14][2] = 255
		PAL.sync('formated4');

		PAL.update(['decoded8']);
		PAL.type.decoded8[4][0] = 0
		PAL.type.decoded8[4][1] = 127
		PAL.type.decoded8[4][2] = 255
		PAL.type.decoded8[255][0] = 127
		PAL.type.decoded8[255][1] = 0
		PAL.type.decoded8[255][2] = 255
		PAL.sync('decoded8');

		PAL.update(['formated8']);
		PAL.type.formated8[0][5][0] = 255
		PAL.type.formated8[0][5][1] = 0
		PAL.type.formated8[0][5][2] = 0
		PAL.type.formated8[0][254][0] = 255
		PAL.type.formated8[0][254][1] = 0
		PAL.type.formated8[0][254][2] = 0
		PAL.sync('formated8');

		//PAL.write();	
		//PAL.type.formated2[0][0][2] = 255;
		//PAL.write();





		workspace.elem.textContent = ""; // to empty html child elements
		
		let o = {};
	
		o.viewport = wLib.create_preview(16,64, 16);

		workspace.elem.appendChild(o.viewport.view);
		
		o.update = function(trigger){

			let _p = srcFilePanel.palette.parameters.value.match(/[\w=\.]{1,}/g) || [];
			let p = new URLSearchParams(_p.join('&'));

			if(_p.length === 0){
				if(srcFilePanel.palette.multi > 0){
				
					let snespal = srcFilePanel.palette.get_data();
					snespal = app.lib.arrayAsFunction.fromArrayList(snespal);
	
					let palettes = app.gfx.fast.snespalTo24bits(snespal);
					app.gfx.fast.draw_palettes(palettes, o.viewport.ctx);
	
					//let palettes = app.gfx.safe.snespalTo24bits(snespal);
					//app.gfx.safe.draw_palettes(palettes, o.viewport.ctx);
					//app.gfx.fast.draw_snespal(snespal, o.viewport.ctx);
					//app.gfx.safe.draw_snespal(snespal, o.viewport.ctx);
				}
			}else{
				if(srcFilePanel.check_slot('palette')){
					

					let palFileColLen = palSlot.get_totalSize();

					let colCount = Math.floor(palFileColLen / 2);

					let hColCount = Math.floor(colCount / 16);

					workspace.elem.textContent = "";
					let palFilesPrev = wLib.create_preview(16,hColCount+16, 16);
					workspace.elem.appendChild(palFilesPrev.elem);

					//
					

					////////////////buffer///////////////////////////////////
					/*
					let offset = p.has('o') ? (parseInt(p.get('o'))||0) : 0;
					let data = {
						ownerRefs : palSlot.get_dataWithOwnerAccess(),
						byteOffset : offset || 0
					};
					let lib = {
						decode2 : app.gfx.fast.decode_palette,
						decode4 : app.gfx.fast.decode_palette,
						decode8 : app.gfx.fast.decode_palette,
						format2 : app.gfx.fast.format_palette,
						format4 : app.gfx.fast.format_palette,
						format8 : app.gfx.fast.format_palette,
				
						writeD2 : app.write.decodedPalette,
						writeD4 : app.write.decodedPalette,
						writeD8 : app.write.decodedPalette,
						writeF2 : app.write.formatedPalette,
						writeF4 : app.write.formatedPalette,
						writeF8 : app.write.formatedPalette,
					};
					PAL = app.component.Palette(data, lib);
					PAL.init();
					PAL.update(['decoded2','decoded4','decoded8']);
					PAL.type.decoded2[0][0] = 255
					PAL.type.decoded2[0][1] = 0
					PAL.type.decoded2[0][2] = 0
					PAL.type.decoded2[30][0] = 0
					PAL.type.decoded2[30][1] = 0
					PAL.type.decoded2[30][2] = 255
					PAL.type.decoded2[31][0] = 0
					PAL.type.decoded2[31][1] = 255
					PAL.type.decoded2[31][2] = 0
					//PAL.sync('decoded2');
					//PAL.write();	
					PAL.update(['formated2','formated4','formated8']);
					PAL.type.formated2[0][0][2] = 255;
					//PAL.sync('formated2');
					//PAL.write();
					*/



					let palBufferPrev = wLib.create_preview(16,16, 16);
					workspace.elem.appendChild(palBufferPrev.elem);

					let typeRectElem = document.createElement("div");
					typeRectElem.style.display = "inline-block";
					typeRectElem.style.width = "fit-content";
					typeRectElem.style.whiteSpace = "nowrap";
					workspace.elem.appendChild(typeRectElem);

					let decoded2Prev = wLib.create_preview(16,16, 16);
					typeRectElem.appendChild(decoded2Prev.elem);
					let decoded4Prev = wLib.create_preview(16,16, 16);
					typeRectElem.appendChild(decoded4Prev.elem);
					let decoded8Prev = wLib.create_preview(16,16, 16);
					typeRectElem.appendChild(decoded8Prev.elem);

					typeRectElem.appendChild( document.createElement("br") );

					let formated2Prev = wLib.create_preview(16,16, 16);
					typeRectElem.appendChild(formated2Prev.elem);
					let formated4Prev = wLib.create_preview(16,16, 16);
					typeRectElem.appendChild(formated4Prev.elem);
					let formated8Prev = wLib.create_preview(16,16, 16);
					typeRectElem.appendChild(formated8Prev.elem);

					/*let sA=Math.floor(palSlot.fileData[0].length/2);
					let oA=((8+8)*15)+5;
					let sB=PAL.type.decoded4.length;
					let oB=120;
					let len=32;
					len = app.write.get_clampedLength2(sA,sB, oA,oB, len);
					let copy = [len, oB, oA]; // len, src, dst
					app.write.ext.decodedPalette(palSlot.fileData[0],PAL.type.decoded4, ...copy);*/

					let frmtd = 8;
					let sA=Math.floor(palSlot.fileData[0].length/2);
					let oA=_DST//((8+8)*14)+5;
					let sB=PAL.type['formated'+frmtd].length*({2:4,4:16,8:256})[frmtd];
					let oB=_SRC//16//120;
					let len=_LEN//32;
					len = app.write.get_clampedLength2(sA,sB, oA,oB, len);
					let copy = [len, oB, oA]; // len, src, dst
					palSlot.fileData[0] = [..._SAVEFILE];
					app.write.ext.formatedPalette(palSlot.fileData[0],PAL.type['formated'+frmtd], frmtd, ...copy);

					///////////////////draw////////////////////////////////////
					
					// files
					let snespal = srcFilePanel.palette.get_data();
					snespal = app.lib.arrayAsFunction.fromArrayList(snespal);
					let palettes = app.gfx.fast.snespalTo24bits(snespal);
					//app.gfx.fast.draw_palettes(palettes, palFilesPrev.ctx);
					app.gfx.fast.draw_snespal(snespal, palFilesPrev.ctx);

					// buff
					palettes = app.gfx.fast.snespalTo24bits(PAL.get_buffer());
					app.gfx.fast.draw_palettes(palettes, palBufferPrev.ctx);

					// type
					app.gfx.fast.draw_decodedPalette(PAL.type.decoded2, decoded2Prev.ctx);
					app.gfx.fast.draw_decodedPalette(PAL.type.decoded4, decoded4Prev.ctx);
					app.gfx.fast.draw_decodedPalette(PAL.type.decoded8, decoded8Prev.ctx);

					app.gfx.fast.draw_formatedPalette(PAL.type.formated2, 2, formated2Prev.ctx);
					app.gfx.fast.draw_formatedPalette(PAL.type.formated4, 4, formated4Prev.ctx);
					app.gfx.fast.draw_formatedPalette(PAL.type.formated8, 8, formated8Prev.ctx);

					

				}



			}

		};

		o.close = function(){
			// app.mode[ /**/put its mode id/**/ ].save = something;
			// delete something (eventlistener, requestanimationframe, setinveterval, etc..)
		};

		workspace.current = o;

	};

})();
