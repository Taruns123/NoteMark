import { ActionButtonsRow, Content, FloatingNoteTitle, MarkdownEditor, NotePreviewList, RootLayout, Sidebar } from "@/components"
import DraggableTopBar from "@/components/DraggableTopBar"
import { DeleteNoteButton } from "./components/Button/DeleteNoteButton"
import { useRef } from "react"

const App = () => {

  const contentContainerRef = useRef<HTMLDivElement>(null)

  const resetScroll = () => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTo(0, 0)
    }
  }


  return (
    <>
      <DraggableTopBar />
      <RootLayout className=''>
        <Sidebar className='p-2 bg-zinc-400'>
          <ActionButtonsRow className="flex justify-between mt-1" />
          <NotePreviewList className='mt-3 space-y-1 text-black' onSelect={resetScroll} />
        </Sidebar>
        <Content ref={contentContainerRef} className='border-l bg-zinc-900/50  border-l-white/50'>
          <FloatingNoteTitle />
          <MarkdownEditor />
        </Content>
      </RootLayout>
    </>
  )
}

export default App
