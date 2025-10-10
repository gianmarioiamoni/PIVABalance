# 🤝 Contributing to P.IVA Balance

Thank you for your interest in contributing to P.IVA Balance! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Accessibility](#accessibility)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)

## 📜 Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Git knowledge
- TypeScript and React experience
- Understanding of Next.js 15

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/PIVABalance.git
   cd PIVABalance
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/gianmarioiamoni/PIVABalance.git
   ```
4. **Install dependencies**:
   ```bash
   pnpm install
   ```
5. **Set up environment**:
   ```bash
   cp env.example .env.local
   # Configure your environment variables
   ```
6. **Start development server**:
   ```bash
   pnpm dev
   ```

## 🔄 Development Workflow

### Branch Strategy

- **`main`** - Production branch (protected, maintainer only)
- **`develop`** - Integration branch (where PRs are merged)
- **`feature/your-feature-name`** - Your feature branch

### Workflow Steps

1. **Sync with upstream**:
   ```bash
   git checkout develop
   git pull upstream develop
   ```
2. **Create feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** following our coding standards
4. **Test thoroughly** (unit tests, accessibility, mobile)
5. **Commit with conventional commits**:
   ```bash
   git commit -m "feat: add new dashboard widget"
   ```
6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create Pull Request** to `develop` branch

### Conventional Commits

We use conventional commits for clear history:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding/updating tests
- `chore:` - Maintenance tasks

## 💻 Coding Standards

### TypeScript

- **No `any` types** - Use proper typing
- **Interfaces over types** for object shapes
- **Functional components** with TypeScript
- **Proper error handling** with try/catch

### React/Next.js

- **Server Components first** - Use 'use client' only when necessary
- **SOLID principles** - Single Responsibility Principle
- **Component composition** over inheritance
- **Hooks for state management** - useSWR for data fetching

### Styling

- **Tailwind CSS** - Use design system classes
- **Mobile-first** responsive design
- **Accessibility** - WCAG 2.1 AA compliance
- **Dark mode support** - All components must support themes

### File Structure

```
src/
├── app/                 # Next.js 15 app directory
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   ├── common/         # Common components
│   └── [feature]/      # Feature-specific components
├── hooks/              # Custom hooks
├── lib/                # Utilities and configurations
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## 🧪 Testing

### Required Tests

- **Unit tests** for utilities and hooks
- **Component tests** for UI components
- **Integration tests** for complex features
- **Accessibility tests** for WCAG compliance

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run accessibility tests
pnpm test -- __tests__/accessibility/

# Check test coverage
pnpm test:coverage
```

### Test Requirements

- **Minimum 80% coverage** for new code
- **Accessibility tests** for interactive components
- **Mobile testing** for responsive components
- **Error boundary testing** for error handling

## ♿ Accessibility

This project maintains **WCAG 2.1 AA compliance**. All contributions must:

### Requirements

- **Semantic HTML** - Use proper HTML elements
- **ARIA attributes** - Add when semantic HTML isn't enough
- **Keyboard navigation** - All interactive elements accessible via keyboard
- **Screen reader support** - Test with screen readers
- **Color contrast** - Minimum 4.5:1 ratio
- **Focus indicators** - Visible focus states
- **Alt text** - Descriptive text for images

### Testing Accessibility

```bash
# Run accessibility tests
pnpm test -- __tests__/accessibility/wcag-compliance.test.tsx

# Manual testing checklist:
# - Tab navigation works
# - Screen reader announces content correctly
# - Color contrast meets AA standards
# - Focus indicators are visible
# - Zoom to 200% maintains functionality
```

## 📝 Pull Request Process

### Before Submitting

1. **Sync with develop**: `git pull upstream develop`
2. **Run tests**: `pnpm test`
3. **Check linting**: `pnpm lint`
4. **Test accessibility**: Manual and automated testing
5. **Test mobile**: Responsive design verification

### PR Requirements

- **Target `develop` branch** - Never PR directly to main
- **Clear description** - What, why, and how
- **Link related issues** - Use "Fixes #123" syntax
- **Add screenshots** - For UI changes
- **Update documentation** - If needed
- **Add tests** - For new functionality

### Review Process

1. **Automated checks** must pass (CI/CD, tests, linting)
2. **Code review** by maintainer
3. **Accessibility review** if applicable
4. **Mobile testing** verification
5. **Merge to develop** after approval

### After Merge

- **Delete feature branch** from your fork
- **Sync with upstream** for next contribution

## 🐛 Issue Reporting

### Before Creating an Issue

1. **Search existing issues** - Avoid duplicates
2. **Check documentation** - Issue might be documented
3. **Test in latest version** - Ensure issue still exists

### Issue Types

- **🐛 Bug Report** - Something isn't working
- **✨ Feature Request** - New functionality
- **📚 Documentation** - Improvements needed
- **❓ Question** - Need help or clarification

### Good Issue Reports Include

- **Clear title** - Descriptive and specific
- **Steps to reproduce** - For bugs
- **Expected vs actual behavior** - What should happen vs what happens
- **Environment details** - Browser, OS, device
- **Screenshots/videos** - Visual issues
- **Possible solutions** - If you have ideas

## 🏆 Recognition

Contributors are recognized in:

- **README.md** - Contributors section
- **Release notes** - Feature credits
- **GitHub contributors** - Automatic recognition

## 📞 Getting Help

- **GitHub Discussions** - General questions and ideas
- **Issues** - Bug reports and feature requests
- **Email** - For security issues: [security@example.com]

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

Thank you for contributing to P.IVA Balance! 🚀
