
(function(app=dkc2ldd){

    app.mode = app.mode || [];
    
    app.mode[ 3 ] = function(editModePanParams){

        // default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
        let wLib = app.editor;

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

        // update
        o.update = function(trigger){
            if(srcFilePanel.palette.multi > 0)
            if(srcFilePanel.bgtileset.multi > 0)
            if(srcFilePanel.background.multi > 0){
            
                // empty workspace (to empty html child elements)
                workspace.elem.textContent = "";

                // get source file slot parameters (mapchip)
                let parameters = srcFilePanel.background.parameters.value.match(/\w{1,}/g) || [];

                let xtmax = parseInt(parameters[0]) || 32//debugxtmax//32;
                let scale = parseInt(parameters[1]) || 1;

                let snespal = srcFilePanel.palette.get_data__OLD();
                let palettes = app.gfx.fast.snespalTo24bits(snespal);
                //palettes = app.gfx.defaultPalettes;
                
                let bgtileset = srcFilePanel.bgtileset.get_data()[0];
                bgtileset = [...(new Uint8Array(debugOfst*tilesize)),...bgtileset,...(new Uint8Array(1024*tilesize))];

                let background = srcFilePanel.background.get_data()[0];
                background = [...(new Uint8Array(debugxtmax*2)),...background];

                let len = background.length >> 1;

                // create backgound viewport
                let W = xtmax * 8;
                let H = Math.ceil(len/xtmax) * 8;

                o.viewport = wLib.create_preview(W, H, scale);
                workspace.elem.appendChild(o.viewport.view);

                //palettes = app.gfx.fast._4bppPal_to_2bppPal(palettes);
                //palettes = app.gfx.fast.format_palette(snespal, 2);
                palettes = app.gfx.def2bppPal;

                let _pal = app.gfx.defaultPalettes;
                let pal256 = _pal[0].concat(_pal[1]).concat(_pal[2]).concat(_pal[3]).
                            concat(_pal[4]).concat(_pal[5]).concat(_pal[6]).concat(_pal[7]);
                pal256 = pal256.concat(pal256);
                //palettes = [pal256,pal256,pal256,pal256, pal256,pal256,pal256,pal256,];

                // draw background
                app.gfx.draw_background(bgtileset, background, palettes, xtmax, o.viewport.ctx);
                //app.gfx.draw_background16x8(bgtileset, background, palettes, xtmax, o.viewport.ctx);
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
