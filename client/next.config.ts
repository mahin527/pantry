import type { NextConfig } from "next";

// next.config.js
const isDev = process.env.NODE_ENV === 'development';

const NextConfig = {
    // ডেভেলপমেন্টে বন্ধ, প্রোডাকশনে চালু
    reactCompiler: !isDev,     // যদি এই ফিচারটি ব্যবহার করে থাকেন [citation:3][citation:8]
    cacheComponents: !isDev,   // যদি এই ফিচারটি ব্যবহার করে থাকেন [citation:8]
};

export default NextConfig;