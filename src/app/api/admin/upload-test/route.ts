export async function GET() {
  return Response.json({ version: "v3-client-upload", timestamp: Date.now() })
}
