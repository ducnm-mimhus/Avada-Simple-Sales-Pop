export async function fetchNotifications(since = null) {
  const shopDomain = window.Shopify?.shop || window.location.hostname;
  let baseUrl = process.env.HOST;
  if (baseUrl && !baseUrl.startsWith('http')) {
    baseUrl = `https://${baseUrl}`;
  }
  let url = `${baseUrl}/clientApi/notifications?shopDomain=${shopDomain}`;
  if (since) {
    url += `&since=${encodeURIComponent(since)}`;
  }
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json.data;
  } catch (e) {
    console.error('Sales Pop Error:', e);
    return null;
  }
}
