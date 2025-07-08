"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, ArrowLeft, Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

type ResetStep = "email" | "otp" | "password" | "success"

export default function PasswordResetPage() {
  const [currentStep, setCurrentStep] = useState<ResetStep>("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setCurrentStep("otp")
    }, 1500)
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false)
      setCurrentStep("password")
    }, 1500)
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      return
    }

    setIsLoading(true)

    // Simulate password reset
    setTimeout(() => {
      setIsLoading(false)
      setCurrentStep("success")
    }, 1500)
  }

  const renderStep = () => {
    switch (currentStep) {
      case "email":
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={isLoading || !email}
            >
              {isLoading ? "Sending..." : "Send Reset Code"}
            </Button>
          </form>
        )

      case "otp":
        return (
          <div className="space-y-4">
            <Alert className="bg-blue-500/10 border-blue-500/20">
              <Mail className="w-4 h-4 text-blue-400" />
              <AlertDescription className="text-blue-400">We've sent a verification code to {email}</AlertDescription>
            </Alert>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-slate-300">
                  Verification Code
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>
            </form>
          </div>
        )

      case "password":
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-slate-300">
                New Password
              </Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-slate-300">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                required
              />
            </div>
            {newPassword && confirmPassword && newPassword !== confirmPassword && (
              <Alert className="bg-red-500/10 border-red-500/20">
                <AlertDescription className="text-red-400">Passwords do not match</AlertDescription>
              </Alert>
            )}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )

      case "success":
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white">Password Reset Successful</h3>
              <p className="text-slate-400">
                Your password has been successfully reset. You will be redirected to login.
              </p>
            </div>
            <Alert className="bg-yellow-500/10 border-yellow-500/20">
              <AlertDescription className="text-yellow-400">
                For security reasons, you will need to log in again with your new password.
              </AlertDescription>
            </Alert>
            <Link href="/auth/login">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                Continue to Login
              </Button>
            </Link>
          </div>
        )
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case "email":
        return "Reset Password"
      case "otp":
        return "Verify Email"
      case "password":
        return "Set New Password"
      case "success":
        return "Reset Complete"
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case "email":
        return "Enter your email to receive a reset code"
      case "otp":
        return "Enter the verification code sent to your email"
      case "password":
        return "Create a new secure password"
      case "success":
        return "Your password has been successfully reset"
    }
  }

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
        </div>

        {/* Reset Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center space-x-2">
              {currentStep !== "success" && (
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white p-1">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
              )}
              <div>
                <CardTitle className="text-white">{getStepTitle()}</CardTitle>
                <CardDescription className="text-slate-400">{getStepDescription()}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>{renderStep()}</CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>© 2024 AlloyMind AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
