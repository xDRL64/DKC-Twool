
(function(app=dkc2ldd){

    app.mode = app.mode || [];
    
    app.mode[ 2 ] = function(editModePanParams){

        // default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
        let wLib = app.editor;

        // current workspace object
        let o = {};

        let iFrame = 0; // vram
        let intervalRoutine = setInterval(function(){iFrame++;iFrame=iFrame>7?0:iFrame;o.update()}, 50);

        // code ...
        srcFilePanel.mapchip.parameters.onkeydown = function(e){
            if(e.code === 'Enter') o.update();
        };

        // update
        o.update = function(trigger){
            if(srcFilePanel.palette.multi > 0)
            if(srcFilePanel.tileset.multi > 0)
            if(srcFilePanel.mapchip.multi > 0){
            
                // empty workspace (to empty html child elements)
                workspace.elem.textContent = "";

                // get source file slot parameters (mapchip)
                let parameters = srcFilePanel.mapchip.parameters.value.match(/\w{1,}/g) || [];
                let _p = parameters;

                if(_p[0] !== 'vram'){
                    let xcmax = parseInt(_p[0]) || 16;
                    let scale = parseInt(_p[1]) || 1;
    
                    // get source file slot resources
                    let snespal = srcFilePanel.palette.get_data__OLD();
                    let palettes = app.gfx.fast.snespalTo24bits(snespal);
                    
                    let tileset = srcFilePanel.tileset.get_data__OLD();
    
                    let mapchip = srcFilePanel.mapchip.get_data__OLD();
    
                    let len = mapchip.length / 32;
    
                    // create mapchip viewport
                    let W = xcmax * 32;
                    let H = Math.ceil(len/xcmax) * 32;
    
                    o.viewport = wLib.create_preview(W, H, scale);
                    workspace.elem.appendChild(o.viewport.view);
                    
                    //app.gfx.draw_oneChip(tileset, mapchip, 120, palettes, o.viewport.ctx);	
                    app.gfx.draw_mapchip(tileset, mapchip, palettes, xcmax, o.viewport.ctx);	
                }

                _p = srcFilePanel.mapchip.parameters.value.match(/[\w=\.]{1,}/g) || [];
                let p = new URLSearchParams(_p.join('&'));
                //if(_p[0] === 'vram'){
                if(p.has('vram')){
                    let xcmax = parseInt(_p[1]) || 16;
                    let scale = parseInt(_p[2]) || 1;

                    // get source file slot resources
                    let palIndex = parseInt(p.get('vram')) || 0;
                    let snespal = srcFilePanel.palette.get_data__OLD();
                    snespal = (snespal.jsArray?.()) || snespal;
                    let palettes = app.gfx.fast.snespalTo24bits(snespal);
                    palettes = (palIndex*8)+8 <= palettes.length
                             ? palettes.slice(palIndex*8,(palIndex*8)+8)
                             : app.gfx.defaultPalettes;


                    let vram_tileset = srcFilePanel.tileset.get_data__OLD();
                    vram_tileset = (vram_tileset.jsArray?.()) || vram_tileset;
                    vram_tileset = [...vram_tileset];

                    /* for(let iAnim=0; iAnim<srcFilePanel.animation.multi; iAnim++){
                        //let iAnim = 1;
                        let anim = srcFilePanel.animation.vramRefs[iAnim];
                        if(anim){
                            let animTileset = srcFilePanel.animation.fileData[iAnim];
                            let frameBytes = anim.tileCount * 32;
                            let srcOfst = iFrame * frameBytes;
                            let dstOfst = anim.destIndex * 32;
                            for(let i=0; i<frameBytes; i++){
                                vram_tileset[dstOfst] = animTileset[srcOfst];
                                srcOfst++;
                                dstOfst++;
                            }
                        }
                    } */
                    let animations = srcFilePanel.animation.get_data();
                    let animRefs = srcFilePanel.animation.vramRefs;
                    app.gfx.fast.animatedTiles_to_vramTileset(animations, animRefs, vram_tileset, iFrame);

                    let mapchip = srcFilePanel.mapchip.get_data__OLD();
    
                    let len = mapchip.length / 32;
    
                    // create mapchip viewport
                    let W = xcmax * 32;
                    let H = Math.ceil(len/xcmax) * 32;
    
                    o.viewport = wLib.create_preview(W, H, scale);
                    workspace.elem.appendChild(o.viewport.view);
                    	
                    app.gfx.draw_mapchip(vram_tileset, mapchip, palettes, xcmax, o.viewport.ctx);

                }



            }
        };

        o.close = function(){
            // app.mode[ /**/put its mode id/**/ ].save = something;
            // delete something (eventlistener, requestanimationframe, setinveterval, etc..)
            clearInterval(intervalRoutine);
        };

        // connect current workspace object (export update methode)
        workspace.current = o;

    };

})();
