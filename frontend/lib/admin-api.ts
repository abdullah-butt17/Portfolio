/**
 * Admin service layer. Every call here includes the auth cookie
 * (`withCredentials: true`) since these hit protected backend routes.
 * Used only by client components under app/admin.
 */

import { apiFetch } from '@/lib/http'
import { mapProfile, mapProject, mapSkill } from '@/lib/api'
import type {
  ApiResponse,
  Pagination,
  Profile,
  Project,
  ProjectFormInput,
  ProjectListParams,
  RawAdmin,
  RawProfile,
  RawProject,
  RawSkill,
  Skill,
} from '@/lib/types'

// ---------- Auth ----------

export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<RawAdmin>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      withCredentials: true,
    }).then((r) => r.data),

  logout: () =>
    apiFetch<Record<string, never>>('/auth/logout', { method: 'POST', withCredentials: true }),

  me: () => apiFetch<RawAdmin>('/auth/me', { withCredentials: true }).then((r) => r.data),
}

// ---------- Projects ----------

function buildQuery(params: Record<string, string | number | boolean | undefined>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const adminProjectApi = {
  list: async (params: ProjectListParams): Promise<{ projects: Project[]; pagination?: Pagination }> => {
    const res = await apiFetch<RawProject[]>(`/projects/admin${buildQuery(params)}`, {
      withCredentials: true,
    })
    return { projects: res.data.map(mapProject), pagination: res.pagination }
  },

  getById: async (id: string): Promise<Project> => {
    const res = await apiFetch<RawProject>(`/projects/admin/${id}`, { withCredentials: true })
    return mapProject(res.data)
  },

  create: async (payload: ProjectFormInput): Promise<Project> => {
    const res = await apiFetch<RawProject>('/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
      withCredentials: true,
    })
    return mapProject(res.data)
  },

  update: async (id: string, payload: Partial<ProjectFormInput>): Promise<Project> => {
    const res = await apiFetch<RawProject>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      withCredentials: true,
    })
    return mapProject(res.data)
  },

  remove: (id: string) =>
    apiFetch<Record<string, never>>(`/projects/${id}`, { method: 'DELETE', withCredentials: true }),

  setStatus: async (id: string, status: string): Promise<Project> => {
    const res = await apiFetch<RawProject>(`/projects/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
      withCredentials: true,
    })
    return mapProject(res.data)
  },

  setFeatured: async (id: string, featured: boolean): Promise<Project> => {
    const res = await apiFetch<RawProject>(`/projects/${id}/featured`, {
      method: 'PATCH',
      body: JSON.stringify({ featured }),
      withCredentials: true,
    })
    return mapProject(res.data)
  },

  setPublished: async (id: string, published: boolean): Promise<Project> => {
    const res = await apiFetch<RawProject>(`/projects/${id}/published`, {
      method: 'PATCH',
      body: JSON.stringify({ published }),
      withCredentials: true,
    })
    return mapProject(res.data)
  },

  setOrder: async (id: string, displayOrder: number): Promise<Project> => {
    const res = await apiFetch<RawProject>(`/projects/${id}/order`, {
      method: 'PATCH',
      body: JSON.stringify({ displayOrder }),
      withCredentials: true,
    })
    return mapProject(res.data)
  },

  uploadMedia: async (
    id: string,
    file: File,
    type: 'thumbnail' | 'screenshot' | 'video',
    onProgress?: (pct: number) => void,
  ): Promise<Project> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    // Use XHR instead of fetch for upload progress events.
    const raw = await new Promise<ApiResponse<RawProject>>((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
      xhr.open('POST', `${base}/projects/${id}/media`)
      xhr.withCredentials = true
      xhr.upload.onprogress = (e) => {
        if (onProgress && e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100))
      }
      xhr.onload = () => {
        try {
          const body = JSON.parse(xhr.responseText)
          if (xhr.status >= 200 && xhr.status < 300 && body.success) resolve(body)
          else reject(new Error(body.message || 'Upload failed'))
        } catch {
          reject(new Error('Upload failed'))
        }
      }
      xhr.onerror = () => reject(new Error('Unable to reach the server.'))
      xhr.send(formData)
    })

    return mapProject(raw.data)
  },

  deleteMedia: async (id: string, publicId: string): Promise<Project> => {
    const res = await apiFetch<RawProject>(`/projects/${id}/media/${encodeURIComponent(publicId)}`, {
      method: 'DELETE',
      withCredentials: true,
    })
    return mapProject(res.data)
  },
}

// ---------- Profile ----------

export const adminProfileApi = {
  update: async (payload: Partial<RawProfile>): Promise<Profile> => {
    const res = await apiFetch<RawProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
      withCredentials: true,
    })
    return mapProfile(res.data)
  },

  uploadImage: async (file: File): Promise<Profile> => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await apiFetch<RawProfile>('/profile/image', {
      method: 'POST',
      body: formData,
      withCredentials: true,
    })
    return mapProfile(res.data)
  },
}

// ---------- Skills ----------

export interface SkillFormInput {
  name: string
  category: string
  level: Skill['level']
  displayOrder: number
}

export const adminSkillApi = {
  create: async (payload: SkillFormInput): Promise<Skill> => {
    const res = await apiFetch<RawSkill>('/skills', {
      method: 'POST',
      body: JSON.stringify(payload),
      withCredentials: true,
    })

    return mapSkill(res.data)
  },

  update: async (
    id: string,
    payload: Partial<SkillFormInput>,
  ): Promise<Skill> => {
    const res = await apiFetch<RawSkill>(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
      withCredentials: true,
    })

    return mapSkill(res.data)
  },

  remove: (id: string) =>
    apiFetch<Record<string, never>>(`/skills/${id}`, {
      method: 'DELETE',
      withCredentials: true,
    }),

  uploadCertificate: async (
    id: string,
    file: File,
  ): Promise<Skill> => {
    const formData = new FormData()
    formData.append('file', file)

    const res = await apiFetch<RawSkill>(
      `/skills/${id}/certificate`,
      {
        method: 'POST',
        body: formData,
        withCredentials: true,
      },
    )

    return mapSkill(res.data)
  },

  deleteCertificate: async (
    id: string,
  ): Promise<Skill> => {
    const res = await apiFetch<RawSkill>(
      `/skills/${id}/certificate`,
      {
        method: 'DELETE',
        withCredentials: true,
      },
    )

    return mapSkill(res.data)
  },
}
