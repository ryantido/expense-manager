import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Info, Lightbulb, Target, PiggyBank, Wallet } from 'lucide-react-native';
import { ThemeToggle } from '@/components/ThemeToggle';

const { width } = Dimensions.get('window');

export default function FinancialHealthScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState<'3M' | '6M' | '1Y'>('6M');

  // Mock current score data
  const currentScore = 78;
  const scoreStatus = currentScore >= 71 ? 'Good' : currentScore >= 41 ? 'Fair' : 'Poor';
  const scoreColor = currentScore >= 71 ? 'text-green-500' : currentScore >= 41 ? 'text-yellow-500' : 'text-red-500';
  const scoreBgColor = currentScore >= 71 ? 'bg-green-500' : currentScore >= 41 ? 'bg-yellow-500' : 'bg-red-500';

  // Score breakdown components
  const scoreBreakdown = [
    {
      id: 1,
      name: 'Spending vs Income',
      score: 85,
      weight: 40,
      contribution: 34,
      icon: Wallet,
      description: 'Your spending is 65% of your income',
      status: 'excellent',
      tip: 'Great job! You\'re keeping spending well below income.'
    },
    {
      id: 2,
      name: 'Budget Adherence',
      score: 72,
      weight: 30,
      contribution: 21.6,
      icon: Target,
      description: 'You\'re staying within budget 72% of the time',
      status: 'good',
      tip: 'Try to reduce overspending in Entertainment and Dining categories.'
    },
    {
      id: 3,
      name: 'Savings Consistency',
      score: 75,
      weight: 30,
      contribution: 22.5,
      icon: PiggyBank,
      description: 'You\'ve saved money in 3 out of 4 months',
      status: 'good',
      tip: 'Aim to save consistently every month, even small amounts.'
    }
  ];

  // Historical score data
  const historicalData = {
    '3M': [
      { month: 'Jan', score: 72 },
      { month: 'Feb', score: 75 },
      { month: 'Mar', score: 78 }
    ],
    '6M': [
      { month: 'Oct', score: 65 },
      { month: 'Nov', score: 68 },
      { month: 'Dec', score: 70 },
      { month: 'Jan', score: 72 },
      { month: 'Feb', score: 75 },
      { month: 'Mar', score: 78 }
    ],
    '1Y': [
      { month: 'Apr', score: 58 },
      { month: 'May', score: 60 },
      { month: 'Jun', score: 62 },
      { month: 'Jul', score: 63 },
      { month: 'Aug', score: 64 },
      { month: 'Sep', score: 65 },
      { month: 'Oct', score: 65 },
      { month: 'Nov', score: 68 },
      { month: 'Dec', score: 70 },
      { month: 'Jan', score: 72 },
      { month: 'Feb', score: 75 },
      { month: 'Mar', score: 78 }
    ]
  };

  const selectedData = historicalData[selectedPeriod];
  const scoreChange = selectedData[selectedData.length - 1].score - selectedData[0].score;
  const scoreChangePercent = ((scoreChange / selectedData[0].score) * 100).toFixed(1);

  // Improvement tips
  const improvementTips = [
    {
      id: 1,
      title: 'Reduce Dining Out Expenses',
      description: 'You spent $450 on dining last month. Try cooking at home more often.',
      impact: 'High',
      impactColor: 'text-red-500',
      potentialImprovement: '+5 points'
    },
    {
      id: 2,
      title: 'Set Up Emergency Fund',
      description: 'Build an emergency fund covering 3-6 months of expenses.',
      impact: 'High',
      impactColor: 'text-red-500',
      potentialImprovement: '+8 points'
    },
    {
      id: 3,
      title: 'Stick to Entertainment Budget',
      description: 'You exceeded your entertainment budget by 25% last month.',
      impact: 'Medium',
      impactColor: 'text-yellow-500',
      potentialImprovement: '+3 points'
    },
    {
      id: 4,
      title: 'Automate Savings',
      description: 'Set up automatic transfers to savings account each payday.',
      impact: 'Medium',
      impactColor: 'text-yellow-500',
      potentialImprovement: '+4 points'
    }
  ];

  // Calculate max score for chart scaling
  const maxScore = 100;
  const chartHeight = 180;

  const getBarHeight = (score: number) => {
    return (score / maxScore) * chartHeight;
  };

  const getStatusIcon = (status: string) => {
    if (status === 'excellent') return CheckCircle;
    if (status === 'good') return CheckCircle;
    return AlertCircle;
  };

  const getStatusColor = (status: string) => {
    if (status === 'excellent') return 'text-green-500';
    if (status === 'good') return 'text-blue-500';
    return 'text-yellow-500';
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b border-border">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => router.back()}
              className="w-10 h-10 items-center justify-center rounded-full bg-muted"
            >
              <ArrowLeft size={20} className="text-foreground" />
            </TouchableOpacity>
            <Text className="text-2xl font-bold text-foreground">Financial Health</Text>
          </View>
          <ThemeToggle />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32, gap: 20 }}>
        {/* Current Score Card */}
        <View className="bg-card rounded-2xl p-6 border border-border mt-6">
          <Text className="text-sm text-muted-foreground mb-4">Your Current Score</Text>
          
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className={`text-5xl font-bold ${scoreColor}`}>{currentScore}</Text>
              <Text className="text-lg text-muted-foreground mt-1">{scoreStatus} Health</Text>
            </View>
            
            <View className="items-end">
              <View className="flex-row items-center gap-2">
                {scoreChange >= 0 ? (
                  <TrendingUp size={20} className="text-green-500" />
                ) : (
                  <TrendingDown size={20} className="text-red-500" />
                )}
                <Text className={scoreChange >= 0 ? 'text-green-500 text-lg font-semibold' : 'text-red-500 text-lg font-semibold'}>
                  {scoreChange >= 0 ? '+' : ''}{scoreChange} pts
                </Text>
              </View>
              <Text className="text-sm text-muted-foreground mt-1">
                {scoreChange >= 0 ? '+' : ''}{scoreChangePercent}% vs {selectedData[0].month}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="h-3 bg-muted rounded-full overflow-hidden">
            <View className={`h-full ${scoreBgColor} rounded-full`} style={{ width: `${currentScore}%` }} />
          </View>

          {/* Score Range Labels */}
          <View className="flex-row justify-between mt-3">
            <Text className="text-xs text-muted-foreground">0 - Poor</Text>
            <Text className="text-xs text-muted-foreground">40 - Fair</Text>
            <Text className="text-xs text-muted-foreground">70 - Good</Text>
            <Text className="text-xs text-muted-foreground">100</Text>
          </View>
        </View>

        {/* How Score is Calculated */}
        <View className="bg-card rounded-2xl p-6 border border-border">
          <View className="flex-row items-center gap-2 mb-4">
            <Info size={20} className="text-primary" />
            <Text className="text-lg font-bold text-foreground">How It's Calculated</Text>
          </View>

          <Text className="text-sm text-muted-foreground mb-6">
            Your financial health score is based on three key factors, weighted by importance:
          </Text>

          {scoreBreakdown.map((item, index) => {
            const StatusIcon = getStatusIcon(item.status);
            const statusColor = getStatusColor(item.status);

            return (
              <View key={item.id} className={`${index > 0 ? 'mt-4 pt-4 border-t border-border' : ''}`}>
                <View className="flex-row items-start justify-between mb-2">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                      <item.icon size={20} className="text-primary" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-foreground">{item.name}</Text>
                      <Text className="text-xs text-muted-foreground mt-1">{item.weight}% weight</Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <View className="flex-row items-center gap-1">
                      <StatusIcon size={16} className={statusColor} />
                      <Text className={`text-lg font-bold ${statusColor}`}>{item.score}</Text>
                    </View>
                    <Text className="text-xs text-muted-foreground">+{item.contribution.toFixed(1)} pts</Text>
                  </View>
                </View>

                <Text className="text-sm text-muted-foreground mb-2 ml-13">{item.description}</Text>

                {/* Progress bar for component */}
                <View className="h-2 bg-muted rounded-full overflow-hidden ml-13">
                  <View 
                    className={item.status === 'excellent' ? 'h-full bg-green-500 rounded-full' : item.status === 'good' ? 'h-full bg-blue-500 rounded-full' : 'h-full bg-yellow-500 rounded-full'}
                    style={{ width: `${item.score}%` }} 
                  />
                </View>

                {/* Tip */}
                <View className="bg-muted/50 rounded-lg p-3 mt-3 ml-13">
                  <View className="flex-row items-start gap-2">
                    <Lightbulb size={14} className="text-primary mt-0.5" />
                    <Text className="text-xs text-foreground flex-1">{item.tip}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Historical Trend */}
        <View className="bg-card rounded-2xl p-6 border border-border">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-foreground">Score Trend</Text>
            
            {/* Period Selector */}
            <View className="flex-row bg-muted rounded-lg p-1">
              {(['3M', '6M', '1Y'] as const).map((period) => (
                <TouchableOpacity
                  key={period}
                  onPress={() => setSelectedPeriod(period)}
                  className={`px-3 py-1 rounded-md ${selectedPeriod === period ? 'bg-primary' : ''}`}
                >
                  <Text className={selectedPeriod === period ? 'text-primary-foreground text-xs font-semibold' : 'text-muted-foreground text-xs'}>
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Chart */}
          <View className="mt-4">
            <View className="flex-row items-end justify-between" style={{ height: chartHeight }}>
              {selectedData.map((data, index) => {
                const barHeight = getBarHeight(data.score);
                const isFirst = index === 0;
                const isLast = index === selectedData.length - 1;
                const prevScore = index > 0 ? selectedData[index - 1].score : data.score;
                const isIncreasing = data.score >= prevScore;

                return (
                  <View key={index} className="items-center flex-1">
                    {/* Score label on top */}
                    <Text className="text-xs font-semibold text-foreground mb-1">{data.score}</Text>
                    
                    {/* Bar */}
                    <View 
                      className={`w-full mx-1 rounded-t-lg ${isLast ? 'bg-primary' : 'bg-primary/40'}`}
                      style={{ height: barHeight }}
                    />
                    
                    {/* Month label */}
                    <Text className="text-xs text-muted-foreground mt-2">{data.month}</Text>
                  </View>
                );
              })}
            </View>

            {/* Baseline */}
            <View className="h-px bg-border mt-2" />
          </View>

          {/* Trend Summary */}
          <View className="mt-4 bg-muted/50 rounded-lg p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                {scoreChange >= 0 ? (
                  <TrendingUp size={20} className="text-green-500" />
                ) : (
                  <TrendingDown size={20} className="text-red-500" />
                )}
                <Text className="text-sm font-semibold text-foreground">
                  {scoreChange >= 0 ? 'Improving' : 'Declining'} Trend
                </Text>
              </View>
              <Text className={scoreChange >= 0 ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>
                {scoreChange >= 0 ? '+' : ''}{scoreChange} points
              </Text>
            </View>
            <Text className="text-xs text-muted-foreground mt-2">
              Your financial health has {scoreChange >= 0 ? 'improved' : 'declined'} by {Math.abs(scoreChange)} points over the past {selectedPeriod === '3M' ? '3 months' : selectedPeriod === '6M' ? '6 months' : 'year'}.
            </Text>
          </View>
        </View>

        {/* Improvement Tips */}
        <View className="bg-card rounded-2xl p-6 border border-border">
          <View className="flex-row items-center gap-2 mb-4">
            <Lightbulb size={20} className="text-primary" />
            <Text className="text-lg font-bold text-foreground">Tips to Improve</Text>
          </View>

          <Text className="text-sm text-muted-foreground mb-4">
            Follow these personalized recommendations to boost your financial health score:
          </Text>

          {improvementTips.map((tip, index) => (
            <View key={tip.id} className={`${index > 0 ? 'mt-4 pt-4 border-t border-border' : ''}`}>
              <View className="flex-row items-start justify-between mb-2">
                <Text className="text-base font-semibold text-foreground flex-1">{tip.title}</Text>
                <View className="bg-primary/10 px-2 py-1 rounded-md">
                  <Text className="text-xs font-semibold text-primary">{tip.potentialImprovement}</Text>
                </View>
              </View>

              <Text className="text-sm text-muted-foreground mb-2">{tip.description}</Text>

              <View className="flex-row items-center gap-2">
                <Text className="text-xs text-muted-foreground">Impact:</Text>
                <Text className={`text-xs font-semibold ${tip.impactColor}`}>{tip.impact}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Understanding Your Score */}
        <View className="bg-card rounded-2xl p-6 border border-border">
          <View className="flex-row items-center gap-2 mb-4">
            <Info size={20} className="text-primary" />
            <Text className="text-lg font-bold text-foreground">Understanding Your Score</Text>
          </View>

          <View className="gap-3">
            <View className="flex-row items-start gap-3">
              <View className="w-2 h-2 rounded-full bg-green-500 mt-2" />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">Good (71-100)</Text>
                <Text className="text-xs text-muted-foreground mt-1">
                  Excellent financial habits. You're managing money well and building wealth.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-3">
              <View className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">Fair (41-70)</Text>
                <Text className="text-xs text-muted-foreground mt-1">
                  You're on the right track but there's room for improvement in some areas.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start gap-3">
              <View className="w-2 h-2 rounded-full bg-red-500 mt-2" />
              <View className="flex-1">
                <Text className="text-sm font-semibold text-foreground">Poor (0-40)</Text>
                <Text className="text-xs text-muted-foreground mt-1">
                  Focus on reducing expenses and building better financial habits.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}