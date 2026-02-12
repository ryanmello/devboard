"use client"

import { useEffect, useState } from "react"

import { api } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export function useFollow(username: string, profileUserId: string) {
  const { user: authUser, isLoading: authLoading } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)

  const isOwnProfile = !!authUser && authUser.id === profileUserId

  useEffect(() => {
    if (authLoading) return

    let isMounted = true

    async function fetchData() {
      try {
        const [followers, following] = await Promise.all([
          api.getFollowers(username, 1, 1),
          api.getFollowing(username, 1, 1),
        ])

        if (!isMounted) return
        setFollowerCount(followers.total)
        setFollowingCount(following.total)

        if (authUser && !isOwnProfile) {
          const status = await api.checkFollowStatus(username)
          if (isMounted) setIsFollowing(status.isFollowing)
        }
      } catch (err) {
        console.error("Failed to fetch follow data:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [username, authUser, authLoading, isOwnProfile])

  async function toggleFollow() {
    if (isToggling || isOwnProfile) return

    setIsToggling(true)
    try {
      if (isFollowing) {
        await api.unfollowUser(username)
        setIsFollowing(false)
        setFollowerCount((prev) => prev - 1)
      } else {
        await api.followUser(username)
        setIsFollowing(true)
        setFollowerCount((prev) => prev + 1)
      }
    } catch (err) {
      console.error("Failed to toggle follow:", err)
    } finally {
      setIsToggling(false)
    }
  }

  return {
    isFollowing,
    isLoading,
    isToggling,
    followerCount,
    followingCount,
    toggleFollow,
    isAuthenticated: !!authUser,
    isOwnProfile,
  }
}
