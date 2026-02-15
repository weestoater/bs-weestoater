declare module "polyline-encoded" {
  export function decode(polyline: string): number[][];
  export function encode(coordinates: number[][]): string;
}
