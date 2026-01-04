import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { X, DollarSign, Calendar, FileText, CreditCard, Tag, Check } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const EXPENSE_CATEGORIES = [
  { id: '1', name: 'Food & Dining', icon: '🍔' },
  { id: '2', name: 'Transportation', icon: '🚗' },
  { id: '3', name: 'Shopping', icon: '🛍️' },
  { id: '4', name: 'Entertainment', icon: '🎬' },
  { id: '5', name: 'Bills & Utilities', icon: '💡' },
  { id: '6', name: 'Healthcare', icon: '🏥' },
  { id: '7', name: 'Education', icon: '📚' },
  { id: '8', name: 'Other', icon: '📦' },
];

const INCOME_CATEGORIES = [
  { id: '9', name: 'Salary', icon: '💼' },
  { id: '10', name: 'Freelance', icon: '💻' },
  { id: '11', name: 'Business', icon: '🏢' },
  { id: '12', name: 'Investment', icon: '📈' },
  { id: '13', name: 'Gift', icon: '🎁' },
  { id: '14', name: 'Other Income', icon: '💰' },
];

const PAYMENT_METHODS = [
  { id: '1', name: 'Cash', icon: '💵' },
  { id: '2', name: 'Credit Card', icon: '💳' },
  { id: '3', name: 'Debit Card', icon: '💳' },
  { id: '4', name: 'Bank Transfer', icon: '🏦' },
  { id: '5', name: 'Digital Wallet', icon: '📱' },
  { id: '6', name: 'Other', icon: '💰' },
];

