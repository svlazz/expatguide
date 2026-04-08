import { tieRenewal } from "@/config/modules/tie-renewal"
import DiagnosticForm from "./DiagnosticForm"

export default function TieRenewalPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <a href="/dashboard" className="text-sm text-gray-400 hover:text-gray-600">
            Back to dashboard
          </a>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">TIE Renewal</h1>
          <p className="text-gray-500 mt-1">
            Answer a few questions and we will build your personalised renewal plan.
          </p>
        </div>
        <DiagnosticForm module={tieRenewal} />
      </div>
    </div>
  )
}