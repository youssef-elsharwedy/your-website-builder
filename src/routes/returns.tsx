import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/store/info-page";
import { meta } from "@/lib/seo";
export const Route = createFileRoute("/returns")({ head: () => meta("الاستبدال والاسترجاع — Floukaa", "سياسة الاستبدال والاسترجاع في فلوكة."), component: () => <InfoPage title="الاستبدال والاسترجاع" items={[["الاستبدال", "متاح خلال 14 يوم من الاستلام بشرط إن القطعة بحالتها الأصلية."], ["الاسترجاع", "تواصلي معانا وهنساعدك في أسرع وقت."]]} /> });
