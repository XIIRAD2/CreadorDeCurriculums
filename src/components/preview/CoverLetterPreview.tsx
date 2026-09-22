import type { RefObject } from 'react'
import type { CvDocument } from '@/types/cv'
import { CoverLetterTemplate } from '@/components/preview/CoverLetterTemplate'

/** A cover letter is conventionally one page, so unlike CvPreview this doesn't track a
 * page count or show page-break markers — content that runs long just grows the page,
 * same visual cue as any other overflow in this app's live preview. */
export function CoverLetterPreview({ cv, pageRef }: { cv: CvDocument; pageRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={pageRef} className="cv-page shadow-2xl shadow-slate-400/30">
      <CoverLetterTemplate cv={cv} />
    </div>
  )
}
