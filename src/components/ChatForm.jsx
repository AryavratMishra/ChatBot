import { useRef } from "react";

const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    inputRef.current.value = "";

    // Add the user message to history
    setChatHistory((prev) => [
      ...prev,
      { role: "user", text: userMessage },
    ]);

    // Delay before bot thinking
    setTimeout(() => {
      // Add "Thinking..." placeholder
      setChatHistory((prev) => {
        const updated = [
          ...prev,
          { role: "model", text: "Thinking..." },
        ];

        // Now call bot with the FRESH history
        generateBotResponse([...updated]);

        return updated;
      });
    }, 600);
  };

  return (
    <form className="chat-form" onSubmit={handleFormSubmit}>
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        required
      />
      <button className="material-symbols-rounded">arrow_upward</button>
    </form>
  );
};

export default ChatForm;
