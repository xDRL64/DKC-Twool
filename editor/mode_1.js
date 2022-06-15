
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 1 ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;
		let wLib2 = app.WorkspaceToolPack;

		let Elem = wLib2.CreateElem;
		let flags = Elem.flags;
		for(let key in flags)
			eval(`if(!${key}) var ${key} = ${flags[key]}`);

		// empty workspace (to empty html child elements)
		workspace.elem.textContent = "";

		// current workspace object
		let o = {};

		// code ...
		let _gfx = 'fast';

		let slot = srcFilePanel.tileset;

		let romOfst = 0;

		/* slot.parameters.onkeydown = function(e){
			if(e.code === 'Enter') o.update();
			if(e.code === 'ArrowUp'){
				romOfst--;
				 o.update();
			}
			if(e.code === 'ArrowDown'){
				romOfst++;
				 o.update();
			}
		}; */

		let _xtmax = 16;
		slot.parameters.onkeydown = function(e){
			if(e.code === 'Enter'){
				let parameters = slot.parameters.value.match(/\w{1,}/g) || [];
				_xtmax = parseInt(parameters[0]) || 16;
				render();
			}
		};

		let _bpp = 4;
		let _scale = 1;
		let _tlstSel = 'none';
		let _data = null;
		let _romStart = 0;
		let _romSize = 0;
		let defPal = app.gfx.defaultSnespal.concat(app.gfx.debugSnespal);
		let propset;

		o.mode_1 = Elem('div', {disFlx, width:'100%', height:'100%'});

			//propset = {width:384, height:'100%', disFlx, fdrCln, atmCen};
			let leftPanel = Elem('div', {disFlx, fdrCln, atmCen});

				let settingsPanel = Elem('div', {w:'100%', h:'fit-content', disFlx, fdrCln, atmCen});

					
					// BPP LIST
					let selectBpp = wLib2.DropList('bpp : ');
					for(let i=2; i<9; i *= 2)
						selectBpp.generate_item(i,i);
					Elem.Set(selectBpp.elem, {_value:_bpp, _size:3, w:48});
					selectBpp.elem.children[_bpp>>2].setAttribute('selected', true);
					Elem.Set(selectBpp.board, {margin:'16 0'});

					// SRC LIST
					let selectSrcFile = wLib2.DropList('src : ');
					Elem.Set(selectSrcFile.elem, {_size:5, w:'100%'});
					Elem.Set(selectSrcFile.board, {disFlx, fdrCln, alnItm:'start', w:256, margin:'16 0'});

					// SRC ROM SETTINGS
					let create_HexInputWithStep = function(name=''){
						let panel = Elem('div', {w:256});
						let label = Elem('label', {w:'100%', txtCnt:name})
							let hexInput = wLib2.HexInput('0x', true, ['DATA_']);
							let stepInput = wLib2.HexInput('0x', true, ['DATA_']);
							Elem.Set(hexInput, {w:'70%'});
							Elem.Set(stepInput, {w:'30%'});
							stepInput.onblur = function(){hexInput.step=this.int};
						panel.appendChild(label);
						panel.appendChild(hexInput);
						panel.appendChild(stepInput);
						return {board:panel, hexInput};
					};
					let romOffsetPan = create_HexInputWithStep('rom display offset :');
					let romDisplayPan = create_HexInputWithStep('rom display size :');

				settingsPanel.appendChild(selectBpp.board);
				settingsPanel.appendChild(selectSrcFile.board);
				settingsPanel.appendChild(romOffsetPan.board);
				settingsPanel.appendChild(romDisplayPan.board);

				// PALETTE PICKER
				propset = {disFlx, fdrCln, atmCen, ovyScl, w:'100%', padding:16, bxszbb};
				let palSelectorPan = Elem('div', propset)
					
					let get_safeSnespal = function(snespal){
						/* //snespal = srcFilePanel.palette.get_data__OLD().jsArray?.() || defPal;
						snespal = srcFilePanel.palette.get_data__OLD() || defPal;
						snespal = snespal?.jsArray ? snespal.jsArray() : snespal;
						if(snespal.length < 512) snespal = snespal.concat(defPal);
						return snespal; */
						return srcFilePanel.palette.get_allInOne(false).concat(defPal);
					};
					let snespal = get_safeSnespal();
					let palSelector = wLib.create_snesPaletteSelector(snespal, _bpp);
				palSelectorPan.appendChild(palSelector.elem);

			leftPanel.appendChild(settingsPanel);
			leftPanel.appendChild(palSelectorPan);

			let rightPanel = Elem('div', {ovfHid, flxGrw:1, disFlx, fdrCln, jtcCen, atmCen});

				let renderScaleInfo = Elem('div', {txtCnt:`Render Scale : ${_scale}`});

				let scaleRange = Elem('input', {_type:'range', _value:1, _min:1, _max:5, _step:1});

				let renderSpace = Elem('div', {w:'100%', ovfScl, bxszbb ,flxGrw:1, disFlx, fdrCln, jtcCen, atmCen});
				renderSpace.style.border = '1px solid';

				let decompPrevPan = Elem('div', {w:'100%', ovfScl, bxszbb, disFlx});

			rightPanel.appendChild(renderScaleInfo);
			rightPanel.appendChild(scaleRange);
			rightPanel.appendChild(renderSpace);
			rightPanel.appendChild(decompPrevPan);

		o.mode_1.appendChild(leftPanel);
		o.mode_1.appendChild(rightPanel);
		workspace.elem.appendChild(o.mode_1);

		// EVENT CONNEXIONS

		selectBpp.elem.onchange = function(){
			_bpp = parseInt(this.value);
			update_palettes();
			render();
		};
		selectSrcFile.elem.onchange = function(){
			_tlstSel = selectSrcFile.elem.value;
			update_tileset();
			render();
		};

		let romSettingChange = function(){
			_romStart = romOffsetPan.hexInput.int;
			_romSize = romDisplayPan.hexInput.int;
			update_tileset();
			render();
		};
		romOffsetPan.hexInput.onkeyup = function(e){romSettingChange(e)};
		romDisplayPan.hexInput.onkeyup = function(e){romSettingChange(e)};

		scaleRange.oninput = function(){
			_scale = this.value;
			renderScaleInfo.textContent = `Render Scale : ${_scale}`;
			render();
		};

		renderSpace.ondblclick = function(){
			let romRef = {address:_romStart, _romSize};
			let defFile = {name:'from mode_1', data:_data, useDec:false, romRef, vramRef:{bpp:_bpp}};
			slot.set_oneDataFile(defFile, true);

			// update
			o.update('tileset');
		};

		let update_srcList = function(){
			// add fill src list options
			selectSrcFile.elem.innerHTML = '';
			let len = slot.multi;
			for(let i=0; i<len; i++){
				selectSrcFile.generate_item(slot.names[i], i);
			}
			// add 'ALL IN ONE' option
			if(len){
				selectSrcFile.generate_item('ALL IN ONE', 'all');
			}
			// add 'FROM ROM' option
			if(srcFilePanel.check_slot('rom')){
				selectSrcFile.generate_item('FROM ROM', 'rom');
			}
		};

		
		let update_tileset = function(){
			// get src file
			if(_tlstSel === 'all'){
				_data = slot.get_allInOne(false); // get js Array
			}else if(_tlstSel === 'rom'){
				let end = _romStart + _romSize;
				_data = srcFilePanel.rom.fileData[0].slice(_romStart, end); // get Uint8Array
			}else{
				let index = parseInt(_tlstSel) || 0;
				_data = slot.get_data()[index]; // get Uint8Array
			}

			// if tileset is null
			let safeDefault = new Uint8Array(64);
			_data ??= safeDefault;

			// if tileset is empty or not big enough
			if(_data.length < 64)
				_data = ([..._data]).concat([...safeDefault]);
			
		};

		let update_palettes = function(){
			snespal = get_safeSnespal();
			let newPalSel = wLib.create_snesPaletteSelector(snespal, _bpp);
			palSelectorPan.replaceChild(newPalSel.elem, palSelector.elem);
			palSelector = newPalSel;
			palSelector.callback = function(){ render(); };
		};

		let update_decompPreviews = function(w,h, s, pal, xtmax){

			decompPrevPan.innerHTML = '';

			let tileByteSize = _bpp << 3; // mul by 8

			let sample = null;
			let size = _data.length;

			let make_preview = function(text, data){
				let elem = Elem('div', {margin:8});
					let txt = Elem('label', {txtCnt:text});
					let viewport = wLib.create_preview(w,h, s);
					Elem.Set(viewport.elem, {margin:8});
					let ctx = viewport.ctx;
					app.gfx.fast[`draw_${_bpp}bppTileset`](data, pal, 0,0, xtmax, ctx);
				elem.appendChild(txt);
				elem.appendChild(viewport.elem);
				return elem;
			};

			for(let i=0; i<tileByteSize; i++){
				sample = app.decompressor( _data.slice(i, size) );
				sample = new Uint8Array( ([...sample]).concat([...(new Uint8Array(64))]) );
				decompPrevPan.appendChild( make_preview(i, sample) );
			}

		};

		let render = function(){
			// render
			//let bpp = selectBpp.elem.value;
			let bppSizeBitShift = ({2:4,4:5,8:6})[_bpp];
			let xtmax = _xtmax;    // div by 16/32/64
			let h = Math.ceil( (_data.length>>bppSizeBitShift) / xtmax ) << 3; // mul by 8
			let w = xtmax << 3;
		
			// make viewport
			let viewport = wLib.create_preview(w,h, _scale);
			Elem.Set(viewport.elem, {margin:16});
			let ctx = viewport.ctx;
			renderSpace.innerHTML = '';
			renderSpace.appendChild(viewport.elem);

			// viewport placing update
			let prevPanHeight = renderSpace.getBoundingClientRect().height;
			let prevHeight = parseInt(getComputedStyle(viewport.elem).height);
			renderSpace.style.justifyContent = prevPanHeight<=prevHeight ? 'start' : 'center';
			let prevPanWidth = renderSpace.getBoundingClientRect().width;
			let prevWidth = parseInt(getComputedStyle(viewport.elem).width);
			renderSpace.style.alignItems = prevPanWidth<=prevWidth ? 'start' : 'center';

			// get palette
			let pal = palSelector.palette;
			pal = !pal.length ? app.gfx.defaultPalettes[1] : pal;

			//app.gfx[_gfx].draw_4bppTileset(_data, pal, 0,0, 16, ctx);
			app.gfx.fast[`draw_${_bpp}bppTileset`](_data, pal, 0,0, xtmax, ctx);

			// decompressed previews panel update
			let decompPrevFactor = 0.5, dpf = decompPrevFactor;
			let floor = Math.floor;
			let max = Math.max;
			update_decompPreviews(
				max(floor(w*dpf), 1),
				max(floor(h/dpf), 1),
				max(floor(_scale*dpf), 1),
				pal,
				max(floor(xtmax*dpf), 1)
			)
		};

		// update
		o.update = function(trigger){

			if(trigger==='reset'){
				update_srcList();
				update_tileset();
				update_palettes();
				render();
			}
			
			if(trigger==='tileset'){
				update_srcList();
				update_tileset();
				render();
			}

			if(trigger==='rom'){
				update_srcList();
				update_tileset();
				render();
			}

			if(trigger==='palette'){
				update_palettes();
				render();
			}
			




			// OLD SYSTEM
			if(false)
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
