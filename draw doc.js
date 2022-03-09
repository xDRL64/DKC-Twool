



// PALETTE

    // raw type (5 bits channel, 2 bytes color) :
    
        snespal[byte] // safe size : 256 bytes

    // formated type (8 bits channel) :

        palettes[palette][color][r,g,b] // safe size : [8][16][3]

        palette[color][r,g,b] // safe size : [16][3]

        color[r,g,b] // safe size : [3]

    // convert SNESPAL to PALETTES :
        palettes = snespalTo24bits(snespal)

    // draw SNESPAL :
        draw_snespal(snespal, screen)

    // draw PALETTES :
        draw_palettes(palettes, screen)



// TILESET

    // raw type (32 bytes tile) :

        tileset[byte] // safe size : 32 bytes tile * tile count

    // formated type (4 bits color index) :

        decodedTile[pixel] // safe size : [64]

        decodedTileset[pixel] // safe size : [64 * tile count]
        decodedTileset_NEW[tile][pixel] // safe size : [tile count][64]

        formatedTile[row][pixel] // safe size : [8][8]

        formatedTileset[tile][row][pixel] // safe size : [tile count][8][8]




    // draw one tile of TILESET :
        draw_4bppTile(tileset, tileIndex, palette, hFlip,vFlip, screen,x,y)

    // draw TILESET :
        draw_4bppTileset(tileset, palette, hFlip,vFlip,  xtmax, screen,x,y)



    // convert one tile of TILESET to DECODEDTILE :
        decodedTile = decode_4bppTile(tileset, tileIndex, hFlip,vFlip)
    // draw DECODEDTILE
        draw_decodedTile(decodedTile, palette, hFlip,vFlip, screen,x,y)

    // convert TILESET to DECODEDTILESET :
        decodedTileset = decode_4bppTileset(tileset, hFlip,vFlip)
    // draw DECODEDTILESET
        draw_decodedTileset(decodedTileset, palette, hFlip,vFlip, xtmax, screen,x,y)



    // convert one tile of TILESET to FORMATEDTILE :
        formatedTile = format_4bppTile(tileset, tileIndex, hFlip,vFlip)
    // draw FORMATEDTILE
        draw_formatedTile(formatedTile, palette, hFlip,vFlip, screen,x,y)

    // convert TILESET to FORMATEDTILESET :
        formatedTileset = format_4bppTileset(tileset, hFlip,vFlip)
    // draw FORMATEDTILESET
        draw_formatedTileset(formatedTileset, palette, hFlip,vFlip, xtmax, screen,x,y)










