// app/ui/chat/ChatBot.tsx
"use client";
import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
    { 
        role: 'assistant', 
        content: 'Hi! I\'m RecitalBot! 🎵 Ready to rock? Ask me about concerts, tickets, or anything music-related!',
        timestamp: new Date() 
    }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = { 
            role: 'user', 
            content: input, 
            timestamp: new Date() 
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/ia/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input }),
            });
            
            if (!response.ok) {
                throw new Error('Error with AI service');
            }

            const data = await response.json();
            
            const assistantMessage: Message = { 
                role: 'assistant', 
                content: data.response, 
                timestamp: new Date() 
            };
            
            setMessages(prev => [...prev, assistantMessage]);
            
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: '🎸 Oops! Something went wrong. Let\'s try that again - the show must go on!',
                timestamp: new Date() 
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // Botón flotante cuando está cerrado
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-pink-200 hover:bg-pink-300 text-[#23232b] p-4 rounded-full shadow-2xl transition-all duration-300 z-50 hover:scale-110 border-4 border-[#23232b]"
                aria-label="Open RecitalBot"
            >
                <div className="relative">
                    <MessageCircle size={28} className="font-bold" />
                </div>
            </button>
        );
    }

    // Ventana del chat
    return (
        <div className="fixed bottom-6 right-6 bg-[#23232b] border-4 border-pink-200 rounded-xl shadow-2xl w-80 h-[520px] flex flex-col z-50 overflow-hidden">
            {/* Header - Matching your banner style */}
            <div className="bg-pink-200 text-[#23232b] p-4 flex justify-between items-center border-b-2 border-pink-300">
                <div className="flex items-center gap-3">
                    <div className="bg-[#23232b] p-2 rounded-full">
                        <Bot size={20} className="text-pink-200" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">RecitalBot</h3>
                        <p className="text-sm font-medium opacity-80">Let's rock together! 🎸</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-[#23232b] hover:text-pink-200 p-2 rounded-full transition-colors font-bold"
                    aria-label="Close chat"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#23232b]">
                {messages.map((msg, i) => (
                    <div 
                        key={i} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div 
                            className={`max-w-[85%] p-3 rounded-xl text-sm leading-relaxed font-medium ${
                                msg.role === 'user' 
                                    ? 'bg-pink-200 text-[#23232b] shadow-lg' 
                                    : 'bg-[#fff0f6] text-[#23232b] border-2 border-pink-100 shadow-md'
                            }`}
                        >
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                            <div className={`text-xs mt-2 font-normal ${
                                msg.role === 'user' ? 'text-[#23232b]/70' : 'text-[#23232b]/60'
                            }`}>
                                {msg.timestamp.toLocaleTimeString('en-US', { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </div>
                        </div>
                    </div>
                ))}
                
                {/* Loading indicator */}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-[#fff0f6] border-2 border-pink-100 text-[#23232b] p-3 rounded-xl max-w-[85%] shadow-md">
                            <div className="flex items-center gap-3">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                    <div className="w-2 h-2 bg-pink-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                </div>
                                <span className="text-sm font-medium">🎵 RecitalBot is composing...</span>
                            </div>
                        </div>
                    </div>
                )}
                
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t-4 border-pink-200 bg-[#23232b]">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me about concerts, tickets, artists..."
                        className="flex-1 bg-[#fff0f6] text-[#23232b] p-3 rounded-lg border-2 border-pink-100 focus:border-pink-300 focus:outline-none placeholder-[#23232b]/60 text-sm font-medium"
                        disabled={loading}
                        maxLength={500}
                    />
                    <button 
                        onClick={sendMessage}
                        disabled={loading || !input.trim()}
                        className="bg-pink-200 hover:bg-pink-300 disabled:bg-pink-100 text-[#23232b] p-3 rounded-lg transition-all duration-200 disabled:cursor-not-allowed font-bold border-2 border-pink-300 hover:border-pink-400"
                        aria-label="Send message"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <div className="text-xs text-[#fff0f6]/70 mt-2 text-center font-medium">
                    🤖 Powered by Google Gemini • <span className="text-pink-200 font-bold">Recitaly</span>
                </div>
            </div>
        </div>
    );
}