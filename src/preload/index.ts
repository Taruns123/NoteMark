import { contextBridge, ipcRenderer } from 'electron'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'

if (!process.contextIsolated) {
  throw new Error('preload script is not context isolated context Isolation must be enabled')
}

try {
  contextBridge.exposeInMainWorld('context', {
    // TODO
    locale: navigator.language,
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
    readNote: (...args: Parameters<ReadNote>) => ipcRenderer.invoke('readNote', ...args),
    writeNote: (...args: Parameters<WriteNote>) => ipcRenderer.invoke('writeNote', ...args),
    createNote: (...args: Parameters<CreateNote>) => ipcRenderer.invoke('createNote', ...args),
    deleteNote: (...args: Parameters<DeleteNote>) => ipcRenderer.invoke('deleteNote', ...args)
  })
} catch (error) {
  console.log(error)
}
