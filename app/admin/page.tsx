'use client'
import { useAdmin } from "@/components/AdminProvider";

export default async function AdminPage() {
  const isAdmin = useAdmin();
  return <div>{isAdmin ? "Admin" : "Not admin"}</div>

}
