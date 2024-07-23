'use client'

import React from 'react'
import { NavigationProgress, nprogress } from '@mantine/nprogress'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export const RouterTransition = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setTimeout(() => nprogress.complete(), 200)

    return () => {
      nprogress.start()
    }
  }, [pathname, searchParams])

  return <NavigationProgress size={2} />
}
