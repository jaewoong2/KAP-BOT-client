import React, { useCallback, useEffect, useState } from 'react'
import TextArea from '@/components/atoms/TextArea'
import useCopilotState, { LABEL, LIMIT_TEXT_LENGTH, MINIMUM_TEXT_LENGTH, TOOLTIP } from '@/hooks/useCopilotState'
import useDebounce from '@/hooks/useDebounce'
import { PLACEHOLDER } from '@/hooks/useFeedbackState'
import { Copilot } from '@/types'
import { AddIcon, InfoIcon, QuestionIcon } from '@chakra-ui/icons'
import { Icon, Input, Tag, TagLabel, TagLeftIcon, Text } from '@chakra-ui/react'
import { FcDislike, FcLike } from 'react-icons/fc'

type Props = {
  errorMessage?: string | null
  isLoading: boolean
  copilot?: string
  reset: () => void
} & ReturnType<typeof useCopilotState>

const CopilotMain = ({
  errorMessage,
  content,
  title,
  reset,
  mutate,
  handleChangePosition,
  handleChangeContent,
  handleChangeTitle,
  position,
  copilot,
  isLoading,
  setMessage,
  setContent,
}: Props) => {
  const [isActive, setIsActive] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const debounceValue = useDebounce(content, 2500)

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIsEditing(true)
    handleChangeContent(e)
  }, [])

  const handleAddCopliot = useCallback(() => {
    if (copilot) {
      setContent((prev) => prev + copilot)
    }
    reset()
  }, [copilot])

  const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      if (copilot) {
        setContent((prev) => prev + copilot)
      }
      reset()
    } else {
      reset()
    }
  }

  useEffect(() => {
    if (debounceValue === content) {
      if (isEditing && isActive && position && title && content) {
        if (content.length > LIMIT_TEXT_LENGTH) {
          setMessage(`최대 ${LIMIT_TEXT_LENGTH}자 까지만 작성 가능 해요 🥲`)
          return
        }

        if (content.length < MINIMUM_TEXT_LENGTH) {
          setMessage(`${MINIMUM_TEXT_LENGTH - content.length}자 더 작성 부탁 드려요`)
          return
        }

        setMessage(null)
        mutate({ content, position, title })
        setIsEditing(false)
      }
    }
  }, [debounceValue, content, title, position, isActive, isEditing])

  useBeforeUnload(content.length > 0)

  return (
    <form id='feedback-form'>
      <div className='w-full px-6 pt-3 text-sm'>
        <div className='gap-10 xl:flex'>
          <div className='xl:w-[400px]'>
            <Text className='flex items-center gap-1 whitespace-nowrap py-2'>
              <QuestionIcon />
              어떤 내용의 지원서 인가요?
            </Text>
            <Input
              value={title}
              onChange={handleChangeTitle}
              className='text-sm'
              fontSize='sm'
              borderColor='gray.300'
              placeholder='지원동기, 성공경험, 성장배경'
              _dark={{ borderColor: 'gray.500' }}
            />
          </div>
          <div>
            <Text className='flex items-center gap-1 whitespace-nowrap py-2'>
              <QuestionIcon />
              어떤 직무의 지원서 인가요?
            </Text>
            <Input
              value={position}
              onChange={handleChangePosition}
              className='text-sm'
              fontSize='sm'
              borderColor='gray.300'
              placeholder='마케터, 인사담당자, 개발자'
              _dark={{ borderColor: 'gray.500' }}
            />
          </div>
        </div>
      </div>
      <div className='p-3 pb-0'>
        <div className='flex w-full flex-col items-end gap-2 px-3'>
          <button
            type='button'
            onClick={() => setIsActive((prev) => !prev)}
            className='cursor-pointer rounded-xl p-3 shadow-xl dark:shadow-inner dark:shadow-darkBg-200'
          >
            <Icon as={isActive ? FcLike : FcDislike} />
          </button>
          <span className='flex items-center gap-2 text-xs text-gray-400'>
            <InfoIcon />봇 {!isActive ? '정지' : '실행 중'}
          </span>
        </div>
        <TextArea
          isLoading={isLoading}
          label={LABEL}
          placeholder={PLACEHOLDER}
          resize='none'
          minH='400px'
          borderColor={errorMessage ? 'red.300' : 'gray.300'}
          _dark={{
            borderColor: errorMessage ? 'red.300' : 'gray.500',
          }}
          tooltip={TOOLTIP}
          isDisabled={isLoading}
          value={content}
          onChange={handleChange}
          onKeyDown={onKeyDown}
          className='relative'
        />
        {copilot && (
          <div className='px-3'>
            <Tag size='md' key='md' variant='subtle' cursor='pointer' className='p-2' onClick={handleAddCopliot}>
              <TagLeftIcon boxSize='12px' as={AddIcon} />
              <TagLabel>{copilot}</TagLabel>
            </Tag>
          </div>
        )}
        <div className={`flex w-full justify-between px-3 text-sm ${errorMessage ? 'text-red-400' : 'text-gray-500'}`}>
          <div>{errorMessage && <span className='animate-fade-in-left text-red-500'>{errorMessage}</span>}</div>
          <div className={content.length > LIMIT_TEXT_LENGTH ? 'text-red-400' : ''}>
            {content.length} / {LIMIT_TEXT_LENGTH}
          </div>
        </div>
      </div>
    </form>
  )
}

export default CopilotMain
