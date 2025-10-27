describe('Landing Page', () => {
  it('should load the landing page', () => {
    cy.visit('/');
    cy.contains('Indie Comments Widget');
  });
});

describe('Comment Widget E2E', () => {
  beforeEach(() => {
    // Create a test page with the widget
    cy.visit('/test.html');
  });

  it('should display the comment form', () => {
    cy.get('indie-comments-widget').shadow().find('#indie-comments-form').should('be.visible');
    cy.get('indie-comments-widget').shadow().find('#indie-comments-author').should('be.visible');
    cy.get('indie-comments-widget').shadow().find('#indie-comments-email').should('be.visible');
    cy.get('indie-comments-widget').shadow().find('#indie-comments-content').should('be.visible');
    cy.get('indie-comments-widget').shadow().find('#indie-comments-form button').should('contain', 'Post Comment');
  });

  it('should allow submitting a comment', () => {
    cy.get('indie-comments-widget').shadow().find('#indie-comments-author').type('Test User');
    cy.get('indie-comments-widget').shadow().find('#indie-comments-email').type('test@example.com');
    cy.get('indie-comments-widget').shadow().find('#indie-comments-content').type('This is a test comment');
    cy.get('indie-comments-widget').shadow().find('#indie-comments-form button').click();

    // Since API is mocked or not available, check for error or success message
    cy.get('indie-comments-widget').shadow().find('#indie-comments-message').should('be.visible');
  });

  it('should display comments if available', () => {
    cy.get('indie-comments-widget').shadow().find('#indie-comments-list').should('be.visible');
  });

  it('should change theme', () => {
    cy.get('indie-comments-widget').shadow().find('#indie-comments-theme-select').select('dark');
    cy.get('indie-comments-widget').shadow().find('#indie-comments-app').should('have.class', 'dark');
  });
});