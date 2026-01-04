import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  X,
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Heart,
  Briefcase,
  DollarSign,
  Gift
} from 'lucide-react-native';
import { ThemeToggle } from '@/components/ThemeToggle';

// Mock transaction data
const mockTransactions = [
  {
    id: '1',
    type: 'expense',
    category: 'Food & Dining',
    amount: 45.50,
    date: '2024-01-15',
    time: '12:30 PM',
    description: 'Lunch at Cafe Milano',
    paymentMethod: 'Credit Card',
    icon: 'utensils'
  },
  {
    id: '2',
    type: 'income',
    category: 'Salary',
    amount: 3500.00,
    date: '2024-01-15',
    time: '09:00 AM',
    description: 'Monthly Salary',
    paymentMethod: 'Bank Transfer',
    icon: 'briefcase'
  },
  {
    id: '3',
    type: 'expense',
    category: 'Transportation',
    amount: 25.00,
    date: '2024-01-14',
    time: '06:45 PM',
    description: 'Uber ride home',
    paymentMethod: 'Debit Card',
    icon: 'car'
  },
  {
    id: '4',
    type: 'expense',
    category: 'Shopping',
    amount: 120.00,
    date: '2024-01-14',
    time: '03:20 PM',
    description: 'New shoes from Nike Store',
    paymentMethod: 'Credit Card',
    icon: 'shopping-bag'
  },
  {
    id: '5',
    type: 'expense',
    category: 'Healthcare',
    amount: 80.00,
    date: '2024-01-13',
    time: '10:00 AM',
    description: 'Doctor appointment',
    paymentMethod: 'Cash',
    icon: 'heart'
  },
  {
    id: '6',
    type: 'income',
    category: 'Freelance',
    amount: 500.00,
    date: '2024-01-12',
    time: '02:30 PM',
    description: 'Website design project',
    paymentMethod: 'PayPal',
    icon: 'dollar-sign'
  },
  {
    id: '7',
    type: 'expense',
    category: 'Bills & Utilities',
    amount: 150.00,
    date: '2024-01-10',
    time: '11:00 AM',
    description: 'Electricity bill',
    paymentMethod: 'Bank Transfer',
    icon: 'home'
  },
  {
    id: '8',
    type: 'expense',
    category: 'Food & Dining',
    amount: 65.00,
    date: '2024-01-10',
    time: '07:30 PM',
    description: 'Dinner with friends',
    paymentMethod: 'Credit Card',
    icon: 'utensils'
  },
  {
    id: '9',
    type: 'expense',
    category: 'Entertainment',
    amount: 35.00,
    date: '2024-01-09',
    time: '08:00 PM',
    description: 'Movie tickets',
    paymentMethod: 'Cash',
    icon: 'gift'
  },
  {
    id: '10',
    type: 'income',
    category: 'Investment',
    amount: 200.00,
    date: '2024-01-08',
    time: '10:00 AM',
    description: 'Stock dividends',
    paymentMethod: 'Bank Transfer',
    icon: 'trending-up'
  }
];

const categories = [
  'All Categories',
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Bills & Utilities',
  'Healthcare',
  'Entertainment',
  'Salary',
  'Freelance',
  'Investment'
];

const dateFilters = [
  'All Time',
  'Today',
  'This Week',
  'This Month',
  'Last Month',
  'Custom Range'
];

const typeFilters = ['All', 'Income', 'Expense'];

