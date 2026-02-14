"use client"

import { useState, useEffect, useRef } from "react"
import { Phone, Mic, X, Volume2, MicOff, LogOut, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { UserState, FinanceState } from "@/types"

interface AIVoiceChatProps {
    mode: 'insurance' | 'finance';
    userState: UserState;
    financeState: FinanceState;
}

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export default function AIVoiceChat({ mode, userState, financeState }: AIVoiceChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [transcript, setTranscript] = useState("");

    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesis | null>(null);

    // Initialize Speech API
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = false;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.lang = 'ko-KR';

                recognitionRef.current.onresult = (event: any) => {
                    const current = event.resultIndex;
                    const transcriptText = event.results[current][0].transcript;
                    setTranscript(transcriptText);
                };

                recognitionRef.current.onend = () => {
                    setIsListening(false);
                    if (transcript) {
                        handleSendMessage(transcript);
                    }
                };
            }

            synthesisRef.current = window.speechSynthesis;
        }
    }, [transcript]); // Dependency on transcript to ensure latest state is captured?? No, handleSendMessage handles it.

    // Better useEffect for recognition to avoid stale closure if needed, but ref is fine.
    // Actually, onend calling handleSendMessage needs the latest transcript.
    // The transcript state updates, but onend might capture the state from closure?
    // Let's rely on a ref for transcript or just use the event result only? 
    // The event result is the most reliable. But onend doesn't have the event.
    // Let's use a ref for transcript.
    const transcriptRef = useRef("");
    useEffect(() => {
        transcriptRef.current = transcript;
    }, [transcript]);

    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.onend = () => {
                setIsListening(false);
                const finalTranscript = transcriptRef.current;
                if (finalTranscript.trim()) {
                    handleSendMessage(finalTranscript);
                    setTranscript(""); // Clear for next turn
                }
            };
        }
    }, []);


    const handleSendMessage = async (text: string) => {
        setIsProcessing(true);
        const newMessages = [...messages, { role: 'user' as const, content: text }];
        setMessages(newMessages);

        try {
            const response = await fetch('/api/ai/consulting', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode,
                    userState,
                    financeState,
                    messages: newMessages
                })
            });

            const data = await response.json();
            if (data.advice) {
                const botMessage = { role: 'assistant' as const, content: data.advice };
                setMessages(prev => [...prev, botMessage]);
                speak(data.advice);
            }
        } catch (error) {
            console.error("AI Error:", error);
            speak("죄송해요, 오류가 발생했습니다. 다시 말씀해 주세요.");
        } finally {
            setIsProcessing(false);
        }
    };

    const speak = (text: string) => {
        if (!synthesisRef.current) return;

        // Cancel previous speech
        synthesisRef.current.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 1.1; // Slightly faster for natural feel
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        synthesisRef.current.speak(utterance);
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            setTranscript("");
            transcriptRef.current = "";
            synthesisRef.current?.cancel(); // Stop talking if user wants to speak
            setIsSpeaking(false);
            try {
                recognitionRef.current?.start();
                setIsListening(true);
            } catch (e) {
                console.error("Recognition start failed", e);
            }
        }
    };

    const handleOpen = () => {
        setIsOpen(true);
        // Initial greeting
        if (messages.length === 0) {
            const greeting = mode === 'insurance'
                ? "안녕하세요? 무엇을 도와드릴까요?"
                : "안녕하세요? 재무 상담을 도와드릴까요?";
            // Don't add to message history to save context tokens? Or add it?
            // Let's just speak it.
            speak(greeting);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        synthesisRef.current?.cancel();
        setIsSpeaking(false);
        setIsListening(false);
        recognitionRef.current?.stop();
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleOpen}
                    className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg shadow-blue-500/40 flex items-center justify-center text-white border-2 border-white/20"
                >
                    <Phone className="w-8 h-8 fill-current animate-pulse" />
                </motion.button>
            )}

            {/* Call Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        className="fixed bottom-6 right-6 z-50 w-[350px] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 bg-slate-800/50 flex justify-between items-center border-b border-slate-700">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Volume2 className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">AI Voice Consultant</h3>
                                    <p className="text-xs text-slate-400">Powered by OpenAI</p>
                                </div>
                            </div>
                            <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {/* Visualizer Area */}
                        <div className="h-48 flex flex-col items-center justify-center relative p-6">
                            {/* Avatar / Status */}
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${isSpeaking ? 'bg-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.3)]' : 'bg-slate-800'}`}>
                                {isProcessing ? (
                                    <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
                                ) : (
                                    <div className="flex gap-1 items-end h-8">
                                        {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: isSpeaking ? [10, 32, 10] : 10 }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 0.5,
                                                    delay: i * 0.1,
                                                    ease: "easeInOut"
                                                }}
                                                className="w-2 bg-blue-400 rounded-full"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Live Transcript */}
                            <div className="mt-6 text-center w-full min-h-[40px]">
                                {transcript ? (
                                    <p className="text-white font-medium text-lg leading-tight animate-pulse">
                                        "{transcript}"
                                    </p>
                                ) : isListening ? (
                                    <p className="text-slate-400 text-sm">듣고 있습니다...</p>
                                ) : isSpeaking ? (
                                    <p className="text-blue-400 text-sm font-medium">답변 중입니다...</p>
                                ) : (
                                    <p className="text-slate-500 text-xs">버튼을 눌러 대화를 시작하세요</p>
                                )}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="p-6 pt-0 flex justify-center gap-6">
                            <button
                                onClick={handleClose}
                                className="w-14 h-14 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center text-red-500 transition-colors"
                            >
                                <LogOut className="w-6 h-6" />
                            </button>

                            <button
                                onClick={toggleListening}
                                className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${isListening
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-white text-slate-900 hover:bg-gray-100'
                                    }`}
                            >
                                {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
