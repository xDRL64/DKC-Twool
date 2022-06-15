let HexInputDBG = function(
	pref='', mainPrefCatch=true, prefsCatch=[],
	prefsPriority, // priority on bank separator format catch
	onlyAfterColonCatch, // can catch only after colon ':' char except on bank separator case
	ignoreBankNum // ignore bank num in bank separator case, catch only after colon ':' char
){

	// check keyboard input on text editing
	let DEBUG = function(data){

		let debug_inputFrom = 'none';

		if(data){

			// [1ST] catch try : choosen HexInput hex prefix
			let input, _pref;
			if(mainPrefCatch){
				_pref = new RegExp( `((?<pref>${pref})([\\s])*(?<val>[0-9a-f]{1,}))`, 'i' );
				input = data.match(_pref)?.groups?.val || '';

				debug_inputFrom = '[1ST] main prefix';
			}else
				input = '';

			if(!input){
				// [2ND] catch try : standard 0x hex prefix
				if(!mainPrefCatch || pref !== '0x'){
					input = (data.match(/(?<pref>0x)\s*(?<val>[0-9a-f]{1,})/i)?.groups?.val || '');

					debug_inputFrom = '[2ND] 0x standard';
				}

				// [3RD] catch try : "very exact" standard bank seperator format "hexval:hexval"
				// ("very exact" means only white space before and after are allowed as exception)
				let cancelPrefsPrio = false;
				let bankSeparatorCatch = data.match( /^(\s*)(?<p1>[0-9a-f]{1,})(\s*):(\s*)(?<p2>[0-9a-f]{1,})(\s*)$/i )?.groups;
				if(bankSeparatorCatch){
					if(!ignoreBankNum){
						input = (bankSeparatorCatch.p1 + bankSeparatorCatch.p2) || '';

						debug_inputFrom = '[3RD A] bank separator standard';
					}else{
						input = bankSeparatorCatch.p2 || '';

						debug_inputFrom = '[3RD B] ignore bank number';
					}	
				}else if(onlyAfterColonCatch){
					input = data.match( /:(\s*)(?<val>[0-9a-f]{1,})/i )?.groups?.val || '';
					if(input) cancelPrefsPrio = true;

					debug_inputFrom = '[3RD C] after colon rule';
				}


				if(!input || (prefsPriority && !cancelPrefsPrio)){
					// [4TH] catch try : optional hex prefixes of arg : prefsCatch
					let i;for(i=0; i<prefsCatch.length; i++){
						// catching
						_pref = new RegExp( `(?<pref>${prefsCatch[i]})([\\s])*(?<val>[0-9a-f]{1,})`, 'i' );								
						input = data.match(_pref)?.groups?.val || input || '';
						if(input) break;
					}

					debug_inputFrom = `[4TH] optional prefixes : ${prefsCatch[i]}`+` :: ${debug_inputFrom}`;
				}

				if(!input){
					// [5TH] catch try : take and concat all hex char found
					let result = data.match(/[(0-9a-f)]{1,}/gi) || [];
					if(result.length === 0)
						input = '';
					else
						input = result.join('');

					debug_inputFrom = '[5TH] last catch try';
				}
				
			}

			input = (input==='') ? '' : parseInt(input,16).toString(16).toUpperCase(); // remove first zero(s)

			//console.log(`${data}\t\t\t${input}`);
			
			//return {input, from:debug_inputFrom};
			return [input, debug_inputFrom];
		}
	}
	
	return DEBUG;

};



var startDEBUG = function(pref='', mainPrefCatch=true, prefsCatch=[], prefsPriority, onlyAfterColonCatch, ignoreBankNum ){
	let test = HexInputDBG(pref, mainPrefCatch, prefsCatch, prefsPriority, onlyAfterColonCatch, ignoreBankNum);
	let res = [];
	for(let dat of _DATA)
		res.push([dat, ...(test(dat))]);

	console.table(res);
};


let _DATA = [
	'0x2CF3',
	' 0x2CF3',
	'0x2CF3 ',
	
	'0x 2CF3',
	' 0x 2CF3',
	'0x 2CF3 ',
	
	'3EE:8888',
	' 3EE:8888',
	'3EE:8888 ',
	
	'3EE :8888',
	' 3EE :8888',
	'3EE :8888 ',
	
	'3EE: 8888',
	' 3EE: 8888',
	'3EE: 8888 ',
	
	'X3EE:8888',
	' X3EE:8888',
	'X3EE:8888 ',
	
	'X3EE :8888',
	' X3EE :8888',
	'X3EE :8888 ',
	
	'X3EE: 8888',
	' X3EE: 8888',
	'X3EE: 8888 ',
	
	'3EE:8888X',
	' 3EE:8888X',
	'3EE:8888X ',
	
	'3EE :8888X',
	' 3EE :8888X',
	'3EE :8888X ',
	
	'3EE: 8888X',
	' 3EE: 8888X',
	'3EE: 8888X ',
	
	'3EEX:8888',
	' 3EEX:8888',
	'3EEX:8888 ',
	
	'3EEX :8888',
	' 3EEX :8888',
	'3EEX :8888 ',
	
	'3EEX: 8888',
	' 3EEX: 8888',
	'3EEX: 8888 ',
	
	'3EE:X8888',
	' 3EE:X8888',
	'3EE:X8888 ',
	
	'3EE :X8888',
	' 3EE :X8888',
	'3EE :X8888 ',
	
	'3EE: X8888',
	' 3EE: X8888',
	'3EE: X8888 ',
	
	'X3EEX:X8888X',
	' X3EEX:X8888X',
	'X3EEX:X8888X ',
	
	'X3EEX :X8888X',
	' X3EEX :X8888X',
	'X3EEX :X8888X ',
	
	'X3EEX: X8888X',
	' X3EEX: X8888X',
	'X3EEX: X8888X ',
	
	'3FF:8888',
	' 3FF:8888',
	'3FF:8888 ',
	
	'3FF :8888',
	' 3FF :8888',
	'3FF :8888 ',
	
	'3FF: 8888',
	' 3FF: 8888',
	'3FF: 8888 ',
	
	'FF:8888',
	' FF:8888',
	'FF:8888 ',
	
	'FF :8888',
	' FF :8888',
	'FF :8888 ',
	
	'FF: 8888',
	' FF: 8888',
	'FF: 8888 ',
	
	'XFF:8888',
	' XFF:8888',
	'XFF:8888 ',
	
	'XFF :8888',
	' XFF :8888',
	'XFF :8888 ',
	
	'XFF: 8888',
	' XFF: 8888',
	'XFF: 8888 ',
	
	'hex:5555',
	' hex:5555',
	' hex:5555 ',

	'hex: 5555',
	' hex :5555',
	' hex : 5555 ',
	
	'value:6666',
	' value:6666',
	' value:6666 ',

	'value: 6666',
	' value :6666',
	' value : 6666 ',

	'data:7777',
	' data:7777',
	' data:7777 ',

	'data: 7777',
	' data :7777',
	' data : 7777 ',
];