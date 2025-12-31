
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Copy, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  CheckCircle2
} from 'lucide-react';
import { CodeType, CodeState } from './types';

const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<CodeType>('html');
  const [codes, setCodes] = useState<CodeState>(() => {
    const saved = localStorage.getItem('minimalist-code-lab-v5');
    return saved ? JSON.parse(saved) : {
      html: '<div class="container">\n  <h1>Halo Dunia!</h1>\n  <p>Selamat datang di editor kode hitam putih.</p>\n  <button id="magicBtn">Klik Saya</button>\n</div>',
      css: 'body {\n  background: #000;\n  color: #fff;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n  font-family: sans-serif;\n}\n\n.container {\n  text-align: center;\n  padding: 2rem;\n  border: 1px solid #fff;\n  background: #000;\n}\n\nbutton {\n  background: #fff;\n  border: none;\n  padding: 0.5rem 1rem;\n  color: #000;\n  cursor: pointer;\n  font-weight: bold;\n  margin-top: 1rem;\n}',
      js: 'const btn = document.getElementById("magicBtn");\n\nif (btn) {\n  btn.addEventListener("click", () => {\n    alert("Berhasil!");\n  });\n}'
    };
  });
  
  const [isPreviewFull, setIsPreviewFull] = useState(false);
  const [copied, setCopied] = useState(false);

  // Persistence
  useEffect(() => {
    localStorage.setItem('minimalist-code-lab-v5', JSON.stringify(codes));
  }, [codes]);

  // Combined Source for iframe
  const combinedSource = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            ${codes.css}
          </style>
        </head>
        <body>
          ${codes.html}
          <script>
            try {
              ${codes.js}
            } catch (e) {
              console.error("User JS Error:", e);
            }
          </script>
        </body>
      </html>
    `;
  }, [codes]);

  // Handlers
  const handleCodeChange = (value: string) => {
    setCodes(prev => ({ ...prev, [activeTab]: value }));
  };

  const handleClear = () => {
    if (window.confirm(`Bersihkan kode ${activeTab.toUpperCase()}?`)) {
      setCodes(prev => ({ 
        ...prev, 
        [activeTab]: '' 
      }));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codes[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white overflow-hidden select-none font-sans">
      
      {/* Banner Iklan Placeholder */}
      <div className="w-full bg-black h-8 flex items-center justify-center text-[9px] uppercase tracking-widest text-white/20 border-b border-white/10 shrink-0">
        ADVERTISEMENT
      </div>

      {/* Header */}
      <header className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-black shrink-0">
        <div className="flex items-center">
          <nav className="flex border border-white/10 rounded-none overflow-hidden h-7">
            {(['html', 'css', 'js'] as CodeType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 text-[10px] font-bold uppercase transition-colors ${
                  activeTab === tab 
                    ? 'bg-white text-black' 
                    : 'text-white hover:bg-white/5 border-r border-white/10 last:border-r-0'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={handleCopy}
            className="p-2 hover:bg-white/10 transition-colors text-white relative rounded-sm"
          >
            {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
          </button>
          <button 
            onClick={handleClear}
            className="p-2 hover:bg-white/10 transition-colors text-white rounded-sm"
          >
            <Trash2 size={16} />
          </button>
          <button 
            onClick={() => setIsPreviewFull(!isPreviewFull)}
            className="p-2 hover:bg-white/10 transition-colors text-white rounded-sm"
          >
            {isPreviewFull ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Editor Section */}
        <section 
          className={`flex-1 flex flex-col border-white/10 ${
            isPreviewFull ? 'hidden' : 'border-b'
          }`}
        >
          <textarea
            value={codes[activeTab]}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="flex-1 w-full h-full bg-black text-white p-5 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-white/5 border-none"
            spellCheck={false}
            autoFocus
            placeholder={`/* ${activeTab.toUpperCase()} code here */`}
          />
        </section>

        {/* Preview Section - Completely clean, no border at the bottom */}
        <section className={`flex-1 flex flex-col bg-white overflow-hidden relative`}>
          <iframe
            srcDoc={combinedSource}
            className="w-full h-full border-none bg-white"
            sandbox="allow-scripts allow-modals allow-forms allow-popups"
          />
        </section>
      </main>
    </div>
  );
};

export default App;
