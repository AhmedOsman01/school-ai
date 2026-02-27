import { auth } from "@/lib/auth";
import LiveTransportTracker from "@/components/LiveTransportTracker";

export default async function TransportPage() {
    const session = await auth();
    if (!session) return null;

    return (
        <div className="container mx-auto p-4 lg:p-10 space-y-10">
            <div className="max-w-4xl rtl" dir="rtl">
                <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">تتبع الحافلة المباشر</h1>
                <p className="text-xl text-gray-400">تابع حركة طفلك خطوة بخطوة لضمان وصوله بأمان</p>
            </div>

            <LiveTransportTracker />
        </div>
    );
}
