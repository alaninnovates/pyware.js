
export class Reader {
    private buffer: Buffer;
    private pos: number;

    constructor(buffer: Buffer) {
        this.buffer = buffer;
        this.pos = 0;
    }

    remaining() {
        return this.buffer.length - this.pos;
    }

    tell() {
        return this.pos;
    }

    seek(pos: number) {
        if (pos < 0 || pos > this.buffer.length) {
            throw new Error(`Invalid seek: ${pos}`);
        }
        this.pos = pos;
    }

    ensure(n: number) {
        if (n < 0 || this.pos + n > this.buffer.length) {
            throw new Error(
                `Unexpected EOF at 0x${this.pos.toString(16)}: ` +
                `wanted ${n} bytes, have ${this.remaining()}`
            );
        }
    }

    bytes(n: number) {
        this.ensure(n);

        const result = this.buffer.subarray(
            this.pos,
            this.pos + n
        );

        this.pos += n;
        return result;
    }

    u8() {
        this.ensure(1);
        const v = this.buffer.readUInt8(this.pos);
        this.pos += 1;
        return v;
    }

    i8() {
        this.ensure(1);
        const v = this.buffer.readInt8(this.pos);
        this.pos += 1;
        return v;
    }

    u16() {
        this.ensure(2);
        const v = this.buffer.readUInt16BE(this.pos);
        this.pos += 2;
        return v;
    }

    i16() {
        this.ensure(2);
        const v = this.buffer.readInt16BE(this.pos);
        this.pos += 2;
        return v;
    }

    u32() {
        this.ensure(4);
        const v = this.buffer.readUInt32BE(this.pos);
        this.pos += 4;
        return v;
    }

    i32() {
        this.ensure(4);
        const v = this.buffer.readInt32BE(this.pos);
        this.pos += 4;
        return v;
    }

    i64() {
        this.ensure(8);
        const v = this.buffer.readBigInt64BE(this.pos);
        this.pos += 8;
        return v;
    }

    f32() {
        this.ensure(4);
        const v = this.buffer.readFloatBE(this.pos);
        this.pos += 4;
        return v;
    }

    boolean() {
        return this.u8() !== 0;
    }

    ascii(n: number) {
        return this.bytes(n).toString("ascii");
    }

    skip(n: number) {
        this.ensure(n);
        this.pos += n;
    }
}