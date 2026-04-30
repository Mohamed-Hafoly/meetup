import { Suspense } from "react"
import { useLoaderData, Await } from "react-router"
import ProfileForm from "../components/ProfileForm"
import ProfileFormSkeleton from "../components/ProfileFormSkeleton"
import type { User } from "../../types/user"

export default function Profile() {
  const { user } = useLoaderData<{ user: Promise<User> }>()

  return (
    <Suspense fallback={<ProfileFormSkeleton />}>
      <Await resolve={user}>
        {(user: User) => <ProfileForm user={user} />}
      </Await>
    </Suspense>
  )
}
