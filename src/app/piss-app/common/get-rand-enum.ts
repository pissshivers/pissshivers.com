export function GetRandEnum<T>(en: T): T[keyof T] {
    const keys = Object.keys(en)
        .map(n => Number.parseInt(n))
        .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][];
    const randIndex = Math.floor(Math.random() * keys.length);
    return keys[randIndex]
}