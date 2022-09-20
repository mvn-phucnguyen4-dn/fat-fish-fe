import { CloseOutlined, CheckOutlined } from '@ant-design/icons/lib/icons'
import { Radio, Space, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import './MultipleChoice.css'
import hljs from 'highlight.js' // import hljs library
import 'highlight.js/styles/a11y-dark.css'

const { Title } = Typography

function MultipleChoice({ idx, question, userAnswer, onChange, sectionId }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    updateCodeSyntaxHighlighting()
  }, [])

  const updateCodeSyntaxHighlighting = () => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block)
    })
  }

  const onChangeRadio = (e) => {
    setValue(e.target.value)
    onChange && onChange(e.target.value, question, sectionId)
  }

  return (
    <div className="multi-choice">
      {userAnswer ? (
        <div>
          {question && (
            <>
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
              <Radio.Group className="radio-group" value={userAnswer.answerId}>
                <Space className="radio-item" direction="vertical">
                  {question.answers.map((item) => {
                    if (item.id === userAnswer.answerId) {
                      if (userAnswer.isRight) {
                        return (
                          <Radio
                            className="btn-radio btn-radio-disabled ans-correct"
                            key={item.id}
                            value={item.id}
                          >
                            <p className="item-answer">{item.answer}</p>
                            <CheckOutlined className="answer-icon correct" />
                          </Radio>
                        )
                      } else {
                        return (
                          <Radio
                            className="btn-radio btn-radio-disabled ans-incorrect"
                            key={item.id}
                            value={item.id}
                          >
                            <p className="item-answer">{item.answer}</p>
                            <CloseOutlined className="answer-icon incorrect" />
                          </Radio>
                        )
                      }
                    } else {
                      return (
                        <Radio
                          className="btn-radio btn-radio-disabled"
                          key={item.id}
                          value={item.id}
                        >
                          {item.answer}
                        </Radio>
                      )
                    }
                  })}
                </Space>
              </Radio.Group>
              {!userAnswer.isRight && (
                <div className="correct_answer">
                  <p style={{ color: 'black' }}>Correct answer</p>{' '}
                  {question.answers.map(
                    (item) =>
                      item.isRight && (
                        <Radio
                          value={item.answer}
                          checked
                          className="btn-radio btn-radio-disabled"
                        >
                          {item.answer}
                        </Radio>
                      ),
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div>
          {question && (
            <>
              <div
                className="mardown-output"
                dangerouslySetInnerHTML={{
                  __html: question.title,
                }}
              ></div>

              <Radio.Group onChange={onChangeRadio}>
                <Space direction="vertical">
                  {question.answers.map((item) => (
                    <Radio className="btn-radio" key={item.id} value={item.id}>
                      {item.answer}
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default MultipleChoice
