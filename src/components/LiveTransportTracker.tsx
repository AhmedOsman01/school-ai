"use client";

import { useState, useEffect, useMemo } from "react";

interface Stop {
    name: string;
    nameAr: string;
    isCompleted: boolean;
    time: string;
}

interface BusInfo {
    id: string;
    number: string;
    plate: string;
    driver: string;
    speed: number;
    lastUpdate: string;
    status: "on_track" | "delayed" | "stopped";
}

export default function LiveTransportTracker() {
    const [progress, setProgress] = useState(35); // Simulated bus progress (0-100)
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        // Simulate bus movement
        const moveTimer = setInterval(() => setProgress(p => (p >= 100 ? 0 : p + 0.1)), 500);
        return () => {
            clearInterval(timer);
            clearInterval(moveTimer);
        };
    }, []);

    const bus: BusInfo = {
        id: "B01",
        number: "Bus 12",
        plate: "أ ب ج 1234",
        driver: "عماد الدين محمد",
        speed: 42,
        lastUpdate: currentTime.toLocaleTimeString('ar-EG'),
        status: "on_track",
    };

    const stops: Stop[] = [
        { name: "Maadi Station", nameAr: "محطة المعادي", isCompleted: true, time: "07:15 ص" },
        { name: "Degla Square", nameAr: "ميدان دجلة", isCompleted: true, time: "07:30 ص" },
        { name: "Victoria Square", nameAr: "ميدان فيكتوريا", isCompleted: false, time: "07:45 ص" },
        { name: "School Gate", nameAr: "بوابة المدرسة", isCompleted: false, time: "08:10 ص" },
    ];

    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 rtl" dir="rtl">
            {/* Simulation Map View */}
            <div className="xl:col-span-3 h-[600px] bg-slate-100 rounded-[40px] relative overflow-hidden shadow-inner border-4 border-white">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/31.2357,30.0444,13/800x600?access_token=none')] bg-cover opacity-50 grayscale"></div>

                {/* Route Line Simulation */}
                <svg className="absolute inset-0 w-full h-full">
                    <path d="M 100 500 Q 400 300 700 100" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 100 500 Q 400 300 700 100" fill="none" stroke="#3b82f6" strokeWidth="8" strokeLinecap="round" strokeDasharray="1000" strokeDashoffset={1000 - (10 * progress)} />
                </svg>

                {/* Moving Bus Icon */}
                <div
                    className="absolute transition-all duration-500 ease-linear"
                    style={{
                        left: `${100 + (600 * progress / 100)}px`,
                        top: `${500 - (400 * progress / 100)}px`,
                        transform: 'translate(-50%, -100%)'
                    }}
                >
                    <div className="relative">
                        <div className="bg-blue-600 text-white p-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
                            🚌 <span className="font-bold text-xs whitespace-nowrap">{bus.number}</span>
                        </div>
                        <div className="w-4 h-4 bg-blue-600 rotate-45 mx-auto -mt-2 shadow-lg"></div>
                    </div>
                </div>

                {/* Map Overlay HUD */}
                <div className="absolute top-6 left-6 right-6 flex justify-between">
                    <div className="bg-white/80 backdrop-blur-xl p-4 rounded-3xl shadow-xl border border-white/50 flex items-center gap-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">تحديث مباشر</p>
                            <p className="text-sm font-black text-gray-800">{bus.lastUpdate}</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <div className="bg-white/80 backdrop-blur-xl px-6 py-4 rounded-3xl shadow-xl border border-white/50">
                            <p className="text-[10px] text-gray-400 font-bold mb-1">السرعة</p>
                            <p className="text-xl font-black text-blue-600">{bus.speed} <span className="text-xs text-gray-400">كم/س</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar - Route Progress */}
            <div className="space-y-6">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
                    <h3 className="text-xl font-black mb-6 text-gray-800">خط السير</h3>
                    <div className="space-y-8 relative">
                        {/* Vertical Line */}
                        <div className="absolute top-2 bottom-2 right-4 w-1 bg-gray-100 rounded-full"></div>
                        <div className="absolute top-2 right-4 w-1 bg-blue-500 rounded-full transition-all" style={{ height: `${progress}%` }}></div>

                        {stops.map((stop, i) => (
                            <div key={i} className="relative pr-10">
                                <div className={`absolute top-1 right-2.5 w-4 h-4 rounded-full border-4 border-white shadow-md z-10 ${stop.isCompleted ? 'bg-blue-500' : 'bg-gray-200'
                                    }`}></div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className={`font-bold transition-colors ${stop.isCompleted ? 'text-blue-600' : 'text-gray-400'}`}>
                                            {stop.nameAr}
                                        </h4>
                                        <p className="text-[10px] text-gray-400">{stop.name}</p>
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">{stop.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Driver Info Card */}
                <div className="bg-indigo-900 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
                    <p className="text-blue-200 text-xs font-bold mb-4 uppercase tracking-[0.2em]">بيانات السائق</p>
                    <h4 className="text-2xl font-black mb-1">{bus.driver}</h4>
                    <p className="text-blue-300 text-sm mb-6">{bus.plate}</p>
                    <button className="w-full bg-white/10 hover:bg-white/20 p-4 rounded-2xl flex items-center justify-center gap-3 transition-all font-bold">
                        📞 اتصل بالسائق
                    </button>
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                </div>
            </div>
        </div>
    );
}
