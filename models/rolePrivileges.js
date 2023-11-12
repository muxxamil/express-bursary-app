module.exports = function (sequelize, DataTypes) {

    const RolePrivilege = sequelize.define('RolePrivilege', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: DataTypes.STRING(100),
            field: 'key',
            allowNull: false,
        },
        roleId: {
            type: DataTypes.INTEGER(11),
            field: 'role_id',
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            field: 'description',
            allowNull: false,
        },
        privilegeScope: {
            type: DataTypes.ENUM,
            values: ['all', 'assigned'],
            field: 'privilege_scope',
            allowNull: false,
        },
    }, {
        paranoid: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        tableName: 'role_privileges'
    });

    RolePrivilege.sync()
    .then(() => console.log('RolePrivilege table created successfully'))
    .catch(err => console.log('BTW, did you enter wrong database credentials?'));

    return RolePrivilege;
}