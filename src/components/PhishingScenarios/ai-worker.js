export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Only allow /description
    if (url.pathname !== "/description") {
      return withCors(new Response("Not Found", { status: 404 }));
    }

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    if (request.method !== "POST") {
      return withCors(new Response("Method Not Allowed", { status: 405 }));
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ description: "" }, 400);
    }

    const type = (body?.type ?? "training").trim().toLowerCase();
    const name = humanizeLabel((body?.name ?? "").trim());
    const category = humanizeLabel((body?.category ?? "").trim());
    const role = humanizeLabel((body?.role ?? "").trim());
    const method = humanizeLabel((body?.method ?? "").trim());
    const difficulty = humanizeLabel((body?.difficulty ?? "").trim());
    const existingDescription = (body?.description ?? "").trim();

    // Simulation types (phishing/quishing/smishing) use the type-aware prompts below.
    // Training — and ANY unknown type — keeps the ORIGINAL prompt verbatim, so the
    // production training behaviour stays exactly as it was.
    const cfg = PROMPT_CONFIGS[type];

    let systemPrompt;
    let contextLines;
    let userPrompt;

    if (!cfg) {
      // ===== ORIGINAL TRAINING PROMPT — pinned verbatim, do NOT change (prod-critical) =====
      systemPrompt = `
You are a professional copywriter creating short descriptions for an education and training platform.

LANGUAGE RULE (CRITICAL):
- If an OLD description is provided, you MUST write the final output in the SAME language as the old description.
- If NO old description is provided:
  - Infer the language primarily from the Name, then Category, then Target audience (role).
  - If any of these fields are clearly in a specific language (e.g., Turkish), you MUST write in that language.
  - If they are mixed/unclear, default to English.
- Do NOT mention the language, do NOT add explanations, labels, or meta text.
- Output ONLY the final description sentence.


Your task is to write a concise course description similar in tone and structure to this example:
"In this cyber security awareness training, you will learn how executives are phished via fake websites. You will also learn whaling, a phishing technique targeting executives, and best practices to prevent phishing attacks."

Writing guidelines:
- Write in clear, professional language
- Focus on what the learner will learn or gain from the training
- Prefer 160–240 characters, never exceed 256 characters
- The text must clearly describe a training, course, learning, or education context
- Include at least ONE of these words or their natural equivalent in the detected language: training, learning, education, course, awareness
- If Name, Category, or Target audience are provided, the description MUST reflect them
- When updating an existing description, prioritize new details over old wording if they conflict
- Do NOT mention: workflow, innovative solution, AI assistant, rewritten sentence, here is
- Do NOT use emojis, markdown, bullet points, or line breaks
- Write only ONE sentence

Output only the final description text.
`.trim();

      contextLines = [
        name ? `Name: ${name}` : "",
        category ? `Category: ${category}` : "",
        role ? `Target audience: ${role}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      userPrompt = existingDescription
        ? `
Update the description to match the NEW course details below.
If the old description conflicts with the new details, rewrite it to fit the new details.
If the old description is too generic or irrelevant, rewrite it completely.
Keep it a single sentence and within the character limits.

NEW DETAILS:
${contextLines || "No additional details provided."}

OLD DESCRIPTION:
"${existingDescription}"
`.trim()
        : `
Write a single-sentence description for an education or training platform.

${contextLines}
`.trim();
    } else {
      // ===== Simulation types: phishing / quishing / smishing =====
      systemPrompt = buildSystemPrompt(cfg);

      contextLines = [
        name ? `Name: ${name}` : "",
        category ? `${cfg.categoryLabel}: ${category}` : "",
        method ? `Method: ${method}` : "",
        difficulty ? `Difficulty: ${difficulty}` : "",
        role ? `Target audience: ${role}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      userPrompt = existingDescription
        ? `
Update the description to match the NEW details below.
If the old description conflicts with the new details, rewrite it to fit the new details.
If the old description is too generic or irrelevant, rewrite it completely.
Keep it a single sentence and within the character limits.

NEW DETAILS:
${contextLines || "No additional details provided."}

OLD DESCRIPTION:
"${existingDescription}"
`.trim()
        : `
Write a single-sentence description for ${cfg.platform}.

${contextLines}
`.trim();
    }

    let output = "";

    try {
      const r = await env.AI.run("@cf/openai/gpt-oss-20b", {
        input: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      });

      output = extractTextFromWorkersAI(r);
    } catch (e) {
      return json(
        { description: "", error: (e && (e.message || e.toString())) || "AI.run failed" },
        500
      );
    }

    return json({
      description: sanitizeSingleSentence(output),
    });
  },
};

/* -------------------- prompt configs (simulation types only) -------------------- */

// Only the phishing-simulation content types live here. Training is intentionally
// NOT in this map: an absent config routes to the original training prompt above.
const PROMPT_CONFIGS = {
  phishing: {
    platform: "a phishing simulation library used in security awareness programs",
    categoryLabel: "Category",
    task:
      "write a concise description of what a phishing email simulation tests and how it helps train employees",
    example:
      "This phishing simulation mimics a fake Microsoft login page to test whether employees recognise credential-harvesting emails and report them as part of security awareness training.",
    focus: "Focus on what the simulation tests and how it strengthens employee awareness",
    contextRule:
      "The text must clearly describe a phishing simulation used for security awareness, not real attack instructions",
    requiredWords: "phishing simulation, security awareness, simulation",
    safetyRule:
      "Describe the simulation for defensive security-awareness training only; never include step-by-step attack instructions",
    methodNote:
      'If the Method is "Double Barrel", the simulation uses two emails — a benign lure email that first builds trust, followed by a malicious payload email; reflect this two-stage lure-and-payload approach in the description.',
  },
  quishing: {
    platform: "a quishing (QR-code phishing) simulation library used in security awareness programs",
    categoryLabel: "Quishing type",
    task:
      "write a concise description of what a QR-code phishing (quishing) simulation tests and how it helps train employees",
    example:
      "This quishing simulation embeds a malicious QR code in an email to test whether employees scan untrusted codes, reinforcing security awareness training.",
    focus: "Focus on what the simulation tests and how it strengthens employee awareness",
    contextRule:
      "The text must clearly describe a quishing (QR-code phishing) simulation used for security awareness, not real attack instructions",
    requiredWords: "quishing simulation, QR code, security awareness",
    safetyRule:
      "Describe the simulation for defensive security-awareness training only; never include step-by-step attack instructions",
  },
  smishing: {
    platform: "a smishing (SMS phishing) simulation library used in security awareness programs",
    categoryLabel: "Category",
    task:
      "write a concise description of what an SMS phishing (smishing) simulation tests and how it helps train employees",
    example:
      "This smishing simulation sends a fraudulent SMS urging users to tap a link, testing mobile phishing awareness as part of security training.",
    focus: "Focus on what the simulation tests and how it strengthens employee awareness",
    contextRule:
      "The text must clearly describe a smishing (SMS phishing) simulation used for security awareness, not real attack instructions",
    requiredWords: "smishing simulation, SMS, security awareness",
    safetyRule:
      "Describe the simulation for defensive security-awareness training only; never include step-by-step attack instructions",
  },
};

function buildSystemPrompt(cfg) {
  return `
You are a professional copywriter creating short descriptions for ${cfg.platform}.

LANGUAGE RULE (CRITICAL):
- If an OLD description is provided, you MUST write the final output in the SAME language as the old description.
- If NO old description is provided:
  - Infer the language primarily from the Name, then ${cfg.categoryLabel}, then the other provided fields.
  - If any of these fields are clearly in a specific language (e.g., Turkish), you MUST write in that language.
  - If they are mixed/unclear, default to English.
- Do NOT mention the language, do NOT add explanations, labels, or meta text.
- Output ONLY the final description sentence.


Your task is to ${cfg.task}, similar in tone and structure to this example:
"${cfg.example}"

Writing guidelines:
- Write in clear, professional language
- ${cfg.focus}
- Prefer 160–240 characters, never exceed 256 characters
- ${cfg.contextRule}
- Include at least ONE of these words or their natural equivalent in the detected language: ${cfg.requiredWords}
- If any of the provided fields (Name, ${cfg.categoryLabel}, Method, Difficulty, Target audience) are present, the description MUST reflect them
- When updating an existing description, prioritize new details over old wording if they conflict
- ${cfg.safetyRule}
${cfg.methodNote ? `- ${cfg.methodNote}\n` : ""}- Do NOT mention: workflow, innovative solution, AI assistant, rewritten sentence, here is
- Do NOT use emojis, markdown, bullet points, or line breaks
- Write only ONE sentence

Output only the final description text.
`.trim();
}

/* -------------------- helpers -------------------- */

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400",
  };
}

function withCors(res) {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(corsHeaders())) headers.set(k, v);
  return new Response(res.body, { status: res.status, headers });
}

function json(obj, status = 200) {
  return withCors(
    new Response(JSON.stringify(obj), {
      status,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    })
  );
}

function sanitizeSingleSentence(text) {
  if (!text) return "";

  let clean = text
    .replace(
      /^(here is|here's|this is)\s+(the\s+)?(rewritten|enhanced|improved|updated)?\s*(sentence|description)?\s*[:\-–]?\s*/i,
      ""
    )
    .replace(/^["']|["']$/g, "")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const match = clean.match(/^.*?[.!?](\s|$)/);
  if (match) clean = match[0].trim();

  if (clean.length <= 256) return clean;
  return clean.slice(0, 256).replace(/\s+\S*$/, "").trim();
}

function humanizeLabel(value) {
  if (!value) return "";
  return value.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ").trim();
}

// Workers AI responses vary by model/route; this is the most robust extractor.
function extractTextFromWorkersAI(r) {
  // new shape: output_text
  if (r?.output_text) return String(r.output_text);

  // shape: output: [{type:"message", content:[{type:"text", text:"..."}]}]
  const out = r?.output;
  if (Array.isArray(out)) {
    const msg = out.find((i) => i?.type === "message") || out[0];
    const txt = msg?.content?.[0]?.text;
    if (txt) return String(txt);
  }

  // legacy / alternative
  return String(r?.response ?? r?.result ?? r?.text ?? r?.choices?.[0]?.message?.content ?? "");
}
