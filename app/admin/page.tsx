'use client'
import { useAdmin } from "@/components/AdminProvider";

export default function AdminPage() {
  const isAdmin = useAdmin();
  return <div>{isAdmin ? "Admin" : "Not admin"}</div>;
}
