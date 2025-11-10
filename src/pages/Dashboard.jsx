import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'
import Navbar from '../components/Navbar'

const API_URL = import.meta.env.VITE_BACKEND_URL || ''

function Composer({ onSubmit }) {
  const [text, setText] = useState('')
  return (
    <div className="rounded-xl bg-white p-4 shadow border border-emerald-100">
      <textarea className="w-full resize-none rounded-lg border p-3" rows={3} placeholder="What's on your mind?" value={text} onChange={e=>setText(e.target.value)} />
      <div className="mt-2 flex justify-end">
        <button onClick={()=>{ if(!text.trim()) return; onSubmit(text); setText('') }} className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700">Post</button>
      </div>
    </div>
  )
}

function PostCard({ post, onLike, onComment }) {
  const [comment, setComment] = useState('')
  return (
    <div className="rounded-xl bg-white p-4 shadow border border-emerald-100">
      <div className="mb-2 text-sm text-gray-600">Posted in {post.group_id}</div>
      <div className="text-gray-900">{post.content}</div>
      <div className="mt-3 flex items-center gap-3 text-sm">
        <button onClick={onLike} className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">👍 Like</button>
      </div>
      <div className="mt-3 flex gap-2">
        <input value={comment} onChange={e=>setComment(e.target.value)} placeholder="Write a comment" className="flex-1 rounded-lg border px-3 py-2" />
        <button onClick={()=>{ if(!comment.trim()) return; onComment(comment); setComment('') }} className="rounded-lg bg-gray-900 px-3 py-2 text-white">Comment</button>
      </div>
      {post.comments?.length>0 && (
        <div className="mt-3 grid gap-2">
          {post.comments.map(c => <div key={c.id} className="rounded border p-2 text-sm text-gray-700">{c.content}</div>)}
        </div>
      )}
    </div>
  )
}

export default function Dashboard() {
  const [groups, setGroups] = useState([])
  const [selected, setSelected] = useState(null)
  const [posts, setPosts] = useState([])
  const user = JSON.parse(localStorage.getItem('cs_user') || 'null')

  useEffect(() => {
    if (!user) window.location.href = '/login'
  }, [])

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_URL}/api/groups`)
      if (res.ok) setGroups(await res.json())
    }
    load()
  }, [])

  async function openGroup(g) {
    setSelected(g)
    const res = await fetch(`${API_URL}/api/groups/${g.id}/posts`)
    if (res.ok) setPosts(await res.json())
  }

  async function createPost(text) {
    if (!selected) return
    const body = { group_id: selected.id, author_id: user?.id || 'demo', content: text }
    const res = await fetch(`${API_URL}/api/groups/${selected.id}/posts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) {
      const r = await fetch(`${API_URL}/api/groups/${selected.id}/posts`)
      if (r.ok) setPosts(await r.json())
    }
  }

  async function like(post) {
    await fetch(`${API_URL}/api/posts/${post.id}/likes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ post_id: post.id, user_id: user?.id || 'demo' }) })
  }

  async function comment(post, content) {
    await fetch(`${API_URL}/api/posts/${post.id}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ post_id: post.id, author_id: user?.id || 'demo', content }) })
    const r = await fetch(`${API_URL}/api/posts/${post.id}/comments`)
    if (r.ok) {
      const comments = await r.json()
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, comments } : p))
    }
  }

  return (
    <div className="min-h-screen bg-emerald-50">
      <Navbar />
      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-[1fr,2fr,1fr]">
        <aside className="hidden md:block">
          <div className="rounded-xl bg-white p-4 shadow border border-emerald-100">
            <div className="mb-2 text-sm font-semibold text-emerald-900">Groups</div>
            <div className="grid gap-2">
              {groups.map(g => (
                <button key={g.id} onClick={()=>openGroup(g)} className={`rounded-lg border px-3 py-2 text-left hover:border-emerald-300 ${selected?.id===g.id? 'border-emerald-400 bg-emerald-50' : ''}`}>
                  <div className="text-sm font-medium text-gray-900">{g.name}</div>
                  <div className="text-xs text-gray-600 line-clamp-1">{g.description}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>
        <section className="grid gap-4">
          {!selected && (
            <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow">
              <div className="mb-3 text-2xl font-bold text-emerald-800">Welcome, {user?.name || 'Student'} 👋</div>
              <p className="mb-4 text-gray-600">Pick a group from the left to view and create posts.</p>
              <div className="h-48 overflow-hidden rounded-xl">
                <Spline scene="https://prod.spline.design/ezRAY9QD27kiJcur/scene.splinecode" style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
          )}
          {selected && (
            <>
              <Composer onSubmit={createPost} />
              <div className="grid gap-4">
                {posts.map(p => (
                  <PostCard key={p.id} post={p} onLike={() => like(p)} onComment={(c)=>comment(p,c)} />
                ))}
                {posts.length===0 && <div className="rounded-xl border border-emerald-100 bg-white p-6 text-gray-600">No posts yet.</div>}
              </div>
            </>
          )}
        </section>
        <aside className="hidden md:block">
          <div className="rounded-xl bg-white p-4 shadow border border-emerald-100">
            <div className="mb-2 text-sm font-semibold text-emerald-900">Shortcuts</div>
            <ul className="grid gap-1 text-sm text-gray-700">
              <li className="hover:text-emerald-700">My profile</li>
              <li className="hover:text-emerald-700">Campus events</li>
              <li className="hover:text-emerald-700">Settings</li>
            </ul>
          </div>
        </aside>
      </main>
    </div>
  )
}
