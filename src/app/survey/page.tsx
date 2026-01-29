'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { FiHeart, FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi'

interface Question {
  id: string
  question: string
  type: 'scale' | 'multiChoice' | 'text'
  options?: string[]
  category: string
}

const scaleLabels = {
  1: 'Very Low',
  2: 'Low',
  3: 'Somewhat Low',
  4: 'Neutral',
  5: 'Somewhat Good',
  6: 'Good',
  7: 'Very Good',
}

const gradientColors = [
  'from-lavender-400 to-rose-400',
  'from-rose-400 to-peach-400',
  'from-peach-400 to-sage-400',
  'from-sage-400 to-sky-400',
  'from-sky-400 to-lavender-400',
]

export default function SurveyPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const res = await fetch('/api/survey/questions')
      const data = await res.json()
      setQuestions(data)
    } catch (error) {
      console.error('Failed to fetch questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const colorIndex = currentIndex % gradientColors.length

  const handleScaleSelect = (value: number) => {
    setAnswers({ ...answers, [currentQuestion.id]: value.toString() })
  }

  const handleMultiChoiceSelect = (option: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: option })
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Failed to submit survey:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-lavender-200 border-t-lavender-500 rounded-full animate-spin" />
      </div>
    )
  }

  const isLastQuestion = currentIndex === questions.length - 1
  const canProceed = answers[currentQuestion?.id]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradientColors[colorIndex]} flex items-center justify-center`}>
              <FiHeart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-lavender-800">Wellness Check-In</span>
          </div>
          <p className="text-lavender-600">
            Help us personalize your experience
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-lavender-600 mb-2">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-2 bg-white/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className={`h-full bg-gradient-to-r ${gradientColors[colorIndex]} rounded-full`}
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion?.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="glass rounded-3xl p-8 shadow-xl mb-8"
          >
            <h2 className="text-2xl font-semibold text-lavender-800 mb-8 text-center">
              {currentQuestion?.question}
            </h2>

            {/* Scale Question */}
            {currentQuestion?.type === 'scale' && (
              <div className="space-y-4">
                <div className="flex justify-between text-sm text-lavender-500 px-2">
                  <span>Not at all</span>
                  <span>Very much</span>
                </div>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5, 6, 7].map((value) => {
                    const isSelected = answers[currentQuestion.id] === value.toString()
                    return (
                      <motion.button
                        key={value}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleScaleSelect(value)}
                        className={`
                          w-12 h-12 rounded-full font-semibold transition-all scale-option
                          ${isSelected
                            ? `bg-gradient-to-br ${gradientColors[colorIndex]} text-white shadow-lg selected`
                            : 'bg-white/80 text-lavender-600 hover:bg-lavender-100'
                          }
                        `}
                      >
                        {value}
                      </motion.button>
                    )
                  })}
                </div>
                {answers[currentQuestion.id] && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-lavender-600 mt-4"
                  >
                    {scaleLabels[parseInt(answers[currentQuestion.id]) as keyof typeof scaleLabels]}
                  </motion.p>
                )}
              </div>
            )}

            {/* Multiple Choice Question */}
            {currentQuestion?.type === 'multiChoice' && currentQuestion.options && (
              <div className="space-y-3">
                {(JSON.parse(currentQuestion.options as any) as string[]).map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === option
                  return (
                    <motion.button
                      key={option}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => handleMultiChoiceSelect(option)}
                      className={`
                        w-full p-4 rounded-xl text-left transition-all flex items-center
                        ${isSelected
                          ? `bg-gradient-to-r ${gradientColors[colorIndex]} text-white shadow-lg`
                          : 'bg-white/80 text-lavender-700 hover:bg-lavender-50'
                        }
                      `}
                    >
                      <span className={`
                        w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center
                        ${isSelected ? 'border-white' : 'border-lavender-300'}
                      `}>
                        {isSelected && <FiCheck className="w-4 h-4" />}
                      </span>
                      {option}
                    </motion.button>
                  )
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`
              flex items-center px-6 py-3 rounded-xl font-medium transition-all
              ${currentIndex === 0
                ? 'opacity-50 cursor-not-allowed text-lavender-400'
                : 'glass text-lavender-700 hover:bg-white/80'
              }
            `}
          >
            <FiArrowLeft className="mr-2" />
            Previous
          </motion.button>

          {isLastQuestion ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!canProceed || submitting}
              className={`
                flex items-center px-8 py-3 rounded-xl font-semibold transition-all
                ${canProceed
                  ? `bg-gradient-to-r ${gradientColors[colorIndex]} text-white hover:shadow-lg btn-glow`
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Complete
                  <FiCheck className="ml-2" />
                </>
              )}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNext}
              disabled={!canProceed}
              className={`
                flex items-center px-8 py-3 rounded-xl font-semibold transition-all
                ${canProceed
                  ? `bg-gradient-to-r ${gradientColors[colorIndex]} text-white hover:shadow-lg btn-glow`
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              Next
              <FiArrowRight className="ml-2" />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
