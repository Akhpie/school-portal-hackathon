import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRewards } from "@/contexts/RewardsContext";
import RewardsDisplay from "@/components/RewardsDisplay";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trophy,
  Gift,
  CreditCard,
  ExternalLink,
  ArrowRight,
  Calculator,
  ArrowLeftRight,
  Check,
  Medal,
  ShoppingBag,
  Coffee,
  Music,
  Zap,
  TrendingUp,
  TicketIcon,
  RefreshCw,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Progress } from "@/components/ui/progress";

const CONVERSION_RATE = 0.5;

// Available redemption options
const redeemOptions = [
  {
    id: "canteen_voucher",
    name: "Canteen Voucher",
    description: "Get a voucher for the school canteen",
    pointsCost: 100,
    icon: <Coffee className="h-5 w-5 text-amber-500" />,
    badgeText: "Most Popular",
  },
  {
    id: "music_subscription",
    name: "1-Month Music Subscription",
    description: "One month of premium music streaming",
    pointsCost: 200,
    icon: <Music className="h-5 w-5 text-green-500" />,
  },
  {
    id: "movie_ticket",
    name: "Movie Ticket",
    description: "One ticket to any movie at partner theaters",
    pointsCost: 300,
    icon: <TicketIcon className="h-5 w-5 text-blue-500" />,
  },
  {
    id: "shopping_voucher",
    name: "Shopping Discount",
    description: "15% off at partner online stores",
    pointsCost: 500,
    icon: <ShoppingBag className="h-5 w-5 text-purple-500" />,
  },
  {
    id: "test_retake",
    name: "Test Retake Pass",
    description: "Retake any one test for better scores",
    pointsCost: 800,
    icon: <TrendingUp className="h-5 w-5 text-red-500" />,
    badgeText: "Academic",
  },
  {
    id: "power_boost",
    name: "Power Boost",
    description: "Double points earned in games for 1 week",
    pointsCost: 1000,
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    badgeText: "Special",
  },
];

