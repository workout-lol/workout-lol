import React, { useEffect, useRef } from 'react'
import styles from './Muscles.module.css'

/**
 * Props:
 * - toggleMuscle(id: string)
 * - selectedMuscles: string[]  (previously named 'muscles')
 * - exerciseCount: Array<{ name: string, count: number }>
 */
const Illustration = ({ toggleMuscle, selectedMuscles = [], exerciseCount = [] }) => {
  const objRef = useRef(null)

  useEffect(() => {
    const svgObject = objRef.current
    if (!svgObject) return

    function onLoad() {
      const svgDoc = svgObject.contentDocument
      if (!svgDoc) return

      // Make any path with data-elem (or common classes) clickable
      const clickable = svgDoc.querySelectorAll('[data-elem], .muscle, .Muscles_muscle__AqgYn')

      // Safety: ensure pointer events
      const style = svgDoc.createElement('style')
      style.textContent = `[data-elem], .muscle, .Muscles_muscle__AqgYn { pointer-events: all; cursor: pointer; }`
      svgDoc.documentElement.prepend(style)

      const handleClick = (e) => {
        const el = e.target
        const id = el?.getAttribute('data-elem') || el?.id
        if (id && typeof toggleMuscle === 'function') {
          toggleMuscle(id)
        }
      }

      clickable.forEach((el) => el.addEventListener('click', handleClick))

      return () => {
        clickable.forEach((el) => el.removeEventListener('click', handleClick))
      }
    }

    svgObject.addEventListener('load', onLoad)
    // if already loaded (cache), try immediately
    if (svgObject.contentDocument) onLoad()

    return () => {
      svgObject.removeEventListener('load', onLoad)
    }
  }, [toggleMuscle])

  // Map counts to show numbers (optional overlay)
  const counts = Object.fromEntries(
    (exerciseCount || []).map((d) => [String(d.name || d.muscle || d.id || '').toLowerCase(), d.count])
  )

  return (
    <div className={styles.illustration}>
      <object
        ref={objRef}
        type="image/svg+xml"
        data="/muscle-male_clickable.svg"
        aria-label="Muscle map"
        className={styles.illustrationObject}
      />
      {/* Optional: legend or counts can be rendered here using `counts` */}
    </div>
  )
}

export default Illustration
