'use client'

import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import AdSlot from '@/components/AdSlot'
import { useEffect, useState, useMemo } from 'react';

export default function VideoToGifPage() {
 const ffmpeg = useMemo(() =>
  createFFmpeg({
    log: false,
   corePath: '/ffmpeg/ffmpeg-core.js',
  }),
  []
  )
  const [ready, setReady] = useState(false)
  const [video, setVideo] = useState<File | null>(null)
  const [fps, setFps] = useState(10)
  const [width, setWidth] = useState(320)
  const [height, setHeight] = useState(240)
  const [gifUrl, setGifUrl] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    ffmpeg.load().then(() => setReady(true))
  }, [ffmpeg])

  const convert = async () => {
    if (!video) return
    setBusy(true)
    setGifUrl('')
    try {
      ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(video))
      await ffmpeg.run(
        '-i',
        'input.mp4',
        '-vf',
        `fps=${fps},scale=${width}:${height}:flags=lanczos`,
        '-f',
        'gif',
        'out.gif'
      )
      const data = ffmpeg.FS('readFile', 'out.gif')
      const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }))
      setGifUrl(url)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6 py-6">
      <div className="card w-full max-w-screen-md">
        <h1 className="text-xl font-semibold mb-3">MP4 → GIF</h1>
        <p className="text-neutral-400 mb-4">Conversion runs fully in your browser.</p>

        <input
          type="file"
          accept="video/mp4"
          onChange={e => {
            setVideo(e.target.files?.[0] || null)
            setGifUrl('')
          }}
          className="mb-2"
        />

        <p className="text-sm text-neutral-500 mb-4">
          {!ready
            ? 'Loading FFmpeg…'
            : video
            ? `Selected: ${video.name} (${(video.size / 1024 / 1024).toFixed(1)} MB)`
            : 'No file selected'}
        </p>

        <div className="flex flex-wrap gap-4 mb-4">
          <label className="flex flex-col text-sm">
            Frame rate
            <input
              type="number"
              min={1}
              value={fps}
              onChange={e => setFps(Number(e.target.value))}
              className="input mt-1"
            />
          </label>
          <label className="flex flex-col text-sm">
            Width
            <input
              type="number"
              min={1}
              value={width}
              onChange={e => setWidth(Number(e.target.value))}
              className="input mt-1"
            />
          </label>
          <label className="flex flex-col text-sm">
            Height
            <input
              type="number"
              min={1}
              value={height}
              onChange={e => setHeight(Number(e.target.value))}
              className="input mt-1"
            />
          </label>
        </div>

        <button onClick={convert} disabled={!ready || !video || busy} className="btn w-full">
          {busy
            ? 'Converting…'
            : !ready
            ? 'Loading FFmpeg…'
            : !video
            ? 'Select an MP4 file'
            : 'Convert to GIF'}
        </button>

        {gifUrl && (
          <div className="mt-4 space-y-2">
            <img src={gifUrl} alt="GIF preview" className="mx-auto rounded" />
            <a href={gifUrl} download="output.gif" className="underline block text-center">
              Download GIF
            </a>
          </div>
        )}
      </div>

      <div className="w-full max-w-screen-md mx-auto">
        <AdSlot slotId="0000000002" />
      </div>
    </div>
  )
}
