import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import apiClient from '../../api/client';

export default function AIChatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your AI Village Assistant. You can ask me about government schemes, village expenses, Gram Sabha meetings, and more!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await apiClient.post('/chatbot', { message: userMsg.text });
      const botMsg = { sender: 'bot', text: res.data.reply };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.log(error);
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I am having trouble connecting to the AI server right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <View style={styles.botIconContainer}>
          <Ionicons name="hardware-chip" size={24} color={Colors.white} />
        </View>
        <View>
          <Text style={styles.headerTitle}>AI Assistant</Text>
          <Text style={styles.headerSubtitle}>Powered by Google Gemini</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.chatArea}
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg, index) => (
          <View key={index} style={[styles.messageRow, msg.sender === 'user' ? styles.rowUser : styles.rowBot]}>
            {msg.sender === 'bot' && (
              <View style={styles.botAvatar}>
                <Ionicons name="hardware-chip-outline" size={16} color={Colors.white} />
              </View>
            )}
            
            <View style={[styles.bubble, msg.sender === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
              <Text style={[styles.messageText, msg.sender === 'user' ? styles.textUser : styles.textBot]}>
                {msg.text}
              </Text>
            </View>
            
            {msg.sender === 'user' && (
              <View style={styles.userAvatar}>
                <Ionicons name="person-outline" size={16} color={Colors.primary} />
              </View>
            )}
          </View>
        ))}
        {loading && (
          <View style={[styles.messageRow, styles.rowBot]}>
             <View style={styles.botAvatar}>
                <Ionicons name="hardware-chip-outline" size={16} color={Colors.white} />
              </View>
              <View style={[styles.bubble, styles.bubbleBot, { flexDirection: 'row', alignItems: 'center' }]}>
                <ActivityIndicator size="small" color={Colors.primary} style={{marginRight: 8}}/>
                <Text style={styles.textBot}>AI is thinking...</Text>
              </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput 
          style={styles.input}
          placeholder="Ask something..."
          value={input}
          onChangeText={setInput}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]} onPress={sendMessage} disabled={!input.trim() || loading}>
          <Ionicons name="send" size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: Colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)'
  },
  botIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 15 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.white },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  
  chatArea: { flex: 1, padding: 15 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 15 },
  rowUser: { justifyContent: 'flex-end' },
  rowBot: { justifyContent: 'flex-start' },
  
  botAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  userAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.lightGray, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  
  bubble: { maxWidth: '75%', padding: 12, borderRadius: 18 },
  bubbleBot: { backgroundColor: Colors.white, borderBottomLeftRadius: 4, elevation: 1 },
  bubbleUser: { backgroundColor: Colors.primary, borderBottomRightRadius: 4, elevation: 1 },
  
  messageText: { fontSize: 15, lineHeight: 22 },
  textBot: { color: Colors.text },
  textUser: { color: Colors.white },
  
  inputArea: { flexDirection: 'row', padding: 10, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.lightGray, alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#F0F2F5', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 10, fontSize: 15, maxHeight: 100 },
  sendButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', marginLeft: 10 },
  sendButtonDisabled: { backgroundColor: Colors.gray },
});
