# Follow / Unfollow — UI Implementation Plan

## Overview

Add follow/unfollow functionality to the UI using the existing API endpoints. The follow button will appear on user profile pages, and follower/following counts will be displayed in the profile header.

---

## 1. Types

Add follow-related types to `types/index.ts`:

```typescript
// ============================================
// Follow types
// ============================================

export interface Follow {
  id: string;
  followerId: string;
  followingId: string;
  createdAt: string;
  follower?: User;
  following?: User;
}

export interface FollowResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface FollowStatusResponse {
  isFollowing: boolean;
}
```

Also add follower/following counts to the `User` interface. These are JSON-only fields returned by the API (not stored in the DB):

```typescript
export interface User {
  // ... existing fields ...
  followerCount: number;
  followingCount: number;
}
```

> **Note:** Only add the count fields after the backend is updated to return them (Section 6 of the backend plan). Until then, the counts can be fetched from the followers/following list endpoints using the `total` field from `FollowResponse`.

---

## 2. API Layer

Add follow methods to `lib/api.ts`. These follow the exact same pattern as existing API calls:

```typescript
// Follow endpoints (public)
async getFollowers(username: string, page = 1, limit = 20): Promise<FollowResponse> {
  const res = await fetch(
    `${API_URL}/api/v1/users/${username}/followers?page=${page}&limit=${limit}`
  );
  if (!res.ok) throw new ApiError(res.status, "Failed to fetch followers");
  return res.json();
},

async getFollowing(username: string, page = 1, limit = 20): Promise<FollowResponse> {
  const res = await fetch(
    `${API_URL}/api/v1/users/${username}/following?page=${page}&limit=${limit}`
  );
  if (!res.ok) throw new ApiError(res.status, "Failed to fetch following");
  return res.json();
},

// Follow endpoints (protected)
async followUser(username: string): Promise<Follow> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/v1/users/${username}/follow`, {
    method: "POST",
    headers,
  });
  if (!res.ok) throw new ApiError(res.status, "Failed to follow user");
  return res.json();
},

