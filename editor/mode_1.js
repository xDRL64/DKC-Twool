
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 1 ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;
		let wLib2 = app.WorkspaceToolPack;

		// empty workspace (to empty html child elements)
		workspace.elem.textContent = "";

		// current workspace object
		let o = {};

		// code ...
		let _gfx = 'fast';

		let slot = srcFilePanel.tileset;

		let romOfst = 0;

		slot.parameters.onkeydown = function(e){
			if(e.code === 'Enter') o.update();
			if(e.code === 'ArrowUp'){
				romOfst--;
				 o.update();
			}
			if(e.code === 'ArrowDown'){
				romOfst++;
				 o.update();
			}
		};

		o.mode_1 = document.createElement('div');
		o.mode_1.style.position = 'relative';

		let settingsPanel = document.createElement('div');
		settingsPanel.style.position = 'absolute';
		settingsPanel.style.width = '20%';
		settingsPanel.style.height = '100%';

		let selectSrcFile = document.createElement('select');

		//let selectBpp = document.createElement('select');
		let selectBpp = wLib2.DropList('bpp : ');
		for(let i=2; i<9; i *= 2){
			/* let op = document.createElement('option');
			op.textContent = i+'bpp';
			op.setAttribute('value', i);
			selectBpp.appendChild(op); */
			selectBpp.generate_item(i,i);
		}
		selectBpp.elem.value = 4;
		o.mode_1.appendChild(selectBpp.board);

		settingsPanel.appendChild(selectSrcFile);
		o.mode_1.appendChild(settingsPanel);

		let renderSpace = document.createElement('div');
		renderSpace.style.position = 'absolute';
		renderSpace.style.width = '80%';
		renderSpace.style.height = '100%';
		renderSpace.style.right = 0;
		o.mode_1.appendChild(renderSpace);

		workspace.elem.appendChild(o.mode_1);

		selectBpp.elem.onchange =
		selectSrcFile.onchange =
		function(){
			update_render();
		};

		let update_render = function(){

			let data = null;

			// get src file
			let val = selectSrcFile.value;
			if(val === 'all'){
				data = slot.get_data__OLD();
			}else if(val === 'rom'){
				data = srcFilePanel.rom.fileData[0];
			}else{
				let index = parseInt(val) || 0;
				data = slot.get_data()[index];
			}

			// render
			let bpp = selectBpp.elem.value;
			let bppSizeBitShift = ({2:4,4:5,8:6})[bpp];
			let xtmax = 16;
			let h = Math.ceil( (data.length>>bppSizeBitShift) / xtmax ) << 3;
			let w = xtmax << 3;
			let s = 1;
		
			let viewport = wLib.create_preview(w,h, s);
			let ctx = viewport.ctx;
			renderSpace.innerHTML = '';
			renderSpace.appendChild(viewport.elem);

			let pal = app.gfx.defaultPalettes[1];
			//app.gfx[_gfx].draw_4bppTileset(data, pal, 0,0, 16, ctx);
			app.gfx.fast[`draw_${bpp}bppTileset`](data, pal, 0,0, xtmax, ctx);

		};

		// update
		o.update = function(trigger){

			if(trigger==='reset' || trigger==='tileset' || trigger==='rom'){
				// fill src list
				selectSrcFile.innerHTML = '';
				let len = slot.multi;
				let file;
				for(let i=0; i<len; i++){
					file = document.createElement('option');
					file.textContent = slot.names[i];
					file.setAttribute('value', i);
					selectSrcFile.appendChild(file);
				}
				// add 'ALL IN ONE' option
				if(len){
					file = document.createElement('option');
					file.textContent = 'ALL IN ONE';
					file.setAttribute('value', 'all');
					selectSrcFile.appendChild(file);
				}
				// add 'FROM ROM' option
				if(srcFilePanel.check_slot('rom')){
					file = document.createElement('option');
					file.textContent = 'FROM ROM';
					file.setAttribute('value', 'rom');
					selectSrcFile.appendChild(file);
				}
			}



			

			if(slot.multi > 0){

				let data = slot.get_data__OLD();

				let parameters = slot.parameters.value.match(/\w{1,}/g) || [];
				let _p = parameters;

				let viewportUpdate = false;

				// TEST : draw_4bppTile()
					// params : d4t f/s iTile(1024)
					// params : d4t f/s o/w
				// TEST : decode_4bppTile() and draw_decodedTile() and format_4bppTile() and draw_formatedTile()
					// params : dt/ddt/ft/dft f/s f/s iTile(1024)
					// params : dt/ft   f/s f/s o/w
					// params : ddt/dft x   f/s o/w
				if(_p[0]==='d4t' || _p[0]==='dt' || _p[0]==='ddt' || _p[0]==='ft' || _p[0]==='dft'){
					
					o.viewport = wLib.create_preview(8*2,8*2, 10);
					
					let ctx = o.viewport.ctx;
					let pal = app.gfx.defaultPalettes[0];
					pal = app.gfx.debugpal;

					dkc2debug.gfxTest.TILESET.do(parameters, data, pal, ctx);

					viewportUpdate = true;
				}

				// TEST : draw_4bppTileset()
					// params : d4ts f/s O:bool W:bool
				// TEST : decode_4bppTileset() and draw_decodedTileset() and format_4bppTileset() and draw_formatedTileset()
					// params : dts/ddts/fts/dfts f/s f/s O:bool W:bool
					// params : dts/fts   f/s f/s O:bool W:bool
					// params : ddts/dfts any f/s O:bool W:bool
				if(_p[0]==='d4ts' || _p[0]==='dts' || _p[0]==='ddts' || _p[0]==='fts' || _p[0]==='dfts'){

					let sttObj = {};
					let xtmax = sttObj.xtmax = 16;
					let h     = sttObj.h     = Math.ceil( (data.length/32) /xtmax ) * 8;
					let w     = sttObj.w     = xtmax * 8;
					let _     = sttObj._     = 1;

					o.viewport = wLib.create_preview(w*2+_,h*2+_, 2);

					let ctx = o.viewport.ctx;

					let pal = app.gfx.defaultPalettes[0];
					pal = app.gfx.debugpal;

					let AaF = app.lib.arrayAsFunction;
					//let arrFunc = slot.multi < 2 ? AaF.make_arraySyntax(AaF.create(data)) : data;
					//let _data = arrFunc.jsArray();
					let _data = slot.multi < 2 ? data : data.buffer;

					dkc2debug.gfxTest.TILESET.do(parameters, _data, pal, ctx, sttObj);

					viewportUpdate = true;
				}

				if(_p[0]===undefined){
					let xtmax  = 16;
					let h = Math.ceil( (data.length/32) /xtmax ) * 8;
					let w = xtmax * 8;
				
					o.viewport = wLib.create_preview(w,h, 2);
					let ctx = o.viewport.ctx;

					let pal = app.gfx.defaultPalettes[1];
					app.gfx[_gfx].draw_4bppTileset(data, pal, 0,0, 16, ctx);

					viewportUpdate = true;
				}

				if(_p[0]==='bg'){
					let data = srcFilePanel.bgtileset.get_data__OLD();
					let xtmax  = 16;
					let h = Math.ceil( (data.length/32) /xtmax ) * 8;
					let w = xtmax * 8;
				
					o.viewport = wLib.create_preview(w,h, 2);
					let ctx = o.viewport.ctx;

					let pal = app.gfx.defaultPalettes[1];
					app.gfx[_gfx].draw_4bppTileset(data, pal, 0,0, 16, ctx);

					viewportUpdate = true;
				}

				// parameters : 'grid' '2bpp'? xtmax? ['rom' ofst bytesize]?
				if(_p[0]==='grid'){

					// read rom (overwrite data)
					let data = slot.get_data()[0];
					let inputRomOfst = parseInt(_p[4], 16) + romOfst;
					let byteSize = parseInt(_p[5], 16);
					if(_p[3] === "rom" && !Number.isNaN(inputRomOfst) && !Number.isNaN(byteSize)){
						console.log(inputRomOfst);
						data = data.slice(inputRomOfst, inputRomOfst+byteSize);
					}


					let xtmax = parseInt(_p[2]) || 16;

					let wt = xtmax;
					let ht = Math.ceil( (data.length/32) /xtmax );
					if(_p[1] == '2bpp') ht *= 2;

					let w = (wt * 8) + (wt - 1);
					let h = (ht * 8) + (ht - 1);
				
					o.viewport = wLib.create_preview(w,h, 2);
					let ctx = o.viewport.ctx;

					let snespal = srcFilePanel.palette.get_data()[0];
					let inputPal = app.gfx.safe.snespalTo24bits(snespal)[0];
					let pal = inputPal || app.gfx.defaultPalettes[1];
					
					


					let formatedTileset = app.gfx.fast.format_4bppTileset(data);
					if(_p[1] === '2bpp')
						formatedTileset = app.gfx.fast.format_2bppTileset(data);

					let len = formatedTileset.length;
					let xt, yt;
					for(let i=0; i<len; i++){
						xt = i % xtmax;
						yt = Math.floor(i / xtmax);
						app.gfx.safe.draw_formatedTile(formatedTileset[i], pal, 0,0, ctx, xt*(8+1),yt*(8+1));
					}

					viewportUpdate = true;
				}

				if(viewportUpdate){
					workspace.elem.textContent = ""; // to empty html child elements
					workspace.elem.appendChild(o.viewport.view);
				}
				
			}

		};

		o.close = function(){
			// app.mode[ /**/put its mode id/**/ ].save = something;
			// delete something (eventlistener, requestanimationframe, setinveterval, etc..)
		};

		// connect current workspace object (export update methode)
		workspace.current = o;

	};

})();
