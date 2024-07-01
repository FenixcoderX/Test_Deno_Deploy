const port = 8080;

const texts: Record<string, string> = {};

const generateRandomString = () => Math.random().toString(36).substring(7);

const handler = async (request: Request): Promise<Response> => {
  const url = new URL(request.url, `http://localhost:${port}`);
  
  if (request.method === "GET") {
    if (url.pathname === "/") {
      // Serve the form
      const html = `
        <html>
          <body>
            <form action="/" method="post">
              <input type="text" name="userInput" placeholder="Type something...">
              <button type="submit">Submit</button>
            </form>
          </body>
        </html>
      `;
      return new Response(html, { headers: { "Content-Type": "text/html" } });
    } else {
      // Serve the stored text
      const text = texts[url.pathname.slice(1)] || "Text not found";
      return new Response(text);
    }
  } else if (request.method === "POST") {
    const formData = await request.formData();
    const userInput = formData.get("userInput");
    if (typeof userInput === "string") {
      const path = generateRandomString();
      texts[path] = userInput;
      const responseHTML = `
        <html>
          <body>
            <p>URL generated: <a href="/${path}">https://fenixcoderx-test-deno-d-34.deno.dev/${path}</a></p>
          </body>
        </html>
      `;
      return new Response(responseHTML, { headers: { "Content-Type": "text/html" } });
    }
  }

  return new Response("Method not allowed", { status: 405 });
};

console.log(`HTTP server running. Access it at: http://localhost:${port}/`);
Deno.serve({ port }, handler);