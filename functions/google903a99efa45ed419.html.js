export async function onRequestGet() {
  return new Response('google-site-verification: google903a99efa45ed419.html\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
