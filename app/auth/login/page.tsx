"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Zap, Wifi, WifiOff, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [employeeId, setEmployeeId] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState<"connected" | "disconnected">("connected")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login process
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 2000)
  }

  const handleCredentialClick = (employeeId: string, password: string, role: string) => {
    setEmployeeId(employeeId)
    setPassword(password)
    setRole(role)
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

        {/* Login Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Sign In</CardTitle>
            <CardDescription className="text-slate-400">Enter your credentials to access the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId" className="text-slate-300">
                  Employee ID
                </Label>
                <Input
                  id="employeeId"
                  type="text"
                  placeholder="Enter your employee ID"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-slate-300">
                  Role
                </Label>
                <Select value={role} onValueChange={setRole} required>
                  <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700">
                    <SelectItem value="operator" className="text-white">
                      Operator
                    </SelectItem>
                    <SelectItem value="metallurgist" className="text-white">
                      Metallurgist
                    </SelectItem>
                    <SelectItem value="admin" className="text-white">
                      Administrator
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {apiStatus === "disconnected" && (
                <Alert className="bg-red-500/10 border-red-500/20">
                  <AlertDescription className="text-red-400">
                    System connectivity issues detected. Some features may be limited.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                disabled={isLoading || !employeeId || !password || !role}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-lg bg-slate-700/30 border border-slate-600">
              <h4 className="text-white font-medium mb-3 text-sm">Sample Login Credentials</h4>
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-slate-400 font-medium">Role</div>
                  <div className="text-slate-400 font-medium">Employee ID</div>
                  <div className="text-slate-400 font-medium">Password</div>
                </div>
                <div
                  className="grid grid-cols-3 gap-2 p-2 rounded bg-slate-800/50 hover:bg-slate-800/70 cursor-pointer transition-colors"
                  onClick={() => handleCredentialClick("OP001", "operator123", "operator")}
                >
                  <div className="text-blue-400">Operator</div>
                  <div className="text-white font-mono">OP001</div>
                  <div className="text-white font-mono">operator123</div>
                </div>
                <div
                  className="grid grid-cols-3 gap-2 p-2 rounded bg-slate-800/50 hover:bg-slate-800/70 cursor-pointer transition-colors"
                  onClick={() => handleCredentialClick("MT001", "metal456", "metallurgist")}
                >
                  <div className="text-purple-400">Metallurgist</div>
                  <div className="text-white font-mono">MT001</div>
                  <div className="text-white font-mono">metal456</div>
                </div>
                <div
                  className="grid grid-cols-3 gap-2 p-2 rounded bg-slate-800/50 hover:bg-slate-800/70 cursor-pointer transition-colors"
                  onClick={() => handleCredentialClick("AD001", "admin789", "admin")}
                >
                  <div className="text-green-400">Administrator</div>
                  <div className="text-white font-mono">AD001</div>
                  <div className="text-white font-mono">admin789</div>
                </div>
              </div>
              <p className="text-slate-500 text-xs mt-3">💡 Click on any credential row to auto-fill the form</p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/auth/password-reset" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                Forgot your password?
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>© 2024 AlloyMind AI. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
