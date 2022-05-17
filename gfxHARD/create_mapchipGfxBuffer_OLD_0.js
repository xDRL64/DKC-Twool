
(function(app=dkc2ldd){

	// return : mapchipGfxBuffer [chipIndex] [flip(4)] = ImageData(32x32)
	//
	//

	// This version of create_mapchipGfxBuffer uses ImageData type in "tile cache",
	// and returns ImageData type elements that are stored in the output result.

	// Every pixel of "tile cache" data is copied manually to the output result (in the hardcoded part).
	// The way to copy is : ImageData.data[DstIndex] = ImageData.data[srcIndex]
	// ImageData type elements of the output result must be created at first in the FORLOOP.

	// This version of create_mapchipGfxBuffer is the most hardcoded version,
	// but it is not the fatest because that needs too much js instructions by pixel color copy :
	// 16(chiptile) * 64(pixel) * 4(flip) * 4(channel) = 16384 js instructions.

	app.gfx.fast.create_mapchipGfxBuffer_OLD_0 = function(rawMapchip, _4formatedTileset, palettes){

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

		for(let cOfst=0; cOfst<len; cOfst+=32,iChip++){

			chip = o[iChip] = new Array(4); // flip dimension

			nChip = o.n[iChip] = chip[0] = ctx.createImageData(32,32);  nChip = nChip.data;
			hChip = o.h[iChip] = chip[1] = ctx.createImageData(32,32);  hChip = hChip.data;
			vChip = o.v[iChip] = chip[2] = ctx.createImageData(32,32);  vChip = vChip.data;
			aChip = o.a[iChip] = chip[3] = ctx.createImageData(32,32);  aChip = aChip.data;

			// HARD CODE

			A = d[cOfst+0]; B = d[cOfst+1];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[0]=nTile[0]; nChip[1]=nTile[1]; nChip[2]=nTile[2]; nChip[3]=nTile[3];
			hChip[96]=hTile[0]; hChip[97]=hTile[1]; hChip[98]=hTile[2]; hChip[99]=hTile[3];
			vChip[3072]=vTile[0]; vChip[3073]=vTile[1]; vChip[3074]=vTile[2]; vChip[3075]=vTile[3];
			aChip[3168]=aTile[0]; aChip[3169]=aTile[1]; aChip[3170]=aTile[2]; aChip[3171]=aTile[3];

			nChip[4]=nTile[4]; nChip[5]=nTile[5]; nChip[6]=nTile[6]; nChip[7]=nTile[7];
			hChip[100]=hTile[4]; hChip[101]=hTile[5]; hChip[102]=hTile[6]; hChip[103]=hTile[7];
			vChip[3076]=vTile[4]; vChip[3077]=vTile[5]; vChip[3078]=vTile[6]; vChip[3079]=vTile[7];
			aChip[3172]=aTile[4]; aChip[3173]=aTile[5]; aChip[3174]=aTile[6]; aChip[3175]=aTile[7];

			nChip[8]=nTile[8]; nChip[9]=nTile[9]; nChip[10]=nTile[10]; nChip[11]=nTile[11];
			hChip[104]=hTile[8]; hChip[105]=hTile[9]; hChip[106]=hTile[10]; hChip[107]=hTile[11];
			vChip[3080]=vTile[8]; vChip[3081]=vTile[9]; vChip[3082]=vTile[10]; vChip[3083]=vTile[11];
			aChip[3176]=aTile[8]; aChip[3177]=aTile[9]; aChip[3178]=aTile[10]; aChip[3179]=aTile[11];

			nChip[12]=nTile[12]; nChip[13]=nTile[13]; nChip[14]=nTile[14]; nChip[15]=nTile[15];
			hChip[108]=hTile[12]; hChip[109]=hTile[13]; hChip[110]=hTile[14]; hChip[111]=hTile[15];
			vChip[3084]=vTile[12]; vChip[3085]=vTile[13]; vChip[3086]=vTile[14]; vChip[3087]=vTile[15];
			aChip[3180]=aTile[12]; aChip[3181]=aTile[13]; aChip[3182]=aTile[14]; aChip[3183]=aTile[15];

			nChip[16]=nTile[16]; nChip[17]=nTile[17]; nChip[18]=nTile[18]; nChip[19]=nTile[19];
			hChip[112]=hTile[16]; hChip[113]=hTile[17]; hChip[114]=hTile[18]; hChip[115]=hTile[19];
			vChip[3088]=vTile[16]; vChip[3089]=vTile[17]; vChip[3090]=vTile[18]; vChip[3091]=vTile[19];
			aChip[3184]=aTile[16]; aChip[3185]=aTile[17]; aChip[3186]=aTile[18]; aChip[3187]=aTile[19];

			nChip[20]=nTile[20]; nChip[21]=nTile[21]; nChip[22]=nTile[22]; nChip[23]=nTile[23];
			hChip[116]=hTile[20]; hChip[117]=hTile[21]; hChip[118]=hTile[22]; hChip[119]=hTile[23];
			vChip[3092]=vTile[20]; vChip[3093]=vTile[21]; vChip[3094]=vTile[22]; vChip[3095]=vTile[23];
			aChip[3188]=aTile[20]; aChip[3189]=aTile[21]; aChip[3190]=aTile[22]; aChip[3191]=aTile[23];

			nChip[24]=nTile[24]; nChip[25]=nTile[25]; nChip[26]=nTile[26]; nChip[27]=nTile[27];
			hChip[120]=hTile[24]; hChip[121]=hTile[25]; hChip[122]=hTile[26]; hChip[123]=hTile[27];
			vChip[3096]=vTile[24]; vChip[3097]=vTile[25]; vChip[3098]=vTile[26]; vChip[3099]=vTile[27];
			aChip[3192]=aTile[24]; aChip[3193]=aTile[25]; aChip[3194]=aTile[26]; aChip[3195]=aTile[27];

			nChip[28]=nTile[28]; nChip[29]=nTile[29]; nChip[30]=nTile[30]; nChip[31]=nTile[31];
			hChip[124]=hTile[28]; hChip[125]=hTile[29]; hChip[126]=hTile[30]; hChip[127]=hTile[31];
			vChip[3100]=vTile[28]; vChip[3101]=vTile[29]; vChip[3102]=vTile[30]; vChip[3103]=vTile[31];
			aChip[3196]=aTile[28]; aChip[3197]=aTile[29]; aChip[3198]=aTile[30]; aChip[3199]=aTile[31];

			nChip[128]=nTile[32]; nChip[129]=nTile[33]; nChip[130]=nTile[34]; nChip[131]=nTile[35];
			hChip[224]=hTile[32]; hChip[225]=hTile[33]; hChip[226]=hTile[34]; hChip[227]=hTile[35];
			vChip[3200]=vTile[32]; vChip[3201]=vTile[33]; vChip[3202]=vTile[34]; vChip[3203]=vTile[35];
			aChip[3296]=aTile[32]; aChip[3297]=aTile[33]; aChip[3298]=aTile[34]; aChip[3299]=aTile[35];

			nChip[132]=nTile[36]; nChip[133]=nTile[37]; nChip[134]=nTile[38]; nChip[135]=nTile[39];
			hChip[228]=hTile[36]; hChip[229]=hTile[37]; hChip[230]=hTile[38]; hChip[231]=hTile[39];
			vChip[3204]=vTile[36]; vChip[3205]=vTile[37]; vChip[3206]=vTile[38]; vChip[3207]=vTile[39];
			aChip[3300]=aTile[36]; aChip[3301]=aTile[37]; aChip[3302]=aTile[38]; aChip[3303]=aTile[39];

			nChip[136]=nTile[40]; nChip[137]=nTile[41]; nChip[138]=nTile[42]; nChip[139]=nTile[43];
			hChip[232]=hTile[40]; hChip[233]=hTile[41]; hChip[234]=hTile[42]; hChip[235]=hTile[43];
			vChip[3208]=vTile[40]; vChip[3209]=vTile[41]; vChip[3210]=vTile[42]; vChip[3211]=vTile[43];
			aChip[3304]=aTile[40]; aChip[3305]=aTile[41]; aChip[3306]=aTile[42]; aChip[3307]=aTile[43];

			nChip[140]=nTile[44]; nChip[141]=nTile[45]; nChip[142]=nTile[46]; nChip[143]=nTile[47];
			hChip[236]=hTile[44]; hChip[237]=hTile[45]; hChip[238]=hTile[46]; hChip[239]=hTile[47];
			vChip[3212]=vTile[44]; vChip[3213]=vTile[45]; vChip[3214]=vTile[46]; vChip[3215]=vTile[47];
			aChip[3308]=aTile[44]; aChip[3309]=aTile[45]; aChip[3310]=aTile[46]; aChip[3311]=aTile[47];

			nChip[144]=nTile[48]; nChip[145]=nTile[49]; nChip[146]=nTile[50]; nChip[147]=nTile[51];
			hChip[240]=hTile[48]; hChip[241]=hTile[49]; hChip[242]=hTile[50]; hChip[243]=hTile[51];
			vChip[3216]=vTile[48]; vChip[3217]=vTile[49]; vChip[3218]=vTile[50]; vChip[3219]=vTile[51];
			aChip[3312]=aTile[48]; aChip[3313]=aTile[49]; aChip[3314]=aTile[50]; aChip[3315]=aTile[51];

			nChip[148]=nTile[52]; nChip[149]=nTile[53]; nChip[150]=nTile[54]; nChip[151]=nTile[55];
			hChip[244]=hTile[52]; hChip[245]=hTile[53]; hChip[246]=hTile[54]; hChip[247]=hTile[55];
			vChip[3220]=vTile[52]; vChip[3221]=vTile[53]; vChip[3222]=vTile[54]; vChip[3223]=vTile[55];
			aChip[3316]=aTile[52]; aChip[3317]=aTile[53]; aChip[3318]=aTile[54]; aChip[3319]=aTile[55];

			nChip[152]=nTile[56]; nChip[153]=nTile[57]; nChip[154]=nTile[58]; nChip[155]=nTile[59];
			hChip[248]=hTile[56]; hChip[249]=hTile[57]; hChip[250]=hTile[58]; hChip[251]=hTile[59];
			vChip[3224]=vTile[56]; vChip[3225]=vTile[57]; vChip[3226]=vTile[58]; vChip[3227]=vTile[59];
			aChip[3320]=aTile[56]; aChip[3321]=aTile[57]; aChip[3322]=aTile[58]; aChip[3323]=aTile[59];

			nChip[156]=nTile[60]; nChip[157]=nTile[61]; nChip[158]=nTile[62]; nChip[159]=nTile[63];
			hChip[252]=hTile[60]; hChip[253]=hTile[61]; hChip[254]=hTile[62]; hChip[255]=hTile[63];
			vChip[3228]=vTile[60]; vChip[3229]=vTile[61]; vChip[3230]=vTile[62]; vChip[3231]=vTile[63];
			aChip[3324]=aTile[60]; aChip[3325]=aTile[61]; aChip[3326]=aTile[62]; aChip[3327]=aTile[63];

			nChip[256]=nTile[64]; nChip[257]=nTile[65]; nChip[258]=nTile[66]; nChip[259]=nTile[67];
			hChip[352]=hTile[64]; hChip[353]=hTile[65]; hChip[354]=hTile[66]; hChip[355]=hTile[67];
			vChip[3328]=vTile[64]; vChip[3329]=vTile[65]; vChip[3330]=vTile[66]; vChip[3331]=vTile[67];
			aChip[3424]=aTile[64]; aChip[3425]=aTile[65]; aChip[3426]=aTile[66]; aChip[3427]=aTile[67];

			nChip[260]=nTile[68]; nChip[261]=nTile[69]; nChip[262]=nTile[70]; nChip[263]=nTile[71];
			hChip[356]=hTile[68]; hChip[357]=hTile[69]; hChip[358]=hTile[70]; hChip[359]=hTile[71];
			vChip[3332]=vTile[68]; vChip[3333]=vTile[69]; vChip[3334]=vTile[70]; vChip[3335]=vTile[71];
			aChip[3428]=aTile[68]; aChip[3429]=aTile[69]; aChip[3430]=aTile[70]; aChip[3431]=aTile[71];

			nChip[264]=nTile[72]; nChip[265]=nTile[73]; nChip[266]=nTile[74]; nChip[267]=nTile[75];
			hChip[360]=hTile[72]; hChip[361]=hTile[73]; hChip[362]=hTile[74]; hChip[363]=hTile[75];
			vChip[3336]=vTile[72]; vChip[3337]=vTile[73]; vChip[3338]=vTile[74]; vChip[3339]=vTile[75];
			aChip[3432]=aTile[72]; aChip[3433]=aTile[73]; aChip[3434]=aTile[74]; aChip[3435]=aTile[75];

			nChip[268]=nTile[76]; nChip[269]=nTile[77]; nChip[270]=nTile[78]; nChip[271]=nTile[79];
			hChip[364]=hTile[76]; hChip[365]=hTile[77]; hChip[366]=hTile[78]; hChip[367]=hTile[79];
			vChip[3340]=vTile[76]; vChip[3341]=vTile[77]; vChip[3342]=vTile[78]; vChip[3343]=vTile[79];
			aChip[3436]=aTile[76]; aChip[3437]=aTile[77]; aChip[3438]=aTile[78]; aChip[3439]=aTile[79];

			nChip[272]=nTile[80]; nChip[273]=nTile[81]; nChip[274]=nTile[82]; nChip[275]=nTile[83];
			hChip[368]=hTile[80]; hChip[369]=hTile[81]; hChip[370]=hTile[82]; hChip[371]=hTile[83];
			vChip[3344]=vTile[80]; vChip[3345]=vTile[81]; vChip[3346]=vTile[82]; vChip[3347]=vTile[83];
			aChip[3440]=aTile[80]; aChip[3441]=aTile[81]; aChip[3442]=aTile[82]; aChip[3443]=aTile[83];

			nChip[276]=nTile[84]; nChip[277]=nTile[85]; nChip[278]=nTile[86]; nChip[279]=nTile[87];
			hChip[372]=hTile[84]; hChip[373]=hTile[85]; hChip[374]=hTile[86]; hChip[375]=hTile[87];
			vChip[3348]=vTile[84]; vChip[3349]=vTile[85]; vChip[3350]=vTile[86]; vChip[3351]=vTile[87];
			aChip[3444]=aTile[84]; aChip[3445]=aTile[85]; aChip[3446]=aTile[86]; aChip[3447]=aTile[87];

			nChip[280]=nTile[88]; nChip[281]=nTile[89]; nChip[282]=nTile[90]; nChip[283]=nTile[91];
			hChip[376]=hTile[88]; hChip[377]=hTile[89]; hChip[378]=hTile[90]; hChip[379]=hTile[91];
			vChip[3352]=vTile[88]; vChip[3353]=vTile[89]; vChip[3354]=vTile[90]; vChip[3355]=vTile[91];
			aChip[3448]=aTile[88]; aChip[3449]=aTile[89]; aChip[3450]=aTile[90]; aChip[3451]=aTile[91];

			nChip[284]=nTile[92]; nChip[285]=nTile[93]; nChip[286]=nTile[94]; nChip[287]=nTile[95];
			hChip[380]=hTile[92]; hChip[381]=hTile[93]; hChip[382]=hTile[94]; hChip[383]=hTile[95];
			vChip[3356]=vTile[92]; vChip[3357]=vTile[93]; vChip[3358]=vTile[94]; vChip[3359]=vTile[95];
			aChip[3452]=aTile[92]; aChip[3453]=aTile[93]; aChip[3454]=aTile[94]; aChip[3455]=aTile[95];

			nChip[384]=nTile[96]; nChip[385]=nTile[97]; nChip[386]=nTile[98]; nChip[387]=nTile[99];
			hChip[480]=hTile[96]; hChip[481]=hTile[97]; hChip[482]=hTile[98]; hChip[483]=hTile[99];
			vChip[3456]=vTile[96]; vChip[3457]=vTile[97]; vChip[3458]=vTile[98]; vChip[3459]=vTile[99];
			aChip[3552]=aTile[96]; aChip[3553]=aTile[97]; aChip[3554]=aTile[98]; aChip[3555]=aTile[99];

			nChip[388]=nTile[100]; nChip[389]=nTile[101]; nChip[390]=nTile[102]; nChip[391]=nTile[103];
			hChip[484]=hTile[100]; hChip[485]=hTile[101]; hChip[486]=hTile[102]; hChip[487]=hTile[103];
			vChip[3460]=vTile[100]; vChip[3461]=vTile[101]; vChip[3462]=vTile[102]; vChip[3463]=vTile[103];
			aChip[3556]=aTile[100]; aChip[3557]=aTile[101]; aChip[3558]=aTile[102]; aChip[3559]=aTile[103];

			nChip[392]=nTile[104]; nChip[393]=nTile[105]; nChip[394]=nTile[106]; nChip[395]=nTile[107];
			hChip[488]=hTile[104]; hChip[489]=hTile[105]; hChip[490]=hTile[106]; hChip[491]=hTile[107];
			vChip[3464]=vTile[104]; vChip[3465]=vTile[105]; vChip[3466]=vTile[106]; vChip[3467]=vTile[107];
			aChip[3560]=aTile[104]; aChip[3561]=aTile[105]; aChip[3562]=aTile[106]; aChip[3563]=aTile[107];

			nChip[396]=nTile[108]; nChip[397]=nTile[109]; nChip[398]=nTile[110]; nChip[399]=nTile[111];
			hChip[492]=hTile[108]; hChip[493]=hTile[109]; hChip[494]=hTile[110]; hChip[495]=hTile[111];
			vChip[3468]=vTile[108]; vChip[3469]=vTile[109]; vChip[3470]=vTile[110]; vChip[3471]=vTile[111];
			aChip[3564]=aTile[108]; aChip[3565]=aTile[109]; aChip[3566]=aTile[110]; aChip[3567]=aTile[111];

			nChip[400]=nTile[112]; nChip[401]=nTile[113]; nChip[402]=nTile[114]; nChip[403]=nTile[115];
			hChip[496]=hTile[112]; hChip[497]=hTile[113]; hChip[498]=hTile[114]; hChip[499]=hTile[115];
			vChip[3472]=vTile[112]; vChip[3473]=vTile[113]; vChip[3474]=vTile[114]; vChip[3475]=vTile[115];
			aChip[3568]=aTile[112]; aChip[3569]=aTile[113]; aChip[3570]=aTile[114]; aChip[3571]=aTile[115];

			nChip[404]=nTile[116]; nChip[405]=nTile[117]; nChip[406]=nTile[118]; nChip[407]=nTile[119];
			hChip[500]=hTile[116]; hChip[501]=hTile[117]; hChip[502]=hTile[118]; hChip[503]=hTile[119];
			vChip[3476]=vTile[116]; vChip[3477]=vTile[117]; vChip[3478]=vTile[118]; vChip[3479]=vTile[119];
			aChip[3572]=aTile[116]; aChip[3573]=aTile[117]; aChip[3574]=aTile[118]; aChip[3575]=aTile[119];

			nChip[408]=nTile[120]; nChip[409]=nTile[121]; nChip[410]=nTile[122]; nChip[411]=nTile[123];
			hChip[504]=hTile[120]; hChip[505]=hTile[121]; hChip[506]=hTile[122]; hChip[507]=hTile[123];
			vChip[3480]=vTile[120]; vChip[3481]=vTile[121]; vChip[3482]=vTile[122]; vChip[3483]=vTile[123];
			aChip[3576]=aTile[120]; aChip[3577]=aTile[121]; aChip[3578]=aTile[122]; aChip[3579]=aTile[123];

			nChip[412]=nTile[124]; nChip[413]=nTile[125]; nChip[414]=nTile[126]; nChip[415]=nTile[127];
			hChip[508]=hTile[124]; hChip[509]=hTile[125]; hChip[510]=hTile[126]; hChip[511]=hTile[127];
			vChip[3484]=vTile[124]; vChip[3485]=vTile[125]; vChip[3486]=vTile[126]; vChip[3487]=vTile[127];
			aChip[3580]=aTile[124]; aChip[3581]=aTile[125]; aChip[3582]=aTile[126]; aChip[3583]=aTile[127];

			nChip[512]=nTile[128]; nChip[513]=nTile[129]; nChip[514]=nTile[130]; nChip[515]=nTile[131];
			hChip[608]=hTile[128]; hChip[609]=hTile[129]; hChip[610]=hTile[130]; hChip[611]=hTile[131];
			vChip[3584]=vTile[128]; vChip[3585]=vTile[129]; vChip[3586]=vTile[130]; vChip[3587]=vTile[131];
			aChip[3680]=aTile[128]; aChip[3681]=aTile[129]; aChip[3682]=aTile[130]; aChip[3683]=aTile[131];

			nChip[516]=nTile[132]; nChip[517]=nTile[133]; nChip[518]=nTile[134]; nChip[519]=nTile[135];
			hChip[612]=hTile[132]; hChip[613]=hTile[133]; hChip[614]=hTile[134]; hChip[615]=hTile[135];
			vChip[3588]=vTile[132]; vChip[3589]=vTile[133]; vChip[3590]=vTile[134]; vChip[3591]=vTile[135];
			aChip[3684]=aTile[132]; aChip[3685]=aTile[133]; aChip[3686]=aTile[134]; aChip[3687]=aTile[135];

			nChip[520]=nTile[136]; nChip[521]=nTile[137]; nChip[522]=nTile[138]; nChip[523]=nTile[139];
			hChip[616]=hTile[136]; hChip[617]=hTile[137]; hChip[618]=hTile[138]; hChip[619]=hTile[139];
			vChip[3592]=vTile[136]; vChip[3593]=vTile[137]; vChip[3594]=vTile[138]; vChip[3595]=vTile[139];
			aChip[3688]=aTile[136]; aChip[3689]=aTile[137]; aChip[3690]=aTile[138]; aChip[3691]=aTile[139];

			nChip[524]=nTile[140]; nChip[525]=nTile[141]; nChip[526]=nTile[142]; nChip[527]=nTile[143];
			hChip[620]=hTile[140]; hChip[621]=hTile[141]; hChip[622]=hTile[142]; hChip[623]=hTile[143];
			vChip[3596]=vTile[140]; vChip[3597]=vTile[141]; vChip[3598]=vTile[142]; vChip[3599]=vTile[143];
			aChip[3692]=aTile[140]; aChip[3693]=aTile[141]; aChip[3694]=aTile[142]; aChip[3695]=aTile[143];

			nChip[528]=nTile[144]; nChip[529]=nTile[145]; nChip[530]=nTile[146]; nChip[531]=nTile[147];
			hChip[624]=hTile[144]; hChip[625]=hTile[145]; hChip[626]=hTile[146]; hChip[627]=hTile[147];
			vChip[3600]=vTile[144]; vChip[3601]=vTile[145]; vChip[3602]=vTile[146]; vChip[3603]=vTile[147];
			aChip[3696]=aTile[144]; aChip[3697]=aTile[145]; aChip[3698]=aTile[146]; aChip[3699]=aTile[147];

			nChip[532]=nTile[148]; nChip[533]=nTile[149]; nChip[534]=nTile[150]; nChip[535]=nTile[151];
			hChip[628]=hTile[148]; hChip[629]=hTile[149]; hChip[630]=hTile[150]; hChip[631]=hTile[151];
			vChip[3604]=vTile[148]; vChip[3605]=vTile[149]; vChip[3606]=vTile[150]; vChip[3607]=vTile[151];
			aChip[3700]=aTile[148]; aChip[3701]=aTile[149]; aChip[3702]=aTile[150]; aChip[3703]=aTile[151];

			nChip[536]=nTile[152]; nChip[537]=nTile[153]; nChip[538]=nTile[154]; nChip[539]=nTile[155];
			hChip[632]=hTile[152]; hChip[633]=hTile[153]; hChip[634]=hTile[154]; hChip[635]=hTile[155];
			vChip[3608]=vTile[152]; vChip[3609]=vTile[153]; vChip[3610]=vTile[154]; vChip[3611]=vTile[155];
			aChip[3704]=aTile[152]; aChip[3705]=aTile[153]; aChip[3706]=aTile[154]; aChip[3707]=aTile[155];

			nChip[540]=nTile[156]; nChip[541]=nTile[157]; nChip[542]=nTile[158]; nChip[543]=nTile[159];
			hChip[636]=hTile[156]; hChip[637]=hTile[157]; hChip[638]=hTile[158]; hChip[639]=hTile[159];
			vChip[3612]=vTile[156]; vChip[3613]=vTile[157]; vChip[3614]=vTile[158]; vChip[3615]=vTile[159];
			aChip[3708]=aTile[156]; aChip[3709]=aTile[157]; aChip[3710]=aTile[158]; aChip[3711]=aTile[159];

			nChip[640]=nTile[160]; nChip[641]=nTile[161]; nChip[642]=nTile[162]; nChip[643]=nTile[163];
			hChip[736]=hTile[160]; hChip[737]=hTile[161]; hChip[738]=hTile[162]; hChip[739]=hTile[163];
			vChip[3712]=vTile[160]; vChip[3713]=vTile[161]; vChip[3714]=vTile[162]; vChip[3715]=vTile[163];
			aChip[3808]=aTile[160]; aChip[3809]=aTile[161]; aChip[3810]=aTile[162]; aChip[3811]=aTile[163];

			nChip[644]=nTile[164]; nChip[645]=nTile[165]; nChip[646]=nTile[166]; nChip[647]=nTile[167];
			hChip[740]=hTile[164]; hChip[741]=hTile[165]; hChip[742]=hTile[166]; hChip[743]=hTile[167];
			vChip[3716]=vTile[164]; vChip[3717]=vTile[165]; vChip[3718]=vTile[166]; vChip[3719]=vTile[167];
			aChip[3812]=aTile[164]; aChip[3813]=aTile[165]; aChip[3814]=aTile[166]; aChip[3815]=aTile[167];

			nChip[648]=nTile[168]; nChip[649]=nTile[169]; nChip[650]=nTile[170]; nChip[651]=nTile[171];
			hChip[744]=hTile[168]; hChip[745]=hTile[169]; hChip[746]=hTile[170]; hChip[747]=hTile[171];
			vChip[3720]=vTile[168]; vChip[3721]=vTile[169]; vChip[3722]=vTile[170]; vChip[3723]=vTile[171];
			aChip[3816]=aTile[168]; aChip[3817]=aTile[169]; aChip[3818]=aTile[170]; aChip[3819]=aTile[171];

			nChip[652]=nTile[172]; nChip[653]=nTile[173]; nChip[654]=nTile[174]; nChip[655]=nTile[175];
			hChip[748]=hTile[172]; hChip[749]=hTile[173]; hChip[750]=hTile[174]; hChip[751]=hTile[175];
			vChip[3724]=vTile[172]; vChip[3725]=vTile[173]; vChip[3726]=vTile[174]; vChip[3727]=vTile[175];
			aChip[3820]=aTile[172]; aChip[3821]=aTile[173]; aChip[3822]=aTile[174]; aChip[3823]=aTile[175];

			nChip[656]=nTile[176]; nChip[657]=nTile[177]; nChip[658]=nTile[178]; nChip[659]=nTile[179];
			hChip[752]=hTile[176]; hChip[753]=hTile[177]; hChip[754]=hTile[178]; hChip[755]=hTile[179];
			vChip[3728]=vTile[176]; vChip[3729]=vTile[177]; vChip[3730]=vTile[178]; vChip[3731]=vTile[179];
			aChip[3824]=aTile[176]; aChip[3825]=aTile[177]; aChip[3826]=aTile[178]; aChip[3827]=aTile[179];

			nChip[660]=nTile[180]; nChip[661]=nTile[181]; nChip[662]=nTile[182]; nChip[663]=nTile[183];
			hChip[756]=hTile[180]; hChip[757]=hTile[181]; hChip[758]=hTile[182]; hChip[759]=hTile[183];
			vChip[3732]=vTile[180]; vChip[3733]=vTile[181]; vChip[3734]=vTile[182]; vChip[3735]=vTile[183];
			aChip[3828]=aTile[180]; aChip[3829]=aTile[181]; aChip[3830]=aTile[182]; aChip[3831]=aTile[183];

			nChip[664]=nTile[184]; nChip[665]=nTile[185]; nChip[666]=nTile[186]; nChip[667]=nTile[187];
			hChip[760]=hTile[184]; hChip[761]=hTile[185]; hChip[762]=hTile[186]; hChip[763]=hTile[187];
			vChip[3736]=vTile[184]; vChip[3737]=vTile[185]; vChip[3738]=vTile[186]; vChip[3739]=vTile[187];
			aChip[3832]=aTile[184]; aChip[3833]=aTile[185]; aChip[3834]=aTile[186]; aChip[3835]=aTile[187];

			nChip[668]=nTile[188]; nChip[669]=nTile[189]; nChip[670]=nTile[190]; nChip[671]=nTile[191];
			hChip[764]=hTile[188]; hChip[765]=hTile[189]; hChip[766]=hTile[190]; hChip[767]=hTile[191];
			vChip[3740]=vTile[188]; vChip[3741]=vTile[189]; vChip[3742]=vTile[190]; vChip[3743]=vTile[191];
			aChip[3836]=aTile[188]; aChip[3837]=aTile[189]; aChip[3838]=aTile[190]; aChip[3839]=aTile[191];

			nChip[768]=nTile[192]; nChip[769]=nTile[193]; nChip[770]=nTile[194]; nChip[771]=nTile[195];
			hChip[864]=hTile[192]; hChip[865]=hTile[193]; hChip[866]=hTile[194]; hChip[867]=hTile[195];
			vChip[3840]=vTile[192]; vChip[3841]=vTile[193]; vChip[3842]=vTile[194]; vChip[3843]=vTile[195];
			aChip[3936]=aTile[192]; aChip[3937]=aTile[193]; aChip[3938]=aTile[194]; aChip[3939]=aTile[195];

			nChip[772]=nTile[196]; nChip[773]=nTile[197]; nChip[774]=nTile[198]; nChip[775]=nTile[199];
			hChip[868]=hTile[196]; hChip[869]=hTile[197]; hChip[870]=hTile[198]; hChip[871]=hTile[199];
			vChip[3844]=vTile[196]; vChip[3845]=vTile[197]; vChip[3846]=vTile[198]; vChip[3847]=vTile[199];
			aChip[3940]=aTile[196]; aChip[3941]=aTile[197]; aChip[3942]=aTile[198]; aChip[3943]=aTile[199];

			nChip[776]=nTile[200]; nChip[777]=nTile[201]; nChip[778]=nTile[202]; nChip[779]=nTile[203];
			hChip[872]=hTile[200]; hChip[873]=hTile[201]; hChip[874]=hTile[202]; hChip[875]=hTile[203];
			vChip[3848]=vTile[200]; vChip[3849]=vTile[201]; vChip[3850]=vTile[202]; vChip[3851]=vTile[203];
			aChip[3944]=aTile[200]; aChip[3945]=aTile[201]; aChip[3946]=aTile[202]; aChip[3947]=aTile[203];

			nChip[780]=nTile[204]; nChip[781]=nTile[205]; nChip[782]=nTile[206]; nChip[783]=nTile[207];
			hChip[876]=hTile[204]; hChip[877]=hTile[205]; hChip[878]=hTile[206]; hChip[879]=hTile[207];
			vChip[3852]=vTile[204]; vChip[3853]=vTile[205]; vChip[3854]=vTile[206]; vChip[3855]=vTile[207];
			aChip[3948]=aTile[204]; aChip[3949]=aTile[205]; aChip[3950]=aTile[206]; aChip[3951]=aTile[207];

			nChip[784]=nTile[208]; nChip[785]=nTile[209]; nChip[786]=nTile[210]; nChip[787]=nTile[211];
			hChip[880]=hTile[208]; hChip[881]=hTile[209]; hChip[882]=hTile[210]; hChip[883]=hTile[211];
			vChip[3856]=vTile[208]; vChip[3857]=vTile[209]; vChip[3858]=vTile[210]; vChip[3859]=vTile[211];
			aChip[3952]=aTile[208]; aChip[3953]=aTile[209]; aChip[3954]=aTile[210]; aChip[3955]=aTile[211];

			nChip[788]=nTile[212]; nChip[789]=nTile[213]; nChip[790]=nTile[214]; nChip[791]=nTile[215];
			hChip[884]=hTile[212]; hChip[885]=hTile[213]; hChip[886]=hTile[214]; hChip[887]=hTile[215];
			vChip[3860]=vTile[212]; vChip[3861]=vTile[213]; vChip[3862]=vTile[214]; vChip[3863]=vTile[215];
			aChip[3956]=aTile[212]; aChip[3957]=aTile[213]; aChip[3958]=aTile[214]; aChip[3959]=aTile[215];

			nChip[792]=nTile[216]; nChip[793]=nTile[217]; nChip[794]=nTile[218]; nChip[795]=nTile[219];
			hChip[888]=hTile[216]; hChip[889]=hTile[217]; hChip[890]=hTile[218]; hChip[891]=hTile[219];
			vChip[3864]=vTile[216]; vChip[3865]=vTile[217]; vChip[3866]=vTile[218]; vChip[3867]=vTile[219];
			aChip[3960]=aTile[216]; aChip[3961]=aTile[217]; aChip[3962]=aTile[218]; aChip[3963]=aTile[219];

			nChip[796]=nTile[220]; nChip[797]=nTile[221]; nChip[798]=nTile[222]; nChip[799]=nTile[223];
			hChip[892]=hTile[220]; hChip[893]=hTile[221]; hChip[894]=hTile[222]; hChip[895]=hTile[223];
			vChip[3868]=vTile[220]; vChip[3869]=vTile[221]; vChip[3870]=vTile[222]; vChip[3871]=vTile[223];
			aChip[3964]=aTile[220]; aChip[3965]=aTile[221]; aChip[3966]=aTile[222]; aChip[3967]=aTile[223];

			nChip[896]=nTile[224]; nChip[897]=nTile[225]; nChip[898]=nTile[226]; nChip[899]=nTile[227];
			hChip[992]=hTile[224]; hChip[993]=hTile[225]; hChip[994]=hTile[226]; hChip[995]=hTile[227];
			vChip[3968]=vTile[224]; vChip[3969]=vTile[225]; vChip[3970]=vTile[226]; vChip[3971]=vTile[227];
			aChip[4064]=aTile[224]; aChip[4065]=aTile[225]; aChip[4066]=aTile[226]; aChip[4067]=aTile[227];

			nChip[900]=nTile[228]; nChip[901]=nTile[229]; nChip[902]=nTile[230]; nChip[903]=nTile[231];
			hChip[996]=hTile[228]; hChip[997]=hTile[229]; hChip[998]=hTile[230]; hChip[999]=hTile[231];
			vChip[3972]=vTile[228]; vChip[3973]=vTile[229]; vChip[3974]=vTile[230]; vChip[3975]=vTile[231];
			aChip[4068]=aTile[228]; aChip[4069]=aTile[229]; aChip[4070]=aTile[230]; aChip[4071]=aTile[231];

			nChip[904]=nTile[232]; nChip[905]=nTile[233]; nChip[906]=nTile[234]; nChip[907]=nTile[235];
			hChip[1000]=hTile[232]; hChip[1001]=hTile[233]; hChip[1002]=hTile[234]; hChip[1003]=hTile[235];
			vChip[3976]=vTile[232]; vChip[3977]=vTile[233]; vChip[3978]=vTile[234]; vChip[3979]=vTile[235];
			aChip[4072]=aTile[232]; aChip[4073]=aTile[233]; aChip[4074]=aTile[234]; aChip[4075]=aTile[235];

			nChip[908]=nTile[236]; nChip[909]=nTile[237]; nChip[910]=nTile[238]; nChip[911]=nTile[239];
			hChip[1004]=hTile[236]; hChip[1005]=hTile[237]; hChip[1006]=hTile[238]; hChip[1007]=hTile[239];
			vChip[3980]=vTile[236]; vChip[3981]=vTile[237]; vChip[3982]=vTile[238]; vChip[3983]=vTile[239];
			aChip[4076]=aTile[236]; aChip[4077]=aTile[237]; aChip[4078]=aTile[238]; aChip[4079]=aTile[239];

			nChip[912]=nTile[240]; nChip[913]=nTile[241]; nChip[914]=nTile[242]; nChip[915]=nTile[243];
			hChip[1008]=hTile[240]; hChip[1009]=hTile[241]; hChip[1010]=hTile[242]; hChip[1011]=hTile[243];
			vChip[3984]=vTile[240]; vChip[3985]=vTile[241]; vChip[3986]=vTile[242]; vChip[3987]=vTile[243];
			aChip[4080]=aTile[240]; aChip[4081]=aTile[241]; aChip[4082]=aTile[242]; aChip[4083]=aTile[243];

			nChip[916]=nTile[244]; nChip[917]=nTile[245]; nChip[918]=nTile[246]; nChip[919]=nTile[247];
			hChip[1012]=hTile[244]; hChip[1013]=hTile[245]; hChip[1014]=hTile[246]; hChip[1015]=hTile[247];
			vChip[3988]=vTile[244]; vChip[3989]=vTile[245]; vChip[3990]=vTile[246]; vChip[3991]=vTile[247];
			aChip[4084]=aTile[244]; aChip[4085]=aTile[245]; aChip[4086]=aTile[246]; aChip[4087]=aTile[247];

			nChip[920]=nTile[248]; nChip[921]=nTile[249]; nChip[922]=nTile[250]; nChip[923]=nTile[251];
			hChip[1016]=hTile[248]; hChip[1017]=hTile[249]; hChip[1018]=hTile[250]; hChip[1019]=hTile[251];
			vChip[3992]=vTile[248]; vChip[3993]=vTile[249]; vChip[3994]=vTile[250]; vChip[3995]=vTile[251];
			aChip[4088]=aTile[248]; aChip[4089]=aTile[249]; aChip[4090]=aTile[250]; aChip[4091]=aTile[251];

			nChip[924]=nTile[252]; nChip[925]=nTile[253]; nChip[926]=nTile[254]; nChip[927]=nTile[255];
			hChip[1020]=hTile[252]; hChip[1021]=hTile[253]; hChip[1022]=hTile[254]; hChip[1023]=hTile[255];
			vChip[3996]=vTile[252]; vChip[3997]=vTile[253]; vChip[3998]=vTile[254]; vChip[3999]=vTile[255];
			aChip[4092]=aTile[252]; aChip[4093]=aTile[253]; aChip[4094]=aTile[254]; aChip[4095]=aTile[255];

			A = d[cOfst+2]; B = d[cOfst+3];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[32]=nTile[0]; nChip[33]=nTile[1]; nChip[34]=nTile[2]; nChip[35]=nTile[3];
			hChip[64]=hTile[0]; hChip[65]=hTile[1]; hChip[66]=hTile[2]; hChip[67]=hTile[3];
			vChip[3104]=vTile[0]; vChip[3105]=vTile[1]; vChip[3106]=vTile[2]; vChip[3107]=vTile[3];
			aChip[3136]=aTile[0]; aChip[3137]=aTile[1]; aChip[3138]=aTile[2]; aChip[3139]=aTile[3];

			nChip[36]=nTile[4]; nChip[37]=nTile[5]; nChip[38]=nTile[6]; nChip[39]=nTile[7];
			hChip[68]=hTile[4]; hChip[69]=hTile[5]; hChip[70]=hTile[6]; hChip[71]=hTile[7];
			vChip[3108]=vTile[4]; vChip[3109]=vTile[5]; vChip[3110]=vTile[6]; vChip[3111]=vTile[7];
			aChip[3140]=aTile[4]; aChip[3141]=aTile[5]; aChip[3142]=aTile[6]; aChip[3143]=aTile[7];

			nChip[40]=nTile[8]; nChip[41]=nTile[9]; nChip[42]=nTile[10]; nChip[43]=nTile[11];
			hChip[72]=hTile[8]; hChip[73]=hTile[9]; hChip[74]=hTile[10]; hChip[75]=hTile[11];
			vChip[3112]=vTile[8]; vChip[3113]=vTile[9]; vChip[3114]=vTile[10]; vChip[3115]=vTile[11];
			aChip[3144]=aTile[8]; aChip[3145]=aTile[9]; aChip[3146]=aTile[10]; aChip[3147]=aTile[11];

			nChip[44]=nTile[12]; nChip[45]=nTile[13]; nChip[46]=nTile[14]; nChip[47]=nTile[15];
			hChip[76]=hTile[12]; hChip[77]=hTile[13]; hChip[78]=hTile[14]; hChip[79]=hTile[15];
			vChip[3116]=vTile[12]; vChip[3117]=vTile[13]; vChip[3118]=vTile[14]; vChip[3119]=vTile[15];
			aChip[3148]=aTile[12]; aChip[3149]=aTile[13]; aChip[3150]=aTile[14]; aChip[3151]=aTile[15];

			nChip[48]=nTile[16]; nChip[49]=nTile[17]; nChip[50]=nTile[18]; nChip[51]=nTile[19];
			hChip[80]=hTile[16]; hChip[81]=hTile[17]; hChip[82]=hTile[18]; hChip[83]=hTile[19];
			vChip[3120]=vTile[16]; vChip[3121]=vTile[17]; vChip[3122]=vTile[18]; vChip[3123]=vTile[19];
			aChip[3152]=aTile[16]; aChip[3153]=aTile[17]; aChip[3154]=aTile[18]; aChip[3155]=aTile[19];

			nChip[52]=nTile[20]; nChip[53]=nTile[21]; nChip[54]=nTile[22]; nChip[55]=nTile[23];
			hChip[84]=hTile[20]; hChip[85]=hTile[21]; hChip[86]=hTile[22]; hChip[87]=hTile[23];
			vChip[3124]=vTile[20]; vChip[3125]=vTile[21]; vChip[3126]=vTile[22]; vChip[3127]=vTile[23];
			aChip[3156]=aTile[20]; aChip[3157]=aTile[21]; aChip[3158]=aTile[22]; aChip[3159]=aTile[23];

			nChip[56]=nTile[24]; nChip[57]=nTile[25]; nChip[58]=nTile[26]; nChip[59]=nTile[27];
			hChip[88]=hTile[24]; hChip[89]=hTile[25]; hChip[90]=hTile[26]; hChip[91]=hTile[27];
			vChip[3128]=vTile[24]; vChip[3129]=vTile[25]; vChip[3130]=vTile[26]; vChip[3131]=vTile[27];
			aChip[3160]=aTile[24]; aChip[3161]=aTile[25]; aChip[3162]=aTile[26]; aChip[3163]=aTile[27];

			nChip[60]=nTile[28]; nChip[61]=nTile[29]; nChip[62]=nTile[30]; nChip[63]=nTile[31];
			hChip[92]=hTile[28]; hChip[93]=hTile[29]; hChip[94]=hTile[30]; hChip[95]=hTile[31];
			vChip[3132]=vTile[28]; vChip[3133]=vTile[29]; vChip[3134]=vTile[30]; vChip[3135]=vTile[31];
			aChip[3164]=aTile[28]; aChip[3165]=aTile[29]; aChip[3166]=aTile[30]; aChip[3167]=aTile[31];

			nChip[160]=nTile[32]; nChip[161]=nTile[33]; nChip[162]=nTile[34]; nChip[163]=nTile[35];
			hChip[192]=hTile[32]; hChip[193]=hTile[33]; hChip[194]=hTile[34]; hChip[195]=hTile[35];
			vChip[3232]=vTile[32]; vChip[3233]=vTile[33]; vChip[3234]=vTile[34]; vChip[3235]=vTile[35];
			aChip[3264]=aTile[32]; aChip[3265]=aTile[33]; aChip[3266]=aTile[34]; aChip[3267]=aTile[35];

			nChip[164]=nTile[36]; nChip[165]=nTile[37]; nChip[166]=nTile[38]; nChip[167]=nTile[39];
			hChip[196]=hTile[36]; hChip[197]=hTile[37]; hChip[198]=hTile[38]; hChip[199]=hTile[39];
			vChip[3236]=vTile[36]; vChip[3237]=vTile[37]; vChip[3238]=vTile[38]; vChip[3239]=vTile[39];
			aChip[3268]=aTile[36]; aChip[3269]=aTile[37]; aChip[3270]=aTile[38]; aChip[3271]=aTile[39];

			nChip[168]=nTile[40]; nChip[169]=nTile[41]; nChip[170]=nTile[42]; nChip[171]=nTile[43];
			hChip[200]=hTile[40]; hChip[201]=hTile[41]; hChip[202]=hTile[42]; hChip[203]=hTile[43];
			vChip[3240]=vTile[40]; vChip[3241]=vTile[41]; vChip[3242]=vTile[42]; vChip[3243]=vTile[43];
			aChip[3272]=aTile[40]; aChip[3273]=aTile[41]; aChip[3274]=aTile[42]; aChip[3275]=aTile[43];

			nChip[172]=nTile[44]; nChip[173]=nTile[45]; nChip[174]=nTile[46]; nChip[175]=nTile[47];
			hChip[204]=hTile[44]; hChip[205]=hTile[45]; hChip[206]=hTile[46]; hChip[207]=hTile[47];
			vChip[3244]=vTile[44]; vChip[3245]=vTile[45]; vChip[3246]=vTile[46]; vChip[3247]=vTile[47];
			aChip[3276]=aTile[44]; aChip[3277]=aTile[45]; aChip[3278]=aTile[46]; aChip[3279]=aTile[47];

			nChip[176]=nTile[48]; nChip[177]=nTile[49]; nChip[178]=nTile[50]; nChip[179]=nTile[51];
			hChip[208]=hTile[48]; hChip[209]=hTile[49]; hChip[210]=hTile[50]; hChip[211]=hTile[51];
			vChip[3248]=vTile[48]; vChip[3249]=vTile[49]; vChip[3250]=vTile[50]; vChip[3251]=vTile[51];
			aChip[3280]=aTile[48]; aChip[3281]=aTile[49]; aChip[3282]=aTile[50]; aChip[3283]=aTile[51];

			nChip[180]=nTile[52]; nChip[181]=nTile[53]; nChip[182]=nTile[54]; nChip[183]=nTile[55];
			hChip[212]=hTile[52]; hChip[213]=hTile[53]; hChip[214]=hTile[54]; hChip[215]=hTile[55];
			vChip[3252]=vTile[52]; vChip[3253]=vTile[53]; vChip[3254]=vTile[54]; vChip[3255]=vTile[55];
			aChip[3284]=aTile[52]; aChip[3285]=aTile[53]; aChip[3286]=aTile[54]; aChip[3287]=aTile[55];

			nChip[184]=nTile[56]; nChip[185]=nTile[57]; nChip[186]=nTile[58]; nChip[187]=nTile[59];
			hChip[216]=hTile[56]; hChip[217]=hTile[57]; hChip[218]=hTile[58]; hChip[219]=hTile[59];
			vChip[3256]=vTile[56]; vChip[3257]=vTile[57]; vChip[3258]=vTile[58]; vChip[3259]=vTile[59];
			aChip[3288]=aTile[56]; aChip[3289]=aTile[57]; aChip[3290]=aTile[58]; aChip[3291]=aTile[59];

			nChip[188]=nTile[60]; nChip[189]=nTile[61]; nChip[190]=nTile[62]; nChip[191]=nTile[63];
			hChip[220]=hTile[60]; hChip[221]=hTile[61]; hChip[222]=hTile[62]; hChip[223]=hTile[63];
			vChip[3260]=vTile[60]; vChip[3261]=vTile[61]; vChip[3262]=vTile[62]; vChip[3263]=vTile[63];
			aChip[3292]=aTile[60]; aChip[3293]=aTile[61]; aChip[3294]=aTile[62]; aChip[3295]=aTile[63];

			nChip[288]=nTile[64]; nChip[289]=nTile[65]; nChip[290]=nTile[66]; nChip[291]=nTile[67];
			hChip[320]=hTile[64]; hChip[321]=hTile[65]; hChip[322]=hTile[66]; hChip[323]=hTile[67];
			vChip[3360]=vTile[64]; vChip[3361]=vTile[65]; vChip[3362]=vTile[66]; vChip[3363]=vTile[67];
			aChip[3392]=aTile[64]; aChip[3393]=aTile[65]; aChip[3394]=aTile[66]; aChip[3395]=aTile[67];

			nChip[292]=nTile[68]; nChip[293]=nTile[69]; nChip[294]=nTile[70]; nChip[295]=nTile[71];
			hChip[324]=hTile[68]; hChip[325]=hTile[69]; hChip[326]=hTile[70]; hChip[327]=hTile[71];
			vChip[3364]=vTile[68]; vChip[3365]=vTile[69]; vChip[3366]=vTile[70]; vChip[3367]=vTile[71];
			aChip[3396]=aTile[68]; aChip[3397]=aTile[69]; aChip[3398]=aTile[70]; aChip[3399]=aTile[71];

			nChip[296]=nTile[72]; nChip[297]=nTile[73]; nChip[298]=nTile[74]; nChip[299]=nTile[75];
			hChip[328]=hTile[72]; hChip[329]=hTile[73]; hChip[330]=hTile[74]; hChip[331]=hTile[75];
			vChip[3368]=vTile[72]; vChip[3369]=vTile[73]; vChip[3370]=vTile[74]; vChip[3371]=vTile[75];
			aChip[3400]=aTile[72]; aChip[3401]=aTile[73]; aChip[3402]=aTile[74]; aChip[3403]=aTile[75];

			nChip[300]=nTile[76]; nChip[301]=nTile[77]; nChip[302]=nTile[78]; nChip[303]=nTile[79];
			hChip[332]=hTile[76]; hChip[333]=hTile[77]; hChip[334]=hTile[78]; hChip[335]=hTile[79];
			vChip[3372]=vTile[76]; vChip[3373]=vTile[77]; vChip[3374]=vTile[78]; vChip[3375]=vTile[79];
			aChip[3404]=aTile[76]; aChip[3405]=aTile[77]; aChip[3406]=aTile[78]; aChip[3407]=aTile[79];

			nChip[304]=nTile[80]; nChip[305]=nTile[81]; nChip[306]=nTile[82]; nChip[307]=nTile[83];
			hChip[336]=hTile[80]; hChip[337]=hTile[81]; hChip[338]=hTile[82]; hChip[339]=hTile[83];
			vChip[3376]=vTile[80]; vChip[3377]=vTile[81]; vChip[3378]=vTile[82]; vChip[3379]=vTile[83];
			aChip[3408]=aTile[80]; aChip[3409]=aTile[81]; aChip[3410]=aTile[82]; aChip[3411]=aTile[83];

			nChip[308]=nTile[84]; nChip[309]=nTile[85]; nChip[310]=nTile[86]; nChip[311]=nTile[87];
			hChip[340]=hTile[84]; hChip[341]=hTile[85]; hChip[342]=hTile[86]; hChip[343]=hTile[87];
			vChip[3380]=vTile[84]; vChip[3381]=vTile[85]; vChip[3382]=vTile[86]; vChip[3383]=vTile[87];
			aChip[3412]=aTile[84]; aChip[3413]=aTile[85]; aChip[3414]=aTile[86]; aChip[3415]=aTile[87];

			nChip[312]=nTile[88]; nChip[313]=nTile[89]; nChip[314]=nTile[90]; nChip[315]=nTile[91];
			hChip[344]=hTile[88]; hChip[345]=hTile[89]; hChip[346]=hTile[90]; hChip[347]=hTile[91];
			vChip[3384]=vTile[88]; vChip[3385]=vTile[89]; vChip[3386]=vTile[90]; vChip[3387]=vTile[91];
			aChip[3416]=aTile[88]; aChip[3417]=aTile[89]; aChip[3418]=aTile[90]; aChip[3419]=aTile[91];

			nChip[316]=nTile[92]; nChip[317]=nTile[93]; nChip[318]=nTile[94]; nChip[319]=nTile[95];
			hChip[348]=hTile[92]; hChip[349]=hTile[93]; hChip[350]=hTile[94]; hChip[351]=hTile[95];
			vChip[3388]=vTile[92]; vChip[3389]=vTile[93]; vChip[3390]=vTile[94]; vChip[3391]=vTile[95];
			aChip[3420]=aTile[92]; aChip[3421]=aTile[93]; aChip[3422]=aTile[94]; aChip[3423]=aTile[95];

			nChip[416]=nTile[96]; nChip[417]=nTile[97]; nChip[418]=nTile[98]; nChip[419]=nTile[99];
			hChip[448]=hTile[96]; hChip[449]=hTile[97]; hChip[450]=hTile[98]; hChip[451]=hTile[99];
			vChip[3488]=vTile[96]; vChip[3489]=vTile[97]; vChip[3490]=vTile[98]; vChip[3491]=vTile[99];
			aChip[3520]=aTile[96]; aChip[3521]=aTile[97]; aChip[3522]=aTile[98]; aChip[3523]=aTile[99];

			nChip[420]=nTile[100]; nChip[421]=nTile[101]; nChip[422]=nTile[102]; nChip[423]=nTile[103];
			hChip[452]=hTile[100]; hChip[453]=hTile[101]; hChip[454]=hTile[102]; hChip[455]=hTile[103];
			vChip[3492]=vTile[100]; vChip[3493]=vTile[101]; vChip[3494]=vTile[102]; vChip[3495]=vTile[103];
			aChip[3524]=aTile[100]; aChip[3525]=aTile[101]; aChip[3526]=aTile[102]; aChip[3527]=aTile[103];

			nChip[424]=nTile[104]; nChip[425]=nTile[105]; nChip[426]=nTile[106]; nChip[427]=nTile[107];
			hChip[456]=hTile[104]; hChip[457]=hTile[105]; hChip[458]=hTile[106]; hChip[459]=hTile[107];
			vChip[3496]=vTile[104]; vChip[3497]=vTile[105]; vChip[3498]=vTile[106]; vChip[3499]=vTile[107];
			aChip[3528]=aTile[104]; aChip[3529]=aTile[105]; aChip[3530]=aTile[106]; aChip[3531]=aTile[107];

			nChip[428]=nTile[108]; nChip[429]=nTile[109]; nChip[430]=nTile[110]; nChip[431]=nTile[111];
			hChip[460]=hTile[108]; hChip[461]=hTile[109]; hChip[462]=hTile[110]; hChip[463]=hTile[111];
			vChip[3500]=vTile[108]; vChip[3501]=vTile[109]; vChip[3502]=vTile[110]; vChip[3503]=vTile[111];
			aChip[3532]=aTile[108]; aChip[3533]=aTile[109]; aChip[3534]=aTile[110]; aChip[3535]=aTile[111];

			nChip[432]=nTile[112]; nChip[433]=nTile[113]; nChip[434]=nTile[114]; nChip[435]=nTile[115];
			hChip[464]=hTile[112]; hChip[465]=hTile[113]; hChip[466]=hTile[114]; hChip[467]=hTile[115];
			vChip[3504]=vTile[112]; vChip[3505]=vTile[113]; vChip[3506]=vTile[114]; vChip[3507]=vTile[115];
			aChip[3536]=aTile[112]; aChip[3537]=aTile[113]; aChip[3538]=aTile[114]; aChip[3539]=aTile[115];

			nChip[436]=nTile[116]; nChip[437]=nTile[117]; nChip[438]=nTile[118]; nChip[439]=nTile[119];
			hChip[468]=hTile[116]; hChip[469]=hTile[117]; hChip[470]=hTile[118]; hChip[471]=hTile[119];
			vChip[3508]=vTile[116]; vChip[3509]=vTile[117]; vChip[3510]=vTile[118]; vChip[3511]=vTile[119];
			aChip[3540]=aTile[116]; aChip[3541]=aTile[117]; aChip[3542]=aTile[118]; aChip[3543]=aTile[119];

			nChip[440]=nTile[120]; nChip[441]=nTile[121]; nChip[442]=nTile[122]; nChip[443]=nTile[123];
			hChip[472]=hTile[120]; hChip[473]=hTile[121]; hChip[474]=hTile[122]; hChip[475]=hTile[123];
			vChip[3512]=vTile[120]; vChip[3513]=vTile[121]; vChip[3514]=vTile[122]; vChip[3515]=vTile[123];
			aChip[3544]=aTile[120]; aChip[3545]=aTile[121]; aChip[3546]=aTile[122]; aChip[3547]=aTile[123];

			nChip[444]=nTile[124]; nChip[445]=nTile[125]; nChip[446]=nTile[126]; nChip[447]=nTile[127];
			hChip[476]=hTile[124]; hChip[477]=hTile[125]; hChip[478]=hTile[126]; hChip[479]=hTile[127];
			vChip[3516]=vTile[124]; vChip[3517]=vTile[125]; vChip[3518]=vTile[126]; vChip[3519]=vTile[127];
			aChip[3548]=aTile[124]; aChip[3549]=aTile[125]; aChip[3550]=aTile[126]; aChip[3551]=aTile[127];

			nChip[544]=nTile[128]; nChip[545]=nTile[129]; nChip[546]=nTile[130]; nChip[547]=nTile[131];
			hChip[576]=hTile[128]; hChip[577]=hTile[129]; hChip[578]=hTile[130]; hChip[579]=hTile[131];
			vChip[3616]=vTile[128]; vChip[3617]=vTile[129]; vChip[3618]=vTile[130]; vChip[3619]=vTile[131];
			aChip[3648]=aTile[128]; aChip[3649]=aTile[129]; aChip[3650]=aTile[130]; aChip[3651]=aTile[131];

			nChip[548]=nTile[132]; nChip[549]=nTile[133]; nChip[550]=nTile[134]; nChip[551]=nTile[135];
			hChip[580]=hTile[132]; hChip[581]=hTile[133]; hChip[582]=hTile[134]; hChip[583]=hTile[135];
			vChip[3620]=vTile[132]; vChip[3621]=vTile[133]; vChip[3622]=vTile[134]; vChip[3623]=vTile[135];
			aChip[3652]=aTile[132]; aChip[3653]=aTile[133]; aChip[3654]=aTile[134]; aChip[3655]=aTile[135];

			nChip[552]=nTile[136]; nChip[553]=nTile[137]; nChip[554]=nTile[138]; nChip[555]=nTile[139];
			hChip[584]=hTile[136]; hChip[585]=hTile[137]; hChip[586]=hTile[138]; hChip[587]=hTile[139];
			vChip[3624]=vTile[136]; vChip[3625]=vTile[137]; vChip[3626]=vTile[138]; vChip[3627]=vTile[139];
			aChip[3656]=aTile[136]; aChip[3657]=aTile[137]; aChip[3658]=aTile[138]; aChip[3659]=aTile[139];

			nChip[556]=nTile[140]; nChip[557]=nTile[141]; nChip[558]=nTile[142]; nChip[559]=nTile[143];
			hChip[588]=hTile[140]; hChip[589]=hTile[141]; hChip[590]=hTile[142]; hChip[591]=hTile[143];
			vChip[3628]=vTile[140]; vChip[3629]=vTile[141]; vChip[3630]=vTile[142]; vChip[3631]=vTile[143];
			aChip[3660]=aTile[140]; aChip[3661]=aTile[141]; aChip[3662]=aTile[142]; aChip[3663]=aTile[143];

			nChip[560]=nTile[144]; nChip[561]=nTile[145]; nChip[562]=nTile[146]; nChip[563]=nTile[147];
			hChip[592]=hTile[144]; hChip[593]=hTile[145]; hChip[594]=hTile[146]; hChip[595]=hTile[147];
			vChip[3632]=vTile[144]; vChip[3633]=vTile[145]; vChip[3634]=vTile[146]; vChip[3635]=vTile[147];
			aChip[3664]=aTile[144]; aChip[3665]=aTile[145]; aChip[3666]=aTile[146]; aChip[3667]=aTile[147];

			nChip[564]=nTile[148]; nChip[565]=nTile[149]; nChip[566]=nTile[150]; nChip[567]=nTile[151];
			hChip[596]=hTile[148]; hChip[597]=hTile[149]; hChip[598]=hTile[150]; hChip[599]=hTile[151];
			vChip[3636]=vTile[148]; vChip[3637]=vTile[149]; vChip[3638]=vTile[150]; vChip[3639]=vTile[151];
			aChip[3668]=aTile[148]; aChip[3669]=aTile[149]; aChip[3670]=aTile[150]; aChip[3671]=aTile[151];

			nChip[568]=nTile[152]; nChip[569]=nTile[153]; nChip[570]=nTile[154]; nChip[571]=nTile[155];
			hChip[600]=hTile[152]; hChip[601]=hTile[153]; hChip[602]=hTile[154]; hChip[603]=hTile[155];
			vChip[3640]=vTile[152]; vChip[3641]=vTile[153]; vChip[3642]=vTile[154]; vChip[3643]=vTile[155];
			aChip[3672]=aTile[152]; aChip[3673]=aTile[153]; aChip[3674]=aTile[154]; aChip[3675]=aTile[155];

			nChip[572]=nTile[156]; nChip[573]=nTile[157]; nChip[574]=nTile[158]; nChip[575]=nTile[159];
			hChip[604]=hTile[156]; hChip[605]=hTile[157]; hChip[606]=hTile[158]; hChip[607]=hTile[159];
			vChip[3644]=vTile[156]; vChip[3645]=vTile[157]; vChip[3646]=vTile[158]; vChip[3647]=vTile[159];
			aChip[3676]=aTile[156]; aChip[3677]=aTile[157]; aChip[3678]=aTile[158]; aChip[3679]=aTile[159];

			nChip[672]=nTile[160]; nChip[673]=nTile[161]; nChip[674]=nTile[162]; nChip[675]=nTile[163];
			hChip[704]=hTile[160]; hChip[705]=hTile[161]; hChip[706]=hTile[162]; hChip[707]=hTile[163];
			vChip[3744]=vTile[160]; vChip[3745]=vTile[161]; vChip[3746]=vTile[162]; vChip[3747]=vTile[163];
			aChip[3776]=aTile[160]; aChip[3777]=aTile[161]; aChip[3778]=aTile[162]; aChip[3779]=aTile[163];

			nChip[676]=nTile[164]; nChip[677]=nTile[165]; nChip[678]=nTile[166]; nChip[679]=nTile[167];
			hChip[708]=hTile[164]; hChip[709]=hTile[165]; hChip[710]=hTile[166]; hChip[711]=hTile[167];
			vChip[3748]=vTile[164]; vChip[3749]=vTile[165]; vChip[3750]=vTile[166]; vChip[3751]=vTile[167];
			aChip[3780]=aTile[164]; aChip[3781]=aTile[165]; aChip[3782]=aTile[166]; aChip[3783]=aTile[167];

			nChip[680]=nTile[168]; nChip[681]=nTile[169]; nChip[682]=nTile[170]; nChip[683]=nTile[171];
			hChip[712]=hTile[168]; hChip[713]=hTile[169]; hChip[714]=hTile[170]; hChip[715]=hTile[171];
			vChip[3752]=vTile[168]; vChip[3753]=vTile[169]; vChip[3754]=vTile[170]; vChip[3755]=vTile[171];
			aChip[3784]=aTile[168]; aChip[3785]=aTile[169]; aChip[3786]=aTile[170]; aChip[3787]=aTile[171];

			nChip[684]=nTile[172]; nChip[685]=nTile[173]; nChip[686]=nTile[174]; nChip[687]=nTile[175];
			hChip[716]=hTile[172]; hChip[717]=hTile[173]; hChip[718]=hTile[174]; hChip[719]=hTile[175];
			vChip[3756]=vTile[172]; vChip[3757]=vTile[173]; vChip[3758]=vTile[174]; vChip[3759]=vTile[175];
			aChip[3788]=aTile[172]; aChip[3789]=aTile[173]; aChip[3790]=aTile[174]; aChip[3791]=aTile[175];

			nChip[688]=nTile[176]; nChip[689]=nTile[177]; nChip[690]=nTile[178]; nChip[691]=nTile[179];
			hChip[720]=hTile[176]; hChip[721]=hTile[177]; hChip[722]=hTile[178]; hChip[723]=hTile[179];
			vChip[3760]=vTile[176]; vChip[3761]=vTile[177]; vChip[3762]=vTile[178]; vChip[3763]=vTile[179];
			aChip[3792]=aTile[176]; aChip[3793]=aTile[177]; aChip[3794]=aTile[178]; aChip[3795]=aTile[179];

			nChip[692]=nTile[180]; nChip[693]=nTile[181]; nChip[694]=nTile[182]; nChip[695]=nTile[183];
			hChip[724]=hTile[180]; hChip[725]=hTile[181]; hChip[726]=hTile[182]; hChip[727]=hTile[183];
			vChip[3764]=vTile[180]; vChip[3765]=vTile[181]; vChip[3766]=vTile[182]; vChip[3767]=vTile[183];
			aChip[3796]=aTile[180]; aChip[3797]=aTile[181]; aChip[3798]=aTile[182]; aChip[3799]=aTile[183];

			nChip[696]=nTile[184]; nChip[697]=nTile[185]; nChip[698]=nTile[186]; nChip[699]=nTile[187];
			hChip[728]=hTile[184]; hChip[729]=hTile[185]; hChip[730]=hTile[186]; hChip[731]=hTile[187];
			vChip[3768]=vTile[184]; vChip[3769]=vTile[185]; vChip[3770]=vTile[186]; vChip[3771]=vTile[187];
			aChip[3800]=aTile[184]; aChip[3801]=aTile[185]; aChip[3802]=aTile[186]; aChip[3803]=aTile[187];

			nChip[700]=nTile[188]; nChip[701]=nTile[189]; nChip[702]=nTile[190]; nChip[703]=nTile[191];
			hChip[732]=hTile[188]; hChip[733]=hTile[189]; hChip[734]=hTile[190]; hChip[735]=hTile[191];
			vChip[3772]=vTile[188]; vChip[3773]=vTile[189]; vChip[3774]=vTile[190]; vChip[3775]=vTile[191];
			aChip[3804]=aTile[188]; aChip[3805]=aTile[189]; aChip[3806]=aTile[190]; aChip[3807]=aTile[191];

			nChip[800]=nTile[192]; nChip[801]=nTile[193]; nChip[802]=nTile[194]; nChip[803]=nTile[195];
			hChip[832]=hTile[192]; hChip[833]=hTile[193]; hChip[834]=hTile[194]; hChip[835]=hTile[195];
			vChip[3872]=vTile[192]; vChip[3873]=vTile[193]; vChip[3874]=vTile[194]; vChip[3875]=vTile[195];
			aChip[3904]=aTile[192]; aChip[3905]=aTile[193]; aChip[3906]=aTile[194]; aChip[3907]=aTile[195];

			nChip[804]=nTile[196]; nChip[805]=nTile[197]; nChip[806]=nTile[198]; nChip[807]=nTile[199];
			hChip[836]=hTile[196]; hChip[837]=hTile[197]; hChip[838]=hTile[198]; hChip[839]=hTile[199];
			vChip[3876]=vTile[196]; vChip[3877]=vTile[197]; vChip[3878]=vTile[198]; vChip[3879]=vTile[199];
			aChip[3908]=aTile[196]; aChip[3909]=aTile[197]; aChip[3910]=aTile[198]; aChip[3911]=aTile[199];

			nChip[808]=nTile[200]; nChip[809]=nTile[201]; nChip[810]=nTile[202]; nChip[811]=nTile[203];
			hChip[840]=hTile[200]; hChip[841]=hTile[201]; hChip[842]=hTile[202]; hChip[843]=hTile[203];
			vChip[3880]=vTile[200]; vChip[3881]=vTile[201]; vChip[3882]=vTile[202]; vChip[3883]=vTile[203];
			aChip[3912]=aTile[200]; aChip[3913]=aTile[201]; aChip[3914]=aTile[202]; aChip[3915]=aTile[203];

			nChip[812]=nTile[204]; nChip[813]=nTile[205]; nChip[814]=nTile[206]; nChip[815]=nTile[207];
			hChip[844]=hTile[204]; hChip[845]=hTile[205]; hChip[846]=hTile[206]; hChip[847]=hTile[207];
			vChip[3884]=vTile[204]; vChip[3885]=vTile[205]; vChip[3886]=vTile[206]; vChip[3887]=vTile[207];
			aChip[3916]=aTile[204]; aChip[3917]=aTile[205]; aChip[3918]=aTile[206]; aChip[3919]=aTile[207];

			nChip[816]=nTile[208]; nChip[817]=nTile[209]; nChip[818]=nTile[210]; nChip[819]=nTile[211];
			hChip[848]=hTile[208]; hChip[849]=hTile[209]; hChip[850]=hTile[210]; hChip[851]=hTile[211];
			vChip[3888]=vTile[208]; vChip[3889]=vTile[209]; vChip[3890]=vTile[210]; vChip[3891]=vTile[211];
			aChip[3920]=aTile[208]; aChip[3921]=aTile[209]; aChip[3922]=aTile[210]; aChip[3923]=aTile[211];

			nChip[820]=nTile[212]; nChip[821]=nTile[213]; nChip[822]=nTile[214]; nChip[823]=nTile[215];
			hChip[852]=hTile[212]; hChip[853]=hTile[213]; hChip[854]=hTile[214]; hChip[855]=hTile[215];
			vChip[3892]=vTile[212]; vChip[3893]=vTile[213]; vChip[3894]=vTile[214]; vChip[3895]=vTile[215];
			aChip[3924]=aTile[212]; aChip[3925]=aTile[213]; aChip[3926]=aTile[214]; aChip[3927]=aTile[215];

			nChip[824]=nTile[216]; nChip[825]=nTile[217]; nChip[826]=nTile[218]; nChip[827]=nTile[219];
			hChip[856]=hTile[216]; hChip[857]=hTile[217]; hChip[858]=hTile[218]; hChip[859]=hTile[219];
			vChip[3896]=vTile[216]; vChip[3897]=vTile[217]; vChip[3898]=vTile[218]; vChip[3899]=vTile[219];
			aChip[3928]=aTile[216]; aChip[3929]=aTile[217]; aChip[3930]=aTile[218]; aChip[3931]=aTile[219];

			nChip[828]=nTile[220]; nChip[829]=nTile[221]; nChip[830]=nTile[222]; nChip[831]=nTile[223];
			hChip[860]=hTile[220]; hChip[861]=hTile[221]; hChip[862]=hTile[222]; hChip[863]=hTile[223];
			vChip[3900]=vTile[220]; vChip[3901]=vTile[221]; vChip[3902]=vTile[222]; vChip[3903]=vTile[223];
			aChip[3932]=aTile[220]; aChip[3933]=aTile[221]; aChip[3934]=aTile[222]; aChip[3935]=aTile[223];

			nChip[928]=nTile[224]; nChip[929]=nTile[225]; nChip[930]=nTile[226]; nChip[931]=nTile[227];
			hChip[960]=hTile[224]; hChip[961]=hTile[225]; hChip[962]=hTile[226]; hChip[963]=hTile[227];
			vChip[4000]=vTile[224]; vChip[4001]=vTile[225]; vChip[4002]=vTile[226]; vChip[4003]=vTile[227];
			aChip[4032]=aTile[224]; aChip[4033]=aTile[225]; aChip[4034]=aTile[226]; aChip[4035]=aTile[227];

			nChip[932]=nTile[228]; nChip[933]=nTile[229]; nChip[934]=nTile[230]; nChip[935]=nTile[231];
			hChip[964]=hTile[228]; hChip[965]=hTile[229]; hChip[966]=hTile[230]; hChip[967]=hTile[231];
			vChip[4004]=vTile[228]; vChip[4005]=vTile[229]; vChip[4006]=vTile[230]; vChip[4007]=vTile[231];
			aChip[4036]=aTile[228]; aChip[4037]=aTile[229]; aChip[4038]=aTile[230]; aChip[4039]=aTile[231];

			nChip[936]=nTile[232]; nChip[937]=nTile[233]; nChip[938]=nTile[234]; nChip[939]=nTile[235];
			hChip[968]=hTile[232]; hChip[969]=hTile[233]; hChip[970]=hTile[234]; hChip[971]=hTile[235];
			vChip[4008]=vTile[232]; vChip[4009]=vTile[233]; vChip[4010]=vTile[234]; vChip[4011]=vTile[235];
			aChip[4040]=aTile[232]; aChip[4041]=aTile[233]; aChip[4042]=aTile[234]; aChip[4043]=aTile[235];

			nChip[940]=nTile[236]; nChip[941]=nTile[237]; nChip[942]=nTile[238]; nChip[943]=nTile[239];
			hChip[972]=hTile[236]; hChip[973]=hTile[237]; hChip[974]=hTile[238]; hChip[975]=hTile[239];
			vChip[4012]=vTile[236]; vChip[4013]=vTile[237]; vChip[4014]=vTile[238]; vChip[4015]=vTile[239];
			aChip[4044]=aTile[236]; aChip[4045]=aTile[237]; aChip[4046]=aTile[238]; aChip[4047]=aTile[239];

			nChip[944]=nTile[240]; nChip[945]=nTile[241]; nChip[946]=nTile[242]; nChip[947]=nTile[243];
			hChip[976]=hTile[240]; hChip[977]=hTile[241]; hChip[978]=hTile[242]; hChip[979]=hTile[243];
			vChip[4016]=vTile[240]; vChip[4017]=vTile[241]; vChip[4018]=vTile[242]; vChip[4019]=vTile[243];
			aChip[4048]=aTile[240]; aChip[4049]=aTile[241]; aChip[4050]=aTile[242]; aChip[4051]=aTile[243];

			nChip[948]=nTile[244]; nChip[949]=nTile[245]; nChip[950]=nTile[246]; nChip[951]=nTile[247];
			hChip[980]=hTile[244]; hChip[981]=hTile[245]; hChip[982]=hTile[246]; hChip[983]=hTile[247];
			vChip[4020]=vTile[244]; vChip[4021]=vTile[245]; vChip[4022]=vTile[246]; vChip[4023]=vTile[247];
			aChip[4052]=aTile[244]; aChip[4053]=aTile[245]; aChip[4054]=aTile[246]; aChip[4055]=aTile[247];

			nChip[952]=nTile[248]; nChip[953]=nTile[249]; nChip[954]=nTile[250]; nChip[955]=nTile[251];
			hChip[984]=hTile[248]; hChip[985]=hTile[249]; hChip[986]=hTile[250]; hChip[987]=hTile[251];
			vChip[4024]=vTile[248]; vChip[4025]=vTile[249]; vChip[4026]=vTile[250]; vChip[4027]=vTile[251];
			aChip[4056]=aTile[248]; aChip[4057]=aTile[249]; aChip[4058]=aTile[250]; aChip[4059]=aTile[251];

			nChip[956]=nTile[252]; nChip[957]=nTile[253]; nChip[958]=nTile[254]; nChip[959]=nTile[255];
			hChip[988]=hTile[252]; hChip[989]=hTile[253]; hChip[990]=hTile[254]; hChip[991]=hTile[255];
			vChip[4028]=vTile[252]; vChip[4029]=vTile[253]; vChip[4030]=vTile[254]; vChip[4031]=vTile[255];
			aChip[4060]=aTile[252]; aChip[4061]=aTile[253]; aChip[4062]=aTile[254]; aChip[4063]=aTile[255];

			A = d[cOfst+4]; B = d[cOfst+5];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[64]=nTile[0]; nChip[65]=nTile[1]; nChip[66]=nTile[2]; nChip[67]=nTile[3];
			hChip[32]=hTile[0]; hChip[33]=hTile[1]; hChip[34]=hTile[2]; hChip[35]=hTile[3];
			vChip[3136]=vTile[0]; vChip[3137]=vTile[1]; vChip[3138]=vTile[2]; vChip[3139]=vTile[3];
			aChip[3104]=aTile[0]; aChip[3105]=aTile[1]; aChip[3106]=aTile[2]; aChip[3107]=aTile[3];

			nChip[68]=nTile[4]; nChip[69]=nTile[5]; nChip[70]=nTile[6]; nChip[71]=nTile[7];
			hChip[36]=hTile[4]; hChip[37]=hTile[5]; hChip[38]=hTile[6]; hChip[39]=hTile[7];
			vChip[3140]=vTile[4]; vChip[3141]=vTile[5]; vChip[3142]=vTile[6]; vChip[3143]=vTile[7];
			aChip[3108]=aTile[4]; aChip[3109]=aTile[5]; aChip[3110]=aTile[6]; aChip[3111]=aTile[7];

			nChip[72]=nTile[8]; nChip[73]=nTile[9]; nChip[74]=nTile[10]; nChip[75]=nTile[11];
			hChip[40]=hTile[8]; hChip[41]=hTile[9]; hChip[42]=hTile[10]; hChip[43]=hTile[11];
			vChip[3144]=vTile[8]; vChip[3145]=vTile[9]; vChip[3146]=vTile[10]; vChip[3147]=vTile[11];
			aChip[3112]=aTile[8]; aChip[3113]=aTile[9]; aChip[3114]=aTile[10]; aChip[3115]=aTile[11];

			nChip[76]=nTile[12]; nChip[77]=nTile[13]; nChip[78]=nTile[14]; nChip[79]=nTile[15];
			hChip[44]=hTile[12]; hChip[45]=hTile[13]; hChip[46]=hTile[14]; hChip[47]=hTile[15];
			vChip[3148]=vTile[12]; vChip[3149]=vTile[13]; vChip[3150]=vTile[14]; vChip[3151]=vTile[15];
			aChip[3116]=aTile[12]; aChip[3117]=aTile[13]; aChip[3118]=aTile[14]; aChip[3119]=aTile[15];

			nChip[80]=nTile[16]; nChip[81]=nTile[17]; nChip[82]=nTile[18]; nChip[83]=nTile[19];
			hChip[48]=hTile[16]; hChip[49]=hTile[17]; hChip[50]=hTile[18]; hChip[51]=hTile[19];
			vChip[3152]=vTile[16]; vChip[3153]=vTile[17]; vChip[3154]=vTile[18]; vChip[3155]=vTile[19];
			aChip[3120]=aTile[16]; aChip[3121]=aTile[17]; aChip[3122]=aTile[18]; aChip[3123]=aTile[19];

			nChip[84]=nTile[20]; nChip[85]=nTile[21]; nChip[86]=nTile[22]; nChip[87]=nTile[23];
			hChip[52]=hTile[20]; hChip[53]=hTile[21]; hChip[54]=hTile[22]; hChip[55]=hTile[23];
			vChip[3156]=vTile[20]; vChip[3157]=vTile[21]; vChip[3158]=vTile[22]; vChip[3159]=vTile[23];
			aChip[3124]=aTile[20]; aChip[3125]=aTile[21]; aChip[3126]=aTile[22]; aChip[3127]=aTile[23];

			nChip[88]=nTile[24]; nChip[89]=nTile[25]; nChip[90]=nTile[26]; nChip[91]=nTile[27];
			hChip[56]=hTile[24]; hChip[57]=hTile[25]; hChip[58]=hTile[26]; hChip[59]=hTile[27];
			vChip[3160]=vTile[24]; vChip[3161]=vTile[25]; vChip[3162]=vTile[26]; vChip[3163]=vTile[27];
			aChip[3128]=aTile[24]; aChip[3129]=aTile[25]; aChip[3130]=aTile[26]; aChip[3131]=aTile[27];

			nChip[92]=nTile[28]; nChip[93]=nTile[29]; nChip[94]=nTile[30]; nChip[95]=nTile[31];
			hChip[60]=hTile[28]; hChip[61]=hTile[29]; hChip[62]=hTile[30]; hChip[63]=hTile[31];
			vChip[3164]=vTile[28]; vChip[3165]=vTile[29]; vChip[3166]=vTile[30]; vChip[3167]=vTile[31];
			aChip[3132]=aTile[28]; aChip[3133]=aTile[29]; aChip[3134]=aTile[30]; aChip[3135]=aTile[31];

			nChip[192]=nTile[32]; nChip[193]=nTile[33]; nChip[194]=nTile[34]; nChip[195]=nTile[35];
			hChip[160]=hTile[32]; hChip[161]=hTile[33]; hChip[162]=hTile[34]; hChip[163]=hTile[35];
			vChip[3264]=vTile[32]; vChip[3265]=vTile[33]; vChip[3266]=vTile[34]; vChip[3267]=vTile[35];
			aChip[3232]=aTile[32]; aChip[3233]=aTile[33]; aChip[3234]=aTile[34]; aChip[3235]=aTile[35];

			nChip[196]=nTile[36]; nChip[197]=nTile[37]; nChip[198]=nTile[38]; nChip[199]=nTile[39];
			hChip[164]=hTile[36]; hChip[165]=hTile[37]; hChip[166]=hTile[38]; hChip[167]=hTile[39];
			vChip[3268]=vTile[36]; vChip[3269]=vTile[37]; vChip[3270]=vTile[38]; vChip[3271]=vTile[39];
			aChip[3236]=aTile[36]; aChip[3237]=aTile[37]; aChip[3238]=aTile[38]; aChip[3239]=aTile[39];

			nChip[200]=nTile[40]; nChip[201]=nTile[41]; nChip[202]=nTile[42]; nChip[203]=nTile[43];
			hChip[168]=hTile[40]; hChip[169]=hTile[41]; hChip[170]=hTile[42]; hChip[171]=hTile[43];
			vChip[3272]=vTile[40]; vChip[3273]=vTile[41]; vChip[3274]=vTile[42]; vChip[3275]=vTile[43];
			aChip[3240]=aTile[40]; aChip[3241]=aTile[41]; aChip[3242]=aTile[42]; aChip[3243]=aTile[43];

			nChip[204]=nTile[44]; nChip[205]=nTile[45]; nChip[206]=nTile[46]; nChip[207]=nTile[47];
			hChip[172]=hTile[44]; hChip[173]=hTile[45]; hChip[174]=hTile[46]; hChip[175]=hTile[47];
			vChip[3276]=vTile[44]; vChip[3277]=vTile[45]; vChip[3278]=vTile[46]; vChip[3279]=vTile[47];
			aChip[3244]=aTile[44]; aChip[3245]=aTile[45]; aChip[3246]=aTile[46]; aChip[3247]=aTile[47];

			nChip[208]=nTile[48]; nChip[209]=nTile[49]; nChip[210]=nTile[50]; nChip[211]=nTile[51];
			hChip[176]=hTile[48]; hChip[177]=hTile[49]; hChip[178]=hTile[50]; hChip[179]=hTile[51];
			vChip[3280]=vTile[48]; vChip[3281]=vTile[49]; vChip[3282]=vTile[50]; vChip[3283]=vTile[51];
			aChip[3248]=aTile[48]; aChip[3249]=aTile[49]; aChip[3250]=aTile[50]; aChip[3251]=aTile[51];

			nChip[212]=nTile[52]; nChip[213]=nTile[53]; nChip[214]=nTile[54]; nChip[215]=nTile[55];
			hChip[180]=hTile[52]; hChip[181]=hTile[53]; hChip[182]=hTile[54]; hChip[183]=hTile[55];
			vChip[3284]=vTile[52]; vChip[3285]=vTile[53]; vChip[3286]=vTile[54]; vChip[3287]=vTile[55];
			aChip[3252]=aTile[52]; aChip[3253]=aTile[53]; aChip[3254]=aTile[54]; aChip[3255]=aTile[55];

			nChip[216]=nTile[56]; nChip[217]=nTile[57]; nChip[218]=nTile[58]; nChip[219]=nTile[59];
			hChip[184]=hTile[56]; hChip[185]=hTile[57]; hChip[186]=hTile[58]; hChip[187]=hTile[59];
			vChip[3288]=vTile[56]; vChip[3289]=vTile[57]; vChip[3290]=vTile[58]; vChip[3291]=vTile[59];
			aChip[3256]=aTile[56]; aChip[3257]=aTile[57]; aChip[3258]=aTile[58]; aChip[3259]=aTile[59];

			nChip[220]=nTile[60]; nChip[221]=nTile[61]; nChip[222]=nTile[62]; nChip[223]=nTile[63];
			hChip[188]=hTile[60]; hChip[189]=hTile[61]; hChip[190]=hTile[62]; hChip[191]=hTile[63];
			vChip[3292]=vTile[60]; vChip[3293]=vTile[61]; vChip[3294]=vTile[62]; vChip[3295]=vTile[63];
			aChip[3260]=aTile[60]; aChip[3261]=aTile[61]; aChip[3262]=aTile[62]; aChip[3263]=aTile[63];

			nChip[320]=nTile[64]; nChip[321]=nTile[65]; nChip[322]=nTile[66]; nChip[323]=nTile[67];
			hChip[288]=hTile[64]; hChip[289]=hTile[65]; hChip[290]=hTile[66]; hChip[291]=hTile[67];
			vChip[3392]=vTile[64]; vChip[3393]=vTile[65]; vChip[3394]=vTile[66]; vChip[3395]=vTile[67];
			aChip[3360]=aTile[64]; aChip[3361]=aTile[65]; aChip[3362]=aTile[66]; aChip[3363]=aTile[67];

			nChip[324]=nTile[68]; nChip[325]=nTile[69]; nChip[326]=nTile[70]; nChip[327]=nTile[71];
			hChip[292]=hTile[68]; hChip[293]=hTile[69]; hChip[294]=hTile[70]; hChip[295]=hTile[71];
			vChip[3396]=vTile[68]; vChip[3397]=vTile[69]; vChip[3398]=vTile[70]; vChip[3399]=vTile[71];
			aChip[3364]=aTile[68]; aChip[3365]=aTile[69]; aChip[3366]=aTile[70]; aChip[3367]=aTile[71];

			nChip[328]=nTile[72]; nChip[329]=nTile[73]; nChip[330]=nTile[74]; nChip[331]=nTile[75];
			hChip[296]=hTile[72]; hChip[297]=hTile[73]; hChip[298]=hTile[74]; hChip[299]=hTile[75];
			vChip[3400]=vTile[72]; vChip[3401]=vTile[73]; vChip[3402]=vTile[74]; vChip[3403]=vTile[75];
			aChip[3368]=aTile[72]; aChip[3369]=aTile[73]; aChip[3370]=aTile[74]; aChip[3371]=aTile[75];

			nChip[332]=nTile[76]; nChip[333]=nTile[77]; nChip[334]=nTile[78]; nChip[335]=nTile[79];
			hChip[300]=hTile[76]; hChip[301]=hTile[77]; hChip[302]=hTile[78]; hChip[303]=hTile[79];
			vChip[3404]=vTile[76]; vChip[3405]=vTile[77]; vChip[3406]=vTile[78]; vChip[3407]=vTile[79];
			aChip[3372]=aTile[76]; aChip[3373]=aTile[77]; aChip[3374]=aTile[78]; aChip[3375]=aTile[79];

			nChip[336]=nTile[80]; nChip[337]=nTile[81]; nChip[338]=nTile[82]; nChip[339]=nTile[83];
			hChip[304]=hTile[80]; hChip[305]=hTile[81]; hChip[306]=hTile[82]; hChip[307]=hTile[83];
			vChip[3408]=vTile[80]; vChip[3409]=vTile[81]; vChip[3410]=vTile[82]; vChip[3411]=vTile[83];
			aChip[3376]=aTile[80]; aChip[3377]=aTile[81]; aChip[3378]=aTile[82]; aChip[3379]=aTile[83];

			nChip[340]=nTile[84]; nChip[341]=nTile[85]; nChip[342]=nTile[86]; nChip[343]=nTile[87];
			hChip[308]=hTile[84]; hChip[309]=hTile[85]; hChip[310]=hTile[86]; hChip[311]=hTile[87];
			vChip[3412]=vTile[84]; vChip[3413]=vTile[85]; vChip[3414]=vTile[86]; vChip[3415]=vTile[87];
			aChip[3380]=aTile[84]; aChip[3381]=aTile[85]; aChip[3382]=aTile[86]; aChip[3383]=aTile[87];

			nChip[344]=nTile[88]; nChip[345]=nTile[89]; nChip[346]=nTile[90]; nChip[347]=nTile[91];
			hChip[312]=hTile[88]; hChip[313]=hTile[89]; hChip[314]=hTile[90]; hChip[315]=hTile[91];
			vChip[3416]=vTile[88]; vChip[3417]=vTile[89]; vChip[3418]=vTile[90]; vChip[3419]=vTile[91];
			aChip[3384]=aTile[88]; aChip[3385]=aTile[89]; aChip[3386]=aTile[90]; aChip[3387]=aTile[91];

			nChip[348]=nTile[92]; nChip[349]=nTile[93]; nChip[350]=nTile[94]; nChip[351]=nTile[95];
			hChip[316]=hTile[92]; hChip[317]=hTile[93]; hChip[318]=hTile[94]; hChip[319]=hTile[95];
			vChip[3420]=vTile[92]; vChip[3421]=vTile[93]; vChip[3422]=vTile[94]; vChip[3423]=vTile[95];
			aChip[3388]=aTile[92]; aChip[3389]=aTile[93]; aChip[3390]=aTile[94]; aChip[3391]=aTile[95];

			nChip[448]=nTile[96]; nChip[449]=nTile[97]; nChip[450]=nTile[98]; nChip[451]=nTile[99];
			hChip[416]=hTile[96]; hChip[417]=hTile[97]; hChip[418]=hTile[98]; hChip[419]=hTile[99];
			vChip[3520]=vTile[96]; vChip[3521]=vTile[97]; vChip[3522]=vTile[98]; vChip[3523]=vTile[99];
			aChip[3488]=aTile[96]; aChip[3489]=aTile[97]; aChip[3490]=aTile[98]; aChip[3491]=aTile[99];

			nChip[452]=nTile[100]; nChip[453]=nTile[101]; nChip[454]=nTile[102]; nChip[455]=nTile[103];
			hChip[420]=hTile[100]; hChip[421]=hTile[101]; hChip[422]=hTile[102]; hChip[423]=hTile[103];
			vChip[3524]=vTile[100]; vChip[3525]=vTile[101]; vChip[3526]=vTile[102]; vChip[3527]=vTile[103];
			aChip[3492]=aTile[100]; aChip[3493]=aTile[101]; aChip[3494]=aTile[102]; aChip[3495]=aTile[103];

			nChip[456]=nTile[104]; nChip[457]=nTile[105]; nChip[458]=nTile[106]; nChip[459]=nTile[107];
			hChip[424]=hTile[104]; hChip[425]=hTile[105]; hChip[426]=hTile[106]; hChip[427]=hTile[107];
			vChip[3528]=vTile[104]; vChip[3529]=vTile[105]; vChip[3530]=vTile[106]; vChip[3531]=vTile[107];
			aChip[3496]=aTile[104]; aChip[3497]=aTile[105]; aChip[3498]=aTile[106]; aChip[3499]=aTile[107];

			nChip[460]=nTile[108]; nChip[461]=nTile[109]; nChip[462]=nTile[110]; nChip[463]=nTile[111];
			hChip[428]=hTile[108]; hChip[429]=hTile[109]; hChip[430]=hTile[110]; hChip[431]=hTile[111];
			vChip[3532]=vTile[108]; vChip[3533]=vTile[109]; vChip[3534]=vTile[110]; vChip[3535]=vTile[111];
			aChip[3500]=aTile[108]; aChip[3501]=aTile[109]; aChip[3502]=aTile[110]; aChip[3503]=aTile[111];

			nChip[464]=nTile[112]; nChip[465]=nTile[113]; nChip[466]=nTile[114]; nChip[467]=nTile[115];
			hChip[432]=hTile[112]; hChip[433]=hTile[113]; hChip[434]=hTile[114]; hChip[435]=hTile[115];
			vChip[3536]=vTile[112]; vChip[3537]=vTile[113]; vChip[3538]=vTile[114]; vChip[3539]=vTile[115];
			aChip[3504]=aTile[112]; aChip[3505]=aTile[113]; aChip[3506]=aTile[114]; aChip[3507]=aTile[115];

			nChip[468]=nTile[116]; nChip[469]=nTile[117]; nChip[470]=nTile[118]; nChip[471]=nTile[119];
			hChip[436]=hTile[116]; hChip[437]=hTile[117]; hChip[438]=hTile[118]; hChip[439]=hTile[119];
			vChip[3540]=vTile[116]; vChip[3541]=vTile[117]; vChip[3542]=vTile[118]; vChip[3543]=vTile[119];
			aChip[3508]=aTile[116]; aChip[3509]=aTile[117]; aChip[3510]=aTile[118]; aChip[3511]=aTile[119];

			nChip[472]=nTile[120]; nChip[473]=nTile[121]; nChip[474]=nTile[122]; nChip[475]=nTile[123];
			hChip[440]=hTile[120]; hChip[441]=hTile[121]; hChip[442]=hTile[122]; hChip[443]=hTile[123];
			vChip[3544]=vTile[120]; vChip[3545]=vTile[121]; vChip[3546]=vTile[122]; vChip[3547]=vTile[123];
			aChip[3512]=aTile[120]; aChip[3513]=aTile[121]; aChip[3514]=aTile[122]; aChip[3515]=aTile[123];

			nChip[476]=nTile[124]; nChip[477]=nTile[125]; nChip[478]=nTile[126]; nChip[479]=nTile[127];
			hChip[444]=hTile[124]; hChip[445]=hTile[125]; hChip[446]=hTile[126]; hChip[447]=hTile[127];
			vChip[3548]=vTile[124]; vChip[3549]=vTile[125]; vChip[3550]=vTile[126]; vChip[3551]=vTile[127];
			aChip[3516]=aTile[124]; aChip[3517]=aTile[125]; aChip[3518]=aTile[126]; aChip[3519]=aTile[127];

			nChip[576]=nTile[128]; nChip[577]=nTile[129]; nChip[578]=nTile[130]; nChip[579]=nTile[131];
			hChip[544]=hTile[128]; hChip[545]=hTile[129]; hChip[546]=hTile[130]; hChip[547]=hTile[131];
			vChip[3648]=vTile[128]; vChip[3649]=vTile[129]; vChip[3650]=vTile[130]; vChip[3651]=vTile[131];
			aChip[3616]=aTile[128]; aChip[3617]=aTile[129]; aChip[3618]=aTile[130]; aChip[3619]=aTile[131];

			nChip[580]=nTile[132]; nChip[581]=nTile[133]; nChip[582]=nTile[134]; nChip[583]=nTile[135];
			hChip[548]=hTile[132]; hChip[549]=hTile[133]; hChip[550]=hTile[134]; hChip[551]=hTile[135];
			vChip[3652]=vTile[132]; vChip[3653]=vTile[133]; vChip[3654]=vTile[134]; vChip[3655]=vTile[135];
			aChip[3620]=aTile[132]; aChip[3621]=aTile[133]; aChip[3622]=aTile[134]; aChip[3623]=aTile[135];

			nChip[584]=nTile[136]; nChip[585]=nTile[137]; nChip[586]=nTile[138]; nChip[587]=nTile[139];
			hChip[552]=hTile[136]; hChip[553]=hTile[137]; hChip[554]=hTile[138]; hChip[555]=hTile[139];
			vChip[3656]=vTile[136]; vChip[3657]=vTile[137]; vChip[3658]=vTile[138]; vChip[3659]=vTile[139];
			aChip[3624]=aTile[136]; aChip[3625]=aTile[137]; aChip[3626]=aTile[138]; aChip[3627]=aTile[139];

			nChip[588]=nTile[140]; nChip[589]=nTile[141]; nChip[590]=nTile[142]; nChip[591]=nTile[143];
			hChip[556]=hTile[140]; hChip[557]=hTile[141]; hChip[558]=hTile[142]; hChip[559]=hTile[143];
			vChip[3660]=vTile[140]; vChip[3661]=vTile[141]; vChip[3662]=vTile[142]; vChip[3663]=vTile[143];
			aChip[3628]=aTile[140]; aChip[3629]=aTile[141]; aChip[3630]=aTile[142]; aChip[3631]=aTile[143];

			nChip[592]=nTile[144]; nChip[593]=nTile[145]; nChip[594]=nTile[146]; nChip[595]=nTile[147];
			hChip[560]=hTile[144]; hChip[561]=hTile[145]; hChip[562]=hTile[146]; hChip[563]=hTile[147];
			vChip[3664]=vTile[144]; vChip[3665]=vTile[145]; vChip[3666]=vTile[146]; vChip[3667]=vTile[147];
			aChip[3632]=aTile[144]; aChip[3633]=aTile[145]; aChip[3634]=aTile[146]; aChip[3635]=aTile[147];

			nChip[596]=nTile[148]; nChip[597]=nTile[149]; nChip[598]=nTile[150]; nChip[599]=nTile[151];
			hChip[564]=hTile[148]; hChip[565]=hTile[149]; hChip[566]=hTile[150]; hChip[567]=hTile[151];
			vChip[3668]=vTile[148]; vChip[3669]=vTile[149]; vChip[3670]=vTile[150]; vChip[3671]=vTile[151];
			aChip[3636]=aTile[148]; aChip[3637]=aTile[149]; aChip[3638]=aTile[150]; aChip[3639]=aTile[151];

			nChip[600]=nTile[152]; nChip[601]=nTile[153]; nChip[602]=nTile[154]; nChip[603]=nTile[155];
			hChip[568]=hTile[152]; hChip[569]=hTile[153]; hChip[570]=hTile[154]; hChip[571]=hTile[155];
			vChip[3672]=vTile[152]; vChip[3673]=vTile[153]; vChip[3674]=vTile[154]; vChip[3675]=vTile[155];
			aChip[3640]=aTile[152]; aChip[3641]=aTile[153]; aChip[3642]=aTile[154]; aChip[3643]=aTile[155];

			nChip[604]=nTile[156]; nChip[605]=nTile[157]; nChip[606]=nTile[158]; nChip[607]=nTile[159];
			hChip[572]=hTile[156]; hChip[573]=hTile[157]; hChip[574]=hTile[158]; hChip[575]=hTile[159];
			vChip[3676]=vTile[156]; vChip[3677]=vTile[157]; vChip[3678]=vTile[158]; vChip[3679]=vTile[159];
			aChip[3644]=aTile[156]; aChip[3645]=aTile[157]; aChip[3646]=aTile[158]; aChip[3647]=aTile[159];

			nChip[704]=nTile[160]; nChip[705]=nTile[161]; nChip[706]=nTile[162]; nChip[707]=nTile[163];
			hChip[672]=hTile[160]; hChip[673]=hTile[161]; hChip[674]=hTile[162]; hChip[675]=hTile[163];
			vChip[3776]=vTile[160]; vChip[3777]=vTile[161]; vChip[3778]=vTile[162]; vChip[3779]=vTile[163];
			aChip[3744]=aTile[160]; aChip[3745]=aTile[161]; aChip[3746]=aTile[162]; aChip[3747]=aTile[163];

			nChip[708]=nTile[164]; nChip[709]=nTile[165]; nChip[710]=nTile[166]; nChip[711]=nTile[167];
			hChip[676]=hTile[164]; hChip[677]=hTile[165]; hChip[678]=hTile[166]; hChip[679]=hTile[167];
			vChip[3780]=vTile[164]; vChip[3781]=vTile[165]; vChip[3782]=vTile[166]; vChip[3783]=vTile[167];
			aChip[3748]=aTile[164]; aChip[3749]=aTile[165]; aChip[3750]=aTile[166]; aChip[3751]=aTile[167];

			nChip[712]=nTile[168]; nChip[713]=nTile[169]; nChip[714]=nTile[170]; nChip[715]=nTile[171];
			hChip[680]=hTile[168]; hChip[681]=hTile[169]; hChip[682]=hTile[170]; hChip[683]=hTile[171];
			vChip[3784]=vTile[168]; vChip[3785]=vTile[169]; vChip[3786]=vTile[170]; vChip[3787]=vTile[171];
			aChip[3752]=aTile[168]; aChip[3753]=aTile[169]; aChip[3754]=aTile[170]; aChip[3755]=aTile[171];

			nChip[716]=nTile[172]; nChip[717]=nTile[173]; nChip[718]=nTile[174]; nChip[719]=nTile[175];
			hChip[684]=hTile[172]; hChip[685]=hTile[173]; hChip[686]=hTile[174]; hChip[687]=hTile[175];
			vChip[3788]=vTile[172]; vChip[3789]=vTile[173]; vChip[3790]=vTile[174]; vChip[3791]=vTile[175];
			aChip[3756]=aTile[172]; aChip[3757]=aTile[173]; aChip[3758]=aTile[174]; aChip[3759]=aTile[175];

			nChip[720]=nTile[176]; nChip[721]=nTile[177]; nChip[722]=nTile[178]; nChip[723]=nTile[179];
			hChip[688]=hTile[176]; hChip[689]=hTile[177]; hChip[690]=hTile[178]; hChip[691]=hTile[179];
			vChip[3792]=vTile[176]; vChip[3793]=vTile[177]; vChip[3794]=vTile[178]; vChip[3795]=vTile[179];
			aChip[3760]=aTile[176]; aChip[3761]=aTile[177]; aChip[3762]=aTile[178]; aChip[3763]=aTile[179];

			nChip[724]=nTile[180]; nChip[725]=nTile[181]; nChip[726]=nTile[182]; nChip[727]=nTile[183];
			hChip[692]=hTile[180]; hChip[693]=hTile[181]; hChip[694]=hTile[182]; hChip[695]=hTile[183];
			vChip[3796]=vTile[180]; vChip[3797]=vTile[181]; vChip[3798]=vTile[182]; vChip[3799]=vTile[183];
			aChip[3764]=aTile[180]; aChip[3765]=aTile[181]; aChip[3766]=aTile[182]; aChip[3767]=aTile[183];

			nChip[728]=nTile[184]; nChip[729]=nTile[185]; nChip[730]=nTile[186]; nChip[731]=nTile[187];
			hChip[696]=hTile[184]; hChip[697]=hTile[185]; hChip[698]=hTile[186]; hChip[699]=hTile[187];
			vChip[3800]=vTile[184]; vChip[3801]=vTile[185]; vChip[3802]=vTile[186]; vChip[3803]=vTile[187];
			aChip[3768]=aTile[184]; aChip[3769]=aTile[185]; aChip[3770]=aTile[186]; aChip[3771]=aTile[187];

			nChip[732]=nTile[188]; nChip[733]=nTile[189]; nChip[734]=nTile[190]; nChip[735]=nTile[191];
			hChip[700]=hTile[188]; hChip[701]=hTile[189]; hChip[702]=hTile[190]; hChip[703]=hTile[191];
			vChip[3804]=vTile[188]; vChip[3805]=vTile[189]; vChip[3806]=vTile[190]; vChip[3807]=vTile[191];
			aChip[3772]=aTile[188]; aChip[3773]=aTile[189]; aChip[3774]=aTile[190]; aChip[3775]=aTile[191];

			nChip[832]=nTile[192]; nChip[833]=nTile[193]; nChip[834]=nTile[194]; nChip[835]=nTile[195];
			hChip[800]=hTile[192]; hChip[801]=hTile[193]; hChip[802]=hTile[194]; hChip[803]=hTile[195];
			vChip[3904]=vTile[192]; vChip[3905]=vTile[193]; vChip[3906]=vTile[194]; vChip[3907]=vTile[195];
			aChip[3872]=aTile[192]; aChip[3873]=aTile[193]; aChip[3874]=aTile[194]; aChip[3875]=aTile[195];

			nChip[836]=nTile[196]; nChip[837]=nTile[197]; nChip[838]=nTile[198]; nChip[839]=nTile[199];
			hChip[804]=hTile[196]; hChip[805]=hTile[197]; hChip[806]=hTile[198]; hChip[807]=hTile[199];
			vChip[3908]=vTile[196]; vChip[3909]=vTile[197]; vChip[3910]=vTile[198]; vChip[3911]=vTile[199];
			aChip[3876]=aTile[196]; aChip[3877]=aTile[197]; aChip[3878]=aTile[198]; aChip[3879]=aTile[199];

			nChip[840]=nTile[200]; nChip[841]=nTile[201]; nChip[842]=nTile[202]; nChip[843]=nTile[203];
			hChip[808]=hTile[200]; hChip[809]=hTile[201]; hChip[810]=hTile[202]; hChip[811]=hTile[203];
			vChip[3912]=vTile[200]; vChip[3913]=vTile[201]; vChip[3914]=vTile[202]; vChip[3915]=vTile[203];
			aChip[3880]=aTile[200]; aChip[3881]=aTile[201]; aChip[3882]=aTile[202]; aChip[3883]=aTile[203];

			nChip[844]=nTile[204]; nChip[845]=nTile[205]; nChip[846]=nTile[206]; nChip[847]=nTile[207];
			hChip[812]=hTile[204]; hChip[813]=hTile[205]; hChip[814]=hTile[206]; hChip[815]=hTile[207];
			vChip[3916]=vTile[204]; vChip[3917]=vTile[205]; vChip[3918]=vTile[206]; vChip[3919]=vTile[207];
			aChip[3884]=aTile[204]; aChip[3885]=aTile[205]; aChip[3886]=aTile[206]; aChip[3887]=aTile[207];

			nChip[848]=nTile[208]; nChip[849]=nTile[209]; nChip[850]=nTile[210]; nChip[851]=nTile[211];
			hChip[816]=hTile[208]; hChip[817]=hTile[209]; hChip[818]=hTile[210]; hChip[819]=hTile[211];
			vChip[3920]=vTile[208]; vChip[3921]=vTile[209]; vChip[3922]=vTile[210]; vChip[3923]=vTile[211];
			aChip[3888]=aTile[208]; aChip[3889]=aTile[209]; aChip[3890]=aTile[210]; aChip[3891]=aTile[211];

			nChip[852]=nTile[212]; nChip[853]=nTile[213]; nChip[854]=nTile[214]; nChip[855]=nTile[215];
			hChip[820]=hTile[212]; hChip[821]=hTile[213]; hChip[822]=hTile[214]; hChip[823]=hTile[215];
			vChip[3924]=vTile[212]; vChip[3925]=vTile[213]; vChip[3926]=vTile[214]; vChip[3927]=vTile[215];
			aChip[3892]=aTile[212]; aChip[3893]=aTile[213]; aChip[3894]=aTile[214]; aChip[3895]=aTile[215];

			nChip[856]=nTile[216]; nChip[857]=nTile[217]; nChip[858]=nTile[218]; nChip[859]=nTile[219];
			hChip[824]=hTile[216]; hChip[825]=hTile[217]; hChip[826]=hTile[218]; hChip[827]=hTile[219];
			vChip[3928]=vTile[216]; vChip[3929]=vTile[217]; vChip[3930]=vTile[218]; vChip[3931]=vTile[219];
			aChip[3896]=aTile[216]; aChip[3897]=aTile[217]; aChip[3898]=aTile[218]; aChip[3899]=aTile[219];

			nChip[860]=nTile[220]; nChip[861]=nTile[221]; nChip[862]=nTile[222]; nChip[863]=nTile[223];
			hChip[828]=hTile[220]; hChip[829]=hTile[221]; hChip[830]=hTile[222]; hChip[831]=hTile[223];
			vChip[3932]=vTile[220]; vChip[3933]=vTile[221]; vChip[3934]=vTile[222]; vChip[3935]=vTile[223];
			aChip[3900]=aTile[220]; aChip[3901]=aTile[221]; aChip[3902]=aTile[222]; aChip[3903]=aTile[223];

			nChip[960]=nTile[224]; nChip[961]=nTile[225]; nChip[962]=nTile[226]; nChip[963]=nTile[227];
			hChip[928]=hTile[224]; hChip[929]=hTile[225]; hChip[930]=hTile[226]; hChip[931]=hTile[227];
			vChip[4032]=vTile[224]; vChip[4033]=vTile[225]; vChip[4034]=vTile[226]; vChip[4035]=vTile[227];
			aChip[4000]=aTile[224]; aChip[4001]=aTile[225]; aChip[4002]=aTile[226]; aChip[4003]=aTile[227];

			nChip[964]=nTile[228]; nChip[965]=nTile[229]; nChip[966]=nTile[230]; nChip[967]=nTile[231];
			hChip[932]=hTile[228]; hChip[933]=hTile[229]; hChip[934]=hTile[230]; hChip[935]=hTile[231];
			vChip[4036]=vTile[228]; vChip[4037]=vTile[229]; vChip[4038]=vTile[230]; vChip[4039]=vTile[231];
			aChip[4004]=aTile[228]; aChip[4005]=aTile[229]; aChip[4006]=aTile[230]; aChip[4007]=aTile[231];

			nChip[968]=nTile[232]; nChip[969]=nTile[233]; nChip[970]=nTile[234]; nChip[971]=nTile[235];
			hChip[936]=hTile[232]; hChip[937]=hTile[233]; hChip[938]=hTile[234]; hChip[939]=hTile[235];
			vChip[4040]=vTile[232]; vChip[4041]=vTile[233]; vChip[4042]=vTile[234]; vChip[4043]=vTile[235];
			aChip[4008]=aTile[232]; aChip[4009]=aTile[233]; aChip[4010]=aTile[234]; aChip[4011]=aTile[235];

			nChip[972]=nTile[236]; nChip[973]=nTile[237]; nChip[974]=nTile[238]; nChip[975]=nTile[239];
			hChip[940]=hTile[236]; hChip[941]=hTile[237]; hChip[942]=hTile[238]; hChip[943]=hTile[239];
			vChip[4044]=vTile[236]; vChip[4045]=vTile[237]; vChip[4046]=vTile[238]; vChip[4047]=vTile[239];
			aChip[4012]=aTile[236]; aChip[4013]=aTile[237]; aChip[4014]=aTile[238]; aChip[4015]=aTile[239];

			nChip[976]=nTile[240]; nChip[977]=nTile[241]; nChip[978]=nTile[242]; nChip[979]=nTile[243];
			hChip[944]=hTile[240]; hChip[945]=hTile[241]; hChip[946]=hTile[242]; hChip[947]=hTile[243];
			vChip[4048]=vTile[240]; vChip[4049]=vTile[241]; vChip[4050]=vTile[242]; vChip[4051]=vTile[243];
			aChip[4016]=aTile[240]; aChip[4017]=aTile[241]; aChip[4018]=aTile[242]; aChip[4019]=aTile[243];

			nChip[980]=nTile[244]; nChip[981]=nTile[245]; nChip[982]=nTile[246]; nChip[983]=nTile[247];
			hChip[948]=hTile[244]; hChip[949]=hTile[245]; hChip[950]=hTile[246]; hChip[951]=hTile[247];
			vChip[4052]=vTile[244]; vChip[4053]=vTile[245]; vChip[4054]=vTile[246]; vChip[4055]=vTile[247];
			aChip[4020]=aTile[244]; aChip[4021]=aTile[245]; aChip[4022]=aTile[246]; aChip[4023]=aTile[247];

			nChip[984]=nTile[248]; nChip[985]=nTile[249]; nChip[986]=nTile[250]; nChip[987]=nTile[251];
			hChip[952]=hTile[248]; hChip[953]=hTile[249]; hChip[954]=hTile[250]; hChip[955]=hTile[251];
			vChip[4056]=vTile[248]; vChip[4057]=vTile[249]; vChip[4058]=vTile[250]; vChip[4059]=vTile[251];
			aChip[4024]=aTile[248]; aChip[4025]=aTile[249]; aChip[4026]=aTile[250]; aChip[4027]=aTile[251];

			nChip[988]=nTile[252]; nChip[989]=nTile[253]; nChip[990]=nTile[254]; nChip[991]=nTile[255];
			hChip[956]=hTile[252]; hChip[957]=hTile[253]; hChip[958]=hTile[254]; hChip[959]=hTile[255];
			vChip[4060]=vTile[252]; vChip[4061]=vTile[253]; vChip[4062]=vTile[254]; vChip[4063]=vTile[255];
			aChip[4028]=aTile[252]; aChip[4029]=aTile[253]; aChip[4030]=aTile[254]; aChip[4031]=aTile[255];

			A = d[cOfst+6]; B = d[cOfst+7];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[96]=nTile[0]; nChip[97]=nTile[1]; nChip[98]=nTile[2]; nChip[99]=nTile[3];
			hChip[0]=hTile[0]; hChip[1]=hTile[1]; hChip[2]=hTile[2]; hChip[3]=hTile[3];
			vChip[3168]=vTile[0]; vChip[3169]=vTile[1]; vChip[3170]=vTile[2]; vChip[3171]=vTile[3];
			aChip[3072]=aTile[0]; aChip[3073]=aTile[1]; aChip[3074]=aTile[2]; aChip[3075]=aTile[3];

			nChip[100]=nTile[4]; nChip[101]=nTile[5]; nChip[102]=nTile[6]; nChip[103]=nTile[7];
			hChip[4]=hTile[4]; hChip[5]=hTile[5]; hChip[6]=hTile[6]; hChip[7]=hTile[7];
			vChip[3172]=vTile[4]; vChip[3173]=vTile[5]; vChip[3174]=vTile[6]; vChip[3175]=vTile[7];
			aChip[3076]=aTile[4]; aChip[3077]=aTile[5]; aChip[3078]=aTile[6]; aChip[3079]=aTile[7];

			nChip[104]=nTile[8]; nChip[105]=nTile[9]; nChip[106]=nTile[10]; nChip[107]=nTile[11];
			hChip[8]=hTile[8]; hChip[9]=hTile[9]; hChip[10]=hTile[10]; hChip[11]=hTile[11];
			vChip[3176]=vTile[8]; vChip[3177]=vTile[9]; vChip[3178]=vTile[10]; vChip[3179]=vTile[11];
			aChip[3080]=aTile[8]; aChip[3081]=aTile[9]; aChip[3082]=aTile[10]; aChip[3083]=aTile[11];

			nChip[108]=nTile[12]; nChip[109]=nTile[13]; nChip[110]=nTile[14]; nChip[111]=nTile[15];
			hChip[12]=hTile[12]; hChip[13]=hTile[13]; hChip[14]=hTile[14]; hChip[15]=hTile[15];
			vChip[3180]=vTile[12]; vChip[3181]=vTile[13]; vChip[3182]=vTile[14]; vChip[3183]=vTile[15];
			aChip[3084]=aTile[12]; aChip[3085]=aTile[13]; aChip[3086]=aTile[14]; aChip[3087]=aTile[15];

			nChip[112]=nTile[16]; nChip[113]=nTile[17]; nChip[114]=nTile[18]; nChip[115]=nTile[19];
			hChip[16]=hTile[16]; hChip[17]=hTile[17]; hChip[18]=hTile[18]; hChip[19]=hTile[19];
			vChip[3184]=vTile[16]; vChip[3185]=vTile[17]; vChip[3186]=vTile[18]; vChip[3187]=vTile[19];
			aChip[3088]=aTile[16]; aChip[3089]=aTile[17]; aChip[3090]=aTile[18]; aChip[3091]=aTile[19];

			nChip[116]=nTile[20]; nChip[117]=nTile[21]; nChip[118]=nTile[22]; nChip[119]=nTile[23];
			hChip[20]=hTile[20]; hChip[21]=hTile[21]; hChip[22]=hTile[22]; hChip[23]=hTile[23];
			vChip[3188]=vTile[20]; vChip[3189]=vTile[21]; vChip[3190]=vTile[22]; vChip[3191]=vTile[23];
			aChip[3092]=aTile[20]; aChip[3093]=aTile[21]; aChip[3094]=aTile[22]; aChip[3095]=aTile[23];

			nChip[120]=nTile[24]; nChip[121]=nTile[25]; nChip[122]=nTile[26]; nChip[123]=nTile[27];
			hChip[24]=hTile[24]; hChip[25]=hTile[25]; hChip[26]=hTile[26]; hChip[27]=hTile[27];
			vChip[3192]=vTile[24]; vChip[3193]=vTile[25]; vChip[3194]=vTile[26]; vChip[3195]=vTile[27];
			aChip[3096]=aTile[24]; aChip[3097]=aTile[25]; aChip[3098]=aTile[26]; aChip[3099]=aTile[27];

			nChip[124]=nTile[28]; nChip[125]=nTile[29]; nChip[126]=nTile[30]; nChip[127]=nTile[31];
			hChip[28]=hTile[28]; hChip[29]=hTile[29]; hChip[30]=hTile[30]; hChip[31]=hTile[31];
			vChip[3196]=vTile[28]; vChip[3197]=vTile[29]; vChip[3198]=vTile[30]; vChip[3199]=vTile[31];
			aChip[3100]=aTile[28]; aChip[3101]=aTile[29]; aChip[3102]=aTile[30]; aChip[3103]=aTile[31];

			nChip[224]=nTile[32]; nChip[225]=nTile[33]; nChip[226]=nTile[34]; nChip[227]=nTile[35];
			hChip[128]=hTile[32]; hChip[129]=hTile[33]; hChip[130]=hTile[34]; hChip[131]=hTile[35];
			vChip[3296]=vTile[32]; vChip[3297]=vTile[33]; vChip[3298]=vTile[34]; vChip[3299]=vTile[35];
			aChip[3200]=aTile[32]; aChip[3201]=aTile[33]; aChip[3202]=aTile[34]; aChip[3203]=aTile[35];

			nChip[228]=nTile[36]; nChip[229]=nTile[37]; nChip[230]=nTile[38]; nChip[231]=nTile[39];
			hChip[132]=hTile[36]; hChip[133]=hTile[37]; hChip[134]=hTile[38]; hChip[135]=hTile[39];
			vChip[3300]=vTile[36]; vChip[3301]=vTile[37]; vChip[3302]=vTile[38]; vChip[3303]=vTile[39];
			aChip[3204]=aTile[36]; aChip[3205]=aTile[37]; aChip[3206]=aTile[38]; aChip[3207]=aTile[39];

			nChip[232]=nTile[40]; nChip[233]=nTile[41]; nChip[234]=nTile[42]; nChip[235]=nTile[43];
			hChip[136]=hTile[40]; hChip[137]=hTile[41]; hChip[138]=hTile[42]; hChip[139]=hTile[43];
			vChip[3304]=vTile[40]; vChip[3305]=vTile[41]; vChip[3306]=vTile[42]; vChip[3307]=vTile[43];
			aChip[3208]=aTile[40]; aChip[3209]=aTile[41]; aChip[3210]=aTile[42]; aChip[3211]=aTile[43];

			nChip[236]=nTile[44]; nChip[237]=nTile[45]; nChip[238]=nTile[46]; nChip[239]=nTile[47];
			hChip[140]=hTile[44]; hChip[141]=hTile[45]; hChip[142]=hTile[46]; hChip[143]=hTile[47];
			vChip[3308]=vTile[44]; vChip[3309]=vTile[45]; vChip[3310]=vTile[46]; vChip[3311]=vTile[47];
			aChip[3212]=aTile[44]; aChip[3213]=aTile[45]; aChip[3214]=aTile[46]; aChip[3215]=aTile[47];

			nChip[240]=nTile[48]; nChip[241]=nTile[49]; nChip[242]=nTile[50]; nChip[243]=nTile[51];
			hChip[144]=hTile[48]; hChip[145]=hTile[49]; hChip[146]=hTile[50]; hChip[147]=hTile[51];
			vChip[3312]=vTile[48]; vChip[3313]=vTile[49]; vChip[3314]=vTile[50]; vChip[3315]=vTile[51];
			aChip[3216]=aTile[48]; aChip[3217]=aTile[49]; aChip[3218]=aTile[50]; aChip[3219]=aTile[51];

			nChip[244]=nTile[52]; nChip[245]=nTile[53]; nChip[246]=nTile[54]; nChip[247]=nTile[55];
			hChip[148]=hTile[52]; hChip[149]=hTile[53]; hChip[150]=hTile[54]; hChip[151]=hTile[55];
			vChip[3316]=vTile[52]; vChip[3317]=vTile[53]; vChip[3318]=vTile[54]; vChip[3319]=vTile[55];
			aChip[3220]=aTile[52]; aChip[3221]=aTile[53]; aChip[3222]=aTile[54]; aChip[3223]=aTile[55];

			nChip[248]=nTile[56]; nChip[249]=nTile[57]; nChip[250]=nTile[58]; nChip[251]=nTile[59];
			hChip[152]=hTile[56]; hChip[153]=hTile[57]; hChip[154]=hTile[58]; hChip[155]=hTile[59];
			vChip[3320]=vTile[56]; vChip[3321]=vTile[57]; vChip[3322]=vTile[58]; vChip[3323]=vTile[59];
			aChip[3224]=aTile[56]; aChip[3225]=aTile[57]; aChip[3226]=aTile[58]; aChip[3227]=aTile[59];

			nChip[252]=nTile[60]; nChip[253]=nTile[61]; nChip[254]=nTile[62]; nChip[255]=nTile[63];
			hChip[156]=hTile[60]; hChip[157]=hTile[61]; hChip[158]=hTile[62]; hChip[159]=hTile[63];
			vChip[3324]=vTile[60]; vChip[3325]=vTile[61]; vChip[3326]=vTile[62]; vChip[3327]=vTile[63];
			aChip[3228]=aTile[60]; aChip[3229]=aTile[61]; aChip[3230]=aTile[62]; aChip[3231]=aTile[63];

			nChip[352]=nTile[64]; nChip[353]=nTile[65]; nChip[354]=nTile[66]; nChip[355]=nTile[67];
			hChip[256]=hTile[64]; hChip[257]=hTile[65]; hChip[258]=hTile[66]; hChip[259]=hTile[67];
			vChip[3424]=vTile[64]; vChip[3425]=vTile[65]; vChip[3426]=vTile[66]; vChip[3427]=vTile[67];
			aChip[3328]=aTile[64]; aChip[3329]=aTile[65]; aChip[3330]=aTile[66]; aChip[3331]=aTile[67];

			nChip[356]=nTile[68]; nChip[357]=nTile[69]; nChip[358]=nTile[70]; nChip[359]=nTile[71];
			hChip[260]=hTile[68]; hChip[261]=hTile[69]; hChip[262]=hTile[70]; hChip[263]=hTile[71];
			vChip[3428]=vTile[68]; vChip[3429]=vTile[69]; vChip[3430]=vTile[70]; vChip[3431]=vTile[71];
			aChip[3332]=aTile[68]; aChip[3333]=aTile[69]; aChip[3334]=aTile[70]; aChip[3335]=aTile[71];

			nChip[360]=nTile[72]; nChip[361]=nTile[73]; nChip[362]=nTile[74]; nChip[363]=nTile[75];
			hChip[264]=hTile[72]; hChip[265]=hTile[73]; hChip[266]=hTile[74]; hChip[267]=hTile[75];
			vChip[3432]=vTile[72]; vChip[3433]=vTile[73]; vChip[3434]=vTile[74]; vChip[3435]=vTile[75];
			aChip[3336]=aTile[72]; aChip[3337]=aTile[73]; aChip[3338]=aTile[74]; aChip[3339]=aTile[75];

			nChip[364]=nTile[76]; nChip[365]=nTile[77]; nChip[366]=nTile[78]; nChip[367]=nTile[79];
			hChip[268]=hTile[76]; hChip[269]=hTile[77]; hChip[270]=hTile[78]; hChip[271]=hTile[79];
			vChip[3436]=vTile[76]; vChip[3437]=vTile[77]; vChip[3438]=vTile[78]; vChip[3439]=vTile[79];
			aChip[3340]=aTile[76]; aChip[3341]=aTile[77]; aChip[3342]=aTile[78]; aChip[3343]=aTile[79];

			nChip[368]=nTile[80]; nChip[369]=nTile[81]; nChip[370]=nTile[82]; nChip[371]=nTile[83];
			hChip[272]=hTile[80]; hChip[273]=hTile[81]; hChip[274]=hTile[82]; hChip[275]=hTile[83];
			vChip[3440]=vTile[80]; vChip[3441]=vTile[81]; vChip[3442]=vTile[82]; vChip[3443]=vTile[83];
			aChip[3344]=aTile[80]; aChip[3345]=aTile[81]; aChip[3346]=aTile[82]; aChip[3347]=aTile[83];

			nChip[372]=nTile[84]; nChip[373]=nTile[85]; nChip[374]=nTile[86]; nChip[375]=nTile[87];
			hChip[276]=hTile[84]; hChip[277]=hTile[85]; hChip[278]=hTile[86]; hChip[279]=hTile[87];
			vChip[3444]=vTile[84]; vChip[3445]=vTile[85]; vChip[3446]=vTile[86]; vChip[3447]=vTile[87];
			aChip[3348]=aTile[84]; aChip[3349]=aTile[85]; aChip[3350]=aTile[86]; aChip[3351]=aTile[87];

			nChip[376]=nTile[88]; nChip[377]=nTile[89]; nChip[378]=nTile[90]; nChip[379]=nTile[91];
			hChip[280]=hTile[88]; hChip[281]=hTile[89]; hChip[282]=hTile[90]; hChip[283]=hTile[91];
			vChip[3448]=vTile[88]; vChip[3449]=vTile[89]; vChip[3450]=vTile[90]; vChip[3451]=vTile[91];
			aChip[3352]=aTile[88]; aChip[3353]=aTile[89]; aChip[3354]=aTile[90]; aChip[3355]=aTile[91];

			nChip[380]=nTile[92]; nChip[381]=nTile[93]; nChip[382]=nTile[94]; nChip[383]=nTile[95];
			hChip[284]=hTile[92]; hChip[285]=hTile[93]; hChip[286]=hTile[94]; hChip[287]=hTile[95];
			vChip[3452]=vTile[92]; vChip[3453]=vTile[93]; vChip[3454]=vTile[94]; vChip[3455]=vTile[95];
			aChip[3356]=aTile[92]; aChip[3357]=aTile[93]; aChip[3358]=aTile[94]; aChip[3359]=aTile[95];

			nChip[480]=nTile[96]; nChip[481]=nTile[97]; nChip[482]=nTile[98]; nChip[483]=nTile[99];
			hChip[384]=hTile[96]; hChip[385]=hTile[97]; hChip[386]=hTile[98]; hChip[387]=hTile[99];
			vChip[3552]=vTile[96]; vChip[3553]=vTile[97]; vChip[3554]=vTile[98]; vChip[3555]=vTile[99];
			aChip[3456]=aTile[96]; aChip[3457]=aTile[97]; aChip[3458]=aTile[98]; aChip[3459]=aTile[99];

			nChip[484]=nTile[100]; nChip[485]=nTile[101]; nChip[486]=nTile[102]; nChip[487]=nTile[103];
			hChip[388]=hTile[100]; hChip[389]=hTile[101]; hChip[390]=hTile[102]; hChip[391]=hTile[103];
			vChip[3556]=vTile[100]; vChip[3557]=vTile[101]; vChip[3558]=vTile[102]; vChip[3559]=vTile[103];
			aChip[3460]=aTile[100]; aChip[3461]=aTile[101]; aChip[3462]=aTile[102]; aChip[3463]=aTile[103];

			nChip[488]=nTile[104]; nChip[489]=nTile[105]; nChip[490]=nTile[106]; nChip[491]=nTile[107];
			hChip[392]=hTile[104]; hChip[393]=hTile[105]; hChip[394]=hTile[106]; hChip[395]=hTile[107];
			vChip[3560]=vTile[104]; vChip[3561]=vTile[105]; vChip[3562]=vTile[106]; vChip[3563]=vTile[107];
			aChip[3464]=aTile[104]; aChip[3465]=aTile[105]; aChip[3466]=aTile[106]; aChip[3467]=aTile[107];

			nChip[492]=nTile[108]; nChip[493]=nTile[109]; nChip[494]=nTile[110]; nChip[495]=nTile[111];
			hChip[396]=hTile[108]; hChip[397]=hTile[109]; hChip[398]=hTile[110]; hChip[399]=hTile[111];
			vChip[3564]=vTile[108]; vChip[3565]=vTile[109]; vChip[3566]=vTile[110]; vChip[3567]=vTile[111];
			aChip[3468]=aTile[108]; aChip[3469]=aTile[109]; aChip[3470]=aTile[110]; aChip[3471]=aTile[111];

			nChip[496]=nTile[112]; nChip[497]=nTile[113]; nChip[498]=nTile[114]; nChip[499]=nTile[115];
			hChip[400]=hTile[112]; hChip[401]=hTile[113]; hChip[402]=hTile[114]; hChip[403]=hTile[115];
			vChip[3568]=vTile[112]; vChip[3569]=vTile[113]; vChip[3570]=vTile[114]; vChip[3571]=vTile[115];
			aChip[3472]=aTile[112]; aChip[3473]=aTile[113]; aChip[3474]=aTile[114]; aChip[3475]=aTile[115];

			nChip[500]=nTile[116]; nChip[501]=nTile[117]; nChip[502]=nTile[118]; nChip[503]=nTile[119];
			hChip[404]=hTile[116]; hChip[405]=hTile[117]; hChip[406]=hTile[118]; hChip[407]=hTile[119];
			vChip[3572]=vTile[116]; vChip[3573]=vTile[117]; vChip[3574]=vTile[118]; vChip[3575]=vTile[119];
			aChip[3476]=aTile[116]; aChip[3477]=aTile[117]; aChip[3478]=aTile[118]; aChip[3479]=aTile[119];

			nChip[504]=nTile[120]; nChip[505]=nTile[121]; nChip[506]=nTile[122]; nChip[507]=nTile[123];
			hChip[408]=hTile[120]; hChip[409]=hTile[121]; hChip[410]=hTile[122]; hChip[411]=hTile[123];
			vChip[3576]=vTile[120]; vChip[3577]=vTile[121]; vChip[3578]=vTile[122]; vChip[3579]=vTile[123];
			aChip[3480]=aTile[120]; aChip[3481]=aTile[121]; aChip[3482]=aTile[122]; aChip[3483]=aTile[123];

			nChip[508]=nTile[124]; nChip[509]=nTile[125]; nChip[510]=nTile[126]; nChip[511]=nTile[127];
			hChip[412]=hTile[124]; hChip[413]=hTile[125]; hChip[414]=hTile[126]; hChip[415]=hTile[127];
			vChip[3580]=vTile[124]; vChip[3581]=vTile[125]; vChip[3582]=vTile[126]; vChip[3583]=vTile[127];
			aChip[3484]=aTile[124]; aChip[3485]=aTile[125]; aChip[3486]=aTile[126]; aChip[3487]=aTile[127];

			nChip[608]=nTile[128]; nChip[609]=nTile[129]; nChip[610]=nTile[130]; nChip[611]=nTile[131];
			hChip[512]=hTile[128]; hChip[513]=hTile[129]; hChip[514]=hTile[130]; hChip[515]=hTile[131];
			vChip[3680]=vTile[128]; vChip[3681]=vTile[129]; vChip[3682]=vTile[130]; vChip[3683]=vTile[131];
			aChip[3584]=aTile[128]; aChip[3585]=aTile[129]; aChip[3586]=aTile[130]; aChip[3587]=aTile[131];

			nChip[612]=nTile[132]; nChip[613]=nTile[133]; nChip[614]=nTile[134]; nChip[615]=nTile[135];
			hChip[516]=hTile[132]; hChip[517]=hTile[133]; hChip[518]=hTile[134]; hChip[519]=hTile[135];
			vChip[3684]=vTile[132]; vChip[3685]=vTile[133]; vChip[3686]=vTile[134]; vChip[3687]=vTile[135];
			aChip[3588]=aTile[132]; aChip[3589]=aTile[133]; aChip[3590]=aTile[134]; aChip[3591]=aTile[135];

			nChip[616]=nTile[136]; nChip[617]=nTile[137]; nChip[618]=nTile[138]; nChip[619]=nTile[139];
			hChip[520]=hTile[136]; hChip[521]=hTile[137]; hChip[522]=hTile[138]; hChip[523]=hTile[139];
			vChip[3688]=vTile[136]; vChip[3689]=vTile[137]; vChip[3690]=vTile[138]; vChip[3691]=vTile[139];
			aChip[3592]=aTile[136]; aChip[3593]=aTile[137]; aChip[3594]=aTile[138]; aChip[3595]=aTile[139];

			nChip[620]=nTile[140]; nChip[621]=nTile[141]; nChip[622]=nTile[142]; nChip[623]=nTile[143];
			hChip[524]=hTile[140]; hChip[525]=hTile[141]; hChip[526]=hTile[142]; hChip[527]=hTile[143];
			vChip[3692]=vTile[140]; vChip[3693]=vTile[141]; vChip[3694]=vTile[142]; vChip[3695]=vTile[143];
			aChip[3596]=aTile[140]; aChip[3597]=aTile[141]; aChip[3598]=aTile[142]; aChip[3599]=aTile[143];

			nChip[624]=nTile[144]; nChip[625]=nTile[145]; nChip[626]=nTile[146]; nChip[627]=nTile[147];
			hChip[528]=hTile[144]; hChip[529]=hTile[145]; hChip[530]=hTile[146]; hChip[531]=hTile[147];
			vChip[3696]=vTile[144]; vChip[3697]=vTile[145]; vChip[3698]=vTile[146]; vChip[3699]=vTile[147];
			aChip[3600]=aTile[144]; aChip[3601]=aTile[145]; aChip[3602]=aTile[146]; aChip[3603]=aTile[147];

			nChip[628]=nTile[148]; nChip[629]=nTile[149]; nChip[630]=nTile[150]; nChip[631]=nTile[151];
			hChip[532]=hTile[148]; hChip[533]=hTile[149]; hChip[534]=hTile[150]; hChip[535]=hTile[151];
			vChip[3700]=vTile[148]; vChip[3701]=vTile[149]; vChip[3702]=vTile[150]; vChip[3703]=vTile[151];
			aChip[3604]=aTile[148]; aChip[3605]=aTile[149]; aChip[3606]=aTile[150]; aChip[3607]=aTile[151];

			nChip[632]=nTile[152]; nChip[633]=nTile[153]; nChip[634]=nTile[154]; nChip[635]=nTile[155];
			hChip[536]=hTile[152]; hChip[537]=hTile[153]; hChip[538]=hTile[154]; hChip[539]=hTile[155];
			vChip[3704]=vTile[152]; vChip[3705]=vTile[153]; vChip[3706]=vTile[154]; vChip[3707]=vTile[155];
			aChip[3608]=aTile[152]; aChip[3609]=aTile[153]; aChip[3610]=aTile[154]; aChip[3611]=aTile[155];

			nChip[636]=nTile[156]; nChip[637]=nTile[157]; nChip[638]=nTile[158]; nChip[639]=nTile[159];
			hChip[540]=hTile[156]; hChip[541]=hTile[157]; hChip[542]=hTile[158]; hChip[543]=hTile[159];
			vChip[3708]=vTile[156]; vChip[3709]=vTile[157]; vChip[3710]=vTile[158]; vChip[3711]=vTile[159];
			aChip[3612]=aTile[156]; aChip[3613]=aTile[157]; aChip[3614]=aTile[158]; aChip[3615]=aTile[159];

			nChip[736]=nTile[160]; nChip[737]=nTile[161]; nChip[738]=nTile[162]; nChip[739]=nTile[163];
			hChip[640]=hTile[160]; hChip[641]=hTile[161]; hChip[642]=hTile[162]; hChip[643]=hTile[163];
			vChip[3808]=vTile[160]; vChip[3809]=vTile[161]; vChip[3810]=vTile[162]; vChip[3811]=vTile[163];
			aChip[3712]=aTile[160]; aChip[3713]=aTile[161]; aChip[3714]=aTile[162]; aChip[3715]=aTile[163];

			nChip[740]=nTile[164]; nChip[741]=nTile[165]; nChip[742]=nTile[166]; nChip[743]=nTile[167];
			hChip[644]=hTile[164]; hChip[645]=hTile[165]; hChip[646]=hTile[166]; hChip[647]=hTile[167];
			vChip[3812]=vTile[164]; vChip[3813]=vTile[165]; vChip[3814]=vTile[166]; vChip[3815]=vTile[167];
			aChip[3716]=aTile[164]; aChip[3717]=aTile[165]; aChip[3718]=aTile[166]; aChip[3719]=aTile[167];

			nChip[744]=nTile[168]; nChip[745]=nTile[169]; nChip[746]=nTile[170]; nChip[747]=nTile[171];
			hChip[648]=hTile[168]; hChip[649]=hTile[169]; hChip[650]=hTile[170]; hChip[651]=hTile[171];
			vChip[3816]=vTile[168]; vChip[3817]=vTile[169]; vChip[3818]=vTile[170]; vChip[3819]=vTile[171];
			aChip[3720]=aTile[168]; aChip[3721]=aTile[169]; aChip[3722]=aTile[170]; aChip[3723]=aTile[171];

			nChip[748]=nTile[172]; nChip[749]=nTile[173]; nChip[750]=nTile[174]; nChip[751]=nTile[175];
			hChip[652]=hTile[172]; hChip[653]=hTile[173]; hChip[654]=hTile[174]; hChip[655]=hTile[175];
			vChip[3820]=vTile[172]; vChip[3821]=vTile[173]; vChip[3822]=vTile[174]; vChip[3823]=vTile[175];
			aChip[3724]=aTile[172]; aChip[3725]=aTile[173]; aChip[3726]=aTile[174]; aChip[3727]=aTile[175];

			nChip[752]=nTile[176]; nChip[753]=nTile[177]; nChip[754]=nTile[178]; nChip[755]=nTile[179];
			hChip[656]=hTile[176]; hChip[657]=hTile[177]; hChip[658]=hTile[178]; hChip[659]=hTile[179];
			vChip[3824]=vTile[176]; vChip[3825]=vTile[177]; vChip[3826]=vTile[178]; vChip[3827]=vTile[179];
			aChip[3728]=aTile[176]; aChip[3729]=aTile[177]; aChip[3730]=aTile[178]; aChip[3731]=aTile[179];

			nChip[756]=nTile[180]; nChip[757]=nTile[181]; nChip[758]=nTile[182]; nChip[759]=nTile[183];
			hChip[660]=hTile[180]; hChip[661]=hTile[181]; hChip[662]=hTile[182]; hChip[663]=hTile[183];
			vChip[3828]=vTile[180]; vChip[3829]=vTile[181]; vChip[3830]=vTile[182]; vChip[3831]=vTile[183];
			aChip[3732]=aTile[180]; aChip[3733]=aTile[181]; aChip[3734]=aTile[182]; aChip[3735]=aTile[183];

			nChip[760]=nTile[184]; nChip[761]=nTile[185]; nChip[762]=nTile[186]; nChip[763]=nTile[187];
			hChip[664]=hTile[184]; hChip[665]=hTile[185]; hChip[666]=hTile[186]; hChip[667]=hTile[187];
			vChip[3832]=vTile[184]; vChip[3833]=vTile[185]; vChip[3834]=vTile[186]; vChip[3835]=vTile[187];
			aChip[3736]=aTile[184]; aChip[3737]=aTile[185]; aChip[3738]=aTile[186]; aChip[3739]=aTile[187];

			nChip[764]=nTile[188]; nChip[765]=nTile[189]; nChip[766]=nTile[190]; nChip[767]=nTile[191];
			hChip[668]=hTile[188]; hChip[669]=hTile[189]; hChip[670]=hTile[190]; hChip[671]=hTile[191];
			vChip[3836]=vTile[188]; vChip[3837]=vTile[189]; vChip[3838]=vTile[190]; vChip[3839]=vTile[191];
			aChip[3740]=aTile[188]; aChip[3741]=aTile[189]; aChip[3742]=aTile[190]; aChip[3743]=aTile[191];

			nChip[864]=nTile[192]; nChip[865]=nTile[193]; nChip[866]=nTile[194]; nChip[867]=nTile[195];
			hChip[768]=hTile[192]; hChip[769]=hTile[193]; hChip[770]=hTile[194]; hChip[771]=hTile[195];
			vChip[3936]=vTile[192]; vChip[3937]=vTile[193]; vChip[3938]=vTile[194]; vChip[3939]=vTile[195];
			aChip[3840]=aTile[192]; aChip[3841]=aTile[193]; aChip[3842]=aTile[194]; aChip[3843]=aTile[195];

			nChip[868]=nTile[196]; nChip[869]=nTile[197]; nChip[870]=nTile[198]; nChip[871]=nTile[199];
			hChip[772]=hTile[196]; hChip[773]=hTile[197]; hChip[774]=hTile[198]; hChip[775]=hTile[199];
			vChip[3940]=vTile[196]; vChip[3941]=vTile[197]; vChip[3942]=vTile[198]; vChip[3943]=vTile[199];
			aChip[3844]=aTile[196]; aChip[3845]=aTile[197]; aChip[3846]=aTile[198]; aChip[3847]=aTile[199];

			nChip[872]=nTile[200]; nChip[873]=nTile[201]; nChip[874]=nTile[202]; nChip[875]=nTile[203];
			hChip[776]=hTile[200]; hChip[777]=hTile[201]; hChip[778]=hTile[202]; hChip[779]=hTile[203];
			vChip[3944]=vTile[200]; vChip[3945]=vTile[201]; vChip[3946]=vTile[202]; vChip[3947]=vTile[203];
			aChip[3848]=aTile[200]; aChip[3849]=aTile[201]; aChip[3850]=aTile[202]; aChip[3851]=aTile[203];

			nChip[876]=nTile[204]; nChip[877]=nTile[205]; nChip[878]=nTile[206]; nChip[879]=nTile[207];
			hChip[780]=hTile[204]; hChip[781]=hTile[205]; hChip[782]=hTile[206]; hChip[783]=hTile[207];
			vChip[3948]=vTile[204]; vChip[3949]=vTile[205]; vChip[3950]=vTile[206]; vChip[3951]=vTile[207];
			aChip[3852]=aTile[204]; aChip[3853]=aTile[205]; aChip[3854]=aTile[206]; aChip[3855]=aTile[207];

			nChip[880]=nTile[208]; nChip[881]=nTile[209]; nChip[882]=nTile[210]; nChip[883]=nTile[211];
			hChip[784]=hTile[208]; hChip[785]=hTile[209]; hChip[786]=hTile[210]; hChip[787]=hTile[211];
			vChip[3952]=vTile[208]; vChip[3953]=vTile[209]; vChip[3954]=vTile[210]; vChip[3955]=vTile[211];
			aChip[3856]=aTile[208]; aChip[3857]=aTile[209]; aChip[3858]=aTile[210]; aChip[3859]=aTile[211];

			nChip[884]=nTile[212]; nChip[885]=nTile[213]; nChip[886]=nTile[214]; nChip[887]=nTile[215];
			hChip[788]=hTile[212]; hChip[789]=hTile[213]; hChip[790]=hTile[214]; hChip[791]=hTile[215];
			vChip[3956]=vTile[212]; vChip[3957]=vTile[213]; vChip[3958]=vTile[214]; vChip[3959]=vTile[215];
			aChip[3860]=aTile[212]; aChip[3861]=aTile[213]; aChip[3862]=aTile[214]; aChip[3863]=aTile[215];

			nChip[888]=nTile[216]; nChip[889]=nTile[217]; nChip[890]=nTile[218]; nChip[891]=nTile[219];
			hChip[792]=hTile[216]; hChip[793]=hTile[217]; hChip[794]=hTile[218]; hChip[795]=hTile[219];
			vChip[3960]=vTile[216]; vChip[3961]=vTile[217]; vChip[3962]=vTile[218]; vChip[3963]=vTile[219];
			aChip[3864]=aTile[216]; aChip[3865]=aTile[217]; aChip[3866]=aTile[218]; aChip[3867]=aTile[219];

			nChip[892]=nTile[220]; nChip[893]=nTile[221]; nChip[894]=nTile[222]; nChip[895]=nTile[223];
			hChip[796]=hTile[220]; hChip[797]=hTile[221]; hChip[798]=hTile[222]; hChip[799]=hTile[223];
			vChip[3964]=vTile[220]; vChip[3965]=vTile[221]; vChip[3966]=vTile[222]; vChip[3967]=vTile[223];
			aChip[3868]=aTile[220]; aChip[3869]=aTile[221]; aChip[3870]=aTile[222]; aChip[3871]=aTile[223];

			nChip[992]=nTile[224]; nChip[993]=nTile[225]; nChip[994]=nTile[226]; nChip[995]=nTile[227];
			hChip[896]=hTile[224]; hChip[897]=hTile[225]; hChip[898]=hTile[226]; hChip[899]=hTile[227];
			vChip[4064]=vTile[224]; vChip[4065]=vTile[225]; vChip[4066]=vTile[226]; vChip[4067]=vTile[227];
			aChip[3968]=aTile[224]; aChip[3969]=aTile[225]; aChip[3970]=aTile[226]; aChip[3971]=aTile[227];

			nChip[996]=nTile[228]; nChip[997]=nTile[229]; nChip[998]=nTile[230]; nChip[999]=nTile[231];
			hChip[900]=hTile[228]; hChip[901]=hTile[229]; hChip[902]=hTile[230]; hChip[903]=hTile[231];
			vChip[4068]=vTile[228]; vChip[4069]=vTile[229]; vChip[4070]=vTile[230]; vChip[4071]=vTile[231];
			aChip[3972]=aTile[228]; aChip[3973]=aTile[229]; aChip[3974]=aTile[230]; aChip[3975]=aTile[231];

			nChip[1000]=nTile[232]; nChip[1001]=nTile[233]; nChip[1002]=nTile[234]; nChip[1003]=nTile[235];
			hChip[904]=hTile[232]; hChip[905]=hTile[233]; hChip[906]=hTile[234]; hChip[907]=hTile[235];
			vChip[4072]=vTile[232]; vChip[4073]=vTile[233]; vChip[4074]=vTile[234]; vChip[4075]=vTile[235];
			aChip[3976]=aTile[232]; aChip[3977]=aTile[233]; aChip[3978]=aTile[234]; aChip[3979]=aTile[235];

			nChip[1004]=nTile[236]; nChip[1005]=nTile[237]; nChip[1006]=nTile[238]; nChip[1007]=nTile[239];
			hChip[908]=hTile[236]; hChip[909]=hTile[237]; hChip[910]=hTile[238]; hChip[911]=hTile[239];
			vChip[4076]=vTile[236]; vChip[4077]=vTile[237]; vChip[4078]=vTile[238]; vChip[4079]=vTile[239];
			aChip[3980]=aTile[236]; aChip[3981]=aTile[237]; aChip[3982]=aTile[238]; aChip[3983]=aTile[239];

			nChip[1008]=nTile[240]; nChip[1009]=nTile[241]; nChip[1010]=nTile[242]; nChip[1011]=nTile[243];
			hChip[912]=hTile[240]; hChip[913]=hTile[241]; hChip[914]=hTile[242]; hChip[915]=hTile[243];
			vChip[4080]=vTile[240]; vChip[4081]=vTile[241]; vChip[4082]=vTile[242]; vChip[4083]=vTile[243];
			aChip[3984]=aTile[240]; aChip[3985]=aTile[241]; aChip[3986]=aTile[242]; aChip[3987]=aTile[243];

			nChip[1012]=nTile[244]; nChip[1013]=nTile[245]; nChip[1014]=nTile[246]; nChip[1015]=nTile[247];
			hChip[916]=hTile[244]; hChip[917]=hTile[245]; hChip[918]=hTile[246]; hChip[919]=hTile[247];
			vChip[4084]=vTile[244]; vChip[4085]=vTile[245]; vChip[4086]=vTile[246]; vChip[4087]=vTile[247];
			aChip[3988]=aTile[244]; aChip[3989]=aTile[245]; aChip[3990]=aTile[246]; aChip[3991]=aTile[247];

			nChip[1016]=nTile[248]; nChip[1017]=nTile[249]; nChip[1018]=nTile[250]; nChip[1019]=nTile[251];
			hChip[920]=hTile[248]; hChip[921]=hTile[249]; hChip[922]=hTile[250]; hChip[923]=hTile[251];
			vChip[4088]=vTile[248]; vChip[4089]=vTile[249]; vChip[4090]=vTile[250]; vChip[4091]=vTile[251];
			aChip[3992]=aTile[248]; aChip[3993]=aTile[249]; aChip[3994]=aTile[250]; aChip[3995]=aTile[251];

			nChip[1020]=nTile[252]; nChip[1021]=nTile[253]; nChip[1022]=nTile[254]; nChip[1023]=nTile[255];
			hChip[924]=hTile[252]; hChip[925]=hTile[253]; hChip[926]=hTile[254]; hChip[927]=hTile[255];
			vChip[4092]=vTile[252]; vChip[4093]=vTile[253]; vChip[4094]=vTile[254]; vChip[4095]=vTile[255];
			aChip[3996]=aTile[252]; aChip[3997]=aTile[253]; aChip[3998]=aTile[254]; aChip[3999]=aTile[255];

			A = d[cOfst+8]; B = d[cOfst+9];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[1024]=nTile[0]; nChip[1025]=nTile[1]; nChip[1026]=nTile[2]; nChip[1027]=nTile[3];
			hChip[1120]=hTile[0]; hChip[1121]=hTile[1]; hChip[1122]=hTile[2]; hChip[1123]=hTile[3];
			vChip[2048]=vTile[0]; vChip[2049]=vTile[1]; vChip[2050]=vTile[2]; vChip[2051]=vTile[3];
			aChip[2144]=aTile[0]; aChip[2145]=aTile[1]; aChip[2146]=aTile[2]; aChip[2147]=aTile[3];

			nChip[1028]=nTile[4]; nChip[1029]=nTile[5]; nChip[1030]=nTile[6]; nChip[1031]=nTile[7];
			hChip[1124]=hTile[4]; hChip[1125]=hTile[5]; hChip[1126]=hTile[6]; hChip[1127]=hTile[7];
			vChip[2052]=vTile[4]; vChip[2053]=vTile[5]; vChip[2054]=vTile[6]; vChip[2055]=vTile[7];
			aChip[2148]=aTile[4]; aChip[2149]=aTile[5]; aChip[2150]=aTile[6]; aChip[2151]=aTile[7];

			nChip[1032]=nTile[8]; nChip[1033]=nTile[9]; nChip[1034]=nTile[10]; nChip[1035]=nTile[11];
			hChip[1128]=hTile[8]; hChip[1129]=hTile[9]; hChip[1130]=hTile[10]; hChip[1131]=hTile[11];
			vChip[2056]=vTile[8]; vChip[2057]=vTile[9]; vChip[2058]=vTile[10]; vChip[2059]=vTile[11];
			aChip[2152]=aTile[8]; aChip[2153]=aTile[9]; aChip[2154]=aTile[10]; aChip[2155]=aTile[11];

			nChip[1036]=nTile[12]; nChip[1037]=nTile[13]; nChip[1038]=nTile[14]; nChip[1039]=nTile[15];
			hChip[1132]=hTile[12]; hChip[1133]=hTile[13]; hChip[1134]=hTile[14]; hChip[1135]=hTile[15];
			vChip[2060]=vTile[12]; vChip[2061]=vTile[13]; vChip[2062]=vTile[14]; vChip[2063]=vTile[15];
			aChip[2156]=aTile[12]; aChip[2157]=aTile[13]; aChip[2158]=aTile[14]; aChip[2159]=aTile[15];

			nChip[1040]=nTile[16]; nChip[1041]=nTile[17]; nChip[1042]=nTile[18]; nChip[1043]=nTile[19];
			hChip[1136]=hTile[16]; hChip[1137]=hTile[17]; hChip[1138]=hTile[18]; hChip[1139]=hTile[19];
			vChip[2064]=vTile[16]; vChip[2065]=vTile[17]; vChip[2066]=vTile[18]; vChip[2067]=vTile[19];
			aChip[2160]=aTile[16]; aChip[2161]=aTile[17]; aChip[2162]=aTile[18]; aChip[2163]=aTile[19];

			nChip[1044]=nTile[20]; nChip[1045]=nTile[21]; nChip[1046]=nTile[22]; nChip[1047]=nTile[23];
			hChip[1140]=hTile[20]; hChip[1141]=hTile[21]; hChip[1142]=hTile[22]; hChip[1143]=hTile[23];
			vChip[2068]=vTile[20]; vChip[2069]=vTile[21]; vChip[2070]=vTile[22]; vChip[2071]=vTile[23];
			aChip[2164]=aTile[20]; aChip[2165]=aTile[21]; aChip[2166]=aTile[22]; aChip[2167]=aTile[23];

			nChip[1048]=nTile[24]; nChip[1049]=nTile[25]; nChip[1050]=nTile[26]; nChip[1051]=nTile[27];
			hChip[1144]=hTile[24]; hChip[1145]=hTile[25]; hChip[1146]=hTile[26]; hChip[1147]=hTile[27];
			vChip[2072]=vTile[24]; vChip[2073]=vTile[25]; vChip[2074]=vTile[26]; vChip[2075]=vTile[27];
			aChip[2168]=aTile[24]; aChip[2169]=aTile[25]; aChip[2170]=aTile[26]; aChip[2171]=aTile[27];

			nChip[1052]=nTile[28]; nChip[1053]=nTile[29]; nChip[1054]=nTile[30]; nChip[1055]=nTile[31];
			hChip[1148]=hTile[28]; hChip[1149]=hTile[29]; hChip[1150]=hTile[30]; hChip[1151]=hTile[31];
			vChip[2076]=vTile[28]; vChip[2077]=vTile[29]; vChip[2078]=vTile[30]; vChip[2079]=vTile[31];
			aChip[2172]=aTile[28]; aChip[2173]=aTile[29]; aChip[2174]=aTile[30]; aChip[2175]=aTile[31];

			nChip[1152]=nTile[32]; nChip[1153]=nTile[33]; nChip[1154]=nTile[34]; nChip[1155]=nTile[35];
			hChip[1248]=hTile[32]; hChip[1249]=hTile[33]; hChip[1250]=hTile[34]; hChip[1251]=hTile[35];
			vChip[2176]=vTile[32]; vChip[2177]=vTile[33]; vChip[2178]=vTile[34]; vChip[2179]=vTile[35];
			aChip[2272]=aTile[32]; aChip[2273]=aTile[33]; aChip[2274]=aTile[34]; aChip[2275]=aTile[35];

			nChip[1156]=nTile[36]; nChip[1157]=nTile[37]; nChip[1158]=nTile[38]; nChip[1159]=nTile[39];
			hChip[1252]=hTile[36]; hChip[1253]=hTile[37]; hChip[1254]=hTile[38]; hChip[1255]=hTile[39];
			vChip[2180]=vTile[36]; vChip[2181]=vTile[37]; vChip[2182]=vTile[38]; vChip[2183]=vTile[39];
			aChip[2276]=aTile[36]; aChip[2277]=aTile[37]; aChip[2278]=aTile[38]; aChip[2279]=aTile[39];

			nChip[1160]=nTile[40]; nChip[1161]=nTile[41]; nChip[1162]=nTile[42]; nChip[1163]=nTile[43];
			hChip[1256]=hTile[40]; hChip[1257]=hTile[41]; hChip[1258]=hTile[42]; hChip[1259]=hTile[43];
			vChip[2184]=vTile[40]; vChip[2185]=vTile[41]; vChip[2186]=vTile[42]; vChip[2187]=vTile[43];
			aChip[2280]=aTile[40]; aChip[2281]=aTile[41]; aChip[2282]=aTile[42]; aChip[2283]=aTile[43];

			nChip[1164]=nTile[44]; nChip[1165]=nTile[45]; nChip[1166]=nTile[46]; nChip[1167]=nTile[47];
			hChip[1260]=hTile[44]; hChip[1261]=hTile[45]; hChip[1262]=hTile[46]; hChip[1263]=hTile[47];
			vChip[2188]=vTile[44]; vChip[2189]=vTile[45]; vChip[2190]=vTile[46]; vChip[2191]=vTile[47];
			aChip[2284]=aTile[44]; aChip[2285]=aTile[45]; aChip[2286]=aTile[46]; aChip[2287]=aTile[47];

			nChip[1168]=nTile[48]; nChip[1169]=nTile[49]; nChip[1170]=nTile[50]; nChip[1171]=nTile[51];
			hChip[1264]=hTile[48]; hChip[1265]=hTile[49]; hChip[1266]=hTile[50]; hChip[1267]=hTile[51];
			vChip[2192]=vTile[48]; vChip[2193]=vTile[49]; vChip[2194]=vTile[50]; vChip[2195]=vTile[51];
			aChip[2288]=aTile[48]; aChip[2289]=aTile[49]; aChip[2290]=aTile[50]; aChip[2291]=aTile[51];

			nChip[1172]=nTile[52]; nChip[1173]=nTile[53]; nChip[1174]=nTile[54]; nChip[1175]=nTile[55];
			hChip[1268]=hTile[52]; hChip[1269]=hTile[53]; hChip[1270]=hTile[54]; hChip[1271]=hTile[55];
			vChip[2196]=vTile[52]; vChip[2197]=vTile[53]; vChip[2198]=vTile[54]; vChip[2199]=vTile[55];
			aChip[2292]=aTile[52]; aChip[2293]=aTile[53]; aChip[2294]=aTile[54]; aChip[2295]=aTile[55];

			nChip[1176]=nTile[56]; nChip[1177]=nTile[57]; nChip[1178]=nTile[58]; nChip[1179]=nTile[59];
			hChip[1272]=hTile[56]; hChip[1273]=hTile[57]; hChip[1274]=hTile[58]; hChip[1275]=hTile[59];
			vChip[2200]=vTile[56]; vChip[2201]=vTile[57]; vChip[2202]=vTile[58]; vChip[2203]=vTile[59];
			aChip[2296]=aTile[56]; aChip[2297]=aTile[57]; aChip[2298]=aTile[58]; aChip[2299]=aTile[59];

			nChip[1180]=nTile[60]; nChip[1181]=nTile[61]; nChip[1182]=nTile[62]; nChip[1183]=nTile[63];
			hChip[1276]=hTile[60]; hChip[1277]=hTile[61]; hChip[1278]=hTile[62]; hChip[1279]=hTile[63];
			vChip[2204]=vTile[60]; vChip[2205]=vTile[61]; vChip[2206]=vTile[62]; vChip[2207]=vTile[63];
			aChip[2300]=aTile[60]; aChip[2301]=aTile[61]; aChip[2302]=aTile[62]; aChip[2303]=aTile[63];

			nChip[1280]=nTile[64]; nChip[1281]=nTile[65]; nChip[1282]=nTile[66]; nChip[1283]=nTile[67];
			hChip[1376]=hTile[64]; hChip[1377]=hTile[65]; hChip[1378]=hTile[66]; hChip[1379]=hTile[67];
			vChip[2304]=vTile[64]; vChip[2305]=vTile[65]; vChip[2306]=vTile[66]; vChip[2307]=vTile[67];
			aChip[2400]=aTile[64]; aChip[2401]=aTile[65]; aChip[2402]=aTile[66]; aChip[2403]=aTile[67];

			nChip[1284]=nTile[68]; nChip[1285]=nTile[69]; nChip[1286]=nTile[70]; nChip[1287]=nTile[71];
			hChip[1380]=hTile[68]; hChip[1381]=hTile[69]; hChip[1382]=hTile[70]; hChip[1383]=hTile[71];
			vChip[2308]=vTile[68]; vChip[2309]=vTile[69]; vChip[2310]=vTile[70]; vChip[2311]=vTile[71];
			aChip[2404]=aTile[68]; aChip[2405]=aTile[69]; aChip[2406]=aTile[70]; aChip[2407]=aTile[71];

			nChip[1288]=nTile[72]; nChip[1289]=nTile[73]; nChip[1290]=nTile[74]; nChip[1291]=nTile[75];
			hChip[1384]=hTile[72]; hChip[1385]=hTile[73]; hChip[1386]=hTile[74]; hChip[1387]=hTile[75];
			vChip[2312]=vTile[72]; vChip[2313]=vTile[73]; vChip[2314]=vTile[74]; vChip[2315]=vTile[75];
			aChip[2408]=aTile[72]; aChip[2409]=aTile[73]; aChip[2410]=aTile[74]; aChip[2411]=aTile[75];

			nChip[1292]=nTile[76]; nChip[1293]=nTile[77]; nChip[1294]=nTile[78]; nChip[1295]=nTile[79];
			hChip[1388]=hTile[76]; hChip[1389]=hTile[77]; hChip[1390]=hTile[78]; hChip[1391]=hTile[79];
			vChip[2316]=vTile[76]; vChip[2317]=vTile[77]; vChip[2318]=vTile[78]; vChip[2319]=vTile[79];
			aChip[2412]=aTile[76]; aChip[2413]=aTile[77]; aChip[2414]=aTile[78]; aChip[2415]=aTile[79];

			nChip[1296]=nTile[80]; nChip[1297]=nTile[81]; nChip[1298]=nTile[82]; nChip[1299]=nTile[83];
			hChip[1392]=hTile[80]; hChip[1393]=hTile[81]; hChip[1394]=hTile[82]; hChip[1395]=hTile[83];
			vChip[2320]=vTile[80]; vChip[2321]=vTile[81]; vChip[2322]=vTile[82]; vChip[2323]=vTile[83];
			aChip[2416]=aTile[80]; aChip[2417]=aTile[81]; aChip[2418]=aTile[82]; aChip[2419]=aTile[83];

			nChip[1300]=nTile[84]; nChip[1301]=nTile[85]; nChip[1302]=nTile[86]; nChip[1303]=nTile[87];
			hChip[1396]=hTile[84]; hChip[1397]=hTile[85]; hChip[1398]=hTile[86]; hChip[1399]=hTile[87];
			vChip[2324]=vTile[84]; vChip[2325]=vTile[85]; vChip[2326]=vTile[86]; vChip[2327]=vTile[87];
			aChip[2420]=aTile[84]; aChip[2421]=aTile[85]; aChip[2422]=aTile[86]; aChip[2423]=aTile[87];

			nChip[1304]=nTile[88]; nChip[1305]=nTile[89]; nChip[1306]=nTile[90]; nChip[1307]=nTile[91];
			hChip[1400]=hTile[88]; hChip[1401]=hTile[89]; hChip[1402]=hTile[90]; hChip[1403]=hTile[91];
			vChip[2328]=vTile[88]; vChip[2329]=vTile[89]; vChip[2330]=vTile[90]; vChip[2331]=vTile[91];
			aChip[2424]=aTile[88]; aChip[2425]=aTile[89]; aChip[2426]=aTile[90]; aChip[2427]=aTile[91];

			nChip[1308]=nTile[92]; nChip[1309]=nTile[93]; nChip[1310]=nTile[94]; nChip[1311]=nTile[95];
			hChip[1404]=hTile[92]; hChip[1405]=hTile[93]; hChip[1406]=hTile[94]; hChip[1407]=hTile[95];
			vChip[2332]=vTile[92]; vChip[2333]=vTile[93]; vChip[2334]=vTile[94]; vChip[2335]=vTile[95];
			aChip[2428]=aTile[92]; aChip[2429]=aTile[93]; aChip[2430]=aTile[94]; aChip[2431]=aTile[95];

			nChip[1408]=nTile[96]; nChip[1409]=nTile[97]; nChip[1410]=nTile[98]; nChip[1411]=nTile[99];
			hChip[1504]=hTile[96]; hChip[1505]=hTile[97]; hChip[1506]=hTile[98]; hChip[1507]=hTile[99];
			vChip[2432]=vTile[96]; vChip[2433]=vTile[97]; vChip[2434]=vTile[98]; vChip[2435]=vTile[99];
			aChip[2528]=aTile[96]; aChip[2529]=aTile[97]; aChip[2530]=aTile[98]; aChip[2531]=aTile[99];

			nChip[1412]=nTile[100]; nChip[1413]=nTile[101]; nChip[1414]=nTile[102]; nChip[1415]=nTile[103];
			hChip[1508]=hTile[100]; hChip[1509]=hTile[101]; hChip[1510]=hTile[102]; hChip[1511]=hTile[103];
			vChip[2436]=vTile[100]; vChip[2437]=vTile[101]; vChip[2438]=vTile[102]; vChip[2439]=vTile[103];
			aChip[2532]=aTile[100]; aChip[2533]=aTile[101]; aChip[2534]=aTile[102]; aChip[2535]=aTile[103];

			nChip[1416]=nTile[104]; nChip[1417]=nTile[105]; nChip[1418]=nTile[106]; nChip[1419]=nTile[107];
			hChip[1512]=hTile[104]; hChip[1513]=hTile[105]; hChip[1514]=hTile[106]; hChip[1515]=hTile[107];
			vChip[2440]=vTile[104]; vChip[2441]=vTile[105]; vChip[2442]=vTile[106]; vChip[2443]=vTile[107];
			aChip[2536]=aTile[104]; aChip[2537]=aTile[105]; aChip[2538]=aTile[106]; aChip[2539]=aTile[107];

			nChip[1420]=nTile[108]; nChip[1421]=nTile[109]; nChip[1422]=nTile[110]; nChip[1423]=nTile[111];
			hChip[1516]=hTile[108]; hChip[1517]=hTile[109]; hChip[1518]=hTile[110]; hChip[1519]=hTile[111];
			vChip[2444]=vTile[108]; vChip[2445]=vTile[109]; vChip[2446]=vTile[110]; vChip[2447]=vTile[111];
			aChip[2540]=aTile[108]; aChip[2541]=aTile[109]; aChip[2542]=aTile[110]; aChip[2543]=aTile[111];

			nChip[1424]=nTile[112]; nChip[1425]=nTile[113]; nChip[1426]=nTile[114]; nChip[1427]=nTile[115];
			hChip[1520]=hTile[112]; hChip[1521]=hTile[113]; hChip[1522]=hTile[114]; hChip[1523]=hTile[115];
			vChip[2448]=vTile[112]; vChip[2449]=vTile[113]; vChip[2450]=vTile[114]; vChip[2451]=vTile[115];
			aChip[2544]=aTile[112]; aChip[2545]=aTile[113]; aChip[2546]=aTile[114]; aChip[2547]=aTile[115];

			nChip[1428]=nTile[116]; nChip[1429]=nTile[117]; nChip[1430]=nTile[118]; nChip[1431]=nTile[119];
			hChip[1524]=hTile[116]; hChip[1525]=hTile[117]; hChip[1526]=hTile[118]; hChip[1527]=hTile[119];
			vChip[2452]=vTile[116]; vChip[2453]=vTile[117]; vChip[2454]=vTile[118]; vChip[2455]=vTile[119];
			aChip[2548]=aTile[116]; aChip[2549]=aTile[117]; aChip[2550]=aTile[118]; aChip[2551]=aTile[119];

			nChip[1432]=nTile[120]; nChip[1433]=nTile[121]; nChip[1434]=nTile[122]; nChip[1435]=nTile[123];
			hChip[1528]=hTile[120]; hChip[1529]=hTile[121]; hChip[1530]=hTile[122]; hChip[1531]=hTile[123];
			vChip[2456]=vTile[120]; vChip[2457]=vTile[121]; vChip[2458]=vTile[122]; vChip[2459]=vTile[123];
			aChip[2552]=aTile[120]; aChip[2553]=aTile[121]; aChip[2554]=aTile[122]; aChip[2555]=aTile[123];

			nChip[1436]=nTile[124]; nChip[1437]=nTile[125]; nChip[1438]=nTile[126]; nChip[1439]=nTile[127];
			hChip[1532]=hTile[124]; hChip[1533]=hTile[125]; hChip[1534]=hTile[126]; hChip[1535]=hTile[127];
			vChip[2460]=vTile[124]; vChip[2461]=vTile[125]; vChip[2462]=vTile[126]; vChip[2463]=vTile[127];
			aChip[2556]=aTile[124]; aChip[2557]=aTile[125]; aChip[2558]=aTile[126]; aChip[2559]=aTile[127];

			nChip[1536]=nTile[128]; nChip[1537]=nTile[129]; nChip[1538]=nTile[130]; nChip[1539]=nTile[131];
			hChip[1632]=hTile[128]; hChip[1633]=hTile[129]; hChip[1634]=hTile[130]; hChip[1635]=hTile[131];
			vChip[2560]=vTile[128]; vChip[2561]=vTile[129]; vChip[2562]=vTile[130]; vChip[2563]=vTile[131];
			aChip[2656]=aTile[128]; aChip[2657]=aTile[129]; aChip[2658]=aTile[130]; aChip[2659]=aTile[131];

			nChip[1540]=nTile[132]; nChip[1541]=nTile[133]; nChip[1542]=nTile[134]; nChip[1543]=nTile[135];
			hChip[1636]=hTile[132]; hChip[1637]=hTile[133]; hChip[1638]=hTile[134]; hChip[1639]=hTile[135];
			vChip[2564]=vTile[132]; vChip[2565]=vTile[133]; vChip[2566]=vTile[134]; vChip[2567]=vTile[135];
			aChip[2660]=aTile[132]; aChip[2661]=aTile[133]; aChip[2662]=aTile[134]; aChip[2663]=aTile[135];

			nChip[1544]=nTile[136]; nChip[1545]=nTile[137]; nChip[1546]=nTile[138]; nChip[1547]=nTile[139];
			hChip[1640]=hTile[136]; hChip[1641]=hTile[137]; hChip[1642]=hTile[138]; hChip[1643]=hTile[139];
			vChip[2568]=vTile[136]; vChip[2569]=vTile[137]; vChip[2570]=vTile[138]; vChip[2571]=vTile[139];
			aChip[2664]=aTile[136]; aChip[2665]=aTile[137]; aChip[2666]=aTile[138]; aChip[2667]=aTile[139];

			nChip[1548]=nTile[140]; nChip[1549]=nTile[141]; nChip[1550]=nTile[142]; nChip[1551]=nTile[143];
			hChip[1644]=hTile[140]; hChip[1645]=hTile[141]; hChip[1646]=hTile[142]; hChip[1647]=hTile[143];
			vChip[2572]=vTile[140]; vChip[2573]=vTile[141]; vChip[2574]=vTile[142]; vChip[2575]=vTile[143];
			aChip[2668]=aTile[140]; aChip[2669]=aTile[141]; aChip[2670]=aTile[142]; aChip[2671]=aTile[143];

			nChip[1552]=nTile[144]; nChip[1553]=nTile[145]; nChip[1554]=nTile[146]; nChip[1555]=nTile[147];
			hChip[1648]=hTile[144]; hChip[1649]=hTile[145]; hChip[1650]=hTile[146]; hChip[1651]=hTile[147];
			vChip[2576]=vTile[144]; vChip[2577]=vTile[145]; vChip[2578]=vTile[146]; vChip[2579]=vTile[147];
			aChip[2672]=aTile[144]; aChip[2673]=aTile[145]; aChip[2674]=aTile[146]; aChip[2675]=aTile[147];

			nChip[1556]=nTile[148]; nChip[1557]=nTile[149]; nChip[1558]=nTile[150]; nChip[1559]=nTile[151];
			hChip[1652]=hTile[148]; hChip[1653]=hTile[149]; hChip[1654]=hTile[150]; hChip[1655]=hTile[151];
			vChip[2580]=vTile[148]; vChip[2581]=vTile[149]; vChip[2582]=vTile[150]; vChip[2583]=vTile[151];
			aChip[2676]=aTile[148]; aChip[2677]=aTile[149]; aChip[2678]=aTile[150]; aChip[2679]=aTile[151];

			nChip[1560]=nTile[152]; nChip[1561]=nTile[153]; nChip[1562]=nTile[154]; nChip[1563]=nTile[155];
			hChip[1656]=hTile[152]; hChip[1657]=hTile[153]; hChip[1658]=hTile[154]; hChip[1659]=hTile[155];
			vChip[2584]=vTile[152]; vChip[2585]=vTile[153]; vChip[2586]=vTile[154]; vChip[2587]=vTile[155];
			aChip[2680]=aTile[152]; aChip[2681]=aTile[153]; aChip[2682]=aTile[154]; aChip[2683]=aTile[155];

			nChip[1564]=nTile[156]; nChip[1565]=nTile[157]; nChip[1566]=nTile[158]; nChip[1567]=nTile[159];
			hChip[1660]=hTile[156]; hChip[1661]=hTile[157]; hChip[1662]=hTile[158]; hChip[1663]=hTile[159];
			vChip[2588]=vTile[156]; vChip[2589]=vTile[157]; vChip[2590]=vTile[158]; vChip[2591]=vTile[159];
			aChip[2684]=aTile[156]; aChip[2685]=aTile[157]; aChip[2686]=aTile[158]; aChip[2687]=aTile[159];

			nChip[1664]=nTile[160]; nChip[1665]=nTile[161]; nChip[1666]=nTile[162]; nChip[1667]=nTile[163];
			hChip[1760]=hTile[160]; hChip[1761]=hTile[161]; hChip[1762]=hTile[162]; hChip[1763]=hTile[163];
			vChip[2688]=vTile[160]; vChip[2689]=vTile[161]; vChip[2690]=vTile[162]; vChip[2691]=vTile[163];
			aChip[2784]=aTile[160]; aChip[2785]=aTile[161]; aChip[2786]=aTile[162]; aChip[2787]=aTile[163];

			nChip[1668]=nTile[164]; nChip[1669]=nTile[165]; nChip[1670]=nTile[166]; nChip[1671]=nTile[167];
			hChip[1764]=hTile[164]; hChip[1765]=hTile[165]; hChip[1766]=hTile[166]; hChip[1767]=hTile[167];
			vChip[2692]=vTile[164]; vChip[2693]=vTile[165]; vChip[2694]=vTile[166]; vChip[2695]=vTile[167];
			aChip[2788]=aTile[164]; aChip[2789]=aTile[165]; aChip[2790]=aTile[166]; aChip[2791]=aTile[167];

			nChip[1672]=nTile[168]; nChip[1673]=nTile[169]; nChip[1674]=nTile[170]; nChip[1675]=nTile[171];
			hChip[1768]=hTile[168]; hChip[1769]=hTile[169]; hChip[1770]=hTile[170]; hChip[1771]=hTile[171];
			vChip[2696]=vTile[168]; vChip[2697]=vTile[169]; vChip[2698]=vTile[170]; vChip[2699]=vTile[171];
			aChip[2792]=aTile[168]; aChip[2793]=aTile[169]; aChip[2794]=aTile[170]; aChip[2795]=aTile[171];

			nChip[1676]=nTile[172]; nChip[1677]=nTile[173]; nChip[1678]=nTile[174]; nChip[1679]=nTile[175];
			hChip[1772]=hTile[172]; hChip[1773]=hTile[173]; hChip[1774]=hTile[174]; hChip[1775]=hTile[175];
			vChip[2700]=vTile[172]; vChip[2701]=vTile[173]; vChip[2702]=vTile[174]; vChip[2703]=vTile[175];
			aChip[2796]=aTile[172]; aChip[2797]=aTile[173]; aChip[2798]=aTile[174]; aChip[2799]=aTile[175];

			nChip[1680]=nTile[176]; nChip[1681]=nTile[177]; nChip[1682]=nTile[178]; nChip[1683]=nTile[179];
			hChip[1776]=hTile[176]; hChip[1777]=hTile[177]; hChip[1778]=hTile[178]; hChip[1779]=hTile[179];
			vChip[2704]=vTile[176]; vChip[2705]=vTile[177]; vChip[2706]=vTile[178]; vChip[2707]=vTile[179];
			aChip[2800]=aTile[176]; aChip[2801]=aTile[177]; aChip[2802]=aTile[178]; aChip[2803]=aTile[179];

			nChip[1684]=nTile[180]; nChip[1685]=nTile[181]; nChip[1686]=nTile[182]; nChip[1687]=nTile[183];
			hChip[1780]=hTile[180]; hChip[1781]=hTile[181]; hChip[1782]=hTile[182]; hChip[1783]=hTile[183];
			vChip[2708]=vTile[180]; vChip[2709]=vTile[181]; vChip[2710]=vTile[182]; vChip[2711]=vTile[183];
			aChip[2804]=aTile[180]; aChip[2805]=aTile[181]; aChip[2806]=aTile[182]; aChip[2807]=aTile[183];

			nChip[1688]=nTile[184]; nChip[1689]=nTile[185]; nChip[1690]=nTile[186]; nChip[1691]=nTile[187];
			hChip[1784]=hTile[184]; hChip[1785]=hTile[185]; hChip[1786]=hTile[186]; hChip[1787]=hTile[187];
			vChip[2712]=vTile[184]; vChip[2713]=vTile[185]; vChip[2714]=vTile[186]; vChip[2715]=vTile[187];
			aChip[2808]=aTile[184]; aChip[2809]=aTile[185]; aChip[2810]=aTile[186]; aChip[2811]=aTile[187];

			nChip[1692]=nTile[188]; nChip[1693]=nTile[189]; nChip[1694]=nTile[190]; nChip[1695]=nTile[191];
			hChip[1788]=hTile[188]; hChip[1789]=hTile[189]; hChip[1790]=hTile[190]; hChip[1791]=hTile[191];
			vChip[2716]=vTile[188]; vChip[2717]=vTile[189]; vChip[2718]=vTile[190]; vChip[2719]=vTile[191];
			aChip[2812]=aTile[188]; aChip[2813]=aTile[189]; aChip[2814]=aTile[190]; aChip[2815]=aTile[191];

			nChip[1792]=nTile[192]; nChip[1793]=nTile[193]; nChip[1794]=nTile[194]; nChip[1795]=nTile[195];
			hChip[1888]=hTile[192]; hChip[1889]=hTile[193]; hChip[1890]=hTile[194]; hChip[1891]=hTile[195];
			vChip[2816]=vTile[192]; vChip[2817]=vTile[193]; vChip[2818]=vTile[194]; vChip[2819]=vTile[195];
			aChip[2912]=aTile[192]; aChip[2913]=aTile[193]; aChip[2914]=aTile[194]; aChip[2915]=aTile[195];

			nChip[1796]=nTile[196]; nChip[1797]=nTile[197]; nChip[1798]=nTile[198]; nChip[1799]=nTile[199];
			hChip[1892]=hTile[196]; hChip[1893]=hTile[197]; hChip[1894]=hTile[198]; hChip[1895]=hTile[199];
			vChip[2820]=vTile[196]; vChip[2821]=vTile[197]; vChip[2822]=vTile[198]; vChip[2823]=vTile[199];
			aChip[2916]=aTile[196]; aChip[2917]=aTile[197]; aChip[2918]=aTile[198]; aChip[2919]=aTile[199];

			nChip[1800]=nTile[200]; nChip[1801]=nTile[201]; nChip[1802]=nTile[202]; nChip[1803]=nTile[203];
			hChip[1896]=hTile[200]; hChip[1897]=hTile[201]; hChip[1898]=hTile[202]; hChip[1899]=hTile[203];
			vChip[2824]=vTile[200]; vChip[2825]=vTile[201]; vChip[2826]=vTile[202]; vChip[2827]=vTile[203];
			aChip[2920]=aTile[200]; aChip[2921]=aTile[201]; aChip[2922]=aTile[202]; aChip[2923]=aTile[203];

			nChip[1804]=nTile[204]; nChip[1805]=nTile[205]; nChip[1806]=nTile[206]; nChip[1807]=nTile[207];
			hChip[1900]=hTile[204]; hChip[1901]=hTile[205]; hChip[1902]=hTile[206]; hChip[1903]=hTile[207];
			vChip[2828]=vTile[204]; vChip[2829]=vTile[205]; vChip[2830]=vTile[206]; vChip[2831]=vTile[207];
			aChip[2924]=aTile[204]; aChip[2925]=aTile[205]; aChip[2926]=aTile[206]; aChip[2927]=aTile[207];

			nChip[1808]=nTile[208]; nChip[1809]=nTile[209]; nChip[1810]=nTile[210]; nChip[1811]=nTile[211];
			hChip[1904]=hTile[208]; hChip[1905]=hTile[209]; hChip[1906]=hTile[210]; hChip[1907]=hTile[211];
			vChip[2832]=vTile[208]; vChip[2833]=vTile[209]; vChip[2834]=vTile[210]; vChip[2835]=vTile[211];
			aChip[2928]=aTile[208]; aChip[2929]=aTile[209]; aChip[2930]=aTile[210]; aChip[2931]=aTile[211];

			nChip[1812]=nTile[212]; nChip[1813]=nTile[213]; nChip[1814]=nTile[214]; nChip[1815]=nTile[215];
			hChip[1908]=hTile[212]; hChip[1909]=hTile[213]; hChip[1910]=hTile[214]; hChip[1911]=hTile[215];
			vChip[2836]=vTile[212]; vChip[2837]=vTile[213]; vChip[2838]=vTile[214]; vChip[2839]=vTile[215];
			aChip[2932]=aTile[212]; aChip[2933]=aTile[213]; aChip[2934]=aTile[214]; aChip[2935]=aTile[215];

			nChip[1816]=nTile[216]; nChip[1817]=nTile[217]; nChip[1818]=nTile[218]; nChip[1819]=nTile[219];
			hChip[1912]=hTile[216]; hChip[1913]=hTile[217]; hChip[1914]=hTile[218]; hChip[1915]=hTile[219];
			vChip[2840]=vTile[216]; vChip[2841]=vTile[217]; vChip[2842]=vTile[218]; vChip[2843]=vTile[219];
			aChip[2936]=aTile[216]; aChip[2937]=aTile[217]; aChip[2938]=aTile[218]; aChip[2939]=aTile[219];

			nChip[1820]=nTile[220]; nChip[1821]=nTile[221]; nChip[1822]=nTile[222]; nChip[1823]=nTile[223];
			hChip[1916]=hTile[220]; hChip[1917]=hTile[221]; hChip[1918]=hTile[222]; hChip[1919]=hTile[223];
			vChip[2844]=vTile[220]; vChip[2845]=vTile[221]; vChip[2846]=vTile[222]; vChip[2847]=vTile[223];
			aChip[2940]=aTile[220]; aChip[2941]=aTile[221]; aChip[2942]=aTile[222]; aChip[2943]=aTile[223];

			nChip[1920]=nTile[224]; nChip[1921]=nTile[225]; nChip[1922]=nTile[226]; nChip[1923]=nTile[227];
			hChip[2016]=hTile[224]; hChip[2017]=hTile[225]; hChip[2018]=hTile[226]; hChip[2019]=hTile[227];
			vChip[2944]=vTile[224]; vChip[2945]=vTile[225]; vChip[2946]=vTile[226]; vChip[2947]=vTile[227];
			aChip[3040]=aTile[224]; aChip[3041]=aTile[225]; aChip[3042]=aTile[226]; aChip[3043]=aTile[227];

			nChip[1924]=nTile[228]; nChip[1925]=nTile[229]; nChip[1926]=nTile[230]; nChip[1927]=nTile[231];
			hChip[2020]=hTile[228]; hChip[2021]=hTile[229]; hChip[2022]=hTile[230]; hChip[2023]=hTile[231];
			vChip[2948]=vTile[228]; vChip[2949]=vTile[229]; vChip[2950]=vTile[230]; vChip[2951]=vTile[231];
			aChip[3044]=aTile[228]; aChip[3045]=aTile[229]; aChip[3046]=aTile[230]; aChip[3047]=aTile[231];

			nChip[1928]=nTile[232]; nChip[1929]=nTile[233]; nChip[1930]=nTile[234]; nChip[1931]=nTile[235];
			hChip[2024]=hTile[232]; hChip[2025]=hTile[233]; hChip[2026]=hTile[234]; hChip[2027]=hTile[235];
			vChip[2952]=vTile[232]; vChip[2953]=vTile[233]; vChip[2954]=vTile[234]; vChip[2955]=vTile[235];
			aChip[3048]=aTile[232]; aChip[3049]=aTile[233]; aChip[3050]=aTile[234]; aChip[3051]=aTile[235];

			nChip[1932]=nTile[236]; nChip[1933]=nTile[237]; nChip[1934]=nTile[238]; nChip[1935]=nTile[239];
			hChip[2028]=hTile[236]; hChip[2029]=hTile[237]; hChip[2030]=hTile[238]; hChip[2031]=hTile[239];
			vChip[2956]=vTile[236]; vChip[2957]=vTile[237]; vChip[2958]=vTile[238]; vChip[2959]=vTile[239];
			aChip[3052]=aTile[236]; aChip[3053]=aTile[237]; aChip[3054]=aTile[238]; aChip[3055]=aTile[239];

			nChip[1936]=nTile[240]; nChip[1937]=nTile[241]; nChip[1938]=nTile[242]; nChip[1939]=nTile[243];
			hChip[2032]=hTile[240]; hChip[2033]=hTile[241]; hChip[2034]=hTile[242]; hChip[2035]=hTile[243];
			vChip[2960]=vTile[240]; vChip[2961]=vTile[241]; vChip[2962]=vTile[242]; vChip[2963]=vTile[243];
			aChip[3056]=aTile[240]; aChip[3057]=aTile[241]; aChip[3058]=aTile[242]; aChip[3059]=aTile[243];

			nChip[1940]=nTile[244]; nChip[1941]=nTile[245]; nChip[1942]=nTile[246]; nChip[1943]=nTile[247];
			hChip[2036]=hTile[244]; hChip[2037]=hTile[245]; hChip[2038]=hTile[246]; hChip[2039]=hTile[247];
			vChip[2964]=vTile[244]; vChip[2965]=vTile[245]; vChip[2966]=vTile[246]; vChip[2967]=vTile[247];
			aChip[3060]=aTile[244]; aChip[3061]=aTile[245]; aChip[3062]=aTile[246]; aChip[3063]=aTile[247];

			nChip[1944]=nTile[248]; nChip[1945]=nTile[249]; nChip[1946]=nTile[250]; nChip[1947]=nTile[251];
			hChip[2040]=hTile[248]; hChip[2041]=hTile[249]; hChip[2042]=hTile[250]; hChip[2043]=hTile[251];
			vChip[2968]=vTile[248]; vChip[2969]=vTile[249]; vChip[2970]=vTile[250]; vChip[2971]=vTile[251];
			aChip[3064]=aTile[248]; aChip[3065]=aTile[249]; aChip[3066]=aTile[250]; aChip[3067]=aTile[251];

			nChip[1948]=nTile[252]; nChip[1949]=nTile[253]; nChip[1950]=nTile[254]; nChip[1951]=nTile[255];
			hChip[2044]=hTile[252]; hChip[2045]=hTile[253]; hChip[2046]=hTile[254]; hChip[2047]=hTile[255];
			vChip[2972]=vTile[252]; vChip[2973]=vTile[253]; vChip[2974]=vTile[254]; vChip[2975]=vTile[255];
			aChip[3068]=aTile[252]; aChip[3069]=aTile[253]; aChip[3070]=aTile[254]; aChip[3071]=aTile[255];

			A = d[cOfst+10]; B = d[cOfst+11];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[1056]=nTile[0]; nChip[1057]=nTile[1]; nChip[1058]=nTile[2]; nChip[1059]=nTile[3];
			hChip[1088]=hTile[0]; hChip[1089]=hTile[1]; hChip[1090]=hTile[2]; hChip[1091]=hTile[3];
			vChip[2080]=vTile[0]; vChip[2081]=vTile[1]; vChip[2082]=vTile[2]; vChip[2083]=vTile[3];
			aChip[2112]=aTile[0]; aChip[2113]=aTile[1]; aChip[2114]=aTile[2]; aChip[2115]=aTile[3];

			nChip[1060]=nTile[4]; nChip[1061]=nTile[5]; nChip[1062]=nTile[6]; nChip[1063]=nTile[7];
			hChip[1092]=hTile[4]; hChip[1093]=hTile[5]; hChip[1094]=hTile[6]; hChip[1095]=hTile[7];
			vChip[2084]=vTile[4]; vChip[2085]=vTile[5]; vChip[2086]=vTile[6]; vChip[2087]=vTile[7];
			aChip[2116]=aTile[4]; aChip[2117]=aTile[5]; aChip[2118]=aTile[6]; aChip[2119]=aTile[7];

			nChip[1064]=nTile[8]; nChip[1065]=nTile[9]; nChip[1066]=nTile[10]; nChip[1067]=nTile[11];
			hChip[1096]=hTile[8]; hChip[1097]=hTile[9]; hChip[1098]=hTile[10]; hChip[1099]=hTile[11];
			vChip[2088]=vTile[8]; vChip[2089]=vTile[9]; vChip[2090]=vTile[10]; vChip[2091]=vTile[11];
			aChip[2120]=aTile[8]; aChip[2121]=aTile[9]; aChip[2122]=aTile[10]; aChip[2123]=aTile[11];

			nChip[1068]=nTile[12]; nChip[1069]=nTile[13]; nChip[1070]=nTile[14]; nChip[1071]=nTile[15];
			hChip[1100]=hTile[12]; hChip[1101]=hTile[13]; hChip[1102]=hTile[14]; hChip[1103]=hTile[15];
			vChip[2092]=vTile[12]; vChip[2093]=vTile[13]; vChip[2094]=vTile[14]; vChip[2095]=vTile[15];
			aChip[2124]=aTile[12]; aChip[2125]=aTile[13]; aChip[2126]=aTile[14]; aChip[2127]=aTile[15];

			nChip[1072]=nTile[16]; nChip[1073]=nTile[17]; nChip[1074]=nTile[18]; nChip[1075]=nTile[19];
			hChip[1104]=hTile[16]; hChip[1105]=hTile[17]; hChip[1106]=hTile[18]; hChip[1107]=hTile[19];
			vChip[2096]=vTile[16]; vChip[2097]=vTile[17]; vChip[2098]=vTile[18]; vChip[2099]=vTile[19];
			aChip[2128]=aTile[16]; aChip[2129]=aTile[17]; aChip[2130]=aTile[18]; aChip[2131]=aTile[19];

			nChip[1076]=nTile[20]; nChip[1077]=nTile[21]; nChip[1078]=nTile[22]; nChip[1079]=nTile[23];
			hChip[1108]=hTile[20]; hChip[1109]=hTile[21]; hChip[1110]=hTile[22]; hChip[1111]=hTile[23];
			vChip[2100]=vTile[20]; vChip[2101]=vTile[21]; vChip[2102]=vTile[22]; vChip[2103]=vTile[23];
			aChip[2132]=aTile[20]; aChip[2133]=aTile[21]; aChip[2134]=aTile[22]; aChip[2135]=aTile[23];

			nChip[1080]=nTile[24]; nChip[1081]=nTile[25]; nChip[1082]=nTile[26]; nChip[1083]=nTile[27];
			hChip[1112]=hTile[24]; hChip[1113]=hTile[25]; hChip[1114]=hTile[26]; hChip[1115]=hTile[27];
			vChip[2104]=vTile[24]; vChip[2105]=vTile[25]; vChip[2106]=vTile[26]; vChip[2107]=vTile[27];
			aChip[2136]=aTile[24]; aChip[2137]=aTile[25]; aChip[2138]=aTile[26]; aChip[2139]=aTile[27];

			nChip[1084]=nTile[28]; nChip[1085]=nTile[29]; nChip[1086]=nTile[30]; nChip[1087]=nTile[31];
			hChip[1116]=hTile[28]; hChip[1117]=hTile[29]; hChip[1118]=hTile[30]; hChip[1119]=hTile[31];
			vChip[2108]=vTile[28]; vChip[2109]=vTile[29]; vChip[2110]=vTile[30]; vChip[2111]=vTile[31];
			aChip[2140]=aTile[28]; aChip[2141]=aTile[29]; aChip[2142]=aTile[30]; aChip[2143]=aTile[31];

			nChip[1184]=nTile[32]; nChip[1185]=nTile[33]; nChip[1186]=nTile[34]; nChip[1187]=nTile[35];
			hChip[1216]=hTile[32]; hChip[1217]=hTile[33]; hChip[1218]=hTile[34]; hChip[1219]=hTile[35];
			vChip[2208]=vTile[32]; vChip[2209]=vTile[33]; vChip[2210]=vTile[34]; vChip[2211]=vTile[35];
			aChip[2240]=aTile[32]; aChip[2241]=aTile[33]; aChip[2242]=aTile[34]; aChip[2243]=aTile[35];

			nChip[1188]=nTile[36]; nChip[1189]=nTile[37]; nChip[1190]=nTile[38]; nChip[1191]=nTile[39];
			hChip[1220]=hTile[36]; hChip[1221]=hTile[37]; hChip[1222]=hTile[38]; hChip[1223]=hTile[39];
			vChip[2212]=vTile[36]; vChip[2213]=vTile[37]; vChip[2214]=vTile[38]; vChip[2215]=vTile[39];
			aChip[2244]=aTile[36]; aChip[2245]=aTile[37]; aChip[2246]=aTile[38]; aChip[2247]=aTile[39];

			nChip[1192]=nTile[40]; nChip[1193]=nTile[41]; nChip[1194]=nTile[42]; nChip[1195]=nTile[43];
			hChip[1224]=hTile[40]; hChip[1225]=hTile[41]; hChip[1226]=hTile[42]; hChip[1227]=hTile[43];
			vChip[2216]=vTile[40]; vChip[2217]=vTile[41]; vChip[2218]=vTile[42]; vChip[2219]=vTile[43];
			aChip[2248]=aTile[40]; aChip[2249]=aTile[41]; aChip[2250]=aTile[42]; aChip[2251]=aTile[43];

			nChip[1196]=nTile[44]; nChip[1197]=nTile[45]; nChip[1198]=nTile[46]; nChip[1199]=nTile[47];
			hChip[1228]=hTile[44]; hChip[1229]=hTile[45]; hChip[1230]=hTile[46]; hChip[1231]=hTile[47];
			vChip[2220]=vTile[44]; vChip[2221]=vTile[45]; vChip[2222]=vTile[46]; vChip[2223]=vTile[47];
			aChip[2252]=aTile[44]; aChip[2253]=aTile[45]; aChip[2254]=aTile[46]; aChip[2255]=aTile[47];

			nChip[1200]=nTile[48]; nChip[1201]=nTile[49]; nChip[1202]=nTile[50]; nChip[1203]=nTile[51];
			hChip[1232]=hTile[48]; hChip[1233]=hTile[49]; hChip[1234]=hTile[50]; hChip[1235]=hTile[51];
			vChip[2224]=vTile[48]; vChip[2225]=vTile[49]; vChip[2226]=vTile[50]; vChip[2227]=vTile[51];
			aChip[2256]=aTile[48]; aChip[2257]=aTile[49]; aChip[2258]=aTile[50]; aChip[2259]=aTile[51];

			nChip[1204]=nTile[52]; nChip[1205]=nTile[53]; nChip[1206]=nTile[54]; nChip[1207]=nTile[55];
			hChip[1236]=hTile[52]; hChip[1237]=hTile[53]; hChip[1238]=hTile[54]; hChip[1239]=hTile[55];
			vChip[2228]=vTile[52]; vChip[2229]=vTile[53]; vChip[2230]=vTile[54]; vChip[2231]=vTile[55];
			aChip[2260]=aTile[52]; aChip[2261]=aTile[53]; aChip[2262]=aTile[54]; aChip[2263]=aTile[55];

			nChip[1208]=nTile[56]; nChip[1209]=nTile[57]; nChip[1210]=nTile[58]; nChip[1211]=nTile[59];
			hChip[1240]=hTile[56]; hChip[1241]=hTile[57]; hChip[1242]=hTile[58]; hChip[1243]=hTile[59];
			vChip[2232]=vTile[56]; vChip[2233]=vTile[57]; vChip[2234]=vTile[58]; vChip[2235]=vTile[59];
			aChip[2264]=aTile[56]; aChip[2265]=aTile[57]; aChip[2266]=aTile[58]; aChip[2267]=aTile[59];

			nChip[1212]=nTile[60]; nChip[1213]=nTile[61]; nChip[1214]=nTile[62]; nChip[1215]=nTile[63];
			hChip[1244]=hTile[60]; hChip[1245]=hTile[61]; hChip[1246]=hTile[62]; hChip[1247]=hTile[63];
			vChip[2236]=vTile[60]; vChip[2237]=vTile[61]; vChip[2238]=vTile[62]; vChip[2239]=vTile[63];
			aChip[2268]=aTile[60]; aChip[2269]=aTile[61]; aChip[2270]=aTile[62]; aChip[2271]=aTile[63];

			nChip[1312]=nTile[64]; nChip[1313]=nTile[65]; nChip[1314]=nTile[66]; nChip[1315]=nTile[67];
			hChip[1344]=hTile[64]; hChip[1345]=hTile[65]; hChip[1346]=hTile[66]; hChip[1347]=hTile[67];
			vChip[2336]=vTile[64]; vChip[2337]=vTile[65]; vChip[2338]=vTile[66]; vChip[2339]=vTile[67];
			aChip[2368]=aTile[64]; aChip[2369]=aTile[65]; aChip[2370]=aTile[66]; aChip[2371]=aTile[67];

			nChip[1316]=nTile[68]; nChip[1317]=nTile[69]; nChip[1318]=nTile[70]; nChip[1319]=nTile[71];
			hChip[1348]=hTile[68]; hChip[1349]=hTile[69]; hChip[1350]=hTile[70]; hChip[1351]=hTile[71];
			vChip[2340]=vTile[68]; vChip[2341]=vTile[69]; vChip[2342]=vTile[70]; vChip[2343]=vTile[71];
			aChip[2372]=aTile[68]; aChip[2373]=aTile[69]; aChip[2374]=aTile[70]; aChip[2375]=aTile[71];

			nChip[1320]=nTile[72]; nChip[1321]=nTile[73]; nChip[1322]=nTile[74]; nChip[1323]=nTile[75];
			hChip[1352]=hTile[72]; hChip[1353]=hTile[73]; hChip[1354]=hTile[74]; hChip[1355]=hTile[75];
			vChip[2344]=vTile[72]; vChip[2345]=vTile[73]; vChip[2346]=vTile[74]; vChip[2347]=vTile[75];
			aChip[2376]=aTile[72]; aChip[2377]=aTile[73]; aChip[2378]=aTile[74]; aChip[2379]=aTile[75];

			nChip[1324]=nTile[76]; nChip[1325]=nTile[77]; nChip[1326]=nTile[78]; nChip[1327]=nTile[79];
			hChip[1356]=hTile[76]; hChip[1357]=hTile[77]; hChip[1358]=hTile[78]; hChip[1359]=hTile[79];
			vChip[2348]=vTile[76]; vChip[2349]=vTile[77]; vChip[2350]=vTile[78]; vChip[2351]=vTile[79];
			aChip[2380]=aTile[76]; aChip[2381]=aTile[77]; aChip[2382]=aTile[78]; aChip[2383]=aTile[79];

			nChip[1328]=nTile[80]; nChip[1329]=nTile[81]; nChip[1330]=nTile[82]; nChip[1331]=nTile[83];
			hChip[1360]=hTile[80]; hChip[1361]=hTile[81]; hChip[1362]=hTile[82]; hChip[1363]=hTile[83];
			vChip[2352]=vTile[80]; vChip[2353]=vTile[81]; vChip[2354]=vTile[82]; vChip[2355]=vTile[83];
			aChip[2384]=aTile[80]; aChip[2385]=aTile[81]; aChip[2386]=aTile[82]; aChip[2387]=aTile[83];

			nChip[1332]=nTile[84]; nChip[1333]=nTile[85]; nChip[1334]=nTile[86]; nChip[1335]=nTile[87];
			hChip[1364]=hTile[84]; hChip[1365]=hTile[85]; hChip[1366]=hTile[86]; hChip[1367]=hTile[87];
			vChip[2356]=vTile[84]; vChip[2357]=vTile[85]; vChip[2358]=vTile[86]; vChip[2359]=vTile[87];
			aChip[2388]=aTile[84]; aChip[2389]=aTile[85]; aChip[2390]=aTile[86]; aChip[2391]=aTile[87];

			nChip[1336]=nTile[88]; nChip[1337]=nTile[89]; nChip[1338]=nTile[90]; nChip[1339]=nTile[91];
			hChip[1368]=hTile[88]; hChip[1369]=hTile[89]; hChip[1370]=hTile[90]; hChip[1371]=hTile[91];
			vChip[2360]=vTile[88]; vChip[2361]=vTile[89]; vChip[2362]=vTile[90]; vChip[2363]=vTile[91];
			aChip[2392]=aTile[88]; aChip[2393]=aTile[89]; aChip[2394]=aTile[90]; aChip[2395]=aTile[91];

			nChip[1340]=nTile[92]; nChip[1341]=nTile[93]; nChip[1342]=nTile[94]; nChip[1343]=nTile[95];
			hChip[1372]=hTile[92]; hChip[1373]=hTile[93]; hChip[1374]=hTile[94]; hChip[1375]=hTile[95];
			vChip[2364]=vTile[92]; vChip[2365]=vTile[93]; vChip[2366]=vTile[94]; vChip[2367]=vTile[95];
			aChip[2396]=aTile[92]; aChip[2397]=aTile[93]; aChip[2398]=aTile[94]; aChip[2399]=aTile[95];

			nChip[1440]=nTile[96]; nChip[1441]=nTile[97]; nChip[1442]=nTile[98]; nChip[1443]=nTile[99];
			hChip[1472]=hTile[96]; hChip[1473]=hTile[97]; hChip[1474]=hTile[98]; hChip[1475]=hTile[99];
			vChip[2464]=vTile[96]; vChip[2465]=vTile[97]; vChip[2466]=vTile[98]; vChip[2467]=vTile[99];
			aChip[2496]=aTile[96]; aChip[2497]=aTile[97]; aChip[2498]=aTile[98]; aChip[2499]=aTile[99];

			nChip[1444]=nTile[100]; nChip[1445]=nTile[101]; nChip[1446]=nTile[102]; nChip[1447]=nTile[103];
			hChip[1476]=hTile[100]; hChip[1477]=hTile[101]; hChip[1478]=hTile[102]; hChip[1479]=hTile[103];
			vChip[2468]=vTile[100]; vChip[2469]=vTile[101]; vChip[2470]=vTile[102]; vChip[2471]=vTile[103];
			aChip[2500]=aTile[100]; aChip[2501]=aTile[101]; aChip[2502]=aTile[102]; aChip[2503]=aTile[103];

			nChip[1448]=nTile[104]; nChip[1449]=nTile[105]; nChip[1450]=nTile[106]; nChip[1451]=nTile[107];
			hChip[1480]=hTile[104]; hChip[1481]=hTile[105]; hChip[1482]=hTile[106]; hChip[1483]=hTile[107];
			vChip[2472]=vTile[104]; vChip[2473]=vTile[105]; vChip[2474]=vTile[106]; vChip[2475]=vTile[107];
			aChip[2504]=aTile[104]; aChip[2505]=aTile[105]; aChip[2506]=aTile[106]; aChip[2507]=aTile[107];

			nChip[1452]=nTile[108]; nChip[1453]=nTile[109]; nChip[1454]=nTile[110]; nChip[1455]=nTile[111];
			hChip[1484]=hTile[108]; hChip[1485]=hTile[109]; hChip[1486]=hTile[110]; hChip[1487]=hTile[111];
			vChip[2476]=vTile[108]; vChip[2477]=vTile[109]; vChip[2478]=vTile[110]; vChip[2479]=vTile[111];
			aChip[2508]=aTile[108]; aChip[2509]=aTile[109]; aChip[2510]=aTile[110]; aChip[2511]=aTile[111];

			nChip[1456]=nTile[112]; nChip[1457]=nTile[113]; nChip[1458]=nTile[114]; nChip[1459]=nTile[115];
			hChip[1488]=hTile[112]; hChip[1489]=hTile[113]; hChip[1490]=hTile[114]; hChip[1491]=hTile[115];
			vChip[2480]=vTile[112]; vChip[2481]=vTile[113]; vChip[2482]=vTile[114]; vChip[2483]=vTile[115];
			aChip[2512]=aTile[112]; aChip[2513]=aTile[113]; aChip[2514]=aTile[114]; aChip[2515]=aTile[115];

			nChip[1460]=nTile[116]; nChip[1461]=nTile[117]; nChip[1462]=nTile[118]; nChip[1463]=nTile[119];
			hChip[1492]=hTile[116]; hChip[1493]=hTile[117]; hChip[1494]=hTile[118]; hChip[1495]=hTile[119];
			vChip[2484]=vTile[116]; vChip[2485]=vTile[117]; vChip[2486]=vTile[118]; vChip[2487]=vTile[119];
			aChip[2516]=aTile[116]; aChip[2517]=aTile[117]; aChip[2518]=aTile[118]; aChip[2519]=aTile[119];

			nChip[1464]=nTile[120]; nChip[1465]=nTile[121]; nChip[1466]=nTile[122]; nChip[1467]=nTile[123];
			hChip[1496]=hTile[120]; hChip[1497]=hTile[121]; hChip[1498]=hTile[122]; hChip[1499]=hTile[123];
			vChip[2488]=vTile[120]; vChip[2489]=vTile[121]; vChip[2490]=vTile[122]; vChip[2491]=vTile[123];
			aChip[2520]=aTile[120]; aChip[2521]=aTile[121]; aChip[2522]=aTile[122]; aChip[2523]=aTile[123];

			nChip[1468]=nTile[124]; nChip[1469]=nTile[125]; nChip[1470]=nTile[126]; nChip[1471]=nTile[127];
			hChip[1500]=hTile[124]; hChip[1501]=hTile[125]; hChip[1502]=hTile[126]; hChip[1503]=hTile[127];
			vChip[2492]=vTile[124]; vChip[2493]=vTile[125]; vChip[2494]=vTile[126]; vChip[2495]=vTile[127];
			aChip[2524]=aTile[124]; aChip[2525]=aTile[125]; aChip[2526]=aTile[126]; aChip[2527]=aTile[127];

			nChip[1568]=nTile[128]; nChip[1569]=nTile[129]; nChip[1570]=nTile[130]; nChip[1571]=nTile[131];
			hChip[1600]=hTile[128]; hChip[1601]=hTile[129]; hChip[1602]=hTile[130]; hChip[1603]=hTile[131];
			vChip[2592]=vTile[128]; vChip[2593]=vTile[129]; vChip[2594]=vTile[130]; vChip[2595]=vTile[131];
			aChip[2624]=aTile[128]; aChip[2625]=aTile[129]; aChip[2626]=aTile[130]; aChip[2627]=aTile[131];

			nChip[1572]=nTile[132]; nChip[1573]=nTile[133]; nChip[1574]=nTile[134]; nChip[1575]=nTile[135];
			hChip[1604]=hTile[132]; hChip[1605]=hTile[133]; hChip[1606]=hTile[134]; hChip[1607]=hTile[135];
			vChip[2596]=vTile[132]; vChip[2597]=vTile[133]; vChip[2598]=vTile[134]; vChip[2599]=vTile[135];
			aChip[2628]=aTile[132]; aChip[2629]=aTile[133]; aChip[2630]=aTile[134]; aChip[2631]=aTile[135];

			nChip[1576]=nTile[136]; nChip[1577]=nTile[137]; nChip[1578]=nTile[138]; nChip[1579]=nTile[139];
			hChip[1608]=hTile[136]; hChip[1609]=hTile[137]; hChip[1610]=hTile[138]; hChip[1611]=hTile[139];
			vChip[2600]=vTile[136]; vChip[2601]=vTile[137]; vChip[2602]=vTile[138]; vChip[2603]=vTile[139];
			aChip[2632]=aTile[136]; aChip[2633]=aTile[137]; aChip[2634]=aTile[138]; aChip[2635]=aTile[139];

			nChip[1580]=nTile[140]; nChip[1581]=nTile[141]; nChip[1582]=nTile[142]; nChip[1583]=nTile[143];
			hChip[1612]=hTile[140]; hChip[1613]=hTile[141]; hChip[1614]=hTile[142]; hChip[1615]=hTile[143];
			vChip[2604]=vTile[140]; vChip[2605]=vTile[141]; vChip[2606]=vTile[142]; vChip[2607]=vTile[143];
			aChip[2636]=aTile[140]; aChip[2637]=aTile[141]; aChip[2638]=aTile[142]; aChip[2639]=aTile[143];

			nChip[1584]=nTile[144]; nChip[1585]=nTile[145]; nChip[1586]=nTile[146]; nChip[1587]=nTile[147];
			hChip[1616]=hTile[144]; hChip[1617]=hTile[145]; hChip[1618]=hTile[146]; hChip[1619]=hTile[147];
			vChip[2608]=vTile[144]; vChip[2609]=vTile[145]; vChip[2610]=vTile[146]; vChip[2611]=vTile[147];
			aChip[2640]=aTile[144]; aChip[2641]=aTile[145]; aChip[2642]=aTile[146]; aChip[2643]=aTile[147];

			nChip[1588]=nTile[148]; nChip[1589]=nTile[149]; nChip[1590]=nTile[150]; nChip[1591]=nTile[151];
			hChip[1620]=hTile[148]; hChip[1621]=hTile[149]; hChip[1622]=hTile[150]; hChip[1623]=hTile[151];
			vChip[2612]=vTile[148]; vChip[2613]=vTile[149]; vChip[2614]=vTile[150]; vChip[2615]=vTile[151];
			aChip[2644]=aTile[148]; aChip[2645]=aTile[149]; aChip[2646]=aTile[150]; aChip[2647]=aTile[151];

			nChip[1592]=nTile[152]; nChip[1593]=nTile[153]; nChip[1594]=nTile[154]; nChip[1595]=nTile[155];
			hChip[1624]=hTile[152]; hChip[1625]=hTile[153]; hChip[1626]=hTile[154]; hChip[1627]=hTile[155];
			vChip[2616]=vTile[152]; vChip[2617]=vTile[153]; vChip[2618]=vTile[154]; vChip[2619]=vTile[155];
			aChip[2648]=aTile[152]; aChip[2649]=aTile[153]; aChip[2650]=aTile[154]; aChip[2651]=aTile[155];

			nChip[1596]=nTile[156]; nChip[1597]=nTile[157]; nChip[1598]=nTile[158]; nChip[1599]=nTile[159];
			hChip[1628]=hTile[156]; hChip[1629]=hTile[157]; hChip[1630]=hTile[158]; hChip[1631]=hTile[159];
			vChip[2620]=vTile[156]; vChip[2621]=vTile[157]; vChip[2622]=vTile[158]; vChip[2623]=vTile[159];
			aChip[2652]=aTile[156]; aChip[2653]=aTile[157]; aChip[2654]=aTile[158]; aChip[2655]=aTile[159];

			nChip[1696]=nTile[160]; nChip[1697]=nTile[161]; nChip[1698]=nTile[162]; nChip[1699]=nTile[163];
			hChip[1728]=hTile[160]; hChip[1729]=hTile[161]; hChip[1730]=hTile[162]; hChip[1731]=hTile[163];
			vChip[2720]=vTile[160]; vChip[2721]=vTile[161]; vChip[2722]=vTile[162]; vChip[2723]=vTile[163];
			aChip[2752]=aTile[160]; aChip[2753]=aTile[161]; aChip[2754]=aTile[162]; aChip[2755]=aTile[163];

			nChip[1700]=nTile[164]; nChip[1701]=nTile[165]; nChip[1702]=nTile[166]; nChip[1703]=nTile[167];
			hChip[1732]=hTile[164]; hChip[1733]=hTile[165]; hChip[1734]=hTile[166]; hChip[1735]=hTile[167];
			vChip[2724]=vTile[164]; vChip[2725]=vTile[165]; vChip[2726]=vTile[166]; vChip[2727]=vTile[167];
			aChip[2756]=aTile[164]; aChip[2757]=aTile[165]; aChip[2758]=aTile[166]; aChip[2759]=aTile[167];

			nChip[1704]=nTile[168]; nChip[1705]=nTile[169]; nChip[1706]=nTile[170]; nChip[1707]=nTile[171];
			hChip[1736]=hTile[168]; hChip[1737]=hTile[169]; hChip[1738]=hTile[170]; hChip[1739]=hTile[171];
			vChip[2728]=vTile[168]; vChip[2729]=vTile[169]; vChip[2730]=vTile[170]; vChip[2731]=vTile[171];
			aChip[2760]=aTile[168]; aChip[2761]=aTile[169]; aChip[2762]=aTile[170]; aChip[2763]=aTile[171];

			nChip[1708]=nTile[172]; nChip[1709]=nTile[173]; nChip[1710]=nTile[174]; nChip[1711]=nTile[175];
			hChip[1740]=hTile[172]; hChip[1741]=hTile[173]; hChip[1742]=hTile[174]; hChip[1743]=hTile[175];
			vChip[2732]=vTile[172]; vChip[2733]=vTile[173]; vChip[2734]=vTile[174]; vChip[2735]=vTile[175];
			aChip[2764]=aTile[172]; aChip[2765]=aTile[173]; aChip[2766]=aTile[174]; aChip[2767]=aTile[175];

			nChip[1712]=nTile[176]; nChip[1713]=nTile[177]; nChip[1714]=nTile[178]; nChip[1715]=nTile[179];
			hChip[1744]=hTile[176]; hChip[1745]=hTile[177]; hChip[1746]=hTile[178]; hChip[1747]=hTile[179];
			vChip[2736]=vTile[176]; vChip[2737]=vTile[177]; vChip[2738]=vTile[178]; vChip[2739]=vTile[179];
			aChip[2768]=aTile[176]; aChip[2769]=aTile[177]; aChip[2770]=aTile[178]; aChip[2771]=aTile[179];

			nChip[1716]=nTile[180]; nChip[1717]=nTile[181]; nChip[1718]=nTile[182]; nChip[1719]=nTile[183];
			hChip[1748]=hTile[180]; hChip[1749]=hTile[181]; hChip[1750]=hTile[182]; hChip[1751]=hTile[183];
			vChip[2740]=vTile[180]; vChip[2741]=vTile[181]; vChip[2742]=vTile[182]; vChip[2743]=vTile[183];
			aChip[2772]=aTile[180]; aChip[2773]=aTile[181]; aChip[2774]=aTile[182]; aChip[2775]=aTile[183];

			nChip[1720]=nTile[184]; nChip[1721]=nTile[185]; nChip[1722]=nTile[186]; nChip[1723]=nTile[187];
			hChip[1752]=hTile[184]; hChip[1753]=hTile[185]; hChip[1754]=hTile[186]; hChip[1755]=hTile[187];
			vChip[2744]=vTile[184]; vChip[2745]=vTile[185]; vChip[2746]=vTile[186]; vChip[2747]=vTile[187];
			aChip[2776]=aTile[184]; aChip[2777]=aTile[185]; aChip[2778]=aTile[186]; aChip[2779]=aTile[187];

			nChip[1724]=nTile[188]; nChip[1725]=nTile[189]; nChip[1726]=nTile[190]; nChip[1727]=nTile[191];
			hChip[1756]=hTile[188]; hChip[1757]=hTile[189]; hChip[1758]=hTile[190]; hChip[1759]=hTile[191];
			vChip[2748]=vTile[188]; vChip[2749]=vTile[189]; vChip[2750]=vTile[190]; vChip[2751]=vTile[191];
			aChip[2780]=aTile[188]; aChip[2781]=aTile[189]; aChip[2782]=aTile[190]; aChip[2783]=aTile[191];

			nChip[1824]=nTile[192]; nChip[1825]=nTile[193]; nChip[1826]=nTile[194]; nChip[1827]=nTile[195];
			hChip[1856]=hTile[192]; hChip[1857]=hTile[193]; hChip[1858]=hTile[194]; hChip[1859]=hTile[195];
			vChip[2848]=vTile[192]; vChip[2849]=vTile[193]; vChip[2850]=vTile[194]; vChip[2851]=vTile[195];
			aChip[2880]=aTile[192]; aChip[2881]=aTile[193]; aChip[2882]=aTile[194]; aChip[2883]=aTile[195];

			nChip[1828]=nTile[196]; nChip[1829]=nTile[197]; nChip[1830]=nTile[198]; nChip[1831]=nTile[199];
			hChip[1860]=hTile[196]; hChip[1861]=hTile[197]; hChip[1862]=hTile[198]; hChip[1863]=hTile[199];
			vChip[2852]=vTile[196]; vChip[2853]=vTile[197]; vChip[2854]=vTile[198]; vChip[2855]=vTile[199];
			aChip[2884]=aTile[196]; aChip[2885]=aTile[197]; aChip[2886]=aTile[198]; aChip[2887]=aTile[199];

			nChip[1832]=nTile[200]; nChip[1833]=nTile[201]; nChip[1834]=nTile[202]; nChip[1835]=nTile[203];
			hChip[1864]=hTile[200]; hChip[1865]=hTile[201]; hChip[1866]=hTile[202]; hChip[1867]=hTile[203];
			vChip[2856]=vTile[200]; vChip[2857]=vTile[201]; vChip[2858]=vTile[202]; vChip[2859]=vTile[203];
			aChip[2888]=aTile[200]; aChip[2889]=aTile[201]; aChip[2890]=aTile[202]; aChip[2891]=aTile[203];

			nChip[1836]=nTile[204]; nChip[1837]=nTile[205]; nChip[1838]=nTile[206]; nChip[1839]=nTile[207];
			hChip[1868]=hTile[204]; hChip[1869]=hTile[205]; hChip[1870]=hTile[206]; hChip[1871]=hTile[207];
			vChip[2860]=vTile[204]; vChip[2861]=vTile[205]; vChip[2862]=vTile[206]; vChip[2863]=vTile[207];
			aChip[2892]=aTile[204]; aChip[2893]=aTile[205]; aChip[2894]=aTile[206]; aChip[2895]=aTile[207];

			nChip[1840]=nTile[208]; nChip[1841]=nTile[209]; nChip[1842]=nTile[210]; nChip[1843]=nTile[211];
			hChip[1872]=hTile[208]; hChip[1873]=hTile[209]; hChip[1874]=hTile[210]; hChip[1875]=hTile[211];
			vChip[2864]=vTile[208]; vChip[2865]=vTile[209]; vChip[2866]=vTile[210]; vChip[2867]=vTile[211];
			aChip[2896]=aTile[208]; aChip[2897]=aTile[209]; aChip[2898]=aTile[210]; aChip[2899]=aTile[211];

			nChip[1844]=nTile[212]; nChip[1845]=nTile[213]; nChip[1846]=nTile[214]; nChip[1847]=nTile[215];
			hChip[1876]=hTile[212]; hChip[1877]=hTile[213]; hChip[1878]=hTile[214]; hChip[1879]=hTile[215];
			vChip[2868]=vTile[212]; vChip[2869]=vTile[213]; vChip[2870]=vTile[214]; vChip[2871]=vTile[215];
			aChip[2900]=aTile[212]; aChip[2901]=aTile[213]; aChip[2902]=aTile[214]; aChip[2903]=aTile[215];

			nChip[1848]=nTile[216]; nChip[1849]=nTile[217]; nChip[1850]=nTile[218]; nChip[1851]=nTile[219];
			hChip[1880]=hTile[216]; hChip[1881]=hTile[217]; hChip[1882]=hTile[218]; hChip[1883]=hTile[219];
			vChip[2872]=vTile[216]; vChip[2873]=vTile[217]; vChip[2874]=vTile[218]; vChip[2875]=vTile[219];
			aChip[2904]=aTile[216]; aChip[2905]=aTile[217]; aChip[2906]=aTile[218]; aChip[2907]=aTile[219];

			nChip[1852]=nTile[220]; nChip[1853]=nTile[221]; nChip[1854]=nTile[222]; nChip[1855]=nTile[223];
			hChip[1884]=hTile[220]; hChip[1885]=hTile[221]; hChip[1886]=hTile[222]; hChip[1887]=hTile[223];
			vChip[2876]=vTile[220]; vChip[2877]=vTile[221]; vChip[2878]=vTile[222]; vChip[2879]=vTile[223];
			aChip[2908]=aTile[220]; aChip[2909]=aTile[221]; aChip[2910]=aTile[222]; aChip[2911]=aTile[223];

			nChip[1952]=nTile[224]; nChip[1953]=nTile[225]; nChip[1954]=nTile[226]; nChip[1955]=nTile[227];
			hChip[1984]=hTile[224]; hChip[1985]=hTile[225]; hChip[1986]=hTile[226]; hChip[1987]=hTile[227];
			vChip[2976]=vTile[224]; vChip[2977]=vTile[225]; vChip[2978]=vTile[226]; vChip[2979]=vTile[227];
			aChip[3008]=aTile[224]; aChip[3009]=aTile[225]; aChip[3010]=aTile[226]; aChip[3011]=aTile[227];

			nChip[1956]=nTile[228]; nChip[1957]=nTile[229]; nChip[1958]=nTile[230]; nChip[1959]=nTile[231];
			hChip[1988]=hTile[228]; hChip[1989]=hTile[229]; hChip[1990]=hTile[230]; hChip[1991]=hTile[231];
			vChip[2980]=vTile[228]; vChip[2981]=vTile[229]; vChip[2982]=vTile[230]; vChip[2983]=vTile[231];
			aChip[3012]=aTile[228]; aChip[3013]=aTile[229]; aChip[3014]=aTile[230]; aChip[3015]=aTile[231];

			nChip[1960]=nTile[232]; nChip[1961]=nTile[233]; nChip[1962]=nTile[234]; nChip[1963]=nTile[235];
			hChip[1992]=hTile[232]; hChip[1993]=hTile[233]; hChip[1994]=hTile[234]; hChip[1995]=hTile[235];
			vChip[2984]=vTile[232]; vChip[2985]=vTile[233]; vChip[2986]=vTile[234]; vChip[2987]=vTile[235];
			aChip[3016]=aTile[232]; aChip[3017]=aTile[233]; aChip[3018]=aTile[234]; aChip[3019]=aTile[235];

			nChip[1964]=nTile[236]; nChip[1965]=nTile[237]; nChip[1966]=nTile[238]; nChip[1967]=nTile[239];
			hChip[1996]=hTile[236]; hChip[1997]=hTile[237]; hChip[1998]=hTile[238]; hChip[1999]=hTile[239];
			vChip[2988]=vTile[236]; vChip[2989]=vTile[237]; vChip[2990]=vTile[238]; vChip[2991]=vTile[239];
			aChip[3020]=aTile[236]; aChip[3021]=aTile[237]; aChip[3022]=aTile[238]; aChip[3023]=aTile[239];

			nChip[1968]=nTile[240]; nChip[1969]=nTile[241]; nChip[1970]=nTile[242]; nChip[1971]=nTile[243];
			hChip[2000]=hTile[240]; hChip[2001]=hTile[241]; hChip[2002]=hTile[242]; hChip[2003]=hTile[243];
			vChip[2992]=vTile[240]; vChip[2993]=vTile[241]; vChip[2994]=vTile[242]; vChip[2995]=vTile[243];
			aChip[3024]=aTile[240]; aChip[3025]=aTile[241]; aChip[3026]=aTile[242]; aChip[3027]=aTile[243];

			nChip[1972]=nTile[244]; nChip[1973]=nTile[245]; nChip[1974]=nTile[246]; nChip[1975]=nTile[247];
			hChip[2004]=hTile[244]; hChip[2005]=hTile[245]; hChip[2006]=hTile[246]; hChip[2007]=hTile[247];
			vChip[2996]=vTile[244]; vChip[2997]=vTile[245]; vChip[2998]=vTile[246]; vChip[2999]=vTile[247];
			aChip[3028]=aTile[244]; aChip[3029]=aTile[245]; aChip[3030]=aTile[246]; aChip[3031]=aTile[247];

			nChip[1976]=nTile[248]; nChip[1977]=nTile[249]; nChip[1978]=nTile[250]; nChip[1979]=nTile[251];
			hChip[2008]=hTile[248]; hChip[2009]=hTile[249]; hChip[2010]=hTile[250]; hChip[2011]=hTile[251];
			vChip[3000]=vTile[248]; vChip[3001]=vTile[249]; vChip[3002]=vTile[250]; vChip[3003]=vTile[251];
			aChip[3032]=aTile[248]; aChip[3033]=aTile[249]; aChip[3034]=aTile[250]; aChip[3035]=aTile[251];

			nChip[1980]=nTile[252]; nChip[1981]=nTile[253]; nChip[1982]=nTile[254]; nChip[1983]=nTile[255];
			hChip[2012]=hTile[252]; hChip[2013]=hTile[253]; hChip[2014]=hTile[254]; hChip[2015]=hTile[255];
			vChip[3004]=vTile[252]; vChip[3005]=vTile[253]; vChip[3006]=vTile[254]; vChip[3007]=vTile[255];
			aChip[3036]=aTile[252]; aChip[3037]=aTile[253]; aChip[3038]=aTile[254]; aChip[3039]=aTile[255];

			A = d[cOfst+12]; B = d[cOfst+13];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[1088]=nTile[0]; nChip[1089]=nTile[1]; nChip[1090]=nTile[2]; nChip[1091]=nTile[3];
			hChip[1056]=hTile[0]; hChip[1057]=hTile[1]; hChip[1058]=hTile[2]; hChip[1059]=hTile[3];
			vChip[2112]=vTile[0]; vChip[2113]=vTile[1]; vChip[2114]=vTile[2]; vChip[2115]=vTile[3];
			aChip[2080]=aTile[0]; aChip[2081]=aTile[1]; aChip[2082]=aTile[2]; aChip[2083]=aTile[3];

			nChip[1092]=nTile[4]; nChip[1093]=nTile[5]; nChip[1094]=nTile[6]; nChip[1095]=nTile[7];
			hChip[1060]=hTile[4]; hChip[1061]=hTile[5]; hChip[1062]=hTile[6]; hChip[1063]=hTile[7];
			vChip[2116]=vTile[4]; vChip[2117]=vTile[5]; vChip[2118]=vTile[6]; vChip[2119]=vTile[7];
			aChip[2084]=aTile[4]; aChip[2085]=aTile[5]; aChip[2086]=aTile[6]; aChip[2087]=aTile[7];

			nChip[1096]=nTile[8]; nChip[1097]=nTile[9]; nChip[1098]=nTile[10]; nChip[1099]=nTile[11];
			hChip[1064]=hTile[8]; hChip[1065]=hTile[9]; hChip[1066]=hTile[10]; hChip[1067]=hTile[11];
			vChip[2120]=vTile[8]; vChip[2121]=vTile[9]; vChip[2122]=vTile[10]; vChip[2123]=vTile[11];
			aChip[2088]=aTile[8]; aChip[2089]=aTile[9]; aChip[2090]=aTile[10]; aChip[2091]=aTile[11];

			nChip[1100]=nTile[12]; nChip[1101]=nTile[13]; nChip[1102]=nTile[14]; nChip[1103]=nTile[15];
			hChip[1068]=hTile[12]; hChip[1069]=hTile[13]; hChip[1070]=hTile[14]; hChip[1071]=hTile[15];
			vChip[2124]=vTile[12]; vChip[2125]=vTile[13]; vChip[2126]=vTile[14]; vChip[2127]=vTile[15];
			aChip[2092]=aTile[12]; aChip[2093]=aTile[13]; aChip[2094]=aTile[14]; aChip[2095]=aTile[15];

			nChip[1104]=nTile[16]; nChip[1105]=nTile[17]; nChip[1106]=nTile[18]; nChip[1107]=nTile[19];
			hChip[1072]=hTile[16]; hChip[1073]=hTile[17]; hChip[1074]=hTile[18]; hChip[1075]=hTile[19];
			vChip[2128]=vTile[16]; vChip[2129]=vTile[17]; vChip[2130]=vTile[18]; vChip[2131]=vTile[19];
			aChip[2096]=aTile[16]; aChip[2097]=aTile[17]; aChip[2098]=aTile[18]; aChip[2099]=aTile[19];

			nChip[1108]=nTile[20]; nChip[1109]=nTile[21]; nChip[1110]=nTile[22]; nChip[1111]=nTile[23];
			hChip[1076]=hTile[20]; hChip[1077]=hTile[21]; hChip[1078]=hTile[22]; hChip[1079]=hTile[23];
			vChip[2132]=vTile[20]; vChip[2133]=vTile[21]; vChip[2134]=vTile[22]; vChip[2135]=vTile[23];
			aChip[2100]=aTile[20]; aChip[2101]=aTile[21]; aChip[2102]=aTile[22]; aChip[2103]=aTile[23];

			nChip[1112]=nTile[24]; nChip[1113]=nTile[25]; nChip[1114]=nTile[26]; nChip[1115]=nTile[27];
			hChip[1080]=hTile[24]; hChip[1081]=hTile[25]; hChip[1082]=hTile[26]; hChip[1083]=hTile[27];
			vChip[2136]=vTile[24]; vChip[2137]=vTile[25]; vChip[2138]=vTile[26]; vChip[2139]=vTile[27];
			aChip[2104]=aTile[24]; aChip[2105]=aTile[25]; aChip[2106]=aTile[26]; aChip[2107]=aTile[27];

			nChip[1116]=nTile[28]; nChip[1117]=nTile[29]; nChip[1118]=nTile[30]; nChip[1119]=nTile[31];
			hChip[1084]=hTile[28]; hChip[1085]=hTile[29]; hChip[1086]=hTile[30]; hChip[1087]=hTile[31];
			vChip[2140]=vTile[28]; vChip[2141]=vTile[29]; vChip[2142]=vTile[30]; vChip[2143]=vTile[31];
			aChip[2108]=aTile[28]; aChip[2109]=aTile[29]; aChip[2110]=aTile[30]; aChip[2111]=aTile[31];

			nChip[1216]=nTile[32]; nChip[1217]=nTile[33]; nChip[1218]=nTile[34]; nChip[1219]=nTile[35];
			hChip[1184]=hTile[32]; hChip[1185]=hTile[33]; hChip[1186]=hTile[34]; hChip[1187]=hTile[35];
			vChip[2240]=vTile[32]; vChip[2241]=vTile[33]; vChip[2242]=vTile[34]; vChip[2243]=vTile[35];
			aChip[2208]=aTile[32]; aChip[2209]=aTile[33]; aChip[2210]=aTile[34]; aChip[2211]=aTile[35];

			nChip[1220]=nTile[36]; nChip[1221]=nTile[37]; nChip[1222]=nTile[38]; nChip[1223]=nTile[39];
			hChip[1188]=hTile[36]; hChip[1189]=hTile[37]; hChip[1190]=hTile[38]; hChip[1191]=hTile[39];
			vChip[2244]=vTile[36]; vChip[2245]=vTile[37]; vChip[2246]=vTile[38]; vChip[2247]=vTile[39];
			aChip[2212]=aTile[36]; aChip[2213]=aTile[37]; aChip[2214]=aTile[38]; aChip[2215]=aTile[39];

			nChip[1224]=nTile[40]; nChip[1225]=nTile[41]; nChip[1226]=nTile[42]; nChip[1227]=nTile[43];
			hChip[1192]=hTile[40]; hChip[1193]=hTile[41]; hChip[1194]=hTile[42]; hChip[1195]=hTile[43];
			vChip[2248]=vTile[40]; vChip[2249]=vTile[41]; vChip[2250]=vTile[42]; vChip[2251]=vTile[43];
			aChip[2216]=aTile[40]; aChip[2217]=aTile[41]; aChip[2218]=aTile[42]; aChip[2219]=aTile[43];

			nChip[1228]=nTile[44]; nChip[1229]=nTile[45]; nChip[1230]=nTile[46]; nChip[1231]=nTile[47];
			hChip[1196]=hTile[44]; hChip[1197]=hTile[45]; hChip[1198]=hTile[46]; hChip[1199]=hTile[47];
			vChip[2252]=vTile[44]; vChip[2253]=vTile[45]; vChip[2254]=vTile[46]; vChip[2255]=vTile[47];
			aChip[2220]=aTile[44]; aChip[2221]=aTile[45]; aChip[2222]=aTile[46]; aChip[2223]=aTile[47];

			nChip[1232]=nTile[48]; nChip[1233]=nTile[49]; nChip[1234]=nTile[50]; nChip[1235]=nTile[51];
			hChip[1200]=hTile[48]; hChip[1201]=hTile[49]; hChip[1202]=hTile[50]; hChip[1203]=hTile[51];
			vChip[2256]=vTile[48]; vChip[2257]=vTile[49]; vChip[2258]=vTile[50]; vChip[2259]=vTile[51];
			aChip[2224]=aTile[48]; aChip[2225]=aTile[49]; aChip[2226]=aTile[50]; aChip[2227]=aTile[51];

			nChip[1236]=nTile[52]; nChip[1237]=nTile[53]; nChip[1238]=nTile[54]; nChip[1239]=nTile[55];
			hChip[1204]=hTile[52]; hChip[1205]=hTile[53]; hChip[1206]=hTile[54]; hChip[1207]=hTile[55];
			vChip[2260]=vTile[52]; vChip[2261]=vTile[53]; vChip[2262]=vTile[54]; vChip[2263]=vTile[55];
			aChip[2228]=aTile[52]; aChip[2229]=aTile[53]; aChip[2230]=aTile[54]; aChip[2231]=aTile[55];

			nChip[1240]=nTile[56]; nChip[1241]=nTile[57]; nChip[1242]=nTile[58]; nChip[1243]=nTile[59];
			hChip[1208]=hTile[56]; hChip[1209]=hTile[57]; hChip[1210]=hTile[58]; hChip[1211]=hTile[59];
			vChip[2264]=vTile[56]; vChip[2265]=vTile[57]; vChip[2266]=vTile[58]; vChip[2267]=vTile[59];
			aChip[2232]=aTile[56]; aChip[2233]=aTile[57]; aChip[2234]=aTile[58]; aChip[2235]=aTile[59];

			nChip[1244]=nTile[60]; nChip[1245]=nTile[61]; nChip[1246]=nTile[62]; nChip[1247]=nTile[63];
			hChip[1212]=hTile[60]; hChip[1213]=hTile[61]; hChip[1214]=hTile[62]; hChip[1215]=hTile[63];
			vChip[2268]=vTile[60]; vChip[2269]=vTile[61]; vChip[2270]=vTile[62]; vChip[2271]=vTile[63];
			aChip[2236]=aTile[60]; aChip[2237]=aTile[61]; aChip[2238]=aTile[62]; aChip[2239]=aTile[63];

			nChip[1344]=nTile[64]; nChip[1345]=nTile[65]; nChip[1346]=nTile[66]; nChip[1347]=nTile[67];
			hChip[1312]=hTile[64]; hChip[1313]=hTile[65]; hChip[1314]=hTile[66]; hChip[1315]=hTile[67];
			vChip[2368]=vTile[64]; vChip[2369]=vTile[65]; vChip[2370]=vTile[66]; vChip[2371]=vTile[67];
			aChip[2336]=aTile[64]; aChip[2337]=aTile[65]; aChip[2338]=aTile[66]; aChip[2339]=aTile[67];

			nChip[1348]=nTile[68]; nChip[1349]=nTile[69]; nChip[1350]=nTile[70]; nChip[1351]=nTile[71];
			hChip[1316]=hTile[68]; hChip[1317]=hTile[69]; hChip[1318]=hTile[70]; hChip[1319]=hTile[71];
			vChip[2372]=vTile[68]; vChip[2373]=vTile[69]; vChip[2374]=vTile[70]; vChip[2375]=vTile[71];
			aChip[2340]=aTile[68]; aChip[2341]=aTile[69]; aChip[2342]=aTile[70]; aChip[2343]=aTile[71];

			nChip[1352]=nTile[72]; nChip[1353]=nTile[73]; nChip[1354]=nTile[74]; nChip[1355]=nTile[75];
			hChip[1320]=hTile[72]; hChip[1321]=hTile[73]; hChip[1322]=hTile[74]; hChip[1323]=hTile[75];
			vChip[2376]=vTile[72]; vChip[2377]=vTile[73]; vChip[2378]=vTile[74]; vChip[2379]=vTile[75];
			aChip[2344]=aTile[72]; aChip[2345]=aTile[73]; aChip[2346]=aTile[74]; aChip[2347]=aTile[75];

			nChip[1356]=nTile[76]; nChip[1357]=nTile[77]; nChip[1358]=nTile[78]; nChip[1359]=nTile[79];
			hChip[1324]=hTile[76]; hChip[1325]=hTile[77]; hChip[1326]=hTile[78]; hChip[1327]=hTile[79];
			vChip[2380]=vTile[76]; vChip[2381]=vTile[77]; vChip[2382]=vTile[78]; vChip[2383]=vTile[79];
			aChip[2348]=aTile[76]; aChip[2349]=aTile[77]; aChip[2350]=aTile[78]; aChip[2351]=aTile[79];

			nChip[1360]=nTile[80]; nChip[1361]=nTile[81]; nChip[1362]=nTile[82]; nChip[1363]=nTile[83];
			hChip[1328]=hTile[80]; hChip[1329]=hTile[81]; hChip[1330]=hTile[82]; hChip[1331]=hTile[83];
			vChip[2384]=vTile[80]; vChip[2385]=vTile[81]; vChip[2386]=vTile[82]; vChip[2387]=vTile[83];
			aChip[2352]=aTile[80]; aChip[2353]=aTile[81]; aChip[2354]=aTile[82]; aChip[2355]=aTile[83];

			nChip[1364]=nTile[84]; nChip[1365]=nTile[85]; nChip[1366]=nTile[86]; nChip[1367]=nTile[87];
			hChip[1332]=hTile[84]; hChip[1333]=hTile[85]; hChip[1334]=hTile[86]; hChip[1335]=hTile[87];
			vChip[2388]=vTile[84]; vChip[2389]=vTile[85]; vChip[2390]=vTile[86]; vChip[2391]=vTile[87];
			aChip[2356]=aTile[84]; aChip[2357]=aTile[85]; aChip[2358]=aTile[86]; aChip[2359]=aTile[87];

			nChip[1368]=nTile[88]; nChip[1369]=nTile[89]; nChip[1370]=nTile[90]; nChip[1371]=nTile[91];
			hChip[1336]=hTile[88]; hChip[1337]=hTile[89]; hChip[1338]=hTile[90]; hChip[1339]=hTile[91];
			vChip[2392]=vTile[88]; vChip[2393]=vTile[89]; vChip[2394]=vTile[90]; vChip[2395]=vTile[91];
			aChip[2360]=aTile[88]; aChip[2361]=aTile[89]; aChip[2362]=aTile[90]; aChip[2363]=aTile[91];

			nChip[1372]=nTile[92]; nChip[1373]=nTile[93]; nChip[1374]=nTile[94]; nChip[1375]=nTile[95];
			hChip[1340]=hTile[92]; hChip[1341]=hTile[93]; hChip[1342]=hTile[94]; hChip[1343]=hTile[95];
			vChip[2396]=vTile[92]; vChip[2397]=vTile[93]; vChip[2398]=vTile[94]; vChip[2399]=vTile[95];
			aChip[2364]=aTile[92]; aChip[2365]=aTile[93]; aChip[2366]=aTile[94]; aChip[2367]=aTile[95];

			nChip[1472]=nTile[96]; nChip[1473]=nTile[97]; nChip[1474]=nTile[98]; nChip[1475]=nTile[99];
			hChip[1440]=hTile[96]; hChip[1441]=hTile[97]; hChip[1442]=hTile[98]; hChip[1443]=hTile[99];
			vChip[2496]=vTile[96]; vChip[2497]=vTile[97]; vChip[2498]=vTile[98]; vChip[2499]=vTile[99];
			aChip[2464]=aTile[96]; aChip[2465]=aTile[97]; aChip[2466]=aTile[98]; aChip[2467]=aTile[99];

			nChip[1476]=nTile[100]; nChip[1477]=nTile[101]; nChip[1478]=nTile[102]; nChip[1479]=nTile[103];
			hChip[1444]=hTile[100]; hChip[1445]=hTile[101]; hChip[1446]=hTile[102]; hChip[1447]=hTile[103];
			vChip[2500]=vTile[100]; vChip[2501]=vTile[101]; vChip[2502]=vTile[102]; vChip[2503]=vTile[103];
			aChip[2468]=aTile[100]; aChip[2469]=aTile[101]; aChip[2470]=aTile[102]; aChip[2471]=aTile[103];

			nChip[1480]=nTile[104]; nChip[1481]=nTile[105]; nChip[1482]=nTile[106]; nChip[1483]=nTile[107];
			hChip[1448]=hTile[104]; hChip[1449]=hTile[105]; hChip[1450]=hTile[106]; hChip[1451]=hTile[107];
			vChip[2504]=vTile[104]; vChip[2505]=vTile[105]; vChip[2506]=vTile[106]; vChip[2507]=vTile[107];
			aChip[2472]=aTile[104]; aChip[2473]=aTile[105]; aChip[2474]=aTile[106]; aChip[2475]=aTile[107];

			nChip[1484]=nTile[108]; nChip[1485]=nTile[109]; nChip[1486]=nTile[110]; nChip[1487]=nTile[111];
			hChip[1452]=hTile[108]; hChip[1453]=hTile[109]; hChip[1454]=hTile[110]; hChip[1455]=hTile[111];
			vChip[2508]=vTile[108]; vChip[2509]=vTile[109]; vChip[2510]=vTile[110]; vChip[2511]=vTile[111];
			aChip[2476]=aTile[108]; aChip[2477]=aTile[109]; aChip[2478]=aTile[110]; aChip[2479]=aTile[111];

			nChip[1488]=nTile[112]; nChip[1489]=nTile[113]; nChip[1490]=nTile[114]; nChip[1491]=nTile[115];
			hChip[1456]=hTile[112]; hChip[1457]=hTile[113]; hChip[1458]=hTile[114]; hChip[1459]=hTile[115];
			vChip[2512]=vTile[112]; vChip[2513]=vTile[113]; vChip[2514]=vTile[114]; vChip[2515]=vTile[115];
			aChip[2480]=aTile[112]; aChip[2481]=aTile[113]; aChip[2482]=aTile[114]; aChip[2483]=aTile[115];

			nChip[1492]=nTile[116]; nChip[1493]=nTile[117]; nChip[1494]=nTile[118]; nChip[1495]=nTile[119];
			hChip[1460]=hTile[116]; hChip[1461]=hTile[117]; hChip[1462]=hTile[118]; hChip[1463]=hTile[119];
			vChip[2516]=vTile[116]; vChip[2517]=vTile[117]; vChip[2518]=vTile[118]; vChip[2519]=vTile[119];
			aChip[2484]=aTile[116]; aChip[2485]=aTile[117]; aChip[2486]=aTile[118]; aChip[2487]=aTile[119];

			nChip[1496]=nTile[120]; nChip[1497]=nTile[121]; nChip[1498]=nTile[122]; nChip[1499]=nTile[123];
			hChip[1464]=hTile[120]; hChip[1465]=hTile[121]; hChip[1466]=hTile[122]; hChip[1467]=hTile[123];
			vChip[2520]=vTile[120]; vChip[2521]=vTile[121]; vChip[2522]=vTile[122]; vChip[2523]=vTile[123];
			aChip[2488]=aTile[120]; aChip[2489]=aTile[121]; aChip[2490]=aTile[122]; aChip[2491]=aTile[123];

			nChip[1500]=nTile[124]; nChip[1501]=nTile[125]; nChip[1502]=nTile[126]; nChip[1503]=nTile[127];
			hChip[1468]=hTile[124]; hChip[1469]=hTile[125]; hChip[1470]=hTile[126]; hChip[1471]=hTile[127];
			vChip[2524]=vTile[124]; vChip[2525]=vTile[125]; vChip[2526]=vTile[126]; vChip[2527]=vTile[127];
			aChip[2492]=aTile[124]; aChip[2493]=aTile[125]; aChip[2494]=aTile[126]; aChip[2495]=aTile[127];

			nChip[1600]=nTile[128]; nChip[1601]=nTile[129]; nChip[1602]=nTile[130]; nChip[1603]=nTile[131];
			hChip[1568]=hTile[128]; hChip[1569]=hTile[129]; hChip[1570]=hTile[130]; hChip[1571]=hTile[131];
			vChip[2624]=vTile[128]; vChip[2625]=vTile[129]; vChip[2626]=vTile[130]; vChip[2627]=vTile[131];
			aChip[2592]=aTile[128]; aChip[2593]=aTile[129]; aChip[2594]=aTile[130]; aChip[2595]=aTile[131];

			nChip[1604]=nTile[132]; nChip[1605]=nTile[133]; nChip[1606]=nTile[134]; nChip[1607]=nTile[135];
			hChip[1572]=hTile[132]; hChip[1573]=hTile[133]; hChip[1574]=hTile[134]; hChip[1575]=hTile[135];
			vChip[2628]=vTile[132]; vChip[2629]=vTile[133]; vChip[2630]=vTile[134]; vChip[2631]=vTile[135];
			aChip[2596]=aTile[132]; aChip[2597]=aTile[133]; aChip[2598]=aTile[134]; aChip[2599]=aTile[135];

			nChip[1608]=nTile[136]; nChip[1609]=nTile[137]; nChip[1610]=nTile[138]; nChip[1611]=nTile[139];
			hChip[1576]=hTile[136]; hChip[1577]=hTile[137]; hChip[1578]=hTile[138]; hChip[1579]=hTile[139];
			vChip[2632]=vTile[136]; vChip[2633]=vTile[137]; vChip[2634]=vTile[138]; vChip[2635]=vTile[139];
			aChip[2600]=aTile[136]; aChip[2601]=aTile[137]; aChip[2602]=aTile[138]; aChip[2603]=aTile[139];

			nChip[1612]=nTile[140]; nChip[1613]=nTile[141]; nChip[1614]=nTile[142]; nChip[1615]=nTile[143];
			hChip[1580]=hTile[140]; hChip[1581]=hTile[141]; hChip[1582]=hTile[142]; hChip[1583]=hTile[143];
			vChip[2636]=vTile[140]; vChip[2637]=vTile[141]; vChip[2638]=vTile[142]; vChip[2639]=vTile[143];
			aChip[2604]=aTile[140]; aChip[2605]=aTile[141]; aChip[2606]=aTile[142]; aChip[2607]=aTile[143];

			nChip[1616]=nTile[144]; nChip[1617]=nTile[145]; nChip[1618]=nTile[146]; nChip[1619]=nTile[147];
			hChip[1584]=hTile[144]; hChip[1585]=hTile[145]; hChip[1586]=hTile[146]; hChip[1587]=hTile[147];
			vChip[2640]=vTile[144]; vChip[2641]=vTile[145]; vChip[2642]=vTile[146]; vChip[2643]=vTile[147];
			aChip[2608]=aTile[144]; aChip[2609]=aTile[145]; aChip[2610]=aTile[146]; aChip[2611]=aTile[147];

			nChip[1620]=nTile[148]; nChip[1621]=nTile[149]; nChip[1622]=nTile[150]; nChip[1623]=nTile[151];
			hChip[1588]=hTile[148]; hChip[1589]=hTile[149]; hChip[1590]=hTile[150]; hChip[1591]=hTile[151];
			vChip[2644]=vTile[148]; vChip[2645]=vTile[149]; vChip[2646]=vTile[150]; vChip[2647]=vTile[151];
			aChip[2612]=aTile[148]; aChip[2613]=aTile[149]; aChip[2614]=aTile[150]; aChip[2615]=aTile[151];

			nChip[1624]=nTile[152]; nChip[1625]=nTile[153]; nChip[1626]=nTile[154]; nChip[1627]=nTile[155];
			hChip[1592]=hTile[152]; hChip[1593]=hTile[153]; hChip[1594]=hTile[154]; hChip[1595]=hTile[155];
			vChip[2648]=vTile[152]; vChip[2649]=vTile[153]; vChip[2650]=vTile[154]; vChip[2651]=vTile[155];
			aChip[2616]=aTile[152]; aChip[2617]=aTile[153]; aChip[2618]=aTile[154]; aChip[2619]=aTile[155];

			nChip[1628]=nTile[156]; nChip[1629]=nTile[157]; nChip[1630]=nTile[158]; nChip[1631]=nTile[159];
			hChip[1596]=hTile[156]; hChip[1597]=hTile[157]; hChip[1598]=hTile[158]; hChip[1599]=hTile[159];
			vChip[2652]=vTile[156]; vChip[2653]=vTile[157]; vChip[2654]=vTile[158]; vChip[2655]=vTile[159];
			aChip[2620]=aTile[156]; aChip[2621]=aTile[157]; aChip[2622]=aTile[158]; aChip[2623]=aTile[159];

			nChip[1728]=nTile[160]; nChip[1729]=nTile[161]; nChip[1730]=nTile[162]; nChip[1731]=nTile[163];
			hChip[1696]=hTile[160]; hChip[1697]=hTile[161]; hChip[1698]=hTile[162]; hChip[1699]=hTile[163];
			vChip[2752]=vTile[160]; vChip[2753]=vTile[161]; vChip[2754]=vTile[162]; vChip[2755]=vTile[163];
			aChip[2720]=aTile[160]; aChip[2721]=aTile[161]; aChip[2722]=aTile[162]; aChip[2723]=aTile[163];

			nChip[1732]=nTile[164]; nChip[1733]=nTile[165]; nChip[1734]=nTile[166]; nChip[1735]=nTile[167];
			hChip[1700]=hTile[164]; hChip[1701]=hTile[165]; hChip[1702]=hTile[166]; hChip[1703]=hTile[167];
			vChip[2756]=vTile[164]; vChip[2757]=vTile[165]; vChip[2758]=vTile[166]; vChip[2759]=vTile[167];
			aChip[2724]=aTile[164]; aChip[2725]=aTile[165]; aChip[2726]=aTile[166]; aChip[2727]=aTile[167];

			nChip[1736]=nTile[168]; nChip[1737]=nTile[169]; nChip[1738]=nTile[170]; nChip[1739]=nTile[171];
			hChip[1704]=hTile[168]; hChip[1705]=hTile[169]; hChip[1706]=hTile[170]; hChip[1707]=hTile[171];
			vChip[2760]=vTile[168]; vChip[2761]=vTile[169]; vChip[2762]=vTile[170]; vChip[2763]=vTile[171];
			aChip[2728]=aTile[168]; aChip[2729]=aTile[169]; aChip[2730]=aTile[170]; aChip[2731]=aTile[171];

			nChip[1740]=nTile[172]; nChip[1741]=nTile[173]; nChip[1742]=nTile[174]; nChip[1743]=nTile[175];
			hChip[1708]=hTile[172]; hChip[1709]=hTile[173]; hChip[1710]=hTile[174]; hChip[1711]=hTile[175];
			vChip[2764]=vTile[172]; vChip[2765]=vTile[173]; vChip[2766]=vTile[174]; vChip[2767]=vTile[175];
			aChip[2732]=aTile[172]; aChip[2733]=aTile[173]; aChip[2734]=aTile[174]; aChip[2735]=aTile[175];

			nChip[1744]=nTile[176]; nChip[1745]=nTile[177]; nChip[1746]=nTile[178]; nChip[1747]=nTile[179];
			hChip[1712]=hTile[176]; hChip[1713]=hTile[177]; hChip[1714]=hTile[178]; hChip[1715]=hTile[179];
			vChip[2768]=vTile[176]; vChip[2769]=vTile[177]; vChip[2770]=vTile[178]; vChip[2771]=vTile[179];
			aChip[2736]=aTile[176]; aChip[2737]=aTile[177]; aChip[2738]=aTile[178]; aChip[2739]=aTile[179];

			nChip[1748]=nTile[180]; nChip[1749]=nTile[181]; nChip[1750]=nTile[182]; nChip[1751]=nTile[183];
			hChip[1716]=hTile[180]; hChip[1717]=hTile[181]; hChip[1718]=hTile[182]; hChip[1719]=hTile[183];
			vChip[2772]=vTile[180]; vChip[2773]=vTile[181]; vChip[2774]=vTile[182]; vChip[2775]=vTile[183];
			aChip[2740]=aTile[180]; aChip[2741]=aTile[181]; aChip[2742]=aTile[182]; aChip[2743]=aTile[183];

			nChip[1752]=nTile[184]; nChip[1753]=nTile[185]; nChip[1754]=nTile[186]; nChip[1755]=nTile[187];
			hChip[1720]=hTile[184]; hChip[1721]=hTile[185]; hChip[1722]=hTile[186]; hChip[1723]=hTile[187];
			vChip[2776]=vTile[184]; vChip[2777]=vTile[185]; vChip[2778]=vTile[186]; vChip[2779]=vTile[187];
			aChip[2744]=aTile[184]; aChip[2745]=aTile[185]; aChip[2746]=aTile[186]; aChip[2747]=aTile[187];

			nChip[1756]=nTile[188]; nChip[1757]=nTile[189]; nChip[1758]=nTile[190]; nChip[1759]=nTile[191];
			hChip[1724]=hTile[188]; hChip[1725]=hTile[189]; hChip[1726]=hTile[190]; hChip[1727]=hTile[191];
			vChip[2780]=vTile[188]; vChip[2781]=vTile[189]; vChip[2782]=vTile[190]; vChip[2783]=vTile[191];
			aChip[2748]=aTile[188]; aChip[2749]=aTile[189]; aChip[2750]=aTile[190]; aChip[2751]=aTile[191];

			nChip[1856]=nTile[192]; nChip[1857]=nTile[193]; nChip[1858]=nTile[194]; nChip[1859]=nTile[195];
			hChip[1824]=hTile[192]; hChip[1825]=hTile[193]; hChip[1826]=hTile[194]; hChip[1827]=hTile[195];
			vChip[2880]=vTile[192]; vChip[2881]=vTile[193]; vChip[2882]=vTile[194]; vChip[2883]=vTile[195];
			aChip[2848]=aTile[192]; aChip[2849]=aTile[193]; aChip[2850]=aTile[194]; aChip[2851]=aTile[195];

			nChip[1860]=nTile[196]; nChip[1861]=nTile[197]; nChip[1862]=nTile[198]; nChip[1863]=nTile[199];
			hChip[1828]=hTile[196]; hChip[1829]=hTile[197]; hChip[1830]=hTile[198]; hChip[1831]=hTile[199];
			vChip[2884]=vTile[196]; vChip[2885]=vTile[197]; vChip[2886]=vTile[198]; vChip[2887]=vTile[199];
			aChip[2852]=aTile[196]; aChip[2853]=aTile[197]; aChip[2854]=aTile[198]; aChip[2855]=aTile[199];

			nChip[1864]=nTile[200]; nChip[1865]=nTile[201]; nChip[1866]=nTile[202]; nChip[1867]=nTile[203];
			hChip[1832]=hTile[200]; hChip[1833]=hTile[201]; hChip[1834]=hTile[202]; hChip[1835]=hTile[203];
			vChip[2888]=vTile[200]; vChip[2889]=vTile[201]; vChip[2890]=vTile[202]; vChip[2891]=vTile[203];
			aChip[2856]=aTile[200]; aChip[2857]=aTile[201]; aChip[2858]=aTile[202]; aChip[2859]=aTile[203];

			nChip[1868]=nTile[204]; nChip[1869]=nTile[205]; nChip[1870]=nTile[206]; nChip[1871]=nTile[207];
			hChip[1836]=hTile[204]; hChip[1837]=hTile[205]; hChip[1838]=hTile[206]; hChip[1839]=hTile[207];
			vChip[2892]=vTile[204]; vChip[2893]=vTile[205]; vChip[2894]=vTile[206]; vChip[2895]=vTile[207];
			aChip[2860]=aTile[204]; aChip[2861]=aTile[205]; aChip[2862]=aTile[206]; aChip[2863]=aTile[207];

			nChip[1872]=nTile[208]; nChip[1873]=nTile[209]; nChip[1874]=nTile[210]; nChip[1875]=nTile[211];
			hChip[1840]=hTile[208]; hChip[1841]=hTile[209]; hChip[1842]=hTile[210]; hChip[1843]=hTile[211];
			vChip[2896]=vTile[208]; vChip[2897]=vTile[209]; vChip[2898]=vTile[210]; vChip[2899]=vTile[211];
			aChip[2864]=aTile[208]; aChip[2865]=aTile[209]; aChip[2866]=aTile[210]; aChip[2867]=aTile[211];

			nChip[1876]=nTile[212]; nChip[1877]=nTile[213]; nChip[1878]=nTile[214]; nChip[1879]=nTile[215];
			hChip[1844]=hTile[212]; hChip[1845]=hTile[213]; hChip[1846]=hTile[214]; hChip[1847]=hTile[215];
			vChip[2900]=vTile[212]; vChip[2901]=vTile[213]; vChip[2902]=vTile[214]; vChip[2903]=vTile[215];
			aChip[2868]=aTile[212]; aChip[2869]=aTile[213]; aChip[2870]=aTile[214]; aChip[2871]=aTile[215];

			nChip[1880]=nTile[216]; nChip[1881]=nTile[217]; nChip[1882]=nTile[218]; nChip[1883]=nTile[219];
			hChip[1848]=hTile[216]; hChip[1849]=hTile[217]; hChip[1850]=hTile[218]; hChip[1851]=hTile[219];
			vChip[2904]=vTile[216]; vChip[2905]=vTile[217]; vChip[2906]=vTile[218]; vChip[2907]=vTile[219];
			aChip[2872]=aTile[216]; aChip[2873]=aTile[217]; aChip[2874]=aTile[218]; aChip[2875]=aTile[219];

			nChip[1884]=nTile[220]; nChip[1885]=nTile[221]; nChip[1886]=nTile[222]; nChip[1887]=nTile[223];
			hChip[1852]=hTile[220]; hChip[1853]=hTile[221]; hChip[1854]=hTile[222]; hChip[1855]=hTile[223];
			vChip[2908]=vTile[220]; vChip[2909]=vTile[221]; vChip[2910]=vTile[222]; vChip[2911]=vTile[223];
			aChip[2876]=aTile[220]; aChip[2877]=aTile[221]; aChip[2878]=aTile[222]; aChip[2879]=aTile[223];

			nChip[1984]=nTile[224]; nChip[1985]=nTile[225]; nChip[1986]=nTile[226]; nChip[1987]=nTile[227];
			hChip[1952]=hTile[224]; hChip[1953]=hTile[225]; hChip[1954]=hTile[226]; hChip[1955]=hTile[227];
			vChip[3008]=vTile[224]; vChip[3009]=vTile[225]; vChip[3010]=vTile[226]; vChip[3011]=vTile[227];
			aChip[2976]=aTile[224]; aChip[2977]=aTile[225]; aChip[2978]=aTile[226]; aChip[2979]=aTile[227];

			nChip[1988]=nTile[228]; nChip[1989]=nTile[229]; nChip[1990]=nTile[230]; nChip[1991]=nTile[231];
			hChip[1956]=hTile[228]; hChip[1957]=hTile[229]; hChip[1958]=hTile[230]; hChip[1959]=hTile[231];
			vChip[3012]=vTile[228]; vChip[3013]=vTile[229]; vChip[3014]=vTile[230]; vChip[3015]=vTile[231];
			aChip[2980]=aTile[228]; aChip[2981]=aTile[229]; aChip[2982]=aTile[230]; aChip[2983]=aTile[231];

			nChip[1992]=nTile[232]; nChip[1993]=nTile[233]; nChip[1994]=nTile[234]; nChip[1995]=nTile[235];
			hChip[1960]=hTile[232]; hChip[1961]=hTile[233]; hChip[1962]=hTile[234]; hChip[1963]=hTile[235];
			vChip[3016]=vTile[232]; vChip[3017]=vTile[233]; vChip[3018]=vTile[234]; vChip[3019]=vTile[235];
			aChip[2984]=aTile[232]; aChip[2985]=aTile[233]; aChip[2986]=aTile[234]; aChip[2987]=aTile[235];

			nChip[1996]=nTile[236]; nChip[1997]=nTile[237]; nChip[1998]=nTile[238]; nChip[1999]=nTile[239];
			hChip[1964]=hTile[236]; hChip[1965]=hTile[237]; hChip[1966]=hTile[238]; hChip[1967]=hTile[239];
			vChip[3020]=vTile[236]; vChip[3021]=vTile[237]; vChip[3022]=vTile[238]; vChip[3023]=vTile[239];
			aChip[2988]=aTile[236]; aChip[2989]=aTile[237]; aChip[2990]=aTile[238]; aChip[2991]=aTile[239];

			nChip[2000]=nTile[240]; nChip[2001]=nTile[241]; nChip[2002]=nTile[242]; nChip[2003]=nTile[243];
			hChip[1968]=hTile[240]; hChip[1969]=hTile[241]; hChip[1970]=hTile[242]; hChip[1971]=hTile[243];
			vChip[3024]=vTile[240]; vChip[3025]=vTile[241]; vChip[3026]=vTile[242]; vChip[3027]=vTile[243];
			aChip[2992]=aTile[240]; aChip[2993]=aTile[241]; aChip[2994]=aTile[242]; aChip[2995]=aTile[243];

			nChip[2004]=nTile[244]; nChip[2005]=nTile[245]; nChip[2006]=nTile[246]; nChip[2007]=nTile[247];
			hChip[1972]=hTile[244]; hChip[1973]=hTile[245]; hChip[1974]=hTile[246]; hChip[1975]=hTile[247];
			vChip[3028]=vTile[244]; vChip[3029]=vTile[245]; vChip[3030]=vTile[246]; vChip[3031]=vTile[247];
			aChip[2996]=aTile[244]; aChip[2997]=aTile[245]; aChip[2998]=aTile[246]; aChip[2999]=aTile[247];

			nChip[2008]=nTile[248]; nChip[2009]=nTile[249]; nChip[2010]=nTile[250]; nChip[2011]=nTile[251];
			hChip[1976]=hTile[248]; hChip[1977]=hTile[249]; hChip[1978]=hTile[250]; hChip[1979]=hTile[251];
			vChip[3032]=vTile[248]; vChip[3033]=vTile[249]; vChip[3034]=vTile[250]; vChip[3035]=vTile[251];
			aChip[3000]=aTile[248]; aChip[3001]=aTile[249]; aChip[3002]=aTile[250]; aChip[3003]=aTile[251];

			nChip[2012]=nTile[252]; nChip[2013]=nTile[253]; nChip[2014]=nTile[254]; nChip[2015]=nTile[255];
			hChip[1980]=hTile[252]; hChip[1981]=hTile[253]; hChip[1982]=hTile[254]; hChip[1983]=hTile[255];
			vChip[3036]=vTile[252]; vChip[3037]=vTile[253]; vChip[3038]=vTile[254]; vChip[3039]=vTile[255];
			aChip[3004]=aTile[252]; aChip[3005]=aTile[253]; aChip[3006]=aTile[254]; aChip[3007]=aTile[255];

			A = d[cOfst+14]; B = d[cOfst+15];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[1120]=nTile[0]; nChip[1121]=nTile[1]; nChip[1122]=nTile[2]; nChip[1123]=nTile[3];
			hChip[1024]=hTile[0]; hChip[1025]=hTile[1]; hChip[1026]=hTile[2]; hChip[1027]=hTile[3];
			vChip[2144]=vTile[0]; vChip[2145]=vTile[1]; vChip[2146]=vTile[2]; vChip[2147]=vTile[3];
			aChip[2048]=aTile[0]; aChip[2049]=aTile[1]; aChip[2050]=aTile[2]; aChip[2051]=aTile[3];

			nChip[1124]=nTile[4]; nChip[1125]=nTile[5]; nChip[1126]=nTile[6]; nChip[1127]=nTile[7];
			hChip[1028]=hTile[4]; hChip[1029]=hTile[5]; hChip[1030]=hTile[6]; hChip[1031]=hTile[7];
			vChip[2148]=vTile[4]; vChip[2149]=vTile[5]; vChip[2150]=vTile[6]; vChip[2151]=vTile[7];
			aChip[2052]=aTile[4]; aChip[2053]=aTile[5]; aChip[2054]=aTile[6]; aChip[2055]=aTile[7];

			nChip[1128]=nTile[8]; nChip[1129]=nTile[9]; nChip[1130]=nTile[10]; nChip[1131]=nTile[11];
			hChip[1032]=hTile[8]; hChip[1033]=hTile[9]; hChip[1034]=hTile[10]; hChip[1035]=hTile[11];
			vChip[2152]=vTile[8]; vChip[2153]=vTile[9]; vChip[2154]=vTile[10]; vChip[2155]=vTile[11];
			aChip[2056]=aTile[8]; aChip[2057]=aTile[9]; aChip[2058]=aTile[10]; aChip[2059]=aTile[11];

			nChip[1132]=nTile[12]; nChip[1133]=nTile[13]; nChip[1134]=nTile[14]; nChip[1135]=nTile[15];
			hChip[1036]=hTile[12]; hChip[1037]=hTile[13]; hChip[1038]=hTile[14]; hChip[1039]=hTile[15];
			vChip[2156]=vTile[12]; vChip[2157]=vTile[13]; vChip[2158]=vTile[14]; vChip[2159]=vTile[15];
			aChip[2060]=aTile[12]; aChip[2061]=aTile[13]; aChip[2062]=aTile[14]; aChip[2063]=aTile[15];

			nChip[1136]=nTile[16]; nChip[1137]=nTile[17]; nChip[1138]=nTile[18]; nChip[1139]=nTile[19];
			hChip[1040]=hTile[16]; hChip[1041]=hTile[17]; hChip[1042]=hTile[18]; hChip[1043]=hTile[19];
			vChip[2160]=vTile[16]; vChip[2161]=vTile[17]; vChip[2162]=vTile[18]; vChip[2163]=vTile[19];
			aChip[2064]=aTile[16]; aChip[2065]=aTile[17]; aChip[2066]=aTile[18]; aChip[2067]=aTile[19];

			nChip[1140]=nTile[20]; nChip[1141]=nTile[21]; nChip[1142]=nTile[22]; nChip[1143]=nTile[23];
			hChip[1044]=hTile[20]; hChip[1045]=hTile[21]; hChip[1046]=hTile[22]; hChip[1047]=hTile[23];
			vChip[2164]=vTile[20]; vChip[2165]=vTile[21]; vChip[2166]=vTile[22]; vChip[2167]=vTile[23];
			aChip[2068]=aTile[20]; aChip[2069]=aTile[21]; aChip[2070]=aTile[22]; aChip[2071]=aTile[23];

			nChip[1144]=nTile[24]; nChip[1145]=nTile[25]; nChip[1146]=nTile[26]; nChip[1147]=nTile[27];
			hChip[1048]=hTile[24]; hChip[1049]=hTile[25]; hChip[1050]=hTile[26]; hChip[1051]=hTile[27];
			vChip[2168]=vTile[24]; vChip[2169]=vTile[25]; vChip[2170]=vTile[26]; vChip[2171]=vTile[27];
			aChip[2072]=aTile[24]; aChip[2073]=aTile[25]; aChip[2074]=aTile[26]; aChip[2075]=aTile[27];

			nChip[1148]=nTile[28]; nChip[1149]=nTile[29]; nChip[1150]=nTile[30]; nChip[1151]=nTile[31];
			hChip[1052]=hTile[28]; hChip[1053]=hTile[29]; hChip[1054]=hTile[30]; hChip[1055]=hTile[31];
			vChip[2172]=vTile[28]; vChip[2173]=vTile[29]; vChip[2174]=vTile[30]; vChip[2175]=vTile[31];
			aChip[2076]=aTile[28]; aChip[2077]=aTile[29]; aChip[2078]=aTile[30]; aChip[2079]=aTile[31];

			nChip[1248]=nTile[32]; nChip[1249]=nTile[33]; nChip[1250]=nTile[34]; nChip[1251]=nTile[35];
			hChip[1152]=hTile[32]; hChip[1153]=hTile[33]; hChip[1154]=hTile[34]; hChip[1155]=hTile[35];
			vChip[2272]=vTile[32]; vChip[2273]=vTile[33]; vChip[2274]=vTile[34]; vChip[2275]=vTile[35];
			aChip[2176]=aTile[32]; aChip[2177]=aTile[33]; aChip[2178]=aTile[34]; aChip[2179]=aTile[35];

			nChip[1252]=nTile[36]; nChip[1253]=nTile[37]; nChip[1254]=nTile[38]; nChip[1255]=nTile[39];
			hChip[1156]=hTile[36]; hChip[1157]=hTile[37]; hChip[1158]=hTile[38]; hChip[1159]=hTile[39];
			vChip[2276]=vTile[36]; vChip[2277]=vTile[37]; vChip[2278]=vTile[38]; vChip[2279]=vTile[39];
			aChip[2180]=aTile[36]; aChip[2181]=aTile[37]; aChip[2182]=aTile[38]; aChip[2183]=aTile[39];

			nChip[1256]=nTile[40]; nChip[1257]=nTile[41]; nChip[1258]=nTile[42]; nChip[1259]=nTile[43];
			hChip[1160]=hTile[40]; hChip[1161]=hTile[41]; hChip[1162]=hTile[42]; hChip[1163]=hTile[43];
			vChip[2280]=vTile[40]; vChip[2281]=vTile[41]; vChip[2282]=vTile[42]; vChip[2283]=vTile[43];
			aChip[2184]=aTile[40]; aChip[2185]=aTile[41]; aChip[2186]=aTile[42]; aChip[2187]=aTile[43];

			nChip[1260]=nTile[44]; nChip[1261]=nTile[45]; nChip[1262]=nTile[46]; nChip[1263]=nTile[47];
			hChip[1164]=hTile[44]; hChip[1165]=hTile[45]; hChip[1166]=hTile[46]; hChip[1167]=hTile[47];
			vChip[2284]=vTile[44]; vChip[2285]=vTile[45]; vChip[2286]=vTile[46]; vChip[2287]=vTile[47];
			aChip[2188]=aTile[44]; aChip[2189]=aTile[45]; aChip[2190]=aTile[46]; aChip[2191]=aTile[47];

			nChip[1264]=nTile[48]; nChip[1265]=nTile[49]; nChip[1266]=nTile[50]; nChip[1267]=nTile[51];
			hChip[1168]=hTile[48]; hChip[1169]=hTile[49]; hChip[1170]=hTile[50]; hChip[1171]=hTile[51];
			vChip[2288]=vTile[48]; vChip[2289]=vTile[49]; vChip[2290]=vTile[50]; vChip[2291]=vTile[51];
			aChip[2192]=aTile[48]; aChip[2193]=aTile[49]; aChip[2194]=aTile[50]; aChip[2195]=aTile[51];

			nChip[1268]=nTile[52]; nChip[1269]=nTile[53]; nChip[1270]=nTile[54]; nChip[1271]=nTile[55];
			hChip[1172]=hTile[52]; hChip[1173]=hTile[53]; hChip[1174]=hTile[54]; hChip[1175]=hTile[55];
			vChip[2292]=vTile[52]; vChip[2293]=vTile[53]; vChip[2294]=vTile[54]; vChip[2295]=vTile[55];
			aChip[2196]=aTile[52]; aChip[2197]=aTile[53]; aChip[2198]=aTile[54]; aChip[2199]=aTile[55];

			nChip[1272]=nTile[56]; nChip[1273]=nTile[57]; nChip[1274]=nTile[58]; nChip[1275]=nTile[59];
			hChip[1176]=hTile[56]; hChip[1177]=hTile[57]; hChip[1178]=hTile[58]; hChip[1179]=hTile[59];
			vChip[2296]=vTile[56]; vChip[2297]=vTile[57]; vChip[2298]=vTile[58]; vChip[2299]=vTile[59];
			aChip[2200]=aTile[56]; aChip[2201]=aTile[57]; aChip[2202]=aTile[58]; aChip[2203]=aTile[59];

			nChip[1276]=nTile[60]; nChip[1277]=nTile[61]; nChip[1278]=nTile[62]; nChip[1279]=nTile[63];
			hChip[1180]=hTile[60]; hChip[1181]=hTile[61]; hChip[1182]=hTile[62]; hChip[1183]=hTile[63];
			vChip[2300]=vTile[60]; vChip[2301]=vTile[61]; vChip[2302]=vTile[62]; vChip[2303]=vTile[63];
			aChip[2204]=aTile[60]; aChip[2205]=aTile[61]; aChip[2206]=aTile[62]; aChip[2207]=aTile[63];

			nChip[1376]=nTile[64]; nChip[1377]=nTile[65]; nChip[1378]=nTile[66]; nChip[1379]=nTile[67];
			hChip[1280]=hTile[64]; hChip[1281]=hTile[65]; hChip[1282]=hTile[66]; hChip[1283]=hTile[67];
			vChip[2400]=vTile[64]; vChip[2401]=vTile[65]; vChip[2402]=vTile[66]; vChip[2403]=vTile[67];
			aChip[2304]=aTile[64]; aChip[2305]=aTile[65]; aChip[2306]=aTile[66]; aChip[2307]=aTile[67];

			nChip[1380]=nTile[68]; nChip[1381]=nTile[69]; nChip[1382]=nTile[70]; nChip[1383]=nTile[71];
			hChip[1284]=hTile[68]; hChip[1285]=hTile[69]; hChip[1286]=hTile[70]; hChip[1287]=hTile[71];
			vChip[2404]=vTile[68]; vChip[2405]=vTile[69]; vChip[2406]=vTile[70]; vChip[2407]=vTile[71];
			aChip[2308]=aTile[68]; aChip[2309]=aTile[69]; aChip[2310]=aTile[70]; aChip[2311]=aTile[71];

			nChip[1384]=nTile[72]; nChip[1385]=nTile[73]; nChip[1386]=nTile[74]; nChip[1387]=nTile[75];
			hChip[1288]=hTile[72]; hChip[1289]=hTile[73]; hChip[1290]=hTile[74]; hChip[1291]=hTile[75];
			vChip[2408]=vTile[72]; vChip[2409]=vTile[73]; vChip[2410]=vTile[74]; vChip[2411]=vTile[75];
			aChip[2312]=aTile[72]; aChip[2313]=aTile[73]; aChip[2314]=aTile[74]; aChip[2315]=aTile[75];

			nChip[1388]=nTile[76]; nChip[1389]=nTile[77]; nChip[1390]=nTile[78]; nChip[1391]=nTile[79];
			hChip[1292]=hTile[76]; hChip[1293]=hTile[77]; hChip[1294]=hTile[78]; hChip[1295]=hTile[79];
			vChip[2412]=vTile[76]; vChip[2413]=vTile[77]; vChip[2414]=vTile[78]; vChip[2415]=vTile[79];
			aChip[2316]=aTile[76]; aChip[2317]=aTile[77]; aChip[2318]=aTile[78]; aChip[2319]=aTile[79];

			nChip[1392]=nTile[80]; nChip[1393]=nTile[81]; nChip[1394]=nTile[82]; nChip[1395]=nTile[83];
			hChip[1296]=hTile[80]; hChip[1297]=hTile[81]; hChip[1298]=hTile[82]; hChip[1299]=hTile[83];
			vChip[2416]=vTile[80]; vChip[2417]=vTile[81]; vChip[2418]=vTile[82]; vChip[2419]=vTile[83];
			aChip[2320]=aTile[80]; aChip[2321]=aTile[81]; aChip[2322]=aTile[82]; aChip[2323]=aTile[83];

			nChip[1396]=nTile[84]; nChip[1397]=nTile[85]; nChip[1398]=nTile[86]; nChip[1399]=nTile[87];
			hChip[1300]=hTile[84]; hChip[1301]=hTile[85]; hChip[1302]=hTile[86]; hChip[1303]=hTile[87];
			vChip[2420]=vTile[84]; vChip[2421]=vTile[85]; vChip[2422]=vTile[86]; vChip[2423]=vTile[87];
			aChip[2324]=aTile[84]; aChip[2325]=aTile[85]; aChip[2326]=aTile[86]; aChip[2327]=aTile[87];

			nChip[1400]=nTile[88]; nChip[1401]=nTile[89]; nChip[1402]=nTile[90]; nChip[1403]=nTile[91];
			hChip[1304]=hTile[88]; hChip[1305]=hTile[89]; hChip[1306]=hTile[90]; hChip[1307]=hTile[91];
			vChip[2424]=vTile[88]; vChip[2425]=vTile[89]; vChip[2426]=vTile[90]; vChip[2427]=vTile[91];
			aChip[2328]=aTile[88]; aChip[2329]=aTile[89]; aChip[2330]=aTile[90]; aChip[2331]=aTile[91];

			nChip[1404]=nTile[92]; nChip[1405]=nTile[93]; nChip[1406]=nTile[94]; nChip[1407]=nTile[95];
			hChip[1308]=hTile[92]; hChip[1309]=hTile[93]; hChip[1310]=hTile[94]; hChip[1311]=hTile[95];
			vChip[2428]=vTile[92]; vChip[2429]=vTile[93]; vChip[2430]=vTile[94]; vChip[2431]=vTile[95];
			aChip[2332]=aTile[92]; aChip[2333]=aTile[93]; aChip[2334]=aTile[94]; aChip[2335]=aTile[95];

			nChip[1504]=nTile[96]; nChip[1505]=nTile[97]; nChip[1506]=nTile[98]; nChip[1507]=nTile[99];
			hChip[1408]=hTile[96]; hChip[1409]=hTile[97]; hChip[1410]=hTile[98]; hChip[1411]=hTile[99];
			vChip[2528]=vTile[96]; vChip[2529]=vTile[97]; vChip[2530]=vTile[98]; vChip[2531]=vTile[99];
			aChip[2432]=aTile[96]; aChip[2433]=aTile[97]; aChip[2434]=aTile[98]; aChip[2435]=aTile[99];

			nChip[1508]=nTile[100]; nChip[1509]=nTile[101]; nChip[1510]=nTile[102]; nChip[1511]=nTile[103];
			hChip[1412]=hTile[100]; hChip[1413]=hTile[101]; hChip[1414]=hTile[102]; hChip[1415]=hTile[103];
			vChip[2532]=vTile[100]; vChip[2533]=vTile[101]; vChip[2534]=vTile[102]; vChip[2535]=vTile[103];
			aChip[2436]=aTile[100]; aChip[2437]=aTile[101]; aChip[2438]=aTile[102]; aChip[2439]=aTile[103];

			nChip[1512]=nTile[104]; nChip[1513]=nTile[105]; nChip[1514]=nTile[106]; nChip[1515]=nTile[107];
			hChip[1416]=hTile[104]; hChip[1417]=hTile[105]; hChip[1418]=hTile[106]; hChip[1419]=hTile[107];
			vChip[2536]=vTile[104]; vChip[2537]=vTile[105]; vChip[2538]=vTile[106]; vChip[2539]=vTile[107];
			aChip[2440]=aTile[104]; aChip[2441]=aTile[105]; aChip[2442]=aTile[106]; aChip[2443]=aTile[107];

			nChip[1516]=nTile[108]; nChip[1517]=nTile[109]; nChip[1518]=nTile[110]; nChip[1519]=nTile[111];
			hChip[1420]=hTile[108]; hChip[1421]=hTile[109]; hChip[1422]=hTile[110]; hChip[1423]=hTile[111];
			vChip[2540]=vTile[108]; vChip[2541]=vTile[109]; vChip[2542]=vTile[110]; vChip[2543]=vTile[111];
			aChip[2444]=aTile[108]; aChip[2445]=aTile[109]; aChip[2446]=aTile[110]; aChip[2447]=aTile[111];

			nChip[1520]=nTile[112]; nChip[1521]=nTile[113]; nChip[1522]=nTile[114]; nChip[1523]=nTile[115];
			hChip[1424]=hTile[112]; hChip[1425]=hTile[113]; hChip[1426]=hTile[114]; hChip[1427]=hTile[115];
			vChip[2544]=vTile[112]; vChip[2545]=vTile[113]; vChip[2546]=vTile[114]; vChip[2547]=vTile[115];
			aChip[2448]=aTile[112]; aChip[2449]=aTile[113]; aChip[2450]=aTile[114]; aChip[2451]=aTile[115];

			nChip[1524]=nTile[116]; nChip[1525]=nTile[117]; nChip[1526]=nTile[118]; nChip[1527]=nTile[119];
			hChip[1428]=hTile[116]; hChip[1429]=hTile[117]; hChip[1430]=hTile[118]; hChip[1431]=hTile[119];
			vChip[2548]=vTile[116]; vChip[2549]=vTile[117]; vChip[2550]=vTile[118]; vChip[2551]=vTile[119];
			aChip[2452]=aTile[116]; aChip[2453]=aTile[117]; aChip[2454]=aTile[118]; aChip[2455]=aTile[119];

			nChip[1528]=nTile[120]; nChip[1529]=nTile[121]; nChip[1530]=nTile[122]; nChip[1531]=nTile[123];
			hChip[1432]=hTile[120]; hChip[1433]=hTile[121]; hChip[1434]=hTile[122]; hChip[1435]=hTile[123];
			vChip[2552]=vTile[120]; vChip[2553]=vTile[121]; vChip[2554]=vTile[122]; vChip[2555]=vTile[123];
			aChip[2456]=aTile[120]; aChip[2457]=aTile[121]; aChip[2458]=aTile[122]; aChip[2459]=aTile[123];

			nChip[1532]=nTile[124]; nChip[1533]=nTile[125]; nChip[1534]=nTile[126]; nChip[1535]=nTile[127];
			hChip[1436]=hTile[124]; hChip[1437]=hTile[125]; hChip[1438]=hTile[126]; hChip[1439]=hTile[127];
			vChip[2556]=vTile[124]; vChip[2557]=vTile[125]; vChip[2558]=vTile[126]; vChip[2559]=vTile[127];
			aChip[2460]=aTile[124]; aChip[2461]=aTile[125]; aChip[2462]=aTile[126]; aChip[2463]=aTile[127];

			nChip[1632]=nTile[128]; nChip[1633]=nTile[129]; nChip[1634]=nTile[130]; nChip[1635]=nTile[131];
			hChip[1536]=hTile[128]; hChip[1537]=hTile[129]; hChip[1538]=hTile[130]; hChip[1539]=hTile[131];
			vChip[2656]=vTile[128]; vChip[2657]=vTile[129]; vChip[2658]=vTile[130]; vChip[2659]=vTile[131];
			aChip[2560]=aTile[128]; aChip[2561]=aTile[129]; aChip[2562]=aTile[130]; aChip[2563]=aTile[131];

			nChip[1636]=nTile[132]; nChip[1637]=nTile[133]; nChip[1638]=nTile[134]; nChip[1639]=nTile[135];
			hChip[1540]=hTile[132]; hChip[1541]=hTile[133]; hChip[1542]=hTile[134]; hChip[1543]=hTile[135];
			vChip[2660]=vTile[132]; vChip[2661]=vTile[133]; vChip[2662]=vTile[134]; vChip[2663]=vTile[135];
			aChip[2564]=aTile[132]; aChip[2565]=aTile[133]; aChip[2566]=aTile[134]; aChip[2567]=aTile[135];

			nChip[1640]=nTile[136]; nChip[1641]=nTile[137]; nChip[1642]=nTile[138]; nChip[1643]=nTile[139];
			hChip[1544]=hTile[136]; hChip[1545]=hTile[137]; hChip[1546]=hTile[138]; hChip[1547]=hTile[139];
			vChip[2664]=vTile[136]; vChip[2665]=vTile[137]; vChip[2666]=vTile[138]; vChip[2667]=vTile[139];
			aChip[2568]=aTile[136]; aChip[2569]=aTile[137]; aChip[2570]=aTile[138]; aChip[2571]=aTile[139];

			nChip[1644]=nTile[140]; nChip[1645]=nTile[141]; nChip[1646]=nTile[142]; nChip[1647]=nTile[143];
			hChip[1548]=hTile[140]; hChip[1549]=hTile[141]; hChip[1550]=hTile[142]; hChip[1551]=hTile[143];
			vChip[2668]=vTile[140]; vChip[2669]=vTile[141]; vChip[2670]=vTile[142]; vChip[2671]=vTile[143];
			aChip[2572]=aTile[140]; aChip[2573]=aTile[141]; aChip[2574]=aTile[142]; aChip[2575]=aTile[143];

			nChip[1648]=nTile[144]; nChip[1649]=nTile[145]; nChip[1650]=nTile[146]; nChip[1651]=nTile[147];
			hChip[1552]=hTile[144]; hChip[1553]=hTile[145]; hChip[1554]=hTile[146]; hChip[1555]=hTile[147];
			vChip[2672]=vTile[144]; vChip[2673]=vTile[145]; vChip[2674]=vTile[146]; vChip[2675]=vTile[147];
			aChip[2576]=aTile[144]; aChip[2577]=aTile[145]; aChip[2578]=aTile[146]; aChip[2579]=aTile[147];

			nChip[1652]=nTile[148]; nChip[1653]=nTile[149]; nChip[1654]=nTile[150]; nChip[1655]=nTile[151];
			hChip[1556]=hTile[148]; hChip[1557]=hTile[149]; hChip[1558]=hTile[150]; hChip[1559]=hTile[151];
			vChip[2676]=vTile[148]; vChip[2677]=vTile[149]; vChip[2678]=vTile[150]; vChip[2679]=vTile[151];
			aChip[2580]=aTile[148]; aChip[2581]=aTile[149]; aChip[2582]=aTile[150]; aChip[2583]=aTile[151];

			nChip[1656]=nTile[152]; nChip[1657]=nTile[153]; nChip[1658]=nTile[154]; nChip[1659]=nTile[155];
			hChip[1560]=hTile[152]; hChip[1561]=hTile[153]; hChip[1562]=hTile[154]; hChip[1563]=hTile[155];
			vChip[2680]=vTile[152]; vChip[2681]=vTile[153]; vChip[2682]=vTile[154]; vChip[2683]=vTile[155];
			aChip[2584]=aTile[152]; aChip[2585]=aTile[153]; aChip[2586]=aTile[154]; aChip[2587]=aTile[155];

			nChip[1660]=nTile[156]; nChip[1661]=nTile[157]; nChip[1662]=nTile[158]; nChip[1663]=nTile[159];
			hChip[1564]=hTile[156]; hChip[1565]=hTile[157]; hChip[1566]=hTile[158]; hChip[1567]=hTile[159];
			vChip[2684]=vTile[156]; vChip[2685]=vTile[157]; vChip[2686]=vTile[158]; vChip[2687]=vTile[159];
			aChip[2588]=aTile[156]; aChip[2589]=aTile[157]; aChip[2590]=aTile[158]; aChip[2591]=aTile[159];

			nChip[1760]=nTile[160]; nChip[1761]=nTile[161]; nChip[1762]=nTile[162]; nChip[1763]=nTile[163];
			hChip[1664]=hTile[160]; hChip[1665]=hTile[161]; hChip[1666]=hTile[162]; hChip[1667]=hTile[163];
			vChip[2784]=vTile[160]; vChip[2785]=vTile[161]; vChip[2786]=vTile[162]; vChip[2787]=vTile[163];
			aChip[2688]=aTile[160]; aChip[2689]=aTile[161]; aChip[2690]=aTile[162]; aChip[2691]=aTile[163];

			nChip[1764]=nTile[164]; nChip[1765]=nTile[165]; nChip[1766]=nTile[166]; nChip[1767]=nTile[167];
			hChip[1668]=hTile[164]; hChip[1669]=hTile[165]; hChip[1670]=hTile[166]; hChip[1671]=hTile[167];
			vChip[2788]=vTile[164]; vChip[2789]=vTile[165]; vChip[2790]=vTile[166]; vChip[2791]=vTile[167];
			aChip[2692]=aTile[164]; aChip[2693]=aTile[165]; aChip[2694]=aTile[166]; aChip[2695]=aTile[167];

			nChip[1768]=nTile[168]; nChip[1769]=nTile[169]; nChip[1770]=nTile[170]; nChip[1771]=nTile[171];
			hChip[1672]=hTile[168]; hChip[1673]=hTile[169]; hChip[1674]=hTile[170]; hChip[1675]=hTile[171];
			vChip[2792]=vTile[168]; vChip[2793]=vTile[169]; vChip[2794]=vTile[170]; vChip[2795]=vTile[171];
			aChip[2696]=aTile[168]; aChip[2697]=aTile[169]; aChip[2698]=aTile[170]; aChip[2699]=aTile[171];

			nChip[1772]=nTile[172]; nChip[1773]=nTile[173]; nChip[1774]=nTile[174]; nChip[1775]=nTile[175];
			hChip[1676]=hTile[172]; hChip[1677]=hTile[173]; hChip[1678]=hTile[174]; hChip[1679]=hTile[175];
			vChip[2796]=vTile[172]; vChip[2797]=vTile[173]; vChip[2798]=vTile[174]; vChip[2799]=vTile[175];
			aChip[2700]=aTile[172]; aChip[2701]=aTile[173]; aChip[2702]=aTile[174]; aChip[2703]=aTile[175];

			nChip[1776]=nTile[176]; nChip[1777]=nTile[177]; nChip[1778]=nTile[178]; nChip[1779]=nTile[179];
			hChip[1680]=hTile[176]; hChip[1681]=hTile[177]; hChip[1682]=hTile[178]; hChip[1683]=hTile[179];
			vChip[2800]=vTile[176]; vChip[2801]=vTile[177]; vChip[2802]=vTile[178]; vChip[2803]=vTile[179];
			aChip[2704]=aTile[176]; aChip[2705]=aTile[177]; aChip[2706]=aTile[178]; aChip[2707]=aTile[179];

			nChip[1780]=nTile[180]; nChip[1781]=nTile[181]; nChip[1782]=nTile[182]; nChip[1783]=nTile[183];
			hChip[1684]=hTile[180]; hChip[1685]=hTile[181]; hChip[1686]=hTile[182]; hChip[1687]=hTile[183];
			vChip[2804]=vTile[180]; vChip[2805]=vTile[181]; vChip[2806]=vTile[182]; vChip[2807]=vTile[183];
			aChip[2708]=aTile[180]; aChip[2709]=aTile[181]; aChip[2710]=aTile[182]; aChip[2711]=aTile[183];

			nChip[1784]=nTile[184]; nChip[1785]=nTile[185]; nChip[1786]=nTile[186]; nChip[1787]=nTile[187];
			hChip[1688]=hTile[184]; hChip[1689]=hTile[185]; hChip[1690]=hTile[186]; hChip[1691]=hTile[187];
			vChip[2808]=vTile[184]; vChip[2809]=vTile[185]; vChip[2810]=vTile[186]; vChip[2811]=vTile[187];
			aChip[2712]=aTile[184]; aChip[2713]=aTile[185]; aChip[2714]=aTile[186]; aChip[2715]=aTile[187];

			nChip[1788]=nTile[188]; nChip[1789]=nTile[189]; nChip[1790]=nTile[190]; nChip[1791]=nTile[191];
			hChip[1692]=hTile[188]; hChip[1693]=hTile[189]; hChip[1694]=hTile[190]; hChip[1695]=hTile[191];
			vChip[2812]=vTile[188]; vChip[2813]=vTile[189]; vChip[2814]=vTile[190]; vChip[2815]=vTile[191];
			aChip[2716]=aTile[188]; aChip[2717]=aTile[189]; aChip[2718]=aTile[190]; aChip[2719]=aTile[191];

			nChip[1888]=nTile[192]; nChip[1889]=nTile[193]; nChip[1890]=nTile[194]; nChip[1891]=nTile[195];
			hChip[1792]=hTile[192]; hChip[1793]=hTile[193]; hChip[1794]=hTile[194]; hChip[1795]=hTile[195];
			vChip[2912]=vTile[192]; vChip[2913]=vTile[193]; vChip[2914]=vTile[194]; vChip[2915]=vTile[195];
			aChip[2816]=aTile[192]; aChip[2817]=aTile[193]; aChip[2818]=aTile[194]; aChip[2819]=aTile[195];

			nChip[1892]=nTile[196]; nChip[1893]=nTile[197]; nChip[1894]=nTile[198]; nChip[1895]=nTile[199];
			hChip[1796]=hTile[196]; hChip[1797]=hTile[197]; hChip[1798]=hTile[198]; hChip[1799]=hTile[199];
			vChip[2916]=vTile[196]; vChip[2917]=vTile[197]; vChip[2918]=vTile[198]; vChip[2919]=vTile[199];
			aChip[2820]=aTile[196]; aChip[2821]=aTile[197]; aChip[2822]=aTile[198]; aChip[2823]=aTile[199];

			nChip[1896]=nTile[200]; nChip[1897]=nTile[201]; nChip[1898]=nTile[202]; nChip[1899]=nTile[203];
			hChip[1800]=hTile[200]; hChip[1801]=hTile[201]; hChip[1802]=hTile[202]; hChip[1803]=hTile[203];
			vChip[2920]=vTile[200]; vChip[2921]=vTile[201]; vChip[2922]=vTile[202]; vChip[2923]=vTile[203];
			aChip[2824]=aTile[200]; aChip[2825]=aTile[201]; aChip[2826]=aTile[202]; aChip[2827]=aTile[203];

			nChip[1900]=nTile[204]; nChip[1901]=nTile[205]; nChip[1902]=nTile[206]; nChip[1903]=nTile[207];
			hChip[1804]=hTile[204]; hChip[1805]=hTile[205]; hChip[1806]=hTile[206]; hChip[1807]=hTile[207];
			vChip[2924]=vTile[204]; vChip[2925]=vTile[205]; vChip[2926]=vTile[206]; vChip[2927]=vTile[207];
			aChip[2828]=aTile[204]; aChip[2829]=aTile[205]; aChip[2830]=aTile[206]; aChip[2831]=aTile[207];

			nChip[1904]=nTile[208]; nChip[1905]=nTile[209]; nChip[1906]=nTile[210]; nChip[1907]=nTile[211];
			hChip[1808]=hTile[208]; hChip[1809]=hTile[209]; hChip[1810]=hTile[210]; hChip[1811]=hTile[211];
			vChip[2928]=vTile[208]; vChip[2929]=vTile[209]; vChip[2930]=vTile[210]; vChip[2931]=vTile[211];
			aChip[2832]=aTile[208]; aChip[2833]=aTile[209]; aChip[2834]=aTile[210]; aChip[2835]=aTile[211];

			nChip[1908]=nTile[212]; nChip[1909]=nTile[213]; nChip[1910]=nTile[214]; nChip[1911]=nTile[215];
			hChip[1812]=hTile[212]; hChip[1813]=hTile[213]; hChip[1814]=hTile[214]; hChip[1815]=hTile[215];
			vChip[2932]=vTile[212]; vChip[2933]=vTile[213]; vChip[2934]=vTile[214]; vChip[2935]=vTile[215];
			aChip[2836]=aTile[212]; aChip[2837]=aTile[213]; aChip[2838]=aTile[214]; aChip[2839]=aTile[215];

			nChip[1912]=nTile[216]; nChip[1913]=nTile[217]; nChip[1914]=nTile[218]; nChip[1915]=nTile[219];
			hChip[1816]=hTile[216]; hChip[1817]=hTile[217]; hChip[1818]=hTile[218]; hChip[1819]=hTile[219];
			vChip[2936]=vTile[216]; vChip[2937]=vTile[217]; vChip[2938]=vTile[218]; vChip[2939]=vTile[219];
			aChip[2840]=aTile[216]; aChip[2841]=aTile[217]; aChip[2842]=aTile[218]; aChip[2843]=aTile[219];

			nChip[1916]=nTile[220]; nChip[1917]=nTile[221]; nChip[1918]=nTile[222]; nChip[1919]=nTile[223];
			hChip[1820]=hTile[220]; hChip[1821]=hTile[221]; hChip[1822]=hTile[222]; hChip[1823]=hTile[223];
			vChip[2940]=vTile[220]; vChip[2941]=vTile[221]; vChip[2942]=vTile[222]; vChip[2943]=vTile[223];
			aChip[2844]=aTile[220]; aChip[2845]=aTile[221]; aChip[2846]=aTile[222]; aChip[2847]=aTile[223];

			nChip[2016]=nTile[224]; nChip[2017]=nTile[225]; nChip[2018]=nTile[226]; nChip[2019]=nTile[227];
			hChip[1920]=hTile[224]; hChip[1921]=hTile[225]; hChip[1922]=hTile[226]; hChip[1923]=hTile[227];
			vChip[3040]=vTile[224]; vChip[3041]=vTile[225]; vChip[3042]=vTile[226]; vChip[3043]=vTile[227];
			aChip[2944]=aTile[224]; aChip[2945]=aTile[225]; aChip[2946]=aTile[226]; aChip[2947]=aTile[227];

			nChip[2020]=nTile[228]; nChip[2021]=nTile[229]; nChip[2022]=nTile[230]; nChip[2023]=nTile[231];
			hChip[1924]=hTile[228]; hChip[1925]=hTile[229]; hChip[1926]=hTile[230]; hChip[1927]=hTile[231];
			vChip[3044]=vTile[228]; vChip[3045]=vTile[229]; vChip[3046]=vTile[230]; vChip[3047]=vTile[231];
			aChip[2948]=aTile[228]; aChip[2949]=aTile[229]; aChip[2950]=aTile[230]; aChip[2951]=aTile[231];

			nChip[2024]=nTile[232]; nChip[2025]=nTile[233]; nChip[2026]=nTile[234]; nChip[2027]=nTile[235];
			hChip[1928]=hTile[232]; hChip[1929]=hTile[233]; hChip[1930]=hTile[234]; hChip[1931]=hTile[235];
			vChip[3048]=vTile[232]; vChip[3049]=vTile[233]; vChip[3050]=vTile[234]; vChip[3051]=vTile[235];
			aChip[2952]=aTile[232]; aChip[2953]=aTile[233]; aChip[2954]=aTile[234]; aChip[2955]=aTile[235];

			nChip[2028]=nTile[236]; nChip[2029]=nTile[237]; nChip[2030]=nTile[238]; nChip[2031]=nTile[239];
			hChip[1932]=hTile[236]; hChip[1933]=hTile[237]; hChip[1934]=hTile[238]; hChip[1935]=hTile[239];
			vChip[3052]=vTile[236]; vChip[3053]=vTile[237]; vChip[3054]=vTile[238]; vChip[3055]=vTile[239];
			aChip[2956]=aTile[236]; aChip[2957]=aTile[237]; aChip[2958]=aTile[238]; aChip[2959]=aTile[239];

			nChip[2032]=nTile[240]; nChip[2033]=nTile[241]; nChip[2034]=nTile[242]; nChip[2035]=nTile[243];
			hChip[1936]=hTile[240]; hChip[1937]=hTile[241]; hChip[1938]=hTile[242]; hChip[1939]=hTile[243];
			vChip[3056]=vTile[240]; vChip[3057]=vTile[241]; vChip[3058]=vTile[242]; vChip[3059]=vTile[243];
			aChip[2960]=aTile[240]; aChip[2961]=aTile[241]; aChip[2962]=aTile[242]; aChip[2963]=aTile[243];

			nChip[2036]=nTile[244]; nChip[2037]=nTile[245]; nChip[2038]=nTile[246]; nChip[2039]=nTile[247];
			hChip[1940]=hTile[244]; hChip[1941]=hTile[245]; hChip[1942]=hTile[246]; hChip[1943]=hTile[247];
			vChip[3060]=vTile[244]; vChip[3061]=vTile[245]; vChip[3062]=vTile[246]; vChip[3063]=vTile[247];
			aChip[2964]=aTile[244]; aChip[2965]=aTile[245]; aChip[2966]=aTile[246]; aChip[2967]=aTile[247];

			nChip[2040]=nTile[248]; nChip[2041]=nTile[249]; nChip[2042]=nTile[250]; nChip[2043]=nTile[251];
			hChip[1944]=hTile[248]; hChip[1945]=hTile[249]; hChip[1946]=hTile[250]; hChip[1947]=hTile[251];
			vChip[3064]=vTile[248]; vChip[3065]=vTile[249]; vChip[3066]=vTile[250]; vChip[3067]=vTile[251];
			aChip[2968]=aTile[248]; aChip[2969]=aTile[249]; aChip[2970]=aTile[250]; aChip[2971]=aTile[251];

			nChip[2044]=nTile[252]; nChip[2045]=nTile[253]; nChip[2046]=nTile[254]; nChip[2047]=nTile[255];
			hChip[1948]=hTile[252]; hChip[1949]=hTile[253]; hChip[1950]=hTile[254]; hChip[1951]=hTile[255];
			vChip[3068]=vTile[252]; vChip[3069]=vTile[253]; vChip[3070]=vTile[254]; vChip[3071]=vTile[255];
			aChip[2972]=aTile[252]; aChip[2973]=aTile[253]; aChip[2974]=aTile[254]; aChip[2975]=aTile[255];

			A = d[cOfst+16]; B = d[cOfst+17];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[2048]=nTile[0]; nChip[2049]=nTile[1]; nChip[2050]=nTile[2]; nChip[2051]=nTile[3];
			hChip[2144]=hTile[0]; hChip[2145]=hTile[1]; hChip[2146]=hTile[2]; hChip[2147]=hTile[3];
			vChip[1024]=vTile[0]; vChip[1025]=vTile[1]; vChip[1026]=vTile[2]; vChip[1027]=vTile[3];
			aChip[1120]=aTile[0]; aChip[1121]=aTile[1]; aChip[1122]=aTile[2]; aChip[1123]=aTile[3];

			nChip[2052]=nTile[4]; nChip[2053]=nTile[5]; nChip[2054]=nTile[6]; nChip[2055]=nTile[7];
			hChip[2148]=hTile[4]; hChip[2149]=hTile[5]; hChip[2150]=hTile[6]; hChip[2151]=hTile[7];
			vChip[1028]=vTile[4]; vChip[1029]=vTile[5]; vChip[1030]=vTile[6]; vChip[1031]=vTile[7];
			aChip[1124]=aTile[4]; aChip[1125]=aTile[5]; aChip[1126]=aTile[6]; aChip[1127]=aTile[7];

			nChip[2056]=nTile[8]; nChip[2057]=nTile[9]; nChip[2058]=nTile[10]; nChip[2059]=nTile[11];
			hChip[2152]=hTile[8]; hChip[2153]=hTile[9]; hChip[2154]=hTile[10]; hChip[2155]=hTile[11];
			vChip[1032]=vTile[8]; vChip[1033]=vTile[9]; vChip[1034]=vTile[10]; vChip[1035]=vTile[11];
			aChip[1128]=aTile[8]; aChip[1129]=aTile[9]; aChip[1130]=aTile[10]; aChip[1131]=aTile[11];

			nChip[2060]=nTile[12]; nChip[2061]=nTile[13]; nChip[2062]=nTile[14]; nChip[2063]=nTile[15];
			hChip[2156]=hTile[12]; hChip[2157]=hTile[13]; hChip[2158]=hTile[14]; hChip[2159]=hTile[15];
			vChip[1036]=vTile[12]; vChip[1037]=vTile[13]; vChip[1038]=vTile[14]; vChip[1039]=vTile[15];
			aChip[1132]=aTile[12]; aChip[1133]=aTile[13]; aChip[1134]=aTile[14]; aChip[1135]=aTile[15];

			nChip[2064]=nTile[16]; nChip[2065]=nTile[17]; nChip[2066]=nTile[18]; nChip[2067]=nTile[19];
			hChip[2160]=hTile[16]; hChip[2161]=hTile[17]; hChip[2162]=hTile[18]; hChip[2163]=hTile[19];
			vChip[1040]=vTile[16]; vChip[1041]=vTile[17]; vChip[1042]=vTile[18]; vChip[1043]=vTile[19];
			aChip[1136]=aTile[16]; aChip[1137]=aTile[17]; aChip[1138]=aTile[18]; aChip[1139]=aTile[19];

			nChip[2068]=nTile[20]; nChip[2069]=nTile[21]; nChip[2070]=nTile[22]; nChip[2071]=nTile[23];
			hChip[2164]=hTile[20]; hChip[2165]=hTile[21]; hChip[2166]=hTile[22]; hChip[2167]=hTile[23];
			vChip[1044]=vTile[20]; vChip[1045]=vTile[21]; vChip[1046]=vTile[22]; vChip[1047]=vTile[23];
			aChip[1140]=aTile[20]; aChip[1141]=aTile[21]; aChip[1142]=aTile[22]; aChip[1143]=aTile[23];

			nChip[2072]=nTile[24]; nChip[2073]=nTile[25]; nChip[2074]=nTile[26]; nChip[2075]=nTile[27];
			hChip[2168]=hTile[24]; hChip[2169]=hTile[25]; hChip[2170]=hTile[26]; hChip[2171]=hTile[27];
			vChip[1048]=vTile[24]; vChip[1049]=vTile[25]; vChip[1050]=vTile[26]; vChip[1051]=vTile[27];
			aChip[1144]=aTile[24]; aChip[1145]=aTile[25]; aChip[1146]=aTile[26]; aChip[1147]=aTile[27];

			nChip[2076]=nTile[28]; nChip[2077]=nTile[29]; nChip[2078]=nTile[30]; nChip[2079]=nTile[31];
			hChip[2172]=hTile[28]; hChip[2173]=hTile[29]; hChip[2174]=hTile[30]; hChip[2175]=hTile[31];
			vChip[1052]=vTile[28]; vChip[1053]=vTile[29]; vChip[1054]=vTile[30]; vChip[1055]=vTile[31];
			aChip[1148]=aTile[28]; aChip[1149]=aTile[29]; aChip[1150]=aTile[30]; aChip[1151]=aTile[31];

			nChip[2176]=nTile[32]; nChip[2177]=nTile[33]; nChip[2178]=nTile[34]; nChip[2179]=nTile[35];
			hChip[2272]=hTile[32]; hChip[2273]=hTile[33]; hChip[2274]=hTile[34]; hChip[2275]=hTile[35];
			vChip[1152]=vTile[32]; vChip[1153]=vTile[33]; vChip[1154]=vTile[34]; vChip[1155]=vTile[35];
			aChip[1248]=aTile[32]; aChip[1249]=aTile[33]; aChip[1250]=aTile[34]; aChip[1251]=aTile[35];

			nChip[2180]=nTile[36]; nChip[2181]=nTile[37]; nChip[2182]=nTile[38]; nChip[2183]=nTile[39];
			hChip[2276]=hTile[36]; hChip[2277]=hTile[37]; hChip[2278]=hTile[38]; hChip[2279]=hTile[39];
			vChip[1156]=vTile[36]; vChip[1157]=vTile[37]; vChip[1158]=vTile[38]; vChip[1159]=vTile[39];
			aChip[1252]=aTile[36]; aChip[1253]=aTile[37]; aChip[1254]=aTile[38]; aChip[1255]=aTile[39];

			nChip[2184]=nTile[40]; nChip[2185]=nTile[41]; nChip[2186]=nTile[42]; nChip[2187]=nTile[43];
			hChip[2280]=hTile[40]; hChip[2281]=hTile[41]; hChip[2282]=hTile[42]; hChip[2283]=hTile[43];
			vChip[1160]=vTile[40]; vChip[1161]=vTile[41]; vChip[1162]=vTile[42]; vChip[1163]=vTile[43];
			aChip[1256]=aTile[40]; aChip[1257]=aTile[41]; aChip[1258]=aTile[42]; aChip[1259]=aTile[43];

			nChip[2188]=nTile[44]; nChip[2189]=nTile[45]; nChip[2190]=nTile[46]; nChip[2191]=nTile[47];
			hChip[2284]=hTile[44]; hChip[2285]=hTile[45]; hChip[2286]=hTile[46]; hChip[2287]=hTile[47];
			vChip[1164]=vTile[44]; vChip[1165]=vTile[45]; vChip[1166]=vTile[46]; vChip[1167]=vTile[47];
			aChip[1260]=aTile[44]; aChip[1261]=aTile[45]; aChip[1262]=aTile[46]; aChip[1263]=aTile[47];

			nChip[2192]=nTile[48]; nChip[2193]=nTile[49]; nChip[2194]=nTile[50]; nChip[2195]=nTile[51];
			hChip[2288]=hTile[48]; hChip[2289]=hTile[49]; hChip[2290]=hTile[50]; hChip[2291]=hTile[51];
			vChip[1168]=vTile[48]; vChip[1169]=vTile[49]; vChip[1170]=vTile[50]; vChip[1171]=vTile[51];
			aChip[1264]=aTile[48]; aChip[1265]=aTile[49]; aChip[1266]=aTile[50]; aChip[1267]=aTile[51];

			nChip[2196]=nTile[52]; nChip[2197]=nTile[53]; nChip[2198]=nTile[54]; nChip[2199]=nTile[55];
			hChip[2292]=hTile[52]; hChip[2293]=hTile[53]; hChip[2294]=hTile[54]; hChip[2295]=hTile[55];
			vChip[1172]=vTile[52]; vChip[1173]=vTile[53]; vChip[1174]=vTile[54]; vChip[1175]=vTile[55];
			aChip[1268]=aTile[52]; aChip[1269]=aTile[53]; aChip[1270]=aTile[54]; aChip[1271]=aTile[55];

			nChip[2200]=nTile[56]; nChip[2201]=nTile[57]; nChip[2202]=nTile[58]; nChip[2203]=nTile[59];
			hChip[2296]=hTile[56]; hChip[2297]=hTile[57]; hChip[2298]=hTile[58]; hChip[2299]=hTile[59];
			vChip[1176]=vTile[56]; vChip[1177]=vTile[57]; vChip[1178]=vTile[58]; vChip[1179]=vTile[59];
			aChip[1272]=aTile[56]; aChip[1273]=aTile[57]; aChip[1274]=aTile[58]; aChip[1275]=aTile[59];

			nChip[2204]=nTile[60]; nChip[2205]=nTile[61]; nChip[2206]=nTile[62]; nChip[2207]=nTile[63];
			hChip[2300]=hTile[60]; hChip[2301]=hTile[61]; hChip[2302]=hTile[62]; hChip[2303]=hTile[63];
			vChip[1180]=vTile[60]; vChip[1181]=vTile[61]; vChip[1182]=vTile[62]; vChip[1183]=vTile[63];
			aChip[1276]=aTile[60]; aChip[1277]=aTile[61]; aChip[1278]=aTile[62]; aChip[1279]=aTile[63];

			nChip[2304]=nTile[64]; nChip[2305]=nTile[65]; nChip[2306]=nTile[66]; nChip[2307]=nTile[67];
			hChip[2400]=hTile[64]; hChip[2401]=hTile[65]; hChip[2402]=hTile[66]; hChip[2403]=hTile[67];
			vChip[1280]=vTile[64]; vChip[1281]=vTile[65]; vChip[1282]=vTile[66]; vChip[1283]=vTile[67];
			aChip[1376]=aTile[64]; aChip[1377]=aTile[65]; aChip[1378]=aTile[66]; aChip[1379]=aTile[67];

			nChip[2308]=nTile[68]; nChip[2309]=nTile[69]; nChip[2310]=nTile[70]; nChip[2311]=nTile[71];
			hChip[2404]=hTile[68]; hChip[2405]=hTile[69]; hChip[2406]=hTile[70]; hChip[2407]=hTile[71];
			vChip[1284]=vTile[68]; vChip[1285]=vTile[69]; vChip[1286]=vTile[70]; vChip[1287]=vTile[71];
			aChip[1380]=aTile[68]; aChip[1381]=aTile[69]; aChip[1382]=aTile[70]; aChip[1383]=aTile[71];

			nChip[2312]=nTile[72]; nChip[2313]=nTile[73]; nChip[2314]=nTile[74]; nChip[2315]=nTile[75];
			hChip[2408]=hTile[72]; hChip[2409]=hTile[73]; hChip[2410]=hTile[74]; hChip[2411]=hTile[75];
			vChip[1288]=vTile[72]; vChip[1289]=vTile[73]; vChip[1290]=vTile[74]; vChip[1291]=vTile[75];
			aChip[1384]=aTile[72]; aChip[1385]=aTile[73]; aChip[1386]=aTile[74]; aChip[1387]=aTile[75];

			nChip[2316]=nTile[76]; nChip[2317]=nTile[77]; nChip[2318]=nTile[78]; nChip[2319]=nTile[79];
			hChip[2412]=hTile[76]; hChip[2413]=hTile[77]; hChip[2414]=hTile[78]; hChip[2415]=hTile[79];
			vChip[1292]=vTile[76]; vChip[1293]=vTile[77]; vChip[1294]=vTile[78]; vChip[1295]=vTile[79];
			aChip[1388]=aTile[76]; aChip[1389]=aTile[77]; aChip[1390]=aTile[78]; aChip[1391]=aTile[79];

			nChip[2320]=nTile[80]; nChip[2321]=nTile[81]; nChip[2322]=nTile[82]; nChip[2323]=nTile[83];
			hChip[2416]=hTile[80]; hChip[2417]=hTile[81]; hChip[2418]=hTile[82]; hChip[2419]=hTile[83];
			vChip[1296]=vTile[80]; vChip[1297]=vTile[81]; vChip[1298]=vTile[82]; vChip[1299]=vTile[83];
			aChip[1392]=aTile[80]; aChip[1393]=aTile[81]; aChip[1394]=aTile[82]; aChip[1395]=aTile[83];

			nChip[2324]=nTile[84]; nChip[2325]=nTile[85]; nChip[2326]=nTile[86]; nChip[2327]=nTile[87];
			hChip[2420]=hTile[84]; hChip[2421]=hTile[85]; hChip[2422]=hTile[86]; hChip[2423]=hTile[87];
			vChip[1300]=vTile[84]; vChip[1301]=vTile[85]; vChip[1302]=vTile[86]; vChip[1303]=vTile[87];
			aChip[1396]=aTile[84]; aChip[1397]=aTile[85]; aChip[1398]=aTile[86]; aChip[1399]=aTile[87];

			nChip[2328]=nTile[88]; nChip[2329]=nTile[89]; nChip[2330]=nTile[90]; nChip[2331]=nTile[91];
			hChip[2424]=hTile[88]; hChip[2425]=hTile[89]; hChip[2426]=hTile[90]; hChip[2427]=hTile[91];
			vChip[1304]=vTile[88]; vChip[1305]=vTile[89]; vChip[1306]=vTile[90]; vChip[1307]=vTile[91];
			aChip[1400]=aTile[88]; aChip[1401]=aTile[89]; aChip[1402]=aTile[90]; aChip[1403]=aTile[91];

			nChip[2332]=nTile[92]; nChip[2333]=nTile[93]; nChip[2334]=nTile[94]; nChip[2335]=nTile[95];
			hChip[2428]=hTile[92]; hChip[2429]=hTile[93]; hChip[2430]=hTile[94]; hChip[2431]=hTile[95];
			vChip[1308]=vTile[92]; vChip[1309]=vTile[93]; vChip[1310]=vTile[94]; vChip[1311]=vTile[95];
			aChip[1404]=aTile[92]; aChip[1405]=aTile[93]; aChip[1406]=aTile[94]; aChip[1407]=aTile[95];

			nChip[2432]=nTile[96]; nChip[2433]=nTile[97]; nChip[2434]=nTile[98]; nChip[2435]=nTile[99];
			hChip[2528]=hTile[96]; hChip[2529]=hTile[97]; hChip[2530]=hTile[98]; hChip[2531]=hTile[99];
			vChip[1408]=vTile[96]; vChip[1409]=vTile[97]; vChip[1410]=vTile[98]; vChip[1411]=vTile[99];
			aChip[1504]=aTile[96]; aChip[1505]=aTile[97]; aChip[1506]=aTile[98]; aChip[1507]=aTile[99];

			nChip[2436]=nTile[100]; nChip[2437]=nTile[101]; nChip[2438]=nTile[102]; nChip[2439]=nTile[103];
			hChip[2532]=hTile[100]; hChip[2533]=hTile[101]; hChip[2534]=hTile[102]; hChip[2535]=hTile[103];
			vChip[1412]=vTile[100]; vChip[1413]=vTile[101]; vChip[1414]=vTile[102]; vChip[1415]=vTile[103];
			aChip[1508]=aTile[100]; aChip[1509]=aTile[101]; aChip[1510]=aTile[102]; aChip[1511]=aTile[103];

			nChip[2440]=nTile[104]; nChip[2441]=nTile[105]; nChip[2442]=nTile[106]; nChip[2443]=nTile[107];
			hChip[2536]=hTile[104]; hChip[2537]=hTile[105]; hChip[2538]=hTile[106]; hChip[2539]=hTile[107];
			vChip[1416]=vTile[104]; vChip[1417]=vTile[105]; vChip[1418]=vTile[106]; vChip[1419]=vTile[107];
			aChip[1512]=aTile[104]; aChip[1513]=aTile[105]; aChip[1514]=aTile[106]; aChip[1515]=aTile[107];

			nChip[2444]=nTile[108]; nChip[2445]=nTile[109]; nChip[2446]=nTile[110]; nChip[2447]=nTile[111];
			hChip[2540]=hTile[108]; hChip[2541]=hTile[109]; hChip[2542]=hTile[110]; hChip[2543]=hTile[111];
			vChip[1420]=vTile[108]; vChip[1421]=vTile[109]; vChip[1422]=vTile[110]; vChip[1423]=vTile[111];
			aChip[1516]=aTile[108]; aChip[1517]=aTile[109]; aChip[1518]=aTile[110]; aChip[1519]=aTile[111];

			nChip[2448]=nTile[112]; nChip[2449]=nTile[113]; nChip[2450]=nTile[114]; nChip[2451]=nTile[115];
			hChip[2544]=hTile[112]; hChip[2545]=hTile[113]; hChip[2546]=hTile[114]; hChip[2547]=hTile[115];
			vChip[1424]=vTile[112]; vChip[1425]=vTile[113]; vChip[1426]=vTile[114]; vChip[1427]=vTile[115];
			aChip[1520]=aTile[112]; aChip[1521]=aTile[113]; aChip[1522]=aTile[114]; aChip[1523]=aTile[115];

			nChip[2452]=nTile[116]; nChip[2453]=nTile[117]; nChip[2454]=nTile[118]; nChip[2455]=nTile[119];
			hChip[2548]=hTile[116]; hChip[2549]=hTile[117]; hChip[2550]=hTile[118]; hChip[2551]=hTile[119];
			vChip[1428]=vTile[116]; vChip[1429]=vTile[117]; vChip[1430]=vTile[118]; vChip[1431]=vTile[119];
			aChip[1524]=aTile[116]; aChip[1525]=aTile[117]; aChip[1526]=aTile[118]; aChip[1527]=aTile[119];

			nChip[2456]=nTile[120]; nChip[2457]=nTile[121]; nChip[2458]=nTile[122]; nChip[2459]=nTile[123];
			hChip[2552]=hTile[120]; hChip[2553]=hTile[121]; hChip[2554]=hTile[122]; hChip[2555]=hTile[123];
			vChip[1432]=vTile[120]; vChip[1433]=vTile[121]; vChip[1434]=vTile[122]; vChip[1435]=vTile[123];
			aChip[1528]=aTile[120]; aChip[1529]=aTile[121]; aChip[1530]=aTile[122]; aChip[1531]=aTile[123];

			nChip[2460]=nTile[124]; nChip[2461]=nTile[125]; nChip[2462]=nTile[126]; nChip[2463]=nTile[127];
			hChip[2556]=hTile[124]; hChip[2557]=hTile[125]; hChip[2558]=hTile[126]; hChip[2559]=hTile[127];
			vChip[1436]=vTile[124]; vChip[1437]=vTile[125]; vChip[1438]=vTile[126]; vChip[1439]=vTile[127];
			aChip[1532]=aTile[124]; aChip[1533]=aTile[125]; aChip[1534]=aTile[126]; aChip[1535]=aTile[127];

			nChip[2560]=nTile[128]; nChip[2561]=nTile[129]; nChip[2562]=nTile[130]; nChip[2563]=nTile[131];
			hChip[2656]=hTile[128]; hChip[2657]=hTile[129]; hChip[2658]=hTile[130]; hChip[2659]=hTile[131];
			vChip[1536]=vTile[128]; vChip[1537]=vTile[129]; vChip[1538]=vTile[130]; vChip[1539]=vTile[131];
			aChip[1632]=aTile[128]; aChip[1633]=aTile[129]; aChip[1634]=aTile[130]; aChip[1635]=aTile[131];

			nChip[2564]=nTile[132]; nChip[2565]=nTile[133]; nChip[2566]=nTile[134]; nChip[2567]=nTile[135];
			hChip[2660]=hTile[132]; hChip[2661]=hTile[133]; hChip[2662]=hTile[134]; hChip[2663]=hTile[135];
			vChip[1540]=vTile[132]; vChip[1541]=vTile[133]; vChip[1542]=vTile[134]; vChip[1543]=vTile[135];
			aChip[1636]=aTile[132]; aChip[1637]=aTile[133]; aChip[1638]=aTile[134]; aChip[1639]=aTile[135];

			nChip[2568]=nTile[136]; nChip[2569]=nTile[137]; nChip[2570]=nTile[138]; nChip[2571]=nTile[139];
			hChip[2664]=hTile[136]; hChip[2665]=hTile[137]; hChip[2666]=hTile[138]; hChip[2667]=hTile[139];
			vChip[1544]=vTile[136]; vChip[1545]=vTile[137]; vChip[1546]=vTile[138]; vChip[1547]=vTile[139];
			aChip[1640]=aTile[136]; aChip[1641]=aTile[137]; aChip[1642]=aTile[138]; aChip[1643]=aTile[139];

			nChip[2572]=nTile[140]; nChip[2573]=nTile[141]; nChip[2574]=nTile[142]; nChip[2575]=nTile[143];
			hChip[2668]=hTile[140]; hChip[2669]=hTile[141]; hChip[2670]=hTile[142]; hChip[2671]=hTile[143];
			vChip[1548]=vTile[140]; vChip[1549]=vTile[141]; vChip[1550]=vTile[142]; vChip[1551]=vTile[143];
			aChip[1644]=aTile[140]; aChip[1645]=aTile[141]; aChip[1646]=aTile[142]; aChip[1647]=aTile[143];

			nChip[2576]=nTile[144]; nChip[2577]=nTile[145]; nChip[2578]=nTile[146]; nChip[2579]=nTile[147];
			hChip[2672]=hTile[144]; hChip[2673]=hTile[145]; hChip[2674]=hTile[146]; hChip[2675]=hTile[147];
			vChip[1552]=vTile[144]; vChip[1553]=vTile[145]; vChip[1554]=vTile[146]; vChip[1555]=vTile[147];
			aChip[1648]=aTile[144]; aChip[1649]=aTile[145]; aChip[1650]=aTile[146]; aChip[1651]=aTile[147];

			nChip[2580]=nTile[148]; nChip[2581]=nTile[149]; nChip[2582]=nTile[150]; nChip[2583]=nTile[151];
			hChip[2676]=hTile[148]; hChip[2677]=hTile[149]; hChip[2678]=hTile[150]; hChip[2679]=hTile[151];
			vChip[1556]=vTile[148]; vChip[1557]=vTile[149]; vChip[1558]=vTile[150]; vChip[1559]=vTile[151];
			aChip[1652]=aTile[148]; aChip[1653]=aTile[149]; aChip[1654]=aTile[150]; aChip[1655]=aTile[151];

			nChip[2584]=nTile[152]; nChip[2585]=nTile[153]; nChip[2586]=nTile[154]; nChip[2587]=nTile[155];
			hChip[2680]=hTile[152]; hChip[2681]=hTile[153]; hChip[2682]=hTile[154]; hChip[2683]=hTile[155];
			vChip[1560]=vTile[152]; vChip[1561]=vTile[153]; vChip[1562]=vTile[154]; vChip[1563]=vTile[155];
			aChip[1656]=aTile[152]; aChip[1657]=aTile[153]; aChip[1658]=aTile[154]; aChip[1659]=aTile[155];

			nChip[2588]=nTile[156]; nChip[2589]=nTile[157]; nChip[2590]=nTile[158]; nChip[2591]=nTile[159];
			hChip[2684]=hTile[156]; hChip[2685]=hTile[157]; hChip[2686]=hTile[158]; hChip[2687]=hTile[159];
			vChip[1564]=vTile[156]; vChip[1565]=vTile[157]; vChip[1566]=vTile[158]; vChip[1567]=vTile[159];
			aChip[1660]=aTile[156]; aChip[1661]=aTile[157]; aChip[1662]=aTile[158]; aChip[1663]=aTile[159];

			nChip[2688]=nTile[160]; nChip[2689]=nTile[161]; nChip[2690]=nTile[162]; nChip[2691]=nTile[163];
			hChip[2784]=hTile[160]; hChip[2785]=hTile[161]; hChip[2786]=hTile[162]; hChip[2787]=hTile[163];
			vChip[1664]=vTile[160]; vChip[1665]=vTile[161]; vChip[1666]=vTile[162]; vChip[1667]=vTile[163];
			aChip[1760]=aTile[160]; aChip[1761]=aTile[161]; aChip[1762]=aTile[162]; aChip[1763]=aTile[163];

			nChip[2692]=nTile[164]; nChip[2693]=nTile[165]; nChip[2694]=nTile[166]; nChip[2695]=nTile[167];
			hChip[2788]=hTile[164]; hChip[2789]=hTile[165]; hChip[2790]=hTile[166]; hChip[2791]=hTile[167];
			vChip[1668]=vTile[164]; vChip[1669]=vTile[165]; vChip[1670]=vTile[166]; vChip[1671]=vTile[167];
			aChip[1764]=aTile[164]; aChip[1765]=aTile[165]; aChip[1766]=aTile[166]; aChip[1767]=aTile[167];

			nChip[2696]=nTile[168]; nChip[2697]=nTile[169]; nChip[2698]=nTile[170]; nChip[2699]=nTile[171];
			hChip[2792]=hTile[168]; hChip[2793]=hTile[169]; hChip[2794]=hTile[170]; hChip[2795]=hTile[171];
			vChip[1672]=vTile[168]; vChip[1673]=vTile[169]; vChip[1674]=vTile[170]; vChip[1675]=vTile[171];
			aChip[1768]=aTile[168]; aChip[1769]=aTile[169]; aChip[1770]=aTile[170]; aChip[1771]=aTile[171];

			nChip[2700]=nTile[172]; nChip[2701]=nTile[173]; nChip[2702]=nTile[174]; nChip[2703]=nTile[175];
			hChip[2796]=hTile[172]; hChip[2797]=hTile[173]; hChip[2798]=hTile[174]; hChip[2799]=hTile[175];
			vChip[1676]=vTile[172]; vChip[1677]=vTile[173]; vChip[1678]=vTile[174]; vChip[1679]=vTile[175];
			aChip[1772]=aTile[172]; aChip[1773]=aTile[173]; aChip[1774]=aTile[174]; aChip[1775]=aTile[175];

			nChip[2704]=nTile[176]; nChip[2705]=nTile[177]; nChip[2706]=nTile[178]; nChip[2707]=nTile[179];
			hChip[2800]=hTile[176]; hChip[2801]=hTile[177]; hChip[2802]=hTile[178]; hChip[2803]=hTile[179];
			vChip[1680]=vTile[176]; vChip[1681]=vTile[177]; vChip[1682]=vTile[178]; vChip[1683]=vTile[179];
			aChip[1776]=aTile[176]; aChip[1777]=aTile[177]; aChip[1778]=aTile[178]; aChip[1779]=aTile[179];

			nChip[2708]=nTile[180]; nChip[2709]=nTile[181]; nChip[2710]=nTile[182]; nChip[2711]=nTile[183];
			hChip[2804]=hTile[180]; hChip[2805]=hTile[181]; hChip[2806]=hTile[182]; hChip[2807]=hTile[183];
			vChip[1684]=vTile[180]; vChip[1685]=vTile[181]; vChip[1686]=vTile[182]; vChip[1687]=vTile[183];
			aChip[1780]=aTile[180]; aChip[1781]=aTile[181]; aChip[1782]=aTile[182]; aChip[1783]=aTile[183];

			nChip[2712]=nTile[184]; nChip[2713]=nTile[185]; nChip[2714]=nTile[186]; nChip[2715]=nTile[187];
			hChip[2808]=hTile[184]; hChip[2809]=hTile[185]; hChip[2810]=hTile[186]; hChip[2811]=hTile[187];
			vChip[1688]=vTile[184]; vChip[1689]=vTile[185]; vChip[1690]=vTile[186]; vChip[1691]=vTile[187];
			aChip[1784]=aTile[184]; aChip[1785]=aTile[185]; aChip[1786]=aTile[186]; aChip[1787]=aTile[187];

			nChip[2716]=nTile[188]; nChip[2717]=nTile[189]; nChip[2718]=nTile[190]; nChip[2719]=nTile[191];
			hChip[2812]=hTile[188]; hChip[2813]=hTile[189]; hChip[2814]=hTile[190]; hChip[2815]=hTile[191];
			vChip[1692]=vTile[188]; vChip[1693]=vTile[189]; vChip[1694]=vTile[190]; vChip[1695]=vTile[191];
			aChip[1788]=aTile[188]; aChip[1789]=aTile[189]; aChip[1790]=aTile[190]; aChip[1791]=aTile[191];

			nChip[2816]=nTile[192]; nChip[2817]=nTile[193]; nChip[2818]=nTile[194]; nChip[2819]=nTile[195];
			hChip[2912]=hTile[192]; hChip[2913]=hTile[193]; hChip[2914]=hTile[194]; hChip[2915]=hTile[195];
			vChip[1792]=vTile[192]; vChip[1793]=vTile[193]; vChip[1794]=vTile[194]; vChip[1795]=vTile[195];
			aChip[1888]=aTile[192]; aChip[1889]=aTile[193]; aChip[1890]=aTile[194]; aChip[1891]=aTile[195];

			nChip[2820]=nTile[196]; nChip[2821]=nTile[197]; nChip[2822]=nTile[198]; nChip[2823]=nTile[199];
			hChip[2916]=hTile[196]; hChip[2917]=hTile[197]; hChip[2918]=hTile[198]; hChip[2919]=hTile[199];
			vChip[1796]=vTile[196]; vChip[1797]=vTile[197]; vChip[1798]=vTile[198]; vChip[1799]=vTile[199];
			aChip[1892]=aTile[196]; aChip[1893]=aTile[197]; aChip[1894]=aTile[198]; aChip[1895]=aTile[199];

			nChip[2824]=nTile[200]; nChip[2825]=nTile[201]; nChip[2826]=nTile[202]; nChip[2827]=nTile[203];
			hChip[2920]=hTile[200]; hChip[2921]=hTile[201]; hChip[2922]=hTile[202]; hChip[2923]=hTile[203];
			vChip[1800]=vTile[200]; vChip[1801]=vTile[201]; vChip[1802]=vTile[202]; vChip[1803]=vTile[203];
			aChip[1896]=aTile[200]; aChip[1897]=aTile[201]; aChip[1898]=aTile[202]; aChip[1899]=aTile[203];

			nChip[2828]=nTile[204]; nChip[2829]=nTile[205]; nChip[2830]=nTile[206]; nChip[2831]=nTile[207];
			hChip[2924]=hTile[204]; hChip[2925]=hTile[205]; hChip[2926]=hTile[206]; hChip[2927]=hTile[207];
			vChip[1804]=vTile[204]; vChip[1805]=vTile[205]; vChip[1806]=vTile[206]; vChip[1807]=vTile[207];
			aChip[1900]=aTile[204]; aChip[1901]=aTile[205]; aChip[1902]=aTile[206]; aChip[1903]=aTile[207];

			nChip[2832]=nTile[208]; nChip[2833]=nTile[209]; nChip[2834]=nTile[210]; nChip[2835]=nTile[211];
			hChip[2928]=hTile[208]; hChip[2929]=hTile[209]; hChip[2930]=hTile[210]; hChip[2931]=hTile[211];
			vChip[1808]=vTile[208]; vChip[1809]=vTile[209]; vChip[1810]=vTile[210]; vChip[1811]=vTile[211];
			aChip[1904]=aTile[208]; aChip[1905]=aTile[209]; aChip[1906]=aTile[210]; aChip[1907]=aTile[211];

			nChip[2836]=nTile[212]; nChip[2837]=nTile[213]; nChip[2838]=nTile[214]; nChip[2839]=nTile[215];
			hChip[2932]=hTile[212]; hChip[2933]=hTile[213]; hChip[2934]=hTile[214]; hChip[2935]=hTile[215];
			vChip[1812]=vTile[212]; vChip[1813]=vTile[213]; vChip[1814]=vTile[214]; vChip[1815]=vTile[215];
			aChip[1908]=aTile[212]; aChip[1909]=aTile[213]; aChip[1910]=aTile[214]; aChip[1911]=aTile[215];

			nChip[2840]=nTile[216]; nChip[2841]=nTile[217]; nChip[2842]=nTile[218]; nChip[2843]=nTile[219];
			hChip[2936]=hTile[216]; hChip[2937]=hTile[217]; hChip[2938]=hTile[218]; hChip[2939]=hTile[219];
			vChip[1816]=vTile[216]; vChip[1817]=vTile[217]; vChip[1818]=vTile[218]; vChip[1819]=vTile[219];
			aChip[1912]=aTile[216]; aChip[1913]=aTile[217]; aChip[1914]=aTile[218]; aChip[1915]=aTile[219];

			nChip[2844]=nTile[220]; nChip[2845]=nTile[221]; nChip[2846]=nTile[222]; nChip[2847]=nTile[223];
			hChip[2940]=hTile[220]; hChip[2941]=hTile[221]; hChip[2942]=hTile[222]; hChip[2943]=hTile[223];
			vChip[1820]=vTile[220]; vChip[1821]=vTile[221]; vChip[1822]=vTile[222]; vChip[1823]=vTile[223];
			aChip[1916]=aTile[220]; aChip[1917]=aTile[221]; aChip[1918]=aTile[222]; aChip[1919]=aTile[223];

			nChip[2944]=nTile[224]; nChip[2945]=nTile[225]; nChip[2946]=nTile[226]; nChip[2947]=nTile[227];
			hChip[3040]=hTile[224]; hChip[3041]=hTile[225]; hChip[3042]=hTile[226]; hChip[3043]=hTile[227];
			vChip[1920]=vTile[224]; vChip[1921]=vTile[225]; vChip[1922]=vTile[226]; vChip[1923]=vTile[227];
			aChip[2016]=aTile[224]; aChip[2017]=aTile[225]; aChip[2018]=aTile[226]; aChip[2019]=aTile[227];

			nChip[2948]=nTile[228]; nChip[2949]=nTile[229]; nChip[2950]=nTile[230]; nChip[2951]=nTile[231];
			hChip[3044]=hTile[228]; hChip[3045]=hTile[229]; hChip[3046]=hTile[230]; hChip[3047]=hTile[231];
			vChip[1924]=vTile[228]; vChip[1925]=vTile[229]; vChip[1926]=vTile[230]; vChip[1927]=vTile[231];
			aChip[2020]=aTile[228]; aChip[2021]=aTile[229]; aChip[2022]=aTile[230]; aChip[2023]=aTile[231];

			nChip[2952]=nTile[232]; nChip[2953]=nTile[233]; nChip[2954]=nTile[234]; nChip[2955]=nTile[235];
			hChip[3048]=hTile[232]; hChip[3049]=hTile[233]; hChip[3050]=hTile[234]; hChip[3051]=hTile[235];
			vChip[1928]=vTile[232]; vChip[1929]=vTile[233]; vChip[1930]=vTile[234]; vChip[1931]=vTile[235];
			aChip[2024]=aTile[232]; aChip[2025]=aTile[233]; aChip[2026]=aTile[234]; aChip[2027]=aTile[235];

			nChip[2956]=nTile[236]; nChip[2957]=nTile[237]; nChip[2958]=nTile[238]; nChip[2959]=nTile[239];
			hChip[3052]=hTile[236]; hChip[3053]=hTile[237]; hChip[3054]=hTile[238]; hChip[3055]=hTile[239];
			vChip[1932]=vTile[236]; vChip[1933]=vTile[237]; vChip[1934]=vTile[238]; vChip[1935]=vTile[239];
			aChip[2028]=aTile[236]; aChip[2029]=aTile[237]; aChip[2030]=aTile[238]; aChip[2031]=aTile[239];

			nChip[2960]=nTile[240]; nChip[2961]=nTile[241]; nChip[2962]=nTile[242]; nChip[2963]=nTile[243];
			hChip[3056]=hTile[240]; hChip[3057]=hTile[241]; hChip[3058]=hTile[242]; hChip[3059]=hTile[243];
			vChip[1936]=vTile[240]; vChip[1937]=vTile[241]; vChip[1938]=vTile[242]; vChip[1939]=vTile[243];
			aChip[2032]=aTile[240]; aChip[2033]=aTile[241]; aChip[2034]=aTile[242]; aChip[2035]=aTile[243];

			nChip[2964]=nTile[244]; nChip[2965]=nTile[245]; nChip[2966]=nTile[246]; nChip[2967]=nTile[247];
			hChip[3060]=hTile[244]; hChip[3061]=hTile[245]; hChip[3062]=hTile[246]; hChip[3063]=hTile[247];
			vChip[1940]=vTile[244]; vChip[1941]=vTile[245]; vChip[1942]=vTile[246]; vChip[1943]=vTile[247];
			aChip[2036]=aTile[244]; aChip[2037]=aTile[245]; aChip[2038]=aTile[246]; aChip[2039]=aTile[247];

			nChip[2968]=nTile[248]; nChip[2969]=nTile[249]; nChip[2970]=nTile[250]; nChip[2971]=nTile[251];
			hChip[3064]=hTile[248]; hChip[3065]=hTile[249]; hChip[3066]=hTile[250]; hChip[3067]=hTile[251];
			vChip[1944]=vTile[248]; vChip[1945]=vTile[249]; vChip[1946]=vTile[250]; vChip[1947]=vTile[251];
			aChip[2040]=aTile[248]; aChip[2041]=aTile[249]; aChip[2042]=aTile[250]; aChip[2043]=aTile[251];

			nChip[2972]=nTile[252]; nChip[2973]=nTile[253]; nChip[2974]=nTile[254]; nChip[2975]=nTile[255];
			hChip[3068]=hTile[252]; hChip[3069]=hTile[253]; hChip[3070]=hTile[254]; hChip[3071]=hTile[255];
			vChip[1948]=vTile[252]; vChip[1949]=vTile[253]; vChip[1950]=vTile[254]; vChip[1951]=vTile[255];
			aChip[2044]=aTile[252]; aChip[2045]=aTile[253]; aChip[2046]=aTile[254]; aChip[2047]=aTile[255];

			A = d[cOfst+18]; B = d[cOfst+19];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[2080]=nTile[0]; nChip[2081]=nTile[1]; nChip[2082]=nTile[2]; nChip[2083]=nTile[3];
			hChip[2112]=hTile[0]; hChip[2113]=hTile[1]; hChip[2114]=hTile[2]; hChip[2115]=hTile[3];
			vChip[1056]=vTile[0]; vChip[1057]=vTile[1]; vChip[1058]=vTile[2]; vChip[1059]=vTile[3];
			aChip[1088]=aTile[0]; aChip[1089]=aTile[1]; aChip[1090]=aTile[2]; aChip[1091]=aTile[3];

			nChip[2084]=nTile[4]; nChip[2085]=nTile[5]; nChip[2086]=nTile[6]; nChip[2087]=nTile[7];
			hChip[2116]=hTile[4]; hChip[2117]=hTile[5]; hChip[2118]=hTile[6]; hChip[2119]=hTile[7];
			vChip[1060]=vTile[4]; vChip[1061]=vTile[5]; vChip[1062]=vTile[6]; vChip[1063]=vTile[7];
			aChip[1092]=aTile[4]; aChip[1093]=aTile[5]; aChip[1094]=aTile[6]; aChip[1095]=aTile[7];

			nChip[2088]=nTile[8]; nChip[2089]=nTile[9]; nChip[2090]=nTile[10]; nChip[2091]=nTile[11];
			hChip[2120]=hTile[8]; hChip[2121]=hTile[9]; hChip[2122]=hTile[10]; hChip[2123]=hTile[11];
			vChip[1064]=vTile[8]; vChip[1065]=vTile[9]; vChip[1066]=vTile[10]; vChip[1067]=vTile[11];
			aChip[1096]=aTile[8]; aChip[1097]=aTile[9]; aChip[1098]=aTile[10]; aChip[1099]=aTile[11];

			nChip[2092]=nTile[12]; nChip[2093]=nTile[13]; nChip[2094]=nTile[14]; nChip[2095]=nTile[15];
			hChip[2124]=hTile[12]; hChip[2125]=hTile[13]; hChip[2126]=hTile[14]; hChip[2127]=hTile[15];
			vChip[1068]=vTile[12]; vChip[1069]=vTile[13]; vChip[1070]=vTile[14]; vChip[1071]=vTile[15];
			aChip[1100]=aTile[12]; aChip[1101]=aTile[13]; aChip[1102]=aTile[14]; aChip[1103]=aTile[15];

			nChip[2096]=nTile[16]; nChip[2097]=nTile[17]; nChip[2098]=nTile[18]; nChip[2099]=nTile[19];
			hChip[2128]=hTile[16]; hChip[2129]=hTile[17]; hChip[2130]=hTile[18]; hChip[2131]=hTile[19];
			vChip[1072]=vTile[16]; vChip[1073]=vTile[17]; vChip[1074]=vTile[18]; vChip[1075]=vTile[19];
			aChip[1104]=aTile[16]; aChip[1105]=aTile[17]; aChip[1106]=aTile[18]; aChip[1107]=aTile[19];

			nChip[2100]=nTile[20]; nChip[2101]=nTile[21]; nChip[2102]=nTile[22]; nChip[2103]=nTile[23];
			hChip[2132]=hTile[20]; hChip[2133]=hTile[21]; hChip[2134]=hTile[22]; hChip[2135]=hTile[23];
			vChip[1076]=vTile[20]; vChip[1077]=vTile[21]; vChip[1078]=vTile[22]; vChip[1079]=vTile[23];
			aChip[1108]=aTile[20]; aChip[1109]=aTile[21]; aChip[1110]=aTile[22]; aChip[1111]=aTile[23];

			nChip[2104]=nTile[24]; nChip[2105]=nTile[25]; nChip[2106]=nTile[26]; nChip[2107]=nTile[27];
			hChip[2136]=hTile[24]; hChip[2137]=hTile[25]; hChip[2138]=hTile[26]; hChip[2139]=hTile[27];
			vChip[1080]=vTile[24]; vChip[1081]=vTile[25]; vChip[1082]=vTile[26]; vChip[1083]=vTile[27];
			aChip[1112]=aTile[24]; aChip[1113]=aTile[25]; aChip[1114]=aTile[26]; aChip[1115]=aTile[27];

			nChip[2108]=nTile[28]; nChip[2109]=nTile[29]; nChip[2110]=nTile[30]; nChip[2111]=nTile[31];
			hChip[2140]=hTile[28]; hChip[2141]=hTile[29]; hChip[2142]=hTile[30]; hChip[2143]=hTile[31];
			vChip[1084]=vTile[28]; vChip[1085]=vTile[29]; vChip[1086]=vTile[30]; vChip[1087]=vTile[31];
			aChip[1116]=aTile[28]; aChip[1117]=aTile[29]; aChip[1118]=aTile[30]; aChip[1119]=aTile[31];

			nChip[2208]=nTile[32]; nChip[2209]=nTile[33]; nChip[2210]=nTile[34]; nChip[2211]=nTile[35];
			hChip[2240]=hTile[32]; hChip[2241]=hTile[33]; hChip[2242]=hTile[34]; hChip[2243]=hTile[35];
			vChip[1184]=vTile[32]; vChip[1185]=vTile[33]; vChip[1186]=vTile[34]; vChip[1187]=vTile[35];
			aChip[1216]=aTile[32]; aChip[1217]=aTile[33]; aChip[1218]=aTile[34]; aChip[1219]=aTile[35];

			nChip[2212]=nTile[36]; nChip[2213]=nTile[37]; nChip[2214]=nTile[38]; nChip[2215]=nTile[39];
			hChip[2244]=hTile[36]; hChip[2245]=hTile[37]; hChip[2246]=hTile[38]; hChip[2247]=hTile[39];
			vChip[1188]=vTile[36]; vChip[1189]=vTile[37]; vChip[1190]=vTile[38]; vChip[1191]=vTile[39];
			aChip[1220]=aTile[36]; aChip[1221]=aTile[37]; aChip[1222]=aTile[38]; aChip[1223]=aTile[39];

			nChip[2216]=nTile[40]; nChip[2217]=nTile[41]; nChip[2218]=nTile[42]; nChip[2219]=nTile[43];
			hChip[2248]=hTile[40]; hChip[2249]=hTile[41]; hChip[2250]=hTile[42]; hChip[2251]=hTile[43];
			vChip[1192]=vTile[40]; vChip[1193]=vTile[41]; vChip[1194]=vTile[42]; vChip[1195]=vTile[43];
			aChip[1224]=aTile[40]; aChip[1225]=aTile[41]; aChip[1226]=aTile[42]; aChip[1227]=aTile[43];

			nChip[2220]=nTile[44]; nChip[2221]=nTile[45]; nChip[2222]=nTile[46]; nChip[2223]=nTile[47];
			hChip[2252]=hTile[44]; hChip[2253]=hTile[45]; hChip[2254]=hTile[46]; hChip[2255]=hTile[47];
			vChip[1196]=vTile[44]; vChip[1197]=vTile[45]; vChip[1198]=vTile[46]; vChip[1199]=vTile[47];
			aChip[1228]=aTile[44]; aChip[1229]=aTile[45]; aChip[1230]=aTile[46]; aChip[1231]=aTile[47];

			nChip[2224]=nTile[48]; nChip[2225]=nTile[49]; nChip[2226]=nTile[50]; nChip[2227]=nTile[51];
			hChip[2256]=hTile[48]; hChip[2257]=hTile[49]; hChip[2258]=hTile[50]; hChip[2259]=hTile[51];
			vChip[1200]=vTile[48]; vChip[1201]=vTile[49]; vChip[1202]=vTile[50]; vChip[1203]=vTile[51];
			aChip[1232]=aTile[48]; aChip[1233]=aTile[49]; aChip[1234]=aTile[50]; aChip[1235]=aTile[51];

			nChip[2228]=nTile[52]; nChip[2229]=nTile[53]; nChip[2230]=nTile[54]; nChip[2231]=nTile[55];
			hChip[2260]=hTile[52]; hChip[2261]=hTile[53]; hChip[2262]=hTile[54]; hChip[2263]=hTile[55];
			vChip[1204]=vTile[52]; vChip[1205]=vTile[53]; vChip[1206]=vTile[54]; vChip[1207]=vTile[55];
			aChip[1236]=aTile[52]; aChip[1237]=aTile[53]; aChip[1238]=aTile[54]; aChip[1239]=aTile[55];

			nChip[2232]=nTile[56]; nChip[2233]=nTile[57]; nChip[2234]=nTile[58]; nChip[2235]=nTile[59];
			hChip[2264]=hTile[56]; hChip[2265]=hTile[57]; hChip[2266]=hTile[58]; hChip[2267]=hTile[59];
			vChip[1208]=vTile[56]; vChip[1209]=vTile[57]; vChip[1210]=vTile[58]; vChip[1211]=vTile[59];
			aChip[1240]=aTile[56]; aChip[1241]=aTile[57]; aChip[1242]=aTile[58]; aChip[1243]=aTile[59];

			nChip[2236]=nTile[60]; nChip[2237]=nTile[61]; nChip[2238]=nTile[62]; nChip[2239]=nTile[63];
			hChip[2268]=hTile[60]; hChip[2269]=hTile[61]; hChip[2270]=hTile[62]; hChip[2271]=hTile[63];
			vChip[1212]=vTile[60]; vChip[1213]=vTile[61]; vChip[1214]=vTile[62]; vChip[1215]=vTile[63];
			aChip[1244]=aTile[60]; aChip[1245]=aTile[61]; aChip[1246]=aTile[62]; aChip[1247]=aTile[63];

			nChip[2336]=nTile[64]; nChip[2337]=nTile[65]; nChip[2338]=nTile[66]; nChip[2339]=nTile[67];
			hChip[2368]=hTile[64]; hChip[2369]=hTile[65]; hChip[2370]=hTile[66]; hChip[2371]=hTile[67];
			vChip[1312]=vTile[64]; vChip[1313]=vTile[65]; vChip[1314]=vTile[66]; vChip[1315]=vTile[67];
			aChip[1344]=aTile[64]; aChip[1345]=aTile[65]; aChip[1346]=aTile[66]; aChip[1347]=aTile[67];

			nChip[2340]=nTile[68]; nChip[2341]=nTile[69]; nChip[2342]=nTile[70]; nChip[2343]=nTile[71];
			hChip[2372]=hTile[68]; hChip[2373]=hTile[69]; hChip[2374]=hTile[70]; hChip[2375]=hTile[71];
			vChip[1316]=vTile[68]; vChip[1317]=vTile[69]; vChip[1318]=vTile[70]; vChip[1319]=vTile[71];
			aChip[1348]=aTile[68]; aChip[1349]=aTile[69]; aChip[1350]=aTile[70]; aChip[1351]=aTile[71];

			nChip[2344]=nTile[72]; nChip[2345]=nTile[73]; nChip[2346]=nTile[74]; nChip[2347]=nTile[75];
			hChip[2376]=hTile[72]; hChip[2377]=hTile[73]; hChip[2378]=hTile[74]; hChip[2379]=hTile[75];
			vChip[1320]=vTile[72]; vChip[1321]=vTile[73]; vChip[1322]=vTile[74]; vChip[1323]=vTile[75];
			aChip[1352]=aTile[72]; aChip[1353]=aTile[73]; aChip[1354]=aTile[74]; aChip[1355]=aTile[75];

			nChip[2348]=nTile[76]; nChip[2349]=nTile[77]; nChip[2350]=nTile[78]; nChip[2351]=nTile[79];
			hChip[2380]=hTile[76]; hChip[2381]=hTile[77]; hChip[2382]=hTile[78]; hChip[2383]=hTile[79];
			vChip[1324]=vTile[76]; vChip[1325]=vTile[77]; vChip[1326]=vTile[78]; vChip[1327]=vTile[79];
			aChip[1356]=aTile[76]; aChip[1357]=aTile[77]; aChip[1358]=aTile[78]; aChip[1359]=aTile[79];

			nChip[2352]=nTile[80]; nChip[2353]=nTile[81]; nChip[2354]=nTile[82]; nChip[2355]=nTile[83];
			hChip[2384]=hTile[80]; hChip[2385]=hTile[81]; hChip[2386]=hTile[82]; hChip[2387]=hTile[83];
			vChip[1328]=vTile[80]; vChip[1329]=vTile[81]; vChip[1330]=vTile[82]; vChip[1331]=vTile[83];
			aChip[1360]=aTile[80]; aChip[1361]=aTile[81]; aChip[1362]=aTile[82]; aChip[1363]=aTile[83];

			nChip[2356]=nTile[84]; nChip[2357]=nTile[85]; nChip[2358]=nTile[86]; nChip[2359]=nTile[87];
			hChip[2388]=hTile[84]; hChip[2389]=hTile[85]; hChip[2390]=hTile[86]; hChip[2391]=hTile[87];
			vChip[1332]=vTile[84]; vChip[1333]=vTile[85]; vChip[1334]=vTile[86]; vChip[1335]=vTile[87];
			aChip[1364]=aTile[84]; aChip[1365]=aTile[85]; aChip[1366]=aTile[86]; aChip[1367]=aTile[87];

			nChip[2360]=nTile[88]; nChip[2361]=nTile[89]; nChip[2362]=nTile[90]; nChip[2363]=nTile[91];
			hChip[2392]=hTile[88]; hChip[2393]=hTile[89]; hChip[2394]=hTile[90]; hChip[2395]=hTile[91];
			vChip[1336]=vTile[88]; vChip[1337]=vTile[89]; vChip[1338]=vTile[90]; vChip[1339]=vTile[91];
			aChip[1368]=aTile[88]; aChip[1369]=aTile[89]; aChip[1370]=aTile[90]; aChip[1371]=aTile[91];

			nChip[2364]=nTile[92]; nChip[2365]=nTile[93]; nChip[2366]=nTile[94]; nChip[2367]=nTile[95];
			hChip[2396]=hTile[92]; hChip[2397]=hTile[93]; hChip[2398]=hTile[94]; hChip[2399]=hTile[95];
			vChip[1340]=vTile[92]; vChip[1341]=vTile[93]; vChip[1342]=vTile[94]; vChip[1343]=vTile[95];
			aChip[1372]=aTile[92]; aChip[1373]=aTile[93]; aChip[1374]=aTile[94]; aChip[1375]=aTile[95];

			nChip[2464]=nTile[96]; nChip[2465]=nTile[97]; nChip[2466]=nTile[98]; nChip[2467]=nTile[99];
			hChip[2496]=hTile[96]; hChip[2497]=hTile[97]; hChip[2498]=hTile[98]; hChip[2499]=hTile[99];
			vChip[1440]=vTile[96]; vChip[1441]=vTile[97]; vChip[1442]=vTile[98]; vChip[1443]=vTile[99];
			aChip[1472]=aTile[96]; aChip[1473]=aTile[97]; aChip[1474]=aTile[98]; aChip[1475]=aTile[99];

			nChip[2468]=nTile[100]; nChip[2469]=nTile[101]; nChip[2470]=nTile[102]; nChip[2471]=nTile[103];
			hChip[2500]=hTile[100]; hChip[2501]=hTile[101]; hChip[2502]=hTile[102]; hChip[2503]=hTile[103];
			vChip[1444]=vTile[100]; vChip[1445]=vTile[101]; vChip[1446]=vTile[102]; vChip[1447]=vTile[103];
			aChip[1476]=aTile[100]; aChip[1477]=aTile[101]; aChip[1478]=aTile[102]; aChip[1479]=aTile[103];

			nChip[2472]=nTile[104]; nChip[2473]=nTile[105]; nChip[2474]=nTile[106]; nChip[2475]=nTile[107];
			hChip[2504]=hTile[104]; hChip[2505]=hTile[105]; hChip[2506]=hTile[106]; hChip[2507]=hTile[107];
			vChip[1448]=vTile[104]; vChip[1449]=vTile[105]; vChip[1450]=vTile[106]; vChip[1451]=vTile[107];
			aChip[1480]=aTile[104]; aChip[1481]=aTile[105]; aChip[1482]=aTile[106]; aChip[1483]=aTile[107];

			nChip[2476]=nTile[108]; nChip[2477]=nTile[109]; nChip[2478]=nTile[110]; nChip[2479]=nTile[111];
			hChip[2508]=hTile[108]; hChip[2509]=hTile[109]; hChip[2510]=hTile[110]; hChip[2511]=hTile[111];
			vChip[1452]=vTile[108]; vChip[1453]=vTile[109]; vChip[1454]=vTile[110]; vChip[1455]=vTile[111];
			aChip[1484]=aTile[108]; aChip[1485]=aTile[109]; aChip[1486]=aTile[110]; aChip[1487]=aTile[111];

			nChip[2480]=nTile[112]; nChip[2481]=nTile[113]; nChip[2482]=nTile[114]; nChip[2483]=nTile[115];
			hChip[2512]=hTile[112]; hChip[2513]=hTile[113]; hChip[2514]=hTile[114]; hChip[2515]=hTile[115];
			vChip[1456]=vTile[112]; vChip[1457]=vTile[113]; vChip[1458]=vTile[114]; vChip[1459]=vTile[115];
			aChip[1488]=aTile[112]; aChip[1489]=aTile[113]; aChip[1490]=aTile[114]; aChip[1491]=aTile[115];

			nChip[2484]=nTile[116]; nChip[2485]=nTile[117]; nChip[2486]=nTile[118]; nChip[2487]=nTile[119];
			hChip[2516]=hTile[116]; hChip[2517]=hTile[117]; hChip[2518]=hTile[118]; hChip[2519]=hTile[119];
			vChip[1460]=vTile[116]; vChip[1461]=vTile[117]; vChip[1462]=vTile[118]; vChip[1463]=vTile[119];
			aChip[1492]=aTile[116]; aChip[1493]=aTile[117]; aChip[1494]=aTile[118]; aChip[1495]=aTile[119];

			nChip[2488]=nTile[120]; nChip[2489]=nTile[121]; nChip[2490]=nTile[122]; nChip[2491]=nTile[123];
			hChip[2520]=hTile[120]; hChip[2521]=hTile[121]; hChip[2522]=hTile[122]; hChip[2523]=hTile[123];
			vChip[1464]=vTile[120]; vChip[1465]=vTile[121]; vChip[1466]=vTile[122]; vChip[1467]=vTile[123];
			aChip[1496]=aTile[120]; aChip[1497]=aTile[121]; aChip[1498]=aTile[122]; aChip[1499]=aTile[123];

			nChip[2492]=nTile[124]; nChip[2493]=nTile[125]; nChip[2494]=nTile[126]; nChip[2495]=nTile[127];
			hChip[2524]=hTile[124]; hChip[2525]=hTile[125]; hChip[2526]=hTile[126]; hChip[2527]=hTile[127];
			vChip[1468]=vTile[124]; vChip[1469]=vTile[125]; vChip[1470]=vTile[126]; vChip[1471]=vTile[127];
			aChip[1500]=aTile[124]; aChip[1501]=aTile[125]; aChip[1502]=aTile[126]; aChip[1503]=aTile[127];

			nChip[2592]=nTile[128]; nChip[2593]=nTile[129]; nChip[2594]=nTile[130]; nChip[2595]=nTile[131];
			hChip[2624]=hTile[128]; hChip[2625]=hTile[129]; hChip[2626]=hTile[130]; hChip[2627]=hTile[131];
			vChip[1568]=vTile[128]; vChip[1569]=vTile[129]; vChip[1570]=vTile[130]; vChip[1571]=vTile[131];
			aChip[1600]=aTile[128]; aChip[1601]=aTile[129]; aChip[1602]=aTile[130]; aChip[1603]=aTile[131];

			nChip[2596]=nTile[132]; nChip[2597]=nTile[133]; nChip[2598]=nTile[134]; nChip[2599]=nTile[135];
			hChip[2628]=hTile[132]; hChip[2629]=hTile[133]; hChip[2630]=hTile[134]; hChip[2631]=hTile[135];
			vChip[1572]=vTile[132]; vChip[1573]=vTile[133]; vChip[1574]=vTile[134]; vChip[1575]=vTile[135];
			aChip[1604]=aTile[132]; aChip[1605]=aTile[133]; aChip[1606]=aTile[134]; aChip[1607]=aTile[135];

			nChip[2600]=nTile[136]; nChip[2601]=nTile[137]; nChip[2602]=nTile[138]; nChip[2603]=nTile[139];
			hChip[2632]=hTile[136]; hChip[2633]=hTile[137]; hChip[2634]=hTile[138]; hChip[2635]=hTile[139];
			vChip[1576]=vTile[136]; vChip[1577]=vTile[137]; vChip[1578]=vTile[138]; vChip[1579]=vTile[139];
			aChip[1608]=aTile[136]; aChip[1609]=aTile[137]; aChip[1610]=aTile[138]; aChip[1611]=aTile[139];

			nChip[2604]=nTile[140]; nChip[2605]=nTile[141]; nChip[2606]=nTile[142]; nChip[2607]=nTile[143];
			hChip[2636]=hTile[140]; hChip[2637]=hTile[141]; hChip[2638]=hTile[142]; hChip[2639]=hTile[143];
			vChip[1580]=vTile[140]; vChip[1581]=vTile[141]; vChip[1582]=vTile[142]; vChip[1583]=vTile[143];
			aChip[1612]=aTile[140]; aChip[1613]=aTile[141]; aChip[1614]=aTile[142]; aChip[1615]=aTile[143];

			nChip[2608]=nTile[144]; nChip[2609]=nTile[145]; nChip[2610]=nTile[146]; nChip[2611]=nTile[147];
			hChip[2640]=hTile[144]; hChip[2641]=hTile[145]; hChip[2642]=hTile[146]; hChip[2643]=hTile[147];
			vChip[1584]=vTile[144]; vChip[1585]=vTile[145]; vChip[1586]=vTile[146]; vChip[1587]=vTile[147];
			aChip[1616]=aTile[144]; aChip[1617]=aTile[145]; aChip[1618]=aTile[146]; aChip[1619]=aTile[147];

			nChip[2612]=nTile[148]; nChip[2613]=nTile[149]; nChip[2614]=nTile[150]; nChip[2615]=nTile[151];
			hChip[2644]=hTile[148]; hChip[2645]=hTile[149]; hChip[2646]=hTile[150]; hChip[2647]=hTile[151];
			vChip[1588]=vTile[148]; vChip[1589]=vTile[149]; vChip[1590]=vTile[150]; vChip[1591]=vTile[151];
			aChip[1620]=aTile[148]; aChip[1621]=aTile[149]; aChip[1622]=aTile[150]; aChip[1623]=aTile[151];

			nChip[2616]=nTile[152]; nChip[2617]=nTile[153]; nChip[2618]=nTile[154]; nChip[2619]=nTile[155];
			hChip[2648]=hTile[152]; hChip[2649]=hTile[153]; hChip[2650]=hTile[154]; hChip[2651]=hTile[155];
			vChip[1592]=vTile[152]; vChip[1593]=vTile[153]; vChip[1594]=vTile[154]; vChip[1595]=vTile[155];
			aChip[1624]=aTile[152]; aChip[1625]=aTile[153]; aChip[1626]=aTile[154]; aChip[1627]=aTile[155];

			nChip[2620]=nTile[156]; nChip[2621]=nTile[157]; nChip[2622]=nTile[158]; nChip[2623]=nTile[159];
			hChip[2652]=hTile[156]; hChip[2653]=hTile[157]; hChip[2654]=hTile[158]; hChip[2655]=hTile[159];
			vChip[1596]=vTile[156]; vChip[1597]=vTile[157]; vChip[1598]=vTile[158]; vChip[1599]=vTile[159];
			aChip[1628]=aTile[156]; aChip[1629]=aTile[157]; aChip[1630]=aTile[158]; aChip[1631]=aTile[159];

			nChip[2720]=nTile[160]; nChip[2721]=nTile[161]; nChip[2722]=nTile[162]; nChip[2723]=nTile[163];
			hChip[2752]=hTile[160]; hChip[2753]=hTile[161]; hChip[2754]=hTile[162]; hChip[2755]=hTile[163];
			vChip[1696]=vTile[160]; vChip[1697]=vTile[161]; vChip[1698]=vTile[162]; vChip[1699]=vTile[163];
			aChip[1728]=aTile[160]; aChip[1729]=aTile[161]; aChip[1730]=aTile[162]; aChip[1731]=aTile[163];

			nChip[2724]=nTile[164]; nChip[2725]=nTile[165]; nChip[2726]=nTile[166]; nChip[2727]=nTile[167];
			hChip[2756]=hTile[164]; hChip[2757]=hTile[165]; hChip[2758]=hTile[166]; hChip[2759]=hTile[167];
			vChip[1700]=vTile[164]; vChip[1701]=vTile[165]; vChip[1702]=vTile[166]; vChip[1703]=vTile[167];
			aChip[1732]=aTile[164]; aChip[1733]=aTile[165]; aChip[1734]=aTile[166]; aChip[1735]=aTile[167];

			nChip[2728]=nTile[168]; nChip[2729]=nTile[169]; nChip[2730]=nTile[170]; nChip[2731]=nTile[171];
			hChip[2760]=hTile[168]; hChip[2761]=hTile[169]; hChip[2762]=hTile[170]; hChip[2763]=hTile[171];
			vChip[1704]=vTile[168]; vChip[1705]=vTile[169]; vChip[1706]=vTile[170]; vChip[1707]=vTile[171];
			aChip[1736]=aTile[168]; aChip[1737]=aTile[169]; aChip[1738]=aTile[170]; aChip[1739]=aTile[171];

			nChip[2732]=nTile[172]; nChip[2733]=nTile[173]; nChip[2734]=nTile[174]; nChip[2735]=nTile[175];
			hChip[2764]=hTile[172]; hChip[2765]=hTile[173]; hChip[2766]=hTile[174]; hChip[2767]=hTile[175];
			vChip[1708]=vTile[172]; vChip[1709]=vTile[173]; vChip[1710]=vTile[174]; vChip[1711]=vTile[175];
			aChip[1740]=aTile[172]; aChip[1741]=aTile[173]; aChip[1742]=aTile[174]; aChip[1743]=aTile[175];

			nChip[2736]=nTile[176]; nChip[2737]=nTile[177]; nChip[2738]=nTile[178]; nChip[2739]=nTile[179];
			hChip[2768]=hTile[176]; hChip[2769]=hTile[177]; hChip[2770]=hTile[178]; hChip[2771]=hTile[179];
			vChip[1712]=vTile[176]; vChip[1713]=vTile[177]; vChip[1714]=vTile[178]; vChip[1715]=vTile[179];
			aChip[1744]=aTile[176]; aChip[1745]=aTile[177]; aChip[1746]=aTile[178]; aChip[1747]=aTile[179];

			nChip[2740]=nTile[180]; nChip[2741]=nTile[181]; nChip[2742]=nTile[182]; nChip[2743]=nTile[183];
			hChip[2772]=hTile[180]; hChip[2773]=hTile[181]; hChip[2774]=hTile[182]; hChip[2775]=hTile[183];
			vChip[1716]=vTile[180]; vChip[1717]=vTile[181]; vChip[1718]=vTile[182]; vChip[1719]=vTile[183];
			aChip[1748]=aTile[180]; aChip[1749]=aTile[181]; aChip[1750]=aTile[182]; aChip[1751]=aTile[183];

			nChip[2744]=nTile[184]; nChip[2745]=nTile[185]; nChip[2746]=nTile[186]; nChip[2747]=nTile[187];
			hChip[2776]=hTile[184]; hChip[2777]=hTile[185]; hChip[2778]=hTile[186]; hChip[2779]=hTile[187];
			vChip[1720]=vTile[184]; vChip[1721]=vTile[185]; vChip[1722]=vTile[186]; vChip[1723]=vTile[187];
			aChip[1752]=aTile[184]; aChip[1753]=aTile[185]; aChip[1754]=aTile[186]; aChip[1755]=aTile[187];

			nChip[2748]=nTile[188]; nChip[2749]=nTile[189]; nChip[2750]=nTile[190]; nChip[2751]=nTile[191];
			hChip[2780]=hTile[188]; hChip[2781]=hTile[189]; hChip[2782]=hTile[190]; hChip[2783]=hTile[191];
			vChip[1724]=vTile[188]; vChip[1725]=vTile[189]; vChip[1726]=vTile[190]; vChip[1727]=vTile[191];
			aChip[1756]=aTile[188]; aChip[1757]=aTile[189]; aChip[1758]=aTile[190]; aChip[1759]=aTile[191];

			nChip[2848]=nTile[192]; nChip[2849]=nTile[193]; nChip[2850]=nTile[194]; nChip[2851]=nTile[195];
			hChip[2880]=hTile[192]; hChip[2881]=hTile[193]; hChip[2882]=hTile[194]; hChip[2883]=hTile[195];
			vChip[1824]=vTile[192]; vChip[1825]=vTile[193]; vChip[1826]=vTile[194]; vChip[1827]=vTile[195];
			aChip[1856]=aTile[192]; aChip[1857]=aTile[193]; aChip[1858]=aTile[194]; aChip[1859]=aTile[195];

			nChip[2852]=nTile[196]; nChip[2853]=nTile[197]; nChip[2854]=nTile[198]; nChip[2855]=nTile[199];
			hChip[2884]=hTile[196]; hChip[2885]=hTile[197]; hChip[2886]=hTile[198]; hChip[2887]=hTile[199];
			vChip[1828]=vTile[196]; vChip[1829]=vTile[197]; vChip[1830]=vTile[198]; vChip[1831]=vTile[199];
			aChip[1860]=aTile[196]; aChip[1861]=aTile[197]; aChip[1862]=aTile[198]; aChip[1863]=aTile[199];

			nChip[2856]=nTile[200]; nChip[2857]=nTile[201]; nChip[2858]=nTile[202]; nChip[2859]=nTile[203];
			hChip[2888]=hTile[200]; hChip[2889]=hTile[201]; hChip[2890]=hTile[202]; hChip[2891]=hTile[203];
			vChip[1832]=vTile[200]; vChip[1833]=vTile[201]; vChip[1834]=vTile[202]; vChip[1835]=vTile[203];
			aChip[1864]=aTile[200]; aChip[1865]=aTile[201]; aChip[1866]=aTile[202]; aChip[1867]=aTile[203];

			nChip[2860]=nTile[204]; nChip[2861]=nTile[205]; nChip[2862]=nTile[206]; nChip[2863]=nTile[207];
			hChip[2892]=hTile[204]; hChip[2893]=hTile[205]; hChip[2894]=hTile[206]; hChip[2895]=hTile[207];
			vChip[1836]=vTile[204]; vChip[1837]=vTile[205]; vChip[1838]=vTile[206]; vChip[1839]=vTile[207];
			aChip[1868]=aTile[204]; aChip[1869]=aTile[205]; aChip[1870]=aTile[206]; aChip[1871]=aTile[207];

			nChip[2864]=nTile[208]; nChip[2865]=nTile[209]; nChip[2866]=nTile[210]; nChip[2867]=nTile[211];
			hChip[2896]=hTile[208]; hChip[2897]=hTile[209]; hChip[2898]=hTile[210]; hChip[2899]=hTile[211];
			vChip[1840]=vTile[208]; vChip[1841]=vTile[209]; vChip[1842]=vTile[210]; vChip[1843]=vTile[211];
			aChip[1872]=aTile[208]; aChip[1873]=aTile[209]; aChip[1874]=aTile[210]; aChip[1875]=aTile[211];

			nChip[2868]=nTile[212]; nChip[2869]=nTile[213]; nChip[2870]=nTile[214]; nChip[2871]=nTile[215];
			hChip[2900]=hTile[212]; hChip[2901]=hTile[213]; hChip[2902]=hTile[214]; hChip[2903]=hTile[215];
			vChip[1844]=vTile[212]; vChip[1845]=vTile[213]; vChip[1846]=vTile[214]; vChip[1847]=vTile[215];
			aChip[1876]=aTile[212]; aChip[1877]=aTile[213]; aChip[1878]=aTile[214]; aChip[1879]=aTile[215];

			nChip[2872]=nTile[216]; nChip[2873]=nTile[217]; nChip[2874]=nTile[218]; nChip[2875]=nTile[219];
			hChip[2904]=hTile[216]; hChip[2905]=hTile[217]; hChip[2906]=hTile[218]; hChip[2907]=hTile[219];
			vChip[1848]=vTile[216]; vChip[1849]=vTile[217]; vChip[1850]=vTile[218]; vChip[1851]=vTile[219];
			aChip[1880]=aTile[216]; aChip[1881]=aTile[217]; aChip[1882]=aTile[218]; aChip[1883]=aTile[219];

			nChip[2876]=nTile[220]; nChip[2877]=nTile[221]; nChip[2878]=nTile[222]; nChip[2879]=nTile[223];
			hChip[2908]=hTile[220]; hChip[2909]=hTile[221]; hChip[2910]=hTile[222]; hChip[2911]=hTile[223];
			vChip[1852]=vTile[220]; vChip[1853]=vTile[221]; vChip[1854]=vTile[222]; vChip[1855]=vTile[223];
			aChip[1884]=aTile[220]; aChip[1885]=aTile[221]; aChip[1886]=aTile[222]; aChip[1887]=aTile[223];

			nChip[2976]=nTile[224]; nChip[2977]=nTile[225]; nChip[2978]=nTile[226]; nChip[2979]=nTile[227];
			hChip[3008]=hTile[224]; hChip[3009]=hTile[225]; hChip[3010]=hTile[226]; hChip[3011]=hTile[227];
			vChip[1952]=vTile[224]; vChip[1953]=vTile[225]; vChip[1954]=vTile[226]; vChip[1955]=vTile[227];
			aChip[1984]=aTile[224]; aChip[1985]=aTile[225]; aChip[1986]=aTile[226]; aChip[1987]=aTile[227];

			nChip[2980]=nTile[228]; nChip[2981]=nTile[229]; nChip[2982]=nTile[230]; nChip[2983]=nTile[231];
			hChip[3012]=hTile[228]; hChip[3013]=hTile[229]; hChip[3014]=hTile[230]; hChip[3015]=hTile[231];
			vChip[1956]=vTile[228]; vChip[1957]=vTile[229]; vChip[1958]=vTile[230]; vChip[1959]=vTile[231];
			aChip[1988]=aTile[228]; aChip[1989]=aTile[229]; aChip[1990]=aTile[230]; aChip[1991]=aTile[231];

			nChip[2984]=nTile[232]; nChip[2985]=nTile[233]; nChip[2986]=nTile[234]; nChip[2987]=nTile[235];
			hChip[3016]=hTile[232]; hChip[3017]=hTile[233]; hChip[3018]=hTile[234]; hChip[3019]=hTile[235];
			vChip[1960]=vTile[232]; vChip[1961]=vTile[233]; vChip[1962]=vTile[234]; vChip[1963]=vTile[235];
			aChip[1992]=aTile[232]; aChip[1993]=aTile[233]; aChip[1994]=aTile[234]; aChip[1995]=aTile[235];

			nChip[2988]=nTile[236]; nChip[2989]=nTile[237]; nChip[2990]=nTile[238]; nChip[2991]=nTile[239];
			hChip[3020]=hTile[236]; hChip[3021]=hTile[237]; hChip[3022]=hTile[238]; hChip[3023]=hTile[239];
			vChip[1964]=vTile[236]; vChip[1965]=vTile[237]; vChip[1966]=vTile[238]; vChip[1967]=vTile[239];
			aChip[1996]=aTile[236]; aChip[1997]=aTile[237]; aChip[1998]=aTile[238]; aChip[1999]=aTile[239];

			nChip[2992]=nTile[240]; nChip[2993]=nTile[241]; nChip[2994]=nTile[242]; nChip[2995]=nTile[243];
			hChip[3024]=hTile[240]; hChip[3025]=hTile[241]; hChip[3026]=hTile[242]; hChip[3027]=hTile[243];
			vChip[1968]=vTile[240]; vChip[1969]=vTile[241]; vChip[1970]=vTile[242]; vChip[1971]=vTile[243];
			aChip[2000]=aTile[240]; aChip[2001]=aTile[241]; aChip[2002]=aTile[242]; aChip[2003]=aTile[243];

			nChip[2996]=nTile[244]; nChip[2997]=nTile[245]; nChip[2998]=nTile[246]; nChip[2999]=nTile[247];
			hChip[3028]=hTile[244]; hChip[3029]=hTile[245]; hChip[3030]=hTile[246]; hChip[3031]=hTile[247];
			vChip[1972]=vTile[244]; vChip[1973]=vTile[245]; vChip[1974]=vTile[246]; vChip[1975]=vTile[247];
			aChip[2004]=aTile[244]; aChip[2005]=aTile[245]; aChip[2006]=aTile[246]; aChip[2007]=aTile[247];

			nChip[3000]=nTile[248]; nChip[3001]=nTile[249]; nChip[3002]=nTile[250]; nChip[3003]=nTile[251];
			hChip[3032]=hTile[248]; hChip[3033]=hTile[249]; hChip[3034]=hTile[250]; hChip[3035]=hTile[251];
			vChip[1976]=vTile[248]; vChip[1977]=vTile[249]; vChip[1978]=vTile[250]; vChip[1979]=vTile[251];
			aChip[2008]=aTile[248]; aChip[2009]=aTile[249]; aChip[2010]=aTile[250]; aChip[2011]=aTile[251];

			nChip[3004]=nTile[252]; nChip[3005]=nTile[253]; nChip[3006]=nTile[254]; nChip[3007]=nTile[255];
			hChip[3036]=hTile[252]; hChip[3037]=hTile[253]; hChip[3038]=hTile[254]; hChip[3039]=hTile[255];
			vChip[1980]=vTile[252]; vChip[1981]=vTile[253]; vChip[1982]=vTile[254]; vChip[1983]=vTile[255];
			aChip[2012]=aTile[252]; aChip[2013]=aTile[253]; aChip[2014]=aTile[254]; aChip[2015]=aTile[255];

			A = d[cOfst+20]; B = d[cOfst+21];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[2112]=nTile[0]; nChip[2113]=nTile[1]; nChip[2114]=nTile[2]; nChip[2115]=nTile[3];
			hChip[2080]=hTile[0]; hChip[2081]=hTile[1]; hChip[2082]=hTile[2]; hChip[2083]=hTile[3];
			vChip[1088]=vTile[0]; vChip[1089]=vTile[1]; vChip[1090]=vTile[2]; vChip[1091]=vTile[3];
			aChip[1056]=aTile[0]; aChip[1057]=aTile[1]; aChip[1058]=aTile[2]; aChip[1059]=aTile[3];

			nChip[2116]=nTile[4]; nChip[2117]=nTile[5]; nChip[2118]=nTile[6]; nChip[2119]=nTile[7];
			hChip[2084]=hTile[4]; hChip[2085]=hTile[5]; hChip[2086]=hTile[6]; hChip[2087]=hTile[7];
			vChip[1092]=vTile[4]; vChip[1093]=vTile[5]; vChip[1094]=vTile[6]; vChip[1095]=vTile[7];
			aChip[1060]=aTile[4]; aChip[1061]=aTile[5]; aChip[1062]=aTile[6]; aChip[1063]=aTile[7];

			nChip[2120]=nTile[8]; nChip[2121]=nTile[9]; nChip[2122]=nTile[10]; nChip[2123]=nTile[11];
			hChip[2088]=hTile[8]; hChip[2089]=hTile[9]; hChip[2090]=hTile[10]; hChip[2091]=hTile[11];
			vChip[1096]=vTile[8]; vChip[1097]=vTile[9]; vChip[1098]=vTile[10]; vChip[1099]=vTile[11];
			aChip[1064]=aTile[8]; aChip[1065]=aTile[9]; aChip[1066]=aTile[10]; aChip[1067]=aTile[11];

			nChip[2124]=nTile[12]; nChip[2125]=nTile[13]; nChip[2126]=nTile[14]; nChip[2127]=nTile[15];
			hChip[2092]=hTile[12]; hChip[2093]=hTile[13]; hChip[2094]=hTile[14]; hChip[2095]=hTile[15];
			vChip[1100]=vTile[12]; vChip[1101]=vTile[13]; vChip[1102]=vTile[14]; vChip[1103]=vTile[15];
			aChip[1068]=aTile[12]; aChip[1069]=aTile[13]; aChip[1070]=aTile[14]; aChip[1071]=aTile[15];

			nChip[2128]=nTile[16]; nChip[2129]=nTile[17]; nChip[2130]=nTile[18]; nChip[2131]=nTile[19];
			hChip[2096]=hTile[16]; hChip[2097]=hTile[17]; hChip[2098]=hTile[18]; hChip[2099]=hTile[19];
			vChip[1104]=vTile[16]; vChip[1105]=vTile[17]; vChip[1106]=vTile[18]; vChip[1107]=vTile[19];
			aChip[1072]=aTile[16]; aChip[1073]=aTile[17]; aChip[1074]=aTile[18]; aChip[1075]=aTile[19];

			nChip[2132]=nTile[20]; nChip[2133]=nTile[21]; nChip[2134]=nTile[22]; nChip[2135]=nTile[23];
			hChip[2100]=hTile[20]; hChip[2101]=hTile[21]; hChip[2102]=hTile[22]; hChip[2103]=hTile[23];
			vChip[1108]=vTile[20]; vChip[1109]=vTile[21]; vChip[1110]=vTile[22]; vChip[1111]=vTile[23];
			aChip[1076]=aTile[20]; aChip[1077]=aTile[21]; aChip[1078]=aTile[22]; aChip[1079]=aTile[23];

			nChip[2136]=nTile[24]; nChip[2137]=nTile[25]; nChip[2138]=nTile[26]; nChip[2139]=nTile[27];
			hChip[2104]=hTile[24]; hChip[2105]=hTile[25]; hChip[2106]=hTile[26]; hChip[2107]=hTile[27];
			vChip[1112]=vTile[24]; vChip[1113]=vTile[25]; vChip[1114]=vTile[26]; vChip[1115]=vTile[27];
			aChip[1080]=aTile[24]; aChip[1081]=aTile[25]; aChip[1082]=aTile[26]; aChip[1083]=aTile[27];

			nChip[2140]=nTile[28]; nChip[2141]=nTile[29]; nChip[2142]=nTile[30]; nChip[2143]=nTile[31];
			hChip[2108]=hTile[28]; hChip[2109]=hTile[29]; hChip[2110]=hTile[30]; hChip[2111]=hTile[31];
			vChip[1116]=vTile[28]; vChip[1117]=vTile[29]; vChip[1118]=vTile[30]; vChip[1119]=vTile[31];
			aChip[1084]=aTile[28]; aChip[1085]=aTile[29]; aChip[1086]=aTile[30]; aChip[1087]=aTile[31];

			nChip[2240]=nTile[32]; nChip[2241]=nTile[33]; nChip[2242]=nTile[34]; nChip[2243]=nTile[35];
			hChip[2208]=hTile[32]; hChip[2209]=hTile[33]; hChip[2210]=hTile[34]; hChip[2211]=hTile[35];
			vChip[1216]=vTile[32]; vChip[1217]=vTile[33]; vChip[1218]=vTile[34]; vChip[1219]=vTile[35];
			aChip[1184]=aTile[32]; aChip[1185]=aTile[33]; aChip[1186]=aTile[34]; aChip[1187]=aTile[35];

			nChip[2244]=nTile[36]; nChip[2245]=nTile[37]; nChip[2246]=nTile[38]; nChip[2247]=nTile[39];
			hChip[2212]=hTile[36]; hChip[2213]=hTile[37]; hChip[2214]=hTile[38]; hChip[2215]=hTile[39];
			vChip[1220]=vTile[36]; vChip[1221]=vTile[37]; vChip[1222]=vTile[38]; vChip[1223]=vTile[39];
			aChip[1188]=aTile[36]; aChip[1189]=aTile[37]; aChip[1190]=aTile[38]; aChip[1191]=aTile[39];

			nChip[2248]=nTile[40]; nChip[2249]=nTile[41]; nChip[2250]=nTile[42]; nChip[2251]=nTile[43];
			hChip[2216]=hTile[40]; hChip[2217]=hTile[41]; hChip[2218]=hTile[42]; hChip[2219]=hTile[43];
			vChip[1224]=vTile[40]; vChip[1225]=vTile[41]; vChip[1226]=vTile[42]; vChip[1227]=vTile[43];
			aChip[1192]=aTile[40]; aChip[1193]=aTile[41]; aChip[1194]=aTile[42]; aChip[1195]=aTile[43];

			nChip[2252]=nTile[44]; nChip[2253]=nTile[45]; nChip[2254]=nTile[46]; nChip[2255]=nTile[47];
			hChip[2220]=hTile[44]; hChip[2221]=hTile[45]; hChip[2222]=hTile[46]; hChip[2223]=hTile[47];
			vChip[1228]=vTile[44]; vChip[1229]=vTile[45]; vChip[1230]=vTile[46]; vChip[1231]=vTile[47];
			aChip[1196]=aTile[44]; aChip[1197]=aTile[45]; aChip[1198]=aTile[46]; aChip[1199]=aTile[47];

			nChip[2256]=nTile[48]; nChip[2257]=nTile[49]; nChip[2258]=nTile[50]; nChip[2259]=nTile[51];
			hChip[2224]=hTile[48]; hChip[2225]=hTile[49]; hChip[2226]=hTile[50]; hChip[2227]=hTile[51];
			vChip[1232]=vTile[48]; vChip[1233]=vTile[49]; vChip[1234]=vTile[50]; vChip[1235]=vTile[51];
			aChip[1200]=aTile[48]; aChip[1201]=aTile[49]; aChip[1202]=aTile[50]; aChip[1203]=aTile[51];

			nChip[2260]=nTile[52]; nChip[2261]=nTile[53]; nChip[2262]=nTile[54]; nChip[2263]=nTile[55];
			hChip[2228]=hTile[52]; hChip[2229]=hTile[53]; hChip[2230]=hTile[54]; hChip[2231]=hTile[55];
			vChip[1236]=vTile[52]; vChip[1237]=vTile[53]; vChip[1238]=vTile[54]; vChip[1239]=vTile[55];
			aChip[1204]=aTile[52]; aChip[1205]=aTile[53]; aChip[1206]=aTile[54]; aChip[1207]=aTile[55];

			nChip[2264]=nTile[56]; nChip[2265]=nTile[57]; nChip[2266]=nTile[58]; nChip[2267]=nTile[59];
			hChip[2232]=hTile[56]; hChip[2233]=hTile[57]; hChip[2234]=hTile[58]; hChip[2235]=hTile[59];
			vChip[1240]=vTile[56]; vChip[1241]=vTile[57]; vChip[1242]=vTile[58]; vChip[1243]=vTile[59];
			aChip[1208]=aTile[56]; aChip[1209]=aTile[57]; aChip[1210]=aTile[58]; aChip[1211]=aTile[59];

			nChip[2268]=nTile[60]; nChip[2269]=nTile[61]; nChip[2270]=nTile[62]; nChip[2271]=nTile[63];
			hChip[2236]=hTile[60]; hChip[2237]=hTile[61]; hChip[2238]=hTile[62]; hChip[2239]=hTile[63];
			vChip[1244]=vTile[60]; vChip[1245]=vTile[61]; vChip[1246]=vTile[62]; vChip[1247]=vTile[63];
			aChip[1212]=aTile[60]; aChip[1213]=aTile[61]; aChip[1214]=aTile[62]; aChip[1215]=aTile[63];

			nChip[2368]=nTile[64]; nChip[2369]=nTile[65]; nChip[2370]=nTile[66]; nChip[2371]=nTile[67];
			hChip[2336]=hTile[64]; hChip[2337]=hTile[65]; hChip[2338]=hTile[66]; hChip[2339]=hTile[67];
			vChip[1344]=vTile[64]; vChip[1345]=vTile[65]; vChip[1346]=vTile[66]; vChip[1347]=vTile[67];
			aChip[1312]=aTile[64]; aChip[1313]=aTile[65]; aChip[1314]=aTile[66]; aChip[1315]=aTile[67];

			nChip[2372]=nTile[68]; nChip[2373]=nTile[69]; nChip[2374]=nTile[70]; nChip[2375]=nTile[71];
			hChip[2340]=hTile[68]; hChip[2341]=hTile[69]; hChip[2342]=hTile[70]; hChip[2343]=hTile[71];
			vChip[1348]=vTile[68]; vChip[1349]=vTile[69]; vChip[1350]=vTile[70]; vChip[1351]=vTile[71];
			aChip[1316]=aTile[68]; aChip[1317]=aTile[69]; aChip[1318]=aTile[70]; aChip[1319]=aTile[71];

			nChip[2376]=nTile[72]; nChip[2377]=nTile[73]; nChip[2378]=nTile[74]; nChip[2379]=nTile[75];
			hChip[2344]=hTile[72]; hChip[2345]=hTile[73]; hChip[2346]=hTile[74]; hChip[2347]=hTile[75];
			vChip[1352]=vTile[72]; vChip[1353]=vTile[73]; vChip[1354]=vTile[74]; vChip[1355]=vTile[75];
			aChip[1320]=aTile[72]; aChip[1321]=aTile[73]; aChip[1322]=aTile[74]; aChip[1323]=aTile[75];

			nChip[2380]=nTile[76]; nChip[2381]=nTile[77]; nChip[2382]=nTile[78]; nChip[2383]=nTile[79];
			hChip[2348]=hTile[76]; hChip[2349]=hTile[77]; hChip[2350]=hTile[78]; hChip[2351]=hTile[79];
			vChip[1356]=vTile[76]; vChip[1357]=vTile[77]; vChip[1358]=vTile[78]; vChip[1359]=vTile[79];
			aChip[1324]=aTile[76]; aChip[1325]=aTile[77]; aChip[1326]=aTile[78]; aChip[1327]=aTile[79];

			nChip[2384]=nTile[80]; nChip[2385]=nTile[81]; nChip[2386]=nTile[82]; nChip[2387]=nTile[83];
			hChip[2352]=hTile[80]; hChip[2353]=hTile[81]; hChip[2354]=hTile[82]; hChip[2355]=hTile[83];
			vChip[1360]=vTile[80]; vChip[1361]=vTile[81]; vChip[1362]=vTile[82]; vChip[1363]=vTile[83];
			aChip[1328]=aTile[80]; aChip[1329]=aTile[81]; aChip[1330]=aTile[82]; aChip[1331]=aTile[83];

			nChip[2388]=nTile[84]; nChip[2389]=nTile[85]; nChip[2390]=nTile[86]; nChip[2391]=nTile[87];
			hChip[2356]=hTile[84]; hChip[2357]=hTile[85]; hChip[2358]=hTile[86]; hChip[2359]=hTile[87];
			vChip[1364]=vTile[84]; vChip[1365]=vTile[85]; vChip[1366]=vTile[86]; vChip[1367]=vTile[87];
			aChip[1332]=aTile[84]; aChip[1333]=aTile[85]; aChip[1334]=aTile[86]; aChip[1335]=aTile[87];

			nChip[2392]=nTile[88]; nChip[2393]=nTile[89]; nChip[2394]=nTile[90]; nChip[2395]=nTile[91];
			hChip[2360]=hTile[88]; hChip[2361]=hTile[89]; hChip[2362]=hTile[90]; hChip[2363]=hTile[91];
			vChip[1368]=vTile[88]; vChip[1369]=vTile[89]; vChip[1370]=vTile[90]; vChip[1371]=vTile[91];
			aChip[1336]=aTile[88]; aChip[1337]=aTile[89]; aChip[1338]=aTile[90]; aChip[1339]=aTile[91];

			nChip[2396]=nTile[92]; nChip[2397]=nTile[93]; nChip[2398]=nTile[94]; nChip[2399]=nTile[95];
			hChip[2364]=hTile[92]; hChip[2365]=hTile[93]; hChip[2366]=hTile[94]; hChip[2367]=hTile[95];
			vChip[1372]=vTile[92]; vChip[1373]=vTile[93]; vChip[1374]=vTile[94]; vChip[1375]=vTile[95];
			aChip[1340]=aTile[92]; aChip[1341]=aTile[93]; aChip[1342]=aTile[94]; aChip[1343]=aTile[95];

			nChip[2496]=nTile[96]; nChip[2497]=nTile[97]; nChip[2498]=nTile[98]; nChip[2499]=nTile[99];
			hChip[2464]=hTile[96]; hChip[2465]=hTile[97]; hChip[2466]=hTile[98]; hChip[2467]=hTile[99];
			vChip[1472]=vTile[96]; vChip[1473]=vTile[97]; vChip[1474]=vTile[98]; vChip[1475]=vTile[99];
			aChip[1440]=aTile[96]; aChip[1441]=aTile[97]; aChip[1442]=aTile[98]; aChip[1443]=aTile[99];

			nChip[2500]=nTile[100]; nChip[2501]=nTile[101]; nChip[2502]=nTile[102]; nChip[2503]=nTile[103];
			hChip[2468]=hTile[100]; hChip[2469]=hTile[101]; hChip[2470]=hTile[102]; hChip[2471]=hTile[103];
			vChip[1476]=vTile[100]; vChip[1477]=vTile[101]; vChip[1478]=vTile[102]; vChip[1479]=vTile[103];
			aChip[1444]=aTile[100]; aChip[1445]=aTile[101]; aChip[1446]=aTile[102]; aChip[1447]=aTile[103];

			nChip[2504]=nTile[104]; nChip[2505]=nTile[105]; nChip[2506]=nTile[106]; nChip[2507]=nTile[107];
			hChip[2472]=hTile[104]; hChip[2473]=hTile[105]; hChip[2474]=hTile[106]; hChip[2475]=hTile[107];
			vChip[1480]=vTile[104]; vChip[1481]=vTile[105]; vChip[1482]=vTile[106]; vChip[1483]=vTile[107];
			aChip[1448]=aTile[104]; aChip[1449]=aTile[105]; aChip[1450]=aTile[106]; aChip[1451]=aTile[107];

			nChip[2508]=nTile[108]; nChip[2509]=nTile[109]; nChip[2510]=nTile[110]; nChip[2511]=nTile[111];
			hChip[2476]=hTile[108]; hChip[2477]=hTile[109]; hChip[2478]=hTile[110]; hChip[2479]=hTile[111];
			vChip[1484]=vTile[108]; vChip[1485]=vTile[109]; vChip[1486]=vTile[110]; vChip[1487]=vTile[111];
			aChip[1452]=aTile[108]; aChip[1453]=aTile[109]; aChip[1454]=aTile[110]; aChip[1455]=aTile[111];

			nChip[2512]=nTile[112]; nChip[2513]=nTile[113]; nChip[2514]=nTile[114]; nChip[2515]=nTile[115];
			hChip[2480]=hTile[112]; hChip[2481]=hTile[113]; hChip[2482]=hTile[114]; hChip[2483]=hTile[115];
			vChip[1488]=vTile[112]; vChip[1489]=vTile[113]; vChip[1490]=vTile[114]; vChip[1491]=vTile[115];
			aChip[1456]=aTile[112]; aChip[1457]=aTile[113]; aChip[1458]=aTile[114]; aChip[1459]=aTile[115];

			nChip[2516]=nTile[116]; nChip[2517]=nTile[117]; nChip[2518]=nTile[118]; nChip[2519]=nTile[119];
			hChip[2484]=hTile[116]; hChip[2485]=hTile[117]; hChip[2486]=hTile[118]; hChip[2487]=hTile[119];
			vChip[1492]=vTile[116]; vChip[1493]=vTile[117]; vChip[1494]=vTile[118]; vChip[1495]=vTile[119];
			aChip[1460]=aTile[116]; aChip[1461]=aTile[117]; aChip[1462]=aTile[118]; aChip[1463]=aTile[119];

			nChip[2520]=nTile[120]; nChip[2521]=nTile[121]; nChip[2522]=nTile[122]; nChip[2523]=nTile[123];
			hChip[2488]=hTile[120]; hChip[2489]=hTile[121]; hChip[2490]=hTile[122]; hChip[2491]=hTile[123];
			vChip[1496]=vTile[120]; vChip[1497]=vTile[121]; vChip[1498]=vTile[122]; vChip[1499]=vTile[123];
			aChip[1464]=aTile[120]; aChip[1465]=aTile[121]; aChip[1466]=aTile[122]; aChip[1467]=aTile[123];

			nChip[2524]=nTile[124]; nChip[2525]=nTile[125]; nChip[2526]=nTile[126]; nChip[2527]=nTile[127];
			hChip[2492]=hTile[124]; hChip[2493]=hTile[125]; hChip[2494]=hTile[126]; hChip[2495]=hTile[127];
			vChip[1500]=vTile[124]; vChip[1501]=vTile[125]; vChip[1502]=vTile[126]; vChip[1503]=vTile[127];
			aChip[1468]=aTile[124]; aChip[1469]=aTile[125]; aChip[1470]=aTile[126]; aChip[1471]=aTile[127];

			nChip[2624]=nTile[128]; nChip[2625]=nTile[129]; nChip[2626]=nTile[130]; nChip[2627]=nTile[131];
			hChip[2592]=hTile[128]; hChip[2593]=hTile[129]; hChip[2594]=hTile[130]; hChip[2595]=hTile[131];
			vChip[1600]=vTile[128]; vChip[1601]=vTile[129]; vChip[1602]=vTile[130]; vChip[1603]=vTile[131];
			aChip[1568]=aTile[128]; aChip[1569]=aTile[129]; aChip[1570]=aTile[130]; aChip[1571]=aTile[131];

			nChip[2628]=nTile[132]; nChip[2629]=nTile[133]; nChip[2630]=nTile[134]; nChip[2631]=nTile[135];
			hChip[2596]=hTile[132]; hChip[2597]=hTile[133]; hChip[2598]=hTile[134]; hChip[2599]=hTile[135];
			vChip[1604]=vTile[132]; vChip[1605]=vTile[133]; vChip[1606]=vTile[134]; vChip[1607]=vTile[135];
			aChip[1572]=aTile[132]; aChip[1573]=aTile[133]; aChip[1574]=aTile[134]; aChip[1575]=aTile[135];

			nChip[2632]=nTile[136]; nChip[2633]=nTile[137]; nChip[2634]=nTile[138]; nChip[2635]=nTile[139];
			hChip[2600]=hTile[136]; hChip[2601]=hTile[137]; hChip[2602]=hTile[138]; hChip[2603]=hTile[139];
			vChip[1608]=vTile[136]; vChip[1609]=vTile[137]; vChip[1610]=vTile[138]; vChip[1611]=vTile[139];
			aChip[1576]=aTile[136]; aChip[1577]=aTile[137]; aChip[1578]=aTile[138]; aChip[1579]=aTile[139];

			nChip[2636]=nTile[140]; nChip[2637]=nTile[141]; nChip[2638]=nTile[142]; nChip[2639]=nTile[143];
			hChip[2604]=hTile[140]; hChip[2605]=hTile[141]; hChip[2606]=hTile[142]; hChip[2607]=hTile[143];
			vChip[1612]=vTile[140]; vChip[1613]=vTile[141]; vChip[1614]=vTile[142]; vChip[1615]=vTile[143];
			aChip[1580]=aTile[140]; aChip[1581]=aTile[141]; aChip[1582]=aTile[142]; aChip[1583]=aTile[143];

			nChip[2640]=nTile[144]; nChip[2641]=nTile[145]; nChip[2642]=nTile[146]; nChip[2643]=nTile[147];
			hChip[2608]=hTile[144]; hChip[2609]=hTile[145]; hChip[2610]=hTile[146]; hChip[2611]=hTile[147];
			vChip[1616]=vTile[144]; vChip[1617]=vTile[145]; vChip[1618]=vTile[146]; vChip[1619]=vTile[147];
			aChip[1584]=aTile[144]; aChip[1585]=aTile[145]; aChip[1586]=aTile[146]; aChip[1587]=aTile[147];

			nChip[2644]=nTile[148]; nChip[2645]=nTile[149]; nChip[2646]=nTile[150]; nChip[2647]=nTile[151];
			hChip[2612]=hTile[148]; hChip[2613]=hTile[149]; hChip[2614]=hTile[150]; hChip[2615]=hTile[151];
			vChip[1620]=vTile[148]; vChip[1621]=vTile[149]; vChip[1622]=vTile[150]; vChip[1623]=vTile[151];
			aChip[1588]=aTile[148]; aChip[1589]=aTile[149]; aChip[1590]=aTile[150]; aChip[1591]=aTile[151];

			nChip[2648]=nTile[152]; nChip[2649]=nTile[153]; nChip[2650]=nTile[154]; nChip[2651]=nTile[155];
			hChip[2616]=hTile[152]; hChip[2617]=hTile[153]; hChip[2618]=hTile[154]; hChip[2619]=hTile[155];
			vChip[1624]=vTile[152]; vChip[1625]=vTile[153]; vChip[1626]=vTile[154]; vChip[1627]=vTile[155];
			aChip[1592]=aTile[152]; aChip[1593]=aTile[153]; aChip[1594]=aTile[154]; aChip[1595]=aTile[155];

			nChip[2652]=nTile[156]; nChip[2653]=nTile[157]; nChip[2654]=nTile[158]; nChip[2655]=nTile[159];
			hChip[2620]=hTile[156]; hChip[2621]=hTile[157]; hChip[2622]=hTile[158]; hChip[2623]=hTile[159];
			vChip[1628]=vTile[156]; vChip[1629]=vTile[157]; vChip[1630]=vTile[158]; vChip[1631]=vTile[159];
			aChip[1596]=aTile[156]; aChip[1597]=aTile[157]; aChip[1598]=aTile[158]; aChip[1599]=aTile[159];

			nChip[2752]=nTile[160]; nChip[2753]=nTile[161]; nChip[2754]=nTile[162]; nChip[2755]=nTile[163];
			hChip[2720]=hTile[160]; hChip[2721]=hTile[161]; hChip[2722]=hTile[162]; hChip[2723]=hTile[163];
			vChip[1728]=vTile[160]; vChip[1729]=vTile[161]; vChip[1730]=vTile[162]; vChip[1731]=vTile[163];
			aChip[1696]=aTile[160]; aChip[1697]=aTile[161]; aChip[1698]=aTile[162]; aChip[1699]=aTile[163];

			nChip[2756]=nTile[164]; nChip[2757]=nTile[165]; nChip[2758]=nTile[166]; nChip[2759]=nTile[167];
			hChip[2724]=hTile[164]; hChip[2725]=hTile[165]; hChip[2726]=hTile[166]; hChip[2727]=hTile[167];
			vChip[1732]=vTile[164]; vChip[1733]=vTile[165]; vChip[1734]=vTile[166]; vChip[1735]=vTile[167];
			aChip[1700]=aTile[164]; aChip[1701]=aTile[165]; aChip[1702]=aTile[166]; aChip[1703]=aTile[167];

			nChip[2760]=nTile[168]; nChip[2761]=nTile[169]; nChip[2762]=nTile[170]; nChip[2763]=nTile[171];
			hChip[2728]=hTile[168]; hChip[2729]=hTile[169]; hChip[2730]=hTile[170]; hChip[2731]=hTile[171];
			vChip[1736]=vTile[168]; vChip[1737]=vTile[169]; vChip[1738]=vTile[170]; vChip[1739]=vTile[171];
			aChip[1704]=aTile[168]; aChip[1705]=aTile[169]; aChip[1706]=aTile[170]; aChip[1707]=aTile[171];

			nChip[2764]=nTile[172]; nChip[2765]=nTile[173]; nChip[2766]=nTile[174]; nChip[2767]=nTile[175];
			hChip[2732]=hTile[172]; hChip[2733]=hTile[173]; hChip[2734]=hTile[174]; hChip[2735]=hTile[175];
			vChip[1740]=vTile[172]; vChip[1741]=vTile[173]; vChip[1742]=vTile[174]; vChip[1743]=vTile[175];
			aChip[1708]=aTile[172]; aChip[1709]=aTile[173]; aChip[1710]=aTile[174]; aChip[1711]=aTile[175];

			nChip[2768]=nTile[176]; nChip[2769]=nTile[177]; nChip[2770]=nTile[178]; nChip[2771]=nTile[179];
			hChip[2736]=hTile[176]; hChip[2737]=hTile[177]; hChip[2738]=hTile[178]; hChip[2739]=hTile[179];
			vChip[1744]=vTile[176]; vChip[1745]=vTile[177]; vChip[1746]=vTile[178]; vChip[1747]=vTile[179];
			aChip[1712]=aTile[176]; aChip[1713]=aTile[177]; aChip[1714]=aTile[178]; aChip[1715]=aTile[179];

			nChip[2772]=nTile[180]; nChip[2773]=nTile[181]; nChip[2774]=nTile[182]; nChip[2775]=nTile[183];
			hChip[2740]=hTile[180]; hChip[2741]=hTile[181]; hChip[2742]=hTile[182]; hChip[2743]=hTile[183];
			vChip[1748]=vTile[180]; vChip[1749]=vTile[181]; vChip[1750]=vTile[182]; vChip[1751]=vTile[183];
			aChip[1716]=aTile[180]; aChip[1717]=aTile[181]; aChip[1718]=aTile[182]; aChip[1719]=aTile[183];

			nChip[2776]=nTile[184]; nChip[2777]=nTile[185]; nChip[2778]=nTile[186]; nChip[2779]=nTile[187];
			hChip[2744]=hTile[184]; hChip[2745]=hTile[185]; hChip[2746]=hTile[186]; hChip[2747]=hTile[187];
			vChip[1752]=vTile[184]; vChip[1753]=vTile[185]; vChip[1754]=vTile[186]; vChip[1755]=vTile[187];
			aChip[1720]=aTile[184]; aChip[1721]=aTile[185]; aChip[1722]=aTile[186]; aChip[1723]=aTile[187];

			nChip[2780]=nTile[188]; nChip[2781]=nTile[189]; nChip[2782]=nTile[190]; nChip[2783]=nTile[191];
			hChip[2748]=hTile[188]; hChip[2749]=hTile[189]; hChip[2750]=hTile[190]; hChip[2751]=hTile[191];
			vChip[1756]=vTile[188]; vChip[1757]=vTile[189]; vChip[1758]=vTile[190]; vChip[1759]=vTile[191];
			aChip[1724]=aTile[188]; aChip[1725]=aTile[189]; aChip[1726]=aTile[190]; aChip[1727]=aTile[191];

			nChip[2880]=nTile[192]; nChip[2881]=nTile[193]; nChip[2882]=nTile[194]; nChip[2883]=nTile[195];
			hChip[2848]=hTile[192]; hChip[2849]=hTile[193]; hChip[2850]=hTile[194]; hChip[2851]=hTile[195];
			vChip[1856]=vTile[192]; vChip[1857]=vTile[193]; vChip[1858]=vTile[194]; vChip[1859]=vTile[195];
			aChip[1824]=aTile[192]; aChip[1825]=aTile[193]; aChip[1826]=aTile[194]; aChip[1827]=aTile[195];

			nChip[2884]=nTile[196]; nChip[2885]=nTile[197]; nChip[2886]=nTile[198]; nChip[2887]=nTile[199];
			hChip[2852]=hTile[196]; hChip[2853]=hTile[197]; hChip[2854]=hTile[198]; hChip[2855]=hTile[199];
			vChip[1860]=vTile[196]; vChip[1861]=vTile[197]; vChip[1862]=vTile[198]; vChip[1863]=vTile[199];
			aChip[1828]=aTile[196]; aChip[1829]=aTile[197]; aChip[1830]=aTile[198]; aChip[1831]=aTile[199];

			nChip[2888]=nTile[200]; nChip[2889]=nTile[201]; nChip[2890]=nTile[202]; nChip[2891]=nTile[203];
			hChip[2856]=hTile[200]; hChip[2857]=hTile[201]; hChip[2858]=hTile[202]; hChip[2859]=hTile[203];
			vChip[1864]=vTile[200]; vChip[1865]=vTile[201]; vChip[1866]=vTile[202]; vChip[1867]=vTile[203];
			aChip[1832]=aTile[200]; aChip[1833]=aTile[201]; aChip[1834]=aTile[202]; aChip[1835]=aTile[203];

			nChip[2892]=nTile[204]; nChip[2893]=nTile[205]; nChip[2894]=nTile[206]; nChip[2895]=nTile[207];
			hChip[2860]=hTile[204]; hChip[2861]=hTile[205]; hChip[2862]=hTile[206]; hChip[2863]=hTile[207];
			vChip[1868]=vTile[204]; vChip[1869]=vTile[205]; vChip[1870]=vTile[206]; vChip[1871]=vTile[207];
			aChip[1836]=aTile[204]; aChip[1837]=aTile[205]; aChip[1838]=aTile[206]; aChip[1839]=aTile[207];

			nChip[2896]=nTile[208]; nChip[2897]=nTile[209]; nChip[2898]=nTile[210]; nChip[2899]=nTile[211];
			hChip[2864]=hTile[208]; hChip[2865]=hTile[209]; hChip[2866]=hTile[210]; hChip[2867]=hTile[211];
			vChip[1872]=vTile[208]; vChip[1873]=vTile[209]; vChip[1874]=vTile[210]; vChip[1875]=vTile[211];
			aChip[1840]=aTile[208]; aChip[1841]=aTile[209]; aChip[1842]=aTile[210]; aChip[1843]=aTile[211];

			nChip[2900]=nTile[212]; nChip[2901]=nTile[213]; nChip[2902]=nTile[214]; nChip[2903]=nTile[215];
			hChip[2868]=hTile[212]; hChip[2869]=hTile[213]; hChip[2870]=hTile[214]; hChip[2871]=hTile[215];
			vChip[1876]=vTile[212]; vChip[1877]=vTile[213]; vChip[1878]=vTile[214]; vChip[1879]=vTile[215];
			aChip[1844]=aTile[212]; aChip[1845]=aTile[213]; aChip[1846]=aTile[214]; aChip[1847]=aTile[215];

			nChip[2904]=nTile[216]; nChip[2905]=nTile[217]; nChip[2906]=nTile[218]; nChip[2907]=nTile[219];
			hChip[2872]=hTile[216]; hChip[2873]=hTile[217]; hChip[2874]=hTile[218]; hChip[2875]=hTile[219];
			vChip[1880]=vTile[216]; vChip[1881]=vTile[217]; vChip[1882]=vTile[218]; vChip[1883]=vTile[219];
			aChip[1848]=aTile[216]; aChip[1849]=aTile[217]; aChip[1850]=aTile[218]; aChip[1851]=aTile[219];

			nChip[2908]=nTile[220]; nChip[2909]=nTile[221]; nChip[2910]=nTile[222]; nChip[2911]=nTile[223];
			hChip[2876]=hTile[220]; hChip[2877]=hTile[221]; hChip[2878]=hTile[222]; hChip[2879]=hTile[223];
			vChip[1884]=vTile[220]; vChip[1885]=vTile[221]; vChip[1886]=vTile[222]; vChip[1887]=vTile[223];
			aChip[1852]=aTile[220]; aChip[1853]=aTile[221]; aChip[1854]=aTile[222]; aChip[1855]=aTile[223];

			nChip[3008]=nTile[224]; nChip[3009]=nTile[225]; nChip[3010]=nTile[226]; nChip[3011]=nTile[227];
			hChip[2976]=hTile[224]; hChip[2977]=hTile[225]; hChip[2978]=hTile[226]; hChip[2979]=hTile[227];
			vChip[1984]=vTile[224]; vChip[1985]=vTile[225]; vChip[1986]=vTile[226]; vChip[1987]=vTile[227];
			aChip[1952]=aTile[224]; aChip[1953]=aTile[225]; aChip[1954]=aTile[226]; aChip[1955]=aTile[227];

			nChip[3012]=nTile[228]; nChip[3013]=nTile[229]; nChip[3014]=nTile[230]; nChip[3015]=nTile[231];
			hChip[2980]=hTile[228]; hChip[2981]=hTile[229]; hChip[2982]=hTile[230]; hChip[2983]=hTile[231];
			vChip[1988]=vTile[228]; vChip[1989]=vTile[229]; vChip[1990]=vTile[230]; vChip[1991]=vTile[231];
			aChip[1956]=aTile[228]; aChip[1957]=aTile[229]; aChip[1958]=aTile[230]; aChip[1959]=aTile[231];

			nChip[3016]=nTile[232]; nChip[3017]=nTile[233]; nChip[3018]=nTile[234]; nChip[3019]=nTile[235];
			hChip[2984]=hTile[232]; hChip[2985]=hTile[233]; hChip[2986]=hTile[234]; hChip[2987]=hTile[235];
			vChip[1992]=vTile[232]; vChip[1993]=vTile[233]; vChip[1994]=vTile[234]; vChip[1995]=vTile[235];
			aChip[1960]=aTile[232]; aChip[1961]=aTile[233]; aChip[1962]=aTile[234]; aChip[1963]=aTile[235];

			nChip[3020]=nTile[236]; nChip[3021]=nTile[237]; nChip[3022]=nTile[238]; nChip[3023]=nTile[239];
			hChip[2988]=hTile[236]; hChip[2989]=hTile[237]; hChip[2990]=hTile[238]; hChip[2991]=hTile[239];
			vChip[1996]=vTile[236]; vChip[1997]=vTile[237]; vChip[1998]=vTile[238]; vChip[1999]=vTile[239];
			aChip[1964]=aTile[236]; aChip[1965]=aTile[237]; aChip[1966]=aTile[238]; aChip[1967]=aTile[239];

			nChip[3024]=nTile[240]; nChip[3025]=nTile[241]; nChip[3026]=nTile[242]; nChip[3027]=nTile[243];
			hChip[2992]=hTile[240]; hChip[2993]=hTile[241]; hChip[2994]=hTile[242]; hChip[2995]=hTile[243];
			vChip[2000]=vTile[240]; vChip[2001]=vTile[241]; vChip[2002]=vTile[242]; vChip[2003]=vTile[243];
			aChip[1968]=aTile[240]; aChip[1969]=aTile[241]; aChip[1970]=aTile[242]; aChip[1971]=aTile[243];

			nChip[3028]=nTile[244]; nChip[3029]=nTile[245]; nChip[3030]=nTile[246]; nChip[3031]=nTile[247];
			hChip[2996]=hTile[244]; hChip[2997]=hTile[245]; hChip[2998]=hTile[246]; hChip[2999]=hTile[247];
			vChip[2004]=vTile[244]; vChip[2005]=vTile[245]; vChip[2006]=vTile[246]; vChip[2007]=vTile[247];
			aChip[1972]=aTile[244]; aChip[1973]=aTile[245]; aChip[1974]=aTile[246]; aChip[1975]=aTile[247];

			nChip[3032]=nTile[248]; nChip[3033]=nTile[249]; nChip[3034]=nTile[250]; nChip[3035]=nTile[251];
			hChip[3000]=hTile[248]; hChip[3001]=hTile[249]; hChip[3002]=hTile[250]; hChip[3003]=hTile[251];
			vChip[2008]=vTile[248]; vChip[2009]=vTile[249]; vChip[2010]=vTile[250]; vChip[2011]=vTile[251];
			aChip[1976]=aTile[248]; aChip[1977]=aTile[249]; aChip[1978]=aTile[250]; aChip[1979]=aTile[251];

			nChip[3036]=nTile[252]; nChip[3037]=nTile[253]; nChip[3038]=nTile[254]; nChip[3039]=nTile[255];
			hChip[3004]=hTile[252]; hChip[3005]=hTile[253]; hChip[3006]=hTile[254]; hChip[3007]=hTile[255];
			vChip[2012]=vTile[252]; vChip[2013]=vTile[253]; vChip[2014]=vTile[254]; vChip[2015]=vTile[255];
			aChip[1980]=aTile[252]; aChip[1981]=aTile[253]; aChip[1982]=aTile[254]; aChip[1983]=aTile[255];

			A = d[cOfst+22]; B = d[cOfst+23];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[2144]=nTile[0]; nChip[2145]=nTile[1]; nChip[2146]=nTile[2]; nChip[2147]=nTile[3];
			hChip[2048]=hTile[0]; hChip[2049]=hTile[1]; hChip[2050]=hTile[2]; hChip[2051]=hTile[3];
			vChip[1120]=vTile[0]; vChip[1121]=vTile[1]; vChip[1122]=vTile[2]; vChip[1123]=vTile[3];
			aChip[1024]=aTile[0]; aChip[1025]=aTile[1]; aChip[1026]=aTile[2]; aChip[1027]=aTile[3];

			nChip[2148]=nTile[4]; nChip[2149]=nTile[5]; nChip[2150]=nTile[6]; nChip[2151]=nTile[7];
			hChip[2052]=hTile[4]; hChip[2053]=hTile[5]; hChip[2054]=hTile[6]; hChip[2055]=hTile[7];
			vChip[1124]=vTile[4]; vChip[1125]=vTile[5]; vChip[1126]=vTile[6]; vChip[1127]=vTile[7];
			aChip[1028]=aTile[4]; aChip[1029]=aTile[5]; aChip[1030]=aTile[6]; aChip[1031]=aTile[7];

			nChip[2152]=nTile[8]; nChip[2153]=nTile[9]; nChip[2154]=nTile[10]; nChip[2155]=nTile[11];
			hChip[2056]=hTile[8]; hChip[2057]=hTile[9]; hChip[2058]=hTile[10]; hChip[2059]=hTile[11];
			vChip[1128]=vTile[8]; vChip[1129]=vTile[9]; vChip[1130]=vTile[10]; vChip[1131]=vTile[11];
			aChip[1032]=aTile[8]; aChip[1033]=aTile[9]; aChip[1034]=aTile[10]; aChip[1035]=aTile[11];

			nChip[2156]=nTile[12]; nChip[2157]=nTile[13]; nChip[2158]=nTile[14]; nChip[2159]=nTile[15];
			hChip[2060]=hTile[12]; hChip[2061]=hTile[13]; hChip[2062]=hTile[14]; hChip[2063]=hTile[15];
			vChip[1132]=vTile[12]; vChip[1133]=vTile[13]; vChip[1134]=vTile[14]; vChip[1135]=vTile[15];
			aChip[1036]=aTile[12]; aChip[1037]=aTile[13]; aChip[1038]=aTile[14]; aChip[1039]=aTile[15];

			nChip[2160]=nTile[16]; nChip[2161]=nTile[17]; nChip[2162]=nTile[18]; nChip[2163]=nTile[19];
			hChip[2064]=hTile[16]; hChip[2065]=hTile[17]; hChip[2066]=hTile[18]; hChip[2067]=hTile[19];
			vChip[1136]=vTile[16]; vChip[1137]=vTile[17]; vChip[1138]=vTile[18]; vChip[1139]=vTile[19];
			aChip[1040]=aTile[16]; aChip[1041]=aTile[17]; aChip[1042]=aTile[18]; aChip[1043]=aTile[19];

			nChip[2164]=nTile[20]; nChip[2165]=nTile[21]; nChip[2166]=nTile[22]; nChip[2167]=nTile[23];
			hChip[2068]=hTile[20]; hChip[2069]=hTile[21]; hChip[2070]=hTile[22]; hChip[2071]=hTile[23];
			vChip[1140]=vTile[20]; vChip[1141]=vTile[21]; vChip[1142]=vTile[22]; vChip[1143]=vTile[23];
			aChip[1044]=aTile[20]; aChip[1045]=aTile[21]; aChip[1046]=aTile[22]; aChip[1047]=aTile[23];

			nChip[2168]=nTile[24]; nChip[2169]=nTile[25]; nChip[2170]=nTile[26]; nChip[2171]=nTile[27];
			hChip[2072]=hTile[24]; hChip[2073]=hTile[25]; hChip[2074]=hTile[26]; hChip[2075]=hTile[27];
			vChip[1144]=vTile[24]; vChip[1145]=vTile[25]; vChip[1146]=vTile[26]; vChip[1147]=vTile[27];
			aChip[1048]=aTile[24]; aChip[1049]=aTile[25]; aChip[1050]=aTile[26]; aChip[1051]=aTile[27];

			nChip[2172]=nTile[28]; nChip[2173]=nTile[29]; nChip[2174]=nTile[30]; nChip[2175]=nTile[31];
			hChip[2076]=hTile[28]; hChip[2077]=hTile[29]; hChip[2078]=hTile[30]; hChip[2079]=hTile[31];
			vChip[1148]=vTile[28]; vChip[1149]=vTile[29]; vChip[1150]=vTile[30]; vChip[1151]=vTile[31];
			aChip[1052]=aTile[28]; aChip[1053]=aTile[29]; aChip[1054]=aTile[30]; aChip[1055]=aTile[31];

			nChip[2272]=nTile[32]; nChip[2273]=nTile[33]; nChip[2274]=nTile[34]; nChip[2275]=nTile[35];
			hChip[2176]=hTile[32]; hChip[2177]=hTile[33]; hChip[2178]=hTile[34]; hChip[2179]=hTile[35];
			vChip[1248]=vTile[32]; vChip[1249]=vTile[33]; vChip[1250]=vTile[34]; vChip[1251]=vTile[35];
			aChip[1152]=aTile[32]; aChip[1153]=aTile[33]; aChip[1154]=aTile[34]; aChip[1155]=aTile[35];

			nChip[2276]=nTile[36]; nChip[2277]=nTile[37]; nChip[2278]=nTile[38]; nChip[2279]=nTile[39];
			hChip[2180]=hTile[36]; hChip[2181]=hTile[37]; hChip[2182]=hTile[38]; hChip[2183]=hTile[39];
			vChip[1252]=vTile[36]; vChip[1253]=vTile[37]; vChip[1254]=vTile[38]; vChip[1255]=vTile[39];
			aChip[1156]=aTile[36]; aChip[1157]=aTile[37]; aChip[1158]=aTile[38]; aChip[1159]=aTile[39];

			nChip[2280]=nTile[40]; nChip[2281]=nTile[41]; nChip[2282]=nTile[42]; nChip[2283]=nTile[43];
			hChip[2184]=hTile[40]; hChip[2185]=hTile[41]; hChip[2186]=hTile[42]; hChip[2187]=hTile[43];
			vChip[1256]=vTile[40]; vChip[1257]=vTile[41]; vChip[1258]=vTile[42]; vChip[1259]=vTile[43];
			aChip[1160]=aTile[40]; aChip[1161]=aTile[41]; aChip[1162]=aTile[42]; aChip[1163]=aTile[43];

			nChip[2284]=nTile[44]; nChip[2285]=nTile[45]; nChip[2286]=nTile[46]; nChip[2287]=nTile[47];
			hChip[2188]=hTile[44]; hChip[2189]=hTile[45]; hChip[2190]=hTile[46]; hChip[2191]=hTile[47];
			vChip[1260]=vTile[44]; vChip[1261]=vTile[45]; vChip[1262]=vTile[46]; vChip[1263]=vTile[47];
			aChip[1164]=aTile[44]; aChip[1165]=aTile[45]; aChip[1166]=aTile[46]; aChip[1167]=aTile[47];

			nChip[2288]=nTile[48]; nChip[2289]=nTile[49]; nChip[2290]=nTile[50]; nChip[2291]=nTile[51];
			hChip[2192]=hTile[48]; hChip[2193]=hTile[49]; hChip[2194]=hTile[50]; hChip[2195]=hTile[51];
			vChip[1264]=vTile[48]; vChip[1265]=vTile[49]; vChip[1266]=vTile[50]; vChip[1267]=vTile[51];
			aChip[1168]=aTile[48]; aChip[1169]=aTile[49]; aChip[1170]=aTile[50]; aChip[1171]=aTile[51];

			nChip[2292]=nTile[52]; nChip[2293]=nTile[53]; nChip[2294]=nTile[54]; nChip[2295]=nTile[55];
			hChip[2196]=hTile[52]; hChip[2197]=hTile[53]; hChip[2198]=hTile[54]; hChip[2199]=hTile[55];
			vChip[1268]=vTile[52]; vChip[1269]=vTile[53]; vChip[1270]=vTile[54]; vChip[1271]=vTile[55];
			aChip[1172]=aTile[52]; aChip[1173]=aTile[53]; aChip[1174]=aTile[54]; aChip[1175]=aTile[55];

			nChip[2296]=nTile[56]; nChip[2297]=nTile[57]; nChip[2298]=nTile[58]; nChip[2299]=nTile[59];
			hChip[2200]=hTile[56]; hChip[2201]=hTile[57]; hChip[2202]=hTile[58]; hChip[2203]=hTile[59];
			vChip[1272]=vTile[56]; vChip[1273]=vTile[57]; vChip[1274]=vTile[58]; vChip[1275]=vTile[59];
			aChip[1176]=aTile[56]; aChip[1177]=aTile[57]; aChip[1178]=aTile[58]; aChip[1179]=aTile[59];

			nChip[2300]=nTile[60]; nChip[2301]=nTile[61]; nChip[2302]=nTile[62]; nChip[2303]=nTile[63];
			hChip[2204]=hTile[60]; hChip[2205]=hTile[61]; hChip[2206]=hTile[62]; hChip[2207]=hTile[63];
			vChip[1276]=vTile[60]; vChip[1277]=vTile[61]; vChip[1278]=vTile[62]; vChip[1279]=vTile[63];
			aChip[1180]=aTile[60]; aChip[1181]=aTile[61]; aChip[1182]=aTile[62]; aChip[1183]=aTile[63];

			nChip[2400]=nTile[64]; nChip[2401]=nTile[65]; nChip[2402]=nTile[66]; nChip[2403]=nTile[67];
			hChip[2304]=hTile[64]; hChip[2305]=hTile[65]; hChip[2306]=hTile[66]; hChip[2307]=hTile[67];
			vChip[1376]=vTile[64]; vChip[1377]=vTile[65]; vChip[1378]=vTile[66]; vChip[1379]=vTile[67];
			aChip[1280]=aTile[64]; aChip[1281]=aTile[65]; aChip[1282]=aTile[66]; aChip[1283]=aTile[67];

			nChip[2404]=nTile[68]; nChip[2405]=nTile[69]; nChip[2406]=nTile[70]; nChip[2407]=nTile[71];
			hChip[2308]=hTile[68]; hChip[2309]=hTile[69]; hChip[2310]=hTile[70]; hChip[2311]=hTile[71];
			vChip[1380]=vTile[68]; vChip[1381]=vTile[69]; vChip[1382]=vTile[70]; vChip[1383]=vTile[71];
			aChip[1284]=aTile[68]; aChip[1285]=aTile[69]; aChip[1286]=aTile[70]; aChip[1287]=aTile[71];

			nChip[2408]=nTile[72]; nChip[2409]=nTile[73]; nChip[2410]=nTile[74]; nChip[2411]=nTile[75];
			hChip[2312]=hTile[72]; hChip[2313]=hTile[73]; hChip[2314]=hTile[74]; hChip[2315]=hTile[75];
			vChip[1384]=vTile[72]; vChip[1385]=vTile[73]; vChip[1386]=vTile[74]; vChip[1387]=vTile[75];
			aChip[1288]=aTile[72]; aChip[1289]=aTile[73]; aChip[1290]=aTile[74]; aChip[1291]=aTile[75];

			nChip[2412]=nTile[76]; nChip[2413]=nTile[77]; nChip[2414]=nTile[78]; nChip[2415]=nTile[79];
			hChip[2316]=hTile[76]; hChip[2317]=hTile[77]; hChip[2318]=hTile[78]; hChip[2319]=hTile[79];
			vChip[1388]=vTile[76]; vChip[1389]=vTile[77]; vChip[1390]=vTile[78]; vChip[1391]=vTile[79];
			aChip[1292]=aTile[76]; aChip[1293]=aTile[77]; aChip[1294]=aTile[78]; aChip[1295]=aTile[79];

			nChip[2416]=nTile[80]; nChip[2417]=nTile[81]; nChip[2418]=nTile[82]; nChip[2419]=nTile[83];
			hChip[2320]=hTile[80]; hChip[2321]=hTile[81]; hChip[2322]=hTile[82]; hChip[2323]=hTile[83];
			vChip[1392]=vTile[80]; vChip[1393]=vTile[81]; vChip[1394]=vTile[82]; vChip[1395]=vTile[83];
			aChip[1296]=aTile[80]; aChip[1297]=aTile[81]; aChip[1298]=aTile[82]; aChip[1299]=aTile[83];

			nChip[2420]=nTile[84]; nChip[2421]=nTile[85]; nChip[2422]=nTile[86]; nChip[2423]=nTile[87];
			hChip[2324]=hTile[84]; hChip[2325]=hTile[85]; hChip[2326]=hTile[86]; hChip[2327]=hTile[87];
			vChip[1396]=vTile[84]; vChip[1397]=vTile[85]; vChip[1398]=vTile[86]; vChip[1399]=vTile[87];
			aChip[1300]=aTile[84]; aChip[1301]=aTile[85]; aChip[1302]=aTile[86]; aChip[1303]=aTile[87];

			nChip[2424]=nTile[88]; nChip[2425]=nTile[89]; nChip[2426]=nTile[90]; nChip[2427]=nTile[91];
			hChip[2328]=hTile[88]; hChip[2329]=hTile[89]; hChip[2330]=hTile[90]; hChip[2331]=hTile[91];
			vChip[1400]=vTile[88]; vChip[1401]=vTile[89]; vChip[1402]=vTile[90]; vChip[1403]=vTile[91];
			aChip[1304]=aTile[88]; aChip[1305]=aTile[89]; aChip[1306]=aTile[90]; aChip[1307]=aTile[91];

			nChip[2428]=nTile[92]; nChip[2429]=nTile[93]; nChip[2430]=nTile[94]; nChip[2431]=nTile[95];
			hChip[2332]=hTile[92]; hChip[2333]=hTile[93]; hChip[2334]=hTile[94]; hChip[2335]=hTile[95];
			vChip[1404]=vTile[92]; vChip[1405]=vTile[93]; vChip[1406]=vTile[94]; vChip[1407]=vTile[95];
			aChip[1308]=aTile[92]; aChip[1309]=aTile[93]; aChip[1310]=aTile[94]; aChip[1311]=aTile[95];

			nChip[2528]=nTile[96]; nChip[2529]=nTile[97]; nChip[2530]=nTile[98]; nChip[2531]=nTile[99];
			hChip[2432]=hTile[96]; hChip[2433]=hTile[97]; hChip[2434]=hTile[98]; hChip[2435]=hTile[99];
			vChip[1504]=vTile[96]; vChip[1505]=vTile[97]; vChip[1506]=vTile[98]; vChip[1507]=vTile[99];
			aChip[1408]=aTile[96]; aChip[1409]=aTile[97]; aChip[1410]=aTile[98]; aChip[1411]=aTile[99];

			nChip[2532]=nTile[100]; nChip[2533]=nTile[101]; nChip[2534]=nTile[102]; nChip[2535]=nTile[103];
			hChip[2436]=hTile[100]; hChip[2437]=hTile[101]; hChip[2438]=hTile[102]; hChip[2439]=hTile[103];
			vChip[1508]=vTile[100]; vChip[1509]=vTile[101]; vChip[1510]=vTile[102]; vChip[1511]=vTile[103];
			aChip[1412]=aTile[100]; aChip[1413]=aTile[101]; aChip[1414]=aTile[102]; aChip[1415]=aTile[103];

			nChip[2536]=nTile[104]; nChip[2537]=nTile[105]; nChip[2538]=nTile[106]; nChip[2539]=nTile[107];
			hChip[2440]=hTile[104]; hChip[2441]=hTile[105]; hChip[2442]=hTile[106]; hChip[2443]=hTile[107];
			vChip[1512]=vTile[104]; vChip[1513]=vTile[105]; vChip[1514]=vTile[106]; vChip[1515]=vTile[107];
			aChip[1416]=aTile[104]; aChip[1417]=aTile[105]; aChip[1418]=aTile[106]; aChip[1419]=aTile[107];

			nChip[2540]=nTile[108]; nChip[2541]=nTile[109]; nChip[2542]=nTile[110]; nChip[2543]=nTile[111];
			hChip[2444]=hTile[108]; hChip[2445]=hTile[109]; hChip[2446]=hTile[110]; hChip[2447]=hTile[111];
			vChip[1516]=vTile[108]; vChip[1517]=vTile[109]; vChip[1518]=vTile[110]; vChip[1519]=vTile[111];
			aChip[1420]=aTile[108]; aChip[1421]=aTile[109]; aChip[1422]=aTile[110]; aChip[1423]=aTile[111];

			nChip[2544]=nTile[112]; nChip[2545]=nTile[113]; nChip[2546]=nTile[114]; nChip[2547]=nTile[115];
			hChip[2448]=hTile[112]; hChip[2449]=hTile[113]; hChip[2450]=hTile[114]; hChip[2451]=hTile[115];
			vChip[1520]=vTile[112]; vChip[1521]=vTile[113]; vChip[1522]=vTile[114]; vChip[1523]=vTile[115];
			aChip[1424]=aTile[112]; aChip[1425]=aTile[113]; aChip[1426]=aTile[114]; aChip[1427]=aTile[115];

			nChip[2548]=nTile[116]; nChip[2549]=nTile[117]; nChip[2550]=nTile[118]; nChip[2551]=nTile[119];
			hChip[2452]=hTile[116]; hChip[2453]=hTile[117]; hChip[2454]=hTile[118]; hChip[2455]=hTile[119];
			vChip[1524]=vTile[116]; vChip[1525]=vTile[117]; vChip[1526]=vTile[118]; vChip[1527]=vTile[119];
			aChip[1428]=aTile[116]; aChip[1429]=aTile[117]; aChip[1430]=aTile[118]; aChip[1431]=aTile[119];

			nChip[2552]=nTile[120]; nChip[2553]=nTile[121]; nChip[2554]=nTile[122]; nChip[2555]=nTile[123];
			hChip[2456]=hTile[120]; hChip[2457]=hTile[121]; hChip[2458]=hTile[122]; hChip[2459]=hTile[123];
			vChip[1528]=vTile[120]; vChip[1529]=vTile[121]; vChip[1530]=vTile[122]; vChip[1531]=vTile[123];
			aChip[1432]=aTile[120]; aChip[1433]=aTile[121]; aChip[1434]=aTile[122]; aChip[1435]=aTile[123];

			nChip[2556]=nTile[124]; nChip[2557]=nTile[125]; nChip[2558]=nTile[126]; nChip[2559]=nTile[127];
			hChip[2460]=hTile[124]; hChip[2461]=hTile[125]; hChip[2462]=hTile[126]; hChip[2463]=hTile[127];
			vChip[1532]=vTile[124]; vChip[1533]=vTile[125]; vChip[1534]=vTile[126]; vChip[1535]=vTile[127];
			aChip[1436]=aTile[124]; aChip[1437]=aTile[125]; aChip[1438]=aTile[126]; aChip[1439]=aTile[127];

			nChip[2656]=nTile[128]; nChip[2657]=nTile[129]; nChip[2658]=nTile[130]; nChip[2659]=nTile[131];
			hChip[2560]=hTile[128]; hChip[2561]=hTile[129]; hChip[2562]=hTile[130]; hChip[2563]=hTile[131];
			vChip[1632]=vTile[128]; vChip[1633]=vTile[129]; vChip[1634]=vTile[130]; vChip[1635]=vTile[131];
			aChip[1536]=aTile[128]; aChip[1537]=aTile[129]; aChip[1538]=aTile[130]; aChip[1539]=aTile[131];

			nChip[2660]=nTile[132]; nChip[2661]=nTile[133]; nChip[2662]=nTile[134]; nChip[2663]=nTile[135];
			hChip[2564]=hTile[132]; hChip[2565]=hTile[133]; hChip[2566]=hTile[134]; hChip[2567]=hTile[135];
			vChip[1636]=vTile[132]; vChip[1637]=vTile[133]; vChip[1638]=vTile[134]; vChip[1639]=vTile[135];
			aChip[1540]=aTile[132]; aChip[1541]=aTile[133]; aChip[1542]=aTile[134]; aChip[1543]=aTile[135];

			nChip[2664]=nTile[136]; nChip[2665]=nTile[137]; nChip[2666]=nTile[138]; nChip[2667]=nTile[139];
			hChip[2568]=hTile[136]; hChip[2569]=hTile[137]; hChip[2570]=hTile[138]; hChip[2571]=hTile[139];
			vChip[1640]=vTile[136]; vChip[1641]=vTile[137]; vChip[1642]=vTile[138]; vChip[1643]=vTile[139];
			aChip[1544]=aTile[136]; aChip[1545]=aTile[137]; aChip[1546]=aTile[138]; aChip[1547]=aTile[139];

			nChip[2668]=nTile[140]; nChip[2669]=nTile[141]; nChip[2670]=nTile[142]; nChip[2671]=nTile[143];
			hChip[2572]=hTile[140]; hChip[2573]=hTile[141]; hChip[2574]=hTile[142]; hChip[2575]=hTile[143];
			vChip[1644]=vTile[140]; vChip[1645]=vTile[141]; vChip[1646]=vTile[142]; vChip[1647]=vTile[143];
			aChip[1548]=aTile[140]; aChip[1549]=aTile[141]; aChip[1550]=aTile[142]; aChip[1551]=aTile[143];

			nChip[2672]=nTile[144]; nChip[2673]=nTile[145]; nChip[2674]=nTile[146]; nChip[2675]=nTile[147];
			hChip[2576]=hTile[144]; hChip[2577]=hTile[145]; hChip[2578]=hTile[146]; hChip[2579]=hTile[147];
			vChip[1648]=vTile[144]; vChip[1649]=vTile[145]; vChip[1650]=vTile[146]; vChip[1651]=vTile[147];
			aChip[1552]=aTile[144]; aChip[1553]=aTile[145]; aChip[1554]=aTile[146]; aChip[1555]=aTile[147];

			nChip[2676]=nTile[148]; nChip[2677]=nTile[149]; nChip[2678]=nTile[150]; nChip[2679]=nTile[151];
			hChip[2580]=hTile[148]; hChip[2581]=hTile[149]; hChip[2582]=hTile[150]; hChip[2583]=hTile[151];
			vChip[1652]=vTile[148]; vChip[1653]=vTile[149]; vChip[1654]=vTile[150]; vChip[1655]=vTile[151];
			aChip[1556]=aTile[148]; aChip[1557]=aTile[149]; aChip[1558]=aTile[150]; aChip[1559]=aTile[151];

			nChip[2680]=nTile[152]; nChip[2681]=nTile[153]; nChip[2682]=nTile[154]; nChip[2683]=nTile[155];
			hChip[2584]=hTile[152]; hChip[2585]=hTile[153]; hChip[2586]=hTile[154]; hChip[2587]=hTile[155];
			vChip[1656]=vTile[152]; vChip[1657]=vTile[153]; vChip[1658]=vTile[154]; vChip[1659]=vTile[155];
			aChip[1560]=aTile[152]; aChip[1561]=aTile[153]; aChip[1562]=aTile[154]; aChip[1563]=aTile[155];

			nChip[2684]=nTile[156]; nChip[2685]=nTile[157]; nChip[2686]=nTile[158]; nChip[2687]=nTile[159];
			hChip[2588]=hTile[156]; hChip[2589]=hTile[157]; hChip[2590]=hTile[158]; hChip[2591]=hTile[159];
			vChip[1660]=vTile[156]; vChip[1661]=vTile[157]; vChip[1662]=vTile[158]; vChip[1663]=vTile[159];
			aChip[1564]=aTile[156]; aChip[1565]=aTile[157]; aChip[1566]=aTile[158]; aChip[1567]=aTile[159];

			nChip[2784]=nTile[160]; nChip[2785]=nTile[161]; nChip[2786]=nTile[162]; nChip[2787]=nTile[163];
			hChip[2688]=hTile[160]; hChip[2689]=hTile[161]; hChip[2690]=hTile[162]; hChip[2691]=hTile[163];
			vChip[1760]=vTile[160]; vChip[1761]=vTile[161]; vChip[1762]=vTile[162]; vChip[1763]=vTile[163];
			aChip[1664]=aTile[160]; aChip[1665]=aTile[161]; aChip[1666]=aTile[162]; aChip[1667]=aTile[163];

			nChip[2788]=nTile[164]; nChip[2789]=nTile[165]; nChip[2790]=nTile[166]; nChip[2791]=nTile[167];
			hChip[2692]=hTile[164]; hChip[2693]=hTile[165]; hChip[2694]=hTile[166]; hChip[2695]=hTile[167];
			vChip[1764]=vTile[164]; vChip[1765]=vTile[165]; vChip[1766]=vTile[166]; vChip[1767]=vTile[167];
			aChip[1668]=aTile[164]; aChip[1669]=aTile[165]; aChip[1670]=aTile[166]; aChip[1671]=aTile[167];

			nChip[2792]=nTile[168]; nChip[2793]=nTile[169]; nChip[2794]=nTile[170]; nChip[2795]=nTile[171];
			hChip[2696]=hTile[168]; hChip[2697]=hTile[169]; hChip[2698]=hTile[170]; hChip[2699]=hTile[171];
			vChip[1768]=vTile[168]; vChip[1769]=vTile[169]; vChip[1770]=vTile[170]; vChip[1771]=vTile[171];
			aChip[1672]=aTile[168]; aChip[1673]=aTile[169]; aChip[1674]=aTile[170]; aChip[1675]=aTile[171];

			nChip[2796]=nTile[172]; nChip[2797]=nTile[173]; nChip[2798]=nTile[174]; nChip[2799]=nTile[175];
			hChip[2700]=hTile[172]; hChip[2701]=hTile[173]; hChip[2702]=hTile[174]; hChip[2703]=hTile[175];
			vChip[1772]=vTile[172]; vChip[1773]=vTile[173]; vChip[1774]=vTile[174]; vChip[1775]=vTile[175];
			aChip[1676]=aTile[172]; aChip[1677]=aTile[173]; aChip[1678]=aTile[174]; aChip[1679]=aTile[175];

			nChip[2800]=nTile[176]; nChip[2801]=nTile[177]; nChip[2802]=nTile[178]; nChip[2803]=nTile[179];
			hChip[2704]=hTile[176]; hChip[2705]=hTile[177]; hChip[2706]=hTile[178]; hChip[2707]=hTile[179];
			vChip[1776]=vTile[176]; vChip[1777]=vTile[177]; vChip[1778]=vTile[178]; vChip[1779]=vTile[179];
			aChip[1680]=aTile[176]; aChip[1681]=aTile[177]; aChip[1682]=aTile[178]; aChip[1683]=aTile[179];

			nChip[2804]=nTile[180]; nChip[2805]=nTile[181]; nChip[2806]=nTile[182]; nChip[2807]=nTile[183];
			hChip[2708]=hTile[180]; hChip[2709]=hTile[181]; hChip[2710]=hTile[182]; hChip[2711]=hTile[183];
			vChip[1780]=vTile[180]; vChip[1781]=vTile[181]; vChip[1782]=vTile[182]; vChip[1783]=vTile[183];
			aChip[1684]=aTile[180]; aChip[1685]=aTile[181]; aChip[1686]=aTile[182]; aChip[1687]=aTile[183];

			nChip[2808]=nTile[184]; nChip[2809]=nTile[185]; nChip[2810]=nTile[186]; nChip[2811]=nTile[187];
			hChip[2712]=hTile[184]; hChip[2713]=hTile[185]; hChip[2714]=hTile[186]; hChip[2715]=hTile[187];
			vChip[1784]=vTile[184]; vChip[1785]=vTile[185]; vChip[1786]=vTile[186]; vChip[1787]=vTile[187];
			aChip[1688]=aTile[184]; aChip[1689]=aTile[185]; aChip[1690]=aTile[186]; aChip[1691]=aTile[187];

			nChip[2812]=nTile[188]; nChip[2813]=nTile[189]; nChip[2814]=nTile[190]; nChip[2815]=nTile[191];
			hChip[2716]=hTile[188]; hChip[2717]=hTile[189]; hChip[2718]=hTile[190]; hChip[2719]=hTile[191];
			vChip[1788]=vTile[188]; vChip[1789]=vTile[189]; vChip[1790]=vTile[190]; vChip[1791]=vTile[191];
			aChip[1692]=aTile[188]; aChip[1693]=aTile[189]; aChip[1694]=aTile[190]; aChip[1695]=aTile[191];

			nChip[2912]=nTile[192]; nChip[2913]=nTile[193]; nChip[2914]=nTile[194]; nChip[2915]=nTile[195];
			hChip[2816]=hTile[192]; hChip[2817]=hTile[193]; hChip[2818]=hTile[194]; hChip[2819]=hTile[195];
			vChip[1888]=vTile[192]; vChip[1889]=vTile[193]; vChip[1890]=vTile[194]; vChip[1891]=vTile[195];
			aChip[1792]=aTile[192]; aChip[1793]=aTile[193]; aChip[1794]=aTile[194]; aChip[1795]=aTile[195];

			nChip[2916]=nTile[196]; nChip[2917]=nTile[197]; nChip[2918]=nTile[198]; nChip[2919]=nTile[199];
			hChip[2820]=hTile[196]; hChip[2821]=hTile[197]; hChip[2822]=hTile[198]; hChip[2823]=hTile[199];
			vChip[1892]=vTile[196]; vChip[1893]=vTile[197]; vChip[1894]=vTile[198]; vChip[1895]=vTile[199];
			aChip[1796]=aTile[196]; aChip[1797]=aTile[197]; aChip[1798]=aTile[198]; aChip[1799]=aTile[199];

			nChip[2920]=nTile[200]; nChip[2921]=nTile[201]; nChip[2922]=nTile[202]; nChip[2923]=nTile[203];
			hChip[2824]=hTile[200]; hChip[2825]=hTile[201]; hChip[2826]=hTile[202]; hChip[2827]=hTile[203];
			vChip[1896]=vTile[200]; vChip[1897]=vTile[201]; vChip[1898]=vTile[202]; vChip[1899]=vTile[203];
			aChip[1800]=aTile[200]; aChip[1801]=aTile[201]; aChip[1802]=aTile[202]; aChip[1803]=aTile[203];

			nChip[2924]=nTile[204]; nChip[2925]=nTile[205]; nChip[2926]=nTile[206]; nChip[2927]=nTile[207];
			hChip[2828]=hTile[204]; hChip[2829]=hTile[205]; hChip[2830]=hTile[206]; hChip[2831]=hTile[207];
			vChip[1900]=vTile[204]; vChip[1901]=vTile[205]; vChip[1902]=vTile[206]; vChip[1903]=vTile[207];
			aChip[1804]=aTile[204]; aChip[1805]=aTile[205]; aChip[1806]=aTile[206]; aChip[1807]=aTile[207];

			nChip[2928]=nTile[208]; nChip[2929]=nTile[209]; nChip[2930]=nTile[210]; nChip[2931]=nTile[211];
			hChip[2832]=hTile[208]; hChip[2833]=hTile[209]; hChip[2834]=hTile[210]; hChip[2835]=hTile[211];
			vChip[1904]=vTile[208]; vChip[1905]=vTile[209]; vChip[1906]=vTile[210]; vChip[1907]=vTile[211];
			aChip[1808]=aTile[208]; aChip[1809]=aTile[209]; aChip[1810]=aTile[210]; aChip[1811]=aTile[211];

			nChip[2932]=nTile[212]; nChip[2933]=nTile[213]; nChip[2934]=nTile[214]; nChip[2935]=nTile[215];
			hChip[2836]=hTile[212]; hChip[2837]=hTile[213]; hChip[2838]=hTile[214]; hChip[2839]=hTile[215];
			vChip[1908]=vTile[212]; vChip[1909]=vTile[213]; vChip[1910]=vTile[214]; vChip[1911]=vTile[215];
			aChip[1812]=aTile[212]; aChip[1813]=aTile[213]; aChip[1814]=aTile[214]; aChip[1815]=aTile[215];

			nChip[2936]=nTile[216]; nChip[2937]=nTile[217]; nChip[2938]=nTile[218]; nChip[2939]=nTile[219];
			hChip[2840]=hTile[216]; hChip[2841]=hTile[217]; hChip[2842]=hTile[218]; hChip[2843]=hTile[219];
			vChip[1912]=vTile[216]; vChip[1913]=vTile[217]; vChip[1914]=vTile[218]; vChip[1915]=vTile[219];
			aChip[1816]=aTile[216]; aChip[1817]=aTile[217]; aChip[1818]=aTile[218]; aChip[1819]=aTile[219];

			nChip[2940]=nTile[220]; nChip[2941]=nTile[221]; nChip[2942]=nTile[222]; nChip[2943]=nTile[223];
			hChip[2844]=hTile[220]; hChip[2845]=hTile[221]; hChip[2846]=hTile[222]; hChip[2847]=hTile[223];
			vChip[1916]=vTile[220]; vChip[1917]=vTile[221]; vChip[1918]=vTile[222]; vChip[1919]=vTile[223];
			aChip[1820]=aTile[220]; aChip[1821]=aTile[221]; aChip[1822]=aTile[222]; aChip[1823]=aTile[223];

			nChip[3040]=nTile[224]; nChip[3041]=nTile[225]; nChip[3042]=nTile[226]; nChip[3043]=nTile[227];
			hChip[2944]=hTile[224]; hChip[2945]=hTile[225]; hChip[2946]=hTile[226]; hChip[2947]=hTile[227];
			vChip[2016]=vTile[224]; vChip[2017]=vTile[225]; vChip[2018]=vTile[226]; vChip[2019]=vTile[227];
			aChip[1920]=aTile[224]; aChip[1921]=aTile[225]; aChip[1922]=aTile[226]; aChip[1923]=aTile[227];

			nChip[3044]=nTile[228]; nChip[3045]=nTile[229]; nChip[3046]=nTile[230]; nChip[3047]=nTile[231];
			hChip[2948]=hTile[228]; hChip[2949]=hTile[229]; hChip[2950]=hTile[230]; hChip[2951]=hTile[231];
			vChip[2020]=vTile[228]; vChip[2021]=vTile[229]; vChip[2022]=vTile[230]; vChip[2023]=vTile[231];
			aChip[1924]=aTile[228]; aChip[1925]=aTile[229]; aChip[1926]=aTile[230]; aChip[1927]=aTile[231];

			nChip[3048]=nTile[232]; nChip[3049]=nTile[233]; nChip[3050]=nTile[234]; nChip[3051]=nTile[235];
			hChip[2952]=hTile[232]; hChip[2953]=hTile[233]; hChip[2954]=hTile[234]; hChip[2955]=hTile[235];
			vChip[2024]=vTile[232]; vChip[2025]=vTile[233]; vChip[2026]=vTile[234]; vChip[2027]=vTile[235];
			aChip[1928]=aTile[232]; aChip[1929]=aTile[233]; aChip[1930]=aTile[234]; aChip[1931]=aTile[235];

			nChip[3052]=nTile[236]; nChip[3053]=nTile[237]; nChip[3054]=nTile[238]; nChip[3055]=nTile[239];
			hChip[2956]=hTile[236]; hChip[2957]=hTile[237]; hChip[2958]=hTile[238]; hChip[2959]=hTile[239];
			vChip[2028]=vTile[236]; vChip[2029]=vTile[237]; vChip[2030]=vTile[238]; vChip[2031]=vTile[239];
			aChip[1932]=aTile[236]; aChip[1933]=aTile[237]; aChip[1934]=aTile[238]; aChip[1935]=aTile[239];

			nChip[3056]=nTile[240]; nChip[3057]=nTile[241]; nChip[3058]=nTile[242]; nChip[3059]=nTile[243];
			hChip[2960]=hTile[240]; hChip[2961]=hTile[241]; hChip[2962]=hTile[242]; hChip[2963]=hTile[243];
			vChip[2032]=vTile[240]; vChip[2033]=vTile[241]; vChip[2034]=vTile[242]; vChip[2035]=vTile[243];
			aChip[1936]=aTile[240]; aChip[1937]=aTile[241]; aChip[1938]=aTile[242]; aChip[1939]=aTile[243];

			nChip[3060]=nTile[244]; nChip[3061]=nTile[245]; nChip[3062]=nTile[246]; nChip[3063]=nTile[247];
			hChip[2964]=hTile[244]; hChip[2965]=hTile[245]; hChip[2966]=hTile[246]; hChip[2967]=hTile[247];
			vChip[2036]=vTile[244]; vChip[2037]=vTile[245]; vChip[2038]=vTile[246]; vChip[2039]=vTile[247];
			aChip[1940]=aTile[244]; aChip[1941]=aTile[245]; aChip[1942]=aTile[246]; aChip[1943]=aTile[247];

			nChip[3064]=nTile[248]; nChip[3065]=nTile[249]; nChip[3066]=nTile[250]; nChip[3067]=nTile[251];
			hChip[2968]=hTile[248]; hChip[2969]=hTile[249]; hChip[2970]=hTile[250]; hChip[2971]=hTile[251];
			vChip[2040]=vTile[248]; vChip[2041]=vTile[249]; vChip[2042]=vTile[250]; vChip[2043]=vTile[251];
			aChip[1944]=aTile[248]; aChip[1945]=aTile[249]; aChip[1946]=aTile[250]; aChip[1947]=aTile[251];

			nChip[3068]=nTile[252]; nChip[3069]=nTile[253]; nChip[3070]=nTile[254]; nChip[3071]=nTile[255];
			hChip[2972]=hTile[252]; hChip[2973]=hTile[253]; hChip[2974]=hTile[254]; hChip[2975]=hTile[255];
			vChip[2044]=vTile[252]; vChip[2045]=vTile[253]; vChip[2046]=vTile[254]; vChip[2047]=vTile[255];
			aChip[1948]=aTile[252]; aChip[1949]=aTile[253]; aChip[1950]=aTile[254]; aChip[1951]=aTile[255];

			A = d[cOfst+24]; B = d[cOfst+25];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[3072]=nTile[0]; nChip[3073]=nTile[1]; nChip[3074]=nTile[2]; nChip[3075]=nTile[3];
			hChip[3168]=hTile[0]; hChip[3169]=hTile[1]; hChip[3170]=hTile[2]; hChip[3171]=hTile[3];
			vChip[0]=vTile[0]; vChip[1]=vTile[1]; vChip[2]=vTile[2]; vChip[3]=vTile[3];
			aChip[96]=aTile[0]; aChip[97]=aTile[1]; aChip[98]=aTile[2]; aChip[99]=aTile[3];

			nChip[3076]=nTile[4]; nChip[3077]=nTile[5]; nChip[3078]=nTile[6]; nChip[3079]=nTile[7];
			hChip[3172]=hTile[4]; hChip[3173]=hTile[5]; hChip[3174]=hTile[6]; hChip[3175]=hTile[7];
			vChip[4]=vTile[4]; vChip[5]=vTile[5]; vChip[6]=vTile[6]; vChip[7]=vTile[7];
			aChip[100]=aTile[4]; aChip[101]=aTile[5]; aChip[102]=aTile[6]; aChip[103]=aTile[7];

			nChip[3080]=nTile[8]; nChip[3081]=nTile[9]; nChip[3082]=nTile[10]; nChip[3083]=nTile[11];
			hChip[3176]=hTile[8]; hChip[3177]=hTile[9]; hChip[3178]=hTile[10]; hChip[3179]=hTile[11];
			vChip[8]=vTile[8]; vChip[9]=vTile[9]; vChip[10]=vTile[10]; vChip[11]=vTile[11];
			aChip[104]=aTile[8]; aChip[105]=aTile[9]; aChip[106]=aTile[10]; aChip[107]=aTile[11];

			nChip[3084]=nTile[12]; nChip[3085]=nTile[13]; nChip[3086]=nTile[14]; nChip[3087]=nTile[15];
			hChip[3180]=hTile[12]; hChip[3181]=hTile[13]; hChip[3182]=hTile[14]; hChip[3183]=hTile[15];
			vChip[12]=vTile[12]; vChip[13]=vTile[13]; vChip[14]=vTile[14]; vChip[15]=vTile[15];
			aChip[108]=aTile[12]; aChip[109]=aTile[13]; aChip[110]=aTile[14]; aChip[111]=aTile[15];

			nChip[3088]=nTile[16]; nChip[3089]=nTile[17]; nChip[3090]=nTile[18]; nChip[3091]=nTile[19];
			hChip[3184]=hTile[16]; hChip[3185]=hTile[17]; hChip[3186]=hTile[18]; hChip[3187]=hTile[19];
			vChip[16]=vTile[16]; vChip[17]=vTile[17]; vChip[18]=vTile[18]; vChip[19]=vTile[19];
			aChip[112]=aTile[16]; aChip[113]=aTile[17]; aChip[114]=aTile[18]; aChip[115]=aTile[19];

			nChip[3092]=nTile[20]; nChip[3093]=nTile[21]; nChip[3094]=nTile[22]; nChip[3095]=nTile[23];
			hChip[3188]=hTile[20]; hChip[3189]=hTile[21]; hChip[3190]=hTile[22]; hChip[3191]=hTile[23];
			vChip[20]=vTile[20]; vChip[21]=vTile[21]; vChip[22]=vTile[22]; vChip[23]=vTile[23];
			aChip[116]=aTile[20]; aChip[117]=aTile[21]; aChip[118]=aTile[22]; aChip[119]=aTile[23];

			nChip[3096]=nTile[24]; nChip[3097]=nTile[25]; nChip[3098]=nTile[26]; nChip[3099]=nTile[27];
			hChip[3192]=hTile[24]; hChip[3193]=hTile[25]; hChip[3194]=hTile[26]; hChip[3195]=hTile[27];
			vChip[24]=vTile[24]; vChip[25]=vTile[25]; vChip[26]=vTile[26]; vChip[27]=vTile[27];
			aChip[120]=aTile[24]; aChip[121]=aTile[25]; aChip[122]=aTile[26]; aChip[123]=aTile[27];

			nChip[3100]=nTile[28]; nChip[3101]=nTile[29]; nChip[3102]=nTile[30]; nChip[3103]=nTile[31];
			hChip[3196]=hTile[28]; hChip[3197]=hTile[29]; hChip[3198]=hTile[30]; hChip[3199]=hTile[31];
			vChip[28]=vTile[28]; vChip[29]=vTile[29]; vChip[30]=vTile[30]; vChip[31]=vTile[31];
			aChip[124]=aTile[28]; aChip[125]=aTile[29]; aChip[126]=aTile[30]; aChip[127]=aTile[31];

			nChip[3200]=nTile[32]; nChip[3201]=nTile[33]; nChip[3202]=nTile[34]; nChip[3203]=nTile[35];
			hChip[3296]=hTile[32]; hChip[3297]=hTile[33]; hChip[3298]=hTile[34]; hChip[3299]=hTile[35];
			vChip[128]=vTile[32]; vChip[129]=vTile[33]; vChip[130]=vTile[34]; vChip[131]=vTile[35];
			aChip[224]=aTile[32]; aChip[225]=aTile[33]; aChip[226]=aTile[34]; aChip[227]=aTile[35];

			nChip[3204]=nTile[36]; nChip[3205]=nTile[37]; nChip[3206]=nTile[38]; nChip[3207]=nTile[39];
			hChip[3300]=hTile[36]; hChip[3301]=hTile[37]; hChip[3302]=hTile[38]; hChip[3303]=hTile[39];
			vChip[132]=vTile[36]; vChip[133]=vTile[37]; vChip[134]=vTile[38]; vChip[135]=vTile[39];
			aChip[228]=aTile[36]; aChip[229]=aTile[37]; aChip[230]=aTile[38]; aChip[231]=aTile[39];

			nChip[3208]=nTile[40]; nChip[3209]=nTile[41]; nChip[3210]=nTile[42]; nChip[3211]=nTile[43];
			hChip[3304]=hTile[40]; hChip[3305]=hTile[41]; hChip[3306]=hTile[42]; hChip[3307]=hTile[43];
			vChip[136]=vTile[40]; vChip[137]=vTile[41]; vChip[138]=vTile[42]; vChip[139]=vTile[43];
			aChip[232]=aTile[40]; aChip[233]=aTile[41]; aChip[234]=aTile[42]; aChip[235]=aTile[43];

			nChip[3212]=nTile[44]; nChip[3213]=nTile[45]; nChip[3214]=nTile[46]; nChip[3215]=nTile[47];
			hChip[3308]=hTile[44]; hChip[3309]=hTile[45]; hChip[3310]=hTile[46]; hChip[3311]=hTile[47];
			vChip[140]=vTile[44]; vChip[141]=vTile[45]; vChip[142]=vTile[46]; vChip[143]=vTile[47];
			aChip[236]=aTile[44]; aChip[237]=aTile[45]; aChip[238]=aTile[46]; aChip[239]=aTile[47];

			nChip[3216]=nTile[48]; nChip[3217]=nTile[49]; nChip[3218]=nTile[50]; nChip[3219]=nTile[51];
			hChip[3312]=hTile[48]; hChip[3313]=hTile[49]; hChip[3314]=hTile[50]; hChip[3315]=hTile[51];
			vChip[144]=vTile[48]; vChip[145]=vTile[49]; vChip[146]=vTile[50]; vChip[147]=vTile[51];
			aChip[240]=aTile[48]; aChip[241]=aTile[49]; aChip[242]=aTile[50]; aChip[243]=aTile[51];

			nChip[3220]=nTile[52]; nChip[3221]=nTile[53]; nChip[3222]=nTile[54]; nChip[3223]=nTile[55];
			hChip[3316]=hTile[52]; hChip[3317]=hTile[53]; hChip[3318]=hTile[54]; hChip[3319]=hTile[55];
			vChip[148]=vTile[52]; vChip[149]=vTile[53]; vChip[150]=vTile[54]; vChip[151]=vTile[55];
			aChip[244]=aTile[52]; aChip[245]=aTile[53]; aChip[246]=aTile[54]; aChip[247]=aTile[55];

			nChip[3224]=nTile[56]; nChip[3225]=nTile[57]; nChip[3226]=nTile[58]; nChip[3227]=nTile[59];
			hChip[3320]=hTile[56]; hChip[3321]=hTile[57]; hChip[3322]=hTile[58]; hChip[3323]=hTile[59];
			vChip[152]=vTile[56]; vChip[153]=vTile[57]; vChip[154]=vTile[58]; vChip[155]=vTile[59];
			aChip[248]=aTile[56]; aChip[249]=aTile[57]; aChip[250]=aTile[58]; aChip[251]=aTile[59];

			nChip[3228]=nTile[60]; nChip[3229]=nTile[61]; nChip[3230]=nTile[62]; nChip[3231]=nTile[63];
			hChip[3324]=hTile[60]; hChip[3325]=hTile[61]; hChip[3326]=hTile[62]; hChip[3327]=hTile[63];
			vChip[156]=vTile[60]; vChip[157]=vTile[61]; vChip[158]=vTile[62]; vChip[159]=vTile[63];
			aChip[252]=aTile[60]; aChip[253]=aTile[61]; aChip[254]=aTile[62]; aChip[255]=aTile[63];

			nChip[3328]=nTile[64]; nChip[3329]=nTile[65]; nChip[3330]=nTile[66]; nChip[3331]=nTile[67];
			hChip[3424]=hTile[64]; hChip[3425]=hTile[65]; hChip[3426]=hTile[66]; hChip[3427]=hTile[67];
			vChip[256]=vTile[64]; vChip[257]=vTile[65]; vChip[258]=vTile[66]; vChip[259]=vTile[67];
			aChip[352]=aTile[64]; aChip[353]=aTile[65]; aChip[354]=aTile[66]; aChip[355]=aTile[67];

			nChip[3332]=nTile[68]; nChip[3333]=nTile[69]; nChip[3334]=nTile[70]; nChip[3335]=nTile[71];
			hChip[3428]=hTile[68]; hChip[3429]=hTile[69]; hChip[3430]=hTile[70]; hChip[3431]=hTile[71];
			vChip[260]=vTile[68]; vChip[261]=vTile[69]; vChip[262]=vTile[70]; vChip[263]=vTile[71];
			aChip[356]=aTile[68]; aChip[357]=aTile[69]; aChip[358]=aTile[70]; aChip[359]=aTile[71];

			nChip[3336]=nTile[72]; nChip[3337]=nTile[73]; nChip[3338]=nTile[74]; nChip[3339]=nTile[75];
			hChip[3432]=hTile[72]; hChip[3433]=hTile[73]; hChip[3434]=hTile[74]; hChip[3435]=hTile[75];
			vChip[264]=vTile[72]; vChip[265]=vTile[73]; vChip[266]=vTile[74]; vChip[267]=vTile[75];
			aChip[360]=aTile[72]; aChip[361]=aTile[73]; aChip[362]=aTile[74]; aChip[363]=aTile[75];

			nChip[3340]=nTile[76]; nChip[3341]=nTile[77]; nChip[3342]=nTile[78]; nChip[3343]=nTile[79];
			hChip[3436]=hTile[76]; hChip[3437]=hTile[77]; hChip[3438]=hTile[78]; hChip[3439]=hTile[79];
			vChip[268]=vTile[76]; vChip[269]=vTile[77]; vChip[270]=vTile[78]; vChip[271]=vTile[79];
			aChip[364]=aTile[76]; aChip[365]=aTile[77]; aChip[366]=aTile[78]; aChip[367]=aTile[79];

			nChip[3344]=nTile[80]; nChip[3345]=nTile[81]; nChip[3346]=nTile[82]; nChip[3347]=nTile[83];
			hChip[3440]=hTile[80]; hChip[3441]=hTile[81]; hChip[3442]=hTile[82]; hChip[3443]=hTile[83];
			vChip[272]=vTile[80]; vChip[273]=vTile[81]; vChip[274]=vTile[82]; vChip[275]=vTile[83];
			aChip[368]=aTile[80]; aChip[369]=aTile[81]; aChip[370]=aTile[82]; aChip[371]=aTile[83];

			nChip[3348]=nTile[84]; nChip[3349]=nTile[85]; nChip[3350]=nTile[86]; nChip[3351]=nTile[87];
			hChip[3444]=hTile[84]; hChip[3445]=hTile[85]; hChip[3446]=hTile[86]; hChip[3447]=hTile[87];
			vChip[276]=vTile[84]; vChip[277]=vTile[85]; vChip[278]=vTile[86]; vChip[279]=vTile[87];
			aChip[372]=aTile[84]; aChip[373]=aTile[85]; aChip[374]=aTile[86]; aChip[375]=aTile[87];

			nChip[3352]=nTile[88]; nChip[3353]=nTile[89]; nChip[3354]=nTile[90]; nChip[3355]=nTile[91];
			hChip[3448]=hTile[88]; hChip[3449]=hTile[89]; hChip[3450]=hTile[90]; hChip[3451]=hTile[91];
			vChip[280]=vTile[88]; vChip[281]=vTile[89]; vChip[282]=vTile[90]; vChip[283]=vTile[91];
			aChip[376]=aTile[88]; aChip[377]=aTile[89]; aChip[378]=aTile[90]; aChip[379]=aTile[91];

			nChip[3356]=nTile[92]; nChip[3357]=nTile[93]; nChip[3358]=nTile[94]; nChip[3359]=nTile[95];
			hChip[3452]=hTile[92]; hChip[3453]=hTile[93]; hChip[3454]=hTile[94]; hChip[3455]=hTile[95];
			vChip[284]=vTile[92]; vChip[285]=vTile[93]; vChip[286]=vTile[94]; vChip[287]=vTile[95];
			aChip[380]=aTile[92]; aChip[381]=aTile[93]; aChip[382]=aTile[94]; aChip[383]=aTile[95];

			nChip[3456]=nTile[96]; nChip[3457]=nTile[97]; nChip[3458]=nTile[98]; nChip[3459]=nTile[99];
			hChip[3552]=hTile[96]; hChip[3553]=hTile[97]; hChip[3554]=hTile[98]; hChip[3555]=hTile[99];
			vChip[384]=vTile[96]; vChip[385]=vTile[97]; vChip[386]=vTile[98]; vChip[387]=vTile[99];
			aChip[480]=aTile[96]; aChip[481]=aTile[97]; aChip[482]=aTile[98]; aChip[483]=aTile[99];

			nChip[3460]=nTile[100]; nChip[3461]=nTile[101]; nChip[3462]=nTile[102]; nChip[3463]=nTile[103];
			hChip[3556]=hTile[100]; hChip[3557]=hTile[101]; hChip[3558]=hTile[102]; hChip[3559]=hTile[103];
			vChip[388]=vTile[100]; vChip[389]=vTile[101]; vChip[390]=vTile[102]; vChip[391]=vTile[103];
			aChip[484]=aTile[100]; aChip[485]=aTile[101]; aChip[486]=aTile[102]; aChip[487]=aTile[103];

			nChip[3464]=nTile[104]; nChip[3465]=nTile[105]; nChip[3466]=nTile[106]; nChip[3467]=nTile[107];
			hChip[3560]=hTile[104]; hChip[3561]=hTile[105]; hChip[3562]=hTile[106]; hChip[3563]=hTile[107];
			vChip[392]=vTile[104]; vChip[393]=vTile[105]; vChip[394]=vTile[106]; vChip[395]=vTile[107];
			aChip[488]=aTile[104]; aChip[489]=aTile[105]; aChip[490]=aTile[106]; aChip[491]=aTile[107];

			nChip[3468]=nTile[108]; nChip[3469]=nTile[109]; nChip[3470]=nTile[110]; nChip[3471]=nTile[111];
			hChip[3564]=hTile[108]; hChip[3565]=hTile[109]; hChip[3566]=hTile[110]; hChip[3567]=hTile[111];
			vChip[396]=vTile[108]; vChip[397]=vTile[109]; vChip[398]=vTile[110]; vChip[399]=vTile[111];
			aChip[492]=aTile[108]; aChip[493]=aTile[109]; aChip[494]=aTile[110]; aChip[495]=aTile[111];

			nChip[3472]=nTile[112]; nChip[3473]=nTile[113]; nChip[3474]=nTile[114]; nChip[3475]=nTile[115];
			hChip[3568]=hTile[112]; hChip[3569]=hTile[113]; hChip[3570]=hTile[114]; hChip[3571]=hTile[115];
			vChip[400]=vTile[112]; vChip[401]=vTile[113]; vChip[402]=vTile[114]; vChip[403]=vTile[115];
			aChip[496]=aTile[112]; aChip[497]=aTile[113]; aChip[498]=aTile[114]; aChip[499]=aTile[115];

			nChip[3476]=nTile[116]; nChip[3477]=nTile[117]; nChip[3478]=nTile[118]; nChip[3479]=nTile[119];
			hChip[3572]=hTile[116]; hChip[3573]=hTile[117]; hChip[3574]=hTile[118]; hChip[3575]=hTile[119];
			vChip[404]=vTile[116]; vChip[405]=vTile[117]; vChip[406]=vTile[118]; vChip[407]=vTile[119];
			aChip[500]=aTile[116]; aChip[501]=aTile[117]; aChip[502]=aTile[118]; aChip[503]=aTile[119];

			nChip[3480]=nTile[120]; nChip[3481]=nTile[121]; nChip[3482]=nTile[122]; nChip[3483]=nTile[123];
			hChip[3576]=hTile[120]; hChip[3577]=hTile[121]; hChip[3578]=hTile[122]; hChip[3579]=hTile[123];
			vChip[408]=vTile[120]; vChip[409]=vTile[121]; vChip[410]=vTile[122]; vChip[411]=vTile[123];
			aChip[504]=aTile[120]; aChip[505]=aTile[121]; aChip[506]=aTile[122]; aChip[507]=aTile[123];

			nChip[3484]=nTile[124]; nChip[3485]=nTile[125]; nChip[3486]=nTile[126]; nChip[3487]=nTile[127];
			hChip[3580]=hTile[124]; hChip[3581]=hTile[125]; hChip[3582]=hTile[126]; hChip[3583]=hTile[127];
			vChip[412]=vTile[124]; vChip[413]=vTile[125]; vChip[414]=vTile[126]; vChip[415]=vTile[127];
			aChip[508]=aTile[124]; aChip[509]=aTile[125]; aChip[510]=aTile[126]; aChip[511]=aTile[127];

			nChip[3584]=nTile[128]; nChip[3585]=nTile[129]; nChip[3586]=nTile[130]; nChip[3587]=nTile[131];
			hChip[3680]=hTile[128]; hChip[3681]=hTile[129]; hChip[3682]=hTile[130]; hChip[3683]=hTile[131];
			vChip[512]=vTile[128]; vChip[513]=vTile[129]; vChip[514]=vTile[130]; vChip[515]=vTile[131];
			aChip[608]=aTile[128]; aChip[609]=aTile[129]; aChip[610]=aTile[130]; aChip[611]=aTile[131];

			nChip[3588]=nTile[132]; nChip[3589]=nTile[133]; nChip[3590]=nTile[134]; nChip[3591]=nTile[135];
			hChip[3684]=hTile[132]; hChip[3685]=hTile[133]; hChip[3686]=hTile[134]; hChip[3687]=hTile[135];
			vChip[516]=vTile[132]; vChip[517]=vTile[133]; vChip[518]=vTile[134]; vChip[519]=vTile[135];
			aChip[612]=aTile[132]; aChip[613]=aTile[133]; aChip[614]=aTile[134]; aChip[615]=aTile[135];

			nChip[3592]=nTile[136]; nChip[3593]=nTile[137]; nChip[3594]=nTile[138]; nChip[3595]=nTile[139];
			hChip[3688]=hTile[136]; hChip[3689]=hTile[137]; hChip[3690]=hTile[138]; hChip[3691]=hTile[139];
			vChip[520]=vTile[136]; vChip[521]=vTile[137]; vChip[522]=vTile[138]; vChip[523]=vTile[139];
			aChip[616]=aTile[136]; aChip[617]=aTile[137]; aChip[618]=aTile[138]; aChip[619]=aTile[139];

			nChip[3596]=nTile[140]; nChip[3597]=nTile[141]; nChip[3598]=nTile[142]; nChip[3599]=nTile[143];
			hChip[3692]=hTile[140]; hChip[3693]=hTile[141]; hChip[3694]=hTile[142]; hChip[3695]=hTile[143];
			vChip[524]=vTile[140]; vChip[525]=vTile[141]; vChip[526]=vTile[142]; vChip[527]=vTile[143];
			aChip[620]=aTile[140]; aChip[621]=aTile[141]; aChip[622]=aTile[142]; aChip[623]=aTile[143];

			nChip[3600]=nTile[144]; nChip[3601]=nTile[145]; nChip[3602]=nTile[146]; nChip[3603]=nTile[147];
			hChip[3696]=hTile[144]; hChip[3697]=hTile[145]; hChip[3698]=hTile[146]; hChip[3699]=hTile[147];
			vChip[528]=vTile[144]; vChip[529]=vTile[145]; vChip[530]=vTile[146]; vChip[531]=vTile[147];
			aChip[624]=aTile[144]; aChip[625]=aTile[145]; aChip[626]=aTile[146]; aChip[627]=aTile[147];

			nChip[3604]=nTile[148]; nChip[3605]=nTile[149]; nChip[3606]=nTile[150]; nChip[3607]=nTile[151];
			hChip[3700]=hTile[148]; hChip[3701]=hTile[149]; hChip[3702]=hTile[150]; hChip[3703]=hTile[151];
			vChip[532]=vTile[148]; vChip[533]=vTile[149]; vChip[534]=vTile[150]; vChip[535]=vTile[151];
			aChip[628]=aTile[148]; aChip[629]=aTile[149]; aChip[630]=aTile[150]; aChip[631]=aTile[151];

			nChip[3608]=nTile[152]; nChip[3609]=nTile[153]; nChip[3610]=nTile[154]; nChip[3611]=nTile[155];
			hChip[3704]=hTile[152]; hChip[3705]=hTile[153]; hChip[3706]=hTile[154]; hChip[3707]=hTile[155];
			vChip[536]=vTile[152]; vChip[537]=vTile[153]; vChip[538]=vTile[154]; vChip[539]=vTile[155];
			aChip[632]=aTile[152]; aChip[633]=aTile[153]; aChip[634]=aTile[154]; aChip[635]=aTile[155];

			nChip[3612]=nTile[156]; nChip[3613]=nTile[157]; nChip[3614]=nTile[158]; nChip[3615]=nTile[159];
			hChip[3708]=hTile[156]; hChip[3709]=hTile[157]; hChip[3710]=hTile[158]; hChip[3711]=hTile[159];
			vChip[540]=vTile[156]; vChip[541]=vTile[157]; vChip[542]=vTile[158]; vChip[543]=vTile[159];
			aChip[636]=aTile[156]; aChip[637]=aTile[157]; aChip[638]=aTile[158]; aChip[639]=aTile[159];

			nChip[3712]=nTile[160]; nChip[3713]=nTile[161]; nChip[3714]=nTile[162]; nChip[3715]=nTile[163];
			hChip[3808]=hTile[160]; hChip[3809]=hTile[161]; hChip[3810]=hTile[162]; hChip[3811]=hTile[163];
			vChip[640]=vTile[160]; vChip[641]=vTile[161]; vChip[642]=vTile[162]; vChip[643]=vTile[163];
			aChip[736]=aTile[160]; aChip[737]=aTile[161]; aChip[738]=aTile[162]; aChip[739]=aTile[163];

			nChip[3716]=nTile[164]; nChip[3717]=nTile[165]; nChip[3718]=nTile[166]; nChip[3719]=nTile[167];
			hChip[3812]=hTile[164]; hChip[3813]=hTile[165]; hChip[3814]=hTile[166]; hChip[3815]=hTile[167];
			vChip[644]=vTile[164]; vChip[645]=vTile[165]; vChip[646]=vTile[166]; vChip[647]=vTile[167];
			aChip[740]=aTile[164]; aChip[741]=aTile[165]; aChip[742]=aTile[166]; aChip[743]=aTile[167];

			nChip[3720]=nTile[168]; nChip[3721]=nTile[169]; nChip[3722]=nTile[170]; nChip[3723]=nTile[171];
			hChip[3816]=hTile[168]; hChip[3817]=hTile[169]; hChip[3818]=hTile[170]; hChip[3819]=hTile[171];
			vChip[648]=vTile[168]; vChip[649]=vTile[169]; vChip[650]=vTile[170]; vChip[651]=vTile[171];
			aChip[744]=aTile[168]; aChip[745]=aTile[169]; aChip[746]=aTile[170]; aChip[747]=aTile[171];

			nChip[3724]=nTile[172]; nChip[3725]=nTile[173]; nChip[3726]=nTile[174]; nChip[3727]=nTile[175];
			hChip[3820]=hTile[172]; hChip[3821]=hTile[173]; hChip[3822]=hTile[174]; hChip[3823]=hTile[175];
			vChip[652]=vTile[172]; vChip[653]=vTile[173]; vChip[654]=vTile[174]; vChip[655]=vTile[175];
			aChip[748]=aTile[172]; aChip[749]=aTile[173]; aChip[750]=aTile[174]; aChip[751]=aTile[175];

			nChip[3728]=nTile[176]; nChip[3729]=nTile[177]; nChip[3730]=nTile[178]; nChip[3731]=nTile[179];
			hChip[3824]=hTile[176]; hChip[3825]=hTile[177]; hChip[3826]=hTile[178]; hChip[3827]=hTile[179];
			vChip[656]=vTile[176]; vChip[657]=vTile[177]; vChip[658]=vTile[178]; vChip[659]=vTile[179];
			aChip[752]=aTile[176]; aChip[753]=aTile[177]; aChip[754]=aTile[178]; aChip[755]=aTile[179];

			nChip[3732]=nTile[180]; nChip[3733]=nTile[181]; nChip[3734]=nTile[182]; nChip[3735]=nTile[183];
			hChip[3828]=hTile[180]; hChip[3829]=hTile[181]; hChip[3830]=hTile[182]; hChip[3831]=hTile[183];
			vChip[660]=vTile[180]; vChip[661]=vTile[181]; vChip[662]=vTile[182]; vChip[663]=vTile[183];
			aChip[756]=aTile[180]; aChip[757]=aTile[181]; aChip[758]=aTile[182]; aChip[759]=aTile[183];

			nChip[3736]=nTile[184]; nChip[3737]=nTile[185]; nChip[3738]=nTile[186]; nChip[3739]=nTile[187];
			hChip[3832]=hTile[184]; hChip[3833]=hTile[185]; hChip[3834]=hTile[186]; hChip[3835]=hTile[187];
			vChip[664]=vTile[184]; vChip[665]=vTile[185]; vChip[666]=vTile[186]; vChip[667]=vTile[187];
			aChip[760]=aTile[184]; aChip[761]=aTile[185]; aChip[762]=aTile[186]; aChip[763]=aTile[187];

			nChip[3740]=nTile[188]; nChip[3741]=nTile[189]; nChip[3742]=nTile[190]; nChip[3743]=nTile[191];
			hChip[3836]=hTile[188]; hChip[3837]=hTile[189]; hChip[3838]=hTile[190]; hChip[3839]=hTile[191];
			vChip[668]=vTile[188]; vChip[669]=vTile[189]; vChip[670]=vTile[190]; vChip[671]=vTile[191];
			aChip[764]=aTile[188]; aChip[765]=aTile[189]; aChip[766]=aTile[190]; aChip[767]=aTile[191];

			nChip[3840]=nTile[192]; nChip[3841]=nTile[193]; nChip[3842]=nTile[194]; nChip[3843]=nTile[195];
			hChip[3936]=hTile[192]; hChip[3937]=hTile[193]; hChip[3938]=hTile[194]; hChip[3939]=hTile[195];
			vChip[768]=vTile[192]; vChip[769]=vTile[193]; vChip[770]=vTile[194]; vChip[771]=vTile[195];
			aChip[864]=aTile[192]; aChip[865]=aTile[193]; aChip[866]=aTile[194]; aChip[867]=aTile[195];

			nChip[3844]=nTile[196]; nChip[3845]=nTile[197]; nChip[3846]=nTile[198]; nChip[3847]=nTile[199];
			hChip[3940]=hTile[196]; hChip[3941]=hTile[197]; hChip[3942]=hTile[198]; hChip[3943]=hTile[199];
			vChip[772]=vTile[196]; vChip[773]=vTile[197]; vChip[774]=vTile[198]; vChip[775]=vTile[199];
			aChip[868]=aTile[196]; aChip[869]=aTile[197]; aChip[870]=aTile[198]; aChip[871]=aTile[199];

			nChip[3848]=nTile[200]; nChip[3849]=nTile[201]; nChip[3850]=nTile[202]; nChip[3851]=nTile[203];
			hChip[3944]=hTile[200]; hChip[3945]=hTile[201]; hChip[3946]=hTile[202]; hChip[3947]=hTile[203];
			vChip[776]=vTile[200]; vChip[777]=vTile[201]; vChip[778]=vTile[202]; vChip[779]=vTile[203];
			aChip[872]=aTile[200]; aChip[873]=aTile[201]; aChip[874]=aTile[202]; aChip[875]=aTile[203];

			nChip[3852]=nTile[204]; nChip[3853]=nTile[205]; nChip[3854]=nTile[206]; nChip[3855]=nTile[207];
			hChip[3948]=hTile[204]; hChip[3949]=hTile[205]; hChip[3950]=hTile[206]; hChip[3951]=hTile[207];
			vChip[780]=vTile[204]; vChip[781]=vTile[205]; vChip[782]=vTile[206]; vChip[783]=vTile[207];
			aChip[876]=aTile[204]; aChip[877]=aTile[205]; aChip[878]=aTile[206]; aChip[879]=aTile[207];

			nChip[3856]=nTile[208]; nChip[3857]=nTile[209]; nChip[3858]=nTile[210]; nChip[3859]=nTile[211];
			hChip[3952]=hTile[208]; hChip[3953]=hTile[209]; hChip[3954]=hTile[210]; hChip[3955]=hTile[211];
			vChip[784]=vTile[208]; vChip[785]=vTile[209]; vChip[786]=vTile[210]; vChip[787]=vTile[211];
			aChip[880]=aTile[208]; aChip[881]=aTile[209]; aChip[882]=aTile[210]; aChip[883]=aTile[211];

			nChip[3860]=nTile[212]; nChip[3861]=nTile[213]; nChip[3862]=nTile[214]; nChip[3863]=nTile[215];
			hChip[3956]=hTile[212]; hChip[3957]=hTile[213]; hChip[3958]=hTile[214]; hChip[3959]=hTile[215];
			vChip[788]=vTile[212]; vChip[789]=vTile[213]; vChip[790]=vTile[214]; vChip[791]=vTile[215];
			aChip[884]=aTile[212]; aChip[885]=aTile[213]; aChip[886]=aTile[214]; aChip[887]=aTile[215];

			nChip[3864]=nTile[216]; nChip[3865]=nTile[217]; nChip[3866]=nTile[218]; nChip[3867]=nTile[219];
			hChip[3960]=hTile[216]; hChip[3961]=hTile[217]; hChip[3962]=hTile[218]; hChip[3963]=hTile[219];
			vChip[792]=vTile[216]; vChip[793]=vTile[217]; vChip[794]=vTile[218]; vChip[795]=vTile[219];
			aChip[888]=aTile[216]; aChip[889]=aTile[217]; aChip[890]=aTile[218]; aChip[891]=aTile[219];

			nChip[3868]=nTile[220]; nChip[3869]=nTile[221]; nChip[3870]=nTile[222]; nChip[3871]=nTile[223];
			hChip[3964]=hTile[220]; hChip[3965]=hTile[221]; hChip[3966]=hTile[222]; hChip[3967]=hTile[223];
			vChip[796]=vTile[220]; vChip[797]=vTile[221]; vChip[798]=vTile[222]; vChip[799]=vTile[223];
			aChip[892]=aTile[220]; aChip[893]=aTile[221]; aChip[894]=aTile[222]; aChip[895]=aTile[223];

			nChip[3968]=nTile[224]; nChip[3969]=nTile[225]; nChip[3970]=nTile[226]; nChip[3971]=nTile[227];
			hChip[4064]=hTile[224]; hChip[4065]=hTile[225]; hChip[4066]=hTile[226]; hChip[4067]=hTile[227];
			vChip[896]=vTile[224]; vChip[897]=vTile[225]; vChip[898]=vTile[226]; vChip[899]=vTile[227];
			aChip[992]=aTile[224]; aChip[993]=aTile[225]; aChip[994]=aTile[226]; aChip[995]=aTile[227];

			nChip[3972]=nTile[228]; nChip[3973]=nTile[229]; nChip[3974]=nTile[230]; nChip[3975]=nTile[231];
			hChip[4068]=hTile[228]; hChip[4069]=hTile[229]; hChip[4070]=hTile[230]; hChip[4071]=hTile[231];
			vChip[900]=vTile[228]; vChip[901]=vTile[229]; vChip[902]=vTile[230]; vChip[903]=vTile[231];
			aChip[996]=aTile[228]; aChip[997]=aTile[229]; aChip[998]=aTile[230]; aChip[999]=aTile[231];

			nChip[3976]=nTile[232]; nChip[3977]=nTile[233]; nChip[3978]=nTile[234]; nChip[3979]=nTile[235];
			hChip[4072]=hTile[232]; hChip[4073]=hTile[233]; hChip[4074]=hTile[234]; hChip[4075]=hTile[235];
			vChip[904]=vTile[232]; vChip[905]=vTile[233]; vChip[906]=vTile[234]; vChip[907]=vTile[235];
			aChip[1000]=aTile[232]; aChip[1001]=aTile[233]; aChip[1002]=aTile[234]; aChip[1003]=aTile[235];

			nChip[3980]=nTile[236]; nChip[3981]=nTile[237]; nChip[3982]=nTile[238]; nChip[3983]=nTile[239];
			hChip[4076]=hTile[236]; hChip[4077]=hTile[237]; hChip[4078]=hTile[238]; hChip[4079]=hTile[239];
			vChip[908]=vTile[236]; vChip[909]=vTile[237]; vChip[910]=vTile[238]; vChip[911]=vTile[239];
			aChip[1004]=aTile[236]; aChip[1005]=aTile[237]; aChip[1006]=aTile[238]; aChip[1007]=aTile[239];

			nChip[3984]=nTile[240]; nChip[3985]=nTile[241]; nChip[3986]=nTile[242]; nChip[3987]=nTile[243];
			hChip[4080]=hTile[240]; hChip[4081]=hTile[241]; hChip[4082]=hTile[242]; hChip[4083]=hTile[243];
			vChip[912]=vTile[240]; vChip[913]=vTile[241]; vChip[914]=vTile[242]; vChip[915]=vTile[243];
			aChip[1008]=aTile[240]; aChip[1009]=aTile[241]; aChip[1010]=aTile[242]; aChip[1011]=aTile[243];

			nChip[3988]=nTile[244]; nChip[3989]=nTile[245]; nChip[3990]=nTile[246]; nChip[3991]=nTile[247];
			hChip[4084]=hTile[244]; hChip[4085]=hTile[245]; hChip[4086]=hTile[246]; hChip[4087]=hTile[247];
			vChip[916]=vTile[244]; vChip[917]=vTile[245]; vChip[918]=vTile[246]; vChip[919]=vTile[247];
			aChip[1012]=aTile[244]; aChip[1013]=aTile[245]; aChip[1014]=aTile[246]; aChip[1015]=aTile[247];

			nChip[3992]=nTile[248]; nChip[3993]=nTile[249]; nChip[3994]=nTile[250]; nChip[3995]=nTile[251];
			hChip[4088]=hTile[248]; hChip[4089]=hTile[249]; hChip[4090]=hTile[250]; hChip[4091]=hTile[251];
			vChip[920]=vTile[248]; vChip[921]=vTile[249]; vChip[922]=vTile[250]; vChip[923]=vTile[251];
			aChip[1016]=aTile[248]; aChip[1017]=aTile[249]; aChip[1018]=aTile[250]; aChip[1019]=aTile[251];

			nChip[3996]=nTile[252]; nChip[3997]=nTile[253]; nChip[3998]=nTile[254]; nChip[3999]=nTile[255];
			hChip[4092]=hTile[252]; hChip[4093]=hTile[253]; hChip[4094]=hTile[254]; hChip[4095]=hTile[255];
			vChip[924]=vTile[252]; vChip[925]=vTile[253]; vChip[926]=vTile[254]; vChip[927]=vTile[255];
			aChip[1020]=aTile[252]; aChip[1021]=aTile[253]; aChip[1022]=aTile[254]; aChip[1023]=aTile[255];

			A = d[cOfst+26]; B = d[cOfst+27];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[3104]=nTile[0]; nChip[3105]=nTile[1]; nChip[3106]=nTile[2]; nChip[3107]=nTile[3];
			hChip[3136]=hTile[0]; hChip[3137]=hTile[1]; hChip[3138]=hTile[2]; hChip[3139]=hTile[3];
			vChip[32]=vTile[0]; vChip[33]=vTile[1]; vChip[34]=vTile[2]; vChip[35]=vTile[3];
			aChip[64]=aTile[0]; aChip[65]=aTile[1]; aChip[66]=aTile[2]; aChip[67]=aTile[3];

			nChip[3108]=nTile[4]; nChip[3109]=nTile[5]; nChip[3110]=nTile[6]; nChip[3111]=nTile[7];
			hChip[3140]=hTile[4]; hChip[3141]=hTile[5]; hChip[3142]=hTile[6]; hChip[3143]=hTile[7];
			vChip[36]=vTile[4]; vChip[37]=vTile[5]; vChip[38]=vTile[6]; vChip[39]=vTile[7];
			aChip[68]=aTile[4]; aChip[69]=aTile[5]; aChip[70]=aTile[6]; aChip[71]=aTile[7];

			nChip[3112]=nTile[8]; nChip[3113]=nTile[9]; nChip[3114]=nTile[10]; nChip[3115]=nTile[11];
			hChip[3144]=hTile[8]; hChip[3145]=hTile[9]; hChip[3146]=hTile[10]; hChip[3147]=hTile[11];
			vChip[40]=vTile[8]; vChip[41]=vTile[9]; vChip[42]=vTile[10]; vChip[43]=vTile[11];
			aChip[72]=aTile[8]; aChip[73]=aTile[9]; aChip[74]=aTile[10]; aChip[75]=aTile[11];

			nChip[3116]=nTile[12]; nChip[3117]=nTile[13]; nChip[3118]=nTile[14]; nChip[3119]=nTile[15];
			hChip[3148]=hTile[12]; hChip[3149]=hTile[13]; hChip[3150]=hTile[14]; hChip[3151]=hTile[15];
			vChip[44]=vTile[12]; vChip[45]=vTile[13]; vChip[46]=vTile[14]; vChip[47]=vTile[15];
			aChip[76]=aTile[12]; aChip[77]=aTile[13]; aChip[78]=aTile[14]; aChip[79]=aTile[15];

			nChip[3120]=nTile[16]; nChip[3121]=nTile[17]; nChip[3122]=nTile[18]; nChip[3123]=nTile[19];
			hChip[3152]=hTile[16]; hChip[3153]=hTile[17]; hChip[3154]=hTile[18]; hChip[3155]=hTile[19];
			vChip[48]=vTile[16]; vChip[49]=vTile[17]; vChip[50]=vTile[18]; vChip[51]=vTile[19];
			aChip[80]=aTile[16]; aChip[81]=aTile[17]; aChip[82]=aTile[18]; aChip[83]=aTile[19];

			nChip[3124]=nTile[20]; nChip[3125]=nTile[21]; nChip[3126]=nTile[22]; nChip[3127]=nTile[23];
			hChip[3156]=hTile[20]; hChip[3157]=hTile[21]; hChip[3158]=hTile[22]; hChip[3159]=hTile[23];
			vChip[52]=vTile[20]; vChip[53]=vTile[21]; vChip[54]=vTile[22]; vChip[55]=vTile[23];
			aChip[84]=aTile[20]; aChip[85]=aTile[21]; aChip[86]=aTile[22]; aChip[87]=aTile[23];

			nChip[3128]=nTile[24]; nChip[3129]=nTile[25]; nChip[3130]=nTile[26]; nChip[3131]=nTile[27];
			hChip[3160]=hTile[24]; hChip[3161]=hTile[25]; hChip[3162]=hTile[26]; hChip[3163]=hTile[27];
			vChip[56]=vTile[24]; vChip[57]=vTile[25]; vChip[58]=vTile[26]; vChip[59]=vTile[27];
			aChip[88]=aTile[24]; aChip[89]=aTile[25]; aChip[90]=aTile[26]; aChip[91]=aTile[27];

			nChip[3132]=nTile[28]; nChip[3133]=nTile[29]; nChip[3134]=nTile[30]; nChip[3135]=nTile[31];
			hChip[3164]=hTile[28]; hChip[3165]=hTile[29]; hChip[3166]=hTile[30]; hChip[3167]=hTile[31];
			vChip[60]=vTile[28]; vChip[61]=vTile[29]; vChip[62]=vTile[30]; vChip[63]=vTile[31];
			aChip[92]=aTile[28]; aChip[93]=aTile[29]; aChip[94]=aTile[30]; aChip[95]=aTile[31];

			nChip[3232]=nTile[32]; nChip[3233]=nTile[33]; nChip[3234]=nTile[34]; nChip[3235]=nTile[35];
			hChip[3264]=hTile[32]; hChip[3265]=hTile[33]; hChip[3266]=hTile[34]; hChip[3267]=hTile[35];
			vChip[160]=vTile[32]; vChip[161]=vTile[33]; vChip[162]=vTile[34]; vChip[163]=vTile[35];
			aChip[192]=aTile[32]; aChip[193]=aTile[33]; aChip[194]=aTile[34]; aChip[195]=aTile[35];

			nChip[3236]=nTile[36]; nChip[3237]=nTile[37]; nChip[3238]=nTile[38]; nChip[3239]=nTile[39];
			hChip[3268]=hTile[36]; hChip[3269]=hTile[37]; hChip[3270]=hTile[38]; hChip[3271]=hTile[39];
			vChip[164]=vTile[36]; vChip[165]=vTile[37]; vChip[166]=vTile[38]; vChip[167]=vTile[39];
			aChip[196]=aTile[36]; aChip[197]=aTile[37]; aChip[198]=aTile[38]; aChip[199]=aTile[39];

			nChip[3240]=nTile[40]; nChip[3241]=nTile[41]; nChip[3242]=nTile[42]; nChip[3243]=nTile[43];
			hChip[3272]=hTile[40]; hChip[3273]=hTile[41]; hChip[3274]=hTile[42]; hChip[3275]=hTile[43];
			vChip[168]=vTile[40]; vChip[169]=vTile[41]; vChip[170]=vTile[42]; vChip[171]=vTile[43];
			aChip[200]=aTile[40]; aChip[201]=aTile[41]; aChip[202]=aTile[42]; aChip[203]=aTile[43];

			nChip[3244]=nTile[44]; nChip[3245]=nTile[45]; nChip[3246]=nTile[46]; nChip[3247]=nTile[47];
			hChip[3276]=hTile[44]; hChip[3277]=hTile[45]; hChip[3278]=hTile[46]; hChip[3279]=hTile[47];
			vChip[172]=vTile[44]; vChip[173]=vTile[45]; vChip[174]=vTile[46]; vChip[175]=vTile[47];
			aChip[204]=aTile[44]; aChip[205]=aTile[45]; aChip[206]=aTile[46]; aChip[207]=aTile[47];

			nChip[3248]=nTile[48]; nChip[3249]=nTile[49]; nChip[3250]=nTile[50]; nChip[3251]=nTile[51];
			hChip[3280]=hTile[48]; hChip[3281]=hTile[49]; hChip[3282]=hTile[50]; hChip[3283]=hTile[51];
			vChip[176]=vTile[48]; vChip[177]=vTile[49]; vChip[178]=vTile[50]; vChip[179]=vTile[51];
			aChip[208]=aTile[48]; aChip[209]=aTile[49]; aChip[210]=aTile[50]; aChip[211]=aTile[51];

			nChip[3252]=nTile[52]; nChip[3253]=nTile[53]; nChip[3254]=nTile[54]; nChip[3255]=nTile[55];
			hChip[3284]=hTile[52]; hChip[3285]=hTile[53]; hChip[3286]=hTile[54]; hChip[3287]=hTile[55];
			vChip[180]=vTile[52]; vChip[181]=vTile[53]; vChip[182]=vTile[54]; vChip[183]=vTile[55];
			aChip[212]=aTile[52]; aChip[213]=aTile[53]; aChip[214]=aTile[54]; aChip[215]=aTile[55];

			nChip[3256]=nTile[56]; nChip[3257]=nTile[57]; nChip[3258]=nTile[58]; nChip[3259]=nTile[59];
			hChip[3288]=hTile[56]; hChip[3289]=hTile[57]; hChip[3290]=hTile[58]; hChip[3291]=hTile[59];
			vChip[184]=vTile[56]; vChip[185]=vTile[57]; vChip[186]=vTile[58]; vChip[187]=vTile[59];
			aChip[216]=aTile[56]; aChip[217]=aTile[57]; aChip[218]=aTile[58]; aChip[219]=aTile[59];

			nChip[3260]=nTile[60]; nChip[3261]=nTile[61]; nChip[3262]=nTile[62]; nChip[3263]=nTile[63];
			hChip[3292]=hTile[60]; hChip[3293]=hTile[61]; hChip[3294]=hTile[62]; hChip[3295]=hTile[63];
			vChip[188]=vTile[60]; vChip[189]=vTile[61]; vChip[190]=vTile[62]; vChip[191]=vTile[63];
			aChip[220]=aTile[60]; aChip[221]=aTile[61]; aChip[222]=aTile[62]; aChip[223]=aTile[63];

			nChip[3360]=nTile[64]; nChip[3361]=nTile[65]; nChip[3362]=nTile[66]; nChip[3363]=nTile[67];
			hChip[3392]=hTile[64]; hChip[3393]=hTile[65]; hChip[3394]=hTile[66]; hChip[3395]=hTile[67];
			vChip[288]=vTile[64]; vChip[289]=vTile[65]; vChip[290]=vTile[66]; vChip[291]=vTile[67];
			aChip[320]=aTile[64]; aChip[321]=aTile[65]; aChip[322]=aTile[66]; aChip[323]=aTile[67];

			nChip[3364]=nTile[68]; nChip[3365]=nTile[69]; nChip[3366]=nTile[70]; nChip[3367]=nTile[71];
			hChip[3396]=hTile[68]; hChip[3397]=hTile[69]; hChip[3398]=hTile[70]; hChip[3399]=hTile[71];
			vChip[292]=vTile[68]; vChip[293]=vTile[69]; vChip[294]=vTile[70]; vChip[295]=vTile[71];
			aChip[324]=aTile[68]; aChip[325]=aTile[69]; aChip[326]=aTile[70]; aChip[327]=aTile[71];

			nChip[3368]=nTile[72]; nChip[3369]=nTile[73]; nChip[3370]=nTile[74]; nChip[3371]=nTile[75];
			hChip[3400]=hTile[72]; hChip[3401]=hTile[73]; hChip[3402]=hTile[74]; hChip[3403]=hTile[75];
			vChip[296]=vTile[72]; vChip[297]=vTile[73]; vChip[298]=vTile[74]; vChip[299]=vTile[75];
			aChip[328]=aTile[72]; aChip[329]=aTile[73]; aChip[330]=aTile[74]; aChip[331]=aTile[75];

			nChip[3372]=nTile[76]; nChip[3373]=nTile[77]; nChip[3374]=nTile[78]; nChip[3375]=nTile[79];
			hChip[3404]=hTile[76]; hChip[3405]=hTile[77]; hChip[3406]=hTile[78]; hChip[3407]=hTile[79];
			vChip[300]=vTile[76]; vChip[301]=vTile[77]; vChip[302]=vTile[78]; vChip[303]=vTile[79];
			aChip[332]=aTile[76]; aChip[333]=aTile[77]; aChip[334]=aTile[78]; aChip[335]=aTile[79];

			nChip[3376]=nTile[80]; nChip[3377]=nTile[81]; nChip[3378]=nTile[82]; nChip[3379]=nTile[83];
			hChip[3408]=hTile[80]; hChip[3409]=hTile[81]; hChip[3410]=hTile[82]; hChip[3411]=hTile[83];
			vChip[304]=vTile[80]; vChip[305]=vTile[81]; vChip[306]=vTile[82]; vChip[307]=vTile[83];
			aChip[336]=aTile[80]; aChip[337]=aTile[81]; aChip[338]=aTile[82]; aChip[339]=aTile[83];

			nChip[3380]=nTile[84]; nChip[3381]=nTile[85]; nChip[3382]=nTile[86]; nChip[3383]=nTile[87];
			hChip[3412]=hTile[84]; hChip[3413]=hTile[85]; hChip[3414]=hTile[86]; hChip[3415]=hTile[87];
			vChip[308]=vTile[84]; vChip[309]=vTile[85]; vChip[310]=vTile[86]; vChip[311]=vTile[87];
			aChip[340]=aTile[84]; aChip[341]=aTile[85]; aChip[342]=aTile[86]; aChip[343]=aTile[87];

			nChip[3384]=nTile[88]; nChip[3385]=nTile[89]; nChip[3386]=nTile[90]; nChip[3387]=nTile[91];
			hChip[3416]=hTile[88]; hChip[3417]=hTile[89]; hChip[3418]=hTile[90]; hChip[3419]=hTile[91];
			vChip[312]=vTile[88]; vChip[313]=vTile[89]; vChip[314]=vTile[90]; vChip[315]=vTile[91];
			aChip[344]=aTile[88]; aChip[345]=aTile[89]; aChip[346]=aTile[90]; aChip[347]=aTile[91];

			nChip[3388]=nTile[92]; nChip[3389]=nTile[93]; nChip[3390]=nTile[94]; nChip[3391]=nTile[95];
			hChip[3420]=hTile[92]; hChip[3421]=hTile[93]; hChip[3422]=hTile[94]; hChip[3423]=hTile[95];
			vChip[316]=vTile[92]; vChip[317]=vTile[93]; vChip[318]=vTile[94]; vChip[319]=vTile[95];
			aChip[348]=aTile[92]; aChip[349]=aTile[93]; aChip[350]=aTile[94]; aChip[351]=aTile[95];

			nChip[3488]=nTile[96]; nChip[3489]=nTile[97]; nChip[3490]=nTile[98]; nChip[3491]=nTile[99];
			hChip[3520]=hTile[96]; hChip[3521]=hTile[97]; hChip[3522]=hTile[98]; hChip[3523]=hTile[99];
			vChip[416]=vTile[96]; vChip[417]=vTile[97]; vChip[418]=vTile[98]; vChip[419]=vTile[99];
			aChip[448]=aTile[96]; aChip[449]=aTile[97]; aChip[450]=aTile[98]; aChip[451]=aTile[99];

			nChip[3492]=nTile[100]; nChip[3493]=nTile[101]; nChip[3494]=nTile[102]; nChip[3495]=nTile[103];
			hChip[3524]=hTile[100]; hChip[3525]=hTile[101]; hChip[3526]=hTile[102]; hChip[3527]=hTile[103];
			vChip[420]=vTile[100]; vChip[421]=vTile[101]; vChip[422]=vTile[102]; vChip[423]=vTile[103];
			aChip[452]=aTile[100]; aChip[453]=aTile[101]; aChip[454]=aTile[102]; aChip[455]=aTile[103];

			nChip[3496]=nTile[104]; nChip[3497]=nTile[105]; nChip[3498]=nTile[106]; nChip[3499]=nTile[107];
			hChip[3528]=hTile[104]; hChip[3529]=hTile[105]; hChip[3530]=hTile[106]; hChip[3531]=hTile[107];
			vChip[424]=vTile[104]; vChip[425]=vTile[105]; vChip[426]=vTile[106]; vChip[427]=vTile[107];
			aChip[456]=aTile[104]; aChip[457]=aTile[105]; aChip[458]=aTile[106]; aChip[459]=aTile[107];

			nChip[3500]=nTile[108]; nChip[3501]=nTile[109]; nChip[3502]=nTile[110]; nChip[3503]=nTile[111];
			hChip[3532]=hTile[108]; hChip[3533]=hTile[109]; hChip[3534]=hTile[110]; hChip[3535]=hTile[111];
			vChip[428]=vTile[108]; vChip[429]=vTile[109]; vChip[430]=vTile[110]; vChip[431]=vTile[111];
			aChip[460]=aTile[108]; aChip[461]=aTile[109]; aChip[462]=aTile[110]; aChip[463]=aTile[111];

			nChip[3504]=nTile[112]; nChip[3505]=nTile[113]; nChip[3506]=nTile[114]; nChip[3507]=nTile[115];
			hChip[3536]=hTile[112]; hChip[3537]=hTile[113]; hChip[3538]=hTile[114]; hChip[3539]=hTile[115];
			vChip[432]=vTile[112]; vChip[433]=vTile[113]; vChip[434]=vTile[114]; vChip[435]=vTile[115];
			aChip[464]=aTile[112]; aChip[465]=aTile[113]; aChip[466]=aTile[114]; aChip[467]=aTile[115];

			nChip[3508]=nTile[116]; nChip[3509]=nTile[117]; nChip[3510]=nTile[118]; nChip[3511]=nTile[119];
			hChip[3540]=hTile[116]; hChip[3541]=hTile[117]; hChip[3542]=hTile[118]; hChip[3543]=hTile[119];
			vChip[436]=vTile[116]; vChip[437]=vTile[117]; vChip[438]=vTile[118]; vChip[439]=vTile[119];
			aChip[468]=aTile[116]; aChip[469]=aTile[117]; aChip[470]=aTile[118]; aChip[471]=aTile[119];

			nChip[3512]=nTile[120]; nChip[3513]=nTile[121]; nChip[3514]=nTile[122]; nChip[3515]=nTile[123];
			hChip[3544]=hTile[120]; hChip[3545]=hTile[121]; hChip[3546]=hTile[122]; hChip[3547]=hTile[123];
			vChip[440]=vTile[120]; vChip[441]=vTile[121]; vChip[442]=vTile[122]; vChip[443]=vTile[123];
			aChip[472]=aTile[120]; aChip[473]=aTile[121]; aChip[474]=aTile[122]; aChip[475]=aTile[123];

			nChip[3516]=nTile[124]; nChip[3517]=nTile[125]; nChip[3518]=nTile[126]; nChip[3519]=nTile[127];
			hChip[3548]=hTile[124]; hChip[3549]=hTile[125]; hChip[3550]=hTile[126]; hChip[3551]=hTile[127];
			vChip[444]=vTile[124]; vChip[445]=vTile[125]; vChip[446]=vTile[126]; vChip[447]=vTile[127];
			aChip[476]=aTile[124]; aChip[477]=aTile[125]; aChip[478]=aTile[126]; aChip[479]=aTile[127];

			nChip[3616]=nTile[128]; nChip[3617]=nTile[129]; nChip[3618]=nTile[130]; nChip[3619]=nTile[131];
			hChip[3648]=hTile[128]; hChip[3649]=hTile[129]; hChip[3650]=hTile[130]; hChip[3651]=hTile[131];
			vChip[544]=vTile[128]; vChip[545]=vTile[129]; vChip[546]=vTile[130]; vChip[547]=vTile[131];
			aChip[576]=aTile[128]; aChip[577]=aTile[129]; aChip[578]=aTile[130]; aChip[579]=aTile[131];

			nChip[3620]=nTile[132]; nChip[3621]=nTile[133]; nChip[3622]=nTile[134]; nChip[3623]=nTile[135];
			hChip[3652]=hTile[132]; hChip[3653]=hTile[133]; hChip[3654]=hTile[134]; hChip[3655]=hTile[135];
			vChip[548]=vTile[132]; vChip[549]=vTile[133]; vChip[550]=vTile[134]; vChip[551]=vTile[135];
			aChip[580]=aTile[132]; aChip[581]=aTile[133]; aChip[582]=aTile[134]; aChip[583]=aTile[135];

			nChip[3624]=nTile[136]; nChip[3625]=nTile[137]; nChip[3626]=nTile[138]; nChip[3627]=nTile[139];
			hChip[3656]=hTile[136]; hChip[3657]=hTile[137]; hChip[3658]=hTile[138]; hChip[3659]=hTile[139];
			vChip[552]=vTile[136]; vChip[553]=vTile[137]; vChip[554]=vTile[138]; vChip[555]=vTile[139];
			aChip[584]=aTile[136]; aChip[585]=aTile[137]; aChip[586]=aTile[138]; aChip[587]=aTile[139];

			nChip[3628]=nTile[140]; nChip[3629]=nTile[141]; nChip[3630]=nTile[142]; nChip[3631]=nTile[143];
			hChip[3660]=hTile[140]; hChip[3661]=hTile[141]; hChip[3662]=hTile[142]; hChip[3663]=hTile[143];
			vChip[556]=vTile[140]; vChip[557]=vTile[141]; vChip[558]=vTile[142]; vChip[559]=vTile[143];
			aChip[588]=aTile[140]; aChip[589]=aTile[141]; aChip[590]=aTile[142]; aChip[591]=aTile[143];

			nChip[3632]=nTile[144]; nChip[3633]=nTile[145]; nChip[3634]=nTile[146]; nChip[3635]=nTile[147];
			hChip[3664]=hTile[144]; hChip[3665]=hTile[145]; hChip[3666]=hTile[146]; hChip[3667]=hTile[147];
			vChip[560]=vTile[144]; vChip[561]=vTile[145]; vChip[562]=vTile[146]; vChip[563]=vTile[147];
			aChip[592]=aTile[144]; aChip[593]=aTile[145]; aChip[594]=aTile[146]; aChip[595]=aTile[147];

			nChip[3636]=nTile[148]; nChip[3637]=nTile[149]; nChip[3638]=nTile[150]; nChip[3639]=nTile[151];
			hChip[3668]=hTile[148]; hChip[3669]=hTile[149]; hChip[3670]=hTile[150]; hChip[3671]=hTile[151];
			vChip[564]=vTile[148]; vChip[565]=vTile[149]; vChip[566]=vTile[150]; vChip[567]=vTile[151];
			aChip[596]=aTile[148]; aChip[597]=aTile[149]; aChip[598]=aTile[150]; aChip[599]=aTile[151];

			nChip[3640]=nTile[152]; nChip[3641]=nTile[153]; nChip[3642]=nTile[154]; nChip[3643]=nTile[155];
			hChip[3672]=hTile[152]; hChip[3673]=hTile[153]; hChip[3674]=hTile[154]; hChip[3675]=hTile[155];
			vChip[568]=vTile[152]; vChip[569]=vTile[153]; vChip[570]=vTile[154]; vChip[571]=vTile[155];
			aChip[600]=aTile[152]; aChip[601]=aTile[153]; aChip[602]=aTile[154]; aChip[603]=aTile[155];

			nChip[3644]=nTile[156]; nChip[3645]=nTile[157]; nChip[3646]=nTile[158]; nChip[3647]=nTile[159];
			hChip[3676]=hTile[156]; hChip[3677]=hTile[157]; hChip[3678]=hTile[158]; hChip[3679]=hTile[159];
			vChip[572]=vTile[156]; vChip[573]=vTile[157]; vChip[574]=vTile[158]; vChip[575]=vTile[159];
			aChip[604]=aTile[156]; aChip[605]=aTile[157]; aChip[606]=aTile[158]; aChip[607]=aTile[159];

			nChip[3744]=nTile[160]; nChip[3745]=nTile[161]; nChip[3746]=nTile[162]; nChip[3747]=nTile[163];
			hChip[3776]=hTile[160]; hChip[3777]=hTile[161]; hChip[3778]=hTile[162]; hChip[3779]=hTile[163];
			vChip[672]=vTile[160]; vChip[673]=vTile[161]; vChip[674]=vTile[162]; vChip[675]=vTile[163];
			aChip[704]=aTile[160]; aChip[705]=aTile[161]; aChip[706]=aTile[162]; aChip[707]=aTile[163];

			nChip[3748]=nTile[164]; nChip[3749]=nTile[165]; nChip[3750]=nTile[166]; nChip[3751]=nTile[167];
			hChip[3780]=hTile[164]; hChip[3781]=hTile[165]; hChip[3782]=hTile[166]; hChip[3783]=hTile[167];
			vChip[676]=vTile[164]; vChip[677]=vTile[165]; vChip[678]=vTile[166]; vChip[679]=vTile[167];
			aChip[708]=aTile[164]; aChip[709]=aTile[165]; aChip[710]=aTile[166]; aChip[711]=aTile[167];

			nChip[3752]=nTile[168]; nChip[3753]=nTile[169]; nChip[3754]=nTile[170]; nChip[3755]=nTile[171];
			hChip[3784]=hTile[168]; hChip[3785]=hTile[169]; hChip[3786]=hTile[170]; hChip[3787]=hTile[171];
			vChip[680]=vTile[168]; vChip[681]=vTile[169]; vChip[682]=vTile[170]; vChip[683]=vTile[171];
			aChip[712]=aTile[168]; aChip[713]=aTile[169]; aChip[714]=aTile[170]; aChip[715]=aTile[171];

			nChip[3756]=nTile[172]; nChip[3757]=nTile[173]; nChip[3758]=nTile[174]; nChip[3759]=nTile[175];
			hChip[3788]=hTile[172]; hChip[3789]=hTile[173]; hChip[3790]=hTile[174]; hChip[3791]=hTile[175];
			vChip[684]=vTile[172]; vChip[685]=vTile[173]; vChip[686]=vTile[174]; vChip[687]=vTile[175];
			aChip[716]=aTile[172]; aChip[717]=aTile[173]; aChip[718]=aTile[174]; aChip[719]=aTile[175];

			nChip[3760]=nTile[176]; nChip[3761]=nTile[177]; nChip[3762]=nTile[178]; nChip[3763]=nTile[179];
			hChip[3792]=hTile[176]; hChip[3793]=hTile[177]; hChip[3794]=hTile[178]; hChip[3795]=hTile[179];
			vChip[688]=vTile[176]; vChip[689]=vTile[177]; vChip[690]=vTile[178]; vChip[691]=vTile[179];
			aChip[720]=aTile[176]; aChip[721]=aTile[177]; aChip[722]=aTile[178]; aChip[723]=aTile[179];

			nChip[3764]=nTile[180]; nChip[3765]=nTile[181]; nChip[3766]=nTile[182]; nChip[3767]=nTile[183];
			hChip[3796]=hTile[180]; hChip[3797]=hTile[181]; hChip[3798]=hTile[182]; hChip[3799]=hTile[183];
			vChip[692]=vTile[180]; vChip[693]=vTile[181]; vChip[694]=vTile[182]; vChip[695]=vTile[183];
			aChip[724]=aTile[180]; aChip[725]=aTile[181]; aChip[726]=aTile[182]; aChip[727]=aTile[183];

			nChip[3768]=nTile[184]; nChip[3769]=nTile[185]; nChip[3770]=nTile[186]; nChip[3771]=nTile[187];
			hChip[3800]=hTile[184]; hChip[3801]=hTile[185]; hChip[3802]=hTile[186]; hChip[3803]=hTile[187];
			vChip[696]=vTile[184]; vChip[697]=vTile[185]; vChip[698]=vTile[186]; vChip[699]=vTile[187];
			aChip[728]=aTile[184]; aChip[729]=aTile[185]; aChip[730]=aTile[186]; aChip[731]=aTile[187];

			nChip[3772]=nTile[188]; nChip[3773]=nTile[189]; nChip[3774]=nTile[190]; nChip[3775]=nTile[191];
			hChip[3804]=hTile[188]; hChip[3805]=hTile[189]; hChip[3806]=hTile[190]; hChip[3807]=hTile[191];
			vChip[700]=vTile[188]; vChip[701]=vTile[189]; vChip[702]=vTile[190]; vChip[703]=vTile[191];
			aChip[732]=aTile[188]; aChip[733]=aTile[189]; aChip[734]=aTile[190]; aChip[735]=aTile[191];

			nChip[3872]=nTile[192]; nChip[3873]=nTile[193]; nChip[3874]=nTile[194]; nChip[3875]=nTile[195];
			hChip[3904]=hTile[192]; hChip[3905]=hTile[193]; hChip[3906]=hTile[194]; hChip[3907]=hTile[195];
			vChip[800]=vTile[192]; vChip[801]=vTile[193]; vChip[802]=vTile[194]; vChip[803]=vTile[195];
			aChip[832]=aTile[192]; aChip[833]=aTile[193]; aChip[834]=aTile[194]; aChip[835]=aTile[195];

			nChip[3876]=nTile[196]; nChip[3877]=nTile[197]; nChip[3878]=nTile[198]; nChip[3879]=nTile[199];
			hChip[3908]=hTile[196]; hChip[3909]=hTile[197]; hChip[3910]=hTile[198]; hChip[3911]=hTile[199];
			vChip[804]=vTile[196]; vChip[805]=vTile[197]; vChip[806]=vTile[198]; vChip[807]=vTile[199];
			aChip[836]=aTile[196]; aChip[837]=aTile[197]; aChip[838]=aTile[198]; aChip[839]=aTile[199];

			nChip[3880]=nTile[200]; nChip[3881]=nTile[201]; nChip[3882]=nTile[202]; nChip[3883]=nTile[203];
			hChip[3912]=hTile[200]; hChip[3913]=hTile[201]; hChip[3914]=hTile[202]; hChip[3915]=hTile[203];
			vChip[808]=vTile[200]; vChip[809]=vTile[201]; vChip[810]=vTile[202]; vChip[811]=vTile[203];
			aChip[840]=aTile[200]; aChip[841]=aTile[201]; aChip[842]=aTile[202]; aChip[843]=aTile[203];

			nChip[3884]=nTile[204]; nChip[3885]=nTile[205]; nChip[3886]=nTile[206]; nChip[3887]=nTile[207];
			hChip[3916]=hTile[204]; hChip[3917]=hTile[205]; hChip[3918]=hTile[206]; hChip[3919]=hTile[207];
			vChip[812]=vTile[204]; vChip[813]=vTile[205]; vChip[814]=vTile[206]; vChip[815]=vTile[207];
			aChip[844]=aTile[204]; aChip[845]=aTile[205]; aChip[846]=aTile[206]; aChip[847]=aTile[207];

			nChip[3888]=nTile[208]; nChip[3889]=nTile[209]; nChip[3890]=nTile[210]; nChip[3891]=nTile[211];
			hChip[3920]=hTile[208]; hChip[3921]=hTile[209]; hChip[3922]=hTile[210]; hChip[3923]=hTile[211];
			vChip[816]=vTile[208]; vChip[817]=vTile[209]; vChip[818]=vTile[210]; vChip[819]=vTile[211];
			aChip[848]=aTile[208]; aChip[849]=aTile[209]; aChip[850]=aTile[210]; aChip[851]=aTile[211];

			nChip[3892]=nTile[212]; nChip[3893]=nTile[213]; nChip[3894]=nTile[214]; nChip[3895]=nTile[215];
			hChip[3924]=hTile[212]; hChip[3925]=hTile[213]; hChip[3926]=hTile[214]; hChip[3927]=hTile[215];
			vChip[820]=vTile[212]; vChip[821]=vTile[213]; vChip[822]=vTile[214]; vChip[823]=vTile[215];
			aChip[852]=aTile[212]; aChip[853]=aTile[213]; aChip[854]=aTile[214]; aChip[855]=aTile[215];

			nChip[3896]=nTile[216]; nChip[3897]=nTile[217]; nChip[3898]=nTile[218]; nChip[3899]=nTile[219];
			hChip[3928]=hTile[216]; hChip[3929]=hTile[217]; hChip[3930]=hTile[218]; hChip[3931]=hTile[219];
			vChip[824]=vTile[216]; vChip[825]=vTile[217]; vChip[826]=vTile[218]; vChip[827]=vTile[219];
			aChip[856]=aTile[216]; aChip[857]=aTile[217]; aChip[858]=aTile[218]; aChip[859]=aTile[219];

			nChip[3900]=nTile[220]; nChip[3901]=nTile[221]; nChip[3902]=nTile[222]; nChip[3903]=nTile[223];
			hChip[3932]=hTile[220]; hChip[3933]=hTile[221]; hChip[3934]=hTile[222]; hChip[3935]=hTile[223];
			vChip[828]=vTile[220]; vChip[829]=vTile[221]; vChip[830]=vTile[222]; vChip[831]=vTile[223];
			aChip[860]=aTile[220]; aChip[861]=aTile[221]; aChip[862]=aTile[222]; aChip[863]=aTile[223];

			nChip[4000]=nTile[224]; nChip[4001]=nTile[225]; nChip[4002]=nTile[226]; nChip[4003]=nTile[227];
			hChip[4032]=hTile[224]; hChip[4033]=hTile[225]; hChip[4034]=hTile[226]; hChip[4035]=hTile[227];
			vChip[928]=vTile[224]; vChip[929]=vTile[225]; vChip[930]=vTile[226]; vChip[931]=vTile[227];
			aChip[960]=aTile[224]; aChip[961]=aTile[225]; aChip[962]=aTile[226]; aChip[963]=aTile[227];

			nChip[4004]=nTile[228]; nChip[4005]=nTile[229]; nChip[4006]=nTile[230]; nChip[4007]=nTile[231];
			hChip[4036]=hTile[228]; hChip[4037]=hTile[229]; hChip[4038]=hTile[230]; hChip[4039]=hTile[231];
			vChip[932]=vTile[228]; vChip[933]=vTile[229]; vChip[934]=vTile[230]; vChip[935]=vTile[231];
			aChip[964]=aTile[228]; aChip[965]=aTile[229]; aChip[966]=aTile[230]; aChip[967]=aTile[231];

			nChip[4008]=nTile[232]; nChip[4009]=nTile[233]; nChip[4010]=nTile[234]; nChip[4011]=nTile[235];
			hChip[4040]=hTile[232]; hChip[4041]=hTile[233]; hChip[4042]=hTile[234]; hChip[4043]=hTile[235];
			vChip[936]=vTile[232]; vChip[937]=vTile[233]; vChip[938]=vTile[234]; vChip[939]=vTile[235];
			aChip[968]=aTile[232]; aChip[969]=aTile[233]; aChip[970]=aTile[234]; aChip[971]=aTile[235];

			nChip[4012]=nTile[236]; nChip[4013]=nTile[237]; nChip[4014]=nTile[238]; nChip[4015]=nTile[239];
			hChip[4044]=hTile[236]; hChip[4045]=hTile[237]; hChip[4046]=hTile[238]; hChip[4047]=hTile[239];
			vChip[940]=vTile[236]; vChip[941]=vTile[237]; vChip[942]=vTile[238]; vChip[943]=vTile[239];
			aChip[972]=aTile[236]; aChip[973]=aTile[237]; aChip[974]=aTile[238]; aChip[975]=aTile[239];

			nChip[4016]=nTile[240]; nChip[4017]=nTile[241]; nChip[4018]=nTile[242]; nChip[4019]=nTile[243];
			hChip[4048]=hTile[240]; hChip[4049]=hTile[241]; hChip[4050]=hTile[242]; hChip[4051]=hTile[243];
			vChip[944]=vTile[240]; vChip[945]=vTile[241]; vChip[946]=vTile[242]; vChip[947]=vTile[243];
			aChip[976]=aTile[240]; aChip[977]=aTile[241]; aChip[978]=aTile[242]; aChip[979]=aTile[243];

			nChip[4020]=nTile[244]; nChip[4021]=nTile[245]; nChip[4022]=nTile[246]; nChip[4023]=nTile[247];
			hChip[4052]=hTile[244]; hChip[4053]=hTile[245]; hChip[4054]=hTile[246]; hChip[4055]=hTile[247];
			vChip[948]=vTile[244]; vChip[949]=vTile[245]; vChip[950]=vTile[246]; vChip[951]=vTile[247];
			aChip[980]=aTile[244]; aChip[981]=aTile[245]; aChip[982]=aTile[246]; aChip[983]=aTile[247];

			nChip[4024]=nTile[248]; nChip[4025]=nTile[249]; nChip[4026]=nTile[250]; nChip[4027]=nTile[251];
			hChip[4056]=hTile[248]; hChip[4057]=hTile[249]; hChip[4058]=hTile[250]; hChip[4059]=hTile[251];
			vChip[952]=vTile[248]; vChip[953]=vTile[249]; vChip[954]=vTile[250]; vChip[955]=vTile[251];
			aChip[984]=aTile[248]; aChip[985]=aTile[249]; aChip[986]=aTile[250]; aChip[987]=aTile[251];

			nChip[4028]=nTile[252]; nChip[4029]=nTile[253]; nChip[4030]=nTile[254]; nChip[4031]=nTile[255];
			hChip[4060]=hTile[252]; hChip[4061]=hTile[253]; hChip[4062]=hTile[254]; hChip[4063]=hTile[255];
			vChip[956]=vTile[252]; vChip[957]=vTile[253]; vChip[958]=vTile[254]; vChip[959]=vTile[255];
			aChip[988]=aTile[252]; aChip[989]=aTile[253]; aChip[990]=aTile[254]; aChip[991]=aTile[255];

			A = d[cOfst+28]; B = d[cOfst+29];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[3136]=nTile[0]; nChip[3137]=nTile[1]; nChip[3138]=nTile[2]; nChip[3139]=nTile[3];
			hChip[3104]=hTile[0]; hChip[3105]=hTile[1]; hChip[3106]=hTile[2]; hChip[3107]=hTile[3];
			vChip[64]=vTile[0]; vChip[65]=vTile[1]; vChip[66]=vTile[2]; vChip[67]=vTile[3];
			aChip[32]=aTile[0]; aChip[33]=aTile[1]; aChip[34]=aTile[2]; aChip[35]=aTile[3];

			nChip[3140]=nTile[4]; nChip[3141]=nTile[5]; nChip[3142]=nTile[6]; nChip[3143]=nTile[7];
			hChip[3108]=hTile[4]; hChip[3109]=hTile[5]; hChip[3110]=hTile[6]; hChip[3111]=hTile[7];
			vChip[68]=vTile[4]; vChip[69]=vTile[5]; vChip[70]=vTile[6]; vChip[71]=vTile[7];
			aChip[36]=aTile[4]; aChip[37]=aTile[5]; aChip[38]=aTile[6]; aChip[39]=aTile[7];

			nChip[3144]=nTile[8]; nChip[3145]=nTile[9]; nChip[3146]=nTile[10]; nChip[3147]=nTile[11];
			hChip[3112]=hTile[8]; hChip[3113]=hTile[9]; hChip[3114]=hTile[10]; hChip[3115]=hTile[11];
			vChip[72]=vTile[8]; vChip[73]=vTile[9]; vChip[74]=vTile[10]; vChip[75]=vTile[11];
			aChip[40]=aTile[8]; aChip[41]=aTile[9]; aChip[42]=aTile[10]; aChip[43]=aTile[11];

			nChip[3148]=nTile[12]; nChip[3149]=nTile[13]; nChip[3150]=nTile[14]; nChip[3151]=nTile[15];
			hChip[3116]=hTile[12]; hChip[3117]=hTile[13]; hChip[3118]=hTile[14]; hChip[3119]=hTile[15];
			vChip[76]=vTile[12]; vChip[77]=vTile[13]; vChip[78]=vTile[14]; vChip[79]=vTile[15];
			aChip[44]=aTile[12]; aChip[45]=aTile[13]; aChip[46]=aTile[14]; aChip[47]=aTile[15];

			nChip[3152]=nTile[16]; nChip[3153]=nTile[17]; nChip[3154]=nTile[18]; nChip[3155]=nTile[19];
			hChip[3120]=hTile[16]; hChip[3121]=hTile[17]; hChip[3122]=hTile[18]; hChip[3123]=hTile[19];
			vChip[80]=vTile[16]; vChip[81]=vTile[17]; vChip[82]=vTile[18]; vChip[83]=vTile[19];
			aChip[48]=aTile[16]; aChip[49]=aTile[17]; aChip[50]=aTile[18]; aChip[51]=aTile[19];

			nChip[3156]=nTile[20]; nChip[3157]=nTile[21]; nChip[3158]=nTile[22]; nChip[3159]=nTile[23];
			hChip[3124]=hTile[20]; hChip[3125]=hTile[21]; hChip[3126]=hTile[22]; hChip[3127]=hTile[23];
			vChip[84]=vTile[20]; vChip[85]=vTile[21]; vChip[86]=vTile[22]; vChip[87]=vTile[23];
			aChip[52]=aTile[20]; aChip[53]=aTile[21]; aChip[54]=aTile[22]; aChip[55]=aTile[23];

			nChip[3160]=nTile[24]; nChip[3161]=nTile[25]; nChip[3162]=nTile[26]; nChip[3163]=nTile[27];
			hChip[3128]=hTile[24]; hChip[3129]=hTile[25]; hChip[3130]=hTile[26]; hChip[3131]=hTile[27];
			vChip[88]=vTile[24]; vChip[89]=vTile[25]; vChip[90]=vTile[26]; vChip[91]=vTile[27];
			aChip[56]=aTile[24]; aChip[57]=aTile[25]; aChip[58]=aTile[26]; aChip[59]=aTile[27];

			nChip[3164]=nTile[28]; nChip[3165]=nTile[29]; nChip[3166]=nTile[30]; nChip[3167]=nTile[31];
			hChip[3132]=hTile[28]; hChip[3133]=hTile[29]; hChip[3134]=hTile[30]; hChip[3135]=hTile[31];
			vChip[92]=vTile[28]; vChip[93]=vTile[29]; vChip[94]=vTile[30]; vChip[95]=vTile[31];
			aChip[60]=aTile[28]; aChip[61]=aTile[29]; aChip[62]=aTile[30]; aChip[63]=aTile[31];

			nChip[3264]=nTile[32]; nChip[3265]=nTile[33]; nChip[3266]=nTile[34]; nChip[3267]=nTile[35];
			hChip[3232]=hTile[32]; hChip[3233]=hTile[33]; hChip[3234]=hTile[34]; hChip[3235]=hTile[35];
			vChip[192]=vTile[32]; vChip[193]=vTile[33]; vChip[194]=vTile[34]; vChip[195]=vTile[35];
			aChip[160]=aTile[32]; aChip[161]=aTile[33]; aChip[162]=aTile[34]; aChip[163]=aTile[35];

			nChip[3268]=nTile[36]; nChip[3269]=nTile[37]; nChip[3270]=nTile[38]; nChip[3271]=nTile[39];
			hChip[3236]=hTile[36]; hChip[3237]=hTile[37]; hChip[3238]=hTile[38]; hChip[3239]=hTile[39];
			vChip[196]=vTile[36]; vChip[197]=vTile[37]; vChip[198]=vTile[38]; vChip[199]=vTile[39];
			aChip[164]=aTile[36]; aChip[165]=aTile[37]; aChip[166]=aTile[38]; aChip[167]=aTile[39];

			nChip[3272]=nTile[40]; nChip[3273]=nTile[41]; nChip[3274]=nTile[42]; nChip[3275]=nTile[43];
			hChip[3240]=hTile[40]; hChip[3241]=hTile[41]; hChip[3242]=hTile[42]; hChip[3243]=hTile[43];
			vChip[200]=vTile[40]; vChip[201]=vTile[41]; vChip[202]=vTile[42]; vChip[203]=vTile[43];
			aChip[168]=aTile[40]; aChip[169]=aTile[41]; aChip[170]=aTile[42]; aChip[171]=aTile[43];

			nChip[3276]=nTile[44]; nChip[3277]=nTile[45]; nChip[3278]=nTile[46]; nChip[3279]=nTile[47];
			hChip[3244]=hTile[44]; hChip[3245]=hTile[45]; hChip[3246]=hTile[46]; hChip[3247]=hTile[47];
			vChip[204]=vTile[44]; vChip[205]=vTile[45]; vChip[206]=vTile[46]; vChip[207]=vTile[47];
			aChip[172]=aTile[44]; aChip[173]=aTile[45]; aChip[174]=aTile[46]; aChip[175]=aTile[47];

			nChip[3280]=nTile[48]; nChip[3281]=nTile[49]; nChip[3282]=nTile[50]; nChip[3283]=nTile[51];
			hChip[3248]=hTile[48]; hChip[3249]=hTile[49]; hChip[3250]=hTile[50]; hChip[3251]=hTile[51];
			vChip[208]=vTile[48]; vChip[209]=vTile[49]; vChip[210]=vTile[50]; vChip[211]=vTile[51];
			aChip[176]=aTile[48]; aChip[177]=aTile[49]; aChip[178]=aTile[50]; aChip[179]=aTile[51];

			nChip[3284]=nTile[52]; nChip[3285]=nTile[53]; nChip[3286]=nTile[54]; nChip[3287]=nTile[55];
			hChip[3252]=hTile[52]; hChip[3253]=hTile[53]; hChip[3254]=hTile[54]; hChip[3255]=hTile[55];
			vChip[212]=vTile[52]; vChip[213]=vTile[53]; vChip[214]=vTile[54]; vChip[215]=vTile[55];
			aChip[180]=aTile[52]; aChip[181]=aTile[53]; aChip[182]=aTile[54]; aChip[183]=aTile[55];

			nChip[3288]=nTile[56]; nChip[3289]=nTile[57]; nChip[3290]=nTile[58]; nChip[3291]=nTile[59];
			hChip[3256]=hTile[56]; hChip[3257]=hTile[57]; hChip[3258]=hTile[58]; hChip[3259]=hTile[59];
			vChip[216]=vTile[56]; vChip[217]=vTile[57]; vChip[218]=vTile[58]; vChip[219]=vTile[59];
			aChip[184]=aTile[56]; aChip[185]=aTile[57]; aChip[186]=aTile[58]; aChip[187]=aTile[59];

			nChip[3292]=nTile[60]; nChip[3293]=nTile[61]; nChip[3294]=nTile[62]; nChip[3295]=nTile[63];
			hChip[3260]=hTile[60]; hChip[3261]=hTile[61]; hChip[3262]=hTile[62]; hChip[3263]=hTile[63];
			vChip[220]=vTile[60]; vChip[221]=vTile[61]; vChip[222]=vTile[62]; vChip[223]=vTile[63];
			aChip[188]=aTile[60]; aChip[189]=aTile[61]; aChip[190]=aTile[62]; aChip[191]=aTile[63];

			nChip[3392]=nTile[64]; nChip[3393]=nTile[65]; nChip[3394]=nTile[66]; nChip[3395]=nTile[67];
			hChip[3360]=hTile[64]; hChip[3361]=hTile[65]; hChip[3362]=hTile[66]; hChip[3363]=hTile[67];
			vChip[320]=vTile[64]; vChip[321]=vTile[65]; vChip[322]=vTile[66]; vChip[323]=vTile[67];
			aChip[288]=aTile[64]; aChip[289]=aTile[65]; aChip[290]=aTile[66]; aChip[291]=aTile[67];

			nChip[3396]=nTile[68]; nChip[3397]=nTile[69]; nChip[3398]=nTile[70]; nChip[3399]=nTile[71];
			hChip[3364]=hTile[68]; hChip[3365]=hTile[69]; hChip[3366]=hTile[70]; hChip[3367]=hTile[71];
			vChip[324]=vTile[68]; vChip[325]=vTile[69]; vChip[326]=vTile[70]; vChip[327]=vTile[71];
			aChip[292]=aTile[68]; aChip[293]=aTile[69]; aChip[294]=aTile[70]; aChip[295]=aTile[71];

			nChip[3400]=nTile[72]; nChip[3401]=nTile[73]; nChip[3402]=nTile[74]; nChip[3403]=nTile[75];
			hChip[3368]=hTile[72]; hChip[3369]=hTile[73]; hChip[3370]=hTile[74]; hChip[3371]=hTile[75];
			vChip[328]=vTile[72]; vChip[329]=vTile[73]; vChip[330]=vTile[74]; vChip[331]=vTile[75];
			aChip[296]=aTile[72]; aChip[297]=aTile[73]; aChip[298]=aTile[74]; aChip[299]=aTile[75];

			nChip[3404]=nTile[76]; nChip[3405]=nTile[77]; nChip[3406]=nTile[78]; nChip[3407]=nTile[79];
			hChip[3372]=hTile[76]; hChip[3373]=hTile[77]; hChip[3374]=hTile[78]; hChip[3375]=hTile[79];
			vChip[332]=vTile[76]; vChip[333]=vTile[77]; vChip[334]=vTile[78]; vChip[335]=vTile[79];
			aChip[300]=aTile[76]; aChip[301]=aTile[77]; aChip[302]=aTile[78]; aChip[303]=aTile[79];

			nChip[3408]=nTile[80]; nChip[3409]=nTile[81]; nChip[3410]=nTile[82]; nChip[3411]=nTile[83];
			hChip[3376]=hTile[80]; hChip[3377]=hTile[81]; hChip[3378]=hTile[82]; hChip[3379]=hTile[83];
			vChip[336]=vTile[80]; vChip[337]=vTile[81]; vChip[338]=vTile[82]; vChip[339]=vTile[83];
			aChip[304]=aTile[80]; aChip[305]=aTile[81]; aChip[306]=aTile[82]; aChip[307]=aTile[83];

			nChip[3412]=nTile[84]; nChip[3413]=nTile[85]; nChip[3414]=nTile[86]; nChip[3415]=nTile[87];
			hChip[3380]=hTile[84]; hChip[3381]=hTile[85]; hChip[3382]=hTile[86]; hChip[3383]=hTile[87];
			vChip[340]=vTile[84]; vChip[341]=vTile[85]; vChip[342]=vTile[86]; vChip[343]=vTile[87];
			aChip[308]=aTile[84]; aChip[309]=aTile[85]; aChip[310]=aTile[86]; aChip[311]=aTile[87];

			nChip[3416]=nTile[88]; nChip[3417]=nTile[89]; nChip[3418]=nTile[90]; nChip[3419]=nTile[91];
			hChip[3384]=hTile[88]; hChip[3385]=hTile[89]; hChip[3386]=hTile[90]; hChip[3387]=hTile[91];
			vChip[344]=vTile[88]; vChip[345]=vTile[89]; vChip[346]=vTile[90]; vChip[347]=vTile[91];
			aChip[312]=aTile[88]; aChip[313]=aTile[89]; aChip[314]=aTile[90]; aChip[315]=aTile[91];

			nChip[3420]=nTile[92]; nChip[3421]=nTile[93]; nChip[3422]=nTile[94]; nChip[3423]=nTile[95];
			hChip[3388]=hTile[92]; hChip[3389]=hTile[93]; hChip[3390]=hTile[94]; hChip[3391]=hTile[95];
			vChip[348]=vTile[92]; vChip[349]=vTile[93]; vChip[350]=vTile[94]; vChip[351]=vTile[95];
			aChip[316]=aTile[92]; aChip[317]=aTile[93]; aChip[318]=aTile[94]; aChip[319]=aTile[95];

			nChip[3520]=nTile[96]; nChip[3521]=nTile[97]; nChip[3522]=nTile[98]; nChip[3523]=nTile[99];
			hChip[3488]=hTile[96]; hChip[3489]=hTile[97]; hChip[3490]=hTile[98]; hChip[3491]=hTile[99];
			vChip[448]=vTile[96]; vChip[449]=vTile[97]; vChip[450]=vTile[98]; vChip[451]=vTile[99];
			aChip[416]=aTile[96]; aChip[417]=aTile[97]; aChip[418]=aTile[98]; aChip[419]=aTile[99];

			nChip[3524]=nTile[100]; nChip[3525]=nTile[101]; nChip[3526]=nTile[102]; nChip[3527]=nTile[103];
			hChip[3492]=hTile[100]; hChip[3493]=hTile[101]; hChip[3494]=hTile[102]; hChip[3495]=hTile[103];
			vChip[452]=vTile[100]; vChip[453]=vTile[101]; vChip[454]=vTile[102]; vChip[455]=vTile[103];
			aChip[420]=aTile[100]; aChip[421]=aTile[101]; aChip[422]=aTile[102]; aChip[423]=aTile[103];

			nChip[3528]=nTile[104]; nChip[3529]=nTile[105]; nChip[3530]=nTile[106]; nChip[3531]=nTile[107];
			hChip[3496]=hTile[104]; hChip[3497]=hTile[105]; hChip[3498]=hTile[106]; hChip[3499]=hTile[107];
			vChip[456]=vTile[104]; vChip[457]=vTile[105]; vChip[458]=vTile[106]; vChip[459]=vTile[107];
			aChip[424]=aTile[104]; aChip[425]=aTile[105]; aChip[426]=aTile[106]; aChip[427]=aTile[107];

			nChip[3532]=nTile[108]; nChip[3533]=nTile[109]; nChip[3534]=nTile[110]; nChip[3535]=nTile[111];
			hChip[3500]=hTile[108]; hChip[3501]=hTile[109]; hChip[3502]=hTile[110]; hChip[3503]=hTile[111];
			vChip[460]=vTile[108]; vChip[461]=vTile[109]; vChip[462]=vTile[110]; vChip[463]=vTile[111];
			aChip[428]=aTile[108]; aChip[429]=aTile[109]; aChip[430]=aTile[110]; aChip[431]=aTile[111];

			nChip[3536]=nTile[112]; nChip[3537]=nTile[113]; nChip[3538]=nTile[114]; nChip[3539]=nTile[115];
			hChip[3504]=hTile[112]; hChip[3505]=hTile[113]; hChip[3506]=hTile[114]; hChip[3507]=hTile[115];
			vChip[464]=vTile[112]; vChip[465]=vTile[113]; vChip[466]=vTile[114]; vChip[467]=vTile[115];
			aChip[432]=aTile[112]; aChip[433]=aTile[113]; aChip[434]=aTile[114]; aChip[435]=aTile[115];

			nChip[3540]=nTile[116]; nChip[3541]=nTile[117]; nChip[3542]=nTile[118]; nChip[3543]=nTile[119];
			hChip[3508]=hTile[116]; hChip[3509]=hTile[117]; hChip[3510]=hTile[118]; hChip[3511]=hTile[119];
			vChip[468]=vTile[116]; vChip[469]=vTile[117]; vChip[470]=vTile[118]; vChip[471]=vTile[119];
			aChip[436]=aTile[116]; aChip[437]=aTile[117]; aChip[438]=aTile[118]; aChip[439]=aTile[119];

			nChip[3544]=nTile[120]; nChip[3545]=nTile[121]; nChip[3546]=nTile[122]; nChip[3547]=nTile[123];
			hChip[3512]=hTile[120]; hChip[3513]=hTile[121]; hChip[3514]=hTile[122]; hChip[3515]=hTile[123];
			vChip[472]=vTile[120]; vChip[473]=vTile[121]; vChip[474]=vTile[122]; vChip[475]=vTile[123];
			aChip[440]=aTile[120]; aChip[441]=aTile[121]; aChip[442]=aTile[122]; aChip[443]=aTile[123];

			nChip[3548]=nTile[124]; nChip[3549]=nTile[125]; nChip[3550]=nTile[126]; nChip[3551]=nTile[127];
			hChip[3516]=hTile[124]; hChip[3517]=hTile[125]; hChip[3518]=hTile[126]; hChip[3519]=hTile[127];
			vChip[476]=vTile[124]; vChip[477]=vTile[125]; vChip[478]=vTile[126]; vChip[479]=vTile[127];
			aChip[444]=aTile[124]; aChip[445]=aTile[125]; aChip[446]=aTile[126]; aChip[447]=aTile[127];

			nChip[3648]=nTile[128]; nChip[3649]=nTile[129]; nChip[3650]=nTile[130]; nChip[3651]=nTile[131];
			hChip[3616]=hTile[128]; hChip[3617]=hTile[129]; hChip[3618]=hTile[130]; hChip[3619]=hTile[131];
			vChip[576]=vTile[128]; vChip[577]=vTile[129]; vChip[578]=vTile[130]; vChip[579]=vTile[131];
			aChip[544]=aTile[128]; aChip[545]=aTile[129]; aChip[546]=aTile[130]; aChip[547]=aTile[131];

			nChip[3652]=nTile[132]; nChip[3653]=nTile[133]; nChip[3654]=nTile[134]; nChip[3655]=nTile[135];
			hChip[3620]=hTile[132]; hChip[3621]=hTile[133]; hChip[3622]=hTile[134]; hChip[3623]=hTile[135];
			vChip[580]=vTile[132]; vChip[581]=vTile[133]; vChip[582]=vTile[134]; vChip[583]=vTile[135];
			aChip[548]=aTile[132]; aChip[549]=aTile[133]; aChip[550]=aTile[134]; aChip[551]=aTile[135];

			nChip[3656]=nTile[136]; nChip[3657]=nTile[137]; nChip[3658]=nTile[138]; nChip[3659]=nTile[139];
			hChip[3624]=hTile[136]; hChip[3625]=hTile[137]; hChip[3626]=hTile[138]; hChip[3627]=hTile[139];
			vChip[584]=vTile[136]; vChip[585]=vTile[137]; vChip[586]=vTile[138]; vChip[587]=vTile[139];
			aChip[552]=aTile[136]; aChip[553]=aTile[137]; aChip[554]=aTile[138]; aChip[555]=aTile[139];

			nChip[3660]=nTile[140]; nChip[3661]=nTile[141]; nChip[3662]=nTile[142]; nChip[3663]=nTile[143];
			hChip[3628]=hTile[140]; hChip[3629]=hTile[141]; hChip[3630]=hTile[142]; hChip[3631]=hTile[143];
			vChip[588]=vTile[140]; vChip[589]=vTile[141]; vChip[590]=vTile[142]; vChip[591]=vTile[143];
			aChip[556]=aTile[140]; aChip[557]=aTile[141]; aChip[558]=aTile[142]; aChip[559]=aTile[143];

			nChip[3664]=nTile[144]; nChip[3665]=nTile[145]; nChip[3666]=nTile[146]; nChip[3667]=nTile[147];
			hChip[3632]=hTile[144]; hChip[3633]=hTile[145]; hChip[3634]=hTile[146]; hChip[3635]=hTile[147];
			vChip[592]=vTile[144]; vChip[593]=vTile[145]; vChip[594]=vTile[146]; vChip[595]=vTile[147];
			aChip[560]=aTile[144]; aChip[561]=aTile[145]; aChip[562]=aTile[146]; aChip[563]=aTile[147];

			nChip[3668]=nTile[148]; nChip[3669]=nTile[149]; nChip[3670]=nTile[150]; nChip[3671]=nTile[151];
			hChip[3636]=hTile[148]; hChip[3637]=hTile[149]; hChip[3638]=hTile[150]; hChip[3639]=hTile[151];
			vChip[596]=vTile[148]; vChip[597]=vTile[149]; vChip[598]=vTile[150]; vChip[599]=vTile[151];
			aChip[564]=aTile[148]; aChip[565]=aTile[149]; aChip[566]=aTile[150]; aChip[567]=aTile[151];

			nChip[3672]=nTile[152]; nChip[3673]=nTile[153]; nChip[3674]=nTile[154]; nChip[3675]=nTile[155];
			hChip[3640]=hTile[152]; hChip[3641]=hTile[153]; hChip[3642]=hTile[154]; hChip[3643]=hTile[155];
			vChip[600]=vTile[152]; vChip[601]=vTile[153]; vChip[602]=vTile[154]; vChip[603]=vTile[155];
			aChip[568]=aTile[152]; aChip[569]=aTile[153]; aChip[570]=aTile[154]; aChip[571]=aTile[155];

			nChip[3676]=nTile[156]; nChip[3677]=nTile[157]; nChip[3678]=nTile[158]; nChip[3679]=nTile[159];
			hChip[3644]=hTile[156]; hChip[3645]=hTile[157]; hChip[3646]=hTile[158]; hChip[3647]=hTile[159];
			vChip[604]=vTile[156]; vChip[605]=vTile[157]; vChip[606]=vTile[158]; vChip[607]=vTile[159];
			aChip[572]=aTile[156]; aChip[573]=aTile[157]; aChip[574]=aTile[158]; aChip[575]=aTile[159];

			nChip[3776]=nTile[160]; nChip[3777]=nTile[161]; nChip[3778]=nTile[162]; nChip[3779]=nTile[163];
			hChip[3744]=hTile[160]; hChip[3745]=hTile[161]; hChip[3746]=hTile[162]; hChip[3747]=hTile[163];
			vChip[704]=vTile[160]; vChip[705]=vTile[161]; vChip[706]=vTile[162]; vChip[707]=vTile[163];
			aChip[672]=aTile[160]; aChip[673]=aTile[161]; aChip[674]=aTile[162]; aChip[675]=aTile[163];

			nChip[3780]=nTile[164]; nChip[3781]=nTile[165]; nChip[3782]=nTile[166]; nChip[3783]=nTile[167];
			hChip[3748]=hTile[164]; hChip[3749]=hTile[165]; hChip[3750]=hTile[166]; hChip[3751]=hTile[167];
			vChip[708]=vTile[164]; vChip[709]=vTile[165]; vChip[710]=vTile[166]; vChip[711]=vTile[167];
			aChip[676]=aTile[164]; aChip[677]=aTile[165]; aChip[678]=aTile[166]; aChip[679]=aTile[167];

			nChip[3784]=nTile[168]; nChip[3785]=nTile[169]; nChip[3786]=nTile[170]; nChip[3787]=nTile[171];
			hChip[3752]=hTile[168]; hChip[3753]=hTile[169]; hChip[3754]=hTile[170]; hChip[3755]=hTile[171];
			vChip[712]=vTile[168]; vChip[713]=vTile[169]; vChip[714]=vTile[170]; vChip[715]=vTile[171];
			aChip[680]=aTile[168]; aChip[681]=aTile[169]; aChip[682]=aTile[170]; aChip[683]=aTile[171];

			nChip[3788]=nTile[172]; nChip[3789]=nTile[173]; nChip[3790]=nTile[174]; nChip[3791]=nTile[175];
			hChip[3756]=hTile[172]; hChip[3757]=hTile[173]; hChip[3758]=hTile[174]; hChip[3759]=hTile[175];
			vChip[716]=vTile[172]; vChip[717]=vTile[173]; vChip[718]=vTile[174]; vChip[719]=vTile[175];
			aChip[684]=aTile[172]; aChip[685]=aTile[173]; aChip[686]=aTile[174]; aChip[687]=aTile[175];

			nChip[3792]=nTile[176]; nChip[3793]=nTile[177]; nChip[3794]=nTile[178]; nChip[3795]=nTile[179];
			hChip[3760]=hTile[176]; hChip[3761]=hTile[177]; hChip[3762]=hTile[178]; hChip[3763]=hTile[179];
			vChip[720]=vTile[176]; vChip[721]=vTile[177]; vChip[722]=vTile[178]; vChip[723]=vTile[179];
			aChip[688]=aTile[176]; aChip[689]=aTile[177]; aChip[690]=aTile[178]; aChip[691]=aTile[179];

			nChip[3796]=nTile[180]; nChip[3797]=nTile[181]; nChip[3798]=nTile[182]; nChip[3799]=nTile[183];
			hChip[3764]=hTile[180]; hChip[3765]=hTile[181]; hChip[3766]=hTile[182]; hChip[3767]=hTile[183];
			vChip[724]=vTile[180]; vChip[725]=vTile[181]; vChip[726]=vTile[182]; vChip[727]=vTile[183];
			aChip[692]=aTile[180]; aChip[693]=aTile[181]; aChip[694]=aTile[182]; aChip[695]=aTile[183];

			nChip[3800]=nTile[184]; nChip[3801]=nTile[185]; nChip[3802]=nTile[186]; nChip[3803]=nTile[187];
			hChip[3768]=hTile[184]; hChip[3769]=hTile[185]; hChip[3770]=hTile[186]; hChip[3771]=hTile[187];
			vChip[728]=vTile[184]; vChip[729]=vTile[185]; vChip[730]=vTile[186]; vChip[731]=vTile[187];
			aChip[696]=aTile[184]; aChip[697]=aTile[185]; aChip[698]=aTile[186]; aChip[699]=aTile[187];

			nChip[3804]=nTile[188]; nChip[3805]=nTile[189]; nChip[3806]=nTile[190]; nChip[3807]=nTile[191];
			hChip[3772]=hTile[188]; hChip[3773]=hTile[189]; hChip[3774]=hTile[190]; hChip[3775]=hTile[191];
			vChip[732]=vTile[188]; vChip[733]=vTile[189]; vChip[734]=vTile[190]; vChip[735]=vTile[191];
			aChip[700]=aTile[188]; aChip[701]=aTile[189]; aChip[702]=aTile[190]; aChip[703]=aTile[191];

			nChip[3904]=nTile[192]; nChip[3905]=nTile[193]; nChip[3906]=nTile[194]; nChip[3907]=nTile[195];
			hChip[3872]=hTile[192]; hChip[3873]=hTile[193]; hChip[3874]=hTile[194]; hChip[3875]=hTile[195];
			vChip[832]=vTile[192]; vChip[833]=vTile[193]; vChip[834]=vTile[194]; vChip[835]=vTile[195];
			aChip[800]=aTile[192]; aChip[801]=aTile[193]; aChip[802]=aTile[194]; aChip[803]=aTile[195];

			nChip[3908]=nTile[196]; nChip[3909]=nTile[197]; nChip[3910]=nTile[198]; nChip[3911]=nTile[199];
			hChip[3876]=hTile[196]; hChip[3877]=hTile[197]; hChip[3878]=hTile[198]; hChip[3879]=hTile[199];
			vChip[836]=vTile[196]; vChip[837]=vTile[197]; vChip[838]=vTile[198]; vChip[839]=vTile[199];
			aChip[804]=aTile[196]; aChip[805]=aTile[197]; aChip[806]=aTile[198]; aChip[807]=aTile[199];

			nChip[3912]=nTile[200]; nChip[3913]=nTile[201]; nChip[3914]=nTile[202]; nChip[3915]=nTile[203];
			hChip[3880]=hTile[200]; hChip[3881]=hTile[201]; hChip[3882]=hTile[202]; hChip[3883]=hTile[203];
			vChip[840]=vTile[200]; vChip[841]=vTile[201]; vChip[842]=vTile[202]; vChip[843]=vTile[203];
			aChip[808]=aTile[200]; aChip[809]=aTile[201]; aChip[810]=aTile[202]; aChip[811]=aTile[203];

			nChip[3916]=nTile[204]; nChip[3917]=nTile[205]; nChip[3918]=nTile[206]; nChip[3919]=nTile[207];
			hChip[3884]=hTile[204]; hChip[3885]=hTile[205]; hChip[3886]=hTile[206]; hChip[3887]=hTile[207];
			vChip[844]=vTile[204]; vChip[845]=vTile[205]; vChip[846]=vTile[206]; vChip[847]=vTile[207];
			aChip[812]=aTile[204]; aChip[813]=aTile[205]; aChip[814]=aTile[206]; aChip[815]=aTile[207];

			nChip[3920]=nTile[208]; nChip[3921]=nTile[209]; nChip[3922]=nTile[210]; nChip[3923]=nTile[211];
			hChip[3888]=hTile[208]; hChip[3889]=hTile[209]; hChip[3890]=hTile[210]; hChip[3891]=hTile[211];
			vChip[848]=vTile[208]; vChip[849]=vTile[209]; vChip[850]=vTile[210]; vChip[851]=vTile[211];
			aChip[816]=aTile[208]; aChip[817]=aTile[209]; aChip[818]=aTile[210]; aChip[819]=aTile[211];

			nChip[3924]=nTile[212]; nChip[3925]=nTile[213]; nChip[3926]=nTile[214]; nChip[3927]=nTile[215];
			hChip[3892]=hTile[212]; hChip[3893]=hTile[213]; hChip[3894]=hTile[214]; hChip[3895]=hTile[215];
			vChip[852]=vTile[212]; vChip[853]=vTile[213]; vChip[854]=vTile[214]; vChip[855]=vTile[215];
			aChip[820]=aTile[212]; aChip[821]=aTile[213]; aChip[822]=aTile[214]; aChip[823]=aTile[215];

			nChip[3928]=nTile[216]; nChip[3929]=nTile[217]; nChip[3930]=nTile[218]; nChip[3931]=nTile[219];
			hChip[3896]=hTile[216]; hChip[3897]=hTile[217]; hChip[3898]=hTile[218]; hChip[3899]=hTile[219];
			vChip[856]=vTile[216]; vChip[857]=vTile[217]; vChip[858]=vTile[218]; vChip[859]=vTile[219];
			aChip[824]=aTile[216]; aChip[825]=aTile[217]; aChip[826]=aTile[218]; aChip[827]=aTile[219];

			nChip[3932]=nTile[220]; nChip[3933]=nTile[221]; nChip[3934]=nTile[222]; nChip[3935]=nTile[223];
			hChip[3900]=hTile[220]; hChip[3901]=hTile[221]; hChip[3902]=hTile[222]; hChip[3903]=hTile[223];
			vChip[860]=vTile[220]; vChip[861]=vTile[221]; vChip[862]=vTile[222]; vChip[863]=vTile[223];
			aChip[828]=aTile[220]; aChip[829]=aTile[221]; aChip[830]=aTile[222]; aChip[831]=aTile[223];

			nChip[4032]=nTile[224]; nChip[4033]=nTile[225]; nChip[4034]=nTile[226]; nChip[4035]=nTile[227];
			hChip[4000]=hTile[224]; hChip[4001]=hTile[225]; hChip[4002]=hTile[226]; hChip[4003]=hTile[227];
			vChip[960]=vTile[224]; vChip[961]=vTile[225]; vChip[962]=vTile[226]; vChip[963]=vTile[227];
			aChip[928]=aTile[224]; aChip[929]=aTile[225]; aChip[930]=aTile[226]; aChip[931]=aTile[227];

			nChip[4036]=nTile[228]; nChip[4037]=nTile[229]; nChip[4038]=nTile[230]; nChip[4039]=nTile[231];
			hChip[4004]=hTile[228]; hChip[4005]=hTile[229]; hChip[4006]=hTile[230]; hChip[4007]=hTile[231];
			vChip[964]=vTile[228]; vChip[965]=vTile[229]; vChip[966]=vTile[230]; vChip[967]=vTile[231];
			aChip[932]=aTile[228]; aChip[933]=aTile[229]; aChip[934]=aTile[230]; aChip[935]=aTile[231];

			nChip[4040]=nTile[232]; nChip[4041]=nTile[233]; nChip[4042]=nTile[234]; nChip[4043]=nTile[235];
			hChip[4008]=hTile[232]; hChip[4009]=hTile[233]; hChip[4010]=hTile[234]; hChip[4011]=hTile[235];
			vChip[968]=vTile[232]; vChip[969]=vTile[233]; vChip[970]=vTile[234]; vChip[971]=vTile[235];
			aChip[936]=aTile[232]; aChip[937]=aTile[233]; aChip[938]=aTile[234]; aChip[939]=aTile[235];

			nChip[4044]=nTile[236]; nChip[4045]=nTile[237]; nChip[4046]=nTile[238]; nChip[4047]=nTile[239];
			hChip[4012]=hTile[236]; hChip[4013]=hTile[237]; hChip[4014]=hTile[238]; hChip[4015]=hTile[239];
			vChip[972]=vTile[236]; vChip[973]=vTile[237]; vChip[974]=vTile[238]; vChip[975]=vTile[239];
			aChip[940]=aTile[236]; aChip[941]=aTile[237]; aChip[942]=aTile[238]; aChip[943]=aTile[239];

			nChip[4048]=nTile[240]; nChip[4049]=nTile[241]; nChip[4050]=nTile[242]; nChip[4051]=nTile[243];
			hChip[4016]=hTile[240]; hChip[4017]=hTile[241]; hChip[4018]=hTile[242]; hChip[4019]=hTile[243];
			vChip[976]=vTile[240]; vChip[977]=vTile[241]; vChip[978]=vTile[242]; vChip[979]=vTile[243];
			aChip[944]=aTile[240]; aChip[945]=aTile[241]; aChip[946]=aTile[242]; aChip[947]=aTile[243];

			nChip[4052]=nTile[244]; nChip[4053]=nTile[245]; nChip[4054]=nTile[246]; nChip[4055]=nTile[247];
			hChip[4020]=hTile[244]; hChip[4021]=hTile[245]; hChip[4022]=hTile[246]; hChip[4023]=hTile[247];
			vChip[980]=vTile[244]; vChip[981]=vTile[245]; vChip[982]=vTile[246]; vChip[983]=vTile[247];
			aChip[948]=aTile[244]; aChip[949]=aTile[245]; aChip[950]=aTile[246]; aChip[951]=aTile[247];

			nChip[4056]=nTile[248]; nChip[4057]=nTile[249]; nChip[4058]=nTile[250]; nChip[4059]=nTile[251];
			hChip[4024]=hTile[248]; hChip[4025]=hTile[249]; hChip[4026]=hTile[250]; hChip[4027]=hTile[251];
			vChip[984]=vTile[248]; vChip[985]=vTile[249]; vChip[986]=vTile[250]; vChip[987]=vTile[251];
			aChip[952]=aTile[248]; aChip[953]=aTile[249]; aChip[954]=aTile[250]; aChip[955]=aTile[251];

			nChip[4060]=nTile[252]; nChip[4061]=nTile[253]; nChip[4062]=nTile[254]; nChip[4063]=nTile[255];
			hChip[4028]=hTile[252]; hChip[4029]=hTile[253]; hChip[4030]=hTile[254]; hChip[4031]=hTile[255];
			vChip[988]=vTile[252]; vChip[989]=vTile[253]; vChip[990]=vTile[254]; vChip[991]=vTile[255];
			aChip[956]=aTile[252]; aChip[957]=aTile[253]; aChip[958]=aTile[254]; aChip[959]=aTile[255];

			A = d[cOfst+30]; B = d[cOfst+31];
			t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);
			if(!tileCache[t][p]) make_tileFlipCache();
			flipTile = tileCache[t][p];
			nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;

			nChip[3168]=nTile[0]; nChip[3169]=nTile[1]; nChip[3170]=nTile[2]; nChip[3171]=nTile[3];
			hChip[3072]=hTile[0]; hChip[3073]=hTile[1]; hChip[3074]=hTile[2]; hChip[3075]=hTile[3];
			vChip[96]=vTile[0]; vChip[97]=vTile[1]; vChip[98]=vTile[2]; vChip[99]=vTile[3];
			aChip[0]=aTile[0]; aChip[1]=aTile[1]; aChip[2]=aTile[2]; aChip[3]=aTile[3];

			nChip[3172]=nTile[4]; nChip[3173]=nTile[5]; nChip[3174]=nTile[6]; nChip[3175]=nTile[7];
			hChip[3076]=hTile[4]; hChip[3077]=hTile[5]; hChip[3078]=hTile[6]; hChip[3079]=hTile[7];
			vChip[100]=vTile[4]; vChip[101]=vTile[5]; vChip[102]=vTile[6]; vChip[103]=vTile[7];
			aChip[4]=aTile[4]; aChip[5]=aTile[5]; aChip[6]=aTile[6]; aChip[7]=aTile[7];

			nChip[3176]=nTile[8]; nChip[3177]=nTile[9]; nChip[3178]=nTile[10]; nChip[3179]=nTile[11];
			hChip[3080]=hTile[8]; hChip[3081]=hTile[9]; hChip[3082]=hTile[10]; hChip[3083]=hTile[11];
			vChip[104]=vTile[8]; vChip[105]=vTile[9]; vChip[106]=vTile[10]; vChip[107]=vTile[11];
			aChip[8]=aTile[8]; aChip[9]=aTile[9]; aChip[10]=aTile[10]; aChip[11]=aTile[11];

			nChip[3180]=nTile[12]; nChip[3181]=nTile[13]; nChip[3182]=nTile[14]; nChip[3183]=nTile[15];
			hChip[3084]=hTile[12]; hChip[3085]=hTile[13]; hChip[3086]=hTile[14]; hChip[3087]=hTile[15];
			vChip[108]=vTile[12]; vChip[109]=vTile[13]; vChip[110]=vTile[14]; vChip[111]=vTile[15];
			aChip[12]=aTile[12]; aChip[13]=aTile[13]; aChip[14]=aTile[14]; aChip[15]=aTile[15];

			nChip[3184]=nTile[16]; nChip[3185]=nTile[17]; nChip[3186]=nTile[18]; nChip[3187]=nTile[19];
			hChip[3088]=hTile[16]; hChip[3089]=hTile[17]; hChip[3090]=hTile[18]; hChip[3091]=hTile[19];
			vChip[112]=vTile[16]; vChip[113]=vTile[17]; vChip[114]=vTile[18]; vChip[115]=vTile[19];
			aChip[16]=aTile[16]; aChip[17]=aTile[17]; aChip[18]=aTile[18]; aChip[19]=aTile[19];

			nChip[3188]=nTile[20]; nChip[3189]=nTile[21]; nChip[3190]=nTile[22]; nChip[3191]=nTile[23];
			hChip[3092]=hTile[20]; hChip[3093]=hTile[21]; hChip[3094]=hTile[22]; hChip[3095]=hTile[23];
			vChip[116]=vTile[20]; vChip[117]=vTile[21]; vChip[118]=vTile[22]; vChip[119]=vTile[23];
			aChip[20]=aTile[20]; aChip[21]=aTile[21]; aChip[22]=aTile[22]; aChip[23]=aTile[23];

			nChip[3192]=nTile[24]; nChip[3193]=nTile[25]; nChip[3194]=nTile[26]; nChip[3195]=nTile[27];
			hChip[3096]=hTile[24]; hChip[3097]=hTile[25]; hChip[3098]=hTile[26]; hChip[3099]=hTile[27];
			vChip[120]=vTile[24]; vChip[121]=vTile[25]; vChip[122]=vTile[26]; vChip[123]=vTile[27];
			aChip[24]=aTile[24]; aChip[25]=aTile[25]; aChip[26]=aTile[26]; aChip[27]=aTile[27];

			nChip[3196]=nTile[28]; nChip[3197]=nTile[29]; nChip[3198]=nTile[30]; nChip[3199]=nTile[31];
			hChip[3100]=hTile[28]; hChip[3101]=hTile[29]; hChip[3102]=hTile[30]; hChip[3103]=hTile[31];
			vChip[124]=vTile[28]; vChip[125]=vTile[29]; vChip[126]=vTile[30]; vChip[127]=vTile[31];
			aChip[28]=aTile[28]; aChip[29]=aTile[29]; aChip[30]=aTile[30]; aChip[31]=aTile[31];

			nChip[3296]=nTile[32]; nChip[3297]=nTile[33]; nChip[3298]=nTile[34]; nChip[3299]=nTile[35];
			hChip[3200]=hTile[32]; hChip[3201]=hTile[33]; hChip[3202]=hTile[34]; hChip[3203]=hTile[35];
			vChip[224]=vTile[32]; vChip[225]=vTile[33]; vChip[226]=vTile[34]; vChip[227]=vTile[35];
			aChip[128]=aTile[32]; aChip[129]=aTile[33]; aChip[130]=aTile[34]; aChip[131]=aTile[35];

			nChip[3300]=nTile[36]; nChip[3301]=nTile[37]; nChip[3302]=nTile[38]; nChip[3303]=nTile[39];
			hChip[3204]=hTile[36]; hChip[3205]=hTile[37]; hChip[3206]=hTile[38]; hChip[3207]=hTile[39];
			vChip[228]=vTile[36]; vChip[229]=vTile[37]; vChip[230]=vTile[38]; vChip[231]=vTile[39];
			aChip[132]=aTile[36]; aChip[133]=aTile[37]; aChip[134]=aTile[38]; aChip[135]=aTile[39];

			nChip[3304]=nTile[40]; nChip[3305]=nTile[41]; nChip[3306]=nTile[42]; nChip[3307]=nTile[43];
			hChip[3208]=hTile[40]; hChip[3209]=hTile[41]; hChip[3210]=hTile[42]; hChip[3211]=hTile[43];
			vChip[232]=vTile[40]; vChip[233]=vTile[41]; vChip[234]=vTile[42]; vChip[235]=vTile[43];
			aChip[136]=aTile[40]; aChip[137]=aTile[41]; aChip[138]=aTile[42]; aChip[139]=aTile[43];

			nChip[3308]=nTile[44]; nChip[3309]=nTile[45]; nChip[3310]=nTile[46]; nChip[3311]=nTile[47];
			hChip[3212]=hTile[44]; hChip[3213]=hTile[45]; hChip[3214]=hTile[46]; hChip[3215]=hTile[47];
			vChip[236]=vTile[44]; vChip[237]=vTile[45]; vChip[238]=vTile[46]; vChip[239]=vTile[47];
			aChip[140]=aTile[44]; aChip[141]=aTile[45]; aChip[142]=aTile[46]; aChip[143]=aTile[47];

			nChip[3312]=nTile[48]; nChip[3313]=nTile[49]; nChip[3314]=nTile[50]; nChip[3315]=nTile[51];
			hChip[3216]=hTile[48]; hChip[3217]=hTile[49]; hChip[3218]=hTile[50]; hChip[3219]=hTile[51];
			vChip[240]=vTile[48]; vChip[241]=vTile[49]; vChip[242]=vTile[50]; vChip[243]=vTile[51];
			aChip[144]=aTile[48]; aChip[145]=aTile[49]; aChip[146]=aTile[50]; aChip[147]=aTile[51];

			nChip[3316]=nTile[52]; nChip[3317]=nTile[53]; nChip[3318]=nTile[54]; nChip[3319]=nTile[55];
			hChip[3220]=hTile[52]; hChip[3221]=hTile[53]; hChip[3222]=hTile[54]; hChip[3223]=hTile[55];
			vChip[244]=vTile[52]; vChip[245]=vTile[53]; vChip[246]=vTile[54]; vChip[247]=vTile[55];
			aChip[148]=aTile[52]; aChip[149]=aTile[53]; aChip[150]=aTile[54]; aChip[151]=aTile[55];

			nChip[3320]=nTile[56]; nChip[3321]=nTile[57]; nChip[3322]=nTile[58]; nChip[3323]=nTile[59];
			hChip[3224]=hTile[56]; hChip[3225]=hTile[57]; hChip[3226]=hTile[58]; hChip[3227]=hTile[59];
			vChip[248]=vTile[56]; vChip[249]=vTile[57]; vChip[250]=vTile[58]; vChip[251]=vTile[59];
			aChip[152]=aTile[56]; aChip[153]=aTile[57]; aChip[154]=aTile[58]; aChip[155]=aTile[59];

			nChip[3324]=nTile[60]; nChip[3325]=nTile[61]; nChip[3326]=nTile[62]; nChip[3327]=nTile[63];
			hChip[3228]=hTile[60]; hChip[3229]=hTile[61]; hChip[3230]=hTile[62]; hChip[3231]=hTile[63];
			vChip[252]=vTile[60]; vChip[253]=vTile[61]; vChip[254]=vTile[62]; vChip[255]=vTile[63];
			aChip[156]=aTile[60]; aChip[157]=aTile[61]; aChip[158]=aTile[62]; aChip[159]=aTile[63];

			nChip[3424]=nTile[64]; nChip[3425]=nTile[65]; nChip[3426]=nTile[66]; nChip[3427]=nTile[67];
			hChip[3328]=hTile[64]; hChip[3329]=hTile[65]; hChip[3330]=hTile[66]; hChip[3331]=hTile[67];
			vChip[352]=vTile[64]; vChip[353]=vTile[65]; vChip[354]=vTile[66]; vChip[355]=vTile[67];
			aChip[256]=aTile[64]; aChip[257]=aTile[65]; aChip[258]=aTile[66]; aChip[259]=aTile[67];

			nChip[3428]=nTile[68]; nChip[3429]=nTile[69]; nChip[3430]=nTile[70]; nChip[3431]=nTile[71];
			hChip[3332]=hTile[68]; hChip[3333]=hTile[69]; hChip[3334]=hTile[70]; hChip[3335]=hTile[71];
			vChip[356]=vTile[68]; vChip[357]=vTile[69]; vChip[358]=vTile[70]; vChip[359]=vTile[71];
			aChip[260]=aTile[68]; aChip[261]=aTile[69]; aChip[262]=aTile[70]; aChip[263]=aTile[71];

			nChip[3432]=nTile[72]; nChip[3433]=nTile[73]; nChip[3434]=nTile[74]; nChip[3435]=nTile[75];
			hChip[3336]=hTile[72]; hChip[3337]=hTile[73]; hChip[3338]=hTile[74]; hChip[3339]=hTile[75];
			vChip[360]=vTile[72]; vChip[361]=vTile[73]; vChip[362]=vTile[74]; vChip[363]=vTile[75];
			aChip[264]=aTile[72]; aChip[265]=aTile[73]; aChip[266]=aTile[74]; aChip[267]=aTile[75];

			nChip[3436]=nTile[76]; nChip[3437]=nTile[77]; nChip[3438]=nTile[78]; nChip[3439]=nTile[79];
			hChip[3340]=hTile[76]; hChip[3341]=hTile[77]; hChip[3342]=hTile[78]; hChip[3343]=hTile[79];
			vChip[364]=vTile[76]; vChip[365]=vTile[77]; vChip[366]=vTile[78]; vChip[367]=vTile[79];
			aChip[268]=aTile[76]; aChip[269]=aTile[77]; aChip[270]=aTile[78]; aChip[271]=aTile[79];

			nChip[3440]=nTile[80]; nChip[3441]=nTile[81]; nChip[3442]=nTile[82]; nChip[3443]=nTile[83];
			hChip[3344]=hTile[80]; hChip[3345]=hTile[81]; hChip[3346]=hTile[82]; hChip[3347]=hTile[83];
			vChip[368]=vTile[80]; vChip[369]=vTile[81]; vChip[370]=vTile[82]; vChip[371]=vTile[83];
			aChip[272]=aTile[80]; aChip[273]=aTile[81]; aChip[274]=aTile[82]; aChip[275]=aTile[83];

			nChip[3444]=nTile[84]; nChip[3445]=nTile[85]; nChip[3446]=nTile[86]; nChip[3447]=nTile[87];
			hChip[3348]=hTile[84]; hChip[3349]=hTile[85]; hChip[3350]=hTile[86]; hChip[3351]=hTile[87];
			vChip[372]=vTile[84]; vChip[373]=vTile[85]; vChip[374]=vTile[86]; vChip[375]=vTile[87];
			aChip[276]=aTile[84]; aChip[277]=aTile[85]; aChip[278]=aTile[86]; aChip[279]=aTile[87];

			nChip[3448]=nTile[88]; nChip[3449]=nTile[89]; nChip[3450]=nTile[90]; nChip[3451]=nTile[91];
			hChip[3352]=hTile[88]; hChip[3353]=hTile[89]; hChip[3354]=hTile[90]; hChip[3355]=hTile[91];
			vChip[376]=vTile[88]; vChip[377]=vTile[89]; vChip[378]=vTile[90]; vChip[379]=vTile[91];
			aChip[280]=aTile[88]; aChip[281]=aTile[89]; aChip[282]=aTile[90]; aChip[283]=aTile[91];

			nChip[3452]=nTile[92]; nChip[3453]=nTile[93]; nChip[3454]=nTile[94]; nChip[3455]=nTile[95];
			hChip[3356]=hTile[92]; hChip[3357]=hTile[93]; hChip[3358]=hTile[94]; hChip[3359]=hTile[95];
			vChip[380]=vTile[92]; vChip[381]=vTile[93]; vChip[382]=vTile[94]; vChip[383]=vTile[95];
			aChip[284]=aTile[92]; aChip[285]=aTile[93]; aChip[286]=aTile[94]; aChip[287]=aTile[95];

			nChip[3552]=nTile[96]; nChip[3553]=nTile[97]; nChip[3554]=nTile[98]; nChip[3555]=nTile[99];
			hChip[3456]=hTile[96]; hChip[3457]=hTile[97]; hChip[3458]=hTile[98]; hChip[3459]=hTile[99];
			vChip[480]=vTile[96]; vChip[481]=vTile[97]; vChip[482]=vTile[98]; vChip[483]=vTile[99];
			aChip[384]=aTile[96]; aChip[385]=aTile[97]; aChip[386]=aTile[98]; aChip[387]=aTile[99];

			nChip[3556]=nTile[100]; nChip[3557]=nTile[101]; nChip[3558]=nTile[102]; nChip[3559]=nTile[103];
			hChip[3460]=hTile[100]; hChip[3461]=hTile[101]; hChip[3462]=hTile[102]; hChip[3463]=hTile[103];
			vChip[484]=vTile[100]; vChip[485]=vTile[101]; vChip[486]=vTile[102]; vChip[487]=vTile[103];
			aChip[388]=aTile[100]; aChip[389]=aTile[101]; aChip[390]=aTile[102]; aChip[391]=aTile[103];

			nChip[3560]=nTile[104]; nChip[3561]=nTile[105]; nChip[3562]=nTile[106]; nChip[3563]=nTile[107];
			hChip[3464]=hTile[104]; hChip[3465]=hTile[105]; hChip[3466]=hTile[106]; hChip[3467]=hTile[107];
			vChip[488]=vTile[104]; vChip[489]=vTile[105]; vChip[490]=vTile[106]; vChip[491]=vTile[107];
			aChip[392]=aTile[104]; aChip[393]=aTile[105]; aChip[394]=aTile[106]; aChip[395]=aTile[107];

			nChip[3564]=nTile[108]; nChip[3565]=nTile[109]; nChip[3566]=nTile[110]; nChip[3567]=nTile[111];
			hChip[3468]=hTile[108]; hChip[3469]=hTile[109]; hChip[3470]=hTile[110]; hChip[3471]=hTile[111];
			vChip[492]=vTile[108]; vChip[493]=vTile[109]; vChip[494]=vTile[110]; vChip[495]=vTile[111];
			aChip[396]=aTile[108]; aChip[397]=aTile[109]; aChip[398]=aTile[110]; aChip[399]=aTile[111];

			nChip[3568]=nTile[112]; nChip[3569]=nTile[113]; nChip[3570]=nTile[114]; nChip[3571]=nTile[115];
			hChip[3472]=hTile[112]; hChip[3473]=hTile[113]; hChip[3474]=hTile[114]; hChip[3475]=hTile[115];
			vChip[496]=vTile[112]; vChip[497]=vTile[113]; vChip[498]=vTile[114]; vChip[499]=vTile[115];
			aChip[400]=aTile[112]; aChip[401]=aTile[113]; aChip[402]=aTile[114]; aChip[403]=aTile[115];

			nChip[3572]=nTile[116]; nChip[3573]=nTile[117]; nChip[3574]=nTile[118]; nChip[3575]=nTile[119];
			hChip[3476]=hTile[116]; hChip[3477]=hTile[117]; hChip[3478]=hTile[118]; hChip[3479]=hTile[119];
			vChip[500]=vTile[116]; vChip[501]=vTile[117]; vChip[502]=vTile[118]; vChip[503]=vTile[119];
			aChip[404]=aTile[116]; aChip[405]=aTile[117]; aChip[406]=aTile[118]; aChip[407]=aTile[119];

			nChip[3576]=nTile[120]; nChip[3577]=nTile[121]; nChip[3578]=nTile[122]; nChip[3579]=nTile[123];
			hChip[3480]=hTile[120]; hChip[3481]=hTile[121]; hChip[3482]=hTile[122]; hChip[3483]=hTile[123];
			vChip[504]=vTile[120]; vChip[505]=vTile[121]; vChip[506]=vTile[122]; vChip[507]=vTile[123];
			aChip[408]=aTile[120]; aChip[409]=aTile[121]; aChip[410]=aTile[122]; aChip[411]=aTile[123];

			nChip[3580]=nTile[124]; nChip[3581]=nTile[125]; nChip[3582]=nTile[126]; nChip[3583]=nTile[127];
			hChip[3484]=hTile[124]; hChip[3485]=hTile[125]; hChip[3486]=hTile[126]; hChip[3487]=hTile[127];
			vChip[508]=vTile[124]; vChip[509]=vTile[125]; vChip[510]=vTile[126]; vChip[511]=vTile[127];
			aChip[412]=aTile[124]; aChip[413]=aTile[125]; aChip[414]=aTile[126]; aChip[415]=aTile[127];

			nChip[3680]=nTile[128]; nChip[3681]=nTile[129]; nChip[3682]=nTile[130]; nChip[3683]=nTile[131];
			hChip[3584]=hTile[128]; hChip[3585]=hTile[129]; hChip[3586]=hTile[130]; hChip[3587]=hTile[131];
			vChip[608]=vTile[128]; vChip[609]=vTile[129]; vChip[610]=vTile[130]; vChip[611]=vTile[131];
			aChip[512]=aTile[128]; aChip[513]=aTile[129]; aChip[514]=aTile[130]; aChip[515]=aTile[131];

			nChip[3684]=nTile[132]; nChip[3685]=nTile[133]; nChip[3686]=nTile[134]; nChip[3687]=nTile[135];
			hChip[3588]=hTile[132]; hChip[3589]=hTile[133]; hChip[3590]=hTile[134]; hChip[3591]=hTile[135];
			vChip[612]=vTile[132]; vChip[613]=vTile[133]; vChip[614]=vTile[134]; vChip[615]=vTile[135];
			aChip[516]=aTile[132]; aChip[517]=aTile[133]; aChip[518]=aTile[134]; aChip[519]=aTile[135];

			nChip[3688]=nTile[136]; nChip[3689]=nTile[137]; nChip[3690]=nTile[138]; nChip[3691]=nTile[139];
			hChip[3592]=hTile[136]; hChip[3593]=hTile[137]; hChip[3594]=hTile[138]; hChip[3595]=hTile[139];
			vChip[616]=vTile[136]; vChip[617]=vTile[137]; vChip[618]=vTile[138]; vChip[619]=vTile[139];
			aChip[520]=aTile[136]; aChip[521]=aTile[137]; aChip[522]=aTile[138]; aChip[523]=aTile[139];

			nChip[3692]=nTile[140]; nChip[3693]=nTile[141]; nChip[3694]=nTile[142]; nChip[3695]=nTile[143];
			hChip[3596]=hTile[140]; hChip[3597]=hTile[141]; hChip[3598]=hTile[142]; hChip[3599]=hTile[143];
			vChip[620]=vTile[140]; vChip[621]=vTile[141]; vChip[622]=vTile[142]; vChip[623]=vTile[143];
			aChip[524]=aTile[140]; aChip[525]=aTile[141]; aChip[526]=aTile[142]; aChip[527]=aTile[143];

			nChip[3696]=nTile[144]; nChip[3697]=nTile[145]; nChip[3698]=nTile[146]; nChip[3699]=nTile[147];
			hChip[3600]=hTile[144]; hChip[3601]=hTile[145]; hChip[3602]=hTile[146]; hChip[3603]=hTile[147];
			vChip[624]=vTile[144]; vChip[625]=vTile[145]; vChip[626]=vTile[146]; vChip[627]=vTile[147];
			aChip[528]=aTile[144]; aChip[529]=aTile[145]; aChip[530]=aTile[146]; aChip[531]=aTile[147];

			nChip[3700]=nTile[148]; nChip[3701]=nTile[149]; nChip[3702]=nTile[150]; nChip[3703]=nTile[151];
			hChip[3604]=hTile[148]; hChip[3605]=hTile[149]; hChip[3606]=hTile[150]; hChip[3607]=hTile[151];
			vChip[628]=vTile[148]; vChip[629]=vTile[149]; vChip[630]=vTile[150]; vChip[631]=vTile[151];
			aChip[532]=aTile[148]; aChip[533]=aTile[149]; aChip[534]=aTile[150]; aChip[535]=aTile[151];

			nChip[3704]=nTile[152]; nChip[3705]=nTile[153]; nChip[3706]=nTile[154]; nChip[3707]=nTile[155];
			hChip[3608]=hTile[152]; hChip[3609]=hTile[153]; hChip[3610]=hTile[154]; hChip[3611]=hTile[155];
			vChip[632]=vTile[152]; vChip[633]=vTile[153]; vChip[634]=vTile[154]; vChip[635]=vTile[155];
			aChip[536]=aTile[152]; aChip[537]=aTile[153]; aChip[538]=aTile[154]; aChip[539]=aTile[155];

			nChip[3708]=nTile[156]; nChip[3709]=nTile[157]; nChip[3710]=nTile[158]; nChip[3711]=nTile[159];
			hChip[3612]=hTile[156]; hChip[3613]=hTile[157]; hChip[3614]=hTile[158]; hChip[3615]=hTile[159];
			vChip[636]=vTile[156]; vChip[637]=vTile[157]; vChip[638]=vTile[158]; vChip[639]=vTile[159];
			aChip[540]=aTile[156]; aChip[541]=aTile[157]; aChip[542]=aTile[158]; aChip[543]=aTile[159];

			nChip[3808]=nTile[160]; nChip[3809]=nTile[161]; nChip[3810]=nTile[162]; nChip[3811]=nTile[163];
			hChip[3712]=hTile[160]; hChip[3713]=hTile[161]; hChip[3714]=hTile[162]; hChip[3715]=hTile[163];
			vChip[736]=vTile[160]; vChip[737]=vTile[161]; vChip[738]=vTile[162]; vChip[739]=vTile[163];
			aChip[640]=aTile[160]; aChip[641]=aTile[161]; aChip[642]=aTile[162]; aChip[643]=aTile[163];

			nChip[3812]=nTile[164]; nChip[3813]=nTile[165]; nChip[3814]=nTile[166]; nChip[3815]=nTile[167];
			hChip[3716]=hTile[164]; hChip[3717]=hTile[165]; hChip[3718]=hTile[166]; hChip[3719]=hTile[167];
			vChip[740]=vTile[164]; vChip[741]=vTile[165]; vChip[742]=vTile[166]; vChip[743]=vTile[167];
			aChip[644]=aTile[164]; aChip[645]=aTile[165]; aChip[646]=aTile[166]; aChip[647]=aTile[167];

			nChip[3816]=nTile[168]; nChip[3817]=nTile[169]; nChip[3818]=nTile[170]; nChip[3819]=nTile[171];
			hChip[3720]=hTile[168]; hChip[3721]=hTile[169]; hChip[3722]=hTile[170]; hChip[3723]=hTile[171];
			vChip[744]=vTile[168]; vChip[745]=vTile[169]; vChip[746]=vTile[170]; vChip[747]=vTile[171];
			aChip[648]=aTile[168]; aChip[649]=aTile[169]; aChip[650]=aTile[170]; aChip[651]=aTile[171];

			nChip[3820]=nTile[172]; nChip[3821]=nTile[173]; nChip[3822]=nTile[174]; nChip[3823]=nTile[175];
			hChip[3724]=hTile[172]; hChip[3725]=hTile[173]; hChip[3726]=hTile[174]; hChip[3727]=hTile[175];
			vChip[748]=vTile[172]; vChip[749]=vTile[173]; vChip[750]=vTile[174]; vChip[751]=vTile[175];
			aChip[652]=aTile[172]; aChip[653]=aTile[173]; aChip[654]=aTile[174]; aChip[655]=aTile[175];

			nChip[3824]=nTile[176]; nChip[3825]=nTile[177]; nChip[3826]=nTile[178]; nChip[3827]=nTile[179];
			hChip[3728]=hTile[176]; hChip[3729]=hTile[177]; hChip[3730]=hTile[178]; hChip[3731]=hTile[179];
			vChip[752]=vTile[176]; vChip[753]=vTile[177]; vChip[754]=vTile[178]; vChip[755]=vTile[179];
			aChip[656]=aTile[176]; aChip[657]=aTile[177]; aChip[658]=aTile[178]; aChip[659]=aTile[179];

			nChip[3828]=nTile[180]; nChip[3829]=nTile[181]; nChip[3830]=nTile[182]; nChip[3831]=nTile[183];
			hChip[3732]=hTile[180]; hChip[3733]=hTile[181]; hChip[3734]=hTile[182]; hChip[3735]=hTile[183];
			vChip[756]=vTile[180]; vChip[757]=vTile[181]; vChip[758]=vTile[182]; vChip[759]=vTile[183];
			aChip[660]=aTile[180]; aChip[661]=aTile[181]; aChip[662]=aTile[182]; aChip[663]=aTile[183];

			nChip[3832]=nTile[184]; nChip[3833]=nTile[185]; nChip[3834]=nTile[186]; nChip[3835]=nTile[187];
			hChip[3736]=hTile[184]; hChip[3737]=hTile[185]; hChip[3738]=hTile[186]; hChip[3739]=hTile[187];
			vChip[760]=vTile[184]; vChip[761]=vTile[185]; vChip[762]=vTile[186]; vChip[763]=vTile[187];
			aChip[664]=aTile[184]; aChip[665]=aTile[185]; aChip[666]=aTile[186]; aChip[667]=aTile[187];

			nChip[3836]=nTile[188]; nChip[3837]=nTile[189]; nChip[3838]=nTile[190]; nChip[3839]=nTile[191];
			hChip[3740]=hTile[188]; hChip[3741]=hTile[189]; hChip[3742]=hTile[190]; hChip[3743]=hTile[191];
			vChip[764]=vTile[188]; vChip[765]=vTile[189]; vChip[766]=vTile[190]; vChip[767]=vTile[191];
			aChip[668]=aTile[188]; aChip[669]=aTile[189]; aChip[670]=aTile[190]; aChip[671]=aTile[191];

			nChip[3936]=nTile[192]; nChip[3937]=nTile[193]; nChip[3938]=nTile[194]; nChip[3939]=nTile[195];
			hChip[3840]=hTile[192]; hChip[3841]=hTile[193]; hChip[3842]=hTile[194]; hChip[3843]=hTile[195];
			vChip[864]=vTile[192]; vChip[865]=vTile[193]; vChip[866]=vTile[194]; vChip[867]=vTile[195];
			aChip[768]=aTile[192]; aChip[769]=aTile[193]; aChip[770]=aTile[194]; aChip[771]=aTile[195];

			nChip[3940]=nTile[196]; nChip[3941]=nTile[197]; nChip[3942]=nTile[198]; nChip[3943]=nTile[199];
			hChip[3844]=hTile[196]; hChip[3845]=hTile[197]; hChip[3846]=hTile[198]; hChip[3847]=hTile[199];
			vChip[868]=vTile[196]; vChip[869]=vTile[197]; vChip[870]=vTile[198]; vChip[871]=vTile[199];
			aChip[772]=aTile[196]; aChip[773]=aTile[197]; aChip[774]=aTile[198]; aChip[775]=aTile[199];

			nChip[3944]=nTile[200]; nChip[3945]=nTile[201]; nChip[3946]=nTile[202]; nChip[3947]=nTile[203];
			hChip[3848]=hTile[200]; hChip[3849]=hTile[201]; hChip[3850]=hTile[202]; hChip[3851]=hTile[203];
			vChip[872]=vTile[200]; vChip[873]=vTile[201]; vChip[874]=vTile[202]; vChip[875]=vTile[203];
			aChip[776]=aTile[200]; aChip[777]=aTile[201]; aChip[778]=aTile[202]; aChip[779]=aTile[203];

			nChip[3948]=nTile[204]; nChip[3949]=nTile[205]; nChip[3950]=nTile[206]; nChip[3951]=nTile[207];
			hChip[3852]=hTile[204]; hChip[3853]=hTile[205]; hChip[3854]=hTile[206]; hChip[3855]=hTile[207];
			vChip[876]=vTile[204]; vChip[877]=vTile[205]; vChip[878]=vTile[206]; vChip[879]=vTile[207];
			aChip[780]=aTile[204]; aChip[781]=aTile[205]; aChip[782]=aTile[206]; aChip[783]=aTile[207];

			nChip[3952]=nTile[208]; nChip[3953]=nTile[209]; nChip[3954]=nTile[210]; nChip[3955]=nTile[211];
			hChip[3856]=hTile[208]; hChip[3857]=hTile[209]; hChip[3858]=hTile[210]; hChip[3859]=hTile[211];
			vChip[880]=vTile[208]; vChip[881]=vTile[209]; vChip[882]=vTile[210]; vChip[883]=vTile[211];
			aChip[784]=aTile[208]; aChip[785]=aTile[209]; aChip[786]=aTile[210]; aChip[787]=aTile[211];

			nChip[3956]=nTile[212]; nChip[3957]=nTile[213]; nChip[3958]=nTile[214]; nChip[3959]=nTile[215];
			hChip[3860]=hTile[212]; hChip[3861]=hTile[213]; hChip[3862]=hTile[214]; hChip[3863]=hTile[215];
			vChip[884]=vTile[212]; vChip[885]=vTile[213]; vChip[886]=vTile[214]; vChip[887]=vTile[215];
			aChip[788]=aTile[212]; aChip[789]=aTile[213]; aChip[790]=aTile[214]; aChip[791]=aTile[215];

			nChip[3960]=nTile[216]; nChip[3961]=nTile[217]; nChip[3962]=nTile[218]; nChip[3963]=nTile[219];
			hChip[3864]=hTile[216]; hChip[3865]=hTile[217]; hChip[3866]=hTile[218]; hChip[3867]=hTile[219];
			vChip[888]=vTile[216]; vChip[889]=vTile[217]; vChip[890]=vTile[218]; vChip[891]=vTile[219];
			aChip[792]=aTile[216]; aChip[793]=aTile[217]; aChip[794]=aTile[218]; aChip[795]=aTile[219];

			nChip[3964]=nTile[220]; nChip[3965]=nTile[221]; nChip[3966]=nTile[222]; nChip[3967]=nTile[223];
			hChip[3868]=hTile[220]; hChip[3869]=hTile[221]; hChip[3870]=hTile[222]; hChip[3871]=hTile[223];
			vChip[892]=vTile[220]; vChip[893]=vTile[221]; vChip[894]=vTile[222]; vChip[895]=vTile[223];
			aChip[796]=aTile[220]; aChip[797]=aTile[221]; aChip[798]=aTile[222]; aChip[799]=aTile[223];

			nChip[4064]=nTile[224]; nChip[4065]=nTile[225]; nChip[4066]=nTile[226]; nChip[4067]=nTile[227];
			hChip[3968]=hTile[224]; hChip[3969]=hTile[225]; hChip[3970]=hTile[226]; hChip[3971]=hTile[227];
			vChip[992]=vTile[224]; vChip[993]=vTile[225]; vChip[994]=vTile[226]; vChip[995]=vTile[227];
			aChip[896]=aTile[224]; aChip[897]=aTile[225]; aChip[898]=aTile[226]; aChip[899]=aTile[227];

			nChip[4068]=nTile[228]; nChip[4069]=nTile[229]; nChip[4070]=nTile[230]; nChip[4071]=nTile[231];
			hChip[3972]=hTile[228]; hChip[3973]=hTile[229]; hChip[3974]=hTile[230]; hChip[3975]=hTile[231];
			vChip[996]=vTile[228]; vChip[997]=vTile[229]; vChip[998]=vTile[230]; vChip[999]=vTile[231];
			aChip[900]=aTile[228]; aChip[901]=aTile[229]; aChip[902]=aTile[230]; aChip[903]=aTile[231];

			nChip[4072]=nTile[232]; nChip[4073]=nTile[233]; nChip[4074]=nTile[234]; nChip[4075]=nTile[235];
			hChip[3976]=hTile[232]; hChip[3977]=hTile[233]; hChip[3978]=hTile[234]; hChip[3979]=hTile[235];
			vChip[1000]=vTile[232]; vChip[1001]=vTile[233]; vChip[1002]=vTile[234]; vChip[1003]=vTile[235];
			aChip[904]=aTile[232]; aChip[905]=aTile[233]; aChip[906]=aTile[234]; aChip[907]=aTile[235];

			nChip[4076]=nTile[236]; nChip[4077]=nTile[237]; nChip[4078]=nTile[238]; nChip[4079]=nTile[239];
			hChip[3980]=hTile[236]; hChip[3981]=hTile[237]; hChip[3982]=hTile[238]; hChip[3983]=hTile[239];
			vChip[1004]=vTile[236]; vChip[1005]=vTile[237]; vChip[1006]=vTile[238]; vChip[1007]=vTile[239];
			aChip[908]=aTile[236]; aChip[909]=aTile[237]; aChip[910]=aTile[238]; aChip[911]=aTile[239];

			nChip[4080]=nTile[240]; nChip[4081]=nTile[241]; nChip[4082]=nTile[242]; nChip[4083]=nTile[243];
			hChip[3984]=hTile[240]; hChip[3985]=hTile[241]; hChip[3986]=hTile[242]; hChip[3987]=hTile[243];
			vChip[1008]=vTile[240]; vChip[1009]=vTile[241]; vChip[1010]=vTile[242]; vChip[1011]=vTile[243];
			aChip[912]=aTile[240]; aChip[913]=aTile[241]; aChip[914]=aTile[242]; aChip[915]=aTile[243];

			nChip[4084]=nTile[244]; nChip[4085]=nTile[245]; nChip[4086]=nTile[246]; nChip[4087]=nTile[247];
			hChip[3988]=hTile[244]; hChip[3989]=hTile[245]; hChip[3990]=hTile[246]; hChip[3991]=hTile[247];
			vChip[1012]=vTile[244]; vChip[1013]=vTile[245]; vChip[1014]=vTile[246]; vChip[1015]=vTile[247];
			aChip[916]=aTile[244]; aChip[917]=aTile[245]; aChip[918]=aTile[246]; aChip[919]=aTile[247];

			nChip[4088]=nTile[248]; nChip[4089]=nTile[249]; nChip[4090]=nTile[250]; nChip[4091]=nTile[251];
			hChip[3992]=hTile[248]; hChip[3993]=hTile[249]; hChip[3994]=hTile[250]; hChip[3995]=hTile[251];
			vChip[1016]=vTile[248]; vChip[1017]=vTile[249]; vChip[1018]=vTile[250]; vChip[1019]=vTile[251];
			aChip[920]=aTile[248]; aChip[921]=aTile[249]; aChip[922]=aTile[250]; aChip[923]=aTile[251];

			nChip[4092]=nTile[252]; nChip[4093]=nTile[253]; nChip[4094]=nTile[254]; nChip[4095]=nTile[255];
			hChip[3996]=hTile[252]; hChip[3997]=hTile[253]; hChip[3998]=hTile[254]; hChip[3999]=hTile[255];
			vChip[1020]=vTile[252]; vChip[1021]=vTile[253]; vChip[1022]=vTile[254]; vChip[1023]=vTile[255];
			aChip[924]=aTile[252]; aChip[925]=aTile[253]; aChip[926]=aTile[254]; aChip[927]=aTile[255];

			
			
			

			// HARD CODE
			/*
			let fragOfst = 0;

			for(let yf=0; yf<4; yf++)
			for(let xf=0; xf<4; xf++){

				let _xf = 3 - xf, _yf = 3 - yf;
				let i = 0;

				// print
				A = d[cOfst+fragOfst]; B = d[cOfst+fragOfst+1];
				t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6); // f = h + v

				if(!tileCache[t][p]) make_tileFlipCache();

				flipTile = tileCache[t][p];
				nTile=flipTile[f  ].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;
				// end print

				for(let y=0; y<8; y++)
				for(let x=0; x<8; x++){

					let xcp = (xf * 8) + x, _xcp = (_xf * 8) + x;
					let ycp = (yf * 8) + y, _ycp = (_yf * 8) + y;
					let nicp=(( ycp*32)+ xcp)*4, hicp=(( ycp*32)+_xcp)*4, vicp=((_ycp*32)+ xcp)*4, aicp=((_ycp*32)+_xcp)*4;
	
					// print
					nChip[nicp+0]=nTile[i+0]; nChip[nicp+1]=nTile[i+1]; nChip[nicp+2]=nTile[i+2]; nChip[nicp+3]=nTile[i+3];
					hChip[hicp+0]=hTile[i+0]; hChip[hicp+1]=hTile[i+1]; hChip[hicp+2]=hTile[i+2]; hChip[hicp+3]=hTile[i+3];
					vChip[vicp+0]=vTile[i+0]; vChip[vicp+1]=vTile[i+1]; vChip[vicp+2]=vTile[i+2]; vChip[vicp+3]=vTile[i+3];
					aChip[aicp+0]=aTile[i+0]; aChip[aicp+1]=aTile[i+1]; aChip[aicp+2]=aTile[i+2]; aChip[aicp+3]=aTile[i+3];
					// end print
	
					i += 4;
				}

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

				// print
				str += `A = d[cOfst+${fragOfst}]; B = d[cOfst+${fragOfst+1}];\n`;
				str += `t = ((B&0x03)<<8)+A; p = (B&0x1C)>>2; f = ((B&0x40)>>6) + ((B&0x80)>>6);\n`;

				str += `if(!tileCache[t][p]) make_tileFlipCache();\n`;

				str += `flipTile = tileCache[t][p];\n`;
				str += `nTile=flipTile[f].data; hTile=flipTile[f^1].data; vTile=flipTile[f^2].data; aTile=flipTile[f^3].data;\n`;

				str += '\n';
				// end print

				for(let y=0; y<8; y++)
				for(let x=0; x<8; x++){

					let xcp = (xf * 8) + x, _xcp = (_xf * 8) + x;
					let ycp = (yf * 8) + y, _ycp = (_yf * 8) + y;
					let nicp=(( ycp*32)+ xcp)*4, hicp=(( ycp*32)+_xcp)*4, vicp=((_ycp*32)+ xcp)*4, aicp=((_ycp*32)+_xcp)*4;
	
					// print
					str += `nChip[${nicp}]=nTile[${i}]; nChip[${nicp+1}]=nTile[${i+1}]; nChip[${nicp+2}]=nTile[${i+2}]; nChip[${nicp+3}]=nTile[${i+3}];\n`;
					str += `hChip[${hicp}]=hTile[${i}]; hChip[${hicp+1}]=hTile[${i+1}]; hChip[${hicp+2}]=hTile[${i+2}]; hChip[${hicp+3}]=hTile[${i+3}];\n`;
					str += `vChip[${vicp}]=vTile[${i}]; vChip[${vicp+1}]=vTile[${i+1}]; vChip[${vicp+2}]=vTile[${i+2}]; vChip[${vicp+3}]=vTile[${i+3}];\n`;
					str += `aChip[${aicp}]=aTile[${i}]; aChip[${aicp+1}]=aTile[${i+1}]; aChip[${aicp+2}]=aTile[${i+2}]; aChip[${aicp+3}]=aTile[${i+3}];\n`;
					str += '\n';
					// end print
	
					i += 4;
				}

				fragOfst += 2;
			}

			let div = document.createElement("div");
			div.style.position = "absolute";
			div.style.whiteSpace = "pre";
			div.style.left = 0;
			div.style.right = 0;
			document.body.appendChild(div);
			div.textContent = str;
			*/

			
		}

		return o;
	};

})();




/*

2nd loaded script
performance.now();

241.70000000298023

202.69999998807907

172

204.30000001192093

168.1000000089407

189.8999999910593

202

165.3999999910593

198.79999999701977

168.59999999403954

196.8999999910593

167.79999999701977

*/