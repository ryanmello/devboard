import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  if (code) {
    const destination = next ? `${siteUrl}${next}` : `${siteUrl}/settings`;
    const response = NextResponse.redirect(destination);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.session) {
      await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });

      // Sync OAuth avatar to backend profile (best-effort)
      const avatarUrl = data.session.user.user_metadata?.avatar_url;
      if (avatarUrl) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = data.session.access_token;

        try {
          const userRes = await fetch(`${apiUrl}/api/v1/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (userRes.ok) {
            const userData = await userRes.json();
            if (!userData.image) {
              await fetch(`${apiUrl}/api/v1/users/me`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ image: avatarUrl }),
              });
            }
          }
        } catch {
          // Silently ignore — avatar sync is best-effort
        }
      }

      return response;
    }
  }

  return NextResponse.redirect(`${siteUrl}/auth/error`);
}
