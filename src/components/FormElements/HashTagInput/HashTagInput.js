import React, { useState } from 'react'
import './HashTagInput.css'
import { ranColor } from '../../../utils/commonFunc'
import { Tag } from 'antd'

const MAX_LENGTH_TAG = 20

const HashTagInput = (props) => {
  const [suggestTags, setSuggestTags] = useState([
    { title: 'html', id: 1 },
    { title: 'css', id: 2 },
    { title: 'js', id: 3 },
    { title: 'java', id: 4 },
    { title: 'python', id: 5 },
  ])
  const [tagInServer, setTagInServer] = useState([])
  const [isShowSuggest, setIsShowSuggest] = useState(false)
  const { tags, removeTag, addTag } = props

  const handleAddTag = async (e) => {
    const tagTitle = e.target.value
    if (tagTitle.length > MAX_LENGTH_TAG || tagTitle == '') return
    if (e.code === 'Enter' && tagTitle !== '') {
      const tagsInServerTitle = tagInServer.map((tag) => tag.title)

      if (!tagsInServerTitle.includes(tagTitle)) {
        const newTag = await addHashTagAPI(tagTitle)
        addTag(newTag)
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
      <h4>{'Tag'}</h4>
      <div
        className="tags__input"
        onClick={() => setIsShowSuggest(true)}
        onBlur={() => setIsShowSuggest(false)}
      >
        <input
          type="text"
          placeholder="Press enter to add tags"
          onKeyUp={handleAddTag}
          onChange={suggestTag}
        />
        <div className={`dropdown-tag ${!isShowSuggest && 'hide-dropdown'}`}>
          {suggestTags &&
            suggestTags.slice(0, 5).map((tag, index) => (
              <div
                className="dropdown-row"
                key={tag.id}
                onClick={() => {
                  addTag(tag)
                  console.log(tag)
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
