"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Plus, Edit, Trash2, Copy, Settings, Check, X } from "lucide-react"

type ElementSpec = {
  min: number
  max: number
  target: number
}

type AlloyGrade = {
  id: string
  name: string
  category: string
  elements: Record<string, ElementSpec>
  applications: string[]
  status: string
}

const initialAlloyGrades: AlloyGrade[] = [
  {
    id: "AISI-4140",
    name: "AISI 4140",
    category: "Alloy Steel",
    elements: {
      C: { min: 0.38, max: 0.43, target: 0.4 },
      Mn: { min: 0.75, max: 1.0, target: 0.85 },
      P: { min: 0.0, max: 0.035, target: 0.02 },
      S: { min: 0.0, max: 0.04, target: 0.025 },
      Si: { min: 0.15, max: 0.35, target: 0.25 },
      Cr: { min: 0.8, max: 1.1, target: 0.95 },
      Mo: { min: 0.15, max: 0.25, target: 0.2 },
    },
    applications: ["Automotive", "Machinery", "Tools"],
    status: "active",
  },
  {
    id: "AISI-1045",
    name: "AISI 1045",
    category: "Carbon Steel",
    elements: {
      C: { min: 0.43, max: 0.5, target: 0.45 },
      Mn: { min: 0.6, max: 0.9, target: 0.75 },
      P: { min: 0.0, max: 0.04, target: 0.025 },
      S: { min: 0.0, max: 0.05, target: 0.03 },
      Si: { min: 0.15, max: 0.35, target: 0.25 },
    },
    applications: ["Construction", "General Purpose"],
    status: "active",
  },
  {
    id: "AISI-4340",
    name: "AISI 4340",
    category: "Alloy Steel",
    elements: {
      C: { min: 0.38, max: 0.43, target: 0.4 },
      Mn: { min: 0.6, max: 0.8, target: 0.7 },
      P: { min: 0.0, max: 0.035, target: 0.02 },
      S: { min: 0.0, max: 0.04, target: 0.025 },
      Si: { min: 0.15, max: 0.35, target: 0.25 },
      Cr: { min: 0.7, max: 0.9, target: 0.8 },
      Ni: { min: 1.65, max: 2.0, target: 1.8 },
      Mo: { min: 0.2, max: 0.3, target: 0.25 },
    },
    applications: ["Aerospace", "High Strength"],
    status: "active",
  },
]

