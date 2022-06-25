
(function(app=dkc2ldd){

	app.mode = app.mode || [];
	
	app.mode[ 13 ] = function(editModePanParams){

		// default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
		let wLib = app.editor;
		let wLib2 = app.WorkspaceToolPack;

		let Elem = wLib2.CreateElem;
		let flags = Elem.flags;
		for(let key in flags)
			eval(`if(!${key}) var ${key} = ${flags[key]}`);

		// current workspace object
		let o = {};

		let animFrameID = setInterval(function(){o.update_render?.()},75);
		

		// code ...
		let debugOfst = 0;
		let tilesize = 16;
		let debugxtmax = 0//9;
		srcFilePanel.background.parameters.onkeydown = function(e){
			if(e.code === 'Enter') o.update();
			if(e.code === 'ArrowUp') debugOfst++;
			if(e.code === 'ArrowDown') debugOfst--;
			if(e.code === 'ArrowRight') debugxtmax++;
			if(e.code === 'ArrowLeft') debugxtmax--;
			console.log(debugOfst,debugxtmax);
		};

		let _rInput = 4, _gInput = 4, _bInput = 1; // default settings
		let _originalBin = app.asm.originalSparklingPalette;
		let _noLimitBin = app.asm.noLimitSparklingPalette;

		workspace.elem.innerHTML = '';
		//workspace.elem.style.display = 'block';






		let mode_13 = Elem('div', {w:'100%',h:'100%', disFlx, fdrCln});
		mode_13.style.flexWrap = 'wrap';


		let settingsPanel = Elem('div');

			let buildVerLabel = Elem('label', {margin:8});
				let buildVersion = Elem('input', {_type:'checkbox'});
				buildVersion.setAttribute('checked', true);
			buildVerLabel.appendChild(buildVersion);
			buildVerLabel.appendChild(Elem('span',{txtCnt:'No Substraction Limit'}));

			let channelsPanelLabel = Elem('label', {disBlk, margin:16, txtCnt:'Channel substract times number : '});

				// ORIGNAL VERSION SETTINGS INPUTS
				let channelsPanel_0 = Elem('div', {disFlx, fdrCln, wtsPre});

					let {redSub:_red, greenSub:_green, blueSub:_blue} = _originalBin;

					let redInput_0 = wLib2.DropList('Red : \t');
					for(let i=0; i<_red.length; i++)
						redInput_0.generate_item(`${i} Substraction(s) [${_red[i].size} byte(s)]`, i);
					Elem.Set(redInput_0.elem, { margin:'8 0',_min:0, _max:4, _value:_rInput});
					redInput_0.elem.children[_rInput].setAttribute('selected', true);

					let greenInput_0 = wLib2.DropList('Green : \t');
					for(let i=0; i<_green.length; i++)
						greenInput_0.generate_item(`${i} Substraction(s) [${_green[i].size} byte(s)]`, i);
					Elem.Set(greenInput_0.elem, { margin:'8 0',_min:0, _max:4, _value:_gInput});
					greenInput_0.elem.children[_gInput].setAttribute('selected', true);
					
					let blueInput_0 = wLib2.DropList('Blue : \t');
					for(let i=0; i<_blue.length; i++)
						blueInput_0.generate_item(`${i} Substraction(s) [${_blue[i].size} byte(s)]`, i);
					Elem.Set(blueInput_0.elem, { margin:'8 0',_min:0, _max:4, _value:_bInput});
					blueInput_0.elem.children[_bInput].setAttribute('selected', true);

				channelsPanel_0.appendChild(redInput_0.board);
				channelsPanel_0.appendChild(greenInput_0.board);
				channelsPanel_0.appendChild(blueInput_0.board);

				// NO LIMIT VERSION SETTINGS INPUTS
				let channelsPanel_1 = Elem('div', {disFlx, fdrCln, wtsPre});
					let noLimitMax = 24;

					let redInput_1 = wLib2.DropList('Red : \t');
					for(let i=0; i<=noLimitMax; i++)
						redInput_1.generate_item(`${i} Substraction(s)`, i);
					Elem.Set(redInput_1.elem, { margin:'8 0',_min:0, _max:4, _value:_rInput});
					redInput_1.elem.children[_rInput].setAttribute('selected', true);

					let greenInput_1 = wLib2.DropList('Green : \t');
					for(let i=0; i<=noLimitMax; i++)
						greenInput_1.generate_item(`${i} Substraction(s)`, i);
					Elem.Set(greenInput_1.elem, { margin:'8 0',_min:0, _max:4, _value:_gInput});
					greenInput_1.elem.children[_gInput].setAttribute('selected', true);

					let blueInput_1 = wLib2.DropList('Blue : \t');
					for(let i=0; i<=noLimitMax; i++)
						blueInput_1.generate_item(`${i} Substraction(s)`, i);
					Elem.Set(blueInput_1.elem, { margin:'8 0',_min:0, _max:4, _value:_bInput});
					blueInput_1.elem.children[_bInput].setAttribute('selected', true);

				channelsPanel_1.appendChild(redInput_1.board);
				channelsPanel_1.appendChild(greenInput_1.board);
				channelsPanel_1.appendChild(blueInput_1.board);

				// updatable channels panel content
				let chanPanContainer = Elem('div');
					
			channelsPanelLabel.appendChild(chanPanContainer);
				
		settingsPanel.appendChild(buildVerLabel);
		settingsPanel.appendChild(channelsPanelLabel);
		
		let renderSpace = Elem('div', {margin:8, disFlx, fdrCln});
		
		let settingsInfo = Elem('div', {wtsPre, margin:8, txtCnt:'Default settings : Buildable'});
		
		let buildOutput = Elem('div', {whiSpa:'pre-wrap', margin:8, padding:8, w:384});
		buildOutput.style.overflowWrap = 'break-word';
		buildOutput.style.border = '1px solid black';
		buildOutput.style.flexBasis = '100%';

		
		mode_13.appendChild(renderSpace);
		mode_13.appendChild(settingsPanel);
		mode_13.appendChild(settingsInfo);
		mode_13.appendChild(buildOutput);
		
		
		workspace.elem.appendChild(mode_13);


		let refInfo = '> RAM\t:\t$80D655\n> ASM\t:\tCODE_80D695\n> ROM\t:\t0x00D655\n> size\t:\t136 ; 0x88';

		let patchSizePrecision = '( * Patch does not overwrite the 24 last bytes of the affected function )';

		let create_patchDownloadLink = function(patchBuilder){
			let patch = patchBuilder.AsarPatch(_rInput, _gInput, _bInput);
			let patchBin = [];
			for(let c of patch) patchBin.push(c.charCodeAt(0));

			let o = Elem('A');
			o.href = URL.createObjectURL( new Blob([new Uint8Array( patchBin )], {type: 'application/octet-stream'}));
			o.download = `Custom Mine Sparkling Effect (r${_rInput},g${_gInput},b${_bInput}).asm`;
			o.textContent = 'Asar Patch Download Link';
			return o;
		};

		let rgbInputUpdate_original = function(){
			let _rgbInputs = [_rInput, _gInput, _bInput];
			let size = _originalBin.get_totalSize(..._rgbInputs);
			let max = _originalBin.maxSize;
			let status = _originalBin.check_size(..._rgbInputs);
			let settingsText = (_rInput===4&&_gInput===4&&_bInput===1) ? 'Default settings' : 'Custom settings';
			let freespaceText = `Free space : ${size}/${max} bytes\n\n`
			if(status){
				settingsInfo.textContent = `${settingsText} : Buildable`;
				buildOutput.textContent = freespaceText + 'Byte code :\n\n'
										+ _originalBin.get_hexStrArray(..._rgbInputs).join('')
										+ '\n\n' + refInfo + '\n\n';
				// Asar Patch Download Link
				buildOutput.appendChild( create_patchDownloadLink(_originalBin) );
				buildOutput.innerHTML += '\n' + patchSizePrecision;
			}else{
				settingsInfo.textContent = `${settingsText} : Not buildable`;
				buildOutput.textContent = freespaceText;
			}
		};
		
		let rgbInputUpdate_noLimit = function(){
			let _rgbInputs = [_rInput, _gInput, _bInput];
			let size = _noLimitBin.allData.code.length;

			let settingsText = (_rInput===4&&_gInput===4&&_bInput===1) ? 'Default settings' : 'Custom settings';
			let freespaceText = `Size : ${size} bytes\n\n`

			settingsInfo.textContent = `${settingsText} : Buildable`;

			buildOutput.textContent = freespaceText + 'Byte code :\n\n'
									+ _noLimitBin.get_hexStrArray(..._rgbInputs).join('')
									+ '\n\n' + refInfo + '\n\n';

			// Asar Patch Download Link
			buildOutput.appendChild( create_patchDownloadLink(_noLimitBin) );
			buildOutput.innerHTML += '\n' + patchSizePrecision;
		};

		let update_rgbFromInput = function(rIn, gIn, bIn){
			_rInput = parseInt(rIn.value) || 0;
			_gInput = parseInt(gIn.value) || 0;
			_bInput = parseInt(bIn.value) || 0;
		};

		let set_channelsPanel = function(){
			chanPanContainer.innerHTML = '';
			if(!buildVersion.checked){
				// setup original version
				chanPanContainer.appendChild(channelsPanel_0); // show channels panel
				update_rgbFromInput(redInput_0.elem, greenInput_0.elem, blueInput_0.elem);
				update_rgbOutput = rgbInputUpdate_original;
			}else{
				// setup no limit version
				chanPanContainer.appendChild(channelsPanel_1); // show channels panel
				update_rgbFromInput(redInput_1.elem, greenInput_1.elem, blueInput_1.elem);
				update_rgbOutput = rgbInputUpdate_noLimit;
			}
		};

		buildVersion.onchange = function(){
			set_channelsPanel();
			update_rgbOutput();
		};

		redInput_0.elem.onchange =
		redInput_1.elem.onchange = function(){
			_rInput = parseInt(this.value) || 0;
			update_rgbOutput();
		};

		greenInput_0.elem.onchange =
		greenInput_1.elem.onchange = function(){
			_gInput = parseInt(this.value) || 0;
			update_rgbOutput();
		};

		blueInput_0.elem.onchange =
		blueInput_1.elem.onchange = function(){
			_bInput = parseInt(this.value) || 0;
			update_rgbOutput();
		};


		let get_newSnespal = function(baseSnespal, iFrame){

			let len = baseSnespal.length;
			let count = len << 1; // div by 2

			//let o = new Uint8Array(len);
			let o = [];

			let rSub, gSub, bSub, subfactor;

			let clamp_iFrame = function(){
				let c = false;
				/* LDA $2A     */ let A = iFrame << 1;
				/* ASL         */ c = A&0x10000 ? true : false;
				/* AND #$003F  */ A &= 0x003F;
				/* BIT #$0020  */ if( (A&0x0020) )
				/* BEQ $80D663 */     A ^= 0x003F;
				/* EOR #$003F  */
				/* CMP #$0020  */ if( (A<0x0020) ) c = false;
				/* BCC $80D66B */ if(c) A = 0x0020;
				subfactor = A;
			};

			let set_rgbSub = function(){
				/* STA $32 */ rSub = subfactor;
				/* ASL     */
				/* ASL     */ 
				/* XBA     */
				/* STA $36 */ bSub = subfactor << 10;
				/* XBA     */
				/* ASL     */
				/* ASL     */
				/* ASL     */
				/* STA $34 */ gSub = subfactor << 5;
			};

			let mainLoop = function(){
				let pal = baseSnespal;

				let color, chan, rgb=0, A, B;

				for(let i=0; i<0x1E; i+=2){
				
					 color = (pal[i+1] << 8) + pal[i];
				
					// red
					chan = color & 0x001F;
					for(let iSub=0; iSub<_rInput; iSub++)
						chan -= rSub;
					chan = chan<0 ? 0 : chan;
					rgb = chan & 0xFFFF;
			
					// green
					chan = color & 0x03E0;
					for(let iSub=0; iSub<_gInput; iSub++)
						chan -= gSub;
					chan = chan<0 ? 0 : chan;
					rgb |= chan & 0xFFFF;
				
					// blue
					chan = color & 0x7C00;
					for(let iSub=0; iSub<_bInput; iSub++)
						chan -= bSub;
					chan = chan<0 ? 0 : chan;
					rgb |= chan & 0xFFFF;
				
					A = ((rgb&0xFF00)>>8);
					B = (rgb&0x00FF);

					o.push(B);
					o.push(A);
				
				}
			};

			clamp_iFrame();
			set_rgbSub();
			mainLoop();

			o = new Uint8Array(([0,0]).concat(o));

			return o;
		};



		let frameCounter = 0x0;
		let update_rgbOutput = null;

		// update
		o.update = function(trigger){

			
			if(trigger === 'reset'){
				set_channelsPanel();
				update_rgbOutput();
			}


			//if(false)
			let paletteSlot = srcFilePanel.palette;
			if(paletteSlot.multi > 0)
			if(srcFilePanel.bgtileset.multi > 0)
			if(srcFilePanel.background.multi > 0){
			
				// empty workspace (to empty html child elements)
				renderSpace.innerHTML = "";

				// get source file slot parameters (background)
				let parameters = srcFilePanel.background.parameters.value.match(/\w{1,}/g) || [];

				let xtmax = parseInt(parameters[0]) || 32;
				let scale = parseInt(parameters[1]) || 1;

				//palettes
				let snespal = paletteSlot.get_allInOne();
				
				let bgtileset = srcFilePanel.bgtileset.get_data()[0];

				let background = srcFilePanel.background.get_data()[0];

				let len = background.length >> 1;

				// create backgound viewport
				let W = xtmax * 8;
				let H = Math.ceil(len/xtmax) * 8;

				o.viewport = wLib.create_preview(W, H, scale);
				renderSpace.appendChild(o.viewport.view);
				
				let palPrev = wLib.create_preview(16, 8, 16);
				renderSpace.appendChild(palPrev.view);
				
				// draw background
				bgtileset = app.gfx.fast.format_2bppTileset(bgtileset); //use bpp
				
				o.update_render = function(){
					let animPal = get_newSnespal(snespal, frameCounter%0x10000);
					let PAL = app.component.Palette( {ownerRefs:[{data:animPal}], byteOffset:0} );
					PAL.init();
					PAL.update('formated2'); //use bpp
					let palettes = PAL.type.formated2; //use bpp
					app.gfx.draw_background(bgtileset, background, PAL.type.formated2, xtmax, o.viewport.ctx); //use bpp
					app.gfx.fast.draw_formatedPalette(palettes, 2, palPrev.ctx); //use bpp
					frameCounter++;
				};
				o.update_render();
			}

		};

		o.close = function(){
			// app.mode[ /**/put its mode id/**/ ].save = something;
			// delete something (eventlistener, requestanimationframe, setinveterval, etc..)
			clearInterval(animFrameID);
		};

		// connect current workspace object (export update methode)
		workspace.current = o;



	};

})();
