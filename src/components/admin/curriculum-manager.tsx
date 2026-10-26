"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Video,
} from "lucide-react";
import type { Lecture, Section } from "@/db/schema";

type LectureFormState = {
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  isFreePreview: boolean;
};

const emptyLectureForm: LectureFormState = {
  title: "",
  description: "",
  videoUrl: "",
  duration: 0,
  isFreePreview: false,
};

export function CurriculumManager({
  courseId,
  initialSections,
  initialLectures,
}: {
  courseId: number;
  initialSections: Section[];
  initialLectures: Lecture[];
}) {
  const router = useRouter();
  const [sections, setSections] = useState(initialSections);
  const [lectures, setLectures] = useState(initialLectures);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [addingSection, setAddingSection] = useState(false);

  const [openSectionId, setOpenSectionId] = useState<number | null>(initialSections[0]?.id ?? null);
  const [lectureFormSectionId, setLectureFormSectionId] = useState<number | null>(null);
  const [lectureForm, setLectureForm] = useState<LectureFormState>(emptyLectureForm);
  const [editingLectureId, setEditingLectureId] = useState<number | null>(null);
  const [savingLecture, setSavingLecture] = useState(false);

  async function addSection(e: FormEvent) {
    e.preventDefault();
    if (!newSectionTitle.trim()) return;
    setAddingSection(true);
    try {
      const res = await fetch("/api/admin/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, title: newSectionTitle, order: sections.length }),
      });
      const data = await res.json();
      if (res.ok) {
        setSections((prev) => [...prev, data.section]);
        setOpenSectionId(data.section.id);
        setNewSectionTitle("");
        router.refresh();
      }
    } finally {
      setAddingSection(false);
    }
  }

  async function deleteSection(id: number) {
    if (!confirm("حذف هذا القسم سيحذف جميع محاضراته أيضاً. متابعة؟")) return;
    const res = await fetch(`/api/admin/sections/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSections((prev) => prev.filter((s) => s.id !== id));
      setLectures((prev) => prev.filter((l) => l.sectionId !== id));
      router.refresh();
    }
  }

  function startAddLecture(sectionId: number) {
    setLectureFormSectionId(sectionId);
    setEditingLectureId(null);
    setLectureForm(emptyLectureForm);
  }

  function startEditLecture(lecture: Lecture) {
    setLectureFormSectionId(lecture.sectionId);
    setEditingLectureId(lecture.id);
    setLectureForm({
      title: lecture.title,
      description: lecture.description ?? "",
      videoUrl: lecture.videoUrl ?? "",
      duration: lecture.duration ?? 0,
      isFreePreview: lecture.isFreePreview,
    });
  }

  async function saveLecture(sectionId: number) {
    if (!lectureForm.title.trim()) return;
    setSavingLecture(true);
    try {
      if (editingLectureId) {
        const res = await fetch(`/api/admin/lectures/${editingLectureId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(lectureForm),
        });
        const data = await res.json();
        if (res.ok) {
          setLectures((prev) => prev.map((l) => (l.id === editingLectureId ? data.lecture : l)));
        }
      } else {
        const sectionLectureCount = lectures.filter((l) => l.sectionId === sectionId).length;
        const res = await fetch("/api/admin/lectures", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...lectureForm, sectionId, courseId, order: sectionLectureCount }),
        });
        const data = await res.json();
        if (res.ok) {
          setLectures((prev) => [...prev, data.lecture]);
        }
      }
      setLectureFormSectionId(null);
      setEditingLectureId(null);
      setLectureForm(emptyLectureForm);
      router.refresh();
    } finally {
      setSavingLecture(false);
    }
  }

  async function deleteLecture(id: number) {
    if (!confirm("هل تريد حذف هذه المحاضرة؟")) return;
    const res = await fetch(`/api/admin/lectures/${id}`, { method: "DELETE" });
    if (res.ok) {
      setLectures((prev) => prev.filter((l) => l.id !== id));
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={addSection} className="flex gap-2">
        <input
          value={newSectionTitle}
          onChange={(e) => setNewSectionTitle(e.target.value)}
          placeholder="عنوان القسم الجديد (مثال: الوحدة الأولى)"
          className="flex-1 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-400/15 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
        <button
          type="submit"
          disabled={addingSection}
          className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60 dark:bg-brand-500 dark:text-ink-950"
        >
          {addingSection ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          إضافة قسم
        </button>
      </form>

      {sections.length === 0 && (
        <p className="rounded-xl border border-dashed border-ink-200 p-6 text-center text-sm text-ink-400 dark:border-white/10">
          لا توجد أقسام بعد، أضف أول قسم للبدء بإضافة المحاضرات.
        </p>
      )}

      <div className="space-y-3">
        {sections.map((section) => {
          const sectionLectures = lectures.filter((l) => l.sectionId === section.id);
          const isOpen = openSectionId === section.id;
          return (
            <div key={section.id} className="overflow-hidden rounded-2xl border border-ink-200/60 dark:border-white/10">
              <button
                onClick={() => setOpenSectionId(isOpen ? null : section.id)}
                className="flex w-full items-center justify-between bg-ink-50 px-5 py-3.5 text-right dark:bg-white/5"
              >
                <span className="font-bold text-ink-900 dark:text-white">{section.title}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-ink-400">{sectionLectures.length} محاضرة</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSection(section.id);
                    }}
                    className="grid h-7 w-7 place-items-center rounded-lg text-ink-400 hover:bg-rose-100 hover:text-rose-500 dark:hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-ink-400" /> : <ChevronDown className="h-4 w-4 text-ink-400" />}
                </div>
              </button>

              {isOpen && (
                <div className="divide-y divide-ink-100 dark:divide-white/5">
                  {sectionLectures.map((lecture) => (
                    <div key={lecture.id} className="px-5 py-3.5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 text-sm">
                          <Video className="h-4 w-4 shrink-0 text-ink-400" />
                          <span className="text-ink-700 dark:text-ink-200">{lecture.title}</span>
                          {lecture.isFreePreview && (
                            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                              معاينة مجانية
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-ink-400">{lecture.duration} د</span>
                          <button
                            onClick={() => startEditLecture(lecture)}
                            className="grid h-7 w-7 place-items-center rounded-lg border border-ink-200 text-ink-500 hover:border-brand-400 hover:text-brand-600 dark:border-white/10"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteLecture(lecture.id)}
                            className="grid h-7 w-7 place-items-center rounded-lg border border-ink-200 text-ink-500 hover:border-rose-300 hover:text-rose-500 dark:border-white/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {lectureFormSectionId === section.id ? (
                    <div className="space-y-3 bg-ink-50/50 px-5 py-4 dark:bg-white/[0.02]">
                      <input
                        value={lectureForm.title}
                        onChange={(e) => setLectureForm((f) => ({ ...f, title: e.target.value }))}
                        placeholder="عنوان المحاضرة"
                        className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      />
                      <textarea
                        value={lectureForm.description}
                        onChange={(e) => setLectureForm((f) => ({ ...f, description: e.target.value }))}
                        placeholder="وصف مختصر (اختياري)"
                        rows={2}
                        className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                      />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <input
                          dir="ltr"
                          value={lectureForm.videoUrl}
                          onChange={(e) => setLectureForm((f) => ({ ...f, videoUrl: e.target.value }))}
                          placeholder="رابط الفيديو (يوتيوب/فيميو/mp4)"
                          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                        <input
                          type="number"
                          min={0}
                          value={lectureForm.duration}
                          onChange={(e) => setLectureForm((f) => ({ ...f, duration: Number(e.target.value) }))}
                          placeholder="المدة بالدقائق"
                          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-400 dark:border-white/10 dark:bg-white/5 dark:text-white"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-xs font-semibold text-ink-600 dark:text-ink-300">
                        <input
                          type="checkbox"
                          checked={lectureForm.isFreePreview}
                          onChange={(e) => setLectureForm((f) => ({ ...f, isFreePreview: e.target.checked }))}
                          className="h-4 w-4 accent-brand-500"
                        />
                        اجعلها معاينة مجانية لغير المسجّلين
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveLecture(section.id)}
                          disabled={savingLecture}
                          className="inline-flex items-center gap-2 rounded-xl bg-ink-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-60 dark:bg-brand-500 dark:text-ink-950"
                        >
                          {savingLecture ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                          حفظ المحاضرة
                        </button>
                        <button
                          onClick={() => {
                            setLectureFormSectionId(null);
                            setEditingLectureId(null);
                          }}
                          className="rounded-xl border border-ink-200 px-4 py-2 text-xs font-bold text-ink-600 dark:border-white/10 dark:text-ink-300"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => startAddLecture(section.id)}
                      className="flex w-full items-center justify-center gap-2 px-5 py-3.5 text-xs font-bold text-brand-600 hover:bg-brand-500/5"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      إضافة محاضرة لهذا القسم
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