const Rewards = () => {
  const { rewards, totalPoints, addPoints, resetPoints } = useRewards();
  const [redeemHistory, setRedeemHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("redeem");
  const [convertAmount, setConvertAmount] = useState<number>(100);
  const [confirmRedeemItem, setConfirmRedeemItem] = useState<any>(null);
  const [conversionDialogOpen, setConversionDialogOpen] = useState(false);

  // Load redemption history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem("redeemHistory");
    console.log("Loaded history from localStorage:", savedHistory);
    if (savedHistory) {
      setRedeemHistory(JSON.parse(savedHistory));
    } else {
      // Create a test history item for debugging
      const testHistory = [
        {
          id: `test-item-${Date.now()}`,
          item: {
            name: "Test Reward",
            description: "This is a test reward item for debugging",
            pointsCost: 100,
            iconName: "gift", // Use name instead of React element
          },
          redeemedAt: new Date(),
          status: "completed",
        },
      ];
      saveRedeemHistory(testHistory);
    }
  }, []);

  // Save redemption history to localStorage
  const saveRedeemHistory = (history: any[]) => {
    console.log("Saving history to localStorage:", history);
    localStorage.setItem("redeemHistory", JSON.stringify(history));
    setRedeemHistory(history);
  };

  const handleRedeem = (item: any) => {
    if (totalPoints >= item.pointsCost) {
      const itemForStorage = {
        ...item,
        iconName: item.id,
      };
      delete itemForStorage.icon;

      const newHistory = [
        {
          id: `${item.id}-${Date.now()}`,
          item: itemForStorage,
          redeemedAt: new Date(),
          status: "processing",
        },
        ...redeemHistory,
      ];

      saveRedeemHistory(newHistory);
      addPoints(-item.pointsCost);

      toast.success(`Successfully redeemed ${item.name}!`, {
        description: "Check your redemption history for details",
      });

      setConfirmRedeemItem(null);
    } else {
      toast.error("Not enough points to redeem this item!", {
        description: `You need ${item.pointsCost - totalPoints} more points`,
      });
    }
  };

  const handleConversion = () => {
    if (totalPoints >= convertAmount) {
      addPoints(-convertAmount);

      const newHistory = [
        {
          id: `currency-${Date.now()}`,
          item: {
            name: "Currency Conversion",
            description: `Converted ${convertAmount} points to ₹${(
              convertAmount * CONVERSION_RATE
            ).toFixed(2)}`,
            pointsCost: convertAmount,
            iconName: "ArrowLeftRight",
          },
          redeemedAt: new Date(),
          status: "completed",
          convertedAmount: convertAmount * CONVERSION_RATE,
        },
        ...redeemHistory,
      ];

      saveRedeemHistory(newHistory);

      toast.success(
        `Successfully converted ${convertAmount} points to ₹${(
          convertAmount * CONVERSION_RATE
        ).toFixed(2)}!`,
        {
          description: "Your digital wallet has been credited",
        }
      );

      setConversionDialogOpen(false);
    } else {
      toast.error("Not enough points for conversion!", {
        description: `You need ${convertAmount - totalPoints} more points`,
      });
    }
  };

  const handleResetPoints = () => {
    if (
      window.confirm(
        "Are you sure you want to reset your points? This cannot be undone."
      )
    ) {
      resetPoints();
      toast.success("Points reset successfully");
    }
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "canteen_voucher":
        return <Coffee className="h-5 w-5 text-amber-500" />;
      case "music_subscription":
        return <Music className="h-5 w-5 text-green-500" />;
      case "movie_ticket":
        return <TicketIcon className="h-5 w-5 text-blue-500" />;
      case "shopping_voucher":
        return <ShoppingBag className="h-5 w-5 text-purple-500" />;
      case "test_retake":
        return <TrendingUp className="h-5 w-5 text-red-500" />;
      case "power_boost":
        return <Zap className="h-5 w-5 text-yellow-500" />;
      case "ArrowLeftRight":
        return <ArrowLeftRight className="h-5 w-5 text-green-500" />;
      case "gift":
        return <Gift className="h-5 w-5 text-primary" />;
      default:
        return <Gift className="h-5 w-5 text-primary" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Rewards Center</h1>
            <p className="text-muted-foreground">
              Redeem your earned points for exciting rewards
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="px-3 py-2 bg-primary/10 text-primary border-primary/20 text-sm">
              <Medal className="h-4 w-4 mr-1" /> Level{" "}
              {Math.floor(totalPoints / 500) + 1}
            </Badge>
            <div className="flex flex-col">
              <Card className="bg-gradient-to-r from-primary/20 to-primary/5 border-none shadow-sm">
                <CardContent className="p-4 flex gap-2 items-center">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Points
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold">
                        {isNaN(totalPoints) ? 0 : totalPoints}
                      </p>
                      {isNaN(totalPoints) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetPoints}
                          className="h-7 px-2 text-xs"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Fix
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-sm bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
          <CardContent className="py-4">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span>Progress to Level {Math.floor(totalPoints / 500) + 2}</span>
              <span className="text-primary">{totalPoints % 500} / 500</span>
            </div>
            <Progress
              value={(totalPoints % 500) / 5}
              className="h-2 bg-gray-100"
            />
            <p className="text-xs text-muted-foreground mt-2 text-right">
              {500 - (totalPoints % 500)} points until next level
            </p>
          </CardContent>
        </Card>

        <Tabs
          defaultValue="redeem"
          value={activeTab}
          onValueChange={(value) => {
            console.log("Tab changed to:", value);
            setActiveTab(value);
          }}
          className="w-full"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="redeem" className="gap-2">
              <Gift className="h-4 w-4" />
              <span>Redeem</span>
            </TabsTrigger>
            <TabsTrigger value="convert" className="gap-2">
              <ArrowLeftRight className="h-4 w-4" />
              <span>Convert</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="redeem" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {redeemOptions.map((option) => (
                <Card
                  key={option.id}
                  className="overflow-hidden hover:shadow-md transition-all"
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {option.icon}
                        </div>
                        <CardTitle className="text-lg">{option.name}</CardTitle>
                      </div>
                      {option.badgeText && (
                        <Badge variant="secondary" className="ml-auto">
                          {option.badgeText}
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-2">
                      {option.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex items-center mt-2 text-sm text-muted-foreground">
                      <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                      <span>{option.pointsCost} points required</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Button
                      variant={
                        totalPoints >= option.pointsCost ? "default" : "outline"
                      }
                      className={
                        totalPoints >= option.pointsCost
                          ? ""
                          : "text-muted-foreground"
                      }
                      onClick={() => setConfirmRedeemItem(option)}
                    >
                      Redeem
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    {totalPoints < option.pointsCost && (
                      <div className="text-xs text-muted-foreground">
                        Need {option.pointsCost - totalPoints} more
                      </div>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="convert" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  <span>Currency Converter</span>
                </CardTitle>
                <CardDescription>
                  Convert your compass points to INR at a rate of{" "}
                  {CONVERSION_RATE} ₹ per point
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground mb-1">
                      Conversion Rate
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <div className="px-3 py-2 bg-primary/10 rounded-md text-primary font-medium">
                        1 point
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="px-3 py-2 bg-green-100 dark:bg-green-900/20 rounded-md text-green-700 dark:text-green-300 font-medium">
                        {CONVERSION_RATE} ₹
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="convertPoints">Points to Convert</Label>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Input
                          id="convertPoints"
                          type="number"
                          value={convertAmount}
                          onChange={(e) =>
                            setConvertAmount(Number(e.target.value))
                          }
                          min={1}
                          max={totalPoints}
                        />
                        <Button
                          variant="secondary"
                          onClick={() => setConvertAmount(totalPoints)}
                          className="whitespace-nowrap"
                        >
                          Max
                        </Button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Slider
                        value={[convertAmount]}
                        min={1}
                        max={totalPoints || 1000}
                        step={1}
                        onValueChange={(value) => setConvertAmount(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1</span>
                        <span>{totalPoints || 1000}</span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Label>You Will Receive</Label>
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mt-1.5">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          ₹ {(convertAmount * CONVERSION_RATE).toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Will be credited to your digital wallet
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => setConversionDialogOpen(true)}
                    disabled={totalPoints < 1 || convertAmount < 1}
                  >
                    Convert Points
                    <ArrowLeftRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Digital Wallet</CardTitle>
                <CardDescription>Track your converted currency</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Current Balance
                    </p>
                    <p className="text-2xl font-bold">
                      ₹{" "}
                      {redeemHistory
                        .filter((h) => h.item.name === "Currency Conversion")
                        .reduce(
                          (sum, item) => sum + (item.convertedAmount || 0),
                          0
                        )
                        .toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="gap-1"
                    onClick={() => window.open("#", "_blank")}
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>Manage</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Redemption History</span>
                </CardTitle>
                <CardDescription>
                  Track your redeemed rewards and conversions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {redeemHistory.length > 0 ? (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-3">
                      {redeemHistory.map((historyItem) => (
                        <div
                          key={historyItem.id}
                          className="flex gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            {renderIcon(historyItem.item.iconName)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div className="font-medium">
                                {historyItem.item.name}
                              </div>
                              <Badge
                                variant={
                                  historyItem.status === "completed"
                                    ? "outline"
                                    : "secondary"
                                }
                                className={
                                  historyItem.status === "completed"
                                    ? "text-green-600 border-green-200 bg-green-50 dark:bg-green-900/20"
                                    : ""
                                }
                              >
                                {historyItem.status === "completed" ? (
                                  <span className="flex items-center">
                                    <Check className="mr-1 h-3 w-3" />
                                    Completed
                                  </span>
                                ) : (
                                  "Processing"
                                )}
                              </Badge>
                            </div>
                            <div className="text-sm text-muted-foreground mt-0.5">
                              {historyItem.item.description}
                            </div>
                            <div className="flex justify-between items-center mt-1.5">
                              <div className="text-xs text-muted-foreground">
                                {new Date(
                                  historyItem.redeemedAt
                                ).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                              <div className="text-xs font-medium flex items-center">
                                <Trophy className="h-3 w-3 mr-1 text-yellow-500" />
                                <span>
                                  {historyItem.item.pointsCost} points
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-16 px-4">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                      <CreditCard className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      No Redemption History
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      You haven't redeemed any rewards yet. Start by redeeming
                      rewards or converting points to see your history here.
                    </p>
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => setActiveTab("redeem")}
                    >
                      <Gift className="h-4 w-4" />
                      <span>Browse Rewards</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog
          open={!!confirmRedeemItem}
          onOpenChange={() => setConfirmRedeemItem(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Redemption</DialogTitle>
              <DialogDescription>
                You are about to redeem the following reward. This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>
            {confirmRedeemItem && (
              <div className="py-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {renderIcon(confirmRedeemItem.id)}
                  </div>
                  <div>
                    <div className="font-medium text-lg">
                      {confirmRedeemItem.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {confirmRedeemItem.description}
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Cost:</span>
                    <span className="font-medium flex items-center">
                      <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                      {confirmRedeemItem.pointsCost} points
                    </span>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm text-muted-foreground">
                      Balance after redemption:
                    </span>
                    <span className="font-medium">
                      {totalPoints - confirmRedeemItem.pointsCost} points
                    </span>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setConfirmRedeemItem(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  handleRedeem(confirmRedeemItem);
                }}
              >
                Confirm Redemption
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Conversion Dialog */}
        <Dialog
          open={conversionDialogOpen}
          onOpenChange={setConversionDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Conversion</DialogTitle>
              <DialogDescription>
                You are about to convert points to INR. This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Points to convert:
                  </span>
                  <span className="font-medium flex items-center">
                    <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                    {convertAmount} points
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    Conversion rate:
                  </span>
                  <span className="font-medium">
                    1 point = ₹ {CONVERSION_RATE.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">
                    You will receive:
                  </span>
                  <span className="font-medium text-green-600">
                    ₹ {(convertAmount * CONVERSION_RATE).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Balance after conversion:
                  </span>
                  <span className="font-medium">
                    {totalPoints - convertAmount} points
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                The converted amount will be added to your digital wallet
                immediately. You can transfer it to your bank account from the
                wallet management page.
              </p>
            </div>
            <DialogFooter className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setConversionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConversion}
                className="bg-green-600 hover:bg-green-700"
              >
                Convert to ₹ {(convertAmount * CONVERSION_RATE).toFixed(2)}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Rewards;
