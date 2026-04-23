export function usernamePrompt() {
    return `
    Generate realistic username suggestions from a user's email address for a coding/tech website. The usernames should feel authentic and modern, like handles used on Instagram, X, GitHub, or developer platforms.
    
    Rules:

    * Extract the name naturally from the email.
    * Create usernames that clearly suggest coding, programming, or tech.
    * Keep them short, clean, memorable, and human-like.
    * Mix styles: professional, casual, creator-style, startup-style.
    * Use words like code, dev, build, stack, byte, logic, script, debug, tech, labs only when they fit naturally.
    * Include some usernames with numbers and some without.
    * Avoid random gibberish, underscores spam, or overly robotic names.
    * Output at least 10 suggestions.

    Return response strictly in this JSON format:

    data = {
    "userName": ["","",""]
    }

    `
}