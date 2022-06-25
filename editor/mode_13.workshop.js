
        
        
        
        
        
        
        
        /////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////
        // BINARY WORKSHOP
        /////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////

        let bin = {};

        //    LDA $2A
        //    ASL 
        //    AND #$003F
        //    BIT #$0020
        //    BEQ $80D663
        //    EOR #$003F
        //    CMP #$0020
        //    BCC $80D66B
        //    LDA #$0020
        //    STA $32
        //    ASL 
        //    ASL 
        //    XBA 
        //    STA $36
        //    XBA 
        //    ASL 
        //    ASL 
        //    ASL 
        //    STA $34
        //    LDX #$0000
        //    LDA $FD2270,X
        //    AND #$001F
        
        bin.firstPart = [
            0xA5,0x2A,0x0A,0x29,0x3F,0x00,0x89,0x20,
            0x00,0xF0,0x03,0x49,0x3F,0x00,0xC9,0x20,
            0x00,0x90,0x03,0xA9,0x20,0x00,0x85,0x32,
            0x0A,0x0A,0xEB,0x85,0x36,0xEB,0x0A,0x0A,
            0x0A,0x85,0x34,0xA2,0x00,0x00,0xBF,0x70,
            0x22,0xFD,0x29,0x1F,0x00
        ];
          
    
    
    
    
    
    
    
    
    
    
        /* red 4 sub [14 bytes] */  bin.red4 = [          /* red 3 sub [12 bytes] */  bin.red3 = [          /* red 2 sub [10 bytes] */  bin.red2 = [          /* red 1 sub [8 bytes] */  bin.red1 = [           /* red 0 sub [0 bytes] */  bin.red0 = [                                                                                       
        /*             */                                 /*             */                                 /*             */                                 /*             */                                 /*             */                                                                                         
        /* SEC         */               0x38,             /* SEC         */               0x38,             /* SEC         */               0x38,             /* SEC         */               0x38,                                                                                                    
        /* SBC $32     */               0xE5,0x32,        /* SBC $32     */               0xE5,0x32,        /* SBC $32     */               0xE5,0x32,        /* SBC $32     */               0xE5,0x32,                                                                                               
        /* SBC $32     */               0xE5,0x32,        /* SBC $32     */               0xE5,0x32,        /* SBC $32     */               0xE5,0x32,                                                                                                       
        /* SBC $32     */               0xE5,0x32,        /* SBC $32     */               0xE5,0x32,                                                                                                                                                    
        /* SBC $32     */               0xE5,0x32,                                                                                                                                                                                      
        /* BPL $80D690 */               0x10,0x03,        /* BPL $80D690 */               0x10,0x03,        /* BPL $80D690 */               0x10,0x03,        /* BPL $80D690 */               0x10,0x03,                                                                                               
        /* LDA #$0000  */               0xA9,0x00,0x00    /* LDA #$0000  */               0xA9,0x00,0x00    /* LDA #$0000  */               0xA9,0x00,0x00    /* LDA #$0000  */               0xA9,0x00,0x00                                                                           
        /*             */           ];                    /*             */           ];                    /*             */           ];                    /*             */           ];                    /*             */           ];                                                                                                       
          
          
    
    
    
    
    
    
    
    
    
    
    
    
    
    
        // red to green part
        /* STA $38       */  0x85,0x38,
        /* LDA $FD2270,X */  0xBF,0x70,0x22,0xFD,
        /* AND #$03E0    */  0x29,0xE0,0x03,
          
          
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
        
          
    
        /* gre 4 sub [14 bytes] */  bin.gre4 = [          /* gre 3 sub [12 bytes] */  bin.gre3 = [          /* gre 2 sub [10 bytes] */  bin.gre2 = [          /* gre 1 sub [8 bytes] */  bin.gre1 = [           /* gre 0 sub [0 bytes] */  bin.gre0 = [                                                                                       
        /*             */                                 /*             */                                 /*             */                                 /*             */                                 /*             */                                                                                         
        /* SEC         */               0x38,             /* SEC         */               0x38,             /* SEC         */               0x38,             /* SEC         */               0x38,                                                                                                    
        /* SBC $34     */               0xE5,0x34,        /* SBC $34     */               0xE5,0x34,        /* SBC $34     */               0xE5,0x34,        /* SBC $34     */               0xE5,0x34,                                                                                               
        /* SBC $34     */               0xE5,0x34,        /* SBC $34     */               0xE5,0x34,        /* SBC $34     */               0xE5,0x34,                                                                                                       
        /* SBC $34     */               0xE5,0x34,        /* SBC $34     */               0xE5,0x34,                                                                                                                                                    
        /* SBC $34     */               0xE5,0x34,                                                                                                                                                                                      
        /* BPL $80D690 */               0x10,0x03,        /* BPL $80D690 */               0x10,0x03,        /* BPL $80D690 */               0x10,0x03,        /* BPL $80D690 */               0x10,0x03,                                                                                               
        /* LDA #$0000  */               0xA9,0x00,0x00    /* LDA #$0000  */               0xA9,0x00,0x00    /* LDA #$0000  */               0xA9,0x00,0x00    /* LDA #$0000  */               0xA9,0x00,0x00                                                                           
        /*             */           ];                    /*             */           ];                    /*             */           ];                    /*             */           ];                    /*             */           ];                                                                                                       
    
    
    
    
    
    
    
    
    
    
    
          
          
        // green to blue part
        /* TSB $38       */  0x04,0x38,
        /* LDA $FD2270,X */  0xBF,0x70,0x22,0xFD,
        /* AND #$7C00    */  0x29,0x00,0x7C,
          
          
                            
        
    
    
    
    
    
    
                                                                                                                                                   
                                                                                                                                           
                                                                                                                                           
                                                                                                                                           
                                                                                                                                                   
        // original blue 1 sub                                                                                                                                                        
        //    SEC                                                                                                                                                         
        //    SBC $36        E536                                                                                                                                                        
        //    BPL $80D6B8    1003                                                                                                                                                        
        //    LDA #$0000     A90000                                                                                                                                                        
          
    
        //                    20 bytes                                        16 bytes                                         12 bytes                                   8 bytes                                        0 bytes
        // custom blue 4 sub                         // custom blue 3 sub                             // custom blue 2 sub                          // custom blue 1 sub                         // custom blue 0 sub                                                                                                                                                 
        /* SEC         */     0x38,                  /* SEC         */        0x38,                   /* SEC         */        0x38,                /* SEC         */     0x38,                  /*             */                                                                                                                                       
        /* SBC $36     */     0xE5,0x36,                                                                                                                                                         /*             */                                      
        /* BMI $80D68F */     0x30,0x0C,                                                                                                                                                         /*             */                                      
        /* SBC $36     */     0xE5,0x36,             /* SBC $36     */        0xE5,0x36,                                                                                                         /*             */                                                                      
        /* BMI $80D68F */     0x30,0x08,             /* BMI $80D68F */        0x30,0x08,                                                                                                         /*             */                                                                      
        /* SBC $36     */     0xE5,0x36,             /* SBC $36     */        0xE5,0x36,              /* SBC $36     */        0xE5,0x36,                                                        /*             */                                                                                                      
        /* BMI $80D68F */     0x30,0x04,             /* BMI $80D68F */        0x30,0x04,              /* BMI $80D68F */        0x30,0x04,                                                        /*             */                                                                                                      
        /* SBC $36     */     0xE5,0x36,             /* SBC $36     */        0xE5,0x36,              /* SBC $36     */        0xE5,0x36,           /* SBC $36     */     0xE5,0x36,             /*             */                                                                                                                                      
        /* BPL $80D692 */     0x10,0x03,             /* BPL $80D692 */        0x10,0x03,              /* BPL $80D692 */        0x10,0x03,           /* BPL $80D692 */     0x10,0x03,             /*             */                                                                                                                                      
        /* LDA #$0000  */     0xA9,0x00,0x00         /* LDA #$0000  */        0xA9,0x00,0x00          /* LDA #$0000  */        0xA9,0x00,0x00       /* LDA #$0000  */     0xA9,0x00,0x00         /*             */                                                                                                                                           
    
    
    
    
    
    
    
    
    
    
    
        bin.nopSpace = []; // NOP : 0xEA (1byte by NOP)
    
    
    
    
    
    
    
    
    
    
        //    ORA $38
        //    STA $7E8014,X
        //    INX
        //    INX
        //    CPX #$001E
        //    BNE $80D67B
        //    LDA $2A
        //    AND #$0020
        //    BEQ $80D6D6
        //    JSR $B0FE
        //    AND #$0001
        //    STA $7E8012
        //    LDA $7E8012
        //    BEQ $80D6DD
        //    RTS
        
        bin.lastPart = [
            0x05,0x38,0x9F,0x14,0x80,0x7E,0xE8,0xE8,
            0xE0,0x1E,0x00,0xD0,0xB6,0xA5,0x2A,0x29,
            0x20,0x00,0xF0,0x0A,0x20,0xFE,0xB0,0x29,
            0x01,0x00,0x8F,0x12,0x80,0x7E,0xAF,0x12,
            0x80,0x7E,0xF0,0x01,0x60
        ];
    
    
    






















        /////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////
        // ASAR PATCH WORKSHOP
        /////////////////////////////////////////////////////////////////////////////////////
        /////////////////////////////////////////////////////////////////////////////////////


