const UserList = ({ users, onlineUsers, selectedUser, onUserSelect, currentUser }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
          Users ({users.length})
        </h2>
        <div className="space-y-1">
          {users.map((user) => (
            <div
              key={user._id}
              onClick={() => onUserSelect(user)}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                selectedUser && selectedUser._id === user._id
                  ? 'bg-blue-50 border-l-4 border-blue-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    {onlineUsers.includes(user._id) && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {user.username}
                      {user._id === currentUser.id && ' (You)'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserList;