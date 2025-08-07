
'use client'
import { useEffect, useRef } from 'react'

type Props = { slotId: string, style?: React.CSSProperties
 }

export default function AdSlot({ slotId, style }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    // Only render ads if consent given and client ID present
    const consent = typeof window !== 'undefined' ? localStorage.getItem('pt_consent') : null
    if (consent !== 'yes') return
    // Inject adsbygoogle script once
    const id = 'adsbygoogle-js'
    if (!document.getElementById(id)) {
      const s = document.createElement('script')
      s.id = id
      s.async = true
      s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-xxxxxxxxxxxxxxxx'
      s.crossOrigin = 'anonymous'
      document.head.appendChild(s)
    }
    const timer = setTimeout(() => {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      } catch {}
    }, 400)
    return () => clearTimeout(timer)
  }, [])
  return (
    <div className="my-4 flex justify-center">
      <ins className="adsbygoogle"
           style={style || { display: 'block', width: '100%', minHeight: 90 }}
           data-ad-client="ca-pub-xxxxxxxxxxxxxxxx"
           data-ad-slot={slotId}
           data-full-width-responsive="true"></ins>
    </div>
  )
}
