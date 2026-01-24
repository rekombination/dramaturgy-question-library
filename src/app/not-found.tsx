import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center py-8 md:py-0">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left - 404 */}
            <div className="bg-foreground text-background p-12 md:p-16 flex flex-col justify-center">
              <div className="text-[8rem] md:text-[10rem] font-black leading-none text-primary">
                404
              </div>
              <div className="mt-4 text-xl md:text-2xl font-bold">
                Page Not Found
              </div>
            </div>

            {/* Right - Message */}
            <div className="border-2 border-foreground md:border-l-0 p-8 md:p-12 flex flex-col justify-center">
              <p className="text-lg text-muted-foreground">
                The page you&apos;re looking for doesn&apos;t exist, has been moved, or you don&apos;t have permission to view it.
              </p>
              <p className="mt-4 text-muted-foreground">
                Perhaps you were looking for one of these?
              </p>
              <div className="mt-8 space-y-3">
                <Link
                  href="/"
                  className="block px-6 py-4 bg-primary text-primary-foreground font-bold text-center hover:bg-foreground hover:text-background transition-colors"
                >
                  Go to Homepage
                </Link>
                <Link
                  href="/explore"
                  className="block px-6 py-4 border-2 border-foreground font-bold text-center hover:bg-foreground hover:text-background transition-colors"
                >
                  Explore Questions
                </Link>
                <Link
                  href="/blog"
                  className="block px-6 py-4 border-2 border-foreground font-bold text-center hover:bg-foreground hover:text-background transition-colors"
                >
                  Read Blog
                </Link>
              </div>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Think this is an error?{" "}
              <Link href="/guidelines" className="text-primary font-bold hover:underline">
                Let us know
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
