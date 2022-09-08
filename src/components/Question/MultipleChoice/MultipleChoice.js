import { CloseOutlined, CheckOutlined } from '@ant-design/icons/lib/icons'
import { Radio, Space, Typography } from 'antd'
import React, { useState } from 'react'
import './MultipleChoice.css'

const { Title } = Typography

function MultipleChoice({ idx, question, userAnswer, onChange }) {
  const [value, setValue] = useState('')

  const onChangeRadio = (e) => {
    setValue(e.target.value)
    onChange && onChange(e.target.value, question)
  }
  return (
    <div className="multi-choice">
      {userAnswer ? (
        <div>
          {question && (
            <>
              <Title
                className={`${userAnswer.isRight ? 'correct' : 'incorrect'}`}
                level={4}
              >
                <p>
                  {userAnswer.isRight ? <CheckOutlined /> : <CloseOutlined />}
                  {'   '}
                  {question.title}
                </p>
              </Title>
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
                      // <Radio.Group
                      //   className="radio-group"
                      //   value={item.answer}
                      //   key={item.id}
                      // >
                      item.isRight && (
                        <Radio
                          value={item.answer}
                          checked
                          className="btn-radio btn-radio-disabled"
                        >
                          {item.answer}
                        </Radio>
                      ),
                    // </Radio.Group>
                    // <Typography key={item.id}>
                    //   {item.isRight && item.answer}
                    // </Typography>
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
              <Title level={4}>{idx + '. ' + question.title}</Title>
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
