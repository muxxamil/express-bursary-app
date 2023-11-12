module.exports = function (sequelize, DataTypes) {

    const UserRole = sequelize.define('UserRole', {

        id: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.STRING(100),
            field: 'title',
            allowNull: false,
        },
    }, {
        paranoid: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        tableName: 'user_roles'
    });

    UserRole.associate = function (models) {

        UserRole.hasMany(models.RolePrivilege, {foreignKey: 'roleId'});

    };

    UserRole.sync()
    .then(() => console.log('UserRole table created successfully'))
    .catch(err => console.log('BTW, did you enter wrong database credentials?'));

    return UserRole;
}