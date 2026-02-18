function makeRequestId(prefix = "PP-REQ") {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getUTCFullYear();
    const mm = pad(d.getUTCMonth() + 1);
    const dd = pad(d.getUTCDate());
    const hh = pad(d.getUTCHours());
    const mi = pad(d.getUTCMinutes());
    const ss = pad(d.getUTCSeconds());
    const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `${prefix}-${yyyy}${mm}${dd}-${hh}${mi}${ss}-${rnd}`;
  }
  
  function isForwardedEmail(subject) {
    if (!subject) return false;
    // Strip leading Re:/Sv:/Aw:/Ref:/Odp: reply prefixes (with optional [n] counter)
    // so "Re: Fw: Subject" and "Re: Re: Fw: Subject" are correctly detected
    const stripped = subject.trim().replace(/^((re|sv|aw|ref|odp)(\[\d+\])?:\s*)+/gi, "");
    // EN: Fw/Fwd, TR: İlet, DE: Wg, FR: Tr, NL: Doorst, ES/PT: Rv/Enc,
    // SV: Vs/Vl, IT: Rif/I, DA: Vs, NO: Vs, PL: Pd, FI: Vs
    return /^(fw|fwd|ilet|İlet|tr|wg|rv|vs|vl|doorst|enc|rif|pd|fs):\s*/i.test(stripped);
  }
  
  function stripHtml(html) {
    return html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<\/td>/gi, "\n")
      .replace(/<\/tr>/gi, "\n")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
  
  function decodeQuotedPrintable(str) {
    return str
      .replace(/=\r?\n/g, "")
      .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
  }
  
  function decodeRfc2047(text) {
    // Decode RFC 2047 encoded-words found in forwarded email body text
    // e.g. =?UTF-8?B?w5Z6ZWwgS2FyYWt0ZXI=?= → Özel Karakter
    // e.g. =?UTF-8?Q?=C3=96zel?= → Özel
    return text.replace(/=\?([^?]+)\?(B|Q)\?([^?]+)\?=/gi, (match, charset, encoding, encoded) => {
      try {
        if (encoding.toUpperCase() === "B") {
          return atob(encoded);
        }
        return encoded
          .replace(/_/g, " ")
          .replace(/=([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
      } catch (e) {
        return match;
      }
    });
  }
  
  function parseFromField(fromRaw, subject) {
    if (!fromRaw) return null;
  
    const emailMatch = fromRaw.match(/^(.*?)\s*<([^>]+)>/);
    let senderName, senderEmail;
  
    if (emailMatch) {
      senderName = emailMatch[1].trim().replace(/^["']|["']$/g, "") || emailMatch[2];
      senderEmail = emailMatch[2].trim();
    } else if (fromRaw.includes("@")) {
      senderName = fromRaw.trim();
      senderEmail = fromRaw.trim();
    } else {
      return null;
    }
  
    return { senderName, senderEmail, subject: subject?.trim() || "" };
  }
  
  function getEmailBody(emailParserData, rawBuffer) {
    // 1 — Try text body fields from parsed API response
    const textFields = ["textBody", "body", "text", "bodyText", "plainBody", "plainText", "bodyPlain"];
    for (const field of textFields) {
      if (emailParserData[field] && typeof emailParserData[field] === "string" && emailParserData[field].length > 20) {
        return emailParserData[field];
      }
    }
  
    // 2 — Try HTML body fields, strip to plain text
    const htmlFields = ["htmlBody", "html", "bodyHtml", "htmlContent", "htmlText"];
    for (const field of htmlFields) {
      if (emailParserData[field] && typeof emailParserData[field] === "string" && emailParserData[field].length > 20) {
        return stripHtml(emailParserData[field]);
      }
    }
  
    // 3 — Fallback: extract text body from raw MIME
    const rawText = new TextDecoder().decode(rawBuffer);
    return extractTextFromMime(rawText);
  }
  
  function findMimeBoundary(rawText, partIdx) {
    // Find the exact MIME boundary that precedes this part
    // by looking for the last "--boundary" line before the Content-Type declaration
    const preceding = rawText.substring(0, partIdx);
    const boundaryLines = preceding.match(/^--[^\r\n]+/gm);
    return boundaryLines ? boundaryLines[boundaryLines.length - 1].trim() : null;
  }
  
  function extractMimePartBody(rawText, contentTypeIdx, sep, isHtml) {
    const bodyStart = rawText.indexOf(sep, contentTypeIdx);
    if (bodyStart === -1) return null;
  
    let body = rawText.substring(bodyStart + sep.length);
  
    // Use the exact MIME boundary to find the end of this part
    const boundary = findMimeBoundary(rawText, contentTypeIdx);
    if (boundary) {
      const lineBreak = sep === "\r\n\r\n" ? "\r\n" : "\n";
      const endIdx = body.indexOf(lineBreak + boundary);
      if (endIdx !== -1) body = body.substring(0, endIdx);
    }
  
    // Decode Content-Transfer-Encoding if needed
    const hdrSection = rawText.substring(contentTypeIdx, bodyStart);
    const encMatch = hdrSection.match(/Content-Transfer-Encoding:\s*(\S+)/i);
    if (encMatch) {
      const enc = encMatch[1].toLowerCase();
      if (enc === "quoted-printable") body = decodeQuotedPrintable(body);
      else if (enc === "base64") {
        try { body = atob(body.replace(/\s/g, "")); } catch (e) { /* keep as-is */ }
      }
    }
  
    return isHtml ? stripHtml(body).trim() : body.trim();
  }
  
  function extractTextFromMime(rawText) {
    const sep = rawText.includes("\r\n\r\n") ? "\r\n\r\n" : "\n\n";
  
    // Try text/plain part first
    const plainIdx = rawText.search(/Content-Type:\s*text\/plain/i);
    if (plainIdx !== -1) {
      const result = extractMimePartBody(rawText, plainIdx, sep, false);
      if (result) return result;
    }
  
    // Fallback: text/html → strip tags
    const htmlIdx = rawText.search(/Content-Type:\s*text\/html/i);
    if (htmlIdx !== -1) {
      const result = extractMimePartBody(rawText, htmlIdx, sep, true);
      if (result) return result;
    }
  
    return rawText;
  }
  
  function extractForwardedInfo(bodyText) {
    if (!bodyText) return null;
  
    const isHtml = /<\s*(html|body|div|p|table|span|br|a|img|font|b|strong)\b/i.test(bodyText);
    let text = isHtml ? stripHtml(bodyText) : bodyText;
  
    // Clean Outlook text/plain mailto: link artifacts
    // e.g. "IT Team <user@example.com<mailto:user@example.com>>" → "IT Team <user@example.com>"
    text = text.replace(/<mailto:[^>]*>/gi, "");
  
    // Decode RFC 2047 encoded-words (=?charset?B?...?= or =?charset?Q?...?=)
    text = decodeRfc2047(text);
  
    // ── Step 1: Locate all forward block boundaries ──────────────
    // Instead of client-specific ordered patterns, we find DIVIDERS first,
    // then extract headers independently of order within each block.
    const dividerPatterns = [
      // Gmail / generic "Forwarded message" (multi-language)
      /[-]{3,}\s*(?:Forwarded [Mm]essage|İletilen [İi]leti|Message transf[eé]r[eé]|Weitergeleitete Nachricht|Messaggio inoltrato|Doorgestuurd bericht)\s*[-]{3,}/g,
      // "Original Message" block (multi-language)
      /[-]{3,}\s*(?:Original Message|Orijinal İleti|Message d'origine|Urspr[uü]ngliche Nachricht|Messaggio originale|Oorspronkelijk bericht)\s*[-]{3,}/g,
      // Apple Mail (multi-language)
      /(?:Begin forwarded message|İletilen mesajın başlangıcı|D[ée]but du message r[ée]exp[ée]di[ée]):/gi,
      // Outlook Web / long underscore divider
      /[_]{15,}/g,
    ];
  
    let blockStarts = [];
  
    for (const pat of dividerPatterns) {
      const re = new RegExp(pat.source, pat.flags);
      let m;
      while ((m = re.exec(text)) !== null) {
        blockStarts.push(m.index + m[0].length);
      }
    }
  
    // Outlook desktop / Exchange: no explicit divider
    // Detect "From: ...\n Sent/Date: ..." as virtual block start
    const outlookRe = /(?:From|Kimden|De|Von|Da|Van):\s*.+[\r\n]+\s*(?:Sent|Date|Gönderildi|Envoyé|Gesendet|Inviato|Verzonden|Tarih|Datum|Data):\s*/gi;
    let om;
    while ((om = outlookRe.exec(text)) !== null) {
      blockStarts.push(om.index);
    }
  
    // Sort and deduplicate (positions within 50 chars = same block)
    blockStarts.sort((a, b) => a - b);
    blockStarts = blockStarts.filter((pos, i) => i === 0 || pos - blockStarts[i - 1] > 50);
  
    // Fallback: scan entire text if no dividers found
    if (blockStarts.length === 0) {
      blockStarts = [0];
    }
  
    // ── Step 2: Extract headers from each block (deepest first) ──
    // Order-independent: works regardless of whether email client puts
    // From before Subject, Subject before From, etc.
    const fromRe = /(?:From|Kimden|De|Von|Da|Van):\s*(.+)/i;
    const toRe = /(?:To|Kime|À|Aan|An|A):\s*(.+)/i;
    const subjectRe = /(?:Subject|Konu|Objet|Betreff|Oggetto|Onderwerp):\s*(.+)/i;
  
    // Process deepest block first — for chained forwards (Fw: Fw: Fw:)
    // the deepest block contains the original phishing sender
    for (let i = blockStarts.length - 1; i >= 0; i--) {
      const blockEnd = (i < blockStarts.length - 1) ? blockStarts[i + 1] : text.length;
      const maxLen = Math.min(blockEnd - blockStarts[i], 2000);
      const blockText = text.substring(blockStarts[i], blockStarts[i] + maxLen);
  
      const fromMatch = blockText.match(fromRe);
      const subjectMatch = blockText.match(subjectRe);
      const toMatch = blockText.match(toRe);
  
      // Require From + at least one other header to avoid false positives (signatures, etc.)
      const headerCount = [fromMatch, subjectMatch, toMatch].filter(Boolean).length;
      if (!fromMatch || headerCount < 2) continue;
  
      const result = parseFromField(
        fromMatch[1].trim(),
        subjectMatch ? subjectMatch[1].trim() : ""
      );
  
      if (!result) continue;
  
      if (toMatch) {
        const toRaw = toMatch[1].trim();
        const toEmailMatch = toRaw.match(/<([^>]+)>/);
        result.recipientEmail = toEmailMatch ? toEmailMatch[1].trim() : toRaw;
      }
  
      return result;
    }
  
    return null;
  }
  
  function arrayBufferToBase64(buf) {
    let binary = "";
    const bytes = new Uint8Array(buf);
    const chunkSize = 0x8000;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  }
  
  function resolveEnvironment(toAddress) {
    const localPart = toAddress.split("@")[0];
  
    if (toAddress.includes("dev-")) {
      return {
        companyID: localPart.replace("dev-", ""),
        parseApiUrl: "https://dev-api.devkeepnet.com/api/webhook/mail/parse/proofpoint",
        notifyApiUrl: "https://dev-addin-api.devkeepnet.com/api/notify/email"
      };
    }
  
    if (toAddress.includes("test-")) {
      return {
        companyID: localPart.replace("test-", ""),
        parseApiUrl: "https://test-api.devkeepnet.com/api/webhook/mail/parse/proofpoint",
        notifyApiUrl: "https://test-addin-api.devkeepnet.com/api/notify/email"
      };
    }
  
    return {
      companyID: localPart,
      parseApiUrl: "https://api.keepnetlabs.com/api/webhook/mail/parse/proofpoint",
      notifyApiUrl: "https://addin-api.keepnetlabs.com/api/notify/email"
    };
  }
  
  function mergeHeaders(parsedHeaders, rawMessageHeaders) {
    const allHeaders = [];
  
    if (parsedHeaders?.length) {
      parsedHeaders.forEach((header) => {
        allHeaders.push({ Key: header.key, Value: header.value });
      });
    }
  
    Array.from(rawMessageHeaders.entries()).forEach(([key, value]) => {
      if (!parsedHeaders.find((h) => h.key?.toLowerCase() === key.toLowerCase())) {
        allHeaders.push({ Key: key, Value: value });
      }
    });
  
    return allHeaders;
  }
  
  // ─── Worker Export ─────────────────────────────────────────────
  
  var index_default = {
    async fetch(_req, _env, _ctx) {
      return new Response("OK (email worker up)", { status: 200 });
    },
  
    async email(message, env, ctx) {
      const requestId = makeRequestId();
  
      try {
        // ── Step 1: Read raw email ──────────────────────────────
        const rawBuffer = await new Response(message.raw).arrayBuffer();
        const fileBlob = new Blob([rawBuffer], { type: "message/rfc822" });
  
        // ── Step 2: Resolve environment (dev / test / prod) ─────
        const { companyID, parseApiUrl, notifyApiUrl } = resolveEnvironment(message.to);
        console.log(`[${requestId}] env=${message.to.includes("dev-") ? "dev" : message.to.includes("test-") ? "test" : "prod"} companyID=${companyID}`);
  
        // ── Step 3: Send raw EML to parse API ───────────────────
        const form = new FormData();
        form.append("RequestId", requestId);
        form.append("CompanyId", companyID);
        form.append("File", fileBlob, "email.eml");
  
        console.log(`[${requestId}][parse] Sending to ${parseApiUrl}`);
  
        const emailParserResponse = await fetch(parseApiUrl, {
          method: "POST",
          headers: {
            "X-Keepnet-CF-Key": env.KEEPNET_CF_KEY ||
              "SUhxU2cwNlB1anI0SGNSNk00RUozSmFnM1hnWkVJRGluM3VLcmo5RlBycGxVMzU4TnhrbWxsRlVXNDAzZFpncA=="
          },
          body: form
        });
  
        if (!emailParserResponse.ok) {
          const errorBody = await emailParserResponse.text();
          console.error(`[${requestId}][parse] FAILED ${emailParserResponse.status}: ${errorBody}`);
          throw new Error(`Parse API returned ${emailParserResponse.status}`);
        }
  
        const emailParserData = await emailParserResponse.json();
        const parsedHeaders = emailParserData.emailHeaders || [];
        console.log(`[${requestId}][parse] OK — ${parsedHeaders.length} headers parsed`);
  
        // ── Step 4: Extract email metadata ──────────────────────
        const subjectHeader = parsedHeaders.find((h) => h.key?.toLowerCase() === "subject");
        const originalSubject = subjectHeader?.value || "";
  
        const dateHeader = parsedHeaders.find((h) => h.key?.toLowerCase() === "date");
        const dateString = dateHeader?.value || message.headers.get("date") || "";
        let originalDate;
        if (dateString) {
          const parsedDate = new Date(dateString);
          originalDate = isNaN(parsedDate.getTime()) ? new Date().toISOString() : parsedDate.toISOString();
        } else {
          originalDate = new Date().toISOString();
        }
  
        const msgIdHeader = parsedHeaders.find((h) => h.key?.toLowerCase() === "message-id");
        const originalMessageId =
          message.headers.get("message-id") ||
          msgIdHeader?.value ||
          `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
        const originalSenderName = parsedHeaders.find((h) => h.key?.toLowerCase() === "from")?.value || emailParserData.fromName || message.from;
        const originalSenderEmail = emailParserData.from || message.from;
  
        // ── Step 5: Forward detection ───────────────────────────
        let reportedBy = message.from;
        let actualSenderName = originalSenderName;
        let actualSenderEmail = originalSenderEmail;
        let actualSubject = originalSubject;
        let actualRecipientEmail = null;
  
        if (isForwardedEmail(originalSubject)) {
          console.log(`[${requestId}][forward] Forwarded email detected`);
          const bodyText = getEmailBody(emailParserData, rawBuffer);
          const forwardedInfo = extractForwardedInfo(bodyText);
  
          if (forwardedInfo) {
            actualSenderName = forwardedInfo.senderName;
            actualSenderEmail = forwardedInfo.senderEmail;
            actualSubject = forwardedInfo.subject;
            actualRecipientEmail = forwardedInfo.recipientEmail || null;
  
            // Reported By = the original phishing target (from the forwarded body's To field)
            // This is the person who received the phishing and reported it
            if (actualRecipientEmail) {
              reportedBy = actualRecipientEmail;
            }
  
            console.log(`[${requestId}][forward] Extracted — from: ${actualSenderEmail} to: ${actualRecipientEmail} subject: "${actualSubject}"`);
          } else {
            actualSubject = originalSubject.replace(/^((re|sv|aw|ref|odp|fw|fwd|ilet|İlet|tr|wg|rv|vs|vl|doorst|enc|rif|pd|fs)(\[\d+\])?:\s*)+/gi, "");
            console.log(`[${requestId}][forward] Body extraction failed, stripped prefixes: "${actualSubject}"`);
          }
  
          console.log(`[${requestId}][forward] Reported by: ${reportedBy} | Original sender: ${actualSenderEmail}`);
        }
  
        // Determine recipient: for forwarded emails use the original target,
        // otherwise use the parsed To header or envelope recipient
        const recipientEmail =
          actualRecipientEmail ||
          parsedHeaders.find((h) => h.key?.toLowerCase() === "to")?.value ||
          message.to;
  
        // Build headers array — for forwarded emails, override From/To/Subject
        // so they reflect the original phishing email, not the forwarding envelope
        const allHeaders = mergeHeaders(parsedHeaders, message.headers);
        allHeaders.push({ Key: "X-Keepnet-TID", Value: "t8m5lbBa0r6Y" });

        if (actualRecipientEmail) {
          const overrides = {
            from: actualSenderName
              ? `${actualSenderName} <${actualSenderEmail}>`
              : actualSenderEmail,
            to: recipientEmail,
            subject: actualSubject
          };
  
          for (let i = 0; i < allHeaders.length; i++) {
            const keyLower = allHeaders[i].Key?.toLowerCase();
            if (keyLower && overrides[keyLower] !== undefined) {
              allHeaders[i] = { Key: allHeaders[i].Key, Value: overrides[keyLower] };
            }
          }
  
          console.log(`[${requestId}][forward] Headers overridden — From/To/Subject updated to original phishing values`);
        }
  
        // ── Step 6: Build & send notify payload ─────────────────
        const payload = {
          Email: reportedBy,
          MailId: originalMessageId,
          FolderName: "Inbox",
          FolderType: 1,
          SenderIp: message.headers.get("x-forwarded-for") || message.headers.get("x-real-ip") || "127.0.0.1",
          From: actualSenderEmail,
          Subject: actualSubject,
          SenderName: actualSenderName,
          AttachmentCount: 0,
          ReceivedTime: originalDate,
          AddInVersion: "1.0.0.15",
          Recipients: [
            {
              Email: recipientEmail,
              RecipientType: 1
            }
          ],
          Headers: allHeaders,
          MsgFileContent: arrayBufferToBase64(rawBuffer),
          IsSendSimulationMails: "false",
          ClientInformation: JSON.stringify({
            displayLanguage: "en-GB",
            platform: "CloudflareWorker",
            hostName: "CloudflareWorker",
            hostVersion: "20250829003.07",
            appVersion: "16.01",
            userProfileType: "CloudflareWorker",
            browserAgent:
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
            clientPlatform: "CloudflareWorker"
          })
        };
  
        console.log(`[${requestId}][notify] Sending to ${notifyApiUrl}`);
  
        const notifyHeaders = new Headers();
        notifyHeaders.set("Content-Type", "application/json");
        notifyHeaders.set("X-IR-COMPANY-ID", companyID);
  
        const response = await fetch(notifyApiUrl, {
          method: "POST",
          headers: notifyHeaders,
          body: JSON.stringify(payload)
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`[${requestId}][notify] FAILED ${response.status}: ${errorText}`);
        } else {
          console.log(`[${requestId}][notify] OK — reported by: ${reportedBy} | sender: ${actualSenderEmail} | subject: "${actualSubject}"`);
        }
      } catch (error) {
        console.error(`[${requestId}][error] ${error.message || error}`);
      }
    }
  };
  
  export { index_default as default };
  