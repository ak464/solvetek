import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
    title: "اتصل بنا",
};

export default function ContactPage() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-6 font-heading">اتصل بنا</h1>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                        هل لديك استفسار؟ اقتراح لتطوير الموقع؟ أو واجهت مشكلة تقنية لم تجد حلها؟
                        نسعد بتواصلك معنا في أي وقت.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-gray-700">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                <Mail />
                            </div>
                            <div>
                                <p className="font-bold">البريد الإلكتروني</p>
                                <a href="mailto:support@saudi-help.com" className="dir-ltr block hover:text-blue-600">support@saudi-help.com</a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-gray-700">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                <Phone />
                            </div>
                            <div>
                                <p className="font-bold">واتساب فقط</p>
                                <span className="dir-ltr block">+966 50 000 0000</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                    <h2 className="text-xl font-bold mb-6">أرسل رسالة</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
                            <input type="text" className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
                            <input type="email" className="w-full h-11 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">الرسالة</label>
                            <textarea rows={4} className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
                        </div>
                        <button type="submit" className="w-full h-12 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
                            إرسال
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
