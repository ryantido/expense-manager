import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
} from "lucide-react-native";
import { useUser } from "@clerk/clerk-expo";
import { UserMenu } from "@/components/user-menu";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser()

  // Mock data for demonstration
  const [currentBalance] = useState(3450.75);
  const [monthlyIncome] = useState(5000);
  const [monthlyExpenses] = useState(1549.25);
  const [financialHealthScore] = useState(78); // Good: 71-100

  // Recent transactions
  const recentTransactions = [
    {
      id: "1",
      title: "Grocery Shopping",
      category: "Food",
      amount: -85.5,
      date: "Today",
      type: "expense",
    },
    {
      id: "2",
      title: "Salary",
      category: "Income",
      amount: 5000,
      date: "Yesterday",
      type: "income",
    },
    {
      id: "3",
      title: "Restaurant",
      category: "Food",
      amount: -45.0,
      date: "Yesterday",
      type: "expense",
    },
    {
      id: "4",
      title: "Electric Bill",
      category: "Utilities",
      amount: -120.0,
      date: "2 days ago",
      type: "expense",
    },
  ];

  // Budget suggestions based on last month
  const budgetSuggestions = [
    { category: "Food", suggested: 400, current: 320, status: "good" },
    { category: "Transport", suggested: 200, current: 180, status: "good" },
    {
      category: "Entertainment",
      suggested: 150,
      current: 195,
      status: "warning",
    },
  ];

  // Financial health score color and label
  const getHealthScoreColor = (score: number) => {
    if (score >= 71)
      return { color: "#10B981", label: "Good", bg: "rgba(16, 185, 129, 0.1)" };
    if (score >= 41)
      return { color: "#F59E0B", label: "Fair", bg: "rgba(245, 158, 11, 0.1)" };
    return { color: "#EF4444", label: "Poor", bg: "rgba(239, 68, 68, 0.1)" };
  };

  const healthStatus = getHealthScoreColor(financialHealthScore);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <View>
            <Text className="text-muted-foreground text-sm">Welcome back, {user?.firstName}</Text>
            <Text className="text-2xl font-bold text-foreground mt-1">
              Your Finances
            </Text>
          </View>
          <UserMenu />
        </View>

        {/* Balance Card */}
        <View className="px-6 mb-6">
          <View className="bg-primary rounded-2xl p-6">
            <View className="flex-row items-center mb-2">
              <Wallet color="rgba(255, 255, 255, 0.8)" size={20} />
              <Text className="text-primary-foreground/80 text-sm ml-2">
                Current Balance
              </Text>
            </View>
            <Text className="text-primary-foreground text-4xl font-bold">
              ${currentBalance.toFixed(2)}
            </Text>
            <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-primary-foreground/20">
              <View className="flex-1">
                <Text className="text-primary-foreground/70 text-xs mb-1">
                  Income
                </Text>
                <Text className="text-primary-foreground text-lg font-semibold">
                  ${monthlyIncome.toFixed(0)}
                </Text>
              </View>
              <View className="w-px h-8 bg-primary-foreground/20" />
              <View className="flex-1 items-end">
                <Text className="text-primary-foreground/70 text-xs mb-1">
                  Expenses
                </Text>
                <Text className="text-primary-foreground text-lg font-semibold">
                  ${monthlyExpenses.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Financial Health Score */}
        <View className="px-6 mb-6">
          <View className="bg-card rounded-2xl p-5 border border-border">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-foreground text-lg font-semibold">
                Financial Health Score
              </Text>
              <View
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: healthStatus.bg }}
              >
                <Text
                  style={{ color: healthStatus.color }}
                  className="text-sm font-semibold"
                >
                  {healthStatus.label}
                </Text>
              </View>
            </View>

            <View className="flex-row items-end mb-2">
              <Text className="text-foreground text-5xl font-bold">
                {financialHealthScore}
              </Text>
              <Text className="text-muted-foreground text-2xl mb-2 ml-1">
                /100
              </Text>
            </View>

            {/* Progress bar */}
            <View className="h-3 bg-muted rounded-full overflow-hidden">
              <View
                className="h-full rounded-full"
                style={{
                  width: `${financialHealthScore}%`,
                  backgroundColor: healthStatus.color,
                }}
              />
            </View>

            <View className="flex-row items-start mt-4 bg-muted/50 rounded-lg p-3">
              <AlertCircle color="#6B7280" size={16} style={{ marginTop: 2 }} />
              <Text className="text-muted-foreground text-xs ml-2 flex-1">
                Based on spending vs income, budget adherence, and savings
                consistency
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => router.push("/add-transaction")}
              className="flex-1 bg-card border border-border rounded-xl p-4 items-center"
            >
              <View className="w-12 h-12 bg-green-500/10 rounded-full items-center justify-center mb-2">
                <ArrowDownRight color="#10B981" size={24} />
              </View>
              <Text className="text-foreground font-semibold">Add Income</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/add-transaction")}
              className="flex-1 bg-card border border-border rounded-xl p-4 items-center"
            >
              <View className="w-12 h-12 bg-red-500/10 rounded-full items-center justify-center mb-2">
                <ArrowUpRight color="#EF4444" size={24} />
              </View>
              <Text className="text-foreground font-semibold">Add Expense</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Smart Budget Suggestions */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground text-lg font-semibold">
              Smart Budget Suggestions
            </Text>
            <TouchableOpacity onPress={() => router.push("/budgets")}>
              <Text className="text-primary text-sm font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {budgetSuggestions.map((suggestion, index) => (
              <View
                key={index}
                className="bg-card border border-border rounded-xl p-4"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <View>
                    <Text className="text-foreground font-semibold">
                      {suggestion.category}
                    </Text>
                    <Text className="text-muted-foreground text-xs mt-1">
                      Current: ${suggestion.current} / Suggested: $
                      {suggestion.suggested}
                    </Text>
                  </View>
                  {suggestion.status === "good" ? (
                    <View className="bg-green-500/10 px-3 py-1 rounded-full">
                      <Text className="text-green-600 text-xs font-medium">
                        On Track
                      </Text>
                    </View>
                  ) : (
                    <View className="bg-orange-500/10 px-3 py-1 rounded-full">
                      <Text className="text-orange-600 text-xs font-medium">
                        Over Budget
                      </Text>
                    </View>
                  )}
                </View>

                {/* Progress bar */}
                <View className="h-2 bg-muted rounded-full overflow-hidden">
                  <View
                    className={`h-full rounded-full ${
                      suggestion.status === "good"
                        ? "bg-green-500"
                        : "bg-orange-500"
                    }`}
                    style={{
                      width: `${(suggestion.current / suggestion.suggested) * 100}%`,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Transactions */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-foreground text-lg font-semibold">
              Recent Transactions
            </Text>
            <TouchableOpacity onPress={() => router.push("/transactions")}>
              <Text className="text-primary text-sm font-medium">See All</Text>
            </TouchableOpacity>
          </View>

          <View className="gap-2">
            {recentTransactions.map((transaction) => (
              <View
                key={transaction.id}
                className="bg-card border border-border rounded-xl p-4 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1">
                  <View
                    className={`w-10 h-10 rounded-full items-center justify-center ${
                      transaction.type === "income"
                        ? "bg-green-500/10"
                        : "bg-red-500/10"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <TrendingUp color="#10B981" size={20} />
                    ) : (
                      <TrendingDown color="#EF4444" size={20} />
                    )}
                  </View>
                  <View className="ml-3 flex-1">
                    <Text className="text-foreground font-semibold">
                      {transaction.title}
                    </Text>
                    <Text className="text-muted-foreground text-xs mt-1">
                      {transaction.category} • {transaction.date}
                    </Text>
                  </View>
                </View>
                <Text
                  className={`font-bold text-base ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "income" ? "+" : ""}$
                  {Math.abs(transaction.amount).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Insights Card */}
        <View className="px-6 mb-6">
          <View className="bg-accent/50 rounded-2xl p-5 border border-border">
            <View className="flex-row items-center mb-3">
              <PieChart color="#3B82F6" size={24} />
              <Text className="text-foreground text-lg font-semibold ml-2">
                Monthly Insights
              </Text>
            </View>
            <Text className="text-muted-foreground text-sm leading-5">
              You're spending 31% of your income this month. Great job! You're
              saving more than the recommended 20%. Keep it up!
            </Text>
            <TouchableOpacity className="mt-4 bg-primary rounded-lg py-3 items-center">
              <Text className="text-primary-foreground font-semibold">
                View Detailed Report
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <View className="absolute bottom-24 right-6">
        <TouchableOpacity
          onPress={() => router.push("/add-transaction")}
          className="w-16 h-16 bg-primary rounded-full items-center justify-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Plus className="text-background" size={28} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
