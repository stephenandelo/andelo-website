const { createClient } = require('@supabase/supabase-js');
const { Resend } = require('resend');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const PLACEHOLDER_MARKER = 'AUTO_REPLY_PLACEHOLDER';
const FIT_OPTIONS = new Set([
  'We need a design team',
  'Our creative team is at capacity',
  'Our work multiplies across brands or locations',
  'Something else',
]);
const URGENCY_OPTIONS = new Set([
  'As soon as possible',
  'In the next month or two',
  'Just exploring for now',
]);

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function trim(value, max) {
  const text = String(value ?? '').trim();
  if (!text) return '';
  return text.length > max ? text.slice(0, max) : text;
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function hashIp(ip, salt) {
  return crypto
    .createHash('sha256')
    .update(`${salt}:${(ip || 'unknown').trim()}`)
    .digest('hex');
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

function firstName(fullName) {
  const parts = String(fullName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return parts[0] || fullName || 'there';
}

function loadAutoReplyTemplate() {
  const filePath = path.join(process.cwd(), 'content/book-a-call-auto-reply.html');
  return fs.readFileSync(filePath, 'utf8');
}

function autoReplyIsPlaceholder(html) {
  return html.includes(PLACEHOLDER_MARKER);
}

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function internalEmailHtml(lead) {
  const rows = [
    ['Work email', lead.work_email],
    ['Full name', lead.full_name],
    ['Company', lead.company],
    ['Job title', lead.job_title],
    ['Which fits you best?', lead.fit_option],
    ['How soon', lead.urgency],
    ['Notes', lead.notes || '—'],
    ['Phone', lead.phone || '—'],
    ['Source URL', lead.source_url],
    ['Submitted', lead.submitted_at],
  ];
  const body = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0;">${escapeHtml(value)}</td></tr>`,
    )
    .join('');
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#12141C;"><table>${body}</table></body></html>`;
}

function internalEmailText(lead) {
  return [
    `Work email: ${lead.work_email}`,
    `Full name: ${lead.full_name}`,
    `Company: ${lead.company}`,
    `Job title: ${lead.job_title}`,
    `Which fits you best?: ${lead.fit_option}`,
    `How soon: ${lead.urgency}`,
    `Notes: ${lead.notes || '—'}`,
    `Phone: ${lead.phone || '—'}`,
    `Source URL: ${lead.source_url}`,
    `Submitted: ${lead.submitted_at}`,
  ].join('\n');
}

async function sendInternalEmail(resend, lead) {
  const to = process.env.BOOK_A_CALL_NOTIFY_TO || 'stephen@andelo.com.au';
  const from = process.env.BOOK_A_CALL_FROM || 'Stephen Andelo <stephen@andelo.com.au>';
  const subject = `New lead: ${lead.company} — ${lead.urgency}`;
  const payload = {
    from,
    to: [to],
    replyTo: process.env.BOOK_A_CALL_REPLY_TO || 'stephen@andelo.com.au',
    subject,
    html: internalEmailHtml(lead),
    text: internalEmailText(lead),
  };

  let lastError;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const { error } = await resend.emails.send(payload);
      if (!error) return { ok: true };
      lastError = error;
    } catch (err) {
      lastError = err;
    }
    if (attempt === 0) {
      await new Promise((r) => setTimeout(r, 400));
    }
  }
  console.error('[book-a-call] internal email failed', lastError);
  return { ok: false, error: lastError };
}

async function sendAutoReply(resend, lead, first) {
  const htmlTemplate = loadAutoReplyTemplate();
  if (autoReplyIsPlaceholder(htmlTemplate)) {
    return { skipped: true };
  }
  const html = htmlTemplate.split('{first_name}').join(escapeHtml(first));
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const from = process.env.BOOK_A_CALL_FROM || 'Stephen Andelo <stephen@andelo.com.au>';
  const { error } = await resend.emails.send({
    from,
    to: [lead.work_email],
    replyTo: process.env.BOOK_A_CALL_REPLY_TO || 'stephen@andelo.com.au',
    subject: process.env.BOOK_A_CALL_AUTO_REPLY_SUBJECT || 'Thanks for reaching out to Andelo',
    html,
    text,
  });
  if (error) {
    console.error('[book-a-call] auto-reply failed', error);
    return { ok: false, error };
  }
  return { ok: true };
}

