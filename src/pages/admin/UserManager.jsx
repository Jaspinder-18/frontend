const UserManager = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-display font-bold text-white">User <span className="text-primary">Management</span></h2>
            <div className="bg-dark-card border border-gray-800 rounded-xl p-8 text-center">
                <p className="text-gray-400">Manage Admins, Managers, and Customers.</p>
                <div className="mt-4 p-4 bg-dark-lighter inline-block rounded-lg">
                    <p className="text-primary font-bold">Feature Loading...</p>
                </div>
            </div>
        </div>
    );
};
export default UserManager;
