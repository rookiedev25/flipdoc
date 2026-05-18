import { createContext, useContext, useState, useCallback, useMemo } from 'react'

const ConversionContext = createContext(null)

export function ConversionProvider({ children }) {
  const [conversionState, setConversionState] = useState({
    file: null,
    options: {
      generateYaml: true,
      splitByHeadings: true,
      cleanMarkdown: true,
    },
    result: null,
    status: 'idle', // idle, processing, completed, error
    progress: {
      step: '',
      percentage: 0,
      message: '',
    },
    error: null,
  })

  const setFile = useCallback((file) => {
    setConversionState((prev) => ({
      ...prev,
      file,
      result: null,
      status: 'idle',
      error: null,
    }))
  }, [])

  const setOptions = useCallback((options) => {
    setConversionState((prev) => ({
      ...prev,
      options: { ...prev.options, ...options },
    }))
  }, [])

  const updateProgress = useCallback((step, percentage, message) => {
    setConversionState((prev) => ({
      ...prev,
      status: 'processing',
      progress: { step, percentage, message },
    }))
  }, [])

  const setResult = useCallback((result) => {
    setConversionState((prev) => ({
      ...prev,
      result,
      status: 'completed',
      progress: { step: 'complete', percentage: 100, message: 'Conversion complete!' },
    }))
  }, [])

  const setError = useCallback((error) => {
    setConversionState((prev) => ({
      ...prev,
      error,
      status: 'error',
    }))
  }, [])

  const reset = useCallback(() => {
    setConversionState({
      file: null,
      options: {
        generateYaml: true,
        splitByHeadings: true,
        cleanMarkdown: true,
      },
      result: null,
      status: 'idle',
      progress: {
        step: '',
        percentage: 0,
        message: '',
      },
      error: null,
    })
  }, [])

  return (
    <ConversionContext.Provider
      value={{
        ...conversionState,
        setFile,
        setOptions,
        updateProgress,
        setResult,
        setError,
        reset,
      }}
    >
      {children}
    </ConversionContext.Provider>
  )
}

export function useConversion() {
  const context = useContext(ConversionContext)
  if (!context) {
    throw new Error('useConversion must be used within a ConversionProvider')
  }
  return context
}
