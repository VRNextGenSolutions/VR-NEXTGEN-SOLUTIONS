/**
 * SEO Keywords Configuration - Question-Based Keywords
 * For People Also Ask (PAA) and featured snippets
 */

export const QUESTION_KEYWORDS = {
    // What questions
    what: [],

    // How questions
    how: [],

    // Why questions
    why: [],

    // When questions
    when: [],

    // Which/Best questions (commercial intent)
    best: [],
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
