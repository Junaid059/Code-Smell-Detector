"use client"

import React, { useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  AlertCircle,
  Check,
  Code,
  FileCode,
  Github,
  Twitter,
  Zap,
  Shield,
  Eye,
  Search,
  ArrowRight,
  Star,
  Cpu,
} from "lucide-react"
import "./App.css"

// Simple toast context
const ToastContext = React.createContext(null)

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = (toast) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, ...toast }])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
      <div className="toast-container">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={`toast ${toast.variant || "default"}`}
              initial={{ opacity: 0, y: 50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            >
              <div className="toast-content">
                {toast.title && <h4>{toast.title}</h4>}
                {toast.description && <p>{toast.description}</p>}
              </div>
              <button
                className="toast-close"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

function Button({ children, className, disabled, onClick, variant = "default", size = "default" }) {
  const baseClass = "button"
  const variantClass = `button-${variant}`
  const sizeClass = `button-${size}`
  const classes = [baseClass, variantClass, sizeClass, className].filter(Boolean).join(" ")

  return (
    <button className={classes} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  )
}

function Card({ children, className }) {
  return <div className={`card ${className || ""}`}>{children}</div>
}

function CardHeader({ children }) {
  return <div className="card-header">{children}</div>
}

function CardTitle({ children }) {
  return <h3 className="card-title">{children}</h3>
}

function CardDescription({ children }) {
  return <p className="card-description">{children}</p>
}

function CardContent({ children }) {
  return <div className="card-content">{children}</div>
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <motion.div
      className="feature-card"
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
    >
      <div className="feature-icon-wrapper">
        <Icon className="feature-icon" />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </motion.div>
  )
}

function App() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showAnalyzer, setShowAnalyzer] = useState(false)
  const { addToast } = useToast()

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
      setResult(null)
    }
  }

  const handleFileUpload = async () => {
    if (!file) {
      addToast({
        title: "No file selected",
        description: "Please select a file to analyze",
        variant: "destructive",
      })
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      setLoading(true)
      console.log("Uploading file:", file)
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setResult(response.data)

      if (response.data.smells && response.data.smells.length === 0) {
        addToast({
          title: "Analysis complete",
          description: "No code smells detected in your file!",
          variant: "default",
        })
      } else if (response.data.smells && response.data.smells.length > 0) {
        addToast({
          title: "Analysis complete",
          description: `Found ${response.data.smells.length} code smell${response.data.smells.length > 1 ? "s" : ""}`,
          variant: "default",
        })
      }
    } catch (error) {
      console.error("Error uploading file", error)
      addToast({
        title: "Error",
        description: "Failed to process file. Please try again.",
        variant: "destructive",
      })
      setResult(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-container">
      {!showAnalyzer ? (
        <div className="landing-page">
          <div className="landing-background">
            <div className="bg-circle circle-1"></div>
            <div className="bg-circle circle-2"></div>
            <div className="bg-circle circle-3"></div>
          </div>

          <header className="landing-header">
            <div className="landing-nav">
              <div className="logo">
                <Code className="logo-icon" />
                <span className="logo-text">CodeSniffer</span>
              </div>
              <div className="nav-links">
                <a href="#features" className="nav-link">
                  Features
                </a>
                <a href="#how-it-works" className="nav-link">
                  How It Works
                </a>
                <a href="#testimonials" className="nav-link">
                  Testimonials
                </a>
              </div>
              <Button className="nav-button" onClick={() => setShowAnalyzer(true)}>
                Start Analyzing
              </Button>
            </div>
          </header>

          <main className="landing-main">
            <section className="hero-section">
              <div className="hero-container">
                <motion.div
                  className="hero-content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="hero-badge">
                    <Star className="badge-icon" />
                    <span>Smart Code Analysis</span>
                  </div>
                  <h1 className="hero-title">
                    Elevate Your <span className="gradient-text">Code Quality</span> With Intelligent Analysis
                  </h1>
                  <p className="hero-subtitle">
                    Our advanced AI-powered tool detects code smells, anti-patterns, and potential bugs before they
                    impact your production environment.
                  </p>
                  <motion.div
                    className="hero-buttons"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  >
                    <Button className="hero-button" size="lg" onClick={() => setShowAnalyzer(true)}>
                      <Zap className="button-icon" />
                      Analyze Your Code
                    </Button>
                    <Button className="hero-button-secondary" variant="outline" size="lg">
                      <Search className="button-icon" />
                      Explore Features
                    </Button>
                  </motion.div>
                </motion.div>

                <motion.div
                  className="hero-image-container"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <div className="floating-elements">
                    <div className="floating-element element-1">
                      <Shield className="element-icon" />
                      <span>Bug Prevention</span>
                    </div>
                    <div className="floating-element element-2">
                      <Cpu className="element-icon" />
                      <span>Performance Boost</span>
                    </div>
                    <div className="floating-element element-3">
                      <Eye className="element-icon" />
                      <span>Code Clarity</span>
                    </div>
                  </div>

                  <div className="code-window">
                    <div className="code-window-header">
                      <div className="window-buttons">
                        <span className="window-button red"></span>
                        <span className="window-button yellow"></span>
                        <span className="window-button green"></span>
                      </div>
                      <div className="window-title">code-analysis.js</div>
                    </div>
                    <div className="code-window-content">
                      <pre className="code-block">
                        <code>
                          <span className="code-keyword">function</span>{" "}
                          <span className="code-function">analyzeCode</span>(code) {"{"}
                          <span className="code-comment">// Detect code smells</span>
                          <span className="code-keyword">const</span> smells = [];
                          <span className="code-keyword">if</span> (hasLongMethods(code)) {"{"}
                          smells.push({"{"}
                          type: <span className="code-string">"Long Method"</span>, details:{" "}
                          <span className="code-string">"Method too long"</span>
                          {"}"});
                          {"}"}
                          <span className="code-keyword">if</span> (hasDuplicateCode(code)) {"{"}
                          smells.push({"{"}
                          type: <span className="code-string">"Duplicate Code"</span>, details:{" "}
                          <span className="code-string">"Found similar patterns"</span>
                          {"}"});
                          {"}"}
                          <span className="code-keyword">return</span> smells;
                          {"}"}
                        </code>
                      </pre>
                    </div>
                    <div className="code-analysis-overlay">
                      <div className="analysis-item">
                        <AlertCircle className="analysis-icon" />
                        <div className="analysis-content">
                          <h4>Long Method Detected</h4>
                          <p>Consider breaking down into smaller functions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </section>

            <section className="stats-section">
              <div className="stats-container">
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Code Patterns Detected</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">10k+</div>
                  <div className="stat-label">Files Analyzed</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">98%</div>
                  <div className="stat-label">Accuracy Rate</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">24/7</div>
                  <div className="stat-label">Continuous Support</div>
                </div>
              </div>
            </section>

            <section id="features" className="features-section">
              <div className="section-header">
                <h2 className="section-title">Powerful Features</h2>
                <p className="section-subtitle">Everything you need to maintain clean, efficient code</p>
              </div>

              <div className="features-grid">
                <FeatureCard
                  icon={Zap}
                  title="Fast Analysis"
                  description="Get instant feedback on your code quality with our lightning-fast analysis engine."
                />
                <FeatureCard
                  icon={Shield}
                  title="Prevent Bugs"
                  description="Identify potential issues before they become bugs in production."
                />
                <FeatureCard
                  icon={Eye}
                  title="Improve Readability"
                  description="Make your code more maintainable and easier for others to understand."
                />
                <FeatureCard
                  icon={Search}
                  title="Deep Inspection"
                  description="Thorough analysis of your codebase to find hidden issues and anti-patterns."
                />
                <FeatureCard
                  icon={Cpu}
                  title="Performance Insights"
                  description="Identify bottlenecks and performance issues in your code."
                />
                <FeatureCard
                  icon={ArrowRight}
                  title="Actionable Suggestions"
                  description="Get clear recommendations on how to fix detected code smells."
                />
              </div>
            </section>

            <section id="how-it-works" className="how-it-works-section">
              <div className="section-header">
                <h2 className="section-title">How It Works</h2>
                <p className="section-subtitle">Three simple steps to better code quality</p>
              </div>

              <div className="steps-container">
                <div className="step-item">
                  <div className="step-number">1</div>
                  <h3 className="step-title">Upload Your Code</h3>
                  <p className="step-description">
                    Simply upload your code file or paste your code snippet into our analyzer.
                  </p>
                </div>
                <div className="step-connector"></div>
                <div className="step-item">
                  <div className="step-number">2</div>
                  <h3 className="step-title">Automated Analysis</h3>
                  <p className="step-description">
                    Our intelligent engine scans your code for smells, anti-patterns, and potential bugs.
                  </p>
                </div>
                <div className="step-connector"></div>
                <div className="step-item">
                  <div className="step-number">3</div>
                  <h3 className="step-title">Review Results</h3>
                  <p className="step-description">
                    Get detailed reports with actionable suggestions to improve your code quality.
                  </p>
                </div>
              </div>

              <div className="cta-container">
                <Button className="cta-button" size="lg" onClick={() => setShowAnalyzer(true)}>
                  Try It Now
                </Button>
              </div>
            </section>

            <section id="testimonials" className="testimonials-section">
              <div className="section-header">
                <h2 className="section-title">What Developers Say</h2>
                <p className="section-subtitle">Join thousands of satisfied developers</p>
              </div>

              <div className="testimonials-container">
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <p>
                      "This tool has completely transformed our code review process. We catch issues before they even
                      reach the review stage now."
                    </p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">JS</div>
                    <div className="author-info">
                      <div className="author-name">Jessica Smith</div>
                      <div className="author-title">Senior Developer at TechCorp</div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <p>
                      "I've been able to improve my coding habits significantly thanks to the detailed feedback from
                      CodeSniffer."
                    </p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">MJ</div>
                    <div className="author-info">
                      <div className="author-name">Michael Johnson</div>
                      <div className="author-title">Freelance Developer</div>
                    </div>
                  </div>
                </div>

                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <p>
                      "As a team lead, this tool has been invaluable for maintaining code quality standards across our
                      projects."
                    </p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">AP</div>
                    <div className="author-info">
                      <div className="author-name">Alex Patel</div>
                      <div className="author-title">Tech Lead at StartupX</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="final-cta-section">
              <div className="final-cta-container">
                <h2 className="final-cta-title">Ready to improve your code?</h2>
                <p className="final-cta-description">
                  Start analyzing your code now and see the difference in code quality.
                </p>
                <Button className="final-cta-button" size="lg" onClick={() => setShowAnalyzer(true)}>
                  Get Started Now
                  <ArrowRight className="button-icon-right" />
                </Button>
              </div>
            </section>
          </main>

          <footer className="app-footer">
            <div className="footer-content">
              <div className="footer-main">
                <div className="footer-branding">
                  <Code className="footer-logo" />
                  <span className="footer-logo-text">CodeSniffer</span>
                  <p className="footer-tagline">Elevate your code quality with intelligent analysis</p>
                </div>

                <div className="footer-links-container">
                  <div className="footer-links-column">
                    <h4 className="footer-links-title">Product</h4>
                    <a href="#" className="footer-link">
                      Features
                    </a>
                    <a href="#" className="footer-link">
                      Pricing
                    </a>
                    <a href="#" className="footer-link">
                      Integrations
                    </a>
                    <a href="#" className="footer-link">
                      Documentation
                    </a>
                  </div>

                  <div className="footer-links-column">
                    <h4 className="footer-links-title">Resources</h4>
                    <a href="#" className="footer-link">
                      Blog
                    </a>
                    <a href="#" className="footer-link">
                      Tutorials
                    </a>
                    <a href="#" className="footer-link">
                      Support
                    </a>
                    <a href="#" className="footer-link">
                      Community
                    </a>
                  </div>

                  <div className="footer-links-column">
                    <h4 className="footer-links-title">Company</h4>
                    <a href="#" className="footer-link">
                      About
                    </a>
                    <a href="#" className="footer-link">
                      Careers
                    </a>
                    <a href="#" className="footer-link">
                      Contact
                    </a>
                    <a href="#" className="footer-link">
                      Legal
                    </a>
                  </div>
                </div>
              </div>

              <div className="footer-bottom">
                <div className="footer-copyright">© 2023 CodeSniffer. All rights reserved.</div>

                <div className="footer-social">
                  <motion.a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="social-link"
                  >
                    <Github className="social-icon" />
                  </motion.a>
                  <motion.a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="social-link"
                  >
                    <Twitter className="social-icon" />
                  </motion.a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      ) : (
        <>
          <header className="app-header">
            <div className="header-content">
              <div className="logo" onClick={() => setShowAnalyzer(false)}>
                <Code className="logo-icon" />
                <span className="logo-text">CodeSniffer</span>
              </div>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="header-title">Code Smell Detector</h1>
              </motion.div>
            </div>
          </header>

          <main className="app-main">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="main-content"
            >
              <Card className="main-card">
                <CardHeader>
                  <CardTitle>Analyze Your Code</CardTitle>
                  <CardDescription>
                    Upload your code file to detect potential code smells and improve your codebase
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="card-body">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="file-upload-container"
                    >
                      <label className={`file-upload-label ${file ? "has-file" : ""}`}>
                        <div className="file-upload-content">
                          <AnimatePresence mode="wait">
                            {file ? (
                              <motion.div
                                key="file-selected"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="file-info"
                              >
                                <FileCode className="file-icon" />
                                <p className="file-name">{file.name}</p>
                                <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="no-file"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="upload-prompt"
                              >
                                <Upload className="upload-icon" />
                                <p className="upload-text">
                                  <span className="upload-bold">Click to upload</span> or drag and drop
                                </p>
                                <p className="upload-hint">Any code file (JS, TS, Java, Python, etc.)</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <input
                          type="file"
                          className="file-input"
                          onChange={handleFileChange}
                          accept=".js,.jsx,.ts,.tsx,.py,.java,.c,.cpp,.cs,.php,.rb"
                        />
                      </label>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button onClick={handleFileUpload} disabled={loading || !file} className="analyze-button">
                        {loading ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="loading-icon-container"
                          >
                            <Upload className="button-icon" />
                          </motion.div>
                        ) : (
                          <Upload className="button-icon" />
                        )}
                        {loading ? "Analyzing..." : "Analyze Code"}
                      </Button>
                    </motion.div>

                    <AnimatePresence>
                      {result && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Card className="results-card">
                            <CardHeader>
                              <CardTitle className="results-title">
                                <AlertCircle className="results-icon" />
                                Analysis Results
                              </CardTitle>
                            </CardHeader>
                            <div className="results-content">
                              {Array.isArray(result.smells) && result.smells.length > 0 ? (
                                <div className="smell-list">
                                  {result.smells.map((smell, index) => (
                                    <motion.div
                                      key={`${smell.type}-${index}`}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ delay: index * 0.1 }}
                                      className="smell-item"
                                    >
                                      <h3 className="smell-type">{smell.type}</h3>
                                      <p className="smell-details">{smell.details}</p>
                                    </motion.div>
                                  ))}
                                </div>
                              ) : (
                                <div className="no-smells">
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    className="success-icon-container"
                                  >
                                    <Check className="success-icon" />
                                  </motion.div>
                                  <h3 className="success-title">No code smells detected!</h3>
                                  <p className="success-message">Your code looks clean and well-structured.</p>
                                </div>
                              )}
                            </div>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </main>

          <footer className="app-footer">
            <div className="footer-content">
              <div className="footer-branding">
                <Code className="footer-icon" />
                <span className="footer-title">CodeSniffer</span>
              </div>

              <div className="footer-message">Improve your code quality with automated smell detection</div>

              <div className="footer-links">
                <motion.a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="footer-link"
                >
                  <Github className="social-icon" />
                  <span className="sr-only">GitHub</span>
                </motion.a>
                <motion.a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="footer-link"
                >
                  <Twitter className="social-icon" />
                  <span className="sr-only">Twitter</span>
                </motion.a>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}

function CodeSmellDetector() {
  return (
    <ToastProvider>
      <App />
    </ToastProvider>
  )
}

export default CodeSmellDetector

