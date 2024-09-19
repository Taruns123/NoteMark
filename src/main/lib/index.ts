import { appDirectoryName, fileEncoding, welcomeNoteFilename } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { dialog } from 'electron'
import { ensureDir, readFile, readdir, remove, stat, writeFile } from 'fs-extra'
import { isEmpty } from 'lodash'
import { homedir } from 'os'
import path from 'path'
import welcomeNoteFile from '../../../resources/welcomeNote.md?asset'

export const getRootDir = () => {
  return `${homedir()}\\${appDirectoryName}`
}

export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()
  await ensureDir(rootDir)

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false
  })

  console.info('notesFileNames', notesFileNames)
  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  if (isEmpty(notes)) {
    console.info('no notes found, creating a welcome note')

    const content = await readFile(welcomeNoteFile, { encoding: fileEncoding })

    // create a welcome note
    await writeFile(`${rootDir}\\${welcomeNoteFilename}`, content, {
      encoding: fileEncoding
    })

    notes.push(welcomeNoteFilename)
  }

  console.info('getNoteInfoFromFilename', getNoteInfoFromFilename)
  console.info('notes', notes)
  console.info('notes.map(getNoteInfoFromFilename)', notes.map(getNoteInfoFromFilename))

  return Promise.all(notes.map(getNoteInfoFromFilename))
}

export const getNoteInfoFromFilename = async (filename: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}\\${filename}`)

  return {
    title: filename.replace('.md', ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote: ReadNote = async (filename) => {
  const rootDir = getRootDir()

  return readFile(`${rootDir}\\${filename}.md`, {
    encoding: fileEncoding
  })
}

export const writeNote: WriteNote = async (filename, content) => {
  const rootDir = getRootDir()

  return writeFile(`${rootDir}\\${filename}.md`, content, {
    encoding: fileEncoding
  })
}

export const createNote: CreateNote = async () => {
  const rootDir = getRootDir()
  await ensureDir(rootDir)

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'New note',
    defaultPath: `${rootDir}\\Untitled.md`,
    buttonLabel: 'Create',
    properties: ['showOverwriteConfirmation'],
    showsTagField: false,
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })

  if (canceled || !filePath) {
    console.info('Note creation canceled')
    return false
  }

  const { name: filename, dir: parentDir } = path.parse(filePath)

  if (parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Invalid parent directory',
      message: `The note must be created in the ${rootDir} directory`,
      detail: `The root directory is ${rootDir}`
    })

    return false
  }

  console.info(`Creating note ${filePath}`)
  await writeFile(filePath, '', { encoding: fileEncoding })

  return filename
}

export const deleteNote: DeleteNote = async (filename) => {
  const rootDir = getRootDir()

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: 'Delete note',
    message: `Are you sure you want to delete the note ${filename}?`,
    detail: 'This action cannot be undone',
    buttons: ['Delete', 'Cancel'],
    defaultId: 1,
    cancelId: 1
  })

  if (response === 1) {
    console.info('Note deletion canceled')
    return false
  }

  const filePath = `${rootDir}\\${filename}.md`

  console.info(`Deleting note ${filename}`)
  await remove(filePath)

  return true
}
