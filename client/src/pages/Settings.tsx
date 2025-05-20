import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AppSettings } from '@shared/types';
import { apiRequest } from '@/lib/queryClient';
import { Link, useLocation } from 'wouter';
import { usePhotos } from '@/hooks/usePhotos';
import { X, ArrowLeft, Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch settings
  const { data: settings, isLoading: isLoadingSettings } = useQuery<AppSettings>({
    queryKey: ['/api/settings'],
  });
  
  // Get photos
  const { 
    photos, 
    isLoading: isLoadingPhotos,
    uploadPhoto,
    uploadBulkPhotos,
    deletePhoto,
    isUploading,
    getPhotoUrl
  } = usePhotos();
  
  // State for new family member
  const [newMember, setNewMember] = useState({
    name: '',
    color: 'coral',
    calendarUrl: ''
  });
  
  // Mutation to update settings
  const updateSettingsMutation = useMutation({
    mutationFn: (updatedSettings: Partial<AppSettings>) => {
      return apiRequest('PUT', '/api/settings', updatedSettings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update settings",
        description: String(error),
        variant: "destructive"
      });
    }
  });
  
  // Mutation to add a family member
  const addFamilyMemberMutation = useMutation({
    mutationFn: (member: { name: string; color: string; calendarUrl: string }) => {
      return apiRequest('POST', '/api/family-members', member);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      setNewMember({
        name: '',
        color: 'coral',
        calendarUrl: ''
      });
      toast({
        title: "Family member added",
        description: "The new family member has been added successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add family member",
        description: String(error),
        variant: "destructive"
      });
    }
  });
  
  // Mutation to delete a family member
  const deleteFamilyMemberMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest('DELETE', `/api/family-members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Family member removed",
        description: "The family member has been removed successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to remove family member",
        description: String(error),
        variant: "destructive"
      });
    }
  });
  
  // Mutation to update meal calendar
  const updateMealCalendarMutation = useMutation({
    mutationFn: (calendarUrl: string) => {
      return apiRequest('PUT', '/api/meal-calendar', { calendarUrl });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      toast({
        title: "Meal calendar updated",
        description: "The meal calendar has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to update meal calendar",
        description: String(error),
        variant: "destructive"
      });
    }
  });
  
  // Handle settings update
  const handleSettingsUpdate = (field: string, value: any) => {
    if (!settings) return;
    
    updateSettingsMutation.mutate({
      ...settings,
      [field]: value
    });
  };
  
  // Handle single file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadPhoto(files[0]);
      
      // Reset the input after upload
      event.target.value = '';
    }
  };
  
  // Handle bulk file upload
  const handleBulkFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      // Convert FileList to array
      const filesArray = Array.from(files);
      
      // Upload multiple files
      uploadBulkPhotos(filesArray);
      
      // Reset the input after upload
      event.target.value = '';
      
      toast({
        title: "Uploading photos",
        description: `Uploading ${filesArray.length} photos...`,
      });
    }
  };
  
  // Handle add family member
  const handleAddFamilyMember = () => {
    if (newMember.name && newMember.calendarUrl) {
      addFamilyMemberMutation.mutate(newMember);
    } else {
      toast({
        title: "Incomplete information",
        description: "Please provide name and calendar URL for the new family member.",
        variant: "destructive"
      });
    }
  };
  
  // Handle update meal calendar
  const handleUpdateMealCalendar = () => {
    const calendarUrl = (document.getElementById('mealCalendarUrl') as HTMLInputElement).value;
    if (calendarUrl) {
      updateMealCalendarMutation.mutate(calendarUrl);
    }
  };
  
  if (isLoadingSettings) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-6">
          <p className="text-center">Loading settings...</p>
        </div>
      </div>
    );
  }
  
  if (!settings) {
    return (
      <div className="min-h-screen bg-[#F0F0F0] p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] p-6">
          <p className="text-center text-red-500">Failed to load settings</p>
          <Button className="mt-4 mx-auto block" onClick={() => navigate('/')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0F0] p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="bg-[#111111] text-white px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <Button variant="ghost" size="icon" className="mr-2 text-white hover:bg-[#111111]/50">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h2 className="text-2xl font-semibold">Settings</h2>
          </div>
          <Link href="/">
            <Button variant="ghost" size="icon" className="text-white hover:bg-[#111111]/50">
              <X className="h-5 w-5" />
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="calendars" className="p-6">
          <TabsList className="mb-6 border-b border-[#DADADA] w-full justify-start rounded-none bg-transparent p-0 space-x-2">
            <TabsTrigger 
              value="calendars" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F8A9A0] data-[state=active]:text-[#111111] pb-2 text-[#7A7A7A] bg-transparent"
            >
              Calendars
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F8A9A0] data-[state=active]:text-[#111111] pb-2 text-[#7A7A7A] bg-transparent"
            >
              Appearance
            </TabsTrigger>
            <TabsTrigger 
              value="photos" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F8A9A0] data-[state=active]:text-[#111111] pb-2 text-[#7A7A7A] bg-transparent"
            >
              Photos
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#F8A9A0] data-[state=active]:text-[#111111] pb-2 text-[#7A7A7A] bg-transparent"
            >
              System
            </TabsTrigger>
          </TabsList>
          
          {/* Calendars Tab */}
          <TabsContent value="calendars" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Family Members & Calendars</h3>
              
              {/* Family Members List */}
              <div className="space-y-4 mb-6">
                {settings.familyMembers.map(member => (
                  <div key={member.id} className="bg-[#F0F0F0] p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div 
                          className={`w-4 h-4 rounded-full mr-3`}
                          style={{ backgroundColor: member.color.startsWith('#') ? member.color : `var(--${member.color})` }}
                        />
                        <h4 className="font-semibold">{member.name}</h4>
                      </div>
                      <div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-[#7A7A7A] hover:text-[#111111] mr-2"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-[#7A7A7A] hover:text-red-500"
                          onClick={() => deleteFamilyMemberMutation.mutate(member.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="pl-7">
                      <Label className="block text-sm text-[#7A7A7A] mb-1">Calendar URL</Label>
                      <Input 
                        defaultValue={member.calendarUrl} 
                        className="w-full p-2 border border-[#DADADA] rounded bg-white text-sm" 
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Add New Family Member */}
              <div className="bg-[#F0F0F0] p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Add New Family Member</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="memberName">Name</Label>
                    <Input 
                      id="memberName" 
                      placeholder="Enter name"
                      value={newMember.name}
                      onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="memberColor">Color</Label>
                    <Select 
                      value={newMember.color} 
                      onValueChange={(value) => setNewMember({...newMember, color: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="coral">Coral</SelectItem>
                        <SelectItem value="sage">Sage</SelectItem>
                        <SelectItem value="sky">Sky Blue</SelectItem>
                        <SelectItem value="lavender">Lavender</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="memberCalendar">Calendar URL (iCal)</Label>
                    <Input 
                      id="memberCalendar" 
                      placeholder="https://calendar.google.com/calendar/ical/..."
                      value={newMember.calendarUrl}
                      onChange={(e) => setNewMember({...newMember, calendarUrl: e.target.value})}
                    />
                  </div>
                  <Button 
                    className="bg-[#F8A9A0] hover:bg-[#F8A9A0]/90 text-white"
                    onClick={handleAddFamilyMember}
                    disabled={addFamilyMemberMutation.isPending}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Family Member
                  </Button>
                </div>
              </div>
              
              {/* Meals Calendar */}
              <div className="bg-[#F0F0F0] p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Meals Calendar</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="mealCalendarUrl">Calendar URL (iCal)</Label>
                    <Input 
                      id="mealCalendarUrl" 
                      defaultValue={settings.mealCalendarUrl || ''} 
                      placeholder="https://calendar.google.com/calendar/ical/..."
                    />
                  </div>
                  <Button 
                    onClick={handleUpdateMealCalendar}
                    disabled={updateMealCalendarMutation.isPending}
                  >
                    Update Meal Calendar
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Display Preferences</h3>
              
              <div className="space-y-4">
                {/* Family Name */}
                <div className="bg-[#F0F0F0] p-4 rounded-lg">
                  <Label htmlFor="familyName" className="block mb-2">Family Name</Label>
                  <Input 
                    id="familyName" 
                    defaultValue={settings.familyName} 
                    onChange={(e) => handleSettingsUpdate('familyName', e.target.value)}
                  />
                </div>
                
                {/* Time Format */}
                <div className="bg-[#F0F0F0] p-4 rounded-lg">
                  <Label className="block mb-2">Time Format</Label>
                  <div className="flex space-x-4">
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="format12" 
                        name="timeFormat" 
                        value="12" 
                        className="mr-2" 
                        checked={settings.timeFormat === '12'}
                        onChange={() => handleSettingsUpdate('timeFormat', '12')}
                      />
                      <Label htmlFor="format12">12-hour (AM/PM)</Label>
                    </div>
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        id="format24" 
                        name="timeFormat" 
                        value="24" 
                        className="mr-2" 
                        checked={settings.timeFormat === '24'}
                        onChange={() => handleSettingsUpdate('timeFormat', '24')}
                      />
                      <Label htmlFor="format24">24-hour</Label>
                    </div>
                  </div>
                </div>
                
                {/* Screensaver Timeout */}
                <div className="bg-[#F0F0F0] p-4 rounded-lg">
                  <Label htmlFor="screenTimeout" className="block mb-2">Screensaver Timeout (minutes)</Label>
                  <Input 
                    id="screenTimeout" 
                    type="number" 
                    min="1" 
                    max="60" 
                    defaultValue={settings.screensaverTimeout.toString()}
                    onChange={(e) => handleSettingsUpdate('screensaverTimeout', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Photos Tab */}
          <TabsContent value="photos" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Photo Gallery</h3>
              
              {/* Upload Photos */}
              <div className="bg-[#F0F0F0] p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Upload Photos</h4>
                
                {/* Single Photo Upload */}
                <div className="flex space-x-2 mb-4">
                  <Input 
                    id="photoUpload" 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                  <Button disabled={isUploading}>
                    Upload Single
                  </Button>
                </div>
                
                {/* Bulk Photo Upload */}
                <div className="flex space-x-2">
                  <Input 
                    id="bulkPhotoUpload" 
                    type="file" 
                    accept="image/*"
                    multiple
                    onChange={handleBulkFileUpload}
                  />
                  <Button disabled={isUploading}>
                    Upload Multiple
                  </Button>
                </div>
                
                {isUploading && (
                  <p className="text-sm text-[#7A7A7A] mt-2">Uploading photos...</p>
                )}
              </div>
              
              {/* Photo Gallery */}
              <div className="bg-[#F0F0F0] p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Manage Photos</h4>
                
                {isLoadingPhotos ? (
                  <p className="text-center p-4">Loading photos...</p>
                ) : !photos || photos.length === 0 ? (
                  <p className="text-center p-4">No photos uploaded yet</p>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {photos.map(photo => (
                      <div key={photo.id} className="relative group">
                        <img 
                          src={getPhotoUrl(photo)} 
                          alt="Family photo" 
                          className="w-full h-32 object-cover rounded-lg" 
                        />
                        <Button 
                          variant="destructive" 
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => deletePhoto(photo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* System Tab */}
          <TabsContent value="system" className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">System Settings</h3>
              
              {/* Weather Settings */}
              <div className="bg-[#F0F0F0] p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-3">Weather Settings</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="weatherApiKey">OpenWeatherMap API Key</Label>
                    <Input 
                      id="weatherApiKey" 
                      type="password"
                      defaultValue={settings.weatherApiKey || ''} 
                      onChange={(e) => handleSettingsUpdate('weatherApiKey', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="weatherLocation">Location</Label>
                    <Input 
                      id="weatherLocation" 
                      placeholder="New York,US" 
                      defaultValue={settings.weatherLocation} 
                      onChange={(e) => handleSettingsUpdate('weatherLocation', e.target.value)}
                    />
                    <p className="text-xs text-[#7A7A7A] mt-1">Enter city name and country code (e.g., New York,US)</p>
                  </div>
                  <div>
                    <Label className="block mb-2">Temperature Unit</Label>
                    <div className="flex space-x-4">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="unitF" 
                          name="tempUnit" 
                          value="F" 
                          className="mr-2" 
                          checked={settings.tempUnit === 'F'}
                          onChange={() => handleSettingsUpdate('tempUnit', 'F')}
                        />
                        <Label htmlFor="unitF">Fahrenheit (°F)</Label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="unitC" 
                          name="tempUnit" 
                          value="C" 
                          className="mr-2" 
                          checked={settings.tempUnit === 'C'}
                          onChange={() => handleSettingsUpdate('tempUnit', 'C')}
                        />
                        <Label htmlFor="unitC">Celsius (°C)</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Raspberry Pi Setup */}
              <div className="bg-[#F0F0F0] p-4 rounded-lg">
                <h4 className="font-semibold mb-3">Raspberry Pi Setup</h4>
                <div className="space-y-3">
                  <h5 className="font-medium">Auto-start on Boot</h5>
                  <div className="bg-gray-100 p-3 rounded text-sm font-mono">
                    <p>1. Edit the autostart file:</p>
                    <pre className="bg-gray-800 text-white p-2 rounded mt-1 mb-2 overflow-x-auto">
                      sudo nano ~/.config/lxsession/LXDE-pi/autostart
                    </pre>
                    <p>2. Add the following line:</p>
                    <pre className="bg-gray-800 text-white p-2 rounded mt-1 mb-2 overflow-x-auto">
                      @chromium-browser --kiosk --disable-restore-session-state http://localhost:5000
                    </pre>
                    <p>3. Save and exit (Ctrl+X, then Y)</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
