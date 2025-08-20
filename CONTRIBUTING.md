# Contributing to AlloyMind AI

Thank you for your interest in contributing to AlloyMind AI! This document provides guidelines and instructions for contributing to the project.

## 🤝 Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please read and follow our Code of Conduct.

## 🛠️ Development Setup

### Prerequisites

- Node.js 18.0+
- Python 3.10+
- MongoDB 6.0+
- Git

### Setting up the Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/AlloyMindAI_SakthiHackathon.git
   cd AlloyMindAI_SakthiHackathon
   ```

2. **Frontend Setup**
   ```bash
   npm install
   cp .env.example .env.local
   # Configure your environment variables
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd Backend
   python -m venv alloy_env
   source alloy_env/bin/activate  # Windows: alloy_env\Scripts\activate
   pip install -r requirements.txt
   python main.py
   ```

## 📋 How to Contribute

### Reporting Issues

Before creating an issue, please:

1. **Search existing issues** to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details
   - Screenshots/logs if applicable

### Suggesting Features

We welcome feature suggestions! Please:

1. **Check existing feature requests** first
2. **Use the feature request template**
3. **Explain the use case** and benefits
4. **Consider implementation complexity**

### Submitting Pull Requests

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow coding standards
   - Add tests for new functionality
   - Update documentation as needed

3. **Test your changes**
   ```bash
   # Frontend tests
   npm run test
   npm run lint
   
   # Backend tests
   cd Backend
   python -m pytest tests/
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### Frontend (TypeScript/React)

- Use **TypeScript** for all new code
- Follow **ESLint** configuration
- Use **Prettier** for code formatting
- Follow **React best practices**
- Use **semantic HTML** elements
- Implement **responsive design**

### Backend (Python)

- Follow **PEP 8** style guide
- Use **type hints** for function parameters and returns
- Write **docstrings** for functions and classes
- Use **async/await** for I/O operations
- Implement **proper error handling**

### Git Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

Examples:
```
feat(api): add alloy prediction endpoint
fix(ui): resolve dashboard loading issue
docs(readme): update installation instructions
```

## 🧪 Testing Guidelines

### Frontend Testing

- Write **unit tests** for utilities and hooks
- Write **component tests** for UI components
- Write **integration tests** for API interactions
- Use **Jest** and **React Testing Library**

### Backend Testing

- Write **unit tests** for business logic
- Write **integration tests** for API endpoints
- Write **model tests** for ML predictions
- Use **pytest** framework

### Test Coverage

- Maintain **minimum 80%** test coverage
- Focus on **critical business logic**
- Test **error scenarios** and edge cases

## 📁 Project Structure Guidelines

### Frontend Organization

```
app/
├── (auth)/           # Authentication routes
├── dashboard/        # Protected dashboard routes
├── api/             # API route handlers
└── globals.css      # Global styles

components/
├── ui/              # Reusable UI components
└── [feature]/       # Feature-specific components

lib/
├── services/        # API service layers
├── utils.ts         # Utility functions
└── mongodb.ts       # Database connection

types/               # TypeScript type definitions
hooks/               # Custom React hooks
```

### Backend Organization

```
Backend/
├── main.py          # FastAPI application
├── models/          # ML model files
├── cli/             # Command-line interfaces
├── tests/           # Test files
└── datasets/        # Training data
```

## 🚀 Release Process

### Version Management

We use **Semantic Versioning** (SemVer):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist

1. Update version numbers
2. Update CHANGELOG.md
3. Run full test suite
4. Update documentation
5. Create release notes
6. Tag the release

## 🏷️ Labels and Milestones

### Issue Labels

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to docs
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

### Priority Labels

- `priority/high`: High priority
- `priority/medium`: Medium priority
- `priority/low`: Low priority

## 💬 Communication

### Getting Help

- **GitHub Discussions**: For questions and discussions
- **GitHub Issues**: For bug reports and feature requests
- **Email**: support@alloymind.ai for private matters

### Community Guidelines

- Be respectful and inclusive
- Provide constructive feedback
- Help newcomers get started
- Share knowledge and expertise

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

## 📜 License

By contributing to AlloyMind AI, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AlloyMind AI! Together, we're building the future of intelligent metallurgy. 🧬
