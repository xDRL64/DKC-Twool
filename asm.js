dkc2ldd.asm = (function(app=dkc2ldd){

    let o = {};

    o.animPalBin = {

        firstPart : {
            code : [
                0xA5,0x2A,0x0A,0x29,0x3F,0x00,0x89,0x20,
                0x00,0xF0,0x03,0x49,0x3F,0x00,0xC9,0x20,
                0x00,0x90,0x03,0xA9,0x20,0x00,0x85,0x32,
                0x0A,0x0A,0xEB,0x85,0x36,0xEB,0x0A,0x0A,
                0x0A,0x85,0x34,0xA2,0x00,0x00,0xBF,0x70,
                0x22,0xFD,0x29,0x1F,0x00,
            ],
            size : 45,
        },

        redSub : [
            {
                code : [
                    // ZERO
                ],
                size : 0,
            },
            {
                code : [
                    0x38,0xE5,0x32,0x10,0x03,0xA9,0x00,0x00,
                ],
                size : 8,
            },
            {
                code : [
                    0x38,0xE5,0x32,0xE5,0x32,0x10,0x03,0xA9,0x00,0x00,
                ],
                size : 10,
            },
            {
                code : [
                    0x38,0xE5,0x32,0xE5,0x32,0xE5,0x32,0x10,0x03,0xA9,0x00,0x00,
                ],
                size : 12,
            },
            {
                code : [
                    0x38,0xE5,0x32,0xE5,0x32,0xE5,0x32,0xE5,0x32,0x10,0x03,0xA9,0x00,0x00,
                ],
                size : 14,
            },
        ],

        redToGreen : {
            code : [
                0x85,0x38,0xBF,0x70,0x22,0xFD,0x29,0xE0,0x03,
            ],
            size : 9,
        },

        greenSub : [
            {
                code : [
                    // ZERO
                ],
                size : 0,
            },
            {
                code : [
                    0x38,0xE5,0x34,0x10,0x03,0xA9,0x00,0x00,
                ],
                size : 8,
            },
            {
                code : [
                    0x38,0xE5,0x34,0xE5,0x34,0x10,0x03,0xA9,0x00,0x00,
                ],
                size : 10,
            },
            {
                code : [
                    0x38,0xE5,0x34,0xE5,0x34,0xE5,0x34,0x10,0x03,0xA9,0x00,0x00,
                ],
                size : 12,
            },
            {
                code : [
                    0x38,0xE5,0x34,0xE5,0x34,0xE5,0x34,0xE5,0x34,0x10,0x03,0xA9,0x00,0x00,
                ],
                size : 14,
            },
        ],

        greenToBlue : {
            code : [
                0x04,0x38,0xBF,0x70,0x22,0xFD,0x29,0x00,0x7C,
            ],
            size : 9,
        },

        blueSub : [
            {
                code : [
                    // ZERO
                ],
                size : 0,
            },
            {
                code : [
                    0x38,0xE5,0x36,0x10,0x03,0xA9,0x00,0x00,
                ],
                size : 8,
            },
            {
                code : [
                    0x38,0xE5,0x36,0x30,0x04,0xE5,0x36,0x10,0x03,0xA9,0x00,0x00,
                ],
                size : 12,
            },
            {
                code : [
                    0x38,0xE5,0x36,0x30,0x08,0xE5,0x36,0x30,0x04,0xE5,0x36,0x10,0x03,0xA9,0x00,0x00,
                ],
                size : 16,
            },
            {
                code : [
                    0x38,0xE5,0x36,0x30,0x0C,0xE5,0x36,0x30,0x08,0xE5,0x36,0x30,0x04,0xE5,0x36,0x10,0x03,0xA9,0x00,0x00,
                ],
                size : 20,
            },
        ],

        NOP : function(count){
            let o = [];
            for(let i=0; i<count; i++)
                o.push(0xEA);
            return o;
        },
        
        lastPart : {
            code : [
                0x05,0x38,0x9F,0x14,0x80,0x7E,0xE8,0xE8,
                0xE0,0x1E,0x00,0xD0,0xB6,0xA5,0x2A,0x29,
                0x20,0x00,0xF0,0x0A,0x20,0xFE,0xB0,0x29,
                0x01,0x00,0x8F,0x12,0x80,0x7E,0xAF,0x12,
                0x80,0x7E,0xF0,0x01,0x60,
            ],
            size : 37,
        },

        maxSize : 136,

        get_totalSize : function(redSub, greenSub, blueSub){
            
            return (
                this.firstPart.size
              + this.redSub[redSub].size
              + this.redToGreen.size
              + this.greenSub[greenSub].size
              + this.greenToBlue.size
              + this.blueSub[blueSub].size
              + this.lastPart.size
            );
        },

        check_size : function(redSub, greenSub, blueSub){

            return this.get_totalSize(...arguments) > this.maxSize ? false : true;
        },

        build_bytecode : function(redSub, greenSub, blueSub){
            let total = this.get_totalSize(redSub, greenSub, blueSub);

            if(total > this.maxSize)
                // wrong size
                return null;
            else{
                // build
                let nop = this.NOP(this.maxSize - total);
                return [
                    ...(this.firstPart.code),
                    ...(this.redSub[redSub].code),
                    ...(this.redToGreen.code),
                    ...(this.greenSub[greenSub].code),
                    ...(this.greenToBlue.code),
                    ...(this.blueSub[blueSub].code),
                    ...(nop),
                    ...(this.lastPart.code),
                ];
            }
        },

        get_hexStrArray : function(redSub, greenSub, blueSub){
            let built = this.build_bytecode(redSub, greenSub, blueSub);
            if(built){
                let o = [];
                for(let byte of built)
                    o.push(app.lib.get_hex2str(byte));
                return o;
            }else
                return null;
        },
    };

    return o;

})();