import * as CryptoJS from "crypto-js";

// Define interface for the data structure
interface Data {
  _a: number[];
  _b: string;
  _c: string;
  _d: {
    data: string[];
    key: number;
  };
  _e: number[];
  _f: number[];
}

// Noise function with explicit types
function _noise(a: number, b: number): number {
  let c: number = a * b;
  for (let i: number = 0; i < 5; i++) {
    c = (c >> 1) ^ (b + i);
  }
  return c > 100 ? c - 10 : c + 10;
}

// Data object with type annotation
const _data: Data = {
  _a: [40 + 8, 110 - 3, 100 + 11, 100 - 2, 48 + 1],
  _b: "b29IJC0=",
  _c: "bf<tv",
  _d: {
    data: ["H", "k", "/", "e", "Z"],
    key: 25,
  },
  _e: [95, 40, 54, 35, 104],
  _f: [100, 50, 80, 60, 90, 3],
};

// Define interface for the return type
interface AuthResult {
  hash: string;
  timestamp: number;
  nonce: string;
}

let __p1: string = _noise(Date.now(), 31).toString();

const __p4: string = _data._c.split("").reverse().join("");

__p1 = _data._a.map((c: number) => String.fromCharCode(c)).join("");

const __p6: string =
  String.fromCharCode(_data._f[4]) +
  String.fromCharCode(_data._f[3] + 8) +
  String.fromCharCode(_data._f[1] + 2) +
  String.fromCharCode(_data._f[0] + _data._f[5]) +
  String.fromCharCode(_data._f[2] + _data._f[5]);

const __p3: string =
  typeof atob !== "undefined"
    ? atob(_data._b)
    : String.fromCharCode(111, 111, 72, 36, 45);

const __p5: string = _data._d.data
  .map((c: string) => {
    let code: number = c.charCodeAt(0);
    return String.fromCharCode(code ^ _data._d.key);
  })
  .join("");

let __p2_arr: string[] = [];
for (let i: number = _data._e.length - 1; i >= 0; i--) {
  __p2_arr.unshift(String.fromCharCode(_data._e[i]));
}
const __p2: string = __p2_arr.join("");

export default function b(): AuthResult {
  const timestamp: number = Date.now();
  const nonce: string = CryptoJS.lib.WordArray.random(8).toString();
  const message: string = `CKASHRAF:${timestamp}:--PS${nonce}`;
  const hash: string = CryptoJS.HmacSHA256(
    message,
    __p1 + __p2 + __p3 + __p4 + __p5 + __p6
  ).toString(CryptoJS.enc.Hex);

  return { hash, timestamp, nonce };
}
