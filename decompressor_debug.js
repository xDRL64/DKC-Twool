
// (version : release 0.0.3)


dkc2ldd.decompressor = (function(){

	//let outputMaxSize = Number.MAX_SAFE_INTEGER;
	let outputMaxSize = 0x800000; // ex-rom max size
	

	//
	// // PROCESS LIB PART
	//

	var convert_dataBytesToNibbleList = function(bytes){
	
		let len = bytes.length;
		
		//let nibbleList = [];
		let nibbleList = new Uint8Array(len << 1); // mul by 2
		let iNibble = 0;
		let byte;
		
		for(let i=0; i<len; i++){
		
			byte = bytes[i];
		
			nibbleList[iNibble] = (byte&0xF0) >> 4;
			iNibble++;

			nibbleList[iNibble] = byte&0x0F;
			iNibble++;
		}
		
		//let output = new Uint8Array(nibbleList);
		//return output;
		return nibbleList;
		
	}

	var make_byte = function(highNibble, lowNibble){
	
		return (highNibble << 4) + lowNibble;
	}

	var read_nibble = function(){
	
		if(cIndex >= nibbleList.length) keepgoing = 0; // debug
		// todo : the same for dIndex >= decOutput.length
	
		let output = nibbleList[cIndex];
		
		cIndex++;
	
		return output;
	
	}
	
	var byteWriter = {
	
		highContainer : undefined,
		
		push : function(nibble){
		
			if(this.highContainer === undefined)
				this.highContainer = nibble;
			else{
				decOutput[dIndex] = make_byte(this.highContainer, nibble);
				dIndex++;
				this.highContainer = undefined;
			}
		
		}
	
	}
	
	//
	// // DECOMPRESSION FUNCTION
	//
	
	var exec_nextCommand = function(){
	
		let cmdRef = read_nibble();
		
		if(keepgoing===0) return 1; // debug
		
		
		if(cmdRef === 0x0){
		
			// 0X : write X next bytes
			
				let X = read_nibble();
			
				let len = X * 2;
			
				for(let i=0; i<len; i++)
					byteWriter.push( read_nibble() );
				
			// 00 : end of decompression
	
				if(X === 0){
					return 1;
				}

			return 0;
		}
		
		if(cmdRef === 0x1){
		
			// 1XX : write XX once
			
				for(let i=0; i<2; i++)
					byteWriter.push( read_nibble() );
			
			return 0;
		}
		
		if(cmdRef === 0x2){

			// 2XXYY : write XXYY once
			
				for(let i=0; i<4; i++)
					byteWriter.push( read_nibble() );
		
			return 0;
		}
		
		if(cmdRef === 0x3){
		
			// 3XYY : write YY 3+X times
				
				let X = read_nibble();
				
				let Y_ = read_nibble();
				let _Y = read_nibble();
				
				let len = X + 3;
				
				for(let i=0; i<len; i++){
					byteWriter.push( Y_ );
					byteWriter.push( _Y );
				}
					
			return 0;
		}
		
		if(cmdRef === 0x4){
			
			// 4X : write 3+X times the byte at 0x00 in frequency table
			
				let X = read_nibble();
			
				let cIndexSave = cIndex;
				
				cIndex = fTableOffset;
				
				let high = read_nibble();
				let low = read_nibble();
				
				cIndex = cIndexSave;
				
				let len = X + 3;
				
				for(let i=0; i<len; i++){
					byteWriter.push( high );
					byteWriter.push( low );
				}

			return 0;
		}
		
		if(cmdRef === 0x5){
		
			// 5X : write 3+X times the byte at 0x01 in frequency table
			
				let X = read_nibble();
			
				let cIndexSave = cIndex;
				
				cIndex = fTableOffset + (0x01 * 2);
				
				let high = read_nibble();
				let low = read_nibble();
				
				cIndex = cIndexSave;
				
				let len = X + 3;
				
				for(let i=0; i<len; i++){
					byteWriter.push( high );
					byteWriter.push( low );
				}
		
			return 0;
		}
		
		if(cmdRef === 0x6){
		
			// 6 : write once the 2 bytes at 0x04 in frequency table
			
				let cIndexSave = cIndex;
				
				cIndex = fTableOffset + (0x04 * 2);
				
				byteWriter.push( read_nibble() );
				byteWriter.push( read_nibble() );
				
				byteWriter.push( read_nibble() );
				byteWriter.push( read_nibble() );

				cIndex = cIndexSave;
		
			return 0;
		}
		
		if(cmdRef === 0x7){
		
			// 7 : write once the byte at 0x02 in frequency table
			
				let cIndexSave = cIndex;
				
				cIndex = fTableOffset + (0x02 * 2);

				byteWriter.push( read_nibble() );
				byteWriter.push( read_nibble() );

				cIndex = cIndexSave;
				
			return 0;
		}
		
		if(cmdRef === 0x8){
		
			// 8 : write once the byte at 0x03 in frequency table
				
				let cIndexSave = cIndex;
				
				cIndex = fTableOffset + (0x03 * 2);
				
				byteWriter.push( read_nibble() );
				byteWriter.push( read_nibble() );

				cIndex = cIndexSave;
				
			return 0;
		}
		
		if(cmdRef === 0x9){
			
			// 9X : write the 2 bytes, from copy at 2+X before the current decompressed index
			// copy from decompressed and write to decompressed
			// (from compressed to decompressed doesn't work)

				let X = read_nibble();
	
				let offset = 2 + X;
				let len = 2;
			
				let srcOffset = dIndex - offset;

				for(let i=0; i<len; i++){
					decOutput[dIndex] = decOutput[srcOffset+i];
					dIndex++;
				}
				
			return 0;
		
		}
		
		if(cmdRef === 0xA){
		
			// AXYY : write the 3+X bytes, from copy at 3+X+YY before the current decompressed index
			// copy from decompressed and write to decompressed
			// (from compressed to decompressed doesn't work)
			
				let X = read_nibble();
				
				let Y_ = read_nibble();
				let _Y = read_nibble();
				
				let srcOffset = dIndex - (3 + X + make_byte(Y_,_Y));
				
				let len = 3 + X;
				
				for(let i=0; i<len; i++){
					decOutput[dIndex] = decOutput[srcOffset+i];
					dIndex++;
				}

			return 0;
		
		}
		
		if(cmdRef === 0xB){
		
			// BXYYZ : write the 3+X bytes, from copy at 0x103+YYZ before the current decompressed index
			// copy from decompressed and write to decompressed
			// (from compressed to decompressed doesn't work)
			
				let X = read_nibble();
				
				let Y_ = read_nibble();
				let _Y = read_nibble();
				
				let Z = read_nibble();
				
				let srcOffset = dIndex - ((Y_<<8) + (_Y<<4) + Z + 0x103);
				
				let len = 3 + X;
				
				for(let i=0; i<len; i++){
					decOutput[dIndex] = decOutput[srcOffset+i];
					dIndex++;
				}
					
			return 0;
		
		}
		
		if(cmdRef === 0xC){

			// CXYYZZ : write the 3+X bytes, from copy at YYZZ before the current decompressed index
			// copy from decompressed and write to decompressed
			// (from compressed to decompressed doesn't work)
			
			let X = read_nibble();
				
			let Y_ = read_nibble();
			let _Y = read_nibble();
			
			let Z_ = read_nibble();
			let _Z = read_nibble();
			
			let len = 3 + X;
			
			let srcOffset = dIndex - ((Y_<<12) + (_Y<<8) + (Z_<<4) + _Z);
			
			for(let i=0; i<len; i++){
				decOutput[dIndex] = decOutput[srcOffset+i];
				dIndex++;
			}
				
			return 0;
		
		}
		
		if(cmdRef === 0xD){
			
			// D : write the last byte, from copy at the end of decompressed output
			// copy from decompressed and write to decompressed
			// (from compressed to decompressed doesn't work)
			
				let srcOffset = dIndex;
	
				decOutput[dIndex] = decOutput[srcOffset-1];
				dIndex++;
			
			return 0;
		
		}
		
		if(cmdRef === 0xE){
			
			// E : write the 2 last bytes, from copy at the end of decompressed output
			// copy from decompressed and write to decompressed
			// (from compressed to decompressed doesn't work)
			
				let srcOffset = dIndex;
	
				decOutput[dIndex] = decOutput[srcOffset-2];
				dIndex++;
				decOutput[dIndex] = decOutput[srcOffset-1];
				dIndex++;
			
			return 0;
		
		}
		
		if(cmdRef === 0xF){
		
			// FX : write once the 2 bytes at 0x06+(2*X) in frequency table
		
				let X = read_nibble();
			
				let cIndexSave = cIndex;
				
				cIndex = fTableOffset + ( (0x06+(2*X)) * 2 );
				
				byteWriter.push( read_nibble() );
				byteWriter.push( read_nibble() );
				
				byteWriter.push( read_nibble() );
				byteWriter.push( read_nibble() );

				cIndex = cIndexSave;
		
			return 0;
		}
	
	}

	//
	// // PROCESS LOOP START FUNCTION
	//
	
	var nibbleList;
	
	var fTableOffset;
	
	var decOutput;
	
	var cIndex;
	
	var dIndex;
	
	var process = function(binData, printReadByteCount=false){
	
		if( !(binData instanceof Uint8Array) )
			binData = new Uint8Array(binData);

		nibbleList = convert_dataBytesToNibbleList(binData, false);

		fTableOffset = 2; // frequency table start offset, read by nibble (read in nibbleList)
		
	//	decOutput = []; // decompressed output, write by byte
		decOutput = new Uint8Array(outputMaxSize);

		cIndex = (1+38) * 2; // compressed index, count by nibble
		
		dIndex = 0; // decompressed index, count by byte
		
		keepgoing = 1; // debug
		
		// process loop
		let c = 1;
		while(c){
			c = !(exec_nextCommand());
			c = c * keepgoing; //debug
		}

		if(printReadByteCount){
			let count = Math.ceil(cIndex/2);
			let hexStr = '0x'+count.toString(16).toUpperCase();
			console.log('Decompressor log :\n\tRead byte count : ' + count + ' ' + hexStr);
		}
		
		//return new Uint8Array(decOutput);
		return decOutput.slice(0, dIndex); // return Uint8Array
	};
	
	return process;
	
})();

