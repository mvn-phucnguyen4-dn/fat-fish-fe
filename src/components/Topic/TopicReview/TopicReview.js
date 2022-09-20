import React from 'react'
import { List, Typography } from 'antd'
import MultipleChoice from '../../Question/MultipleChoice/MultipleChoice'
import ShortAnswer from '../../Question/ShortAnswer/ShortAnswer'
import './TopicReview.css'

const { Text } = Typography

function TopicBodyReview({ sections, userAnswers }) {
  return (
    <>
      {sections && (
        <div>
          <List
            size="small"
            split={true}
            dataSource={sections}
            renderItem={(item) => {
              const draggble = item.id !== -1 // Allow all item can drag
              return (
                <List.Item className={draggble ? 'section draggble' : ''}>
                  <List.Item.Meta
                    className="section-item"
                    title={
                      <Text
                        className="section-title"
                        style={{ marginBottom: '50px' }}
                      >
                        {item.title}
                      </Text>
                    }
                    description={item.questions.map((element, index) => {
                      const userAnswer = userAnswers.find(
                        (answer) => answer.questionId === element.id,
                      )
                      return (
                        <div key={element.id}>
                          {element.type === 'multi_choice' ? (
                            <MultipleChoice
                              idx={index + 1}
                              question={element}
                              userAnswer={userAnswer}
                            />
                          ) : (
                            <ShortAnswer
                              idx={index + 1}
                              question={element}
                              userAnswer={userAnswer}
                            />
                          )}
                        </div>
                      )
                    })}
                  ></List.Item.Meta>
                </List.Item>
              )
            }}
          />
        </div>
      )}
    </>
  )
}

export default TopicBodyReview
