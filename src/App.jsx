import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

const API_URL = import.meta.env.VITE_BACKEND_URL || ''

function Hero() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/ezRAY9QD27kiJcur/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 flex flex-col items-start gap-6">
        <span className="px-3 py-1 rounded-full bg-white/70 backdrop-blur text-indigo-700 text-sm font-medium shadow">Campus Social</span>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900 drop-shadow-sm">
          Groups for every class, club, and community
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
          Post updates, comment, and like. Moderators keep things tidy, admins oversee the campus.
        </p>
        <div className="flex gap-3">
          <a href="#groups" className="inline-flex items-center rounded-lg bg-indigo-600 text-white px-5 py-3 font-semibold shadow hover:bg-indigo-700 transition">Explore Groups</a>
          <a href="#create" className="inline-flex items-center rounded-lg bg-white/80 backdrop-blur text-indigo-700 px-5 py-3 font-semibold shadow hover:bg-white transition">Create Group</a>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
    </section>
  )
}

function GroupCard({ group, onSelect }) {
  return (
    <button onClick={() => onSelect(group)} className="text-left w-full bg-white rounded-xl p-5 shadow hover:shadow-md transition border border-gray-100">
      <h3 className="font-semibold text-lg text-gray-900">{group.name}</h3>
      <p className="text-gray-600 line-clamp-2">{group.description || 'No description yet.'}</p>
    </button>
  )
}

function CreateGroup({ onCreated }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)

  async function create() {
    if (!name.trim()) return
    setCreating(true)
    try {
      const res = await fetch(`${API_URL}/api/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, created_by: 'demo-user-id' })
      })
      if (!res.ok) throw new Error('Failed to create group')
      const data = await res.json()
      onCreated({ id: data.id, name, description })
      setName('')
      setDescription('')
    } catch (e) {
      console.error(e)
      alert('Could not create group')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div id="create" className="bg-white rounded-xl p-6 shadow border border-gray-100">
      <h2 className="text-xl font-semibold mb-4">Create a new group</h2>
      <div className="grid gap-3">
        <input className="border rounded-lg px-3 py-2" placeholder="Group name" value={name} onChange={e => setName(e.target.value)} />
        <textarea className="border rounded-lg px-3 py-2" placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
        <button onClick={create} disabled={creating} className="inline-flex justify-center rounded-lg bg-indigo-600 text-white px-4 py-2 font-semibold hover:bg-indigo-700 disabled:opacity-50">{creating ? 'Creating...' : 'Create Group'}</button>
      </div>
    </div>
  )
}

function Posts({ group }) {
  const [posts, setPosts] = useState([])
  const [content, setContent] = useState('')

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_URL}/api/groups/${group.id || group._id || group.group_id || group.name}/posts`)
      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    }
    load()
  }, [group])

  async function submit() {
    if (!content.trim()) return
    const body = { group_id: group.id || group.group_id || group.name, author_id: 'demo-user-id', content }
    const res = await fetch(`${API_URL}/api/groups/${body.group_id}/posts`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    })
    if (res.ok) {
      setContent('')
      const newRes = await fetch(`${API_URL}/api/groups/${body.group_id}/posts`)
      setPosts(await newRes.json())
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
      <h3 className="font-semibold text-lg mb-3">Posts</h3>
      <div className="flex gap-2 mb-4">
        <input className="flex-1 border rounded-lg px-3 py-2" placeholder="Share something with the group" value={content} onChange={e => setContent(e.target.value)} />
        <button onClick={submit} className="rounded-lg bg-indigo-600 text-white px-4 py-2 font-semibold hover:bg-indigo-700">Post</button>
      </div>
      <div className="grid gap-3">
        {posts.map(p => (
          <div key={p.id} className="border rounded-lg p-4">
            <p className="text-gray-900">{p.content}</p>
            <PostActions post={p} />
          </div>
        ))}
      </div>
    </div>
  )
}

function PostActions({ post }) {
  const [likes, setLikes] = useState(0)
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')

  useEffect(() => {
    async function load() {
      const l = await fetch(`${API_URL}/api/posts/${post.id}/likes`)
      if (l.ok) setLikes((await l.json()).length)
      const c = await fetch(`${API_URL}/api/posts/${post.id}/comments`)
      if (c.ok) setComments(await c.json())
    }
    if (post?.id) load()
  }, [post])

  async function like() {
    await fetch(`${API_URL}/api/posts/${post.id}/likes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ post_id: post.id, user_id: 'demo-user-id' }) })
    const l = await fetch(`${API_URL}/api/posts/${post.id}/likes`)
    if (l.ok) setLikes((await l.json()).length)
  }

  async function comment() {
    if (!text.trim()) return
    await fetch(`${API_URL}/api/posts/${post.id}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ post_id: post.id, author_id: 'demo-user-id', content: text }) })
    setText('')
    const c = await fetch(`${API_URL}/api/posts/${post.id}/comments`)
    if (c.ok) setComments(await c.json())
  }

  return (
    <div className="mt-3">
      <div className="flex items-center gap-3">
        <button onClick={like} className="text-sm px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">👍 Like ({likes})</button>
        <div className="flex-1" />
      </div>
      <div className="mt-3">
        <div className="flex gap-2">
          <input className="flex-1 border rounded-lg px-3 py-1" placeholder="Write a comment" value={text} onChange={e => setText(e.target.value)} />
          <button onClick={comment} className="rounded-lg bg-gray-900 text-white px-3 py-1 text-sm">Comment</button>
        </div>
        <div className="mt-3 grid gap-2">
          {comments.map(c => (
            <div key={c.id} className="text-sm text-gray-700 border rounded p-2">{c.content}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [groups, setGroups] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    async function load() {
      const res = await fetch(`${API_URL}/api/groups`)
      if (res.ok) setGroups(await res.json())
    }
    load()
  }, [])

  function onCreated(g) {
    setGroups(prev => [g, ...prev])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <Hero />

      <main className="max-w-6xl mx-auto px-6 pb-24 -mt-16">
        <div className="grid md:grid-cols-[1.2fr,0.8fr] gap-6" id="groups">
          <div className="grid gap-6">
            <div className="bg-white rounded-xl p-6 shadow border border-gray-100">
              <h2 className="text-2xl font-bold mb-4">Groups</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {groups.map(g => (
                  <GroupCard key={g.id || g.name} group={g} onSelect={setSelected} />
                ))}
                {groups.length === 0 && <p className="text-gray-600">No groups yet. Be the first to create one!</p>}
              </div>
            </div>

            {selected && <Posts group={selected} />}
          </div>
          <CreateGroup onCreated={onCreated} />
        </div>
      </main>
    </div>
  )
}

export default App
