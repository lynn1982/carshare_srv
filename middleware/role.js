
var UserRole = {
    ur_unlogin: 0, 
    ur_user: 1,
    ur_changshang: 2, 
    ur_xiaoqu: 3, 
    ur_system: 4 
};

UserRole.getUserRole = function (role) {
    
    /* TODO: get user role from session info */
    var userRole;

    switch(role) {
        case 'super':
            userRole = UserRole.ur_system;
            break;
        case 'pps':
            userRole = UserRole.ur_changshang;
            break;
        case 'property':
            userRole = UserRole.ur_xiaoqu;
            break;
        case 'normal':
            userRole = UserRole.ur_user;
            break;
        default:
            userRole = UserRole.ur_unlogin;
    }

    return userRole;
};

module.exports = UserRole;

