
dkc2ldd.write = (function(app=dkc2ldd){

	let o = {};
	
	o.set_4bppPix = function(tileset, byteOffsets, bitMask, colorIndex, rawData){
	
		let _o = byteOffsets;
		
		let d = [...rawData];
		
		let m = bitMask;
		
		let m0 = 0xFF - m; // AND
		let m1 = m; // OR
		
		let c = colorIndex; // color index
		
		d[0] = c&0x1 ? d[0]|m1 : d[0]&m0;
		d[1] = c&0x2 ? d[1]|m1 : d[1]&m0;
		d[2] = c&0x4 ? d[2]|m1 : d[2]&m0;
		d[3] = c&0x8 ? d[3]|m1 : d[3]&m0;
		
		tileset[ _o[0] ] = d[0];
		tileset[ _o[1] ] = d[1];
		tileset[ _o[2] ] = d[2];
		tileset[ _o[3] ] = d[3];
	
	};


	return o;

})();