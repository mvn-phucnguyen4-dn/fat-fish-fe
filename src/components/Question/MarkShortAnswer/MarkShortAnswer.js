import { Typography, Input, Switch } from 'antd'
import React, { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { AuthContext } from '../../../context/auth'
import { fetchDataApi } from '../../../utils/fetchDataApi'
import './MarkShortAnswer.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/a11y-dark.css'

const { Paragraph } = Typography

function useQuery() {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}

function MarkShortAnswer({ idx, topic, question, userAnswer }) {
  const query = useQuery()
  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    updateCodeSyntaxHighlighting()
  }, [])

  const onChange = async (checked) => {
    await fetchDataApi(
      `topics/${topic.id}/user-answers/${userAnswer.id}`,
      currentUser.accessToken,
      'PUT',
      { isRight: checked },
    )
    await fetchDataApi(
      `topics/${topic.id}/scores/${query.get('scoreId')}`,
      currentUser.accessToken,
      'PUT',
    )
  }

  const updateCodeSyntaxHighlighting = () => {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightBlock(block)
    })
  }

  return (
    <div className="short-answer">
      <div
        className={`${userAnswer.isRight ? 'correct' : 'incorrect'}`}
        level={4}
      >
        <div
          className="mardown-output"
          dangerouslySetInnerHTML={{
            __html: question.title,
          }}
        ></div>
      </div>
      <div
        className="short-answer-input mardown-output"
        dangerouslySetInnerHTML={{
          __html: userAnswer.answerText,
        }}
      ></div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Paragraph style={{ maxWidth: '80%' }}>
          <b>Description: </b>
          <div
            className="mardown-output"
            dangerouslySetInnerHTML={{
              __html: question.description,
            }}
          ></div>
        </Paragraph>
        <Switch
          checkedChildren="true"
          unCheckedChildren="false"
          defaultChecked={userAnswer.isRight}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default MarkShortAnswer
