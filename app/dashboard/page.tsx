import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { differenceInDays } from "date-fns"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: situations } = await supabase
    .from("user_situations")
    .select("*, situation_steps (*)")
    .eq("user_id", user.id)
    .eq("status", "active")

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your residency dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
        </div>

        {(!situations || situations.length === 0) && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500 mb-4">
              You have no active processes. Start by telling us about your situation.
            </p>
            <a href="/spain/tie-renewal" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
              Start TIE Renewal
            </a>
          </div>
        )}

        {situations && situations.length > 0 && (
          <div className="space-y-4">
            {situations.map((situation) => {
              const expiryDate = situation.key_dates?.expiry_date
              const daysLeft = expiryDate ? differenceInDays(new Date(expiryDate), new Date()) : null
              const isUrgent = daysLeft !== null && daysLeft <= 30
              const isWarning = daysLeft !== null && daysLeft > 30 && daysLeft <= 60
              const completedSteps = situation.situation_steps?.filter((s: { completed: boolean }) => s.completed).length ?? 0
              const totalSteps = situation.situation_steps?.length ?? 0

              return (
                <div key={situation.id} className={`bg-white rounded-lg border-l-4 p-6 shadow-sm ${isUrgent ? "border-red-500" : isWarning ? "border-yellow-500" : "border-green-500"}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{isUrgent ? "🔴" : isWarning ? "🟡" : "✓"}</span>
                        <h2 className="font-semibold text-gray-900 capitalize">{situation.module.replace("-", " ")}</h2>
                      </div>
                      {daysLeft !== null && (
                        <p className={`text-sm mt-1 font-medium ${isUrgent ? "text-red-600" : isWarning ? "text-yellow-600" : "text-green-600"}`}>
                          {daysLeft <= 0 ? `Expired ${Math.abs(daysLeft)} days ago` : `Expires in ${daysLeft} days`}
                        </p>
                      )}
                      {isUrgent && (
                        <p className="text-xs text-red-500 mt-1">If you do not renew you may lose legal residency</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{completedSteps}/{totalSteps} steps</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a href={`/spain/${situation.module}`} className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      {completedSteps === 0 ? "Start now" : "Continue"}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}