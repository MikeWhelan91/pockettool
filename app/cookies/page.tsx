
'use client'
export default function Cookies(){
  return <div className="prose prose-invert max-w-none">
    <h1>Cookies</h1>
    <p>To fund free tools, we use advertising cookies only after you consent. You can revoke consent below.</p>
    <button className="px-3 py-2 rounded bg-brand" onClick={()=>{ localStorage.removeItem('pt_consent'); location.reload() }}>Reopen consent</button>
  </div>
}