export default function AlloySpecificationPage() {
  const [alloyGrades, setAlloyGrades] = useState<AlloyGrade[]>(initialAlloyGrades)
  const [selectedGrade, setSelectedGrade] = useState<AlloyGrade | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [tempGrade, setTempGrade] = useState<Partial<AlloyGrade>>({})
  
  // Form states
  const [newGradeName, setNewGradeName] = useState("")
  const [newGradeCategory, setNewGradeCategory] = useState("")
  const [newApplication, setNewApplication] = useState("")

  // Initialize a new grade or edit existing one
  const initializeGrade = (grade?: AlloyGrade) => {
    if (grade) {
      setTempGrade({...grade})
      setIsEditMode(true)
    } else {
      setTempGrade({
        id: `custom-${Date.now()}`,
        name: newGradeName,
        category: newGradeCategory,
        elements: {
          C: { min: 0.1, max: 1.0, target: 0.5 },
          Mn: { min: 0.1, max: 2.0, target: 1.0 },
        },
        applications: [],
        status: "active"
      })
    }
  }

  // Handle element target change
  const handleElementChange = (element: string, value: number) => {
    setTempGrade(prev => ({
      ...prev,
      elements: {
        ...prev.elements,
        [element]: {
          ...prev.elements?.[element],
          target: value,
          min: prev.elements?.[element]?.min ?? 0,
          max: prev.elements?.[element]?.max ?? 0,
        } as ElementSpec
      }
    }))
  }

  // Save grade (create or update)
  const saveGrade = () => {
    if (!tempGrade.name || !tempGrade.category) return

    if (isEditMode && tempGrade.id) {
      setAlloyGrades(alloyGrades.map(grade =>
        grade.id === tempGrade.id ? tempGrade as AlloyGrade : grade
      ));
      setSelectedGrade(tempGrade as AlloyGrade);
    } else {
      const newGrade = {
        ...tempGrade,
        id: `custom-${Date.now()}`,
        name: newGradeName,
        category: newGradeCategory,
        status: "active"
      } as AlloyGrade;
      setAlloyGrades([...alloyGrades, newGrade]);
      setSelectedGrade(newGrade);
    }
    
    setIsEditMode(false)
    setTempGrade({})
    setNewGradeName("")
    setNewGradeCategory("")
    setIsCreateDialogOpen(false)
  }

  // Clone a grade
  const cloneGrade = () => {
    if (!selectedGrade) return
    
    const clonedGrade = {
      ...selectedGrade,
      id: `clone-${Date.now()}`,
      name: `${selectedGrade.name} (Copy)`
    }
    
    setAlloyGrades([...alloyGrades, clonedGrade])
    setSelectedGrade(clonedGrade)
  }

  // Delete a grade
  const deleteGrade = () => {
    if (!selectedGrade) return
    
    setAlloyGrades(alloyGrades.filter(grade => grade.id !== selectedGrade.id))
    setSelectedGrade(null)
    setIsDeleteDialogOpen(false)
  }

  // Add new application
  const addApplication = () => {
    if (!newApplication.trim()) return
    
    setTempGrade(prev => ({
      ...prev,
      applications: [...(prev.applications || []), newApplication.trim()]
    }))
    setNewApplication("")
  }

  // Remove application
  const removeApplication = (app: string) => {
    setTempGrade(prev => ({
      ...prev,
      applications: prev.applications?.filter(a => a !== app) || []
    }))
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Alloy Specifications</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                New Grade
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New Alloy Grade</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Define a new alloy specification with element tolerances
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gradeName" className="text-slate-300">
                    Grade Name
                  </Label>
                  <Input
                    id="gradeName"
                    value={newGradeName}
                    onChange={(e) => setNewGradeName(e.target.value)}
                    placeholder="e.g., AISI 4150"
                    className="bg-slate-700/50 border-slate-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-slate-300">
                    Category
                  </Label>
                  <Select value={newGradeCategory} onValueChange={setNewGradeCategory}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="Carbon Steel" className="text-white">
                        Carbon Steel
                      </SelectItem>
                      <SelectItem value="Alloy Steel" className="text-white">
                        Alloy Steel
                      </SelectItem>
                      <SelectItem value="Stainless Steel" className="text-white">
                        Stainless Steel
                      </SelectItem>
                      <SelectItem value="Tool Steel" className="text-white">
                        Tool Steel
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-slate-600 text-slate-300 bg-transparent"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => {
                      initializeGrade()
                      setIsCreateDialogOpen(false)
                      setIsEditMode(true)
                    }}
                    disabled={!newGradeName || !newGradeCategory}
                  >
                    Create Grade
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Grade List */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Alloy Grades</CardTitle>
              <CardDescription className="text-slate-400">Manage alloy specifications and tolerances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alloyGrades.map((grade) => (
                  <div
                    key={grade.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedGrade?.id === grade.id
                        ? "bg-blue-500/20 border-blue-500/30"
                        : "bg-slate-700/30 border-slate-600 hover:bg-slate-700/50"
                    }`}
                    onClick={() => setSelectedGrade(grade)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-medium">{grade.name}</h3>
                      <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                        {grade.status}
                      </Badge>
                    </div>
                    <p className="text-slate-400 text-sm">{grade.category}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {grade.applications.map((app) => (
                        <Badge key={app} variant="secondary" className="bg-slate-600/20 text-slate-300 text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Grade Details */}
          <div className="lg:col-span-2">
            {isEditMode && tempGrade ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <Input
                        value={tempGrade.name || ""}
                        onChange={(e) => setTempGrade({...tempGrade, name: e.target.value})}
                        className="text-white bg-slate-700/50 border-slate-600 text-xl font-medium mb-1"
                      />
                      <CardDescription className="text-slate-400">
                        <Select 
                          value={tempGrade.category} 
                          onValueChange={(value) => setTempGrade({...tempGrade, category: value})}
                        >
                          <SelectTrigger className="bg-slate-700/50 border-slate-600 text-slate-400 w-[180px]">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-slate-700">
                            <SelectItem value="Carbon Steel" className="text-white">
                              Carbon Steel
                            </SelectItem>
                            <SelectItem value="Alloy Steel" className="text-white">
                              Alloy Steel
                            </SelectItem>
                            <SelectItem value="Stainless Steel" className="text-white">
                              Stainless Steel
                            </SelectItem>
                            <SelectItem value="Tool Steel" className="text-white">
                              Tool Steel
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-slate-600 text-slate-300 bg-transparent"
                        onClick={() => setIsEditMode(false)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={saveGrade}
                        disabled={!tempGrade.name || !tempGrade.category}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Element Specifications */}
                  <div>
                    <h3 className="text-white font-medium mb-4">Element Specifications</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {tempGrade.elements && Object.entries(tempGrade.elements).map(([element, spec]) => (
                        <div key={element} className="p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-medium text-lg">{element}</h4>
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                              {spec.target}%
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Range:</span>
                                <span className="text-white">
                                  {spec.min}% - {spec.max}%
                                </span>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-slate-400 text-xs">Target: {spec.target}%</Label>
                                <Slider
                                  value={[spec.target]}
                                  min={spec.min}
                                  max={spec.max}
                                  step={0.01}
                                  onValueChange={([value]) => handleElementChange(element, value)}
                                  className="w-full"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-center p-2 rounded bg-slate-800/50">
                                <div className="text-slate-400">Min</div>
                                <div className="text-white font-mono">{spec.min}%</div>
                              </div>
                              <div className="text-center p-2 rounded bg-slate-800/50">
                                <div className="text-slate-400">Max</div>
                                <div className="text-white font-mono">{spec.max}%</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Applications */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Applications</h3>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {tempGrade.applications?.map((app) => (
                        <Badge
                          key={app}
                          variant="secondary"
                          className="bg-green-500/10 text-green-400 border-green-500/20"
                        >
                          {app}
                          <button 
                            onClick={() => removeApplication(app)}
                            className="ml-1 text-green-300 hover:text-green-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={newApplication}
                        onChange={(e) => setNewApplication(e.target.value)}
                        placeholder="Add application"
                        className="bg-slate-700/50 border-slate-600 text-white flex-1"
                      />
                      <Button 
                        size="sm" 
                        onClick={addApplication}
                        disabled={!newApplication.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : selectedGrade ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{selectedGrade.name}</CardTitle>
                      <CardDescription className="text-slate-400">
                        {selectedGrade.category} • Element composition specifications
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-slate-600 text-slate-300 bg-transparent"
                        onClick={cloneGrade}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Clone
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-slate-600 text-slate-300 bg-transparent"
                        onClick={() => initializeGrade(selectedGrade)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 border-slate-700">
                          <DialogHeader>
                            <DialogTitle className="text-white">Confirm Deletion</DialogTitle>
                            <DialogDescription className="text-slate-400">
                              Are you sure you want to delete {selectedGrade.name}? This action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end space-x-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => setIsDeleteDialogOpen(false)}
                              className="border-slate-600 text-slate-300 bg-transparent"
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive" 
                              className="bg-red-600 hover:bg-red-700"
                              onClick={deleteGrade}
                            >
                              Delete
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Element Specifications */}
                  <div>
                    <h3 className="text-white font-medium mb-4">Element Specifications</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(selectedGrade.elements).map(([element, spec]) => (
                        <div key={element} className="p-4 rounded-lg bg-slate-700/30 border border-slate-600">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-white font-medium text-lg">{element}</h4>
                            <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                              {spec.target}%
                            </Badge>
                          </div>

                          <div className="space-y-3">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Range:</span>
                                <span className="text-white">
                                  {spec.min}% - {spec.max}%
                                </span>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-slate-400 text-xs">Target: {spec.target}%</Label>
                                <Slider
                                  value={[spec.target]}
                                  min={spec.min}
                                  max={spec.max}
                                  step={0.01}
                                  className="w-full"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="text-center p-2 rounded bg-slate-800/50">
                                <div className="text-slate-400">Min</div>
                                <div className="text-white font-mono">{spec.min}%</div>
                              </div>
                              <div className="text-center p-2 rounded bg-slate-800/50">
                                <div className="text-slate-400">Max</div>
                                <div className="text-white font-mono">{spec.max}%</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Applications */}
                  <div>
                    <h3 className="text-white font-medium mb-3">Applications</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedGrade.applications.map((app) => (
                        <Badge
                          key={app}
                          variant="secondary"
                          className="bg-green-500/10 text-green-400 border-green-500/20"
                        >
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Template Actions */}
                  <div className="pt-4 border-t border-slate-700">
                    <h3 className="text-white font-medium mb-3">Template Actions</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Settings className="w-4 h-4 mr-2" />
                        Save as Template
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                        Export Specification
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300 bg-transparent">
                        Import from Template
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="pt-6">
                  <div className="text-center py-12">
                    <Settings className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">Select an Alloy Grade</h3>
                    <p className="text-slate-400">Choose a grade from the list to view and edit specifications</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}