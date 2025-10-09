import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Card } from "../components/ui/card";
import { Link } from "react-router-dom";
import { Languages, Mic, Volume2, ArrowLeftRight, Home } from "lucide-react";
import { toast } from "sonner"; // Sonner's toast function

const Translator = () => {
    const [languages, setLanguages] = useState<Record<string, string>>({}); // Add type for languages
    const [inputText, setInputText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [sourceLang, setSourceLang] = useState("en");
    const [targetLang, setTargetLang] = useState("fr");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("http://localhost:5000/languages")
            .then((res) => res.json())
            .then((data: Record<string, string>) => setLanguages(data)) // Type the incoming data
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load languages. Please check if the backend is running.");
            });
    }, []); // Removed `toast` from dependency array as it is not a prop or state variable.

    const handleTranslate = async () => {
        if (!inputText.trim()) {
            toast.warning("Please enter text to translate.");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: inputText,
                    source_lang: sourceLang,
                    target_lang: targetLang,
                }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setTranslatedText(data.translated_text);
            toast.success("Your text has been translated successfully.");
        } catch (err: any) {
            toast.error(err.message || "An error occurred during translation.");
        } finally {
            setLoading(false);
        }
    };

    const handleVoiceInput = () => {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;

        if (!SpeechRecognition) {
            toast.error("Your browser doesn't support voice input.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = sourceLang;
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInputText(transcript);
        };
        recognition.onerror = () => {
            toast.error("Voice input failed. Please try again.");
        };
        recognition.start();
    };

    const handleSpeak = () => {
        if (!translatedText) {
            toast.warning("Please translate text first before using text-to-speech.");
            return;
        }
        const utterance = new SpeechSynthesisUtterance(translatedText);
        utterance.lang = targetLang;
        window.speechSynthesis.speak(utterance);
    };

    const swapLanguages = () => {
        const temp = sourceLang;
        setSourceLang(targetLang);
        setTargetLang(temp);
        setInputText(translatedText);
        setTranslatedText("");
    };

    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b border-border">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Languages className="h-6 w-6 text-primary" />
                        <span className="text-xl font-semibold">NLP Translator</span>
                    </div>
                    <Link to="/">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <Home className="h-4 w-4" />
                            Home
                        </Button>
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-12">
                <Card className="max-w-5xl mx-auto p-8 space-y-6">
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold">Language Translator</h1>
                        <p className="text-muted-foreground">Enter text or use voice input to translate</p>
                    </div>

                    <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Source Language</label>
                            <Select value={sourceLang} onValueChange={setSourceLang}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(languages).map(([code, name]) => (
                                        <SelectItem key={code} value={code}>
                                            {name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={swapLanguages}
                            className="mt-6"
                        >
                            <ArrowLeftRight className="h-4 w-4" />
                        </Button>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Target Language</label>
                            <Select value={targetLang} onValueChange={setTargetLang}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {Object.entries(languages).map(([code, name]) => (
                                        <SelectItem key={code} value={code}>
                                            {name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Input Text</label>
                        <Textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Enter text to translate..."
                            className="min-h-[150px] resize-none"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Button variant="outline" onClick={handleVoiceInput} className="gap-2">
                            <Mic className="h-4 w-4" />
                            Voice Input
                        </Button>
                        <Button onClick={handleTranslate} disabled={loading} className="gap-2">
                            <Languages className="h-4 w-4" />
                            {loading ? "Translating..." : "Translate"}
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Translation</label>
                        <div className="min-h-[150px] p-4 rounded-lg border border-border bg-muted/50">
                            {loading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="animate-pulse text-muted-foreground">Translating...</div>
                                </div>
                            ) : (
                                <p className="text-base leading-relaxed">{translatedText || "Translation will appear here..."}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            variant="secondary"
                            onClick={handleSpeak}
                            disabled={!translatedText}
                            className="gap-2"
                        >
                            <Volume2 className="h-4 w-4" />
                            Listen
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Translator;