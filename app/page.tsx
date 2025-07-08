import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Zap, Target, TrendingUp, Shield, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">AlloyMind AI</h1>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-800 bg-transparent">
              Enter Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <Badge variant="secondary" className="mb-4 bg-blue-500/10 text-blue-400 border-blue-500/20">
          Next-Generation Metallurgy
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Intelligent Alloy
          <br />
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Optimization
          </span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          Transform your metallurgical operations with AI-powered real-time analysis, predictive recommendations, and
          automated quality control for optimal alloy composition.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="border-slate-600 text-slate-200 hover:bg-slate-800 px-8 py-3 bg-transparent"
          >
            Watch Demo
          </Button>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="text-center">
              <TrendingUp className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <CardTitle className="text-white">95%</CardTitle>
              <CardDescription className="text-slate-300">First-Pass Success Rate</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="text-center">
              <DollarSign className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <CardTitle className="text-white">40%</CardTitle>
              <CardDescription className="text-slate-300">Material Waste Reduction</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader className="text-center">
              <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <CardTitle className="text-white">3x</CardTitle>
              <CardDescription className="text-slate-300">Faster Decision Speed</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">Comprehensive Solution</h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            From real-time monitoring to predictive analytics, AlloyMind AI covers every aspect of modern metallurgy
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <Target className="w-10 h-10 text-blue-400 mb-4" />
              <CardTitle className="text-white">Real-Time Dashboard</CardTitle>
              <CardDescription className="text-slate-300">
                Periodic table visualization with live element tracking and deviation alerts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <Zap className="w-10 h-10 text-purple-400 mb-4" />
              <CardTitle className="text-white">AI Recommendations</CardTitle>
              <CardDescription className="text-slate-300">
                Intelligent alloy addition suggestions with cost optimization and outcome prediction
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-colors">
            <CardHeader>
              <Shield className="w-10 h-10 text-green-400 mb-4" />
              <CardTitle className="text-white">Quality Control</CardTitle>
              <CardDescription className="text-slate-300">
                Automated anomaly detection with root cause analysis and preventive measures
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Demo Sequence */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border-slate-600 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl text-white mb-4">See AlloyMind AI in Action</CardTitle>
            <CardDescription className="text-slate-300 text-lg">
              Experience the transformation from manual processes to AI-powered optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="space-y-4">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="text-white font-semibold">Manual Process Pain Points</h3>
                <p className="text-slate-400 text-sm">Slow decisions, material waste, quality inconsistencies</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold">AI Recommendation Live</h3>
                <p className="text-slate-400 text-sm">Real-time analysis with instant optimization suggestions</p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-white font-semibold">Cost & Time Savings</h3>
                <p className="text-slate-400 text-sm">Measurable improvements in efficiency and quality</p>
              </div>
            </div>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Start Your Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm mt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold">AlloyMind AI</span>
          </div>
          <p className="text-slate-400">
            © 2024 AlloyMind AI. Revolutionizing metallurgy with artificial intelligence.
          </p>
        </div>
      </footer>
    </div>
  )
}
