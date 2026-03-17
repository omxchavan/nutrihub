"use client";

import { useEffect, useState, useRef } from "react";
import { Sparkles, Activity, AlertTriangle, Send, Loader2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from 'react-markdown';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ReportsPage() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hello! I'm your NutriHub AI Coach. I've reviewed your biometric profile and your recent food logs. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isThinking]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isThinking) return;

        const userMessage = input.trim();
        setInput("");

        // Add user message to UI immediately
        const updatedMessages = [...messages, { role: 'user', content: userMessage }] as Message[];
        setMessages(updatedMessages);
        setIsThinking(true);

        try {
            // Map our state messages to the format the API expects
            const apiMessages = updatedMessages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
            }));

            const res = await fetch("/api/ai/chat", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages }),
            });

            if (!res.ok) {
                throw new Error("Failed to get response");
            }

            // Immediately clear the "analyzing..." state so the stream can start
            setIsThinking(false);

            const reader = res.body?.getReader();
            if (!reader) throw new Error("No reader stream available from response");

            const decoder = new TextDecoder();
            let done = false;
            let currentText = "";

            // Initialize the AI message bubble
            setMessages(prev => [...prev, { role: 'assistant', content: "" }]);

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    currentText += chunk;
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1].content = currentText;
                        return newMessages;
                    });
                }
            }
        } catch (err: any) {
            console.error(err);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the servers right now. Please try again in a moment." }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="h-[100dvh] pt-20 md:pt-24 pb-48 md:pb-12 px-4 md:px-6 flex flex-col">
            <div className="max-w-4xl mx-auto w-full flex flex-col h-full space-y-3 md:space-y-4 overflow-hidden">

                {/* Header */}
                <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--color-brand-orange)]/20 flex items-center justify-center shadow-sm">
                        <Sparkles className="w-8 h-8 text-[var(--color-brand-orange)]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-800">A.I. Diet Coach</h1>
                        <p className="text-slate-500 mt-1 font-medium text-sm md:text-base">Your personalized, conversational AI assistant.</p>
                    </div>
                </div>

                {/* Privacy Notice */}
                <div className="flex-shrink-0 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-700 font-medium">
                        <strong>Privacy First:</strong> This conversation is secure and strictly saved in memory. For your privacy, the chat history will be permanently cleared once you leave this page.
                    </p>
                </div>

                {/* Chat Container */}
                <div className="clay-panel flex-1 flex flex-col overflow-hidden rounded-[2rem] relative">

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
                        <AnimatePresence initial={false}>
                            {messages.map((message, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[90%] md:max-w-[75%] rounded-2xl px-4 py-3 md:px-5 md:py-4 shadow-sm ${message.role === 'user'
                                            ? 'bg-[var(--color-brand-green)] text-white ml-8 md:ml-12 rounded-br-sm'
                                            : 'bg-white text-slate-700 border border-slate-100 mr-8 md:mr-12 rounded-bl-sm prose prose-sm max-w-none prose-p:leading-relaxed prose-a:text-[var(--color-brand-green)] prose-strong:text-slate-800'
                                            }`}
                                    >
                                        {message.role === 'assistant' ? (
                                            <div className="text-sm md:text-base">
                                                <ReactMarkdown>{message.content}</ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="text-sm md:text-base whitespace-pre-wrap">{message.content}</p>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isThinking && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex justify-start"
                                >
                                    <div className="bg-white border border-slate-100 rounded-2xl rounded-bl-sm px-4 py-3 md:px-5 md:py-4 shadow-sm mr-12 flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 text-[var(--color-brand-orange)] animate-spin" />
                                        <span className="text-xs md:text-sm text-slate-500 font-bold">Coach is analyzing...</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 md:p-4 bg-slate-50 border-t border-slate-100 flex-shrink-0 rounded-b-[2rem]">
                        <form onSubmit={handleSendMessage} className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask your coach anything..."
                                className="w-full clay-input pl-4 pr-12 md:pl-5 md:pr-14 py-3 md:py-4 rounded-xl text-sm md:text-base text-slate-800 placeholder:text-slate-400 focus:border-[var(--color-brand-green)] transition-all"
                                disabled={isThinking}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isThinking}
                                className="absolute right-1.5 md:right-2 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-[var(--color-brand-green)] flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:opacity-90 active:scale-95"
                            >
                                <Send className="w-4 h-4 ml-0.5" />
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
