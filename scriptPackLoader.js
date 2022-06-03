dkc2ldd.ScriptPackLoader = (function(appMainObjectName='dkc2ldd'){

    let default_globalMainJsObjectName = appMainObjectName;
    let default_appDataTransferScriptTagPropName = 'WebApp_NON_STANDARD_PROPERTY_nameChain';

    let o = {};

    let untitledCount = 0;

    o.loader = function(parameters){
    
        let {
            packLoaderPath,
            globalMainJsObjectName,
            scriptPackName,
            appDataTransferScriptTagPropName,
            scriptList,
        } = parameters;

        // path from root page to script toolpack folder
        if(!packLoaderPath) return;
    
        // app main objet name
        globalMainJsObjectName ??= default_globalMainJsObjectName;
    
        // script pack object name
        scriptPackName ??= 'ScriptPack'+untitledCount;
    
        // property name of script tag used to transfer data.
        // data transfer from this script to the scripts having to be loaded.
        appDataTransferScriptTagPropName ??= default_appDataTransferScriptTagPropName;
    
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

    return o;
})();