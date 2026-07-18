import customtkinter as ctk
import cv2
from PIL import Image, ImageTk

# إعدادات الواجهة الاحترافية
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")

class ProTikTokApp(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Mohamed Adel - Pro Short Videos")
        self.geometry("450x800")
        
        # --- الواجهة ---
        # المنطقة الرئيسية للفيديو
        self.video_frame = ctk.CTkFrame(self, fg_color="black", corner_radius=20)
        self.video_frame.pack(pady=20, padx=20, fill="both", expand=True)
        
        self.label_display = ctk.CTkLabel(self.video_frame, text="استعد لعرض الفيديو...", text_color="white")
        self.label_display.pack(expand=True)

        # شريط الأزرار الجانبي (على يمين الفيديو)
        self.sidebar = ctk.CTkFrame(self, fg_color="transparent")
        self.sidebar.place(relx=0.85, rely=0.3)

        # الأزرار الاحترافية
        self.btn_like = ctk.CTkButton(self.sidebar, text="❤️", width=50, height=50, corner_radius=25, command=self.like_action)
        self.btn_like.pack(pady=10)

        self.btn_share = ctk.CTkButton(self.sidebar, text="📤", width=50, height=50, corner_radius=25, command=self.share_action)
        self.btn_share.pack(pady=10)

        self.btn_profile = ctk.CTkButton(self.sidebar, text="👤", width=50, height=50, corner_radius=25, command=self.profile_action)
        self.btn_profile.pack(pady=10)

    # --- المهام البرمجية ---
    def like_action(self):
        print("تم تسجيل الإعجاب")
        self.btn_like.configure(fg_color="red")

    def share_action(self):
        print("جاري فتح قائمة المشاركة...")

    def profile_action(self):
        print("فتح الملف الشخصي للمستخدم")

if __name__ == "__main__":
    app = ProTikTokApp()
    app.mainloop()
