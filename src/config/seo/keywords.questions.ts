/**
 * SEO Keywords Configuration - Question-Based Keywords
 * For People Also Ask (PAA) and featured snippets
 */

export const QUESTION_KEYWORDS = {
    // What questions
    what: [
        'what is business process optimization',
        'what is digital transformation in manufacturing',
        'what is lean consulting',
        'what is data-driven consulting',
        'what does a management consultant do',
    ],

    // How questions
    how: [
        'how to implement digital transformation',
        'how to improve manufacturing efficiency',
        'how to reduce operational costs',
        'how to optimize business processes',
        'how to choose a consulting firm India',
    ],

    // Why questions
    why: [
        'why hire a management consultant',
        'why is process optimization important',
        'why use data analytics in business',
        'why digital transformation matters',
    ],

    // When questions
    when: [
        'when to hire a business consultant',
        'when to implement lean manufacturing',
        'when to use data visualization',
    ],

    // Which/Best questions (commercial intent)
    best: [
        'best consulting firms in India',
        'best business consultants Gujarat',
        'best process optimization tools',
        'best practices for digital transformation',
    ],
} as const;

/**
 * Get all question keywords as flat array
 */
export function getAllQuestionKeywords(): string[] {
    return Object.values(QUESTION_KEYWORDS).flat();
}

/**
 * Get FAQ-ready question/answer pairs for schema
 */
export const FAQ_CONTENT = [
    {
        question: 'What is business process optimization?',
        answer: 'Business process optimization involves analyzing and improving organizational workflows to increase efficiency, reduce costs, and enhance overall performance through data-driven methodologies like Lean and Six Sigma.',
    },
    {
        question: 'How can digital transformation help my business?',
        answer: 'Digital transformation modernizes operations through automation, data analytics, and smart technologies, resulting in improved efficiency, better decision-making, and competitive advantage in your industry.',
    },
    {
        question: 'Why should I hire a management consultant in India?',
        answer: 'Management consultants bring specialized expertise, fresh perspectives, and proven methodologies to solve complex business challenges, helping you achieve faster results and avoid costly mistakes.',
    },
    {
        question: 'What industries do VR NextGen Solutions serve?',
        answer: 'We serve pharmaceutical, healthcare, manufacturing, retail, financial services, education, IT, and industrial sectors with tailored consulting solutions for each industry.',
    },
] as const;
