const USERS_DATA = [
  { name: 'أحمد علي', email: 'ahmed@nextventure.os', role: 'User', status: 'نشط', projects: 3 },
  { name: 'سارة محمد', email: 'sara@nextventure.os', role: 'User', status: 'نشط', projects: 2 },
  { name: 'محمود حسن', email: 'mahmoud@nextventure.os', role: 'Specialist', status: 'معلّق', projects: 5 },
]

export default function AdminUsersSection() {
  return (
    <section className="rounded-2xl border border-divider bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-sm font-bold text-nile">كل المستخدمين وتفاصيلهم</h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-right text-sm">
          <thead>
            <tr className="border-b border-divider text-slateMuted">
              <th className="px-2 py-2">الاسم</th>
              <th className="px-2 py-2">البريد الإلكتروني</th>
              <th className="px-2 py-2">الدور</th>
              <th className="px-2 py-2">الحالة</th>
              <th className="px-2 py-2">عدد المشاريع</th>
            </tr>
          </thead>
          <tbody>
            {USERS_DATA.map((user) => (
              <tr key={user.email} className="border-b border-divider/70">
                <td className="px-2 py-3 font-semibold text-body">{user.name}</td>
                <td className="px-2 py-3 text-body/80">{user.email}</td>
                <td className="px-2 py-3 text-nile">{user.role}</td>
                <td className="px-2 py-3">{user.status}</td>
                <td className="px-2 py-3">{user.projects}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
