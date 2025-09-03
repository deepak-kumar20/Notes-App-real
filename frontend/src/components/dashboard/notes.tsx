"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Trash2, Edit, Star, StarOff, Plus, X } from "lucide-react"
import { api } from "@/lib/api"
import { toast } from "sonner"

interface Note {
  _id: string;
  title: string;
  content: string;
  tags: string[];
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
}

export function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // Form states
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isImportant, setIsImportant] = useState(false)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await api.getNotes()
      if (response.success) {
        setNotes(response.notes || [])
      } else {
        toast.error("Failed to load notes")
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
      toast.error("Failed to load notes")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setTagInput("")
    setTags([])
    setIsImportant(false)
  }

  const addTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleCreateNote = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required")
      return
    }

    try {
      const response = await api.createNote({
        title: title.trim(),
        content: content.trim(),
        tags,
        isImportant
      })

      if (response.success) {
        toast.success("Note created successfully!")
        setIsCreateDialogOpen(false)
        resetForm()
        fetchNotes() // Refresh notes list
      } else {
        toast.error(response.message || "Failed to create note")
      }
    } catch (error) {
      console.error('Error creating note:', error)
      toast.error("Failed to create note")
    }
  }

  const handleEditNote = async () => {
    if (!editingNote || !title.trim() || !content.trim()) {
      toast.error("Title and content are required")
      return
    }

    try {
      const response = await api.updateNote(editingNote._id, {
        title: title.trim(),
        content: content.trim(),
        tags,
        isImportant
      })

      if (response.success) {
        toast.success("Note updated successfully!")
        setIsEditDialogOpen(false)
        setEditingNote(null)
        resetForm()
        fetchNotes() // Refresh notes list
      } else {
        toast.error(response.message || "Failed to update note")
      }
    } catch (error) {
      console.error('Error updating note:', error)
      toast.error("Failed to update note")
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) {
      return
    }

    try {
      const response = await api.deleteNote(noteId)
      if (response.success) {
        toast.success("Note deleted successfully!")
        fetchNotes() // Refresh notes list
      } else {
        toast.error(response.message || "Failed to delete note")
      }
    } catch (error) {
      console.error('Error deleting note:', error)
      toast.error("Failed to delete note")
    }
  }

  const openEditDialog = (note: Note) => {
    setEditingNote(note)
    setTitle(note.title)
    setContent(note.content)
    setTags(note.tags || [])
    setIsImportant(note.isImportant || false)
    setIsEditDialogOpen(true)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto bg-white">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white">
      <div className="mb-4">
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 px-4 rounded-lg" 
              onClick={() => {
                resetForm()
                setIsCreateDialogOpen(true)
              }}
            >
              Create Note
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter note title"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Content</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter note content"
                  rows={4}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tags</label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button type="button" size="sm" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportant(!isImportant)}
                  className={`flex items-center gap-1 text-sm ${isImportant ? 'text-yellow-600' : 'text-gray-600'}`}
                >
                  {isImportant ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                  Mark as important
                </button>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateNote} className="flex-1">
                  Create Note
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3 text-gray-900">
          Notes ({notes.length})
        </h2>
        <div className="space-y-2">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No notes yet. Create your first note!</p>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note._id}
                className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-100 transition-colors shadow-sm hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900">{note.title}</h3>
                      {note.isImportant && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {note.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Created: {formatDate(note.createdAt)}
                      {note.updatedAt !== note.createdAt && (
                        <span> • Updated: {formatDate(note.updatedAt)}</span>
                      )}
                    </p>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => openEditDialog(note)}
                      className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                      aria-label={`Edit ${note.title}`}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      aria-label={`Delete ${note.title}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter note content"
                rows={4}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button type="button" size="sm" onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsImportant(!isImportant)}
                className={`flex items-center gap-1 text-sm ${isImportant ? 'text-yellow-600' : 'text-gray-600'}`}
              >
                {isImportant ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                Mark as important
              </button>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleEditNote} className="flex-1">
                Update Note
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditingNote(null)
                  resetForm()
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
