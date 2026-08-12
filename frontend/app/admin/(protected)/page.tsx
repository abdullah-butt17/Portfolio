'use client'

import { useEffect, useState } from 'react'
import { FolderKanban, Star, CheckCircle2, Clock, Sparkles } from 'lucide-react'
import { Skeleton } from '@/components/admin/states'
import { adminProjectApi } from '@/lib/admin-api'
import { getSkills } from '@/lib/api'
import type { Project, Skill } from '@/lib/types'

function StatCard({
  label,
  value,
  icon: Icon,
  isLoading,
}: {
  label: string
  value: number
  icon: typeof FolderKanban
  isLoading: boolean
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon className="size-4 text-primary" />
      </div>
      {isLoading ? <Skeleton className="h-8 w-12" /> : <p className="text-3xl font-semibold">{value}</p>}
    </div>
  )
}

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    Promise.all([adminProjectApi.list({ limit: 100 }), getSkills()])
      .then(([projectRes, skillList]) => {
        setProjects(projectRes.projects)
        setSkills(skillList)
      })
      .finally(() => setIsLoading(false))
  }, [])

  const total = projects.length
  const featured = projects.filter((p) => p.featured).length
  const published = projects.filter((p) => p.published).length
  const inProgress = projects.filter((p) => p.status === 'in-progress').length

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-1 text-sm text-muted-foreground">Overview of your portfolio content.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Total Projects" value={total} icon={FolderKanban} isLoading={isLoading} />
        <StatCard label="Featured" value={featured} icon={Star} isLoading={isLoading} />
        <StatCard label="Published" value={published} icon={CheckCircle2} isLoading={isLoading} />
        <StatCard label="In Progress" value={inProgress} icon={Clock} isLoading={isLoading} />
        <StatCard label="Skills" value={skills.length} icon={Sparkles} isLoading={isLoading} />
      </div>
    </div>
  )
}
