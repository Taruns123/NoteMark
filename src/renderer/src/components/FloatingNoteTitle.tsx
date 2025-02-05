import { selectedNoteAtom } from '@/store'
import { useAtomValue } from 'jotai'
import React, { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

export const FloatingNoteTitle = ({ className, ...props }: ComponentProps<'div'>) => {



    const selectedNote = useAtomValue(selectedNoteAtom)

    if (!selectedNote) {
        return null
    }

    return (
        <div className={twMerge('flex justify-center', className)} {...props}>
            <span className='text-gray-900'>
                {selectedNote.title}
            </span>
        </div>
    )
}
