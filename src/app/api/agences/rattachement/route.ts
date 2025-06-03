import { NextResponse } from 'next/server'

export async function GET() {
  // Pour l'exemple, on retourne toujours l'agence AGC1 comme agence par défaut
  return NextResponse.json({ agenceId: 'AGC1' })
} 