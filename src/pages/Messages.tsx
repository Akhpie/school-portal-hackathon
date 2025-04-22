import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Search,
  Send,
  Paperclip,
  Plus,
  User,
  Clock,
  CheckCheck,
  MessageCircle,
  ArrowLeft,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

const Messages = () => {
  const [activeTab, setActiveTab] = useState("inbox");
  const [selectedChat, setSelectedChat] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const isMobile = useIsMobile();

  // Handle mobile view when a chat is selected
  useEffect(() => {
    if (selectedChat && isMobile) {
      setShowMobileChat(true);
    }
  }, [selectedChat, isMobile]);

  // Handle back button on mobile
  const handleBackToList = () => {
    setShowMobileChat(false);
  };

  // Sample messages data
  const conversations = [
    {
      id: 1,
      sender: "Professor Smith",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ProfSmith",
      lastMessage:
        "I've reviewed your assignment draft. There are some points I'd like to discuss.",
      time: "10:30 AM",
      unread: true,
      status: "teacher",
      messages: [
        {
          id: 101,
          sender: "Professor Smith",
          content: "Hello Jane, have you started working on your term paper?",
          time: "2 days ago",
          isMe: false,
        },
        {
          id: 102,
          sender: "Me",
          content:
            "Yes, Professor. I've begun researching and have drafted an outline.",
          time: "Yesterday",
          isMe: true,
        },
        {
          id: 103,
          sender: "Professor Smith",
          content:
            "I've reviewed your assignment draft. There are some points I'd like to discuss.",
          time: "10:30 AM",
          isMe: false,
        },
      ],
    },
    {
      id: 2,
      sender: "Study Group",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=StudyGroup",
      lastMessage: "Can everyone meet today at 5pm to discuss the project?",
      time: "Yesterday",
      unread: false,
      status: "group",
      messages: [
        {
          id: 201,
          sender: "Alex",
          content: "Has everyone finished the reading for tomorrow?",
          time: "3 days ago",
          isMe: false,
        },
        {
          id: 202,
          sender: "Sarah",
          content: "I'm almost done with mine.",
          time: "3 days ago",
          isMe: false,
        },
        {
          id: 203,
          sender: "Me",
          content: "I'll finish it tonight.",
          time: "2 days ago",
          isMe: true,
        },
        {
          id: 204,
          sender: "Alex",
          content: "Can everyone meet today at 5pm to discuss the project?",
          time: "Yesterday",
          isMe: false,
        },
      ],
    },
    {
      id: 3,
      sender: "Academic Advisor",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Advisor",
      lastMessage: "Your registration for next semester has been approved.",
      time: "3 days ago",
      unread: false,
      status: "admin",
      messages: [
        {
          id: 301,
          sender: "Academic Advisor",
          content:
            "Hello Jane, I wanted to discuss your course selection for next semester.",
          time: "5 days ago",
          isMe: false,
        },
        {
          id: 302,
          sender: "Me",
          content:
            "Thank you. I've selected the courses we discussed previously.",
          time: "4 days ago",
          isMe: true,
        },
        {
          id: 303,
          sender: "Academic Advisor",
          content: "Your registration for next semester has been approved.",
          time: "3 days ago",
          isMe: false,
        },
      ],
    },
    {
      id: 4,
      sender: "Financial Aid Office",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=FinAid",
      lastMessage: "Your scholarship has been renewed for the upcoming year.",
      time: "1 week ago",
      unread: false,
      status: "admin",
      messages: [
        {
          id: 401,
          sender: "Financial Aid Office",
          content: "Your scholarship has been renewed for the upcoming year.",
          time: "1 week ago",
          isMe: false,
        },
      ],
    },
    {
      id: 5,
      sender: "Library",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Library",
      lastMessage: "This is a reminder that you have books due this Friday.",
      time: "1 week ago",
      unread: false,
      status: "admin",
      messages: [
        {
          id: 501,
          sender: "Library",
          content: "This is a reminder that you have books due this Friday.",
          time: "1 week ago",
          isMe: false,
        },
      ],
    },
  ];

  // Filter conversations by search term
  const filteredConversations = conversations.filter(
    (convo) =>
      convo.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      convo.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Function to get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "teacher":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "admin":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "group":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  // Function to get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case "teacher":
        return "Teacher";
      case "admin":
        return "Admin";
      case "group":
        return "Group";
      default:
        return "Student";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 md:space-y-6 overflow-y-auto">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Messages</h1>
          <p className="text-muted-foreground">
            Communicate with instructors, classmates, and staff
          </p>
        </div>

        <div className="grid h-[calc(100vh-12rem)] md:h-[calc(100vh-12rem)]">
          {/* Responsive layout with conditional display */}
          <div
            className={`grid ${
              isMobile ? "grid-cols-1" : "lg:grid-cols-[320px_1fr]"
            } gap-4 h-full`}
          >
            {/* Left sidebar with conversation list - hide on mobile when chat is shown */}
            <div
              className={`flex flex-col border rounded-md overflow-hidden ${
                isMobile && showMobileChat ? "hidden" : "flex"
              }`}
            >
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <Tabs defaultValue="inbox" onValueChange={setActiveTab}>
                <div className="px-3 pt-3">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="inbox">Inbox</TabsTrigger>
                    <TabsTrigger value="archived">Archived</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="inbox" className="flex-1 overflow-hidden">
                  <ScrollArea className="h-[calc(100vh-20rem)]">
                    <div className="divide-y">
                      {filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`flex gap-3 p-3 transition-colors hover:bg-secondary/50 cursor-pointer ${
                            selectedChat?.id === conversation.id
                              ? "bg-secondary"
                              : ""
                          } ${conversation.unread ? "font-medium" : ""}`}
                          onClick={() => setSelectedChat(conversation)}
                        >
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
                              <img
                                src={conversation.avatar}
                                alt={conversation.sender}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            {conversation.unread && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between">
                              <div className="font-medium truncate">
                                {conversation.sender}
                              </div>
                              <div className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                {conversation.time}
                              </div>
                            </div>
                            <div className="flex items-center mt-1">
                              <div className="text-sm text-muted-foreground truncate">
                                {conversation.lastMessage}
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <div
                                className={`px-1.5 py-0.5 text-xs rounded-full ${getStatusBadge(
                                  conversation.status
                                )}`}
                              >
                                {getStatusLabel(conversation.status)}
                              </div>
                              {!conversation.unread && (
                                <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {filteredConversations.length === 0 && (
                        <div className="p-8 text-center">
                          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                          <h3 className="mt-4 text-lg font-medium">
                            No messages found
                          </h3>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Try a different search term or start a new
                            conversation
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent
                  value="archived"
                  className="flex-1 overflow-hidden"
                >
                  <ScrollArea className="h-[calc(100vh-20rem)]">
                    <div className="p-8 text-center">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                      <h3 className="mt-4 text-lg font-medium">
                        No archived messages
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Messages you archive will appear here
                      </p>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>

              <div className="mt-auto p-3 border-t">
                <Button className="w-full gap-2" variant="outline">
                  <Plus className="h-4 w-4" />
                  <span>New Message</span>
                </Button>
              </div>
            </div>

            {/* Right side chat view - show on mobile only when chat is selected */}
            <Card
              className={`flex flex-col h-full ${
                isMobile && !showMobileChat ? "hidden" : "flex"
              }`}
            >
              {selectedChat ? (
                <>
                  <CardHeader className="flex flex-row items-center border-b p-4">
                    {isMobile && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mr-2"
                        onClick={handleBackToList}
                      >
                        <ArrowLeft className="h-5 w-5" />
                      </Button>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary overflow-hidden">
                        <img
                          src={selectedChat.avatar}
                          alt={selectedChat.sender}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {selectedChat.sender}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          <span
                            className={`px-1.5 py-0.5 text-xs rounded-full ${getStatusBadge(
                              selectedChat.status
                            )}`}
                          >
                            {getStatusLabel(selectedChat.status)}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <ScrollArea className="flex-1">
                    <div className="p-4 flex flex-col gap-4">
                      {selectedChat.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.isMe ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-2 ${
                              message.isMe
                                ? "bg-primary text-primary-foreground"
                                : "bg-secondary"
                            }`}
                          >
                            {!message.isMe && (
                              <div className="font-medium text-xs mb-1">
                                {message.sender}
                              </div>
                            )}
                            <div className="text-sm">{message.content}</div>
                            <div className="text-xs mt-1 opacity-70 flex items-center justify-end gap-1">
                              <Clock className="h-3 w-3" />
                              {message.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Button size="icon" variant="outline">
                        <Paperclip className="h-4 w-4" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        className="flex-1"
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          alert("Message would be sent here")
                        }
                      />
                      <Button size="icon">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <MessageCircle className="h-16 w-16 text-muted-foreground opacity-20" />
                  <h3 className="mt-4 text-lg font-medium">
                    No conversation selected
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground text-center">
                    Select a conversation from the sidebar or start a new one
                  </p>
                  <Button className="mt-4 gap-2" variant="outline">
                    <Plus className="h-4 w-4" />
                    <span>New Message</span>
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