async function readBody(req) {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return null;
      }
    }
    if (typeof req.body === 'object') return req.body;
  }
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return json(res, 405, { error: 'Method not allowed.' });
  }

  const body = await readBody(req);
  if (!body || typeof body !== 'object') {
    return json(res, 400, { error: 'Invalid JSON.' });
  }

  if (trim(body.website_url, 500)) {
    return json(res, 200, { ok: true });
  }

  const workEmail = trim(body.work_email, 320).toLowerCase();
  const fullName = trim(body.full_name, 200);
  const company = trim(body.company, 200);
  const jobTitle = trim(body.job_title, 200);
  const fitOption = trim(body.fit_option, 200);
  const urgency = trim(body.urgency, 120);
  const notes = trim(body.notes, 8000) || null;
  const phone = trim(body.phone, 40) || null;
  const sourceUrl = trim(body.source_url, 2000);

  if (!workEmail || !isEmail(workEmail)) {
    return json(res, 400, { error: 'Enter a valid work email.' });
  }
  if (!fullName || !company || !jobTitle) {
    return json(res, 400, { error: 'Fill in all required fields.' });
  }
  if (!FIT_OPTIONS.has(fitOption) || !URGENCY_OPTIONS.has(urgency)) {
    return json(res, 400, { error: 'Choose an option from the lists.' });
  }
  if (!sourceUrl) {
    return json(res, 400, { error: 'Missing source URL.' });
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const submitSecret = process.env.BOOK_A_CALL_SUBMIT_SECRET;
  const rateSalt = process.env.BOOK_A_CALL_RATE_SALT;
  const resendKey = process.env.RESEND_API_KEY;

  if (!supabaseUrl || !supabaseKey || !submitSecret || !rateSalt) {
    console.error('[book-a-call] missing Supabase or rate-limit env');
    return json(res, 503, { error: 'Booking is temporarily unavailable.' });
  }
  if (!resendKey) {
    console.error('[book-a-call] missing RESEND_API_KEY');
    return json(res, 503, { error: 'Booking is temporarily unavailable.' });
  }

  const ipHash = hashIp(clientIp(req), rateSalt);
  const userAgent = trim(req.headers['user-agent'], 500) || null;
  const submittedAt = new Date().toISOString();

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.rpc('submit_book_a_call_lead', {
    p_submit_secret: submitSecret,
    p_ip_hash: ipHash,
    p_work_email: workEmail,
    p_full_name: fullName,
    p_company: company,
    p_job_title: jobTitle,
    p_fit_option: fitOption,
    p_urgency: urgency,
    p_notes: notes,
    p_phone: phone,
    p_source_url: sourceUrl,
    p_user_agent: userAgent,
  });

  if (error) {
    const msg = error.message || '';
    if (msg.includes('rate_limited')) {
      return json(res, 429, {
        error: 'Too many attempts. Try again in an hour or email stephen@andelo.com.au.',
      });
    }
    if (msg.toLowerCase().includes('unauthorized') || msg.includes('invalid_authorization')) {
      console.error('[book-a-call] RPC unauthorized — check BOOK_A_CALL_SUBMIT_SECRET vs Supabase config');
      return json(res, 503, { error: 'Booking is temporarily unavailable.' });
    }
    console.error('[book-a-call] RPC failed', error);
    return json(res, 503, { error: 'Something went wrong. Try again or email stephen@andelo.com.au.' });
  }

  const leadId = data?.lead_id;
  const replyFirst = data?.first_name || firstName(fullName);

  const lead = {
    work_email: workEmail,
    full_name: fullName,
    company,
    job_title: jobTitle,
    fit_option: fitOption,
    urgency,
    notes,
    phone,
    source_url: sourceUrl,
    submitted_at: submittedAt,
  };

  const resend = new Resend(resendKey);
  const internal = await sendInternalEmail(resend, lead);

  if (!internal.ok && leadId) {
    await supabase.rpc('mark_book_a_call_lead_notify_failed', {
      p_submit_secret: submitSecret,
      p_lead_id: leadId,
    });
  }

  await sendAutoReply(resend, lead, replyFirst);

  return json(res, 200, { ok: true, firstName: replyFirst });
};
