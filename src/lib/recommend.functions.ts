import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getProducts, type ShopifyProduct } from "./shopify";

export type Recommendation = { product: ShopifyProduct; reason: string };
export type RecommendResult = { intro: string; items: Recommendation[]; error?: string };

const schema = {
  type: "object",
  additionalProperties: false,
  required: ["intro", "picks"],
  properties: {
    intro: { type: "string" },
    picks: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["handle", "reason"],
        properties: { handle: { type: "string" }, reason: { type: "string" } },
      },
    },
  },
};

export const recommendProducts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ request: z.string().trim().min(2).max(500) }).parse(d))
  .handler(async ({ data }): Promise<RecommendResult> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { intro: "", items: [], error: "خدمة المساعدة غير مهيأة حاليًا." };
    const catalog = await getProducts(100, "tag:new");
    const list = catalog.map((p) => ({
      handle: p.handle, title: p.title, type: p.productType, tags: p.tags,
      price: `${p.priceRange.minVariantPrice.amount} ${p.priceRange.minVariantPrice.currencyCode}`,
      description: p.description.slice(0, 200),
    }));
    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "fetch" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        store: false,
        reasoning: { effort: "low", summary: "auto" },
        include: ["reasoning.encrypted_content"],
        instructions:
          "You are a friendly shopping assistant for FLOUKAA, an Egyptian accessories and gifts store. Recommend up to 6 products from the catalog that best match the shopper's request, using only handles that appear in the catalog. Write intro (one short sentence) and each reason (one short sentence) in Egyptian Arabic, addressing the shopper in feminine form. If nothing fits, return an empty picks array and say so kindly in intro.",
        input: `Catalog:\n${JSON.stringify(list)}\n\nShopper request: ${data.request}`,
        text: { format: { type: "json_schema", name: "recommendations", strict: true, schema } },
      }),
    });
    if (!res.ok || !res.body) {
      const msg = res.status === 429 ? "الطلب كثير حاليًا، جرّبي بعد قليل." : res.status === 402 ? "رصيد المساعد الذكي نفد مؤقتًا." : "تعذر الحصول على اقتراحات الآن.";
      return { intro: "", items: [], error: msg };
    }
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "", text = "", refused = false;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const frames = buf.split("\n\n");
      buf = frames.pop() ?? "";
      for (const f of frames) {
        for (const line of f.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const ev = JSON.parse(payload);
            if (ev.type === "response.output_text.delta") text += ev.delta;
            else if (ev.type === "response.refusal.delta") refused = true;
          } catch { /* partial */ }
        }
      }
    }
    if (refused || !text) return { intro: "", items: [], error: "لم نتمكن من اقتراح منتجات لهذا الطلب." };
    try {
      const parsed = JSON.parse(text) as { intro: string; picks: { handle: string; reason: string }[] };
      const byHandle = new Map(catalog.map((p) => [p.handle, p]));
      const items = parsed.picks
        .map((p) => ({ product: byHandle.get(p.handle), reason: p.reason }))
        .filter((x): x is Recommendation => !!x.product)
        .slice(0, 6);
      return { intro: parsed.intro, items };
    } catch {
      return { intro: "", items: [], error: "تعذر قراءة الاقتراحات، جرّبي مرة أخرى." };
    }
  });
