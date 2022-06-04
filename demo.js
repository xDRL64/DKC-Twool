
(function(app=dkc2ldd){

    let params = new URLSearchParams(location.search);
    let p = params;

    if(p.has('preload') && p.get('preload')==='rom'){
        app.interface.srcFilePanel.rom.set_oneDataFile(
            {name:'decompressed U1.0 rom.smc', data:dkc2debug.preload.decompressedRom, useDec:false}, true
        );
    }

    if(p.has('demo')){

        if(p.get('demo')==='animated-shipmast-rain'){
            // set file data
            app.interface.update_workspace('mode_');
            app.interface.workspace.current.start_demo('shipmast anim');
            
            // show mapchip with animated tileset
            app.interface.srcFilePanel.mapchip.parameters.value = "vram=1";
            app.interface.update_workspace('mode2');
    
        }
        
        if(p.get('demo')==='animated-bg-rain'){
            // set file data
            app.interface.update_workspace('mode_');
            app.interface.workspace.current.start_demo('bg rain anim');
            
            // show
            app.interface.srcFilePanel.background.parameters.value = "format=8x8 0 4";
            app.interface.update_workspace('mode9');
    
        }

        if(p.get('demo')==='animated-forest-fg-leaves'){
            // set file data
            app.interface.update_workspace('mode_');
            app.interface.workspace.current.start_demo('forest leaves');
            
            // show
            app.interface.srcFilePanel.background.parameters.value = "32 3";
            app.interface.update_workspace('mode9');
    
        }

        if(p.get('demo')==='animated-mine-fg-debris'){
            // set file data
            app.interface.update_workspace('mode_');
            app.interface.workspace.current.start_demo('mine debris');
            
            // show
            app.interface.srcFilePanel.background.parameters.value = "32 3";
            app.interface.update_workspace('mode9');
    
        }

        if(p.get('demo')==='animated-castle-flames-(app_hack)'){
            // set file data
            app.interface.update_workspace('mode_');
            app.interface.workspace.current.start_demo('castle level');

            // app hack
            dkc2ldd.interface.srcFilePanel.tileset.decompressed[1] = dkc2ldd.interface.srcFilePanel.tileset.decompressed[1].slice(9568+32, 18464+32)
            
            // show mapchip with animated tileset
            app.interface.srcFilePanel.mapchip.parameters.value = "vram";
            app.interface.update_workspace('mode2');
    
        }

        if(p.get('demo')==='H4v0c21_$35FA80'){
            // set file data
            app.interface.update_workspace('mode_');
            app.interface.workspace.current.start_demo('unknown H4v0c21_$35FA80');
            
            // show
            app.interface.srcFilePanel.background.parameters.value = "format=8x8 0 32 frame=64";
            app.interface.update_workspace('mode9');
    
        }
        
        // hide side panels
        let fakeEvent = {stopPropagation:function(){},preventDefault:function(){}};
        app.event.slide_panel(fakeEvent, app.interface.srcFilePanel);
        app.event.slide_panel(fakeEvent, app.interface.editModePanel);
    }

})();



