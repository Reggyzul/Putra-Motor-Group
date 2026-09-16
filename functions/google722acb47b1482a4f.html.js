export async function onRequestGet() {
  return new Response('google-site-verification: google722acb47b1482a4f.html', {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
