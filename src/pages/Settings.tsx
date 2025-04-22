import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import StudentIdCard from "@/components/StudentIdCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IdCard,
  Shield,
  Bell,
  Lock,
  Monitor,
  UserCog,
  Save,
  LogOut,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/sonner";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define theme type to match AppContext
type ThemeType = "light" | "dark" | "blue" | "pink";

// Save active tab to localStorage
const saveTab = (tab: string) => {
  try {
    localStorage.setItem("settings-active-tab", tab);
    console.log("Saved tab to localStorage:", tab);
  } catch (e) {
    console.error("Error saving tab to localStorage:", e);
  }
};

// Get active tab from localStorage
const getActiveTab = (): string => {
  try {
    const tab = localStorage.getItem("settings-active-tab");
    console.log("Retrieved tab from localStorage:", tab);
    return tab || "id-card";
  } catch (e) {
    console.error("Error getting tab from localStorage:", e);
    return "id-card";
  }
};

const Settings = () => {
  const {
    theme,
    setTheme,
    logout,
    currentUser,
    isCompactMode,
    setIsCompactMode,
    deleteAccount,
  } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Get the initial tab from URL hash or localStorage
  const getInitialTab = () => {
    // Check if there's a hash in the URL
    if (location.hash) {
      const tab = location.hash.replace("#", "");
      console.log("Using tab from URL hash:", tab);
      return tab;
    }
    // Otherwise use localStorage
    return getActiveTab();
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);

  // Update URL hash when tab changes and save to localStorage
  const handleTabChange = (value: string) => {
    console.log("Tab changed to:", value);
    setActiveTab(value);
    saveTab(value);
    // Update URL hash without causing page reload
    navigate(`/settings#${value}`, { replace: true });
  };

  // Ensure tab is synchronized with URL on mount and tab changes
  useEffect(() => {
    // When component mounts, ensure URL hash is updated
    navigate(`/settings#${activeTab}`, { replace: true });
  }, []);

  // Debug current theme
  useEffect(() => {
    console.log("Current theme in Settings:", theme);
    console.log("Theme in localStorage:", localStorage.getItem("theme"));
  }, [theme]);

  // Theme change handler
  const handleThemeChange = (newTheme: ThemeType) => {
    console.log("Settings: changing theme to:", newTheme);
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm account deletion");
      return;
    }

    try {
      await deleteAccount();
      setShowDeleteDialog(false);
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and settings
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
          defaultValue={activeTab}
        >
          {/* Desktop tabs */}
          <div className="hidden sm:block">
            <TabsList className="grid grid-cols-5 w-full mb-8">
              <TabsTrigger
                value="id-card"
                className="flex justify-center gap-2 items-center"
              >
                <IdCard className="h-4 w-4" />
                <span>ID Card</span>
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="flex justify-center gap-2 items-center"
              >
                <UserCog className="h-4 w-4" />
                <span>Account</span>
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="flex justify-center gap-2 items-center"
              >
                <Monitor className="h-4 w-4" />
                <span>Appearance</span>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex justify-center gap-2 items-center"
              >
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex justify-center gap-2 items-center"
              >
                <Shield className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Mobile scrollable tabs */}
          <div className="sm:hidden mb-6">
            <div className="overflow-x-auto no-scrollbar pb-2 relative border-b">
              <div className="flex min-w-max px-1">
                <button
                  className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "id-card"
                      ? "border-b-2 border-primary text-primary relative -mb-[2px]"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => handleTabChange("id-card")}
                >
                  <IdCard className="h-4 w-4 flex-shrink-0" />
                  ID Card
                </button>
                <button
                  className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "account"
                      ? "border-b-2 border-primary text-primary relative -mb-[2px]"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => handleTabChange("account")}
                >
                  <UserCog className="h-4 w-4 flex-shrink-0" />
                  Account
                </button>
                <button
                  className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "appearance"
                      ? "border-b-2 border-primary text-primary relative -mb-[2px]"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => handleTabChange("appearance")}
                >
                  <Monitor className="h-4 w-4 flex-shrink-0" />
                  Appearance
                </button>
                <button
                  className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "notifications"
                      ? "border-b-2 border-primary text-primary relative -mb-[2px]"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => handleTabChange("notifications")}
                >
                  <Bell className="h-4 w-4 flex-shrink-0" />
                  Notifications
                </button>
                <button
                  className={`px-4 py-2.5 text-sm font-medium flex items-center gap-2 whitespace-nowrap ${
                    activeTab === "security"
                      ? "border-b-2 border-primary text-primary relative -mb-[2px]"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => handleTabChange("security")}
                >
                  <Shield className="h-4 w-4 flex-shrink-0" />
                  Security
                </button>
              </div>
              {/* Scroll indicator - subtle gradient on right edge */}
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
            </div>
          </div>

          <TabsContent value="id-card">
            <Card>
              <CardHeader>
                <CardTitle>Student ID Card</CardTitle>
                <CardDescription>
                  View your digital student identification card
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StudentIdCard />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your account details and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" defaultValue={currentUser?.name || ""} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={currentUser?.email || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="student-id">Student ID</Label>
                      <Input
                        id="student-id"
                        defaultValue={currentUser?.studentId || ""}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade</Label>
                      <Input
                        id="grade"
                        defaultValue={currentUser?.grade || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="section">Section</Label>
                      <Input
                        id="section"
                        defaultValue={currentUser?.section || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Add your phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Write a short bio about yourself"
                    />
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        logout();
                        toast.success("Logged out successfully");
                        navigate("/login");
                      }}
                      className="gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSave}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize how the portal looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Theme</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Select the theme for your portal experience
                    </p>
                    <RadioGroup
                      value={theme}
                      onValueChange={handleThemeChange}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                      <div>
                        <RadioGroupItem
                          value="light"
                          id="theme-light"
                          className="sr-only"
                        />
                        <Label
                          htmlFor="theme-light"
                          className={`flex flex-col items-center gap-2 rounded-md border-2 p-4 hover:bg-accent cursor-pointer ${
                            theme === "light"
                              ? "border-primary"
                              : "border-transparent"
                          }`}
                        >
                          <div className="w-full h-24 rounded-md bg-[#f8fafc] border"></div>
                          <span>Light</span>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem
                          value="dark"
                          id="theme-dark"
                          className="sr-only"
                        />
                        <Label
                          htmlFor="theme-dark"
                          className={`flex flex-col items-center gap-2 rounded-md border-2 p-4 hover:bg-accent cursor-pointer ${
                            theme === "dark"
                              ? "border-primary"
                              : "border-transparent"
                          }`}
                        >
                          <div className="w-full h-24 rounded-md bg-[#0f172a] border"></div>
                          <span>Dark</span>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem
                          value="blue"
                          id="theme-blue"
                          className="sr-only"
                        />
                        <Label
                          htmlFor="theme-blue"
                          className={`flex flex-col items-center gap-2 rounded-md border-2 p-4 hover:bg-accent cursor-pointer ${
                            theme === "blue"
                              ? "border-primary"
                              : "border-transparent"
                          }`}
                        >
                          <div className="w-full h-24 rounded-md bg-[#f0f9ff] border"></div>
                          <span>Blue</span>
                        </Label>
                      </div>

                      <div>
                        <RadioGroupItem
                          value="pink"
                          id="theme-pink"
                          className="sr-only"
                        />
                        <Label
                          htmlFor="theme-pink"
                          className={`flex flex-col items-center gap-2 rounded-md border-2 p-4 hover:bg-accent cursor-pointer ${
                            theme === "pink"
                              ? "border-primary"
                              : "border-transparent"
                          }`}
                        >
                          <div className="w-full h-24 rounded-md bg-[#fdf2f8] border"></div>
                          <span>Pink</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4 pt-4">
                    <h3 className="text-lg font-medium">Interface Settings</h3>
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="animations" className="font-medium">
                            Interface Animations
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Enable animations and transitions
                          </p>
                        </div>
                        <Switch
                          id="animations"
                          defaultChecked
                          onCheckedChange={(checked) => {
                            localStorage.setItem(
                              "animations",
                              checked.toString()
                            );
                            toast.success(
                              checked
                                ? "Animations enabled"
                                : "Animations disabled"
                            );
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label htmlFor="compact" className="font-medium">
                            Compact Mode
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            Reduce spacing in the interface
                          </p>
                        </div>
                        <Switch
                          id="compact"
                          checked={isCompactMode}
                          onCheckedChange={(checked) => {
                            setIsCompactMode(checked);
                            toast.success(
                              checked
                                ? "Compact mode enabled"
                                : "Compact mode disabled"
                            );
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label
                            htmlFor="reduced-motion"
                            className="font-medium"
                          >
                            Reduced Motion
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            For accessibility needs
                          </p>
                        </div>
                        <Switch
                          id="reduced-motion"
                          onCheckedChange={(checked) => {
                            localStorage.setItem(
                              "reducedMotion",
                              checked.toString()
                            );
                            toast.success(
                              checked
                                ? "Reduced motion enabled"
                                : "Reduced motion disabled"
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    <span>Save Preferences</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Email Notifications</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          htmlFor="email-assignments"
                          className="font-medium"
                        >
                          Assignment Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          New assignments and due date reminders
                        </p>
                      </div>
                      <Switch id="email-assignments" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="email-grades" className="font-medium">
                          Grade Updates
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          When new grades are posted
                        </p>
                      </div>
                      <Switch id="email-grades" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                          htmlFor="email-announcements"
                          className="font-medium"
                        >
                          School Announcements
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Important school-wide information
                        </p>
                      </div>
                      <Switch id="email-announcements" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h3 className="text-lg font-medium">In-App Notifications</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="app-messages" className="font-medium">
                          Direct Messages
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          When someone sends you a message
                        </p>
                      </div>
                      <Switch id="app-messages" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="app-reminders" className="font-medium">
                          Assignment Reminders
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Upcoming and overdue assignments
                        </p>
                      </div>
                      <Switch id="app-reminders" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="app-schedule" className="font-medium">
                          Schedule Changes
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Updates to your class schedule
                        </p>
                      </div>
                      <Switch id="app-schedule" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    <span>Save Preferences</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your password and account security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Change Password</h3>
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() =>
                      toast.success("Password updated successfully")
                    }
                    className="gap-2 mt-2"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Update Password</span>
                  </Button>
                </div>

                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-medium">Account Security</h3>
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="two-factor" className="font-medium">
                          Two-Factor Authentication
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch id="two-factor" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="login-alerts" className="font-medium">
                          Login Alerts
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified of new login attempts
                        </p>
                      </div>
                      <Switch id="login-alerts" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t">
                  <h3 className="text-lg font-medium text-destructive flex items-center gap-2">
                    <Trash2 className="h-5 w-5" />
                    Delete Account
                  </h3>
                  <div className="bg-destructive/10 p-4 rounded-md border border-destructive/20">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <p className="font-medium text-destructive">
                          Warning: This action cannot be undone
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Deleting your account will permanently remove all your
                          personal data, settings, and access to the platform.
                          Any saved work or records will be lost.
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteDialog(true)}
                    className="gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Account</span>
                  </Button>
                </div>

                <div className="flex justify-between items-center pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      logout();
                      toast.success("Logged out successfully");
                      navigate("/login");
                    }}
                    className="gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Button>
                  <Button type="button" onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    <span>Save Security Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Confirm Account Deletion
            </DialogTitle>
            <DialogDescription>
              This action permanently deletes your account and all associated
              data. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-destructive/10 p-3 rounded-md border border-destructive/20 text-sm">
              To confirm deletion, please type{" "}
              <span className="font-bold">DELETE</span> in the field below.
            </div>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="Type DELETE to confirm"
              className="border-destructive/50 focus-visible:ring-destructive"
            />
          </div>
          <DialogFooter className="flex gap-2 flex-row justify-between sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDeleteConfirmText("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAccount}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Permanently Delete Account</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Settings;
