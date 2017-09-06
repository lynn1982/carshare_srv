
var UserRole = {
    ur_unlogin: "none",
    ur_user: "user",
    ur_xiaoqu: "xiaoqu",
    ur_changshang: "changshang",
    ur_system: "system"
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

