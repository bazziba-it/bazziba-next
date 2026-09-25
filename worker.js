// Cloudflare Worker for redirects and headers
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Redirect www to apex
    if (url.hostname.startsWith("www.")) {
      url.hostname = "bazziba.it";
      return Response.redirect(url, 301);
    }
    
    // Add custom headers
    const response = await fetch(request);
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("X-Frame-Options", "DENY");
    response.headers.set("X-XSS-Protection", "1; mode=block");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    
    return response;
  },
};