export default function TransactionsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedDateFilter, setSelectedDateFilter] = useState('This Month');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    const iconProps = { size: 20, className: 'text-foreground' };
    switch (iconName) {
      case 'utensils': return <Utensils {...iconProps} />;
      case 'car': return <Car {...iconProps} />;
      case 'shopping-bag': return <ShoppingBag {...iconProps} />;
      case 'home': return <Home {...iconProps} />;
      case 'heart': return <Heart {...iconProps} />;
      case 'briefcase': return <Briefcase {...iconProps} />;
      case 'dollar-sign': return <DollarSign {...iconProps} />;
      case 'gift': return <Gift {...iconProps} />;
      case 'trending-up': return <TrendingUp {...iconProps} />;
      default: return <DollarSign {...iconProps} />;
    }
  };

  // Filter transactions based on search and filters
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || transaction.type === selectedType.toLowerCase();
    const matchesCategory = selectedCategory === 'All Categories' || transaction.category === selectedCategory;
    
    return matchesSearch && matchesType && matchesCategory;
  });

  // Calculate totals
  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const handleTransactionPress = (transaction: any) => {
    setSelectedTransaction(transaction);
    setShowDetails(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b border-border/50">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-3"
          >
            <ArrowLeft size={24} className="text-foreground" />
          </TouchableOpacity>
          <Text className="text-2xl font-bold text-foreground flex-1">Transactions</Text>
          <ThemeToggle />
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center bg-muted rounded-xl px-4 py-3">
            <Search size={20} className="text-muted-foreground mr-2" />
            <TextInput
              placeholder="Search transactions..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 text-foreground text-base"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={18} className="text-muted-foreground" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            onPress={() => setShowFilters(!showFilters)}
            className="bg-primary rounded-xl p-3"
          >
            <Filter size={20} className='text-background' />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters Section */}
      {showFilters && (
        <View className="px-6 py-4 bg-muted/30 border-b border-border/50">
          {/* Type Filter */}
          <Text className="text-sm font-semibold text-foreground mb-2">Type</Text>
          <View className="flex-row gap-2 mb-4">
            {typeFilters.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-lg ${
                  selectedType === type ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  selectedType === type ? 'text-white' : 'text-foreground'
                }`}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Category Filter */}
          <Text className="text-sm font-semibold text-foreground mb-2">Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 16 }}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === category ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  selectedCategory === category ? 'text-white' : 'text-foreground'
                }`}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Date Filter */}
          <Text className="text-sm font-semibold text-foreground mb-2">Date Range</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {dateFilters.map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setSelectedDateFilter(filter)}
                className={`flex-row items-center px-4 py-2 rounded-lg ${
                  selectedDateFilter === filter ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <Calendar size={14} className={selectedDateFilter === filter ? 'text-white mr-1' : 'text-foreground mr-1'} />
                <Text className={`text-sm font-medium ${
                  selectedDateFilter === filter ? 'text-white' : 'text-foreground'
                }`}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Summary Cards */}
      <View className="flex-row px-6 py-4 gap-3">
        <View className="flex-1 bg-green-500/10 rounded-xl p-4 border border-green-500/20">
          <View className="flex-row items-center mb-1">
            <TrendingUp size={16} className="text-green-500 mr-1" />
            <Text className="text-xs font-medium text-green-500">Income</Text>
          </View>
          <Text className="text-xl font-bold text-green-500">${totalIncome.toFixed(2)}</Text>
        </View>
        <View className="flex-1 bg-destructive/10 rounded-xl p-4 border border-destructive/20">
          <View className="flex-row items-center mb-1">
            <TrendingDown size={16} className="text-destructive mr-1" />
            <Text className="text-xs font-medium text-destructive">Expenses</Text>
          </View>
          <Text className="text-xl font-bold text-destructive">${totalExpense.toFixed(2)}</Text>
        </View>
      </View>

      {/* Transactions List */}
      <ScrollView className="flex-1 px-6">
        <Text className="text-sm font-medium text-muted-foreground mb-3">
          {filteredTransactions.length} transactions found
        </Text>

        {filteredTransactions.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Search size={48} className="text-muted-foreground mb-3" />
            <Text className="text-lg font-semibold text-foreground mb-1">No transactions found</Text>
            <Text className="text-sm text-muted-foreground text-center">
              Try adjusting your filters or search query
            </Text>
          </View>
        ) : (
          <View className="gap-3 pb-6">
            {filteredTransactions.map((transaction) => (
              <TouchableOpacity
                key={transaction.id}
                onPress={() => handleTransactionPress(transaction)}
                className="bg-card rounded-xl p-4 border border-border/50 active:opacity-70"
              >
                <View className="flex-row items-center">
                  <View className={`w-12 h-12 rounded-full items-center justify-center mr-3 ${
                    transaction.type === 'income' ? 'bg-green-500/10' : 'bg-destructive/10'
                  }`}>
                    {getIconComponent(transaction.icon)}
                  </View>
                  
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-foreground mb-1">
                      {transaction.description}
                    </Text>
                    <View className="flex-row items-center">
                      <Text className="text-xs text-muted-foreground mr-2">
                        {transaction.category}
                      </Text>
                      <Text className="text-xs text-muted-foreground">
                        • {transaction.date} at {transaction.time}
                      </Text>
                    </View>
                  </View>

                  <Text className={`text-lg font-bold ${
                    transaction.type === 'income' ? 'text-green-500' : 'text-destructive'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Transaction Details Modal */}
      <Modal
        visible={showDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDetails(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl p-6 max-h-[80%]">
            {/* Modal Header */}
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-bold text-foreground">Transaction Details</Text>
              <TouchableOpacity onPress={() => setShowDetails(false)}>
                <X size={24} className="text-foreground" />
              </TouchableOpacity>
            </View>

            {selectedTransaction && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Amount */}
                <View className="items-center mb-6 pb-6 border-b border-border/50">
                  <View className={`w-16 h-16 rounded-full items-center justify-center mb-3 ${
                    selectedTransaction.type === 'income' ? 'bg-green-500/10' : 'bg-destructive/10'
                  }`}>
                    {getIconComponent(selectedTransaction.icon)}
                  </View>
                  <Text className={`text-3xl font-bold mb-1 ${
                    selectedTransaction.type === 'income' ? 'text-green-500' : 'text-destructive'
                  }`}>
                    {selectedTransaction.type === 'income' ? '+' : '-'}${selectedTransaction.amount.toFixed(2)}
                  </Text>
                  <Text className="text-base text-muted-foreground">{selectedTransaction.category}</Text>
                </View>

                {/* Details */}
                <View className="gap-4">
                  <View>
                    <Text className="text-xs font-medium text-muted-foreground mb-1">Description</Text>
                    <Text className="text-base text-foreground font-medium">{selectedTransaction.description}</Text>
                  </View>

                  <View className="flex-row gap-4">
                    <View className="flex-1">
                      <Text className="text-xs font-medium text-muted-foreground mb-1">Date</Text>
                      <Text className="text-base text-foreground font-medium">{selectedTransaction.date}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs font-medium text-muted-foreground mb-1">Time</Text>
                      <Text className="text-base text-foreground font-medium">{selectedTransaction.time}</Text>
                    </View>
                  </View>

                  <View>
                    <Text className="text-xs font-medium text-muted-foreground mb-1">Payment Method</Text>
                    <Text className="text-base text-foreground font-medium">{selectedTransaction.paymentMethod}</Text>
                  </View>

                  <View>
                    <Text className="text-xs font-medium text-muted-foreground mb-1">Type</Text>
                    <View className={`self-start px-3 py-1 rounded-full ${
                      selectedTransaction.type === 'income' ? 'bg-green-500/10' : 'bg-destructive/10'
                    }`}>
                      <Text className={`text-sm font-medium ${
                        selectedTransaction.type === 'income' ? 'text-green-500' : 'text-destructive'
                      }`}>
                        {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Action Buttons */}
                <View className="flex-row gap-3 mt-6">
                  <TouchableOpacity className="flex-1 bg-primary rounded-xl py-4 items-center">
                    <Text className="text-white font-semibold">Edit Transaction</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-destructive/10 rounded-xl px-6 py-4 items-center border border-destructive/20">
                    <Text className="text-destructive font-semibold">Delete</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}