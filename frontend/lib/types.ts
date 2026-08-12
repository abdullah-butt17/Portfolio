/**
 * Shared domain types.
 *
 * `Raw*` types mirror the backend's actual REST response shapes exactly
 * (see the backend's Mongoose models).
 *
 * The plain (non-`Raw`) types are the UI-facing shapes the components
 * consume — `lib/api.ts` maps Raw -> UI so components don't need to know
 * about backend field names.
 */

// ---------- Shared / Media ----------

export interface Media {
  url: string
  publicId: string
  resourceType: 'image' | 'video'
}

// ---------- Projects ----------

export type RawProjectCategory =
  | 'Full Stack'
  | 'AI / ML'
  | 'University'
  | 'Personal'
  | 'Other'

export type RawProjectStatus =
  | 'completed'
  | 'in-progress'
  | 'archived'

export interface RawProject {
  _id: string
  title: string
  slug: string
  shortDescription: string
  fullDescription?: string
  category: RawProjectCategory
  technologies: string[]
  features: string[]
  thumbnail: Media | null
  screenshots: Media[]
  video: Media | null
  githubUrl?: string
  liveUrl?: string
  status: RawProjectStatus
  featured: boolean
  published: boolean
  displayOrder: number
  startDate?: string
  completionDate?: string
  createdAt: string
  updatedAt: string
}

// ---------- Skills ----------

export type SkillLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert'

/**
 * Certificate attached to a skill.
 *
 * Certificates are OPTIONAL.
 * A skill can exist without a certificate.
 */
export interface SkillCertificate {
  url: string
  publicId: string
  name: string
}

export interface RawSkill {
  _id: string
  name: string
  category: string
  level: SkillLevel
  icon?: string
  displayOrder: number
  certificate?: SkillCertificate
}

// ---------- Profile ----------

export interface RawProfile {
  _id: string
  name: string
  headline: string
  bio?: string

  profileImage?: {
    url: string
    publicId: string
  }

  location?: string
  email?: string
  phone?: string
  githubUrl?: string
  linkedinUrl?: string
  resumeUrl?: string
}

// ---------- Admin ----------

export interface RawAdmin {
  id: string
  name: string
  email: string
  role: 'admin'
}

// ---------- API ----------

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  pagination?: Pagination
  errors?: {
    field: string
    message: string
  }[]
}

// ============================================================
// UI-FACING TYPES
// ============================================================

// ---------- Projects ----------

export type ProjectCategory = RawProjectCategory

export type ProjectStatus = RawProjectStatus

export interface ProjectLink {
  label: string
  href: string
  type: 'demo' | 'github'
}

export interface Project {
  id: string
  slug: string
  title: string
  description: string
  fullDescription?: string
  category: ProjectCategory
  status: ProjectStatus
  featured: boolean
  published: boolean
  displayOrder: number

  image: string | null
  thumbnail: Media | null
  gallery: Media[]
  video: Media | null

  technologies: string[]
  features: string[]

  links: ProjectLink[]

  startDate?: string
  completionDate?: string
}

// ---------- Profile ----------

export interface SocialLink {
  label: string
  href: string
  icon: 'github' | 'linkedin' | 'mail'
}

export interface Profile {
  name: string
  title: string
  shortBio: string
  location: string
  availability: string
  email: string
  phone: string
  resumeUrl: string
  profileImageUrl?: string
  socials: SocialLink[]
}

// ---------- Skills ----------

export interface Skill {
  id: string
  name: string
  category: string
  level: SkillLevel
  displayOrder: number

  /**
   * Optional certificate.
   *
   * If undefined, the client simply won't show
   * the "View Certificate" button.
   */
  certificate?: SkillCertificate
}

// ---------- Contact ----------

export interface ContactPayload {
  name: string
  email: string
  subject?: string
  message: string
}

// ---------- Admin ----------

export interface Admin {
  id: string
  name: string
  email: string
}

// ---------- Project List ----------

export interface ProjectListParams {
  search?: string
  category?: string
  status?: string
  featured?: boolean
  published?: boolean
  page?: number
  limit?: number

  [key: string]: string | number | boolean | undefined
}

// ---------- Project Form ----------

export interface ProjectFormInput {
  title: string
  shortDescription: string
  fullDescription?: string
  category: ProjectCategory
  technologies: string[]
  features: string[]
  githubUrl?: string
  liveUrl?: string
  status: ProjectStatus
  featured: boolean
  published: boolean
  displayOrder: number
  startDate?: string
  completionDate?: string
}