// first part
hirom
org $80D655

	LDA $2A 
	ASL
	AND #$003F
	BIT #$0020
	BEQ next_A
	EOR #$003F
next_A:
	CMP #$0020
	BCC next_B
	LDA #$0020
next_B:
	STA $32
	ASL
	ASL
	XBA
	STA $36
	XBA
	ASL
	ASL
	ASL
	STA $34
	LDX #$0000
palette_color_update_loop:
	LDA $FD2270,X
	AND #$001F
	
// red 4 sub
	SEC
	SBC $32
	SBC $32
	SBC $32
	SBC $32
	BPL next_C
	LDA #$0000
next_C:

// red to green part
	STA $38
	LDA $FD2270,X
	AND #$03E0

// green 4 sub
	SEC
	SBC $32
	SBC $32
	SBC $32
	SBC $32
	BPL next_D
	LDA #$0000
next_D:

// green to blue part
	TSB $38
	LDA $FD2270,X
	AND #$7C00


// custom blue 4 sub
	SEC
	SBC $36
	BMI clamp_blue
	SBC $36
	BMI clamp_blue
	SBC $36
	BMI clamp_blue
	SBC $36
	BPL next_E
clamp_blue:
	LDA #$0000
next_E:

// lastPart
	ORA $38
	STA $7E8014,X
	INX
	INX
	CPX #$001E
	BNE palette_color_update_loop

// NOP part

// very last part (is not overwriten by the patch)
	LDA $2A
	AND #$0020
	BEQ $80D6D6
	JSR $B0FE
	AND #$0001
	STA $7E8012
	LDA $7E8012
	BEQ $80D6DD
	RTS
