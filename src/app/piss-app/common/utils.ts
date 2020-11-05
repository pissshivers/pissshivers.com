export function probability(n: number): boolean{
    return !!n && Math.random() < n;
}