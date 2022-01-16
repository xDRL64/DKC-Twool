
(function(app=dkc2ldd){

    app.mode = app.mode || [];
    
    app.mode[ 0 ] = function(editModePanParams){

        // default interface API
		let workspace = app.interface.workspace;
		let srcFilePanel = app.interface.srcFilePanel;
        let wLib = app.editor;

        // code ...

        workspace.elem.textContent = ""; // to empty html child elements
		
        let o = {};
    
        o.viewport = wLib.create_preview(16,64, 16);

        workspace.elem.appendChild(o.viewport.view);
        
        o.update = function(){
            if(srcFilePanel.palette.multi > 0){
            
                let snespal = srcFilePanel.palette.get_data();

                let palettes = app.gfx.fast.snespalTo24bits(snespal);
                app.gfx.fast.draw_palettes(palettes, o.viewport.ctx);

                
                //let palettes = app.gfx.safe.snespalTo24bits(snespal);
                //app.gfx.safe.draw_palettes(palettes, o.viewport.ctx);
                

                //app.gfx.fast.draw_snespal(snespal, o.viewport.ctx);

                //app.gfx.safe.draw_snespal(snespal, o.viewport.ctx);
            }
        };
        workspace.current = o;

    };

})();
