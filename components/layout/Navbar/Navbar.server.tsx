import { NavbarExample } from './Navbar.example'
import { getUserProfile } from '@/services/server/user.server'

export async function NavbarServer() {
  const userResponse = await getUserProfile()
  const user = userResponse?.data ?? null

  return <NavbarExample initialUser={user} />
}
