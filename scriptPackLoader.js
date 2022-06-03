dkc2ldd.ScriptPackLoader = (function(appMainObjectName='dkc2ldd'){

    let default_globalMainJsObjectName = appMainObjectName;
    let default_appDataTransferScriptTagPropName = 'WebApp_NON_STANDARD_PROPERTY_nameChain';

    let o = {};

    console.log('start WorkspaceToolPack');

    let untitledCount = 0;

    o.loader = function(parameters){
        // EDIT TOOL PACK SETTINGS
    
        let {
            packLoaderPath,
            globalMainJsObjectName,
            scriptPackName,
            appDataTransferScriptTagPropName,
            scriptList,
        } = parameters;

        // path from root page to script toolpack folder
        //let packLoaderPath = "./WorkspaceToolPack/";
        if(!packLoaderPath) return;
    
        // App objet name
        globalMainJsObjectName ??= default_globalMainJsObjectName;
    
        // Toolpack object name
        scriptPackName ??= 'ScriptPack'+untitledCount;
    
        appDataTransferScriptTagPropName ??= default_appDataTransferScriptTagPropName;
    
        /* // each entry has :
        //     path               : from toolpack folder to each script to load
        //     location           : 'toolpack' or 'mainobject' or if not 'global' (by default)
        //     ownParentNameChain : for example 'parentObj.prentObj.Obj' or just 'Obj'
        let scriptList = [
            // {path:'/betaDev/examples/myExample.js', location:'toolpack', ownParentNameChain:'AllExmplObj.myExObj'}
            {path:'/betaDev/HtmlHexInput/HexInput.js', location:'toolpack', ownParentNameChain:'HexInput'},
        ]; */
    
        // DO NOT EDIT /////////////////////////////////////////////////////////////////////
    
        let baseStorageNameChain = globalMainJsObjectName + '.' + scriptPackName;
    
        let entry, script, nameChain
    
        for(entry of scriptList){
            script = document.createElement("script");
            script.setAttribute("defer", true);
            nameChain = entry.location==='mainobject'? globalMainJsObjectName+'.' : '';
            nameChain ||= entry.location==='scriptpack'? baseStorageNameChain+'.' : '';
            nameChain += entry.ownParentNameChain;
            script[appDataTransferScriptTagPropName] = nameChain;
            document.head.appendChild(script);
            script.src = packLoaderPath + entry.path;
        }
    };

    o.connector = function(appDataTransferScriptTagPropName){

        appDataTransferScriptTagPropName ??= default_appDataTransferScriptTagPropName;
    
        let curExecScript = document.currentScript;
    
        let nameChain = curExecScript[appDataTransferScriptTagPropName];
        let names = nameChain.split('.');
        let i, len = names.length, last = len-1;
        let parent = window;
        let childName = names[last];
        // check that the object chain exists
        // create all members of object chain if some parts are missing
        // keep last parent after ending loop
        for(i=0; i<last; i++){
            parent = (parent[names[i]] ??= {});
        }

        return {
            get wrapper(){return null},
            set wrapper(v){
                parent[childName] = v;
            },
        };
    };

    

    console.log('end WorkspaceToolPack');

    return o;
})();