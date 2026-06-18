import { AxiosError } from 'axios'
import { apiClient } from './client'

export type UserProfile = {
  id: string
  name: string
  email: string
  phoneNumber: string
  secondaryPhoneNumber?: string | null
  role: string
}

export type OtpPurpose = 'secondary_phone' | 'password_reset'
export type OtpChannel = 'email' | 'phone' | 'sms'

export type OtpSendResult = {
  message: string
  success?: boolean
  data?: {
    channel?: string
    expiresInMinutes?: number
    fallback?: boolean
    previewUrl?: string
  }
}

type ProfileResponse = {
  message: string
  success?: boolean
  data: UserProfile
}

type MessageResponse = {
  message: string
  success?: boolean
}

export type UpdateProfilePayload = {
  name: string
}

export type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
}

export type AddSecondaryPhonePayload = {
  secondaryPhoneNumber: string
  otp: string
}

export type ResetPasswordWithOtpPayload = {
  otp: string
  newPassword: string
}

export function readApiError(error: unknown): string {
  const axiosError = error as AxiosError<{ message?: string }>
  const status = axiosError.response?.status

  if (status === 429) {
    return axiosError.response?.data?.message ?? 'حاول بعد 15 دقيقة'
  }

  if (axiosError.response?.data?.message) {
    return axiosError.response.data.message
  }

  if (axiosError.message) {
    return axiosError.message
  }

  return 'حدث خطأ غير متوقع.'
}

export function getOtpDeliveryMessage(
  result: OtpSendResult,
  requestedChannel: OtpChannel,
): string {
  if (result.data?.fallback) {
    return 'تم إرسال رمز التحقق إلى بريدك الإلكتروني.'
  }

  const delivered = result.data?.channel?.toLowerCase()
  const askedPhone = requestedChannel === 'phone' || requestedChannel === 'sms'

  if (delivered === 'email' || delivered === 'mail') {
    return result.message || 'تم إرسال رمز التحقق إلى بريدك الإلكتروني.'
  }

  if (delivered === 'phone' || delivered === 'sms' || delivered === 'mobile') {
    return result.message || 'تم إرسال رمز التحقق إلى رقم هاتفك.'
  }

  if (askedPhone) {
    return result.message || 'تم إرسال رمز التحقق إلى رقم هاتفك.'
  }

  return result.message || 'تم إرسال رمز التحقق.'
}

export async function getProfile(): Promise<UserProfile> {
  const response = await apiClient.get<ProfileResponse>('/user/profile')
  return response.data.data
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<UserProfile> {
  const response = await apiClient.patch<ProfileResponse>('/user/profile', payload)
  return response.data.data
}

export async function changePassword(payload: ChangePasswordPayload): Promise<string> {
  const response = await apiClient.patch<MessageResponse>(
    '/user/profile/password',
    payload,
  )
  return response.data.message
}

export async function sendProfileOtp(
  purpose: OtpPurpose,
  channel: OtpChannel,
): Promise<OtpSendResult> {
  const response = await apiClient.post<OtpSendResult>('/user/profile/otp/send', {
    purpose,
    channel,
  })
  return response.data
}

export async function addSecondaryPhone(
  payload: AddSecondaryPhonePayload,
): Promise<UserProfile> {
  const response = await apiClient.post<ProfileResponse>(
    '/user/profile/secondary-phone',
    {
      secondaryPhoneNumber: payload.secondaryPhoneNumber,
      otp: payload.otp,
    },
  )
  return response.data.data
}

export async function resetPasswordWithOtp(
  payload: ResetPasswordWithOtpPayload,
): Promise<string> {
  const response = await apiClient.patch<MessageResponse>(
    '/user/profile/password/reset',
    {
      otp: payload.otp,
      newPassword: payload.newPassword,
    },
  )
  return response.data.message
}
