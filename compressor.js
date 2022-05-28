// Kingizor DKC2 compression
/* SPDX-License-Identifier: MIT
 * Copyright (c) 2020 Kingizor */

// Code language conversion : C to JS
// Conversion by Piel, version : 0.0.2

let compressor = (function(){



	// ////////////////////////////////////////////////////////////////
	// ////////////////////////////////////////////////////////////////
	// /////////////// bd_internal.h //////////////////////////////////
	// ////////////////////////////////////////////////////////////////
	// ////////////////////////////////////////////////////////////////



	/* Compressor things */

	// compressor flag : Error Conditions
	let READ_ERROR  = 1;
	let WRITE_ERROR = 2;
	
	let DATA_STREAM = function(){
		return {
			stream : null,
			len    : 0,    /* buffer size */
			pos    : 0,    /* byte address */
			half   : 0,    /* +1 nibble */
		};
	};

	let COMPRESSOR = function(){
		return {
			i    : DATA_STREAM(),
			o    : DATA_STREAM(),
			flag : 0,
		};
	};



	// ////////////////////////////////////////////////////////////////
	// ////////////////////////////////////////////////////////////////
	// /////////////// bd_comp_lib.c //////////////////////////////////
	// ////////////////////////////////////////////////////////////////
	// ////////////////////////////////////////////////////////////////



	/* Error reporting functions */

	let bd_error_msg = "";

	let bd_get_error = function(){
		return bd_error_msg;
	};

	let bd_set_error = function(error){
		bd_error_msg = error;
	};

	/* File/Buffer handling */

	let check_size_comp = function(input_size){
		if (input_size > 0x10000) {
			bd_set_error("Input is too large to fit in a 16-bit bank. (n > 65536)");
			return 1;
		}
		if (input_size < 128) {
			bd_set_error("Input is too small. (n < 128)");
			return 1;
		}
		return 0;
	};

	let check_input_mem = function(input, input_size){
		if (input === null) {
			bd_set_error("Input pointer is null.");
			return 1;
		}
		
		if (check_size_comp(input_size))
			return 1;
		
		return 0;
	};



	// //////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////
	// ////////// bd_comp_core.c ////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////



	let rb = function(cmp) { /* Read byte */

		let _in = cmp.i;

		if (_in.pos >= _in.len) {
			cmp.flag |= READ_ERROR;
			return 0;
		}
		return _in.stream[_in.pos++];
	};

	let wn = function(cmp, val) { /* Write nibble */

		let out = cmp.o;

		if (out.pos >= out.len) {
			cmp.flag |= WRITE_ERROR;
			return;
		}
		if (out.half == 0) { /* Hi first */
			out.stream[out.pos] = val << 4;
		}
		else { /* Lo second */
			out.stream[out.pos++] |= val & 15;
		}
		out.half ^= 1;
	};

	let wb = function(cmp, val) { /* Write byte */
		wn(cmp,  15 & (val >> 4));
		wn(cmp,  15 &  val);
	};

	let ww = function(cmp, val) { /* Write word */
		wb(cmp, 255 & (val >> 8));
		wb(cmp, 255 &  val);
	};

	/* Certain cases have parameters ([a]ddr, [c]ount, etc) */
	/* If a relevant case is active, choose_cases will set appropriate values */

	let CASE_WINDOW = function(){
		return {
			addr  : 0,
			count : 0,
		};
	};

	let CASE_PARAMS = function(){
		let w = [CASE_WINDOW(),CASE_WINDOW(),CASE_WINDOW()];
		return {
			w    : w, /* 10, 11, 12 */
			n    : 0, /*  0         */
			rle  : 0, /*  3,  4,  5 */
			wwin : 0, /*  9         */
			wlut : 0, /* 15         */
		}; 
	};

	/* Determine which cases could be used for current block */

	let choose_cases = function(cmp, cp){

		/* Data to be compressed */
		let _in = cmp.i;

		let out = cmp.o;

		let is = _in.stream;
		let isp = _in.pos;
		
		let cases = 0;

		let i;

		if(true){ /* RLE */

			let x = _in.len - _in.pos;

			/* Check the next ~18 bytes */
			if (x > 18) x = 18;

			/* Are the next 3-18 bytes identical? */
			for (i = 1; i < x; i++)
				if(is[isp] !== is[isp+i])
					break;

			/* If they are, then we can use an input byte for RLE */
			if (i > 2) {
				cases |= (1 << 3);
				cp.rle = i;

				/* Or better yet, a constant */
				if (out.pos) {
					if(is[isp] === out.stream[1])
						cases |= (1 << 4);
					if(is[isp] === out.stream[2])
						cases |= (1 << 5);
				}
			}
		}

		if(true){ /* Byte Window */

			/* Window can be 8, 12 or 16 bits */
			cp.w[0].count = 0;
			cp.w[1].count = 0;
			cp.w[2].count = 0;

			for (i = 0; i < _in.pos; i++) {

				let j = 18;
				let k;
				let pos = _in.pos - i;

				/* How many bytes to compare */
				if (_in.len - _in.pos < j)
					j = _in.len - _in.pos;
				if (pos < j)
					j = pos;

				/* How many bytes match */
				for (k = 0; k < j; k++)
					if(is[isp+k] !== _in.stream[i+k])
						break;

				if (k > 2) {

					let w = cp.w;
					if (pos > 4095+259) { /* 16-bit */
						let w2 = w[2];
						if (k > w2.count) {
							w2.count = k;
							w2.addr  = pos - 0;
							cases |= (1 << 12);
						}
					}
					else if (pos > 255+k) { /* 12-bit */
						let w1 = w[1];
						if (k > w1.count) {
							w1.count = k;
							w1.addr  = pos - 259;
							cases |= (1 << 11);
						}
					}
					else { /*  8-bit */
						let w0 = w[0];
						if (k > w0.count) {
							w0.count = k;
							w0.addr  = pos - k;
							cases |= (1 << 10);
						}
					}
				}
				else if (k === 2 && pos < 18) { /* Word */
					cp.wwin = pos;
					cases |= (1 << 9);
				}

				if (k)
					i += k-1;
			}
		}

		/* Byte Constants */
		if (out.pos) {
			if(is[isp] === out.stream[3])
				cases |= (1 << 7);
			if(is[isp] === out.stream[4])
				cases |= (1 << 8);
		}

		/* Word LUT */
		if (out.pos) {
			if (_in.pos+1 < _in.len) {
				if ((is[isp] == out.stream[5])
				&&  (is[isp+1] == out.stream[6]))
					cases |= (1 << 6);

				for (i = 7; i < 38; i+=2) {
					if ((is[isp] == out.stream[i])
					&&  (is[isp+1] == out.stream[i+1])
					) {
						cp.wlut = (i - 7) / 2;
						cases |= (1 << 15);
						break;
					}
				}
			}
		}

		if(true){ /* Repeats */

			/* Byte */
			if(_in.pos && is[isp] === is[isp-1])
				cases |= (1 << 13);

			/* Word */
			if ((_in.pos > 1)
			&& ( _in.pos + 1 < _in.len)
			&& (is[isp  ] === is[isp-2])
			&& (is[isp+1] === is[isp-1]))
				cases |= (1 << 14);

		}

		if(true){ /* Direct Copy */
			cases |= (1 << 0); /* n  Bytes   */
			cases |= (1 << 1); /* 1  Byte    */
			cases |= (1 << 2); /* 1  Word    */
		}

		return cases;
	};

	/* How many bytes the current case outputs */

	let byte_count = function(cp, c) {
		switch (c) {
			case  0:          { return cp.n;                   }
			case  1: case  7:
			case  8: case 13: { return 1;                      }
			case  2:
			case  6: case  9:
			case 14: case 15: { return 2;                      }
			case  3:
			case  4: case  5: { return cp.rle;                 }
			case 10:
			case 11: case 12: { return cp.w[(c & 3)^2].count;  }
		}
		return 0;
	};

	/* Ratios always include the command nibble */

	let ratio_case = function(cp, c) {
		switch (c) {
			case  0:          { return (1.0 + cp.n) / cp.n;   }
			case  1:          { return 3.0 / 2.0;             }
			case  2:          { return 5.0 / 4.0;             }
			case  3:          { return 2.0 / cp.rle;          }
			case  4: case  5: { return 1.0 / cp.rle;          }
			case  6: case 14: { return 1.0 / 4.0;             }
			case  7:
			case  8: case 13:
			case  9: case 15: { return 1.0 / 2.0;             }
			case 10:          { return 2.0 / (cp.w[0].count); }
			case 11:          { return 2.5 / (cp.w[1].count); }
			case 12:          { return 3.0 / (cp.w[2].count); }
		}
		return 0;
	};

	let encode_case = function(cmp, cp, c) {

		/* Write case */
		wn(cmp, c);
	
		switch (c) {
	
			/* n bytes */
			case 0: {
				wn(cmp, cp.n);
				while (cp.n--)
					wb(cmp, rb(cmp));
				break;
			}
	
			/* 2 bytes or 1 byte */
			case 2: { wb(cmp, rb(cmp)); }
			case 1: { wb(cmp, rb(cmp)); break; }
	
			/* RLE input (3-18) */
			case 3: {
				wn(cmp, cp.rle - 3);
				wb(cmp, rb(cmp));
				cmp.i.pos += (cp.rle - 1);
				break;
			}
	
			/* RLE constant (3-18) */
			case 4:
			case 5: {
				wn(cmp, cp.rle - 3);
				cmp.i.pos += (cp.rle);
				break;
			}
	
			/* Single constants or repeats */
			case 7: case  8: case 13: { cmp.i.pos += (1); break; }
			case 6: case 14:          { cmp.i.pos += (2); break; }
	
		   /* Word window */
			case 9: {
				wn(cmp, cp.wwin - 2);
				cmp.i.pos += (2);
				break;
			}
	
			/* 8-bit window */
			case 10: {
				wn(cmp, cp.w[0].count - 3);
				wb(cmp, cp.w[0].addr);
				cmp.i.pos += (cp.w[0].count);
				break;
			}
	
			/* 12-bit window */
			case 11: {
				wn(cmp, cp.w[1].count -  3);
				wb(cmp, cp.w[1].addr  >> 4);
				wn(cmp, cp.w[1].addr  & 15);
				cmp.i.pos += (cp.w[1].count);
				break;
			}
	
			/* 16-bit window */
			case 12: {
				wn(cmp, cp.w[2].count - 3);
				ww(cmp, cp.w[2].addr);
				cmp.i.pos += (cp.w[2].count);
				break;
			}
	
			/* Word LUT */
			case 15: {
				wn(cmp, cp.wlut);
				cmp.i.pos += (2);
				break;
			}
		}
		return 0;
	};
	
	/* Return the best non-copy case for the current position */

	let single_case = function(cmp, cp) {

		let best_case = 0; /* worst case by default */

		let cases = choose_cases(cmp, cp);

		let best_ratio = 3.0;

		let cur_ratio = 0.0;

		let i;

		/* Determine best case */
		for (i = 3; i < 16; i++) {
			
			if (!(cases & (1 << i)))
				continue;

			cur_ratio = ratio_case(cp, i);

			/* Pick the case with the best ratio */
			if (cur_ratio < best_ratio) {
				best_ratio = cur_ratio;
				best_case  = i;
			}

			/* If ratio is the same, pick the case that outputs most bytes */
			else if (cur_ratio === best_ratio) {
				if (byte_count(cp, i) > byte_count(cp, best_case)) {
					best_ratio = cur_ratio;
					best_case  = i;
				}
			}
		}
		return best_case;
	};


	/* Get the best case for the current position.
	If the best case is one of the copy cases (0/1/2),
	determine how many bytes we can skip.
	If we're evaluating data instead of processing it,
	we may want more data than case 0 can handle. (n > 15)
	*/

	let get_case = function(cmp, cp, copy_limit) {

		let _in = cmp.i;
		
		let best_case = single_case(cmp, cp);

		/* If we have to copy, determine the best number */
		if (best_case < 3) {
			let i;

			let new_case;

			/* Count how many consecutive bytes can't use a better case */
			for (i = 0; i < copy_limit; i++) {

				if (_in.pos >= _in.len)
					break;

				new_case = single_case(cmp, cp);

				if ((new_case >= 3)
				&&  (ratio_case(cp, new_case) <= (3.0 / 4.0)))
					break;
					_in.pos++;
			}
			_in.pos -= i; /* Undo the lookahead */
			cp.n = i; /* How many bytes to copy */
			best_case = (i > 2) ? 0 : i;
		}

		return best_case;
	};

	/* A compressed data block starts with a table of constants. */
	/* First two entries are bytes used with RLE. */
	/* Next three are two bytes and a word entry that have dedicated cases. */
	/* Finally there are a further sixteen indexed words. */

	let DATA_CONSTANT = function(){
		return {
			count : 0,
			index : 0,
		};
	};

	let sort_count = function(aa, bb) {

		if (bb.count < aa.count)
			return -1;
		if (bb.count > aa.count)
			return  1;
	
		/* Here we face a dilemma. If the counts are the same we end up with
		multiple candidate constants, and there is no telling which ones will
		be the most effective without trying them. One option would be to
		decide randomly, but it's better to be deterministic. Better yet we
		could try and figure out what makes a particular choice better. */
	
		if (bb.index < aa.index)
			return  1;
		/* if (bb.index > aa.index) */
			return -1;
	};

	let write_constant = function(cmp, dc, dc_count, write, write_count){
		let i;
		let units = 0;
	
		/* Sort by most frequent occurrences */

		// sort from index : 0 to dc_count - 1
		let sortPart = dc.slice(0,dc_count);
		sortPart.sort(sort_count);
		for(i=0; i<dc_count; i++) dc[i] = sortPart[i];
	
		/* Write the n most frequently used units */
		for (i = 0; i < dc_count && units < write_count; i++, units++)
			write(cmp, dc[i].index);
	};

	let choose_constants = function(cmp) {

		let i;

		let _in = cmp.i;

		let iwLen = 256+256+65536;
		let iw = new Array(iwLen); /* incontiguous words */
		for(i=0; i<iwLen; i++) iw[i] = DATA_CONSTANT();
	
		let ib = iw.slice(65536,iwLen);   /* incontiguous bytes */
		let cb = ib.slice(256,ib.length); /* contiguous bytes */
	
		if(true){
			for (i = 0; i < 256; i++)
				cb[i].index = i;
			for (i = 0; i < 256; i++)
				ib[i].index = i;
			for (i = 0; i < 65536; i++)
				iw[i].index = i;
		}

		let cp = CASE_PARAMS();
		let best_case;
	
		while (_in.pos < _in.len) {
	
			/* Determine the best non-constant case */

			best_case = get_case(cmp, cp, _in.len);

			let is = _in.stream;
			let isp = _in.pos;

			switch (best_case) {
				case 0: {
					for (i = 0; i < cp.n; i++)
						ib[is[isp+i]].count++;
					for (i = 0; i < cp.n>>1; i++)
						iw[ (is[isp+(i*2)] << 8) | is[isp+(i*2+1)] ].count++;
					break;
				}
				case 2: {
					iw[ (is[isp] << 8) | is[isp+1] ].count++;
					ib[ is[isp+1] ].count++;
				}
				case 1: { ib[is[isp]].count++; break; }
				case 3: { cb[is[isp]].count++; break; }
			}

			_in.pos += byte_count(cp, best_case);
		}
	
		/* Reset input position */
		_in.pos = 0;
	
		/* Data starts with an unused value */
		/* Note: This might be a mistake on our end.
				 If it is, delete this line */
		wb(cmp, 0);
	
		/* Write constants to output buffer */
		write_constant(cmp, cb,   256, wb,  2); /* Best   contiguous bytes */
		write_constant(cmp, ib,   256, wb,  2); /* Best incontiguous bytes */
		write_constant(cmp, iw, 65536, ww, 17); /* Best incontiguous words */
	
		return 0;
	};
	
	let error_check = function(e) {
		if (e & READ_ERROR) {
			bd_set_error("Error reading from input stream.");
			return 1;
		}
		if (e & WRITE_ERROR) {
			bd_set_error("Output size has grown larger than the input size.");
			return 1;
		}
		return 0;
	};

	let simple_method = function(cmp) {
		let cp = CASE_PARAMS();
		for (;;) {
			if (encode_case(cmp, cp, get_case(cmp, cp, 15)))
				return 1;
			if (error_check(cmp.flag))
				return 1;
			if (cmp.i.pos >= cmp.i.len)
				return 0;
		}
	};


	let bd_compress = function(cmp){

		/* Generate the LUT */
		if (choose_constants(cmp))
			return 1;

		if (simple_method(cmp))
			return 1;

		/* End with a nul command */
		wb(cmp, 0);
		if (cmp.o.half)
			wn(cmp, 0);
	
		return 0;
	};

	// ////////// END OF bd_comp_core.c /////////////////////////////////////////



	// //////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////
	// ///////////////// ENTRY POINT AND OUTPUT RESULT //////////////////////////
	// //////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////

	

	let bd_compress_mem_to_mem = function(output, input, input_size){

		if (check_input_mem(input, input_size))
			return 1;
	
		let cmp = COMPRESSOR();

		cmp.i.stream = input;
		cmp.i.len    = input_size;

		cmp.o.len    = cmp.i.len * 2 + 0x28;
		cmp.o.stream = new Uint8Array(cmp.o.len);
	
		if (bd_compress(cmp)) {
			return 1;
		}

		output.data = cmp.o.stream.slice(0,cmp.o.pos);

		return 0;
	};



	// //////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////
	// ////////// FINAL JS PROCESS OBJECT RETURN ////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////
	// //////////////////////////////////////////////////////////////////////////



	let o = {};

	o.outputErrorMessage = '';

	o.process = function(binData){ // binData : Uint8Array

		let output = {data:null};
		let input = binData;
		let input_size = binData.length;

		if (bd_compress_mem_to_mem(output, input, input_size)) {
			o.outputErrorMessage = "Compression Error: " + bd_get_error();
		}

		return output.data;
	};

	return o;

})();
