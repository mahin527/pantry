"use client"

import { useState } from "react";

interface OtpBoxProps {
    length: number;
    onChange: (value: string) => void;
}

function OtpBox({ length, onChange }: OtpBoxProps) {
    const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        if (!/^[0-9A-Za-z]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        onChange(newOtp.join(""));

        // যদি value দেওয়া হয়, পরের input এ focus যাবে
        if (value && index < length - 1) {
            (document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement)?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            (document.getElementById(`otp-input-${index - 1}`) as HTMLInputElement)?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault(); // default paste বন্ধ করবো

        const pasteData = e.clipboardData.getData("text"); // পুরো OTP string
        if (!/^[0-9A-Za-z]+$/.test(pasteData)) return;

        const pasteArray = pasteData.split("").slice(0, length); // length অনুযায়ী কাটবো
        const newOtp = [...otp];

        pasteArray.forEach((char, i) => {
            newOtp[i] = char;
        });

        setOtp(newOtp);
        onChange(newOtp.join(""));
    };


    return (
        <div className="flex items-center justify-center gap-4">
            {otp.map((digit: string, index: number) => (
                <input
                    key={index}
                    type="text"
                    value={digit}
                    id={`otp-input-${index}`}
                    maxLength={1}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="size-8 md:size-9 lg:size-10 2xl:size-12 text-center font-black text-base md:text-lg xl:text-xl 2xl:text-2xl border-2 border-blue-700 text-blue-700 rounded-md outline-none"
                />
            ))}
        </div>
    );
}

export default OtpBox;
123456