console.log('start hexinput');

//WorkspaceToolPackExport
((function(appDataTransferScriptTagPropName='WebApp_NON_STANDARD_PROPERTY_nameChain'){

	let curExecScript = document.currentScript;

	// start hard func ////////
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
	// end hard func //////////

	let o = {
		get wrapper(){return null},
		set wrapper(v){
			parent[childName] = v;
		},
	};

	return o;

})()).wrapper = (function(){
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
	
	// Unsigned Hexadecimal HTML Input
	//////////////////////////////////
	// 'pref'    arg  : is the hex prefix you want (0x/$/hex/etc..).
	// '.prefix' prop : allows to change the hex prefix.
	// '.int'    prop : allows to change the internal value.
	// '.max'    prop : allows to define max input value limit.
	// '.value'  prop : is protected, setter is locked.
	// '._value' prop : internal working, do not use it.
	////////////////////////////////////////////////////////////////
	// GUI features :
	// - smart selection with mouse :
	//   - double click on prefix to select prefix and hex value.
	//   - double click on hex value to select hex value only.
	//   - normal selection will clamp itself, locking prefix selection.
	// - smart pasting from clipboard :
	//   - while trying to past '2CF3' it will past '2CF3'.
	//   - while trying to past '0x2CF3' it will past '2CF3'.
	//   - while trying to past '$2CF3' it will past '2CF3'.
	//   - while trying to past 'hex:2CF3' it will past '2CF3'.
	//   - while trying to past '2CF3h' it will past '2CF3'.
	//   - while trying to past '*=/-+;,:_.2CF3' it will past '2CF3'.
	//   - while trying to past '0x002CF3' it will past '2CF3'.
	//   - while trying to past '0xx2CF3' it will past '0'.
	//   - while trying to past '00x2CF3' it will past '0'.
	//   - while trying to past '123str2CF3' it will past '123'.
	//   - this is the exact js RegEx : /(?<pref>0x)?(?<val>[0-9a-f]{1,})/i
	//     - see the next one to figure out better : /(?:0x)?[0-9a-f]{1,}/gi
	//     - then it is gave to parseInt to remove useless zeros
	// - up/down arrow keys to increment/decrement value.
	// - prefix protection :
	//   - backspace can not erase prefix, even in selection.
	//   - typing while cursor/selection is overlaping prefix, will write after prefix.
	
	let HexInput2 = function(pref=''){
		let elem = document.createElement('input');
		let _min = 0;
		let _max = Number.MAX_SAFE_INTEGER;
		let _val = 0x0;
		let prefLen = pref.length;
		elem.setAttribute('value', pref+0);

		// max value limit property
		Object.defineProperty(elem, 'max', {
			get(){return _max},
			set(v){let newMax=parseInt(v); _max=newMax===0?0:newMax||_max;},
		});
		// value properties :
		Object.defineProperty(elem, 'int', {
			get(){return _val},
			set(v){_val=v; this._value=pref+v.toString(16).toUpperCase()},
		});
		Object.defineProperty(elem, 'prefix', {
			get(){return pref},
			set(v){this._value=v+this._value.substring(prefLen); pref=v; prefLen=pref.length},
		});

		// lock original .value property (for setter only)
		Object.defineProperty(elem, 'value', {
			get(){return this._value},
			set(v){console.warn(
				'HexInput instance should never be set by using ".value" property.\n' +
				'You can risk to break good working of the HexInput instance.\n' +
				'That is why the setter of this property is locked.\n' +
				'Instead use ".prefix" and ".int" properties.\n' +
				'(Use "._value" if you really want to access the original ".value" prop.)'
			)},
		});

		// rename original .value property to ._value property
		Object.defineProperty(elem, '_value',
			Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value')
		);
		let protectPrefix = function(){
			// protect prefix (0x/$/hex/etc..)
			// get out cursor/selection if it is in prefix
			// and return new cursor/selection position
			let startSel = elem.selectionStart;
			let endSel = elem.selectionEnd;
			let dirSel = elem.selectionDirection;
			if(startSel < prefLen) startSel = prefLen;
			if(endSel   < prefLen) endSel   = prefLen;
			elem.setSelectionRange(startSel,endSel, dirSel);
			return {startSel, endSel};
		};
		// check keyboard input on text editing
		elem.addEventListener(
			"beforeinput",
			function(e){
				let isInsertText = (e.inputType === 'insertText');
				let isInsertFromPaste = (e.inputType === 'insertFromPaste');
	
				let {startSel, endSel} = protectPrefix();
				let update_val = false;

				if(isInsertText || isInsertFromPaste){
					// stop normal text input behavior
					// exec custom value update behavior
					e.preventDefault();
			
					// collect data around cursor/selection
					let curVal = this._value;
					let beforeSel = curVal.substring(0, startSel);
					let afterSel = curVal.substring(endSel);
	
					// input hex value checking
					let input = (e.data.match(/(?<pref>0x)?(?<val>[0-9a-f]{1,})/i)?.groups?.val || '');
					input = (input==='') ? '' : parseInt(input,16).toString(16).toUpperCase(); // remove first zero(s)
	
					// input value storage update
					this._value = beforeSel + input + afterSel;
	
					// cursor position update
					let newSelPos = startSel;
					newSelPos += isInsertText ? 1 : 0;
					newSelPos += isInsertFromPaste ? input.length : 0;
					this.setSelectionRange(newSelPos,newSelPos);
	
					// input integer internal value update
					update_val = true;
				}else{
					if(e.inputType === 'deleteContentBackward'){
						// protect prefix (0x/$/hex/etc..)
						// if no selection and if cursor is at left of prefix
						if(startSel===prefLen && endSel===prefLen)
							e.preventDefault();
						else
							update_val = true;
					}
				}

				if(update_val){
					_val = parseInt(this._value.substring(prefLen), 16) || 0;
				}
			}
		);
		// lock prefix text selection
		// except while double click on the prefix text
		let lastStartSel = 0;
		elem.addEventListener(
			'mousedown',
			function(e){
				let that = this;
				// if there is a text selection
				// a click needs one frame to cancel selection
				// so we can get new next cursor position, but only on next frame
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
				if(lastStartSel > prefLen) protectPrefix();
			}
		);
		// increment and decrement with up/down arrow keys
		// manage min max limit clamping
		elem.addEventListener(
			'keydown',
			function(e){
				let sens = 0, k = e.key, up = k==='ArrowUp', down = k==='ArrowDown';
				if(up|down){
					if(_val < _max) sens ||= up   ?  1 : 0;
					if(_val > _min) sens ||= down ? -1 : 0;
					if(sens){
						e.preventDefault();
						this.int += sens;
						let end = this._value.length;
						this.setSelectionRange(end,end);
					}
				}
			}
		);
		return elem;
	};

	return HexInput2;
})();



console.log('end hexinput');