import React, { useEffect, useState } from 'react'
import './HashTagInput.css'
import { Tag } from 'antd'
import { fetchDataApi } from '../../../utils/fetchDataApi'
import { auth } from '../../../utils/initFirebase'
import { useHttpClient } from '../../../hooks/useHttpClient'
import ErrorModal from '../../Modal/ErrorModal'

const COLORS = [
  'red',
  'magenta',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
]

const MAX_LENGTH_TAG = 20
const ranColor = () => {
  const ranIndex = Math.floor(Math.random() * COLORS.length)
  return COLORS[ranIndex]
}

const HashTagInput = (props) => {
  const [suggestTags, setSuggestTags] = useState([])
  const [tagInServer, setTagInServer] = useState([])
  const [isShowSuggest, setIsShowSuggest] = useState(false)
  const { tags, removeTag, addTag } = props
  const { clearError, setError, error } = useHttpClient()

  useEffect(() => {
    const fetchGetHashtag = async () => {
      try {
        const response = await fetchDataApi('hashtags', null, 'GET')
        setTagInServer([...response.data])
      } catch (error) {
        setError(error.message)
        console.log(error)
      }
    }
    fetchGetHashtag()
  }, [])

  const fetchAddHashtag = async (tagTitle) => {
    try {
      const tag = { title: tagTitle, iconUrl: '' }
      const token = await auth.currentUser.getIdToken()
      const response = await fetchDataApi('hashtags', token, 'POST', tag)
      return response.data
    } catch (error) {
      console.log(error)
      setError(error.message)
    }
  }

  const handleAddTag = async (e) => {
    const tagTitle = e.target.value.trim()
    if (tagTitle.length > MAX_LENGTH_TAG || tagTitle == '') return
    if (e.code === 'Enter' && tagTitle !== '') {
      const tagsInServerTitle = tagInServer.map((tag) => tag.title)

      if (!tagsInServerTitle.includes(tagTitle)) {
        const newTag = await fetchAddHashtag(tagTitle)
        addTag(newTag)
        setTagInServer([...tagInServer, newTag])
      } else {
        const tag = tagInServer.find((tag) => tag.title === tagTitle)
        addTag(tag)
      }
      e.target.value = ''
    }
  }

  const suggestTag = (e) => {
    const input = e.target.value
    var reg = new RegExp(input)
    setSuggestTags((suggestTags) => {
      suggestTags = tagInServer.filter((tag) => {
        if (tag.title.match(reg)) {
          return tag
        }
      })
      return suggestTags
    })
  }

  return (
    <>
      <ErrorModal error={error} onClose={clearError} />
      <h4>{'Tag'}</h4>
      <div className="tags__input" onClick={() => setIsShowSuggest(true)}>
        <input
          type="text"
          placeholder="Press enter to add tags"
          onKeyUp={handleAddTag}
          onChange={suggestTag}
          onBlur={() => {
            setIsShowSuggest(false)
          }}
        />
        <div className={`dropdown-tag ${!isShowSuggest && 'hide-dropdown'}`}>
          {suggestTags &&
            suggestTags.slice(0, 5).map((tag, index) => (
              <div
                className="dropdown-row"
                key={tag.id}
                onClick={() => {
                  addTag(tag)
                }}
              >
                {tag.title}
              </div>
            ))}
        </div>

        <ul className="input__list">
          {tags &&
            tags.map((tag) => (
              <Tag
                key={tag.id}
                closable
                onClose={() => removeTag(tag.id)}
                color={ranColor()}
              >
                {tag.title}
              </Tag>
            ))}
        </ul>
      </div>
    </>
  )
}

export default HashTagInput
