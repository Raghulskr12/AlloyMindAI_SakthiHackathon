"use client"

import type React from "react"
import { SignIn } from "@clerk/nextjs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Wifi, WifiOff } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function SignInPage() {
  const [apiStatus] = useState<"connected" | "disconnected">("connected")

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">AlloyMind AI</h1>
          </div>
          <p className="text-slate-400">Secure access to your metallurgy control system</p>
        </div>

        {/* System Status */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">System Status</span>
              <div className="flex items-center space-x-2">
                {apiStatus === "connected" ? (
                  <>
                    <Wifi className="w-4 h-4 text-green-400" />
                    <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                      Connected
                    </Badge>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-4 h-4 text-red-400" />
                    <Badge variant="secondary" className="bg-red-500/10 text-red-400 border-red-500/20">
                      Disconnected
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clerk Sign In Component with Custom Styling */}
        <div className="flex justify-center">
          <SignIn 
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "bg-slate-800/50 border-slate-700 backdrop-blur-sm shadow-2xl",
                headerTitle: "text-white text-xl font-semibold",
                headerSubtitle: "text-slate-400",
                socialButtonsBlockButton: "bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600/50",
                socialButtonsBlockButtonText: "text-white",
                dividerLine: "bg-slate-600",
                dividerText: "text-slate-400",
                formFieldLabel: "text-slate-300",
                formFieldInput: "bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400",
                footerActionLink: "text-blue-400 hover:text-blue-300",
                formButtonPrimary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white",
                formFieldInputShowPasswordButton: "text-slate-400 hover:text-white",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-blue-400 hover:text-blue-300",
                formResendCodeLink: "text-blue-400 hover:text-blue-300",
                otpCodeFieldInput: "bg-slate-700/50 border-slate-600 text-white",
                formFieldWarningText: "text-red-400",
                formFieldErrorText: "text-red-400",
                formFieldSuccessText: "text-green-400",
                alertText: "text-slate-300",
                formFieldHintText: "text-slate-400",
                footerActionText: "text-slate-400",
              },
              layout: {
                socialButtonsPlacement: "top",
                socialButtonsVariant: "blockButton",
                logoPlacement: "none"
              }
            }}
            redirectUrl="/dashboard"
            signUpUrl="/auth/sign-up"
          />
        </div>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-slate-400 text-sm">
            Don't have an account?{" "}
            <Link href="/auth/sign-up" className="text-blue-400 hover:text-blue-300 transition-colors">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>© 2024 AlloyMind AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
