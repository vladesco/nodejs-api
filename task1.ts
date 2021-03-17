import { Transform } from 'stream'

class StringReverseTransform extends Transform {
    _transform(chunk: Buffer, encoding: string, callback: (error?: Error) => void) {
        try {

            const reverseString = chunk.slice(0, -1).reverse();

            this.push(reverseString);
            this.push('\n');
            callback();
        } catch (error) {
            callback(error);
        }
    }
}

process.stdin.pipe(new StringReverseTransform()).pipe(process.stdout);