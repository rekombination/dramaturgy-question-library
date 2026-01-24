export default function QuestionDetailLoading() {
  return (
    <div className="min-h-screen">
      <div className="container py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          {/* Question Header Skeleton */}
          <div className="border-2 border-foreground p-8 md:p-12 bg-background mb-8">
            {/* Title Skeleton */}
            <div className="h-10 bg-muted animate-pulse mb-6 w-3/4" />

            {/* Meta Info Skeleton */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                {/* Avatar Skeleton */}
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />

                {/* Author Name Skeleton */}
                <div className="h-4 bg-muted animate-pulse w-24" />
              </div>

              {/* Date Skeleton */}
              <div className="h-4 bg-muted animate-pulse w-32" />

              {/* Context Type Badge Skeleton */}
              <div className="h-6 bg-muted animate-pulse w-20" />
            </div>

            {/* Body Skeleton */}
            <div className="space-y-3 mb-6">
              <div className="h-4 bg-muted animate-pulse w-full" />
              <div className="h-4 bg-muted animate-pulse w-full" />
              <div className="h-4 bg-muted animate-pulse w-5/6" />
            </div>

            {/* Additional Fields Skeleton */}
            <div className="space-y-4 mt-6">
              <div className="h-4 bg-muted animate-pulse w-1/2" />
              <div className="h-4 bg-muted animate-pulse w-2/3" />
            </div>

            {/* Stats Skeleton */}
            <div className="flex gap-6 mt-8 pt-6">
              <div className="flex items-center gap-2">
                <div className="h-4 bg-muted animate-pulse w-16" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-4 bg-muted animate-pulse w-16" />
              </div>
            </div>
          </div>

          {/* Replies Skeleton */}
          <div className="border-2 border-foreground p-8 md:p-12 bg-background">
            <div className="h-8 bg-muted animate-pulse w-32 mb-6" />

            {/* Reply Cards Skeleton */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="pt-6 mt-6 first:pt-0 first:mt-0">
                <div className="flex items-start gap-3 mb-4">
                  {/* Reply Author Avatar Skeleton */}
                  <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />

                  <div className="flex-1">
                    {/* Reply Author Name Skeleton */}
                    <div className="h-4 bg-muted animate-pulse w-24 mb-2" />

                    {/* Reply Body Skeleton */}
                    <div className="space-y-2">
                      <div className="h-4 bg-muted animate-pulse w-full" />
                      <div className="h-4 bg-muted animate-pulse w-full" />
                      <div className="h-4 bg-muted animate-pulse w-4/5" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
