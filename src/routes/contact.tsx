import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/store/info-page";
import { meta } from "@/lib/seo";
export const Route = createFileRoute("/contact")({ head: () => meta("تواصل معنا — Floukaa", "تواصلي مع فريق فلوكة."), component: () => <InfoPage title="تواصل معنا" items={[["العنوان", "بورسعيد، مصر"], ["ساعات العمل", "يوميًا من 11 صباحًا حتى 11 مساءً"], ["الطلبات", "تقدري تطلبي أونلاين ونوصلك لجميع المحافظات"]]} /> });
