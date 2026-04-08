"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ModuleConfig } from "@/config/types"
import { createClient } from "@/lib/supabase/client"

export default function DiagnosticForm({ module }: { module: ModuleConfig }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const questions = module.questions
  const currentQuestion = questions[currentStep]
  const isLastQuestion = currentStep === questions.length - 1
  const progress = ((currentStep) / questions.length) * 100

  function handleAnswer(value: string | boolean) {
    setAnswers(prev => ({ ...prev, [currentQuestion.key]: value }))
  }

  function handleNext() {
    if (answers[currentQuestion.key] === undefined && currentQuestion.required) {
      setError("Please answer this question before continuing")
      return
    }
    setError("")
    if (isLastQuestion) {
      handleSubmit()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  async function handleSubmit() {
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push("/login")
      return
    }

    const expiryDate = answers["tie_expiry_date"] as string
    const keyDates = expiryDate ? { expiry_date: expiryDate } : {}

    const { data: situation, error: situationError } = await supabase
      .from("user_situations")
      .insert({
        user_id: user.id,
        country: module.country,
        module: module.id,
        answers,
        key_dates: keyDates,
        status: "active"
      })
      .select()
      .single()

    if (situationError) {
      setError("Something went wrong. Please try again.")
      setLoading(false)
      return
    }

    const steps = module.steps.map((step, index) => ({
      situation_id: situation.id,
      step_key: step.key,
      title: step.title,
      description: step.description,
      completed: false,
      order_index: index
    }))

    await supabase.from("situation_steps").insert(steps)

    router.push("/dashboard")
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-8">
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Question {currentStep + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        {currentQuestion.question}
      </h2>

      <div className="space-y-3">
        {currentQuestion.type === "date" && (
          <input
            type="date"
            value={answers[currentQuestion.key] as string || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {currentQuestion.type === "text" && (
          <input
            type="text"
            value={answers[currentQuestion.key] as string || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        {currentQuestion.type === "select" && currentQuestion.options && (
          <div className="space-y-2">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  answers[currentQuestion.key] === option
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {currentQuestion.type === "boolean" && (
          <div className="flex gap-3">
            <button
              onClick={() => handleAnswer(true)}
              className={`flex-1 py-3 rounded-lg border font-medium transition-colors ${
                answers[currentQuestion.key] === true
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => handleAnswer(false)}
              className={`flex-1 py-3 rounded-lg border font-medium transition-colors ${
                answers[currentQuestion.key] === false
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              No
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-4">{error}</p>
      )}

      <div className="flex justify-between mt-8">
        {currentStep > 0 && (
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            Back
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={loading}
          className="ml-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Saving..." : isLastQuestion ? "Build my plan" : "Next"}
        </button>
      </div>
    </div>
  )
}