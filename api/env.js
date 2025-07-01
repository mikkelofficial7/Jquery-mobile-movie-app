export default function handler(req, res) {
  res.status(200).json({
    ivKey: process.env.NEXT_PUBLIC_IV_KEY || 'Not set',
    ivKeyGemini: process.env.NEXT_PUBLIC_IV_GEMINI_KEY || 'Not set',
    passwordKey: process.env.NEXT_PUBLIC_PASSWORD || 'Not set',
    templateGeminiSearch: process.env.NEXT_PUBLIC_QUERY_GEMINI || 'Not set',
    templateGeminiSearchImage: process.env.NEXT_PUBLIC_QUERY_GEMINI_IMAGE || 'Not set'
  });
}
