
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

        let settingsPanel = Elem('div');

            let substractOrderNames = [
                'rgb', 'rbg',
                'grb', 'gbr',
                'brg', 'bgr',
            ];
            let substractOrderList = wLib2.DropList('color channel substract order : ');
            for(let name of substractOrderNames)
                substractOrderList.generate_item(name,name);

            let channelsPanelLabel = Elem('label', {disBlk, txtCnt:'channel substract times : '});

                let channelsPanel = Elem('div');

                    let redLabel = Elem('label', {disBlk, txtCnt:'red : '});
                        let redSubTimesInput =  Elem('input', {_type:'number', _min:0, _max:4, _value:4});
                    redLabel.appendChild(redSubTimesInput);

                    let greenLabel = Elem('label', {disBlk, txtCnt:'green : '});
                        let greenSubTimesInput =  Elem('input', {_type:'number', _min:0, _max:4, _value:4});
                    greenLabel.appendChild(greenSubTimesInput);
                    
                    let blueLabel = Elem('label', {disBlk, txtCnt:'blue : '});
                        let blueSubTimesInput =  Elem('input', {_type:'number', _min:0, _max:1, _value:1});
                    blueLabel.appendChild(blueSubTimesInput);

                channelsPanel.appendChild(redLabel);
                channelsPanel.appendChild(greenLabel);
                channelsPanel.appendChild(blueLabel);
            
            channelsPanelLabel.appendChild(channelsPanel);
                
        settingsPanel.appendChild(substractOrderList.elem);
        settingsPanel.appendChild(channelsPanelLabel);
        
        workspace.elem.appendChild(settingsPanel);


        let curOrder = ['r','g','b'];
        let order_channelPanel = function(order){
            let channel = { r:redLabel, g:greenLabel, b:blueLabel };
            let maxset = { r:[4,4,1], g:[4,4,1], b:[2,2,1] };
            let pos = 0;
            channelsPanel.innerHTML = '';
            curOrder = [];
            for(let chan of order){
                curOrder.push(chan);
                let c = channel[chan];
                c.firstElementChild.max = maxset[chan][pos];
                channelsPanel.appendChild(c);
                pos++;
            }
        };


        let get_newSnespal = function(baseSnespal, iFrame){

            let len = baseSnespal.length;
            let count = len << 1; // div by 2

            //let o = new Uint8Array(len);
            let o = [];

            let rSub, gSub, bSub;

            let clamp_iFrame = function(){
                let c = false;
                /* LDA $2A     */
                /* ASL         */ let A = iFrame << 1;
                                  c = A&0x10000 ? true : false;

                /* AND #$003F  */ A &= 0x003F;
                /* BIT #$0020  */ if( (A&0x0020) )
                /* BEQ $80D663 */     A ^= 0x003F;
                /* EOR #$003F  */
                /* CMP #$0020  */ if( (A<0x0020) ) c = false;
                /* BCC $80D66B */ if(c) A = 0x0020;
                
                //iFrame = Math.max(0x20, Math.min(iFrame,0x3F));
                iFrame = A;
            };

            let set_rgbSub = function(){
                /* STA $32 */ rSub = iFrame;
                /* ASL     */
                /* ASL     */ 
                /* XBA     */
                /* STA $36 */ bSub = iFrame << 10;
                /* XBA     */
                /* ASL     */
                /* ASL     */
                /* ASL     */
                /* STA $34 */ gSub = iFrame << 5;
            };


            let mainLoop = function(){
                let pal = baseSnespal;
                let rInput = parseInt(redSubTimesInput.value)   || 0;
                let gInput = parseInt(greenSubTimesInput.value) || 0;
                let bInput = parseInt(blueSubTimesInput.value)  || 0;
                let chanTimes = { r:rInput, g:gInput, b:bInput };
                let chanSub   = { r:rSub, g:gSub, b:bSub };
                let chanMask  = { r:0x001F, g:0x03E0, b:0x7C00 };

                let timesOrder = [chanTimes[curOrder[0]], chanTimes[curOrder[1]], chanTimes[curOrder[2]], ];
                let subOrder   = [chanSub[curOrder[0]], chanSub[curOrder[1]], chanSub[curOrder[2]], ];
                let maskOrder  = [chanMask[curOrder[0]], chanMask[curOrder[1]], chanMask[curOrder[2]], ];
                let color, chan, rgb=0, A, B;
                let word = new Uint16Array(1);

                /* LDX #$0000    */ for(let i=0; i<0x1E; i+=2){
                /*               */
                /* LDA $FD2270,X */     color = (pal[i+1] << 8) + pal[i];
                /* AND #$7C00    */
                                        chan = color & maskOrder[0];
                /* SEC           */     for(let iSub=0; iSub<timesOrder[0]; iSub++)
                /* SBC $36       */         chan -= subOrder[0];
                                        chan = chan<0 ? 0 : chan;
                                        rgb = chan & 0xFFFF;
                /* NOP           */
                /* NOP           */
                /* BMI $80D68D   */
                /* SBC $36       */
                /* BPL $80D690   */
                /* LDA #$0000    */
                /* STA $38       */
                /*               */
                /* LDA $FD2270,X */     
                /* AND #$03E0    */               
                /* SEC           */     chan = color & maskOrder[1];
                /* SBC $34       */     for(let iSub=0; iSub<timesOrder[1]; iSub++)
                /* NOP           */         chan -= subOrder[1];
                /* NOP           */     chan = chan<0 ? 0 : chan;
                /* NOP           */     //rgb &= chan & 0xFFFF;
                /* NOP           */     rgb |= chan & 0xFFFF; // WHAT'S TSB !!!!
                /* NOP           */
                /* NOP           */




                /* NOP           */     chan = color & maskOrder[2];
                /* BPL $80D6A7   */     for(let iSub=0; iSub<timesOrder[2]; iSub++)
                /* LDA #$0000    */         chan -= subOrder[2];
                /* TSB $38       */     chan = chan<0 ? 0 : chan;
                /*               */     rgb |= chan & 0xFFFF;
                /*               */
                /* LDA $FD2270,X */
                /* AND #$001F    */     A = ((rgb&0xFF00)>>8);
                                        B = (rgb&0x00FF);

                /* SEC           */     o.push(B);
                /* SBC $32       */     o.push(A);
                /* BPL $80D6B8   */
                /* LDA #$0000    */
                /* ORA $38       */
                /*               */
                /* STA $7E8014,X */
                /* INX           */
                /* INX           */
                /* CPX #$001E    */
                /* BNE $80D67B   */ }
            };

            clamp_iFrame();
            set_rgbSub();
            mainLoop();

            o = new Uint8Array(([0,0]).concat(o));

            return o;
        };

        substractOrderList.elem.onchange = function(){
            order_channelPanel(this.value);
        };


        let frameCounter = 0x9F83;
        let renderSpace = Elem('div');
        workspace.elem.appendChild(renderSpace);
        // update
        o.update = function(trigger){

            

            //if(false)
            let paletteSlot = srcFilePanel.palette;
            if(paletteSlot.multi > 0)
            if(srcFilePanel.bgtileset.multi > 0)
            if(srcFilePanel.background.multi > 0){
            
                // empty workspace (to empty html child elements)
                renderSpace.innerHTML = "";

                // get source file slot parameters (mapchip)
                let parameters = srcFilePanel.background.parameters.value.match(/\w{1,}/g) || [];

                let xtmax = parseInt(parameters[0]) || 32//debugxtmax//32;
                let scale = parseInt(parameters[1]) || 1;

                let snespal = paletteSlot.get_data__OLD();
            //    snespal = get_newSnespal(snespal, frameCounter%0x100);
                snespal = get_newSnespal(snespal, frameCounter%0x10000);


                //let palettes = app.gfx.fast.snespalTo24bits(snespal);
                //palettes = app.gfx.defaultPalettes;
                let palDataAccess = [{data:snespal}];
                let PAL = app.component.Palette( {ownerRefs:palDataAccess, byteOffset:0} );
                PAL.init();
                PAL.update('formated2');
                let palettes = PAL.type.formated2;
                
                let bgtileset = srcFilePanel.bgtileset.get_data()[0];
                //bgtileset = [...(new Uint8Array(debugOfst*tilesize)),...bgtileset,...(new Uint8Array(1024*tilesize))];

                let background = srcFilePanel.background.get_data()[0];
                //background = [...(new Uint8Array(debugxtmax*2)),...background];

                let len = background.length >> 1;

                // create backgound viewport
                let W = xtmax * 8;
                let H = Math.ceil(len/xtmax) * 8;

                o.viewport = wLib.create_preview(W, H, scale);
                renderSpace.appendChild(o.viewport.view);
                
                let palPrev = wLib.create_preview(16, 8, 16);
                app.gfx.fast.draw_formatedPalette(palettes, 2, palPrev.ctx);
                renderSpace.appendChild(palPrev.view);

                //palettes = app.gfx.fast._4bppPal_to_2bppPal(palettes);
                //palettes = app.gfx.fast.format_palette(snespal, 2);
                //palettes = app.gfx.def2bppPal;

                //let _pal = app.gfx.defaultPalettes;
                //let pal256 = _pal[0].concat(_pal[1]).concat(_pal[2]).concat(_pal[3]).
                //            concat(_pal[4]).concat(_pal[5]).concat(_pal[6]).concat(_pal[7]);
                //pal256 = pal256.concat(pal256);
                //palettes = [pal256,pal256,pal256,pal256, pal256,pal256,pal256,pal256,];

                // draw background
                bgtileset = app.gfx.fast.format_2bppTileset(bgtileset);
                //bgtileset = app.gfx.fast.format_4bppTileset(bgtileset);
                //bgtileset = app.gfx.fast.format_8bppTileset(bgtileset);
                app.gfx.draw_background(bgtileset, background, palettes, xtmax, o.viewport.ctx);
                //app.gfx.draw_background16x8(bgtileset, background, palettes, xtmax, o.viewport.ctx);
            }

            frameCounter++;
        };

        o.close = function(){
            // app.mode[ /**/put its mode id/**/ ].save = something;
            // delete something (eventlistener, requestanimationframe, setinveterval, etc..)
        };

        // connect current workspace object (export update methode)
        workspace.current = o;

    };

})();
