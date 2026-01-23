# Social Features - Next Steps

## Phase 1 - Core Social (Must-Have)

### 1. Comments on Replies
- [ ] Add Comment model to Prisma schema
- [ ] Create comment API routes (POST, GET, DELETE)
- [ ] Build comment UI component under replies
- [ ] Add comment count to replies
- [ ] Implement nested comment display

### 2. Accept Answer (Best Answer)
- [ ] Add `acceptedReplyId` field to Question model
- [ ] Create API route to accept/unaccept answer
- [ ] Add "Accept Answer" button (only for question author)
- [ ] Visual indicator for accepted answer (checkmark, highlight)
- [ ] Sort accepted answer to top

### 3. User Profiles with Activity
- [ ] Create user profile page (`/users/[id]`)
- [ ] Display user stats (questions asked, replies given, votes received)
- [ ] Show recent activity (questions, replies)
- [ ] Add expertise areas section
- [ ] Link usernames throughout app to profiles

### 4. Notifications (Basic)
- [ ] Add Notification model to Prisma schema
- [ ] Create notification API routes
- [ ] Build notification dropdown in header
- [ ] Trigger notifications for:
  - New reply on your question
  - Your reply was upvoted
  - Your answer was accepted
- [ ] Mark as read functionality

---

## Phase 2 - Community Growth

### 5. Follow System
- [ ] Add Follow model to Prisma schema
- [ ] Create follow/unfollow API routes
- [ ] Add "Follow" button on user profiles
- [ ] Show follower/following counts
- [ ] Activity feed for followed users

### 6. Reputation Points & Badges
- [ ] Implement reputation calculation system
- [ ] Create Badge model and seed initial badges
- [ ] Award badges automatically based on milestones
- [ ] Display reputation score on profiles
- [ ] Show badges on user cards

### 7. Trending/Popular Section
- [ ] Add "Trending" tab to explore page
- [ ] Calculate trending score (votes + recency)
- [ ] "Hot Questions" widget on homepage
- [ ] Weekly/Monthly top questions page

### 8. Email Digests
- [ ] Weekly digest email template
- [ ] Cron job for sending digests
- [ ] User email preferences page
- [ ] Include: trending questions, activity from followed users

---

## Phase 3 - Advanced Features

### 9. Collections/Toolkits Enhancement
- [ ] Allow users to create private collections
- [ ] Share collections with community
- [ ] Fork/clone collections
- [ ] Collection comments and discussions

### 10. Recommendations Engine
- [ ] Collaborative filtering based on bookmarks
- [ ] "Similar questions" section
- [ ] "You might be interested in" on homepage
- [ ] Email notifications for relevant new questions

### 11. Advanced Search
- [ ] Full-text search with filters
- [ ] Search by author, tags, context type
- [ ] Date range filters
- [ ] Sort by relevance, votes, date
- [ ] Save search queries

### 12. Community Moderation Tools
- [ ] Moderation queue for flagged content
- [ ] Community voting on flags
- [ ] Edit suggestions from community
- [ ] Moderator actions log
- [ ] Automated spam detection

---

## Technical Considerations

### Database Changes Needed
- Comment model (replies to replies)
- Notification model
- Follow model
- Badge model
- Reputation tracking system

### API Routes to Create
- `/api/comments` - CRUD for comments
- `/api/questions/[id]/accept` - Accept answer
- `/api/users/[id]/follow` - Follow/unfollow
- `/api/notifications` - Get, mark as read
- `/api/users/[id]/profile` - User profile data

### UI Components to Build
- CommentThread component
- AcceptedAnswerBadge component
- NotificationDropdown component
- UserProfileCard component
- ReputationBadge component
- FollowButton component

### Performance Optimizations
- Cache trending questions calculation
- Pagination for activity feeds
- Lazy loading for comments
- Optimistic UI updates for votes/follows

---

## Priority Order

**Start with:**
1. Comments on Replies (enables discussions)
2. Accept Answer (helps identify best solutions)
3. User Profiles (foundation for social features)
4. Basic Notifications (keeps users engaged)

**Then move to:**
- Follow System (builds community)
- Reputation & Badges (gamification)
- Trending Section (content discovery)

**Long-term:**
- Advanced search, recommendations, moderation tools
