
// HexInput export
dkc2ldd.ScriptPackLoader.connector().wrapper = (function(){

	// Unsigned Hexadecimal HTML Input
	//////////////////////////////////
	// 'pref'                 arg : is the hex prefix you want to display in hexInput ('0x'/'$'/'hex:'/etc..).
	// 'prefsCatch'            arg : are optional prefixes you want to filter by pasting
	// 'bankSperatorPriority' arg : while optional prefixes filtering, if some of them make confusion with standard bank separator,
	//                              true  : give priority to standard bank separator catch,
	//                              false : give priority to the optional prefix catch making confusion.
	//                              Confusing optional prefix examples : 'hexa:', 'value:', 'FF:', 'v0:'.
	//                              Example for 'Hexa:' as optional prefix and 'Hexa:FF5BC2' as pasting value :
	//                              - with 'true' it catches : 'AFF5BC2'
	//                              - with 'false' it catches : 'FF5BC2'
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
	// - CTRL + A : selection value only.
	// - CTRL + C : copy exactly what is selected.
	// - CTRL + X : copy exactly what is selected, but cut value only in HexInput.
	// - CTRL + V : smart pasting from clipboard to HexInput :
	//   - while trying to past '2CF3' it will past '2CF3'.


	// - up/down arrow keys to increment/decrement value.
	// - prefix protection :
	//   - backspace and delete keys can not erase prefix, even in selection.
	//   - typing while cursor/selection is overlaping prefix, will write after prefix.
	
	// TODO : support XX:XXXXXX hex format
	// regEx : /((?<p1>[0-9a-f]{1,}):(?<p2>[0-9a-f]{1,}))?((?<pref>0x)?(?<val>[0-9a-f]{1,}))?/i
	/*
		('0034:da12').match(/((?<p1>[0-9a-f]{1,}):(?<p2>[0-9a-f]{1,}))?((?<pref>0x)?(?<val>[0-9a-f]{1,}))?/i)?.groups
		{p1: '0034', p2: 'da12', pref: undefined, val: undefined}

		('0x034:da12').match(/((?<p1>[0-9a-f]{1,}):(?<p2>[0-9a-f]{1,}))?((?<pref>0x)?(?<val>[0-9a-f]{1,}))?/i)?.groups
		{p1: undefined, p2: undefined, pref: '0x', val: '034'}

		('FB:A40x034:da12').match(/((?<p1>[0-9a-f]{1,}):(?<p2>[0-9a-f]{1,}))?((?<pref>0x)?(?<val>[0-9a-f]{1,}))?/i)?.groups
		{p1: 'FB', p2: 'A40', pref: undefined, val: undefined}

		(';:;0x034da12').match(/((?<p1>[0-9a-f]{1,}):(?<p2>[0-9a-f]{1,}))?((?<pref>0x)?(?<val>[0-9a-f]{1,}))?/i)?.groups
		{p1: undefined, p2: undefined, pref: undefined, val: undefined}

		(';:;0x034:da12').match(/((?<p1>[0-9a-f]{1,}):(?<p2>[0-9a-f]{1,}))?((?<pref>0x)?(?<val>[0-9a-f]{1,}))?/i)?.groups
		{p1: undefined, p2: undefined, pref: undefined, val: undefined}

		if there are the both, '0x' pref and ':' separator, '0x' has priority but catching is done util ':'
		As possible as, try not to do anything that does not make sense
	*/



	let HexInput = function(pref='', mainPrefCatch=true, prefsCatch=[],
							prefsPriority, // priority on bank separator format catch
							onlyAfterColonCatch, // can catch only after colon ':' char except on bank separator case
							ignoreBankNum // ignore bank num in bank separator case, catch only after colon ':' char
							){

		let elem = document.createElement('input');
		let _min = 0;
		let _max = Number.MAX_SAFE_INTEGER;
		let _step = 1;
		let _val = 0x0;
		let prefLen = pref.length;
		elem.setAttribute('value', pref+0);

		// max value limit property
		Object.defineProperty(elem, 'max', {
			get(){return _max},
			set(v){let newMax=parseInt(v); _max=newMax===0?0:newMax||_max;},
		});

		// step value inc/dec with up/down arrow keys
		Object.defineProperty(elem, 'step', {
			get(){return _step},
			set(v){v=parseInt(v??1); _step=v<1?1:v; },
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
	



					// ARG PRIORITY FLAGS :

						// mainPrefCatch :
						//   true  : do the 1st try
						//   false : cancel the 1st try

						// prefsPriority :
						//   true  : 4th try has highest priority except if onlyAfterColonCatch is enable and has catched something
						//   false : normal priority (as 4th try)

						// onlyAfterColonCatch :
						//   true  : 3rd-C try has highest priority on everything if 3rd-AB try failed
						//   false : cancel the 3rd-C try

						// ignoreBankNum :
						//   true  : do the 3rd-B try and cancel the 3rd-A try
						//   false : do the 3rd-A try and cancel the 3rd-B try



					// PASTING INPUT LOGIC :

						// [1ST] catch try : main HexInput hex prefix
						//
						//		: if [mainPrefCatch is at true]


						// [2ND] catch try : standard 0x hex prefix
						//
						//		: if [1ST catch try failed] && [mainPrefCatch is at false]
						//        || [1ST catch try failed] && [main pref is not '0x']
						//        || [not already catch in the 1st try by main prefix as '0x']


						// [3RD] (A) catch try : whole standard bank separator hex format
						//
						//		: if [2ND catch try failed]
						//        && [ignoreBankNum is at false]

						// [3RD] (B) catch try : after standard bank separator catch
						//
						//		: if [2ND catch try failed]
						//        && [ignoreBankNum is at true]

						// [3RD] (C) catch try : only after colon rule catch
						//
						//		: if [3RD AB catch try failed]
						//        && [onlyAfterColonCatch is at true]


						// [4TH] catch try : optional hex prefixes of arg : prefsCatch
						//		: if [3RD ABC catch try failed]
						//        || [prefsPriority is at true] && [3RD C try failed/disable]


						// [5TH] catch try : take and concat all hex char found
						//
						//		: if [all previous catch tries failed]






					// input hex value checking (the next complex process is especially required on input pasting cases)
					
					// [1ST] catch try : choosen HexInput hex prefix
					let input, _pref;
					if(mainPrefCatch){
						_pref = new RegExp( `((?<pref>${pref})([\\s])*(?<val>[0-9a-f]{1,}))`, 'i' );
						input = e.data.match(_pref)?.groups?.val || '';
					}else
						input = '';

					if(!input){
						// [2ND] catch try : standard 0x hex prefix
						if(!mainPrefCatch || pref !== '0x')
							input = (e.data.match(/(?<pref>0x)\s*(?<val>[0-9a-f]{1,})/i)?.groups?.val || '');

						// [3RD] catch try : "very exact" standard bank seperator format "hexval:hexval"
						// ("very exact" means only white space before and after are allowed as exception)
						let cancelPrefsPrio = false;
						let bankSeparatorCatch = e.data.match( /^(\s*)(?<p1>[0-9a-f]{1,})(\s*):(\s*)(?<p2>[0-9a-f]{1,})(\s*)$/i )?.groups;
						if(bankSeparatorCatch){
							if(!ignoreBankNum)
								input = (bankSeparatorCatch.p1 + bankSeparatorCatch.p2) || '';
							else
								input = bankSeparatorCatch.p2 || '';
						}else if(onlyAfterColonCatch){
							input = e.data.match( /:(\s*)(?<val>[0-9a-f]{1,})/i )?.groups?.val || '';
							if(input) cancelPrefsPrio = true;
						}

						if(!input || (prefsPriority && !cancelPrefsPrio)){
							// [4TH] catch try : optional hex prefixes of arg : prefsCatch
							for(let i=0; i<prefsCatch.length; i++){
								// catching
								_pref = new RegExp( `(?<pref>${prefsCatch[i]})([\\s])*(?<val>[0-9a-f]{1,})`, 'i' );								
								input = e.data.match(_pref)?.groups?.val || input || '';
								if(input) break;
							}

						}

						if(!input){
							// [5TH] catch try : take and concat all hex char found
							let result = e.data.match(/[(0-9a-f)]{1,}/gi) || [];
							if(result.length === 0)
								input = '';
							else
								input = result.join('');
						}
						
					}

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
						/* else
							update_val = true; */
					}
				}

				if(update_val){
					_val = parseInt(this._value.substring(prefLen), 16) || 0;
				}
			}
		);

		// let 'backspace/delete' keys normal erase behavior when that doesn't affect prexif
		elem.addEventListener('input', function(){
			_val = parseInt(this._value.substring(prefLen), 16) || 0;
		});

		// lock prefix text selection
		// except while double click on the prefix text

		// save next cursor position at every click
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
		
		// manage the selection at every double click
		let messageForOnselectEvent = 'nothing';
		elem.addEventListener(
			'dblclick',
			function(e){
				
				if(lastStartSel > prefLen) // selection : value only
					elem.setSelectionRange(prefLen, elem._value.length);
				else // selection : prefix and value
					elem.setSelectionRange(0, elem._value.length);

				// cancel select event
				if(elem._value.length>0) messageForOnselectEvent = 'cancel';
			}
		);

		// manage the selection at every normal selection
		elem.addEventListener(
			'select',
			function(e){
				if(messageForOnselectEvent === 'nothing')
					protectPrefix();
				messageForOnselectEvent = 'nothing';
			}
		);

		// increment and decrement with up/down arrow keys
		// manage with min/max limit clamping
		elem.addEventListener(
			'keydown',
			function(e){
				let sens = 0, k = e.key, up = k==='ArrowUp', down = k==='ArrowDown';
				if(up|down){
					/* if(_val < _max) sens ||= up   ?  1 : 0;
					if(_val > _min) sens ||= down ? -1 : 0;
					if(sens){
						e.preventDefault();
						this.int += sens;
						let end = this._value.length;
						this.setSelectionRange(end,end);
					} */
					let val, move = false;
					if(up){
						val = Math.min(_val+_step, _max);
						move = true;
					}
					if(down){
						val = Math.max(_val-_step, _min);
						move = true;
					}
					if(move){
						e.preventDefault();
						this.int = val;
						let end = this._value.length;
						this.setSelectionRange(end,end);
					}
				}
			}
		);

		return elem;
	};

	return HexInput;
})();
