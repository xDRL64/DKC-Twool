
(function(app=dkc2ldd){

	// return : mapchipGfxBuffer [chipIndex] [flip(4)] = ImageData(32x32)
	//
	//

	// This version of create_mapchipGfxBuffer uses ImageData type in "tile cache",
	// and returns ImageData type elements that are stored in the output result.

	// Tiles of "tile cache" data are copied with a built-in method to the output result (in the hardcoded part).
	// The way to copy is : CanvasRenderingContext2D.putImageData(ImageData, x,y),
	// and then : CanvasRenderingContext2D.getImageData(0,0, 32,32)
	// 4 CanvasRenderingContext2D are created (one for each of the 4 chip flips) before the FORLOOP.
	// ImageData type elements of the output result must be created at last in the FORLOOP.

	// This version of create_mapchipGfxBuffer is the final version that hardcodes built-in instruction calls,
	// and it shards the objects that own built-in functions called during hardcoded process.
	// To copy tiles it is : 16(chiptile) * 4(flip) = 64 js instructions.

	app.gfx.fast.create_mapchipGfxBuffer = function(rawMapchip, _4formatedTileset, palettes){

		let _4ts = _4formatedTileset;
		let tsLen = _4ts.length;

		// tileCache [tileIndex] [palette(8)] [flip(4)] = ImageData(8x8)
		let tileCache = new Array(tsLen); // tile index dimension
		for(let i=0; i<tsLen; i++){
			tileCache[i] = new Array(8); // palette dimension
		}

		let count =  rawMapchip.length >> 5; // div by 32
		let len = count << 5; // mul by 32

		let ctx = document.createElement("canvas").getContext('2d');

		// o/mapchipGfxBuffer [chipIndex] [flip(4)] = ImageData(32x32)
		let o = new Array(count); // chip dimension
		o.n = new Array(count);
		o.h = new Array(count);
		o.v = new Array(count);
		o.a = new Array(count);


		let iChip = 0;
		let d = rawMapchip;
		let A,B, t, p, f;
		let chip, nChip, hChip, vChip, aChip;
		let flipTile, nTile, hTile, vTile, aTile;
		
		let nC = document.createElement('canvas'); nC.width=32; nC.height=32;   nChip = nC.getContext('2d');
		let hC = document.createElement('canvas'); hC.width=32; hC.height=32;   hChip = hC.getContext('2d');
		let vC = document.createElement('canvas'); vC.width=32; vC.height=32;   vChip = vC.getContext('2d');
		let aC = document.createElement('canvas'); aC.width=32; aC.height=32;   aChip = aC.getContext('2d');

		let make_tileFlipCache = function(){

			let flipCache = tileCache[t][p] = new Array(4); // flip dimension

			flipCache[0] = ctx.createImageData(8,8);
			flipCache[1] = ctx.createImageData(8,8);
			flipCache[2] = ctx.createImageData(8,8);
			flipCache[3] = ctx.createImageData(8,8);
			
			let n = flipCache[0].data;
			let h = flipCache[1].data;
			let v = flipCache[2].data;
			let a = flipCache[3].data;

			let tile=_4ts[t], nTile=tile[0], hTile=tile[1], vTile=tile[2], aTile=tile[3];

			let pal = palettes[p];
			let nCol, hCol, vCol, aCol;

			// by pix
			//                y  x        i             i             i             i
			nCol = pal[ nTile[0][0] ];  n[0]=nCol[0]; n[1]=nCol[1]; n[2]=nCol[2]; n[3]=255;
			hCol = pal[ hTile[0][0] ];  h[0]=hCol[0]; h[1]=hCol[1]; h[2]=hCol[2]; h[3]=255;
			vCol = pal[ vTile[0][0] ];  v[0]=vCol[0]; v[1]=vCol[1]; v[2]=vCol[2]; v[3]=255;
			aCol = pal[ aTile[0][0] ];  a[0]=aCol[0]; a[1]=aCol[1]; a[2]=aCol[2]; a[3]=255;
			
			nCol = pal[ nTile[0][1] ];  n[4]=nCol[0]; n[5]=nCol[1]; n[6]=nCol[2]; n[7]=255;
			hCol = pal[ hTile[0][1] ];  h[4]=hCol[0]; h[5]=hCol[1]; h[6]=hCol[2]; h[7]=255;
			vCol = pal[ vTile[0][1] ];  v[4]=vCol[0]; v[5]=vCol[1]; v[6]=vCol[2]; v[7]=255;
			aCol = pal[ aTile[0][1] ];  a[4]=aCol[0]; a[5]=aCol[1]; a[6]=aCol[2]; a[7]=255;
			
			nCol = pal[ nTile[0][2] ];  n[8]=nCol[0]; n[9]=nCol[1]; n[10]=nCol[2]; n[11]=255;
			hCol = pal[ hTile[0][2] ];  h[8]=hCol[0]; h[9]=hCol[1]; h[10]=hCol[2]; h[11]=255;
			vCol = pal[ vTile[0][2] ];  v[8]=vCol[0]; v[9]=vCol[1]; v[10]=vCol[2]; v[11]=255;
			aCol = pal[ aTile[0][2] ];  a[8]=aCol[0]; a[9]=aCol[1]; a[10]=aCol[2]; a[11]=255;
			
			nCol = pal[ nTile[0][3] ];  n[12]=nCol[0]; n[13]=nCol[1]; n[14]=nCol[2]; n[15]=255;
			hCol = pal[ hTile[0][3] ];  h[12]=hCol[0]; h[13]=hCol[1]; h[14]=hCol[2]; h[15]=255;
			vCol = pal[ vTile[0][3] ];  v[12]=vCol[0]; v[13]=vCol[1]; v[14]=vCol[2]; v[15]=255;
			aCol = pal[ aTile[0][3] ];  a[12]=aCol[0]; a[13]=aCol[1]; a[14]=aCol[2]; a[15]=255;
			
			nCol = pal[ nTile[0][4] ];  n[16]=nCol[0]; n[17]=nCol[1]; n[18]=nCol[2]; n[19]=255;
			hCol = pal[ hTile[0][4] ];  h[16]=hCol[0]; h[17]=hCol[1]; h[18]=hCol[2]; h[19]=255;
			vCol = pal[ vTile[0][4] ];  v[16]=vCol[0]; v[17]=vCol[1]; v[18]=vCol[2]; v[19]=255;
			aCol = pal[ aTile[0][4] ];  a[16]=aCol[0]; a[17]=aCol[1]; a[18]=aCol[2]; a[19]=255;
			
			nCol = pal[ nTile[0][5] ];  n[20]=nCol[0]; n[21]=nCol[1]; n[22]=nCol[2]; n[23]=255;
			hCol = pal[ hTile[0][5] ];  h[20]=hCol[0]; h[21]=hCol[1]; h[22]=hCol[2]; h[23]=255;
			vCol = pal[ vTile[0][5] ];  v[20]=vCol[0]; v[21]=vCol[1]; v[22]=vCol[2]; v[23]=255;
			aCol = pal[ aTile[0][5] ];  a[20]=aCol[0]; a[21]=aCol[1]; a[22]=aCol[2]; a[23]=255;
			
			nCol = pal[ nTile[0][6] ];  n[24]=nCol[0]; n[25]=nCol[1]; n[26]=nCol[2]; n[27]=255;
			hCol = pal[ hTile[0][6] ];  h[24]=hCol[0]; h[25]=hCol[1]; h[26]=hCol[2]; h[27]=255;
			vCol = pal[ vTile[0][6] ];  v[24]=vCol[0]; v[25]=vCol[1]; v[26]=vCol[2]; v[27]=255;
			aCol = pal[ aTile[0][6] ];  a[24]=aCol[0]; a[25]=aCol[1]; a[26]=aCol[2]; a[27]=255;
			
			nCol = pal[ nTile[0][7] ];  n[28]=nCol[0]; n[29]=nCol[1]; n[30]=nCol[2]; n[31]=255;
			hCol = pal[ hTile[0][7] ];  h[28]=hCol[0]; h[29]=hCol[1]; h[30]=hCol[2]; h[31]=255;
			vCol = pal[ vTile[0][7] ];  v[28]=vCol[0]; v[29]=vCol[1]; v[30]=vCol[2]; v[31]=255;
			aCol = pal[ aTile[0][7] ];  a[28]=aCol[0]; a[29]=aCol[1]; a[30]=aCol[2]; a[31]=255;
			
			nCol = pal[ nTile[1][0] ];  n[32]=nCol[0]; n[33]=nCol[1]; n[34]=nCol[2]; n[35]=255;
			hCol = pal[ hTile[1][0] ];  h[32]=hCol[0]; h[33]=hCol[1]; h[34]=hCol[2]; h[35]=255;
			vCol = pal[ vTile[1][0] ];  v[32]=vCol[0]; v[33]=vCol[1]; v[34]=vCol[2]; v[35]=255;
			aCol = pal[ aTile[1][0] ];  a[32]=aCol[0]; a[33]=aCol[1]; a[34]=aCol[2]; a[35]=255;
			
			nCol = pal[ nTile[1][1] ];  n[36]=nCol[0]; n[37]=nCol[1]; n[38]=nCol[2]; n[39]=255;
			hCol = pal[ hTile[1][1] ];  h[36]=hCol[0]; h[37]=hCol[1]; h[38]=hCol[2]; h[39]=255;
			vCol = pal[ vTile[1][1] ];  v[36]=vCol[0]; v[37]=vCol[1]; v[38]=vCol[2]; v[39]=255;
			aCol = pal[ aTile[1][1] ];  a[36]=aCol[0]; a[37]=aCol[1]; a[38]=aCol[2]; a[39]=255;
			
			nCol = pal[ nTile[1][2] ];  n[40]=nCol[0]; n[41]=nCol[1]; n[42]=nCol[2]; n[43]=255;
			hCol = pal[ hTile[1][2] ];  h[40]=hCol[0]; h[41]=hCol[1]; h[42]=hCol[2]; h[43]=255;
			vCol = pal[ vTile[1][2] ];  v[40]=vCol[0]; v[41]=vCol[1]; v[42]=vCol[2]; v[43]=255;
			aCol = pal[ aTile[1][2] ];  a[40]=aCol[0]; a[41]=aCol[1]; a[42]=aCol[2]; a[43]=255;
			
			nCol = pal[ nTile[1][3] ];  n[44]=nCol[0]; n[45]=nCol[1]; n[46]=nCol[2]; n[47]=255;
			hCol = pal[ hTile[1][3] ];  h[44]=hCol[0]; h[45]=hCol[1]; h[46]=hCol[2]; h[47]=255;
			vCol = pal[ vTile[1][3] ];  v[44]=vCol[0]; v[45]=vCol[1]; v[46]=vCol[2]; v[47]=255;
			aCol = pal[ aTile[1][3] ];  a[44]=aCol[0]; a[45]=aCol[1]; a[46]=aCol[2]; a[47]=255;
			
			nCol = pal[ nTile[1][4] ];  n[48]=nCol[0]; n[49]=nCol[1]; n[50]=nCol[2]; n[51]=255;
			hCol = pal[ hTile[1][4] ];  h[48]=hCol[0]; h[49]=hCol[1]; h[50]=hCol[2]; h[51]=255;
			vCol = pal[ vTile[1][4] ];  v[48]=vCol[0]; v[49]=vCol[1]; v[50]=vCol[2]; v[51]=255;
			aCol = pal[ aTile[1][4] ];  a[48]=aCol[0]; a[49]=aCol[1]; a[50]=aCol[2]; a[51]=255;
			
			nCol = pal[ nTile[1][5] ];  n[52]=nCol[0]; n[53]=nCol[1]; n[54]=nCol[2]; n[55]=255;
			hCol = pal[ hTile[1][5] ];  h[52]=hCol[0]; h[53]=hCol[1]; h[54]=hCol[2]; h[55]=255;
			vCol = pal[ vTile[1][5] ];  v[52]=vCol[0]; v[53]=vCol[1]; v[54]=vCol[2]; v[55]=255;
			aCol = pal[ aTile[1][5] ];  a[52]=aCol[0]; a[53]=aCol[1]; a[54]=aCol[2]; a[55]=255;
			
			nCol = pal[ nTile[1][6] ];  n[56]=nCol[0]; n[57]=nCol[1]; n[58]=nCol[2]; n[59]=255;
			hCol = pal[ hTile[1][6] ];  h[56]=hCol[0]; h[57]=hCol[1]; h[58]=hCol[2]; h[59]=255;
			vCol = pal[ vTile[1][6] ];  v[56]=vCol[0]; v[57]=vCol[1]; v[58]=vCol[2]; v[59]=255;
			aCol = pal[ aTile[1][6] ];  a[56]=aCol[0]; a[57]=aCol[1]; a[58]=aCol[2]; a[59]=255;
			
			nCol = pal[ nTile[1][7] ];  n[60]=nCol[0]; n[61]=nCol[1]; n[62]=nCol[2]; n[63]=255;
			hCol = pal[ hTile[1][7] ];  h[60]=hCol[0]; h[61]=hCol[1]; h[62]=hCol[2]; h[63]=255;
			vCol = pal[ vTile[1][7] ];  v[60]=vCol[0]; v[61]=vCol[1]; v[62]=vCol[2]; v[63]=255;
			aCol = pal[ aTile[1][7] ];  a[60]=aCol[0]; a[61]=aCol[1]; a[62]=aCol[2]; a[63]=255;
			
			nCol = pal[ nTile[2][0] ];  n[64]=nCol[0]; n[65]=nCol[1]; n[66]=nCol[2]; n[67]=255;
			hCol = pal[ hTile[2][0] ];  h[64]=hCol[0]; h[65]=hCol[1]; h[66]=hCol[2]; h[67]=255;
			vCol = pal[ vTile[2][0] ];  v[64]=vCol[0]; v[65]=vCol[1]; v[66]=vCol[2]; v[67]=255;
			aCol = pal[ aTile[2][0] ];  a[64]=aCol[0]; a[65]=aCol[1]; a[66]=aCol[2]; a[67]=255;
			
			nCol = pal[ nTile[2][1] ];  n[68]=nCol[0]; n[69]=nCol[1]; n[70]=nCol[2]; n[71]=255;
			hCol = pal[ hTile[2][1] ];  h[68]=hCol[0]; h[69]=hCol[1]; h[70]=hCol[2]; h[71]=255;
			vCol = pal[ vTile[2][1] ];  v[68]=vCol[0]; v[69]=vCol[1]; v[70]=vCol[2]; v[71]=255;
			aCol = pal[ aTile[2][1] ];  a[68]=aCol[0]; a[69]=aCol[1]; a[70]=aCol[2]; a[71]=255;
			
			nCol = pal[ nTile[2][2] ];  n[72]=nCol[0]; n[73]=nCol[1]; n[74]=nCol[2]; n[75]=255;
			hCol = pal[ hTile[2][2] ];  h[72]=hCol[0]; h[73]=hCol[1]; h[74]=hCol[2]; h[75]=255;
			vCol = pal[ vTile[2][2] ];  v[72]=vCol[0]; v[73]=vCol[1]; v[74]=vCol[2]; v[75]=255;
			aCol = pal[ aTile[2][2] ];  a[72]=aCol[0]; a[73]=aCol[1]; a[74]=aCol[2]; a[75]=255;
			
			nCol = pal[ nTile[2][3] ];  n[76]=nCol[0]; n[77]=nCol[1]; n[78]=nCol[2]; n[79]=255;
			hCol = pal[ hTile[2][3] ];  h[76]=hCol[0]; h[77]=hCol[1]; h[78]=hCol[2]; h[79]=255;
			vCol = pal[ vTile[2][3] ];  v[76]=vCol[0]; v[77]=vCol[1]; v[78]=vCol[2]; v[79]=255;
			aCol = pal[ aTile[2][3] ];  a[76]=aCol[0]; a[77]=aCol[1]; a[78]=aCol[2]; a[79]=255;
			
			nCol = pal[ nTile[2][4] ];  n[80]=nCol[0]; n[81]=nCol[1]; n[82]=nCol[2]; n[83]=255;
			hCol = pal[ hTile[2][4] ];  h[80]=hCol[0]; h[81]=hCol[1]; h[82]=hCol[2]; h[83]=255;
			vCol = pal[ vTile[2][4] ];  v[80]=vCol[0]; v[81]=vCol[1]; v[82]=vCol[2]; v[83]=255;
			aCol = pal[ aTile[2][4] ];  a[80]=aCol[0]; a[81]=aCol[1]; a[82]=aCol[2]; a[83]=255;
			
			nCol = pal[ nTile[2][5] ];  n[84]=nCol[0]; n[85]=nCol[1]; n[86]=nCol[2]; n[87]=255;
			hCol = pal[ hTile[2][5] ];  h[84]=hCol[0]; h[85]=hCol[1]; h[86]=hCol[2]; h[87]=255;
			vCol = pal[ vTile[2][5] ];  v[84]=vCol[0]; v[85]=vCol[1]; v[86]=vCol[2]; v[87]=255;
			aCol = pal[ aTile[2][5] ];  a[84]=aCol[0]; a[85]=aCol[1]; a[86]=aCol[2]; a[87]=255;
			
			nCol = pal[ nTile[2][6] ];  n[88]=nCol[0]; n[89]=nCol[1]; n[90]=nCol[2]; n[91]=255;
			hCol = pal[ hTile[2][6] ];  h[88]=hCol[0]; h[89]=hCol[1]; h[90]=hCol[2]; h[91]=255;
			vCol = pal[ vTile[2][6] ];  v[88]=vCol[0]; v[89]=vCol[1]; v[90]=vCol[2]; v[91]=255;
			aCol = pal[ aTile[2][6] ];  a[88]=aCol[0]; a[89]=aCol[1]; a[90]=aCol[2]; a[91]=255;
			
			nCol = pal[ nTile[2][7] ];  n[92]=nCol[0]; n[93]=nCol[1]; n[94]=nCol[2]; n[95]=255;
			hCol = pal[ hTile[2][7] ];  h[92]=hCol[0]; h[93]=hCol[1]; h[94]=hCol[2]; h[95]=255;
			vCol = pal[ vTile[2][7] ];  v[92]=vCol[0]; v[93]=vCol[1]; v[94]=vCol[2]; v[95]=255;
			aCol = pal[ aTile[2][7] ];  a[92]=aCol[0]; a[93]=aCol[1]; a[94]=aCol[2]; a[95]=255;
			
			nCol = pal[ nTile[3][0] ];  n[96]=nCol[0]; n[97]=nCol[1]; n[98]=nCol[2]; n[99]=255;
			hCol = pal[ hTile[3][0] ];  h[96]=hCol[0]; h[97]=hCol[1]; h[98]=hCol[2]; h[99]=255;
			vCol = pal[ vTile[3][0] ];  v[96]=vCol[0]; v[97]=vCol[1]; v[98]=vCol[2]; v[99]=255;
			aCol = pal[ aTile[3][0] ];  a[96]=aCol[0]; a[97]=aCol[1]; a[98]=aCol[2]; a[99]=255;
			
			nCol = pal[ nTile[3][1] ];  n[100]=nCol[0]; n[101]=nCol[1]; n[102]=nCol[2]; n[103]=255;
			hCol = pal[ hTile[3][1] ];  h[100]=hCol[0]; h[101]=hCol[1]; h[102]=hCol[2]; h[103]=255;
			vCol = pal[ vTile[3][1] ];  v[100]=vCol[0]; v[101]=vCol[1]; v[102]=vCol[2]; v[103]=255;
			aCol = pal[ aTile[3][1] ];  a[100]=aCol[0]; a[101]=aCol[1]; a[102]=aCol[2]; a[103]=255;
			
			nCol = pal[ nTile[3][2] ];  n[104]=nCol[0]; n[105]=nCol[1]; n[106]=nCol[2]; n[107]=255;
			hCol = pal[ hTile[3][2] ];  h[104]=hCol[0]; h[105]=hCol[1]; h[106]=hCol[2]; h[107]=255;
			vCol = pal[ vTile[3][2] ];  v[104]=vCol[0]; v[105]=vCol[1]; v[106]=vCol[2]; v[107]=255;
			aCol = pal[ aTile[3][2] ];  a[104]=aCol[0]; a[105]=aCol[1]; a[106]=aCol[2]; a[107]=255;
			
			nCol = pal[ nTile[3][3] ];  n[108]=nCol[0]; n[109]=nCol[1]; n[110]=nCol[2]; n[111]=255;
			hCol = pal[ hTile[3][3] ];  h[108]=hCol[0]; h[109]=hCol[1]; h[110]=hCol[2]; h[111]=255;
			vCol = pal[ vTile[3][3] ];  v[108]=vCol[0]; v[109]=vCol[1]; v[110]=vCol[2]; v[111]=255;
			aCol = pal[ aTile[3][3] ];  a[108]=aCol[0]; a[109]=aCol[1]; a[110]=aCol[2]; a[111]=255;
			
			nCol = pal[ nTile[3][4] ];  n[112]=nCol[0]; n[113]=nCol[1]; n[114]=nCol[2]; n[115]=255;
			hCol = pal[ hTile[3][4] ];  h[112]=hCol[0]; h[113]=hCol[1]; h[114]=hCol[2]; h[115]=255;
			vCol = pal[ vTile[3][4] ];  v[112]=vCol[0]; v[113]=vCol[1]; v[114]=vCol[2]; v[115]=255;
			aCol = pal[ aTile[3][4] ];  a[112]=aCol[0]; a[113]=aCol[1]; a[114]=aCol[2]; a[115]=255;
			
			nCol = pal[ nTile[3][5] ];  n[116]=nCol[0]; n[117]=nCol[1]; n[118]=nCol[2]; n[119]=255;
			hCol = pal[ hTile[3][5] ];  h[116]=hCol[0]; h[117]=hCol[1]; h[118]=hCol[2]; h[119]=255;
			vCol = pal[ vTile[3][5] ];  v[116]=vCol[0]; v[117]=vCol[1]; v[118]=vCol[2]; v[119]=255;
			aCol = pal[ aTile[3][5] ];  a[116]=aCol[0]; a[117]=aCol[1]; a[118]=aCol[2]; a[119]=255;
			
			nCol = pal[ nTile[3][6] ];  n[120]=nCol[0]; n[121]=nCol[1]; n[122]=nCol[2]; n[123]=255;
			hCol = pal[ hTile[3][6] ];  h[120]=hCol[0]; h[121]=hCol[1]; h[122]=hCol[2]; h[123]=255;
			vCol = pal[ vTile[3][6] ];  v[120]=vCol[0]; v[121]=vCol[1]; v[122]=vCol[2]; v[123]=255;
			aCol = pal[ aTile[3][6] ];  a[120]=aCol[0]; a[121]=aCol[1]; a[122]=aCol[2]; a[123]=255;
			
			nCol = pal[ nTile[3][7] ];  n[124]=nCol[0]; n[125]=nCol[1]; n[126]=nCol[2]; n[127]=255;
			hCol = pal[ hTile[3][7] ];  h[124]=hCol[0]; h[125]=hCol[1]; h[126]=hCol[2]; h[127]=255;
			vCol = pal[ vTile[3][7] ];  v[124]=vCol[0]; v[125]=vCol[1]; v[126]=vCol[2]; v[127]=255;
			aCol = pal[ aTile[3][7] ];  a[124]=aCol[0]; a[125]=aCol[1]; a[126]=aCol[2]; a[127]=255;
			
			nCol = pal[ nTile[4][0] ];  n[128]=nCol[0]; n[129]=nCol[1]; n[130]=nCol[2]; n[131]=255;
			hCol = pal[ hTile[4][0] ];  h[128]=hCol[0]; h[129]=hCol[1]; h[130]=hCol[2]; h[131]=255;
			vCol = pal[ vTile[4][0] ];  v[128]=vCol[0]; v[129]=vCol[1]; v[130]=vCol[2]; v[131]=255;
			aCol = pal[ aTile[4][0] ];  a[128]=aCol[0]; a[129]=aCol[1]; a[130]=aCol[2]; a[131]=255;
			
			nCol = pal[ nTile[4][1] ];  n[132]=nCol[0]; n[133]=nCol[1]; n[134]=nCol[2]; n[135]=255;
			hCol = pal[ hTile[4][1] ];  h[132]=hCol[0]; h[133]=hCol[1]; h[134]=hCol[2]; h[135]=255;
			vCol = pal[ vTile[4][1] ];  v[132]=vCol[0]; v[133]=vCol[1]; v[134]=vCol[2]; v[135]=255;
			aCol = pal[ aTile[4][1] ];  a[132]=aCol[0]; a[133]=aCol[1]; a[134]=aCol[2]; a[135]=255;
			
			nCol = pal[ nTile[4][2] ];  n[136]=nCol[0]; n[137]=nCol[1]; n[138]=nCol[2]; n[139]=255;
			hCol = pal[ hTile[4][2] ];  h[136]=hCol[0]; h[137]=hCol[1]; h[138]=hCol[2]; h[139]=255;
			vCol = pal[ vTile[4][2] ];  v[136]=vCol[0]; v[137]=vCol[1]; v[138]=vCol[2]; v[139]=255;
			aCol = pal[ aTile[4][2] ];  a[136]=aCol[0]; a[137]=aCol[1]; a[138]=aCol[2]; a[139]=255;
			
			nCol = pal[ nTile[4][3] ];  n[140]=nCol[0]; n[141]=nCol[1]; n[142]=nCol[2]; n[143]=255;
			hCol = pal[ hTile[4][3] ];  h[140]=hCol[0]; h[141]=hCol[1]; h[142]=hCol[2]; h[143]=255;
			vCol = pal[ vTile[4][3] ];  v[140]=vCol[0]; v[141]=vCol[1]; v[142]=vCol[2]; v[143]=255;
			aCol = pal[ aTile[4][3] ];  a[140]=aCol[0]; a[141]=aCol[1]; a[142]=aCol[2]; a[143]=255;
			
			nCol = pal[ nTile[4][4] ];  n[144]=nCol[0]; n[145]=nCol[1]; n[146]=nCol[2]; n[147]=255;
			hCol = pal[ hTile[4][4] ];  h[144]=hCol[0]; h[145]=hCol[1]; h[146]=hCol[2]; h[147]=255;
			vCol = pal[ vTile[4][4] ];  v[144]=vCol[0]; v[145]=vCol[1]; v[146]=vCol[2]; v[147]=255;
			aCol = pal[ aTile[4][4] ];  a[144]=aCol[0]; a[145]=aCol[1]; a[146]=aCol[2]; a[147]=255;
			
			nCol = pal[ nTile[4][5] ];  n[148]=nCol[0]; n[149]=nCol[1]; n[150]=nCol[2]; n[151]=255;
			hCol = pal[ hTile[4][5] ];  h[148]=hCol[0]; h[149]=hCol[1]; h[150]=hCol[2]; h[151]=255;
			vCol = pal[ vTile[4][5] ];  v[148]=vCol[0]; v[149]=vCol[1]; v[150]=vCol[2]; v[151]=255;
			aCol = pal[ aTile[4][5] ];  a[148]=aCol[0]; a[149]=aCol[1]; a[150]=aCol[2]; a[151]=255;
			
			nCol = pal[ nTile[4][6] ];  n[152]=nCol[0]; n[153]=nCol[1]; n[154]=nCol[2]; n[155]=255;
			hCol = pal[ hTile[4][6] ];  h[152]=hCol[0]; h[153]=hCol[1]; h[154]=hCol[2]; h[155]=255;
			vCol = pal[ vTile[4][6] ];  v[152]=vCol[0]; v[153]=vCol[1]; v[154]=vCol[2]; v[155]=255;
			aCol = pal[ aTile[4][6] ];  a[152]=aCol[0]; a[153]=aCol[1]; a[154]=aCol[2]; a[155]=255;
			
			nCol = pal[ nTile[4][7] ];  n[156]=nCol[0]; n[157]=nCol[1]; n[158]=nCol[2]; n[159]=255;
			hCol = pal[ hTile[4][7] ];  h[156]=hCol[0]; h[157]=hCol[1]; h[158]=hCol[2]; h[159]=255;
			vCol = pal[ vTile[4][7] ];  v[156]=vCol[0]; v[157]=vCol[1]; v[158]=vCol[2]; v[159]=255;
			aCol = pal[ aTile[4][7] ];  a[156]=aCol[0]; a[157]=aCol[1]; a[158]=aCol[2]; a[159]=255;
			
			nCol = pal[ nTile[5][0] ];  n[160]=nCol[0]; n[161]=nCol[1]; n[162]=nCol[2]; n[163]=255;
			hCol = pal[ hTile[5][0] ];  h[160]=hCol[0]; h[161]=hCol[1]; h[162]=hCol[2]; h[163]=255;
			vCol = pal[ vTile[5][0] ];  v[160]=vCol[0]; v[161]=vCol[1]; v[162]=vCol[2]; v[163]=255;
			aCol = pal[ aTile[5][0] ];  a[160]=aCol[0]; a[161]=aCol[1]; a[162]=aCol[2]; a[163]=255;
			
			nCol = pal[ nTile[5][1] ];  n[164]=nCol[0]; n[165]=nCol[1]; n[166]=nCol[2]; n[167]=255;
			hCol = pal[ hTile[5][1] ];  h[164]=hCol[0]; h[165]=hCol[1]; h[166]=hCol[2]; h[167]=255;
			vCol = pal[ vTile[5][1] ];  v[164]=vCol[0]; v[165]=vCol[1]; v[166]=vCol[2]; v[167]=255;
			aCol = pal[ aTile[5][1] ];  a[164]=aCol[0]; a[165]=aCol[1]; a[166]=aCol[2]; a[167]=255;
			
			nCol = pal[ nTile[5][2] ];  n[168]=nCol[0]; n[169]=nCol[1]; n[170]=nCol[2]; n[171]=255;
			hCol = pal[ hTile[5][2] ];  h[168]=hCol[0]; h[169]=hCol[1]; h[170]=hCol[2]; h[171]=255;
			vCol = pal[ vTile[5][2] ];  v[168]=vCol[0]; v[169]=vCol[1]; v[170]=vCol[2]; v[171]=255;
			aCol = pal[ aTile[5][2] ];  a[168]=aCol[0]; a[169]=aCol[1]; a[170]=aCol[2]; a[171]=255;
			
			nCol = pal[ nTile[5][3] ];  n[172]=nCol[0]; n[173]=nCol[1]; n[174]=nCol[2]; n[175]=255;
			hCol = pal[ hTile[5][3] ];  h[172]=hCol[0]; h[173]=hCol[1]; h[174]=hCol[2]; h[175]=255;
			vCol = pal[ vTile[5][3] ];  v[172]=vCol[0]; v[173]=vCol[1]; v[174]=vCol[2]; v[175]=255;
			aCol = pal[ aTile[5][3] ];  a[172]=aCol[0]; a[173]=aCol[1]; a[174]=aCol[2]; a[175]=255;
			
			nCol = pal[ nTile[5][4] ];  n[176]=nCol[0]; n[177]=nCol[1]; n[178]=nCol[2]; n[179]=255;
			hCol = pal[ hTile[5][4] ];  h[176]=hCol[0]; h[177]=hCol[1]; h[178]=hCol[2]; h[179]=255;
			vCol = pal[ vTile[5][4] ];  v[176]=vCol[0]; v[177]=vCol[1]; v[178]=vCol[2]; v[179]=255;
			aCol = pal[ aTile[5][4] ];  a[176]=aCol[0]; a[177]=aCol[1]; a[178]=aCol[2]; a[179]=255;
			
			nCol = pal[ nTile[5][5] ];  n[180]=nCol[0]; n[181]=nCol[1]; n[182]=nCol[2]; n[183]=255;
			hCol = pal[ hTile[5][5] ];  h[180]=hCol[0]; h[181]=hCol[1]; h[182]=hCol[2]; h[183]=255;
			vCol = pal[ vTile[5][5] ];  v[180]=vCol[0]; v[181]=vCol[1]; v[182]=vCol[2]; v[183]=255;
			aCol = pal[ aTile[5][5] ];  a[180]=aCol[0]; a[181]=aCol[1]; a[182]=aCol[2]; a[183]=255;
			
			nCol = pal[ nTile[5][6] ];  n[184]=nCol[0]; n[185]=nCol[1]; n[186]=nCol[2]; n[187]=255;
			hCol = pal[ hTile[5][6] ];  h[184]=hCol[0]; h[185]=hCol[1]; h[186]=hCol[2]; h[187]=255;
			vCol = pal[ vTile[5][6] ];  v[184]=vCol[0]; v[185]=vCol[1]; v[186]=vCol[2]; v[187]=255;
			aCol = pal[ aTile[5][6] ];  a[184]=aCol[0]; a[185]=aCol[1]; a[186]=aCol[2]; a[187]=255;
			
			nCol = pal[ nTile[5][7] ];  n[188]=nCol[0]; n[189]=nCol[1]; n[190]=nCol[2]; n[191]=255;
			hCol = pal[ hTile[5][7] ];  h[188]=hCol[0]; h[189]=hCol[1]; h[190]=hCol[2]; h[191]=255;
			vCol = pal[ vTile[5][7] ];  v[188]=vCol[0]; v[189]=vCol[1]; v[190]=vCol[2]; v[191]=255;
			aCol = pal[ aTile[5][7] ];  a[188]=aCol[0]; a[189]=aCol[1]; a[190]=aCol[2]; a[191]=255;
			
			nCol = pal[ nTile[6][0] ];  n[192]=nCol[0]; n[193]=nCol[1]; n[194]=nCol[2]; n[195]=255;
			hCol = pal[ hTile[6][0] ];  h[192]=hCol[0]; h[193]=hCol[1]; h[194]=hCol[2]; h[195]=255;
			vCol = pal[ vTile[6][0] ];  v[192]=vCol[0]; v[193]=vCol[1]; v[194]=vCol[2]; v[195]=255;
			aCol = pal[ aTile[6][0] ];  a[192]=aCol[0]; a[193]=aCol[1]; a[194]=aCol[2]; a[195]=255;
			
			nCol = pal[ nTile[6][1] ];  n[196]=nCol[0]; n[197]=nCol[1]; n[198]=nCol[2]; n[199]=255;
			hCol = pal[ hTile[6][1] ];  h[196]=hCol[0]; h[197]=hCol[1]; h[198]=hCol[2]; h[199]=255;
			vCol = pal[ vTile[6][1] ];  v[196]=vCol[0]; v[197]=vCol[1]; v[198]=vCol[2]; v[199]=255;
			aCol = pal[ aTile[6][1] ];  a[196]=aCol[0]; a[197]=aCol[1]; a[198]=aCol[2]; a[199]=255;
			
			nCol = pal[ nTile[6][2] ];  n[200]=nCol[0]; n[201]=nCol[1]; n[202]=nCol[2]; n[203]=255;
			hCol = pal[ hTile[6][2] ];  h[200]=hCol[0]; h[201]=hCol[1]; h[202]=hCol[2]; h[203]=255;
			vCol = pal[ vTile[6][2] ];  v[200]=vCol[0]; v[201]=vCol[1]; v[202]=vCol[2]; v[203]=255;
			aCol = pal[ aTile[6][2] ];  a[200]=aCol[0]; a[201]=aCol[1]; a[202]=aCol[2]; a[203]=255;
			
			nCol = pal[ nTile[6][3] ];  n[204]=nCol[0]; n[205]=nCol[1]; n[206]=nCol[2]; n[207]=255;
			hCol = pal[ hTile[6][3] ];  h[204]=hCol[0]; h[205]=hCol[1]; h[206]=hCol[2]; h[207]=255;
			vCol = pal[ vTile[6][3] ];  v[204]=vCol[0]; v[205]=vCol[1]; v[206]=vCol[2]; v[207]=255;
			aCol = pal[ aTile[6][3] ];  a[204]=aCol[0]; a[205]=aCol[1]; a[206]=aCol[2]; a[207]=255;
			
			nCol = pal[ nTile[6][4] ];  n[208]=nCol[0]; n[209]=nCol[1]; n[210]=nCol[2]; n[211]=255;
			hCol = pal[ hTile[6][4] ];  h[208]=hCol[0]; h[209]=hCol[1]; h[210]=hCol[2]; h[211]=255;
			vCol = pal[ vTile[6][4] ];  v[208]=vCol[0]; v[209]=vCol[1]; v[210]=vCol[2]; v[211]=255;
			aCol = pal[ aTile[6][4] ];  a[208]=aCol[0]; a[209]=aCol[1]; a[210]=aCol[2]; a[211]=255;
			
			nCol = pal[ nTile[6][5] ];  n[212]=nCol[0]; n[213]=nCol[1]; n[214]=nCol[2]; n[215]=255;
			hCol = pal[ hTile[6][5] ];  h[212]=hCol[0]; h[213]=hCol[1]; h[214]=hCol[2]; h[215]=255;
			vCol = pal[ vTile[6][5] ];  v[212]=vCol[0]; v[213]=vCol[1]; v[214]=vCol[2]; v[215]=255;
			aCol = pal[ aTile[6][5] ];  a[212]=aCol[0]; a[213]=aCol[1]; a[214]=aCol[2]; a[215]=255;
			
			nCol = pal[ nTile[6][6] ];  n[216]=nCol[0]; n[217]=nCol[1]; n[218]=nCol[2]; n[219]=255;
			hCol = pal[ hTile[6][6] ];  h[216]=hCol[0]; h[217]=hCol[1]; h[218]=hCol[2]; h[219]=255;
			vCol = pal[ vTile[6][6] ];  v[216]=vCol[0]; v[217]=vCol[1]; v[218]=vCol[2]; v[219]=255;
			aCol = pal[ aTile[6][6] ];  a[216]=aCol[0]; a[217]=aCol[1]; a[218]=aCol[2]; a[219]=255;
			
			nCol = pal[ nTile[6][7] ];  n[220]=nCol[0]; n[221]=nCol[1]; n[222]=nCol[2]; n[223]=255;
			hCol = pal[ hTile[6][7] ];  h[220]=hCol[0]; h[221]=hCol[1]; h[222]=hCol[2]; h[223]=255;
			vCol = pal[ vTile[6][7] ];  v[220]=vCol[0]; v[221]=vCol[1]; v[222]=vCol[2]; v[223]=255;
			aCol = pal[ aTile[6][7] ];  a[220]=aCol[0]; a[221]=aCol[1]; a[222]=aCol[2]; a[223]=255;
			
			nCol = pal[ nTile[7][0] ];  n[224]=nCol[0]; n[225]=nCol[1]; n[226]=nCol[2]; n[227]=255;
			hCol = pal[ hTile[7][0] ];  h[224]=hCol[0]; h[225]=hCol[1]; h[226]=hCol[2]; h[227]=255;
			vCol = pal[ vTile[7][0] ];  v[224]=vCol[0]; v[225]=vCol[1]; v[226]=vCol[2]; v[227]=255;
			aCol = pal[ aTile[7][0] ];  a[224]=aCol[0]; a[225]=aCol[1]; a[226]=aCol[2]; a[227]=255;
			
			nCol = pal[ nTile[7][1] ];  n[228]=nCol[0]; n[229]=nCol[1]; n[230]=nCol[2]; n[231]=255;
			hCol = pal[ hTile[7][1] ];  h[228]=hCol[0]; h[229]=hCol[1]; h[230]=hCol[2]; h[231]=255;
			vCol = pal[ vTile[7][1] ];  v[228]=vCol[0]; v[229]=vCol[1]; v[230]=vCol[2]; v[231]=255;
			aCol = pal[ aTile[7][1] ];  a[228]=aCol[0]; a[229]=aCol[1]; a[230]=aCol[2]; a[231]=255;
			
			nCol = pal[ nTile[7][2] ];  n[232]=nCol[0]; n[233]=nCol[1]; n[234]=nCol[2]; n[235]=255;
			hCol = pal[ hTile[7][2] ];  h[232]=hCol[0]; h[233]=hCol[1]; h[234]=hCol[2]; h[235]=255;
			vCol = pal[ vTile[7][2] ];  v[232]=vCol[0]; v[233]=vCol[1]; v[234]=vCol[2]; v[235]=255;
			aCol = pal[ aTile[7][2] ];  a[232]=aCol[0]; a[233]=aCol[1]; a[234]=aCol[2]; a[235]=255;
			
			nCol = pal[ nTile[7][3] ];  n[236]=nCol[0]; n[237]=nCol[1]; n[238]=nCol[2]; n[239]=255;
			hCol = pal[ hTile[7][3] ];  h[236]=hCol[0]; h[237]=hCol[1]; h[238]=hCol[2]; h[239]=255;
			vCol = pal[ vTile[7][3] ];  v[236]=vCol[0]; v[237]=vCol[1]; v[238]=vCol[2]; v[239]=255;
			aCol = pal[ aTile[7][3] ];  a[236]=aCol[0]; a[237]=aCol[1]; a[238]=aCol[2]; a[239]=255;
			
			nCol = pal[ nTile[7][4] ];  n[240]=nCol[0]; n[241]=nCol[1]; n[242]=nCol[2]; n[243]=255;
			hCol = pal[ hTile[7][4] ];  h[240]=hCol[0]; h[241]=hCol[1]; h[242]=hCol[2]; h[243]=255;
			vCol = pal[ vTile[7][4] ];  v[240]=vCol[0]; v[241]=vCol[1]; v[242]=vCol[2]; v[243]=255;
			aCol = pal[ aTile[7][4] ];  a[240]=aCol[0]; a[241]=aCol[1]; a[242]=aCol[2]; a[243]=255;
			
			nCol = pal[ nTile[7][5] ];  n[244]=nCol[0]; n[245]=nCol[1]; n[246]=nCol[2]; n[247]=255;
			hCol = pal[ hTile[7][5] ];  h[244]=hCol[0]; h[245]=hCol[1]; h[246]=hCol[2]; h[247]=255;
			vCol = pal[ vTile[7][5] ];  v[244]=vCol[0]; v[245]=vCol[1]; v[246]=vCol[2]; v[247]=255;
			aCol = pal[ aTile[7][5] ];  a[244]=aCol[0]; a[245]=aCol[1]; a[246]=aCol[2]; a[247]=255;
			
			nCol = pal[ nTile[7][6] ];  n[248]=nCol[0]; n[249]=nCol[1]; n[250]=nCol[2]; n[251]=255;
			hCol = pal[ hTile[7][6] ];  h[248]=hCol[0]; h[249]=hCol[1]; h[250]=hCol[2]; h[251]=255;
			vCol = pal[ vTile[7][6] ];  v[248]=vCol[0]; v[249]=vCol[1]; v[250]=vCol[2]; v[251]=255;
			aCol = pal[ aTile[7][6] ];  a[248]=aCol[0]; a[249]=aCol[1]; a[250]=aCol[2]; a[251]=255;
			
			nCol = pal[ nTile[7][7] ];  n[252]=nCol[0]; n[253]=nCol[1]; n[254]=nCol[2]; n[255]=255;
			hCol = pal[ hTile[7][7] ];  h[252]=hCol[0]; h[253]=hCol[1]; h[254]=hCol[2]; h[255]=255;
			vCol = pal[ vTile[7][7] ];  v[252]=vCol[0]; v[253]=vCol[1]; v[254]=vCol[2]; v[255]=255;
			aCol = pal[ aTile[7][7] ];  a[252]=aCol[0]; a[253]=aCol[1]; a[254]=aCol[2]; a[255]=255;
			

			// create hard code
			/*
			let i = 0;
			let str = '';
			for(let y=0; y<8; y++)
			for(let x=0; x<8; x++){
				let p = i * 4;
				str += `nCol = pal[ nTile[${y}][${x}] ];  n[${p}]=nCol[0]; n[${p+1}]=nCol[1]; n[${p+2}]=nCol[2]; n[${p+3}]=255;\n`;
				str += `hCol = pal[ hTile[${y}][${x}] ];  h[${p}]=hCol[0]; h[${p+1}]=hCol[1]; h[${p+2}]=hCol[2]; h[${p+3}]=255;\n`;
				str += `vCol = pal[ vTile[${y}][${x}] ];  v[${p}]=vCol[0]; v[${p+1}]=vCol[1]; v[${p+2}]=vCol[2]; v[${p+3}]=255;\n`;
				str += `aCol = pal[ aTile[${y}][${x}] ];  a[${p}]=aCol[0]; a[${p+1}]=aCol[1]; a[${p+2}]=aCol[2]; a[${p+3}]=255;\n`;
				str += '\n'
				i++;
			}
			*/
			

		};

		for(let cOfst=0; cOfst<len; cOfst+=32){

			// HARD CODE

			A = d[cOfst+0]; B = d[cOfst+1];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  0, 0);
			hChip.putImageData(flipTile[f^1], 24, 0);
			vChip.putImageData(flipTile[f^2],  0,24);
			aChip.putImageData(flipTile[f^3], 24,24);

			A = d[cOfst+2]; B = d[cOfst+3];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  8, 0);
			hChip.putImageData(flipTile[f^1], 16, 0);
			vChip.putImageData(flipTile[f^2],  8,24);
			aChip.putImageData(flipTile[f^3], 16,24);

			A = d[cOfst+4]; B = d[cOfst+5];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  16, 0);
			hChip.putImageData(flipTile[f^1], 8, 0);
			vChip.putImageData(flipTile[f^2],  16,24);
			aChip.putImageData(flipTile[f^3], 8,24);

			A = d[cOfst+6]; B = d[cOfst+7];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  24, 0);
			hChip.putImageData(flipTile[f^1], 0, 0);
			vChip.putImageData(flipTile[f^2],  24,24);
			aChip.putImageData(flipTile[f^3], 0,24);

			A = d[cOfst+8]; B = d[cOfst+9];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  0, 8);
			hChip.putImageData(flipTile[f^1], 24, 8);
			vChip.putImageData(flipTile[f^2],  0,16);
			aChip.putImageData(flipTile[f^3], 24,16);

			A = d[cOfst+10]; B = d[cOfst+11];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  8, 8);
			hChip.putImageData(flipTile[f^1], 16, 8);
			vChip.putImageData(flipTile[f^2],  8,16);
			aChip.putImageData(flipTile[f^3], 16,16);

			A = d[cOfst+12]; B = d[cOfst+13];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  16, 8);
			hChip.putImageData(flipTile[f^1], 8, 8);
			vChip.putImageData(flipTile[f^2],  16,16);
			aChip.putImageData(flipTile[f^3], 8,16);

			A = d[cOfst+14]; B = d[cOfst+15];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  24, 8);
			hChip.putImageData(flipTile[f^1], 0, 8);
			vChip.putImageData(flipTile[f^2],  24,16);
			aChip.putImageData(flipTile[f^3], 0,16);

			A = d[cOfst+16]; B = d[cOfst+17];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  0, 16);
			hChip.putImageData(flipTile[f^1], 24, 16);
			vChip.putImageData(flipTile[f^2],  0,8);
			aChip.putImageData(flipTile[f^3], 24,8);

			A = d[cOfst+18]; B = d[cOfst+19];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  8, 16);
			hChip.putImageData(flipTile[f^1], 16, 16);
			vChip.putImageData(flipTile[f^2],  8,8);
			aChip.putImageData(flipTile[f^3], 16,8);

			A = d[cOfst+20]; B = d[cOfst+21];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  16, 16);
			hChip.putImageData(flipTile[f^1], 8, 16);
			vChip.putImageData(flipTile[f^2],  16,8);
			aChip.putImageData(flipTile[f^3], 8,8);

			A = d[cOfst+22]; B = d[cOfst+23];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  24, 16);
			hChip.putImageData(flipTile[f^1], 0, 16);
			vChip.putImageData(flipTile[f^2],  24,8);
			aChip.putImageData(flipTile[f^3], 0,8);

			A = d[cOfst+24]; B = d[cOfst+25];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  0, 24);
			hChip.putImageData(flipTile[f^1], 24, 24);
			vChip.putImageData(flipTile[f^2],  0,0);
			aChip.putImageData(flipTile[f^3], 24,0);

			A = d[cOfst+26]; B = d[cOfst+27];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  8, 24);
			hChip.putImageData(flipTile[f^1], 16, 24);
			vChip.putImageData(flipTile[f^2],  8,0);
			aChip.putImageData(flipTile[f^3], 16,0);

			A = d[cOfst+28]; B = d[cOfst+29];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  16, 24);
			hChip.putImageData(flipTile[f^1], 8, 24);
			vChip.putImageData(flipTile[f^2],  16,0);
			aChip.putImageData(flipTile[f^3], 8,0);

			A = d[cOfst+30]; B = d[cOfst+31];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];

			nChip.putImageData(flipTile[f  ],  24, 24);
			hChip.putImageData(flipTile[f^1], 0, 24);
			vChip.putImageData(flipTile[f^2],  24,0);
			aChip.putImageData(flipTile[f^3], 0,0);


			// END OF LOOP
			
			chip = o[iChip] = new Array(4); // flip dimension

			o.n[iChip] = chip[0] = nChip.getImageData(0,0, 32,32);
			o.h[iChip] = chip[1] = hChip.getImageData(0,0, 32,32);
			o.v[iChip] = chip[2] = vChip.getImageData(0,0, 32,32);
			o.a[iChip] = chip[3] = aChip.getImageData(0,0, 32,32);
			
			iChip++;

			// HARD CODE LOGIC
			/*
			let fragOfst = 0;

			for(let yf=0; yf<4; yf++)
			for(let xf=0; xf<4; xf++){

				let _xf = 3 - xf, _yf = 3 - yf;
				let i = 0;

				let xcp = xf*8, _xcp = _xf*8;
				let ycp = yf*8, _ycp = _yf*8;

				// print
					A = d[cOfst+fragOfst]; B = d[cOfst+fragOfst+1];
					t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6); // f = h + v

					if(!tileCache[t][p]) make_tileFlipCache();

					flipTile = tileCache[t][p];

					nChip.putImageData(flipTile[f  ],  xcp, ycp);
					hChip.putImageData(flipTile[f^1], _xcp, ycp);
					vChip.putImageData(flipTile[f^2],  xcp,_ycp);
					aChip.putImageData(flipTile[f^3], _xcp,_ycp);
				// end print
				
				fragOfst += 2;
			}
			*/

			// create HARD CODE
			/*
			let str = '';

			let fragOfst = 0;
			for(let yf=0; yf<4; yf++)
			for(let xf=0; xf<4; xf++){

				let _xf = 3 - xf, _yf = 3 - yf;
				let i = 0;

				let xcp = xf*8, _xcp = _xf*8;
				let ycp = yf*8, _ycp = _yf*8;

				// print
					str += `A = d[cOfst+${fragOfst}]; B = d[cOfst+${fragOfst+1}];\n`;
					str += `t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);\n`;

					str += `if(!tileCache[t][p]) make_tileFlipCache();\n`;

					str += `flipTile = tileCache[t][p];\n`;

					str += '\n';
					
					str += `nChip.putImageData(flipTile[f  ],  ${xcp}, ${ycp});\n`;
					str += `hChip.putImageData(flipTile[f^1], ${_xcp}, ${ycp});\n`;
					str += `vChip.putImageData(flipTile[f^2],  ${xcp},${_ycp});\n`;
					str += `aChip.putImageData(flipTile[f^3], ${_xcp},${_ycp});\n`;
					str += '\n';
				// end print

				fragOfst += 2;
			}

			// DISPLAY TO COPY
			document.body.textContent = "";
			let div = document.createElement("div");
			div.style.position = "absolute";
			div.style.whiteSpace = "pre";
			div.style.fontFamily = "monospace";
			div.style.left = 0;
			div.style.right = 0;
			document.body.appendChild(div);
			div.textContent = str;
			*/

		}

		return o;
	};

})();



// create_mapchipGfxBuffer is faster than create_mapchipGfxBuffer_OLD_1

/*

1st loaded script
performance.now();

73.1000000089407

75

45.29999999701977

45.70000000298023

65.79999999701977

76.70000000298023

67.90000000596046

72

63.599999994039536

64

65.20000000298023

40.79999999701977

*/