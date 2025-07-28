'use client'

import { useRouter } from 'next/navigation'
import { ChangeEvent, useEffect, useState } from 'react'
import { fetchWithAuth } from '@/lib/fetch-with-auth'
import { ProfileType } from '../../_types'

export default function ProfileItem() {
  const [nickName, setNickName] = useState('')
  const [email, setEmail] = useState('')
  const [updateNickName, setUpdateNickName] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [active, setActive] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const handleConfirm = () => {
    const fetchNickName = async () => {
      try {
        const newNickName: ProfileType = await fetchWithAuth(
          '/api/user/profile',
          {
            auth: true,
            method: 'PATCH',
            body: JSON.stringify({ nickName: updateNickName.trim() }),
          },
        )

        setNickName(newNickName?.nickName)
        setUpdateNickName('')
        setActive(false)
        setIsEditing(false)
        router.refresh()
      } catch (error) {
        if (error instanceof Error)
          console.error('닉네임 변경 로딩 실패:', error.message)
        else console.error('왜 나는지 모르는 에러:', error)
      }
    }
    fetchNickName()
  }

  const handleEdit = () => {
    setIsEditing(true)
    setUpdateNickName(nickName)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setUpdateNickName('')
    setErrorMsg('')
    setActive(false)
  }

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setUpdateNickName(newValue)

    if (newValue.length > 7) {
      setErrorMsg('닉네임은 7글자 이하로 설정해주세요!')
      setActive(false)
    } else {
      setErrorMsg('')
      setActive(newValue.trim() !== '')
    }
  }
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData: ProfileType = await fetchWithAuth(
          '/api/user/profile',
          {
            auth: true,
            method: 'GET',
          },
        )

        setNickName(profileData.nickName)
        setEmail(profileData.email)
      } catch (error) {
        if (error instanceof Error)
          console.error('프로필 데이터 로딩 실패:', error.message)
        else console.error('왜 나는지 모르는 에러:', error)
      }
    }
    fetchProfile()
  }, [nickName])

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="font-bold text-3xl mb-2">회원 정보</h1>
      <div className="flex w-5/6 justify-between items-center">
        <label className="font-bold w-1/4 text-sm text-center pr-2 pt-1">
          E-mail
        </label>
        {email ? (
          <p className="w-2/3">{email}</p>
        ) : (
          <div className="w-2/3 h-7 bg-gray-200 rounded animate-pulse"></div>
        )}
      </div>
      <div className="flex w-5/6 justify-between items-start">
        <label className="font-bold w-1/4 text-sm text-center pr-2 pt-3">
          닉네임
        </label>
        <div className="flex flex-col justify-start w-2/3 gap-1.5">
          {isEditing ? (
            <>
              <input
                type="text"
                name="nickName"
                value={updateNickName}
                onChange={handleInput}
                placeholder={nickName}
                className="w-full h-11 p-2 border border-zinc-200 rounded focus:ring-1 focus:ring-inset focus:ring-gray-400 focus:outline-none"
              />
              <div className="text-sm h-6 text-red-600">
                {errorMsg}
              </div>
            </>
          ) : (
            <>
              {nickName ? (
                <p className="h-11 flex items-center">{nickName}</p>
              ) : (
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
              )}
              <div className="text-sm h-6"></div>
            </>
          )}
        </div>
      </div>
      <section className="flex w-1/2 justify-between mt-2">
        {isEditing ? (
          <>
            <button
              className="px-4 py-2 border rounded border-gray-200 hover:bg-gray-100 cursor-pointer"
              onClick={handleCancel}
            >
              취소
            </button>
            <button
              disabled={!active}
              onClick={handleConfirm}
              className={`px-4 py-2 border rounded border-gray-200 ${
                active
                  ? 'bg-slate-950 text-white hover:bg-gray-800 cursor-pointer'
                  : 'cursor-not-allowed'
              }`}
            >
              확인
            </button>
          </>
        ) : (
          <>
            <button
              className="px-4 py-2 border rounded border-gray-200 hover:bg-gray-100 cursor-pointer"
              onClick={() => router.back()}
            >
              취소
            </button>
            <button
              className="px-4 py-2 border rounded border-gray-200 bg-slate-950 text-white hover:bg-gray-800 cursor-pointer"
              onClick={handleEdit}
            >
              수정
            </button>
          </>
        )}
      </section>
    </div>
  )
}
