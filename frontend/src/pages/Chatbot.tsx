// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { Send, Bot, User } from "lucide-react";
// import { ScrollArea } from "@/components/ui/scroll-area";

// interface Message {
//   id: string;
//   text: string;
//   sender: "user" | "bot";
//   timestamp: Date;
// }

// const Chatbot = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "1",
//       text: "Hi! I'm your health assistant. Tell me your symptoms and I'll suggest remedies.",
//       sender: "bot",
//       timestamp: new Date(),
//     },
//   ]);
//   const [inputValue, setInputValue] = useState("");

//   const handleSend = () => {
//     if (!inputValue.trim()) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       text: inputValue,
//       sender: "user",
//       timestamp: new Date(),
//     };

//     setMessages((prev) => [...prev, userMessage]);
//     setInputValue("");

//     // Simulate bot response - replace with your modal
//     setTimeout(() => {
//       const botMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         text: "I've received your symptoms. Let me analyze and suggest remedies...",
//         sender: "bot",
//         timestamp: new Date(),
//       };
//       setMessages((prev) => [...prev, botMessage]);
//     }, 1000);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="flex flex-col h-[calc(100vh-8rem)]">
//       <div className="mb-4">
//         <h2 className="text-2xl font-bold text-foreground mb-2">Health Assistant</h2>
//         <p className="text-muted-foreground">Describe your symptoms to get remedy suggestions</p>
//       </div>

//       <Card className="flex-1 flex flex-col overflow-hidden">
//         <ScrollArea className="flex-1 p-4">
//           <div className="space-y-4">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex gap-3 ${
//                   message.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 {message.sender === "bot" && (
//                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                     <Bot className="w-5 h-5 text-primary" />
//                   </div>
//                 )}
//                 <div
//                   className={`max-w-[75%] rounded-lg p-3 ${
//                     message.sender === "user"
//                       ? "bg-primary text-primary-foreground"
//                       : "bg-muted text-foreground"
//                   }`}
//                 >
//                   <p className="text-sm">{message.text}</p>
//                   <span className="text-xs opacity-70 mt-1 block">
//                     {message.timestamp.toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </span>
//                 </div>
//                 {message.sender === "user" && (
//                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
//                     <User className="w-5 h-5 text-secondary" />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </ScrollArea>

//         <div className="p-4 border-t bg-background">
//           <div className="flex gap-2">
//             <Input
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Describe your symptoms..."
//               className="flex-1"
//             />
//             <Button onClick={handleSend} size="icon">
//               <Send className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Chatbot;

// src/components/ChatBot.tsx
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { Send, Bot, User } from "lucide-react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { sendDirect, ChatHistoryItem } from "@/lib/sendDirect";

// interface Message {
//   id: string;
//   text: string;
//   sender: "user" | "bot";
//   timestamp: Date;
// }

// const Chatbot = () => {
//   const [messages, setMessages] = useState<Message[]>([
//     {
//       id: "1",
//       text: "Hi! I'm your health assistant. Tell me your symptoms and I'll suggest remedies.",
//       sender: "bot",
//       timestamp: new Date(),
//     },
//   ]);
//   const [inputValue, setInputValue] = useState("");
//   const [loading, setLoading] = useState(false);

//   const buildHistory = (): ChatHistoryItem[] =>
//     messages.map((m) => ({ role: m.sender, content: m.text }));

//   const handleSend = async () => {
//     if (!inputValue.trim() || loading) return;

//     const userMessage: Message = {
//       id: Date.now().toString(),
//       text: inputValue,
//       sender: "user",
//       timestamp: new Date(),
//     };

//     // add user message
//     setMessages((prev) => [...prev, userMessage]);
//     setInputValue("");
//     setLoading(true);

//     // add temporary bot "thinking" message
//     const tempBotId = `temp-${Date.now()}`;
//     const tempBotMessage: Message = {
//       id: tempBotId,
//       text: "Analyzing your symptoms...",
//       sender: "bot",
//       timestamp: new Date(),
//     };
//     setMessages((prev) => [...prev, tempBotMessage]);

//     try {
//       const history = buildHistory(); // includes user message we just pushed
//       const { reply } = await sendDirect(userMessage.text, history, { timeoutMs: 60000 });

//       const botMessage: Message = {
//         id: (Date.now() + 1).toString(),
//         text: reply || "No reply from model.",
//         sender: "bot",
//         timestamp: new Date(),
//       };

