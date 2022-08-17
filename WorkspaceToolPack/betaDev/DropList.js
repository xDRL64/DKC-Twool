dkc2ldd.ScriptPackLoader.connector().wrapper = (function(){
	
    let DropList = function(labelName){

        let elem = document.createElement('select');

        let generate_item = function(itemName, itemValue){
            let op = document.createElement('option');
			op.textContent = itemName;
			op.setAttribute('value', itemValue);
			elem.appendChild(op);
        };

        if(labelName){
            let ID_droplist = 'ID_' + labelName;
            elem.setAttribute('id', ID_droplist);
    
            let label = document.createElement('label');
            label.setAttribute('for', ID_droplist);
            label.textContent = labelName;
            label.style.height = 'fit-content';
            label.style.whiteSpace = 'pre';
    
            let board = document.createElement('div');
            board.style.display = 'inline-flex';
            board.style.alignItems = 'center';

            board.appendChild(label);
            board.appendChild(elem);
    
            return {elem, board, label, generate_item};
        }

        return {elem, generate_item};
    };

    return DropList;

})();