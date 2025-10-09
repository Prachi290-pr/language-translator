import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Languages, Mic, Volume2, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Languages className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">NLP Translator</span>
          </div>
          <Link to="/translator">
            <Button variant="ghost">Open Translator</Button>
          </Link>
        </div>
      </nav>

      <section className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Professional Language Translation
          </h1>
          <p className="text-xl text-muted-foreground">
            Powered by advanced NLP technology. Translate text instantly with voice input and text-to-speech capabilities.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/translator">
              <Button size="lg" className="gap-2">
                Start Translating <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Languages className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Multi-Language Support</h3>
            <p className="text-muted-foreground">
              Translate between dozens of languages with high accuracy powered by advanced NLP models.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <Mic className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold">Voice Input</h3>
            <p className="text-muted-foreground">
              Speak naturally and let our speech recognition convert your voice to text instantly.
            </p>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Volume2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Text-to-Speech</h3>
            <p className="text-muted-foreground">
              Listen to translations in natural-sounding voices for better pronunciation and learning.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-border mt-24">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-sm text-muted-foreground">
            Built with advanced NLP technology • Mini Project
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
