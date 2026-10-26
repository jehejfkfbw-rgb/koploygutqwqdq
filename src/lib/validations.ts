import { z } from "zod";

export const signupSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "الاسم الكامل يجب أن يحتوي على 3 أحرف على الأقل")
    .max(100, "الاسم طويل جداً"),
  email: z.string().trim().toLowerCase().email("البريد الإلكتروني غير صحيح"),
  phone: z
    .string()
    .trim()
    .min(8, "رقم الهاتف غير صحيح")
    .max(20, "رقم الهاتف غير صحيح")
    .regex(/^[0-9+\s-]+$/, "رقم الهاتف يجب أن يحتوي على أرقام فقط"),
  gradeLevel: z.string().trim().min(1, "الرجاء اختيار السن أو المرحلة الدراسية"),
  password: z
    .string()
    .min(8, "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل")
    .max(72, "كلمة المرور طويلة جداً"),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("البريد الإلكتروني غير صحيح"),
  password: z.string().min(1, "الرجاء إدخال كلمة المرور"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const courseSchema = z.object({
  title: z.string().trim().min(3, "عنوان الدورة قصير جداً"),
  slug: z
    .string()
    .trim()
    .min(3, "الرابط قصير جداً")
    .regex(/^[a-z0-9-]+$/, "الرابط يجب أن يحتوي على حروف إنجليزية صغيرة وأرقام وشرطات فقط"),
  description: z.string().trim().min(10, "الوصف قصير جداً"),
  category: z.string().trim().min(2, "الرجاء إدخال التصنيف"),
  level: z.string().trim().min(2, "الرجاء إدخال المستوى"),
  instructorName: z.string().trim().min(2, "الرجاء إدخال اسم المحاضر"),
  coverImage: z.string().trim().optional().or(z.literal("")),
  price: z.coerce.number().int().min(0, "السعر لا يمكن أن يكون سالباً"),
  isPublished: z.boolean().optional(),
});

export type CourseInput = z.infer<typeof courseSchema>;

export const sectionSchema = z.object({
  courseId: z.coerce.number().int().positive(),
  title: z.string().trim().min(2, "عنوان القسم قصير جداً"),
  order: z.coerce.number().int().min(0).optional(),
});

export const lectureSchema = z.object({
  sectionId: z.coerce.number().int().positive(),
  courseId: z.coerce.number().int().positive(),
  title: z.string().trim().min(2, "عنوان المحاضرة قصير جداً"),
  description: z.string().trim().optional().or(z.literal("")),
  videoUrl: z.string().trim().optional().or(z.literal("")),
  duration: z.coerce.number().int().min(0).optional(),
  order: z.coerce.number().int().min(0).optional(),
  isFreePreview: z.boolean().optional(),
});
