import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AlertRequest {
  userEmail: string;
  productName: string;
  productUrl: string;
  trustScore: number;
  status: string;
  verdict: string;
  reportId: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const { userEmail, productName, productUrl, trustScore, status, verdict, reportId } =
      await req.json() as AlertRequest;

    if (!userEmail || !productName || !reportId) {
      throw new Error('Missing required fields');
    }

    const reportUrl = `https://truthcart.lovable.app/report/${reportId}`;
    const scoreColor = trustScore < 20 ? '#ef4444' : '#f97316';

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>TruthCart Suspicious Product Alert</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#111;border-radius:16px;overflow:hidden;border:1px solid #222;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a0a0a,#2a0f0f);padding:32px 40px;border-bottom:1px solid #2a1a1a;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <div style="font-size:22px;font-weight:700;color:#fff;letter-spacing:-0.5px;">
                      🛡️ TruthCart
                    </div>
                    <div style="font-size:12px;color:#888;margin-top:4px;text-transform:uppercase;letter-spacing:1px;">
                      Product Safety Alert
                    </div>
                  </td>
                  <td align="right">
                    <div style="background:${scoreColor};border-radius:12px;padding:8px 16px;display:inline-block;">
                      <div style="font-size:28px;font-weight:800;color:#fff;line-height:1;">${trustScore}</div>
                      <div style="font-size:10px;color:rgba(255,255,255,0.8);text-align:center;font-weight:600;">/100</div>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Warning Banner -->
          <tr>
            <td style="background:#1f0f0f;padding:16px 40px;border-bottom:1px solid #2a1a1a;">
              <div style="display:flex;align-items:center;gap:8px;">
                <span style="font-size:18px;">⚠️</span>
                <span style="color:#f87171;font-weight:600;font-size:14px;text-transform:uppercase;letter-spacing:0.5px;">
                  Suspicious Product Detected — Trust Score Below 40
                </span>
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">
              <p style="color:#ccc;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Hi there, TruthCart detected some serious trust signals worth flagging on a product you recently scanned.
              </p>

              <!-- Product Card -->
              <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:12px;padding:20px;margin-bottom:24px;">
                <div style="font-size:11px;color:#666;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">
                  Scanned Product
                </div>
                <div style="font-size:17px;font-weight:600;color:#fff;margin-bottom:8px;">${productName}</div>
                <a href="${productUrl}" style="color:#00d26a;font-size:13px;text-decoration:none;word-break:break-all;">${productUrl.length > 60 ? productUrl.slice(0, 60) + '...' : productUrl}</a>
              </div>

              <!-- Verdict -->
              <div style="background:#1f1205;border:1px solid #f97316;border-left:4px solid #f97316;border-radius:0 8px 8px 0;padding:16px;margin-bottom:24px;">
                <div style="font-size:11px;color:#f97316;text-transform:uppercase;font-weight:700;letter-spacing:0.5px;margin-bottom:6px;">
                  TruthCart Verdict
                </div>
                <p style="color:#e5c8a0;font-size:14px;line-height:1.5;margin:0;">${verdict || 'This product raised significant trust concerns across multiple data signals.'}</p>
              </div>

              <!-- Trust Score Bar -->
              <div style="margin-bottom:28px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:8px;">
                  <span style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Trust Score</span>
                  <span style="color:${scoreColor};font-weight:700;font-size:13px;">${trustScore}/100</span>
                </div>
                <div style="background:#2a2a2a;border-radius:100px;height:8px;overflow:hidden;">
                  <div style="background:${scoreColor};width:${trustScore}%;height:100%;border-radius:100px;"></div>
                </div>
              </div>

              <!-- CTA -->
              <div style="text-align:center;margin-bottom:24px;">
                <a href="${reportUrl}" style="display:inline-block;background:linear-gradient(135deg,#00d26a,#00b359);color:#000;font-weight:700;font-size:15px;padding:14px 32px;border-radius:12px;text-decoration:none;letter-spacing:-0.2px;">
                  View Full Trust Report →
                </a>
              </div>

              <p style="color:#555;font-size:13px;line-height:1.5;text-align:center;margin:0;">
                You're receiving this because you scanned this product on TruthCart. We only send alerts for scores below 40.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0d0d0d;padding:20px 40px;border-top:1px solid #1a1a1a;text-align:center;">
              <div style="font-size:12px;color:#444;">
                © 2026 TruthCart · <a href="https://truthcart.lovable.app" style="color:#00d26a;text-decoration:none;">truthcart.lovable.app</a>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const emailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'TruthCart Alerts <alerts@truthcart.com>',
        to: [userEmail],
        subject: `⚠️ Suspicious Product Alert: "${productName}" scored ${trustScore}/100`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const err = await emailRes.text();
      console.error('Resend error:', err);
      throw new Error(`Resend API error: ${emailRes.status}`);
    }

    const emailData = await emailRes.json();
    console.log('Alert email sent:', emailData.id);

    return new Response(JSON.stringify({ success: true, emailId: emailData.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error sending suspicious alert:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
