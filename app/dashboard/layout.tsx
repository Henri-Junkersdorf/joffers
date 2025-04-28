import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
        <div className="container flex h-16 items-center justify-between px-8">
          <div className="flex items-center">
            <div className="mr-8 pl-4">
              <Link href="/" className="font-bold text-2xl text-primary">
                Joffers
              </Link>
            </div>
            <nav className="flex gap-8">
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 hover:underline underline-offset-4 transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/jobs"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 hover:underline underline-offset-4 transition-colors"
              >
                My Jobs
              </Link>
              <Link
                href="/dashboard/applications"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 hover:underline underline-offset-4 transition-colors"
              >
                Applications
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                A
              </div>
              <span className="text-sm font-medium hidden sm:inline">Welcome, Company</span>
            </div>
            <Button variant="outline" size="sm" asChild className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              <Link href="/login">Sign Out</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-6 bg-gray-50">{children}</main>
      
      <footer className="border-t py-6 bg-white">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-8">
          <div className="flex items-center gap-2 pl-4">
            <span className="font-bold text-indigo-700">Joffers</span>
            <span className="text-sm text-gray-500">|</span>
            <span className="text-sm text-gray-500">Company Dashboard</span>
          </div>
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            &copy; {new Date().getFullYear()} Joffers. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 