// Dummy responses for testing UI
const dummyResponses = [
    "That's an interesting question! Let me help you with that.",
    "I understand what you're looking for. Here's what I think...",
    "Great question! Based on what you've asked, I'd suggest...",
    "I can definitely help you with that. Here's my response...",
    "That's a common question, and here's what I recommend...",
    "I see what you're getting at. Let me provide some insights...",
    "Thanks for asking! Here's a detailed answer to your question...",
    "I'd be happy to help you understand this better. Here's my take...",
    "That's a thoughtful question. Let me break it down for you...",
    "I can provide some guidance on that topic. Here's what I think..."
];

// Q&A Database for the AI assistant
const qa_database = [
    {
        keywords: ["hello", "hi", "hey", "greetings"],
        answer: "Hello there! I am YRX3246, the AI assistant for this portfolio. How may I be of service to you today?",
        shortAnswer: "Hi! How can I help?"
    },
    {
        keywords: ["skills", "technologies", "stack", "tech", "programming"],
        answer: "The creator of this portfolio is proficient in a modern technology stack, including JavaScript (React, Node.js) for front-end and back-end development, Python (Django) for server-side logic, and various databases like PostgreSQL and MongoDB for data management.",
        shortAnswer: "Skills: JS (React, Node), Python (Django), SQL/NoSQL."
    },
    {
        keywords: ["projects", "work", "portfolio", "showcase"],
        answer: "You'll find a curated selection of projects on this website. A notable example is the 'E-commerce Platform,' a full-stack application demonstrating expertise in both user interface design and complex backend functionality.",
        shortAnswer: "Projects are listed on the site. See the E-commerce platform."
    },
    {
        keywords: ["experience", "background", "career", "professional"],
        answer: "With over 5 years in the field, the experience spans from junior development roles to handling significant features in large-scale applications. This journey at companies like TechSolutions Inc. has provided a robust and diverse skill set.",
        shortAnswer: "5+ years of experience, from junior to senior tasks."
    },
    {
        keywords: ["contact", "email", "hire", "reach", "get in touch"],
        answer: "For professional inquiries, collaborations, or hiring opportunities, you can establish contact via email at portfolio.owner@email.com. A swift response is guaranteed.",
        shortAnswer: "Email at portfolio.owner@email.com."
    },
    {
        keywords: ["thank you", "thanks", "appreciate"],
        answer: "You are most welcome. It is my pleasure to assist. Is there any other information I can provide for you?",
        shortAnswer: "You're welcome!"
    },
    {
        keywords: ["bye", "goodbye", "see you", "farewell"],
        answer: "Farewell. Thank you for interacting with this portfolio's AI assistant. Have a productive day.",
        shortAnswer: "Goodbye!"
    },
    {
        keywords: ["about", "who", "developer", "creator"],
        answer: "This portfolio belongs to a passionate full-stack developer with expertise in modern web technologies. They specialize in creating scalable applications and have a strong background in both frontend and backend development.",
        shortAnswer: "Full-stack developer with modern web expertise."
    },
    {
        keywords: ["education", "degree", "study", "university"],
        answer: "The developer holds a Computer Science degree and continuously updates their skills through online courses and certifications in emerging technologies.",
        shortAnswer: "CS degree + continuous learning."
    }
];

// Function to find the best answer based on keywords
function findAnswer(question) {
    const lowerCaseQuestion = question.toLowerCase();
    let bestMatch = { 
        score: 0, 
        answer: "My apologies, I do not have sufficient data to respond to that query. Please try rephrasing, or browse the portfolio sections for more information.",
        shortAnswer: "Sorry, I don't understand. Try rephrasing?"
    };

    qa_database.forEach(qa => {
        let currentScore = qa.keywords.reduce((acc, keyword) => 
            lowerCaseQuestion.includes(keyword) ? acc + 1 : acc, 0);

        if (currentScore > bestMatch.score) {
            bestMatch = { 
                score: currentScore, 
                answer: qa.answer,
                shortAnswer: qa.shortAnswer 
            };
        }
    });

    // Return short answer if short mode is enabled
    return shortMode && bestMatch.shortAnswer ? bestMatch.shortAnswer : bestMatch.answer;
}

// Additional utility functions
function getRandomGreeting() {
    const greetings = [
        "Hello! How can I assist you today?",
        "Hi there! What would you like to know?",
        "Greetings! I'm here to help.",
        "Welcome! Feel free to ask me anything."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
}

function getRandomResponse() {
    const responses = [
        "That's an interesting question! Let me help you with that.",
        "I understand what you're looking for. Here's what I think...",
        "Great question! Based on what you've asked, I'd suggest...",
        "I can definitely help you with that. Here's my response...",
        "That's a common question, and here's what I recommend..."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
}

// Additional dummy data for chat history
const chatHistory = [
    "Previous conversation about...",
    "How to create a website",
    "JavaScript tips and tricks",
    "CSS Grid Tutorial",
    "React Best Practices",
    "Node.js Development",
    "Database Design Patterns",
    "API Development Guide"
];