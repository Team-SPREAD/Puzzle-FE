'use client'

import Link from 'next/link'
import useUserInfoStore from "@/hooks/useUserInfoStore"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  const { _id, token } = useUserInfoStore()

  useEffect(() => {
    // 로컬 스토리지에서 토큰을 확인
    const storedToken = localStorage.getItem('token')
    if (storedToken && _id) {
      router.push(`/dashboard/${_id}`)
    }
  }, [_id, router])

  return (
    <main>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold mb-4">프로젝트 개발을 위한 가이드라인 단계 플랫폼</h1>
        <p className="mb-4">환영합니다! 이 플랫폼은 프로젝트 개발을 위한 가이드라인을 제공합니다.</p>
        {!token && (
          <Link href="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            시작하기
          </Link>
        )}
      </div>
    </main>
  );
}