import { useCallback } from 'react';
import { useSupabaseDemo } from './useSupabaseDemo';

export const useChatMessages = () => {
  const { chatMessages, addChatMessage, generateCustomPrompt } = useSupabaseDemo();

  const sendUserMessage = useCallback(async (message: string) => {
    await addChatMessage(message, 'user');
  }, [addChatMessage]);

  const sendAssistantMessage = useCallback(async (message: string, metadata?: any) => {
    await addChatMessage(message, 'assistant', metadata);
  }, [addChatMessage]);

  const getPromptForAPI = useCallback(() => {
    const customPrompt = generateCustomPrompt();
    const conversationHistory = chatMessages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    return {
      systemPrompt: customPrompt,
      messages: conversationHistory
    };
  }, [chatMessages, generateCustomPrompt]);

  return {
    chatMessages,
    sendUserMessage,
    sendAssistantMessage,
    getPromptForAPI
  };
};