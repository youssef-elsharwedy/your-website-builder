import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/store/info-page";
import { meta } from "@/lib/seo";
export const Route = createFileRoute("/faq")({ head: () => meta("الأسئلة الشائعة — Floukaa", "إجابات على أكثر الأسئلة عن الطلب والشحن."), component: () => <InfoPage title="الأسئلة الشائعة" items={[["بتشحنوا فين؟", "لجميع محافظات مصر."], ["الشحن بياخد قد إيه؟", "من 2 إلى 5 أيام عمل حسب المحافظة."], ["أقدر أدفع إزاي؟", "من صفحة الدفع الآمنة عند إتمام الطلب."]]} /> });
