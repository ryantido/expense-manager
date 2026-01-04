import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowLeft,
  TrendingUp,
  Target,
  CheckCircle2,
  Edit3,
  Plus,
  AlertCircle,
  DollarSign,
  X,
  Sparkles,
} from "lucide-react-native";

type BudgetStatus = "good" | "warning" | "danger" | "excellent";

interface Budget {
  id: string;
  category: string;
  emoji: string;
  suggested: number;
  current: number;
  spent: number;
  status: BudgetStatus;
  lastMonthSpent: number;
  isSuggestion?: boolean;
}

export default function BudgetsScreen() {
  const router = useRouter();

  // Mock data - Active budgets
  const [activeBudgets, setActiveBudgets] = useState<Budget[]>([
    {
      id: "1",
      category: "Food & Dining",
      emoji: "🍔",
      suggested: 400,
      current: 400,
      spent: 320,
      status: "good",
      lastMonthSpent: 385,
    },
    {
      id: "2",
      category: "Transportation",
      emoji: "🚗",
      suggested: 200,
      current: 200,
      spent: 180,
      status: "excellent",
      lastMonthSpent: 195,
    },
    {
      id: "3",
      category: "Entertainment",
      emoji: "🎮",
      suggested: 150,
      current: 150,
      spent: 195,
      status: "danger",
      lastMonthSpent: 140,
    },
    {
      id: "4",
      category: "Shopping",
      emoji: "🛍️",
      suggested: 300,
      current: 300,
      spent: 280,
      status: "warning",
      lastMonthSpent: 310,
    },
    {
      id: "5",
      category: "Utilities",
      emoji: "💡",
      suggested: 150,
      current: 150,
      spent: 120,
      status: "good",
      lastMonthSpent: 145,
    },
  ]);

  // Mock data - Smart suggestions (not yet accepted)
  const [suggestions, setSuggestions] = useState<Budget[]>([
    {
      id: "s1",
      category: "Healthcare",
      emoji: "🏥",
      suggested: 200,
      current: 0,
      spent: 0,
      status: "good",
      lastMonthSpent: 195,
      isSuggestion: true,
    },
    {
      id: "s2",
      category: "Education",
      emoji: "📚",
      suggested: 100,
      current: 0,
      spent: 0,
      status: "good",
      lastMonthSpent: 95,
      isSuggestion: true,
    },
  ]);

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [editAmount, setEditAmount] = useState("");

  // Calculate totals
  const totalBudget = activeBudgets.reduce((sum, b) => sum + b.current, 0);
  const totalSpent = activeBudgets.reduce((sum, b) => sum + b.spent, 0);
  const remaining = totalBudget - totalSpent;
  const overallProgress = (totalSpent / totalBudget) * 100;

  const getStatusColor = (status: BudgetStatus) => {
    switch (status) {
      case "excellent":
        return {
          color: "#10B981",
          bg: "rgba(16, 185, 129, 0.1)",
          label: "Excellent",
        };
      case "good":
        return { color: "#3B82F6", bg: "rgba(59, 130, 246, 0.1)", label: "Good" };
      case "warning":
        return {
          color: "#F59E0B",
          bg: "rgba(245, 158, 11, 0.1)",
          label: "Warning",
        };
      case "danger":
        return { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", label: "Over" };
    }
  };

  const getBudgetStatus = (spent: number, budget: number): BudgetStatus => {
    const percentage = (spent / budget) * 100;
    if (percentage > 100) return "danger";
    if (percentage > 90) return "warning";
    if (percentage < 70) return "excellent";
    return "good";
  };

  const handleAcceptSuggestion = (suggestion: Budget) => {
    // Move suggestion to active budgets
    const newBudget: Budget = {
      ...suggestion,
      current: suggestion.suggested,
      isSuggestion: false,
    };
    setActiveBudgets([...activeBudgets, newBudget]);
    setSuggestions(suggestions.filter((s) => s.id !== suggestion.id));
    Alert.alert(
      "Budget Added",
      `${suggestion.category} budget of $${suggestion.suggested} has been added.`
    );
  };

  const handleEditSuggestion = (suggestion: Budget) => {
    setSelectedBudget(suggestion);
    setEditAmount(suggestion.suggested.toString());
    setEditModalVisible(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setSelectedBudget(budget);
    setEditAmount(budget.current.toString());
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!selectedBudget || !editAmount) return;

    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid budget amount.");
      return;
    }

    if (selectedBudget.isSuggestion) {
      // Accept suggestion with edited amount
      const newBudget: Budget = {
        ...selectedBudget,
        current: amount,
        suggested: amount,
        isSuggestion: false,
      };
      setActiveBudgets([...activeBudgets, newBudget]);
      setSuggestions(suggestions.filter((s) => s.id !== selectedBudget.id));
      Alert.alert(
        "Budget Added",
        `${selectedBudget.category} budget of $${amount} has been added.`
      );
    } else {
      // Update existing budget
      setActiveBudgets(
        activeBudgets.map((b) =>
          b.id === selectedBudget.id
            ? { ...b, current: amount, status: getBudgetStatus(b.spent, amount) }
            : b
        )
      );
      Alert.alert(
        "Budget Updated",
        `${selectedBudget.category} budget updated to $${amount}.`
      );
    }

    setEditModalVisible(false);
    setSelectedBudget(null);
    setEditAmount("");
  };

  const handleDismissSuggestion = (suggestion: Budget) => {
    Alert.alert(
      "Dismiss Suggestion",
      `Are you sure you want to dismiss the ${suggestion.category} budget suggestion?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Dismiss",
          style: "destructive",
          onPress: () => {
            setSuggestions(suggestions.filter((s) => s.id !== suggestion.id));
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3 w-10 h-10 items-center justify-center"
            >
              <ArrowLeft color="#6B7280" size={24} />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground">
              Budget Management
            </Text>
          </View>
          <ThemeToggle />
        </View>

        {/* Overall Budget Summary */}
        <View className="px-6 mb-6">
          <View className="bg-primary rounded-2xl p-6">
            <View className="flex-row items-center mb-3">
              <Target color="rgba(255, 255, 255, 0.8)" size={20} />
              <Text className="text-primary-foreground/80 text-sm ml-2">
                Total Monthly Budget
              </Text>
            </View>
            <Text className="text-primary-foreground text-4xl font-bold mb-4">
              ${totalBudget.toFixed(0)}
            </Text>

            {/* Progress Bar */}
            <View className="mb-4">
              <View className="h-3 bg-primary-foreground/20 rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary-foreground rounded-full"
                  style={{ width: `${Math.min(overallProgress, 100)}%` }}
                />
              </View>
              <View className="flex-row justify-between mt-2">
                <Text className="text-primary-foreground/70 text-xs">
                  Spent: ${totalSpent.toFixed(0)}
                </Text>
                <Text className="text-primary-foreground/70 text-xs">
                  {overallProgress.toFixed(0)}%
                </Text>
              </View>
            </View>

            {/* Stats */}
            <View className="flex-row items-center justify-between pt-4 border-t border-primary-foreground/20">
              <View>
                <Text className="text-primary-foreground/70 text-xs mb-1">
                  Remaining
                </Text>
                <Text className="text-primary-foreground text-lg font-semibold">
                  ${remaining.toFixed(0)}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-primary-foreground/70 text-xs mb-1">
                  Categories
                </Text>
                <Text className="text-primary-foreground text-lg font-semibold">
                  {activeBudgets.length}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Smart Budget Suggestions */}
        {suggestions.length > 0 && (
          <View className="px-6 mb-6">
            <View className="flex-row items-center mb-3">
              <Sparkles color="#F59E0B" size={20} />
              <Text className="text-foreground text-lg font-semibold ml-2">
                Smart Budget Suggestions
              </Text>
            </View>
            <View className="bg-accent/30 rounded-xl p-3 mb-3 flex-row items-start">
              <AlertCircle color="#6B7280" size={16} style={{ marginTop: 2 }} />
              <Text className="text-muted-foreground text-xs ml-2 flex-1">
                Based on your spending patterns from last month, we recommend
                setting budgets for these categories
              </Text>
            </View>

            <View className="gap-3">
              {suggestions.map((suggestion) => (
                <View
                  key={suggestion.id}
                  className="bg-card border-2 border-orange-500/30 rounded-xl p-4"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center flex-1">
                      <Text className="text-3xl mr-3">{suggestion.emoji}</Text>
                      <View className="flex-1">
                        <Text className="text-foreground font-semibold text-base">
                          {suggestion.category}
                        </Text>
                        <Text className="text-muted-foreground text-xs mt-1">
                          Last month: ${suggestion.lastMonthSpent}
                        </Text>
                      </View>
                    </View>
                    <View className="bg-orange-500/10 px-3 py-1 rounded-full">
                      <Text className="text-orange-600 text-xs font-medium">
                        New
                      </Text>
                    </View>
                  </View>

                  <View className="bg-muted/50 rounded-lg p-3 mb-3">
                    <Text className="text-muted-foreground text-xs mb-1">
                      Suggested Budget
                    </Text>
                    <Text className="text-foreground text-2xl font-bold">
                      ${suggestion.suggested}
                      <Text className="text-muted-foreground text-sm font-normal">
                        /month
                      </Text>
                    </Text>
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleAcceptSuggestion(suggestion)}
                      className="flex-1 bg-primary rounded-lg py-3 flex-row items-center justify-center"
                    >
                      <CheckCircle2 color="#FFF" size={18} />
                      <Text className="text-primary-foreground font-semibold ml-2">
                        Accept
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleEditSuggestion(suggestion)}
                      className="flex-1 bg-card border border-border rounded-lg py-3 flex-row items-center justify-center"
                    >
                      <Edit3 color="#6B7280" size={18} />
                      <Text className="text-foreground font-semibold ml-2">
                        Edit
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDismissSuggestion(suggestion)}
                      className="w-12 bg-card border border-border rounded-lg items-center justify-center"
                    >
                      <X color="#6B7280" size={20} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Active Budgets */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground text-lg font-semibold">
              Active Budgets
            </Text>
            <TouchableOpacity className="flex-row items-center">
              <Plus color="#3B82F6" size={18} />
              <Text className="text-primary text-sm font-medium ml-1">
                Add Custom
              </Text>
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {activeBudgets.map((budget) => {
              const statusInfo = getStatusColor(budget.status);
              const progress = (budget.spent / budget.current) * 100;

              return (
                <View
                  key={budget.id}
                  className="bg-card border border-border rounded-xl p-4"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <View className="flex-row items-center flex-1">
                      <Text className="text-3xl mr-3">{budget.emoji}</Text>
                      <View className="flex-1">
                        <Text className="text-foreground font-semibold text-base">
                          {budget.category}
                        </Text>
                        <Text className="text-muted-foreground text-xs mt-1">
                          ${budget.spent.toFixed(0)} of ${budget.current.toFixed(0)}
                        </Text>
                      </View>
                    </View>
                    <View
                      className="px-3 py-1 rounded-full"
                      style={{ backgroundColor: statusInfo.bg }}
                    >
                      <Text
                        style={{ color: statusInfo.color }}
                        className="text-xs font-medium"
                      >
                        {statusInfo.label}
                      </Text>
                    </View>
                  </View>

                  {/* Progress Bar */}
                  <View className="mb-3">
                    <View className="h-2.5 bg-muted rounded-full overflow-hidden">
                      <View
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: statusInfo.color,
                        }}
                      />
                    </View>
                    <View className="flex-row justify-between mt-1">
                      <Text className="text-muted-foreground text-xs">
                        {progress.toFixed(0)}% used
                      </Text>
                      <Text className="text-muted-foreground text-xs">
                        ${(budget.current - budget.spent).toFixed(0)} left
                      </Text>
                    </View>
                  </View>

                  {/* Comparison with last month */}
                  <View className="flex-row items-center justify-between bg-muted/30 rounded-lg p-2">
                    <View className="flex-row items-center">
                      <TrendingUp
                        color={
                          budget.spent < budget.lastMonthSpent
                            ? "#10B981"
                            : "#EF4444"
                        }
                        size={14}
                      />
                      <Text className="text-muted-foreground text-xs ml-1">
                        Last month: ${budget.lastMonthSpent}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleEditBudget(budget)}
                      className="flex-row items-center"
                    >
                      <Edit3 color="#6B7280" size={14} />
                      <Text className="text-muted-foreground text-xs ml-1 font-medium">
                        Edit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Tips Card */}
        <View className="px-6 mb-6">
          <View className="bg-accent/50 rounded-xl p-4 border border-border">
            <View className="flex-row items-center mb-2">
              <AlertCircle color="#3B82F6" size={18} />
              <Text className="text-foreground font-semibold ml-2">
                Budget Tips
              </Text>
            </View>
            <Text className="text-muted-foreground text-sm leading-5">
              • Review and adjust budgets monthly based on spending patterns{"\n"}
              • Set aside 20% of income for savings{"\n"}
              • Track daily to stay within budget limits{"\n"}
              • Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Edit Budget Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-card rounded-2xl p-6 w-full max-w-sm border border-border">
            <Text className="text-foreground text-xl font-bold mb-4">
              {selectedBudget?.isSuggestion ? "Set Budget" : "Edit Budget"}
            </Text>

            {selectedBudget && (
              <>
                <View className="flex-row items-center mb-4">
                  <Text className="text-3xl mr-3">{selectedBudget.emoji}</Text>
                  <Text className="text-foreground text-lg font-semibold">
                    {selectedBudget.category}
                  </Text>
                </View>

                <Text className="text-muted-foreground text-sm mb-2">
                  Monthly Budget Amount
                </Text>
                <View className="bg-muted rounded-lg p-4 flex-row items-center mb-4">
                  <DollarSign color="#6B7280" size={20} />
                  <TextInput
                    value={editAmount}
                    onChangeText={setEditAmount}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    placeholderTextColor="#9CA3AF"
                    className="text-foreground text-2xl font-bold ml-2 flex-1"
                  />
                </View>

                {selectedBudget.lastMonthSpent > 0 && (
                  <View className="bg-accent/30 rounded-lg p-3 mb-4">
                    <Text className="text-muted-foreground text-xs">
                      💡 Last month you spent ${selectedBudget.lastMonthSpent}{" "}
                      on {selectedBudget.category}
                    </Text>
                  </View>
                )}

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => {
                      setEditModalVisible(false);
                      setSelectedBudget(null);
                      setEditAmount("");
                    }}
                    className="flex-1 bg-muted rounded-lg py-3 items-center"
                  >
                    <Text className="text-foreground font-semibold">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveEdit}
                    className="flex-1 bg-primary rounded-lg py-3 items-center"
                  >
                    <Text className="text-primary-foreground font-semibold">
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}