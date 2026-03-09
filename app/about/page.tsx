export const metadata = {
    title: "من نحن",
};

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="bg-card p-8 md:p-12 rounded-[2.5rem] border border-border shadow-sm">
                <h1 className="text-4xl font-black mb-8 text-foreground">من نحن</h1>

                <div className="prose prose-lg dark:prose-invert leading-loose">
                <p>
                    مرحباً بك في <strong>SolveTek</strong>، منصتك الأولى والوجهة الموثوقة لحل جميع المشاكل التقنية التي تواجه المستخدمين في المملكة العربية السعودية.
                </p>
                <p>
                    نحن فريق من التقنيين السعوديين الشغوفين بتبسيط التكنولوجيا. لاحظنا الفجوة الكبيرة في المحتوى التقني العربي، وخاصة فيما يتعلق بحل المشاكل المحلية (مثل إعدادات شركات الاتصالات، الخدمات الحكومية الرقمية، ومشاكل الأجهزة الشائعة في منطقتنا).
                </p>

                <h3>رؤيتنا</h3>
                <p>
                    تمكين كل مستخدم سعودي من حل مشاكله التقنية بنفسه، بسرعة وسهولة، دون الحاجة للذهاب إلى محلات الصيانة أو انتظار ساعات طويلة على الهاتف.
                </p>

                <h3>ماذا نقدم؟</h3>
                <ul>
                    <li>شروحات مصورة خطوة بخطوة.</li>
                    <li>حلول لمشاكل شركات الاتصالات (STC, Mobily, Zain).</li>
                    <li>أدلة استخدام للخدمات الحكومية (نفاذ، أبشر، توكلنا).</li>
                    <li>مراجعات صادقة للأجهزة والملحقات.</li>
                </ul>
                </div>
            </div>
        </div>
    );
}