export default function AddTransactionScreen() {
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentMethodName, setPaymentMethodName] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleCategorySelect = (catId: string, catName: string) => {
    setCategory(catId);
    setCategoryName(catName);
    setShowCategoryModal(false);
  };

  const handlePaymentSelect = (methodId: string, methodName: string) => {
    setPaymentMethod(methodId);
    setPaymentMethodName(methodName);
    setShowPaymentModal(false);
  };

  const handleSubmit = () => {
    // Validate form
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    if (!category) {
      alert('Please select a category');
      return;
    }
    if (!paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    // In a real app, this would save to database/state management
    const transaction = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      category: categoryName,
      date: date.toISOString(),
      notes,
      paymentMethod: paymentMethodName,
    };

    console.log('Transaction created:', transaction);
    
    // Show success and navigate back
    alert(`${type === 'income' ? 'Income' : 'Expense'} added successfully!`);
    router.back();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Header */}
      <View className="px-6 py-4 border-b border-border">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-foreground">Add Transaction</Text>
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center rounded-full bg-muted"
          >
            <X size={20} className="text-foreground" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="p-6 gap-6">
          {/* Type Toggle */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-muted-foreground">Transaction Type</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => {
                  setType('expense');
                  setCategory('');
                  setCategoryName('');
                }}
                className={`flex-1 py-4 rounded-2xl border-2 ${
                  type === 'expense' 
                    ? 'bg-destructive/10 border-destructive' 
                    : 'bg-muted border-border'
                }`}
              >
                <Text className={`text-center font-semibold ${
                  type === 'expense' ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  💸 Expense
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setType('income');
                  setCategory('');
                  setCategoryName('');
                }}
                className={`flex-1 py-4 rounded-2xl border-2 ${
                  type === 'income' 
                    ? 'bg-success/10 border-success' 
                    : 'bg-muted border-border'
                }`}
              >
                <Text className={`text-center font-semibold ${
                  type === 'income' ? 'text-success' : 'text-muted-foreground'
                }`}>
                  💰 Income
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Amount Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-muted-foreground">Amount *</Text>
            <View className="flex-row items-center bg-muted rounded-2xl px-4 border-2 border-border">
              <DollarSign size={20} className="text-muted-foreground" />
              <TextInput
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
                className="flex-1 py-4 px-3 text-lg font-semibold text-foreground"
              />
            </View>
          </View>

          {/* Category Selection */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-muted-foreground">Category *</Text>
            <TouchableOpacity
              onPress={() => setShowCategoryModal(true)}
              className="flex-row items-center justify-between bg-muted rounded-2xl px-4 py-4 border-2 border-border"
            >
              <View className="flex-row items-center gap-3">
                <Tag size={20} className="text-muted-foreground" />
                <Text className={`text-base ${categoryName ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {categoryName || 'Select category'}
                </Text>
              </View>
              <Text className="text-muted-foreground">›</Text>
            </TouchableOpacity>
          </View>

          {/* Date Selection */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-muted-foreground">Date *</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center justify-between bg-muted rounded-2xl px-4 py-4 border-2 border-border"
            >
              <View className="flex-row items-center gap-3">
                <Calendar size={20} className="text-muted-foreground" />
                <Text className="text-base text-foreground font-medium">
                  {formatDate(date)}
                </Text>
              </View>
              <Text className="text-muted-foreground">›</Text>
            </TouchableOpacity>
          </View>

          {/* Payment Method */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-muted-foreground">Payment Method *</Text>
            <TouchableOpacity
              onPress={() => setShowPaymentModal(true)}
              className="flex-row items-center justify-between bg-muted rounded-2xl px-4 py-4 border-2 border-border"
            >
              <View className="flex-row items-center gap-3">
                <CreditCard size={20} className="text-muted-foreground" />
                <Text className={`text-base ${paymentMethodName ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  {paymentMethodName || 'Select payment method'}
                </Text>
              </View>
              <Text className="text-muted-foreground">›</Text>
            </TouchableOpacity>
          </View>

          {/* Notes Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-muted-foreground">Notes (Optional)</Text>
            <View className="flex-row items-start bg-muted rounded-2xl px-4 border-2 border-border">
              <FileText size={20} className="text-muted-foreground mt-4" />
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes or description..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="flex-1 py-4 px-3 text-base text-foreground"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className={`py-4 rounded-2xl mt-4 ${
              type === 'expense' ? 'bg-destructive' : 'bg-success'
            }`}
          >
            <Text className="text-center text-white text-base font-bold">
              Add {type === 'income' ? 'Income' : 'Expense'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Category Modal */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl max-h-[70%]">
            <View className="p-6 border-b border-border">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-bold text-foreground">
                  Select {type === 'income' ? 'Income' : 'Expense'} Category
                </Text>
                <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                  <X size={24} className="text-foreground" />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView className="p-6">
              <View className="gap-3">
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => handleCategorySelect(cat.id, cat.name)}
                    className={`flex-row items-center justify-between p-4 rounded-2xl border-2 ${
                      category === cat.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-muted border-border'
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <Text className="text-2xl">{cat.icon}</Text>
                      <Text className={`text-base font-medium ${
                        category === cat.id ? 'text-primary' : 'text-foreground'
                      }`}>
                        {cat.name}
                      </Text>
                    </View>
                    {category === cat.id && (
                      <Check size={20} className="text-primary" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Payment Method Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-background rounded-t-3xl max-h-[70%]">
            <View className="p-6 border-b border-border">
              <View className="flex-row items-center justify-between">
                <Text className="text-xl font-bold text-foreground">Select Payment Method</Text>
                <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                  <X size={24} className="text-foreground" />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView className="p-6">
              <View className="gap-3">
                {PAYMENT_METHODS.map((method) => (
                  <TouchableOpacity
                    key={method.id}
                    onPress={() => handlePaymentSelect(method.id, method.name)}
                    className={`flex-row items-center justify-between p-4 rounded-2xl border-2 ${
                      paymentMethod === method.id
                        ? 'bg-primary/10 border-primary'
                        : 'bg-muted border-border'
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <Text className="text-2xl">{method.icon}</Text>
                      <Text className={`text-base font-medium ${
                        paymentMethod === method.id ? 'text-primary' : 'text-foreground'
                      }`}>
                        {method.name}
                      </Text>
                    </View>
                    {paymentMethod === method.id && (
                      <Check size={20} className="text-primary" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}