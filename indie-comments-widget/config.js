/**
 * Indie Comments Widget Configuration
 * This file contains the default configuration for the Indie Comments Widget
 */

const IndieCommentsConfig = {
    // API Configuration
    apiBaseUrl: 'http://localhost:8000',
    apiVersion: 'v1',
    
    // Widget Configuration
    defaultThreadId: window.location.pathname,
    containerId: 'indie-comments-container',
    
    // UI Configuration
    theme: 'default', // Options: default, dark, matrix, neocities
    commentsPerPage: 10,
    nestedRepliesLimit: 3,
    
    // Feature Flags
    enableModeration: true,
    enableNotifications: false,
    enableMarkdown: true
};

// Don't modify this export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IndieCommentsConfig;
}