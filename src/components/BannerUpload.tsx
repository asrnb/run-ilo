'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Props {
  slug: string
  currentUrl?: string
  onUploaded: (url: string) => void
}

export default function BannerUpload({ slug, currentUrl, onUploaded }: Props) {
  const [preview, setPreview] = useState(currentUrl ?? '')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    const local = URL.createObjectURL(file)
    setPreview(local)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('slug', slug)
      const res = await fetch('/api/upload-banner', { method: 'POST', body: form })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error)
      setPreview(json.url)
      onUploaded(json.url)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed')
      setPreview(currentUrl ?? '')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      {preview && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-predawn-700">
          <Image src={preview} alt="Banner preview" fill className="object-cover" unoptimized />
          {uploading && (
            <div className="absolute inset-0 bg-predawn-900/70 flex items-center justify-center">
              <span className="text-xs text-predawn-300 font-mono animate-pulse">Uploading…</span>
            </div>
          )}
        </div>
      )}
      <label className={[
        'flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono uppercase tracking-wider cursor-pointer transition-colors w-fit',
        uploading
          ? 'border-predawn-700 text-predawn-600 cursor-wait'
          : 'border-predawn-700 text-predawn-400 hover:border-predawn-500 hover:text-predawn-200',
      ].join(' ')}>
        <span>📷</span>
        <span>{preview ? 'Change Banner' : 'Add Banner Image'}</span>
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="hidden" />
      </label>
      {error && <p className="text-xs text-love">{error}</p>}
    </div>
  )
}
