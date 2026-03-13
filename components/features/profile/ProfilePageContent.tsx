'use client'

import { useState, FormEvent } from 'react'
import { ProfileSidebar, type ProfileSidebarTab } from './ProfileSidebar'
import { ProfileHeader } from './ProfileHeader'
import { PersonalInfoForm } from './PersonalInfoForm'
import { EducationalBackgroundForm } from './EducationalBackgroundForm'
import { ChangePasswordForm } from './ChangePasswordForm'
import { updateUserProfile } from '@/services/client/user.client'
import type { User, UpdateUserRequest, UserResponse } from '@/types/user.types'

interface ProfilePageContentProps {
  initialData: UserResponse
}

export function ProfilePageContent({ initialData }: ProfilePageContentProps) {
  const [activeTab, setActiveTab] = useState<ProfileSidebarTab>('profile')
  const [userData, setUserData] = useState<User>(initialData.data)
  const [originalData, setOriginalData] = useState<User>(initialData.data)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  // Check if data has changed
  const hasChanges = (): boolean => {
    return (
      userData.fullname !== originalData.fullname ||
      userData.email !== originalData.email ||
      userData.contact !== originalData.contact ||
      userData.address !== originalData.address ||
      userData.dob !== originalData.dob ||
      userData.interested !== originalData.interested ||
      userData.latestQualification !== originalData.latestQualification
    )
  }

  const handleDataChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!hasChanges()) {
      console.log('ℹ️ No changes to save')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      // Send ALL required fields
      const updateData: UpdateUserRequest = {
        fullname: userData.fullname,
        email: userData.email,
        contact: userData.contact,
        address: userData.address,
        dob: userData.dob,
        interested: userData.interested,
        latestQualification: userData.latestQualification,
      }

      console.log('📤 Updating profile with:', updateData)

      const response = await updateUserProfile(updateData)
      setUserData(response.data)
      setOriginalData(response.data) // Update original data after successful save
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)

      console.log('✅ Profile updated successfully:', response.data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile'
      setError(errorMessage)
      console.error('❌ Failed to update profile:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    // Restore original data
    setUserData(originalData)
    console.log('↩️ Changes discarded')
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          {/* Sidebar */}
          <ProfileSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Main Content */}
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            {/* Profile Header */}
            <ProfileHeader userData={userData} />

            {/* Error Message */}
            {error && (
              <div className="bg-error/10 border border-error text-error p-4 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit}>
                <PersonalInfoForm userData={userData} onDataChange={handleDataChange} />
                <EducationalBackgroundForm userData={userData} onDataChange={handleDataChange} />

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pb-8">
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isSaving || !hasChanges()}
                    className="bg-white py-2.5 px-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving || !hasChanges()}
                    className="bg-brand-gold border border-transparent rounded-lg shadow-sm py-2.5 px-8 inline-flex justify-center text-sm font-bold text-brand-navy hover:bg-[#FFB300] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {/* Password & Security Tab */}
            {activeTab === 'security' && (
              <ChangePasswordForm />
            )}
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div
          className="fixed top-20 right-5 z-50 transform transition-all duration-300"
          role="alert"
        >
          <div className="flex items-center w-full max-w-xs p-4 text-gray-700 bg-white rounded-lg shadow-lg border-l-4 border-success">
            <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-success bg-success/10 rounded-lg">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <div className="ml-3 text-sm font-medium">Profile updated successfully.</div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 items-center justify-center"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-5">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
