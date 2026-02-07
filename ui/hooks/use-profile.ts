"use client"

import { useEffect, useState } from "react"

import { api } from "@/lib/api"
import type { FullUser, User } from "@/types"

export function useProfile(username?: string) {
  const [profile, setProfile] = useState<FullUser | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(username))
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!username) return
    let isMounted = true

    setIsLoading(true)
    api
      .getProfile(username)
      .then((data) => {
        if (!isMounted) return
        setProfile(data)
        setError(null)
      })
      .catch((err: Error) => {
        if (!isMounted) return
        setError(err)
      })
      .finally(() => {
        if (!isMounted) return
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [username])

  return { profile, isLoading, error }
}

export function useCurrentUser() {
  const [user, setUser] = useState<FullUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    api
      .getCurrentUser()
      .then((data) => {
        if (!isMounted) return
        setUser(data)
        setError(null)
      })
      .catch((err: Error) => {
        if (!isMounted) return
        setError(err)
      })
      .finally(() => {
        if (!isMounted) return
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return { user, isLoading, error, setUser }
}