//       // replace temporary bot message with the real reply
//       setMessages((prev) => prev.map((m) => (m.id === tempBotId ? botMessage : m)));
//     } catch (err: any) {
//       const errorMessage: Message = {
//         id: (Date.now() + 2).toString(),
//         text:
//           err?.message?.includes("timed out")
//             ? "Request timed out. Please try again."
//             : `Error contacting model: ${err?.message ?? String(err)}`,
//         sender: "bot",
//         timestamp: new Date(),
//       };
//       setMessages((prev) => prev.map((m) => (m.id === tempBotId ? errorMessage : m)));
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   return (
//     <div className="flex flex-col h-[calc(100vh-8rem)]">
//       <div className="mb-4">
//         <h2 className="text-2xl font-bold text-foreground mb-2">Health Assistant</h2>
//         <p className="text-muted-foreground">Describe your symptoms to get remedy suggestions</p>
//       </div>

//       <Card className="flex-1 flex flex-col overflow-hidden">
//         <ScrollArea className="flex-1 p-4">
//           <div className="space-y-4">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
//               >
//                 {message.sender === "bot" && (
//                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
//                     <Bot className="w-5 h-5 text-primary" />
//                   </div>
//                 )}
//                 <div
//                   className={`max-w-[75%] rounded-lg p-3 ${
//                     message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
//                   }`}
//                 >
//                   <p className="text-sm">{message.text}</p>
//                   <span className="text-xs opacity-70 mt-1 block">
//                     {message.timestamp.toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </span>
//                 </div>
//                 {message.sender === "user" && (
//                   <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
//                     <User className="w-5 h-5 text-secondary" />
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </ScrollArea>

//         <div className="p-4 border-t bg-background">
//           <div className="flex gap-2">
//             <Input
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Describe your symptoms..."
//               className="flex-1"
//               disabled={loading}
//             />
//             <Button onClick={handleSend} size="icon" disabled={loading}>
//               <Send className="w-4 h-4" />
//             </Button>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Chatbot;

// src/pages/Chatbot.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendDirect, ChatHistoryItem } from "@/lib/sendDirect";

interface Message {
  id: string;
  text: string | Record<string, any>; // can be string or parsed object
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your health assistant. Tell me your symptoms and I'll suggest remedies.",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const buildHistory = (): ChatHistoryItem[] =>
    messages.map((m) => ({ role: m.sender, content: typeof m.text === "string" ? m.text : JSON.stringify(m.text) }));

  const tryParseJSON = (value: any) => {
    // if it's already an object, return it
    if (value && typeof value === "object") return value;
    if (typeof value !== "string") return null;
    // try parse
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") return parsed;
      return null;
    } catch {
      return null;
    }
  };

  const renderParsedResponse = (obj: Record<string, any>) => {
    const disease =
      obj.disease ?? obj.diagnosis ?? obj.condition ?? null;

    const symptomsUsed =
      obj.symptoms_used ?? obj.symptoms ?? obj.symptoms_list ?? [];

    const precautions =
      obj.precautions ??
      obj.recommendations ??
      obj.remedies ??
      obj.steps ??
      [];

    return (
      <div className="space-y-3">

        {/* Disease Name */}
        {disease && (
          <div>
            <p className="font-bold text-sm text-primary mb-1">Disease</p>
            <p className="text-sm">{disease}</p>
          </div>
        )}

        {/* Symptoms */}
        {Array.isArray(symptomsUsed) && symptomsUsed.length > 0 && (
          <div>
            <p className="font-bold text-sm text-primary mb-1">Symptoms Used</p>
            <div className="flex flex-wrap gap-2">
              {symptomsUsed.map((s: any, i: number) => (
                <span
                  key={i}
                  className="inline-block bg-secondary/70 text-secondary-foreground text-xs px-3 py-1 rounded-full"
                >
                  {String(s)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Precautions */}
        {Array.isArray(precautions) && precautions.length > 0 && (
          <div>
            <p className="font-bold text-sm text-primary mb-1">Recommended Remedies</p>
            <ul className="list-disc list-inside space-y-1">
              {precautions.map((p: any, i: number) => (
                <li key={i} className="text-sm">
                  {String(p)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Fallback: show any extra fields */}
        <div>
          {Object.keys(obj).length > 3 && (
            <details className="mt-2">
              <summary className="cursor-pointer text-xs opacity-60">
                View raw response
              </summary>
              <pre className="text-xs whitespace-pre-wrap mt-1">
                {JSON.stringify(obj, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  };

  const renderMessageContent = (textOrObj: string | Record<string, any>) => {
    const parsed = tryParseJSON(textOrObj);
    if (parsed) return renderParsedResponse(parsed);

    // fallback: plain text
    return <p className="text-sm">{String(textOrObj)}</p>;
  };

  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    // add user message
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    // add temporary bot "thinking" message
    const tempBotId = `temp-${Date.now()}`;
    const tempBotMessage: Message = {
      id: tempBotId,
      text: "Analyzing your symptoms...",
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, tempBotMessage]);

    try {
      const history = buildHistory(); // includes recent user message
      const { reply } = await sendDirect(userMessage.text as string, history, { timeoutMs: 60000 });

      // Attempt to parse reply as JSON object; store object if parse succeeds
      const parsed = tryParseJSON(reply);
      const botPayload: Message = {
        id: (Date.now() + 1).toString(),
        text: parsed ?? (reply ?? "No reply from model."),
        sender: "bot",
        timestamp: new Date(),
      };

      // replace temp bot with real reply
      setMessages((prev) => prev.map((m) => (m.id === tempBotId ? botPayload : m)));
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text:
          err?.message?.includes("timed out")
            ? "Request timed out. Please try again."
            : `Error contacting model: ${err?.message ?? String(err)}`,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => prev.map((m) => (m.id === tempBotId ? errorMessage : m)));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-foreground mb-2">Health Assistant</h2>
        <p className="text-muted-foreground">Describe your symptoms to get remedy suggestions</p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  {/* Render content: formatted JSON or plain text */}
                  {renderMessageContent(message.text)}
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {message.sender === "user" && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-secondary" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms..."
              className="flex-1"
              disabled={loading}
            />
            <Button onClick={handleSend} size="icon" disabled={loading}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Chatbot;

