/**
 * Public service layer.
 *
 * The public UI (home, about, skills, projects, contact) imports data ONLY
 * through these functions. Each fetches the real backend and maps the raw
 * REST shape into the UI-facing types in `lib/types.ts`.
 *
 * Admin reads/writes live in `lib/admin-api.ts` since they require the
 * authenticated session cookie and run client-side.
 */

import { apiFetch } from '@/lib/http'
import type {
  ApiResponse,
  ContactPayload,
  Pagination,
  Profile,
  Project,
  ProjectListParams,
  RawProfile,
  RawProject,
  Skill,
  RawSkill,
} from '@/lib/types'

// ---------- mappers ----------

export function mapProject(raw: RawProject): Project {
  const links: Project['links'] = []
  if (raw.liveUrl) links.push({ label: 'Live Demo', href: raw.liveUrl, type: 'demo' })
  if (raw.githubUrl) links.push({ label: 'GitHub', href: raw.githubUrl, type: 'github' })

  return {
    id: raw._id,
    slug: raw.slug,
    title: raw.title,
    description: raw.shortDescription,
    fullDescription: raw.fullDescription,
    category: raw.category,
    status: raw.status,
    featured: raw.featured,
    published: raw.published,
    displayOrder: raw.displayOrder,
    image: raw.thumbnail?.url ?? null,
    thumbnail: raw.thumbnail ?? null,
    gallery: raw.screenshots ?? [],
    video: raw.video ?? null,
    technologies: raw.technologies ?? [],
    features: raw.features ?? [],
    links,
    startDate: raw.startDate,
    completionDate: raw.completionDate,
  }
}

export function mapProfile(raw: RawProfile): Profile {
  const socials: Profile['socials'] = []
  if (raw.githubUrl) socials.push({ label: 'GitHub', href: raw.githubUrl, icon: 'github' })
  if (raw.linkedinUrl) socials.push({ label: 'LinkedIn', href: raw.linkedinUrl, icon: 'linkedin' })
  if (raw.email) socials.push({ label: 'Email', href: `mailto:${raw.email}`, icon: 'mail' })

  return {
    name: raw.name,
    title: raw.headline,
    shortBio: raw.bio || '',
    location: raw.location || '',
    availability: 'Available for freelance & full-time roles',
    email: raw.email || '',
    phone: raw.phone || '',
    resumeUrl: raw.resumeUrl || '',
    profileImageUrl: raw.profileImage?.url,
    socials,
  }
}

export function mapSkill(raw: RawSkill): Skill {
  return {
    id: raw._id,
    name: raw.name,
    category: raw.category,
    level: raw.level,
    displayOrder: raw.displayOrder,
    certificate: raw.certificate,
  }
}

// ---------- public reads ----------

export async function getProfile(): Promise<Profile> {
  const res = await apiFetch<RawProfile>('/profile', { cache: 'no-store' })
  return mapProfile(res.data)
}

export async function getProjects(
  params: ProjectListParams = {},
): Promise<{ projects: Project[]; pagination?: Pagination }> {
  const qs = buildQuery(params)
  const res = await apiFetch<RawProject[]>(`/projects${qs}`, { cache: 'no-store' })
  return { projects: res.data.map(mapProject), pagination: res.pagination }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const res = await apiFetch<RawProject[]>('/projects/featured', { cache: 'no-store' })
  return res.data.map(mapProject)
}

export async function getProject(slug: string): Promise<Project | undefined> {
  try {
    const res = await apiFetch<RawProject>(`/projects/${slug}`, { cache: 'no-store' })
    return mapProject(res.data)
  } catch {
    return undefined
  }
}

export async function getSkills(): Promise<Skill[]> {
  const res = await apiFetch<RawSkill[]>('/skills', { cache: 'no-store' })
  return res.data.map(mapSkill).sort((a, b) => a.displayOrder - b.displayOrder)
}

/** Groups skills by their (freeform, admin-managed) category, in displayOrder. */
export async function getSkillsGrouped(): Promise<Record<string, Skill[]>> {
  const skills = await getSkills()
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = skill.category || 'Other'
    acc[key] = acc[key] ? [...acc[key], skill] : [skill]
    return acc
  }, {})
}

export async function submitContact(
  payload: ContactPayload,
): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await apiFetch<Record<string, never>>('/contact', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    return { ok: true, message: res.message }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Something went wrong. Please try again.'
    return { ok: false, message }
  }
}

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export type { ApiResponse }
