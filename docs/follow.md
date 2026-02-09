# Follow / Unfollow Feature

## Overview

Allow authenticated users to follow and unfollow other users. A follow is a one-directional relationship — if User A follows User B, User B does not automatically follow User A.

---

## 1. Database Model

Add a `Follow` struct in `db/models.go`. Each row represents one directional follow relationship.

```go
type Follow struct {
    Id          string    `gorm:"type:uuid;primaryKey;default:gen_random_uuid()" json:"id"`
    FollowerId  string    `gorm:"type:uuid;not null" json:"followerId"`
    FollowingId string    `gorm:"type:uuid;not null" json:"followingId"`
    CreatedAt   time.Time `json:"createdAt"`

    Follower  User `gorm:"foreignKey:FollowerId" json:"follower,omitempty"`
    Following User `gorm:"foreignKey:FollowingId" json:"following,omitempty"`
}
```

**Constraints:**
- Add a unique composite index on `(follower_id, following_id)` to prevent duplicate follows.
- A user cannot follow themselves — enforce this in the handler, not the database.

Add the GORM tag for the composite unique index:

```go
type Follow struct {
    // ... fields above ...
} // then register the index via a GORM hook or table method:

func (Follow) TableName() string { return "follows" }
```

And create a GORM composite unique index with `UniqueIndex` tags:

```go
FollowerId  string `gorm:"type:uuid;not null;uniqueIndex:idx_follower_following" json:"followerId"`
FollowingId string `gorm:"type:uuid;not null;uniqueIndex:idx_follower_following" json:"followingId"`
```

---

## 2. Register the Model for Auto-Migration

In `db/connection.go`, add `&Follow{}` to the `AutoMigrate` call:

```go
func AutoMigrate() error {
    err := DB.AutoMigrate(
        &User{},
        &Project{},
        &Education{},
        &Experience{},
        &Follow{},  // <-- add this
    )
    // ...
}
```

---

## 3. API Endpoints

Create a new handler file at `api/v1/follow.go`. All follow endpoints are **protected** (require authentication).

| Method   | Path                              | Description                                      |
|----------|-----------------------------------|--------------------------------------------------|
| `POST`   | `/users/:username/follow`         | Follow a user by username                        |
| `DELETE` | `/users/:username/follow`         | Unfollow a user by username                      |
| `GET`    | `/users/:username/followers`      | Get a user's followers (public)                  |
| `GET`    | `/users/:username/following`      | Get who a user is following (public)             |
| `GET`    | `/users/me/following/:username`   | Check if the current user follows a given user   |

---

## 4. Handler Implementations

### 4a. Follow a User — `POST /users/:username/follow`

```go
func FollowUser(c *gin.Context) {
    // 1. Get authenticated user ID from context
    // 2. Look up target user by :username param
    // 3. Verify the user is not trying to follow themselves
    // 4. Check if a Follow record already exists (follower_id, following_id)
    //    - If yes, return 409 Conflict
    // 5. Create the Follow record
    // 6. Return 201 Created with the follow record
}
```

**Responses:**
- `201` — Successfully followed
- `400` — Cannot follow yourself
- `404` — Target user not found
- `409` — Already following this user
- `500` — Server error

### 4b. Unfollow a User — `DELETE /users/:username/follow`

```go
func UnfollowUser(c *gin.Context) {
    // 1. Get authenticated user ID from context
    // 2. Look up target user by :username param
    // 3. Delete the Follow record where follower_id = currentUser and following_id = targetUser
    //    - If no rows affected, return 404 (not following this user)
    // 4. Return 200 with success message
}
```

**Responses:**
- `200` — Successfully unfollowed
- `404` — Not following this user / user not found
- `500` — Server error

### 4c. Get Followers — `GET /users/:username/followers`

```go
func GetFollowers(c *gin.Context) {
    // 1. Look up target user by :username param
    // 2. Query Follow records where following_id = targetUser.Id
    // 3. Preload the Follower relation to return user data
    // 4. Support pagination with ?page= and ?limit= query params
    // 5. Return the list of follower users
}
```

**Response shape:**

```json
{
    "users": [ { "id": "...", "username": "...", ... } ],
    "total": 42,
    "page": 1,
    "limit": 20
}
```

### 4d. Get Following — `GET /users/:username/following`

```go
func GetFollowing(c *gin.Context) {
    // 1. Look up target user by :username param
    // 2. Query Follow records where follower_id = targetUser.Id
    // 3. Preload the Following relation to return user data
    // 4. Support pagination with ?page= and ?limit= query params
    // 5. Return the list of followed users
}
```

### 4e. Check Follow Status — `GET /users/me/following/:username`

```go
func CheckFollowStatus(c *gin.Context) {
    // 1. Get authenticated user ID from context
    // 2. Look up target user by :username param
    // 3. Query for a Follow record where follower_id = currentUser and following_id = targetUser
    // 4. Return { "isFollowing": true/false }
}
```

---

## 5. Route Registration

In `api/router.go`, add the new routes:

```go
// Public - anyone can view followers/following lists
public.GET("/users/:username/followers", v1.GetFollowers)
public.GET("/users/:username/following", v1.GetFollowing)

// Protected - requires authentication
protected.POST("/users/:username/follow", v1.FollowUser)
protected.DELETE("/users/:username/follow", v1.UnfollowUser)
protected.GET("/users/me/following/:username", v1.CheckFollowStatus)
```

---

## 6. Optional: Add Counts to the User Model

To efficiently display follower/following counts on profiles, add two computed fields to the User response. These should **not** be stored columns — compute them on the fly or use a database view.

Option A — Add count fields as JSON-only (not stored in DB):

```go
type User struct {
    // ... existing fields ...
    FollowerCount  int `gorm:"-" json:"followerCount"`
    FollowingCount int `gorm:"-" json:"followingCount"`
}
```

Then populate them in `GetUserByUsername` and `GetCurrentUser` with subqueries:

```go
db.GetDB().Model(&Follow{}).Where("following_id = ?", user.Id).Count(&followerCount)
db.GetDB().Model(&Follow{}).Where("follower_id = ?", user.Id).Count(&followingCount)
```

Option B — Use SQL subqueries for a single-query approach:

```go
db.GetDB().
    Select("users.*, "+
        "(SELECT COUNT(*) FROM follows WHERE follows.following_id = users.id) AS follower_count, "+
        "(SELECT COUNT(*) FROM follows WHERE follows.follower_id = users.id) AS following_count").
    Where("username = ?", username).
    First(&user)
```

---

## 7. Implementation Checklist

- [ ] Add `Follow` struct to `db/models.go` with composite unique index
- [ ] Register `&Follow{}` in `db/connection.go` `AutoMigrate()`
- [ ] Create `api/v1/follow.go` with all five handlers
- [ ] Add Swagger doc comments to each handler
- [ ] Register routes in `api/router.go` (public + protected)
- [ ] Add follower/following counts to user profile responses
- [ ] Test all endpoints manually via Swagger UI