async unfollowUser(username: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/v1/users/${username}/follow`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new ApiError(res.status, "Failed to unfollow user");
},

async checkFollowStatus(username: string): Promise<FollowStatusResponse> {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${API_URL}/api/v1/users/me/following/${username}`,
    { headers }
  );
  if (!res.ok) throw new ApiError(res.status, "Failed to check follow status");
  return res.json();
},
```

---

## 3. Custom Hook — `useFollow`

Create `hooks/use-follow.ts`. This hook manages follow state for a given user profile. It handles:

- Checking initial follow status on mount
- Toggling follow/unfollow
- Tracking follower count locally for instant UI updates
- Loading state for the button

```typescript
"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export function useFollow(username: string) {
  const { user: authUser, isLoading: authLoading } = useAuth()
  const [isFollowing, setIsFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)

  // Fetch initial follow status and counts
  useEffect(() => {
    let isMounted = true

    async function fetchData() {
      try {
        // Fetch follower/following counts (public, always fetch)
        const [followers, following] = await Promise.all([
          api.getFollowers(username, 1, 1),
          api.getFollowing(username, 1, 1),
        ])

        if (!isMounted) return
        setFollowerCount(followers.total)
        setFollowingCount(following.total)

        // Only check follow status if the user is logged in
        if (authUser) {
          const status = await api.checkFollowStatus(username)
          if (isMounted) setIsFollowing(status.isFollowing)
        }
      } catch (err) {
        console.error("Failed to fetch follow data:", err)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    if (!authLoading) {
      fetchData()
    }

    return () => { isMounted = false }
  }, [username, authUser, authLoading])

  // Toggle follow/unfollow
  async function toggleFollow() {
    if (isToggling) return

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

  // Don't show follow button if viewing your own profile
  const isOwnProfile = authUser?.id === undefined ? false
    : authUser.id === undefined // still loading

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
```

---

## 4. Follow Button Component

Create `components/profile/follow-button.tsx`. A small, self-contained button that uses the `useFollow` hook.

```typescript
"use client"

import { UserPlus, UserCheck, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFollow } from "@/hooks/use-follow"

interface FollowButtonProps {
  username: string
  profileUserId: string
}

export function FollowButton({ username, profileUserId }: FollowButtonProps) {
  const { isFollowing, isLoading, isToggling, isAuthenticated, toggleFollow } =
    useFollow(username)

  // Don't render anything while loading or if not logged in
  if (isLoading) return null
  if (!isAuthenticated) return null

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={toggleFollow}
      disabled={isToggling}
    >
      {isToggling ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <UserCheck className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {isFollowing ? "Following" : "Follow"}
    </Button>
  )
}
```

**Behavior:**
- Hidden when not authenticated (guests don't see the button)
- Hidden on your own profile
- Shows "Follow" (filled button) when not following
- Shows "Following" (outline button) when already following
- Shows a spinner while the request is in flight
- Disabled during toggle to prevent double-clicks

---

## 5. Integrate into Profile Header

Update `components/profile/profile-header.tsx` to show the follow button and follower/following counts.

The `ProfileHeader` currently receives `{ user: User }`. We need to also pass the follow data or let it use the hook directly. Since the hook needs the username, the simplest approach is to use the hook inside `ProfileHeader`:

```typescript
// profile-header.tsx changes:

import { FollowButton } from "@/components/profile/follow-button"
import { useFollow } from "@/hooks/use-follow"

export function ProfileHeader({ user }: { user: User }) {
  const { followerCount, followingCount, isLoading: followLoading } = useFollow(user.username)
  // ... existing code ...

  return (
    <Card>
      <CardContent>
        <div className="flex w-full items-start gap-4">
          <Avatar className="h-24 w-24">
            {/* ... existing avatar ... */}
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">{fullName}</h1>
              <FollowButton username={user.username} profileUserId={user.id} />
            </div>
            <p className="text-muted-foreground text-sm">@{user.username}</p>
            {user.headline && (
              <p className="text-sm text-muted-foreground">{user.headline}</p>
            )}
            {/* Follower/following counts */}
            {!followLoading && (
              <div className="flex gap-4 text-sm pt-1">
                <span>
                  <span className="font-semibold">{followerCount}</span>{" "}
                  <span className="text-muted-foreground">followers</span>
                </span>
                <span>
                  <span className="font-semibold">{followingCount}</span>{" "}
                  <span className="text-muted-foreground">following</span>
                </span>
              </div>
            )}
          </div>
        </div>
        {/* ... existing social link buttons ... */}
      </CardContent>
    </Card>
  )
}
```

> **Issue:** This means `useFollow` is called both in `ProfileHeader` (for counts) and inside `FollowButton` (for toggling). This causes duplicate API calls. To solve this, there are two options:
>
> **Option A (simple):** Call `useFollow` once in `ProfileHeader` and pass props down to `FollowButton` instead of having it call the hook internally. This is the recommended approach.
>
> **Option B (scalable):** Create a `FollowProvider` context that wraps the profile page so all children share the same follow state. This is better if many components need follow data but is overkill for now.
>
> **Recommended: Option A.**

### Option A — Prop-Driven FollowButton

Adjust `FollowButton` to accept props instead of calling the hook:

```typescript
interface FollowButtonProps {
  isFollowing: boolean
  isToggling: boolean
  onToggle: () => void
}

export function FollowButton({ isFollowing, isToggling, onToggle }: FollowButtonProps) {
  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={onToggle}
      disabled={isToggling}
    >
      {isToggling ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <UserCheck className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {isFollowing ? "Following" : "Follow"}
    </Button>
  )
}
```

Then in `ProfileHeader`:

```typescript
const {
  isFollowing, isToggling, toggleFollow,
  followerCount, followingCount,
  isAuthenticated, isLoading
} = useFollow(user.username)

// In JSX:
{isAuthenticated && !isLoading && (
  <FollowButton
    isFollowing={isFollowing}
    isToggling={isToggling}
    onToggle={toggleFollow}
  />
)}
```

---

## 6. (Optional) Followers/Following Dialog

Add a dialog that shows the list of followers or following when the user clicks on the count. Uses the shadcn `Dialog` component.

Create `components/profile/follow-list-dialog.tsx`:

```typescript
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import type { User } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface FollowListDialogProps {
  username: string
  type: "followers" | "following"
  count: number
  trigger: React.ReactNode
}

export function FollowListDialog({ username, type, count, trigger }: FollowListDialogProps) {
  const [users, setUsers] = useState<User[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    let isMounted = true
    setIsLoading(true)

    const fetcher = type === "followers" ? api.getFollowers : api.getFollowing
    fetcher(username, 1, 50).then((data) => {
      if (isMounted) {
        setUsers(data.users)
        setIsLoading(false)
      }
    })

    return () => { isMounted = false }
  }, [isOpen, username, type])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === "followers" ? "Followers" : "Following"} ({count})
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-80 space-y-3 overflow-y-auto">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {type === "followers" ? "No followers yet." : "Not following anyone yet."}
            </p>
          ) : (
            users.map((u) => (
              <Link
                key={u.id}
                href={`/u/${u.username}`}
                className="flex items-center gap-3 rounded-md p-2 hover:bg-muted"
                onClick={() => setIsOpen(false)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={u.image ?? undefined} />
                  <AvatarFallback>{u.username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">
                    {u.firstName && u.lastName
                      ? `${u.firstName} ${u.lastName}`
                      : u.username}
                  </p>
                  <p className="text-xs text-muted-foreground">@{u.username}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

Then in `ProfileHeader`, make the counts clickable:

```typescript
<FollowListDialog username={user.username} type="followers" count={followerCount} trigger={
  <button className="hover:underline">
    <span className="font-semibold">{followerCount}</span>{" "}
    <span className="text-muted-foreground">followers</span>
  </button>
} />

<FollowListDialog username={user.username} type="following" count={followingCount} trigger={
  <button className="hover:underline">
    <span className="font-semibold">{followingCount}</span>{" "}
    <span className="text-muted-foreground">following</span>
  </button>
} />
```

---

## 7. Files Changed / Created

| File | Action | Description |
|------|--------|-------------|
| `types/index.ts` | Edit | Add `Follow`, `FollowResponse`, `FollowStatusResponse` types |
| `lib/api.ts` | Edit | Add `followUser`, `unfollowUser`, `getFollowers`, `getFollowing`, `checkFollowStatus` |
| `hooks/use-follow.ts` | Create | Hook for follow state, counts, and toggle |
| `components/profile/follow-button.tsx` | Create | Follow/Unfollow button component |
| `components/profile/profile-header.tsx` | Edit | Add follow button and follower/following counts |
| `components/profile/follow-list-dialog.tsx` | Create (optional) | Dialog showing follower/following lists |

---

## 8. Implementation Checklist

- [ ] Add follow types to `types/index.ts`
- [ ] Add follow API methods to `lib/api.ts`
- [ ] Create `hooks/use-follow.ts`
- [ ] Create `components/profile/follow-button.tsx`
- [ ] Update `components/profile/profile-header.tsx` with follow button and counts
- [ ] (Optional) Create `components/profile/follow-list-dialog.tsx`
- [ ] Test follow/unfollow on a profile page
- [ ] Verify button is hidden on own profile
- [ ] Verify button is hidden when not logged in
- [ ] Verify counts update instantly on toggle
