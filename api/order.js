/**
 * Redimex — Vercel Serverless Function
 * POST /api/order
 *
 * Substitui o bloco PHP original.
 * Envia lead para a API DrCash com:
 *  - Normalização de telefone por GEO
 *  - Captura de gclid + sub1-sub5
 *  - Validação no backend antes de enviar
 */

// ── Phone normalization by country code ──────────────────────────────────
const GEO_CONFIG = {
  pl: { code: '48', digits: 9  },
  it: { code: '39', digits: 10 },
  ro: { code: '40', digits: 9  },
  de: { code: '49', digits: 10 },
  es: { code: '34', digits: 9  },
  pt: { code: '351', digits: 9 },
  fr: { code: '33', digits: 9  },
  hu: { code: '36', digits: 9  },
  cz: { code: '420', digits: 9 },
  sk: { code: '421', digits: 9 },
};

function normalizePhone(raw, geo) {
  if (!raw) return null;

  // Strip spaces, dashes, parentheses, dots
  let phone = String(raw).replace(/[\s\-\(\)\.\+]/g, '');

  const cfg = GEO_CONFIG[geo] || GEO_CONFIG['pl'];
  const { code, digits } = cfg;

  // Remove leading 00
  if (phone.startsWith('00')) phone = phone.slice(2);
  // Remove leading country code
  if (phone.startsWith(code)) phone = phone.slice(code.length);
  // Remove remaining leading zeros
  phone = phone.replace(/^0+/, '') || phone;

  // Validate: must be pure digits of expected length
  if (!/^\d+$/.test(phone)) return null;
  if (phone.length !== digits) return null;

  return '+' + code + phone;
}

// ── Main handler ─────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};

  // Required fields check
  if (!body.phone) {
    return res.status(400).json({ error: 'Phone is required' });
  }

  // GEO detection (from body, query param, or default pl)
  const geo = (body.geo || req.query.geo || 'pl').toLowerCase();

  // Normalize phone
  const normalizedPhone = normalizePhone(body.phone, geo);
  if (!normalizedPhone) {
    return res.status(400).json({ error: 'Invalid phone number for geo: ' + geo });
  }

  // DrCash API credentials
  const TOKEN       = 'YZA0ZJDLZWYTZDK4ZC00YMJJLWJJNJATODZKNGJJMTE2MZQ4';
  const STREAM_CODE = 'rzpq2';

  // Build payload
  const payload = {
    stream_code: STREAM_CODE,
    client: {
      phone:    normalizedPhone,
      name:     body.name    || null,
      surname:  body.surname || null,
      email:    body.email   || null,
      address:  body.address || null,
      ip:       body.ip      || (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || null),
      country:  body.country || geo.toUpperCase() || null,
      city:     body.city    || null,
      postcode: body.postcode|| null,
    },
    // UTM / tracking params
    sub1: body.sub1 || null,
    sub2: body.sub2 || null,
    sub3: body.sub3 || null,
    sub4: body.sub4 || null,
    sub5: body.sub5 || null,
    // Google Ads click ID
    gclid: body.gclid || null,
  };

  try {
    const response = await fetch('https://order.drcash.sh/v1/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();

    if (response.ok) {
      return res.status(200).json({ success: true });
    } else {
      console.error('[order.js] DrCash error:', response.status, responseText);
      return res.status(response.status).json({ error: responseText });
    }
  } catch (err) {
    console.error('[order.js] Fetch error:', err.message);
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
}
