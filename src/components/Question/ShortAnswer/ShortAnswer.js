import { Input } from 'antd'
import React, { useEffect, useState } from 'react'
import { BodyInput } from '../../FormElements/BodyInput/BodyInput'
import './ShortAnswer.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/a11y-dark.css'

function ShortAnswer({ idx, question, userAnswer, onBlur, sectionId }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    updateCodeSyntaxHighlighting()
  }, [])

  const updateCodeSyntaxHighlighting = () => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block)
    })
  }

  const handleChange = (value) => {
    setValue(value)
    onBlur(value, question, sectionId)
  }

  return (
    <>
      {userAnswer ? (
        <div className="short-answer">
          <div
            className={`${userAnswer.isRight ? 'correct' : 'incorrect'}`}
            level={4}
          >
            <div>
              <div
                className="mardown-output"
                dangerouslySetInnerHTML={{
                  __html: question.title,
                }}
              ></div>
            </div>
          </div>
          <div
            className="short-answer-input mardown-output"
            dangerouslySetInnerHTML={{
              __html: userAnswer.answerText,
            }}
          ></div>
          {!userAnswer.isRight && (
            <>
              <p style={{ marginTop: '10px', color: 'black' }}>
                <b>Description : </b>
                <div
                  className="mardown-output"
                  dangerouslySetInnerHTML={{
                    __html: question.description,
                  }}
                ></div>
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="short-answer">
          <div
            className="mardown-output"
            dangerouslySetInnerHTML={{
              __html: question.title,
            }}
          ></div>

          <BodyInput key="Body" value={value} handleChange={handleChange} />
        </div>
      )}
    </>
  )
}
export default ShortAnswer
