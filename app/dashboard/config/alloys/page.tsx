"use client"

import { useState, useEffect } from "react"
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
import { Plus, Edit, Trash2, Copy, Settings, Check, X, RefreshCcw, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { AlloyConfig } from "@/types/alloy"

// Use our defined type from types/alloy.ts
type AlloyGrade = AlloyConfig

export default function AlloySpecificationPage() {
  const { toast } = useToast()
  const [alloyGrades, setAlloyGrades] = useState<AlloyGrade[]>([])
  const [selectedGrade, setSelectedGrade] = useState<AlloyGrade | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [tempGrade, setTempGrade] = useState<Partial<AlloyGrade>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form states
  const [newGradeName, setNewGradeName] = useState("")
  const [newGradeCategory, setNewGradeCategory] = useState("")
  const [newApplication, setNewApplication] = useState("")
  const [categories, setCategories] = useState<string[]>([])

  // Fetch alloys from API
  useEffect(() => {
    fetchAlloys()
    fetchCategories()
  }, [])

  const fetchAlloys = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/alloys')
      
      if (!response.ok) {
        throw new Error('Failed to fetch alloys')
      }
      
      const data = await response.json()
      console.log('API Response - Alloys:', data)
      
      // If data exists but doesn't match our expected format, we need to transform it
      if (data && Array.isArray(data)) {
        const formattedData = data.map(alloy => {
          // Transform the elements structure if needed
          if (alloy.elements && typeof alloy.elements === 'object') {
            // Ensure each element has min, max, target
            Object.keys(alloy.elements).forEach(element => {
              if (!alloy.elements[element].min && alloy.elements[element].min !== 0) {
                alloy.elements[element].min = 0;
              }
              if (!alloy.elements[element].max && alloy.elements[element].max !== 0) {
                alloy.elements[element].max = 1;
              }
              if (!alloy.elements[element].target && alloy.elements[element].target !== 0) {
                alloy.elements[element].target = 
                  (alloy.elements[element].min + alloy.elements[element].max) / 2;
              }
            });
          }
          // Ensure applications is always an array
          if (!alloy.applications) {
            alloy.applications = [];
          }
          // Ensure ID is set
          if (!alloy.id && alloy._id) {
            alloy.id = alloy._id.toString();
          }
          return alloy;
        });
        setAlloyGrades(formattedData);
      } else {
        setAlloyGrades([]);
      }
    } catch (err) {
      setError('Error loading alloy data')
      console.error(err)
      toast({
        title: "Error",
        description: "Could not load alloy data. Please try again later.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/alloys/categories')
      
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (err) {
      console.error('Error fetching categories', err)
    }
  }

  // Create new alloy grade
  const createNewGrade = async () => {
    if (!newGradeName || !newGradeCategory) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      setIsLoading(true)
      
      const newGrade = {
        id: `custom-${Date.now()}`,
        name: newGradeName,
        category: newGradeCategory,
        elements: {
          C: { min: 0.1, max: 1.0, target: 0.5 },
          Mn: { min: 0.1, max: 2.0, target: 1.0 },
          Si: { min: 0.1, max: 1.0, target: 0.3 },
          P: { min: 0.01, max: 0.05, target: 0.03 },
          S: { min: 0.01, max: 0.05, target: 0.03 },
        },
        applications: newApplication ? [newApplication] : [],
        status: "active" as const
      }

      const response = await fetch('/api/alloys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGrade),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create alloy')
      }

      const result = await response.json()
      
      toast({
        title: "Success",
        description: "Alloy created successfully",
      })

      // Add the new grade to the list and select it
      setAlloyGrades(prev => [...prev, newGrade as AlloyGrade])
      setSelectedGrade(newGrade as AlloyGrade)
      
      // Reset form and close dialog
      setNewGradeName("")
      setNewGradeCategory("")
      setNewApplication("")
      setIsCreateDialogOpen(false)
      
    } catch (error) {
      console.error('Error creating alloy:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create alloy. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize grade for editing
  const initializeGrade = (grade: AlloyGrade) => {
    setTempGrade({...grade})
    setIsEditMode(true)
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
        }
      }
    }))
  }

  // Save grade (create or update)
  const saveGrade = async () => {
    if (!tempGrade.name || !tempGrade.category) return
    
    try {
      setIsLoading(true)
      
      if (isEditMode && tempGrade.id) {
        // Update existing alloy
        const response = await fetch(`/api/alloys/${tempGrade.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(tempGrade),
        })
        
        if (!response.ok) {
          throw new Error('Failed to update alloy')
        }
        
        toast({
          title: "Success",
          description: "Alloy updated successfully",
        })
        
        // Update the selected grade immediately with the new values
        setSelectedGrade(tempGrade as AlloyGrade)
        
        // Update the alloy grades list
        setAlloyGrades(prev => prev.map(grade => 
          grade.id === tempGrade.id ? tempGrade as AlloyGrade : grade
        ))
        
      } else {
        // Create new alloy
        const newGrade = {
          ...tempGrade,
          id: tempGrade.id || `custom-${Date.now()}`,
          name: newGradeName || tempGrade.name,
          category: newGradeCategory || tempGrade.category,
          status: "active"
        };
        
        const response = await fetch('/api/alloys', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newGrade),
        })
        
        if (!response.ok) {
          throw new Error('Failed to create alloy')
        }
        
        toast({
          title: "Success",
          description: "Alloy created successfully",
        })
        
        // Add the new grade to the list and select it
        setAlloyGrades(prev => [...prev, newGrade as AlloyGrade])
        setSelectedGrade(newGrade as AlloyGrade)
      }
    } catch (error) {
      console.error('Error saving alloy:', error)
      toast({
        title: "Error",
        description: "Failed to save alloy. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setIsEditMode(false)
      setTempGrade({})
      setNewGradeName("")
      setNewGradeCategory("")
      setIsCreateDialogOpen(false)
    }
  }

  // Clone a grade
  const cloneGrade = async () => {
    if (!selectedGrade) return
    
    try {
      setIsLoading(true)
      
      const clonedGrade = {
        ...selectedGrade,
        id: `clone-${Date.now()}`,
        name: `${selectedGrade.name} (Copy)`
      }
      
      // Remove _id if it exists
      delete clonedGrade._id
      
      const response = await fetch('/api/alloys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clonedGrade),
      })
      
      if (!response.ok) {
        throw new Error('Failed to clone alloy')
      }
      
      toast({
        title: "Success",
        description: "Alloy cloned successfully",
      })
      
      // Add the cloned grade to the list and select it
      setAlloyGrades(prev => [...prev, clonedGrade as AlloyGrade])
      setSelectedGrade(clonedGrade as AlloyGrade)
    } catch (error) {
      console.error('Error cloning alloy:', error)
      toast({
        title: "Error", 
        description: "Failed to clone alloy. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Delete a grade
  const deleteGrade = async () => {
    if (!selectedGrade) return
    
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/alloys/${selectedGrade.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete alloy')
      }
      
      toast({
        title: "Success",
        description: "Alloy deleted successfully",
      })
      
      // Remove the deleted grade from the list
      setAlloyGrades(prev => prev.filter(grade => grade.id !== selectedGrade.id))
      setSelectedGrade(null)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting alloy:', error)
      toast({
        title: "Error",
        description: "Failed to delete alloy. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
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
    <div className="flex flex-col min-h-screen bg-slate-900">
      <div className="flex h-16 shrink-0 items-center gap-2 border-b border-slate-700 px-4 bg-slate-900">
        <div className="flex-1 flex items-center">
          <h1 className="text-xl font-semibold text-white">Alloy Specifications</h1>
        </div>
        <div className="flex items-center space-x-4">
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
                    onClick={createNewGrade}
                    disabled={!newGradeName || !newGradeCategory || isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Grade"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 space-y-6 p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Grade List */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Alloy Grades</CardTitle>
                <CardDescription className="text-slate-400">Manage alloy specifications and tolerances</CardDescription>
              </div>
              {isLoading && (
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                  <RefreshCcw className="h-4 w-4 animate-spin" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="max-h-[calc(100vh-16rem)] overflow-y-auto">
              {error ? (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
                  <p className="text-slate-300">{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-slate-600" 
                    onClick={fetchAlloys}
                  >
                    Retry
                  </Button>
                </div>
              ) : isLoading && alloyGrades.length === 0 ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div 
                      key={i} 
                      className="p-3 rounded-lg border border-slate-700/50 bg-slate-800/30 animate-pulse h-16"
                    />
                  ))}
                </div>
              ) : alloyGrades.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 text-center">
                  <p className="text-slate-300">No alloy grades found</p>
                  <Button 
                    variant="outline" 
                    className="mt-4 border-slate-600"
                    onClick={() => setIsCreateDialogOpen(true)}
                  >
                    Create Your First Grade
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 pr-2">
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
              )}
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
                            {categories.length > 0 ? (
                              categories.map((category) => (
                                <SelectItem key={category} value={category} className="text-white">
                                  {category}
                                </SelectItem>
                              ))
                            ) : (
                              <>
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
                              </>
                            )}
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
    </div>
  )
}