
(function(app=dkc2ldd){

    app.mode = app.mode || [];
    
    app.mode[ 2 ] = function(editModePanParams){

        // default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
        let wLib = app.editor;

        // current workspace object
        let o = {};

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

                let xcmax = parseInt(parameters[0]) || 16;
                let scale = parseInt(parameters[1]) || 1;

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
        };

        o.close = function(){
            // app.mode[ /**/put its mode id/**/ ].save = something;
            // delete something (eventlistener, requestanimationframe, setinveterval, etc..)
        };

        // connect current workspace object (export update methode)
        workspace.current = o;

    };

})();
