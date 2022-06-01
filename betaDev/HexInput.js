
let HexInput = function(pref){
	let elem = document.createElement('input');
	let _val = 0x0;
	Object.defineProperty(elem, 'int', {
		get(){return parseInt(this.value, 16)},
		set(v){_val=v; this.value=v.toString(16).toUpperCase()},
	});
	elem.addEventListener(
		"beforeinput",
		function(e){
			let isInsertText = (e.inputType === 'insertText');
			let isInsertFromPaste = (e.inputType === 'insertFromPaste');
			if(isInsertText || isInsertFromPaste){
				e.preventDefault();
	
				let input = (e.data.match(/(?<pref>0x)?(?<val>[0-9a-f]{1,})/i)?.groups?.val || '');
				input = (input==='') ? '' : parseInt(input,16).toString(16).toUpperCase(); // remove first zero(s)
	
				let curVal = this.value;
				let startSel = this.selectionStart;
				let endSel = this.selectionEnd;
				let beforeSel = curVal.substring(0, startSel);
				let afterSel = curVal.substring(endSel);
	
				this.value = beforeSel + input + afterSel;

				let newSelPos = startSel;
				newSelPos += isInsertText ? 1 : 0;
				newSelPos += isInsertFromPaste ? input.length : 0;

				this.setSelectionRange(newSelPos,newSelPos);

				_val = parseInt(this.value,16) || 0;
			}
		}
	);
	return elem;
};

let HexInput2 = function(pref=''){
	let elem = document.createElement('input');
	let _val = 0x0;
	let prefLen = pref.length;
	elem.setAttribute('value', pref);
	Object.defineProperty(elem, 'int', {
		get(){return parseInt(this.value.substring(prefLen), 16)},
		set(v){_val=v; this.value=v.toString(16).toUpperCase()},
	});
	Object.defineProperty(elem, 'prefix', {
		get(){return pref},
		set(v){pref=v; prefLen=pref.length},
	});
	elem.protectPrefix = function(){
		// protect prefix (0x/$/hex/etc..)
		// get out cursor/selection if it is in prefix
		// and return new cursor/selection position
		let startSel = this.selectionStart;
		let endSel = this.selectionEnd;
		if(startSel < prefLen) startSel = prefLen;
		if(endSel   < prefLen) endSel   = prefLen;
		this.setSelectionRange(startSel,endSel);
		return {startSel, endSel};
	};
	elem.addEventListener(
		"beforeinput",
		function(e){
			let isInsertText = (e.inputType === 'insertText');
			let isInsertFromPaste = (e.inputType === 'insertFromPaste');

			let {startSel, endSel} = this.protectPrefix();

			if(isInsertText || isInsertFromPaste){
				// stop normal text input behavior
				// exec custom value update behavior
				e.preventDefault();
		
				// collect data around cursor/selection
				let curVal = this.value;
				let beforeSel = curVal.substring(0, startSel);
				let afterSel = curVal.substring(endSel);

				// input hex value checking
				let input = (e.data.match(/(?<pref>0x)?(?<val>[0-9a-f]{1,})/i)?.groups?.val || '');
				input = (input==='') ? '' : parseInt(input,16).toString(16).toUpperCase(); // remove first zero(s)

				// input value storage update
				this.value = beforeSel + input + afterSel;

				// cursor position update
				let newSelPos = startSel;
				newSelPos += isInsertText ? 1 : 0;
				newSelPos += isInsertFromPaste ? input.length : 0;
				this.setSelectionRange(newSelPos,newSelPos);

				// input integer internal value update
				_val = parseInt(this.value,16) || 0;
			}else{
				if(e.inputType === 'deleteContentBackward'){
					// protect prefix (0x/$/hex/etc..)
					// if no selection and if cursor is at left of prefix
					if(startSel===prefLen && endSel===prefLen)
						e.preventDefault();
				}
			}
		}
	);
	let lastStartSel = 0;
	elem.addEventListener(
		'mousedown',
		function(e){
			let that = this;
			requestAnimationFrame(function(){
				if(that.selectionStart === that.selectionEnd){
					lastStartSel = that.selectionStart;
				}
			});
		}
	);
	elem.addEventListener(
		'select',
		function(e){
			if(lastStartSel > prefLen) this.protectPrefix();
		}
	);
	return elem;
};