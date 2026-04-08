"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './splash.css';

export default function SplashScreen() {
    const router = useRouter();
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);

    useEffect(() => {
        // Trigger drawing animation
        const drawTimer = setTimeout(() => {
            setIsDrawing(true);
        }, 100);

        // Trigger fade out and redirect
        const redirectTimer = setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
                router.push('/login');
            }, 800); // Wait for fade out to finish
        }, 4500);

        return () => {
            clearTimeout(drawTimer);
            clearTimeout(redirectTimer);
        };
    }, [router]);

    return (
        <main className={`splash-container ${isFadingOut ? 'fade-out' : ''}`}>
            <div className="logo-wrapper">
                <div className={`svg-container`}>
                    <svg id="enotice-logo" viewBox="0 0 450 150" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="envelopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0E5888" />
                                <stop offset="100%" stopColor="#19486A" />
                            </linearGradient>
                            <linearGradient id="eGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#0275B1" />
                                <stop offset="100%" stopColor="#0D3F61" />
                            </linearGradient>
                            <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#0275B1" />
                                <stop offset="100%" stopColor="#06A5FF" />
                            </linearGradient>
                        </defs>

                        <g className={`logo-icon-group ${isDrawing ? 'animate-draw' : ''}`} transform="translate(10, 20)">
                            <path className="envelope-back" d="M30 40 L85 10 L140 40 L140 90 L30 90 Z" fill="none" stroke="url(#envelopeGrad)" strokeWidth="8" strokeLinejoin="round" />
                            <path className="paper-insert" d="M50 80 L110 80 L110 30 L50 30 Z" fill="none" stroke="url(#envelopeGrad)" strokeWidth="6" strokeLinejoin="round" />
                            <path className="lightning-bolt" d="M85 35 L70 55 L90 55 L75 75" fill="none" stroke="url(#boltGrad)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                            <path className="envelope-flaps" d="M30 40 L85 75 L140 40" fill="none" stroke="url(#envelopeGrad)" strokeWidth="8" strokeLinejoin="round" />
                            <path className="stylized-e" d="M40 70 C 10 90, -10 50, 10 30 C 25 15, 45 20, 55 35 C 65 50, 45 75, 40 70 Z" fill="none" stroke="url(#eGrad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
                        </g>

                        <g className={`logo-text-group ${isDrawing ? 'animate-text' : ''}`} transform="translate(160, 85)">
                            <text className="text-enotice" x="0" y="0" fontFamily="'Outfit', sans-serif" fontWeight="700" fontSize="64" fill="#144C6A">e<tspan fill="#1E4559">Notice</tspan></text>
                            <text className="text-subtitle" x="5" y="30" fontFamily="'Outfit', sans-serif" fontWeight="600" fontSize="16" fill="#3A5B69" letterSpacing="1.5">PUBLIC NOTICES ONLINE</text>
                        </g>
                    </svg>
                </div>
            </div>
        </main>
    );
}
