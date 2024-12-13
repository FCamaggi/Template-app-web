import { NavLink } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', to: '/dashboard' },
  { name: 'Exercises', to: '/exercises' },
  { name: 'Routines', to: '/routines' },
  { name: 'Progress', to: '/progress' },
  { name: 'Profile', to: '/profile' },
];

export default function Sidebar() {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
      <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-14 flex-shrink-0 items-center px-4 border-b">
          <span className="text-lg font-semibold text-gray-900">
            GymRoutine
          </span>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto pt-4">
          <nav className="flex-1 space-y-1 px-3">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  `block px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
