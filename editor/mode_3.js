
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
        srcFilePanel.background.parameters.onkeydown = function(e){
            if(e.code === 'Enter') o.update();
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

                let xtmax = parseInt(parameters[0]) || 32;
                let scale = parseInt(parameters[1]) || 1;

                let snespal = srcFilePanel.palette.get_data__OLD();
                let palettes = app.gfx.fast.snespalTo24bits(snespal);
                
                let bgtileset = srcFilePanel.bgtileset.get_data__OLD();

                let background = srcFilePanel.background.get_data__OLD();

                let len = background.length / 2;

                // create backgound viewport
                let W = xtmax * 8;
                let H = Math.ceil(len/xtmax) * 8;

                o.viewport = wLib.create_preview(W, H, scale);
                workspace.elem.appendChild(o.viewport.view);

                //palettes = app.gfx.fast._4bppPal_to_2bppPal(palettes);

                // draw background
                app.gfx.draw_background(bgtileset, background, palettes, xtmax, o.viewport.ctx);
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
