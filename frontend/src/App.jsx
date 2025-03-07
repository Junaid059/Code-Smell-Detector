"use client"

import React, { useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, AlertCircle, Check, Code, FileCode, Github, Twitter } from "lucide-react"
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

function App() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
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
      <header className="app-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="header-content"
        >
          <Code className="header-icon" />
          <h1 className="header-title">Code Smell Detector</h1>
        </motion.div>
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
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="file-upload-container">
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
            <span className="footer-title">Code Smell Detector</span>
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

