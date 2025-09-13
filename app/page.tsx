import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-16 sm:px-6 text-center gap-20">
        <div className="max-w-4xl space-y-8 relative">
          {/*Background gradient*/}
          <div
            className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50
          via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-20
          dark:to-purple-950/20 rounded-3xl blur-3xl scale-150 opacity-60"
          ></div>
          <div>
            <h1
              className="text-5xl sm:text-7xl font-bold tracking- bg-clip-text text-transparent bg-gradient-to-r
              from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400"
            >
              Connect Instantly
              <br />
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to to-pink-600 dark:from-purple-400
                dark:to-pink-400"
              >
                Chat smarter.
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The modern messaging platform that combines lightning-fast chat
              and crystal-clear video calls, all in one seamless experience.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="lg" className="text-lg px-8 py-6 h-auto">
                  Start Chatting Free.
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
          {/*Social proof*/}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-4">
              Trusted by thousands of users worldwide
            </p>
            <div className="flex items-center justify-center gap-8 text-muted-foreground">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">50K+</div>
                <div className="text-sm">Active Users</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">1M+</div>
                <div className="text-sm">Messages Sent</div>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">99.9%</div>
                <div className="text-sm">Uptime</div>
              </div>
            </div>
          </div>
          {/*Enhanced Features Section*/}
          <div className="w-full max-w-6xl">
            {/*Section Divder*/}
            <div className="w-full flex items-center justify-center mb-16">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
              <div className="px-6">
                <div className="w-2 h-2 rounded-full bg-primary/60"></div>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Everything you need to stay connected
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Powerful features designed for seamless communication, whether
                you&apos;re chatting with friends or collaborating with teams.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              <FeatureCard
                icon={MessageCircle}
                title="Instant Messaging"
                description="Lightning-fast messages with real time delivery.
                Chat with friends and colleagues seamlessly."
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
