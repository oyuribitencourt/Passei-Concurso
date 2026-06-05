import { prisma } from "@/lib/prisma"

export async function TrackingScripts() {
  let config: {
    metaPixelId: string | null
    googleAdsId: string | null
    googleAnalyticsId: string | null
    googleSearchConsoleId: string | null
    metaDomainVerification: string | null
  } | null = null

  try {
    config = await prisma.siteConfig.findFirst()
  } catch {
    return null
  }

  if (!config) return null

  const { metaPixelId, googleAdsId, googleAnalyticsId, googleSearchConsoleId, metaDomainVerification } = config
  const hasAny = metaPixelId || googleAdsId || googleAnalyticsId || googleSearchConsoleId || metaDomainVerification

  if (!hasAny) return null

  return (
    <>
      {/* Google Search Console — verificação de propriedade */}
      {googleSearchConsoleId && (
        <meta name="google-site-verification" content={googleSearchConsoleId} />
      )}

      {/* Meta Domain Verification — verificação de domínio Facebook/Meta */}
      {metaDomainVerification && (
        <meta name="facebook-domain-verification" content={metaDomainVerification} />
      )}

      {/* Google Analytics (GA4) */}
      {googleAnalyticsId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${googleAnalyticsId}');`,
            }}
          />
        </>
      )}

      {/* Google Ads */}
      {googleAdsId && !googleAnalyticsId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${googleAdsId}');`,
            }}
          />
        </>
      )}
      {googleAdsId && googleAnalyticsId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `gtag('config','${googleAdsId}');`,
          }}
        />
      )}

      {/* Meta Pixel (Facebook) */}
      {metaPixelId && (
        <>
          <script
            dangerouslySetInnerHTML={{
              __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`,
            }}
          />
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      )}
    </>
  )
}
