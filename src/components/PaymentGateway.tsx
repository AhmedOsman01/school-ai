"use client";

import { useState } from "react";

interface Props {
    invoiceId: string;
    amount: number;
    invoiceNumber: string;
}

export default function PaymentGateway({ invoiceId, amount, invoiceNumber }: Props) {
    const [step, setStep] = useState(1); // 1: Method, 2: Details, 3: Success

    return (
        <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl border border-gray-100 max-w-md w-full animate-in fade-in zoom-in duration-300 rtl" dir="rtl">
            <div className="p-8 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-gray-50 pb-6">
                    <div>
                        <h3 className="text-2xl font-black text-gray-800">بوابة الدفع الإلكتروني</h3>
                        <p className="text-sm text-gray-400">فاتورة رقم: {invoiceNumber}</p>
                    </div>
                    <div className="text-left">
                        <p className="text-xs text-gray-400 font-bold uppercase">المبلغ الإجمالي</p>
                        <p className="text-2xl font-black text-blue-600">{amount.toLocaleString()} <span className="text-xs">ج.م</span></p>
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        <p className="text-sm font-bold text-gray-700 mb-4">اختر وسيلة الدفع المناسبة:</p>

                        <button onClick={() => setStep(2)} className="w-full p-4 rounded-2xl border-2 border-transparent bg-gray-50 hover:bg-blue-50 hover:border-blue-200 transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">💳</div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">بطاقة بنكية</p>
                                    <p className="text-xs text-gray-400">فيزا / ماستركارد / ميزة</p>
                                </div>
                            </div>
                            <span className="text-blue-500 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">←</span>
                        </button>

                        <button className="w-full p-4 rounded-2xl border-2 border-transparent bg-gray-50 hover:bg-orange-50 hover:border-orange-200 transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">📱</div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">محفظة إلكترونية</p>
                                    <p className="text-xs text-gray-400">فودافون كاش / اتصالات / غيرها</p>
                                </div>
                            </div>
                            <span className="text-orange-500 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all">←</span>
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600 block">رقم البطاقة</label>
                            <input type="text" placeholder="**** **** **** ****" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center font-mono text-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 block">تاريخ الانتهاء</label>
                                <input type="text" placeholder="MM/YY" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-600 block">رمز الأمان (CVV)</label>
                                <input type="text" placeholder="***" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-center focus:ring-2 focus:ring-blue-500 outline-none" />
                            </div>
                        </div>
                        <button onClick={() => setStep(3)} className="w-full bg-blue-600 text-white font-black p-5 rounded-2xl text-lg shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                            إتمام الدفع الآمن
                        </button>
                        <button onClick={() => setStep(1)} className="w-full text-center text-sm text-gray-400 font-bold hover:text-gray-600">
                            العودة لتغيير الوسيلة
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="text-center py-10 space-y-6 animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-5xl mx-auto shadow-inner">✓</div>
                        <div>
                            <h2 className="text-3xl font-black text-gray-800 mb-2">تم الدفع بنجاح!</h2>
                            <p className="text-gray-400">سيتم إرسال إيصال الدفع على هاتفك و بريدك الإلكتروني الآن.</p>
                        </div>
                        <button
                            onClick={() => window.location.href = '/dashboard/finance'}
                            className="w-full bg-gray-800 text-white font-bold p-5 rounded-2xl"
                        >
                            العودة لمحفظتك
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Branding */}
            <div className="bg-gray-50 p-6 flex justify-center items-center gap-6 opacity-50 grayscale hover:grayscale-0 transition-all grayscale-off">
                <span className="text-xs font-bold text-gray-400">Powered by EduFlow Pay</span>
                <div className="flex gap-4">
                    <span className="text-xl">💳</span>
                    <span className="text-xl">🔒</span>
                    <span className="text-xl">🇪🇬</span>
                </div>
            </div>
        </div>
    );
}
