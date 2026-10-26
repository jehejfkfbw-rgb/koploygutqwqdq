import Link from "next/link";
import { Camera, Globe, MessageCircle, Send } from "lucide-react";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-ink-200/60 bg-white/60 dark:border-white/10 dark:bg-ink-950/60">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-7 text-ink-500 dark:text-ink-300">
              منصة نبراس التعليمية — نضيء طريق التعلّم للطلاب العرب في كل مكان بمحتوى عالمي الجودة.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {[Globe, Camera, MessageCircle, Send].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full border border-ink-200 text-ink-500 transition hover:border-brand-400 hover:text-brand-500 dark:border-white/10 dark:text-ink-300"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold text-ink-900 dark:text-white">المنصة</h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-500 dark:text-ink-300">
              <li><Link href="/courses" className="hover:text-brand-500">جميع الدورات</Link></li>
              <li><Link href="/signup" className="hover:text-brand-500">إنشاء حساب</Link></li>
              <li><Link href="/login" className="hover:text-brand-500">تسجيل الدخول</Link></li>
              <li><Link href="/dashboard" className="hover:text-brand-500">لوحة الطالب</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-ink-900 dark:text-white">عن نبراس</h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-500 dark:text-ink-300">
              <li><Link href="/#about" className="hover:text-brand-500">رؤيتنا</Link></li>
              <li><Link href="/#features" className="hover:text-brand-500">مميزاتنا</Link></li>
              <li><a href="#" className="hover:text-brand-500">الشروط والأحكام</a></li>
              <li><a href="#" className="hover:text-brand-500">سياسة الخصوصية</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-ink-900 dark:text-white">تواصل معنا</h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-500 dark:text-ink-300">
              <li>support@nebras.edu</li>
              <li dir="ltr" className="text-right">+971 50 000 0000</li>
              <li>متاحون على مدار الساعة لخدمتكم</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink-200/60 pt-6 text-xs text-ink-400 sm:flex-row dark:border-white/10">
          <p>© {new Date().getFullYear()} نبراس Nebras. جميع الحقوق محفوظة.</p>
          <p>صُنع بشغف لخدمة التعليم العربي 🌙</p>
        </div>
      </div>
    </footer>
  );
}
