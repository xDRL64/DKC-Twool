
dkc2ldd.features = (function(app=dkc2ldd){

	let o = {};
	
	o.write_tilemap_to_4bppPix = function(tilemap, lvlDir, tilemax, mapchip, tileset, x,y, colorIndex){
	
		let tileObj = app.ref.tilemapPixpos_to_tile(x, y, tilemap, lvlDir, tilemax);
			
		let chipObj = app.ref.chipPixpos_to_chipFrag(
			tileObj.xtp,tileObj.ytp, tileObj.chipIndex, mapchip, tileObj.hFlip,tileObj.vFlip);
		
		let f8x8Obj = app.ref.t8x8PixPos_to_4bppData(
			chipObj.xf8, chipObj.yf8, chipObj.tile8x8Index, tileset, chipObj.hFlip,chipObj.vFlip);

		app.write.set_4bppPix(
			tileset, f8x8Obj.rowOffsets, f8x8Obj.mask, colorIndex, f8x8Obj.rawData);
			
		return { tile:tileObj, chip:chipObj, _8x8:f8x8Obj };
	
	};


	return o;

})();