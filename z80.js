(function (window) {

    // Flags register constants
    var fC = 0x01,
        fN = 0x02,
        fP = 0x04,
        fV = fP,
        fX = 0x08,
        fH = 0x10,
        fY = 0x20,
        fZ = 0x40,
        fS = 0x80;

    var timings = [
        4, 10, 7, 6, 4, 4, 7, 4, 4, 11, 7, 6, 4, 4, 7, 4,
        8, 10, 7, 6, 4, 4, 7, 4, 12, 11, 7, 6, 4, 4, 7, 4,
        7, 10, 16, 6, 4, 4, 7, 4, 7, 11, 16, 6, 4, 4, 7, 4,
        7, 10, 13, 6, 11, 11, 10, 4, 7, 11, 13, 6, 4, 4, 7, 4,
        4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4,
        4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4,
        4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4,
        7, 7, 7, 7, 7, 7, 4, 7, 4, 4, 4, 4, 4, 4, 7, 4,
        4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4,
        4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4,
        4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4,
        4, 4, 4, 4, 4, 4, 7, 4, 4, 4, 4, 4, 4, 4, 7, 4,
        5, 10, 10, 10, 10, 11, 7, 11, 5, 10, 10, 0, 10, 17, 7, 11, /* cb -> cc_cb */
        5, 10, 10, 11, 10, 11, 7, 11, 5, 4, 10, 11, 10, 0, 7, 11, /* dd -> cc_xy */
        5, 10, 10, 19, 10, 11, 7, 11, 5, 4, 10, 4, 10, 0, 7, 11, /* ed -> cc_ed */
        5, 10, 10, 4, 10, 11, 7, 11, 5, 6, 10, 4, 10, 0, 7, 11     /* fd -> cc_xy */
    ];

    var extendedTimings = [];

    extendedTimings[0xed] = [
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
       12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9,
       12, 12, 15, 20, 8, 14, 8, 9, 12, 12, 15, 20, 8, 14, 8, 9,
       12, 12, 15, 20, 8, 14, 8, 18, 12, 12, 15, 20, 8, 14, 8, 18,
       12, 12, 15, 20, 8, 14, 8, 8, 12, 12, 15, 20, 8, 14, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
       16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8,
       16, 16, 16, 16, 8, 8, 8, 8, 16, 16, 16, 16, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
        8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8];

    extendedTimings[0xfd] = [
        4 + 4, 10 + 4, 7 + 4, 6 + 4, 4 + 4, 4 + 4, 7 + 4, 4 + 4, 4 + 4, 11 + 4, 7 + 4, 6 + 4, 4 + 4, 4 + 4, 7 + 4, 4 + 4,
        8 + 4, 10 + 4, 7 + 4, 6 + 4, 4 + 4, 4 + 4, 7 + 4, 4 + 4, 12 + 4, 11 + 4, 7 + 4, 6 + 4, 4 + 4, 4 + 4, 7 + 4, 4 + 4,
        7 + 4, 10 + 4, 16 + 4, 6 + 4, 4 + 4, 4 + 4, 7 + 4, 4 + 4, 7 + 4, 11 + 4, 16 + 4, 6 + 4, 4 + 4, 4 + 4, 7 + 4, 4 + 4,
        7 + 4, 10 + 4, 13 + 4, 6 + 4, 23, 23, 19, 4 + 4, 7 + 4, 11 + 4, 13 + 4, 6 + 4, 4 + 4, 4 + 4, 7 + 4, 4 + 4,
        4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 19, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 19, 4 + 4,
        4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 19, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 19, 4 + 4,
        4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 19, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 19, 4 + 4,
       19, 19, 19, 19, 19, 19, 4 + 4, 19, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 19, 4 + 4,
        4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 19, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 19, 4 + 4,
        4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 19, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 19, 4 + 4,
        4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 19, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 19, 4 + 4,
        4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 19, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 4 + 4, 19, 4 + 4,
        5 + 4, 10 + 4, 10 + 4, 10 + 4, 10 + 4, 11 + 4, 7 + 4, 11 + 4, 5 + 4, 10 + 4, 10 + 4, 0, 10 + 4, 17 + 4, 7 + 4, 11 + 4,    /* cb -> cc_xycb */
        5 + 4, 10 + 4, 10 + 4, 11 + 4, 10 + 4, 11 + 4, 7 + 4, 11 + 4, 5 + 4, 4 + 4, 10 + 4, 11 + 4, 10 + 4, 4, 7 + 4, 11 + 4,    /* dd -> cc_xy again */
        5 + 4, 10 + 4, 10 + 4, 19 + 4, 10 + 4, 11 + 4, 7 + 4, 11 + 4, 5 + 4, 4 + 4, 10 + 4, 4 + 4, 10 + 4, 4, 7 + 4, 11 + 4,    /* ed -> cc_ed */
        5 + 4, 10 + 4, 10 + 4, 4 + 4, 10 + 4, 11 + 4, 7 + 4, 11 + 4, 5 + 4, 6 + 4, 10 + 4, 4 + 4, 10 + 4, 4, 7 + 4, 11 + 4     /* fd -> cc_xy again */];

    var implementation = [];
    var otherSets = [];

    var op = function (opcode, func) {
        implementation[opcode] = function () {
            var timeTaken = timings[opcode];
            timeTaken += (func.apply(this) || 0);
            return timeTaken;
        };
    };

    var opop = function (prefix, opcode, func) {
        if (!otherSets[prefix]) {
            otherSets[prefix] = [];
        }

        otherSets[prefix][opcode] = function () {
            var timeTaken = extendedTimings[prefix][opcode];
            timeTaken += (func.apply(this) || 0);
            setImplSet(this);
            return timeTaken;
        };
    };

    var writeByte = function (p, address, value) {
        if (address >= p.romRange.low && address <= p.romRange.high)
            throw "Invalid memory operation: write access to ROM (address $" + address.toString(16) + ")";
        p.memory[address & 0xffff] = value & 255;
    };

    var writeWord = function (p, address, value) {
        writeByte(p, address, value);
        writeByte(p, (address + 1) & 0xffff, value >> 8);
    };

    var sign8 = function (value) {
        if (value >= 128) {
            value -= 256;
        }
        return value;
    };

    var setbc = function (p, value) {
        p.state.b = (value & 0xff00) >> 8;
        p.state.c = value & 0xff;
    };

    var bc = function (p) {
        return p.state.b * 256 + p.state.c;
    };

    var setde = function (p, value) {
        p.state.d = (value & 0xff00) >> 8;
        p.state.e = value & 0xff;
    };

    var de = function (p) {
        return p.state.d * 256 + p.state.e;
    };

    var sethl = function (p, value) {
        p.state.h = (value & 0xff00) >> 8;
        p.state.l = value & 0xff;
    };

    var hl = function (p) {
        return p.state.h * 256 + p.state.l;
    };

    var setsp = function (p, value) {
        p.state.sp = value & 0xffff;
    };

    var push = function (p, value) {
        // push always pushes 16 bits!
        p.state.sp = (p.state.sp + 65535) & 0xffff;
        writeByte(p, p.state.sp, (value & 0xff00) >> 8);
        p.state.sp = (p.state.sp + 65535) & 0xffff;
        writeByte(p, p.state.sp, value & 0x00ff);
    };

    var pop = function (p) {
        var value = p.memory[p.state.sp];
        p.state.sp = (p.state.sp + 1) & 0xffff;
        value += (p.memory[p.state.sp] << 8);
        p.state.sp = (p.state.sp + 1) & 0xffff;
        return value;
    };

    // Precalculate INC flags
    var flags = (function () {
        var szhv_inc = new Array(256);
        var szhv_dec = new Array(256);
        var szp = new Array(256);
        for (var i = 0; i <= 0xff; ++i) {
            var p = 0;
            if (i & 0x01) ++p;
            if (i & 0x02) ++p;
            if (i & 0x04) ++p;
            if (i & 0x08) ++p;
            if (i & 0x10) ++p;
            if (i & 0x20) ++p;
            if (i & 0x40) ++p;
            if (i & 0x80) ++p;
            var pbit = (p & 1) ? fP : 0;

            var sz = i ? (i & fS) : fZ;
            sz |= (i & (fX | fY));

            var zeroWithParity = sz | pbit;
            szp[i] = zeroWithParity;

            var inc = sz;
            if (i == 0x80) inc |= fV;
            if ((i & 0x0f) == 0) inc |= fH;

            var dec = sz | fN;
            if (i == 0x7f) dec |= fV;
            if ((i & 0x0f) == 0x0f) dec |= fH;

            szhv_inc[i] = inc;
            szhv_dec[i] = dec;
        }
        return {
            szhv_inc: szhv_inc,
            szhv_dec: szhv_dec,
            szp: szp
        };
    })();

    var and = function (p, input) {
        p.state.a = (p.state.a & input) & 0xff;
        p.state.f = flags.szp[p.state.a] | fH;
    };

    var xor = function (p, input) {
        p.state.a = (p.state.a ^ input) & 0xff;
        p.state.f = flags.szp[p.state.a];
    };

    var cp = function (p, val) {
        var a = p.state.a;
        var res = (a - val + 256) & 0xff;

        var innerVal = a - res;
        var newF = fN | (res ? ((res & 0x80) ? fS : 0) : fZ);
        if ((res & 0x0f) > (a & 0x0f)) newF |= fH;
        if (res > a) newF |= fC;
        if ((innerVal ^ a) & (a ^ res) & 0x80) newF |= fV;
        newF |= (val & (fX | fY));

        p.state.f = newF;
    };

    var inc8 = function (p, name) {
        var value = (p.state[name] + 1) & 0xff;
        p.state[name] = value;
        p.state.f = p.state.f & fC | flags.szhv_inc[value];
    };

    var inc8m = function (p, addr) {
        var value = (p.memory[addr] + 1) & 0xff;
        p.memory[addr] = value;
        p.state.f = p.state.f & fC | flags.szhv_inc[value];
    };

    var dec8 = function (p, name) {
        var value = (p.state[name] + 255) & 0xff;
        p.state[name] = value;
        p.state.f = p.state.f & fC | flags.szhv_dec[value];
    };

    var dec8m = function (p, addr) {
        var value = (p.memory[addr] + 255) & 0xff;
        writeByte(p, addr, value);
        p.state.f = p.state.f & fC | flags.szhv_dec[value];
    };

    var rlca = function (p) {
        var olda = p.state.a;
        // (Z)->A = ((Z)->A << 1) | ((Z)->A >> 7);
        var newa = ((olda << 1) & 0xfe) | ((olda >> 7) & 0x01);
        p.state.a = newa;
        // (Z)->F = ((Z)->F & (SF | ZF | PF)) | ((Z)->A & (YF | XF | CF));
        p.state.f = (p.state.f & (fS | fZ | fP)) | (newa & (fX | fY | fC));
    };

    var rrca = function (p) {
        var olda = p.state.a;
        // (Z)->F = ((Z)->F & (SF | ZF | PF)) | ((Z)->A & CF);
        var newf = (p.state.f & (fS | fZ | fP)) | (olda & fC);
        // (Z)->A = ((Z)->A >> 1) | ((Z)->A << 7);
        var newa = ((olda >> 1) & 0x7f) | ((olda << 7) & 0x80);
        // (Z)->F |= ((Z)->A & (YF | XF));
        newf |= (newa & (fY | fX));
        p.state.a = newa;
        p.state.f = newf;
    };

    var swap = function (p, nameRoots) {
        for (var i = 0; i < nameRoots.length; ++i) {
            var one = nameRoots.substr(i, 1);
            var other = one + "2";
            p.state[one] = (p.state[other] ^= p.state[one] ^= p.state[other]) ^ p.state[one];
        }
    };

    var add16 = function (p, setfunc, original, addThis) {
        var result = original + addThis;

        p.state.wz = original + 1;

        p.state.f = (p.state.f & (fS | fZ | fV)) |
            (((original ^ result ^ addThis) >> 8) & fH) |
            ((result >> 16) & fC) | ((result >> 8) & (fY | fX));

        setfunc(p, result);
    };

    var sbc16 = function (p, input) {
        /*
        1077      UINT32 res = (Z)->HLD - (Z)->Reg.d - ((Z)->F & CF);         \
        1078      (Z)->WZ = (Z)->HL + 1;                                      \
        1079      (Z)->F = ((((Z)->HLD ^ res ^ (Z)->Reg.d) >> 8) & HF) | NF | \
        1080          ((res >> 16) & CF) |                                    \
        1081          ((res >> 8) & (SF | YF | XF)) |                         \
        1082          ((res & 0xffff) ? 0 : ZF) |                             \
        1083          ((((Z)->Reg.d ^ (Z)->HLD) & ((Z)->HLD ^ res) &0x8000) >> 13); \
        1084      (Z)->HL = (UINT16)res;         */
        var res = ((hl(p) - input - (p.state.f & fC)) + 131072) & 0x1ffff;
        p.state.wz = hl(p) + 1;
        p.state.f = (((hl(p) ^ res ^ input) >> 8) & fH) | fN |
            ((res >> 16) & fC) |
            ((res >> 8) & (fS | fY | fX)) |
            ((res & 0xffff) ? 0 : fZ) |
            (((input ^ hl(p)) & (hl(p) ^ res) & 0x8000) >> 13);
        sethl(p, res);
    };

    var jr = function (p, offset) {
        if (offset === undefined) offset = readArg8(p);
        p.state.pc += sign8(offset);
        p.state.wz = p.state.pc;
    };

    var jrCond = function (p, condition, offset) {
        if (offset === undefined) offset = readArg8(p);
        if (condition) jr(p, offset);
        // TODO: Adjust cycle count and return 0 or something else...
    };

    var jp = function (p, value) {
        if (value === undefined) value = readArg16(p);
        p.state.pc = value;
        p.state.wz = p.state.pc;
    };

    var out = function (p, port, value) {
        p.outHandler.call(p, port, value);
    };

    var outNA = function (p) {
        // unsigned n = ARG(z80) | (z80->A << 8); OUT(z80, n, z80->A); z80->WZ_L = ((n & 0xff) + 1) & 0xff;  z80->WZ_H = z80->A;
        var n = readArg8(p);
        var port = n | (p.state.a << 8);
        out(p, port, p.state.a);
        p.state.wz = (p.state.a << 8) | ((n + 1) & 0xff);
    };

    var ldd = function (p) {
        /*
        UINT8 io = RM((Z), (Z)->HL);                                \
        WM((Z), (Z)->DE, io);                                       \
        (Z)->F &= SF | ZF | CF;                                     \
        if (((Z)->A + io) & 0x02) (Z)->F |= YF;                     \
        if (((Z)->A + io) & 0x08) (Z)->F |= XF;                     \
        (Z)->HL--; (Z)->DE--; (Z)->BC--;                            \
        if ((Z)->BC) (Z)->F |= VF;                                  \        
        */

        var io = p.memory[hl(p)];
        writeByte(p, de(p), io);
        p.state.f &= (fS | fZ | fC);
        if ((p.state.a + io) & 0x02) p.state.f |= fY;
        if ((p.state.a + io) & 0x08) p.state.f |= fX;
        sethl(p, hl(p) - 1);
        setde(p, de(p) - 1);
        setbc(p, bc(p) - 1);
        if (bc(p)) p.state.f |= fV;
    };

    var lddr = function (p) {
        ldd(p);
        if (bc(p)) {
            p.state.pc -= 2;
            p.state.wz = p.state.pc + 1;
            // TODO: Adjust cycle count and return 0 or something else...
        }
    };

    var ldi = function (p) {
        /*
        UINT8 io = RM((Z), (Z)->HL);                                \
        WM((Z), (Z)->DE, io);                                       \
        (Z)->F &= SF | ZF | CF;                                     \
        if (((Z)->A + io) & 0x02) (Z)->F |= YF;                     \
        if (((Z)->A + io) & 0x08) (Z)->F |= XF;                     \
        (Z)->HL++; (Z)->DE++; (Z)->BC--;                            \
        if((Z)->BC) (Z)->F |= VF;                                   \        
        */

        var io = p.memory[hl(p)];
        writeByte(p, de(p), io);
        p.state.f &= (fS | fZ | fC);
        if ((p.state.a + io) & 0x02) p.state.f |= fY;
        if ((p.state.a + io) & 0x08) p.state.f |= fX;
        sethl(p, hl(p) + 1);
        setde(p, de(p) + 1);
        setbc(p, bc(p) - 1);
        if (bc(p)) p.state.f |= fV;
    };

    var ldir = function (p) {
        ldi(p);
        if (bc(p)) {
            p.state.pc -= 2;
            p.state.wz = p.state.pc + 1;
            // TODO: Adjust cycle count and return 0 or something else...
        }
    };

    var eax = function (p) {
        p.state.ea = (p.state.ix + readArg8(p)) & 0xffff;
        p.state.wz = p.state.ea;
    };

    var eay = function (p) {
        p.state.ea = (p.state.iy + readArg8(p)) & 0xffff;
        p.state.wz = p.state.ea;
    };

    var setImplSet = function (p, opcode) {
        if (opcode) {
            p.currentImplSetOpcode = opcode.toString(16);
            p.implSet = otherSets[opcode];
        } else {
            p.currentImplSetOpcode = "";
            p.implSet = implementation;
        }
    };

    op(0x00, function () { });
    op(0x01, function () { setbc(this, readArg16(this)); });
    op(0x02, function () { writeByte(this, bc(this), this.state.a); this.state.wz = ((this.state.c + 1) & 0xff) | (this.state.a << 8); });
    op(0x03, function () { setbc(this, bc(this) + 1); });
    op(0x04, function () { inc8(this, "b"); });
    op(0x05, function () { dec8(this, "b"); });
    op(0x06, function () { this.state.b = readArg8(this); });
    op(0x07, function () { rlca(this); });
    op(0x08, function () { swap(this, "af"); });
    op(0x09, function () { add16(this, sethl, hl(this), bc(this)); });
    op(0x0a, function () { this.state.a = this.memory[bc(this)]; this.state.wz = this.state.bc + 1; });
    op(0x0b, function () { setbc(this, bc(this) + 0xffff); });
    op(0x0c, function () { inc8(this, "c"); });
    op(0x0d, function () { dec8(this, "c"); });
    op(0x0e, function () { this.state.c = readArg8(this); });
    op(0x0f, function () { rrca(this); });
    op(0x10, function () { this.state.b = (this.state.b + 255) & 0xff; var offset = readArg8(this); if (this.state.b) jr(this, offset); });
    op(0x11, function () { setde(this, readArg16(this)); });
    op(0x12, function () { writeByte(this, de(this), this.state.a); this.state.wz = ((this.state.e + 1) & 0xff) | (this.state.a << 8); });
    op(0x13, function () { setde(this, de(this) + 1); });
    op(0x14, function () { inc8(this, "d"); });
    op(0x15, function () { dec8(this, "d"); });
    op(0x16, function () { this.state.d = readArg8(this); });
    op(0x18, function () { jr(this); });
    op(0x19, function () { add16(this, sethl, hl(this), de(this)); });
    op(0x1a, function () { this.state.a = this.memory[de(this)]; this.state.wz = this.state.de + 1; });
    op(0x1b, function () { setde(this, de(this) + 0xffff); });
    op(0x1c, function () { inc8(this, "e"); });
    op(0x1d, function () { dec8(this, "e"); });
    op(0x1e, function () { this.state.e = readArg8(this); });
    op(0x20, function () { jrCond(this, !(this.state.f & fZ)); });
    op(0x21, function () { sethl(this, readArg16(this)); });
    op(0x22, function () { this.state.ea = readArg16(this); writeWord(this, this.state.ea, hl(this)); this.state.wz = (this.state.ea + 1) & 0xffff; });
    op(0x23, function () { sethl(this, hl(this) + 1); });
    op(0x24, function () { inc8(this, "h"); });
    op(0x25, function () { dec8(this, "h"); });
    op(0x26, function () { this.state.h = readArg8(this); });
    op(0x28, function () { jrCond(this, (this.state.f & fZ)); });
    op(0x29, function () { add16(this, sethl, hl(this), hl(this)); });
    op(0x2a, function () { this.state.ea = readArg16(this); this.state.l = this.memory[this.state.ea]; this.state.h = this.memory[this.state.ea + 1]; this.state.wz = this.state.ea + 1; });
    op(0x2b, function () { sethl(this, hl(this) + 0xffff); });
    op(0x2c, function () { inc8(this, "l"); });
    op(0x2d, function () { dec8(this, "l"); });
    op(0x2e, function () { this.state.l = readArg8(this); });
    op(0x30, function () { jrCond(this, !(this.state.f & fC)); });
    op(0x31, function () { setsp(this, readArg16(this)); });
    op(0x32, function () { this.state.ea = readArg16(this); writeByte(this, this.state.ea, this.state.a); this.state.wz = (this.state.a << 8) | ((this.state.ea + 1) & 0xff); });
    op(0x34, function () { inc8m(this, hl(this)); });
    op(0x35, function () { dec8m(this, hl(this)); });
    op(0x36, function () { writeByte(this, hl(this), readArg8(this)); });
    op(0x39, function () { add16(this, sethl, hl(this), this.state.sp); });
    op(0x3c, function () { inc8(this, "a"); });
    op(0x3d, function () { dec8(this, "a"); });
    op(0x3e, function () { this.state.a = readArg8(this); });
    op(0x40, function () { /*this.state.b = this.state.b;*/ });
    op(0x41, function () { this.state.b = this.state.c; });
    op(0x42, function () { this.state.b = this.state.d; });
    op(0x43, function () { this.state.b = this.state.e; });
    op(0x44, function () { this.state.b = this.state.h; });
    op(0x45, function () { this.state.b = this.state.l; });
    op(0x46, function () { this.state.b = this.memory[hl(this)]; });
    op(0x47, function () { this.state.b = this.state.a; });
    op(0x49, function () { });
    op(0x52, function () { });
    op(0x5b, function () { });
    op(0x60, function () { this.state.h = this.state.b; });
    op(0x61, function () { this.state.h = this.state.c; });
    op(0x62, function () { this.state.h = this.state.d; });
    op(0x63, function () { this.state.h = this.state.e; });
    op(0x64, function () { /*this.state.h = this.state.h;*/ });
    op(0x65, function () { this.state.h = this.state.l; });
    op(0x66, function () { this.state.h = this.memory[hl(this)]; });
    op(0x67, function () { this.state.h = this.state.a; });
    op(0x68, function () { this.state.l = this.state.b; });
    op(0x69, function () { this.state.l = this.state.c; });
    op(0x6a, function () { this.state.l = this.state.d; });
    op(0x6b, function () { this.state.l = this.state.e; });
    op(0x6c, function () { this.state.l = this.state.h; });
    op(0x6d, function () { /*this.state.l = this.state.l;*/ });
    op(0x6e, function () { this.state.l = this.memory[hl(this)]; });
    op(0x6f, function () { this.state.l = this.state.a; });
    op(0x7f, function () { });
    op(0xa0, function () { and(this, this.state.b); });
    op(0xa1, function () { and(this, this.state.c); });
    op(0xa2, function () { and(this, this.state.d); });
    op(0xa3, function () { and(this, this.state.e); });
    op(0xa4, function () { and(this, this.state.h); });
    op(0xa5, function () { and(this, this.state.l); });
    op(0xa6, function () { and(this, this.memory[hl(this)]); });
    op(0xa7, function () { and(this, this.state.a); });
    op(0xa8, function () { xor(this, this.state.b); });
    op(0xa9, function () { xor(this, this.state.c); });
    op(0xaa, function () { xor(this, this.state.d); });
    op(0xab, function () { xor(this, this.state.e); });
    op(0xac, function () { xor(this, this.state.h); });
    op(0xad, function () { xor(this, this.state.l); });
    op(0xae, function () { xor(this, this.memory[hl(this)]); });
    op(0xaf, function () { xor(this, this.state.a); });
    op(0xb8, function () { cp(this, this.state.b); });
    op(0xb9, function () { cp(this, this.state.c); });
    op(0xba, function () { cp(this, this.state.d); });
    op(0xbb, function () { cp(this, this.state.e); });
    op(0xbc, function () { cp(this, this.state.h); });
    op(0xbd, function () { cp(this, this.state.l); });
    op(0xbe, function () { cp(this, this.memory[hl(this)]); });
    op(0xbf, function () { cp(this, this.state.b); });
    op(0xd3, function () { outNA(this); });
    op(0xc3, function () { jp(this); });
    op(0xc9, function () { if (this.state.sp == 0) { this.state.pc = 0; return 0x7fffffff; } this.state.pc = pop(this); });
    op(0xcd, function () { var newPc = readArg16(this); push(this, this.state.pc); this.state.pc = newPc; });
    op(0xeb, function () { var temp = hl(this); sethl(this, de(this)); setde(this, temp); });
    op(0xed, function () { setImplSet(this, 0xed); });
    op(0xd9, function () { swap(this, "bcdehl"); });
    op(0xf3, function () { this.state.iff1 = this.state.iff2 = 0; });
    op(0xf9, function () { this.state.sp = hl(this); });
    op(0xfb, function () { this.state.iff1 = this.state.iff2 = 1; });
    op(0xfd, function () { setImplSet(this, 0xfd); });

    opop(0xed, 0x43, function () { this.state.ea = readArg16(this); writeWord(this, this.state.ea, bc(this)); this.state.wz = (this.state.ea + 1) & 0xffff; });
    opop(0xed, 0x53, function () { this.state.ea = readArg16(this); writeWord(this, this.state.ea, de(this)); this.state.wz = (this.state.ea + 1) & 0xffff; });
    opop(0xed, 0x47, function () { this.state.i = this.state.a; });
    opop(0xed, 0x52, function () { sbc16(this, de(this)); });
    opop(0xed, 0x56, function () { this.state.im = 1; });
    opop(0xed, 0xb0, function () { ldir(this); });
    opop(0xed, 0xb8, function () { lddr(this); });

    opop(0xfd, 0x21, function () { this.state.iy = readArg16(this); });
    opop(0xfd, 0x34, function () { eay(this); writeByte(this, this.state.ea, inc8(this, this.memory[this.state.ea])); });
    opop(0xfd, 0x35, function () { eay(this); writeByte(this, this.state.ea, dec8(this, this.memory[this.state.ea])); });
    opop(0xfd, 0xcb, function () { var arg = readArg8(this); var op = readArg8(this); iyBitInstr(op, arg); } );

    opop(0xfdcb, 0, undefined);

    var readNextInstr = function (p) {
        var instr = p.memory[p.state.pc] || 0;
        p.state.pc = (p.state.pc + 1) & 0xffff;
        return instr & 0xff;
    };

    var readArg8 = readNextInstr;

    var readArg16 = function (p) {
        return readArg8(p) | (readArg8(p) << 8);
    };

    var processor = function () {
        this.inHandler = function () { };
        this.outHandler = function () { };
        this.memory = [];
        this.romRange = { low: 0, high: 0 };
        this.state = {
            a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0,
            a2: 0, f2: 0, b2: 0, c2: 0, d2: 0, e2: 0, h2: 0, l2: 0,
            pc: 0, sp: 0, ix: 0, iy: 0, wz: 0, ea: 0,
            iff1: 0, iff2: 0, i: 0, im: 0
        };
        setImplSet(this);
    };

    processor.prototype.initialize = function (memoryModel, ioHandlers) {
        this.inHandler = ioHandlers.input;
        this.outHandler = ioHandlers.output;
        this.memory = memoryModel.data;
        this.romRange = { low: memoryModel.lowRom, high: memoryModel.highRom };
    };

    processor.prototype.doOneInstruction = function () {
        var oldPc = this.state.pc;
        this.currentInstrPc = (oldPc + 65536).toString(16).substr(1);
        var instr = readNextInstr(this);
        var impl = this.implSet[instr];
        this.currentInstr = this.currentImplSetOpcode + (instr + 256).toString(16).substr(1);
        if (impl) {
            return impl.apply(this);
        } else {
            throw "Not implemented: instr $" + this.currentInstr + " at PC $" + oldPc.toString(16);
        }
    };

    processor.prototype.run = function (cycleCount) {
        cycleCount = cycleCount || (0x7fffffff);
        var totalCycles = 0;
        while (totalCycles < cycleCount) {
            totalCycles += this.doOneInstruction();
        }
    };

    window.z80 = { Processor: processor };

    var hexToBin = function (hex) {
        var length = hex.length >> 1;
        var result = new Array(length);
        for (var i = 0, target = 0; target < length; i += 2, ++target) {
            result[target] = parseInt(hex.substr(i, 2), 16);
        }
        return result;
    };

    window.hexToBin = hexToBin;

})(window);
