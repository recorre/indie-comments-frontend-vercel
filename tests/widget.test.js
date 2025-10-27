// Import the widget
const { IndieCommentsWidget } = require('../indie-comments-widget/widget.js');

describe('IndieCommentsWidget', () => {
  let widget;

  beforeEach(() => {
    // Reset fetch mock
    fetch.mockClear();
    // Create a new widget instance
    widget = new IndieCommentsWidget();
    // Mock render to prevent DOM issues
    widget.render = jest.fn();
  });

  afterEach(() => {
    // Clean up
    if (widget.shadow) {
      widget.shadow.innerHTML = '';
    }
  });

  test('should initialize with default values', () => {
    expect(widget.threadId).toBe('/');
    expect(widget.apiBaseUrl).toBe('http://localhost:8000');
    expect(widget.containerId).toBe('indie-comments-container');
    expect(widget.moderationEnabled).toBe(false);
    expect(widget.comments).toEqual([]);
    expect(widget.currentTheme).toBe('default');
  });

  test('should set attributes from element', () => {
    const element = document.createElement('div');
    element.setAttribute('thread-id', 'test-thread');
    element.setAttribute('api-base-url', 'https://api.example.com');

    // Simulate getAttribute
    widget = Object.create(IndieCommentsWidget.prototype);
    widget.getAttribute = (attr) => element.getAttribute(attr);
    widget.constructor.call(widget);

    expect(widget.threadId).toBe('test-thread');
    expect(widget.apiBaseUrl).toBe('https://api.example.com');
  });

  test('should render the widget structure', () => {
    widget.render();

    expect(widget.shadow.innerHTML).toContain('<h3>Comments</h3>');
    expect(widget.shadow.innerHTML).toContain('indie-comments-form');
    expect(widget.shadow.innerHTML).toContain('indie-comments-list');
    expect(widget.shadow.innerHTML).toContain('indie-comments-theme-select');
  });

  test('should load comments successfully', async () => {
    const mockComments = [
      { id: 1, author_name: 'Test User', content: 'Test comment', created_at: '2023-01-01T00:00:00Z' }
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ comments: mockComments })
    });

    await widget.loadComments();

    expect(fetch).toHaveBeenCalledWith(`${widget.apiBaseUrl}/api/v1/comments/${widget.threadId}`);
    expect(widget.comments).toEqual(mockComments);
  });

  test('should handle loadComments error', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'));

    await widget.loadComments();

    expect(widget.comments).toEqual([]);
    expect(console.error).toHaveBeenCalledWith('Error loading comments:', expect.any(Error));
  });

  test('should submit comment successfully', async () => {
    const commentData = {
      author_name: 'Test User',
      author_email: 'test@example.com',
      content: 'Test comment'
    };
    const mockResponse = { id: 1, ...commentData };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });

    const result = await widget.submitComment(commentData);

    expect(fetch).toHaveBeenCalledWith(`${widget.apiBaseUrl}/api/v1/comments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: widget.threadId, ...commentData })
    });
    expect(result).toEqual(mockResponse);
    expect(widget.comments).toEqual([mockResponse]);
  });

  test('should handle submitComment error', async () => {
    const commentData = { author_name: 'Test', content: 'Test' };
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ detail: 'Validation error' })
    });

    await expect(widget.submitComment(commentData)).rejects.toThrow('Validation error');
  });

  test('should format date correctly', () => {
    const dateString = '2023-01-01T12:00:00Z';
    const formatted = widget.formatDate(dateString);

    expect(formatted).toMatch(/1\/1\/2023/); // Date format
    expect(formatted).toMatch(/12:00/); // Time format
  });

  test('should render comment correctly', () => {
    const comment = {
      author_name: 'Test User',
      content: 'Test content',
      created_at: '2023-01-01T12:00:00Z'
    };

    const rendered = widget.renderComment(comment);

    expect(rendered.className).toBe('indie-comments-comment level-0');
    expect(rendered.innerHTML).toContain('Test User');
    expect(rendered.innerHTML).toContain('Test content');
    expect(rendered.innerHTML).toContain('1/1/2023');
  });

  test('should clear form', () => {
    // Mock form in shadow DOM
    const mockForm = { reset: jest.fn() };
    widget.shadow = { querySelector: jest.fn().mockReturnValue(mockForm) };

    widget.clearForm();

    expect(mockForm.reset).toHaveBeenCalled();
  });

  test('should show message', () => {
    const mockMessageEl = {
      textContent: '',
      className: '',
      style: { display: '' }
    };
    widget.shadow = { querySelector: jest.fn().mockReturnValue(mockMessageEl) };

    widget.showMessage('Success!');

    expect(mockMessageEl.textContent).toBe('Success!');
    expect(mockMessageEl.className).toBe('indie-comments-message success');
  });

  test('should show error', () => {
    const mockMessageEl = {
      textContent: '',
      className: ''
    };
    widget.shadow = { querySelector: jest.fn().mockReturnValue(mockMessageEl) };

    widget.showError('Error occurred');

    expect(mockMessageEl.textContent).toBe('Error occurred');
    expect(mockMessageEl.className).toBe('indie-comments-message error');
  });
});