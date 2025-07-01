export default function handler(req, res) {
  res.status(200).json({
    ivKey: process.env.NEXT_PUBLIC_IV_KEY || 'Not set',
    ivKeyGemini: process.env.NEXT_PUBLIC_IV_GEMINI_KEY || 'Not set',
    password: process.env.NEXT_PUBLIC_PASSWORD || 'Not set'
  });
}
