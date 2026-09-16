export async function onRequest(context) {
  const url = new URL(context.request.url);
  const match = url.pathname.match(/^\/(google[a-zA-Z0-9_-]+\.html)$/);
  
  if (match) {
    const filename = match[1];
    return new Response(`google-site-verification: ${filename}\n`, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  }

  return await context.next();
}
