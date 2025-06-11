function serialize(numbers) {
    const bitset = new Uint8Array(38); // 300 бит = 38 байт (38*8=304)
    for (let num of numbers) {
        if (num < 1 || num > 300) throw new Error("Число вне диапазона 1–300");
        const index = num - 1;
        bitset[Math.floor(index / 8)] |= 1 << (index % 8);
    }
    return Buffer.from(bitset).toString('base64');
}

function deserialize(base64Str) {
    const bitset = Uint8Array.from(Buffer.from(base64Str, 'base64'));
    const numbers = [];
    for (let i = 0; i < 300; i++) {
        if (bitset[Math.floor(i / 8)] & (1 << (i % 8))) {
            numbers.push(i + 1);
        }
    }
    return numbers;
}

function testCompression(name, numbers) {
    const serialized = serialize(numbers);
    const deserialized = deserialize(serialized);
    const originalSize = JSON.stringify(numbers).length;
    const compressedSize = serialized.length;
    const ratio = (compressedSize / originalSize).toFixed(2);

    console.log(`${name}:
Исходные числа: ${numbers.length}
Оригинальный размер: ${originalSize}
Сжатый размер:       ${compressedSize}
Коэффициент сжатия:  ${ratio}
Десериализация верна: ${JSON.stringify(numbers.sort((a, b) => a - b)) === JSON.stringify(deserialized.sort((a, b) => a - b))}
`);
}

testCompression("Тест 1: Одно число", [42]);
testCompression("Тест 2: Пять чисел", [1, 5, 10, 150, 300]);

function getRandomSet(n) {
    const nums = [];
    for (let i = 0; i < n; i++) nums.push(1 + Math.floor(Math.random() * 300));
    return nums;
}

testCompression("Тест 3: 50 случайных чисел", getRandomSet(50));
testCompression("Тест 4: 100 случайных чисел", getRandomSet(100));
testCompression("Тест 5: 500 случайных чисел", getRandomSet(500));
testCompression("Тест 6: 1000 случайных чисел", getRandomSet(1000));

testCompression("Тест 7: Только 1-значные", Array.from({ length: 9 }, (_, i) => i + 1));
testCompression("Тест 8: Только 2-значные", Array.from({ length: 90 }, (_, i) => i + 10));
testCompression("Тест 9: Только 3-значные", Array.from({ length: 201 }, (_, i) => i + 100));

let tripleSet = [];
for (let i = 1; i <= 300; i++) {
    tripleSet.push(i, i, i);
}
testCompression("Тест 10: Повторы по 3 (900 чисел)", tripleSet);