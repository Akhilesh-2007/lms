import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react'

const faqs = [
  { q: "How do I enroll in a course?", a: "Simply browse our course catalog, find a course you're interested in, click on it to view details, and click the 'Enroll Now' button. You'll be guided through the payment process.", keywords: ["enroll", "buy", "purchase", "register", "sign up"] },
  { q: "What payment methods are accepted?", a: "We accept all major credit/debit cards, UPI, and digital wallets through our secure Stripe payment gateway. All transactions are encrypted for your safety.", keywords: ["payment", "pay", "card", "upi", "money", "price", "cost"] },
  { q: "How do I access my enrolled courses?", a: "Go to 'My Enrollments' in the navigation menu. You'll see all your purchased courses there. Click on any course to start learning!", keywords: ["access", "my courses", "enrolled", "view", "open", "where"] },
  { q: "Can I get a refund?", a: "Yes! If you're not satisfied with a course, you can request a refund within 7 days of purchase. Contact our support team for assistance.", keywords: ["refund", "money back", "cancel", "return"] },
  { q: "How do I become an educator?", a: "Navigate to the Educator section in the menu. Click on 'Start Teaching' and fill out the educator application. Our team will review and get back to you.", keywords: ["educator", "teacher", "instructor", "teach", "create course", "teaching"] },
  { q: "How do I create and sell courses?", a: "Once you're an approved educator, go to your dashboard and click 'Add New Course'. Fill in the course details, add chapters, lectures, and set your price.", keywords: ["create", "sell", "add course", "new course", "upload", "make course"] },
  { q: "How do I track my earnings?", a: "Educators can view their earnings in the Dashboard under the 'Earnings' section. It shows total earnings, student enrollments, and transaction history.", keywords: ["earnings", "money", "revenue", "income", "sales", "how much"] },
  { q: "What is the video player like?", a: "Our player supports HD video streaming, playback speed control, subtitles, and progress saving. You can resume from where you left off!", keywords: ["video", "player", "watch", "stream", "hd", "playback", "speed"] },
  { q: "Are certificates provided?", a: "Yes! Upon completing a course, you'll receive a certificate of completion that you can download and share on LinkedIn.", keywords: ["certificate", "completion", "certify", "diploma", "certificate"] },
  { q: "How do I contact support?", a: "You can reach our support team by clicking on this chat or emailing us at support@trainly.com. We're available 24/7!", keywords: ["support", "contact", "help", "email", "chat", "help"] },
  { q: "Can I download videos for offline viewing?", a: "Currently, videos are streaming-only to protect content. However, you can access all course materials and resources offline after downloading.", keywords: ["download", "offline", "save", "mobile"] },
  { q: "How long do I have access to courses?", a: "Once enrolled, you have lifetime access to all purchased courses! You can learn at your own pace anytime, anywhere.", keywords: ["lifetime", "access", "forever", "long", "permanent", "expire"] },
]

const nlpRespond = (input) => {
  const normalizedInput = input.toLowerCase()
  const words = normalizedInput.split(/\s+/).filter(w => w.length > 2)
  
  let bestMatch = null
  let highestScore = 0

  for (const faq of faqs) {
    let score = 0
    
    for (const word of words) {
      if (faq.keywords.some(kw => kw.includes(word) || word.includes(kw))) {
        score += 2
      }
      if (faq.q.toLowerCase().includes(word)) {
        score += 1
      }
    }
    
    if (faq.q.toLowerCase().includes(normalizedInput) || normalizedInput.includes(faq.q.toLowerCase().slice(0, 20))) {
      score += 5
    }

    if (score > highestScore) {
      highestScore = score
      bestMatch = faq
    }
  }

  if (highestScore >= 2) {
    return bestMatch.a
  }

  const fallbacks = [
    "I'm not sure I understood that. Could you rephrase? Or choose from the questions below?",
    "I didn't catch that. Try selecting a question from the options below!",
    "I'm here to help! Select a question from the list or try rephrasing.",
  ]
  return fallbacks[Math.floor(Math.random() * fallbacks.length)]
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSend = () => {
    if (!input.trim()) return
    
    const userMsg = { role: "user", content: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const response = nlpRespond(input)
      setIsTyping(false)
      setMessages(prev => [...prev, { role: "bot", content: response }])
    }, 600 + Math.random() * 400)
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFaqClick = (faq) => {
    setMessages(prev => [...prev, { role: "user", content: faq.q }])
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { role: "bot", content: faq.a }])
    }, 500)
  }

  const resetChat = () => {
    setMessages([])
  }

  return (
    <>
      <style>{`
        .chatbot-fade-in {
          animation: chatFadeIn 0.3s ease-out forwards;
        }
        @keyframes chatFadeIn {
          from { opacity: 0; transform: scale(0.9) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .chatbot-slide-up {
          animation: chatSlideUp 0.3s ease-out forwards;
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .typing-dot {
          animation: typingBounce 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: #f1f1f1; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}</style>
      
      <div className="fixed bottom-6 right-6 z-50">
        {isOpen && (
          <div className="chatbot-fade-in mb-4 w-[380px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-base">Trainly AI Assistant</h3>
                  <p className="text-blue-100 text-xs">Powered by Trainly</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={resetChat} className="text-white/60 hover:text-white text-xs hover:bg-white/10 px-2 py-1 rounded transition">
                  Clear
                </button>
                <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="h-[420px] flex flex-col">
              <div className="flex-1 p-4 overflow-y-auto scrollbar-thin bg-gray-50/50 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="text-gray-800 font-semibold mb-2">Ask me anything!</h4>
                    <p className="text-gray-500 text-sm mb-4">Type your question or choose below</p>
                    <div className="flex flex-wrap gap-2 justify-center px-2">
                      {faqs.slice(0, 4).map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleFaqClick(item)}
                          className="px-3 py-2 text-xs font-medium bg-white text-gray-600 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition"
                        >
                          {item.q.length > 25 ? item.q.substring(0, 25) + '...' : item.q}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <div key={index} className={`chatbot-slide-up flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-indigo-100'}`}>
                          {msg.role === 'user' ? (
                            <span className="text-white text-xs font-bold">{String.fromCharCode(65)}</span>
                          ) : (
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                          )}
                        </div>
                        <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-blue-600 text-white rounded-tr-md' 
                            : 'bg-white shadow-sm border border-gray-100 rounded-tl-md'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="chatbot-slide-up flex gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-md shadow-sm border border-gray-100 flex items-center gap-2">
                          <div className="flex gap-1">
                            <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></span>
                            <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></span>
                            <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full"></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              <div className="p-3 bg-white border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your question..."
                    className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-1 max-h-[80px] overflow-y-auto scrollbar-thin">
                  <span className="text-xs text-gray-400 w-full mb-1">Quick questions:</span>
                  {faqs.slice(0, 6).map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleFaqClick(item)}
                      className="px-2 py-1 text-xs font-medium rounded-md bg-gray-50 text-gray-600 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition"
                    >
                      {item.q.length > 25 ? item.q.substring(0, 25) + '..' : item.q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center ${isOpen ? '' : 'hover:scale-110'}`}
        >
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <Sparkles className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
            </>
          )}
        </button>
      </div>
    </>
  )
}

export default ChatBot