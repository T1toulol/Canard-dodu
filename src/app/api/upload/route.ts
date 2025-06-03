import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier n\'a été fourni' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = file.name.replace(/[^a-zA-Z0-9.-]/g, '-').toLowerCase()
    const filepath = path.join(process.cwd(), 'public/images/produits', filename)
    
    await writeFile(filepath, buffer)
    
    return NextResponse.json({
      url: `/images/produits/${filename}`
    })
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error)
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement du fichier' },
      { status: 500 }
    )
  }
} 