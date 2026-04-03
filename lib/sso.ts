const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

/**
 * Generate OTT and redirect to conference-web (main hub) via SSO callback
 * ★ conference-web เป็น default target เมื่อไม่มี eventId
 * ★ ส่งผ่าน /auth/sso เสมอ (ไม่ส่งตรงไปหน้าปลายทาง)
 */
export async function ssoRedirectToConferenceWeb(
  token: string,
  redirectPath: string = '/events'
): Promise<void> {
  try {
    // ไม่ส่ง eventId = API จะ return conference-web URL เป็น default
    const res = await fetch(`${API_URL}/auth/sso-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source-App': 'accp-web',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ targetApp: 'conference-web' }),
    });

    const data = await res.json();

    if (data.success && data.ssoToken && data.targetUrl) {
      const redirect = encodeURIComponent(redirectPath);
      window.location.href = `${data.targetUrl}/auth/sso?sso=${data.ssoToken}&redirect=${redirect}`;
      return;
    }
  } catch (error) {
    console.error('Failed to generate SSO token:', error);
  }

  // Fallback: redirect โดยไม่มี SSO ไป conference-web default
  const fallbackUrl = process.env.NEXT_PUBLIC_CONFERENCE_WEB_URL || 'http://localhost:3003';
  window.location.href = fallbackUrl + redirectPath;
}

/**
 * Generate OTT and redirect to event website via SSO callback
 * ★ ใช้ events.websiteUrl จาก database
 */
export async function ssoRedirectToEventWebsite(
  token: string,
  eventId: number,
  redirectPath: string = '/'
): Promise<void> {
  try {
    const res = await fetch(`${API_URL}/auth/sso-token?eventId=${eventId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source-App': 'accp-web',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    const data = await res.json();

    if (data.success && data.ssoToken && data.targetUrl) {
      const redirect = encodeURIComponent(redirectPath);
      window.location.href = `${data.targetUrl}/auth/sso?sso=${data.ssoToken}&redirect=${redirect}`;
      return;
    }
  } catch (error) {
    console.error('Failed to generate SSO token:', error);
  }

  // Fallback: redirect ไป conference-web
  const fallbackUrl = process.env.NEXT_PUBLIC_CONFERENCE_WEB_URL || 'http://localhost:3003';
  window.location.href = fallbackUrl + redirectPath;
}
