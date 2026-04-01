import { Component } from 'react'
import type { ReactNode, ErrorInfo } from 'react'
import { RotateCcw } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Maheel] Error caught by boundary:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div
          className="flex flex-col items-center justify-center min-h-[60dvh] px-8 text-center"
          dir="rtl"
        >
          <div className="w-16 h-16 rounded-full bg-prayer-missed/10 flex items-center justify-center mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-lg font-bold text-text dark:text-white mb-2">حدث خطأ غير متوقع</h2>
          <p className="text-sm text-text-muted mb-6 leading-relaxed">
            نعتذر عن هذا الخطأ. يمكنك المحاولة مرة أخرى.
          </p>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-medium text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            حاول مرة أخرى
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
