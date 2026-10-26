import type { Metadata } from "next";
import { listStages } from "@/lib/data";
import { ResourceManager, StatusBadge, type ColumnDef, type FieldDef } from "@/components/admin/resource-manager";
import { BroadcastComposer } from "@/components/admin/broadcast-composer";
import { IconLamp } from "@/components/icons";
import { Badge } from "@/components/ui";
import { formatDateTime, relativeTime } from "@/lib/utils";
import { CountryFlag } from "@/components/country-flag";
import { COUNTRY_LIST, getCountry } from "@/lib/countries";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "الرسائل والإعلانات" };

const MSG_STATUS = {
  new: { label: "جديد", tone: "gold" },
  read: { label: "مقروء", tone: "navy" },
  replied: { label: "تم الرد", tone: "success" },
} as const;

export default async function AdminMessagesPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const sp = await searchParams;
  const stageRows = await listStages();

  const messageFields: FieldDef[] = [
    { name: "name", label: "اسم المرسل", type: "text", required: true },
    { name: "email", label: "البريد الإلكتروني", type: "email", required: true },
    { name: "subject", label: "الموضوع", type: "text", required: true },
    { name: "message", label: "نص الرسالة", type: "richtext", required: true },
    { name: "country", label: "الدولة", type: "select", options: COUNTRY_LIST.map((c) => ({ value: c.code, label: c.nameAr })) },
    { name: "status", label: "حالة المعالجة", type: "select", options: [{ value: "new", label: "جديد" }, { value: "read", label: "مقروء" }, { value: "replied", label: "تم الرد" }], defaultValue: "new" },
  ];

  const messageColumns: ColumnDef[] = [
    {
      key: "subject",
      label: "الرسالة",
      render: (row) => (
        <div className="min-w-0 max-w-md">
          <p className="truncate font-bold text-navy-800">{String(row.subject)}</p>
          <p className="truncate text-xs font-semibold text-mist-500">{String(row.name)} · <span dir="ltr">{String(row.email)}</span></p>
          <p className="mt-1 line-clamp-2 text-xs leading-6 text-mist-600">{String(row.message)}</p>
        </div>
      ),
    },
    {
      key: "country",
      label: "الدولة",
      hideOnMobile: true,
      render: (row) => (
        <span className="inline-flex items-center gap-1.5">
          <CountryFlag code={String(row.country ?? "")} className="h-3.5 w-5" />
          <span className="text-xs font-bold">{row.country ? getCountry(String(row.country)).nameAr : "—"}</span>
        </span>
      ),
    },
    { key: "status", label: "الحالة", render: (row) => <StatusBadge value={row.status} map={MSG_STATUS} /> },
    { key: "createdAt", label: "الاستلام", hideOnMobile: true, render: (row) => relativeTime(String(row.createdAt)) },
  ];

  const announcementFields: FieldDef[] = [
    { name: "title", label: "عنوان الإعلان", type: "text", required: true },
    { name: "body", label: "نص الإعلان", type: "richtext", required: true },
    { name: "audience", label: "الجمهور", type: "select", options: [{ value: "all", label: "الجميع" }, { value: "students", label: "الطلاب" }, { value: "teachers", label: "المعلمون" }], defaultValue: "all" },
    { name: "stageId", label: "مرحلة محدّدة (اختياري)", type: "select", options: stageRows.map((s) => ({ value: s.id, label: s.name })) },
    { name: "isPublished", label: "منشور", type: "boolean", defaultValue: true },
  ];

  const announcementColumns: ColumnDef[] = [
    {
      key: "title",
      label: "الإعلان",
      render: (row) => (
        <div className="min-w-0 max-w-md">
          <p className="truncate font-bold text-navy-800">{String(row.title)}</p>
          <p className="mt-0.5 line-clamp-2 text-xs leading-6 text-mist-600">{String(row.body)}</p>
        </div>
      ),
    },
    { key: "audience", label: "الجمهور", render: (row) => <Badge tone="navy">{row.audience === "all" ? "الجميع" : row.audience === "students" ? "الطلاب" : "المعلمون"}</Badge> },
    { key: "isPublished", label: "الحالة", render: (row) => <Badge tone={row.isPublished ? "success" : "muted"}>{row.isPublished ? "منشور" : "مسودة"}</Badge> },
    { key: "publishedAt", label: "تاريخ النشر", hideOnMobile: true, render: (row) => formatDateTime(String(row.publishedAt)) },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-[1.6rem] font-extrabold text-navy-800">الرسائل والإعلانات</h1>
        <p className="mt-1.5 text-sm text-mist-600">
          تابع رسائل الزوار الواردة من صفحة «تواصل معنا»، وانشر إعلانات تصل للطلاب في لوحة تقدمهم والصفحة الرئيسية.
          {sp.message ? <span className="mr-2 font-bold text-success">{sp.message}</span> : null}
        </p>
      </div>

      <BroadcastComposer />

      <ResourceManager
        entity="broadcasts"
        title="سجلّ البثّات الفورية"
        description="كل رسالة بُثّت للمستخدمين مع مدة الظهور وعدد المشاهدات وحالة البثّ."
        createLabel="بثّ جديد"
        fields={[
          { name: "message", label: "نص الرسالة", type: "textarea", required: true, hint: "٢٨٠ حرفًا كحد أقصى" },
          { name: "tone", label: "اللون", type: "select", options: [{ value: "gold", label: "ذهبي" }, { value: "info", label: "أزرق" }, { value: "success", label: "أخضر" }, { value: "urgent", label: "أحمر عاجل" }], defaultValue: "gold" },
          { name: "durationSeconds", label: "مدة الظهور (ثانية)", type: "number", defaultValue: 10 },
          { name: "activeForMinutes", label: "نافذة التسليم (دقيقة)", type: "number", defaultValue: 15, createOnly: true },
          { name: "isActive", label: "بثّ حيّ", type: "boolean", defaultValue: true },
        ]}
        columns={[
          {
            key: "message",
            label: "الرسالة",
            render: (row) => (
              <div className="min-w-0 max-w-md">
                <p className="flex items-center gap-2 font-bold text-navy-800">
                  <IconLamp className="h-4 w-4 shrink-0 text-gold-600" />
                  <span className="truncate">{String(row.message)}</span>
                </p>
                <p className="mt-0.5 text-xs font-semibold text-mist-500">بواسطة {String(row.createdByName ?? "—")}</p>
              </div>
            ),
          },
          { key: "durationSeconds", label: "المدة", render: (row) => <Badge tone="navy">{String(row.durationSeconds)} ثانية</Badge> },
          { key: "views", label: "المشاهدات", render: (row) => <b className="tabular-nums text-navy-800">{String(row.views ?? 0)}</b> },
          { key: "isActive", label: "الحالة", render: (row) => (
            <Badge tone={row.isActive ? "success" : "muted"}>{row.isActive ? "حيّ" : "منتهي"}</Badge>
          ) },
          { key: "createdAt", label: "أُرسل في", hideOnMobile: true, render: (row) => relativeTime(String(row.createdAt)) },
        ]}
        pageSize={8}
      />

      <ResourceManager
        entity="announcements"
        title="إعلانات المنصة"
        description="تظهر الإعلانات المنشورة في الصفحة الرئيسية ولوحة الطالب."
        createLabel="إعلان جديد"
        fields={announcementFields}
        columns={announcementColumns}
        pageSize={8}
      />

      <ResourceManager
        entity="contactMessages"
        title="رسائل التواصل الواردة"
        description="حدّث حالة كل رسالة (جديد ← مقروء ← تم الرد) لمتابعة بلاغات المستخدمين."
        createLabel="إضافة رسالة يدويًا"
        fields={messageFields}
        columns={messageColumns}
        pageSize={8}
        filters={[
          { name: "status", label: "كل الحالات", options: [{ value: "new", label: "جديد" }, { value: "read", label: "مقروء" }, { value: "replied", label: "تم الرد" }] },
          { name: "country", label: "كل الدول", options: COUNTRY_LIST.map((c) => ({ value: c.code, label: c.nameAr })) },
        ]}
      />
    </div>
  );
}
