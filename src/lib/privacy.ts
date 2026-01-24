import { ProfileVisibility, UserRole } from "@prisma/client";

/**
 * Check if a viewer can view a target user's profile
 */
export function canViewProfile(
  targetUserVisibility: ProfileVisibility,
  viewerId?: string | null,
  targetUserId?: string,
  viewerRole?: UserRole
): boolean {
  // Admins and Moderators can always view
  if (viewerRole === "ADMIN" || viewerRole === "MODERATOR") {
    return true;
  }

  // Own profile
  if (viewerId && targetUserId && viewerId === targetUserId) {
    return true;
  }

  // Public profiles
  if (targetUserVisibility === "PUBLIC") {
    return true;
  }

  // Members-only requires login
  if (targetUserVisibility === "MEMBERS_ONLY") {
    return !!viewerId;
  }

  // Private profiles only for owner (and admins/mods checked above)
  return false;
}

/**
 * Get profile link if profile is accessible, null otherwise
 */
export function getProfileLink(
  username: string | null,
  profileVisibility: ProfileVisibility,
  viewerId?: string | null,
  targetUserId?: string,
  viewerRole?: UserRole
): string | null {
  if (!username) {
    return null;
  }

  // For PRIVATE profiles, only show link if viewer can access
  if (
    profileVisibility === "PRIVATE" &&
    !canViewProfile(profileVisibility, viewerId, targetUserId, viewerRole)
  ) {
    return null;
  }

  return `/profile/${username}`;
}

/**
 * Check if viewer can see user's activity (questions/replies)
 */
export function canSeeActivity(
  showActivity: boolean,
  viewerId?: string | null,
  targetUserId?: string,
  viewerRole?: UserRole
): boolean {
  // Admins and Moderators can always see
  if (viewerRole === "ADMIN" || viewerRole === "MODERATOR") {
    return true;
  }

  // Own profile
  if (viewerId && targetUserId && viewerId === targetUserId) {
    return true;
  }

  return showActivity;
}

/**
 * Check if viewer can see user's stats
 */
export function canSeeStats(
  showStats: boolean,
  viewerId?: string | null,
  targetUserId?: string,
  viewerRole?: UserRole
): boolean {
  // Admins and Moderators can always see
  if (viewerRole === "ADMIN" || viewerRole === "MODERATOR") {
    return true;
  }

  // Own profile
  if (viewerId && targetUserId && viewerId === targetUserId) {
    return true;
  }

  return showStats;
}

/**
 * Check if viewer can see user's social links
 */
export function canSeeSocialLinks(
  showSocialLinks: boolean,
  viewerId?: string | null,
  targetUserId?: string,
  viewerRole?: UserRole
): boolean {
  // Admins and Moderators can always see
  if (viewerRole === "ADMIN" || viewerRole === "MODERATOR") {
    return true;
  }

  // Own profile
  if (viewerId && targetUserId && viewerId === targetUserId) {
    return true;
  }

  return showSocialLinks;
}
