(function (window) {

    var createZ80 = function (hex) {
        var p = new z80.Processor();
        var mem = hexToBin(hex);
        var dummyHandler = function () { };
        p.initialize({ data: mem, lowRom: -1, highRom: -1 }, { input: dummyHandler, output: dummyHandler });

        return p;
    };

    var tests = [];

    tests.push(function (assert) {
        assert.name = "z80.Processor.ctor should not crash";
        // Act
        var p = new z80.Processor();
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.initialize should not crash";

        // Act
        var p = createZ80("");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.initialize should zero all registers";
        // Act
        var p = createZ80("");

        // Assert
        assert.exact(0, p.state.b, "B");
        assert.exact(0, p.state.c, "C");
        assert.exact(0, p.state.d, "D");
        assert.exact(0, p.state.e, "E");
        assert.exact(0, p.state.h, "H");
        assert.exact(0, p.state.l, "L");
        assert.exact(0, p.state.a, "A");
        assert.exact(0, p.state.f, "F");
        assert.exact(0, p.state.b2, "B'");
        assert.exact(0, p.state.c2, "C'");
        assert.exact(0, p.state.d2, "D'");
        assert.exact(0, p.state.e2, "E'");
        assert.exact(0, p.state.h2, "H'");
        assert.exact(0, p.state.l2, "L'");
        assert.exact(0, p.state.a2, "A'");
        assert.exact(0, p.state.f2, "F'");
        assert.exact(0, p.state.pc, "PC");
        assert.exact(0, p.state.sp, "SP");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(4) : (NOP; NOP; NOP) should run one instruction";
        // Arrange
        var p = createZ80("000000");

        // Act
        p.run(4);

        // Assert
        assert.exact(1, p.state.pc, "PC");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(8) : (NOP; NOP; NOP) should run two instructions";
        // Arrange
        var p = createZ80("000000");

        // Act
        p.run(8);

        // Assert
        assert.exact(2, p.state.pc, "PC");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(7) : (LD A, 123) should run one instruction and set A to 123";
        // Arrange
        var p = createZ80("3e7b");

        // Act
        p.run(7);

        // Assert
        assert.exact(2, p.state.pc, "PC");
        assert.exact(123, p.state.a, "A");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(7) : (LD B, 123) should run one instruction and set B to 123";
        // Arrange
        var p = createZ80("067b");

        // Act
        p.run(7);

        // Assert
        assert.exact(2, p.state.pc, "PC");
        assert.exact(123, p.state.b, "B");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(7) : (LD C, 123) should run one instruction and set C to 123";
        // Arrange
        var p = createZ80("0e7b");

        // Act
        p.run(7);

        // Assert
        assert.exact(2, p.state.pc, "PC");
        assert.exact(123, p.state.c, "C");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(10) : (LD BC, 0x2345) should run one instruction and set B to 0x23, C to 0x45";
        // Arrange
        var p = createZ80("014523");

        // Act
        p.run(10);

        // Assert
        assert.exact(3, p.state.pc, "PC");
        assert.exact(0x23, p.state.b, "B");
        assert.exact(0x45, p.state.c, "C");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(7) : (LD D, 123) should run one instruction and set D to 123";
        // Arrange
        var p = createZ80("167b");

        // Act
        p.run(7);

        // Assert
        assert.exact(2, p.state.pc, "PC");
        assert.exact(123, p.state.d, "D");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(7) : (LD E, 123) should run one instruction and set E to 123";
        // Arrange
        var p = createZ80("1e7b");

        // Act
        p.run(7);

        // Assert
        assert.exact(2, p.state.pc, "PC");
        assert.exact(123, p.state.e, "E");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(10) : (LD DE, 0x2345) should run one instruction and set D to 0x23, E to 0x45";
        // Arrange
        var p = createZ80("114523");

        // Act
        p.run(10);

        // Assert
        assert.exact(3, p.state.pc, "PC");
        assert.exact(0x23, p.state.d, "D");
        assert.exact(0x45, p.state.e, "E");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(7) : (LD H, 123) should run one instruction and set H to 123";
        // Arrange
        var p = createZ80("267b");

        // Act
        p.run(7);

        // Assert
        assert.exact(2, p.state.pc, "PC");
        assert.exact(123, p.state.h, "H");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(7) : (LD L, 123) should run one instruction and set L to 123";
        // Arrange
        var p = createZ80("2e7b");

        // Act
        p.run(7);

        // Assert
        assert.exact(2, p.state.pc, "PC");
        assert.exact(123, p.state.l, "l");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(10) : (LD HL, 0x2345) should run one instruction and set H to 0x23, L to 0x45";
        // Arrange
        var p = createZ80("214523");

        // Act
        p.run(10);

        // Assert
        assert.exact(3, p.state.pc, "PC");
        assert.exact(0x23, p.state.h, "H");
        assert.exact(0x45, p.state.l, "L");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(10) : (LD (HL), 123) should run one instruction and set *0 to 123";
        // Arrange
        var p = createZ80("367b");

        // Act
        p.run(10);

        // Assert
        assert.exact(2, p.state.pc, "PC");
        assert.exact(123, p.memory[0], "*0");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(24) : (LD H, 1; LD L, 2; LD (HL), 123) should run three instructions and set *258 to 123";
        // Arrange
        var p = createZ80("26012e02367b");

        // Act
        p.run(24);

        // Assert
        assert.exact(6, p.state.pc, "PC");
        assert.exact(123, p.memory[258], "*258");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(20) : (LD HL, 258; LD (HL), 123) should run three instructions and set *258 to 123";
        // Arrange
        var p = createZ80("210201367b");

        // Act
        p.run(20);

        // Assert
        assert.exact(5, p.state.pc, "PC");
        assert.exact(123, p.memory[258], "*258");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(10) : (LD SP, 0x2345) should run one instruction and set SP to 0x2345";
        // Arrange
        var p = createZ80("314523");

        // Act
        p.run(10);

        // Assert
        assert.exact(3, p.state.pc, "PC");
        assert.exact(0x2345, p.state.sp, "SP");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(17) : (CALL subrout) should run one instruction, set PC to subrout, and push 0x0003 to stack";
        // Arrange
        var p = createZ80("cd0010");

        // Act
        p.run(17);

        // Assert
        assert.exact(0x1000, p.state.pc, "PC");
        assert.exact(0xfffe, p.state.sp, "SP");
        assert.exact(0x00, p.memory[65535], "(sp+1)");
        assert.exact(0x03, p.memory[65534], "(sp)");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run(10) : (RET) should run one instruction and return from subroutine";
        // Arrange
        var p = createZ80("cd0010");
        p.memory[4096] = 0xc9;
        p.run(17);

        // Act
        p.run(10);

        // Assert
        assert.exact(3, p.state.pc, "PC");
        assert.exact(0, p.state.sp, "SP");
    });

    tests.push(function (assert) {
        assert.name = "z80.Processor.run() : (RET) should return immediately";
        // Arrange
        var p = createZ80("c9");

        // Act
        p.run();

        // Assert
        assert.exact(0, p.state.pc, "PC");
        assert.exact(0, p.state.sp, "SP");
    });

    tests.push(function (assert) {
        assert.name = "LD BC,$100; LD A,$99; LD (BC), A should set *256 to 153";
        // Arrange
        var p = createZ80("0100013E9902C9");

        // Act
        p.run();

        // Assert
        assert.exact(153, p.memory[256]);
    });

    tests.push(function (assert) {
        assert.name = "LD BC,$ff; INC BC; INC BC; INC BC should set BC to 258";
        // Arrange
        var p = createZ80("01FF00030303C9");

        // Act
        p.run();

        // Assert
        assert.exact(2, p.state.c, "C");
        assert.exact(1, p.state.b, "B");
    });

    tests.push(function (assert) {
        assert.name = "LD B,$02; INC B should set BC to 3";
        // Arrange
        var p = createZ80("060204C9");

        // Act
        p.run();

        // Assert
        assert.exact(3, p.state.b, "B");
    });

    tests.push(function (assert) {
        assert.name = "LD B,$ff; INC B should set BC to 0 and set the zero flag";
        // Arrange
        var p = createZ80("06FF04C9");

        // Act
        p.run();

        // Assert
        assert.exact(0, p.state.b, "B");
        assert.check(p.state.f & 0x40);
    });

    tests.push(function (assert) {
        assert.name = "LD HL, $100; LD (HL),$02; INC (HL) should set *256 to 3";
        // Arrange
        var p = createZ80("210001360234C9");

        // Act
        p.run();

        // Assert
        assert.exact(3, p.memory[256], "*256");
    });

    tests.push(function (assert) {
        assert.name = "EX AF, AF' should swap AF with AF'";
        // Arrange
        var p = createZ80("08C9");
        p.state.a = 11;
        p.state.f = 22;
        p.state.a2 = 111;
        p.state.f2 = 222;

        // Act
        p.run();

        // Assert
        assert.exact(11, p.state.a2, "A'");
        assert.exact(22, p.state.f2, "F'");
        assert.exact(111, p.state.a, "A");
        assert.exact(222, p.state.f, "F");
    });

    tests.push(function (assert) {
        assert.name = "EXX' should swap BC, DE, HL with BC', DE', HL'";
        // Arrange
        var p = createZ80("D9C9");
        p.state.b = 1;
        p.state.c = 2;
        p.state.d = 3;
        p.state.e = 4;
        p.state.h = 5;
        p.state.l = 6;
        p.state.b2 = 221;
        p.state.c2 = 222;
        p.state.d2 = 223;
        p.state.e2 = 224;
        p.state.h2 = 225;
        p.state.l2 = 226;

        // Act
        p.run();

        // Assert
        assert.exact(1, p.state.b2, "B'");
        assert.exact(2, p.state.c2, "C'");
        assert.exact(3, p.state.d2, "D'");
        assert.exact(4, p.state.e2, "E'");
        assert.exact(5, p.state.h2, "H'");
        assert.exact(6, p.state.l2, "L'");
        assert.exact(221, p.state.b, "B");
        assert.exact(222, p.state.c, "C");
        assert.exact(223, p.state.d, "D");
        assert.exact(224, p.state.e, "E");
        assert.exact(225, p.state.h, "H");
        assert.exact(226, p.state.l, "L");
    });

    tests.push(function (assert) {
        assert.name = "ADD HL, BC should set HL = oldHL + BC";
        // Arrange
        var p = createZ80("09C9");
        p.state.h = 0x20;
        p.state.l = 0x39;
        p.state.b = 0x47;
        p.state.c = 0x9e;

        // Act
        p.run();

        // Assert
        var expected = 0x2039 + 0x479e;
        assert.exact(expected & 0xff, p.state.l, "L");
        assert.exact((expected & 0xff00) >> 8, p.state.h, "H");
    });

    tests.push(function (assert) {
        assert.name = "DJNZ should act as a loop using B as counter";
        // Arrange
        var p = createZ80("3E00067B3C10FDC9");
        // LD A, 0
        // LD B, 123
        // Loop:
        // INC A
        // DJNZ Loop
        // RET

        // Act
        p.run();

        // Assert
        assert.exact(0, p.state.b, "B");
        assert.exact(123, p.state.a, "A");
    });

    tests.push(function (assert) {
        assert.name = "SBC HL,DE should set carry when DE > HL";
        // Arrange
        var p = createZ80("ED52C9");
        // SBC HL,DE
        // RET
        p.state.h = 0;
        p.state.l = 10;
        p.state.d = 0;
        p.state.e = 11;

        // Act
        p.run();

        // Assert
        assert.exact(1, p.state.f & 1, "Carry");
    });

    tests.push(function (assert) {
        assert.name = "SBC HL,DE should subtract carry flag from HL";
        // Arrange
        var p = createZ80("ED52C9");
        // SBC HL,DE
        // RET
        p.state.h = 0;
        p.state.l = 10;
        p.state.d = 0;
        p.state.e = 8;
        p.state.f = 1;

        // Act
        p.run();

        // Assert
        assert.exact(1, p.state.l, "L");
    });

    tests.push(function (assert) {
        assert.name = "ADD HL,DE should set carry flag when DE+HL >= 65536";
        // Arrange
        var p = createZ80("19C9");
        // SBC HL,DE
        // RET
        p.state.h = 255;
        p.state.l = 0;
        p.state.d = 1;
        p.state.e = 0;

        // Act
        p.run();

        // Assert
        assert.exact(1, p.state.f & 1, "Carry");
    });

    window.z80.tests = tests;

})(window);

